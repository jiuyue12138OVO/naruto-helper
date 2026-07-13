import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import { INinja, MOCK_NINJAS } from '@/data/ninjas'
import { IScroll, MOCK_SCROLLS } from '@/data/scrolls'
import { IRecommendation, MOCK_RECOMMENDATIONS } from '@/data/recommendations'
import { ISummon, MOCK_SUMMONS } from '@/data/summons'
import { IBPCounter, MOCK_COUNTERS } from '@/data/battleBp'

const NINJAS_KEY = 'naruto_ninjas'
const SCROLLS_KEY = 'naruto_scrolls'
const RECS_KEY = 'naruto_recommendations'
const NINJA_TAGS_KEY = 'naruto_ninja_tags'
const SUMMONS_KEY = 'naruto_summons'
const COUNTERS_KEY = 'naruto_counters'
const BLIND_PICK_ORDER_KEY = 'naruto_blind_pick_order'
const VERSION_KEY = 'naruto_data_version'

// 🔥 版本号：部署到线上前修改此值即可强制用户更新数据
const DATA_VERSION = '2026-07-13-23-10'

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

// 🔥 版本检查：本地开发环境不执行，线上环境才生效
function checkVersionAndClearIfNeeded() {
  // 如果当前是本地开发（localhost 或 127.0.0.1），直接返回，不清除数据
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
    // 更新版本号
    saveToStorage(VERSION_KEY, DATA_VERSION)
  }
}

const DEFAULT_NINJA_TAGS = [
  "抓取", "乱闪", "突进", "隐身", "霸体", "飞行", "无敌", "高爆发", "高输出", "格挡",
  "破霸体", "纯抓", "低真空期", "大招可接", "拉扯", "金刚体", "位移", "高机动性",
  "大招特殊情况可接", "防反", "瞬发"
]

interface DataContextType {
  ninjas: INinja[]
  scrolls: IScroll[]
  recommendations: IRecommendation[]
  summons: ISummon[]
  ninjaTags: string[]
  counters: IBPCounter[]
  blindPickOrder: string[]
  setBlindPickOrder: (order: string[]) => void
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
  // 🔥 在组件初始化时调用版本检查
  checkVersionAndClearIfNeeded()

  const [ninjas, setNinjas] = useState<INinja[]>(() => {
    const stored = loadFromStorage(NINJAS_KEY, MOCK_NINJAS)
    return stored.map(n => ({
      ...n,
      rating: n.rating || 'B',
      tags: n.tags || [],
      blindPick: n.blindPick || false,
    }))
  })
  const [scrolls, setScrolls] = useState<IScroll[]>(() =>
    loadFromStorage(SCROLLS_KEY, MOCK_SCROLLS)
  )
  const [recommendations, setRecommendations] = useState<IRecommendation[]>(() =>
    loadFromStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
  )
  const [summons, setSummons] = useState<ISummon[]>(() => {
    const stored = loadFromStorage(SUMMONS_KEY, MOCK_SUMMONS)
    return Array.isArray(stored) && stored.length > 0 ? stored : MOCK_SUMMONS
  })
  const [ninjaTags, setNinjaTags] = useState<string[]>(() =>
    loadFromStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
  )
  const [counters, setCounters] = useState<IBPCounter[]>(() =>
    loadFromStorage(COUNTERS_KEY, MOCK_COUNTERS)
  )
  const [blindPickOrder, setBlindPickOrder] = useState<string[]>(() =>
    loadFromStorage(BLIND_PICK_ORDER_KEY, [])
  )

  useEffect(() => { saveToStorage(NINJA_TAGS_KEY, ninjaTags) }, [ninjaTags])
  useEffect(() => { saveToStorage(SUMMONS_KEY, summons) }, [summons])
  useEffect(() => { saveToStorage(COUNTERS_KEY, counters) }, [counters])
  useEffect(() => { saveToStorage(BLIND_PICK_ORDER_KEY, blindPickOrder) }, [blindPickOrder])

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
    setNinjas(MOCK_NINJAS)
    setScrolls(MOCK_SCROLLS)
    setRecommendations(MOCK_RECOMMENDATIONS)
    setSummons(MOCK_SUMMONS)
    setNinjaTags(DEFAULT_NINJA_TAGS)
    setCounters(MOCK_COUNTERS)
    setBlindPickOrder([])
    saveToStorage(NINJAS_KEY, MOCK_NINJAS)
    saveToStorage(SCROLLS_KEY, MOCK_SCROLLS)
    saveToStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
    saveToStorage(SUMMONS_KEY, MOCK_SUMMONS)
    saveToStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
    saveToStorage(COUNTERS_KEY, MOCK_COUNTERS)
    saveToStorage(BLIND_PICK_ORDER_KEY, [])
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