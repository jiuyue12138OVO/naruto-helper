import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// 动态导入 wallpapers 文件夹下所有图片（支持 jpg / png / jpeg）
const wallpaperModules = import.meta.glob('@/assets/wallpapers/*.{jpg,png,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const getAllWallpapers = (): string[] => Object.values(wallpaperModules)

export default function HeroSection() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wallpapers, setWallpapers] = useState<string[]>([])

  // 随机打乱数组
  const shuffleArray = useCallback((arr: string[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // 初始化：打乱所有壁纸
  useEffect(() => {
    const all = getAllWallpapers()
    if (all.length > 0) {
      setWallpapers(shuffleArray(all))
    }
  }, [shuffleArray])

  // 定时切换
  useEffect(() => {
    if (wallpapers.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1
        // 一轮播放完后重新洗牌
        if (next >= wallpapers.length) {
          setWallpapers(shuffleArray(getAllWallpapers()))
          return 0
        }
        return next
      })
    }, 5000) // 5 秒切换
    return () => clearInterval(timer)
  }, [wallpapers, shuffleArray])

  const currentWallpaper = wallpapers[currentIndex] || ''

  return (
    <section className="w-full relative overflow-hidden">
      {/* 背景轮播 */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          {currentWallpaper && (
            <motion.div
              key={currentWallpaper}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${currentWallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
        </AnimatePresence>
        {/* 固定渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* 内容 */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            火影忍者手游辅助工具
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            火影忍者<span className="text-primary">辅助助手</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            一站式忍者强度排行、密卷推荐搭配、数据管理，助你制霸决斗场
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/25"
              onClick={() => navigate('/tier-list')}
            >
              查看强度排行
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/ninja-scroll')}
            >
              密卷推荐
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}