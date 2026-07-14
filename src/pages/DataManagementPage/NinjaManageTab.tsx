import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Swords, ArrowUpDown, Search, X } from 'lucide-react'
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
import ImageUpload from '@/components/ImageUpload'
import { useData } from '@/contexts/DataContext'
import { INinja } from '@/data/ninjas'
import { cn } from '@/lib/utils'

const TIER_OPTIONS = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']
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
}

const DEFAULT_IMG = ''

interface FormData {
  name: string
  tier: INinja['tier']
  rating: INinja['rating']
  tags: string[]
  imageUrl: string
}

const EMPTY_FORM: FormData = {
  name: '',
  tier: 't0下',
  rating: 'B',
  tags: [],
  imageUrl: DEFAULT_IMG,
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

  // 新增标签状态
  const [newTagName, setNewTagName] = useState('')

  // 🔥 新增：待删除的标签名称（用于确认对话框）
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)

  const handleAddTag = () => {
    const tag = newTagName.trim()
    if (tag && !ninjaTags.includes(tag)) {
      addNinjaTag(tag)
    }
    setNewTagName('')
  }

  // 过滤 + 排序
  const filteredAndSorted = useMemo(() => {
    let list = [...ninjas]

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter((n) =>
        n.name.toLowerCase().includes(kw) ||
        n.tags.some(tag => tag.toLowerCase().includes(kw))
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

  // 🔥 处理删除标签的确认
  function handleDeleteTagConfirm() {
    if (tagToDelete) {
      removeNinjaTag(tagToDelete)
      setTagToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">共 {ninjas.length} 位忍者</p>
        <Button size="sm" onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          新增忍者
        </Button>
      </div>

      {/* 搜索 + 排序 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索名称或标签..."
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
                  <TableHead className="whitespace-nowrap">定位</TableHead>
                  <TableHead className="whitespace-nowrap text-right w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
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

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑忍者' : '新增忍者'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改忍者信息后点击保存' : '填写忍者信息后点击添加'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label>定位（可多选）</Label>
              {/* 新增标签 */}
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

              {/* 标签选择 */}
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
                          setTagToDelete(tag)   // 🔥 打开确认对话框
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

      {/* 🔥 删除标签确认 */}
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
    </div>
  )
}