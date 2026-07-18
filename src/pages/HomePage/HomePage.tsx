import { DATA_VERSION } from '@/version'
import HeroSection from './HeroSection'
import FeatureCardsSection from './FeatureCardsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* 提示条 */}
      <div className="w-full bg-card/80 backdrop-blur-sm border-y border-border/30 py-3 px-4 text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          若未能获取最新数据，请清除浏览器缓存或使用无痕模式打开本站。
        </p>
        <p className="text-sm text-muted-foreground">
          点击下方功能卡片后，将按需加载对应数据，首次打开可能稍慢，再次访问速度更快。
        </p>
        {/* 版本号 */}
        <p className="text-xs text-muted-foreground/60 mt-1">
          版本：{DATA_VERSION}
        </p>
      </div>

      <FeatureCardsSection />
    </div>
  )
}