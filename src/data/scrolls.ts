// EXPORTS: IScroll, MOCK_SCROLLS

export interface IScroll {
  id: string
  name: string
  description: string
  cooldown: string
  imageUrl: string
}

const SCROLL_IMG_1 = '/spark/app/app_179gzw7tda3/runtime/api/v1/storage/object/bucket_aadkjiem3ncds_static/static%2Faadkjfzry4khw_ve_miaoda'
const SCROLL_IMG_2 = '/spark/app/app_179gzw7tda3/runtime/api/v1/storage/object/bucket_aadkjiem3ncds_static/static%2Faadkje56k5uaw_ve_miaoda'

export const MOCK_SCROLLS: IScroll[] = [
  {
    id: '1',
    name: '风遁·风沙阵',
    description: '大范围吸附，限制走位提升命中率',
    cooldown: '约15秒',
    imageUrl: SCROLL_IMG_1
  },
  {
    id: '2',
    name: '冰遁·冻雪',
    description: '延迟抓取，可破霸体并卡Y轴',
    cooldown: '约12秒',
    imageUrl: SCROLL_IMG_1
  },
  {
    id: '3',
    name: '雷云秘卷',
    description: '受击主动释放+命中禁锢，机制独特',
    cooldown: '约18秒',
    imageUrl: SCROLL_IMG_1
  },
  {
    id: '4',
    name: '雷遁·雷电击',
    description: '范围广起手快，有身后判定',
    cooldown: '约15秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '5',
    name: '水遁·水冲波',
    description: '以自身为中心扩散水波击退敌人，1.2秒无敌',
    cooldown: '约15秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '6',
    name: '通灵·手里剑护身',
    description: '生成三个手里剑围绕旋转持续三秒',
    cooldown: '约20秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '7',
    name: '忍体术·御',
    description: '防御型密卷，减伤效果明显',
    cooldown: '约18秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '8',
    name: '忍体术·反',
    description: '反弹伤害，解斑白面具变为宇智波反弹',
    cooldown: '约20秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '9',
    name: '火遁·鬼灯笼',
    description: '伤害型密卷，持续灼烧',
    cooldown: '约15秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '10',
    name: '土遁·地动',
    description: '浮空效果，连招衔接',
    cooldown: '约12秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '11',
    name: '封印术·除魔',
    description: '封印对方技能',
    cooldown: '约25秒',
    imageUrl: SCROLL_IMG_2
  },
  {
    id: '12',
    name: '火遁·烈焰弹',
    description: '伤害高，无敌无法免疫',
    cooldown: '约18秒',
    imageUrl: SCROLL_IMG_2
  }
]