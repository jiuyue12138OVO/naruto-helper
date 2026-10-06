import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Swords, Network, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

export default function CounterTab() {
  const { ninjas, scrolls, summons, counters, blindPickOrder } = useData()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedNinja, setSelectedNinja] = useState<INinja | null>(null)

  // 排序开关
  const [sortByGameOrder, setSortByGameOrder] = useState(false)
  const [removeTierGrouping, setRemoveTierGrouping] = useState(false)

  // 关闭按游戏内编号排序时，同时关闭取消梯度排行
  const handleGameOrderToggle = (checked: boolean) => {
    setSortByGameOrder(checked)
    if (!checked) setRemoveTierGrouping(false)
  }

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
    const sortByGameOrderFn = (a: INinja, b: INinja) => {
      const ga = a.gameOrder ?? Infinity
      const gb = b.gameOrder ?? Infinity
      if (ga !== gb) return ga - gb
      return a.name.localeCompare(b.name)
    }
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

    // 取消梯度排行：所有忍者合为一组，按游戏内编号排序
    if (removeTierGrouping) {
      const all = [...filtered].sort(sortByGameOrderFn)
      return [{ tier: '', ninjas: all }]
    }

    // 按梯度分组
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = filtered.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) {
        if (sortByGameOrder) {
          tierNinjas.sort(sortByGameOrderFn)
        } else {
          tierNinjas.sort(sortByBlindOrderAndName)
        }
        groups.push({ tier, ninjas: tierNinjas })
      }
    })
    return groups
  }, [filtered, blindPickOrder, sortByGameOrder, removeTierGrouping])

  const getCounterData = (ninjaId: string) => counters.find(c => c.ninjaId === ninjaId)
  const getNinjaById = (id: string) => ninjas.find(n => n.id === id)
  const getScrollById = (id: string) => scrolls.find(s => s.id === id)
  const getSummonById = (id: string) => summons.find(s => s.id === id)

  const getCounteredByWithScores = (ninjaId: string): { ninja: INinja; score: number }[] => {
    const counter = counters.find(c => c.ninjaId === ninjaId)
    if (!counter) return []
    const scores = counter.counterNinjaScores || {}
    return counter.counterNinjaIds
      .map(id => ({ ninja: getNinjaById(id)!, score: scores[id] ?? 0 }))
      .filter(item => item.ninja)
      .sort((a, b) => b.score - a.score)
  }

  const getCounters = (ninjaId: string): INinja[] => {
    return counters
      .filter(c => c.counterNinjaIds.includes(ninjaId))
      .map(c => getNinjaById(c.ninjaId))
      .filter(Boolean) as INinja[]
  }

  return (
    <div className="space-y-8">
      <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
        <span>
          以下克制关系基于官方武斗赛赛事 BP 数据及个人理解整理，仅供参考。如有不同意见以你为准。
          <br />
          盲选位：即使被克制也有操作空间的忍者；非盲选位（克制位）：后手选择能发挥更好效果的忍者。
          <br />
          部分忍者（通常是盲选位）凭借极强的性能可无视克制。
          <br />
          部分非盲选位在场上克制忍者减少后也可作为盲选位。
        </span>
      </div>

      {/* 顶部操作行：3D图按钮 + 右侧排序开关 */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link to="/counter-graph-3d">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Network className="size-4" />
            查看 3D 克制关系图
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="counter-game-order-toggle" className="text-sm cursor-pointer select-none">
              按游戏内编号排序
            </Label>
            <Switch
              id="counter-game-order-toggle"
              checked={sortByGameOrder}
              onCheckedChange={handleGameOrderToggle}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="counter-remove-tier-toggle"
              className={`text-sm select-none ${sortByGameOrder ? 'cursor-pointer' : 'cursor-not-allowed text-muted-foreground/60'}`}
            >
              取消梯度排行
            </Label>
            <Switch
              id="counter-remove-tier-toggle"
              checked={removeTierGrouping}
              onCheckedChange={setRemoveTierGrouping}
              disabled={!sortByGameOrder}
            />
          </div>
        </div>
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
          {groupedNinjas.map((group, groupIdx) => (
            <div key={group.tier || `all-${groupIdx}`}>
              {group.tier && (
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm font-bold px-3 py-1">
                    {group.tier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                </div>
              )}
              {!group.tier && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                </div>
              )}
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
                      <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                    </Card>
                    {ninja.blindPick && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs rounded px-1.5 py-0.5">盲</span>
                    )}
                    {ninja.gameOrder !== undefined && (
                      <span className="absolute top-1 right-1 bg-background/70 backdrop-blur-sm text-[10px] font-mono rounded px-1 py-0.5 text-muted-foreground">
                        {ninja.gameOrder}
                      </span>
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedNinja?.name}</DialogTitle>
          </DialogHeader>
          {selectedNinja && (() => {
            const counter = getCounterData(selectedNinja.id)
            const counteredByList = counter ? getCounteredByWithScores(selectedNinja.id) : []
            const counterList = getCounters(selectedNinja.id)
            const scrollList = counter ? counter.counterScrollIds.map(id => getScrollById(id)).filter(Boolean) : []
            const summonList = counter ? counter.counterSummonIds.map(id => getSummonById(id)).filter(Boolean) : []

            const hasData = counteredByList.length > 0 || counterList.length > 0 || scrollList.length > 0 || summonList.length > 0

            return (
              <div className="overflow-y-auto flex-1 -mx-6 px-6">
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
                    {hasData ? (
                      <>
                        {counteredByList.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">被克制</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {counteredByList.map(({ ninja: n, score }) => (
                                <div key={n.id} className="flex flex-col items-center w-14 relative">
                                  <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                    <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{n.name}</span>
                                  <span className={`text-[10px] font-bold mt-0.5 ${score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    {score > 0 ? `+${score}` : score}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {counterList.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">克制</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {counterList.map(n => (
                                <div key={n.id} className="flex flex-col items-center w-14">
                                  <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                    <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{n.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {scrollList.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">密卷</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {scrollList.map(s => (
                                <div key={s.id} className="flex flex-col items-center w-14">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                                    <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{s.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {summonList.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">通灵</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {summonList.map(sm => (
                                <div key={sm.id} className="flex flex-col items-center w-14">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                                    <Image src={sm.imageUrl} alt={sm.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{sm.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">暂无克制数据</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}