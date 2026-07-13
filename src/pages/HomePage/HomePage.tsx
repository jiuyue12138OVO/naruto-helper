import HeroSection from './HeroSection'
import FeatureCardsSection from './FeatureCardsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* 缓存提示条 */}
      <div className="w-full bg-card/80 backdrop-blur-sm border-y border-border/30 py-2 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          若未能获取最新数据，请清除浏览器缓存或使用无痕模式打开本站。
        </p>
      </div>

      <FeatureCardsSection />
    </div>
  )
}