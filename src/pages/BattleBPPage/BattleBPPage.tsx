import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Swords, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function BattleBPPage() {
  const {
    ninjas, scrolls, summons, counters, blindPickOrder,
    ensureNinjas, ensureScrolls, ensureSummons, ensureCounters // 新增加载函数
  } = useData()
  const [loading, setLoading] = useState(true)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedNinja, setSelectedNinja] = useState<INinja | null>(null)

  useEffect(() => {
    Promise.all([
      ensureNinjas(),
      ensureScrolls(),
      ensureSummons(),
      ensureCounters()
    ]).finally(() => setLoading(false))
  }, [ensureNinjas, ensureScrolls, ensureSummons, ensureCounters])

  // 原有过滤、分组逻辑不变...
  const filtered = useMemo(() => {
    let list = ninjas
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(kw))
    }
    return list
  }, [ninjas, searchKeyword])

  const groupedNinjas = useMemo(() => {
    const blindOrderMap = new Map(blindPickOrder.map((id, idx) => [id, idx]))
    const sortByBlindOrderAndName = (a: INinja, b: INinja) => {
      if (a.blindPick && !b.blindPick) return -1
      if (!a.blindPick && b.blindPick) return 1
      if (a.blindPick && b.blindPick) {
        const ia = blindOrderMap.has(a.id) ? blindOrderMap.get(a.id)! : Infinity
        const ib = blindOrderMap.has(b.id) ? blindOrderMap.get(b.id)! : Infinity
        return ia - ib
      }
      return a.name.localeCompare(b.name)
    }

    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = filtered.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) {
        tierNinjas.sort(sortByBlindOrderAndName)
        groups.push({ tier, ninjas: tierNinjas })
      }
    })
    return groups
  }, [filtered, blindPickOrder])

  const getCounterData = (ninjaId: string) => counters.find(c => c.ninjaId === ninjaId)
  const getNinjaById = (id: string) => ninjas.find(n => n.id === id)
  const getScrollById = (id: string) => scrolls.find(s => s.id === id)
  const getSummonById = (id: string) => summons.find(s => s.id === id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载武斗赛数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">武斗赛<span className="text-primary">BP</span></h1>
          <p className="text-muted-foreground text-sm">查看忍者克制关系与盲选位</p>
        </div>

        {/* 3D 克制关系图入口 */}
        <div className="flex items-center gap-4">
          <Link to="/counter-graph-3d">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Network className="size-4" />
              查看 3D 克制关系图
            </Button>
          </Link>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
          {searchKeyword && <Button size="icon" variant="ghost" className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchKeyword('')}><X className="h-4 w-4" /></Button>}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Swords className="size-12 mb-4 opacity-30" />
            <p className="text-lg">没有找到匹配的忍者</p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedNinjas.map(group => (
              <div key={group.tier}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm font-bold px-3 py-1">
                    {group.tier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                  {group.ninjas.map((ninja, i) => (
                    <motion.div
                      key={ninja.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                      whileHover={{ y: -4 }}
                      className="cursor-pointer relative"
                      onClick={() => setSelectedNinja(ninja)}
                    >
                      <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                        <Image
                          src={ninja.imageUrl}
                          alt={ninja.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </Card>
                      {ninja.blindPick && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs rounded px-1.5 py-0.5">盲</span>
                      )}
                      <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedNinja} onOpenChange={open => !open && setSelectedNinja(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{selectedNinja?.name}</DialogTitle></DialogHeader>
            {selectedNinja && (() => {
              const counter = getCounterData(selectedNinja.id)
              return (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-2/5 shrink-0">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image src={selectedNinja.imageUrl} alt={selectedNinja.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-center mt-2">
                      <Badge variant={selectedNinja.blindPick ? 'default' : 'secondary'}>
                        {selectedNinja.blindPick ? '盲选位' : '非盲选'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {counter ? (
                      <>
                        {counter.counterNinjaIds.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">克制忍者</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {counter.counterNinjaIds.map(id => {
                                const n = getNinjaById(id)
                                if (!n) return null
                                return (
                                  <div key={id} className="flex flex-col items-center w-14">
                                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                      <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{n.name}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {counter.counterScrollIds.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">克制密卷</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {counter.counterScrollIds.map(id => {
                                const s = getScrollById(id)
                                if (!s) return null
                                return (
                                  <div key={id} className="flex flex-col items-center w-14">
                                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                      <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{s.name}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {counter.counterSummonIds.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">克制通灵</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {counter.counterSummonIds.map(id => {
                                const sm = getSummonById(id)
                                if (!sm) return null
                                return (
                                  <div key={id} className="flex flex-col items-center w-14">
                                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                      <Image src={sm.imageUrl} alt={sm.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{sm.name}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">暂无克制数据</p>
                    )}
                  </div>
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}