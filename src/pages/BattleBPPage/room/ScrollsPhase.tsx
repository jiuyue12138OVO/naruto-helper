import { useMemo, useState } from 'react'
import { Search, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image } from '@/components/ui/image'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'

interface ScrollsPhaseProps {
  myRole: '1P' | '2P'
  team1P: (string | null)[]
  team2P: (string | null)[]
  scrolls1P: (string | null)[]
  scrolls2P: (string | null)[]
  scrollHistory1P: Set<string>
  scrollHistory2P: Set<string>
  ninjas: INinja[]
  scrolls: IScroll[]
  poolScrolls?: IScroll[]
  order: number[]
  search: string
  setSearch: (v: string) => void
  onSyncSlots: (slots: (string | null)[]) => void
  onCommit: (slots: (string | null)[]) => void
  isConfirmed: boolean
  disabled?: boolean
}

export default function ScrollsPhase({
  myRole, team1P, team2P, scrolls1P, scrolls2P,
  scrollHistory1P, scrollHistory2P,
  ninjas, scrolls, poolScrolls = scrolls, order, search, setSearch,
  onSyncSlots, onCommit, isConfirmed,
  disabled = false,
}: ScrollsPhaseProps) {
  const myTeam = myRole === '1P' ? team1P : team2P
  const myScrolls = myRole === '1P' ? scrolls1P : scrolls2P
  const myHistory = myRole === '1P' ? scrollHistory1P : scrollHistory2P

  // 预选表：键为序号 1/2/3，值为密卷 id。序号不重排，取消后由新选择补最小空号
  const [picks, setPicks] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {}
    order.forEach((teamIndex) => {
      const id = myScrolls[teamIndex]
      if (id) initial[teamIndex + 1] = id
    })
    return initial
  })
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isConfirmed) {
    return <p className="text-center text-muted-foreground">已确认密卷，等待对手...</p>
  }

  // 观众模式下仅显示阵容，不做任何交互
  if (disabled) {
    return (
      <div className="space-y-4">
        <h3 className="text-center font-semibold">密卷配置（观众模式）</h3>
        <div className="flex justify-center gap-4">
          {order.map((i) => {
            const ninja = ninjas.find(n => n.id === myTeam[i])
            const scroll = myScrolls[i] ? scrolls.find(s => s.id === myScrolls[i]) : null
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 border rounded overflow-hidden">
                  {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-xs">?</div>}
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 border rounded-full overflow-hidden flex items-center justify-center bg-muted/30">
                    {scroll ? <Image src={scroll.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">?</span>}
                  </div>
                  <div className="w-8 h-8 border rounded-full flex items-center justify-center opacity-50">
                    <span className="text-xs text-muted-foreground">-</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const available = [...poolScrolls]
    .filter(s => !myHistory.has(s.id))
    .sort((a, b) => (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER))
  const filtered = search ? available.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) : available

  // 序号即上场顺序：1 号写 team[0]，2 号写 team[1]，3 号写 team[2]
  const toSlots = (value: Record<number, string>): (string | null)[] => {
    const slots: (string | null)[] = [null, null, null]
    for (let slot = 1; slot <= 3; slot++) {
      slots[slot - 1] = value[slot] ?? null
    }
    return slots
  }

  const positionOf = (scrollId: string): number | null => {
    const key = Object.keys(picks).find(k => picks[Number(k)] === scrollId)
    return key ? Number(key) : null
  }

  const slotIdOf = (slot: number): string | null => {
    return picks[slot] ?? myScrolls[slot - 1] ?? null
  }

  const pickedCount = Object.keys(picks).length

  const handlePick = (scrollId: string) => {
    const existing = positionOf(scrollId)
    if (existing !== null) {
      const next = { ...picks }
      delete next[existing]
      setPicks(next)
      onSyncSlots(toSlots(next))
      return
    }
    if (pickedCount >= 3) return
    const free = [1, 2, 3].find(position => !picks[position])
    if (!free) return
    const next = { ...picks, [free]: scrollId }
    setPicks(next)
    onSyncSlots(toSlots(next))
  }

  const handleConfirm = () => {
    setConfirmOpen(false)
    onCommit(toSlots(picks))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-center font-semibold">选择密卷</h3>

      <div className="flex justify-center gap-4">
        {order.map((teamIndex) => {
          const ninja = ninjas.find(n => n.id === myTeam[teamIndex])
          const scrollId = slotIdOf(teamIndex + 1)
          const scroll = scrollId ? scrolls.find(s => s.id === scrollId) : null
          const marked = picks[teamIndex + 1] !== undefined
          return (
            <div key={teamIndex} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 border rounded overflow-hidden">
                {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-xs">?</div>}
              </div>
              <div className="flex gap-1">
                <div className="relative w-8 h-8">
                  <div className="w-full h-full border rounded-full overflow-hidden flex items-center justify-center bg-background">
                    {scroll ? <Image src={scroll.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">+</span>}
                  </div>
                  {marked && (
                    <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900 shadow">
                      {teamIndex + 1}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 border rounded-full flex items-center justify-center opacity-50">
                  <span className="text-xs text-muted-foreground">-</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setConfirmOpen(true)} disabled={pickedCount !== 3}>
          <Check className="h-4 w-4" /> 确认密卷配置
        </Button>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索密卷..." className="pl-9 pr-9" />
        {search && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
        {filtered.map(scroll => {
          const position = positionOf(scroll.id)
          const isHistoryUsed = myHistory.has(scroll.id)
          const isBlocked = isHistoryUsed || (pickedCount >= 3 && position === null)
          return (
            <div
              key={scroll.id}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg ${isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'}`}
              onClick={() => { if (!isBlocked) handlePick(scroll.id) }}
            >
              <div className="relative w-12 h-12">
                <div className="w-full h-full rounded-full overflow-hidden border border-border/40 bg-card">
                  <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                </div>
                {position !== null && (
                  <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900 shadow">
                    {position}
                  </span>
                )}
              </div>
              <span className={`text-xs text-center leading-tight ${isHistoryUsed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {scroll.name}
              </span>
            </div>
          )
        })}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认密卷配置</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>取消</Button>
            <Button onClick={handleConfirm}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
