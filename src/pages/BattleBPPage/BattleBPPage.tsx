import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useData } from '@/contexts/DataContext'
import CounterTab from './CounterTab'
import SimulateBPTab from './SimulateBPTab'
import BPRoomPage from './BPRoomPage'

export default function BattleBPPage() {
  const { ensureNinjas, ensureScrolls, ensureSummons, ensureCounters } = useData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ensureNinjas(),
      ensureScrolls(),
      ensureSummons(),
      ensureCounters()
    ]).finally(() => setLoading(false))
  }, [ensureNinjas, ensureScrolls, ensureSummons, ensureCounters])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载武斗赛数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">武斗赛<span className="text-primary">BP</span></h1>
          <p className="text-muted-foreground text-sm">查看克制关系、模拟BP与联机武斗</p>
        </div>

        <Tabs defaultValue="counter">
          <TabsList>
            <TabsTrigger value="counter">克制关系</TabsTrigger>
            <TabsTrigger value="simulate">模拟BP</TabsTrigger>
            <TabsTrigger value="room">武斗房间</TabsTrigger>
          </TabsList>

          <TabsContent value="counter" className="mt-6">
            <CounterTab />
          </TabsContent>

          <TabsContent value="simulate" className="mt-6">
            <SimulateBPTab />
          </TabsContent>

          <TabsContent value="room" className="mt-6">
            <BPRoomPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}