import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Plus, Pencil, Trash2, ScrollText, ArrowUpDown, Search, X, LayoutGrid, Table2, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/ImageUpload'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { IScroll, IScrollVariant } from '@/data/scrolls'
import type { INinja } from '@/data/ninjas'

const DEFAULT_IMG = ''
const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

const byGameOrder = (a: IScroll, b: IScroll) =>
  (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER)

interface FormData {
  name: string
  description: string
  cooldown: string
  imageUrl: string
  variants: IScrollVariant[]
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  cooldown: '',
  imageUrl: '',
  variants: [],
}

type SortField = 'name' | 'description' | 'cooldown'
type SortOrder = 'asc' | 'desc'
type ScrollListTab = 'grid' | 'table' | 'order'

export default function ScrollManageTab() {
  const { scrolls, ninjas, addScroll, updateScroll, updateScrollsBatch, deleteScroll } = useData()

  const [listTab, setListTab] = useState<ScrollListTab>('grid')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // 变体编辑子对话框
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)
  const [variantForm, setVariantForm] = useState<IScrollVariant & { ninjaSearch?: string }>({
    id: '',
    ninjaIds: [],
    name: '',
    description: '',
    cooldown: '',
    imageUrl: '',
  })
  const [variantErrors, setVariantErrors] = useState<Partial<Record<string, string>>>({})

  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [gridSearchKeyword, setGridSearchKeyword] = useState('')

  const [activeTab, setActiveTab] = useState('basic')

  // 忍者搜索（用于变体选择）
  const [ninjaSearch, setNinjaSearch] = useState('')

  // ---------- 编序分页状态 ----------
  const [orderIds, setOrderIds] = useState<string[]>([])
  const dragIndexRef = useRef<number | null>(null)

  // 安全地将变体数据中的 ninjaIds 转换为数组（兼容旧字段 ninjaId）
  const ensureNinjaIdsArray = (variant: any): string[] => {
    if (Array.isArray(variant.ninjaIds) && variant.ninjaIds.length > 0) {
      return variant.ninjaIds
    }
    // 兼容旧的 ninjaId 字段（可能是字符串）
    if (variant.ninjaId && typeof variant.ninjaId === 'string') {
      return [variant.ninjaId]
    }
    // 如果没有任何数据，返回空数组
    return []
  }

  const normalizeVariants = (variants?: IScrollVariant[]): IScrollVariant[] => {
    if (!variants) return []
    return variants.map(v => ({
      ...v,
      ninjaIds: ensureNinjaIdsArray(v),
    }))
  }

  // 按游戏内编号排序后的完整列表
  const sortedScrolls = useMemo(() => [...scrolls].sort(byGameOrder), [scrolls])

  // 编序视图初始化：每次数据变化都按当前编号重排
  useEffect(() => {
    setOrderIds([...scrolls].sort(byGameOrder).map(s => s.id))
  }, [scrolls])

  const saveGameOrder = useCallback((ids: string[]) => {
    const updates: Record<string, Partial<IScroll>> = {}
    ids.forEach((id, index) => {
      updates[id] = { gameOrder: index + 1 }
    })
    updateScrollsBatch(updates)
  }, [updateScrollsBatch])

  const handleOrderDragStart = (index: number) => {
    dragIndexRef.current = index
  }

  const handleOrderDrop = (targetIndex: number) => {
    const from = dragIndexRef.current
    if (from === null || from === targetIndex) return
    const next = [...orderIds]
    const [moved] = next.splice(from, 1)
    next.splice(targetIndex, 0, moved)
    setOrderIds(next)
    saveGameOrder(next)
    dragIndexRef.current = null
  }

  const handleSaveOrder = () => {
    saveGameOrder(orderIds)
  }

  const filteredAndSorted = useMemo(() => {
    let list = [...scrolls]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw))
    }
    list.sort((a, b) => {
      const valA = a[sortField] || ''
      const valB = b[sortField] || ''
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [scrolls, searchKeyword, sortField, sortOrder])

  // 图示视图：搜索 + 按编号排序
  const gridList = useMemo(() => {
    const kw = gridSearchKeyword.trim().toLowerCase()
    if (!kw) return sortedScrolls
    return sortedScrolls.filter(s => s.name.toLowerCase().includes(kw))
  }, [sortedScrolls, gridSearchKeyword])

  const groupedNinjasForVariant = useMemo(() => {
    let list = ninjas
    if (ninjaSearch.trim()) {
      const kw = ninjaSearch.toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(kw))
    }
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const tierNinjas = list.filter(n => n.tier === tier)
      if (tierNinjas.length > 0) groups.push({ tier, ninjas: tierNinjas })
    })
    return groups
  }, [ninjas, ninjaSearch])

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
    setActiveTab('basic')
  }

  function openEdit(scroll: IScroll) {
    setEditingId(scroll.id)
    const normalizedVariants = normalizeVariants(scroll.variants)
    setForm({
      name: scroll.name,
      description: scroll.description,
      cooldown: scroll.cooldown,
      imageUrl: scroll.imageUrl || '',
      variants: normalizedVariants,
    })
    setErrors({})
    setDialogOpen(true)
    setActiveTab('basic')
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = '名称不能为空'
    if (!form.description.trim()) e.description = '效果描述不能为空'
    if (!form.cooldown.trim()) e.cooldown = '冷却时间不能为空'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    // 保存前再次确保所有变体的 ninjaIds 为数组
    const cleanVariants = form.variants.map(v => ({
      ...v,
      ninjaIds: ensureNinjaIdsArray(v),
    }))
    const data: IScroll = {
      id: editingId || Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      cooldown: form.cooldown.trim(),
      imageUrl: form.imageUrl.trim() || DEFAULT_IMG,
      variants: cleanVariants.length > 0 ? cleanVariants : undefined,
    }
    if (editingId) {
      updateScroll(editingId, data)
    } else {
      addScroll(data)
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteScroll(deleteId)
      setDeleteId(null)
    }
  }

  // ---------- 变体管理 ----------
  function openAddVariant() {
    setEditingVariantId(null)
    setVariantForm({
      id: Date.now().toString(),
      ninjaIds: [],
      name: form.name,
      description: form.description,
      cooldown: form.cooldown,
      imageUrl: form.imageUrl,
    })
    setVariantErrors({})
    setVariantDialogOpen(true)
  }

  function openEditVariant(variant: IScrollVariant) {
    setEditingVariantId(variant.id)
    // 安全获取 ninjaIds
    const ninjaIds = ensureNinjaIdsArray(variant)
    setVariantForm({ ...variant, ninjaIds })
    setVariantErrors({})
    setVariantDialogOpen(true)
  }

  function validateVariant(): boolean {
    const errs: Partial<Record<string, string>> = {}
    if (!variantForm.ninjaIds || variantForm.ninjaIds.length === 0) {
      errs.ninjaIds = '必须选择至少一名忍者'
    }
    if (!variantForm.name.trim()) errs.name = '名称不能为空'
    if (!variantForm.description.trim()) errs.description = '效果描述不能为空'
    if (!variantForm.cooldown.trim()) errs.cooldown = '冷却时间不能为空'
    setVariantErrors(errs)
    return Object.keys(errs).length === 0
  }

  function toggleNinjaInVariant(ninjaId: string) {
    setVariantForm(prev => {
      const currentIds = prev.ninjaIds || []
      if (currentIds.includes(ninjaId)) {
        return { ...prev, ninjaIds: currentIds.filter(id => id !== ninjaId) }
      } else {
        return { ...prev, ninjaIds: [...currentIds, ninjaId] }
      }
    })
  }

  function handleSaveVariant() {
    if (!validateVariant()) return

    const newVariant: IScrollVariant = {
      id: editingVariantId || Date.now().toString(),
      ninjaIds: variantForm.ninjaIds,
      name: variantForm.name.trim(),
      description: variantForm.description.trim(),
      cooldown: variantForm.cooldown.trim(),
      imageUrl: variantForm.imageUrl.trim(),
    }

    setForm(prev => {
      const updatedVariants = editingVariantId
        ? prev.variants.map(v => v.id === editingVariantId ? newVariant : v)
        : [...prev.variants, newVariant]
      return { ...prev, variants: updatedVariants }
    })

    setVariantDialogOpen(false)
  }

  function handleDeleteVariant(id: string) {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">共 {scrolls.length} 个密卷</p>
        <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="size-4" />新增密卷</Button>
      </div>

      <Tabs value={listTab} onValueChange={v => setListTab(v as ScrollListTab)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="grid" className="gap-1.5">
            <LayoutGrid className="size-4" />
            图示
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-1.5">
            <Table2 className="size-4" />
            表格
          </TabsTrigger>
          <TabsTrigger value="order" className="gap-1.5">
            <Gamepad2 className="size-4" />
            编序
          </TabsTrigger>
        </TabsList>

        {/* 图示视图 */}
        <TabsContent value="grid" className="mt-6">
          <div className="relative max-w-sm mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={gridSearchKeyword}
              onChange={e => setGridSearchKeyword(e.target.value)}
              placeholder="搜索密卷名称..."
              className="pl-9 pr-9"
            />
            {gridSearchKeyword && (
              <Button size="icon" variant="ghost" className="absolute! right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setGridSearchKeyword('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {gridList.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-16 border-2 border-dashed border-border/40 rounded-lg">
              没有找到匹配的密卷
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
              {gridList.map(scroll => (
                <div key={scroll.id} className="cursor-pointer" onClick={() => openEdit(scroll)}>
                  <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-0.5 relative rounded-full">
                    {scroll.imageUrl ? (
                      <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">无图</div>
                    )}
                  </Card>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <p className="text-xs text-muted-foreground truncate">{scroll.name}</p>
                    {scroll.variants && scroll.variants.length > 0 && (
                      <span className="text-[10px] text-primary font-medium shrink-0">专属</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 表格视图 */}
        <TabsContent value="table" className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-50 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="搜索名称或描述..." className="pl-9 pr-9" />
              {searchKeyword && <Button size="icon" variant="ghost" className="absolute! right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchKeyword('')}><X className="h-4 w-4" /></Button>}
            </div>

            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger className="w-32.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">名称</SelectItem>
                <SelectItem value="description">效果描述</SelectItem>
                <SelectItem value="cooldown">冷却时间</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} title={sortOrder === 'asc' ? '升序' : '降序'}><ArrowUpDown className="size-4" /></Button>
          </div>

          <Card className="mt-4">
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">名称</TableHead>
                      <TableHead className="whitespace-nowrap">效果描述</TableHead>
                      <TableHead className="whitespace-nowrap w-22.5">冷却时间</TableHead>
                      <TableHead className="whitespace-nowrap text-right w-30">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSorted.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                          <ScrollText className="size-8 mx-auto mb-2 opacity-30" />
                          暂无匹配的密卷
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSorted.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium"><span className="block truncate max-w-45">{s.name}</span></TableCell>
                          <TableCell><span className="block truncate max-w-45 text-muted-foreground text-sm">{s.description}</span></TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{s.cooldown}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="size-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="size-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 编序视图 */}
        <TabsContent value="order" className="mt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              拖动密卷图片调整顺序，编号从 1 开始连续递增。拖动后自动保存。
            </p>
            <Button size="sm" variant="outline" onClick={handleSaveOrder}>
              重新编号
            </Button>
          </div>

          {orderIds.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-16 border-2 border-dashed border-border/40 rounded-lg">
              暂无密卷数据
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2 md:gap-3">
              {orderIds.map((id, index) => {
                const scroll = scrolls.find(s => s.id === id)
                if (!scroll) return null
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={() => handleOrderDragStart(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleOrderDrop(index)}
                    className="cursor-grab active:cursor-grabbing group relative"
                  >
                    <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-0.5 relative rounded-full">
                      {scroll.imageUrl ? (
                        <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">无图</div>
                      )}
                      <span className="absolute top-0 left-0 size-4 rounded-full bg-background/80 backdrop-blur-sm text-[9px] font-mono flex items-center justify-center leading-none text-muted-foreground border border-border/40">
                        {index + 1}
                      </span>
                    </Card>
                    <p className="text-[10px] text-muted-foreground truncate text-center mt-0.5 leading-tight">{scroll.name}</p>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 父对话框：编辑密卷 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
        <DialogContent
          className="sm:max-w-2xl max-h-[90vh] flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑密卷' : '新增密卷'}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">基础信息</TabsTrigger>
              <TabsTrigger value="variants">专属密卷</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
              <div className="space-y-2"><Label>名称 *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</div>
              <div className="space-y-2"><Label>效果描述 *</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />{errors.description && <p className="text-xs text-destructive">{errors.description}</p>}</div>
              <div className="space-y-2"><Label>冷却时间 *</Label><Input value={form.cooldown} onChange={e => setForm({...form, cooldown: e.target.value})} />{errors.cooldown && <p className="text-xs text-destructive">{errors.cooldown}</p>}</div>
              <div className="space-y-2"><Label>密卷图片</Label><ImageUpload value={form.imageUrl} onChange={b64 => setForm({...form, imageUrl: b64})} /></div>
            </TabsContent>

            <TabsContent value="variants" className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">共 {form.variants.length} 个专属变体</p>
                <Button size="sm" onClick={openAddVariant}><Plus className="size-4" />添加变体</Button>
              </div>
              {form.variants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">暂无专属密卷变体，点击添加</p>
              ) : (
                <div className="space-y-2">
                  {form.variants.map(variant => {
                    const ninjaIds = ensureNinjaIdsArray(variant)
                    const ninjaCount = ninjaIds.length
                    return (
                      <div key={variant.id} className="flex items-center gap-3 bg-muted/40 rounded-lg p-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0">
                          <Image src={variant.imageUrl || form.imageUrl} alt={variant.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{variant.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{variant.description}</p>
                          {ninjaCount > 0 && <p className="text-xs text-muted-foreground mt-0.5">{ninjaCount} 位对应忍者</p>}
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditVariant(variant)}><Pencil className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteVariant(variant.id)}><Trash2 className="size-4" /></Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 子对话框：编辑专属变体 */}
      <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingVariantId ? '编辑专属变体' : '新增专属变体'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 flex-1 -mx-6 px-6">
            <div className="space-y-2">
              <Label>对应忍者 *（可多选）</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={ninjaSearch}
                  onChange={(e) => setNinjaSearch(e.target.value)}
                  placeholder="搜索忍者..."
                  className="pl-9 pr-9"
                />
                {ninjaSearch && <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setNinjaSearch('')}><X className="h-4 w-4" /></Button>}
              </div>
              {variantForm.ninjaIds && variantForm.ninjaIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {variantForm.ninjaIds.map(id => {
                    const ninja = ninjas.find(n => n.id === id)
                    return ninja ? (
                      <Badge key={id} variant="secondary" className="gap-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleNinjaInVariant(id) }}>
                        <Image src={ninja.imageUrl} className="w-4 h-4 rounded" />{ninja.name} <X className="h-3 w-3" />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
              <div className="space-y-4 mt-3 max-h-80 overflow-y-auto">
                {groupedNinjasForVariant.map(group => (
                  <div key={group.tier}>
                    <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                      {group.ninjas.map(ninja => {
                        const isSelected = variantForm.ninjaIds ? variantForm.ninjaIds.includes(ninja.id) : false
                        return (
                          <div
                            key={ninja.id}
                            className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg border-2 transition-all ${
                              isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border hover:bg-muted/50'
                            }`}
                            onClick={(e) => { e.stopPropagation(); toggleNinjaInVariant(ninja.id) }}
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden border">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-center leading-tight">{ninja.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {groupedNinjasForVariant.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">无匹配忍者</p>
                )}
              </div>
              {variantErrors.ninjaIds && <p className="text-xs text-destructive mt-1">{variantErrors.ninjaIds}</p>}
            </div>

            <div className="space-y-2">
              <Label>变体名称 *</Label>
              <Input value={variantForm.name} onChange={e => setVariantForm(prev => ({ ...prev, name: e.target.value }))} />
              {variantErrors.name && <p className="text-xs text-destructive">{variantErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>效果描述 *</Label>
              <Textarea value={variantForm.description} onChange={e => setVariantForm(prev => ({ ...prev, description: e.target.value }))} rows={2} />
              {variantErrors.description && <p className="text-xs text-destructive">{variantErrors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label>冷却时间 *</Label>
              <Input value={variantForm.cooldown} onChange={e => setVariantForm(prev => ({ ...prev, cooldown: e.target.value }))} />
              {variantErrors.cooldown && <p className="text-xs text-destructive">{variantErrors.cooldown}</p>}
            </div>
            <div className="space-y-2">
              <Label>变体图片</Label>
              <ImageUpload value={variantForm.imageUrl} onChange={b64 => setVariantForm(prev => ({ ...prev, imageUrl: b64 }))} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setVariantDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveVariant}>{editingVariantId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>删除后将无法恢复，确定要删除该密卷数据吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
