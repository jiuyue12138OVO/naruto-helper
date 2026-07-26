import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '@/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { Clock, Search, X } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import BanPhase from './BanPhase'
import PickPhase from './PickPhase'
import ScrollsPhase from './ScrollsPhase'
import SummonsPhase from './SummonsPhase'
import DonePhase from './DonePhase'
import type { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const COUNTDOWN_SECONDS = 60
const MAX_PUBLIC_BAN = 2

type Phase = 'waiting' | 'ban' | 'pick' | 'scrolls' | 'summons' | 'done'

interface RoomState {
  phase: Phase
  gameNumber: number
  firstPlayer: '1P' | '2P'
  banStep: number
  pickStep: number
  ban1P: (string | null)[]
  ban2P: (string | null)[]
  team1P: (string | null)[]
  team2P: (string | null)[]
  usedNinjas: string[]
  scrolls1P: (string | null)[]
  scrolls2P: (string | null)[]
  scrollsConfirmed1P: boolean
  scrollsConfirmed2P: boolean
  summons1P: (string | null)[]
  summons2P: (string | null)[]
  summonsConfirmed1P: boolean
  summonsConfirmed2P: boolean
  myScrollHistory?: string[]         // 1P 位置的历史池
  opponentScrollHistory?: string[]   // 2P 位置的历史池
  mySummonHistory?: string[]
  opponentSummonHistory?: string[]
  player1PId: string | null
  player2PId: string | null
  deadline: number | null
  currentPlayer: '1P' | '2P' | null
  publicBan: string[]
  nextGameConfirmed1P: boolean
  nextGameConfirmed2P: boolean
}

const BAN_STEPS = [
  { player: '1P', index: 1 },
  { player: '2P', index: 0 },
  { player: '2P', index: 1 },
  { player: '1P', index: 0 },
] as const

const PICK_STEPS = [
  { player: '1P', index: 0 },
  { player: '2P', index: 0 },
  { player: '2P', index: 1 },
  { player: '1P', index: 1 },
  { player: '1P', index: 2 },
  { player: '2P', index: 2 },
] as const

const emptyRoomState = (player1PId: string): RoomState => ({
  phase: 'waiting',
  gameNumber: 1,
  firstPlayer: '1P',
  banStep: 0,
  pickStep: 0,
  ban1P: [null, null],
  ban2P: [null, null],
  team1P: [null, null, null],
  team2P: [null, null, null],
  usedNinjas: [],
  scrolls1P: [null, null, null],
  scrolls2P: [null, null, null],
  scrollsConfirmed1P: false,
  scrollsConfirmed2P: false,
  summons1P: [null, null, null],
  summons2P: [null, null, null],
  summonsConfirmed1P: false,
  summonsConfirmed2P: false,
  player1PId,
  player2PId: null,
  deadline: null,
  currentPlayer: null,
  publicBan: [],
  nextGameConfirmed1P: false,
  nextGameConfirmed2P: false,
})

export default function BPRoomPage() {
  const { ninjas, scrolls, summons } = useData()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null)
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS)
  const [pendingSelection, setPendingSelection] = useState<string | null>(null)
  const [publicBanSearch, setPublicBanSearch] = useState('')
  const [transitioning, setTransitioning] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const myRole = useMemo(() => {
    if (!roomState || !myPlayerId) return null
    if (roomState.player1PId === myPlayerId) return '1P'
    if (roomState.player2PId === myPlayerId) return '2P'
    return null
  }, [roomState, myPlayerId])

  useEffect(() => {
    if (roomId && myPlayerId) {
      localStorage.setItem('bp_room_id', roomId)
      localStorage.setItem('bp_player_id', myPlayerId)
    }
  }, [roomId, myPlayerId])

  useEffect(() => {
    const savedRoomId = localStorage.getItem('bp_room_id')
    const savedPlayerId = localStorage.getItem('bp_player_id')
    if (savedRoomId && savedPlayerId && !roomId) {
      const reconnect = async () => {
        const { data } = await supabase.from('rooms').select('state').eq('id', savedRoomId).single()
        if (data) {
          const state = data.state as RoomState
          const is1P = state.player1PId === savedPlayerId
          const is2P = state.player2PId === savedPlayerId
          if (is1P || is2P) {
            setRoomId(savedRoomId)
            setMyPlayerId(savedPlayerId)
            setRoomState(state)
          } else if (!state.player1PId || !state.player2PId) {
            const roleToTake = !state.player1PId ? '1P' : '2P'
            const newState = { ...state, [roleToTake === '1P' ? 'player1PId' : 'player2PId']: savedPlayerId }
            await supabase.from('rooms').upsert({ id: savedRoomId, state: newState })
            setRoomId(savedRoomId)
            setMyPlayerId(savedPlayerId)
            setRoomState(newState)
          } else {
            localStorage.removeItem('bp_room_id')
            localStorage.removeItem('bp_player_id')
          }
        } else {
          localStorage.removeItem('bp_room_id')
          localStorage.removeItem('bp_player_id')
        }
      }
      reconnect()
    }
  }, [])

  useEffect(() => {
    if (!roomId) return
    const channel = supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.new) {
            const newState = (payload.new as any).state as RoomState
            setRoomState(newState)
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  useEffect(() => {
    if (!roomId || roomState) return
    const load = async () => {
      const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
      if (data) setRoomState(data.state as RoomState)
    }
    load()
  }, [roomId])

  const updateRoom = useCallback(async (updates: Partial<RoomState>) => {
    if (!roomId) return
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (!data) return
    const latestState = data.state as RoomState
    const newState: RoomState = { ...latestState, ...updates }
    await supabase.from('rooms').upsert({ id: roomId, state: newState })
    setRoomState(newState)
  }, [roomId])

  const fetchLatestState = useCallback(async () => {
    if (!roomId) return
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) setRoomState(data.state as RoomState)
  }, [roomId])

  const leaveRoom = useCallback(async () => {
    if (!roomId || !myRole || !roomState) return
    const updates: Partial<RoomState> = myRole === '1P' ? { player1PId: null } : { player2PId: null }
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) {
      const latestState = data.state as RoomState
      const newState = { ...latestState, ...updates }
      await supabase.from('rooms').upsert({ id: roomId, state: newState })
      if (!newState.player1PId && !newState.player2PId) {
        await supabase.from('rooms').delete().eq('id', roomId)
      }
    }
    setRoomId(null)
    setRoomState(null)
    setMyPlayerId(null)
    localStorage.removeItem('bp_room_id')
    localStorage.removeItem('bp_player_id')
  }, [roomId, myRole, roomState])

  const generatePlayerId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6)

  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    const playerId = generatePlayerId()
    const init = emptyRoomState(playerId)
    setRoomId(id); setMyPlayerId(playerId); setRoomState(init)
    supabase.from('rooms').upsert({ id, state: init }).then()
  }

  const joinRoom = async () => {
    const id = joinRoomId.trim().toUpperCase()
    if (!id) return
    const { data } = await supabase.from('rooms').select('state').eq('id', id).single()
    if (!data) { setError('房间不存在'); return }
    const state = data.state as RoomState
    const roleToTake1 = state.player1PId ? null : '1P'
    const roleToTake2 = state.player2PId ? null : '2P'
    const availableRole = roleToTake1 || roleToTake2
    if (!availableRole) { setError('房间已满'); return }

    const newPlayerId = generatePlayerId()
    const newState = { ...state, [availableRole === '1P' ? 'player1PId' : 'player2PId']: newPlayerId }
    setRoomId(id); setMyPlayerId(newPlayerId); setRoomState(newState)
    await supabase.from('rooms').upsert({ id, state: newState })
    setError('')
  }

  const startGame = async () => {
    if (!roomState || myRole !== '1P') return
    if (!roomState.player1PId || !roomState.player2PId) return
    await updateRoom({
      phase: 'ban',
      banStep: 0,
      deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
      currentPlayer: BAN_STEPS[0].player,
    })
  }

  const togglePublicBan = async (ninjaId: string) => {
    if (!roomState || myRole !== '1P' || roomState.phase !== 'waiting') return
    const current = roomState.publicBan || []
    if (current.includes(ninjaId)) {
      await updateRoom({ publicBan: current.filter(id => id !== ninjaId) })
    } else if (current.length < MAX_PUBLIC_BAN) {
      await updateRoom({ publicBan: [...current, ninjaId] })
    }
  }

  const isMyTurn = useMemo(() => {
    if (!roomState || !myRole) return false
    if (roomState.phase === 'waiting') return false
    if (roomState.phase === 'ban' || roomState.phase === 'pick') return roomState.currentPlayer === myRole
    if (roomState.phase === 'scrolls') return !(myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P)
    if (roomState.phase === 'summons') return !(myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P)
    return false
  }, [roomState, myRole])

  const availableNinjas = useMemo(() => {
    if (!roomState) return []
    const publicBanSet = new Set(roomState.publicBan || [])
    const banned = new Set([...roomState.ban1P.filter(Boolean), ...roomState.ban2P.filter(Boolean)])
    return ninjas.filter(n => !roomState.usedNinjas.includes(n.id) && !banned.has(n.id) && !publicBanSet.has(n.id))
  }, [roomState, ninjas])

  const handleTimeout = useCallback(() => {
    if (!roomState || !roomId) return
    const { phase } = roomState
    if (phase === 'ban' || phase === 'pick') {
      const currentPlayer = roomState.currentPlayer
      if (!currentPlayer) return
      const playerId = currentPlayer === '1P' ? roomState.player1PId : roomState.player2PId
      if (!playerId) {
        const pool = availableNinjas
        if (pool.length === 0) return
        const randomNinja = pool[Math.floor(Math.random() * pool.length)]
        if (phase === 'ban') {
          const step = BAN_STEPS[roomState.banStep]
          const newBan = step.player === '1P' ? [...roomState.ban1P] : [...roomState.ban2P]
          newBan[step.index] = randomNinja.id
          const nextStep = roomState.banStep + 1
          updateRoom({
            [step.player === '1P' ? 'ban1P' : 'ban2P']: newBan,
            banStep: nextStep,
            deadline: nextStep < 4 ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
            currentPlayer: nextStep < 4 ? BAN_STEPS[nextStep].player : null,
          })
        } else {
          const step = PICK_STEPS[roomState.pickStep]
          const newTeam = step.player === '1P' ? [...roomState.team1P] : [...roomState.team2P]
          newTeam[step.index] = randomNinja.id
          const nextStep = roomState.pickStep + 1
          updateRoom({
            [step.player === '1P' ? 'team1P' : 'team2P']: newTeam,
            usedNinjas: [...roomState.usedNinjas, randomNinja.id],
            pickStep: nextStep,
            deadline: nextStep < 6 ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
            currentPlayer: nextStep < 6 ? PICK_STEPS[nextStep].player : null,
          })
        }
        return
      }
      if (isMyTurn) {
        const pool = availableNinjas
        if (pool.length === 0) return
        confirmSelection(pool[Math.floor(Math.random() * pool.length)].id)
      }
      return
    }

    if (phase === 'scrolls') {
      const iAm1P = myRole === '1P'
      const myConfirmed = iAm1P ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P
      if (!myConfirmed) {
        const current = iAm1P ? [...roomState.scrolls1P] : [...roomState.scrolls2P]
        const history = iAm1P ? new Set(roomState.myScrollHistory) : new Set(roomState.opponentScrollHistory)
        const pool = scrolls.filter(s => !history.has(s.id) && !current.includes(s.id))
        const newScrolls = current.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(iAm1P ? { scrolls1P: newScrolls, scrollsConfirmed1P: true } : { scrolls2P: newScrolls, scrollsConfirmed2P: true })
      }
      const opponentRole = iAm1P ? '2P' : '1P'
      const opponentId = opponentRole === '1P' ? roomState.player1PId : roomState.player2PId
      const opponentConfirmed = opponentRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P
      if (!opponentId && !opponentConfirmed) {
        const oppScrolls = opponentRole === '1P' ? [...roomState.scrolls1P] : [...roomState.scrolls2P]
        const oppHistory = opponentRole === '1P' ? new Set(roomState.myScrollHistory) : new Set(roomState.opponentScrollHistory)
        const pool = scrolls.filter(s => !oppHistory.has(s.id) && !oppScrolls.includes(s.id))
        const newScrolls = oppScrolls.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(opponentRole === '1P' ? { scrolls1P: newScrolls, scrollsConfirmed1P: true } : { scrolls2P: newScrolls, scrollsConfirmed2P: true })
      }
      return
    }

    if (phase === 'summons') {
      const iAm1P = myRole === '1P'
      const myConfirmed = iAm1P ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P
      if (!myConfirmed) {
        const current = iAm1P ? [...roomState.summons1P] : [...roomState.summons2P]
        const history = iAm1P ? new Set(roomState.mySummonHistory) : new Set(roomState.opponentSummonHistory)
        const pool = summons.filter(s => !history.has(s.id) && !current.includes(s.id))
        const newSummons = current.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(iAm1P ? { summons1P: newSummons, summonsConfirmed1P: true } : { summons2P: newSummons, summonsConfirmed2P: true })
      }
      const opponentRole = iAm1P ? '2P' : '1P'
      const opponentId = opponentRole === '1P' ? roomState.player1PId : roomState.player2PId
      const opponentConfirmed = opponentRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P
      if (!opponentId && !opponentConfirmed) {
        const oppSummons = opponentRole === '1P' ? [...roomState.summons1P] : [...roomState.summons2P]
        const oppHistory = opponentRole === '1P' ? new Set(roomState.mySummonHistory) : new Set(roomState.opponentSummonHistory)
        const pool = summons.filter(s => !oppHistory.has(s.id) && !oppSummons.includes(s.id))
        const newSummons = oppSummons.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(opponentRole === '1P' ? { summons1P: newSummons, summonsConfirmed1P: true } : { summons2P: newSummons, summonsConfirmed2P: true })
      }
      return
    }
  }, [roomState, myRole, isMyTurn, availableNinjas, scrolls, summons, updateRoom])

  useEffect(() => {
    const handleVisibility = () => {
      if (!roomState?.deadline || document.hidden) return
      const diff = Math.max(0, Math.floor((roomState.deadline - Date.now()) / 1000))
      setRemainingSeconds(diff)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [roomState?.deadline])

  useEffect(() => {
    if (!roomState?.deadline) { setRemainingSeconds(COUNTDOWN_SECONDS); return }
    const tick = () => {
      const diff = Math.max(0, Math.floor((roomState.deadline! - Date.now()) / 1000))
      setRemainingSeconds(diff)
      if (diff <= 0) { clearInterval(timerRef.current!); handleTimeout() }
    }
    tick()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [roomState?.deadline, handleTimeout])

  const confirmSelection = (ninjaId: string) => {
    if (!roomState || !myRole || !isMyTurn) return
    const { phase, banStep, pickStep } = roomState
    if (phase === 'ban') {
      const step = BAN_STEPS[banStep]
      const newBan = step.player === '1P' ? [...roomState.ban1P] : [...roomState.ban2P]
      newBan[step.index] = ninjaId
      const nextStep = banStep + 1
      updateRoom({
        [step.player === '1P' ? 'ban1P' : 'ban2P']: newBan,
        banStep: nextStep,
        deadline: nextStep < 4 ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
        currentPlayer: nextStep < 4 ? BAN_STEPS[nextStep].player : null,
      })
    } else if (phase === 'pick') {
      const step = PICK_STEPS[pickStep]
      const newTeam = step.player === '1P' ? [...roomState.team1P] : [...roomState.team2P]
      newTeam[step.index] = ninjaId
      const nextStep = pickStep + 1
      updateRoom({
        [step.player === '1P' ? 'team1P' : 'team2P']: newTeam,
        usedNinjas: [...roomState.usedNinjas, ninjaId],
        pickStep: nextStep,
        deadline: nextStep < 6 ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
        currentPlayer: nextStep < 6 ? PICK_STEPS[nextStep].player : null,
      })
    }
    setPendingSelection(null)
  }

  const selectScrollSlot = (index: number, scrollId: string | null) => {
    if (!myRole || !roomState) return
    const newScrolls = [...(myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P)]
    newScrolls[index] = scrollId
    updateRoom(myRole === '1P' ? { scrolls1P: newScrolls } : { scrolls2P: newScrolls })
  }

  const selectSummonSlot = (index: number, summonId: string | null) => {
    if (!myRole || !roomState) return
    const newSummons = [...(myRole === '1P' ? roomState.summons1P : roomState.summons2P)]
    newSummons[index] = summonId
    updateRoom(myRole === '1P' ? { summons1P: newSummons } : { summons2P: newSummons })
  }

  const confirmMyScrolls = async () => {
    if (!myRole || !roomState) return
    const ms = myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P
    if (ms.some(s => !s)) return
    await updateRoom(myRole === '1P' ? { scrollsConfirmed1P: true } : { scrollsConfirmed2P: true })
    fetchLatestState()
  }

  const confirmMySummons = async () => {
    if (!myRole || !roomState) return
    const ms = myRole === '1P' ? roomState.summons1P : roomState.summons2P
    if (ms.some(s => !s)) return
    await updateRoom(myRole === '1P' ? { summonsConfirmed1P: true } : { summonsConfirmed2P: true })
    fetchLatestState()
  }

  // 核心：执行下一局，从服务器获取最新状态确保历史池正确
  const doNextGame = useCallback(async () => {
    if (!roomId || transitioning) return
    setTransitioning(true)
    try {
      // 获取最新的房间状态
      const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
      if (!data) return
      const state = data.state as RoomState

      // 确保双方都已确认（冗余检查）
      if (!state.nextGameConfirmed1P || !state.nextGameConfirmed2P) return

      // 将本局各位置使用的密卷/通灵加入历史池
      const new1PScrollHistory = [...(state.myScrollHistory || []), ...state.scrolls1P.filter(Boolean) as string[]]
      const new2PScrollHistory = [...(state.opponentScrollHistory || []), ...state.scrolls2P.filter(Boolean) as string[]]
      const new1PSummonHistory = [...(state.mySummonHistory || []), ...state.summons1P.filter(Boolean) as string[]]
      const new2PSummonHistory = [...(state.opponentSummonHistory || []), ...state.summons2P.filter(Boolean) as string[]]

      // 交换玩家ID并重置本局数据，历史池跟随玩家位置交换
      await updateRoom({
        gameNumber: state.gameNumber + 1,
        firstPlayer: state.firstPlayer === '1P' ? '2P' : '1P',
        player1PId: state.player2PId,
        player2PId: state.player1PId,
        phase: 'ban', banStep: 0, pickStep: 0,
        ban1P: [null, null], ban2P: [null, null],
        team1P: [null, null, null], team2P: [null, null, null],
        scrolls1P: [null, null, null], scrolls2P: [null, null, null],
        scrollsConfirmed1P: false, scrollsConfirmed2P: false,
        summons1P: [null, null, null], summons2P: [null, null, null],
        summonsConfirmed1P: false, summonsConfirmed2P: false,
        deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
        currentPlayer: BAN_STEPS[0].player,
        myScrollHistory: new2PScrollHistory,        // 原2P历史 -> 新1P
        opponentScrollHistory: new1PScrollHistory,  // 原1P历史 -> 新2P
        mySummonHistory: new2PSummonHistory,
        opponentSummonHistory: new1PSummonHistory,
        nextGameConfirmed1P: false,
        nextGameConfirmed2P: false,
        publicBan: state.publicBan,
      })
    } finally {
      setTransitioning(false)
    }
  }, [roomId, transitioning, updateRoom])

  // 确认下一局：先标记自己确认，若双方都已确认则触发换局
  const confirmNextGame = useCallback(async () => {
    if (!myRole || !roomState || roomState.phase !== 'done') return
    const key = myRole === '1P' ? 'nextGameConfirmed1P' : 'nextGameConfirmed2P'
    // 先写入自己的确认状态
    await updateRoom({ [key]: true })

    // 检查对方是否已确认（从数据库读取最新状态）
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) {
      const latestState = data.state as RoomState
      const otherRole = myRole === '1P' ? '2P' : '1P'
      const otherConfirmed = otherRole === '1P' ? latestState.nextGameConfirmed1P : latestState.nextGameConfirmed2P
      if (otherConfirmed) {
        doNextGame()
      }
    }
  }, [myRole, roomState, roomId, updateRoom, doNextGame])

  useEffect(() => {
    if (!roomState) return
    if (roomState.phase === 'ban' && roomState.banStep >= 4) {
      updateRoom({ phase: 'pick', pickStep: 0, deadline: Date.now() + COUNTDOWN_SECONDS * 1000, currentPlayer: PICK_STEPS[0].player })
    }
    if (roomState.phase === 'pick' && roomState.pickStep >= 6) {
      updateRoom({ phase: 'scrolls', deadline: Date.now() + COUNTDOWN_SECONDS * 1000, currentPlayer: null })
    }
    if (roomState.phase === 'scrolls' && roomState.scrollsConfirmed1P && roomState.scrollsConfirmed2P) {
      updateRoom({ phase: 'summons', deadline: Date.now() + COUNTDOWN_SECONDS * 1000, currentPlayer: null })
    }
    if (roomState.phase === 'summons' && roomState.summonsConfirmed1P && roomState.summonsConfirmed2P) {
      updateRoom({ phase: 'done', deadline: null, currentPlayer: null })
    }
  }, [roomState?.phase, roomState?.banStep, roomState?.pickStep, roomState?.scrollsConfirmed1P, roomState?.scrollsConfirmed2P, roomState?.summonsConfirmed1P, roomState?.summonsConfirmed2P])

  const publicBanNinjas = useMemo(() => {
    const searchTerm = publicBanSearch.toLowerCase()
    const bannedIds = new Set(roomState?.publicBan || [])
    let list = ninjas.filter(n => !bannedIds.has(n.id))
    if (searchTerm) list = list.filter(n => n.name.toLowerCase().includes(searchTerm))
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = list.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [ninjas, roomState?.publicBan, publicBanSearch])

  const groupedNinjas = useMemo(() => {
    const filtered = search ? availableNinjas.filter(n => n.name.toLowerCase().includes(search.toLowerCase())) : availableNinjas
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = filtered.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [availableNinjas, search])

  if (!roomId) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">创建房间</h2>
          <p className="text-sm text-muted-foreground mb-4">你将作为 1P 开始对局</p>
          <Button onClick={createRoom} className="w-full">创建新房间</Button>
        </Card>
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold">加入房间</h2>
          <Input value={joinRoomId} onChange={e => setJoinRoomId(e.target.value.toUpperCase())} placeholder="输入房间号" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={joinRoom} className="w-full">加入</Button>
        </Card>
      </div>
    )
  }

  if (!roomState || !myRole) return <p className="text-center">加载中...</p>

  if (roomState.phase === 'waiting') {
    const bothReady = roomState.player1PId && roomState.player2PId
    const publicBanList = roomState.publicBan || []
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">房间 {roomId}</Badge>
            <Badge variant="secondary">你当前是 {myRole}</Badge>
            <Badge variant={roomState.player1PId ? 'default' : 'secondary'}>1P {roomState.player1PId ? '✓' : '空'}</Badge>
            <Badge variant={roomState.player2PId ? 'default' : 'secondary'}>2P {roomState.player2PId ? '✓' : '空'}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={leaveRoom}>退出房间</Button>
        </div>
        <Card className="p-6 space-y-4">
          {/* 公 ban 区域 */}
          <div>
            <h3 className="font-semibold text-center mb-2">公 ban（全局禁用忍者）</h3>
            <p className="text-sm text-muted-foreground text-center mb-3">
              选择最多 {MAX_PUBLIC_BAN} 名忍者，本局对战全程禁用（仅 1P 可设置）
            </p>
            {publicBanList.length > 0 && (
              <div className="flex justify-center gap-2 mb-3">
                {publicBanList.map(id => {
                  const ninja = ninjas.find(n => n.id === id)
                  return ninja ? (
                    <div key={id} className="relative group">
                      <div className="w-14 h-14 border rounded overflow-hidden">
                        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                      </div>
                      {myRole === '1P' && (
                        <div
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => togglePublicBan(id)}
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  ) : null
                })}
              </div>
            )}
            {myRole === '1P' && publicBanList.length < MAX_PUBLIC_BAN && (
              <div className="relative max-w-md mx-auto">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={publicBanSearch}
                  onChange={e => setPublicBanSearch(e.target.value)}
                  placeholder="搜索忍者添加公 ban..."
                  className="pl-9 pr-9"
                />
                {publicBanSearch && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setPublicBanSearch('')}><X className="h-4 w-4" /></Button>}
              </div>
            )}
            {myRole === '1P' && publicBanList.length < MAX_PUBLIC_BAN && (
              <div className="max-h-48 overflow-y-auto space-y-3 mt-2">
                {publicBanNinjas.map(group => (
                  <div key={group.tier}>
                    <Badge variant="outline" className="mb-1 text-sm font-bold">{group.tier}</Badge>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {group.ninjas.map(ninja => (
                        <div
                          key={ninja.id}
                          className="cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => togglePublicBan(ninja.id)}
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                            <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">等待双方就位...</h3>
            {!bothReady && <p className="text-muted-foreground">等待对方加入</p>}
            {bothReady && myRole === '1P' && (
              <Button onClick={startGame}>开始 BP</Button>
            )}
            {bothReady && myRole !== '1P' && (
              <p className="text-muted-foreground">等待 1P 开始对局</p>
            )}
          </div>
        </Card>
      </div>
    )
  }

  const scrollHistory1P = new Set<string>(roomState.myScrollHistory || [])
  const scrollHistory2P = new Set<string>(roomState.opponentScrollHistory || [])
  const summonHistory1P = new Set<string>(roomState.mySummonHistory || [])
  const summonHistory2P = new Set<string>(roomState.opponentSummonHistory || [])

  const displayOrder1P = [2, 1, 0]
  const displayOrder2P = [0, 1, 2]
  const order = myRole === '1P' ? displayOrder1P : displayOrder2P

  const renderBanDisplay = () => (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div>
        <h3 className="text-sm font-semibold text-center mb-2">1P 禁用</h3>
        <div className="flex justify-center gap-2">
          {roomState.ban1P.map((id, i) => {
            const ninja = ninjas.find(n => n.id === id)
            return (
              <div key={i} className="w-16 h-16 border rounded flex items-center justify-center">
                {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-center mb-2">2P 禁用</h3>
        <div className="flex justify-center gap-2">
          {roomState.ban2P.map((id, i) => {
            const ninja = ninjas.find(n => n.id === id)
            return (
              <div key={i} className="w-16 h-16 border rounded flex items-center justify-center">
                {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderTeamDisplay = () => {
    const showScrolls = roomState.phase === 'summons' || roomState.phase === 'done'
    const showSummons = roomState.phase === 'done' ||
      (roomState.phase === 'summons' && roomState.summonsConfirmed1P && roomState.summonsConfirmed2P)

    return (
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-center mb-2">1P 阵容</h3>
          <div className="flex justify-center gap-2">
            {displayOrder1P.map(i => {
              const ninja = ninjas.find(n => n.id === roomState.team1P[i])
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded border flex items-center justify-center">
                      {showScrolls ? (
                        roomState.scrolls1P[i] ? <Image src={scrolls.find(s => s.id === roomState.scrolls1P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded border flex items-center justify-center">
                      {showSummons ? (
                        roomState.summons1P[i] ? <Image src={summons.find(s => s.id === roomState.summons1P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-center mb-2">2P 阵容</h3>
          <div className="flex justify-center gap-2">
            {displayOrder2P.map(i => {
              const ninja = ninjas.find(n => n.id === roomState.team2P[i])
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded border flex items-center justify-center">
                      {showScrolls ? (
                        roomState.scrolls2P[i] ? <Image src={scrolls.find(s => s.id === roomState.scrolls2P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded border flex items-center justify-center">
                      {showSummons ? (
                        roomState.summons2P[i] ? <Image src={summons.find(s => s.id === roomState.summons2P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderPhase = () => {
    switch (roomState.phase) {
      case 'ban':
        return (
          <BanPhase
            search={search} setSearch={setSearch}
            groupedNinjas={groupedNinjas}
            isMyTurn={isMyTurn}
            pendingSelection={pendingSelection} setPendingSelection={setPendingSelection}
            onConfirm={confirmSelection}
          />
        )
      case 'pick':
        return (
          <PickPhase
            search={search} setSearch={setSearch}
            groupedNinjas={groupedNinjas}
            isMyTurn={isMyTurn}
            pendingSelection={pendingSelection} setPendingSelection={setPendingSelection}
            onConfirm={confirmSelection}
          />
        )
      case 'scrolls':
        return (
          <ScrollsPhase
            myRole={myRole}
            team1P={roomState.team1P} team2P={roomState.team2P}
            scrolls1P={roomState.scrolls1P} scrolls2P={roomState.scrolls2P}
            scrollHistory1P={scrollHistory1P} scrollHistory2P={scrollHistory2P}
            ninjas={ninjas} scrolls={scrolls}
            order={order}
            search={search} setSearch={setSearch}
            onSelectScrollSlot={selectScrollSlot}
            onConfirm={confirmMyScrolls}
            isConfirmed={myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P}
          />
        )
      case 'summons':
        return (
          <SummonsPhase
            myRole={myRole}
            team1P={roomState.team1P} team2P={roomState.team2P}
            summons1P={roomState.summons1P} summons2P={roomState.summons2P}
            scrolls1P={roomState.scrolls1P} scrolls2P={roomState.scrolls2P}
            summonHistory1P={summonHistory1P} summonHistory2P={summonHistory2P}
            ninjas={ninjas} summons={summons} scrolls={scrolls}
            order={order}
            search={search} setSearch={setSearch}
            onSelectSummonSlot={selectSummonSlot}
            onConfirm={confirmMySummons}
            isConfirmed={myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P}
          />
        )
      case 'done':
        return (
          <DonePhase
            onConfirmNextGame={confirmNextGame}
            myConfirmed={myRole === '1P' ? roomState.nextGameConfirmed1P : roomState.nextGameConfirmed2P}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">房间 {roomId}</Badge>
          <Badge variant="secondary">你当前是 {myRole}</Badge>
          <Badge variant="outline">第 {roomState.gameNumber} 局</Badge>
          <Badge variant={roomState.player1PId ? 'default' : 'secondary'}>1P {roomState.player1PId ? '✓' : '空'}</Badge>
          <Badge variant={roomState.player2PId ? 'default' : 'secondary'}>2P {roomState.player2PId ? '✓' : '空'}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={leaveRoom}>退出房间</Button>
      </div>

      <Card className="p-6">
        {roomState.deadline && (
          <div className="flex justify-center mb-4">
            <Badge variant="destructive" className="text-lg px-4 py-2 gap-2">
              <Clock className="h-5 w-5" /> {remainingSeconds}s
            </Badge>
          </div>
        )}

        {renderBanDisplay()}
        {roomState.phase !== 'ban' && renderTeamDisplay()}
        {renderPhase()}
      </Card>
    </div>
  )
}