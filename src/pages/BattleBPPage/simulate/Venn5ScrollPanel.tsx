import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useData } from '@/contexts/DataContext'
import ScoreDetailDialog from './ScoreDetailDialog'
import { scoreScrollOrSummonCandidate, type ScoreResult } from './recommend'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

interface Venn5ScrollPanelProps {
  type: 'scroll' | 'summon'
  /** targets 顺序：[2号位(顶部), 1号位(左下), 3号位(右下)] */
  targets: INinja[]
  availableItems: (IScroll | ISummon)[]
  onSelect: (item: IScroll | ISummon) => void
  pendingItemId?: string
  /** 主要目标索引（默认 0 = 顶部 2号位） */
  primaryIndex?: number
}

type RegionKey = 'A' | 'B' | 'C' | 'AB' | 'BC' | 'AC' | 'ABC'

export default function Venn5ScrollPanel({
  type, targets, availableItems, onSelect, pendingItemId, primaryIndex = 0,
}: Venn5ScrollPanelProps) {
  const { counters } = useData()
  const [search, setSearch] = useState('')
  const [scoreItem, setScoreItem] = useState<IScroll | ISummon | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<RegionKey | null>(null)
  const [showAll, setShowAll] = useState(false)

  const [T2, T1, T3] = targets

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

  const regions = useMemo(() => {
    const map: Record<RegionKey, { item: IScroll | ISummon; sr: ScoreResult }[]> = {
      A: [], B: [], C: [], AB: [], BC: [], AC: [], ABC: [],
    }

    availableItems.forEach(item => {
      const c1 = countersTarget(item.id, T1)
      const c2 = countersTarget(item.id, T2)
      const c3 = countersTarget(item.id, T3)
      const sr = scoreOf(item.id)

      if (c1 && c2 && c3) map.ABC.push({ item, sr })
      else if (c1 && c2) map.AB.push({ item, sr })
      else if (c2 && c3) map.BC.push({ item, sr })
      else if (c1 && c3) map.AC.push({ item, sr })
      else if (c1) map.A.push({ item, sr })
      else if (c2) map.B.push({ item, sr })
      else if (c3) map.C.push({ item, sr })
    })

    const sortFn = (a: { sr: ScoreResult }, b: { sr: ScoreResult }) => b.sr.total - a.sr.total
    Object.values(map).forEach(arr => arr.sort(sortFn))
    return map
  }, [availableItems, T1, T2, T3, counters, type])

  // 全部可用（合并所有区域 + 不克制任何目标的）
  const allAvailableScored = useMemo(() => {
    const merged = new Map<string, { item: IScroll | ISummon; sr: ScoreResult }>()
    Object.values(regions).forEach(arr => {
      arr.forEach(x => {
        if (!merged.has(x.item.id)) merged.set(x.item.id, x)
      })
    })
    availableItems.forEach(item => {
      if (!merged.has(item.id)) {
        merged.set(item.id, { item, sr: scoreOf(item.id) })
      }
    })
    return Array.from(merged.values()).sort((a, b) => b.sr.total - a.sr.total)
  }, [regions, availableItems, type])

  const filteredAll = useMemo(() => {
    if (!search.trim()) return allAvailableScored
    const kw = search.toLowerCase()
    return allAvailableScored.filter(x => x.item.name.toLowerCase().includes(kw))
  }, [allAvailableScored, search])

  const renderItemIcon = (item: IScroll | ISummon, sr: ScoreResult) => {
    const isPending = pendingItemId === item.id
    return (
      <div
        key={item.id}
        className={`relative w-7 h-7 rounded-full overflow-hidden border cursor-pointer transition-all ${
          isPending ? 'border-red-500 ring-2 ring-red-500' : 'border-border/60 hover:border-primary'
        }`}
        onClick={() => onSelect(item)}
        title={`${item.name}（分数 ${sr.total.toFixed(2)}）`}
        onContextMenu={(e) => { e.preventDefault(); setScoreItem(item) }}
      >
        <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  const renderRegion = (
    list: { item: IScroll | ISummon; sr: ScoreResult }[],
    key: RegionKey,
    maxShow = 6,
  ) => {
    if (list.length === 0) return null
    const showList = list.slice(0, maxShow)
    const extra = list.length - maxShow
    return (
      <div className="flex flex-wrap gap-0.5 justify-center items-center">
        {showList.map(({ item, sr }) => renderItemIcon(item, sr))}
        {extra > 0 && (
          <button
            className="w-7 h-7 rounded-full bg-muted text-[9px] font-bold text-foreground flex items-center justify-center hover:bg-accent"
            onClick={() => setExpandedRegion(key)}
            title={`查看全部 ${list.length} 个`}
          >
            +{extra}
          </button>
        )}
      </div>
    )
  }

  // 目标图像（主要目标金色高亮）
  const renderTargetIcon = (target: INinja, isPrimary: boolean) => (
    <div className={`rounded-md overflow-hidden border-2 bg-card shadow ${
      isPrimary
        ? 'w-14 h-14 border-yellow-500 ring-2 ring-yellow-500/50'
        : 'w-12 h-12 border-border/60'
    }`}>
      <Image src={target.imageUrl} alt={target.name} className="w-full h-full object-cover" />
    </div>
  )

  return (
    <div className="space-y-4 mt-4">
      {/* 搜索 + 切换 */}
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

      {/* 全部可用视图 */}
      {showAll && (
        <div className="max-h-[600px] overflow-y-auto">
          {filteredAll.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">无匹配</p>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredAll.map(({ item, sr }) => (
                <div
                  key={item.id}
                  className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
                    pendingItemId === item.id
                      ? 'bg-primary/10 border-2 border-red-500'
                      : 'border-2 border-transparent hover:bg-muted/50'
                  }`}
                  onClick={() => onSelect(item)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                    <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-center leading-tight truncate w-full">{item.name}</span>
                  <button
                    className={`text-[10px] font-bold rounded px-1 ${
                      sr.total > 0 ? 'text-green-500' : sr.total < 0 ? 'text-red-500' : 'text-muted-foreground'
                    } hover:bg-muted/60`}
                    onClick={(e) => { e.stopPropagation(); setScoreItem(item) }}
                  >
                    {sr.total > 0 ? `+${sr.total.toFixed(2)}` : sr.total.toFixed(2)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 推荐视图（三圆图） */}
      {!showAll && (
        <div className="overflow-x-auto">
          <div className="relative w-[720px] h-[680px] mx-auto">
            <div className="absolute rounded-full border-2 border-red-500/40 bg-red-500/5 pointer-events-none"
              style={{ left: 360, top: 230, width: 340, height: 340, transform: 'translate(-50%, -50%)' }} />
            <div className="absolute rounded-full border-2 border-blue-500/40 bg-blue-500/5 pointer-events-none"
              style={{ left: 210, top: 440, width: 340, height: 340, transform: 'translate(-50%, -50%)' }} />
            <div className="absolute rounded-full border-2 border-green-500/40 bg-green-500/5 pointer-events-none"
              style={{ left: 510, top: 440, width: 340, height: 340, transform: 'translate(-50%, -50%)' }} />

            {T2 && (
              <div className="absolute z-10" style={{ left: 360, top: 0, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T2, primaryIndex === 0)}
              </div>
            )}
            {T1 && (
              <div className="absolute z-10" style={{ left: 30, top: 620, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T1, primaryIndex === 1)}
              </div>
            )}
            {T3 && (
              <div className="absolute z-10" style={{ left: 690, top: 620, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T3, primaryIndex === 2)}
              </div>
            )}

            <div className="absolute z-20" style={{ left: 110, top: 380, transform: 'translateX(-50%)', width: 130 }}>
              <div className="flex justify-center">{renderRegion(regions.A, 'A', 6)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 360, top: 100, transform: 'translateX(-50%)', width: 140 }}>
              <div className="flex justify-center">{renderRegion(regions.B, 'B', 9)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 610, top: 380, transform: 'translateX(-50%)', width: 130 }}>
              <div className="flex justify-center">{renderRegion(regions.C, 'C', 6)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 240, top: 270, transform: 'translateX(-50%)', width: 100 }}>
              <div className="flex justify-center">{renderRegion(regions.AB, 'AB', 4)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 480, top: 270, transform: 'translateX(-50%)', width: 100 }}>
              <div className="flex justify-center">{renderRegion(regions.BC, 'BC', 4)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 360, top: 460, transform: 'translateX(-50%)', width: 110 }}>
              <div className="flex justify-center">{renderRegion(regions.AC, 'AC', 4)}</div>
            </div>
            <div className="absolute z-20" style={{ left: 360, top: 350, transform: 'translateX(-50%)', width: 90 }}>
              <div className="flex justify-center">{renderRegion(regions.ABC, 'ABC', 3)}</div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!expandedRegion} onOpenChange={(open) => !open && setExpandedRegion(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {expandedRegion === 'A' && `${T1?.name || '1号位'}`}
              {expandedRegion === 'B' && `${T2?.name || '2号位'}`}
              {expandedRegion === 'C' && `${T3?.name || '3号位'}`}
              {expandedRegion === 'AB' && `${T1?.name} ∩ ${T2?.name}`}
              {expandedRegion === 'BC' && `${T2?.name} ∩ ${T3?.name}`}
              {expandedRegion === 'AC' && `${T1?.name} ∩ ${T3?.name}`}
              {expandedRegion === 'ABC' && `三者交集`}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {expandedRegion && regions[expandedRegion].map(({ item, sr }) => (
                <div
                  key={item.id}
                  className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded ${
                    pendingItemId === item.id ? 'bg-primary/10 border-2 border-red-500' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelect(item)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                    <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-center truncate w-full">{item.name}</span>
                  <button
                    className={`text-[10px] font-bold ${sr.total > 0 ? 'text-green-500' : sr.total < 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={(e) => { e.stopPropagation(); setScoreItem(item) }}
                  >
                    {sr.total > 0 ? `+${sr.total.toFixed(2)}` : sr.total.toFixed(2)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ScoreDetailDialog
        open={!!scoreItem}
        onOpenChange={(open) => !open && setScoreItem(null)}
        title={scoreItem?.name || ''}
        result={scoreItem ? scoreOf(scoreItem.id) : null}
      />
    </div>
  )
}