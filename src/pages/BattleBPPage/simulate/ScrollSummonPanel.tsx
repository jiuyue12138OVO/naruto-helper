import { Info } from 'lucide-react'
import { useState } from 'react'
import { Image } from '@/components/ui/image'
import Venn3ScrollPanel from './Venn3ScrollPanel'
import Venn5ScrollPanel from './Venn5ScrollPanel'
import NinjaInfoDialog from './NinjaInfoDialog'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

interface ScrollSummonPanelProps {
  phase: 'scrolls' | 'summons'
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  current1P: (string | null)[]
  current2P: (string | null)[]
  available1P: (IScroll | ISummon)[]
  available2P: (IScroll | ISummon)[]
  activeSlot: { player: '1P' | '2P'; index: number } | null
  onSlotClick: (player: '1P' | '2P', index: number) => void
  onSelectItem: (itemId: string) => void
  pendingItemId: string | null
}

export default function ScrollSummonPanel({
  phase,
  team1P, team2P,
  current1P, current2P,
  available1P, available2P,
  activeSlot,
  onSlotClick,
  onSelectItem,
  pendingItemId,
}: ScrollSummonPanelProps) {
  const { ninjas, counters, scrolls, summons } = useData()
  const [infoNinja, setInfoNinja] = useState<INinja | null>(null)

  const isScrolls = phase === 'scrolls'
  const label = isScrolls ? '密卷' : '通灵'

  if (!activeSlot) return null

  const { player: currentPlayer, index: currentIndex } = activeSlot
  const enemyTeam = currentPlayer === '1P' ? team2P : team1P
  const availableItems = currentPlayer === '1P' ? available1P : available2P

  // 目标：对位目标放在主要位置
  const targets: INinja[] = (() => {
    if (currentIndex === 0) return [enemyTeam[0], enemyTeam[1]].filter(Boolean) as INinja[]
    if (currentIndex === 1) return [enemyTeam[1], enemyTeam[0], enemyTeam[2]].filter(Boolean) as INinja[]
    if (currentIndex === 2) return [enemyTeam[1], enemyTeam[2]].filter(Boolean) as INinja[]
    return []
  })()

  // 主要目标索引：1号位主要看0号，2号位主要看1号，3号位主要看2号
  const primaryIndex = (() => {
    if (currentIndex === 0) return 0  // 目标是 [e0, e1]，主要 e0
    if (currentIndex === 1) return 0  // 目标是 [e1, e0, e2]，主要 e1 → 索引 0
    if (currentIndex === 2) return 1  // 目标是 [e1, e2]，主要 e2 → 索引 1
    return 0
  })()

  const type = isScrolls ? 'scroll' : 'summon'

  const renderPanel = () => {
    if (targets.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-6">无可参考的敌方阵容</p>
    }
    if (currentIndex === 1) {
      return (
        <Venn5ScrollPanel
          type={type}
          targets={targets}
          availableItems={availableItems}
          onSelect={(item) => onSelectItem(item.id)}
          pendingItemId={pendingItemId ?? undefined}
          primaryIndex={primaryIndex}
        />
      )
    }
    return (
      <Venn3ScrollPanel
        type={type}
        targets={targets}
        availableItems={availableItems}
        onSelect={(item) => onSelectItem(item.id)}
        pendingItemId={pendingItemId ?? undefined}
        primaryIndex={primaryIndex}
      />
    )
  }

  // 位置指示器：1P 3-2-1 | 2P 1-2-3
  const slotList: { player: '1P' | '2P'; index: number; team: (INinja | null)[]; current: (string | null)[] }[] = [
    { player: '1P', index: 2, team: team1P, current: current1P },
    { player: '1P', index: 1, team: team1P, current: current1P },
    { player: '1P', index: 0, team: team1P, current: current1P },
    { player: '2P', index: 0, team: team2P, current: current2P },
    { player: '2P', index: 1, team: team2P, current: current2P },
    { player: '2P', index: 2, team: team2P, current: current2P },
  ]

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-center gap-2 flex-wrap">
        {slotList.map(({ player, index, team, current }, i) => {
          const isActive = activeSlot.player === player && activeSlot.index === index
          const isFilled = !!current[index]
          const ninja = team[index]
          return (
            <div key={`${player}-${index}`} className="flex items-center gap-2">
              {i === 3 && <div className="w-px h-10 bg-border mx-1" />}
              <div
                className={`flex flex-col items-center gap-0.5 cursor-pointer p-1 rounded ${
                  isActive ? 'ring-2 ring-primary bg-primary/10' : ''
                }`}
                onClick={() => onSlotClick(player, index)}
              >
                <div className={`relative w-10 h-10 rounded-md overflow-hidden border-2 ${
                  isActive ? 'border-primary' : isFilled ? 'border-green-500/60' : 'border-border/40'
                }`}>
                  {ninja && (
                    <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                  )}
                  {ninja && (
                    <button
                      className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-bl text-muted-foreground hover:text-foreground"
                      onClick={(e) => { e.stopPropagation(); setInfoNinja(ninja) }}
                      title="查看忍者信息"
                    >
                      <Info className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {renderPanel()}

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