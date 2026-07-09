import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Swords, ScrollText, Eye, Flame, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    title: '忍者强度排行',
    description: '按梯度分类展示所有忍者强度，支持评级、定位筛选与搜索',
    icon: Swords,
    path: '/tier-list',
    gradient: 'from-orange-500/20 to-red-600/20',
    iconBg: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: '忍者密卷推荐',
    description: '查看各忍者最佳密卷搭配，多密卷优先级排序一目了然',
    icon: ScrollText,
    path: '/ninja-scroll',
    gradient: 'from-red-600/20 to-rose-600/20',
    iconBg: 'bg-red-500/10 text-red-500',
  },
  {
    title: '密卷大全',
    description: '浏览全部密卷详细信息，效果描述与冷却时间快速查阅',
    icon: Eye,
    path: '/scroll-list',
    gradient: 'from-amber-500/20 to-orange-600/20',
    iconBg: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: '通灵兽大全',
    description: '通灵兽图鉴，图片、技能、描述一览无余',
    icon: Flame,
    path: '/summons',
    gradient: 'from-yellow-500/20 to-orange-600/20',
    iconBg: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    title: '武斗赛BP',
    description: 'Ban/Pick 辅助工具，助你制定对战策略',
    icon: Shield,
    path: '/battle-bp',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    iconBg: 'bg-blue-500/10 text-blue-500',
  },
]

export default function FeatureCardsSection() {
  const navigate = useNavigate()

  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            功能<span className="text-primary">模块</span>
          </h2>
          <p className="text-muted-foreground">选择你需要的功能，快速上手</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card
                  className="cursor-pointer border-border/40 bg-card/50 hover:bg-card/80 transition-colors h-full group"
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div
                      className={`size-14 rounded-xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}