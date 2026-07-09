// EXPORTS: IBPCounter, MOCK_COUNTERS

export interface IBPCounter {
  id: string                   // 唯一标识
  ninjaId: string              // 被克制的忍者ID
  counterNinjaIds: string[]    // 克制该忍者的忍者ID列表
  counterScrollIds: string[]   // 克制该忍者的密卷ID列表
  counterSummonIds: string[]   // 克制该忍者的通灵兽ID列表
}

// 初始为空，后续在管理页面配置
export const MOCK_COUNTERS: IBPCounter[] = []