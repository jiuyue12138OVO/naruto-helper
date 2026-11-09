import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '@/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { BookOpen, ChevronDown, ChevronUp, Clock, Search, X, History, Eye, RefreshCw, UserRound } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useData } from '@/contexts/DataContext'
import BanPhase from './BanPhase'
import PickPhase from './PickPhase'
import ScrollsPhase from './ScrollsPhase'
import SummonsPhase from './SummonsPhase'
import DonePhase from './DonePhase'
import PoolSettingsDialog from './PoolSettingsDialog'
import { EMPTY_POOL, poolAllows, poolSummary } from './battlePool'
import type { PlayerPool } from './battlePool'
import type { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']
const RATING_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 }
const COUNTDOWN_SECONDS = 60
const MAX_PUBLIC_BAN = 10
const MAX_SPECTATORS = 5
const AVATAR_MAX_BYTES = 5 * 1024 * 1024
const AVATAR_SIZE = 128

const fileToAvatarDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('读取失败'))
    reader.onload = () => {
      const img = new window.Image()
      img.onerror = () => reject(new Error('图片解析失败'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = AVATAR_SIZE
        canvas.height = AVATAR_SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('画布不可用'))
          return
        }
        const scale = Math.max(AVATAR_SIZE / img.naturalWidth, AVATAR_SIZE / img.naturalHeight)
        const drawW = img.naturalWidth * scale
        const drawH = img.naturalHeight * scale
        ctx.drawImage(img, (AVATAR_SIZE - drawW) / 2, (AVATAR_SIZE - drawH) / 2, drawW, drawH)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = typeof reader.result === 'string' ? reader.result : ''
    }
    reader.readAsDataURL(file)
  })

type Phase = 'waiting' | 'ban' | 'pick' | 'scrolls' | 'summons' | 'done'

interface GameRecord {
  gameNumber: number
  team1P: (string | null)[]
  team2P: (string | null)[]
  scrolls1P: (string | null)[]
  scrolls2P: (string | null)[]
  summons1P: (string | null)[]
  summons2P: (string | null)[]
  player1PId?: string | null
  player1PName?: string
  player1PAvatar?: string | null
  player2PId?: string | null
  player2PName?: string
  player2PAvatar?: string | null
}

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
  myScrollHistory?: string[]
  opponentScrollHistory?: string[]
  mySummonHistory?: string[]
  opponentSummonHistory?: string[]
  player1PId: string | null
  player2PId: string | null
  player1PName?: string
  player1PAvatar?: string | null
  player2PName?: string
  player2PAvatar?: string | null
  spectators: string[]
  gameHistory: GameRecord[]
  deadline: number | null
  currentPlayer: '1P' | '2P' | null
  publicBan: string[]
  nextGameConfirmed1P: boolean
  nextGameConfirmed2P: boolean
  startConfirmed1P: boolean
  startConfirmed2P: boolean
  reuseScrollSummon?: boolean
  player1PPool?: PlayerPool
  player2PPool?: PlayerPool
  lastTimeout?: { key: string; message: string; at: number }
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

const emptyRoomState = (
  player1PId: string,
  reuseScrollSummon = false,
  profile?: { name?: string; avatar?: string | null },
  pool: PlayerPool = EMPTY_POOL,
): RoomState => ({
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
  player1PName: profile?.name || '',
  player1PAvatar: profile?.avatar ?? null,
  player2PName: '',
  player2PAvatar: null,
  player1PPool: pool,
  player2PPool: undefined,
  spectators: [],
  gameHistory: [],
  deadline: null,
  currentPlayer: null,
  publicBan: [],
  nextGameConfirmed1P: false,
  nextGameConfirmed2P: false,
  startConfirmed1P: false,
  startConfirmed2P: false,
  reuseScrollSummon,
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
  const [showHistory, setShowHistory] = useState(false)
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showRules, setShowRules] = useState(false)

  // 创建房间时的复用开关
  const [reuseSwitch, setReuseSwitch] = useState(false)

  // 玩家资料，保存在本机，建房和加入房间共用
  const [myName, setMyName] = useState(() => {
    try { return localStorage.getItem('bp_room_name') || '' } catch { return '' }
  })
  const [myAvatar, setMyAvatar] = useState<string | null>(() => {
    try { return localStorage.getItem('bp_room_avatar') } catch { return null }
  })
  const [avatarError, setAvatarError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // 本机保存的忍者/密卷/通灵池，建房和加入房间共用
  const [myPool, setMyPool] = useState<PlayerPool>(() => {
    try {
      const raw = localStorage.getItem('bp_room_pool')
      if (!raw) return EMPTY_POOL
      const parsed = JSON.parse(raw) as Partial<PlayerPool>
      return {
        mode: parsed.mode === 'select' || parsed.mode === 'disable' ? parsed.mode : 'all',
        ninjas: Array.isArray(parsed.ninjas) ? parsed.ninjas : [],
        scrolls: Array.isArray(parsed.scrolls) ? parsed.scrolls : [],
        summons: Array.isArray(parsed.summons) ? parsed.summons : [],
      }
    } catch { return EMPTY_POOL }
  })
  const [showPoolDialog, setShowPoolDialog] = useState(false)

  // ban/pick 阶段：是否按梯度分组（默认关闭，按游戏内编号全排）
  const [showTierGrouping, setShowTierGrouping] = useState(false)
  // 公 ban 阶段：是否按梯度分组（默认关闭）
  const [publicBanTierGrouping, setPublicBanTierGrouping] = useState(false)

  useEffect(() => {
    try {
      if (myName) localStorage.setItem('bp_room_name', myName)
      else localStorage.removeItem('bp_room_name')
      if (myAvatar) localStorage.setItem('bp_room_avatar', myAvatar)
      else localStorage.removeItem('bp_room_avatar')
      localStorage.setItem('bp_room_pool', JSON.stringify(myPool))
    } catch {}
  }, [myName, myAvatar, myPool])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutAttemptRef = useRef<{ key: string; at: number } | null>(null)

  const myRole = useMemo(() => {
    if (!roomState || !myPlayerId) return null
    if (roomState.player1PId === myPlayerId) return '1P'
    if (roomState.player2PId === myPlayerId) return '2P'
    if (roomState.spectators.includes(myPlayerId)) return 'spectator'
    return null
  }, [roomState, myPlayerId])

  const isSpectator = myRole === 'spectator'
  const isPlayer = myRole === '1P' || myRole === '2P'

  const mySeatPool = useMemo(() => {
    if (!roomState || (myRole !== '1P' && myRole !== '2P')) return myPool
    return (myRole === '1P' ? roomState.player1PPool : roomState.player2PPool) || myPool
  }, [roomState, myRole, myPool])

  const isSpectatorRef = useRef(isSpectator)
  useEffect(() => {
    isSpectatorRef.current = isSpectator
  }, [isSpectator])

  // 持久化
  useEffect(() => {
    if (roomId && myPlayerId) {
      localStorage.setItem('bp_room_id', roomId)
      localStorage.setItem('bp_player_id', myPlayerId)
    }
  }, [roomId, myPlayerId])

  // 断线重连
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
          const isSpec = state.spectators?.includes(savedPlayerId)
          if (is1P || is2P || isSpec) {
            setRoomId(savedRoomId)
            setMyPlayerId(savedPlayerId)
            setRoomState(state)
          } else if ((state.spectators?.length || 0) < MAX_SPECTATORS) {
            const newSpectators = [...(state.spectators || []), savedPlayerId]
            const newState = { ...state, spectators: newSpectators }
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

  // 实时订阅
  useEffect(() => {
    if (!roomId) return
    const channel = supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            if (isSpectatorRef.current) {
              setRoomId(null)
              setRoomState(null)
              setMyPlayerId(null)
              localStorage.removeItem('bp_room_id')
              localStorage.removeItem('bp_player_id')
            }
            return
          }
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

  const updateRoomWith = useCallback(async (updater: (latest: RoomState) => Partial<RoomState> | null) => {
    if (!roomId) return
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (!data) return
    const latest = data.state as RoomState
    const updates = updater(latest)
    if (!updates) return
    const newState: RoomState = { ...latest, ...updates }
    await supabase.from('rooms').upsert({ id: roomId, state: newState })
    setRoomState(newState)
  }, [roomId])

  const fetchLatestState = useCallback(async () => {
    if (!roomId) return null
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (!data) return null
    const state = data.state as RoomState
    setRoomState(state)
    return state
  }, [roomId])

  const handleRefresh = useCallback(async () => {
    if (!roomId || refreshing) return
    setRefreshing(true)
    try {
      const state = await fetchLatestState()
      if (state?.deadline) {
        setRemainingSeconds(Math.max(0, Math.floor((state.deadline - Date.now()) / 1000)))
      }
    } finally {
      window.setTimeout(() => setRefreshing(false), 300)
    }
  }, [roomId, refreshing, fetchLatestState])

  const handleAvatarSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarError('请选择图片文件')
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError('图片不能超过 5MB')
      return
    }
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      setMyAvatar(dataUrl)
      setAvatarError('')
    } catch {
      setAvatarError('图片处理失败，请换一张')
    }
  }

  const generatePlayerId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6)

  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    const playerId = generatePlayerId()
    const init = emptyRoomState(playerId, reuseSwitch, { name: myName.trim(), avatar: myAvatar }, myPool)
    setRoomId(id); setMyPlayerId(playerId); setRoomState(init)
    supabase.from('rooms').upsert({ id, state: init }).then()
  }

  const joinRoom = async (asSpectator = false) => {
    const id = joinRoomId.trim().toUpperCase()
    if (!id) return
    const { data } = await supabase.from('rooms').select('state').eq('id', id).single()
    if (!data) { setError('房间不存在'); return }
    const state = data.state as RoomState

    if (asSpectator) {
      if ((state.spectators?.length || 0) >= MAX_SPECTATORS) {
        setError('观众席已满'); return
      }
      const newPlayerId = generatePlayerId()
      const newSpectators = [...(state.spectators || []), newPlayerId]
      const newState = { ...state, spectators: newSpectators }
      await supabase.from('rooms').upsert({ id, state: newState })
      setRoomId(id); setMyPlayerId(newPlayerId); setRoomState(newState)
      setError('')
      return
    }

    const roleToTake = !state.player1PId ? '1P' : !state.player2PId ? '2P' : null
    if (!roleToTake) {
      setError('玩家数已满'); return
    }
    const newPlayerId = generatePlayerId()
    const newState: RoomState = {
      ...state,
      [`player${roleToTake}Id`]: newPlayerId,
      [`player${roleToTake}Name`]: myName.trim(),
      [`player${roleToTake}Avatar`]: myAvatar,
    }
    // 席位池在开局时确定，玩家离开后保留，新玩家继承原席位池
    if (roleToTake === '1P') {
      if (!newState.player1PPool) newState.player1PPool = myPool
    } else {
      if (!newState.player2PPool) newState.player2PPool = myPool
    }
    await supabase.from('rooms').upsert({ id, state: newState })
    setRoomId(id); setMyPlayerId(newPlayerId); setRoomState(newState)
    setError('')
  }

  const leaveRoom = useCallback(async () => {
    if (!roomId || !myRole || !roomState) return
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (!data) return
    const latestState = data.state as RoomState

    if (myRole === '1P' || myRole === '2P') {
      const updates: Partial<RoomState> = myRole === '1P'
        ? { player1PId: null, player1PName: '', player1PAvatar: null }
        : { player2PId: null, player2PName: '', player2PAvatar: null }
      const newState = { ...latestState, ...updates }
      await supabase.from('rooms').upsert({ id: roomId, state: newState })
      if (!newState.player1PId && !newState.player2PId) {
        await supabase.from('rooms').delete().eq('id', roomId)
      }
    } else {
      const newSpectators = (latestState.spectators || []).filter(id => id !== myPlayerId)
      await supabase.from('rooms').upsert({ id: roomId, state: { ...latestState, spectators: newSpectators } })
    }

    setRoomId(null)
    setRoomState(null)
    setMyPlayerId(null)
    localStorage.removeItem('bp_room_id')
    localStorage.removeItem('bp_player_id')
  }, [roomId, myRole, myPlayerId, roomState])

  const confirmStart = useCallback(async () => {
    if (!roomState || !isPlayer || roomState.phase !== 'waiting') return
    if (isSpectator) return
    const key = myRole === '1P' ? 'startConfirmed1P' : 'startConfirmed2P'
    if (roomState[key]) return
    await updateRoom({ [key]: true })
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) {
      const latestState = data.state as RoomState
      if (latestState.startConfirmed1P && latestState.startConfirmed2P) {
        await updateRoom({
          phase: 'ban',
          banStep: 0,
          deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
          currentPlayer: BAN_STEPS[0].player,
          startConfirmed1P: false,
          startConfirmed2P: false,
        })
      }
    }
  }, [roomState, isPlayer, myRole, roomId, updateRoom])

  const togglePublicBan = async (ninjaId: string) => {
    if (!roomState || roomState.phase !== 'waiting' || isSpectator) return
    const current = roomState.publicBan || []
    if (current.includes(ninjaId)) {
      await updateRoom({ publicBan: current.filter(id => id !== ninjaId) })
    } else if (current.length < MAX_PUBLIC_BAN) {
      await updateRoom({ publicBan: [...current, ninjaId] })
    }
  }

  // 禁用阶段：所有忍者都可被禁，不受个人池限制
  const availableNinjas = useMemo(() => {
    if (!roomState) return []
    const publicBanSet = new Set(roomState.publicBan || [])
    const banned = new Set([...roomState.ban1P.filter(Boolean), ...roomState.ban2P.filter(Boolean)])
    return ninjas.filter(n =>
      !roomState.usedNinjas.includes(n.id)
      && !banned.has(n.id)
      && !publicBanSet.has(n.id)
    )
  }, [roomState, ninjas])

  // 选用阶段：只允许自己席位池内的忍者
  const pickableNinjas = useMemo(() => {
    if (!roomState) return []
    const seatPool = myRole === '1P'
      ? roomState.player1PPool
      : myRole === '2P'
        ? roomState.player2PPool
        : undefined
    return availableNinjas.filter(n => poolAllows(seatPool, 'ninjas', n.id))
  }, [availableNinjas, roomState, myRole])

  // 通用排序：优先 gameOrder，缺失时退化到 评级 → 名字
  const sortNinjasBase = useCallback((a: INinja, b: INinja) => {
    const ga = a.gameOrder
    const gb = b.gameOrder
    if (ga !== undefined || gb !== undefined) {
      const va = ga ?? Infinity
      const vb = gb ?? Infinity
      if (va !== vb) return va - vb
    }
    const ra = RATING_ORDER[a.rating] ?? 99
    const rb = RATING_ORDER[b.rating] ?? 99
    if (ra !== rb) return ra - rb
    return a.name.localeCompare(b.name)
  }, [])

  const publicBanNinjas = useMemo(() => {
    const searchTerm = publicBanSearch.toLowerCase()
    const bannedIds = new Set(roomState?.publicBan || [])
    let list = ninjas.filter(n => !bannedIds.has(n.id))
    if (searchTerm) list = list.filter(n => n.name.toLowerCase().includes(searchTerm))
    list = [...list].sort(sortNinjasBase)

    if (publicBanTierGrouping) {
      const groups: { tier: string; ninjas: INinja[] }[] = []
      TIER_ORDER.forEach(tier => {
        const tierNinjas = list.filter(n => n.tier === tier)
        if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
      })
      return groups
    }
    return [{ tier: '全部', ninjas: list }]
  }, [ninjas, roomState?.publicBan, publicBanSearch, publicBanTierGrouping, sortNinjasBase])

  // 按游戏内编号排序辅助
  const sortByGameOrder = useCallback((a: INinja, b: INinja) => {
    const ga = a.gameOrder ?? Infinity
    const gb = b.gameOrder ?? Infinity
    if (ga !== gb) return ga - gb
    return a.name.localeCompare(b.name)
  }, [])

  // ban/pick 阶段的忍者分组
  const groupedNinjas = useMemo(() => {
    const source = roomState?.phase === 'pick' ? pickableNinjas : availableNinjas
    const filtered = search
      ? source.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
      : source

    if (showTierGrouping) {
      const groups: { tier: string; ninjas: INinja[] }[] = []
      TIER_ORDER.forEach(tier => {
        const list = filtered.filter(n => n.tier === tier).sort(sortByGameOrder)
        if (list.length > 0) groups.push({ tier, ninjas: list })
      })
      return groups
    } else {
      // 全部一起，按游戏内编号排序
      const sorted = [...filtered].sort(sortByGameOrder)
      return [{ tier: '全部', ninjas: sorted }]
    }
  }, [availableNinjas, pickableNinjas, roomState?.phase, search, showTierGrouping, sortByGameOrder])

  const isMyTurn = useMemo(() => {
    if (!roomState || !isPlayer) return false
    if (roomState.phase === 'waiting') return false
    if (roomState.phase === 'ban' || roomState.phase === 'pick') return roomState.currentPlayer === myRole
    if (roomState.phase === 'scrolls') return !(myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P)
    if (roomState.phase === 'summons') return !(myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P)
    return false
  }, [roomState, myRole, isPlayer])

  const handleTimeout = useCallback(() => {
    if (!roomId || !roomState?.deadline) return
    if (myRole === 'spectator') return
    if (Date.now() < roomState.deadline) return

    const attemptKey = `${roomState.phase}-${roomState.banStep}-${roomState.pickStep}-${roomState.deadline}`
    const last = timeoutAttemptRef.current
    if (last?.key === attemptKey && Date.now() - last.at < 3000) return
    timeoutAttemptRef.current = { key: attemptKey, at: Date.now() }

    updateRoomWith((latest) => {
      if (!latest.deadline || Date.now() < latest.deadline) return null

      if (latest.phase === 'ban') {
        const step = BAN_STEPS[latest.banStep]
        if (!step) return null
        const key = `ban-${latest.banStep}-${latest.deadline}`
        if (latest.lastTimeout?.key === key) return null
        const targetBan = step.player === '1P' ? [...latest.ban1P] : [...latest.ban2P]
        if (targetBan[step.index]) return null

        const banned = new Set<string>([
          ...(latest.publicBan || []),
          ...(latest.ban1P.filter(Boolean) as string[]),
          ...(latest.ban2P.filter(Boolean) as string[]),
        ])
        const used = new Set<string>(latest.usedNinjas)
        const pool = ninjas.filter(n => !banned.has(n.id) && !used.has(n.id))
        const chosen = pool[Math.floor(Math.random() * pool.length)]
        if (!chosen) return null

        targetBan[step.index] = chosen.id
        const nextStep = latest.banStep + 1
        const banUpdate: Partial<RoomState> = step.player === '1P' ? { ban1P: targetBan } : { ban2P: targetBan }
        return {
          ...banUpdate,
          banStep: nextStep,
          deadline: nextStep < BAN_STEPS.length ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
          currentPlayer: nextStep < BAN_STEPS.length ? BAN_STEPS[nextStep].player : null,
          lastTimeout: {
            key,
            message: `禁用阶段超时未选择，已随机禁用「${chosen.name}」`,
            at: Date.now(),
          },
        }
      }

      if (latest.phase === 'pick') {
        const step = PICK_STEPS[latest.pickStep]
        if (!step) return null
        const key = `pick-${latest.pickStep}-${latest.deadline}`
        if (latest.lastTimeout?.key === key) return null
        const targetTeam = step.player === '1P' ? [...latest.team1P] : [...latest.team2P]
        if (targetTeam[step.index]) return null

        const banned = new Set<string>([
          ...(latest.publicBan || []),
          ...(latest.ban1P.filter(Boolean) as string[]),
          ...(latest.ban2P.filter(Boolean) as string[]),
        ])
        const used = new Set<string>(latest.usedNinjas)
        const taken = new Set<string>([
          ...(latest.team1P.filter(Boolean) as string[]),
          ...(latest.team2P.filter(Boolean) as string[]),
        ])
        const seatPool = step.player === '1P' ? latest.player1PPool : latest.player2PPool
        const basePool = ninjas.filter(n => !banned.has(n.id) && !used.has(n.id) && !taken.has(n.id))
        const restricted = basePool.filter(n => poolAllows(seatPool, 'ninjas', n.id))
        const pool = restricted.length > 0 ? restricted : basePool
        const chosen = pool[Math.floor(Math.random() * pool.length)]
        if (!chosen) return null

        targetTeam[step.index] = chosen.id
        const nextStep = latest.pickStep + 1
        const teamUpdate: Partial<RoomState> = step.player === '1P' ? { team1P: targetTeam } : { team2P: targetTeam }
        return {
          ...teamUpdate,
          usedNinjas: [...latest.usedNinjas, chosen.id],
          pickStep: nextStep,
          deadline: nextStep < PICK_STEPS.length ? Date.now() + COUNTDOWN_SECONDS * 1000 : null,
          currentPlayer: nextStep < PICK_STEPS.length ? PICK_STEPS[nextStep].player : null,
          lastTimeout: {
            key,
            message: `选用阶段超时未选择，已随机选用「${chosen.name}」`,
            at: Date.now(),
          },
        }
      }

      if (latest.phase === 'scrolls') {
        const key = `scrolls-${latest.deadline}`
        if (latest.lastTimeout?.key === key) return null
        const pending1P = !latest.scrollsConfirmed1P
        const pending2P = !latest.scrollsConfirmed2P
        if (!pending1P && !pending2P) return null

        const fillScrolls = (role: '1P' | '2P') => {
          const current = role === '1P' ? [...latest.scrolls1P] : [...latest.scrolls2P]
          const history = new Set<string>(role === '1P' ? (latest.myScrollHistory || []) : (latest.opponentScrollHistory || []))
          const picked = new Set<string>(current.filter(Boolean) as string[])
          const seatPool = role === '1P' ? latest.player1PPool : latest.player2PPool
          const basePool = scrolls.filter(s => !history.has(s.id) && !picked.has(s.id))
          const restricted = basePool.filter(s => poolAllows(seatPool, 'scrolls', s.id))
          const pool = [...restricted]
          if (pool.length < current.filter(s => !s).length) {
            basePool.filter(s => !restricted.includes(s)).forEach(s => pool.push(s))
          }
          for (let i = 0; i < current.length; i++) {
            if (current[i] || pool.length === 0) continue
            const idx = Math.floor(Math.random() * pool.length)
            const scroll = pool[idx]
            if (!scroll) break
            current[i] = scroll.id
            picked.add(scroll.id)
            pool.splice(idx, 1)
          }
          return current
        }

        const updates: Partial<RoomState> = {
          lastTimeout: { key, message: '密卷阶段超时未确认，已随机选择密卷', at: Date.now() },
        }
        if (pending1P) {
          const next1P = fillScrolls('1P')
          if (next1P.some(s => !s)) return null
          updates.scrolls1P = next1P
          updates.scrollsConfirmed1P = true
        }
        if (pending2P) {
          const next2P = fillScrolls('2P')
          if (next2P.some(s => !s)) return null
          updates.scrolls2P = next2P
          updates.scrollsConfirmed2P = true
        }
        return updates
      }

      if (latest.phase === 'summons') {
        const key = `summons-${latest.deadline}`
        if (latest.lastTimeout?.key === key) return null
        const pending1P = !latest.summonsConfirmed1P
        const pending2P = !latest.summonsConfirmed2P
        if (!pending1P && !pending2P) return null

        const fillSummons = (role: '1P' | '2P') => {
          const current = role === '1P' ? [...latest.summons1P] : [...latest.summons2P]
          const history = new Set<string>(role === '1P' ? (latest.mySummonHistory || []) : (latest.opponentSummonHistory || []))
          const picked = new Set<string>(current.filter(Boolean) as string[])
          const seatPool = role === '1P' ? latest.player1PPool : latest.player2PPool
          const basePool = summons.filter(s => !history.has(s.id) && !picked.has(s.id))
          const restricted = basePool.filter(s => poolAllows(seatPool, 'summons', s.id))
          const pool = [...restricted]
          if (pool.length < current.filter(s => !s).length) {
            basePool.filter(s => !restricted.includes(s)).forEach(s => pool.push(s))
          }
          for (let i = 0; i < current.length; i++) {
            if (current[i] || pool.length === 0) continue
            const idx = Math.floor(Math.random() * pool.length)
            const summon = pool[idx]
            if (!summon) break
            current[i] = summon.id
            picked.add(summon.id)
            pool.splice(idx, 1)
          }
          return current
        }

        const updates: Partial<RoomState> = {
          lastTimeout: { key, message: '通灵阶段超时未确认，已随机选择通灵', at: Date.now() },
        }
        if (pending1P) {
          const next1P = fillSummons('1P')
          if (next1P.some(s => !s)) return null
          updates.summons1P = next1P
          updates.summonsConfirmed1P = true
        }
        if (pending2P) {
          const next2P = fillSummons('2P')
          if (next2P.some(s => !s)) return null
          updates.summons2P = next2P
          updates.summonsConfirmed2P = true
        }
        return updates
      }

      return null
    }).catch(() => {})
  }, [roomId, roomState?.deadline, myRole, ninjas, scrolls, summons, updateRoomWith])


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
      if (diff <= 0) handleTimeout()
    }
    tick()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [roomState?.deadline, handleTimeout])

  useEffect(() => {
    const notice = roomState?.lastTimeout
    if (!notice) return
    setTimeoutNotice(notice.message)
    const timer = setTimeout(() => setTimeoutNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [roomState?.lastTimeout?.at])

  const confirmSelection = (ninjaId: string) => {
    if (!roomState || !isPlayer || !isMyTurn) return
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
    if (!myRole || !isPlayer || isSpectator) return
    const newScrolls = [...(myRole === '1P' ? roomState!.scrolls1P : roomState!.scrolls2P)]
    newScrolls[index] = scrollId
    updateRoom(myRole === '1P' ? { scrolls1P: newScrolls } : { scrolls2P: newScrolls })
  }

  const selectSummonSlot = (index: number, summonId: string | null) => {
    if (!myRole || !isPlayer || isSpectator) return
    const newSummons = [...(myRole === '1P' ? roomState!.summons1P : roomState!.summons2P)]
    newSummons[index] = summonId
    updateRoom(myRole === '1P' ? { summons1P: newSummons } : { summons2P: newSummons })
  }

  const confirmMyScrolls = async () => {
    if (!myRole || !isPlayer || isSpectator || !roomState) return
    const ms = myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P
    if (ms.some(s => !s)) return
    await updateRoom(myRole === '1P' ? { scrollsConfirmed1P: true } : { scrollsConfirmed2P: true })
    fetchLatestState()
  }

  const confirmMySummons = async () => {
    if (!myRole || !isPlayer || isSpectator || !roomState) return
    const ms = myRole === '1P' ? roomState.summons1P : roomState.summons2P
    if (ms.some(s => !s)) return
    await updateRoom(myRole === '1P' ? { summonsConfirmed1P: true } : { summonsConfirmed2P: true })
    fetchLatestState()
  }

  const doNextGame = useCallback(async () => {
    if (!roomId || transitioning) return
    setTransitioning(true)
    try {
      const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
      if (!data) return
      const state = data.state as RoomState
      if (!state.nextGameConfirmed1P || !state.nextGameConfirmed2P) return

      const newRecord: GameRecord = {
        gameNumber: state.gameNumber,
        team1P: [...state.team1P],
        team2P: [...state.team2P],
        scrolls1P: [...state.scrolls1P],
        scrolls2P: [...state.scrolls2P],
        summons1P: [...state.summons1P],
        summons2P: [...state.summons2P],
        player1PId: state.player1PId,
        player1PName: state.player1PName,
        player1PAvatar: state.player1PAvatar,
        player2PId: state.player2PId,
        player2PName: state.player2PName,
        player2PAvatar: state.player2PAvatar,
      }

      const reuse = state.reuseScrollSummon

      const new1PScrollHistory = reuse ? [] : [...(state.myScrollHistory || []), ...state.scrolls1P.filter(Boolean) as string[]]
      const new2PScrollHistory = reuse ? [] : [...(state.opponentScrollHistory || []), ...state.scrolls2P.filter(Boolean) as string[]]
      const new1PSummonHistory = reuse ? [] : [...(state.mySummonHistory || []), ...state.summons1P.filter(Boolean) as string[]]
      const new2PSummonHistory = reuse ? [] : [...(state.opponentSummonHistory || []), ...state.summons2P.filter(Boolean) as string[]]

      await updateRoom({
        gameNumber: state.gameNumber + 1,
        firstPlayer: state.firstPlayer === '1P' ? '2P' : '1P',
        player1PId: state.player2PId,
        player2PId: state.player1PId,
        player1PName: state.player2PName,
        player1PAvatar: state.player2PAvatar,
        player2PName: state.player1PName,
        player2PAvatar: state.player1PAvatar,
        phase: 'ban', banStep: 0, pickStep: 0,
        ban1P: [null, null], ban2P: [null, null],
        team1P: [null, null, null], team2P: [null, null, null],
        scrolls1P: [null, null, null], scrolls2P: [null, null, null],
        scrollsConfirmed1P: false, scrollsConfirmed2P: false,
        summons1P: [null, null, null], summons2P: [null, null, null],
        summonsConfirmed1P: false, summonsConfirmed2P: false,
        deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
        currentPlayer: BAN_STEPS[0].player,
        myScrollHistory: new2PScrollHistory,
        opponentScrollHistory: new1PScrollHistory,
        mySummonHistory: new2PSummonHistory,
        opponentSummonHistory: new1PSummonHistory,
        nextGameConfirmed1P: false,
        nextGameConfirmed2P: false,
        publicBan: state.publicBan,
        gameHistory: [...(state.gameHistory || []), newRecord],
        spectators: state.spectators,
        startConfirmed1P: false,
        startConfirmed2P: false,
        reuseScrollSummon: reuse,
      })
    } finally {
      setTransitioning(false)
    }
  }, [roomId, transitioning, updateRoom])

  const confirmNextGame = useCallback(async () => {
    if (!myRole || !isPlayer || roomState?.phase !== 'done') return
    const key = myRole === '1P' ? 'nextGameConfirmed1P' : 'nextGameConfirmed2P'
    await updateRoom({ [key]: true })
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) {
      const latestState = data.state as RoomState
      const otherRole = myRole === '1P' ? '2P' : '1P'
      const otherConfirmed = otherRole === '1P' ? latestState.nextGameConfirmed1P : latestState.nextGameConfirmed2P
      if (otherConfirmed) {
        doNextGame()
      }
    }
  }, [myRole, roomState, roomId, updateRoom, doNextGame, isPlayer])

  useEffect(() => {
    if (!roomState || isSpectator) return
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
  }, [roomState?.phase, roomState?.banStep, roomState?.pickStep, roomState?.scrollsConfirmed1P, roomState?.scrollsConfirmed2P, roomState?.summonsConfirmed1P, roomState?.summonsConfirmed2P, isSpectator])

  const scrollHistory1P = new Set<string>(roomState?.myScrollHistory || [])
  const scrollHistory2P = new Set<string>(roomState?.opponentScrollHistory || [])
  const summonHistory1P = new Set<string>(roomState?.mySummonHistory || [])
  const summonHistory2P = new Set<string>(roomState?.opponentSummonHistory || [])

  const displayOrder1P = [2, 1, 0]
  const displayOrder2P = [0, 1, 2]
  const order = myRole === '1P' ? displayOrder1P : myRole === '2P' ? displayOrder2P : displayOrder1P

  const historyRecords = useMemo(() => roomState?.gameHistory || [], [roomState])

  const [alignHistory, setAlignHistory] = useState(false)

  const isHistoryPlayer = useMemo(
    () => !!myPlayerId && (roomState?.gameHistory || []).some(
      r => r.player1PId === myPlayerId || r.player2PId === myPlayerId
    ),
    [roomState?.gameHistory, myPlayerId]
  )

  const avatarById = (id?: string | null) => {
    if (!id) return null
    if (id === roomState?.player1PId) return roomState?.player1PAvatar ?? null
    if (id === roomState?.player2PId) return roomState?.player2PAvatar ?? null
    return null
  }

  const renderHistorySide = (record: GameRecord, role: '1P' | '2P', mirrored = false) => {
    const baseOrder = role === '1P' ? displayOrder1P : displayOrder2P
    const order = mirrored ? baseOrder.slice().reverse() : baseOrder
    const team = role === '1P' ? record.team1P : record.team2P
    const scrollRow = role === '1P' ? record.scrolls1P : record.scrolls2P
    const summonRow = role === '1P' ? record.summons1P : record.summons2P
    const name = (role === '1P' ? record.player1PName : record.player2PName) || ''
    const sideAvatar = role === '1P' ? record.player1PAvatar : record.player2PAvatar
    const avatar = sideAvatar || avatarById(role === '1P' ? record.player1PId : record.player2PId)

    return (
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-full overflow-hidden border flex items-center justify-center bg-muted/30 shrink-0">
            {avatar
              ? <Image src={avatar} alt="" className="h-full w-full object-cover" />
              : <UserRound className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground">{role} 阵容{name ? `（${name}）` : ''}</p>
        </div>
        <div className="flex justify-center gap-2">
          {order.map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 border rounded flex items-center justify-center">
                {team[i] ? (
                  <Image src={ninjas.find(n => n.id === team[i])?.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : <span className="text-xs text-muted-foreground">-</span>}
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-6 border rounded-full overflow-hidden flex items-center justify-center">
                  {scrollRow[i] ? <Image src={scrolls.find(s => s.id === scrollRow[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs">-</span>}
                </div>
                <div className="w-6 h-6 border rounded-full overflow-hidden flex items-center justify-center">
                  {summonRow[i] ? <Image src={summons.find(s => s.id === summonRow[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs">-</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBanDisplay = () => (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div>
        <h3 className="text-sm font-semibold text-center mb-2">1P 禁用</h3>
        <div className="flex justify-center gap-2">
          {roomState!.ban1P.map((id, i) => {
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
          {roomState!.ban2P.map((id, i) => {
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
    const showScrolls = roomState!.phase === 'summons' || roomState!.phase === 'done'
    const showSummons = roomState!.phase === 'done' ||
      (roomState!.phase === 'summons' && roomState!.summonsConfirmed1P && roomState!.summonsConfirmed2P)

    return (
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-center mb-2">1P 阵容</h3>
          <div className="flex justify-center gap-2">
            {displayOrder1P.map(i => {
              const ninja = ninjas.find(n => n.id === roomState!.team1P[i])
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden border flex items-center justify-center">
                      {showScrolls ? (
                        roomState!.scrolls1P[i] ? <Image src={scrolls.find(s => s.id === roomState!.scrolls1P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded-full border overflow-hidden flex items-center justify-center">
                      {showSummons ? (
                        roomState!.summons1P[i] ? <Image src={summons.find(s => s.id === roomState!.summons1P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
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
              const ninja = ninjas.find(n => n.id === roomState!.team2P[i])
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden border flex items-center justify-center">
                      {showScrolls ? (
                        roomState!.scrolls2P[i] ? <Image src={scrolls.find(s => s.id === roomState!.scrolls2P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded-full border overflow-hidden flex items-center justify-center">
                      {showSummons ? (
                        roomState!.summons2P[i] ? <Image src={summons.find(s => s.id === roomState!.summons2P[i])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">-</span>
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
    if (isSpectator) return null

    switch (roomState!.phase) {
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
            myRole={myRole as '1P' | '2P'}
            team1P={roomState!.team1P} team2P={roomState!.team2P}
            scrolls1P={roomState!.scrolls1P} scrolls2P={roomState!.scrolls2P}
            scrollHistory1P={scrollHistory1P} scrollHistory2P={scrollHistory2P}
            ninjas={ninjas} scrolls={scrolls}
            poolScrolls={scrolls.filter(s => poolAllows(mySeatPool, 'scrolls', s.id))}
            order={order}
            search={search} setSearch={setSearch}
            onSelectScrollSlot={selectScrollSlot}
            onConfirm={confirmMyScrolls}
            isConfirmed={myRole === '1P' ? roomState!.scrollsConfirmed1P : roomState!.scrollsConfirmed2P}
          />
        )
      case 'summons':
        return (
          <SummonsPhase
            myRole={myRole as '1P' | '2P'}
            team1P={roomState!.team1P} team2P={roomState!.team2P}
            summons1P={roomState!.summons1P} summons2P={roomState!.summons2P}
            scrolls1P={roomState!.scrolls1P} scrolls2P={roomState!.scrolls2P}
            summonHistory1P={summonHistory1P} summonHistory2P={summonHistory2P}
            ninjas={ninjas} summons={summons} scrolls={scrolls}
            poolSummons={summons.filter(s => poolAllows(mySeatPool, 'summons', s.id))}
            order={order}
            search={search} setSearch={setSearch}
            onSelectSummonSlot={selectSummonSlot}
            onConfirm={confirmMySummons}
            isConfirmed={myRole === '1P' ? roomState!.summonsConfirmed1P : roomState!.summonsConfirmed2P}
          />
        )
      case 'done':
        return (
          <DonePhase
            onConfirmNextGame={confirmNextGame}
            myConfirmed={myRole === '1P' ? roomState!.nextGameConfirmed1P : roomState!.nextGameConfirmed2P}
          />
        )
      default:
        return null
    }
  }

  if (!roomId) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card className="overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRules(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-4 w-4" />
              武斗赛 BP 规则说明
            </span>
            {showRules
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {showRules && (
            <div className="px-6 pb-6 space-y-5 text-sm leading-relaxed">
              <div className="space-y-2">
                <p className="font-semibold">房间与席位</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>创建房间的一方为 1P，房间号由系统生成，6 位字符。</li>
                  <li>输入房间号加入的一方占用空出的玩家席位，优先 1P，其次 2P。两个席位都已占用时无法以玩家身份加入。</li>
                  <li>观众以观众身份加入，每个房间最多 5 名观众，只能查看，不能操作。</li>
                  <li>双方在等待页各自点击“开始 BP”后才进入禁用阶段。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">公 ban</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>等待页双方共同从忍者池添加禁用忍者，合计最多 10 名。</li>
                  <li>公 ban 的忍者本局全程不可被禁用和选用。任一方都可以添加和移除。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">禁用阶段</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>共 4 步，顺序为 1P、2P、2P、1P，每人禁用 2 名忍者。</li>
                  <li>已被公 ban、双方已禁用、双方已选用的忍者不会出现在可选列表中。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">选用阶段</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>共 6 步，顺序为 1P、2P、2P、1P、1P、2P，每人选用 3 名忍者。</li>
                  <li>已禁用的忍者不可选用，同一忍者不能重复选用。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">倒计时与超时</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>每个禁用、选用步骤有 60 秒倒计时。</li>
                  <li>倒计时归零仍未确认时，系统从当前可选池随机选一名并自动进入下一步，界面显示随机结果提示。</li>
                  <li>对手掉线或退出时，其步骤由在线一方在超时后随机推进，对局不会停在原地。</li>
                  <li>同一步骤只会由超时逻辑处理一次，不会重复随机。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">密卷配置</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>每人为自己的 3 名忍者各配 1 个密卷。</li>
                  <li>点击忍者下方的密卷槽位，再从下方网格点击密卷，最后点击“确认当前密卷”提交该槽位。</li>
                  <li>三个槽位全部提交后，“确认密卷配置”才可点击。双方都确认后进入通灵配置。</li>
                  <li>本阶段倒计时超时未确认时，系统随机补齐未提交的槽位并自动确认，已提交的槽位保持不变。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">通灵配置</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>每人为自己的 3 名忍者各配 1 个通灵，操作方式与密卷一致。</li>
                  <li>三个槽位全部提交后，“确认通灵配置”才可点击。双方都确认后进入结算。</li>
                  <li>本阶段倒计时超时未确认时，系统随机补齐并自动确认。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">结算与下一局</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>结算页显示双方本局阵容与密卷、通灵配置，双方各自点击确认下一局。</li>
                  <li>双方都确认后开启下一局，双方席位互换，先手方随之交换。</li>
                  <li>已使用过的密卷和通灵不会在同一方后续对局中重复出现。建房时开启“密卷通灵复用”后，每局重新可用，不受历史限制。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">显示与刷新</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>观众可以查看实时阵容、禁用、密卷、通灵和倒计时。</li>
                  <li>界面显示与房间状态不一致时，点击房间右上角“刷新”按钮重新拉取房间状态。</li>
                </ul>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">我的资料</h2>
          <p className="text-sm text-muted-foreground">昵称和头像会显示在 BP 界面左右两侧，左侧为 1P、右侧为 2P，供双方辨认身份。两项都可以不填。</p>
          <div className="space-y-2">
            <Label htmlFor="player-name" className="text-sm">昵称</Label>
            <Input
              id="player-name"
              value={myName}
              onChange={e => setMyName(e.target.value)}
              placeholder="留空则显示为 1P 或 2P"
              maxLength={12}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border overflow-hidden flex items-center justify-center bg-muted/30 shrink-0">
              {myAvatar
                ? <Image src={myAvatar} alt="" className="w-full h-full object-cover" />
                : <UserRound className="h-5 w-5 text-muted-foreground" />}
            </div>
            <Button variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()}>
              上传头像
            </Button>
            {myAvatar && (
              <Button variant="ghost" size="sm" onClick={() => setMyAvatar(null)}>移除</Button>
            )}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
          </div>
          {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
          <div className="flex items-center justify-between gap-3 border-t pt-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">我的忍者池</p>
              <p className="truncate text-xs text-muted-foreground">{poolSummary(myPool)}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPoolDialog(true)}>设置</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">创建房间</h2>
          <p className="text-sm text-muted-foreground mb-4">你将作为 1P 开始对局</p>
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="reuse-switch" className="text-sm cursor-pointer select-none">
              密卷通灵复用
            </Label>
            <Switch
              id="reuse-switch"
              checked={reuseSwitch}
              onCheckedChange={setReuseSwitch}
            />
          </div>
          <Button onClick={createRoom} className="w-full">创建新房间</Button>
        </Card>
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold">加入房间</h2>
          <Input value={joinRoomId} onChange={e => setJoinRoomId(e.target.value.toUpperCase())} placeholder="输入房间号" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={() => joinRoom(false)} className="flex-1">加入（玩家）</Button>
            <Button onClick={() => joinRoom(true)} variant="secondary" className="flex-1">以观众加入</Button>
          </div>
        </Card>

        <PoolSettingsDialog
          open={showPoolDialog}
          onOpenChange={setShowPoolDialog}
          ninjas={ninjas}
          scrolls={scrolls}
          summons={summons}
          pool={myPool}
          onChange={setMyPool}
        />
      </div>
    )
  }

  if (!roomState || !myRole) return <p className="text-center">加载中...</p>

  if (roomState.phase === 'waiting') {
    const bothPlayersPresent = roomState.player1PId && roomState.player2PId
    const myStartConfirmed = myRole === '1P' ? roomState.startConfirmed1P : roomState.startConfirmed2P
    const canStart = bothPlayersPresent && !myStartConfirmed

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">房间 {roomId}</Badge>
            <Badge variant="secondary">你当前是 {myRole === 'spectator' ? '观众' : myRole}</Badge>
            <Badge variant={roomState.player1PId ? 'default' : 'secondary'}>1P {roomState.player1PId ? '✓' : '空'}</Badge>
            <Badge variant={roomState.player2PId ? 'default' : 'secondary'}>2P {roomState.player2PId ? '✓' : '空'}</Badge>
            {isSpectator && (
              <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> 观众 {roomState.spectators.length}/{MAX_SPECTATORS}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 刷新
            </Button>
            <Button variant="outline" size="sm" onClick={leaveRoom}>退出房间</Button>
          </div>
        </div>
        <Card className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex-1" />
              <h3 className="font-semibold text-center">公 ban（全局禁用忍者）</h3>
              <div className="flex-1 flex justify-end">
                {!isSpectator && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="public-ban-tier-toggle" className="text-xs cursor-pointer select-none">
                      按梯度分组
                    </Label>
                    <Switch
                      id="public-ban-tier-toggle"
                      checked={publicBanTierGrouping}
                      onCheckedChange={setPublicBanTierGrouping}
                    />
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-3">
              双方共同选择最多 {MAX_PUBLIC_BAN} 名忍者，本局对战全程禁用
            </p>
            {roomState.publicBan.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {roomState.publicBan.map(id => {
                  const ninja = ninjas.find(n => n.id === id)
                  return ninja ? (
                    <div key={id} className="relative group">
                      <div className="w-14 h-14 border rounded overflow-hidden">
                        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                      </div>
                      {!isSpectator && (
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
            {!isSpectator && roomState.publicBan.length < MAX_PUBLIC_BAN && (
              <>
                <div className="relative max-w-md mx-auto mt-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={publicBanSearch}
                    onChange={e => setPublicBanSearch(e.target.value)}
                    placeholder="搜索忍者添加公 ban..."
                    className="pl-9 pr-9"
                  />
                  {publicBanSearch && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setPublicBanSearch('')}><X className="h-4 w-4" /></Button>}
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 mt-2">
                  {publicBanNinjas.map(group => (
                    <div key={group.tier}>
                      {group.tier !== '全部' && (
                        <Badge variant="outline" className="mb-1 text-sm font-bold">{group.tier}</Badge>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {group.ninjas.map(ninja => (
                          <div
                            key={ninja.id}
                            className={`cursor-pointer rounded-md overflow-hidden border transition-colors ${
                              (roomState?.publicBan || []).includes(ninja.id)
                                ? 'border-primary ring-2 ring-primary'
                                : 'border-border/40 hover:border-primary/60'
                            }`}
                            onClick={() => togglePublicBan(ninja.id)}
                          >
                            <div className="w-11 h-11 bg-card">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {isSpectator && roomState.publicBan.length >= MAX_PUBLIC_BAN && (
              <p className="text-sm text-muted-foreground text-center">公ban已达上限</p>
            )}
            {roomState.reuseScrollSummon && (
              <p className="text-xs text-muted-foreground text-center mt-2">通灵密卷复用已开启</p>
            )}
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">等待双方就位…</h3>
            {!bothPlayersPresent ? (
              <p className="text-muted-foreground">等待玩家加入</p>
            ) : isSpectator ? (
              <p className="text-muted-foreground">观众等待双方确认开始对局</p>
            ) : (
              <div className="space-y-2">
                {myStartConfirmed ? (
                  <p className="text-muted-foreground">已确认开始，等待对手确认…</p>
                ) : (
                  <Button onClick={confirmStart} className="w-48">开始 BP</Button>
                )}
                {roomState.startConfirmed1P && <Badge variant="default" className="mr-2">1P 已就绪</Badge>}
                {roomState.startConfirmed2P && <Badge variant="default">2P 已就绪</Badge>}
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">房间 {roomId}</Badge>
          <Badge variant="secondary">你当前是 {isSpectator ? '观众' : myRole}</Badge>
          <Badge variant="outline">第 {roomState.gameNumber} 局</Badge>
          <Badge variant={roomState.player1PId ? 'default' : 'secondary'}>1P {roomState.player1PId ? '✓' : '空'}</Badge>
          <Badge variant={roomState.player2PId ? 'default' : 'secondary'}>2P {roomState.player2PId ? '✓' : '空'}</Badge>
          {isSpectator && (
            <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> 观众 {roomState.spectators.length}/{MAX_SPECTATORS}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          {historyRecords.length > 0 && isSpectator && (
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="gap-1">
              <History className="h-4 w-4" /> 过往小局
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 刷新
          </Button>
          <Button variant="outline" size="sm" onClick={leaveRoom}>退出房间</Button>
        </div>
      </div>

      {/* ban/pick 阶段的显示开关 */}
      {(roomState.phase === 'ban' || roomState.phase === 'pick') && !isSpectator && (
        <div className="flex items-center justify-end gap-2">
          <Label htmlFor="tier-grouping-toggle" className="text-sm cursor-pointer select-none">
            按梯度分组
          </Label>
          <Switch
            id="tier-grouping-toggle"
            checked={showTierGrouping}
            onCheckedChange={setShowTierGrouping}
          />
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 self-start">
            <div className={`h-11 w-11 rounded-full overflow-hidden border flex items-center justify-center bg-muted/30 ${myRole === '1P' ? 'ring-2 ring-primary' : ''}`}>
              {roomState.player1PAvatar
                ? <Image src={roomState.player1PAvatar} alt="" className="h-full w-full object-cover" />
                : <UserRound className="h-5 w-5 text-muted-foreground" />}
            </div>
            <span
              className={`max-w-[64px] truncate text-center text-xs leading-tight ${myRole === '1P' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              title={roomState.player1PName || '1P'}
            >
              {roomState.player1PName || '1P'}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            {roomState.deadline && (
              <div className="flex justify-center mb-4">
                <Badge variant="destructive" className="text-lg px-4 py-2 gap-2">
                  <Clock className="h-5 w-5" /> {remainingSeconds}s
                </Badge>
              </div>
            )}
            {timeoutNotice && (
              <p className="text-center text-xs text-amber-600 mb-3">{timeoutNotice}</p>
            )}

            {renderBanDisplay()}
            {roomState.phase !== 'ban' && renderTeamDisplay()}
            {renderPhase()}
          </div>

          <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 self-start">
            <div className={`h-11 w-11 rounded-full overflow-hidden border flex items-center justify-center bg-muted/30 ${myRole === '2P' ? 'ring-2 ring-primary' : ''}`}>
              {roomState.player2PAvatar
                ? <Image src={roomState.player2PAvatar} alt="" className="h-full w-full object-cover" />
                : <UserRound className="h-5 w-5 text-muted-foreground" />}
            </div>
            <span
              className={`max-w-[64px] truncate text-center text-xs leading-tight ${myRole === '2P' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              title={roomState.player2PName || '2P'}
            >
              {roomState.player2PName || '2P'}
            </span>
          </div>
        </div>
      </Card>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-10">
              <DialogTitle>过往小局阵容</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlignHistory(v => !v)}
              >
                {alignHistory ? '按 1P/2P 排列' : '固定在一侧'}
              </Button>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto space-y-8">
            {historyRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">暂无过往对局</p>
            ) : (
              historyRecords.map((record, idx) => {
                const swap = alignHistory && (isHistoryPlayer
                  ? record.player2PId === myPlayerId
                  : idx % 2 === 1)
                const leftRole: '1P' | '2P' = swap ? '2P' : '1P'
                const rightRole: '1P' | '2P' = swap ? '1P' : '2P'
                return (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">第 {record.gameNumber} 小局</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      {renderHistorySide(record, leftRole, swap)}
                      {renderHistorySide(record, rightRole, swap)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}