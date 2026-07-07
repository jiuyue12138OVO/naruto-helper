import { motion } from 'framer-motion'
import { ScrollText, User, ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IRecommendation } from '@/data/recommendations'

interface RecommendationListSectionProps {
  recommendations: IRecommendation[]
}

export default function RecommendationListSection({
  recommendations,
}: RecommendationListSectionProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ScrollText className="size-12 mb-4 opacity-30" />
        <p className="text-lg">没有找到匹配的推荐</p>
        <p className="text-sm">试试搜索其他忍者名称</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((rec, i) => {
        // 按优先级升序排序
        const sortedScrolls = [...rec.scrolls].sort((a, b) => a.priority - b.priority)

        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="border-border/40 bg-card/50 hover:bg-card/80 transition-colors h-full">
              <CardContent className="p-5 space-y-4">
                {/* 忍者名称 */}
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="size-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground truncate">{rec.ninjaName}</h3>
                </div>

                {/* 推荐密卷列表 */}
                <div className="pl-10 space-y-1.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <ScrollText className="size-3" />
                    推荐密卷（从上到下优先级降低）
                  </p>
                  {sortedScrolls.map((scroll, idx) => (
                    <div
                      key={scroll.scrollId}
                      className="flex items-center gap-2 py-1 first:pt-0"
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs font-mono shrink-0 w-5 h-5 flex items-center justify-center rounded-full p-0"
                      >
                        {idx + 1}
                      </Badge>
                      <span className="text-sm text-foreground">{scroll.scrollName}</span>
                      {idx < sortedScrolls.length - 1 && (
                        <ArrowDown className="size-3 text-muted-foreground/50 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}