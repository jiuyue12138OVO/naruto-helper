import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// 动态导入 wallpapers 文件夹下所有图片（支持 jpg / png / jpeg / webp）
const wallpaperModules = import.meta.glob('@/assets/wallpapers/*.{jpg,png,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const getAllWallpapers = (): string[] => Object.values(wallpaperModules)

export default function HeroSection() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wallpapers, setWallpapers] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)
  const nextImageRef = useRef<HTMLImageElement | null>(null)

  // 🔥 响应式背景尺寸：手机端完整显示，桌面端覆盖全屏
  const [bgSize, setBgSize] = useState<'cover' | 'contain'>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'contain' : 'cover'
  )

  const shuffleArray = useCallback((arr: string[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  useEffect(() => {
    const all = getAllWallpapers()
    if (all.length > 0) {
      const shuffled = shuffleArray(all)
      setWallpapers(shuffled)
      const img = new Image()
      img.src = shuffled[0]
      img.onload = () => setIsReady(true)
    }
  }, [shuffleArray])

  useEffect(() => {
    if (wallpapers.length === 0) return
    const nextIndex = (currentIndex + 1) % wallpapers.length
    const img = new Image()
    img.src = wallpapers[nextIndex]
    nextImageRef.current = img
  }, [currentIndex, wallpapers])

  useEffect(() => {
    if (wallpapers.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1
        if (next >= wallpapers.length) {
          setWallpapers(shuffleArray(getAllWallpapers()))
          return 0
        }
        return next
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [wallpapers, shuffleArray])

  // 监听窗口变化，更新背景尺寸
  useEffect(() => {
    const handleResize = () => {
      setBgSize(window.innerWidth < 768 ? 'contain' : 'cover')
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentWallpaper = isReady ? (wallpapers[currentIndex] || '') : ''

  return (
    <section className="w-full relative overflow-hidden min-h-screen flex flex-col">
      {/* 背景轮播：覆盖整个 section */}
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
                backgroundSize: bgSize,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#0a0a10', // 空白区域填充深色
              }}
            />
          )}
        </AnimatePresence>
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* 内容区域：垂直居中，顶部留出标题栏高度 */}
      <div className="relative flex-1 flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
              强度排行 · 密卷推荐 · 通灵兽大全 · 武斗赛BP
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/25"
              onClick={() => navigate('/tier-list')}
            >
              查看强度排行
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}