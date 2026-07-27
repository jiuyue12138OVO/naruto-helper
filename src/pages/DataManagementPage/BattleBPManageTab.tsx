import { useState, useMemo, useEffect, useCallback } from 'react'
import { Save, Search, Trash2, ArrowUpDown, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useData } from '@/contexts/DataContext'
import { IBPCounter } from '@/data/battleBp'
import { Image } from '@/components/ui/image'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

export default function BattleBPManageTab() {
  const {
    ninjas, scrolls, summons, counters, blindPickOrder, setBlindPickOrder,
    updateNinjaBlindPick, addCounter, updateCounter, deleteCounter,
  } = useData()

  const [searchNinja, setSearchNinja] = useState('')
  const [selectedNinjaId, setSelectedNinjaId] = useState<string>('')
  const [selectedCounterId, setSelectedCounterId] = useState<string>('')
  const [form, setForm] = useState<{
    counterNinjaIds: string[]
    counterScrollIds: string[]
    counterSummonIds: string[]
    counterNinjaScores: Record<string, number>
  }>({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [], counterNinjaScores: {} })

  const [searchCounterNinja, setSearchCounterNinja] = useState('')
  const [searchCounterScroll, setSearchCounterScroll] = useState('')
  const [searchCounterSummon, setSearchCounterSummon] = useState('')
  const [searchConfigNinja, setSearchConfigNinja] = useState('')
  const [currentTab, setCurrentTab] = useState('blind-pick')

  // 当前忍者对应的克制关系
  const currentCounter = useMemo(() => {
    return counters.find(c => c.ninjaId === selectedNinjaId)
  }, [counters, selectedNinjaId])

  // 初始化表单
  useEffect(() => {
    if (currentCounter) {
      setForm({
        counterNinjaIds: currentCounter.counterNinjaIds || [],
        counterScrollIds: currentCounter.counterScrollIds || [],
        counterSummonIds: currentCounter.counterSummonIds || [],
        counterNinjaScores: currentCounter.counterNinjaScores || {},
      })
      setSelectedCounterId(currentCounter.id)
    } else {
      setForm({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [], counterNinjaScores: {} })
      setSelectedCounterId('')
    }
    setSearchCounterNinja('')
    setSearchCounterScroll('')
    setSearchCounterSummon('')
  }, [currentCounter, selectedNinjaId])

  // 手动排序
  const handleSortByScore = () => {
    setForm(prev => {
      const sorted = [...prev.counterNinjaIds].sort((a, b) => (prev.counterNinjaScores[b] ?? 0) - (prev.counterNinjaScores[a] ?? 0))
      return { ...prev, counterNinjaIds: sorted }
    })
  }

  // 重置所有分数为0
  const handleResetScores = () => {
    setForm(prev => {
      const newScores: Record<string, number> = {}
      prev.counterNinjaIds.forEach(id => { newScores[id] = 0 })
      return { ...prev, counterNinjaScores: newScores }
    })
  }

  // 添加/移除忍者
  const toggleNinja = (id: string) => {
    setForm(prev => {
      const exists = prev.counterNinjaIds.includes(id)
      const newIds = exists ? prev.counterNinjaIds.filter(i => i !== id) : [...prev.counterNinjaIds, id]
      const newScores = { ...prev.counterNinjaScores }
      if (exists) {
        delete newScores[id]
      } else {
        newScores[id] = 0
      }
      return { ...prev, counterNinjaIds: newIds, counterNinjaScores: newScores }
    })
  }

  // 分数改变（滑条或输入框）
  const handleScoreChange = (id: string, value: number) => {
    setForm(prev => ({
      ...prev,
      counterNinjaScores: { ...prev.counterNinjaScores, [id]: Math.max(-50, Math.min(50, value)) }
    }))
  }

  // ----- 盲选位设置（保持不变） -----
  const filteredNinjas = useMemo(() => {
    if (!searchNinja) return ninjas
    return ninjas.filter(n => n.name.toLowerCase().includes(searchNinja.toLowerCase()))
  }, [ninjas, searchNinja])

  const sortedGroupedNinjas = useMemo(() => {
    const orderMap = new Map(blindPickOrder.map((id, idx) => [id, idx]))
    return TIER_ORDER.map(tier => {
      const tierNinjas = filteredNinjas.filter(n => n.tier === tier)
      if (tierNinjas.length === 0) return null
      const blind = tierNinjas.filter(n => n.blindPick)
      const nonBlind = tierNinjas.filter(n => !n.blindPick)
      blind.sort((a, b) => {
        const ia = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity
        const ib = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity
        return ia - ib
      })
      nonBlind.sort((a, b) => a.name.localeCompare(b.name))
      return { tier, ninjas: [...blind, ...nonBlind] }
    }).filter(Boolean) as { tier: string; ninjas: typeof ninjas }[]
  }, [filteredNinjas, blindPickOrder])

  const handleToggleBlind = useCallback((ninjaId: string, checked: boolean) => {
    updateNinjaBlindPick(ninjaId, checked)
    if (checked) {
      const ninja = ninjas.find(n => n.id === ninjaId)
      if (!ninja) return
      const tier = ninja.tier
      setBlindPickOrder(prev => {
        const filtered = prev.filter(id => id !== ninjaId)
        const firstIdx = filtered.findIndex(id => {
          const n = ninjas.find(n => n.id === id)
          return n && n.blindPick && n.tier === tier
        })
        if (firstIdx !== -1) {
          return [...filtered.slice(0, firstIdx), ninjaId, ...filtered.slice(firstIdx)]
        } else {
          return [...filtered, ninjaId]
        }
      })
    }
  }, [updateNinjaBlindPick, ninjas, setBlindPickOrder])

  const handleDragStartBlind = (e: React.DragEvent, ninjaId: string) => {
    e.dataTransfer.setData('text/plain', ninjaId)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOverBlind = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDropBlind = (e: React.DragEvent, targetId: string, tier: string) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    if (!draggedId || draggedId === targetId) return
    const group = sortedGroupedNinjas.find(g => g.tier === tier)
    if (!group) return
    const blindList = group.ninjas.filter(n => n.blindPick).map(n => n.id)
    const fromIdx = blindList.indexOf(draggedId)
    const toIdx = blindList.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const newBlindList = [...blindList]
    newBlindList.splice(fromIdx, 1)
    newBlindList.splice(toIdx, 0, draggedId)
    setBlindPickOrder(prev => {
      const otherIds = prev.filter(id => !newBlindList.includes(id) || !ninjas.find(n => n.id === id)?.blindPick)
      const firstOther = otherIds.findIndex(id => {
        const n = ninjas.find(n => n.id === id)
        return n && n.blindPick && n.tier === tier
      })
      if (firstOther !== -1) {
        return [...otherIds.slice(0, firstOther), ...newBlindList, ...otherIds.slice(firstOther + 1)]
      } else {
        return [...otherIds, ...newBlindList]
      }
    })
  }

  // ----- 克制关系配置相关（忍者选择） -----
  const filteredCounterNinjas = useMemo(() => {
    const list = ninjas.filter(n => n.id !== selectedNinjaId)
    if (!searchCounterNinja) return list
    return list.filter(n => n.name.toLowerCase().includes(searchCounterNinja.toLowerCase()))
  }, [ninjas, selectedNinjaId, searchCounterNinja])

  const filteredCounterScrolls = useMemo(() => {
    if (!searchCounterScroll) return scrolls
    return scrolls.filter(s => s.name.toLowerCase().includes(searchCounterScroll.toLowerCase()))
  }, [scrolls, searchCounterScroll])

  const filteredCounterSummons = useMemo(() => {
    if (!searchCounterSummon) return summons
    return summons.filter(s => s.name.toLowerCase().includes(searchCounterSummon.toLowerCase()))
  }, [summons, searchCounterSummon])

  const groupedNinjasForConfig = useMemo(() => {
    let list = ninjas
    if (searchConfigNinja.trim()) {
      list = ninjas.filter(n => n.name.toLowerCase().includes(searchConfigNinja.toLowerCase()))
    }
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: list.filter(n => n.tier === tier)
    })).filter(g => g.ninjas.length > 0)
  }, [ninjas, searchConfigNinja])

  const selectedNinja = ninjas.find(n => n.id === selectedNinjaId)

  const handleSaveCounter = () => {
    if (!selectedNinjaId) return
    // 保存时按当前 counterNinjaIds 顺序保存
    const data: IBPCounter = {
      id: selectedCounterId || Date.now().toString(),
      ninjaId: selectedNinjaId,
      counterNinjaIds: form.counterNinjaIds,
      counterScrollIds: form.counterScrollIds,
      counterSummonIds: form.counterSummonIds,
      counterNinjaScores: form.counterNinjaScores,
    }
    if (selectedCounterId) {
      updateCounter(selectedCounterId, data)
    } else {
      addCounter(data)
      setSelectedCounterId(data.id)
    }
    toast.success('克制关系已保存')
  }

  const handleDeleteCounter = () => {
    if (selectedCounterId) {
      deleteCounter(selectedCounterId)
      setSelectedCounterId('')
      setForm({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [], counterNinjaScores: {} })
      setSelectedNinjaId('')
      toast.success('克制关系已删除')
    }
  }

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="blind-pick">盲选位设置</TabsTrigger>
        <TabsTrigger value="counter-config">克制关系配置</TabsTrigger>
      </TabsList>

      {/* ========== 盲选位设置 ========== */}
      <TabsContent value="blind-pick" className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={searchNinja} onChange={e => setSearchNinja(e.target.value)} placeholder="搜索忍者..." className="pl-9" />
              </div>

              {sortedGroupedNinjas.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-12">未找到忍者</div>
              ) : (
                <div className="space-y-10">
                  {sortedGroupedNinjas.map(group => (
                    <div key={group.tier}>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-sm font-bold px-3 py-1">{group.tier}</Badge>
                        <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                        {group.ninjas.map(ninja => (
                          <div
                            key={ninja.id}
                            draggable={ninja.blindPick}
                            onDragStart={ninja.blindPick ? (e) => handleDragStartBlind(e, ninja.id) : undefined}
                            onDragOver={ninja.blindPick ? handleDragOverBlind : undefined}
                            onDrop={ninja.blindPick ? (e) => handleDropBlind(e, ninja.id, group.tier) : undefined}
                            className={`relative cursor-pointer group ${ninja.blindPick ? 'cursor-grab active:cursor-grabbing' : ''}`}
                          >
                            <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1 relative">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                              <div className="absolute bottom-0.5 right-0.5 z-10 flex items-center gap-0.5 bg-background/60 rounded p-0.5 backdrop-blur-sm">
                                <input
                                  type="checkbox"
                                  checked={ninja.blindPick || false}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    handleToggleBlind(ninja.id, e.target.checked)
                                  }}
                                  className="size-3.5 rounded border-border accent-primary"
                                />
                                {ninja.blindPick && (
                                  <span className="text-[10px] text-primary font-bold leading-none">盲</span>
                                )}
                              </div>
                            </Card>
                            <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ========== 克制关系配置（分数滑块 + 输入框） ========== */}
      <TabsContent value="counter-config" className="mt-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            {!selectedNinjaId ? (
              <>
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchConfigNinja}
                    onChange={(e) => setSearchConfigNinja(e.target.value)}
                    placeholder="搜索忍者..."
                    className="pl-9"
                  />
                </div>

                {groupedNinjasForConfig.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-12">未找到忍者</div>
                ) : (
                  <div className="space-y-10">
                    {groupedNinjasForConfig.map(group => (
                      <div key={group.tier}>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-sm font-bold px-3 py-1">{group.tier}</Badge>
                          <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                          {group.ninjas.map(ninja => (
                            <div
                              key={ninja.id}
                              className="cursor-pointer"
                              onClick={() => setSelectedNinjaId(ninja.id)}
                            >
                              <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                                <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                              </Card>
                              <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-2">
                    <Image src={selectedNinja?.imageUrl} alt={selectedNinja?.name} className="w-5 h-5 rounded object-cover" />
                    <span>{selectedNinja?.name}</span>
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedNinjaId('')}>← 返回选择</Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteCounter}>删除配置</Button>
                </div>

                {/* 克制忍者：图片墙选择 + 分数设置 */}
                <div>
                  <Label>克制该忍者的忍者（点击添加/移除，调节分数）</Label>
                  <div className="relative mt-2 mb-2">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={searchCounterNinja} onChange={e => setSearchCounterNinja(e.target.value)} placeholder="搜索忍者..." className="pl-9" />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredCounterNinjas.map(n => (
                      <Badge
                        key={n.id}
                        variant={form.counterNinjaIds.includes(n.id) ? 'default' : 'outline'}
                        className="cursor-pointer h-auto py-1 px-2 gap-1.5"
                        onClick={() => toggleNinja(n.id)}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{n.name}</span>
                      </Badge>
                    ))}
                  </div>

                  {form.counterNinjaIds.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">已选克制忍者</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleResetScores} className="h-7 text-xs">
                            <RotateCcw className="size-3 mr-1" /> 分数归零
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleSortByScore} className="h-7 text-xs">
                            <ArrowUpDown className="size-3 mr-1" /> 按分数排序
                          </Button>
                        </div>
                      </div>
                      {form.counterNinjaIds.map((id) => {
                        const nin = ninjas.find(n => n.id === id)
                        if (!nin) return null
                        const score = form.counterNinjaScores[id] ?? 0
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-3 bg-muted/40 rounded px-3 py-2"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-border">
                                <Image src={nin.imageUrl} alt={nin.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm truncate">{nin.name}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* 范围滑块 */}
                              <input
                                type="range"
                                min={-50}
                                max={50}
                                value={score}
                                onChange={(e) => handleScoreChange(id, Number(e.target.value))}
                                className="w-32 h-2 accent-primary cursor-pointer"
                              />
                              {/* 数字输入框 */}
                              <Input
                                type="number"
                                min={-50}
                                max={50}
                                value={score}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10)
                                  if (!isNaN(val)) handleScoreChange(id, val)
                                }}
                                className="w-16 h-7 text-xs text-center [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span
                                className={`text-xs font-bold w-10 text-right ${
                                  score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
                                }`}
                              >
                                {score > 0 ? `+${score}` : score}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 密卷 / 通灵（保持不变） */}
                <div>
                  <Label>克制该忍者的密卷（可多选）</Label>
                  <div className="relative mt-2 mb-2">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={searchCounterScroll} onChange={e => setSearchCounterScroll(e.target.value)} placeholder="搜索密卷..." className="pl-9" />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredCounterScrolls.map(s => (
                      <Badge
                        key={s.id}
                        variant={form.counterScrollIds.includes(s.id) ? 'default' : 'outline'}
                        className="cursor-pointer h-auto py-1 px-2 gap-1.5"
                        onClick={() => setForm(prev => ({
                          ...prev,
                          counterScrollIds: prev.counterScrollIds.includes(s.id)
                            ? prev.counterScrollIds.filter(i => i !== s.id)
                            : [...prev.counterScrollIds, s.id]
                        }))}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{s.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>克制该忍者的通灵兽（可多选）</Label>
                  <div className="relative mt-2 mb-2">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={searchCounterSummon} onChange={e => setSearchCounterSummon(e.target.value)} placeholder="搜索通灵兽..." className="pl-9" />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredCounterSummons.map(s => (
                      <Badge
                        key={s.id}
                        variant={form.counterSummonIds.includes(s.id) ? 'default' : 'outline'}
                        className="cursor-pointer h-auto py-1 px-2 gap-1.5"
                        onClick={() => setForm(prev => ({
                          ...prev,
                          counterSummonIds: prev.counterSummonIds.includes(s.id)
                            ? prev.counterSummonIds.filter(i => i !== s.id)
                            : [...prev.counterSummonIds, s.id]
                        }))}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{s.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveCounter}>
                  <Save className="size-4 mr-1" /> 保存克制关系
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}