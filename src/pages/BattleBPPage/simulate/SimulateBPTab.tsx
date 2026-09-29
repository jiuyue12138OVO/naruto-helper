import { useState, useMemo } from 'react'
import { RotateCcw, Undo2, Check, History, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useData } from '@/contexts/DataContext'
import BanPanel from './BanPanel'
import PickPanel from './PickPanel'
import ScrollSummonPanel from './ScrollSummonPanel'
import NinjaInfoDialog from './NinjaInfoDialog'
import type { INinja } from '@/data/ninjas'

type Phase = 'ban' | 'pick' | 'scrolls' | 'summons' | 'done'

const BAN_STEPS: { player: '1P' | '2P'; index: number }[] = [
  { player: '1P', index: 1 },
  { player: '2P', index: 0 },
  { player: '2P', index: 1 },
  { player: '1P', index: 0 },
]

const PICK_STEPS: { player: '1P' | '2P'; index: number }[] = [
  { player: '1P', index: 0 },
  { player: '2P', index: 0 },
  { player: '2P', index: 1 },
  { player: '1P', index: 1 },
  { player: '1P', index: 2 },
  { player: '2P', index: 2 },
]

interface GameRecord {
  gameNumber: number
  myRole: '1P' | '2P'
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  scrolls1P: (string | null)[]
  scrolls2P: (string | null)[]
  summons1P: (string | null)[]
  summons2P: (string | null)[]
}

interface Snapshot {
  phase: Phase
  ban1P: (INinja | null)[]
  ban2P: (INinja | null)[]
  banStep: number
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  pickStep: number
  currentScrolls1P: (string | null)[]
  currentScrolls2P: (string | null)[]
  currentSummons1P: (string | null)[]
  currentSummons2P: (string | null)[]
  scrollActiveSlot: { player: '1P' | '2P'; index: number } | null
  summonActiveSlot: { player: '1P' | '2P'; index: number } | null
}

export default function SimulateBPTab() {
  const { ninjas, scrolls, summons, counters } = useData()

  const [myRole, setMyRole] = useState<'1P' | '2P' | null>(null)
  const [gameNumber, setGameNumber] = useState(1)
  const [phase, setPhase] = useState<Phase>('ban')

  const [ban1P, setBan1P] = useState<(INinja | null)[]>([null, null])
  const [ban2P, setBan2P] = useState<(INinja | null)[]>([null, null])
  const [banStep, setBanStep] = useState(0)

  const [team1P, setTeam1P] = useState<(INinja | null)[]>([null, null, null])
  const [team2P, setTeam2P] = useState<(INinja | null)[]>([null, null, null])
  const [pickStep, setPickStep] = useState(0)

  const [usedNinjas, setUsedNinjas] = useState<Set<string>>(new Set())

  const [myScrollHistory, setMyScrollHistory] = useState<Set<string>>(new Set())
  const [opponentScrollHistory, setOpponentScrollHistory] = useState<Set<string>>(new Set())
  const [mySummonHistory, setMySummonHistory] = useState<Set<string>>(new Set())
  const [opponentSummonHistory, setOpponentSummonHistory] = useState<Set<string>>(new Set())

  const [currentScrolls1P, setCurrentScrolls1P] = useState<(string | null)[]>([null, null, null])
  const [currentScrolls2P, setCurrentScrolls2P] = useState<(string | null)[]>([null, null, null])
  const [currentSummons1P, setCurrentSummons1P] = useState<(string | null)[]>([null, null, null])
  const [currentSummons2P, setCurrentSummons2P] = useState<(string | null)[]>([null, null, null])

  const [scrollActiveSlot, setScrollActiveSlot] = useState<{ player: '1P' | '2P'; index: number } | null>(null)
  const [summonActiveSlot, setSummonActiveSlot] = useState<{ player: '1P' | '2P'; index: number } | null>(null)
  const [pendingScrollItemId, setPendingScrollItemId] = useState<string | null>(null)
  const [pendingSummonItemId, setPendingSummonItemId] = useState<string | null>(null)

  const [pendingBanNinja, setPendingBanNinja] = useState<INinja | null>(null)
  const [pendingPickNinja, setPendingPickNinja] = useState<INinja | null>(null)

  const [gameHistory, setGameHistory] = useState<GameRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const [infoNinja, setInfoNinja] = useState<INinja | null>(null)

  // 撤回历史栈
  const [history, setHistory] = useState<Snapshot[]>([])

  const pushHistory = () => {
    setHistory(prev => [...prev, {
      phase,
      ban1P: [...ban1P],
      ban2P: [...ban2P],
      banStep,
      team1P: [...team1P],
      team2P: [...team2P],
      pickStep,
      currentScrolls1P: [...currentScrolls1P],
      currentScrolls2P: [...currentScrolls2P],
      currentSummons1P: [...currentSummons1P],
      currentSummons2P: [...currentSummons2P],
      scrollActiveSlot: scrollActiveSlot ? { ...scrollActiveSlot } : null,
      summonActiveSlot: summonActiveSlot ? { ...summonActiveSlot } : null,
    }])
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setPhase(prev.phase)
    setBan1P(prev.ban1P)
    setBan2P(prev.ban2P)
    setBanStep(prev.banStep)
    setTeam1P(prev.team1P)
    setTeam2P(prev.team2P)
    setPickStep(prev.pickStep)
    setCurrentScrolls1P(prev.currentScrolls1P)
    setCurrentScrolls2P(prev.currentScrolls2P)
    setCurrentSummons1P(prev.currentSummons1P)
    setCurrentSummons2P(prev.currentSummons2P)
    setScrollActiveSlot(prev.scrollActiveSlot)
    setSummonActiveSlot(prev.summonActiveSlot)
    setPendingBanNinja(null)
    setPendingPickNinja(null)
    setPendingScrollItemId(null)
    setPendingSummonItemId(null)
  }

  const currentActiveSlotInfo = useMemo(() => {
    if (phase === 'ban' && banStep < 4) return BAN_STEPS[banStep]
    if (phase === 'pick' && pickStep < 6) return PICK_STEPS[pickStep]
    return null
  }, [phase, banStep, pickStep])

  const isBanComplete = banStep === 4
  const isPickComplete = pickStep === 6
  const isScrollsComplete = [...currentScrolls1P, ...currentScrolls2P].every(s => s !== null)
  const isSummonsComplete = [...currentSummons1P, ...currentSummons2P].every(s => s !== null)

  const resetAll = () => {
    setMyRole(null)
    setGameNumber(1)
    setPhase('ban')
    setBan1P([null, null])
    setBan2P([null, null])
    setBanStep(0)
    setTeam1P([null, null, null])
    setTeam2P([null, null, null])
    setPickStep(0)
    setUsedNinjas(new Set())
    setMyScrollHistory(new Set())
    setOpponentScrollHistory(new Set())
    setMySummonHistory(new Set())
    setOpponentSummonHistory(new Set())
    setCurrentScrolls1P([null, null, null])
    setCurrentScrolls2P([null, null, null])
    setCurrentSummons1P([null, null, null])
    setCurrentSummons2P([null, null, null])
    setScrollActiveSlot(null)
    setSummonActiveSlot(null)
    setPendingScrollItemId(null)
    setPendingSummonItemId(null)
    setPendingBanNinja(null)
    setPendingPickNinja(null)
    setGameHistory([])
    setHistory([])
  }

  const startMatch = (role: '1P' | '2P') => {
    setMyRole(role)
    setGameNumber(1)
    setPhase('ban')
    setBan1P([null, null])
    setBan2P([null, null])
    setBanStep(0)
    setTeam1P([null, null, null])
    setTeam2P([null, null, null])
    setPickStep(0)
    setUsedNinjas(new Set())
    setMyScrollHistory(new Set())
    setOpponentScrollHistory(new Set())
    setMySummonHistory(new Set())
    setOpponentSummonHistory(new Set())
    setCurrentScrolls1P([null, null, null])
    setCurrentScrolls2P([null, null, null])
    setCurrentSummons1P([null, null, null])
    setCurrentSummons2P([null, null, null])
    setScrollActiveSlot(null)
    setSummonActiveSlot(null)
    setPendingScrollItemId(null)
    setPendingSummonItemId(null)
    setPendingBanNinja(null)
    setPendingPickNinja(null)
    setGameHistory([])
    setHistory([])
  }

  const nextGame = () => {
    const record: GameRecord = {
      gameNumber,
      myRole: myRole!,
      team1P: [...team1P],
      team2P: [...team2P],
      scrolls1P: [...currentScrolls1P],
      scrolls2P: [...currentScrolls2P],
      summons1P: [...currentSummons1P],
      summons2P: [...currentSummons2P],
    }
    setGameHistory(prev => [...prev, record])

    setUsedNinjas(prev => {
      const next = new Set(prev)
      team1P.forEach(n => n && next.add(n.id))
      team2P.forEach(n => n && next.add(n.id))
      return next
    })

    if (myRole === '1P') {
      setMyScrollHistory(prev => { const next = new Set(prev); currentScrolls1P.forEach(id => id && next.add(id)); return next })
      setOpponentScrollHistory(prev => { const next = new Set(prev); currentScrolls2P.forEach(id => id && next.add(id)); return next })
      setMySummonHistory(prev => { const next = new Set(prev); currentSummons1P.forEach(id => id && next.add(id)); return next })
      setOpponentSummonHistory(prev => { const next = new Set(prev); currentSummons2P.forEach(id => id && next.add(id)); return next })
    } else {
      setOpponentScrollHistory(prev => { const next = new Set(prev); currentScrolls1P.forEach(id => id && next.add(id)); return next })
      setMyScrollHistory(prev => { const next = new Set(prev); currentScrolls2P.forEach(id => id && next.add(id)); return next })
      setOpponentSummonHistory(prev => { const next = new Set(prev); currentSummons1P.forEach(id => id && next.add(id)); return next })
      setMySummonHistory(prev => { const next = new Set(prev); currentSummons2P.forEach(id => id && next.add(id)); return next })
    }

    setGameNumber(prev => prev + 1)
    setMyRole(myRole === '1P' ? '2P' : '1P')
    setPhase('ban')
    setBan1P([null, null])
    setBan2P([null, null])
    setBanStep(0)
    setTeam1P([null, null, null])
    setTeam2P([null, null, null])
    setPickStep(0)
    setCurrentScrolls1P([null, null, null])
    setCurrentScrolls2P([null, null, null])
    setCurrentSummons1P([null, null, null])
    setCurrentSummons2P([null, null, null])
    setScrollActiveSlot(null)
    setSummonActiveSlot(null)
    setPendingScrollItemId(null)
    setPendingSummonItemId(null)
    setPendingBanNinja(null)
    setPendingPickNinja(null)
    setHistory([])
  }

  // ===== Ban =====
  const handleBanSelect = (ninja: INinja) => {
    if (!currentActiveSlotInfo || phase !== 'ban') return
    setPendingBanNinja(ninja)
  }

  const confirmBanSelection = () => {
    if (!pendingBanNinja || !currentActiveSlotInfo) return
    pushHistory()
    const { player, index } = currentActiveSlotInfo
    if (player === '1P') {
      setBan1P(prev => { const next = [...prev]; next[index] = pendingBanNinja; return next })
    } else {
      setBan2P(prev => { const next = [...prev]; next[index] = pendingBanNinja; return next })
    }
    setBanStep(s => s + 1)
    setPendingBanNinja(null)
  }

  const confirmBan = () => {
    if (!isBanComplete) return
    pushHistory()
    setPhase('pick')
  }

  // ===== Pick =====
  const handlePickSelect = (ninja: INinja) => {
    if (!currentActiveSlotInfo || phase !== 'pick') return
    setPendingPickNinja(ninja)
  }

  const confirmPickSelection = () => {
    if (!pendingPickNinja || !currentActiveSlotInfo) return
    pushHistory()
    const { player, index } = currentActiveSlotInfo
    if (player === '1P') {
      setTeam1P(prev => { const next = [...prev]; next[index] = pendingPickNinja; return next })
    } else {
      setTeam2P(prev => { const next = [...prev]; next[index] = pendingPickNinja; return next })
    }
    setPickStep(s => s + 1)
    setPendingPickNinja(null)
  }

  const confirmPick = () => {
    if (!isPickComplete) return
    pushHistory()
    setPhase('scrolls')
    setScrollActiveSlot({ player: '1P', index: 0 })
  }

  // ===== 密卷/通灵 =====
  const availableScrollsFor = (player: '1P' | '2P') => {
    const hist = player === '1P' ? myScrollHistory : opponentScrollHistory
    const current = player === '1P' ? currentScrolls1P : currentScrolls2P
    const used = new Set(current.filter(Boolean) as string[])
    return scrolls.filter(s => !hist.has(s.id) && !used.has(s.id))
  }
  const availableSummonsFor = (player: '1P' | '2P') => {
    const hist = player === '1P' ? mySummonHistory : opponentSummonHistory
    const current = player === '1P' ? currentSummons1P : currentSummons2P
    const used = new Set(current.filter(Boolean) as string[])
    return summons.filter(s => !hist.has(s.id) && !used.has(s.id))
  }

  const handleScrollSlotClick = (player: '1P' | '2P', index: number) => {
    setScrollActiveSlot({ player, index })
    setPendingScrollItemId(null)
  }

  const handleSummonSlotClick = (player: '1P' | '2P', index: number) => {
    setSummonActiveSlot({ player, index })
    setPendingSummonItemId(null)
  }

  const handleScrollSelect = (itemId: string) => {
    if (!scrollActiveSlot) return
    pushHistory()
    const { player, index } = scrollActiveSlot
    if (player === '1P') {
      setCurrentScrolls1P(prev => { const next = [...prev]; next[index] = itemId; return next })
    } else {
      setCurrentScrolls2P(prev => { const next = [...prev]; next[index] = itemId; return next })
    }
    setPendingScrollItemId(null)
  }

  const handleSummonSelect = (itemId: string) => {
    if (!summonActiveSlot) return
    pushHistory()
    const { player, index } = summonActiveSlot
    if (player === '1P') {
      setCurrentSummons1P(prev => { const next = [...prev]; next[index] = itemId; return next })
    } else {
      setCurrentSummons2P(prev => { const next = [...prev]; next[index] = itemId; return next })
    }
    setPendingSummonItemId(null)
  }

  const confirmScrolls = () => {
    if (!isScrollsComplete) return
    pushHistory()
    setPhase('summons')
    setSummonActiveSlot({ player: '1P', index: 0 })
  }

  const confirmSummons = () => {
    if (!isSummonsComplete) return
    pushHistory()
    setPhase('done')
  }

  // ===== 渲染 =====
  const renderBanSlot = (player: '1P' | '2P', index: number) => {
    const ninja = (player === '1P' ? ban1P : ban2P)[index]
    const isActive = phase !== 'done' && currentActiveSlotInfo?.player === player && currentActiveSlotInfo?.index === index
    return (
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed rounded-lg flex items-center justify-center ${
          isActive ? 'border-primary' : 'border-muted-foreground/30'
        } ${ninja ? 'cursor-pointer' : ''}`}
        onClick={() => ninja && setInfoNinja(ninja)}
        title={ninja ? `点击查看 ${ninja.name} 的克制信息` : ''}
      >
        {ninja ? (
          <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-xs text-muted-foreground">空</span>
        )}
      </div>
    )
  }

  const renderPickSlot = (player: '1P' | '2P', index: number) => {
    const ninja = (player === '1P' ? team1P : team2P)[index]
    const isActive = phase === 'pick' && currentActiveSlotInfo?.player === player && currentActiveSlotInfo?.index === index
    const scrollId = player === '1P' ? currentScrolls1P[index] : currentScrolls2P[index]
    const summonId = player === '1P' ? currentSummons1P[index] : currentSummons2P[index]
    const isScrollsPhase = phase === 'scrolls'
    const isSummonsPhase = phase === 'summons'
    const showScrolls = isScrollsPhase || phase === 'summons' || phase === 'done'
    const showSummons = isSummonsPhase || phase === 'done'
    const isScrollActive = scrollActiveSlot?.player === player && scrollActiveSlot?.index === index
    const isSummonActive = summonActiveSlot?.player === player && summonActiveSlot?.index === index

    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-lg flex items-center justify-center ${
            isActive ? 'border-primary' : 'border-muted-foreground/30'
          } ${ninja ? 'cursor-pointer' : ''}`}
          onClick={() => ninja && setInfoNinja(ninja)}
          title={ninja ? `点击查看 ${ninja.name} 的克制信息` : ''}
        >
          {ninja ? (
            <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-xs text-muted-foreground">空</span>
          )}
        </div>
        {(showScrolls || showSummons) && ninja && (
          <div className="flex gap-1 mt-1">
            {showScrolls && (
              <div
                onClick={(e) => { e.stopPropagation(); if (isScrollsPhase) handleScrollSlotClick(player, index) }}
                className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center ${
                  isScrollsPhase ? 'cursor-pointer hover:border-primary' : ''
                } ${isScrollActive ? 'ring-2 ring-primary' : 'border-border/40'}`}
              >
                {scrollId ? (
                  <Image src={scrolls.find(s => s.id === scrollId)!.imageUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-xs text-muted-foreground">+</span>
                )}
              </div>
            )}
            {showSummons && (
              <div
                onClick={(e) => { e.stopPropagation(); if (isSummonsPhase) handleSummonSlotClick(player, index) }}
                className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center ${
                  isSummonsPhase ? 'cursor-pointer hover:border-primary' : ''
                } ${isSummonActive ? 'ring-2 ring-primary' : 'border-border/40'}`}
              >
                {summonId ? (
                  <Image src={summons.find(s => s.id === summonId)!.imageUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-xs text-muted-foreground">+</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderAlignedSlot = (ninja: INinja | null, scrollId: string | null, summonId: string | null) => (
    <div className="flex flex-col items-center w-24">
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-lg flex items-center justify-center border-muted-foreground/30 ${
          ninja ? 'cursor-pointer' : ''
        }`}
        onClick={() => ninja && setInfoNinja(ninja)}
        title={ninja ? `点击查看 ${ninja.name} 的克制信息` : ''}
      >
        {ninja ? (
          <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-xs text-muted-foreground">空</span>
        )}
      </div>
      <div className="flex gap-1 mt-1 items-center">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border/40 bg-card flex items-center justify-center">
          {scrollId ? (
            <Image src={scrolls.find(s => s.id === scrollId)!.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border/40 bg-card flex items-center justify-center">
          {summonId ? (
            <Image src={summons.find(s => s.id === summonId)!.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderOrder1P = [2, 1, 0]
  const renderOrder2P = [0, 1, 2]

  const historyRecords = useMemo(() => {
    const list = [...gameHistory]
    if (phase === 'done' && myRole) {
      list.push({
        gameNumber,
        myRole,
        team1P: [...team1P],
        team2P: [...team2P],
        scrolls1P: [...currentScrolls1P],
        scrolls2P: [...currentScrolls2P],
        summons1P: [...currentSummons1P],
        summons2P: [...currentSummons2P],
      })
    }
    return list
  }, [phase, gameHistory, gameNumber, myRole, team1P, team2P, currentScrolls1P, currentScrolls2P, currentSummons1P, currentSummons2P])

  const renderTopRightActions = () => {
    if (phase === 'ban') {
      return (
        <>
          {pendingBanNinja && (
            <Button size="sm" onClick={confirmBanSelection} className="gap-1.5">
              <Check className="h-4 w-4" /> 确认选择
            </Button>
          )}
          {isBanComplete && (
            <Button size="sm" onClick={confirmBan}>确认禁用</Button>
          )}
        </>
      )
    }
    if (phase === 'pick') {
      return (
        <>
          {pendingPickNinja && (
            <Button size="sm" onClick={confirmPickSelection} className="gap-1.5">
              <Check className="h-4 w-4" /> 确认选择
            </Button>
          )}
          {isPickComplete && (
            <Button size="sm" onClick={confirmPick}>确认阵容</Button>
          )}
        </>
      )
    }
    if (phase === 'scrolls') {
      return (
        <Button size="sm" onClick={confirmScrolls} disabled={!isScrollsComplete}>
          确认密卷配置
        </Button>
      )
    }
    if (phase === 'summons') {
      return (
        <Button size="sm" onClick={confirmSummons} disabled={!isSummonsComplete}>
          确认通灵配置
        </Button>
      )
    }
    if (phase === 'done') {
      return (
        <Button size="sm" onClick={nextGame}>进入下一局</Button>
      )
    }
    return null
  }

  if (myRole === null) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">选择你的身份</h2>
          <p className="text-sm text-muted-foreground mb-6">请选择你在大局中的初始位置，后续小局将自动换边。</p>
          <div className="flex gap-3">
            <Button onClick={() => startMatch('1P')} className="flex-1">我是 1P（先手）</Button>
            <Button onClick={() => startMatch('2P')} className="flex-1">我是 2P（后手）</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="outline">第 {gameNumber} 小局</Badge>
          <Badge variant="secondary">你当前是 {myRole}</Badge>
          {phase === 'scrolls' && <Badge variant="default">密卷配置</Badge>}
          {phase === 'summons' && <Badge variant="default">通灵配置</Badge>}
        </div>
      </div>

      <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-2">
        {historyRecords.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="gap-1">
            <History className="h-4 w-4" /> 过往
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={history.length === 0}
          className="gap-1"
        >
          <Undo2 className="h-4 w-4" /> 撤回
        </Button>
        <Button variant="outline" size="sm" onClick={resetAll} className="gap-1">
          <RotateCcw className="h-4 w-4" /> 重置
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        {renderTopRightActions()}
      </div>

      <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
        <span>
          · 忍者「黑绝（附身）」仅推荐在一号位选择。<br />
          · 密卷推荐侧重克制对手；对位越稀缺的密卷/通灵，评分越高。<br />
          · 点击忍者头像可查看克制信息；点击右上角「撤回」可回退上一步。<br />
          · 推荐仅供参考，请根据实际对局需求灵活选择。
        </span>
      </div>

      <Card className="p-6">
        {phase === 'ban' && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-center">禁用忍者</h3>
            <div className="flex justify-center gap-12 sm:gap-20">
              <div>
                <p className="text-sm text-muted-foreground mb-2 text-center">1P 禁用</p>
                <div className="flex gap-2">
                  {[0, 1].map(i => renderBanSlot('1P', i))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 text-center">2P 禁用</p>
                <div className="flex gap-2">
                  {[0, 1].map(i => renderBanSlot('2P', i))}
                </div>
              </div>
            </div>
            <BanPanel
              myRole={myRole!}
              currentSlot={currentActiveSlotInfo}
              usedNinjas={usedNinjas}
              banned1P={ban1P}
              banned2P={ban2P}
              onSelect={handleBanSelect}
              pendingNinjaId={pendingBanNinja?.id}
            />
          </div>
        )}

        {(phase === 'pick' || phase === 'scrolls' || phase === 'summons') && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-center">选用忍者</h3>
            <div className="flex justify-center gap-12 sm:gap-20">
              <div>
                <p className="text-sm text-muted-foreground mb-2 text-center">1P 阵容</p>
                <div className="flex gap-2">
                  {renderOrder1P.map(i => renderPickSlot('1P', i))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 text-center">2P 阵容</p>
                <div className="flex gap-2">
                  {renderOrder2P.map(i => renderPickSlot('2P', i))}
                </div>
              </div>
            </div>
            {phase === 'pick' && (
              <PickPanel
                myRole={myRole!}
                currentSlot={currentActiveSlotInfo}
                team1P={team1P}
                team2P={team2P}
                usedNinjas={usedNinjas}
                banned1P={ban1P}
                banned2P={ban2P}
                onSelect={handlePickSelect}
                pendingNinjaId={pendingPickNinja?.id}
              />
            )}
            {phase === 'scrolls' && (
              <ScrollSummonPanel
                phase="scrolls"
                team1P={team1P}
                team2P={team2P}
                current1P={currentScrolls1P}
                current2P={currentScrolls2P}
                available1P={availableScrollsFor('1P')}
                available2P={availableScrollsFor('2P')}
                activeSlot={scrollActiveSlot}
                onSlotClick={handleScrollSlotClick}
                onSelectItem={handleScrollSelect}
                pendingItemId={pendingScrollItemId}
              />
            )}
            {phase === 'summons' && (
              <ScrollSummonPanel
                phase="summons"
                team1P={team1P}
                team2P={team2P}
                current1P={currentSummons1P}
                current2P={currentSummons2P}
                available1P={availableSummonsFor('1P')}
                available2P={availableSummonsFor('2P')}
                activeSlot={summonActiveSlot}
                onSlotClick={handleSummonSlotClick}
                onSelectItem={handleSummonSelect}
                pendingItemId={pendingSummonItemId}
              />
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-center">禁用忍者</h3>
              <div className="flex justify-center gap-12 sm:gap-20">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 text-center">1P 禁用</p>
                  <div className="flex gap-2">
                    {[0, 1].map(i => renderBanSlot('1P', i))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2 text-center">2P 禁用</p>
                  <div className="flex gap-2">
                    {[0, 1].map(i => renderBanSlot('2P', i))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-center">选用忍者</h3>
              <div className="flex justify-center gap-12 sm:gap-20">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 text-center">1P 阵容</p>
                  <div className="flex gap-2">
                    {renderOrder1P.map(i =>
                      renderAlignedSlot(team1P[i], currentScrolls1P[i], currentSummons1P[i])
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2 text-center">2P 阵容</p>
                  <div className="flex gap-2">
                    {renderOrder2P.map(i =>
                      renderAlignedSlot(team2P[i], currentScrolls2P[i], currentSummons2P[i])
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">本局 BP 完成！点击右上角「进入下一局」继续</p>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>过往小局阵容</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto space-y-8">
            {historyRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">暂无过往对局</p>
            ) : (
              historyRecords.map((record, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">第 {record.gameNumber} 小局</h3>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className={record.myRole === '1P' ? 'border-2 border-red-500 rounded-lg p-2' : ''}>
                      <p className="text-sm text-muted-foreground mb-1">1P</p>
                      <div className="flex gap-2">
                        {renderOrder1P.map(i =>
                          renderAlignedSlot(record.team1P[i], record.scrolls1P[i], record.summons1P[i])
                        )}
                      </div>
                    </div>
                    <div className={record.myRole === '2P' ? 'border-2 border-red-500 rounded-lg p-2' : ''}>
                      <p className="text-sm text-muted-foreground mb-1">2P</p>
                      <div className="flex gap-2">
                        {renderOrder2P.map(i =>
                          renderAlignedSlot(record.team2P[i], record.scrolls2P[i], record.summons2P[i])
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <NinjaInfoDialog
        ninja={infoNinja}
        open={!!infoNinja}
        onOpenChange={(open) => !open && setInfoNinja(null)}
        ninjas={ninjas}
        counters={counters}
        scrolls={scrolls}
        summons={summons}
      />
    </div>
  )
}