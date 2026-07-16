import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Swords, ScrollText, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { IScroll } from '@/data/scrolls'
import { INinja } from '@/data/ninjas'
import { IRecommendation } from '@/data/recommendations'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function ScrollPage() {
  const {
    scrolls, ninjas, recommendations,
    ensureScrolls, ensureRecommendations, ensureNinjas
  } = useData()
  const [loading, setLoading] = useState(true)

  const [mode, setMode] = useState<'scrollToNinja' | 'ninjaToScroll'>('scrollToNinja')
  const [searchScroll, setSearchScroll] = useState('')
  const [searchNinja, setSearchNinja] = useState('')
  const [selectedScroll, setSelectedScroll] = useState<IScroll | null>(null)
  const [selectedNinja, setSelectedNinja] = useState<INinja | null>(null)

  useEffect(() => {
    Promise.all([
      ensureScrolls(),
      ensureRecommendations(),
      ensureNinjas()
    ]).finally(() => setLoading(false))
  }, [ensureScrolls, ensureRecommendations, ensureNinjas])

  const filteredScrolls = useMemo(() => {
    if (!searchScroll.trim()) return scrolls
    return scrolls.filter(s => s.name.toLowerCase().includes(searchScroll.toLowerCase()))
  }, [scrolls, searchScroll])

  const getNinjasForScroll = (scrollId: string): INinja[] => {
    const ids = new Set<string>()
    recommendations.forEach(rec => {
      if (rec.scrolls.some(s => s.scrollId === scrollId)) {
        ids.add(rec.ninjaId)
      }
    })
    return ninjas.filter(n => ids.has(n.id))
  }

  const getScrollsForNinja = (ninjaId: string) => {
    const rec = recommendations.find(r => r.ninjaId === ninjaId)
    if (!rec) return []
    return rec.scrolls
      .sort((a, b) => a.priority - b.priority)
      .map(s => ({
        ...s,
        detail: scrolls.find(sc => sc.id === s.scrollId),
      }))
      .filter(s => s.detail)
  }

  const groupedNinjas = useMemo(() => {
    const ninjaIds = new Set(recommendations.map(r => r.ninjaId))
    let filtered = ninjas.filter(n => ninjaIds.has(n.id))
    if (searchNinja.trim()) {
      filtered = filtered.filter(n => n.name.toLowerCase().includes(searchNinja.toLowerCase()))
    }
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = filtered.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [ninjas, recommendations, searchNinja])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载密卷数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            密卷<span className="text-primary">大全</span>
          </h1>
          <p className="text-muted-foreground text-sm">选密卷看适配忍者，或选忍者看推荐密卷</p>
          <div className="mt-4 bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>免责声明：密卷搭配推荐基于个人理解与实战经验，仅供参考。不同对局环境与操作习惯可能导致适配差异，如有不同意见以你为准。</span>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="scrollToNinja">选密卷看忍者</TabsTrigger>
            <TabsTrigger value="ninjaToScroll">选忍者看密卷</TabsTrigger>
          </TabsList>

          {/* ===== A 模式：选密卷看忍者 ===== */}
          <TabsContent value="scrollToNinja" className="mt-6 space-y-6">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchScroll}
                onChange={(e) => setSearchScroll(e.target.value)}
                placeholder="搜索密卷名称..."
                className="pl-9 pr-9"
              />
              {searchScroll && (
                <Button size="icon" variant="ghost" className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchScroll('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {filteredScrolls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ScrollText className="size-12 mb-4 opacity-30" />
                <p className="text-lg">没有找到匹配的密卷</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                {filteredScrolls.map((scroll, i) => (
                  <motion.div
                    key={scroll.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedScroll(scroll)}
                  >
                    <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                      <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                    </Card>
                    <p className="text-xs text-muted-foreground truncate text-center mt-1">{scroll.name}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== B 模式：选忍者看密卷 ===== */}
          <TabsContent value="ninjaToScroll" className="mt-6 space-y-6">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchNinja}
                onChange={(e) => setSearchNinja(e.target.value)}
                placeholder="搜索忍者名称..."
                className="pl-9 pr-9"
              />
              {searchNinja && (
                <Button size="icon" variant="ghost" className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchNinja('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {groupedNinjas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Swords className="size-12 mb-4 opacity-30" />
                <p className="text-lg">没有找到匹配的忍者</p>
              </div>
            ) : (
              <div className="space-y-10">
                {groupedNinjas.map(group => (
                  <div key={group.tier}>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-sm font-bold px-3 py-1">{group.tier}</Badge>
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
                          className="cursor-pointer"
                          onClick={() => setSelectedNinja(ninja)}
                        >
                          <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                            <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                          </Card>
                          <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* ============ 密卷详情弹窗（A 模式） ============ */}
        <Dialog open={!!selectedScroll} onOpenChange={(open) => !open && setSelectedScroll(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedScroll?.name}</DialogTitle>
            </DialogHeader>
            {selectedScroll && (
              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">密卷信息</TabsTrigger>
                  <TabsTrigger value="ninjas">适配忍者</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <Image src={selectedScroll.imageUrl} alt={selectedScroll.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">效果描述：</span>{selectedScroll.description}</p>
                    <p className="flex items-center gap-1"><span className="font-medium">冷却时间：</span>{selectedScroll.cooldown}</p>
                  </div>
                </TabsContent>
                <TabsContent value="ninjas" className="mt-4 max-h-[360px] overflow-y-auto">
                  {(() => {
                    const ninjasForScroll = getNinjasForScroll(selectedScroll.id)
                    if (ninjasForScroll.length === 0) {
                      return <p className="text-sm text-muted-foreground text-center py-8">暂无适配忍者</p>
                    }
                    const grouped = TIER_ORDER.map(tier => ({
                      tier,
                      ninjas: ninjasForScroll.filter(n => n.tier === tier)
                    })).filter(g => g.ninjas.length > 0)
                    return (
                      <div className="space-y-4">
                        {grouped.map(group => (
                          <div key={group.tier}>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2">{group.tier}</h4>
                            <div className="flex flex-wrap gap-2">
                              {group.ninjas.map(n => (
                                <div key={n.id} className="flex flex-col items-center w-14">
                                  <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                    <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5">{n.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* ============ 忍者详情弹窗（B 模式） ============ */}
        <Dialog open={!!selectedNinja} onOpenChange={(open) => !open && setSelectedNinja(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedNinja?.name}</DialogTitle>
            </DialogHeader>
            {selectedNinja && (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted max-h-48 mx-auto">
                  <Image src={selectedNinja.imageUrl} alt={selectedNinja.name} className="w-full h-full object-cover" />
                </div>
                {(() => {
                  const scrollsData = getScrollsForNinja(selectedNinja.id)
                  if (scrollsData.length === 0) {
                    return <p className="text-sm text-muted-foreground text-center py-4">暂无推荐密卷</p>
                  }
                  return (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">推荐密卷（从上到下优先级降低）</p>
                      <div className="space-y-2 max-h-[240px] overflow-y-auto">
                        {scrollsData.map((s, idx) => (
                          <div key={s.scrollId} className="flex items-center gap-2 bg-muted/40 rounded px-2 py-1">
                            <Badge variant="outline" className="text-xs font-mono shrink-0 w-5 h-5 flex items-center justify-center rounded-full p-0">
                              {idx + 1}
                            </Badge>
                            <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                              {s.detail?.imageUrl ? (
                                <Image src={s.detail.imageUrl} alt={s.scrollName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <ScrollText className="size-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm flex-1 truncate">{s.scrollName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}