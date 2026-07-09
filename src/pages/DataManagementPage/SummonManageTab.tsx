import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, ArrowUpDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
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
import ImageUpload from '@/components/ImageUpload'
import { useData } from '@/contexts/DataContext'
import { ISummon } from '@/data/summons'

const DEFAULT_IMG = ''

interface FormData {
  name: string
  skill: string
  description: string
  imageUrl: string
}

const EMPTY_FORM: FormData = {
  name: '',
  skill: '',
  description: '',
  imageUrl: DEFAULT_IMG,
}

type SortField = 'name' | 'skill' | 'description'
type SortOrder = 'asc' | 'desc'

export default function SummonManageTab() {
  const { summons, addSummon, updateSummon, deleteSummon } = useData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const filteredAndSorted = useMemo(() => {
    let list = [...summons]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(kw) ||
        s.skill.toLowerCase().includes(kw) ||
        s.description.toLowerCase().includes(kw)
      )
    }
    list.sort((a, b) => {
      const valA = a[sortField] || ''
      const valB = b[sortField] || ''
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [summons, searchKeyword, sortField, sortOrder])

  function openAdd() { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setDialogOpen(true) }
  function openEdit(summon: ISummon) {
    setEditingId(summon.id)
    setForm({
      name: summon.name,
      skill: summon.skill || '',
      description: summon.description,
      imageUrl: summon.imageUrl || ''
    })
    setErrors({}); setDialogOpen(true)
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = '名称不能为空'
    if (!form.skill.trim()) e.skill = '技能不能为空'
    if (!form.description.trim()) e.description = '描述不能为空'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const data: ISummon = {
      id: editingId || Date.now().toString(),
      name: form.name.trim(),
      skill: form.skill.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() || DEFAULT_IMG,
    }
    if (editingId) { updateSummon(editingId, data) } else { addSummon(data) }
    setDialogOpen(false)
  }

  function handleDelete() { if (deleteId) { deleteSummon(deleteId); setDeleteId(null) } }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">共 {summons.length} 个通灵兽</p>
        <Button size="sm" onClick={openAdd}><Plus className="size-4" />新增通灵兽</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="搜索名称、技能或描述..." className="pl-9 pr-9" />
          {searchKeyword && <Button size="icon" variant="ghost" className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchKeyword('')}><X className="h-4 w-4" /></Button>}
        </div>
        <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">名称</SelectItem>
            <SelectItem value="skill">技能</SelectItem>
            <SelectItem value="description">描述</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} title={sortOrder === 'asc' ? '升序' : '降序'}><ArrowUpDown className="size-4" /></Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>技能</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">暂无通灵兽数据</TableCell></TableRow>
              ) : (
                filteredAndSorted.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.skill}</TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">{s.description}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="size-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? '编辑通灵兽' : '新增通灵兽'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>名称 *</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>
            <div>
              <Label>技能 *</Label>
              <Input value={form.skill} onChange={e => setForm({...form, skill: e.target.value})} />
              {errors.skill && <p className="text-destructive text-xs">{errors.skill}</p>}
            </div>
            <div>
              <Label>描述 *</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>
            <div>
              <Label>图片（可选）</Label>
              <ImageUpload value={form.imageUrl} onChange={b64 => setForm({...form, imageUrl: b64})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={v => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>确认删除？</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}