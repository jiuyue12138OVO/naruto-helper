import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, ArrowUpDown, Search, X } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/ImageUpload'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'
import { ISummon } from '@/data/summons'
import type { INinja } from '@/data/ninjas'

const DEFAULT_IMG = ''
const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

interface FormData {
  name: string
  skill: string
  description: string
  imageUrl: string
  isExclusive: boolean
  exclusiveEffect: string
  exclusiveNinjaIds: string[]
}

const EMPTY_FORM: FormData = {
  name: '',
  skill: '',
  description: '',
  imageUrl: DEFAULT_IMG,
  isExclusive: false,
  exclusiveEffect: '',
  exclusiveNinjaIds: [],
}

type SortField = 'name' | 'skill' | 'description'
type SortOrder = 'asc' | 'desc'

export default function SummonManageTab() {
  const { summons, ninjas, addSummon, updateSummon, deleteSummon } = useData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 弹窗里的忍者搜索
  const [ninjaSearch, setNinjaSearch] = useState('')

  // 忍者按梯度分组（用于选择）
  const groupedNinjasForExclusive = useMemo(() => {
    let list = ninjas
    if (ninjaSearch.trim()) {
      const kw = ninjaSearch.toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(kw))
    }
    return TIER_ORDER.map(tier => ({
      tier,
      ninjas: list.filter(n => n.tier === tier),
    })).filter(g => g.ninjas.length > 0)
  }, [ninjas, ninjaSearch])

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

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setNinjaSearch('')
    setDialogOpen(true)
  }

  function openEdit(summon: ISummon) {
    setEditingId(summon.id)
    setForm({
      name: summon.name,
      skill: summon.skill || '',
      description: summon.description,
      imageUrl: summon.imageUrl || '',
      isExclusive: summon.isExclusive || false,
      exclusiveEffect: summon.exclusiveEffect || '',
      exclusiveNinjaIds: summon.exclusiveNinjaIds || [],
    })
    setErrors({})
    setNinjaSearch('')
    setDialogOpen(true)
  }

  function toggleExclusiveNinja(id: string) {
    setForm(prev => {
      const has = prev.exclusiveNinjaIds.includes(id)
      return {
        ...prev,
        exclusiveNinjaIds: has
          ? prev.exclusiveNinjaIds.filter(x => x !== id)
          : [...prev.exclusiveNinjaIds, id],
      }
    })
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = '名称不能为空'
    if (!form.skill.trim()) e.skill = '技能不能为空'
    if (!form.description.trim()) e.description = '描述不能为空'
    if (form.isExclusive && !form.exclusiveEffect.trim()) e.exclusiveEffect = '专属效果不能为空'
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
      isExclusive: form.isExclusive,
      exclusiveEffect: form.isExclusive ? form.exclusiveEffect.trim() : undefined,
      exclusiveNinjaIds: form.isExclusive && form.exclusiveNinjaIds.length > 0 ? form.exclusiveNinjaIds : undefined,
    }
    if (editingId) {
      updateSummon(editingId, data)
    } else {
      addSummon(data)
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId) {
      deleteSummon(deleteId)
      setDeleteId(null)
    }
  }

  function getNinjaName(id: string) {
    return ninjas.find(n => n.id === id)?.name || '未知'
  }

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
                <TableHead>专属</TableHead>
                <TableHead className="text-right w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">暂无通灵兽数据</TableCell></TableRow>
              ) : (
                filteredAndSorted.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.skill}</TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">{s.description}</TableCell>
                    <TableCell>
                      {s.isExclusive ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-primary font-medium">是</span>
                          {s.exclusiveNinjaIds && s.exclusiveNinjaIds.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              {s.exclusiveNinjaIds.length} 位对应忍者
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">否</span>
                      )}
                    </TableCell>
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

      {/* 编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader><DialogTitle>{editingId ? '编辑通灵兽' : '新增通灵兽'}</DialogTitle></DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 -mx-6 px-6">
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

            {/* 专属通灵开关 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="exclusive-switch">设为专属通灵</Label>
              <Switch
                id="exclusive-switch"
                checked={form.isExclusive}
                onCheckedChange={checked => setForm({
                  ...form,
                  isExclusive: checked,
                  exclusiveEffect: checked ? form.exclusiveEffect : '',
                  exclusiveNinjaIds: checked ? form.exclusiveNinjaIds : [],
                })}
              />
            </div>

            {form.isExclusive && (
              <>
                <div>
                  <Label>专属效果 *</Label>
                  <Textarea
                    value={form.exclusiveEffect}
                    onChange={e => setForm({ ...form, exclusiveEffect: e.target.value })}
                    rows={2}
                    placeholder="输入专属通灵兽效果描述..."
                  />
                  {errors.exclusiveEffect && <p className="text-destructive text-xs">{errors.exclusiveEffect}</p>}
                </div>

                {/* 专属对应忍者 */}
                <div className="space-y-2">
                  <Label>专属对应忍者（可多选）</Label>
                  {form.exclusiveNinjaIds.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {form.exclusiveNinjaIds.map(id => {
                        const ninja = ninjas.find(n => n.id === id)
                        return ninja ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="gap-1 cursor-pointer"
                            onClick={() => toggleExclusiveNinja(id)}
                          >
                            <Image src={ninja.imageUrl} className="w-4 h-4 rounded" />
                            {ninja.name}
                            <X className="h-3 w-3" />
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={ninjaSearch}
                      onChange={(e) => setNinjaSearch(e.target.value)}
                      placeholder="搜索忍者..."
                      className="pl-9 pr-9"
                    />
                    {ninjaSearch && (
                      <Button variant="ghost" size="icon" className="absolute! right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setNinjaSearch('')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3 mt-2 max-h-72 overflow-y-auto border rounded-md p-2">
                    {groupedNinjasForExclusive.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">无匹配忍者</p>
                    ) : (
                      groupedNinjasForExclusive.map(group => (
                        <div key={group.tier}>
                          <Badge variant="outline" className="mb-1.5 text-xs font-bold">{group.tier}</Badge>
                          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                            {group.ninjas.map(ninja => {
                              const isSelected = form.exclusiveNinjaIds.includes(ninja.id)
                              return (
                                <div
                                  key={ninja.id}
                                  className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'border-primary bg-primary/10'
                                      : 'border-transparent hover:bg-muted/50'
                                  }`}
                                  onClick={() => toggleExclusiveNinja(ninja.id)}
                                >
                                  <div className="w-10 h-10 rounded-md overflow-hidden border border-border/40 bg-card">
                                    <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-[10px] text-center leading-tight truncate w-full">{ninja.name}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingId ? '保存' : '添加'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
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