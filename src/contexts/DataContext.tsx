import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import { INinja, MOCK_NINJAS } from '@/data/ninjas'
import { IScroll, MOCK_SCROLLS } from '@/data/scrolls'
import { IRecommendation, MOCK_RECOMMENDATIONS } from '@/data/recommendations'

const NINJAS_KEY = 'naruto_ninjas'
const SCROLLS_KEY = 'naruto_scrolls'
const RECS_KEY = 'naruto_recommendations'
const NINJA_TAGS_KEY = 'naruto_ninja_tags'

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

const DEFAULT_NINJA_TAGS = ['瞬发', '抓取', '乱闪', '突进', '隐身', '霸体', '飞行', '无敌', '高爆发', '高输出', '格挡']

interface DataContextType {
  ninjas: INinja[]
  scrolls: IScroll[]
  recommendations: IRecommendation[]
  ninjaTags: string[]
  addNinja: (ninja: INinja) => void
  updateNinja: (id: string, data: Partial<INinja>) => void
  deleteNinja: (id: string) => void
  addScroll: (scroll: IScroll) => void
  updateScroll: (id: string, data: Partial<IScroll>) => void
  deleteScroll: (id: string) => void
  addRecommendation: (rec: IRecommendation) => void
  updateRecommendation: (id: string, data: Partial<IRecommendation>) => void
  deleteRecommendation: (id: string) => void
  addNinjaTag: (tag: string) => void
  removeNinjaTag: (tag: string) => void
  resetAllData: () => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [ninjas, setNinjas] = useState<INinja[]>(() => {
    const stored = loadFromStorage(NINJAS_KEY, MOCK_NINJAS)
    // 兼容旧数据：补全 rating 和 tags
    return stored.map(n => ({
      ...n,
      rating: n.rating || 'B',
      tags: n.tags || [],
    }))
  })
  const [scrolls, setScrolls] = useState<IScroll[]>(() =>
    loadFromStorage(SCROLLS_KEY, MOCK_SCROLLS)
  )
  const [recommendations, setRecommendations] = useState<IRecommendation[]>(() =>
    loadFromStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
  )
  const [ninjaTags, setNinjaTags] = useState<string[]>(() =>
    loadFromStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
  )

  // 标签持久化
  useEffect(() => { saveToStorage(NINJA_TAGS_KEY, ninjaTags) }, [ninjaTags])

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

  // --- Reset ---
  const resetAllData = useCallback(() => {
    setNinjas(MOCK_NINJAS)
    setScrolls(MOCK_SCROLLS)
    setRecommendations(MOCK_RECOMMENDATIONS)
    setNinjaTags(DEFAULT_NINJA_TAGS)
    saveToStorage(NINJAS_KEY, MOCK_NINJAS)
    saveToStorage(SCROLLS_KEY, MOCK_SCROLLS)
    saveToStorage(RECS_KEY, MOCK_RECOMMENDATIONS)
    saveToStorage(NINJA_TAGS_KEY, DEFAULT_NINJA_TAGS)
  }, [])

  return (
    <DataContext.Provider
      value={{
        ninjas,
        scrolls,
        recommendations,
        ninjaTags,
        addNinja,
        updateNinja,
        deleteNinja,
        addScroll,
        updateScroll,
        deleteScroll,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        addNinjaTag,
        removeNinjaTag,
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