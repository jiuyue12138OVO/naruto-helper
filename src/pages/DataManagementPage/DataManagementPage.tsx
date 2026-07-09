import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw, Swords, ScrollText, Link2, Download, Flame, Shield } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import NinjaManageTab from './NinjaManageTab'
import ScrollManageTab from './ScrollManageTab'
import RecommendationManageTab from './RecommendationManageTab'
import SummonManageTab from './SummonManageTab'
import BattleBPManageTab from './BattleBPManageTab'
import { useData } from '@/contexts/DataContext'

export default function DataManagementPage() {
  const { ninjas, scrolls, recommendations, ninjaTags, summons, counters, resetAllData } = useData()
  const [resetOpen, setResetOpen] = useState(false)

  const handleExportAll = () => {
    const data = { ninjas, scrolls, recommendations, ninjaTags, summons, counters }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `naruto-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              数据<span className="text-primary">管理</span>
            </h1>
            <p className="text-muted-foreground text-sm">管理忍者、密卷、通灵兽、推荐搭配和武斗赛BP数据</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportAll}
              className="gap-1.5"
            >
              <Download className="size-4" />
              导出所有数据
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetOpen(true)}
              className="gap-1.5"
            >
              <RotateCcw className="size-4" />
              恢复默认数据
            </Button>
          </div>
        </div>

        {/* 标签页 */}
        <Tabs defaultValue="ninjas" className="w-full">
          <TabsList className="w-full max-w-2xl grid grid-cols-5">
            <TabsTrigger value="ninjas" className="gap-1.5">
              <Swords className="size-4" />
              <span className="hidden sm:inline">忍者管理</span>
            </TabsTrigger>
            <TabsTrigger value="scrolls" className="gap-1.5">
              <ScrollText className="size-4" />
              <span className="hidden sm:inline">密卷管理</span>
            </TabsTrigger>
            <TabsTrigger value="summons" className="gap-1.5">
              <Flame className="size-4" />
              <span className="hidden sm:inline">通灵兽管理</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-1.5">
              <Link2 className="size-4" />
              <span className="hidden sm:inline">推荐搭配</span>
            </TabsTrigger>
            <TabsTrigger value="battlebp" className="gap-1.5">
              <Shield className="size-4" />
              <span className="hidden sm:inline">武斗赛BP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ninjas" className="mt-6">
            <NinjaManageTab />
          </TabsContent>
          <TabsContent value="scrolls" className="mt-6">
            <ScrollManageTab />
          </TabsContent>
          <TabsContent value="summons" className="mt-6">
            <SummonManageTab />
          </TabsContent>
          <TabsContent value="recommendations" className="mt-6">
            <RecommendationManageTab />
          </TabsContent>
          <TabsContent value="battlebp" className="mt-6">
            <BattleBPManageTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* 恢复默认数据确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认恢复默认数据？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将清除所有自定义修改，恢复为应用内置的默认数据。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetAllData()
                setResetOpen(false)
              }}
            >
              确认恢复
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}