import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import BPRecommendation from './BPRecommendation'
import type { INinja } from '@/data/ninjas'

interface PickPanelProps {
  myRole: '1P' | '2P'
  currentSlot: { player: '1P' | '2P'; index: number } | null
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  onSelect: (ninja: INinja) => void
  pendingNinjaId?: string
}

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function PickPanel({
  myRole, currentSlot, team1P, team2P, usedNinjas, banned1P, banned2P, onSelect, pendingNinjaId,
}: PickPanelProps) {
  const { ninjas } = useData()
  const [search, setSearch] = useState('')

  const availableNinjas = useMemo(() => {
    const bannedIds = new Set([...banned1P.filter(Boolean).map(n => n!.id), ...banned2P.filter(Boolean).map(n => n!.id)])
    let list = ninjas.filter(n => !usedNinjas.has(n.id) && !bannedIds.has(n.id))
    if (search.trim()) {
      const kw = search.toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(kw))
    }
    return list
  }, [ninjas, usedNinjas, banned1P, banned2P, search])

  const grouped = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = availableNinjas.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [availableNinjas])

  if (!currentSlot) return null

  return (
    <div className="space-y-4 mt-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
        {search && <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      <BPRecommendation
        myRole={myRole}
        phase="pick"
        team1P={team1P}
        team2P={team2P}
        usedNinjas={usedNinjas}
        banned1P={banned1P}
        banned2P={banned2P}
        myScrollHistory={new Set()}
        opponentScrollHistory={new Set()}
        mySummonHistory={new Set()}
        opponentSummonHistory={new Set()}
        currentScrolls1P={[null,null,null]}
        currentScrolls2P={[null,null,null]}
        currentSummons1P={[null,null,null]}
        currentSummons2P={[null,null,null]}
        activeSlot={{ type: 'pick', player: currentSlot.player, index: currentSlot.index }}
        onSelectNinja={onSelect}
        pendingNinjaId={pendingNinjaId}
      />

      <div className="max-h-64 overflow-y-auto space-y-4">
        {grouped.map(group => (
          <div key={group.tier}>
            <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {group.ninjas.map(ninja => {
                const isPending = pendingNinjaId === ninja.id
                return (
                  <div
                    key={ninja.id}
                    className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${
                      isPending ? 'bg-primary/10 border-2 border-red-500' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onSelect(ninja)}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                      <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-center leading-tight">{ninja.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}