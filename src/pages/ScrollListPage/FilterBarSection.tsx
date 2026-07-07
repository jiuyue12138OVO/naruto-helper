import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FilterBarSectionProps {
  keyword: string
  onKeywordChange: (keyword: string) => void
}

export default function FilterBarSection({
  keyword,
  onKeywordChange,
}: FilterBarSectionProps) {
  return (
    <div className="relative max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="搜索密卷名称..."
        className="bg-background pl-9 pr-9"
      />
      {keyword && (
        <Button
          size="icon"
          variant="ghost"
          className="!absolute right-1.5 top-1/2 z-20 h-7 w-7 -translate-y-1/2"
          onClick={() => onKeywordChange('')}
          aria-label="清除"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}