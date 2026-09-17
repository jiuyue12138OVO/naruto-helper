import { useState, useMemo, useCallback } from 'react'
import { Plus, Pencil, Trash2, Swords, ArrowUpDown, Search, X, LayoutGrid, Table2, Layers, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import ImageUpload from '@/components/ImageUpload'
import { useData } from '@/contexts/DataContext'
import { INinja } from '@/data/ninjas'
import { cn } from '@/lib/utils'
import { Image } from '@/components/ui/image'

const TIER_OPTIONS = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1']
const TIER_ORDER = Object.fromEntries(TIER_OPTIONS.map((t, i) => [t, i]))
const RATING_OPTIONS = ['S', 'A', 'B', 'C']

const TIER_COLORS: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  't1': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
}

const DEFAULT_IMG = ''

interface FormData {
  name: string
  tier: INinja['tier']
  rating: INinja['rating']
  tags: string[]
  imageUrl: string
  acquisition: string
}

const EMPTY_FORM: FormData = {
  name: '',
  tier: 't0下',
  rating: 'B',
  tags: [],
  imageUrl: DEFAULT_IMG,
  acquisition: '',
}

type SortField = 'name' | 'tier' | 'rating'
type SortOrder = 'asc' | 'desc'

export default function NinjaManageTab() {
  const {
    ninjas,
    addNinja,
    updateNinja,
    deleteNinja,
    ninjaTags,
    addNinjaTag,
    removeNinjaTag,
    acquisitionOptions,
    addAcquisitionOption,
    removeAcquisitionOption,
  } = useData()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // 搜索和排序状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 新增标签与获取方式状态
  const [newTagName, setNewTagName] = useState('')
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)
  const [newAcquisition, setNewAcquisition] = useState('')
  const [acquisitionToDelete, setAcquisitionToDelete] = useState<string | null>(null)

  // 当前选中的选项卡
  const [currentTab, setCurrentTab] = useState('table')

  // 梯度视图的搜索关键词
  const [gridSearchKeyword, setGridSearchKeyword] = useState('')

  // ---------- 批量管理状态 ----------
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [batchAttr, setBatchAttr] = useState<'tags' | 'acquisition'>('tags')
  const [batchTagValue, setBatchTagValue] = useState('')
  const [batchTagAction, setBatchTagAction] = useState<'add' | 'remove'>('add')
  const [batchAcquisitionValue, setBatchAcquisitionValue] = useState('')
  const [batchAcquisitionAction, setBatchAcquisitionAction] = useState<'set' | 'clear'>('set')
  const [batchSelectedIds, setBatchSelectedIds] = useState<Set<string>>(new Set())
  const [batchSearchKeyword, setBatchSearchKeyword] = useState('')

  const handleAddTag = () => {
    const tag = newTagName.trim()
    if (tag && !ninjaTags.includes(tag)) {
      addNinjaTag(tag)
    }
    setNewTagName('')
  }

  const handleAddAcquisition = () => {
    const option = newAcquisition.trim()
    if (option && !acquisitionOptions.includes(option)) {
      addAcquisitionOption(option)
    }
    setNewAcquisition('')
  }

  // 切换趋势标记
  const handleToggleTrend = useCallback((ninjaId: string) => {
    const ninja = ninjas.find(n => n.id === ninjaId)
    if (!ninja) return
    const nextTrend = ninja.trend === 'up' ? 'down' : (ninja.trend === 'down' ? undefined : 'up')
    updateNinja(ninjaId, { trend: nextTrend })
  }, [ninjas, updateNinja])

  // 表格过滤 + 排序
  const filteredAndSorted = useMemo(() => {
    let list = [...ninjas]

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter((n) =>
        n.name.toLowerCase().includes(kw) ||
        n.tags.some(tag => tag.toLowerCase().includes(kw)) ||
        (n.acquisition || '').toLowerCase().includes(kw)
      )
    }

    list.sort((a, b) => {
      let valA: string | number = ''
      let valB: string | number = ''

      if (sortField === 'name') {
        valA = a.name
        valB = b.name
      } else if (sortField === 'tier') {
        valA = TIER_ORDER[a.tier] ?? 99
        valB = TIER_ORDER[b.tier] ?? 99
      } else if (sortField === 'rating') {
        const ratingOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 }
        valA = ratingOrder[a.rating] ?? 99
        valB = ratingOrder[b.rating] ?? 99
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [ninjas, searchKeyword, sortField, sortOrder])

  // 梯度视图：按梯度分组，可搜索
  const groupedNinjas = useMemo(() => {
    let list = ninjas
    if (gridSearchKeyword.trim()) {
      list = ninjas.filter(n => n.name.toLowerCase().includes(gridSearchKeyword.toLowerCase()))
    }
    return TIER_OPTIONS.map(tier => ({
      tier,
      ninjas: list.filter(n => n.tier === tier),
    }))
  }, [ninjas, gridSearchKeyword])

  // ---------- 批量管理：分组后的忍者列表 ----------
  const batchGroupedNinjas = useMemo(() => {
    let list = ninjas
    if (batchSearchKeyword.trim()) {
      list = ninjas.filter(n => n.name.toLowerCase().includes(batchSearchKeyword.toLowerCase()))
    }
    return TIER_OPTIONS.map(tier => ({
      tier,
      ninjas: list.filter(n => n.tier === tier),
    })).filter(g => g.ninjas.length > 0)
  }, [ninjas, batchSearchKeyword])

  const toggleBatchSelect = (id: string) => {
    setBatchSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleBatchSelectAll = (ids: string[], checked: boolean) => {
    setBatchSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) ids.forEach(id => next.add(id))
      else ids.forEach(id => next.delete(id))
      return next
    })
  }

  const handleBatchSave = () => {
    if (batchSelectedIds.size === 0) return

    batchSelectedIds.forEach(id => {
      const ninja = ninjas.find(n => n.id === id)
      if (!ninja) return

      if (batchAttr === 'tags') {
        if (!batchTagValue) return
        const has = ninja.tags?.includes(batchTagValue)
        if (batchTagAction === 'add' && !has) {
          updateNinja(id, { tags: [...(ninja.tags || []), batchTagValue] })
        } else if (batchTagAction === 'remove' && has) {
          updateNinja(id, { tags: (ninja.tags || []).filter(t => t !== batchTagValue) })
        }
      } else {
        if (batchAcquisitionAction === 'set') {
          if (!batchAcquisitionValue) return
          updateNinja(id, { acquisition: batchAcquisitionValue })
        } else {
          updateNinja(id, { acquisition: undefined })
        }
      }
    })

    setBatchDialogOpen(false)
    setBatchSelectedIds(new Set())
  }

  const openBatchDialog = () => {
    setBatchAttr('tags')
    setBatchTagValue(ninjaTags[0] || '')
    setBatchTagAction('add')
    setBatchAcquisitionValue(acquisitionOptions[0] || '')
    setBatchAcquisitionAction('set')
    setBatchSelectedIds(new Set())
    setBatchSearchKeyword('')
    setBatchDialogOpen(true)
  }

  // 拖动开始：存储忍者 ID
  const handleGridDragStart = (e: React.DragEvent, ninjaId: string) => {
    e.dataTransfer.setData('text/plain', ninjaId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleGridDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleGridDrop = (e: React.DragEvent, newTier: string) => {
    e.preventDefault()
    const ninjaId = e.dataTransfer.getData('text/plain')
    if (!ninjaId) return
    const ninja = ninjas.find(n => n.id === ninjaId)
    if (ninja && ninja.tier !== newTier) {
      updateNinja(ninjaId, { tier: newTier as INinja['tier'] })
    }
  }

  // 编辑/新增相关函数
  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(ninja: INinja) {
    setEditingId(ninja.id)
    setForm({
      name: ninja.name,
      tier: ninja.tier,
      rating: ninja.rating,
      tags: ninja.tags || [],
      imageUrl: ninja.imageUrl || '',
      acquisition: ninja.acquisition || '',
    })
    setErrors({})
    setDialogOpen(true)
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = '名称不能为空'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const data: INinja = {
      id: editingId || Date.now().toString(),
      name: form.name.trim(),
      tier: form.tier,
      rating: form.rating,
      tags: form.tags,
      imageUrl: form.imageUrl.trim() || DEFAULT_IMG,
      acquisition: form.acquisition || undefined,
    }
    if (editingId) {
      updateNinja(editingId, data)
    } else {
      addNinja(data)
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteNinja(deleteId)
      setDeleteId(null)
    }
  }

  function handleDeleteTagConfirm() {
    if (tagToDelete) {
      removeNinjaTag(tagToDelete)
      setTagToDelete(null)
    }
  }

  function handleDeleteAcquisitionConfirm() {
    if (acquisitionToDelete) {
      removeAcquisitionOption(acquisitionToDelete)
      setAcquisitionToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">共 {ninjas.length} 位忍者</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={openBatchDialog} className="gap-1.5">
            <Layers className="size-4" />
            批量管理
          </Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="size-4" />
            新增忍者
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="table" className="gap-1.5">
            <Table2 className="size-4" />
            表格模式
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-1.5">
            <LayoutGrid className="size-4" />
            梯度视图
          </TabsTrigger>
        </TabsList>

        {/* 表格模式 */}
        <TabsContent value="table" className="mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索名称、标签或获取方式..."
                className="pl-9 pr-9"
              />
              {searchKeyword && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchKeyword('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">名称</SelectItem>
                <SelectItem value="tier">T级</SelectItem>
                <SelectItem value="rating">评级</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              title={sortOrder === 'asc' ? '升序' : '降序'}
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">名称</TableHead>
                      <TableHead className="whitespace-nowrap w-[80px]">T级</TableHead>
                      <TableHead className="whitespace-nowrap w-[60px]">评级</TableHead>
                      <TableHead className="whitespace-nowrap w-[100px]">获取方式</TableHead>
                      <TableHead className="whitespace-nowrap">定位</TableHead>
                      <TableHead className="whitespace-nowrap text-right w-[120px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSorted.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                          <Swords className="size-8 mx-auto mb-2 opacity-30" />
                          暂无匹配的忍者
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSorted.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium">
                            <span className="block truncate max-w-[200px]">{n.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('text-xs font-bold', TIER_COLORS[n.tier])}
                            >
                              {n.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {n.rating}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {n.acquisition ? (
                              <Badge variant="outline" className="text-xs">{n.acquisition}</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {n.tags?.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => openEdit(n)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => setDeleteId(n.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
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

        {/* 梯度视图 */}
        <TabsContent value="grid" className="mt-6">
          <div className="relative max-w-xs mb-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={gridSearchKeyword}
              onChange={(e) => setGridSearchKeyword(e.target.value)}
              placeholder="搜索忍者..."
              className="pl-9"
            />
            {gridSearchKeyword && (
              <Button
                size="icon"
                variant="ghost"
                className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setGridSearchKeyword('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-10">
            {groupedNinjas.map(group => (
              <div
                key={group.tier}
                onDragOver={handleGridDragOver}
                onDrop={(e) => handleGridDrop(e, group.tier)}
                className={`rounded-lg border-2 border-dashed border-transparent hover:border-primary/30 transition-colors p-2`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className={cn('text-sm font-bold px-3 py-1', TIER_COLORS[group.tier])}>
                    {group.tier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{group.ninjas.length} 位忍者</span>
                </div>

                {group.ninjas.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">拖拽忍者到此梯度</div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                    {group.ninjas.map(ninja => (
                      <div
                        key={ninja.id}
                        draggable
                        onDragStart={(e) => handleGridDragStart(e, ninja.id)}
                        className="cursor-grab active:cursor-grabbing group relative"
                      >
                        <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1 relative">
                          <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-contain" />
                          <button
                            className={`absolute bottom-1 left-1 z-10 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold bg-background/60 backdrop-blur-sm transition-colors ${
                              ninja.trend === 'up' ? 'text-red-500' : ninja.trend === 'down' ? 'text-green-500' : 'text-muted-foreground/60'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTrend(ninja.id);
                            }}
                            title="点击切换升降标记"
                          >
                            {ninja.trend === 'up' ? '▲' : ninja.trend === 'down' ? '▼' : '●'}
                          </button>
                          {ninja.acquisition && (
                            <span className="absolute top-1 left-1 bg-background/70 backdrop-blur-sm text-[10px] rounded px-1 py-0.5 font-medium text-muted-foreground">
                              {ninja.acquisition}
                            </span>
                          )}
                        </Card>
                        <p className="text-xs text-muted-foreground truncate text-center mt-1">{ninja.name}</p>
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-6 w-6 rounded-full"
                            onClick={() => openEdit(ninja)}
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6 rounded-full"
                            onClick={() => setDeleteId(ninja.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑忍者' : '新增忍者'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改忍者信息后点击保存' : '填写忍者信息后点击添加'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 -mx-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="ninja-name">
                名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ninja-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：秽土转生·解 宇智波斑"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>T级 <span className="text-destructive">*</span></Label>
                <Select
                  value={form.tier}
                  onValueChange={(v) => setForm({ ...form, tier: v as INinja['tier'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIER_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>评级 <span className="text-destructive">*</span></Label>
                <Select
                  value={form.rating}
                  onValueChange={(v) => setForm({ ...form, rating: v as INinja['rating'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATING_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 获取方式（可动态添加） */}
            <div className="space-y-2">
              <Label>获取方式</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="输入新的获取方式"
                  value={newAcquisition}
                  onChange={(e) => setNewAcquisition(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddAcquisition()
                  }}
                />
                <Button size="sm" variant="outline" onClick={handleAddAcquisition} disabled={!newAcquisition.trim()}>
                  <Plus className="size-4 mr-1" /> 添加
                </Button>
              </div>

              {/* 获取方式选择与删除 */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {acquisitionOptions.map((option) => {
                  const selected = form.acquisition === option
                  return (
                    <div key={option} className="flex items-center gap-1 group">
                      <button
                        type="button"
                        className={cn(
                          'flex-1 text-sm px-2 py-1 rounded border transition-colors text-left',
                          selected
                            ? 'bg-primary/10 border-primary text-primary font-medium'
                            : 'border-border/50 hover:border-border text-foreground'
                        )}
                        onClick={() => {
                          setForm({ ...form, acquisition: selected ? '' : option })
                        }}
                      >
                        {option}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setAcquisitionToDelete(option)
                        }}
                        title="删除此获取方式"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  )
                })}
                {acquisitionOptions.length === 0 && (
                  <p className="col-span-3 text-xs text-muted-foreground">暂无获取方式，请添加</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>定位（可多选）</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="输入新定位名称"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag()
                  }}
                />
                <Button size="sm" variant="outline" onClick={handleAddTag} disabled={!newTagName.trim()}>
                  <Plus className="size-4 mr-1" /> 添加
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {ninjaTags.map((tag) => {
                  const checked = form.tags.includes(tag)
                  return (
                    <div key={tag} className="flex items-center gap-1 group">
                      <label className="flex items-center gap-1.5 text-sm cursor-pointer flex-1">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => {
                            setForm({
                              ...form,
                              tags: checked
                                ? form.tags.filter((t) => t !== tag)
                                : [...form.tags, tag],
                            })
                          }}
                        />
                        {tag}
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setTagToDelete(tag)
                        }}
                        title="删除此标签"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>忍者图片（可选）</Label>
              <ImageUpload
                value={form.imageUrl}
                onChange={(base64) => setForm({ ...form, imageUrl: base64 })}
                defaultPlaceholder="上传忍者截图"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>{editingId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量管理对话框 */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>批量管理</DialogTitle>
            <DialogDescription>
              选择要调整的属性和值，勾选忍者后点击保存
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 -mx-6 px-6 space-y-4">
            {/* 属性选择 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">调整属性：</span>
              <div className="flex bg-muted rounded-lg p-1 gap-1">
                <button
                  onClick={() => setBatchAttr('tags')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${batchAttr === 'tags' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  定位
                </button>
                <button
                  onClick={() => setBatchAttr('acquisition')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${batchAttr === 'acquisition' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  获取方式
                </button>
              </div>
            </div>

            {/* 定位模式 */}
            {batchAttr === 'tags' && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">定位值：</span>
                <Select value={batchTagValue} onValueChange={setBatchTagValue}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="选择定位" />
                  </SelectTrigger>
                  <SelectContent>
                    {ninjaTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground">操作：</span>
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setBatchTagAction('add')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${batchTagAction === 'add' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    添加
                  </button>
                  <button
                    onClick={() => setBatchTagAction('remove')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${batchTagAction === 'remove' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    移除
                  </button>
                </div>
              </div>
            )}

            {/* 获取方式模式 */}
            {batchAttr === 'acquisition' && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">获取方式：</span>
                <Select value={batchAcquisitionValue} onValueChange={setBatchAcquisitionValue}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="选择获取方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {acquisitionOptions.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground">操作：</span>
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setBatchAcquisitionAction('set')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${batchAcquisitionAction === 'set' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    设置
                  </button>
                  <button
                    onClick={() => setBatchAcquisitionAction('clear')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${batchAcquisitionAction === 'clear' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    清除
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={batchSearchKeyword}
                  onChange={(e) => setBatchSearchKeyword(e.target.value)}
                  placeholder="搜索忍者..."
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground">已选 {batchSelectedIds.size} 位</span>
            </div>

            {/* 忍者列表 */}
            <div className="space-y-6">
              {batchGroupedNinjas.map(group => {
                const groupIds = group.ninjas.map(n => n.id)
                const allSelected = groupIds.every(id => batchSelectedIds.has(id))
                const someSelected = !allSelected && groupIds.some(id => batchSelectedIds.has(id))
                return (
                  <div key={group.tier}>
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                        onCheckedChange={(checked) => toggleBatchSelectAll(groupIds, checked === true)}
                      />
                      <Badge variant="outline" className={cn('text-sm font-bold px-2 py-0.5', TIER_COLORS[group.tier])}>
                        {group.tier}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{group.ninjas.length} 位</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {group.ninjas.map(ninja => {
                        const selected = batchSelectedIds.has(ninja.id)
                        return (
                          <div
                            key={ninja.id}
                            className={cn(
                              'cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg border-2 transition-all relative',
                              selected ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted/50'
                            )}
                            onClick={() => toggleBatchSelect(ninja.id)}
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden border bg-card relative">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                              {selected && (
                                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                  <Check className="size-5 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-center leading-tight truncate w-full">{ninja.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {batchGroupedNinjas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">未找到忍者</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>取消</Button>
            <Button onClick={handleBatchSave} disabled={batchSelectedIds.size === 0}>
              保存 ({batchSelectedIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除忍者确认 */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法恢复，确定要删除该忍者数据吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除标签确认 */}
      <AlertDialog open={!!tagToDelete} onOpenChange={(v) => !v && setTagToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除标签？</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除标签「{tagToDelete}」吗？此操作将从标签列表中移除该标签，但不会影响已拥有此标签的忍者数据。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTagConfirm}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除获取方式确认 */}
      <AlertDialog open={!!acquisitionToDelete} onOpenChange={(v) => !v && setAcquisitionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除获取方式？</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除获取方式「{acquisitionToDelete}」吗？此操作将从选项中移除，但不会影响已有忍者的该属性数据。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAcquisitionConfirm}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}