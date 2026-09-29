import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'
import type { IBPCounter } from '@/data/battleBp'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'

interface Props {
  ninja: INinja | null
  open: boolean
  onOpenChange: (open: boolean) => void
  ninjas: INinja[]
  counters: IBPCounter[]
  scrolls: IScroll[]
  summons: ISummon[]
  availableNinjaIds?: Set<string>
}

export default function NinjaInfoDialog({
  ninja, open, onOpenChange, ninjas, counters, scrolls, summons, availableNinjaIds,
}: Props) {
  if (!ninja) return null

  const lookup = (id: string) => ninjas.find(n => n.id === id)
  const inPool = (id: string) => !availableNinjaIds || availableNinjaIds.has(id)

  const counterData = counters.find(c => c.ninjaId === ninja.id)
  const counteredBy = (counterData?.counterNinjaIds || [])
    .filter(inPool)
    .map(id => ({ n: lookup(id), score: counterData?.counterNinjaScores?.[id] ?? 0 }))
    .filter(x => x.n)
    .sort((a, b) => b.score - a.score)

  const countered = counters
    .filter(c => c.counterNinjaIds.includes(ninja.id) && inPool(c.ninjaId))
    .map(c => lookup(c.ninjaId))
    .filter(Boolean) as INinja[]

  const scrollList = (counterData?.counterScrollIds || [])
    .map(id => scrolls.find(s => s.id === id))
    .filter(Boolean) as IScroll[]

  const summonList = (counterData?.counterSummonIds || [])
    .map(id => summons.find(s => s.id === id))
    .filter(Boolean) as ISummon[]

  const hasData = counteredBy.length > 0 || countered.length > 0 || scrollList.length > 0 || summonList.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{ninja.name}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-2/5 shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-center mt-2">
                <Badge variant={ninja.blindPick ? 'default' : 'secondary'}>
                  {ninja.blindPick ? '盲选位' : '非盲选'}
                </Badge>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {hasData ? (
                <>
                  {counteredBy.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">被克制</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {counteredBy.map(({ n, score }) => (
                          <div key={n!.id} className="flex flex-col items-center w-14">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                              <Image src={n!.imageUrl} alt={n!.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{n!.name}</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {score > 0 ? `+${score}` : score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {countered.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">克制</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {countered.map(n => (
                          <div key={n.id} className="flex flex-col items-center w-14">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                              <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{n.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {scrollList.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">密卷</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {scrollList.map(s => (
                          <div key={s.id} className="flex flex-col items-center w-14">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                              <Image src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {summonList.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">通灵</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {summonList.map(sm => (
                          <div key={sm.id} className="flex flex-col items-center w-14">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border/40 bg-card">
                              <Image src={sm.imageUrl} alt={sm.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-full mt-0.5 text-center leading-tight">{sm.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">暂无克制数据</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}