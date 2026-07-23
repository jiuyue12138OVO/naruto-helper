import { useState, useMemo } from 'react'
import { Search, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import BPRecommendation from './BPRecommendation'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

interface ScrollSummonPanelProps {
  phase: 'scrolls' | 'summons'
  myRole: '1P' | '2P'
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  currentScrolls1P: (string | null)[]
  currentScrolls2P: (string | null)[]
  currentSummons1P: (string | null)[]
  currentSummons2P: (string | null)[]
  myScrollHistory: Set<string>
  opponentScrollHistory: Set<string>
  mySummonHistory: Set<string>
  opponentSummonHistory: Set<string>
  activeSlot: { type: 'scroll' | 'summon'; player: '1P' | '2P'; index: number } | null
  onSlotClick: (player: '1P' | '2P', index: number, type: 'scroll' | 'summon') => void
  onConfirmSlot: (player: '1P' | '2P', index: number, itemId: string, type: 'scroll' | 'summon') => void
  onConfirm: () => void
  isComplete: boolean
}

export default function ScrollSummonPanel({
  phase,
  myRole,
  team1P,
  team2P,
  currentScrolls1P,
  currentScrolls2P,
  currentSummons1P,
  currentSummons2P,
  myScrollHistory,
  opponentScrollHistory,
  mySummonHistory,
  opponentSummonHistory,
  activeSlot,
  onSlotClick,
  onConfirmSlot,
  onConfirm,
  isComplete,
}: ScrollSummonPanelProps) {
  const { scrolls, summons } = useData()
  const [search, setSearch] = useState('')
  const [pendingItem, setPendingItem] = useState<{ itemId: string; type: 'scroll' | 'summon' } | null>(null)

  const isScrolls = phase === 'scrolls'
  const dataList = isScrolls ? scrolls : summons
  const current1P = isScrolls ? currentScrolls1P : currentSummons1P
  const current2P = isScrolls ? currentScrolls2P : currentSummons2P
  const history1P = isScrolls ? myScrollHistory : mySummonHistory
  const history2P = isScrolls ? opponentScrollHistory : opponentSummonHistory

  const currentPlayer = activeSlot?.player ?? null
  const currentIndex = activeSlot?.index ?? null

  const availableItems = useMemo(() => {
    if (!currentPlayer) return []
    const history = currentPlayer === '1P' ? history1P : history2P
    const current = currentPlayer === '1P' ? current1P : current2P
    const usedThisGame = new Set(current.filter(Boolean) as string[])
    let list = dataList.filter(s => !history.has(s.id) && !usedThisGame.has(s.id))
    if (search.trim()) {
      const kw = search.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(kw))
    }
    return list
  }, [currentPlayer, dataList, history1P, history2P, current1P, current2P, search])

  const handleSelect = (item: IScroll | ISummon) => {
    if (!currentPlayer || currentIndex === null) return
    setPendingItem({ itemId: item.id, type: isScrolls ? 'scroll' : 'summon' })
  }

  const confirmCurrentSlot = () => {
    if (!pendingItem || !currentPlayer || currentIndex === null) return
    onConfirmSlot(currentPlayer, currentIndex, pendingItem.itemId, pendingItem.type)
    setPendingItem(null)
  }

  const handleSlotClick = (player: '1P' | '2P', index: number, type: 'scroll' | 'summon') => {
    setPendingItem(null)
    onSlotClick(player, index, type)
  }

  const renderTeamSlots = (player: '1P' | '2P') => {
    const team = player === '1P' ? team1P : team2P
    const order = player === '1P' ? [2, 1, 0] : [0, 1, 2]
    const scrollsData = player === '1P' ? currentScrolls1P : currentScrolls2P
    const summonsData = player === '1P' ? currentSummons1P : currentSummons2P

    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">{player} 阵容</p>
        <div className="flex gap-2">
          {order.map(i => {
            const ninja = team[i]
            const isActive = activeSlot?.player === player && activeSlot?.index === i
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  onClick={() => handleSlotClick(player, i, isScrolls ? 'scroll' : 'summon')}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden cursor-pointer transition-colors ${
                    isActive ? 'border-primary' : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {ninja ? (
                    <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs">?</div>
                  )}
                </div>
                <span className="text-xs mt-1">{ninja?.name || '待选'}</span>
                {ninja && (
                  <div className="flex gap-1 mt-1 items-center">
                    {/* 左侧密卷 */}
                    <div className="w-5 h-5 rounded overflow-hidden border border-border/40 bg-card flex items-center justify-center">
                      {scrollsData[i] ? (
                        <Image
                          src={scrolls.find(s => s.id === scrollsData[i])!.imageUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">-</span>
                      )}
                    </div>
                    {/* 右侧通灵 */}
                    <div className="w-5 h-5 rounded overflow-hidden border border-border/40 bg-card flex items-center justify-center">
                      {summonsData[i] ? (
                        <Image
                          src={summons.find(s => s.id === summonsData[i])!.imageUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const pendingScrollId = isScrolls ? pendingItem?.itemId : undefined
  const pendingSummonId = !isScrolls ? pendingItem?.itemId : undefined

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-center gap-8 mb-4">
        {renderTeamSlots('1P')}
        {renderTeamSlots('2P')}
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={`搜索${isScrolls ? '密卷' : '通灵'}...`} className="pl-9 pr-9" />
        {search && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      {activeSlot && (
        <BPRecommendation
          myRole={myRole}
          phase={phase}
          team1P={team1P}
          team2P={team2P}
          usedNinjas={new Set()}
          banned1P={[]}
          banned2P={[]}
          myScrollHistory={myScrollHistory}
          opponentScrollHistory={opponentScrollHistory}
          mySummonHistory={mySummonHistory}
          opponentSummonHistory={opponentSummonHistory}
          currentScrolls1P={currentScrolls1P}
          currentScrolls2P={currentScrolls2P}
          currentSummons1P={currentSummons1P}
          currentSummons2P={currentSummons2P}
          activeSlot={{ type: activeSlot.type, player: activeSlot.player, index: activeSlot.index }}
          onSelectScroll={(scroll) => handleSelect(scroll)}
          onSelectSummon={(summon) => handleSelect(summon)}
          pendingScrollId={pendingScrollId}
          pendingSummonId={pendingSummonId}
        />
      )}

      {currentPlayer && (
        <>
          <div className="flex justify-center mt-2">
            <Button onClick={confirmCurrentSlot} disabled={!pendingItem} className="gap-2">
              <Check className="h-4 w-4" /> 确认当前{isScrolls ? '密卷' : '通灵'}
            </Button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {availableItems.map(item => {
              const isPending = pendingItem?.itemId === item.id
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${
                    isPending ? 'bg-primary/10 border-2 border-red-500' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                    <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-center leading-tight">{item.name}</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="flex justify-center mt-4">
        <Button onClick={onConfirm} disabled={!isComplete}>
          确认{isScrolls ? '密卷' : '通灵'}配置
        </Button>
      </div>
    </div>
  )
}