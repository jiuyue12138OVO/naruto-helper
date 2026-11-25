import { useEffect, useMemo, useRef, useState } from 'react'
import { PanelBottom, PanelLeft, PanelRight, Plus, Search, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { INinja } from '@/data/ninjas'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/utils'

export interface CustomTier {
  id: string
  name: string
  ninjaIds: string[]
}

type Dock = 'bottom' | 'left' | 'right'

const STORAGE_KEY = 'ninja_custom_tiers'

const OFFICIAL_TIER_ORDER = [
  '天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0', 't1', '准t1', 't2', 't3', '...',
]

const OFFICIAL_TIER_TONES: Record<string, string> = {
  '天王': 'bg-red-500/10 text-red-500 border-red-500/20',
  '伪天王': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  't0顶': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  't0上': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  't0中': 'bg-green-500/10 text-green-500 border-green-500/20',
  't0下': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '准t0': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  't1': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  '准t1': 'bg-gray-400/10 text-gray-400 border-gray-400/20',
  't2': 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
  't3': 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  '...': 'bg-stone-500/10 text-stone-500 border-stone-500/20',
}

function loadTiers(): CustomTier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((t: any) => t && typeof t.id === 'string' && Array.isArray(t.ninjaIds))
      .map((t: any) => ({
        id: t.id,
        name: typeof t.name === 'string' ? t.name : '',
        ninjaIds: t.ninjaIds.filter((id: any) => typeof id === 'string'),
      }))
  } catch {
    return []
  }
}

const POOL_MIN_HEIGHT = 0
const POOL_DEFAULT_HEIGHT = 320
const POOL_MIN_WIDTH = 0
const HANDLE_SIZE = 12

export default function CustomTierBoard({ ninjas }: { ninjas: INinja[] }) {
  const [tiers, setTiers] = useState<CustomTier[]>(loadTiers)
  const [keyword, setKeyword] = useState('')
  const [activeTierId, setActiveTierId] = useState<string | null>(null)
  const [dragOverTierId, setDragOverTierId] = useState<string | null>(null)
  const [groupByTier, setGroupByTier] = useState(false)

  const [dock, setDock] = useState<Dock>('bottom')
  const [poolHeight, setPoolHeight] = useState(POOL_DEFAULT_HEIGHT)
  const [poolWidth, setPoolWidth] = useState(() =>
    typeof window === 'undefined' ? 360 : Math.round(window.innerWidth / 4)
  )
  const [resizing, setResizing] = useState(false)
  const resizeRef = useRef<{
    axis: 'x' | 'y'
    sign: number
    start: number
    startSize: number
  } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tiers))
    } catch {
      // 本地存储不可用时只保留当前会话
    }
  }, [tiers])

  useEffect(() => {
    if (!resizing) return
    const onMove = (e: PointerEvent) => {
      const start = resizeRef.current
      if (!start) return
      const delta = start.axis === 'x' ? e.clientX - start.start : e.clientY - start.start
      const raw = start.startSize + start.sign * delta
      if (start.axis === 'y') {
        const max = Math.max(window.innerHeight - 110, POOL_MIN_HEIGHT)
        setPoolHeight(Math.min(Math.max(raw, POOL_MIN_HEIGHT), max))
      } else {
        const max = Math.max(window.innerWidth - 80, POOL_MIN_WIDTH)
        setPoolWidth(Math.min(Math.max(raw, POOL_MIN_WIDTH), max))
      }
    }
    const onUp = () => setResizing(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [resizing])

  const beginResize = (e: React.PointerEvent) => {
    e.preventDefault()
    if (dock === 'bottom') {
      resizeRef.current = { axis: 'y', sign: -1, start: e.clientY, startSize: poolHeight }
    } else {
      resizeRef.current = {
        axis: 'x',
        sign: dock === 'left' ? 1 : -1,
        start: e.clientX,
        startSize: poolWidth,
      }
    }
    setResizing(true)
  }

  const ninjaMap = useMemo(() => new Map(ninjas.map((n) => [n.id, n])), [ninjas])

  const sortedNinjas = useMemo(
    () =>
      [...ninjas].sort(
        (a, b) =>
          (a.gameOrder ?? Number.MAX_SAFE_INTEGER) - (b.gameOrder ?? Number.MAX_SAFE_INTEGER)
      ),
    [ninjas]
  )

  const poolNinjas = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return sortedNinjas.filter((n) => !kw || n.name.toLowerCase().includes(kw))
  }, [sortedNinjas, keyword])

  const activeTier = tiers.find((t) => t.id === activeTierId) ?? tiers[0] ?? null

  const ownerOf = (ninjaId: string) =>
    tiers.find((t) => t.ninjaIds.includes(ninjaId)) ?? null

  const addTier = () => {
    setTiers((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, name: `梯度 ${prev.length + 1}`, ninjaIds: [] },
    ])
  }

  const renameTier = (id: string, name: string) => {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
  }

  const removeTier = (id: string) => {
    setTiers((prev) => prev.filter((t) => t.id !== id))
  }

  const removeNinja = (tierId: string, ninjaId: string) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, ninjaIds: t.ninjaIds.filter((x) => x !== ninjaId) }
          : t
      )
    )
  }

  const addNinja = (tierId: string, ninjaId: string) => {
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id === tierId) {
          return t.ninjaIds.includes(ninjaId)
            ? t
            : { ...t, ninjaIds: [...t.ninjaIds, ninjaId] }
        }
        return t.ninjaIds.includes(ninjaId)
          ? { ...t, ninjaIds: t.ninjaIds.filter((x) => x !== ninjaId) }
          : t
      })
    )
  }

  const handlePoolClick = (ninjaId: string) => {
    const owner = ownerOf(ninjaId)
    if (owner) {
      removeNinja(owner.id, ninjaId)
      return
    }
    if (activeTier) addNinja(activeTier.id, ninjaId)
  }

  const handleDrop = (e: React.DragEvent, tierId: string) => {
    e.preventDefault()
    const ninjaId =
      e.dataTransfer.getData('text/ninja-id') || e.dataTransfer.getData('text/plain')
    if (ninjaId) addNinja(tierId, ninjaId)
    setDragOverTierId(null)
  }

  const startDrag = (e: React.DragEvent, ninjaId: string) => {
    e.dataTransfer.setData('text/ninja-id', ninjaId)
    e.dataTransfer.setData('text/plain', ninjaId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const renderPoolCard = (ninja: INinja) => {
    const owner = ownerOf(ninja.id)
    return (
      <div
        key={ninja.id}
        draggable
        onDragStart={(e) => startDrag(e, ninja.id)}
        onClick={() => handlePoolClick(ninja.id)}
        title={owner ? `已在「${owner.name}」，点击移除` : '点击加入所选梯度，或拖到上方梯度'}
        className={cn(
          'cursor-grab select-none rounded-md border p-1 text-center transition-colors active:cursor-grabbing',
          owner ? 'border-primary/50 bg-primary/10' : 'border-border/40 hover:bg-muted/50'
        )}
      >
        <div className="overflow-hidden rounded aspect-square">
          <Image
            src={ninja.imageUrl}
            alt={ninja.name}
            className="h-full w-full object-contain"
          />
        </div>
        <p className="mt-1 truncate text-xs">{ninja.name}</p>
        <p className="h-3 truncate text-[10px] text-primary">{owner ? owner.name : ''}</p>
      </div>
    )
  }

  const rootStyle =
    dock === 'bottom'
      ? { paddingBottom: poolHeight + 96 }
      : dock === 'left'
        ? { paddingLeft: poolWidth + HANDLE_SIZE + 12 }
        : { paddingRight: poolWidth + HANDLE_SIZE + 12 }

  const panelClass =
    dock === 'bottom'
      ? 'fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur'
      : dock === 'left'
        ? 'fixed bottom-0 left-0 top-0 z-30 border-r border-border bg-background/95 backdrop-blur'
        : 'fixed bottom-0 right-0 top-0 z-30 border-l border-border bg-background/95 backdrop-blur'

  const gridClass = 'grid gap-2'

  // 底部按页面宽度、侧边按面板宽度自动排布列数，卡片尺寸保持稳定
  const gridStyle = {
    gridTemplateColumns: `repeat(auto-fill, minmax(${dock === 'bottom' ? 68 : 60}px, 1fr))`,
  }

  const handleHorizontal = (
    <div
      onPointerDown={beginResize}
      title="上下拖动可调整全部忍者区域高度，拖到底可完全收起"
      className="flex h-5 cursor-row-resize touch-none items-center justify-center"
    >
      <div className="h-1 w-16 rounded-full bg-border" />
    </div>
  )

  const handleVertical = (
    <div
      onPointerDown={beginResize}
      title="左右拖动可调整全部忍者区域宽度，拖到底可完全收起"
      className="flex w-3 shrink-0 cursor-col-resize touch-none items-center justify-center bg-transparent"
    >
      <div className="h-24 w-1 rounded-full bg-border" />
    </div>
  )

  const dockButtons = (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant={dock === 'bottom' ? 'default' : 'outline'}
        className="px-2"
        title="停靠到底部"
        onClick={() => setDock('bottom')}
      >
        <PanelBottom className="size-4" />
      </Button>
      <Button
        size="sm"
        variant={dock === 'left' ? 'default' : 'outline'}
        className="px-2"
        title="停靠到左侧"
        onClick={() => setDock('left')}
      >
        <PanelLeft className="size-4" />
      </Button>
      <Button
        size="sm"
        variant={dock === 'right' ? 'default' : 'outline'}
        className="px-2"
        title="停靠到右侧"
        onClick={() => setDock('right')}
      >
        <PanelRight className="size-4" />
      </Button>
    </div>
  )

  const toolbar = (
    <div
      className={cn(
        'mb-2 flex shrink-0 gap-2',
        dock === 'bottom' ? 'flex-wrap items-center' : 'flex-col items-stretch'
      )}
    >
      <span className="text-sm font-medium">全部忍者</span>
      <span className="text-xs text-muted-foreground">点击加入</span>
      <Select
        value={activeTier?.id}
        onValueChange={setActiveTierId}
        disabled={tiers.length === 0}
      >
        <SelectTrigger className={cn('h-8', dock === 'bottom' ? 'w-32' : 'w-full')}>
          <SelectValue placeholder="选择梯度" />
        </SelectTrigger>
        <SelectContent>
          {tiers.map((tier) => (
            <SelectItem key={tier.id} value={tier.id}>
              {tier.name || '未命名梯度'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant={groupByTier ? 'default' : 'outline'}
        onClick={() => setGroupByTier((v) => !v)}
      >
        {groupByTier ? '按编号排列' : '按官方梯度排列'}
      </Button>
      {dockButtons}
      <div className={cn('relative', dock === 'bottom' ? 'ml-auto w-48' : 'w-full')}>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索忍者..."
          className="h-8 pl-9"
        />
      </div>
    </div>
  )

  const content = (
    <div
      className={cn('overflow-x-hidden overflow-y-auto pr-1', dock === 'bottom' ? '' : 'min-h-0 flex-1')}
      style={dock === 'bottom' ? { height: poolHeight } : undefined}
    >
      {groupByTier ? (
        <div className={dock === 'bottom' ? 'space-y-3' : 'space-y-3'}>
          {OFFICIAL_TIER_ORDER.map((tierName) => {
            const list = poolNinjas.filter((n) => n.tier === tierName)
            if (list.length === 0) return null
            return (
              <div key={tierName}>
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-bold px-2 py-0.5', OFFICIAL_TIER_TONES[tierName])}
                  >
                    {tierName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{list.length} 位</span>
                </div>
                <div className={gridClass} style={gridStyle}>{list.map(renderPoolCard)}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={gridClass} style={gridStyle}>{poolNinjas.map(renderPoolCard)}</div>
      )}
    </div>
  )

  return (
    <div className="space-y-4" style={rootStyle}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">忍者排档</h2>
          <p className="text-sm text-muted-foreground">
            拖动忍者可跨梯度调整，点击已加入的忍者即可移除。
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={addTier}>
          <Plus className="size-4" />
          新增梯度
        </Button>
      </div>

      {tiers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          还没有梯度，点击「新增梯度」开始。
        </div>
      ) : (
        tiers.map((tier) => {
          const isDragOver = dragOverTierId === tier.id
          return (
            <div
              key={tier.id}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                if (dragOverTierId !== tier.id) setDragOverTierId(tier.id)
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverTierId((prev) => (prev === tier.id ? null : prev))
                }
              }}
              onDrop={(e) => handleDrop(e, tier.id)}
              className={cn(
                'rounded-lg border bg-card/40 p-4 transition-colors',
                isDragOver ? 'border-primary bg-primary/10' : 'border-border'
              )}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Input
                  value={tier.name}
                  onChange={(e) => renameTier(tier.id, e.target.value)}
                  maxLength={12}
                  placeholder="梯度名称"
                  className="h-8 w-40"
                />
                <span className="text-sm text-muted-foreground">
                  {tier.ninjaIds.length} 位忍者
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  onClick={() => removeTier(tier.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {tier.ninjaIds.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">
                  把下方忍者拖到这里即可加入。
                </p>
              ) : (
                <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {tier.ninjaIds.map((id) => {
                    const ninja = ninjaMap.get(id)
                    if (!ninja) return null
                    return (
                      <div
                        key={id}
                        className="group relative"
                        draggable
                        onDragStart={(e) => startDrag(e, id)}
                      >
                        <div className="aspect-square cursor-grab overflow-hidden rounded-md border border-border/40 bg-card active:cursor-grabbing">
                          <Image
                            src={ninja.imageUrl}
                            alt={ninja.name}
                            className="pointer-events-none h-full w-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          aria-label={`移除 ${ninja.name}`}
                          onClick={() => removeNinja(tier.id, id)}
                          className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="size-3" />
                        </button>
                        <p className="mt-1 truncate text-center text-xs text-muted-foreground">
                          {ninja.name}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}

      <div className={panelClass} style={dock === 'bottom' ? undefined : { width: poolWidth + HANDLE_SIZE }}>
        {dock === 'bottom' && (
          <div className="mx-auto w-full max-w-7xl px-4 pb-3 md:px-6">
            {handleHorizontal}
            {toolbar}
            {content}
          </div>
        )}

        {dock === 'left' && (
          <div className="flex h-full">
            <div
              className="flex min-w-0 flex-1 flex-col overflow-hidden px-3 py-2"
              style={{ width: poolWidth }}
            >
              {toolbar}
              {content}
            </div>
            {handleVertical}
          </div>
        )}

        {dock === 'right' && (
          <div className="flex h-full">
            {handleVertical}
            <div
              className="flex min-w-0 flex-1 flex-col overflow-hidden px-3 py-2"
              style={{ width: poolWidth }}
            >
              {toolbar}
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
