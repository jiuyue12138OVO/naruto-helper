import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, ScrollText, ArrowUpDown, Search, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageUpload from '@/components/ImageUpload'
import { useData } from '@/contexts/DataContext'
import { IScroll } from '@/data/scrolls'

const DEFAULT_IMG = ''

interface FormData {
  name: string
  description: string
  cooldown: string
  imageUrl: string
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  cooldown: '',
  imageUrl: '',
}

type SortField = 'name' | 'description' | 'cooldown'
type SortOrder = 'asc' | 'desc'

export default function ScrollManageTab() {
  const { scrolls, addScroll, updateScroll, deleteScroll } = useData()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // 搜索和排序状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 过滤 + 排序后的密卷列表
  const filteredAndSorted = useMemo(() => {
    let list = [...scrolls]

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw)
      )
    }

    list.sort((a, b) => {
      let valA = ''
      let valB = ''
      switch (sortField) {
        case 'name':
          valA = a.name
          valB = b.name
          break
        case 'description':
          valA = a.description
          valB = b.description
          break
        case 'cooldown':
          valA = a.cooldown
          valB = b.cooldown
          break
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [scrolls, searchKeyword, sortField, sortOrder])

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(scroll: IScroll) {
    setEditingId(scroll.id)
    setForm({
      name: scroll.name,
      description: scroll.description,
      cooldown: scroll.cooldown,
      imageUrl: scroll.imageUrl || '',
    })
    setErrors({})
    setDialogOpen(true)
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
    const data: IScroll = {
      id: editingId || Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      cooldown: form.cooldown.trim(),
      imageUrl: form.imageUrl.trim() || DEFAULT_IMG,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">共 {scrolls.length} 个密卷</p>
        <Button size="sm" onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          新增密卷
        </Button>
      </div>

      {/* 搜索 + 排序控件 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索名称或描述..."
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
            <SelectItem value="name">名称</SelectItem>
            <SelectItem value="description">效果描述</SelectItem>
            <SelectItem value="cooldown">冷却时间</SelectItem>
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
                  <TableHead className="whitespace-nowrap">效果描述</TableHead>
                  <TableHead className="whitespace-nowrap w-[90px]">冷却时间</TableHead>
                  <TableHead className="whitespace-nowrap text-right w-[120px]">操作</TableHead>
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
                  filteredAndSorted.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        <span className="block truncate max-w-[180px]">{s.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="block truncate max-w-[180px] text-muted-foreground text-sm">
                          {s.description}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {s.cooldown}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEdit(s)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(s.id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑密卷' : '新增密卷'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改密卷信息后点击保存' : '填写密卷信息后点击添加'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scroll-name">
                名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scroll-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：风遁·风沙阵"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scroll-desc">
                效果描述 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="scroll-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="如：大范围吸附，限制走位提升命中率"
                rows={2}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scroll-cd">
                冷却时间 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scroll-cd"
                value={form.cooldown}
                onChange={(e) => setForm({ ...form, cooldown: e.target.value })}
                placeholder="如：约15秒"
              />
              {errors.cooldown && (
                <p className="text-xs text-destructive">{errors.cooldown}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>密卷图片（可选）</Label>
              <ImageUpload
                value={form.imageUrl}
                onChange={(base64) => setForm({ ...form, imageUrl: base64 })}
                defaultPlaceholder="上传密卷截图"
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

      {/* 删除确认 */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法恢复，确定要删除该密卷数据吗？
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