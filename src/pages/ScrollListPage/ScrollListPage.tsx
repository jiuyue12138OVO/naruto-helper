import { useState, useMemo, useEffect } from 'react'
import FilterBarSection from './FilterBarSection'
import ScrollGridSection from './ScrollGridSection'
import { useData } from '@/contexts/DataContext'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function ScrollListPage() {
  const { scrolls, ensureScrolls } = useData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ensureScrolls().finally(() => setLoading(false))
  }, [ensureScrolls])

  const [keyword, setKeyword] = useState('')
  const [showExclusive, setShowExclusive] = useState(false)

  const filtered = useMemo(() => {
    if (!keyword) return scrolls
    return scrolls.filter((s) =>
      s.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [scrolls, keyword])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载密卷数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              密卷<span className="text-primary">大全</span>
            </h1>
            <p className="text-muted-foreground text-sm">点击图片查看详细信息</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="scroll-list-exclusive-toggle" className="text-sm cursor-pointer select-none">
              {showExclusive ? <Eye className="h-4 w-4 inline mr-1" /> : <EyeOff className="h-4 w-4 inline mr-1" />}
              显示专属
            </Label>
            <Switch
              id="scroll-list-exclusive-toggle"
              checked={showExclusive}
              onCheckedChange={setShowExclusive}
            />
          </div>
        </div>

        <FilterBarSection keyword={keyword} onKeywordChange={setKeyword} />

        <ScrollGridSection scrolls={filtered} showExclusive={showExclusive} />
      </div>
    </div>
  )
}