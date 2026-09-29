import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { ScoreResult } from './recommend'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  result: ScoreResult | null
}

export default function ScoreDetailDialog({ open, onOpenChange, title, result }: Props) {
  if (!result) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title} - 评分详情</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 space-y-2">
          {result.details.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">无评分项</p>
          ) : (
            result.details.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 bg-muted/40 rounded px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{d.label}</p>
                  {d.description && (
                    <p className="text-xs text-muted-foreground truncate">{d.description}</p>
                  )}
                </div>
                <Badge
                  variant={d.value > 0 ? 'default' : d.value < 0 ? 'destructive' : 'secondary'}
                  className="shrink-0"
                >
                  {d.value > 0 ? `+${d.value}` : d.value}
                </Badge>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm font-medium">总分</span>
          <Badge variant={result.total > 0 ? 'default' : result.total < 0 ? 'destructive' : 'secondary'} className="text-base">
            {result.total > 0 ? `+${result.total}` : result.total}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}