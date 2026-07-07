import { useState, useMemo } from 'react'
import SearchBarSection from './SearchBarSection'
import RecommendationListSection from './RecommendationListSection'
import { useData } from '@/contexts/DataContext'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NinjaScrollPage() {
  const { recommendations } = useData()
  const [ninjaKeyword, setNinjaKeyword] = useState('')
  const [scrollKeyword, setScrollKeyword] = useState('')

  const filtered = useMemo(() => {
    let list = [...recommendations]

    // 按忍者名称过滤
    if (ninjaKeyword.trim()) {
      const kw = ninjaKeyword.trim().toLowerCase()
      list = list.filter((r) =>
        r.ninjaName.toLowerCase().includes(kw)
      )
    }

    // 按密卷名称过滤（检查该忍者的推荐密卷列表中是否包含指定密卷）
    if (scrollKeyword.trim()) {
      const kw = scrollKeyword.trim().toLowerCase()
      list = list.filter((r) =>
        r.scrolls.some((s) => s.scrollName.toLowerCase().includes(kw))
      )
    }

    return list
  }, [recommendations, ninjaKeyword, scrollKeyword])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            忍者<span className="text-primary">密卷推荐</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            搜索忍者名称或密卷名称，查看推荐搭配
          </p>
        </div>

        {/* 忍者名称搜索 */}
        <SearchBarSection keyword={ninjaKeyword} onKeywordChange={setNinjaKeyword} />

        {/* 密卷名称搜索 */}
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={scrollKeyword}
            onChange={(e) => setScrollKeyword(e.target.value)}
            placeholder="搜索密卷名称..."
            className="bg-background pl-9 pr-9"
          />
          {scrollKeyword && (
            <Button
              size="icon"
              variant="ghost"
              className="!absolute right-1.5 top-1/2 z-20 h-7 w-7 -translate-y-1/2"
              onClick={() => setScrollKeyword('')}
              aria-label="清除"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <RecommendationListSection recommendations={filtered} />
      </div>
    </div>
  )
}