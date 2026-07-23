import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from '@/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { Search, X, RotateCcw } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

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

export default function BPRoomPage() {
  const { ninjas, scrolls, summons } = useData()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<'1P' | '2P' | null>(null)
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)

  const [pendingSelection, setPendingSelection] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // 实时监听房间状态
  useEffect(() => {
    if (!roomId) return
    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.new) {
            setRoomState((payload.new as any).state)
          }
        }
      )
      .subscribe()
    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  // 初次加载房间状态
  useEffect(() => {
    if (!roomId) return
    const load = async () => {
      const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single()
      if (data) setRoomState(data.state)
    }
    load()
  }, [roomId])

  // 更新房间
  const updateRoom = useCallback(
    async (updates: Partial<RoomState>) => {
      if (!roomId || !roomState) return
      const newState = { ...roomState, ...updates }
      await supabase.from('rooms').upsert({ id: roomId, state: newState })
    },
    [roomId, roomState]
  )

  // 创建房间
  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    const init: RoomState = {
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
    }
    await supabase.from('rooms').upsert({ id, state: init })
    setRoomId(id)
    setMyRole('1P')
  }

  // 加入房间
  const joinRoom = async () => {
    const id = joinRoomId.trim().toUpperCase()
    if (!id) return
    const { data, error: dbError } = await supabase.from('rooms').select('state').eq('id', id).single()
    if (!data) {
      setError('房间不存在')
      return
    }
    const state = data.state as RoomState
    if (state.phase !== 'ban' || state.gameNumber !== 1) {
      setError('对局已开始，无法加入')
      return
    }
    setRoomId(id)
    setMyRole('2P')
    setError('')
  }

  // 是否轮到自己（ban/pick）
  const isMyTurn = useMemo(() => {
    if (!roomState || !myRole) return false
    const { phase, banStep, pickStep } = roomState
    if (phase === 'ban' && banStep < 4) {
      return BAN_STEPS[banStep].player === myRole
    }
    if (phase === 'pick' && pickStep < 6) {
      return PICK_STEPS[pickStep].player === myRole
    }
    return false
  }, [roomState, myRole])

  // 同时操作阶段
  const isSimultaneous = roomState?.phase === 'scrolls' || roomState?.phase === 'summons'

  const iAmConfirmed = useMemo(() => {
    if (!roomState || !myRole) return false
    if (roomState.phase === 'scrolls') return myRole === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P
    if (roomState.phase === 'summons') return myRole === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P
    return false
  }, [roomState, myRole])

  const opponentConfirmed = useMemo(() => {
    if (!roomState || !myRole) return false
    const opponent = myRole === '1P' ? '2P' : '1P'
    if (roomState.phase === 'scrolls') return opponent === '1P' ? roomState.scrollsConfirmed1P : roomState.scrollsConfirmed2P
    if (roomState.phase === 'summons') return opponent === '1P' ? roomState.summonsConfirmed1P : roomState.summonsConfirmed2P
    return false
  }, [roomState, myRole])

  // 可用忍者池
  const availableNinjas = useMemo(() => {
    if (!roomState) return []
    const banned = new Set([...roomState.ban1P.filter(Boolean), ...roomState.ban2P.filter(Boolean)])
    return ninjas.filter((n) => !roomState.usedNinjas.includes(n.id) && !banned.has(n.id))
  }, [roomState, ninjas])

  const filteredNinjas = useMemo(() => {
    if (!search) return availableNinjas
    const kw = search.toLowerCase()
    return availableNinjas.filter((n) => n.name.toLowerCase().includes(kw))
  }, [availableNinjas, search])

  const groupedNinjas = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach((tier) => {
      const tierNinjas = filteredNinjas.filter((n) => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [filteredNinjas])

  // 我的历史池
  const myScrollHistory = useMemo(() => {
    if (!roomState || !myRole) return new Set<string>()
    return new Set(myRole === '1P' ? roomState.myScrollHistory || [] : roomState.opponentScrollHistory || [])
  }, [roomState, myRole])

  const mySummonHistory = useMemo(() => {
    if (!roomState || !myRole) return new Set<string>()
    return new Set(myRole === '1P' ? roomState.mySummonHistory || [] : roomState.opponentSummonHistory || [])
  }, [roomState, myRole])

  // 我的当前选择
  const myScrolls = myRole === '1P' ? roomState?.scrolls1P : roomState?.scrolls2P
  const mySummons = myRole === '1P' ? roomState?.summons1P : roomState?.summons2P

  const availableScrolls = useMemo(() => {
    if (!myScrolls) return []
    const used = new Set(myScrolls.filter(Boolean) as string[])
    return scrolls.filter((s) => !myScrollHistory.has(s.id) && !used.has(s.id))
  }, [scrolls, myScrollHistory, myScrolls])

  const availableSummons = useMemo(() => {
    if (!mySummons) return []
    const used = new Set(mySummons.filter(Boolean) as string[])
    return summons.filter((s) => !mySummonHistory.has(s.id) && !used.has(s.id))
  }, [summons, mySummonHistory, mySummons])

  const filteredScrolls = useMemo(() => {
    if (!search) return availableScrolls
    return availableScrolls.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  }, [availableScrolls, search])

  const filteredSummons = useMemo(() => {
    if (!search) return availableSummons
    return availableSummons.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  }, [availableSummons, search])

  // 倒计时与随机
  useEffect(() => {
    const needCountdown = isMyTurn || (isSimultaneous && !iAmConfirmed)
    if (needCountdown) {
      setCountdown(COUNTDOWN_SECONDS)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleRandom()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setCountdown(COUNTDOWN_SECONDS)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isMyTurn, isSimultaneous, iAmConfirmed, roomState?.phase])

  const handleRandom = useCallback(() => {
    if (!roomState || !myRole) return
    if (isMyTurn) {
      const pool = availableNinjas
      if (pool.length === 0) return
      const randomNinja = pool[Math.floor(Math.random() * pool.length)]
      confirmSelection(randomNinja.id)
    } else if (isSimultaneous && !iAmConfirmed) {
      if (roomState.phase === 'scrolls') {
        const current = myRole === '1P' ? [...roomState.scrolls1P] : [...roomState.scrolls2P]
        const history = myRole === '1P' ? new Set(roomState.myScrollHistory) : new Set(roomState.opponentScrollHistory)
        const pool = scrolls.filter((s) => !history.has(s.id) && !current.includes(s.id))
        const newScrolls = current.map((s) => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(myRole === '1P' ? { scrolls1P: newScrolls, scrollsConfirmed1P: true } : { scrolls2P: newScrolls, scrollsConfirmed2P: true })
      } else if (roomState.phase === 'summons') {
        const current = myRole === '1P' ? [...roomState.summons1P] : [...roomState.summons2P]
        const history = myRole === '1P' ? new Set(roomState.mySummonHistory) : new Set(roomState.opponentSummonHistory)
        const pool = summons.filter((s) => !history.has(s.id) && !current.includes(s.id))
        const newSummons = current.map((s) => s || (pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id : null))
        updateRoom(myRole === '1P' ? { summons1P: newSummons, summonsConfirmed1P: true } : { summons2P: newSummons, summonsConfirmed2P: true })
      }
    }
  }, [roomState, myRole, isMyTurn, iAmConfirmed, availableNinjas, scrolls, summons, updateRoom])

  // 确认选择（ban/pick）
  const confirmSelection = (ninjaId: string) => {
    if (!roomState || !myRole) return
    const { phase, banStep, pickStep } = roomState
    if (phase === 'ban') {
      const step = BAN_STEPS[banStep]
      const newBan = step.player === '1P' ? [...roomState.ban1P] : [...roomState.ban2P]
      newBan[step.index] = ninjaId
      updateRoom({ [step.player === '1P' ? 'ban1P' : 'ban2P']: newBan, banStep: banStep + 1 })
    } else if (phase === 'pick') {
      const step = PICK_STEPS[pickStep]
      const newTeam = step.player === '1P' ? [...roomState.team1P] : [...roomState.team2P]
      newTeam[step.index] = ninjaId
      updateRoom({
        [step.player === '1P' ? 'team1P' : 'team2P']: newTeam,
        usedNinjas: [...roomState.usedNinjas, ninjaId],
        pickStep: pickStep + 1,
      })
    }
    setPendingSelection(null)
  }

  // 密卷/通灵选择槽位
  const selectScrollSlot = (index: number, scrollId: string | null) => {
    if (!myRole || !myScrolls) return
    const newScrolls = [...myScrolls]
    newScrolls[index] = scrollId
    updateRoom(myRole === '1P' ? { scrolls1P: newScrolls } : { scrolls2P: newScrolls })
  }

  const selectSummonSlot = (index: number, summonId: string | null) => {
    if (!myRole || !mySummons) return
    const newSummons = [...mySummons]
    newSummons[index] = summonId
    updateRoom(myRole === '1P' ? { summons1P: newSummons } : { summons2P: newSummons })
  }

  const confirmMyScrolls = () => {
    if (!myRole || myScrolls?.some((s) => !s)) return
    updateRoom(myRole === '1P' ? { scrollsConfirmed1P: true } : { scrollsConfirmed2P: true })
  }

  const confirmMySummons = () => {
    if (!myRole || mySummons?.some((s) => !s)) return
    updateRoom(myRole === '1P' ? { summonsConfirmed1P: true } : { summonsConfirmed2P: true })
  }

  // 阶段自动推进
  useEffect(() => {
    if (!roomState) return
    if (roomState.phase === 'ban' && roomState.banStep >= 4) updateRoom({ phase: 'pick', pickStep: 0 })
    if (roomState.phase === 'pick' && roomState.pickStep >= 6) updateRoom({ phase: 'scrolls', scrollsConfirmed1P: false, scrollsConfirmed2P: false })
    if (roomState.phase === 'scrolls' && roomState.scrollsConfirmed1P && roomState.scrollsConfirmed2P) updateRoom({ phase: 'summons', summonsConfirmed1P: false, summonsConfirmed2P: false })
    if (roomState.phase === 'summons' && roomState.summonsConfirmed1P && roomState.summonsConfirmed2P) updateRoom({ phase: 'done' })
  }, [roomState?.banStep, roomState?.pickStep, roomState?.scrollsConfirmed1P, roomState?.scrollsConfirmed2P, roomState?.summonsConfirmed1P, roomState?.summonsConfirmed2P])

  // 下一局
  const nextGame = async () => {
    if (!roomState || !myRole) return
    const newFirst = roomState.firstPlayer === '1P' ? '2P' : '1P'
    const myScrollHistoryArr = myRole === '1P'
      ? [...(roomState.myScrollHistory || []), ...roomState.scrolls1P.filter(Boolean) as string[]]
      : [...(roomState.opponentScrollHistory || []), ...roomState.scrolls2P.filter(Boolean) as string[]]
    const opponentScrollHistoryArr = myRole === '1P'
      ? [...(roomState.opponentScrollHistory || []), ...roomState.scrolls2P.filter(Boolean) as string[]]
      : [...(roomState.myScrollHistory || []), ...roomState.scrolls1P.filter(Boolean) as string[]]
    const mySummonHistoryArr = myRole === '1P'
      ? [...(roomState.mySummonHistory || []), ...roomState.summons1P.filter(Boolean) as string[]]
      : [...(roomState.opponentSummonHistory || []), ...roomState.summons2P.filter(Boolean) as string[]]
    const opponentSummonHistoryArr = myRole === '1P'
      ? [...(roomState.opponentSummonHistory || []), ...roomState.summons2P.filter(Boolean) as string[]]
      : [...(roomState.mySummonHistory || []), ...roomState.summons1P.filter(Boolean) as string[]]

    updateRoom({
      gameNumber: roomState.gameNumber + 1,
      firstPlayer: newFirst,
      phase: 'ban',
      banStep: 0,
      pickStep: 0,
      ban1P: [null, null],
      ban2P: [null, null],
      team1P: [null, null, null],
      team2P: [null, null, null],
      scrolls1P: [null, null, null],
      scrolls2P: [null, null, null],
      scrollsConfirmed1P: false,
      scrollsConfirmed2P: false,
      summons1P: [null, null, null],
      summons2P: [null, null, null],
      summonsConfirmed1P: false,
      summonsConfirmed2P: false,
      myScrollHistory: myScrollHistoryArr,
      opponentScrollHistory: opponentScrollHistoryArr,
      mySummonHistory: mySummonHistoryArr,
      opponentSummonHistory: opponentSummonHistoryArr,
    })
  }

  // 渲染主操作区域
  const renderMainArea = () => {
    if (!roomState || !myRole) return null
    if (roomState.phase === 'ban' || roomState.phase === 'pick') {
      return (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
            {search && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
          </div>
          <div className="max-h-80 overflow-y-auto space-y-4">
            {groupedNinjas.map((group) => (
              <div key={group.tier}>
                <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {group.ninjas.map((ninja) => (
                    <div
                      key={ninja.id}
                      className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${pendingSelection === ninja.id ? 'bg-primary/10 border-2 border-red-500' : 'hover:bg-muted/50'}`}
                      onClick={() => isMyTurn && setPendingSelection(ninja.id)}
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-center leading-tight">{ninja.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {isMyTurn && pendingSelection && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => confirmSelection(pendingSelection)}>确认选择</Button>
            </div>
          )}
        </div>
      )
    }

    if (roomState.phase === 'scrolls' && !iAmConfirmed) {
      const myTeam = myRole === '1P' ? roomState.team1P : roomState.team2P
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-center">选择密卷 (倒计时: {countdown}s)</h3>
          <div className="flex justify-center gap-4">
            {myTeam.map((ninjaId, idx) => {
              const ninja = ninjas.find((n) => n.id === ninjaId)
              return (
                <div key={idx} className="flex flex-col items-center gap-2 p-2 border rounded-lg">
                  <Image src={ninja?.imageUrl} alt="" className="w-16 h-16 rounded" />
                  <span className="text-xs">{ninja?.name}</span>
                  <div className="w-12 h-12 border rounded flex items-center justify-center cursor-pointer hover:border-primary">
                    {myScrolls?.[idx] ? <Image src={scrolls.find((s) => s.id === myScrolls[idx])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">+</span>}
                  </div>
                  {myScrolls?.[idx] && (
                    <Button size="sm" variant="ghost" onClick={() => selectScrollSlot(idx, null)}>清除</Button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索密卷..." className="pl-9 pr-9" />
            {search && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {filteredScrolls.map((scroll) => {
              const isUsed = myScrolls?.includes(scroll.id)
              return (
                <div
                  key={scroll.id}
                  className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg ${isUsed ? 'opacity-50' : 'hover:bg-muted/50'}`}
                  onClick={() => {
                    if (isUsed) return
                    const targetIdx = myScrolls?.findIndex((s) => !s)
                    if (targetIdx !== undefined && targetIdx >= 0) selectScrollSlot(targetIdx, scroll.id)
                  }}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                    <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-center leading-tight">{scroll.name}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={confirmMyScrolls} disabled={myScrolls?.some((s) => !s)}>确认密卷</Button>
          </div>
        </div>
      )
    }

    if (roomState.phase === 'summons' && !iAmConfirmed) {
      const myTeam = myRole === '1P' ? roomState.team1P : roomState.team2P
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-center">选择通灵 (倒计时: {countdown}s)</h3>
          <div className="flex justify-center gap-4">
            {myTeam.map((ninjaId, idx) => {
              const ninja = ninjas.find((n) => n.id === ninjaId)
              return (
                <div key={idx} className="flex flex-col items-center gap-2 p-2 border rounded-lg">
                  <Image src={ninja?.imageUrl} alt="" className="w-16 h-16 rounded" />
                  <span className="text-xs">{ninja?.name}</span>
                  <div className="w-12 h-12 border rounded flex items-center justify-center cursor-pointer hover:border-primary">
                    {mySummons?.[idx] ? <Image src={summons.find((s) => s.id === mySummons[idx])?.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">+</span>}
                  </div>
                  {mySummons?.[idx] && (
                    <Button size="sm" variant="ghost" onClick={() => selectSummonSlot(idx, null)}>清除</Button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索通灵..." className="pl-9 pr-9" />
            {search && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {filteredSummons.map((summon) => {
              const isUsed = mySummons?.includes(summon.id)
              return (
                <div
                  key={summon.id}
                  className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg ${isUsed ? 'opacity-50' : 'hover:bg-muted/50'}`}
                  onClick={() => {
                    if (isUsed) return
                    const targetIdx = mySummons?.findIndex((s) => !s)
                    if (targetIdx !== undefined && targetIdx >= 0) selectSummonSlot(targetIdx, summon.id)
                  }}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                    <Image src={summon.imageUrl} alt={summon.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-center leading-tight">{summon.name}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={confirmMySummons} disabled={mySummons?.some((s) => !s)}>确认通灵</Button>
          </div>
        </div>
      )
    }

    if (roomState.phase === 'done') {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-primary">本局 BP 完成！</p>
          <Button onClick={nextGame}>进入下一局</Button>
        </div>
      )
    }

    return <p className="text-center text-muted-foreground">等待中...</p>
  }

  // 未加入房间界面
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
          <Input value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())} placeholder="输入房间号" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={joinRoom} className="w-full">加入</Button>
        </Card>
      </div>
    )
  }

  if (!roomState) return <p className="text-center">加载中...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">房间 {roomId}</Badge>
          <Badge variant="secondary">{myRole === '1P' ? '你是一号位 (1P)' : '你是二号位 (2P)'}</Badge>
          <Badge variant="outline">第 {roomState.gameNumber} 局</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setRoomId(null); setMyRole(null) }}>退出房间</Button>
      </div>

      <Card className="p-6">
        <div className="mb-4 text-center">
          {roomState.phase === 'ban' && <p className="font-semibold">{isMyTurn ? '轮到你了：禁选忍者' : '等待对方禁选...'}</p>}
          {roomState.phase === 'pick' && <p className="font-semibold">{isMyTurn ? '轮到你了：选择忍者' : '等待对方选择...'}</p>}
          {roomState.phase === 'scrolls' && !iAmConfirmed && <p className="font-semibold">轮到你了：选择密卷</p>}
          {roomState.phase === 'summons' && !iAmConfirmed && <p className="font-semibold">轮到你了：选择通灵</p>}
          {roomState.phase === 'done' && <p className="font-semibold">本局结束</p>}
          {(isMyTurn || (isSimultaneous && !iAmConfirmed)) && <Badge variant="destructive" className="ml-2">{countdown}s</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-center mb-2">1P</h3>
            <div className="flex justify-center gap-2">
              {roomState.team1P.map((id, i) => {
                const ninja = ninjas.find((n) => n.id === id)
                return (
                  <div key={i} className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-center mb-2">2P</h3>
            <div className="flex justify-center gap-2">
              {roomState.team2P.map((id, i) => {
                const ninja = ninjas.find((n) => n.id === id)
                return (
                  <div key={i} className="w-16 h-16 border rounded flex items-center justify-center">
                    {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">空</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {renderMainArea()}
      </Card>
    </div>
  )
}