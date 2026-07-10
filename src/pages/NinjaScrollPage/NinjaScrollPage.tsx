import { useState, useMemo } from 'react'
import SearchBarSection from './SearchBarSection'
import RecommendationListSection from './RecommendationListSection'
import { useData } from '@/contexts/DataContext'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function NinjaScrollPage() {
  const { ninjas, recommendations, scrolls } = useData()
  const [ninjaKeyword, setNinjaKeyword] = useState('')
  const [scrollKeyword, setScrollKeyword] = useState('')

  // 过滤推荐（按忍者名称和密卷名称）
  const filtered = useMemo(() => {
    let list = [...recommendations]

    if (ninjaKeyword.trim()) {
      const kw = ninjaKeyword.trim().toLowerCase()
      list = list.filter(r => r.ninjaName.toLowerCase().includes(kw))
    }
    if (scrollKeyword.trim()) {
      const kw = scrollKeyword.trim().toLowerCase()
      list = list.filter(r => r.scrolls.some(s => s.scrollName.toLowerCase().includes(kw)))
    }
    return list
  }, [recommendations, ninjaKeyword, scrollKeyword])

  // 按梯度分组
  const grouped = useMemo(() => {
    const map: Record<string, { rec: (typeof filtered)[number]; ninja: (typeof ninjas)[number] }[]> = {}
    filtered.forEach(rec => {
      const ninja = ninjas.find(n => n.id === rec.ninjaId)
      if (!ninja) return
      const tier = ninja.tier
      if (!map[tier]) map[tier] = []
      map[tier].push({ rec, ninja })
    })
    // 按 TIER_ORDER 排序
    return TIER_ORDER.map(tier => ({
      tier,
      items: map[tier] || []
    })).filter(group => group.items.length > 0)
  }, [filtered, ninjas])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            忍者<span className="text-primary">密卷推荐</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            搜索忍者名称或密卷名称，点击图片查看推荐密卷
          </p>
        </div>

        {/* 搜索框 */}
        <SearchBarSection keyword={ninjaKeyword} onKeywordChange={setNinjaKeyword} />

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={scrollKeyword}
            onChange={e => setScrollKeyword(e.target.value)}
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

        <RecommendationListSection grouped={grouped} scrolls={scrolls} />
      </div>
    </div>
  )
}