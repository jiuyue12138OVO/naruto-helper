import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'

type FilterStatus = 'include' | 'exclude' | undefined

interface SlotState {
  tier: Record<string, FilterStatus>
  rating: Record<string, FilterStatus>
  tag: Record<string, FilterStatus>
  scroll: Record<string, FilterStatus>
}

interface SlotFilterCardProps {
  slotIndex: number
  slotState: SlotState
  setSlotState: React.Dispatch<React.SetStateAction<SlotState>>
  eligibleCount: number
}

const TIER_OPTIONS = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const RATING_OPTIONS = ['S', 'A', 'B', 'C']

export default function SlotFilterCard({
  slotIndex,
  slotState,
  setSlotState,
  eligibleCount,
}: SlotFilterCardProps) {
  const { scrolls, ninjaTags } = useData()

  // 整体折叠
  const [collapsed, setCollapsed] = useState(false)
  // 子项折叠
  const [tierOpen, setTierOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(true)
  const [tagsOpen, setTagsOpen] = useState(true)
  const [scrollOpen, setScrollOpen] = useState(true)

  // 清空该位置
  const clearSlot = () => {
    setSlotState({ tier: {}, rating: {}, tag: {}, scroll: {} })
  }

  // 三态循环
  const cycleFilter = (type: 'tier' | 'rating' | 'tag' | 'scroll', key: string) => {
    setSlotState(prev => {
      const obj = { ...prev[type] }
      const cur = obj[key]
      if (!cur) obj[key] = 'include'
      else if (cur === 'include') obj[key] = 'exclude'
      else delete obj[key]
      return { ...prev, [type]: obj }
    })
  }

  const renderBadges = (
    type: 'tier' | 'rating' | 'tag',
    options: string[]
  ) => {
    const status = slotState[type]
    return options.map(opt => {
      const stat = status[opt]
      let variant: 'default' | 'outline' | 'destructive' = 'outline'
      if (stat === 'include') variant = 'default'
      else if (stat === 'exclude') variant = 'destructive'
      return (
        <Badge
          key={opt}
          variant={variant}
          className="cursor-pointer text-xs"
          onClick={() => cycleFilter(type, opt)}
        >
          {stat === 'exclude' ? `排除:${opt}` : opt}
        </Badge>
      )
    })
  }

  return (
    <Card className="p-4 space-y-3">
      {/* 头部：左侧大箭头+标题，右侧清空 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
          位置 {slotIndex + 1}
        </button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearSlot}>
          清空
        </Button>
      </div>

      {/* 可选忍者数量（折叠时也显示） */}
      <div className="text-xs text-muted-foreground">
        可选忍者：{eligibleCount} 位
      </div>

      {/* 折叠后隐藏所有筛选内容 */}
      {!collapsed && (
        <div className="space-y-3">
          {/* 梯度 */}
          <div>
            <button
              onClick={() => setTierOpen(!tierOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left"
            >
              {tierOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              梯度
            </button>
            {tierOpen && (
              <div className="flex flex-wrap gap-1 mt-1">
                {renderBadges('tier', TIER_OPTIONS)}
              </div>
            )}
          </div>

          {/* 评级 */}
          <div>
            <button
              onClick={() => setRatingOpen(!ratingOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left"
            >
              {ratingOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              评级
            </button>
            {ratingOpen && (
              <div className="flex flex-wrap gap-1 mt-1">
                {renderBadges('rating', RATING_OPTIONS)}
              </div>
            )}
          </div>

          {/* 定位标签 */}
          <div>
            <button
              onClick={() => setTagsOpen(!tagsOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left"
            >
              {tagsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              标签
            </button>
            {tagsOpen && (
              <div className="flex flex-wrap gap-1 mt-1">
                {renderBadges('tag', ninjaTags)}
              </div>
            )}
          </div>

          {/* 密卷（小图） */}
          <div>
            <button
              onClick={() => setScrollOpen(!scrollOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left"
            >
              {scrollOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              密卷
            </button>
            {scrollOpen && (
              <div className="flex flex-wrap gap-1 mt-1">
                {scrolls.map(scroll => {
                  const status = slotState.scroll[scroll.id]
                  let variant: 'default' | 'outline' | 'destructive' = 'outline'
                  if (status === 'include') variant = 'default'
                  else if (status === 'exclude') variant = 'destructive'
                  return (
                    <div
                      key={scroll.id}
                      className="cursor-pointer flex flex-col items-center w-12"
                      onClick={() => cycleFilter('scroll', scroll.id)}
                    >
                      <div
                        className={`w-8 h-8 rounded overflow-hidden border ${
                          status === 'include'
                            ? 'border-primary'
                            : status === 'exclude'
                            ? 'border-destructive'
                            : 'border-border/40'
                        } bg-card`}
                      >
                        <Image
                          src={scroll.imageUrl}
                          alt={scroll.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-[10px] mt-0.5 text-center leading-tight truncate max-w-full ${
                          status === 'exclude' ? 'text-destructive' : 'text-muted-foreground'
                        }`}
                      >
                        {status === 'exclude' ? '排除' : scroll.name.substring(0, 2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}