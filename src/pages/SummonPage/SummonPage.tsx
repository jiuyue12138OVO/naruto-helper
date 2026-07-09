import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, Search, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ISummon } from '@/data/summons'
import { Image } from '@/components/ui/image'
import { useData } from '@/contexts/DataContext'

export default function SummonPage() {
  const { summons } = useData()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedSummon, setSelectedSummon] = useState<ISummon | null>(null)

  const filtered = useMemo(() => {
    if (!searchKeyword.trim()) return summons
    const kw = searchKeyword.toLowerCase()
    return summons.filter(s =>
      s.name.toLowerCase().includes(kw) ||
      s.skill.toLowerCase().includes(kw) ||
      s.description.toLowerCase().includes(kw)
    )
  }, [summons, searchKeyword])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">通灵兽<span className="text-primary">大全</span></h1>
          <p className="text-muted-foreground text-sm">点击图片查看详细信息</p>
        </div>

        {/* 搜索框 */}
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="搜索名称、技能或描述..." className="pl-9 pr-9" />
          {searchKeyword && (
            <Button size="icon" variant="ghost" className="!absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchKeyword('')}><X className="h-4 w-4" /></Button>
          )}
        </div>

        {/* 图片墙 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ScrollText className="size-12 mb-4 opacity-30" />
            <p className="text-lg">没有找到匹配的通灵兽</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
            {filtered.map((summon, i) => (
              <motion.div key={summon.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}
                whileHover={{ y: -4 }} className="cursor-pointer" onClick={() => setSelectedSummon(summon)}
              >
                <Card className="overflow-hidden border-border/40 bg-card/50 hover:bg-card/80 transition-colors aspect-square flex items-center justify-center p-1">
                  <Image src={summon.imageUrl} alt={summon.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                </Card>
                <p className="text-xs text-muted-foreground truncate text-center mt-1">{summon.name}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* 详情弹窗 */}
        <Dialog open={!!selectedSummon} onOpenChange={open => !open && setSelectedSummon(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>{selectedSummon?.name}</DialogTitle></DialogHeader>
            {selectedSummon && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image src={selectedSummon.imageUrl} alt={selectedSummon.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">技能：</p>
                  <p className="text-sm text-muted-foreground">{selectedSummon.skill}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">描述：</p>
                  <p className="text-sm text-muted-foreground">{selectedSummon.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}