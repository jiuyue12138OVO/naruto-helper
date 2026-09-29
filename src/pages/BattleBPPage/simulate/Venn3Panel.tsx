import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import PickCard from './PickCard'
import NinjaInfoDialog from './NinjaInfoDialog'
import ScoreDetailDialog from './ScoreDetailDialog'
import { scorePickCandidate, type ScoreResult } from './recommend'
import type { INinja } from '@/data/ninjas'

interface Venn3PanelProps {
  mode: 'counter' | 'blind'
  currentSlot: { player: '1P' | '2P'; index: number } | null
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  onSelect: (ninja: INinja) => void
  pendingNinjaId?: string
  targets: INinja[]
  warningTarget?: INinja | null
  primaryIndex?: number
}

export default function Venn3Panel({
  mode,
  currentSlot,
  team1P, team2P,
  usedNinjas, banned1P, banned2P,
  onSelect, pendingNinjaId,
  targets, warningTarget,
  primaryIndex = 0,
}: Venn3PanelProps) {
  const { ninjas, counters, scrolls, summons } = useData()
  const [search, setSearch] = useState('')
  const [infoNinja, setInfoNinja] = useState<INinja | null>(null)
  const [scoreNinja, setScoreNinja] = useState<INinja | null>(null)
  const [showAll, setShowAll] = useState(false)

  const availableNinjas = useMemo(() => {
    const bannedIds = new Set<string>()
    banned1P.forEach(n => n && bannedIds.add(n.id))
    banned2P.forEach(n => n && bannedIds.add(n.id))
    const pickedIds = new Set<string>()
    ;[...team1P, ...team2P].forEach(n => n && pickedIds.add(n.id))
    return ninjas.filter(n => !usedNinjas.has(n.id) && !bannedIds.has(n.id) && !pickedIds.has(n.id))
  }, [ninjas, usedNinjas, banned1P, banned2P, team1P, team2P])

  const availableIds = useMemo(() => new Set(availableNinjas.map(n => n.id)), [availableNinjas])

  const targetA = targets[0] || null
  const targetB = targets[1] || null

  const countersTarget = (candidateId: string, targetId: string | null) => {
    if (!targetId) return false
    const tc = counters.find(c => c.ninjaId === targetId)
    return !!tc && tc.counterNinjaIds.includes(candidateId)
  }

  const computed = useMemo(() => {
    const left: { ninja: INinja; sr: ScoreResult }[] = []
    const middle: { ninja: INinja; sr: ScoreResult }[] = []
    const right: { ninja: INinja; sr: ScoreResult }[] = []

    availableNinjas.forEach(ninja => {
      const cA = countersTarget(ninja.id, targetA?.id || null)
      const cB = mode === 'counter' ? countersTarget(ninja.id, targetB?.id || null) : false
      const sr = scorePickCandidate(
        ninja,
        mode === 'counter' ? 'counter' : 'blind',
        targets,
        counters,
        primaryIndex,
      )

      if (mode === 'counter') {
        if (cA && cB) middle.push({ ninja, sr })
        else if (cA) left.push({ ninja, sr })
        else if (cB) right.push({ ninja, sr })
      } else {
        // 盲选模式：与上方对齐
        // 上方左=目标A → 下方左=克制位（克A非盲选）
        // 上方右=问号（本位置） → 下方右=盲选位（盲选非克A）
        // 中=交集（克A + 盲选）
        if (cA && !ninja.blindPick) left.push({ ninja, sr })
        else if (cA && ninja.blindPick) middle.push({ ninja, sr })
        else if (ninja.blindPick && !cA) right.push({ ninja, sr })
      }
    })

    const sortFn = (a: { sr: ScoreResult }, b: { sr: ScoreResult }) => b.sr.total - a.sr.total
    left.sort(sortFn)
    middle.sort(sortFn)
    right.sort(sortFn)

    return { left, middle, right }
  }, [availableNinjas, targetA, targetB, mode, targets, counters, primaryIndex])

  const filterList = (list: { ninja: INinja; sr: ScoreResult }[]) => {
    if (!search.trim()) return list
    const kw = search.toLowerCase()
    return list.filter(item => item.ninja.name.toLowerCase().includes(kw))
  }

  const leftList = filterList(computed.left)
  const middleList = filterList(computed.middle)
  const rightList = filterList(computed.right)

  const allAvailableScored = useMemo(() => {
    const merged = new Map<string, { ninja: INinja; sr: ScoreResult }>()
    ;[...computed.left, ...computed.middle, ...computed.right].forEach(x => {
      if (!merged.has(x.ninja.id)) merged.set(x.ninja.id, x)
    })
    availableNinjas.forEach(ninja => {
      if (!merged.has(ninja.id)) {
        const sr = scorePickCandidate(
          ninja,
          mode === 'counter' ? 'counter' : 'blind',
          targets,
          counters,
          primaryIndex,
        )
        merged.set(ninja.id, { ninja, sr })
      }
    })
    return Array.from(merged.values())
  }, [computed, availableNinjas, mode, targets, counters, primaryIndex])

  const filteredAll = useMemo(() => {
    if (!search.trim()) return allAvailableScored
    const kw = search.toLowerCase()
    return allAvailableScored.filter(x => x.ninja.name.toLowerCase().includes(kw))
  }, [allAvailableScored, search])

  if (!currentSlot) return null

  const renderColumn = (
    key: string,
    title: string,
    list: { ninja: INinja; sr: ScoreResult }[],
  ) => (
    <div className={`flex-1 min-w-0 flex flex-col gap-1 px-1 ${
      key === 'M' ? 'border-l border-r border-border/60' : ''
    }`}>
      <div className="text-xs text-center text-muted-foreground font-medium py-1 border-b">{title}</div>
      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">无{title}忍者</p>
      ) : (
        <div className="space-y-1">
          {chunk(list, 3).map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-1">
              {row.map(item => (
                <PickCard
                  key={item.ninja.id + key}
                  ninja={item.ninja}
                  isPending={pendingNinjaId === item.ninja.id}
                  score={item.sr.total}
                  warning={
                    warningTarget
                      ? (counters.find(c => c.ninjaId === warningTarget.id)?.counterNinjaIds || []).includes(item.ninja.id)
                      : false
                  }
                  size="sm"
                  onSelect={() => onSelect(item.ninja)}
                  onShowInfo={() => setInfoNinja(item.ninja)}
                  onShowScore={() => setScoreNinja(item.ninja)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // 目标头像（无文字，主要目标加金色高亮）
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
      {/* 目标区域 */}
      {mode === 'counter' ? (
        <div className="flex justify-around items-center gap-2">
          {targetA && renderTargetImage(targetA, primaryIndex === 0)}
          {targetB && renderTargetImage(targetB, primaryIndex === 1)}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center">
            {targetA && renderTargetImage(targetA, false)}
          </div>
          <div className="flex-1 flex items-center justify-center" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-14 h-14 rounded-md border-2 border-yellow-500 ring-2 ring-yellow-500/50 bg-muted flex items-center justify-center text-muted-foreground text-lg">
              ?
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative max-w-md flex-1 min-w-50">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
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
            {renderColumn(
              'L',
              mode === 'counter' ? `克制 ${targetA?.name || ''}` : `克制 ${targetA?.name || ''}`,
              leftList,
            )}
            {renderColumn('M', '交集', middleList)}
            {renderColumn(
              'R',
              mode === 'counter' ? `克制 ${targetB?.name || ''}` : '盲选位',
              rightList,
            )}
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredAll.map(({ ninja, sr }) => (
              <PickCard
                key={ninja.id}
                ninja={ninja}
                isPending={pendingNinjaId === ninja.id}
                score={sr.total}
                size="sm"
                onSelect={() => onSelect(ninja)}
                onShowInfo={() => setInfoNinja(ninja)}
                onShowScore={() => setScoreNinja(ninja)}
              />
            ))}
          </div>
        )}
      </div>

      <NinjaInfoDialog
        ninja={infoNinja}
        open={!!infoNinja}
        onOpenChange={(open) => !open && setInfoNinja(null)}
        ninjas={ninjas}
        counters={counters}
        scrolls={scrolls}
        summons={summons}
        availableNinjaIds={availableIds}
      />

      <ScoreDetailDialog
        open={!!scoreNinja}
        onOpenChange={(open) => !open && setScoreNinja(null)}
        title={scoreNinja?.name || ''}
        result={
          scoreNinja
            ? allAvailableScored.find(x => x.ninja.id === scoreNinja.id)?.sr || null
            : null
        }
      />
    </div>
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}