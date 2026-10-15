import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useData } from '@/contexts/DataContext'
import { EasterEggIcon } from '@/components/EasterEggIcon'
import RandomTab from './RandomTab'
import EasterEggTab from './EasterEggTab'

export default function EntertainmentPage() {
  const { ensureNinjas, ensureScrolls, ensureRecommendations, ensureEasterEggs } = useData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ensureNinjas(),
      ensureScrolls(),
      ensureRecommendations(),
      ensureEasterEggs(),
    ]).finally(() => setLoading(false))
  }, [ensureNinjas, ensureScrolls, ensureRecommendations, ensureEasterEggs])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载娱乐数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            娱乐<span className="text-primary">模式</span>
          </h1>
          <p className="text-muted-foreground text-sm">放松一下</p>
        </div>

        <Tabs defaultValue="random">
          <TabsList>
            <TabsTrigger value="random" className="flex items-center gap-1.5">
              <span className="text-base leading-none">🎲</span>
              随机
            </TabsTrigger>
            <TabsTrigger value="easter-egg" className="flex items-center gap-1.5">
              <EasterEggIcon className="size-5" />
              彩蛋
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random" className="mt-6">
            <RandomTab />
          </TabsContent>

          <TabsContent value="easter-egg" className="mt-6">
            <EasterEggTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
