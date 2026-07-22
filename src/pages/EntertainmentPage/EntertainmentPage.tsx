import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useData } from '@/contexts/DataContext'
import RandomTab from './RandomTab'

export default function EntertainmentPage() {
  const { ensureNinjas, ensureScrolls, ensureRecommendations } = useData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ensureNinjas(),
      ensureScrolls(),
      ensureRecommendations(),
    ]).finally(() => setLoading(false))
  }, [ensureNinjas, ensureScrolls, ensureRecommendations])

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
          <p className="text-muted-foreground text-sm">放松一下，随机探索你的本命忍者</p>
          <div className="mt-4 bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>随机结果仅供娱乐，不构成强度参考。实际对局请根据阵容灵活选择。</span>
          </div>
        </div>

        <Tabs defaultValue="random">
          <TabsList>
            <TabsTrigger value="random" className="flex items-center gap-1.5">
              <span className="text-base leading-none">🎲</span>
              随机
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random" className="mt-6">
            <RandomTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}