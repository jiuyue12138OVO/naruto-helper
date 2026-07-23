import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '@/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { Clock } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import BanPhase from './BanPhase'
import PickPhase from './PickPhase'
import ScrollsPhase from './ScrollsPhase'
import SummonsPhase from './SummonsPhase'
import DonePhase from './DonePhase'
import type { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const COUNTDOWN_SECONDS = 60

type Phase = 'ban' | 'pick' | 'scrolls' | 'summons' | 'done'

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
  player1PId: string
  player2PId: string | null
  deadline: number | null
  currentPlayer: '1P' | '2P' | null
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
  phase: 'ban',
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
  deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
  currentPlayer: '1P',
})

export default function BPRoomPage() {
  const { ninjas, scrolls, summons } = useData()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<'1P' | '2P' | null>(null)
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS)
  const [pendingSelection, setPendingSelection] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastStateRef = useRef<string>('')

  // 实时监听房间状态（仅当关键字段变化时更新）
  useEffect(() => {
    if (!roomId) return
    const channel = supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.new) {
            const newState = (payload.new as any).state as RoomState
            const key = `${newState.phase}-${newState.banStep}-${newState.pickStep}-${newState.currentPlayer}-${newState.scrollsConfirmed1P}-${newState.scrollsConfirmed2P}-${newState.summonsConfirmed1P}-${newState.summonsConfirmed2P}`
            if (key !== lastStateRef.current) {
              lastStateRef.current = key
              setRoomState(newState)
            }
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
      if (data) {
        const newState = data.state as RoomState
        setRoomState(newState)
        lastStateRef.current = `${newState.phase}-${newState.banStep}-${newState.pickStep}-${newState.currentPlayer}-${newState.scrollsConfirmed1P}-${newState.scrollsConfirmed2P}-${newState.summonsConfirmed1P}-${newState.summonsConfirmed2P}`
      }
    }
    load()
  }, [roomId])

  // 乐观更新房间
  const updateRoom = useCallback(async (updates: Partial<RoomState>) => {
    if (!roomId) return
    setRoomState(prev => {
      if (!prev) return prev
      let changed = false
      const newState: RoomState = { ...prev }
      const keys = Object.keys(updates) as (keyof RoomState)[]
      for (const key of keys) {
        if ((updates as any)[key] !== undefined && (updates as any)[key] !== prev[key]) {
          changed = true
          ;(newState as any)[key] = (updates as any)[key]
        }
      }
      if (!changed) return prev
      supabase.from('rooms').upsert({ id: roomId, state: newState }).then()
      lastStateRef.current = `${newState.phase}-${newState.banStep}-${newState.pickStep}-${newState.currentPlayer}-${newState.scrollsConfirmed1P}-${newState.scrollsConfirmed2P}-${newState.summonsConfirmed1P}-${newState.summonsConfirmed2P}`
      return newState
    })
  }, [roomId])

  const fetchLatestState = useCallback(async () => {
    if (!roomId) return
    const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
    if (data) {
      const newState = data.state as RoomState
      const key = `${newState.phase}-${newState.banStep}-${newState.pickStep}-${newState.currentPlayer}-${newState.scrollsConfirmed1P}-${newState.scrollsConfirmed2P}-${newState.summonsConfirmed1P}-${newState.summonsConfirmed2P}`
      if (key !== lastStateRef.current) {
        lastStateRef.current = key
        setRoomState(newState)
      }
    }
  }, [roomId])

  const leaveRoom = useCallback(async () => {
    if (!roomId || !myRole || !roomState) return
    if (myRole === '1P') {
      await updateRoom({ player1PId: '' as any })
    } else {
      await updateRoom({ player2PId: null as any })
    }
    setRoomId(null)
    setMyRole(null)
    setRoomState(null)
  }, [roomId, myRole, roomState, updateRoom])

  const generatePlayerId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6)

  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    const playerId = generatePlayerId()
    const init = emptyRoomState(playerId)
    setRoomId(id); setMyRole('1P'); setRoomState(init)
    lastStateRef.current = `${init.phase}-${init.banStep}-${init.pickStep}-${init.currentPlayer}-${init.scrollsConfirmed1P}-${init.scrollsConfirmed2P}-${init.summonsConfirmed1P}-${init.summonsConfirmed2P}`
    supabase.from('rooms').upsert({ id, state: init }).then()
  }

  const joinRoom = async () => {
    const id = joinRoomId.trim().toUpperCase()
    if (!id) return
    const { data } = await supabase.from('rooms').select('state').eq('id', id).single()
    if (!data) { setError('房间不存在'); return }
    const state = data.state as RoomState
    if (state.player2PId) { setError('房间已满'); return }
    if (state.phase !== 'ban' || state.gameNumber !== 1) { setError('对局已开始，无法加入'); return }
    const newPlayerId = generatePlayerId()
    setRoomId(id); setMyRole('2P'); setRoomState({ ...state, player2PId: newPlayerId })
    lastStateRef.current = `${state.phase}-${state.banStep}-${state.pickStep}-${state.currentPlayer}-${state.scrollsConfirmed1P}-${state.scrollsConfirmed2P}-${state.summonsConfirmed1P}-${state.summonsConfirmed2P}`
    await supabase.from('rooms').upsert({ id, state: { ...state, player2PId: newPlayerId } })
    setError('')
  }

  const isMyTurn = useMemo(() => {
    if (!roomState || !myRole) return false
    if (roomState.phase === 'ban' || roomState.phase === 'pick') return roomState.currentPlayer === myRole
    if (roomState.phase === 'scrolls') return !(myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P)
    if (roomState.phase === 'summons') return !(myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P)
    return false
  }, [roomState, myRole])

  const availableNinjas = useMemo(() => {
    if (!roomState) return []
    const banned = new Set([...roomState.ban1P.filter(Boolean), ...roomState.ban2P.filter(Boolean)])
    return ninjas.filter(n => !roomState.usedNinjas.includes(n.id) && !banned.has(n.id))
  }, [roomState, ninjas])

  const handleTimeout = useCallback(() => {
    if (!roomState || !myRole) return
    if ((roomState.phase === 'ban' || roomState.phase === 'pick') && isMyTurn) {
      const pool = availableNinjas
      if (pool.length === 0) return
      confirmSelection(pool[Math.floor(Math.random() * pool.length)].id)
    } else if (roomState.phase === 'scrolls' && !(myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P)) {
      const current = myRole === '1P' ? [...roomState.scrolls1P] : [...roomState.scrolls2P]
      const history = myRole === '1P' ? new Set(roomState.myScrollHistory) : new Set(roomState.opponentScrollHistory)
      const pool = scrolls.filter(s => !history.has(s.id) && !current.includes(s.id))
      const newScrolls = current.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
      updateRoom(myRole === '1P' ? { scrolls1P: newScrolls, scrollsConfirmed1P: true } : { scrolls2P: newScrolls, scrollsConfirmed2P: true })
    } else if (roomState.phase === 'summons' && !(myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P)) {
      const current = myRole === '1P' ? [...roomState.summons1P] : [...roomState.summons2P]
      const history = myRole === '1P' ? new Set(roomState.mySummonHistory) : new Set(roomState.opponentSummonHistory)
      const pool = summons.filter(s => !history.has(s.id) && !current.includes(s.id))
      const newSummons = current.map(s => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
      updateRoom(myRole === '1P' ? { summons1P: newSummons, summonsConfirmed1P: true } : { summons2P: newSummons, summonsConfirmed2P: true })
    }
  }, [roomState, myRole, isMyTurn, availableNinjas, scrolls, summons, updateRoom])

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

  // 阶段自动推进
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

  const nextGame = () => {
    if (!roomState || !myRole) return
    const mySH = myRole === '1P' ? [...(roomState.myScrollHistory || []), ...roomState.scrolls1P.filter(Boolean) as string[]] : [...(roomState.opponentScrollHistory || []), ...roomState.scrolls2P.filter(Boolean) as string[]]
    const opSH = myRole === '1P' ? [...(roomState.opponentScrollHistory || []), ...roomState.scrolls2P.filter(Boolean) as string[]] : [...(roomState.myScrollHistory || []), ...roomState.scrolls1P.filter(Boolean) as string[]]
    const mySuH = myRole === '1P' ? [...(roomState.mySummonHistory || []), ...roomState.summons1P.filter(Boolean) as string[]] : [...(roomState.opponentSummonHistory || []), ...roomState.summons2P.filter(Boolean) as string[]]
    const opSuH = myRole === '1P' ? [...(roomState.opponentSummonHistory || []), ...roomState.summons2P.filter(Boolean) as string[]] : [...(roomState.mySummonHistory || []), ...roomState.summons1P.filter(Boolean) as string[]]

    updateRoom({
      gameNumber: roomState.gameNumber + 1,
      firstPlayer: roomState.firstPlayer === '1P' ? '2P' : '1P',
      phase: 'ban', banStep: 0, pickStep: 0,
      ban1P: [null, null], ban2P: [null, null],
      team1P: [null, null, null], team2P: [null, null, null],
      scrolls1P: [null, null, null], scrolls2P: [null, null, null],
      scrollsConfirmed1P: false, scrollsConfirmed2P: false,
      summons1P: [null, null, null], summons2P: [null, null, null],
      summonsConfirmed1P: false, summonsConfirmed2P: false,
      deadline: Date.now() + COUNTDOWN_SECONDS * 1000,
      currentPlayer: BAN_STEPS[0].player,
      myScrollHistory: mySH, opponentScrollHistory: opSH,
      mySummonHistory: mySuH, opponentSummonHistory: opSuH,
    })
  }

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

  if (!roomState) return <p className="text-center">加载中...</p>

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
            myRole={myRole!}
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
            myRole={myRole!}
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
        return <DonePhase onNextGame={nextGame} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">房间 {roomId}</Badge>
          <Badge variant="secondary">{myRole === '1P' ? '你是一号位 (1P)' : '你是二号位 (2P)'}</Badge>
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