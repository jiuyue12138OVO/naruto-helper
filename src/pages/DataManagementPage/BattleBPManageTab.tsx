import { useState, useMemo, useEffect } from 'react'
import { Save, Search, Check, Trash2, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useData } from '@/contexts/DataContext'
import { IBPCounter } from '@/data/battleBp'
import { Image } from '@/components/ui/image'

// 梯度定义
const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
const TIER_COLORS: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

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

  const [openNinjaSelect, setOpenNinjaSelect] = useState(false)
  const [searchSelectNinja, setSearchSelectNinja] = useState('')

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

  const blindPickNinjas = useMemo(() => ninjas.filter(n => n.blindPick), [ninjas])

  const orderedBlindNinjas = useMemo(() => {
    const orderedIds = blindPickOrder.filter(id => ninjas.some(n => n.id === id && n.blindPick))
    const ordered = orderedIds.map(id => ninjas.find(n => n.id === id)!)
    const remaining = blindPickNinjas.filter(n => !orderedIds.includes(n.id))
    return [...ordered, ...remaining]
  }, [blindPickNinjas, blindPickOrder, ninjas])

  const moveBlindPick = (index: number, direction: 'up' | 'down') => {
    const newOrder = orderedBlindNinjas.map(n => n.id)
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    }
    setBlindPickOrder(newOrder)
  }

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

  const filteredNinjas = useMemo(() => {
    if (!searchNinja) return ninjas
    return ninjas.filter(n => n.name.toLowerCase().includes(searchNinja.toLowerCase()))
  }, [ninjas, searchNinja])

  // 将盲选位忍者列表按梯度分组
  const groupedFilteredNinjas = useMemo(() => {
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: filteredNinjas.filter(n => n.tier === tier)
    })).filter(group => group.ninjas.length > 0)
  }, [filteredNinjas])

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

  // 忍者选择器过滤列表
  const filteredSelectNinjas = useMemo(() => {
    if (!searchSelectNinja) return ninjas
    return ninjas.filter(n => n.name.toLowerCase().includes(searchSelectNinja.toLowerCase()))
  }, [ninjas, searchSelectNinja])

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

  // 根据梯度对克制关系忍者分组（用于弹窗显示）
  const groupedSelectNinjas = useMemo(() => {
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: filteredSelectNinjas.filter(n => n.tier === tier)
    })).filter(group => group.ninjas.length > 0)
  }, [filteredSelectNinjas])

  // 渲染忍者项目（带图片）
  const renderNinjaItem = (n: (typeof ninjas)[number]) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded overflow-hidden bg-muted shrink-0">
        <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
      </div>
      <span className="truncate">{n.name}</span>
    </div>
  )

  return (
    <Accordion type="single" collapsible className="space-y-6">
      {/* 盲选位设置 */}
      <AccordionItem value="blind-pick">
        <Card>
          <CardContent className="p-4 space-y-4">
            <AccordionTrigger className="text-lg font-semibold">
              盲选位设置（可多选）
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchNinja} onChange={e => setSearchNinja(e.target.value)} placeholder="搜索忍者..." className="pl-9" />
                </div>
                {/* 按梯度分组展示忍者复选框 */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {groupedFilteredNinjas.map(group => (
                    <div key={group.tier}>
                      <div className="text-xs font-semibold text-muted-foreground mb-1 px-1">
                        {group.tier}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {group.ninjas.map(ninja => (
                          <label key={ninja.id} className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-muted/50">
                            <Checkbox
                              checked={ninja.blindPick || false}
                              onCheckedChange={(checked) => updateNinjaBlindPick(ninja.id, !!checked)}
                            />
                            {renderNinjaItem(ninja)}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredNinjas.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">未找到忍者</div>
                  )}
                </div>

                {/* 盲选位排序区域 */}
                {orderedBlindNinjas.length > 0 && (
                  <div>
                    <Label className="mb-2">盲选位排序（点击上下箭头调整顺序）</Label>
                    <div className="space-y-1">
                      {orderedBlindNinjas.map((ninja, idx) => (
                        <div key={ninja.id} className="flex items-center gap-2 bg-muted/40 rounded px-2 py-1">
                          {renderNinjaItem(ninja)}
                          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === 0} onClick={() => moveBlindPick(idx, 'up')}>
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === orderedBlindNinjas.length - 1} onClick={() => moveBlindPick(idx, 'down')}>
                            <ArrowDown className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>

      {/* 克制关系配置 */}
      <AccordionItem value="counter-config">
        <Card>
          <CardContent className="p-4 space-y-4">
            <AccordionTrigger className="text-lg font-semibold">
              克制关系配置
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>选择要配置的忍者</Label>
                    <Popover open={openNinjaSelect} onOpenChange={setOpenNinjaSelect}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                          {selectedNinja ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                                <Image src={selectedNinja.imageUrl} alt={selectedNinja.name} className="w-full h-full object-cover" />
                              </div>
                              <span>{selectedNinja.name}</span>
                            </div>
                          ) : "请选择忍者..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <div className="flex items-center border-b px-3 py-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <Input placeholder="搜索忍者..." value={searchSelectNinja} onChange={(e) => setSearchSelectNinja(e.target.value)} className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {groupedSelectNinjas.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">未找到忍者</div>
                          ) : (
                            groupedSelectNinjas.map(group => (
                              <div key={group.tier}>
                                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30">
                                  {group.tier}
                                </div>
                                {group.ninjas.map(ninja => (
                                  <div
                                    key={ninja.id}
                                    onClick={() => { setSelectedNinjaId(ninja.id); setOpenNinjaSelect(false); setSearchSelectNinja('') }}
                                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${ninja.id === selectedNinjaId ? 'bg-accent' : ''}`}
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                                        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                                      </div>
                                      <span className="truncate">{ninja.name}</span>
                                    </div>
                                    {ninja.id === selectedNinjaId && <Check className="ml-auto h-4 w-4 text-primary" />}
                                  </div>
                                ))}
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {selectedNinjaId && <Button variant="destructive" size="sm" onClick={handleDeleteCounter}>删除配置</Button>}
                </div>

                {selectedNinjaId && (
                  <>
                    {/* 克制忍者 */}
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
              </div>
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>
    </Accordion>
  )
}