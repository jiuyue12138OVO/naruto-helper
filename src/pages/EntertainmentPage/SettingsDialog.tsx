import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'

const TIER_ORDER = ['天王', '伪天王', 't0顶', 't0上', 't0中', 't0下', '准t0']

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ninjas: INinja[]
  scrolls: IScroll[]
  mode: 'disable' | 'select'
  onModeChange: (mode: 'disable' | 'select') => void
  // 禁用模式
  disabledNinjaIds: Set<string>
  onToggleDisabledNinja: (id: string) => void
  clearDisabledNinjas: () => void
  disabledScrollIds: Set<string>
  onToggleDisabledScroll: (id: string) => void
  clearDisabledScrolls: () => void
  // 选用模式
  selectedNinjaIds: Set<string>
  onToggleSelectedNinja: (id: string) => void
  clearSelectedNinjas: () => void
  selectedScrollIds: Set<string>
  onToggleSelectedScroll: (id: string) => void
  clearSelectedScrolls: () => void
}

export default function SettingsDialog({
  open, onOpenChange, ninjas, scrolls, mode, onModeChange,
  disabledNinjaIds, onToggleDisabledNinja, clearDisabledNinjas,
  disabledScrollIds, onToggleDisabledScroll, clearDisabledScrolls,
  selectedNinjaIds, onToggleSelectedNinja, clearSelectedNinjas,
  selectedScrollIds, onToggleSelectedScroll, clearSelectedScrolls,
}: SettingsDialogProps) {
  const [settingsTab, setSettingsTab] = useState('ninjas')
  const [settingsSearch, setSettingsSearch] = useState('')

  // 决定当前模式下显示哪一个集合以及操作函数
  const isDisabledMode = mode === 'disable'
  const activeNinjaSet = isDisabledMode ? disabledNinjaIds : selectedNinjaIds
  const activeScrollSet = isDisabledMode ? disabledScrollIds : selectedScrollIds
  const toggleNinja = isDisabledMode ? onToggleDisabledNinja : onToggleSelectedNinja
  const toggleScroll = isDisabledMode ? onToggleDisabledScroll : onToggleSelectedScroll
  const clearNinjas = isDisabledMode ? clearDisabledNinjas : clearSelectedNinjas
  const clearScrolls = isDisabledMode ? clearDisabledScrolls : clearSelectedScrolls

  // 过滤忍者（搜索）
  const filteredNinjas = useMemo(() => {
    const kw = settingsSearch.trim().toLowerCase()
    return kw ? ninjas.filter(n => n.name.toLowerCase().includes(kw)) : ninjas
  }, [ninjas, settingsSearch])

  // 分组忍者
  const groupedSettingsNinjas = useMemo(() => {
    const groups: { tier: string; ninjas: INinja[] }[] = []
    TIER_ORDER.forEach(tier => {
      const list = filteredNinjas.filter(n => n.tier === tier)
      if (list.length) groups.push({ tier, ninjas: list })
    })
    return groups
  }, [filteredNinjas])

  // 过滤密卷
  const filteredSettingsScrolls = useMemo(() => {
    const kw = settingsSearch.trim().toLowerCase()
    return kw ? scrolls.filter(s => s.name.toLowerCase().includes(kw)) : scrolls
  }, [scrolls, settingsSearch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>随机设置</DialogTitle>
        </DialogHeader>

        {/* 模式切换 */}
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-muted-foreground">模式：</span>
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => onModeChange('disable')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'disable' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              禁用
            </button>
            <button
              onClick={() => onModeChange('select')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'select' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              选用
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {mode === 'disable' ? '排除选中的忍者/密卷' : '只随机选中的忍者/密卷'}
          </span>
        </div>

        <Tabs value={settingsTab} onValueChange={setSettingsTab} className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="ninjas">忍者</TabsTrigger>
            <TabsTrigger value="scrolls">密卷</TabsTrigger>
          </TabsList>

          {/* 忍者列表 */}
          <TabsContent value="ninjas" className="flex-1 overflow-auto">
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={settingsSearch}
                    onChange={e => setSettingsSearch(e.target.value)}
                    placeholder="搜索忍者..."
                    className="pl-9 pr-9"
                  />
                  {settingsSearch && (
                    <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSettingsSearch('')}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearNinjas} disabled={activeNinjaSet.size === 0}>
                  清空列表
                </Button>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {groupedSettingsNinjas.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">无匹配忍者</p>
                ) : (
                  groupedSettingsNinjas.map(group => (
                    <div key={group.tier}>
                      <Badge variant="outline" className="mb-2 text-sm font-bold">{group.tier}</Badge>
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {group.ninjas.map(ninja => {
                          const isActive = activeNinjaSet.has(ninja.id)
                          const isDisabled = isActive !== isDisabledMode // 逻辑：若在禁用模式且被禁用则灰掉，若在选用模式且未被选用则灰掉
                          const isGray = (mode === 'disable' && isActive) || (mode === 'select' && !isActive)
                          return (
                            <div
                              key={ninja.id}
                              className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isGray ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                              onClick={() => toggleNinja(ninja.id)}
                            >
                              <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                                <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                              </div>
                              <span className={`text-xs text-center leading-tight ${isGray ? 'text-destructive line-through' : 'text-foreground'}`}>
                                {ninja.name}
                              </span>
                              {isGray && <span className="text-[10px] text-destructive">{mode === 'disable' ? '已禁用' : '未选用'}</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* 密卷列表 */}
          <TabsContent value="scrolls" className="flex-1 overflow-auto">
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={settingsSearch}
                    onChange={e => setSettingsSearch(e.target.value)}
                    placeholder="搜索密卷..."
                    className="pl-9 pr-9"
                  />
                  {settingsSearch && (
                    <Button variant="ghost" size="icon" className="!absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSettingsSearch('')}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearScrolls} disabled={activeScrollSet.size === 0}>
                  清空列表
                </Button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-80 overflow-y-auto">
                {filteredSettingsScrolls.map(scroll => {
                  const isActive = activeScrollSet.has(scroll.id)
                  const isGray = (mode === 'disable' && isActive) || (mode === 'select' && !isActive)
                  return (
                    <div
                      key={scroll.id}
                      className={`cursor-pointer flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${isGray ? 'opacity-40 grayscale' : 'hover:bg-muted/50'}`}
                      onClick={() => toggleScroll(scroll.id)}
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
                        <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-xs text-center leading-tight ${isGray ? 'text-destructive line-through' : 'text-foreground'}`}>
                        {scroll.name}
                      </span>
                      {isGray && <span className="text-[10px] text-destructive">{mode === 'disable' ? '已禁用' : '未选用'}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}