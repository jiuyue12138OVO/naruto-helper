// EXPORTS: ISummon, MOCK_SUMMONS

export interface ISummon {
  id: string
  name: string
  skill: string
  description: string
  imageUrl: string
}

export const MOCK_SUMMONS: ISummon[] = [
  {
    id: '1',
    name: '山椒鱼',
    skill: '毒雾喷射',
    description: '范围毒雾攻击，持续伤害',
    imageUrl: ''
  },
  {
    id: '2',
    name: '蛤蟆吉',
    skill: '水铁炮',
    description: '水遁攻击，击飞敌人',
    imageUrl: ''
  }
]