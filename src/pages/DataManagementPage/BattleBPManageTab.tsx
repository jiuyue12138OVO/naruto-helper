import { useState, useMemo, useEffect, useCallback } from 'react'
import { Save, Search, Check, Trash2, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react'
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
  }>({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [] })

  const [searchCounterNinja, setSearchCounterNinja] = useState('')
  const [searchCounterScroll, setSearchCounterScroll] = useState('')
  const [searchCounterSummon, setSearchCounterSummon] = useState('')

  // 克制关系配置中忍者搜索关键词
  const [searchConfigNinja, setSearchConfigNinja] = useState('')

  const [currentTab, setCurrentTab] = useState('blind-pick')

  // ----- 克制关系相关 -----
  const currentCounter = useMemo(() => {
    return counters.find(c => c.ninjaId === selectedNinjaId)
  }, [counters, selectedNinjaId])

  useEffect(() => {
    if (currentCounter) {
      setForm({
        counterNinjaIds: currentCounter.counterNinjaIds || [],
        counterScrollIds: currentCounter.counterScrollIds || [],
        counterSummonIds: currentCounter.counterSummonIds || [],
      })
      setSelectedCounterId(currentCounter.id)
    } else {
      setForm({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [] })
      setSelectedCounterId('')
    }
    setSearchCounterNinja('')
    setSearchCounterScroll('')
    setSearchCounterSummon('')
  }, [currentCounter, selectedNinjaId])

  const moveFormItem = (type: 'ninja' | 'scroll' | 'summon', index: number, direction: 'up' | 'down') => {
    setForm(prev => {
      const key = type === 'ninja' ? 'counterNinjaIds' : type === 'scroll' ? 'counterScrollIds' : 'counterSummonIds'
      const arr = [...prev[key]]
      if (direction === 'up' && index > 0) {
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      } else if (direction === 'down' && index < arr.length - 1) {
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      }
      return { ...prev, [key]: arr }
    })
  }

  // ----- 盲选位一体化逻辑 -----
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

  const handleDragStart = (e: React.DragEvent, ninjaId: string) => {
    e.dataTransfer.setData('text/plain', ninjaId)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDrop = (e: React.DragEvent, targetId: string, tier: string) => {
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

  // ----- 克制关系配置相关 -----
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

  // 图片墙使用的忍者列表（按梯度分组）
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
    const data: IBPCounter = {
      id: selectedCounterId || Date.now().toString(),
      ninjaId: selectedNinjaId,
      counterNinjaIds: form.counterNinjaIds,
      counterScrollIds: form.counterScrollIds,
      counterSummonIds: form.counterSummonIds,
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
      setForm({ counterNinjaIds: [], counterScrollIds: [], counterSummonIds: [] })
      setSelectedNinjaId('')
      toast.success('克制关系已删除')
    }
  }

  const toggleItem = (type: 'ninja' | 'scroll' | 'summon', id: string) => {
    setForm(prev => {
      const key = type === 'ninja' ? 'counterNinjaIds' : type === 'scroll' ? 'counterScrollIds' : 'counterSummonIds'
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id] }
    })
  }

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="blind-pick">盲选位设置</TabsTrigger>
        <TabsTrigger value="counter-config">克制关系配置</TabsTrigger>
      </TabsList>

      {/* ========== 盲选位设置（一体化） ========== */}
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
                            onDragStart={ninja.blindPick ? (e) => handleDragStart(e, ninja.id) : undefined}
                            onDragOver={ninja.blindPick ? handleDragOver : undefined}
                            onDrop={ninja.blindPick ? (e) => handleDrop(e, ninja.id, group.tier) : undefined}
                            className={`relative cursor-pointer group ${ninja.blindPick ? 'cursor-grab active:cursor-grabbing' : ''}`}
                          >
                            <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1 relative">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                              {/* 盲选位勾选框 + 标识，移至图片内部右下角 */}
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

      {/* ========== 克制关系配置（图片墙选择 + 编辑） ========== */}
      <TabsContent value="counter-config" className="mt-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            {!selectedNinjaId ? (
              <>
                {/* 搜索框 */}
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchConfigNinja}
                    onChange={(e) => setSearchConfigNinja(e.target.value)}
                    placeholder="搜索忍者..."
                    className="pl-9"
                  />
                </div>

                {/* 图片墙 */}
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
                {/* 已选忍者编辑界面 */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-2">
                    <Image src={selectedNinja?.imageUrl} alt={selectedNinja?.name} className="w-5 h-5 rounded object-cover" />
                    <span>{selectedNinja?.name}</span>
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedNinjaId('')}>← 返回选择</Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteCounter}>删除配置</Button>
                </div>

                {/* 克制忍者选择 */}
                <div>
                  <Label>克制该忍者的忍者（可多选）</Label>
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
                        onClick={() => toggleItem('ninja', n.id)}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{n.name}</span>
                      </Badge>
                    ))}
                  </div>
                  {form.counterNinjaIds.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <Label className="text-xs">已选克制忍者顺序（上下移动）</Label>
                      {form.counterNinjaIds.map((id, idx) => {
                        const nin = ninjas.find(n => n.id === id)
                        if (!nin) return null
                        return (
                          <div key={id} className="flex items-center gap-2 bg-muted/40 rounded px-2 py-1">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                                <Image src={nin.imageUrl} alt={nin.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm truncate">{nin.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === 0} onClick={() => moveFormItem('ninja', idx, 'up')}><ArrowUp className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === form.counterNinjaIds.length - 1} onClick={() => moveFormItem('ninja', idx, 'down')}><ArrowDown className="size-4" /></Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 克制密卷 */}
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
                        onClick={() => toggleItem('scroll', s.id)}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{s.name}</span>
                      </Badge>
                    ))}
                  </div>
                  {form.counterScrollIds.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-xs">已选克制密卷</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.counterScrollIds.map(id => {
                          const scr = scrolls.find(s => s.id === id)
                          if (!scr) return null
                          return (
                            <Badge key={id} variant="secondary" className="h-auto py-1 px-2 gap-1.5">
                              <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                                <Image src={scr.imageUrl} alt={scr.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs">{scr.name}</span>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 克制通灵 */}
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
                        onClick={() => toggleItem('summon', s.id)}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs">{s.name}</span>
                      </Badge>
                    ))}
                  </div>
                  {form.counterSummonIds.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-xs">已选克制通灵</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.counterSummonIds.map(id => {
                          const sum = summons.find(s => s.id === id)
                          if (!sum) return null
                          return (
                            <Badge key={id} variant="secondary" className="h-auto py-1 px-2 gap-1.5">
                              <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                                <Image src={sum.imageUrl} alt={sum.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs">{sum.name}</span>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
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