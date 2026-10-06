import type { INinja } from '@/data/ninjas'
import type { IBPCounter } from '@/data/battleBp'

/** 梯度权重 */
export const TIER_WEIGHT: Record<string, number> = {
  '天王': 30, '伪天王': 25, 't0顶': 20, 't0上': 15,
  't0中': 10, 't0下': 5, '准t0': 3, 't1': 0, '准t1': -1, 't2': -2,
  't3': -4, '...': -6,
}

/** 盲选加成 */
export const BLIND_BONUS = 20

export interface ScoreDetail {
  label: string
  value: number
  description?: string
}

export interface ScoreResult {
  total: number
  details: ScoreDetail[]
}

/** Pick 阶段评分 */
export function scorePickCandidate(
  candidate: INinja,
  slotType: 'blind' | 'counter',
  targets: INinja[],
  counters: IBPCounter[],
  /** 主要目标索引：index 对应的目标权重 1.5，其他目标权重 0.5 */
  primaryIndex = 0,
): ScoreResult {
  const details: ScoreDetail[] = []
  let total = 0

  // 梯度基础分
  const tierScore = TIER_WEIGHT[candidate.tier] ?? 0
  details.push({ label: '梯度基础分', value: tierScore, description: `梯度 ${candidate.tier}` })
  total += tierScore

  // 盲选加成
  if (slotType === 'blind' && candidate.blindPick) {
    details.push({ label: '盲选加成', value: BLIND_BONUS, description: '该忍者为盲选位' })
    total += BLIND_BONUS
  }

  // 对每个参考目标计算克制 / 被克制，主要目标权重 1.5，次要目标权重 0.5
  targets.forEach((target, idx) => {
    if (!target) return
    const weight = idx === primaryIndex ? 1.5 : 0.5

    const targetCounter = counters.find(c => c.ninjaId === target.id)
    if (targetCounter && targetCounter.counterNinjaIds.includes(candidate.id)) {
      const s = targetCounter.counterNinjaScores?.[candidate.id] ?? 0
      const v = s * weight
      details.push({
        label: `克制 ${target.name}${idx === primaryIndex ? '（对位）' : '（邻位）'}`,
        value: v,
        description: `克制分数 ${s} × 权重 ${weight}`,
      })
      total += v
    }

    const candidateCounter = counters.find(c => c.ninjaId === candidate.id)
    if (candidateCounter && candidateCounter.counterNinjaIds.includes(target.id)) {
      const s = candidateCounter.counterNinjaScores?.[target.id] ?? 0
      const v = -s * weight
      details.push({
        label: `被 ${target.name} 克制${idx === primaryIndex ? '（对位）' : '（邻位）'}`,
        value: v,
        description: `被克制分数 ${s} × 权重 ${weight}`,
      })
      total += v
    }
  })

  return { total, details }
}

/** 密卷 / 通灵 评分 */
export function scoreScrollOrSummonCandidate(
  candidateId: string,
  targets: INinja[],
  counters: IBPCounter[],
  availableIds: Set<string>,
  type: 'scroll' | 'summon',
): ScoreResult {
  const details: ScoreDetail[] = []
  let total = 0
  const label = type === 'scroll' ? '密卷' : '通灵'

  targets.forEach(target => {
    if (!target) return
    const targetCounter = counters.find(c => c.ninjaId === target.id)
    if (!targetCounter) return

    const counterIds = type === 'scroll' ? targetCounter.counterScrollIds : targetCounter.counterSummonIds
    if (!counterIds.includes(candidateId)) return

    const allCounters = counterIds.filter(id => availableIds.has(id))
    const rarity = allCounters.length > 0 ? 1 / allCounters.length : 0

    details.push({
      label: `克制 ${target.name}`,
      value: rarity,
      description: `有 ${allCounters.length} 个可用${label}可克制，稀缺度 ${rarity.toFixed(2)}`,
    })
    total += rarity
  })

  return { total, details }
}