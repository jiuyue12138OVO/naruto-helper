import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { INinja } from '@/data/ninjas'
import { cn } from '@/lib/utils'
import { Image } from '@/components/ui/image'

interface NinjaGridSectionProps {
  ninjas: INinja[]
}

const TIER_COLORS: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function NinjaGridSection({ ninjas }: NinjaGridSectionProps) {
  const [selectedNinja, setSelectedNinja] = useState<INinja | null>(null)

  // 按梯度分组
  const grouped = ninjas.reduce<Record<string, INinja[]>>((acc, n) => {
    if (!acc[n.tier]) acc[n.tier] = []
    acc[n.tier].push(n)
    return acc
  }, {})

  // 每个梯度内部排序：趋势上升的优先，然后无趋势，然后趋势下降的
  Object.keys(grouped).forEach(tier => {
    grouped[tier].sort((a, b) => {
      const trendOrder = { up: 0, undefined: 1, down: 2 }
      const trendA = a.trend ? trendOrder[a.trend] : trendOrder.undefined
      const trendB = b.trend ? trendOrder[b.trend] : trendOrder.undefined
      return trendA - trendB
    })
  })

  if (ninjas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Swords className="size-12 mb-4 opacity-30" />
        <p className="text-lg">没有找到匹配的忍者</p>
        <p className="text-sm">试试调整筛选条件</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-10">
        {TIER_ORDER.map((tier) => {
          const list = grouped[tier]
          if (!list || list.length === 0) return null

          return (
            <div key={tier}>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className={cn('text-sm font-bold px-3 py-1', TIER_COLORS[tier])}
                >
                  {tier}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {list.length} 位忍者
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                {list.map((ninja, i) => (
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
                      {/* 动态升降箭头（右上角） */}
                      {ninja.trend && (
                        <motion.span
                          className={`absolute top-1 right-1 text-xs font-bold bg-background/60 rounded-full px-1 py-0.5 backdrop-blur-sm ${
                            ninja.trend === 'up' ? 'text-red-500' : 'text-green-500'
                          }`}
                          animate={{
                            y: ninja.trend === 'up' ? [-2, 2, -2] : [2, -2, 2],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          {ninja.trend === 'up' ? '▲' : '▼'}
                        </motion.span>
                      )}
                    </Card>
                    <p className="text-xs text-muted-foreground truncate text-center mt-1 leading-tight">
                      {ninja.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 详情弹窗（包含趋势信息） */}
      <Dialog open={!!selectedNinja} onOpenChange={(open) => !open && setSelectedNinja(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              {selectedNinja?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedNinja && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedNinja.imageUrl}
                  alt={selectedNinja.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">梯度：</span>
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-bold', TIER_COLORS[selectedNinja.tier])}
                  >
                    {selectedNinja.tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">评级：</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedNinja.rating}
                  </Badge>
                </div>
                {selectedNinja.trend && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">趋势：</span>
                    <Badge variant="secondary" className={`text-xs ${selectedNinja.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedNinja.trend === 'up' ? '上升' : '下降'}
                    </Badge>
                  </div>
                )}
              </div>

              {selectedNinja.tags && selectedNinja.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">定位：</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNinja.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}