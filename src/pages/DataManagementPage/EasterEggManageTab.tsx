import { useState, useMemo, useId } from 'react'
import { Trash2, Search, X, Save, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Image } from '@/components/ui/image'
import { toast } from 'sonner'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'
import type { EasterEggType } from '@/data/easterEggs'
import { getEggExtras } from '@/data/easterEggs'
import { cn } from '@/lib/utils'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

const TYPE_OPTIONS: { value: EasterEggType; label: string }[] = [
  { value: 'self', label: '自带彩蛋' },
  { value: 'scene', label: '场景互动彩蛋' },
  { value: 'character', label: '特定角色彩蛋' },
  { value: 'other', label: '其他' },
]

/**
 * 忍者选择网格（纯头像，无名称，紧凑排列）
 * - 默认按梯度分组，组内按游戏内编号升序
 * - 右上角"取消梯度排行"开关，打开后整体按游戏内编号平铺（不显示梯度标题）
 * - 选中项以主色边框高亮
 */
function NinjaSelectGrid({
  ninjas,
  selectedIds,
  onToggle,
  placeholder,
}: {
  ninjas: INinja[]
  selectedIds: string[]
  onToggle: (id: string) => void
  placeholder?: string
}) {
  const switchId = useId()
  const [kw, setKw] = useState('')
  const [flatMode, setFlatMode] = useState(false)

  const groups = useMemo(() => {
    const t = kw.trim().toLowerCase()
    const filtered = t ? ninjas.filter(n => n.name.toLowerCase().includes(t)) : ninjas
    const sortByGameOrder = (arr: INinja[]) =>
      [...arr].sort((a, b) => (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER))
    if (flatMode) {
      return [{ tier: null as string | null, ninjas: sortByGameOrder(filtered) }]
    }
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: sortByGameOrder(filtered.filter(n => n.tier === tier)),
    })).filter(g => g.ninjas.length > 0)
  }, [ninjas, kw, flatMode])

  return (
    <div className="space-y-2">
      {/* 搜索框 + 取消梯度排行开关（右上角） */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={kw} onChange={e => setKw(e.target.value)} placeholder={placeholder || '搜索忍者...'} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex items-center gap-1.5">
          <Label htmlFor={switchId} className="text-xs cursor-pointer select-none whitespace-nowrap">
            取消梯度排行
          </Label>
          <Switch id={switchId} checked={flatMode} onCheckedChange={setFlatMode} />
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">未找到忍者</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
          {groups.map(group => (
            <div key={group.tier ?? '__flat__'}>
              {/* 平铺模式（取消梯度排行）不显示梯度标题 */}
              {group.tier && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold px-2 py-0.5">{group.tier}</Badge>
                  <span className="text-xs text-muted-foreground">{group.ninjas.length} 位忍者</span>
                </div>
              )}
              {/* 头像紧凑排列 */}
              <div className="flex flex-wrap gap-1.5">
                {group.ninjas.map(ninja => {
                  const selected = selectedIds.includes(ninja.id)
                  return (
                    <div
                      key={ninja.id}
                      title={ninja.name}
                      onClick={() => onToggle(ninja.id)}
                      className={cn(
                        'w-12 h-12 shrink-0 overflow-hidden rounded-md border-2 bg-card/50 hover:bg-card/80 transition-colors flex items-center justify-center p-0.5 cursor-pointer',
                        selected ? 'border-primary ring-2 ring-primary/30' : 'border-border/40',
                      )}
                    >
                      <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** 单条其他信息的编辑表单 */
interface EggExtraForm {
  type: EasterEggType
  title: string
  description: string
}

interface EggForm {
  defeatBy: string[]
  defeatTarget: string[]
  showExtra: boolean
  extras: EggExtraForm[]
}

const EMPTY_FORM: EggForm = { defeatBy: [], defeatTarget: [], showExtra: false, extras: [] }

export default function EasterEggManageTab() {
  const { ninjas, easterEggs, upsertEasterEgg, deleteEasterEgg } = useData()
  const [searchNinja, setSearchNinja] = useState('')
  // 主列表：取消梯度排行开关（默认关闭=梯度视图；打开=整体按游戏内编号平铺）
  const [flatMode, setFlatMode] = useState(false)
  // 当前编辑的忍者（点击忍者图像进入编辑）
  const [editingNinjaId, setEditingNinjaId] = useState<string | null>(null)
  const [form, setForm] = useState<EggForm>(EMPTY_FORM)
  // 编辑区两组选择器折叠状态（默认收起）
  const [defeatByOpen, setDefeatByOpen] = useState(false)
  const [defeatTargetOpen, setDefeatTargetOpen] = useState(false)

  const editingNinja = editingNinjaId ? ninjas.find(n => n.id === editingNinjaId) : null
  const editingEgg = editingNinjaId ? easterEggs.find(e => e.ninjaId === editingNinjaId) : undefined

  // 主列表忍者：默认梯度分组（组内按游戏内编号升序）；开启取消梯度排行后整体平铺
  const groupedNinjas = useMemo(() => {
    let list = ninjas
    if (searchNinja.trim()) {
      list = ninjas.filter(n => n.name.toLowerCase().includes(searchNinja.toLowerCase()))
    }
    const sortByGameOrder = (arr: INinja[]) =>
      [...arr].sort((a, b) => (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER))
    if (flatMode) {
      return [{ tier: null as string | null, ninjas: sortByGameOrder(list) }]
    }
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: sortByGameOrder(list.filter(n => n.tier === tier)),
    })).filter(g => g.ninjas.length > 0)
  }, [ninjas, searchNinja, flatMode])

  // 点击忍者图像 → 加载已有彩蛋信息进入编辑
  // 互通：其他忍者记录中指向该忍者的关系（A.defeatTarget∋B ⟺ B.defeatBy∋A）也会自动体现
  const openEdit = (ninjaId: string) => {
    setEditingNinjaId(ninjaId)
    const stored = easterEggs.find(e => e.ninjaId === ninjaId)
    // 被击败 = 存储值 ∪ 其他忍者 defeatTargetNinjaIds 包含当前忍者的那些忍者
    const defeatBy = new Set(stored?.defeatByNinjaIds ?? [])
    // 击败 = 存储值 ∪ 其他忍者 defeatByNinjaIds 包含当前忍者的那些忍者
    const defeatTarget = new Set(stored?.defeatTargetNinjaIds ?? [])
    easterEggs.forEach(e => {
      if (e.ninjaId === ninjaId) return
      if (e.defeatTargetNinjaIds.includes(ninjaId)) defeatBy.add(e.ninjaId)
      if (e.defeatByNinjaIds.includes(ninjaId)) defeatTarget.add(e.ninjaId)
    })
    const storedExtras = stored ? getEggExtras(stored) : []
    setForm(stored || defeatBy.size > 0 || defeatTarget.size > 0 || storedExtras.length > 0
      ? {
          defeatBy: [...defeatBy],
          defeatTarget: [...defeatTarget],
          showExtra: storedExtras.length > 0,
          extras: storedExtras.map(x => ({ type: x.type || 'self', title: x.title || '', description: x.description || '' })),
        }
      : EMPTY_FORM)
    setDefeatByOpen(false)
    setDefeatTargetOpen(false)
  }

  // 更新某条其他信息
  const updateExtra = (idx: number, patch: Partial<EggExtraForm>) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.map((x, i) => (i === idx ? { ...x, ...patch } : x)),
    }))
  }

  // 删除某条其他信息
  const removeExtra = (idx: number) => {
    setForm(prev => ({ ...prev, extras: prev.extras.filter((_, i) => i !== idx) }))
  }

  // 新增一条其他信息
  const addExtra = () => {
    setForm(prev => ({ ...prev, extras: [...prev.extras, { type: 'self', title: '', description: '' }] }))
  }

  const handleSave = () => {
    if (!editingNinjaId) return
    // 过滤完全空白（无标题且无描述）的条目；有内容的条目写入 extras
    const extras = form.extras
      .filter(x => x.title.trim() || x.description.trim())
      .map(x => ({
        type: x.type,
        title: x.title.trim() || undefined,
        description: x.description.trim() || undefined,
      }))
    upsertEasterEgg({
      ninjaId: editingNinjaId,
      defeatByNinjaIds: form.defeatBy,
      defeatTargetNinjaIds: form.defeatTarget,
      extras,
    })
    toast.success('彩蛋信息已保存')
  }

  const handleDelete = () => {
    if (!editingNinjaId) return
    deleteEasterEgg(editingNinjaId)
    toast.success('彩蛋记录已删除')
    setEditingNinjaId(null)
    setForm(EMPTY_FORM)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {!editingNinjaId ? (
          <>
            {/* 顶部提示 */}
            <p className="text-sm text-muted-foreground">
              已录入彩蛋：<span className="font-semibold text-foreground">{easterEggs.length}</span> 位忍者
              <span className="ml-2">点击忍者图像开始录入 / 编辑彩蛋信息</span>
            </p>

            {/* 搜索框 + 取消梯度排行开关（右上角） */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchNinja}
                  onChange={(e) => setSearchNinja(e.target.value)}
                  placeholder="搜索忍者..."
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="egg-flat-toggle" className="text-sm cursor-pointer select-none">
                  取消梯度排行
                </Label>
                <Switch
                  id="egg-flat-toggle"
                  checked={flatMode}
                  onCheckedChange={setFlatMode}
                />
              </div>
            </div>

            {groupedNinjas.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-12">未找到忍者</div>
            ) : (
              <div className="space-y-10">
                {groupedNinjas.map(group => (
                  <div key={group.tier ?? '__flat__'}>
                    {/* 平铺模式（取消梯度排行）不显示梯度标题 */}
                    {group.tier && (
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-sm font-bold px-3 py-1">{group.tier}</Badge>
                        <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                      </div>
                    )}
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                      {group.ninjas.map(ninja => {
                        const hasEgg = easterEggs.some(e => e.ninjaId === ninja.id)
                        return (
                          <div
                            key={ninja.id}
                            className="cursor-pointer"
                            onClick={() => openEdit(ninja.id)}
                          >
                            <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1 relative">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                              {hasEgg && (
                                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-medium rounded px-1 py-0.5">
                                  已录入
                                </span>
                              )}
                            </Card>
                            <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* 编辑区头部：当前忍者（大图）+ 返回 + 删除 */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="px-2.5 py-1.5 flex items-center gap-2.5">
                <Image
                  src={editingNinja?.imageUrl}
                  alt={editingNinja?.name}
                  className="w-12 h-12 rounded-md object-contain bg-card"
                />
                <span className="text-sm font-medium">{editingNinja?.name}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => { setEditingNinjaId(null); setForm(EMPTY_FORM) }}>
                ← 返回选择
              </Button>
              {editingEgg && (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="size-4 mr-1" /> 删除彩蛋
                </Button>
              )}
            </div>

            {/* 被击败：击败该忍者会有彩蛋的忍者（默认折叠） */}
            <div>
              <button
                type="button"
                onClick={() => setDefeatByOpen(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium cursor-pointer select-none"
              >
                <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !defeatByOpen && '-rotate-90')} />
                被击败
                <span className="text-xs text-muted-foreground font-normal">
                  击败该忍者触发彩蛋 · 已选 {form.defeatBy.length} 位
                </span>
              </button>
              {defeatByOpen && (
                <div className="mt-2">
                  <NinjaSelectGrid
                    ninjas={ninjas}
                    selectedIds={form.defeatBy}
                    onToggle={(id) => setForm(prev => ({
                      ...prev,
                      defeatBy: prev.defeatBy.includes(id) ? prev.defeatBy.filter(x => x !== id) : [...prev.defeatBy, id],
                    }))}
                    placeholder="搜索并点击选择..."
                  />
                </div>
              )}
            </div>

            {/* 击败：该忍者击败后会出现彩蛋的忍者（默认折叠） */}
            <div>
              <button
                type="button"
                onClick={() => setDefeatTargetOpen(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium cursor-pointer select-none"
              >
                <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !defeatTargetOpen && '-rotate-90')} />
                击败
                <span className="text-xs text-muted-foreground font-normal">
                  该忍者击败目标触发彩蛋 · 已选 {form.defeatTarget.length} 位
                </span>
              </button>
              {defeatTargetOpen && (
                <div className="mt-2">
                  <NinjaSelectGrid
                    ninjas={ninjas}
                    selectedIds={form.defeatTarget}
                    onToggle={(id) => setForm(prev => ({
                      ...prev,
                      defeatTarget: prev.defeatTarget.includes(id) ? prev.defeatTarget.filter(x => x !== id) : [...prev.defeatTarget, id],
                    }))}
                    placeholder="搜索并点击选择..."
                  />
                </div>
              )}
            </div>

            {/* 其他信息开关 */}
            <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">录入其他信息</p>
                <p className="text-xs text-muted-foreground">自带彩蛋、场景互动彩蛋、特定角色彩蛋等，可录入多条</p>
              </div>
              <Switch checked={form.showExtra} onCheckedChange={(v) => setForm(prev => ({ ...prev, showExtra: v }))} />
            </div>

            {form.showExtra && (
              <div className="space-y-3">
                {form.extras.map((item, idx) => (
                  <div key={idx} className="border border-border/40 rounded-lg p-3 space-y-3 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeExtra(idx)}
                      title="删除该条彩蛋"
                    >
                      <X className="size-3.5" />
                    </Button>
                    <div>
                      <Label className="mb-1.5 block">彩蛋类型</Label>
                      <Select value={item.type} onValueChange={(v) => updateExtra(idx, { type: v as EasterEggType })}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TYPE_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1.5 block">彩蛋标题</Label>
                      <Input value={item.title} onChange={e => updateExtra(idx, { title: e.target.value })} placeholder="例如：千年之争" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">彩蛋描述</Label>
                      <Textarea value={item.description} onChange={e => updateExtra(idx, { description: e.target.value })} placeholder="彩蛋内容描述..." rows={3} />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addExtra} className="gap-1">
                  <Plus className="size-3.5" /> 添加一条彩蛋
                </Button>
              </div>
            )}

            <Button onClick={handleSave}>
              <Save className="size-4 mr-1" /> 保存彩蛋
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
