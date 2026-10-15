import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { EasterEggIcon } from '@/components/EasterEggIcon'
import type { INinja } from '@/data/ninjas'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

const EGG_TYPE_LABEL: Record<string, string> = {
  self: '自带彩蛋',
  scene: '场景互动彩蛋',
  other: '其他彩蛋',
}

// 按游戏内编号升序（缺失 gameOrder 的排最后）
const sortByGameOrder = (list: INinja[]): INinja[] =>
  [...list].sort((a, b) => (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER))

export default function EasterEggTab() {
  const { ninjas, easterEggs } = useData()
  const [search, setSearch] = useState('')
  // 默认 false：整体按游戏内编号平铺；开启后按强度梯度分组（组内按编号）
  const [sortByTier, setSortByTier] = useState(false)
  const [selectedNinja, setSelectedNinja] = useState<INinja | null>(null)

  const eggOf = (ninjaId: string) => easterEggs.find(e => e.ninjaId === ninjaId)
  const ninjaById = (id: string) => ninjas.find(n => n.id === id)
  const hasEgg = (ninjaId: string) => {
    const egg = eggOf(ninjaId)
    if (!egg) return false
    return egg.defeatByNinjaIds.length > 0 || egg.defeatTargetNinjaIds.length > 0 || !!egg.title || !!egg.description
  }

  // 按游戏内编号排序的 id 列表（用于弹窗内"击败/被击败"组）
  const sortIdsByGameOrder = (ids: string[]): string[] =>
    [...ids].sort(
      (a, b) =>
        (ninjaById(a)?.gameOrder ?? Number.MAX_SAFE_INTEGER) -
        (ninjaById(b)?.gameOrder ?? Number.MAX_SAFE_INTEGER)
    )

  // 只有有彩蛋的忍者才会出现
  const groupedNinjas = useMemo(() => {
    const kw = search.trim().toLowerCase()
    let filtered = ninjas.filter(n => hasEgg(n.id))
    if (kw) filtered = filtered.filter(n => n.name.toLowerCase().includes(kw))
    if (!sortByTier) {
      return [{ tier: null as string | null, ninjas: sortByGameOrder(filtered) }]
    }
    return TIER_ORDER.map(tier => {
      const tierNinjas = sortByGameOrder(filtered.filter(n => n.tier === tier))
      if (tierNinjas.length > 0) return { tier, ninjas: tierNinjas }
      return null
    }).filter(Boolean) as { tier: string | null; ninjas: INinja[] }[]
  }, [ninjas, easterEggs, search, sortByTier])

  const selectedEgg = selectedNinja ? eggOf(selectedNinja.id) : undefined

  return (
    <div className="space-y-6">
      {/* 顶部：说明 + 右上角"按强度排行"开关 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          点击忍者查看彩蛋信息：自带彩蛋、场景互动彩蛋、击败特定忍者出现的奥义彩蛋
        </p>
        <div className="flex items-center gap-2">
          <Label htmlFor="easter-tier-sort-toggle" className="text-sm cursor-pointer select-none">
            按强度排行
          </Label>
          <Switch id="easter-tier-sort-toggle" checked={sortByTier} onCheckedChange={setSortByTier} />
        </div>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索忍者..." className="pl-9 pr-9" />
        {search && (
          <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 忍者网格（样式与"忍者"页强度排行统一） */}
      {groupedNinjas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <EasterEggIcon className="size-12 mb-4 opacity-30" />
          <p className="text-lg">没有找到有彩蛋的忍者</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedNinjas.map(group => (
            <div key={group.tier ?? '__flat__'}>
              {/* 平铺模式（默认）不显示梯度标题，只有强度排行模式显示 */}
              {group.tier && (
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm font-bold px-3 py-1">{group.tier}</Badge>
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
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="cursor-pointer relative"
                    onClick={() => setSelectedNinja(ninja)}
                  >
                    <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1 relative">
                      <Image
                        src={ninja.imageUrl}
                        alt={ninja.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </Card>
                    <p className="text-xs text-muted-foreground truncate text-center mt-1 leading-tight">
                      {ninja.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 彩蛋详情弹窗 */}
      <Dialog open={!!selectedNinja} onOpenChange={(open) => !open && setSelectedNinja(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>彩蛋信息</DialogTitle>
          </DialogHeader>
          {selectedNinja && (
            <div className="overflow-y-auto flex-1 space-y-4">
              {/* 忍者信息 */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-border/40 bg-card">
                  <Image src={selectedNinja.imageUrl} alt={selectedNinja.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedNinja.name}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="secondary">{selectedNinja.tier}</Badge>
                    <Badge variant="outline">{selectedNinja.rating}</Badge>
                  </div>
                </div>
              </div>

              {!selectedEgg ||
                (selectedEgg.defeatByNinjaIds.length === 0 &&
                 selectedEgg.defeatTargetNinjaIds.length === 0 &&
                 !selectedEgg.title && !selectedEgg.description) ? (
                <p className="text-sm text-muted-foreground text-center py-6">该忍者暂无彩蛋信息</p>
              ) : (
                <>
                  {/* 上面：其他信息（自带 / 场景互动等） */}
                  {(selectedEgg.title || selectedEgg.description) && (
                    <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                      {selectedEgg.type && (
                        <Badge variant="outline" className="text-xs">{EGG_TYPE_LABEL[selectedEgg.type] ?? selectedEgg.type}</Badge>
                      )}
                      {selectedEgg.title && <p className="text-sm font-semibold">{selectedEgg.title}</p>}
                      {selectedEgg.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedEgg.description}</p>}
                    </div>
                  )}

                  {/* 下面：奥义彩蛋关联忍者（分"被击败"/"击败"，按游戏内编号排序） */}
                  <div className="space-y-4">
                    {selectedEgg.defeatByNinjaIds.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">被击败</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {sortIdsByGameOrder(selectedEgg.defeatByNinjaIds).map(id => {
                            const n = ninjaById(id)
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

                    {selectedEgg.defeatTargetNinjaIds.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">击败</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {sortIdsByGameOrder(selectedEgg.defeatTargetNinjaIds).map(id => {
                            const n = ninjaById(id)
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
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
