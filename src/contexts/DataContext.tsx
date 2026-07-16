import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import type { INinja } from '@/data/ninjas'
import type { IScroll } from '@/data/scrolls'
import type { IRecommendation } from '@/data/recommendations'
import type { ISummon } from '@/data/summons'
import type { IBPCounter } from '@/data/battleBp'

const NINJAS_KEY = 'naruto_ninjas'
const SCROLLS_KEY = 'naruto_scrolls'
const RECS_KEY = 'naruto_recommendations'
const NINJA_TAGS_KEY = 'naruto_ninja_tags'
const SUMMONS_KEY = 'naruto_summons'
const COUNTERS_KEY = 'naruto_counters'
const BLIND_PICK_ORDER_KEY = 'naruto_blind_pick_order'
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
    } catch (e) { /* 忽略清除错误 */ }
    saveToStorage(VERSION_KEY, DATA_VERSION)
  }
}

const DEFAULT_NINJA_TAGS = [
  "抓取", "乱闪", "突进", "隐身", "霸体", "飞行", "无敌", "高爆发", "高输出",
  "格挡", "破霸体", "纯抓", "低真空期", "大招可接", "拉扯", "金刚体", "位移",
  "高机动性", "大招特殊情况可接", "防反", "瞬发"
]

interface DataContextType {
  ninjas: INinja[]
  scrolls: IScroll[]
  recommendations: IRecommendation[]
  summons: ISummon[]
  ninjaTags: string[]
  counters: IBPCounter[]
  blindPickOrder: string[]
  setBlindPickOrder: (order: string[] | ((prev: string[]) => string[])) => void
  ensureNinjas: () => Promise<void>
  ensureScrolls: () => Promise<void>
  ensureRecommendations: () => Promise<void>
  ensureSummons: () => Promise<void>
  ensureCounters: () => Promise<void>
  addNinja: (ninja: INinja) => void
  updateNinja: (id: string, data: Partial<INinja>) => void
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
  updateNinjaBlindPick: (id: string, blindPick: boolean) => void
  addCounter: (counter: IBPCounter) => void
  updateCounter: (id: string, data: Partial<IBPCounter>) => void
  deleteCounter: (id: string) => void
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
  const [counters, setCounters] = useState<IBPCounter[]>(() => loadFromStorage(COUNTERS_KEY, []))
  const [blindPickOrder, setBlindPickOrder] = useState<string[]>(() =>
    loadFromStorage(BLIND_PICK_ORDER_KEY, [])
  )

  const loadingRef = useRef({
    ninjas: false,
    scrolls: false,
    recs: false,
    summons: false,
    counters: false,
  })

  useEffect(() => { saveToStorage(NINJA_TAGS_KEY, ninjaTags) }, [ninjaTags])
  useEffect(() => { saveToStorage(SUMMONS_KEY, summons) }, [summons])
  useEffect(() => { saveToStorage(COUNTERS_KEY, counters) }, [counters])
  useEffect(() => { saveToStorage(BLIND_PICK_ORDER_KEY, blindPickOrder) }, [blindPickOrder])

  // --- Async data loaders ---
  const ensureNinjas = useCallback(async () => {
    if (ninjas.length > 0 || loadingRef.current.ninjas) return
    loadingRef.current.ninjas = true
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
  }, [ninjas.length])

  const ensureScrolls = useCallback(async () => {
    if (scrolls.length > 0 || loadingRef.current.scrolls) return
    loadingRef.current.scrolls = true
    const { MOCK_SCROLLS } = await import('@/data/scrolls')
    setScrolls(prev => {
      if (prev.length > 0) return prev
      saveToStorage(SCROLLS_KEY, MOCK_SCROLLS)
      return MOCK_SCROLLS
    })
  }, [scrolls.length])

  const ensureRecommendations = useCallback(async () => {
    if (recommendations.length > 0 || loadingRef.current.recs) return
    loadingRef.current.recs = true
    const { MOCK_RECOMMENDATIONS } = await import('@/data/recommendations')
    setRecommendations(prev => {
      if (prev.length > 0) return prev
      saveToStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
      return MOCK_RECOMMENDATIONS
    })
  }, [recommendations.length])

  const ensureSummons = useCallback(async () => {
    if (summons.length > 0 || loadingRef.current.summons) return
    loadingRef.current.summons = true
    const { MOCK_SUMMONS } = await import('@/data/summons')
    setSummons(prev => {
      if (prev.length > 0) return prev
      saveToStorage(SUMMONS_KEY, MOCK_SUMMONS)
      return MOCK_SUMMONS
    })
  }, [summons.length])

  const ensureCounters = useCallback(async () => {
    if (counters.length > 0 || loadingRef.current.counters) return
    loadingRef.current.counters = true
    const { MOCK_COUNTERS } = await import('@/data/battleBp')
    setCounters(prev => {
      if (prev.length > 0) return prev
      saveToStorage(COUNTERS_KEY, MOCK_COUNTERS)
      return MOCK_COUNTERS
    })
  }, [counters.length])

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
    setCounters([])
    setBlindPickOrder([])
    saveToStorage(NINJAS_KEY, [])
    saveToStorage(SCROLLS_KEY, [])
    saveToStorage(RECS_KEY, [])
    saveToStorage(SUMMONS_KEY, [])
    saveToStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
    saveToStorage(COUNTERS_KEY, [])
    saveToStorage(BLIND_PICK_ORDER_KEY, [])
    // 标记重置，下次进入页面时会重新动态加载
    loadingRef.current = { ninjas: false, scrolls: false, recs: false, summons: false, counters: false }
  }, [])

  return (
    <DataContext.Provider
      value={{
        ninjas,
        scrolls,
        recommendations,
        summons,
        ninjaTags,
        counters,
        blindPickOrder,
        setBlindPickOrder,
        ensureNinjas,
        ensureScrolls,
        ensureRecommendations,
        ensureSummons,
        ensureCounters,
        addNinja,
        updateNinja,
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
        updateNinjaBlindPick,
        addCounter,
        updateCounter,
        deleteCounter,
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