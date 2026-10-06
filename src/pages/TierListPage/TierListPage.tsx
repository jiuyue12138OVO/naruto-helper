import { useState, useMemo, useEffect } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import FilterBarSection from './FilterBarSection'
import NinjaGridSection from './NinjaGridSection'
import { useData } from '@/contexts/DataContext'

const TIER_COLORS: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  't1': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  '准t1': 'bg-gray-400/10 text-gray-400 border-gray-400/20',
  't2': 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
  't3': 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  '...': 'bg-stone-500/10 text-stone-500 border-stone-500/20',
}

const TIER_DESCRIPTIONS: { tier: string; desc: string }[] = [
  { tier: '天王', desc: '理论强度顶端，机制缺乏有效反制手段，严重影响对局平衡，亟待调整。' },
  { tier: '伪天王', desc: '反制窗口极小，强度过度膨胀，建议尽快调整。' },
  { tier: 't0顶', desc: '段位赛强度天花板，反制空间有限，需微调（该梯度及以上均超出合理强度阈值）。' },
  { tier: 't0上', desc: '版本主流强度，具备可预测的反制路径，个别单位需平衡性微调。' },
  { tier: 't0中', desc: '当前版本强度基准，优势区间与短板均处于合理范围。' },
  { tier: 't0下', desc: '仍具备段位赛竞争力，但受头部忍者压制，出场空间受限。' },
  { tier: '准t0', desc: '拥有可用强度，若头部降温或关键短板修复后具备晋升 t0 的潜力。' },
  { tier: 't1', desc: '低强度可用档，可在段位赛使用，但机制短板显著，对局容错率低。' },
  { tier: '准t1', desc: '具备进入段位赛的潜力（该梯度及以上技能组具备竞技强度）。' },
  { tier: 't2', desc: '连招稳定性达标，技能组具备操作空间，不具备段位赛竞争力，适合匹配娱乐使用。' },
  { tier: 't3', desc: '基础可用档，仅在连招稳定性上达标，机制缺陷明显。' },
  { tier: '...', desc: '劣质档位，无法保障基础游戏体验，连招衔接无法保证。' },
]

export default function TierListPage() {
  const { ninjas, ninjaTags, acquisitionOptions, ensureNinjas } = useData()
  const [loading, setLoading] = useState(true)

  const [activeTier, setActiveTier] = useState('all')
  const [activeRating, setActiveRating] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [tagStatus, setTagStatus] = useState<Record<string, 'include' | 'exclude'>>({})
  const [acquisitionStatus, setAcquisitionStatus] = useState<Record<string, 'include' | 'exclude'>>({})
  const [matchAllTags, setMatchAllTags] = useState(false)

  // 按游戏内编号排序开关
  const [sortByGameOrder, setSortByGameOrder] = useState(false)

  // 梯度说明折叠
  const [showTierGuide, setShowTierGuide] = useState(false)

  useEffect(() => {
    ensureNinjas().finally(() => setLoading(false))
  }, [ensureNinjas])

  // 清理已删除的标签筛选
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

  // 清理已删除的获取方式筛选
  useEffect(() => {
    const existing = new Set(acquisitionOptions)
    setAcquisitionStatus(prev => {
      let changed = false
      const newStatus = { ...prev }
      for (const option of Object.keys(newStatus)) {
        if (!existing.has(option)) {
          delete newStatus[option]
          changed = true
        }
      }
      return changed ? newStatus : prev
    })
  }, [acquisitionOptions])

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

  const handleAcquisitionCycle = (option: string) => {
    setAcquisitionStatus(prev => {
      const current = prev[option]
      if (!current) return { ...prev, [option]: 'include' }
      if (current === 'include') return { ...prev, [option]: 'exclude' }
      const { [option]: _, ...rest } = prev
      return rest
    })
  }

  const handleClearAcquisitions = () => {
    setAcquisitionStatus({})
  }

  const includedTags = useMemo(
    () => Object.entries(tagStatus).filter(([_, v]) => v === 'include').map(([k]) => k),
    [tagStatus]
  )
  const excludedTags = useMemo(
    () => Object.entries(tagStatus).filter(([_, v]) => v === 'exclude').map(([k]) => k),
    [tagStatus]
  )

  const includedAcquisitions = useMemo(
    () => Object.entries(acquisitionStatus).filter(([_, v]) => v === 'include').map(([k]) => k),
    [acquisitionStatus]
  )
  const excludedAcquisitions = useMemo(
    () => Object.entries(acquisitionStatus).filter(([_, v]) => v === 'exclude').map(([k]) => k),
    [acquisitionStatus]
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

      const nAcq = n.acquisition
      let matchAcquisition = true
      if (excludedAcquisitions.length > 0 && nAcq && excludedAcquisitions.includes(nAcq)) {
        matchAcquisition = false
      }
      if (matchAcquisition && includedAcquisitions.length > 0) {
        if (!nAcq) matchAcquisition = false
        else matchAcquisition = includedAcquisitions.includes(nAcq)
      }

      const matchKeyword =
        !keyword || n.name.toLowerCase().includes(keyword.toLowerCase())

      return matchTier && matchRating && matchExclude && matchInclude && matchAcquisition && matchKeyword
    })
  }, [
    ninjas,
    activeTier,
    activeRating,
    includedTags,
    excludedTags,
    includedAcquisitions,
    excludedAcquisitions,
    matchAllTags,
    keyword,
  ])

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
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                忍者<span className="text-primary">强度排行</span>
              </h1>
              <p className="text-muted-foreground text-sm">点击图片查看详细信息</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Label htmlFor="sort-by-game-order" className="text-sm cursor-pointer select-none">
                按游戏内编号排序
              </Label>
              <Switch
                id="sort-by-game-order"
                checked={sortByGameOrder}
                onCheckedChange={setSortByGameOrder}
              />
            </div>
          </div>

          <div className="mt-4 bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>
              忍者强度排行基于个人理解与实战经验，仅供参考。每位玩家的打法和理解不同，实际强度可能因操作者而异，如有不同意见以你为准。
              <br />
              排行综合考虑忍者状态：奥义点、专属通灵兽及适配密卷。
            </span>
          </div>

          {/* 梯度定位说明（可折叠） */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowTierGuide(v => !v)}
            >
              {showTierGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              梯度定位说明
            </Button>

            {showTierGuide && (
              <div className="mt-2 bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                {TIER_DESCRIPTIONS.map(({ tier, desc }) => (
                  <div key={tier} className="flex items-start gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-bold px-2 py-0.5 shrink-0 min-w-[48px] justify-center',
                        TIER_COLORS[tier]
                      )}
                    >
                      {tier}
                    </Badge>
                    <span className="text-sm text-muted-foreground leading-relaxed">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FilterBarSection
          activeTier={activeTier}
          onTierChange={setActiveTier}
          activeRating={activeRating}
          onRatingChange={setActiveRating}
          tagStatus={tagStatus}
          onTagCycle={handleTagCycle}
          onClearTags={handleClearTags}
          acquisitionStatus={acquisitionStatus}
          onAcquisitionCycle={handleAcquisitionCycle}
          onClearAcquisitions={handleClearAcquisitions}
          keyword={keyword}
          onKeywordChange={setKeyword}
          matchAllTags={matchAllTags}
          onMatchAllTagsChange={setMatchAllTags}
        />

        <NinjaGridSection ninjas={filtered} sortByGameOrder={sortByGameOrder} />
      </div>
    </div>
  )
}