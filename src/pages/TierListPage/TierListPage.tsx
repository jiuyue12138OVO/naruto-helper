import { useState, useMemo, useEffect } from 'react'
import FilterBarSection from './FilterBarSection'
import NinjaGridSection from './NinjaGridSection'
import { useData } from '@/contexts/DataContext'

export default function TierListPage() {
  const { ninjas, ninjaTags, ensureNinjas } = useData() // 新增 ensureNinjas
  const [loading, setLoading] = useState(true) // 新增 loading 状态

  const [activeTier, setActiveTier] = useState('all')
  const [activeRating, setActiveRating] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [tagStatus, setTagStatus] = useState<Record<string, 'include' | 'exclude'>>({})
  const [matchAllTags, setMatchAllTags] = useState(false)

  // 页面挂载时按需加载忍者数据
  useEffect(() => {
    ensureNinjas().finally(() => setLoading(false))
  }, [ensureNinjas])

  // 清理无效标签（管理端删除后自动移除）
  useEffect(() => {
    const existing = new Set(ninjaTags)
    setTagStatus(prev => {
      let changed = false
      const newStatus = { ...prev }
      for (const tag of Object.keys(newStatus)) {
        if (!existing.has(tag)) {
          delete newStatus[tag]
          changed = true
        }
      }
      return changed ? newStatus : prev
    })
  }, [ninjaTags])

  // 标签循环逻辑...
  const handleTagCycle = (tag: string) => {
    setTagStatus(prev => {
      const current = prev[tag]
      if (!current) return { ...prev, [tag]: 'include' }
      if (current === 'include') return { ...prev, [tag]: 'exclude' }
      const { [tag]: _, ...rest } = prev
      return rest
    })
  }

  const handleClearTags = () => {
    setTagStatus({})
  }

  const includedTags = useMemo(
    () => Object.entries(tagStatus).filter(([_, v]) => v === 'include').map(([k]) => k),
    [tagStatus]
  )
  const excludedTags = useMemo(
    () => Object.entries(tagStatus).filter(([_, v]) => v === 'exclude').map(([k]) => k),
    [tagStatus]
  )

  const filtered = useMemo(() => {
    return ninjas.filter((n) => {
      const matchTier = activeTier === 'all' || n.tier === activeTier
      const matchRating = activeRating === 'all' || n.rating === activeRating

      const matchExclude =
        excludedTags.length === 0 ||
        excludedTags.every(tag => !n.tags?.includes(tag))

      let matchInclude = true
      if (includedTags.length > 0) {
        if (matchAllTags) {
          matchInclude = includedTags.every(tag => n.tags?.includes(tag))
        } else {
          matchInclude = includedTags.some(tag => n.tags?.includes(tag))
        }
      }

      const matchKeyword =
        !keyword || n.name.toLowerCase().includes(keyword.toLowerCase())

      return matchTier && matchRating && matchExclude && matchInclude && matchKeyword
    })
  }, [ninjas, activeTier, activeRating, includedTags, excludedTags, matchAllTags, keyword])

  // 加载中显示占位
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">加载忍者数据中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            忍者<span className="text-primary">强度排行</span>
          </h1>
          <p className="text-muted-foreground text-sm">点击图片查看详细信息</p>
        </div>

        <FilterBarSection
          activeTier={activeTier}
          onTierChange={setActiveTier}
          activeRating={activeRating}
          onRatingChange={setActiveRating}
          tagStatus={tagStatus}
          onTagCycle={handleTagCycle}
          onClearTags={handleClearTags}
          keyword={keyword}
          onKeywordChange={setKeyword}
          matchAllTags={matchAllTags}
          onMatchAllTagsChange={setMatchAllTags}
        />

        <NinjaGridSection ninjas={filtered} />
      </div>
    </div>
  )
}