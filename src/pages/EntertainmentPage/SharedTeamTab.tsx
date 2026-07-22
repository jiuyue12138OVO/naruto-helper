import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'

interface SharedTeamTabProps {
  eligibleNinjas: INinja[]
  scrolls: IScroll[]
  disabledScrollIds: Set<string>
  randomScrollEnabled: boolean
  getNinjaScrollIds: (ninjaId: string) => string[]
}

export default function SharedTeamTab({
  eligibleNinjas,
  scrolls,
  disabledScrollIds,
  randomScrollEnabled,
  getNinjaScrollIds,
}: SharedTeamTabProps) {
  const [teamResult, setTeamResult] = useState<INinja[]>([])
  const [teamScrolls, setTeamScrolls] = useState<(string | null)[]>([])
  const [isTeamRolling, setIsTeamRolling] = useState(false)

  const assignScrolls = (ninjas: INinja[]) => {
    if (!randomScrollEnabled) return []
    // 按适配密卷数量升序排列，保证数量少的先选
    const withCounts = ninjas.map((n, idx) => ({
      idx,
      ninja: n,
      available: getNinjaScrollIds(n.id).filter(id => !disabledScrollIds.has(id)),
    }))
    const sorted = [...withCounts].sort((a, b) => a.available.length - b.available.length)
    const assigned: (string | null)[] = new Array(3).fill(null)
    const used = new Set<string>()
    sorted.forEach(({ idx, available }) => {
      const filtered = available.filter(id => !used.has(id))
      if (filtered.length > 0) {
        const picked = filtered[Math.floor(Math.random() * filtered.length)]
        used.add(picked)
        assigned[idx] = picked
      }
    })
    return assigned
  }

  const handleRandom = useCallback(() => {
    if (eligibleNinjas.length < 3) return
    setIsTeamRolling(true)
    const duration = 600
    const interval = 60
    const steps = duration / interval
    let count = 0
    const timer = setInterval(() => {
      const shuffled = [...eligibleNinjas].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 3)
      setTeamResult(selected)
      setTeamScrolls(assignScrolls(selected))
      count++
      if (count >= steps) {
        clearInterval(timer)
        const finalShuffled = [...eligibleNinjas].sort(() => Math.random() - 0.5)
        const finalSelected = finalShuffled.slice(0, 3)
        setTeamResult(finalSelected)
        setTeamScrolls(assignScrolls(finalSelected))
        setIsTeamRolling(false)
      }
    }, interval)
  }, [eligibleNinjas, randomScrollEnabled, getNinjaScrollIds, disabledScrollIds])

  return (
    <>
      <div className="flex items-center gap-3">
        <Button onClick={handleRandom} disabled={eligibleNinjas.length < 3 || isTeamRolling} className="gap-2">
          <span className="text-base">🎲</span>
          {isTeamRolling ? '抽取中...' : '随机抽取阵容'}
        </Button>
        {eligibleNinjas.length < 3 && (
          <span className="text-sm text-muted-foreground">需要至少3位符合条件的忍者</span>
        )}
      </div>
      <Card className="p-6 md:p-8">
        {teamResult.length > 0 ? (
          <motion.div
            key={teamResult.map(n => n.id).join(',') + Date.now()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {teamResult.map((ninja, idx) => (
                <div key={ninja.id} className="flex flex-col items-center text-center space-y-2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border bg-card shadow">
                    <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-sm">{ninja.name}</span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="secondary" className="text-xs">{ninja.tier}</Badge>
                    <Badge variant="outline" className="text-xs">{ninja.rating}</Badge>
                  </div>
                  {randomScrollEnabled && teamScrolls[idx] && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-6 h-6 rounded overflow-hidden border border-border/40 bg-card">
                        <Image src={scrolls.find(s => s.id === teamScrolls[idx])?.imageUrl ?? ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-muted-foreground">{scrolls.find(s => s.id === teamScrolls[idx])?.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Shuffle className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg">设置条件后点击抽取</p>
            <p className="text-sm mt-2">将随机选出3位不重复忍者</p>
          </div>
        )}
      </Card>
    </>
  )
}