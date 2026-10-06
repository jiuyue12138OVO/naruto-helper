import { useState, useMemo } from 'react'
import { Search, X, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useData } from '@/contexts/DataContext'
import NinjaCountCard from './NinjaCountCard'
import NinjaInfoDialog from './NinjaInfoDialog'
import type { INinja } from '@/data/ninjas'

interface BanPanelProps {
  myRole: '1P' | '2P'
  currentSlot: { player: '1P' | '2P'; index: number } | null
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  onSelect: (ninja: INinja) => void
  pendingNinjaId?: string
}

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

export default function BanPanel({ currentSlot, usedNinjas, banned1P, banned2P, onSelect, pendingNinjaId }: BanPanelProps) {
  const { ninjas, counters, scrolls, summons } = useData()
  const [search, setSearch] = useState('')
  const [showMiniIcons, setShowMiniIcons] = useState(false)
  const [infoNinja, setInfoNinja] = useState<INinja | null>(null)

  // 可用池
  const availableNinjas = useMemo(() => {
    const bannedIds = new Set<string>()
    banned1P.forEach(n => n && bannedIds.add(n.id))
    banned2P.forEach(n => n && bannedIds.add(n.id))
    return ninjas.filter(n => !usedNinjas.has(n.id) && !bannedIds.has(n.id))
  }, [ninjas, usedNinjas, banned1P, banned2P])

  const availableIds = useMemo(() => new Set(availableNinjas.map(n => n.id)), [availableNinjas])

  const filtered = useMemo(() => {
    if (!search.trim()) return availableNinjas
    const kw = search.toLowerCase()
    return availableNinjas.filter(n => n.name.toLowerCase().includes(kw))
  }, [availableNinjas, search])

  const grouped = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = filtered.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [filtered])

  // 克制/被克制列表
  const countMap = useMemo(() => {
    const lookup = (id: string) => ninjas.find(n => n.id === id)
    const map = new Map<string, { counteredBy: INinja[]; countered: INinja[] }>()

    // counteredByIndex[X] = 克制 X 的忍者列表
    // counteredIndex[X] = X 克制的忍者列表
    const counteredByIndex = new Map<string, string[]>()
    const counteredIndex = new Map<string, string[]>()
    counters.forEach(c => {
      // c.ninjaId 被 c.counterNinjaIds 里的每个 id 克制
      c.counterNinjaIds.forEach(attackerId => {
        // attackerId 克制 c.ninjaId → 计入 c.ninjaId 的"被克制"列表
        const byList = counteredByIndex.get(c.ninjaId) || []
        byList.push(attackerId)
        counteredByIndex.set(c.ninjaId, byList)
        // attackerId 克制的列表加入 c.ninjaId
        const edList = counteredIndex.get(attackerId) || []
        edList.push(c.ninjaId)
        counteredIndex.set(attackerId, edList)
      })
    })

    availableNinjas.forEach(ninja => {
      const rawCounteredBy = (counteredByIndex.get(ninja.id) || []).filter(id => availableIds.has(id))
      const counteredByList = rawCounteredBy.map(id => lookup(id)).filter(Boolean) as INinja[]

      const rawCountered = (counteredIndex.get(ninja.id) || []).filter(id => availableIds.has(id))
      const counteredList = rawCountered.map(id => lookup(id)).filter(Boolean) as INinja[]

      map.set(ninja.id, { counteredBy: counteredByList, countered: counteredList })
    })
    return map
  }, [availableNinjas, availableIds, counters, ninjas])

  if (!currentSlot) return null

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative max-w-md flex-1 min-w-50">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
          {search && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="ban-mini-toggle" className="text-sm cursor-pointer select-none flex items-center gap-1">
            {showMiniIcons ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            显示小图
          </Label>
          <Switch id="ban-mini-toggle" checked={showMiniIcons} onCheckedChange={setShowMiniIcons} />
        </div>
      </div>

      <div className="max-h-125 overflow-y-auto space-y-4">
        {grouped.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">无匹配忍者</p>
        ) : (
          grouped.map(group => (
            <div key={group.tier}>
              <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {group.ninjas.map(ninja => {
                  const counts = countMap.get(ninja.id) || { counteredBy: [], countered: [] }
                  return (
                    <NinjaCountCard
                      key={ninja.id}
                      ninja={ninja}
                      counteredBy={counts.counteredBy}
                      countered={counts.countered}
                      showMiniIcons={showMiniIcons}
                      isPending={pendingNinjaId === ninja.id}
                      onSelect={() => onSelect(ninja)}
                      onShowInfo={() => setInfoNinja(ninja)}
                    />
                  )
                })}
              </div>
            </div>
          ))
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
    </div>
  )
}