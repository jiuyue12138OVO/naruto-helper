import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'
import { poolAllows } from './battlePool'
import type { PlayerPool, PoolMode } from './battlePool'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...']

type PoolKind = 'ninjas' | 'scrolls' | 'summons'

interface PoolSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ninjas: INinja[]
  scrolls: IScroll[]
  summons: ISummon[]
  pool: PlayerPool
  onChange: (pool: PlayerPool) => void
}

export default function PoolSettingsDialog({
  open, onOpenChange, ninjas, scrolls, summons, pool, onChange,
}: PoolSettingsDialogProps) {
  const [draft, setDraft] = useState<PlayerPool>(pool)
  const [tab, setTab] = useState('ninjas')
  const [search, setSearch] = useState('')
  const [tierGrouping, setTierGrouping] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft({
      mode: pool.mode,
      ninjas: [...pool.ninjas],
      scrolls: [...pool.scrolls],
      summons: [...pool.summons],
    })
    setSearch('')
  }, [open, pool])

  const toggleItem = (kind: PoolKind, id: string) => {
    if (draft.mode === 'all') return
    setDraft(prev => {
      const list = prev[kind]
      const has = list.includes(id)
      const next: PlayerPool = { ...prev }
      next[kind] = has ? list.filter(x => x !== id) : [...list, id]
      return next
    })
  }

  const setMany = (kind: PoolKind, ids: string[], add: boolean) => {
    if (draft.mode === 'all') return
    setDraft(prev => {
      const current = new Set(prev[kind])
      ids.forEach(id => (add ? current.add(id) : current.delete(id)))
      const next: PlayerPool = { ...prev }
      next[kind] = [...current]
      return next
    })
  }

  const clearKind = (kind: PoolKind) => {
    setDraft(prev => {
      const next: PlayerPool = { ...prev }
      next[kind] = []
      return next
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onChange(draft)
    onOpenChange(nextOpen)
  }

  const usableNinjas = useMemo(
    () => ninjas.filter(n => poolAllows(draft, 'ninjas', n.id)).length,
    [ninjas, draft],
  )
  const usableScrolls = useMemo(
    () => scrolls.filter(s => poolAllows(draft, 'scrolls', s.id)).length,
    [scrolls, draft],
  )
  const usableSummons = useMemo(
    () => summons.filter(s => poolAllows(draft, 'summons', s.id)).length,
    [summons, draft],
  )

  const filteredNinjas = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return kw ? ninjas.filter(n => n.name.toLowerCase().includes(kw)) : ninjas
  }, [ninjas, search])

  const sortedNinjas = useMemo(() => {
    const list = [...filteredNinjas]
    list.sort((a, b) => (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER))
    return list
  }, [filteredNinjas])

  const groupedNinjas = useMemo(() => {
    if (!tierGrouping) return [{ tier: '全部', ninjas: sortedNinjas }]
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const list = sortedNinjas.filter(n => n.tier === tier)
      if (list.length > 0) groups.push({ tier, ninjas: list })
    })
    const rest = sortedNinjas.filter(n => !TIER_ORDER.includes(n.tier))
    if (rest.length > 0) groups.push({ tier: '其他', ninjas: rest })
    return groups
  }, [sortedNinjas, tierGrouping])

  const filteredScrolls = useMemo(() => {
    const kw = search.trim().toLowerCase()
    const list = kw ? scrolls.filter(s => s.name.toLowerCase().includes(kw)) : scrolls
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }, [scrolls, search])

  const filteredSummons = useMemo(() => {
    const kw = search.trim().toLowerCase()
    const list = kw ? summons.filter(s => s.name.toLowerCase().includes(kw)) : summons
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }, [summons, search])

  const modeHint = draft.mode === 'all'
    ? '全部忍者、密卷、通灵都可用'
    : draft.mode === 'select'
      ? '只有勾选的项目可用；列表为空时按全部可用处理'
      : '勾选的项目不可用'

  const renderFlatGrid = (kind: 'scrolls' | 'summons', items: { id: string; name: string; imageUrl: string }[]) => (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-80 overflow-y-auto">
      {items.map(item => {
        const usable = poolAllows(draft, kind, item.id)
        return (
          <div
            key={item.id}
            className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${usable ? 'hover:bg-muted/50' : 'opacity-40 grayscale'}`}
            onClick={() => toggleItem(kind, item.id)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border/40 bg-card">
              <Image src={item.imageUrl} alt={item.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <span className={`text-xs text-center leading-tight ${usable ? 'text-foreground' : 'text-destructive line-through'}`}>
              {item.name}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>我的忍者池</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">模式：</span>
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            {(['all', 'select', 'disable'] as PoolMode[]).map(m => (
              <button
                key={m}
                onClick={() => setDraft(prev => ({ ...prev, mode: m }))}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${draft.mode === m ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m === 'all' ? '全部' : m === 'select' ? '选用' : '排除'}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{modeHint}</span>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="shrink-0">
            <TabsTrigger value="ninjas">忍者</TabsTrigger>
            <TabsTrigger value="scrolls">密卷</TabsTrigger>
            <TabsTrigger value="summons">通灵</TabsTrigger>
          </TabsList>

          <div className="flex shrink-0 items-center gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tab === 'ninjas' ? '搜索忍者...' : tab === 'scrolls' ? '搜索密卷...' : '搜索通灵...'}
                className="pl-9 pr-9"
              />
              {search && (
                <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearch('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {tab === 'ninjas' && (
              <div className="flex shrink-0 items-center gap-2">
                <Label htmlFor="pool-tier-toggle" className="cursor-pointer select-none text-xs">
                  按忍者梯度排行
                </Label>
                <Switch
                  id="pool-tier-toggle"
                  checked={tierGrouping}
                  onCheckedChange={setTierGrouping}
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearKind(tab as PoolKind)}
              disabled={draft.mode === 'all'}
            >
              清空列表
            </Button>
          </div>

          <TabsContent value="ninjas" className="flex-1 min-h-0 overflow-auto">
            <div className="space-y-4 mt-3">
              {groupedNinjas.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">无匹配忍者</p>
              ) : groupedNinjas.map(group => {
                const ids = group.ninjas.map(n => n.id)
                const allIn = ids.length > 0 && ids.every(id => draft.ninjas.includes(id))
                return (
                  <div key={group.tier}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-sm font-bold">{group.tier}</Badge>
                      <button
                        className="text-xs text-primary hover:underline shrink-0 disabled:opacity-40"
                        disabled={draft.mode === 'all'}
                        onClick={() => setMany('ninjas', ids, !allIn)}
                      >
                        {group.tier === '全部'
                          ? (allIn ? '取消全选' : '全选')
                          : draft.mode === 'select'
                            ? (allIn ? '取消选用整梯度' : '选用整梯度')
                            : (allIn ? '取消排除整梯度' : '排除整梯度')}
                      </button>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {group.ninjas.map(ninja => {
                        const usable = poolAllows(draft, 'ninjas', ninja.id)
                        return (
                          <div
                            key={ninja.id}
                            className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${usable ? 'hover:bg-muted/50' : 'opacity-40 grayscale'}`}
                            onClick={() => toggleItem('ninjas', ninja.id)}
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                              <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-xs text-center leading-tight ${usable ? 'text-foreground' : 'text-destructive line-through'}`}>
                              {ninja.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="scrolls" className="flex-1 min-h-0 overflow-auto">
            <div className="mt-3">
              {filteredScrolls.length === 0
                ? <p className="text-center text-sm text-muted-foreground py-8">无匹配密卷</p>
                : renderFlatGrid('scrolls', filteredScrolls)}
            </div>
          </TabsContent>

          <TabsContent value="summons" className="flex-1 min-h-0 overflow-auto">
            <div className="mt-3">
              {filteredSummons.length === 0
                ? <p className="text-center text-sm text-muted-foreground py-8">无匹配通灵</p>
                : renderFlatGrid('summons', filteredSummons)}
            </div>
          </TabsContent>
        </Tabs>

        {(usableNinjas < 6 || usableScrolls < 3 || usableSummons < 3) && (
          <p className="shrink-0 text-xs text-destructive">
            可用数量偏少时，手动 BP 可能选不满；超时随机会自动从全部项目补齐。
          </p>
        )}

        <div className="flex shrink-0 items-center justify-between gap-3 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            可用：忍者 {usableNinjas}/{ninjas.length}，密卷 {usableScrolls}/{scrolls.length}，通灵 {usableSummons}/{summons.length}
          </p>
          <Button size="sm" onClick={() => handleOpenChange(false)}>完成</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
