// EXPORTS: IRecommendation, MOCK_RECOMMENDATIONS

export interface IRecommendation {
  id: string
  ninjaId: string          // 关联的忍者 ID
  ninjaName: string
  scrolls: {               // 该忍者推荐的密卷列表，按优先级排序
    scrollId: string
    scrollName: string
    priority: number       // 1 最高优先级
  }[]
}

export const MOCK_RECOMMENDATIONS: IRecommendation[] = [
  {
    id: '1',
    ninjaId: '6',
    ninjaName: '漂泊带土',
    scrolls: [
      { scrollId: '2', scrollName: '冰遁·冻雪', priority: 1 },
      { scrollId: '4', scrollName: '雷遁·雷电击', priority: 2 }
    ]
  },
  {
    id: '2',
    ninjaId: '7',
    ninjaName: '须佐能乎鼬',
    scrolls: [
      { scrollId: '1', scrollName: '风遁·风沙阵', priority: 1 }
    ]
  },
  {
    id: '3',
    ninjaId: '3',
    ninjaName: '死门凯',
    scrolls: [
      { scrollId: '4', scrollName: '雷遁·雷电击', priority: 1 },
      { scrollId: '2', scrollName: '冰遁·冻雪', priority: 2 }
    ]
  },
  {
    id: '4',
    ninjaId: '14',
    ninjaName: '秽土再不斩',
    scrolls: [
      { scrollId: '5', scrollName: '水遁·水冲波', priority: 1 }
    ]
  },
  {
    id: '5',
    ninjaId: '9',
    ninjaName: '白面具带土',
    scrolls: [
      { scrollId: '8', scrollName: '忍体术·反', priority: 1 },
      { scrollId: '7', scrollName: '忍体术·御', priority: 2 }
    ]
  },
  {
    id: '6',
    ninjaId: '1',
    ninjaName: '秽土转生·解 宇智波斑',
    scrolls: [
      { scrollId: '7', scrollName: '忍体术·御', priority: 1 },
      { scrollId: '8', scrollName: '忍体术·反', priority: 2 }
    ]
  },
  {
    id: '7',
    ninjaId: '5',
    ninjaName: '金身水门',
    scrolls: [
      { scrollId: '5', scrollName: '水遁·水冲波', priority: 1 }
    ]
  }
]