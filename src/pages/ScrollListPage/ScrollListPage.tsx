import { useState, useMemo } from 'react'
import FilterBarSection from './FilterBarSection'
import ScrollGridSection from './ScrollGridSection'
import { useData } from '@/contexts/DataContext'

export default function ScrollListPage() {
  const { scrolls } = useData()
  const [activeTier, setActiveTier] = useState('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    return scrolls.filter((s) => {
      const matchTier = activeTier === 'all' || s.tier === activeTier
      const matchKeyword =
        !keyword || s.name.toLowerCase().includes(keyword.toLowerCase())
      return matchTier && matchKeyword
    })
  }, [scrolls, activeTier, keyword])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            密卷<span className="text-primary">大全</span>
          </h1>
          <p className="text-muted-foreground text-sm">浏览全部密卷详细信息</p>
        </div>

        <FilterBarSection
          activeTier={activeTier}
          onTierChange={setActiveTier}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />

        <ScrollGridSection scrolls={filtered} />
      </div>
    </div>
  )
}
