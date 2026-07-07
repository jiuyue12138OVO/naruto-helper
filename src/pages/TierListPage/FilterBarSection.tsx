import { useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useData } from '@/contexts/DataContext'

const TIERS = [
  { value: 'all', label: '全部' },
  { value: '天王', label: '天王' },
  { value: '伪天王', label: '伪天王' },
  { value: 't0顶', label: 't0顶' },
  { value: 't0上', label: 't0上' },
  { value: 't0中', label: 't0中' },
  { value: 't0下', label: 't0下' },
  { value: '准t0', label: '准t0' },
]

const RATINGS = ['all', 'S', 'A', 'B', 'C']

interface FilterBarSectionProps {
  activeTier: string
  onTierChange: (tier: string) => void
  activeRating: string
  onRatingChange: (rating: string) => void
  tagStatus: Record<string, 'include' | 'exclude'>
  onTagCycle: (tag: string) => void
  onClearTags: () => void
  keyword: string
  onKeywordChange: (keyword: string) => void
  matchAllTags?: boolean
  onMatchAllTagsChange?: (matchAll: boolean) => void
}

export default function FilterBarSection({
  activeTier,
  onTierChange,
  activeRating,
  onRatingChange,
  tagStatus,
  onTagCycle,
  onClearTags,
  keyword,
  onKeywordChange,
  matchAllTags = false,
  onMatchAllTagsChange,
}: FilterBarSectionProps) {
  const { ninjaTags } = useData()

  // 计算包含标签的数量（用于判断是否显示且/或开关）
  const includedTagsCount = Object.values(tagStatus).filter(v => v === 'include').length

  return (
    <div className="space-y-4">
      {/* 梯度筛选 */}
      <div className="flex flex-wrap gap-2">
        {TIERS.map((tier) => (
          <Button
            key={tier.value}
            variant={activeTier === tier.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTierChange(tier.value)}
            className={cn(
              'rounded-full text-xs font-medium transition-all',
              activeTier === tier.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {tier.label}
          </Button>
        ))}
      </div>

      {/* 评级 + 定位筛选 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">评级：</span>
          <Select value={activeRating} onValueChange={onRatingChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map(r => (
                <SelectItem key={r} value={r}>
                  {r === 'all' ? '全部' : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">定位：</span>
          {ninjaTags.map(tag => {
            const status = tagStatus[tag]
            let variant: 'outline' | 'default' | 'destructive' = 'outline'
            if (status === 'include') variant = 'default'
            else if (status === 'exclude') variant = 'destructive'

            return (
              <Badge
                key={tag}
                variant={variant}
                className="cursor-pointer text-xs select-none"
                onClick={() => onTagCycle(tag)}
                title={
                  status === 'include'
                    ? '包含此标签（点击切换为排除）'
                    : status === 'exclude'
                    ? '排除此标签（点击取消）'
                    : '未筛选（点击包含）'
                }
              >
                {tag}
                {status === 'exclude' && (
                  <span className="ml-0.5 opacity-70">✕</span>
                )}
              </Badge>
            )
          })}
          {Object.keys(tagStatus).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={onClearTags}
            >
              清除
            </Button>
          )}
        </div>

        {/* 包含标签的且/或开关（仅当包含标签多于1个时显示） */}
        {includedTagsCount > 1 && onMatchAllTagsChange && (
          <div className="flex items-center gap-2">
            <Switch
              id="match-all"
              checked={matchAllTags}
              onCheckedChange={onMatchAllTagsChange}
            />
            <Label htmlFor="match-all" className="text-xs text-muted-foreground cursor-pointer">
              同时包含所有标签
            </Label>
          </div>
        )}
      </div>

      {/* 搜索 */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="搜索忍者名称..."
          className="bg-background pl-9 pr-9"
        />
        {keyword && (
          <Button
            size="icon"
            variant="ghost"
            className="!absolute right-1.5 top-1/2 z-20 h-7 w-7 -translate-y-1/2"
            onClick={() => onKeywordChange('')}
            aria-label="清除"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}