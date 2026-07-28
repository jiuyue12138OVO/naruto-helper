import { useState } from 'react'
import { Search, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image } from '@/components/ui/image'
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
  order: number[]
  search: string
  setSearch: (v: string) => void
  onSelectScrollSlot: (index: number, scrollId: string | null) => void
  onConfirm: () => void
  isConfirmed: boolean
  disabled?: boolean
}

export default function ScrollsPhase({
  myRole, team1P, team2P, scrolls1P, scrolls2P,
  scrollHistory1P, scrollHistory2P,
  ninjas, scrolls, order, search, setSearch, onSelectScrollSlot, onConfirm, isConfirmed,
  disabled = false,
}: ScrollsPhaseProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [pendingScrolls, setPendingScrolls] = useState<Record<number, string | null>>({})

  if (isConfirmed) {
    return <p className="text-center text-muted-foreground">已确认密卷，等待对手...</p>
  }

  // 观众模式下仅显示阵容，不做任何交互
  if (disabled) {
    const myTeam = myRole === '1P' ? team1P : team2P
    const myScrolls = myRole === '1P' ? scrolls1P : scrolls2P
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
                  <div className="w-8 h-8 border rounded flex items-center justify-center bg-muted/30">
                    {scroll ? <Image src={scroll.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">?</span>}
                  </div>
                  <div className="w-8 h-8 border rounded flex items-center justify-center opacity-50">
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

  const myTeam = myRole === '1P' ? team1P : team2P
  const myScrolls = myRole === '1P' ? scrolls1P : scrolls2P
  const myHistory = myRole === '1P' ? scrollHistory1P : scrollHistory2P
  const used = new Set(myScrolls.filter(Boolean) as string[])
  const available = scrolls.filter(s => !myHistory.has(s.id) && !used.has(s.id))
  const filtered = search ? available.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) : available

  const toggleActive = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null)
      setPendingScrolls(prev => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    } else {
      setActiveIndex(index)
    }
  }

  const handleSelectFromGrid = (scrollId: string) => {
    if (activeIndex === null) return
    setPendingScrolls(prev => ({ ...prev, [activeIndex]: scrollId }))
  }

  const confirmCurrentSlot = () => {
    if (activeIndex !== null && pendingScrolls[activeIndex]) {
      onSelectScrollSlot(activeIndex, pendingScrolls[activeIndex]!)
      setPendingScrolls(prev => {
        const next = { ...prev }
        delete next[activeIndex]
        return next
      })
      setActiveIndex(null)
    }
  }

  const allFilled = order.every(i => myScrolls[i] || pendingScrolls[i])

  return (
    <div className="space-y-4">
      <h3 className="text-center font-semibold">选择密卷</h3>

      <div className="flex justify-center gap-3">
        {activeIndex !== null && pendingScrolls[activeIndex] && (
          <Button onClick={confirmCurrentSlot} className="gap-2">
            <Check className="h-4 w-4" /> 确认当前密卷
          </Button>
        )}
        <Button onClick={onConfirm} disabled={!allFilled}>
          确认密卷配置
        </Button>
      </div>

      <div className="flex justify-center gap-4">
        {order.map((i) => {
          const ninja = ninjas.find(n => n.id === myTeam[i])
          const isActive = activeIndex === i
          const isConfirmed = !!myScrolls[i]
          const displayScrollId = myScrolls[i] || pendingScrolls[i]
          const scroll = displayScrollId ? scrolls.find(s => s.id === displayScrollId) : null
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 border rounded overflow-hidden">
                {ninja ? <Image src={ninja.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-xs">?</div>}
              </div>
              <div className="flex gap-1">
                <div
                  className={`w-8 h-8 border rounded flex items-center justify-center cursor-pointer hover:border-primary ${
                    isActive ? 'border-primary ring-2 ring-primary' : ''
                  } ${isConfirmed ? 'bg-red-500/20 border-red-500' : ''}`}
                  onClick={() => toggleActive(i)}
                >
                  {scroll ? <Image src={scroll.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">+</span>}
                </div>
                <div className="w-8 h-8 border rounded flex items-center justify-center opacity-50">
                  <span className="text-xs text-muted-foreground">-</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索密卷..." className="pl-9 pr-9" />
        {search && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      {activeIndex !== null && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
          {filtered.map(scroll => {
            const isUsed = myScrolls.includes(scroll.id) || Object.values(pendingScrolls).includes(scroll.id)
            return (
              <div
                key={scroll.id}
                className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg ${isUsed ? 'opacity-50' : 'hover:bg-muted/50'}`}
                onClick={() => !isUsed && handleSelectFromGrid(scroll.id)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                  <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-center leading-tight">{scroll.name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}