import { useState, useMemo, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Swords, ScrollText, Download, Flame, Shield, Database } from 'lucide-react'
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
import SummonManageTab from './SummonManageTab'
import BattleBPManageTab from './BattleBPManageTab'
import ScrollAndRecommendManageTab from './ScrollAndRecommendManageTab'
import { useData } from '@/contexts/DataContext'

export default function DataManagementPage() {
  const {
    ninjas,
    scrolls,
    recommendations,
    ninjaTags,
    acquisitionOptions,
    summons,
    counters,
    blindPickOrder,
    resetAllData,
  } = useData()

  const [resetOpen, setResetOpen] = useState(false)

  // 数据统计
  const stats = useMemo(() => ([
    { label: '忍者', count: ninjas.length },
    { label: '密卷', count: scrolls.length },
    { label: '推荐', count: recommendations.length },
    { label: '通灵', count: summons.length },
    { label: '克制', count: counters.length },
    { label: '定位标签', count: ninjaTags.length },
    { label: '获取方式', count: acquisitionOptions.length },
    { label: '盲选位', count: blindPickOrder.length },
  ]), [ninjas, scrolls, recommendations, summons, counters, ninjaTags, acquisitionOptions, blindPickOrder])

  const handleExportAll = useCallback(() => {
    const data = {
      ninjas,
      scrolls,
      recommendations,
      ninjaTags,
      acquisitionOptions,
      summons,
      counters,
      blindPickOrder,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const ymd = now.toISOString().slice(0, 10)
    const hm = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    a.href = url
    a.download = `naruto-data-${ymd}-${hm}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [ninjas, scrolls, recommendations, ninjaTags, acquisitionOptions, summons, counters, blindPickOrder])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Database className="size-6 text-primary" />
              数据<span className="text-primary">管理</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              管理忍者、密卷、通灵兽和武斗赛 BP 数据
            </p>
            {/* 数据统计 */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {stats.map(s => (
                <Badge key={s.label} variant="outline" className="text-xs font-normal">
                  {s.label} <span className="ml-1 font-mono font-bold">{s.count}</span>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
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

        {/* 标签页：4 个主标签 */}
        <Tabs defaultValue="ninjas" className="w-full">
          <TabsList className="w-full max-w-xl grid grid-cols-4">
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
            <TabsTrigger value="battlebp" className="gap-1.5">
              <Shield className="size-4" />
              <span className="hidden sm:inline">武斗赛 BP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ninjas" className="mt-6">
            <NinjaManageTab />
          </TabsContent>

          {/* 密卷管理：内部包含“密卷大全”和“忍者密卷适配”两个子标签 */}
          <TabsContent value="scrolls" className="mt-6">
            <ScrollAndRecommendManageTab />
          </TabsContent>

          <TabsContent value="summons" className="mt-6">
            <SummonManageTab />
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
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>此操作将清除所有自定义修改，恢复为应用内置的默认数据。此操作不可撤销。</p>
                <p className="text-foreground">会被清除的数据包括：</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>忍者数据（{ninjas.length} 条，含盲选位、编号、获取方式）</li>
                  <li>密卷数据（{scrolls.length} 条，含专属变体）</li>
                  <li>忍者密卷推荐（{recommendations.length} 条）</li>
                  <li>通灵兽数据（{summons.length} 条，含专属对应忍者）</li>
                  <li>武斗赛克制关系（{counters.length} 条）</li>
                  <li>定位标签（{ninjaTags.length} 条）、获取方式（{acquisitionOptions.length} 条）</li>
                  <li>盲选位顺序（{blindPickOrder.length} 条）</li>
                </ul>
              </div>
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