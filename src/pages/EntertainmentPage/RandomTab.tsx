import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, ChevronDown, ChevronUp, Settings, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import SharedTeamTab from './SharedTeamTab'
import RandomTeamTab from './RandomTeamTab'
import SettingsDialog from './SettingsDialog'
import type { INinja } from '@/data/ninjas'

const TIER_OPTIONS = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const RATING_OPTIONS = ['S', 'A', 'B', 'C']
const DISABLED_NINJAS_KEY = 'entertainment_disabled_ninjas'
const DISABLED_SCROLLS_KEY = 'entertainment_disabled_scrolls'
const SELECTED_NINJAS_KEY = 'entertainment_selected_ninjas'
const SELECTED_SCROLLS_KEY = 'entertainment_selected_scrolls'
const MODE_KEY = 'entertainment_mode'

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
  const [resultScroll, setResultScroll] = useState<string | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  // 设置弹窗
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 模式 (禁用/选用)
  const [mode, setMode] = useState<'disable' | 'select'>(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY)
      return saved === 'select' ? 'select' : 'disable'
    } catch { return 'disable' }
  })

  // 禁用忍者
  const [disabledNinjaIds, setDisabledNinjaIds] = useState<Set<string>>(() => {
    try { const arr = JSON.parse(localStorage.getItem(DISABLED_NINJAS_KEY) || '[]'); return new Set(arr) } catch { return new Set() }
  })

  // 禁用密卷
  const [disabledScrollIds, setDisabledScrollIds] = useState<Set<string>>(() => {
    try { const arr = JSON.parse(localStorage.getItem(DISABLED_SCROLLS_KEY) || '[]'); return new Set(arr) } catch { return new Set() }
  })

  // 选用忍者
  const [selectedNinjaIds, setSelectedNinjaIds] = useState<Set<string>>(() => {
    try { const arr = JSON.parse(localStorage.getItem(SELECTED_NINJAS_KEY) || '[]'); return new Set(arr) } catch { return new Set() }
  })

  // 选用密卷
  const [selectedScrollIds, setSelectedScrollIds] = useState<Set<string>>(() => {
    try { const arr = JSON.parse(localStorage.getItem(SELECTED_SCROLLS_KEY) || '[]'); return new Set(arr) } catch { return new Set() }
  })

  // 持久化
  useEffect(() => { localStorage.setItem(DISABLED_NINJAS_KEY, JSON.stringify([...disabledNinjaIds])) }, [disabledNinjaIds])
  useEffect(() => { localStorage.setItem(DISABLED_SCROLLS_KEY, JSON.stringify([...disabledScrollIds])) }, [disabledScrollIds])
  useEffect(() => { localStorage.setItem(SELECTED_NINJAS_KEY, JSON.stringify([...selectedNinjaIds])) }, [selectedNinjaIds])
  useEffect(() => { localStorage.setItem(SELECTED_SCROLLS_KEY, JSON.stringify([...selectedScrollIds])) }, [selectedScrollIds])
  useEffect(() => { localStorage.setItem(MODE_KEY, mode) }, [mode])

  const [teamMode, setTeamMode] = useState<'shared' | 'individual'>('shared')
  const [activeResultTab, setActiveResultTab] = useState('random-ninja')
  const [randomScrollEnabled, setRandomScrollEnabled] = useState(false)

  const handleModeChange = (newMode: 'disable' | 'select') => setMode(newMode)

  const getNinjaScrollIds = useCallback((ninjaId: string) => {
    const rec = recommendations.find(r => r.ninjaId === ninjaId)
    return rec ? rec.scrolls.map(s => s.scrollId) : []
  }, [recommendations])

  // 符合条件的忍者（经过模式筛选及其他条件过滤）
  const eligibleNinjas = useMemo(() => {
    const filtered = ninjas.filter(n => {
      if (mode === 'disable') {
        if (disabledNinjaIds.has(n.id)) return false
      } else {
        if (selectedNinjaIds.size > 0 && !selectedNinjaIds.has(n.id)) return false
      }

      const incTiers = Object.keys(tierStatus).filter(k => tierStatus[k] === 'include')
      const excTiers = Object.keys(tierStatus).filter(k => tierStatus[k] === 'exclude')
      const incRatings = Object.keys(ratingStatus).filter(k => ratingStatus[k] === 'include')
      const excRatings = Object.keys(ratingStatus).filter(k => ratingStatus[k] === 'exclude')
      const incTags = Object.keys(tagStatus).filter(k => tagStatus[k] === 'include')
      const excTags = Object.keys(tagStatus).filter(k => tagStatus[k] === 'exclude')
      const incScrolls = Object.keys(scrollStatus).filter(k => scrollStatus[k] === 'include')
      const excScrolls = Object.keys(scrollStatus).filter(k => scrollStatus[k] === 'exclude')

      if (incTiers.length > 0 && !incTiers.includes(n.tier)) return false
      if (excTiers.length > 0 && excTiers.includes(n.tier)) return false
      if (incRatings.length > 0 && !incRatings.includes(n.rating)) return false
      if (excRatings.length > 0 && excRatings.includes(n.rating)) return false
      if (incTags.length > 0 && !incTags.every(tag => n.tags?.includes(tag))) return false
      if (excTags.length > 0 && excTags.some(tag => n.tags?.includes(tag))) return false

      const ninjaScrolls = getNinjaScrollIds(n.id)
      if (incScrolls.length > 0 && !incScrolls.some(sid => ninjaScrolls.includes(sid))) return false
      if (excScrolls.length > 0 && excScrolls.some(sid => ninjaScrolls.includes(sid))) return false

      return true
    })
    return filtered
  }, [ninjas, mode, disabledNinjaIds, selectedNinjaIds, tierStatus, ratingStatus, tagStatus, scrollStatus, getNinjaScrollIds])

  const getFilteredScrolls = useCallback((ninjaId: string) => {
    const allScrolls = getNinjaScrollIds(ninjaId)
    if (mode === 'disable') {
      return allScrolls.filter(id => !disabledScrollIds.has(id))
    } else {
      if (selectedScrollIds.size === 0) return allScrolls
      return allScrolls.filter(id => selectedScrollIds.has(id))
    }
  }, [getNinjaScrollIds, mode, disabledScrollIds, selectedScrollIds])

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

  const handleRandom = useCallback(() => {
    if (eligibleNinjas.length === 0) return
    setIsRolling(true)
    const duration = 600
    const interval = 60
    const steps = duration / interval
    let count = 0
    const timer = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * eligibleNinjas.length)
      const ninja = eligibleNinjas[randomIdx]
      setResult(ninja)
      if (randomScrollEnabled) {
        const scrollIds = getFilteredScrolls(ninja.id)
        setResultScroll(scrollIds.length ? scrollIds[Math.floor(Math.random() * scrollIds.length)] : null)
      } else setResultScroll(null)
      count++
      if (count >= steps) {
        clearInterval(timer)
        const finalNinja = eligibleNinjas[Math.floor(Math.random() * eligibleNinjas.length)]
        setResult(finalNinja)
        if (randomScrollEnabled) {
          const scrollIds = getFilteredScrolls(finalNinja.id)
          setResultScroll(scrollIds.length ? scrollIds[Math.floor(Math.random() * scrollIds.length)] : null)
        }
        setIsRolling(false)
      }
    }, interval)
  }, [eligibleNinjas, randomScrollEnabled, getFilteredScrolls])

  const cycleStatus = (key: string, setStatus: React.Dispatch<React.SetStateAction<Record<string, FilterStatus>>>) => {
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

          {/* 条件统计：根据模式显示不同提示 */}
          <div className="text-sm text-muted-foreground pt-2">
            符合条件的忍者：{eligibleNinjas.length} 位
            {mode === 'disable' && disabledNinjaIds.size > 0 && (
              <span className="text-destructive ml-2">（已禁用 {disabledNinjaIds.size} 位）</span>
            )}
            {mode === 'select' && selectedNinjaIds.size > 0 && (
              <span className="text-primary ml-2">（已选用 {selectedNinjaIds.size} 位）</span>
            )}
          </div>
        </Card>
      )}

      {/* 免责声明 */}
      <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
        <span>随机结果仅供娱乐，不构成强度参考。实际对局请根据阵容灵活选择。</span>
      </div>

      {/* 随机结果区域 */}
      <div className="flex items-center justify-between">
        <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="random-ninja">随机忍者</TabsTrigger>
            <TabsTrigger value="random-team">随机阵容</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
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
              getFilteredScrolls={getFilteredScrolls}
              randomScrollEnabled={randomScrollEnabled}
            />
          ) : (
            <RandomTeamTab
              ninjas={ninjas}
              mode={mode}
              disabledNinjaIds={disabledNinjaIds}
              selectedNinjaIds={selectedNinjaIds}
              disabledScrollIds={disabledScrollIds}
              selectedScrollIds={selectedScrollIds}
              globalTierStatus={tierStatus}
              globalRatingStatus={ratingStatus}
              globalTagStatus={tagStatus}
              getNinjaScrollIds={getNinjaScrollIds}
              globalIncludedScrolls={includedScrolls}
              globalExcludedScrolls={excludedScrolls}
              scrolls={scrolls}
              randomScrollEnabled={randomScrollEnabled}
            />
          )}
        </div>
      )}

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        ninjas={ninjas}
        scrolls={scrolls}
        mode={mode}
        onModeChange={handleModeChange}
        disabledNinjaIds={disabledNinjaIds}
        onToggleDisabledNinja={(id) => setDisabledNinjaIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })}
        clearDisabledNinjas={() => setDisabledNinjaIds(new Set())}
        disabledScrollIds={disabledScrollIds}
        onToggleDisabledScroll={(id) => setDisabledScrollIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })}
        clearDisabledScrolls={() => setDisabledScrollIds(new Set())}
        selectedNinjaIds={selectedNinjaIds}
        onToggleSelectedNinja={(id) => setSelectedNinjaIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })}
        clearSelectedNinjas={() => setSelectedNinjaIds(new Set())}
        selectedScrollIds={selectedScrollIds}
        onToggleSelectedScroll={(id) => setSelectedScrollIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })}
        clearSelectedScrolls={() => setSelectedScrollIds(new Set())}
      />
    </div>
  )
}