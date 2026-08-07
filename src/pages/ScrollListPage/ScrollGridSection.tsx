import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ScrollText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { IScroll } from '@/data/scrolls'
import type { INinja } from '@/data/ninjas'

interface ScrollGridSectionProps {
  scrolls: IScroll[]
  showExclusive: boolean
}

export default function ScrollGridSection({ scrolls, showExclusive }: ScrollGridSectionProps) {
  const { ninjas, recommendations } = useData()
  const [selectedScroll, setSelectedScroll] = useState<IScroll | null>(null)

  const adaptedNinjas = selectedScroll
    ? recommendations
        .filter(rec => rec.scrolls.some(s => s.scrollId === selectedScroll.id))
        .map(rec => ninjas.find(n => n.id === rec.ninjaId))
        .filter(Boolean)
    : []

  if (scrolls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ScrollText className="size-12 mb-4 opacity-30" />
        <p className="text-lg">没有找到匹配的密卷</p>
        <p className="text-sm">试试调整搜索关键词</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
        {scrolls.map((scroll, i) => (
          <motion.div
            key={scroll.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="cursor-pointer"
            onClick={() => setSelectedScroll(scroll)}
          >
            <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors group aspect-square flex items-center justify-center p-1 relative">
              <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              {showExclusive && scroll.variants && scroll.variants.length > 0 && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] rounded px-1 py-0.5 font-medium">专属</span>
              )}
            </Card>
            <p className="text-xs text-muted-foreground truncate text-center mt-1 leading-tight">{scroll.name}</p>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedScroll} onOpenChange={(open) => !open && setSelectedScroll(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedScroll?.name}</DialogTitle>
          </DialogHeader>

          {selectedScroll && (
            <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mb-4">
                <TabsTrigger value="info">密卷信息</TabsTrigger>
                <TabsTrigger value="ninjas">适配忍者</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="flex-1 overflow-y-auto -mx-6 px-6">
                <Tabs defaultValue="original" className="w-full">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="original" className="flex-1">原密卷</TabsTrigger>
                    <TabsTrigger value="exclusive" className="flex-1">
                      专属密卷
                      {selectedScroll.variants && selectedScroll.variants.length > 0 && (
                        <span className="ml-1.5 bg-primary/20 text-primary text-xs rounded-full px-1.5 py-0.5">{selectedScroll.variants.length}</span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="original" className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image src={selectedScroll.imageUrl} alt={selectedScroll.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">效果：</span>{selectedScroll.description}</p>
                      <p className="flex items-center gap-1"><Clock className="size-3.5 text-muted-foreground" /><span className="font-medium">冷却：</span>{selectedScroll.cooldown}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="exclusive" className="space-y-4">
                    {selectedScroll.variants && selectedScroll.variants.length > 0 ? (
                      <div className="space-y-4">
                        {selectedScroll.variants.map(variant => {
                          const ninjasForVariant = (variant.ninjaIds || []).map(id => ninjas.find(n => n.id === id)).filter(Boolean) as INinja[]
                          return (
                            <div key={variant.id} className="flex gap-3 bg-muted/40 rounded-lg p-3">
                              <div className="flex flex-col items-center w-1/3 shrink-0">
                                <div className="w-full aspect-square rounded-md overflow-hidden border bg-card">
                                  <Image src={variant.imageUrl || selectedScroll.imageUrl} alt={variant.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-medium mt-1 text-center">{variant.name}</p>
                                <div className="flex -space-x-2 mt-1">
                                  {ninjasForVariant.map(n => (
                                    <div key={n.id} className="w-7 h-7 rounded-full overflow-hidden border-2 border-background" title={n.name}>
                                      <Image src={n.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 text-sm space-y-1">
                                <p><span className="font-medium">效果：</span><span className="text-muted-foreground">{variant.description}</span></p>
                                <p className="flex items-center gap-1"><Clock className="size-3.5 text-muted-foreground" /><span className="font-medium">冷却：</span><span className="text-muted-foreground">{variant.cooldown}</span></p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8 text-sm">该密卷暂无专属变体</div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="ninjas" className="flex-1 overflow-y-auto -mx-6 px-6">
                {adaptedNinjas.length > 0 ? (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3">
                    {adaptedNinjas.map((ninja) => (
                      <div key={ninja!.id} className="flex flex-col items-center gap-1">
                        <div className="w-14 h-14 rounded-md overflow-hidden border">
                          <Image src={ninja!.imageUrl} alt={ninja!.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-muted-foreground text-center leading-tight truncate w-full">{ninja!.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8 text-sm">暂无适配忍者数据</div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}