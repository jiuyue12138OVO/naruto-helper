import HeroSection from './HeroSection'
import FeatureCardsSection from './FeatureCardsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeatureCardsSection />
    </div>
  )
}
