import { Info } from 'lucide-react'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'

interface NinjaCountCardProps {
  ninja: INinja
  counteredBy: INinja[]    // 克制它的忍者
  countered: INinja[]      // 它克制的忍者
  showMiniIcons: boolean
  isPending: boolean
  onSelect: () => void
  onShowInfo: () => void
  score?: number
  onShowScore?: () => void
  warning?: boolean
}

export default function NinjaCountCard({
  ninja,
  counteredBy,
  countered,
  showMiniIcons,
  isPending,
  onSelect,
  onShowInfo,
  score,
  onShowScore,
  warning,
}: NinjaCountCardProps) {
  return (
    <div
      className={`cursor-pointer flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
        isPending ? 'bg-primary/10 border-2 border-red-500' : 'border-2 border-transparent hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      {/* 上方：红数字 或 克制它的忍者小图 */}
      {showMiniIcons ? (
        counteredBy.length > 0 ? (
          <div className="flex flex-wrap gap-0.5 justify-center max-w-[72px]">
            {counteredBy.map(n => (
              <div key={n.id} className="w-4 h-4 rounded-full overflow-hidden border border-border/60 bg-card">
                <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">0</span>
        )
      ) : (
        <span className={`text-xs font-bold ${counteredBy.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {counteredBy.length}
        </span>
      )}

      {/* 图片 */}
      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border/40 bg-card">
        <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
        {/* 右上角信息图标 */}
        <button
          className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-bl text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); onShowInfo() }}
          title="查看忍者信息"
        >
          <Info className="size-3" />
        </button>
        {/* 警示图标 */}
        {warning && (
          <span className="absolute top-0 left-0 w-4 h-4 flex items-center justify-center bg-yellow-500/80 text-white text-[10px] font-bold rounded-br">!</span>
        )}
      </div>

      {/* 下方：绿数字 或 它克制的忍者小图 */}
      {showMiniIcons ? (
        countered.length > 0 ? (
          <div className="flex flex-wrap gap-0.5 justify-center max-w-[72px]">
            {countered.map(n => (
              <div key={n.id} className="w-4 h-4 rounded-full overflow-hidden border border-border/60 bg-card">
                <Image src={n.imageUrl} alt={n.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">0</span>
        )
      ) : (
        <span className={`text-xs font-bold ${countered.length > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
          {countered.length}
        </span>
      )}

      {/* 名称 */}
      <span className="text-xs text-center leading-tight truncate w-full max-w-[72px]">{ninja.name}</span>

      {/* 分数（如有推荐） */}
      {score !== undefined && onShowScore && (
        <button
          className={`text-[10px] font-bold rounded px-1 ${
            score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
          } hover:bg-muted/60`}
          onClick={(e) => { e.stopPropagation(); onShowScore() }}
          title="查看评分详情"
        >
          {score > 0 ? `+${score}` : score}
        </button>
      )}
    </div>
  )
}