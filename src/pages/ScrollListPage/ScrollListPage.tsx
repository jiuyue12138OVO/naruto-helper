import { useState, useMemo } from 'react'
import FilterBarSection from './FilterBarSection'
import ScrollGridSection from './ScrollGridSection'
import { useData } from '@/contexts/DataContext'

export default function ScrollListPage() {
  const { scrolls } = useData()
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    if (!keyword) return scrolls
    return scrolls.filter((s) =>
      s.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [scrolls, keyword])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            密卷<span className="text-primary">大全</span>
          </h1>
          <p className="text-muted-foreground text-sm">点击图片查看详细信息</p>
        </div>

        <FilterBarSection keyword={keyword} onKeywordChange={setKeyword} />

        <ScrollGridSection scrolls={filtered} />
      </div>
    </div>
  )
}