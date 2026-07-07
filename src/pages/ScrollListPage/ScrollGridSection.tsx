import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ScrollText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IScroll } from '@/data/scrolls'
import { Image } from '@/components/ui/image'

interface ScrollGridSectionProps {
  scrolls: IScroll[]
}

export default function ScrollGridSection({ scrolls }: ScrollGridSectionProps) {
  const [selectedScroll, setSelectedScroll] = useState<IScroll | null>(null)

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
      {/* 密卷图片网格：一行10个（响应式） */}
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
            <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors group aspect-square flex items-center justify-center p-1">
              <Image
                src={scroll.imageUrl}
                alt={scroll.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Card>
            <p className="text-xs text-muted-foreground truncate text-center mt-1 leading-tight">
              {scroll.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 密卷详情弹窗 */}
      <Dialog open={!!selectedScroll} onOpenChange={(open) => !open && setSelectedScroll(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedScroll?.name}</DialogTitle>
          </DialogHeader>
          {selectedScroll && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedScroll.imageUrl}
                  alt={selectedScroll.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">效果描述：</span>
                  {selectedScroll.description}
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span className="font-medium">冷却时间：</span>
                  {selectedScroll.cooldown}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}