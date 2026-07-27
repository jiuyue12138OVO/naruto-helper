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

/** 根据 BP 顺序和槽位计算盲选位加分 */
function getBlindPickBonus(player: '1P' | '2P', index: number): number {
  if (player === '1P') {
    // 1P 的 C 位 (index 0) 和 A 位 (index 2) 是盲选
    if (index === 0 || index === 2) return 6
    return 0
  } else {
    // 2P 的 D 位 (index 0) 和 E 位 (index 1) 有一定盲选成分
    if (index === 0) return 3
    if (index === 1) return 4
    return 0
  }
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

  // 构建克制索引
  const { ninjaCounters, scrollCounters, summonCounters, counterDataMap } = useMemo(() => {
    const ninjaMap = new Map<string, string[]>()
    const scrollMap = new Map<string, string[]>()
    const summonMap = new Map<string, string[]>()
    const dataMap = new Map<string, IBPCounter>()
    counters.forEach((c: IBPCounter) => {
      dataMap.set(c.ninjaId, c)
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
    return { ninjaCounters: ninjaMap, scrollCounters: scrollMap, summonCounters: summonMap, counterDataMap: dataMap }
  }, [counters])

  // ---- 忍者推荐（新算法：全局克制考量 + 对位加权） ----
  const ninjaRecommendations = useMemo(() => {
    if (phase !== 'pick' || !activeSlot || activeSlot.type !== 'pick') return null
    const { player, index } = activeSlot
    const bannedIds = new Set([
      ...banned1P.filter(Boolean).map(n => n!.id),
      ...banned2P.filter(Boolean).map(n => n!.id),
    ])
    const candidates = ninjas.filter(n =>
      !usedNinjas.has(n.id) && !bannedIds.has(n.id) &&
      !myTeam.some(m => m.id === n.id) && !enemyTeam.some(e => e.id === n.id)
    )

    const enemyIds = enemyTeam.map(e => e.id)
    const directOpponentId = enemyTeam[index]?.id ?? null // 对位敌人

    const scored = candidates.map(ninja => {
      let score = 0

      // 遍历敌方所有已选忍者，计算克制与被克制
      enemyIds.forEach(enemyId => {
        const isDirect = enemyId === directOpponentId
        const weight = isDirect ? 5 : 3

        // 我方候选忍者克制该敌人
        const myCounterList = ninjaCounters.get(ninja.id) || []
        if (myCounterList.includes(enemyId)) {
          score += weight
        }

        // 该敌人克制我方候选忍者
        const enemyCounter = counterDataMap.get(enemyId)
        if (enemyCounter?.counterNinjaIds.includes(ninja.id)) {
          score -= weight
        }
      })

      // 盲选位加分
      if (ninja.blindPick) {
        score += getBlindPickBonus(player, index)
      }

      // 梯度基础分
      score += (TIER_WEIGHT[ninja.tier] || 0)

      return { ninja, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const positiveOnly = scored.filter(item => item.score > 0)
    return positiveOnly.length > 0 ? positiveOnly : null
  }, [phase, activeSlot, ninjas, usedNinjas, banned1P, banned2P, myTeam, enemyTeam, team1P, team2P, ninjaCounters, counterDataMap])

  // ---- 密卷推荐（保持原对位逻辑，仅去除数量上限并添加滚动） ----
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
    const filtered = scored.filter(item => item.score > 0)
    return filtered.length > 0 ? filtered : null
  }, [phase, activeSlot, scrolls, myScrollHistory, opponentScrollHistory, currentScrolls1P, currentScrolls2P, team1P, team2P, scrollCounters])

  // ---- 通灵推荐（同样去上限 + 滚动） ----
  const summonRecommendations = useMemo(() => {
    if (phase !== 'summons' || !activeSlot || activeSlot.type !== 'summon') return null
    const { player, index } = activeSlot
    const is1P = player === '1P'
    const history = is1P ? mySummonHistory : opponentSummonHistory
    const current = is1P ? currentSummons1P : currentSummons2P
    const usedThisGame = new Set(current.filter((id): id is string => id !== null))
    const candidates = summons.filter(s => !history.has(s.id) && !usedThisGame.has(s.id))
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
    const filtered = scored.filter(item => item.score > 0)
    return filtered.length > 0 ? filtered : null
  }, [phase, activeSlot, summons, mySummonHistory, opponentSummonHistory, currentSummons1P, currentSummons2P, team1P, team2P, summonCounters])

  if (!['pick', 'scrolls', 'summons'].includes(phase)) return null

  return (
    <Card className="p-4 space-y-3 mt-4">
      <h3 className="font-semibold text-sm text-primary">
        {phase === 'pick' ? '推荐忍者' : phase === 'scrolls' ? '推荐密卷' : '推荐通灵'}
        {activeSlot && `（位置 ${activeSlot.index + 1}）`}
      </h3>

      {/* 忍者推荐 - 滚动容器显示所有得分>0的选项 */}
      {phase === 'pick' && ninjaRecommendations && (
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
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
        </div>
      )}

      {/* 密卷推荐 - 滚动容器 */}
      {phase === 'scrolls' && scrollRecommendations && (
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
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
        </div>
      )}

      {/* 通灵推荐 - 滚动容器 */}
      {phase === 'summons' && summonRecommendations && (
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
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
        </div>
      )}

      {/* 无推荐提示 */}
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