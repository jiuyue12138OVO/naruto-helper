// EXPORTS: INinja, MOCK_NINJAS
export interface INinja {
  id: string
  name: string
  tier: '天王' | '伪天王' | 't0顶' | 't0上' | 't0中' | 't0下' | '准t0'
  rating: 'S' | 'A' | 'B' | 'C'
  tags: string[]
  imageUrl: string
}

const NINJA_IMG_1 = '/spark/app/app_179gzw7tda3/runtime/api/v1/storage/object/bucket_aadkjiem3ncds_static/static%2Faadkjhce422ts_ve_miaoda'
const NINJA_IMG_2 = '/spark/app/app_179gzw7tda3/runtime/api/v1/storage/object/bucket_aadkjiem3ncds_static/static%2Faadkjhjtuakgw_ve_miaoda'
const NINJA_IMG_3 = '/spark/app/app_179gzw7tda3/runtime/api/v1/storage/object/bucket_aadkjiem3ncds_static/static%2Faadkjg4nwswbu_ve_miaoda'

export const MOCK_NINJAS: INinja[] = [
  {
    id: '1',
    name: '宇智波斑[秽土转生·解]',
    tier: '天王',
    rating: 'S',
    tags: ['瞬发', '高爆发'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '2',
    name: '十尾人柱力 宇智波带土',
    tier: '天王',
    rating: 'S',
    tags: ['瞬发', '无敌'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '3',
    name: '死门凯',
    tier: '天王',
    rating: 'S',
    tags: ['突进', '高爆发'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '4',
    name: '五影会谈斑',
    tier: '天王',
    rating: 'S',
    tags: ['格挡', '高输出'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '5',
    name: '金身水门',
    tier: '天王',
    rating: 'S',
    tags: ['乱闪', '瞬发'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '6',
    name: '漂泊带土',
    tier: 't0顶',
    rating: 'A',
    tags: ['隐身', '抓取'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '7',
    name: '须佐能乎鼬',
    tier: 't0顶',
    rating: 'A',
    tags: ['格挡', '高爆发'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '8',
    name: '双神威卡卡西',
    tier: 't0顶',
    rating: 'A',
    tags: ['瞬发', '无敌'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '9',
    name: '白面具带土',
    tier: 't0上',
    rating: 'A',
    tags: ['隐身'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '10',
    name: '须佐卡卡西',
    tier: 't0上',
    rating: 'A',
    tags: ['格挡', '高输出'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '11',
    name: '长门',
    tier: 't0上',
    rating: 'A',
    tags: ['抓取', '高爆发'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '12',
    name: '初代火影',
    tier: 't0中',
    rating: 'B',
    tags: ['突进'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '13',
    name: '新春大蛇丸',
    tier: 't0中',
    rating: 'B',
    tags: ['霸体', '飞行'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '14',
    name: '秽土再不斩',
    tier: 't0中',
    rating: 'B',
    tags: ['隐身'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '15',
    name: '晓大蛇丸',
    tier: 't0下',
    rating: 'B',
    tags: ['高输出'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '16',
    name: '侠隐江湖药师兜',
    tier: 't0下',
    rating: 'C',
    tags: ['飞行'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '17',
    name: '活水门',
    tier: 't0下',
    rating: 'C',
    tags: ['乱闪'],
    imageUrl: NINJA_IMG_2
  },
  {
    id: '18',
    name: '四代雷影',
    tier: '准t0',
    rating: 'C',
    tags: ['突进', '格挡'],
    imageUrl: NINJA_IMG_3
  },
  {
    id: '19',
    name: '忍战我爱罗',
    tier: '准t0',
    rating: 'C',
    tags: ['抓取'],
    imageUrl: NINJA_IMG_1
  },
  {
    id: '20',
    name: '百豪樱',
    tier: '准t0',
    rating: 'C',
    tags: ['高爆发'],
    imageUrl: NINJA_IMG_2
  }
]