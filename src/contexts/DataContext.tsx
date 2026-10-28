import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { IRecommendation } from '@/data/recommendations'
import type { ISummon } from '@/data/summons'
import type { IBPCounter } from '@/data/battleBp'
import type { IEasterEgg } from '@/data/easterEggs'

// 新增导入
import { DEFAULT_BLIND_PICK_ORDER } from '@/data/blindPickOrder'

const NINJAS_KEY = 'naruto_ninjas'
const SCROLLS_KEY = 'naruto_scrolls'
const RECS_KEY = 'naruto_recommendations'
const NINJA_TAGS_KEY = 'naruto_ninja_tags'
const SUMMONS_KEY = 'naruto_summons'
const COUNTERS_KEY = 'naruto_counters'
const BLIND_PICK_ORDER_KEY = 'naruto_blind_pick_order'
const ACQUISITION_OPTIONS_KEY = 'naruto_acquisition_options'
const EASTER_EGGS_KEY = 'naruto_easter_eggs'
const VERSION_KEY = 'naruto_data_version'

import { DATA_VERSION } from '@/version'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = scopedStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch { /* localStorage 不可用时降级 */ }
  return fallback
}

function saveToStorage(key: string, data: unknown) {
  try {
    scopedStorage.setItem(key, JSON.stringify(data))
  } catch { /* 静默失败 */ }
}

function checkVersionAndClearIfNeeded() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return
  }
  const storedVersion = scopedStorage.getItem(VERSION_KEY)
  if (storedVersion !== DATA_VERSION) {
    try {
      scopedStorage.removeItem(NINJAS_KEY)
      scopedStorage.removeItem(SCROLLS_KEY)
      scopedStorage.removeItem(RECS_KEY)
      scopedStorage.removeItem(SUMMONS_KEY)
      scopedStorage.removeItem(COUNTERS_KEY)
      scopedStorage.removeItem(NINJA_TAGS_KEY)
      scopedStorage.removeItem(BLIND_PICK_ORDER_KEY)
      scopedStorage.removeItem(ACQUISITION_OPTIONS_KEY)
      scopedStorage.removeItem(EASTER_EGGS_KEY)
    } catch (e) { /* 忽略清除错误 */ }
    saveToStorage(VERSION_KEY, DATA_VERSION)
  }
}

const DEFAULT_NINJA_TAGS = [
  "抓取", "乱闪", "突进", "隐身", "霸体", "高空优势", "无敌", "高爆发", "高输出",
  "格挡", "破霸体", "纯抓", "低真空期", "大招可接", "拉扯", "金刚体", "位移",
  "高机动性", "大招特殊情况可接", "防反", "瞬发"
]

const DEFAULT_ACQUISITION_OPTIONS = ['高招','点券','忍法帖','蓝券','直购','金币','免费','组织限定','巅峰对决','生存挑战','积分赛','祈愿夺宝','幸运贩售屋','特权商店','充值领取','其它方式']

interface DataContextType {
  ninjas: INinja[]
  scrolls: IScroll[]
  recommendations: IRecommendation[]
  summons: ISummon[]
  ninjaTags: string[]
  acquisitionOptions: string[]
  counters: IBPCounter[]
  blindPickOrder: string[]
  easterEggs: IEasterEgg[]
  loadingCount: number
  setBlindPickOrder: (order: string[] | ((prev: string[]) => string[])) => void
  ensureNinjas: () => Promise<void>
  ensureScrolls: () => Promise<void>
  ensureRecommendations: () => Promise<void>
  ensureSummons: () => Promise<void>
  ensureCounters: () => Promise<void>
  ensureEasterEggs: () => Promise<void>
  addNinja: (ninja: INinja) => void
  updateNinja: (id: string, data: Partial<INinja>) => void
  updateNinjasBatch: (updates: Record<string, Partial<INinja>>) => void
  deleteNinja: (id: string) => void
  addScroll: (scroll: IScroll) => void
  updateScroll: (id: string, data: Partial<IScroll>) => void
  deleteScroll: (id: string) => void
  addRecommendation: (rec: IRecommendation) => void
  updateRecommendation: (id: string, data: Partial<IRecommendation>) => void
  deleteRecommendation: (id: string) => void
  addSummon: (summon: ISummon) => void
  updateSummon: (id: string, data: Partial<ISummon>) => void
  deleteSummon: (id: string) => void
  addNinjaTag: (tag: string) => void
  removeNinjaTag: (tag: string) => void
  addAcquisitionOption: (option: string) => void
  removeAcquisitionOption: (option: string) => void
  updateNinjaBlindPick: (id: string, blindPick: boolean) => void
  addCounter: (counter: IBPCounter) => void
  updateCounter: (id: string, data: Partial<IBPCounter>) => void
  deleteCounter: (id: string) => void
  upsertEasterEgg: (egg: IEasterEgg) => void
  deleteEasterEgg: (ninjaId: string) => void
  resetAllData: () => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  checkVersionAndClearIfNeeded()

  const [ninjas, setNinjas] = useState<INinja[]>(() => loadFromStorage(NINJAS_KEY, []))
  const [scrolls, setScrolls] = useState<IScroll[]>(() => loadFromStorage(SCROLLS_KEY, []))
  const [recommendations, setRecommendations] = useState<IRecommendation[]>(() => loadFromStorage(RECS_KEY, []))
  const [summons, setSummons] = useState<ISummon[]>(() => {
    const stored = loadFromStorage(SUMMONS_KEY, [])
    return Array.isArray(stored) ? stored : []
  })
  const [ninjaTags, setNinjaTags] = useState<string[]>(() =>
    loadFromStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
  )
  const [acquisitionOptions, setAcquisitionOptions] = useState<string[]>(() =>
    loadFromStorage(ACQUISITION_OPTIONS_KEY, DEFAULT_ACQUISITION_OPTIONS)
  )
  const [counters, setCounters] = useState<IBPCounter[]>(() => loadFromStorage(COUNTERS_KEY, []))
  const [easterEggs, setEasterEggs] = useState<IEasterEgg[]>(() => loadFromStorage(EASTER_EGGS_KEY, []))

  const [blindPickOrder, setBlindPickOrder] = useState<string[]>(() => {
    const stored = loadFromStorage(BLIND_PICK_ORDER_KEY, null)
    if (stored !== null) return stored
    return DEFAULT_BLIND_PICK_ORDER
  })

  // 正在进行的异步加载计数器
  const [loadingCount, setLoadingCount] = useState(0)

  const loadingRef = useRef({
    ninjas: false,
    scrolls: false,
    recs: false,
    summons: false,
    counters: false,
    easterEggs: false,
  })

  useEffect(() => { saveToStorage(NINJA_TAGS_KEY, ninjaTags) }, [ninjaTags])
  useEffect(() => { saveToStorage(ACQUISITION_OPTIONS_KEY, acquisitionOptions) }, [acquisitionOptions])
  useEffect(() => { saveToStorage(SUMMONS_KEY, summons) }, [summons])
  useEffect(() => { saveToStorage(COUNTERS_KEY, counters) }, [counters])
  useEffect(() => { saveToStorage(BLIND_PICK_ORDER_KEY, blindPickOrder) }, [blindPickOrder])
  useEffect(() => { saveToStorage(EASTER_EGGS_KEY, easterEggs) }, [easterEggs])

  const wrapLoader = useCallback(async (key: keyof typeof loadingRef.current, loader: () => Promise<void>) => {
    if (loadingRef.current[key]) return
    loadingRef.current[key] = true
    setLoadingCount(prev => prev + 1)
    try {
      await loader()
    } finally {
      setLoadingCount(prev => prev - 1)
    }
  }, [])

  const ensureNinjas = useCallback(async () => {
    if (ninjas.length > 0 || loadingRef.current.ninjas) return
    await wrapLoader('ninjas', async () => {
      const { MOCK_NINJAS } = await import('@/data/ninjas')
      setNinjas(prev => {
        if (prev.length > 0) return prev
        const data = MOCK_NINJAS.map(n => ({
          ...n,
          rating: n.rating || 'B',
          tags: n.tags || [],
          blindPick: n.blindPick || false,
        }))
        saveToStorage(NINJAS_KEY, data)
        return data
      })
    })
  }, [ninjas.length, wrapLoader])

  const ensureScrolls = useCallback(async () => {
    if (scrolls.length > 0 || loadingRef.current.scrolls) return
    await wrapLoader('scrolls', async () => {
      const { MOCK_SCROLLS } = await import('@/data/scrolls')
      setScrolls(prev => {
        if (prev.length > 0) return prev
        saveToStorage(SCROLLS_KEY, MOCK_SCROLLS)
        return MOCK_SCROLLS
      })
    })
  }, [scrolls.length, wrapLoader])

  const ensureRecommendations = useCallback(async () => {
    if (recommendations.length > 0 || loadingRef.current.recs) return
    await wrapLoader('recs', async () => {
      const { MOCK_RECOMMENDATIONS } = await import('@/data/recommendations')
      setRecommendations(prev => {
        if (prev.length > 0) return prev
        saveToStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
        return MOCK_RECOMMENDATIONS
      })
    })
  }, [recommendations.length, wrapLoader])

  const ensureSummons = useCallback(async () => {
    if (summons.length > 0 || loadingRef.current.summons) return
    await wrapLoader('summons', async () => {
      const { MOCK_SUMMONS } = await import('@/data/summons')
      setSummons(prev => {
        if (prev.length > 0) return prev
        saveToStorage(SUMMONS_KEY, MOCK_SUMMONS)
        return MOCK_SUMMONS
      })
    })
  }, [summons.length, wrapLoader])

  const ensureCounters = useCallback(async () => {
    if (counters.length > 0 || loadingRef.current.counters) return
    await wrapLoader('counters', async () => {
      const { MOCK_COUNTERS } = await import('@/data/battleBp')
      setCounters(prev => {
        if (prev.length > 0) return prev
        saveToStorage(COUNTERS_KEY, MOCK_COUNTERS)
        return MOCK_COUNTERS
      })
    })
  }, [counters.length, wrapLoader])

  const ensureEasterEggs = useCallback(async () => {
    if (easterEggs.length > 0 || loadingRef.current.easterEggs) return
    await wrapLoader('easterEggs', async () => {
      const { MOCK_EASTER_EGGS } = await import('@/data/easterEggs')
      setEasterEggs(prev => {
        if (prev.length > 0) return prev
        saveToStorage(EASTER_EGGS_KEY, MOCK_EASTER_EGGS)
        return MOCK_EASTER_EGGS
      })
    })
  }, [easterEggs.length, wrapLoader])

  // --- Easter Egg CRUD（按 ninjaId upsert）---
  // 保存彩蛋：写入当前忍者的同时自动同步镜像关系（互通）
  // A.defeatTarget 包含 B  ⟺  B.defeatBy 包含 A
  const upsertEasterEgg = useCallback((egg: IEasterEgg) => {
    setEasterEggs(prev => {
      const map = new Map<string, IEasterEgg>()
      prev.forEach(e => map.set(e.ninjaId, { ...e }))

      const old = map.get(egg.ninjaId)
      const oldTargets = old?.defeatTargetNinjaIds ?? []
      const oldBys = old?.defeatByNinjaIds ?? []

      // 写入当前忍者新记录
      map.set(egg.ninjaId, { ...egg })

      // 确保某忍者存在记录
      const ensure = (ninjaId: string): IEasterEgg => {
        let rec = map.get(ninjaId)
        if (!rec) {
          rec = { ninjaId, defeatByNinjaIds: [], defeatTargetNinjaIds: [] }
          map.set(ninjaId, rec)
        }
        return rec
      }

      // 新增关系 → 镜像写入对方
      egg.defeatTargetNinjaIds.forEach(b => {
        const rec = ensure(b)
        if (!rec.defeatByNinjaIds.includes(egg.ninjaId)) {
          rec.defeatByNinjaIds = [...rec.defeatByNinjaIds, egg.ninjaId]
        }
      })
      egg.defeatByNinjaIds.forEach(b => {
        const rec = ensure(b)
        if (!rec.defeatTargetNinjaIds.includes(egg.ninjaId)) {
          rec.defeatTargetNinjaIds = [...rec.defeatTargetNinjaIds, egg.ninjaId]
        }
      })

      // 已移除的关系 → 从对方镜像中删除
      oldTargets.forEach(b => {
        const rec = map.get(b)
        if (rec && !egg.defeatTargetNinjaIds.includes(b)) {
          rec.defeatByNinjaIds = rec.defeatByNinjaIds.filter(x => x !== egg.ninjaId)
        }
      })
      oldBys.forEach(b => {
        const rec = map.get(b)
        if (rec && !egg.defeatByNinjaIds.includes(b)) {
          rec.defeatTargetNinjaIds = rec.defeatTargetNinjaIds.filter(x => x !== egg.ninjaId)
        }
      })

      // 清理完全空白的关系记录（保留当前忍者）
      // 只有"关联列表为空 且 无其他信息（含 extras 列表）"的记录才清理，避免误删只有彩蛋信息的记录
      for (const [id, rec] of map) {
        if (
          id !== egg.ninjaId &&
          rec.defeatByNinjaIds.length === 0 &&
          rec.defeatTargetNinjaIds.length === 0 &&
          !rec.title && !rec.description && !rec.type &&
          !(rec.extras && rec.extras.length > 0)
        ) {
          map.delete(id)
        }
      }

      const next = Array.from(map.values())
      saveToStorage(EASTER_EGGS_KEY, next)
      return next
    })
  }, [])

  // 删除彩蛋：同时从其他忍者记录的镜像关系中移除该忍者（互通）
  const deleteEasterEgg = useCallback((ninjaId: string) => {
    setEasterEggs(prev => {
      const target = prev.find(e => e.ninjaId === ninjaId)
      if (!target) return prev
      const map = new Map<string, IEasterEgg>()
      prev.filter(e => e.ninjaId !== ninjaId).forEach(e => map.set(e.ninjaId, { ...e }))

      target.defeatTargetNinjaIds.forEach(b => {
        const rec = map.get(b)
        if (rec) rec.defeatByNinjaIds = rec.defeatByNinjaIds.filter(x => x !== ninjaId)
      })
      target.defeatByNinjaIds.forEach(b => {
        const rec = map.get(b)
        if (rec) rec.defeatTargetNinjaIds = rec.defeatTargetNinjaIds.filter(x => x !== ninjaId)
      })

      // 清理完全空白的关系记录（仅当无类型/标题/描述且无 extras 时才清理）
      for (const [id, rec] of map) {
        if (
          rec.defeatByNinjaIds.length === 0 &&
          rec.defeatTargetNinjaIds.length === 0 &&
          !rec.title && !rec.description && !rec.type &&
          !(rec.extras && rec.extras.length > 0)
        ) {
          map.delete(id)
        }
      }
      const next = Array.from(map.values())
      saveToStorage(EASTER_EGGS_KEY, next)
      return next
    })
  }, [])

  // --- Ninja CRUD ---
  const addNinja = useCallback((ninja: INinja) => {
    setNinjas((prev) => {
      const next = [...prev, ninja]
      saveToStorage(NINJAS_KEY, next)
      return next
    })
  }, [])

  const updateNinja = useCallback((id: string, data: Partial<INinja>) => {
    setNinjas((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, ...data } : n))
      saveToStorage(NINJAS_KEY, next)
      return next
    })
  }, [])

  const updateNinjasBatch = useCallback((updates: Record<string, Partial<INinja>>) => {
    setNinjas((prev) => {
      const next = prev.map((n) => updates[n.id] ? { ...n, ...updates[n.id] } : n)
      saveToStorage(NINJAS_KEY, next)
      return next
    })
  }, [])

  const deleteNinja = useCallback((id: string) => {
    setNinjas((prev) => {
      const next = prev.filter((n) => n.id !== id)
      saveToStorage(NINJAS_KEY, next)
      return next
    })
  }, [])

  // --- Scroll CRUD ---
  const addScroll = useCallback((scroll: IScroll) => {
    setScrolls((prev) => {
      const next = [...prev, scroll]
      saveToStorage(SCROLLS_KEY, next)
      return next
    })
  }, [])

  const updateScroll = useCallback((id: string, data: Partial<IScroll>) => {
    setScrolls((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      saveToStorage(SCROLLS_KEY, next)
      return next
    })
  }, [])

  const deleteScroll = useCallback((id: string) => {
    setScrolls((prev) => {
      const next = prev.filter((s) => s.id !== id)
      saveToStorage(SCROLLS_KEY, next)
      return next
    })
  }, [])

  // --- Recommendation CRUD ---
  const addRecommendation = useCallback((rec: IRecommendation) => {
    setRecommendations((prev) => {
      const next = [...prev, rec]
      saveToStorage(RECS_KEY, next)
      return next
    })
  }, [])

  const updateRecommendation = useCallback((id: string, data: Partial<IRecommendation>) => {
    setRecommendations((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      saveToStorage(RECS_KEY, next)
      return next
    })
  }, [])

  const deleteRecommendation = useCallback((id: string) => {
    setRecommendations((prev) => {
      const next = prev.filter((r) => r.id !== id)
      saveToStorage(RECS_KEY, next)
      return next
    })
  }, [])

  // --- Summon CRUD ---
  const addSummon = useCallback((summon: ISummon) => {
    setSummons((prev) => {
      const next = [...prev, summon]
      saveToStorage(SUMMONS_KEY, next)
      return next
    })
  }, [])

  const updateSummon = useCallback((id: string, data: Partial<ISummon>) => {
    setSummons((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      saveToStorage(SUMMONS_KEY, next)
      return next
    })
  }, [])

  const deleteSummon = useCallback((id: string) => {
    setSummons((prev) => {
      const next = prev.filter((s) => s.id !== id)
      saveToStorage(SUMMONS_KEY, next)
      return next
    })
  }, [])

  // --- Ninja Tags ---
  const addNinjaTag = useCallback((tag: string) => {
    setNinjaTags(prev => {
      if (prev.includes(tag)) return prev
      return [...prev, tag]
    })
  }, [])

  const removeNinjaTag = useCallback((tag: string) => {
    setNinjaTags(prev => prev.filter(t => t !== tag))
  }, [])

  // --- Acquisition Options ---
  const addAcquisitionOption = useCallback((option: string) => {
    setAcquisitionOptions(prev => {
      if (prev.includes(option)) return prev
      return [...prev, option]
    })
  }, [])

  const removeAcquisitionOption = useCallback((option: string) => {
    setAcquisitionOptions(prev => prev.filter(o => o !== option))
  }, [])

  // --- Blind Pick ---
  const updateNinjaBlindPick = useCallback((id: string, blindPick: boolean) => {
    setNinjas((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, blindPick } : n))
      saveToStorage(NINJAS_KEY, next)
      return next
    })
    if (!blindPick) {
      setBlindPickOrder(prev => prev.filter(nid => nid !== id))
    }
  }, [])

  // --- Counter CRUD ---
  const addCounter = useCallback((counter: IBPCounter) => {
    setCounters((prev) => {
      const next = [...prev, counter]
      saveToStorage(COUNTERS_KEY, next)
      return next
    })
  }, [])

  const updateCounter = useCallback((id: string, data: Partial<IBPCounter>) => {
    setCounters((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      saveToStorage(COUNTERS_KEY, next)
      return next
    })
  }, [])

  const deleteCounter = useCallback((id: string) => {
    setCounters((prev) => {
      const next = prev.filter((c) => c.id !== id)
      saveToStorage(COUNTERS_KEY, next)
      return next
    })
  }, [])

  // --- Reset ---
  const resetAllData = useCallback(() => {
    setNinjas([])
    setScrolls([])
    setRecommendations([])
    setSummons([])
    setNinjaTags(DEFAULT_NINJA_TAGS)
    setAcquisitionOptions(DEFAULT_ACQUISITION_OPTIONS)
    setCounters([])
    setBlindPickOrder(DEFAULT_BLIND_PICK_ORDER)
    setEasterEggs([])
    saveToStorage(NINJAS_KEY, [])
    saveToStorage(SCROLLS_KEY, [])
    saveToStorage(RECS_KEY, [])
    saveToStorage(SUMMONS_KEY, [])
    saveToStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
    saveToStorage(ACQUISITION_OPTIONS_KEY, DEFAULT_ACQUISITION_OPTIONS)
    saveToStorage(COUNTERS_KEY, [])
    saveToStorage(BLIND_PICK_ORDER_KEY, DEFAULT_BLIND_PICK_ORDER)
    saveToStorage(EASTER_EGGS_KEY, [])
    loadingRef.current = { ninjas: false, scrolls: false, recs: false, summons: false, counters: false, easterEggs: false }
    setLoadingCount(0)
  }, [])

  return (
    <DataContext.Provider
      value={{
        ninjas,
        scrolls,
        recommendations,
        summons,
        ninjaTags,
        acquisitionOptions,
        counters,
        blindPickOrder,
        easterEggs,
        loadingCount,
        setBlindPickOrder,
        ensureNinjas,
        ensureScrolls,
        ensureRecommendations,
        ensureSummons,
        ensureCounters,
        ensureEasterEggs,
        addNinja,
        updateNinja,
        updateNinjasBatch,
        deleteNinja,
        addScroll,
        updateScroll,
        deleteScroll,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        addSummon,
        updateSummon,
        deleteSummon,
        addNinjaTag,
        removeNinjaTag,
        addAcquisitionOption,
        removeAcquisitionOption,
        updateNinjaBlindPick,
        addCounter,
        updateCounter,
        deleteCounter,
        upsertEasterEgg,
        deleteEasterEgg,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData 必须在 DataProvider 内使用')
  return ctx
}
