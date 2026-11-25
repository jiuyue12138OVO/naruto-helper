import { Search, X, Check } from 'lucide-react'
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
  usedNinjaIds: Set<string>
  bannedNinjaIds: Set<string>
  disabled?: boolean  // 新增，观众模式下为 true
}

export default function BanPhase({
  search, setSearch, groupedNinjas, isMyTurn, pendingSelection, setPendingSelection, onConfirm,
  usedNinjaIds, bannedNinjaIds,
  disabled = false,
}: BanPhaseProps) {
  const canAct = isMyTurn && !disabled

  return (
    <div className="space-y-4">
      <h3 className="text-center font-semibold">
        禁用忍者 {canAct ? '' : disabled ? '（观众模式）' : '（等待对手操作）'}
      </h3>

      <div className="flex justify-center mt-2">
        <Button
          onClick={() => { if (pendingSelection) onConfirm(pendingSelection) }}
          disabled={!canAct || !pendingSelection}
          className="gap-2"
        >
          <Check className="h-4 w-4" /> 确认禁选
        </Button>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" disabled={disabled} />
        {search && !disabled && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-4">
        {groupedNinjas.map(group => (
          <div key={group.tier}>
            {group.tier !== '全部' && (
              <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
            )}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {group.ninjas.map(ninja => {
                const isUsed = usedNinjaIds.has(ninja.id)
                const isBanned = bannedNinjaIds.has(ninja.id)
                const locked = isUsed || isBanned
                return (
                  <div
                    key={ninja.id}
                    className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${
                      canAct && !locked && pendingSelection === ninja.id ? 'bg-primary/10 border-2 border-red-500' : ''
                    } ${
                      locked
                        ? 'cursor-not-allowed'
                        : canAct
                          ? 'cursor-pointer hover:bg-muted/50'
                          : 'opacity-70 cursor-default'
                    }`}
                    onClick={() => {
                      if (canAct && !locked) setPendingSelection(ninja.id)
                    }}
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                      <Image
                        src={ninja.imageUrl}
                        alt={ninja.name}
                        className={`w-full h-full object-cover ${locked ? 'grayscale opacity-60' : ''}`}
                      />
                      {locked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            style={{ fontFamily: 'SimSun, 宋体, serif' }}
                            className={`text-base font-bold drop-shadow ${isBanned ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            封
                          </span>
                        </div>
                      )}
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