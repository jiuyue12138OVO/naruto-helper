import { useState, useEffect, useMemo, useCallback } from 'react'
import { ref, set, onValue, update, get } from 'firebase/database'
import { db } from '@/firebase'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Search, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import type { INinja } from '@/data/ninjas'

type Phase = 
  | 'ban1' | 'ban2' | 'ban3'
  | 'pick1' | 'pick2' | 'pick3' | 'pick4'
  | 'scrolls1P' | 'scrolls2P'
  | 'summons1P' | 'summons2P'
  | 'done'

interface RoomState {
  phase: Phase
  gameNumber: number
  firstPlayer: '1P' | '2P'
  usedNinjas: string[]
  bannedThisGame: string[]
  team1P: string[]
  team2P: string[]
  scrolls1P: (string | null)[]
  scrolls2P: (string | null)[]
  summons1P: (string | null)[]
  summons2P: (string | null)[]
}

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function BPRoomPage() {
  const { ninjas, scrolls, summons, counters } = useData()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<'1P' | '2P' | null>(null)
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [error, setError] = useState('')
  const [ninjaSearch, setNinjaSearch] = useState('')
  const [scrollSearch, setScrollSearch] = useState('')
  const [summonSearch, setSummonSearch] = useState('')

  // 创建房间
  const createRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    const roomRef = ref(db, `rooms/${newRoomId}`)
    const initState: RoomState = {
      phase: 'ban1',
      gameNumber: 1,
      firstPlayer: '1P',
      usedNinjas: [],
      bannedThisGame: [],
      team1P: [],
      team2P: [],
      scrolls1P: [null, null, null],
      scrolls2P: [null, null, null],
      summons1P: [null, null, null],
      summons2P: [null, null, null]
    }
    await set(roomRef, initState)
    setRoomId(newRoomId)
    setMyRole('1P')
  }

  // 加入房间
  const joinRoom = async () => {
    if (!joinRoomId.trim()) return
    const roomRef = ref(db, `rooms/${joinRoomId.toUpperCase()}`)
    const snap = await get(roomRef)
    if (!snap.exists()) {
      setError('房间不存在')
      return
    }
    setRoomId(joinRoomId.toUpperCase())
    setMyRole('2P')
    setError('')
  }

  // 监听房间状态
  useEffect(() => {
    if (!roomId) return
    const roomRef = ref(db, `rooms/${roomId}`)
    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      if (data) setRoomState(data)
    })
    return () => unsub()
  }, [roomId])

  // 更新房间状态
  const updateRoom = useCallback((updates: Partial<RoomState>) => {
    if (!roomId) return
    const roomRef = ref(db, `rooms/${roomId}`)
    update(roomRef, updates)
  }, [roomId])

  // 辅助函数
  const getNinjaById = (id: string) => ninjas.find(n => n.id === id)!
  const getScrollById = (id: string) => scrolls.find(s => s.id === id)!
  const getSummonById = (id: string) => summons.find(s => s.id === id)!

  // 判断是否轮到己方操作
  const isMyTurn = useMemo(() => {
    if (!roomState || !myRole) return false
    const { phase, firstPlayer } = roomState
    const first = firstPlayer
    const second = first === '1P' ? '2P' : '1P'
    switch (phase) {
      case 'ban1': return myRole === first
      case 'ban2': return myRole === second
      case 'ban3': return myRole === first
      case 'pick1': return myRole === first
      case 'pick2': return myRole === second
      case 'pick3': return myRole === first
      case 'pick4': return myRole === second
      case 'scrolls1P': return myRole === '1P'
      case 'scrolls2P': return myRole === '2P'
      case 'summons1P': return myRole === '1P'
      case 'summons2P': return myRole === '2P'
      default: return false
    }
  }, [roomState, myRole])

  // 可用的忍者（排除已用和本局禁用）
  const availableNinjas = useMemo(() => {
    if (!roomState) return []
    let list = ninjas.filter(n => 
      !roomState.usedNinjas.includes(n.id) && 
      !roomState.bannedThisGame.includes(n.id)
    )
    if (ninjaSearch.trim()) {
      const kw = ninjaSearch.toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(kw))
    }
    return list
  }, [ninjas, roomState, ninjaSearch])

  const groupedNinjas = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = availableNinjas.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [availableNinjas])

  // 确定下一个阶段
  const nextPhaseMap: Record<Phase, Phase> = {
    ban1: 'ban2', ban2: 'ban3', ban3: 'pick1',
    pick1: 'pick2', pick2: 'pick3', pick3: 'pick4', pick4: 'scrolls1P',
    scrolls1P: 'scrolls2P', scrolls2P: 'summons1P',
    summons1P: 'summons2P', summons2P: 'done',
    done: 'done'
  }

  // 根据当前阵容人数决定是否推进阶段
  const calcPickNext = (team1Len: number, team2Len: number, current: Phase): Phase => {
    switch (current) {
      case 'pick1': return 'pick2'
      case 'pick2': return team2Len === 2 ? 'pick3' : 'pick2'
      case 'pick3': return team1Len === 3 ? 'pick4' : 'pick3'
      case 'pick4': return team2Len === 3 ? 'scrolls1P' : 'pick4'
      default: return nextPhaseMap[current]
    }
  }

  // 处理忍者选择
  const handleNinjaSelect = async (ninja: INinja) => {
    if (!isMyTurn || !roomState) return
    const { phase, team1P, team2P, usedNinjas, bannedThisGame } = roomState

    if (phase.startsWith('ban')) {
      const newBanned = [...bannedThisGame, ninja.id]
      const nextPhase = nextPhaseMap[phase]
      await updateRoom({ bannedThisGame: newBanned, phase: nextPhase })
      return
    }

    let newTeam1 = [...team1P]
    let newTeam2 = [...team2P]

    if (myRole === '1P') newTeam1.push(ninja.id)
    else newTeam2.push(ninja.id)

    const newUsed = [...usedNinjas, ninja.id]
    const nextPhase = calcPickNext(newTeam1.length, newTeam2.length, phase)

    await updateRoom({
      team1P: newTeam1,
      team2P: newTeam2,
      usedNinjas: newUsed,
      phase: nextPhase
    })
  }

  // 密卷/通灵选择（自选，不分先后，只操作自己的）
  const handleScrollSelect = async (index: number, scrollId: string) => {
    if (!isMyTurn || !roomState) return
    const key = myRole === '1P' ? 'scrolls1P' : 'scrolls2P'
    const current = [...roomState[key]]
    current[index] = scrollId
    await updateRoom({ [key]: current } as any)
  }

  const confirmScrolls = async () => {
    if (!roomState || !myRole) return
    const key = myRole === '1P' ? 'scrolls1P' : 'scrolls2P'
    if (roomState[key].some(s => !s)) return
    // 推进阶段
    await updateRoom({ phase: nextPhaseMap[roomState.phase] })
  }

  const handleSummonSelect = async (index: number, summonId: string) => {
    if (!isMyTurn || !roomState) return
    const key = myRole === '1P' ? 'summons1P' : 'summons2P'
    const current = [...roomState[key]]
    current[index] = summonId
    await updateRoom({ [key]: current } as any)
  }

  const confirmSummons = async () => {
    if (!roomState || !myRole) return
    const key = myRole === '1P' ? 'summons1P' : 'summons2P'
    if (roomState[key].some(s => !s)) return
    await updateRoom({ phase: nextPhaseMap[roomState.phase] })
  }

  // 下一局
  const nextGame = async () => {
    if (!roomState) return
    await updateRoom({
      gameNumber: roomState.gameNumber + 1,
      firstPlayer: roomState.firstPlayer === '1P' ? '2P' : '1P',
      phase: 'ban1',
      bannedThisGame: [],
      team1P: [],
      team2P: [],
      scrolls1P: [null, null, null],
      scrolls2P: [null, null, null],
      summons1P: [null, null, null],
      summons2P: [null, null, null]
    })
  }

  // 可用的密卷/通灵（排除自己已用过的）
  const availableScrolls = useMemo(() => {
    if (!myRole) return []
    const used = myRole === '1P' ? [] : [] // 实际上需要记录每局已用，这里先简化：全局已用池不存在，因为规则是自己每局用完不能再用，需要存储到 roomState，暂时用独立池
    // 暂时简化：可用所有密卷（因为 pool 未实现），后面可以完善
    let list = scrolls
    if (scrollSearch.trim()) {
      const kw = scrollSearch.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(kw))
    }
    return list
  }, [scrolls, scrollSearch, myRole])

  const availableSummons = useMemo(() => {
    let list = summons
    if (summonSearch.trim()) {
      const kw = summonSearch.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(kw))
    }
    return list
  }, [summons, summonSearch])

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
          <Input 
            value={joinRoomId} 
            onChange={e => setJoinRoomId(e.target.value.toUpperCase())} 
            placeholder="输入房间号" 
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={joinRoom} className="w-full">加入</Button>
        </Card>
      </div>
    )
  }

  if (!roomState) return <p className="text-center">加载中...</p>

  // 当前阶段信息
  const phaseDescription = () => {
    const p = roomState.phase
    if (p.startsWith('ban')) return `${isMyTurn ? '你' : '对方'} 正在禁用忍者`
    if (p.startsWith('pick')) return `${isMyTurn ? '你' : '对方'} 正在选择忍者`
    if (p.startsWith('scrolls')) return `${isMyTurn ? '你' : '对方'} 正在选择密卷`
    if (p.startsWith('summons')) return `${isMyTurn ? '你' : '对方'} 正在选择通灵`
    return '本局完成'
  }

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

      <Card className="p-4 md:p-6">
        <div className="mb-4 font-semibold text-lg">
          {phaseDescription()}
        </div>

        {/* 忍者选择区域 */}
        {(roomState.phase.startsWith('ban') || roomState.phase.startsWith('pick')) && (
          <>
            <div className="relative max-w-md mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={ninjaSearch}
                onChange={e => setNinjaSearch(e.target.value)}
                placeholder="搜索忍者..."
                className="pl-9 pr-9"
              />
              {ninjaSearch && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setNinjaSearch('')}><X className="h-4 w-4" /></Button>}
            </div>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {groupedNinjas.map(group => (
                <div key={group.tier}>
                  <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {group.ninjas.map(ninja => (
                      <div
                        key={ninja.id}
                        className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isMyTurn ? 'hover:bg-muted/50' : 'opacity-60 grayscale'}`}
                        onClick={() => isMyTurn && handleNinjaSelect(ninja)}
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
          </>
        )}

        {/* 密卷选择区域 */}
        {(roomState.phase === 'scrolls1P' || roomState.phase === 'scrolls2P') && (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              {(myRole === '1P' ? roomState.team1P : roomState.team2P).map((ninjaId, idx) => (
                <div key={ninjaId} className="flex flex-col items-center gap-2 p-2 border rounded-lg bg-muted/30">
                  <Image src={getNinjaById(ninjaId).imageUrl} alt={getNinjaById(ninjaId).name} className="w-16 h-16 rounded" />
                  <span className="text-sm">{getNinjaById(ninjaId).name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">密卷：</span>
                    {(myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P)[idx] ? (
                      <div className="flex items-center gap-1">
                        <Image src={getScrollById((myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P)[idx]!).imageUrl} className="w-6 h-6 rounded" />
                        <span className="text-xs">{getScrollById((myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P)[idx]!).name}</span>
                      </div>
                    ) : <span className="text-xs text-destructive">未选择</span>}
                  </div>
                </div>
              ))}
            </div>
            {isMyTurn && (
              <>
                <div className="relative max-w-md mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={scrollSearch} onChange={e => setScrollSearch(e.target.value)} placeholder="搜索密卷..." className="pl-9 pr-9" />
                  {scrollSearch && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setScrollSearch('')}><X className="h-4 w-4" /></Button>}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                  {availableScrolls.map(scroll => {
                    const isChosen = (myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P).includes(scroll.id)
                    return (
                      <div
                        key={scroll.id}
                        className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isChosen ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                        onClick={() => {
                          if (isChosen) return
                          const currentScrolls = myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P
                          const targetIndex = currentScrolls.findIndex(s => !s)
                          if (targetIndex !== -1) handleScrollSelect(targetIndex, scroll.id)
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
                <Button onClick={confirmScrolls} disabled={(myRole === '1P' ? roomState.scrolls1P : roomState.scrolls2P).some(s => !s)}>确认密卷</Button>
              </>
            )}
          </div>
        )}

        {/* 通灵选择区域 */}
        {(roomState.phase === 'summons1P' || roomState.phase === 'summons2P') && (
          <div className="space-y-4">
            {/* 显示自己已选忍者及通灵状态，类似密卷 */}
            <div className="flex gap-4 mb-4">
              {(myRole === '1P' ? roomState.team1P : roomState.team2P).map((ninjaId, idx) => (
                <div key={ninjaId} className="flex flex-col items-center gap-2 p-2 border rounded-lg bg-muted/30">
                  <Image src={getNinjaById(ninjaId).imageUrl} alt={getNinjaById(ninjaId).name} className="w-16 h-16 rounded" />
                  <span className="text-sm">{getNinjaById(ninjaId).name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">通灵：</span>
                    {(myRole === '1P' ? roomState.summons1P : roomState.summons2P)[idx] ? (
                      <div className="flex items-center gap-1">
                        <Image src={getSummonById((myRole === '1P' ? roomState.summons1P : roomState.summons2P)[idx]!).imageUrl} className="w-6 h-6 rounded" />
                        <span className="text-xs">{getSummonById((myRole === '1P' ? roomState.summons1P : roomState.summons2P)[idx]!).name}</span>
                      </div>
                    ) : <span className="text-xs text-destructive">未选择</span>}
                  </div>
                </div>
              ))}
            </div>
            {isMyTurn && (
              <>
                <div className="relative max-w-md mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={summonSearch} onChange={e => setSummonSearch(e.target.value)} placeholder="搜索通灵..." className="pl-9 pr-9" />
                  {summonSearch && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSummonSearch('')}><X className="h-4 w-4" /></Button>}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                  {availableSummons.map(summon => {
                    const isChosen = (myRole === '1P' ? roomState.summons1P : roomState.summons2P).includes(summon.id)
                    return (
                      <div
                        key={summon.id}
                        className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isChosen ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                        onClick={() => {
                          if (isChosen) return
                          const currentSummons = myRole === '1P' ? roomState.summons1P : roomState.summons2P
                          const targetIndex = currentSummons.findIndex(s => !s)
                          if (targetIndex !== -1) handleSummonSelect(targetIndex, summon.id)
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
                <Button onClick={confirmSummons} disabled={(myRole === '1P' ? roomState.summons1P : roomState.summons2P).some(s => !s)}>确认通灵</Button>
              </>
            )}
          </div>
        )}

        {roomState.phase === 'done' && (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-primary">本局 BP 完成！</p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-2">1P 阵容</h3>
                {roomState.team1P.map(id => (
                  <div key={id} className="flex items-center gap-2 mb-2">
                    <Image src={getNinjaById(id).imageUrl} alt="" className="w-8 h-8 rounded" />
                    <span>{getNinjaById(id).name}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold mb-2">2P 阵容</h3>
                {roomState.team2P.map(id => (
                  <div key={id} className="flex items-center gap-2 mb-2">
                    <Image src={getNinjaById(id).imageUrl} alt="" className="w-8 h-8 rounded" />
                    <span>{getNinjaById(id).name}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={nextGame}>进入下一局</Button>
          </div>
        )}
      </Card>
    </div>
  )
}