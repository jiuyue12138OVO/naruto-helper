import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, Swords } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import { IRecommendation } from '@/data/recommendations'
import { IScroll } from '@/data/scrolls'
import { INinja } from '@/data/ninjas'

interface RecommendationListSectionProps {
  grouped: {
    tier: string
    items: { rec: IRecommendation; ninja: INinja }[]
  }[]
  scrolls: IScroll[]
}

// 梯度颜色定义（可复用之前的，这里简单给个示例）
const TIER_COLORS: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

export default function RecommendationListSection({
  grouped, scrolls,
}: RecommendationListSectionProps) {
  const [selected, setSelected] = useState<{
    rec: IRecommendation
    ninja: INinja
  } | null>(null)

  if (grouped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Swords className="size-12 mb-4 opacity-30" />
        <p className="text-lg">没有找到匹配的推荐</p>
        <p className="text-sm">试试调整搜索条件</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-10">
        {grouped.map(group => (
          <div key={group.tier}>
            {/* 梯度标题 */}
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className={`text-sm font-bold px-3 py-1 ${TIER_COLORS[group.tier] || 'bg-muted'}`}
              >
                {group.tier}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {group.items.length} 位忍者
              </span>
            </div>

            {/* 图片网格：一行10个（响应式） */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
              {group.items.map(({ rec, ninja }, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  onClick={() => setSelected({ rec, ninja })}
                >
                  <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                    <Image
                      src={ninja.imageUrl}
                      alt={ninja.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </Card>
                  <p className="text-xs text-muted-foreground truncate text-center mt-1">
                    {ninja.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 详情弹窗 */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.ninja.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* 忍者大图 */}
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selected.ninja.imageUrl}
                  alt={selected.ninja.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 推荐密卷列表 */}
              <div>
                <p className="text-sm font-medium mb-2">推荐密卷（优先级从高到低）</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {selected.rec.scrolls
                    .sort((a, b) => a.priority - b.priority)
                    .map(entry => {
                      const scroll = scrolls.find(s => s.id === entry.scrollId)
                      return (
                        <div key={entry.scrollId} className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                            {scroll?.imageUrl ? (
                              <Image
                                src={scroll.imageUrl}
                                alt={scroll.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <ScrollText className="size-5" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center text-muted-foreground leading-tight">
                            {entry.scrollName}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}