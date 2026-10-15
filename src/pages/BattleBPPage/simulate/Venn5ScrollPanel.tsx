import { useState, useMemo, useCallback } from 'react'
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
import type { IBPCounter } from '@/data/battleBp'
import { cn } from '@/lib/utils'

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

interface ScoredItem {
  item: IScroll | ISummon
  sr: ScoreResult
}

// 三圆图布局常量（画布 720x680），集中管理避免魔法数字散落
const VENN_LAYOUT = {
  canvas: { width: 720, height: 680 },
  targets: {
    B: { left: 360, top: 0 },   // 顶部 2号位
    A: { left: 30, top: 620 },  // 左下 1号位
    C: { left: 690, top: 620 }, // 右下 3号位
  },
  regions: {
    A: { left: 110, top: 380, width: 130 },
    B: { left: 360, top: 100, width: 140 },
    C: { left: 610, top: 380, width: 130 },
    AB: { left: 240, top: 270, width: 100 },
    BC: { left: 480, top: 270, width: 100 },
    AC: { left: 360, top: 460, width: 110 },
    ABC: { left: 360, top: 350, width: 90 },
  },
  maxShow: { A: 6, B: 9, C: 6, AB: 4, BC: 4, AC: 4, ABC: 3 } as Record<RegionKey, number>,
  circles: [
    // 顶部红圆 = B（2号位）
    { left: 360, top: 230, size: 340, className: 'border-red-500/40 bg-red-500/5' },
    // 左下蓝圆 = A（1号位）
    { left: 210, top: 440, size: 340, className: 'border-blue-500/40 bg-blue-500/5' },
    // 右下绿圆 = C（3号位）
    { left: 510, top: 440, size: 340, className: 'border-green-500/40 bg-green-500/5' },
  ],
} as const

// 通用网格卡片：头像 + 名称 + 分数按钮（"全部可用"与"展开区域"共用）
function GridItem({
  item, sr, pending, onSelect, onShowScore,
}: {
  item: IScroll | ISummon
  sr: ScoreResult
  pending: boolean
  onSelect: (item: IScroll | ISummon) => void
  onShowScore: (item: IScroll | ISummon) => void
}) {
  return (
    <div
      className={cn(
        'cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors border-2',
        pending
          ? 'bg-primary/10 border-red-500'
          : 'border-transparent hover:bg-muted/50',
      )}
      onClick={() => onSelect(item)}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
        <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-[10px] text-center leading-tight truncate w-full">{item.name}</span>
      <button
        className={cn(
          'text-[10px] font-bold rounded px-1 hover:bg-muted/60',
          sr.total > 0 ? 'text-green-500' : sr.total < 0 ? 'text-red-500' : 'text-muted-foreground',
        )}
        onClick={(e) => { e.stopPropagation(); onShowScore(item) }}
      >
        {sr.total > 0 ? `+${sr.total.toFixed(2)}` : sr.total.toFixed(2)}
      </button>
    </div>
  )
}

export default function Venn5ScrollPanel({
  type, targets, availableItems, onSelect, pendingItemId, primaryIndex = 0,
}: Venn5ScrollPanelProps) {
  const { counters } = useData()
  const [search, setSearch] = useState('')
  const [scoreItem, setScoreItem] = useState<IScroll | ISummon | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<RegionKey | null>(null)
  const [showAll, setShowAll] = useState(false)

  const [T2, T1, T3] = targets
  // 过滤掉空占位目标（原逻辑中 scoreOf 内部也做了一次 filter）
  const validTargets = useMemo(() => targets.filter(Boolean), [targets])

  // 预处理 counters 索引：ninjaId -> counter，避免每个物品评分时线性查找
  const countersByNinja = useMemo(() => {
    const map = new Map<string, IBPCounter>()
    counters.forEach(c => map.set(c.ninjaId, c))
    return map
  }, [counters])

  // 可用物品 id 集合（供稀缺度计算复用）
  const availableIdSet = useMemo(() => new Set(availableItems.map(i => i.id)), [availableItems])

  const countersTarget = useCallback((itemId: string, target: INinja | undefined) => {
    if (!target) return false
    const tc = countersByNinja.get(target.id)
    if (!tc) return false
    const ids = type === 'scroll' ? tc.counterScrollIds : tc.counterSummonIds
    return ids.includes(itemId)
  }, [countersByNinja, type])

  // 评分缓存：每个可用物品只计算一次评分，regions / 全部可用 / 评分弹窗 共用
  const scoresById = useMemo(() => {
    const map = new Map<string, ScoreResult>()
    availableItems.forEach(item => {
      map.set(item.id, scoreScrollOrSummonCandidate(item.id, validTargets, counters, availableIdSet, type))
    })
    return map
  }, [availableItems, validTargets, counters, availableIdSet, type])

  const scoreOf = useCallback((itemId: string): ScoreResult =>
    scoresById.get(itemId) || { total: 0, details: [] },
  [scoresById])

  const regions = useMemo(() => {
    const map: Record<RegionKey, ScoredItem[]> = {
      A: [], B: [], C: [], AB: [], BC: [], AC: [], ABC: [],
    }

    availableItems.forEach(item => {
      const c1 = countersTarget(item.id, T1)
      const c2 = countersTarget(item.id, T2)
      const c3 = countersTarget(item.id, T3)
      const sr = scoresById.get(item.id)!

      if (c1 && c2 && c3) map.ABC.push({ item, sr })
      else if (c1 && c2) map.AB.push({ item, sr })
      else if (c2 && c3) map.BC.push({ item, sr })
      else if (c1 && c3) map.AC.push({ item, sr })
      else if (c1) map.A.push({ item, sr })
      else if (c2) map.B.push({ item, sr })
      else if (c3) map.C.push({ item, sr })
    })

    const sortFn = (a: ScoredItem, b: ScoredItem) => b.sr.total - a.sr.total
    Object.values(map).forEach(arr => arr.sort(sortFn))
    return map
  }, [availableItems, T1, T2, T3, countersTarget, scoresById])

  // 全部可用（合并所有区域 + 不克制任何目标的），按评分降序
  const allAvailableScored = useMemo(() => {
    const merged = new Map<string, ScoredItem>()
    Object.values(regions).forEach(arr => {
      arr.forEach(x => {
        if (!merged.has(x.item.id)) merged.set(x.item.id, x)
      })
    })
    availableItems.forEach(item => {
      if (!merged.has(item.id)) {
        merged.set(item.id, { item, sr: scoresById.get(item.id)! })
      }
    })
    return Array.from(merged.values()).sort((a, b) => b.sr.total - a.sr.total)
  }, [regions, availableItems, scoresById])

  // 输入搜索时自动切到"全部可用"视图（原逻辑在推荐视图输入搜索无任何反馈）
  const hasSearch = search.trim().length > 0
  const effectiveShowAll = showAll || hasSearch

  const filteredAll = useMemo(() => {
    if (!hasSearch) return allAvailableScored
    const kw = search.toLowerCase()
    return allAvailableScored.filter(x => x.item.name.toLowerCase().includes(kw))
  }, [allAvailableScored, search, hasSearch])

  // 展开区域的标题（原 ABC 硬编码"三者交集"，现展示具体忍者名）
  const regionTitle = (key: RegionKey): string => {
    const name1 = T1?.name || '1号位'
    const name2 = T2?.name || '2号位'
    const name3 = T3?.name || '3号位'
    switch (key) {
      case 'A': return name1
      case 'B': return name2
      case 'C': return name3
      case 'AB': return `${name1} ∩ ${name2}`
      case 'BC': return `${name2} ∩ ${name3}`
      case 'AC': return `${name1} ∩ ${name3}`
      case 'ABC': return `三者交集：${name1} ∩ ${name2} ∩ ${name3}`
    }
  }

  // 三圆图内的小圆点图标
  const renderItemIcon = (item: IScroll | ISummon, sr: ScoreResult) => {
    const isPending = pendingItemId === item.id
    return (
      <div
        key={item.id}
        className={cn(
          'relative w-7 h-7 rounded-full overflow-hidden border cursor-pointer transition-all',
          isPending ? 'border-red-500 ring-2 ring-red-500' : 'border-border/60 hover:border-primary',
        )}
        onClick={() => onSelect(item)}
        title={`${item.name}（分数 ${sr.total.toFixed(2)}）`}
        onContextMenu={(e) => { e.preventDefault(); setScoreItem(item) }}
      >
        <Image src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  const renderRegion = (list: ScoredItem[], key: RegionKey) => {
    if (list.length === 0) return null
    const maxShow = VENN_LAYOUT.maxShow[key]
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
    <div className={cn(
      'rounded-md overflow-hidden border-2 bg-card shadow',
      isPrimary ? 'w-14 h-14 border-yellow-500 ring-2 ring-yellow-500/50' : 'w-12 h-12 border-border/60',
    )}>
      <Image src={target.imageUrl} alt={target.name} className="w-full h-full object-cover" />
    </div>
  )

  // 推荐视图是否完全为空（用于空态提示）
  const hasAnyRegion = Object.values(regions).some(arr => arr.length > 0)

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
            onClick={() => { setShowAll(false); setSearch('') }}
            className={cn('px-3 py-1 text-sm rounded-md transition-colors',
              !effectiveShowAll ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            推荐
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={cn('px-3 py-1 text-sm rounded-md transition-colors',
              effectiveShowAll ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            全部可用
          </button>
        </div>
      </div>

      {/* 全部可用视图 */}
      {effectiveShowAll && (
        <div className="max-h-[600px] overflow-y-auto">
          {filteredAll.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">无匹配</p>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredAll.map(({ item, sr }) => (
                <GridItem
                  key={item.id}
                  item={item}
                  sr={sr}
                  pending={pendingItemId === item.id}
                  onSelect={onSelect}
                  onShowScore={setScoreItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 推荐视图（三圆图） */}
      {!effectiveShowAll && (
        <div className="overflow-x-auto">
          <div className="relative w-[720px] h-[680px] mx-auto">
            {VENN_LAYOUT.circles.map((circle, i) => (
              <div
                key={i}
                className={cn('absolute rounded-full border-2 pointer-events-none', circle.className)}
                style={{
                  left: circle.left,
                  top: circle.top,
                  width: circle.size,
                  height: circle.size,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {T2 && (
              <div className="absolute z-10" style={{ left: VENN_LAYOUT.targets.B.left, top: VENN_LAYOUT.targets.B.top, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T2, primaryIndex === 0)}
              </div>
            )}
            {T1 && (
              <div className="absolute z-10" style={{ left: VENN_LAYOUT.targets.A.left, top: VENN_LAYOUT.targets.A.top, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T1, primaryIndex === 1)}
              </div>
            )}
            {T3 && (
              <div className="absolute z-10" style={{ left: VENN_LAYOUT.targets.C.left, top: VENN_LAYOUT.targets.C.top, transform: 'translateX(-50%)' }}>
                {renderTargetIcon(T3, primaryIndex === 2)}
              </div>
            )}

            {!hasAnyRegion ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-muted-foreground bg-background/70 backdrop-blur-sm rounded-lg px-4 py-2">
                  暂无克制当前三位忍者的{type === 'scroll' ? '密卷' : '通灵'}，可切换"全部可用"查看
                </p>
              </div>
            ) : (
              <>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.A.left, top: VENN_LAYOUT.regions.A.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.A.width }}>
                  <div className="flex justify-center">{renderRegion(regions.A, 'A')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.B.left, top: VENN_LAYOUT.regions.B.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.B.width }}>
                  <div className="flex justify-center">{renderRegion(regions.B, 'B')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.C.left, top: VENN_LAYOUT.regions.C.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.C.width }}>
                  <div className="flex justify-center">{renderRegion(regions.C, 'C')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.AB.left, top: VENN_LAYOUT.regions.AB.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.AB.width }}>
                  <div className="flex justify-center">{renderRegion(regions.AB, 'AB')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.BC.left, top: VENN_LAYOUT.regions.BC.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.BC.width }}>
                  <div className="flex justify-center">{renderRegion(regions.BC, 'BC')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.AC.left, top: VENN_LAYOUT.regions.AC.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.AC.width }}>
                  <div className="flex justify-center">{renderRegion(regions.AC, 'AC')}</div>
                </div>
                <div className="absolute z-20" style={{ left: VENN_LAYOUT.regions.ABC.left, top: VENN_LAYOUT.regions.ABC.top, transform: 'translateX(-50%)', width: VENN_LAYOUT.regions.ABC.width }}>
                  <div className="flex justify-center">{renderRegion(regions.ABC, 'ABC')}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Dialog open={!!expandedRegion} onOpenChange={(open) => !open && setExpandedRegion(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{expandedRegion ? regionTitle(expandedRegion) : ''}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {expandedRegion && regions[expandedRegion].map(({ item, sr }) => (
                <GridItem
                  key={item.id}
                  item={item}
                  sr={sr}
                  pending={pendingItemId === item.id}
                  onSelect={onSelect}
                  onShowScore={setScoreItem}
                />
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
