import { useState, useMemo, useRef } from 'react'
import { Plus, Pencil, Trash2, ScrollText, ArrowUpDown, Search, X } from 'lucide-react'
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
const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

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

export default function ScrollManageTab() {
  const { scrolls, ninjas, addScroll, updateScroll, deleteScroll } = useData()

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

  const [activeTab, setActiveTab] = useState('basic')

  // 忍者搜索（用于变体选择）
  const [ninjaSearch, setNinjaSearch] = useState('')

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

      <Card>
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
                        <div className="w-10 h-10 rounded-md overflow-hidden border shrink-0">
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