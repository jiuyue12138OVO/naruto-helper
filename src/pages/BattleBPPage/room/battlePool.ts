export type PoolMode = 'all' | 'select' | 'disable'

export interface PlayerPool {
  mode: PoolMode
  ninjas: string[]
  scrolls: string[]
  summons: string[]
}

export const EMPTY_POOL: PlayerPool = { mode: 'all', ninjas: [], scrolls: [], summons: [] }

export const isPoolAll = (pool?: PlayerPool | null): boolean => !pool || pool.mode === 'all'

export const poolAllows = (
  pool: PlayerPool | undefined | null,
  kind: 'ninjas' | 'scrolls' | 'summons',
  id: string,
): boolean => {
  if (!pool || pool.mode === 'all') return true
  const list = pool[kind]
  return pool.mode === 'select' ? list.includes(id) : !list.includes(id)
}

export const poolSummary = (pool: PlayerPool): string => {
  if (isPoolAll(pool)) return '全部可用'
  const prefix = pool.mode === 'select' ? '仅限已选' : '已排除'
  return `${prefix}：${pool.ninjas.length} 名忍者 / ${pool.scrolls.length} 个密卷 / ${pool.summons.length} 个通灵`
}
