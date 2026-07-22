import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import SlotFilterCard from './SlotFilterCard'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'

type FilterStatus = 'include' | 'exclude' | undefined

interface SlotState {
  tier: Record<string, FilterStatus>
  rating: Record<string, FilterStatus>
  tag: Record<string, FilterStatus>
  scroll: Record<string, FilterStatus>
}

interface TeamFiltersProps {
  ninjas: INinja[]
  disabledNinjaIds: Set<string>
  globalTierStatus: Record<string, FilterStatus>
  globalRatingStatus: Record<string, FilterStatus>
  globalTagStatus: Record<string, FilterStatus>
  getNinjaScrollIds: (id: string) => string[]
  globalIncludedScrolls: string[]
  globalExcludedScrolls: string[]
  scrolls: IScroll[]
  disabledScrollIds: Set<string>
  randomScrollEnabled: boolean
}

export default function RandomTeamTab({
  ninjas,
  disabledNinjaIds,
  globalTierStatus,
  globalRatingStatus,
  globalTagStatus,
  getNinjaScrollIds,
  globalIncludedScrolls,
  globalExcludedScrolls,
  scrolls,
  disabledScrollIds,
  randomScrollEnabled,
}: TeamFiltersProps) {
  const [teamResult, setTeamResult] = useState<INinja[]>([])
  const [teamScrolls, setTeamScrolls] = useState<(string | null)[]>([])
  const [isTeamRolling, setIsTeamRolling] = useState(false)

  const [slot0, setSlot0] = useState<SlotState>({ tier: {}, rating: {}, tag: {}, scroll: {} })
  const [slot1, setSlot1] = useState<SlotState>({ tier: {}, rating: {}, tag: {}, scroll: {} })
  const [slot2, setSlot2] = useState<SlotState>({ tier: {}, rating: {}, tag: {}, scroll: {} })

  const slotStates = [slot0, slot1, slot2]
  const setSlotStates = [setSlot0, setSlot1, setSlot2]

  const getEligibleForSlot = useCallback(
    (slotIdx: number) => {
      const slot = slotStates[slotIdx]
      const incTiers = Object.keys(slot.tier).filter(k => slot.tier[k] === 'include')
      const excTiers = Object.keys(slot.tier).filter(k => slot.tier[k] === 'exclude')
      const incRatings = Object.keys(slot.rating).filter(k => slot.rating[k] === 'include')
      const excRatings = Object.keys(slot.rating).filter(k => slot.rating[k] === 'exclude')
      const incTags = Object.keys(slot.tag).filter(k => slot.tag[k] === 'include')
      const excTags = Object.keys(slot.tag).filter(k => slot.tag[k] === 'exclude')
      const incScrolls = Object.keys(slot.scroll).filter(k => slot.scroll[k] === 'include')
      const excScrolls = Object.keys(slot.scroll).filter(k => slot.scroll[k] === 'exclude')

      return ninjas.filter(n => {
        if (disabledNinjaIds.has(n.id)) return false
        if (incTiers.length > 0 && !incTiers.includes(n.tier)) return false
        if (excTiers.length > 0 && excTiers.includes(n.tier)) return false
        if (incRatings.length > 0 && !incRatings.includes(n.rating)) return false
        if (excRatings.length > 0 && excRatings.includes(n.rating)) return false
        if (incTags.length > 0 && !incTags.every(tag => n.tags?.includes(tag))) return false
        if (excTags.length > 0 && excTags.some(tag => n.tags?.includes(tag))) return false
        const scrollIds = getNinjaScrollIds(n.id)
        if (incScrolls.length > 0 && !incScrolls.some(sid => scrollIds.includes(sid))) return false
        if (excScrolls.length > 0 && excScrolls.some(sid => scrollIds.includes(sid))) return false
        if (globalIncludedScrolls.length > 0 && !globalIncludedScrolls.some(sid => scrollIds.includes(sid))) return false
        if (globalExcludedScrolls.length > 0 && globalExcludedScrolls.some(sid => scrollIds.includes(sid))) return false
        return true
      })
    },
    [ninjas, disabledNinjaIds, slotStates, getNinjaScrollIds, globalIncludedScrolls, globalExcludedScrolls]
  )

  const eligibleSlots = useMemo(
    () => [getEligibleForSlot(0), getEligibleForSlot(1), getEligibleForSlot(2)],
    [getEligibleForSlot]
  )

  const canRoll = eligibleSlots.every(list => list.length > 0)

  const assignScrolls = (ninjas: INinja[]) => {
    if (!randomScrollEnabled || ninjas.length !== 3) return [null, null, null]
    // 按适配密卷数量升序，优先分配数量少的
    const withCounts = ninjas.map((n, idx) => ({
      idx,
      available: getNinjaScrollIds(n.id).filter(id => !disabledScrollIds.has(id)),
    }))
    const sorted = [...withCounts].sort((a, b) => a.available.length - b.available.length)
    const assigned: (string | null)[] = [null, null, null]
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
    if (!canRoll) return
    setIsTeamRolling(true)
    const duration = 600
    const interval = 60
    const steps = duration / interval
    let count = 0
    const timer = setInterval(() => {
      const res = eligibleSlots.map(list => list[Math.floor(Math.random() * list.length)])
      setTeamResult(res)
      setTeamScrolls(assignScrolls(res))
      count++
      if (count >= steps) {
        clearInterval(timer)
        const finalRes = eligibleSlots.map(list => list[Math.floor(Math.random() * list.length)])
        setTeamResult(finalRes)
        setTeamScrolls(assignScrolls(finalRes))
        setIsTeamRolling(false)
      }
    }, interval)
  }, [canRoll, eligibleSlots, randomScrollEnabled, getNinjaScrollIds, disabledScrollIds])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={handleRandom} disabled={!canRoll || isTeamRolling} className="gap-2">
          <span className="text-base">🎲</span>
          {isTeamRolling ? '抽取中...' : '随机抽取阵容'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map(idx => (
          <SlotFilterCard
            key={idx}
            slotIndex={idx}
            slotState={slotStates[idx]}
            setSlotState={setSlotStates[idx]}
            eligibleCount={eligibleSlots[idx].length}
          />
        ))}
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
                  <span className="text-xs text-muted-foreground">位置 {idx + 1}</span>
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
            <p className="text-sm mt-2">将按位置分别随机抽取</p>
          </div>
        )}
      </Card>
    </div>
  )
}