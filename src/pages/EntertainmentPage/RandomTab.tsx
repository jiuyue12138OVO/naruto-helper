import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Dice5, ChevronDown, ChevronUp, Settings, X, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import SharedTeamTab from './SharedTeamTab'
import RandomTeamTab from './RandomTeamTab'
import type { INinja } from '@/data/ninjas'

const TIER_OPTIONS = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const RATING_OPTIONS = ['S', 'A', 'B', 'C']
const DISABLED_NINJAS_KEY = 'entertainment_disabled_ninjas'
const DISABLED_SCROLLS_KEY = 'entertainment_disabled_scrolls'

type FilterStatus = 'include' | 'exclude' | undefined

export default function RandomTab() {
  const { ninjas, scrolls, recommendations, ninjaTags } = useData()

  // 筛选条件
  const [tierStatus, setTierStatus] = useState<Record<string, FilterStatus>>({})
  const [ratingStatus, setRatingStatus] = useState<Record<string, FilterStatus>>({})
  const [tagStatus, setTagStatus] = useState<Record<string, FilterStatus>>({})
  const [scrollStatus, setScrollStatus] = useState<Record<string, FilterStatus>>({})

  // 折叠
  const [tierOpen, setTierOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(true)
  const [tagsOpen, setTagsOpen] = useState(true)
  const [scrollOpen, setScrollOpen] = useState(true)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

  // 随机结果
  const [result, setResult] = useState<INinja | null>(null)
  const [resultScroll, setResultScroll] = useState<string | null>(null) // 随机到的密卷ID
  const [isRolling, setIsRolling] = useState(false)

  // 设置弹窗
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('ninjas')

  // 禁用忍者
  const [disabledNinjaIds, setDisabledNinjaIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(DISABLED_NINJAS_KEY)
      if (saved) {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr)) return new Set<string>(arr)
      }
    } catch {}
    return new Set<string>()
  })

  // 禁用密卷
  const [disabledScrollIds, setDisabledScrollIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(DISABLED_SCROLLS_KEY)
      if (saved) {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr)) return new Set<string>(arr)
      }
    } catch {}
    return new Set<string>()
  })

  useEffect(() => {
    localStorage.setItem(DISABLED_NINJAS_KEY, JSON.stringify([...disabledNinjaIds]))
  }, [disabledNinjaIds])

  useEffect(() => {
    localStorage.setItem(DISABLED_SCROLLS_KEY, JSON.stringify([...disabledScrollIds]))
  }, [disabledScrollIds])

  // 搜索
  const [settingsSearch, setSettingsSearch] = useState('')
  const [teamMode, setTeamMode] = useState<'shared' | 'individual'>('shared')
  const [activeResultTab, setActiveResultTab] = useState('random-ninja')

  // 随机密卷开关
  const [randomScrollEnabled, setRandomScrollEnabled] = useState(false)

  // 用于设置弹窗的忍者/密卷分组
  const filteredSettingsNinjas = useMemo(() => {
    if (!settingsSearch.trim()) return ninjas
    const kw = settingsSearch.toLowerCase()
    return ninjas.filter(n => n.name.toLowerCase().includes(kw))
  }, [ninjas, settingsSearch])

  const groupedSettingsNinjas = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_OPTIONS.forEach(tier => {
      const tierNinjas = filteredSettingsNinjas.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [filteredSettingsNinjas])

  const filteredSettingsScrolls = useMemo(() => {
    if (!settingsSearch.trim()) return scrolls
    const kw = settingsSearch.toLowerCase()
    return scrolls.filter(s => s.name.toLowerCase().includes(kw))
  }, [scrolls, settingsSearch])

  const toggleDisabledNinja = (id: string) => {
    setDisabledNinjaIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDisabledScroll = (id: string) => {
    setDisabledScrollIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearDisabledNinjas = () => setDisabledNinjaIds(new Set())
  const clearDisabledScrolls = () => setDisabledScrollIds(new Set())

  // 筛选逻辑
  const filterItems = (statusMap: Record<string, FilterStatus>, type: FilterStatus) =>
    Object.entries(statusMap).filter(([_, v]) => v === type).map(([k]) => k)

  const includedTiers = useMemo(() => filterItems(tierStatus, 'include'), [tierStatus])
  const excludedTiers = useMemo(() => filterItems(tierStatus, 'exclude'), [tierStatus])
  const includedRatings = useMemo(() => filterItems(ratingStatus, 'include'), [ratingStatus])
  const excludedRatings = useMemo(() => filterItems(ratingStatus, 'exclude'), [ratingStatus])
  const includedTags = useMemo(() => filterItems(tagStatus, 'include'), [tagStatus])
  const excludedTags = useMemo(() => filterItems(tagStatus, 'exclude'), [tagStatus])
  const includedScrolls = useMemo(() => filterItems(scrollStatus, 'include'), [scrollStatus])
  const excludedScrolls = useMemo(() => filterItems(scrollStatus, 'exclude'), [scrollStatus])

  const getNinjaScrollIds = useCallback(
    (ninjaId: string): string[] => {
      const rec = recommendations.find(r => r.ninjaId === ninjaId)
      if (!rec) return []
      return rec.scrolls.map(s => s.scrollId)
    },
    [recommendations]
  )

  // 符合条件的忍者
  const eligibleNinjas = useMemo(() => {
    return ninjas.filter(n => {
      if (disabledNinjaIds.has(n.id)) return false
      if (includedTiers.length > 0 && !includedTiers.includes(n.tier)) return false
      if (excludedTiers.length > 0 && excludedTiers.includes(n.tier)) return false
      if (includedRatings.length > 0 && !includedRatings.includes(n.rating)) return false
      if (excludedRatings.length > 0 && excludedRatings.includes(n.rating)) return false
      if (includedTags.length > 0 && !includedTags.every(tag => n.tags?.includes(tag))) return false
      if (excludedTags.length > 0 && excludedTags.some(tag => n.tags?.includes(tag))) return false
      if (includedScrolls.length > 0 || excludedScrolls.length > 0) {
        const ninjaScrolls = getNinjaScrollIds(n.id)
        if (includedScrolls.length > 0 && !includedScrolls.some(sid => ninjaScrolls.includes(sid))) return false
        if (excludedScrolls.length > 0 && excludedScrolls.some(sid => ninjaScrolls.includes(sid))) return false
      }
      return true
    })
  }, [ninjas, disabledNinjaIds, includedTiers, excludedTiers, includedRatings, excludedRatings, includedTags, excludedTags, includedScrolls, excludedScrolls, getNinjaScrollIds])

  // 随机忍者
  const handleRandom = useCallback(() => {
    if (eligibleNinjas.length === 0) return
    setIsRolling(true)
    const duration = 600
    const interval = 60
    const steps = duration / interval
    let count = 0
    const timer = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * eligibleNinjas.length)
      setResult(eligibleNinjas[randomIdx])
      if (randomScrollEnabled) {
        const ninja = eligibleNinjas[randomIdx]
        const scrollIds = getNinjaScrollIds(ninja.id).filter(id => !disabledScrollIds.has(id))
        if (scrollIds.length > 0) {
          setResultScroll(scrollIds[Math.floor(Math.random() * scrollIds.length)])
        } else {
          setResultScroll(null)
        }
      } else {
        setResultScroll(null)
      }
      count++
      if (count >= steps) {
        clearInterval(timer)
        const finalIdx = Math.floor(Math.random() * eligibleNinjas.length)
        const finalNinja = eligibleNinjas[finalIdx]
        setResult(finalNinja)
        if (randomScrollEnabled) {
          const scrollIds = getNinjaScrollIds(finalNinja.id).filter(id => !disabledScrollIds.has(id))
          if (scrollIds.length > 0) {
            setResultScroll(scrollIds[Math.floor(Math.random() * scrollIds.length)])
          } else {
            setResultScroll(null)
          }
        } else {
          setResultScroll(null)
        }
        setIsRolling(false)
      }
    }, interval)
  }, [eligibleNinjas, randomScrollEnabled, getNinjaScrollIds, disabledScrollIds])

  const cycleStatus = (
    key: string,
    setStatus: React.Dispatch<React.SetStateAction<Record<string, FilterStatus>>>
  ) => {
    setStatus(prev => {
      const cur = prev[key]
      if (!cur) return { ...prev, [key]: 'include' }
      if (cur === 'include') return { ...prev, [key]: 'exclude' }
      const { [key]: _, ...rest } = prev
      return rest
    })
  }

  const clearAll = () => {
    setTierStatus({})
    setRatingStatus({})
    setTagStatus({})
    setScrollStatus({})
  }

  const renderBadge = (label: string, status: FilterStatus, onClick: () => void) => {
    let variant: 'default' | 'outline' | 'destructive' = 'outline'
    if (status === 'include') variant = 'default'
    else if (status === 'exclude') variant = 'destructive'
    return (
      <Badge key={label} variant={variant} className="cursor-pointer" onClick={onClick}>
        {status === 'exclude' ? `排除:${label}` : label}
      </Badge>
    )
  }

  const summaryText = (included: string[], excluded: string[]) => {
    const parts: string[] = []
    if (included.length) parts.push(`包含：${included.join('、')}`)
    if (excluded.length) parts.push(`排除：${excluded.join('、')}`)
    return parts.join('；')
  }

  const showFilterCard = !(activeResultTab === 'random-team' && teamMode === 'individual')

  return (
    <div className="space-y-6">
      {showFilterCard && (
        <Card className="p-4 md:p-6 space-y-4">
          {/* ... 筛选条件卡片内容保持不变 ... */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">筛选条件</h2>
              <span className="text-xs text-muted-foreground">（点击选项切换：无 → 包含 → 排除）</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>清空条件</Button>
              <Button variant="ghost" size="icon" onClick={() => setFiltersCollapsed(!filtersCollapsed)} title={filtersCollapsed ? '展开' : '折叠'}>
                {filtersCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {!filtersCollapsed && (
            <>
              <div>
                <button onClick={() => setTierOpen(!tierOpen)} className="flex items-center gap-2 text-sm font-medium mb-2 hover:text-primary transition-colors w-full text-left">
                  {tierOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  梯度
                </button>
                {tierOpen && (
                  <div className="flex flex-wrap gap-2">
                    {TIER_OPTIONS.map(tier => renderBadge(tier, tierStatus[tier], () => cycleStatus(tier, setTierStatus)))}
                  </div>
                )}
                {summaryText(includedTiers, excludedTiers) && (
                  <p className="text-xs text-muted-foreground mt-1">{summaryText(includedTiers, excludedTiers)}</p>
                )}
              </div>

              <div>
                <button onClick={() => setRatingOpen(!ratingOpen)} className="flex items-center gap-2 text-sm font-medium mb-2 hover:text-primary transition-colors w-full text-left">
                  {ratingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  评级
                </button>
                {ratingOpen && (
                  <div className="flex flex-wrap gap-2">
                    {RATING_OPTIONS.map(rating => renderBadge(rating, ratingStatus[rating], () => cycleStatus(rating, setRatingStatus)))}
                  </div>
                )}
                {summaryText(includedRatings, excludedRatings) && (
                  <p className="text-xs text-muted-foreground mt-1">{summaryText(includedRatings, excludedRatings)}</p>
                )}
              </div>

              <div>
                <button onClick={() => setTagsOpen(!tagsOpen)} className="flex items-center gap-2 text-sm font-medium mb-2 hover:text-primary transition-colors w-full text-left">
                  {tagsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  定位标签
                </button>
                {tagsOpen && (
                  <div className="flex flex-wrap gap-2">
                    {ninjaTags.map(tag => renderBadge(tag, tagStatus[tag], () => cycleStatus(tag, setTagStatus)))}
                  </div>
                )}
                {summaryText(includedTags, excludedTags) && (
                  <p className="text-xs text-muted-foreground mt-1">{summaryText(includedTags, excludedTags)}</p>
                )}
              </div>

              <div>
                <button onClick={() => setScrollOpen(!scrollOpen)} className="flex items-center gap-2 text-sm font-medium mb-2 hover:text-primary transition-colors w-full text-left">
                  {scrollOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  密卷
                </button>
                {scrollOpen && (
                  <div className="flex flex-wrap gap-2">
                    {scrolls.map(scroll => {
                      const status = scrollStatus[scroll.id]
                      return (
                        <div key={scroll.id} className="cursor-pointer flex flex-col items-center w-14" onClick={() => cycleStatus(scroll.id, setScrollStatus)}>
                          <div className={`w-10 h-10 rounded-md overflow-hidden border-2 ${status === 'include' ? 'border-primary' : status === 'exclude' ? 'border-destructive' : 'border-border/40'} bg-card`}>
                            <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                          </div>
                          <span className={`text-xs mt-0.5 text-center leading-tight truncate max-w-full ${status === 'exclude' ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {status === 'exclude' ? `排除` : scroll.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {summaryText(includedScrolls.map(id => scrolls.find(s => s.id === id)?.name || id), excludedScrolls.map(id => scrolls.find(s => s.id === id)?.name || id)) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {summaryText(includedScrolls.map(id => scrolls.find(s => s.id === id)?.name || id), excludedScrolls.map(id => scrolls.find(s => s.id === id)?.name || id))}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="text-sm text-muted-foreground pt-2">
            符合条件的忍者：{eligibleNinjas.length} 位
            {disabledNinjaIds.size > 0 && <span className="text-destructive ml-2">（已禁用 {disabledNinjaIds.size} 位）</span>}
          </div>
        </Card>
      )}

      {/* 随机结果区域 */}
      <div className="flex items-center justify-between">
        <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="random-ninja">随机忍者</TabsTrigger>
            <TabsTrigger value="random-team">随机阵容</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          {/* 随机密卷开关 */}
          <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={randomScrollEnabled}
              onChange={(e) => setRandomScrollEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            随机适配密卷
          </label>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title="随机设置">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeResultTab === 'random-ninja' && (
        <div className="space-y-6 mt-6">
          <div className="flex items-center gap-3">
            <Button onClick={handleRandom} disabled={eligibleNinjas.length === 0 || isRolling} className="gap-2">
              <span className="text-base">🎲</span>
              {isRolling ? '抽取中...' : '随机抽取'}
            </Button>
          </div>
          <Card className="p-6 md:p-8">
            {result ? (
              <motion.div
                key={result.id + Date.now()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-40 h-40 rounded-xl overflow-hidden border border-border bg-card shadow-lg">
                  <Image src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold">{result.name}</h3>
                <div className="flex gap-2 flex-wrap justify-center">
                  <Badge variant="secondary">{result.tier}</Badge>
                  <Badge variant="outline">{result.rating}</Badge>
                  {result.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-muted/50">{tag}</Badge>
                  ))}
                </div>
                {randomScrollEnabled && resultScroll && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm text-muted-foreground">随机密卷</span>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                      <div className="w-8 h-8 rounded overflow-hidden border border-border/40 bg-card">
                        <Image src={scrolls.find(s => s.id === resultScroll)?.imageUrl ?? ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm">{scrolls.find(s => s.id === resultScroll)?.name}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Shuffle className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-lg">设置条件后点击抽取</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeResultTab === 'random-team' && (
        <div className="space-y-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-lg p-1 gap-1">
              <button
                onClick={() => setTeamMode('shared')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${teamMode === 'shared' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                共用条件
              </button>
              <button
                onClick={() => setTeamMode('individual')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${teamMode === 'individual' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                独立条件
              </button>
            </div>
          </div>

          {teamMode === 'shared' ? (
            <SharedTeamTab
              eligibleNinjas={eligibleNinjas}
              scrolls={scrolls}
              disabledScrollIds={disabledScrollIds}
              randomScrollEnabled={randomScrollEnabled}
              getNinjaScrollIds={getNinjaScrollIds}
            />
          ) : (
            <RandomTeamTab
              ninjas={ninjas}
              disabledNinjaIds={disabledNinjaIds}
              globalTierStatus={tierStatus}
              globalRatingStatus={ratingStatus}
              globalTagStatus={tagStatus}
              getNinjaScrollIds={getNinjaScrollIds}
              globalIncludedScrolls={includedScrolls}
              globalExcludedScrolls={excludedScrolls}
              scrolls={scrolls}
              disabledScrollIds={disabledScrollIds}
              randomScrollEnabled={randomScrollEnabled}
            />
          )}
        </div>
      )}

      {/* 设置弹窗 */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>随机设置</DialogTitle>
          </DialogHeader>
          <Tabs value={settingsTab} onValueChange={setSettingsTab} className="flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="ninjas">禁用忍者</TabsTrigger>
              <TabsTrigger value="scrolls">禁用密卷</TabsTrigger>
            </TabsList>
            <TabsContent value="ninjas" className="flex-1 overflow-auto">
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={settingsSearch}
                      onChange={(e) => setSettingsSearch(e.target.value)}
                      placeholder="搜索忍者..."
                      className="pl-9 pr-9"
                    />
                    {settingsSearch && (
                      <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSettingsSearch('')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearDisabledNinjas} disabled={disabledNinjaIds.size === 0}>
                    清空禁用列表
                  </Button>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {groupedSettingsNinjas.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">无匹配忍者</p>
                  ) : (
                    groupedSettingsNinjas.map(group => (
                      <div key={group.tier}>
                        <Badge variant="outline" className="mb-2 text-sm font-bold">
                          {group.tier}
                        </Badge>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {group.ninjas.map(ninja => {
                            const isDisabled = disabledNinjaIds.has(ninja.id)
                            return (
                              <div
                                key={ninja.id}
                                className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isDisabled ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                                onClick={() => toggleDisabledNinja(ninja.id)}
                              >
                                <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                                  <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-xs text-center leading-tight ${isDisabled ? 'text-destructive line-through' : 'text-foreground'}`}>
                                  {ninja.name}
                                </span>
                                {isDisabled && <span className="text-[10px] text-destructive">已禁用</span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scrolls" className="flex-1 overflow-auto">
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={settingsSearch}
                      onChange={(e) => setSettingsSearch(e.target.value)}
                      placeholder="搜索密卷..."
                      className="pl-9 pr-9"
                    />
                    {settingsSearch && (
                      <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSettingsSearch('')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearDisabledScrolls} disabled={disabledScrollIds.size === 0}>
                    清空禁用列表
                  </Button>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-80 overflow-y-auto">
                  {filteredSettingsScrolls.map(scroll => {
                    const isDisabled = disabledScrollIds.has(scroll.id)
                    return (
                      <div
                        key={scroll.id}
                        className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isDisabled ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                        onClick={() => toggleDisabledScroll(scroll.id)}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                          <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-xs text-center leading-tight ${isDisabled ? 'text-destructive line-through' : 'text-foreground'}`}>
                          {scroll.name}
                        </span>
                        {isDisabled && <span className="text-[10px] text-destructive">已禁用</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}