import { useState, useMemo } from 'react'
import { Search, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import NinjaInfoDialog from './NinjaInfoDialog'
import ScoreDetailDialog from './ScoreDetailDialog'
import { scorePickCandidate } from './recommend'
import type { INinja } from '@/data/ninjas'

interface CounterPickPanelProps {
  myRole: '1P' | '2P'
  currentSlot: { player: '1P' | '2P'; index: number } | null
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  onSelect: (ninja: INinja) => void
  pendingNinjaId?: string
  target: INinja | null
}

export default function CounterPickPanel({
  currentSlot,
  team1P, team2P,
  usedNinjas, banned1P, banned2P,
  onSelect, pendingNinjaId,
  target,
}: CounterPickPanelProps) {
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

  // 评分并排序
  const scoredList = useMemo(() => {
    const targets = target ? [target] : []
    const list = availableNinjas.map(ninja => ({
      ninja,
      scoreResult: scorePickCandidate(ninja, 'counter', targets, counters),
    }))
    list.sort((a, b) => b.scoreResult.total - a.scoreResult.total)
    return list
  }, [availableNinjas, target, counters])

  // 搜索过滤
  const filtered = useMemo(() => {
    if (!search.trim()) return scoredList
    const kw = search.toLowerCase()
    return scoredList.filter(item => item.ninja.name.toLowerCase().includes(kw))
  }, [scoredList, search])

  if (!currentSlot) return null

  const renderNinjaCard = (ninja: INinja, score: number, showScore: boolean = true) => {
    const isPending = pendingNinjaId === ninja.id
    return (
      <div
        key={ninja.id}
        className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
          isPending ? 'bg-primary/10 border-2 border-red-500' : 'border-2 border-transparent hover:bg-muted/50'
        }`}
        onClick={() => onSelect(ninja)}
      >
        <div className="relative w-14 h-14 rounded-md overflow-hidden border border-border/40 bg-card">
          <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
          <button
            className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-bl text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); setInfoNinja(ninja) }}
            title="查看忍者信息"
          >
            <Info className="size-3" />
          </button>
        </div>
        <span className="text-xs text-center leading-tight truncate w-full">{ninja.name}</span>
        <Badge variant="outline" className="text-[10px] px-1">{ninja.tier}</Badge>
        {showScore && (
          <button
            className={`text-[10px] font-bold rounded px-1 ${
              score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
            } hover:bg-muted/60`}
            onClick={(e) => { e.stopPropagation(); setScoreNinja(ninja) }}
            title="查看评分详情"
          >
            {score > 0 ? `+${score}` : score}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {/* 目标忍者大图 */}
      {target && (
        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/40 bg-card">
            <Image src={target.imageUrl} alt={target.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs text-muted-foreground">克制 {target.name}</span>
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

      {/* 推荐列表 / 全部列表 */}
      <div className="max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">无匹配忍者</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filtered.map(({ ninja, scoreResult }) => renderNinjaCard(ninja, scoreResult.total, !showAll))}
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
        result={scoreNinja ? scoredList.find(s => s.ninja.id === scoreNinja.id)?.scoreResult || null : null}
      />
    </div>
  )
}