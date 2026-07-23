import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'

interface BanPhaseProps {
  search: string
  setSearch: (v: string) => void
  groupedNinjas: { tier: string; ninjas: INinja[] }[]
  isMyTurn: boolean
  pendingSelection: string | null
  setPendingSelection: (id: string) => void
  onConfirm: (ninjaId: string) => void
}

export default function BanPhase({
  search, setSearch, groupedNinjas, isMyTurn, pendingSelection, setPendingSelection, onConfirm,
}: BanPhaseProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-center font-semibold">禁用忍者 {isMyTurn ? '' : '（等待对手操作）'}</h3>
      <div className="relative max-w-md mx-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
        {search && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>
      <div className="max-h-80 overflow-y-auto space-y-4">
        {groupedNinjas.map(group => (
          <div key={group.tier}>
            <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {group.ninjas.map(ninja => (
                <div
                  key={ninja.id}
                  className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${pendingSelection === ninja.id ? 'bg-primary/10 border-2 border-red-500' : 'hover:bg-muted/50'}`}
                  onClick={() => isMyTurn && setPendingSelection(ninja.id)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                    <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-center leading-tight">{ninja.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {isMyTurn && pendingSelection && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => onConfirm(pendingSelection)}>确认禁选</Button>
        </div>
      )}
    </div>
  )
}