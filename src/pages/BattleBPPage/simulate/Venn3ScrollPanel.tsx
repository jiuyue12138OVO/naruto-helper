import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import ScoreDetailDialog from './ScoreDetailDialog'
import { scoreScrollOrSummonCandidate, type ScoreResult } from './recommend'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

interface Venn3ScrollPanelProps {
  type: 'scroll' | 'summon'
  targets: INinja[]
  availableItems: (IScroll | ISummon)[]
  onSelect: (item: IScroll | ISummon) => void
  pendingItemId?: string
  primaryIndex?: number
}

export default function Venn3ScrollPanel({
  type, targets, availableItems, onSelect, pendingItemId, primaryIndex = 0,
}: Venn3ScrollPanelProps) {
  const { counters } = useData()
  const [search, setSearch] = useState('')
  const [scoreItem, setScoreItem] = useState<IScroll | ISummon | null>(null)
  const [showAll, setShowAll] = useState(false)

  const [A, B] = targets

  const countersTarget = (itemId: string, target: INinja | undefined) => {
    if (!target) return false
    const tc = counters.find(c => c.ninjaId === target.id)
    if (!tc) return false
    const ids = type === 'scroll' ? tc.counterScrollIds : tc.counterSummonIds
    return ids.includes(itemId)
  }

  const scoreOf = (itemId: string) =>
    scoreScrollOrSummonCandidate(
      itemId,
      targets.filter(Boolean),
      counters,
      new Set(availableItems.map(i => i.id)),
      type,
    )

  const computed = useMemo(() => {
    const left: { item: IScroll | ISummon; sr: ScoreResult }[] = []
    const middle: { item: IScroll | ISummon; sr: ScoreResult }[] = []
    const right: { item: IScroll | ISummon; sr: ScoreResult }[] = []

    availableItems.forEach(item => {
      const cA = countersTarget(item.id, A)
      const cB = countersTarget(item.id, B)
      const sr = scoreOf(item.id)

      if (cA && cB) middle.push({ item, sr })
      else if (cA) left.push({ item, sr })
      else if (cB) right.push({ item, sr })
    })

    const sortFn = (a: { sr: ScoreResult }, b: { sr: ScoreResult }) => b.sr.total - a.sr.total
    ;[left, middle, right].forEach(arr => arr.sort(sortFn))

    return { left, middle, right }
  }, [availableItems, A, B, counters, type])

  const allAvailableScored = useMemo(() => {
    const merged = new Map<string, { item: IScroll | ISummon; sr: ScoreResult }>()
    ;[...computed.left, ...computed.middle, ...computed.right].forEach(x => {
      if (!merged.has(x.item.id)) merged.set(x.item.id, x)
    })
    availableItems.forEach(item => {
      if (!merged.has(item.id)) {
        merged.set(item.id, { item, sr: scoreOf(item.id) })
      }
    })
    return Array.from(merged.values())
  }, [computed, availableItems, type])

  const filterList = (list: { item: IScroll | ISummon; sr: ScoreResult }[]) => {
    if (!search.trim()) return list
    const kw = search.toLowerCase()
    return list.filter(x => x.item.name.toLowerCase().includes(kw))
  }

  const filteredAll = useMemo(() => {
    if (!search.trim()) return allAvailableScored
    const kw = search.toLowerCase()
    return allAvailableScored.filter(x => x.item.name.toLowerCase().includes(kw))
  }, [allAvailableScored, search])

  const renderColumn = (
    key: string,
    title: string,
    list: { item: IScroll | ISummon; sr: ScoreResult }[],
  ) => (
    <div className={`flex-1 min-w-0 flex flex-col gap-1 px-1 ${
      key === 'M' ? 'border-l border-r border-border/60' : ''
    }`}>
      <div className="text-xs text-center text-muted-foreground font-medium py-1 border-b">{title}</div>
      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">无</p>
      ) : (
        <div className="space-y-1">
          {chunk(list, 3).map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-1">
              {row.map(({ item, sr }) => (
                <ItemCard
                  key={item.id + key}
                  item={item}
                  isPending={pendingItemId === item.id}
                  score={sr.total}
                  onSelect={() => onSelect(item)}
                  onShowScore={() => setScoreItem(item)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // 目标图像，主要目标加金色高亮
  const renderTargetImage = (target: INinja, isPrimary: boolean) => (
    <div className="flex items-center justify-center h-16">
      <div className={`rounded-md overflow-hidden border-2 bg-card ${
        isPrimary
          ? 'w-14 h-14 border-yellow-500 ring-2 ring-yellow-500/50'
          : 'w-12 h-12 border-border/60'
      }`}>
        <Image src={target.imageUrl} alt={target.name} className="w-full h-full object-cover" />
      </div>
    </div>
  )

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-around items-center gap-2">
        {A && renderTargetImage(A, primaryIndex === 0)}
        {B && renderTargetImage(B, primaryIndex === 1)}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative max-w-md flex-1 min-w-50">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={`搜索${type === 'scroll' ? '密卷' : '通灵'}...`} className="pl-9 pr-9" />
          {search && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setShowAll(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${!showAll ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            推荐
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${showAll ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            全部可用
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {!showAll ? (
          <div className="flex gap-2">
            {renderColumn('L', `克制 ${A?.name || ''}`, filterList(computed.left))}
            {renderColumn('M', '交集', filterList(computed.middle))}
            {renderColumn('R', `克制 ${B?.name || ''}`, filterList(computed.right))}
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredAll.map(({ item, sr }) => (
              <ItemCard
                key={item.id}
                item={item}
                isPending={pendingItemId === item.id}
                score={sr.total}
                onSelect={() => onSelect(item)}
                onShowScore={() => setScoreItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      <ScoreDetailDialog
        open={!!scoreItem}
        onOpenChange={(open) => !open && setScoreItem(null)}
        title={scoreItem?.name || ''}
        result={scoreItem ? scoreOf(scoreItem.id) : null}
      />
    </div>
  )
}

function ItemCard({
  item, isPending, score, onSelect, onShowScore,
}: {
  item: IScroll | ISummon
  isPending: boolean
  score: number
  onSelect: () => void
  onShowScore: () => void
}) {
  return (
    <div
      className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
        isPending ? 'bg-primary/10 border-2 border-red-500' : 'border-2 border-transparent hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
        <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-[10px] text-center leading-tight truncate w-full">{item.name}</span>
      <button
        className={`text-[10px] font-bold rounded px-1 ${
          score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
        } hover:bg-muted/60`}
        onClick={(e) => { e.stopPropagation(); onShowScore() }}
      >
        {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
      </button>
    </div>
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}