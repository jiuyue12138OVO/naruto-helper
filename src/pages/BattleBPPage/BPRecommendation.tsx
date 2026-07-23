import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Card } from '@/components/ui/card'
import { useData } from '@/contexts/DataContext'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { ISummon } from '@/data/summons'
import type { IBPCounter } from '@/data/battleBp'

interface ActiveSlot {
  type: 'ban' | 'pick' | 'scroll' | 'summon'
  player: '1P' | '2P'
  index: number
}

interface Props {
  myRole: '1P' | '2P'
  phase: string
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  myScrollHistory: Set<string>
  opponentScrollHistory: Set<string>
  mySummonHistory: Set<string>
  opponentSummonHistory: Set<string>
  currentScrolls1P: (string | null)[]
  currentScrolls2P: (string | null)[]
  currentSummons1P: (string | null)[]
  currentSummons2P: (string | null)[]
  activeSlot: ActiveSlot | null
  onSelectNinja?: (ninja: INinja) => void
  onSelectScroll?: (scroll: IScroll) => void
  onSelectSummon?: (summon: ISummon) => void
  pendingNinjaId?: string
  pendingScrollId?: string
  pendingSummonId?: string
}

const TIER_WEIGHT: Record<string, number> = {
  '天王': 5, '伪天王': 4, 't0顶': 3, 't0上': 2, 't0中': 1, 't0下': 0, '准t0': -1,
}

export default function BPRecommendation({
  myRole, phase, team1P, team2P, usedNinjas, banned1P, banned2P,
  myScrollHistory, opponentScrollHistory, mySummonHistory, opponentSummonHistory,
  currentScrolls1P, currentScrolls2P, currentSummons1P, currentSummons2P,
  activeSlot, onSelectNinja, onSelectScroll, onSelectSummon,
  pendingNinjaId, pendingScrollId, pendingSummonId,
}: Props) {
  const { ninjas, scrolls, summons, counters } = useData()

  const myTeam = (myRole === '1P' ? team1P : team2P).filter(Boolean) as INinja[]
  const enemyTeam = (myRole === '1P' ? team2P : team1P).filter(Boolean) as INinja[]

  const { ninjaCounters, scrollCounters, summonCounters } = useMemo(() => {
    const ninjaMap = new Map<string, string[]>()
    const scrollMap = new Map<string, string[]>()
    const summonMap = new Map<string, string[]>()
    counters.forEach((c: IBPCounter) => {
      c.counterNinjaIds.forEach(id => {
        if (!ninjaMap.has(id)) ninjaMap.set(id, [])
        ninjaMap.get(id)!.push(c.ninjaId)
      })
      c.counterScrollIds.forEach(id => {
        if (!scrollMap.has(id)) scrollMap.set(id, [])
        scrollMap.get(id)!.push(c.ninjaId)
      })
      c.counterSummonIds.forEach(id => {
        if (!summonMap.has(id)) summonMap.set(id, [])
        summonMap.get(id)!.push(c.ninjaId)
      })
    })
    return { ninjaCounters: ninjaMap, scrollCounters: scrollMap, summonCounters: summonMap }
  }, [counters])

  const counterDataMap = useMemo(() => {
    const map = new Map<string, IBPCounter>()
    counters.forEach(c => map.set(c.ninjaId, c))
    return map
  }, [counters])

  const getCounteredByNinjas = (ninjaId: string) => {
    const result: string[] = []
    counters.forEach(c => {
      if (c.counterNinjaIds.includes(ninjaId)) result.push(c.ninjaId)
    })
    return result
  }

  const ninjaRecommendations = useMemo(() => {
    if (phase !== 'pick' || !activeSlot || activeSlot.type !== 'pick') return null
    const { player, index } = activeSlot
    const bannedIds = new Set([
      ...banned1P.filter(Boolean).map(n => n!.id),
      ...banned2P.filter(Boolean).map(n => n!.id),
    ])
    const candidates = ninjas.filter(n =>
      !usedNinjas.has(n.id) && !bannedIds.has(n.id) && !myTeam.some(m => m.id === n.id) && !enemyTeam.some(e => e.id === n.id)
    )
    const enemyIds = enemyTeam.map(e => e.id)
    const is1P = player === '1P'

    const scored = candidates.map(ninja => {
      let score = 0
      const myCounter = ninjaCounters.get(ninja.id) || []
      const counteredBy = getCounteredByNinjas(ninja.id)

      if (is1P) {
        if (index === 0) {
          if (ninja.blindPick) score += 6
          score += (TIER_WEIGHT[ninja.tier] || 0)
        } else if (index === 1) {
          const targetE = team2P[1]?.id
          const targetD = team2P[0]?.id
          if (targetE && myCounter.includes(targetE)) score += 5
          if (targetD && myCounter.includes(targetD)) score += 3
          if (targetE && counteredBy.includes(targetE)) score -= 4
          if (targetD && counteredBy.includes(targetD)) score -= 2
          score += (TIER_WEIGHT[ninja.tier] || 0)
        } else {
          if (ninja.blindPick) score += 6
          score += (TIER_WEIGHT[ninja.tier] || 0)
        }
      } else {
        if (index === 0) {
          const targetC = team1P[0]?.id
          if (targetC && myCounter.includes(targetC)) score += 5
          if (ninja.blindPick) score += 3
          score += (TIER_WEIGHT[ninja.tier] || 0)
        } else if (index === 1) {
          let counterCount = 0
          const remainingEnemy = team1P.filter(Boolean).map(n => n!.id)
          remainingEnemy.forEach(id => {
            const cd = counterDataMap.get(id)
            if (cd && cd.counterNinjaIds.includes(ninja.id)) counterCount++
          })
          score -= counterCount * 3
          if (ninja.blindPick) score += 4
          score += (TIER_WEIGHT[ninja.tier] || 0)
        } else {
          const targetA = team1P[2]?.id
          const targetB = team1P[1]?.id
          const targetC = team1P[0]?.id
          if (targetA && myCounter.includes(targetA)) score += 5
          if (targetB && myCounter.includes(targetB)) score += 3
          if (targetC && counteredBy.includes(targetC)) score -= 5
          score += (TIER_WEIGHT[ninja.tier] || 0)
        }
      }
      return { ninja, score }
    })
    scored.sort((a, b) => b.score - a.score)
    const filtered = scored.filter(item => item.score > 0).slice(0, 8)
    return filtered.length > 0 ? filtered : null
  }, [phase, activeSlot, ninjas, usedNinjas, banned1P, banned2P, myTeam, enemyTeam, team1P, team2P, ninjaCounters, counterDataMap])

  const scrollRecommendations = useMemo(() => {
    if (phase !== 'scrolls' || !activeSlot || activeSlot.type !== 'scroll') return null
    const { player, index } = activeSlot
    const is1P = player === '1P'
    const history = is1P ? myScrollHistory : opponentScrollHistory
    const current = is1P ? currentScrolls1P : currentScrolls2P
    const usedThisGame = new Set(current.filter((id): id is string => id !== null))
    const candidates = scrolls.filter(s => !history.has(s.id) && !usedThisGame.has(s.id))

    const enemySlots = is1P ? team2P : team1P
    const slotMap: Record<number, number[]> = {
      0: [0, 1],
      1: [1, 0, 2],
      2: [2, 1],
    }
    const relevantSlots = slotMap[index] || []
    const targetIds = new Set<string>()
    relevantSlots.forEach(i => {
      const n = enemySlots[i]
      if (n) targetIds.add(n.id)
    })

    const scored = candidates.map(scroll => {
      const countersList = scrollCounters.get(scroll.id) || []
      let score = 0
      const directEnemy = enemySlots[index]
      if (directEnemy && countersList.includes(directEnemy.id)) score += 5
      targetIds.forEach(id => {
        if (countersList.includes(id)) score += 3
      })
      return { scroll, score }
    })
    scored.sort((a, b) => b.score - a.score)
    const filtered = scored.filter(item => item.score > 0).slice(0, 8)
    return filtered.length > 0 ? filtered : null
  }, [phase, activeSlot, scrolls, myScrollHistory, opponentScrollHistory, currentScrolls1P, currentScrolls2P, team1P, team2P, scrollCounters])

  const summonRecommendations = useMemo(() => {
    if (phase !== 'summons' || !activeSlot || activeSlot.type !== 'summon') return null
    const { player, index } = activeSlot
    const is1P = player === '1P'
    const history = is1P ? mySummonHistory : opponentSummonHistory
    const current = is1P ? currentSummons1P : currentSummons2P
    const usedThisGame = new Set(current.filter((id): id is string => id !== null))
    const candidates = summons.filter(s => !history.has(s.id) && !usedThisGame.has(s.id))
    const enemySlots = is1P ? team2P : team1P

    // 与密卷相同的对位/邻位逻辑
    const slotMap: Record<number, number[]> = {
      0: [0, 1],
      1: [1, 0, 2],
      2: [2, 1],
    }
    const relevantSlots = slotMap[index] || []
    const targetIds = new Set<string>()
    relevantSlots.forEach(i => {
      const n = enemySlots[i]
      if (n) targetIds.add(n.id)
    })

    const scored = candidates.map(summon => {
      const countersList = summonCounters.get(summon.id) || []
      let score = 0
      const directEnemy = enemySlots[index]
      if (directEnemy && countersList.includes(directEnemy.id)) score += 5
      targetIds.forEach(id => {
        if (countersList.includes(id)) score += 3
      })
      return { summon, score }
    })
    scored.sort((a, b) => b.score - a.score)
    const filtered = scored.filter(item => item.score > 0).slice(0, 8)
    return filtered.length > 0 ? filtered : null
  }, [phase, activeSlot, summons, mySummonHistory, opponentSummonHistory, currentSummons1P, currentSummons2P, team1P, team2P, summonCounters])

  if (!['pick', 'scrolls', 'summons'].includes(phase)) return null

  return (
    <Card className="p-4 space-y-3 mt-4">
      <h3 className="font-semibold text-sm text-primary">
        {phase === 'pick' ? '推荐忍者' : phase === 'scrolls' ? '推荐密卷' : '推荐通灵'}
        {activeSlot && `（位置 ${activeSlot.index + 1}）`}
      </h3>

      {phase === 'pick' && ninjaRecommendations && (
        <div className="flex flex-wrap gap-3">
          {ninjaRecommendations.map(({ ninja, score }) => {
            const isPending = pendingNinjaId === ninja.id
            return (
              <div
                key={ninja.id}
                className={`flex flex-col items-center gap-1 cursor-pointer hover:bg-muted/50 rounded-lg p-1 transition-colors ${
                  isPending ? 'border-2 border-red-500' : 'border border-transparent'
                }`}
                onClick={() => onSelectNinja?.(ninja)}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-border bg-card">
                  <Image src={ninja.imageUrl} alt={ninja.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">{ninja.name}</span>
                <Badge variant="secondary" className="text-xs">{score > 0 ? `+${score}` : score}</Badge>
              </div>
            )
          })}
        </div>
      )}

      {phase === 'scrolls' && scrollRecommendations && (
        <div className="flex flex-wrap gap-3">
          {scrollRecommendations.map(({ scroll, score }) => {
            const isPending = pendingScrollId === scroll.id
            return (
              <div
                key={scroll.id}
                className={`flex flex-col items-center gap-1 cursor-pointer hover:bg-muted/50 rounded-lg p-1 transition-colors ${
                  isPending ? 'border-2 border-red-500' : 'border border-transparent'
                }`}
                onClick={() => onSelectScroll?.(scroll)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border border-border bg-card">
                  <Image src={scroll.imageUrl} alt={scroll.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">{scroll.name}</span>
                <Badge variant="secondary" className="text-xs">{score}</Badge>
              </div>
            )
          })}
        </div>
      )}

      {phase === 'summons' && summonRecommendations && (
        <div className="flex flex-wrap gap-3">
          {summonRecommendations.map(({ summon, score }) => {
            const isPending = pendingSummonId === summon.id
            return (
              <div
                key={summon.id}
                className={`flex flex-col items-center gap-1 cursor-pointer hover:bg-muted/50 rounded-lg p-1 transition-colors ${
                  isPending ? 'border-2 border-red-500' : 'border border-transparent'
                }`}
                onClick={() => onSelectSummon?.(summon)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border border-border bg-card">
                  <Image src={summon.imageUrl} alt={summon.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs">{summon.name}</span>
                <Badge variant="secondary" className="text-xs">{score}</Badge>
              </div>
            )
          })}
        </div>
      )}

      {(phase === 'pick' && !ninjaRecommendations) && (
        <p className="text-sm text-muted-foreground">无推荐</p>
      )}
      {(phase === 'scrolls' && !scrollRecommendations) && (
        <p className="text-sm text-muted-foreground">无推荐</p>
      )}
      {(phase === 'summons' && !summonRecommendations) && (
        <p className="text-sm text-muted-foreground">无推荐</p>
      )}
    </Card>
  )
}