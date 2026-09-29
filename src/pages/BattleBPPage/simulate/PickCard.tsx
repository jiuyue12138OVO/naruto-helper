import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'

interface PickCardProps {
  ninja: INinja
  isPending: boolean
  score: number
  warning?: boolean
  size?: 'sm' | 'md'
  onSelect: () => void
  onShowInfo: () => void
  onShowScore: () => void
}

export default function PickCard({
  ninja, isPending, score, warning, size = 'md', onSelect, onShowInfo, onShowScore,
}: PickCardProps) {
  const imgSize = size === 'sm' ? 'w-11 h-11' : 'w-14 h-14'
  return (
    <div
      className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
        isPending ? 'bg-primary/10 border-2 border-red-500' : 'border-2 border-transparent hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <div className={`relative ${imgSize} rounded-md overflow-hidden border border-border/40 bg-card`}>
        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
        <button
          className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-bl text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); onShowInfo() }}
          title="查看忍者信息"
        >
          <Info className="size-3" />
        </button>
        {warning && (
          <span className="absolute top-0 left-0 w-4 h-4 flex items-center justify-center bg-yellow-500/90 text-white text-[10px] font-bold rounded-br" title="存在额外克制风险">!</span>
        )}
      </div>
      <span className="text-xs text-center leading-tight truncate w-full max-w-[80px]">{ninja.name}</span>
      <Badge variant="outline" className="text-[10px] px-1">{ninja.tier}</Badge>
      <button
        className={`text-[10px] font-bold rounded px-1 ${
          score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
        } hover:bg-muted/60`}
        onClick={(e) => { e.stopPropagation(); onShowScore() }}
        title="查看评分详情"
      >
        {score > 0 ? `+${score}` : score}
      </button>
    </div>
  )
}