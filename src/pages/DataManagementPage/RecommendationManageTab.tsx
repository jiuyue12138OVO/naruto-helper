import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Link2, X, GripVertical, Search, ArrowUpDown, ImageIcon } from 'lucide-react'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useData } from '@/contexts/DataContext'
import { IRecommendation } from '@/data/recommendations'

interface ScrollEntry {
  scrollId: string
  scrollName: string
  priority: number
}

interface FormData {
  ninjaId: string
  ninjaName: string
  scrolls: ScrollEntry[]
}

const EMPTY_FORM: FormData = {
  ninjaId: '',
  ninjaName: '',
  scrolls: [],
}

type SortField = 'ninjaName'
type SortOrder = 'asc' | 'desc'

export default function RecommendationManageTab() {
  const {
    ninjas,
    scrolls,
    recommendations,
    addRecommendation,
    updateRecommendation,
    deleteRecommendation,
  } = useData()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<{ ninja?: string; scrolls?: string }>({})

  const [deleteId, setDeleteId] = useState<string | null>(null)

  // 搜索和排序状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('ninjaName')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 多选密卷相关状态
  const [selectedScrollIds, setSelectedScrollIds] = useState<string[]>([])
  const [scrollSearchKeyword, setScrollSearchKeyword] = useState('')

  // 已存在推荐的忍者 id 集合（新增时用于禁用已推荐忍者）
  const existingNinjaIds = useMemo(() => {
    if (editingId) return new Set<string>() // 编辑模式不限制
    return new Set(recommendations.map((r) => r.ninjaId))
  }, [recommendations, editingId])

  // 按分组排序的忍者列表
  const groupedNinjas = useMemo(() => {
    const recommended: typeof ninjas = []
    const unrecommended: typeof ninjas = []
    ninjas.forEach((n) => {
      if (existingNinjaIds.has(n.id)) {
        recommended.push(n)
      } else {
        unrecommended.push(n)
      }
    })
    return { recommended, unrecommended }
  }, [ninjas, existingNinjaIds])

  // 过滤 + 排序后的推荐数据
  const filteredAndSorted = useMemo(() => {
    let list = [...recommendations]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter((r) => r.ninjaName.toLowerCase().includes(kw))
    }
    list.sort((a, b) => {
      if (sortField === 'ninjaName') {
        const nameA = a.ninjaName
        const nameB = b.ninjaName
        if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1
        if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1
      }
      return 0
    })
    return list
  }, [recommendations, searchKeyword, sortField, sortOrder])

  // 过滤密卷列表（用于多选）
  const filteredScrolls = useMemo(() => {
    if (!scrollSearchKeyword.trim()) return scrolls
    const kw = scrollSearchKeyword.toLowerCase()
    return scrolls.filter(s => s.name.toLowerCase().includes(kw))
  }, [scrolls, scrollSearchKeyword])

  // 已添加到表单的密卷 id 集合
  const addedScrollIds = useMemo(() => new Set(form.scrolls.map(s => s.scrollId)), [form.scrolls])

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSelectedScrollIds([])
    setScrollSearchKeyword('')
    setDialogOpen(true)
  }

  function openEdit(rec: IRecommendation) {
    setEditingId(rec.id)
    setForm({
      ninjaId: rec.ninjaId,
      ninjaName: rec.ninjaName,
      scrolls: rec.scrolls.map(s => ({ ...s })),
    })
    setErrors({})
    setSelectedScrollIds([])
    setScrollSearchKeyword('')
    setDialogOpen(true)
  }

  function handleNinjaChange(ninjaId: string) {
    const ninja = ninjas.find(n => n.id === ninjaId)
    setForm({ ...form, ninjaId, ninjaName: ninja ? ninja.name : '' })
  }

  // 批量添加选中的密卷
  function addSelectedScrolls() {
    const toAdd = selectedScrollIds.filter(id => !addedScrollIds.has(id))
    if (toAdd.length === 0) return
    const newEntries: ScrollEntry[] = toAdd.map((scrollId, i) => {
      const scroll = scrolls.find(s => s.id === scrollId)
      return {
        scrollId,
        scrollName: scroll ? scroll.name : '',
        priority: form.scrolls.length + i + 1,
      }
    })
    setForm({
      ...form,
      scrolls: [...form.scrolls, ...newEntries],
    })
    setSelectedScrollIds([])
  }

  function removeScrollEntry(index: number) {
    const newScrolls = form.scrolls.filter((_, i) => i !== index)
    newScrolls.forEach((s, i) => (s.priority = i + 1))
    setForm({ ...form, scrolls: newScrolls })
  }

  function moveUp(index: number) {
    if (index === 0) return
    const newScrolls = [...form.scrolls]
    ;[newScrolls[index - 1], newScrolls[index]] = [newScrolls[index], newScrolls[index - 1]]
    newScrolls.forEach((s, i) => (s.priority = i + 1))
    setForm({ ...form, scrolls: newScrolls })
  }

  function moveDown(index: number) {
    if (index === form.scrolls.length - 1) return
    const newScrolls = [...form.scrolls]
    ;[newScrolls[index], newScrolls[index + 1]] = [newScrolls[index + 1], newScrolls[index]]
    newScrolls.forEach((s, i) => (s.priority = i + 1))
    setForm({ ...form, scrolls: newScrolls })
  }

  function toggleScrollSelection(scrollId: string) {
    setSelectedScrollIds(prev =>
      prev.includes(scrollId) ? prev.filter(id => id !== scrollId) : [...prev, scrollId]
    )
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.ninjaId) e.ninja = '请选择忍者'
    if (!editingId && form.ninjaId && recommendations.some(r => r.ninjaId === form.ninjaId)) {
      e.ninja = '该忍者已有推荐搭配，请修改现有记录或选择其他忍者'
    }
    if (form.scrolls.length === 0) e.scrolls = '请至少添加一个密卷'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const data: IRecommendation = {
      id: editingId || Date.now().toString(),
      ninjaId: form.ninjaId,
      ninjaName: form.ninjaName,
      scrolls: form.scrolls,
    }
    if (editingId) {
      updateRecommendation(editingId, data)
    } else {
      addRecommendation(data)
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteRecommendation(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">共 {recommendations.length} 条忍者推荐</p>
        <Button size="sm" onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          新增推荐
        </Button>
      </div>

      {/* 搜索 + 排序控件 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索忍者名称..."
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
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ninjaName">忍者名称</SelectItem>
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
                  <TableHead className="whitespace-nowrap">忍者名称</TableHead>
                  <TableHead className="whitespace-nowrap">推荐密卷（优先级从高到低）</TableHead>
                  <TableHead className="whitespace-nowrap text-right w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-12">
                      <Link2 className="size-8 mx-auto mb-2 opacity-30" />
                      暂无推荐数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSorted.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        <span className="block truncate max-w-[160px]">{r.ninjaName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {r.scrolls
                            .sort((a, b) => a.priority - b.priority)
                            .map((s, idx) => (
                              <Badge key={s.scrollId} variant="secondary" className="text-xs">
                                {idx + 1}. {s.scrollName}
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
                            onClick={() => openEdit(r)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(r.id)}
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

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑推荐搭配' : '新增推荐搭配'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改忍者的推荐密卷和优先级' : '选择一个忍者，然后多选添加推荐密卷'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                选择忍者 <span className="text-destructive">*</span>
              </Label>
              <Select value={form.ninjaId} onValueChange={handleNinjaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择忍者" />
                </SelectTrigger>
                <SelectContent>
                  {editingId ? (
                    ninjas.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      {groupedNinjas.unrecommended.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>-- 未有搭配忍者 --</SelectLabel>
                          {groupedNinjas.unrecommended.map((n) => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {groupedNinjas.recommended.length > 0 && (
                        <>
                          <SelectSeparator />
                          <SelectGroup>
                            <SelectLabel>-- 已有搭配忍者（不可选） --</SelectLabel>
                            {groupedNinjas.recommended.map((n) => (
                              <SelectItem key={n.id} value={n.id} disabled>
                                {n.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.ninja && <p className="text-xs text-destructive">{errors.ninja}</p>}
            </div>

            {/* 添加密卷区域（多选 + 图片） */}
            <div className="space-y-2">
              <Label>添加密卷</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索密卷..."
                  value={scrollSearchKeyword}
                  onChange={(e) => setScrollSearchKeyword(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <div className="border rounded-md max-h-48 overflow-y-auto space-y-0.5 p-1">
                {filteredScrolls.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">无匹配密卷</p>
                ) : (
                  filteredScrolls.map(scroll => {
                    const isAdded = addedScrollIds.has(scroll.id)
                    const isSelected = selectedScrollIds.includes(scroll.id)
                    return (
                      <label
                        key={scroll.id}
                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                          isAdded ? 'opacity-60' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected || isAdded}
                          disabled={isAdded}
                          onChange={() => toggleScrollSelection(scroll.id)}
                          className="size-4 rounded border-border accent-primary disabled:cursor-not-allowed"
                        />
                        <div className="w-8 h-8 rounded overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {scroll.imageUrl ? (
                            <img src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm flex-1 truncate">{scroll.name}</span>
                        {isAdded && <Badge variant="outline" className="text-xs">已添加</Badge>}
                      </label>
                    )
                  })
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  已选中 {selectedScrollIds.length} 个密卷
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addSelectedScrolls}
                  disabled={selectedScrollIds.filter(id => !addedScrollIds.has(id)).length === 0}
                >
                  添加选中密卷
                </Button>
              </div>
              {errors.scrolls && <p className="text-xs text-destructive">{errors.scrolls}</p>}
            </div>

            {/* 已添加密卷列表（带图片和优先级） */}
            {form.scrolls.length > 0 && (
              <div className="space-y-2">
                <Label>推荐密卷列表（从上到下优先级降低）</Label>
                <div className="space-y-2 border rounded-md p-2">
                  {form.scrolls.map((entry, idx) => {
                    const scroll = scrolls.find(s => s.id === entry.scrollId)
                    return (
                      <div
                        key={`${entry.scrollId}-${idx}`}
                        className="flex items-center justify-between bg-muted/40 rounded px-2 py-1.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className="text-xs font-mono">
                            {idx + 1}
                          </Badge>
                          <div className="w-6 h-6 rounded overflow-hidden bg-muted flex items-center justify-center shrink-0">
                            {scroll?.imageUrl ? (
                              <img src={scroll.imageUrl} alt={entry.scrollName} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="size-3 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-sm truncate">{entry.scrollName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveUp(idx)}
                            disabled={idx === 0}
                          >
                            <GripVertical className="size-3.5 rotate-90" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveDown(idx)}
                            disabled={idx === form.scrolls.length - 1}
                          >
                            <GripVertical className="size-3.5 -rotate-90" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeScrollEntry(idx)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>{editingId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法恢复，确定要删除该忍者的推荐搭配吗？
            </AlertDialogDescription>
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