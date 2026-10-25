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
      "id": "1783351154343",
      "ninjaId": "1783316910582",
      "ninjaName": "无【二代目土影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 4
        },
        {
          "scrollId": "1783350105829",
          "scrollName": "水遁·雾隐之术",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783351228392",
      "ninjaId": "1",
      "ninjaName": "宇智波斑【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 3
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351242386",
      "ninjaId": "2",
      "ninjaName": "宇智波带土【十尾人柱力】",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351253545",
      "ninjaId": "3",
      "ninjaName": "迈特凯【死门】",
      "scrolls": [
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783351282259",
      "ninjaId": "4",
      "ninjaName": "宇智波斑【五影会谈】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 2
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 3
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783351295746",
      "ninjaId": "5",
      "ninjaName": "波风水门【九喇嘛连结】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351305064",
      "ninjaId": "6",
      "ninjaName": "宇智波带土【漂泊浪客】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351361734",
      "ninjaId": "7",
      "ninjaName": "宇智波鼬【百战】",
      "scrolls": [
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "11",
          "scrollName": "封印术·除魔",
          "priority": 3
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351392863",
      "ninjaId": "8",
      "ninjaName": "旗木卡卡西【须佐能乎】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 3
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351406172",
      "ninjaId": "9",
      "ninjaName": "宇智波斑【白面具】",
      "scrolls": [
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "8",
          "scrollName": "忍体术·反",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351421332",
      "ninjaId": "10",
      "ninjaName": "旗木卡卡西【万花筒写轮眼】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351463084",
      "ninjaId": "11",
      "ninjaName": "长门【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783351482712",
      "ninjaId": "12",
      "ninjaName": "千手柱间",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351501213",
      "ninjaId": "13",
      "ninjaName": "大蛇丸【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351515693",
      "ninjaId": "14",
      "ninjaName": "桃地再不斩",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783351555027",
      "ninjaId": "15",
      "ninjaName": "大蛇丸【晓】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783351580177",
      "ninjaId": "17",
      "ninjaName": "波风水门",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783351869602",
      "ninjaId": "1783308944026",
      "ninjaName": "鬼灯幻月【二代目水影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        },
        {
          "scrollId": "3",
          "scrollName": "岚遁·雷云",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351888380",
      "ninjaId": "18",
      "ninjaName": "艾【四代目雷影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 3
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783351935901",
      "ninjaId": "19",
      "ninjaName": "我爱罗【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 5
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783352024208",
      "ninjaId": "20",
      "ninjaName": "春野樱【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352044348",
      "ninjaId": "1783307504056",
      "ninjaName": "佩恩·六道【漂泊浪客】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 3
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352104326",
      "ninjaId": "1783308752772",
      "ninjaName": "自来也【传说中的三忍】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 5
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783352443245",
      "ninjaId": "1783308767737",
      "ninjaName": "千手扉间【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 5
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783352466839",
      "ninjaId": "1783308796552",
      "ninjaName": "宇智波斑【神驹佑将】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783352480958",
      "ninjaId": "1783308820073",
      "ninjaName": "千手柱间【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 3
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352517203",
      "ninjaId": "1783308858692",
      "ninjaName": "漩涡鸣人·宇智波佐助【宿命连结】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 2
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783352550436",
      "ninjaId": "1783308961488",
      "ninjaName": "宇智波带土【暴怒】",
      "scrolls": [
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 1
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 7
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 8
        }
      ]
    },
    {
      "id": "1783352581449",
      "ninjaId": "1783308987411",
      "ninjaName": "佩恩·天道【超】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 3
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352591126",
      "ninjaId": "1783309015873",
      "ninjaName": "猿飞阿斯玛【七夕限定】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783352605909",
      "ninjaId": "1783309046156",
      "ninjaName": "金角·银角【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352614609",
      "ninjaId": "1783309084993",
      "ninjaName": "迈特凯【惊门】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352624408",
      "ninjaId": "1783309096309",
      "ninjaName": "迈特凯【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352643922",
      "ninjaId": "1783309130139",
      "ninjaName": "黑土【夏日限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783352666007",
      "ninjaId": "1783309148171",
      "ninjaName": "宇智波佐助【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352674793",
      "ninjaId": "1783309162593",
      "ninjaName": "漩涡鸣人【九尾查克拉】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783352686591",
      "ninjaId": "1783309172598",
      "ninjaName": "宇智波佐助【须佐能乎】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 2
        },
        {
          "scrollId": "1783350632830",
          "scrollName": "水遁·水气球",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783352753809",
      "ninjaId": "1783309186224",
      "ninjaName": "宇智波鼬【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 4
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 5
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783352771160",
      "ninjaId": "1783309208477",
      "ninjaName": "小南【漂泊浪客】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352802852",
      "ninjaId": "1783309257305",
      "ninjaName": "达鲁伊【五代目雷影】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 3
        },
        {
          "scrollId": "1783611799449",
          "scrollName": "影分身之术",
          "priority": 4
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783352839644",
      "ninjaId": "1783309311486",
      "ninjaName": "漩涡博人【桃式显现】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352856965",
      "ninjaId": "1783309348233",
      "ninjaName": "猿飞木叶丸",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 3
        },
        {
          "scrollId": "1783611799449",
          "scrollName": "影分身之术",
          "priority": 4
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 5
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783352866719",
      "ninjaId": "1783309398928",
      "ninjaName": "桃地再不斩【漂泊武士】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349910490",
          "scrollName": "忍体术·怒",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352874090",
      "ninjaId": "1783309415054",
      "ninjaName": "黄土【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783351060243",
          "scrollName": "冰遁·冰牢",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783352880896",
      "ninjaId": "1783309521385",
      "ninjaName": "笕堇",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        },
        {
          "scrollId": "1783350105829",
          "scrollName": "水遁·雾隐之术",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783352923088",
      "ninjaId": "1783309572540",
      "ninjaName": "纲手【百豪】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 5
        },
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 6
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783352946868",
      "ninjaId": "1783309602084",
      "ninjaName": "自来也【蜀面豪杰】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783352958351",
      "ninjaId": "1783309612984",
      "ninjaName": "千手扉间",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783352967818",
      "ninjaId": "1783309627781",
      "ninjaName": "巳月【仙人模式】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783352983690",
      "ninjaId": "1783309691119",
      "ninjaName": "漩涡鸣人【九喇嘛连结】",
      "scrolls": [
        {
          "scrollId": "1783349977627",
          "scrollName": "解术·复",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353008450",
      "ninjaId": "1783309737253",
      "ninjaName": "波风水门【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783350886684",
          "scrollName": "冰遁·爆雪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353028300",
      "ninjaId": "1783309749818",
      "ninjaName": "宇智波鼬【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353059693",
      "ninjaId": "1783309774545",
      "ninjaName": "药师兜【仙人模式】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 5
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353097778",
      "ninjaId": "1783309783866",
      "ninjaName": "神秘面具男",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 4
        },
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 5
        },
        {
          "scrollId": "1783350663437",
          "scrollName": "火遁·火炎阵",
          "priority": 6
        },
        {
          "scrollId": "3",
          "scrollName": "岚遁·雷云",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783353110772",
      "ninjaId": "1783309803512",
      "ninjaName": "艾【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 3
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353135926",
      "ninjaId": "1783309816393",
      "ninjaName": "宇智波斑【木叶创立】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783353148485",
      "ninjaId": "1783310130280",
      "ninjaName": "波风水门【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353159616",
      "ninjaId": "1783310144555",
      "ninjaName": "旗木卡卡西【神威对决】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353181691",
      "ninjaId": "1783309829510",
      "ninjaName": "宇智波带土【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353197308",
      "ninjaId": "1783309922540",
      "ninjaName": "大筒木金式",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783353210883",
      "ninjaId": "1783309880298",
      "ninjaName": "罗砂【四代目风影】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353239679",
      "ninjaId": "1783309850660",
      "ninjaName": "半藏【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 2
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 3
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 4
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353257105",
      "ninjaId": "1783309947097",
      "ninjaName": "神秘面具男【红夜之刃】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 2
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 3
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353293524",
      "ninjaId": "1783309960047",
      "ninjaName": "千手柱间【木叶创立】",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 3
        },
        {
          "scrollId": "1783350105829",
          "scrollName": "水遁·雾隐之术",
          "priority": 4
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353309536",
      "ninjaId": "1783309985981",
      "ninjaName": "大筒木桃式",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353327519",
      "ninjaId": "1783310025577",
      "ninjaName": "宇智波止水【须佐能乎】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353350685",
      "ninjaId": "1783310042732",
      "ninjaName": "宇智波佐助【疾风传咒印】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 5
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353369816",
      "ninjaId": "1783310057848",
      "ninjaName": "猿飞阿斯玛【神驹佑将】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353379884",
      "ninjaId": "1783310082543",
      "ninjaName": "宇智波佐助【万花筒写轮眼】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353390605",
      "ninjaId": "1783310110175",
      "ninjaName": "机械鸣人【初始形态】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350438746",
          "scrollName": "通灵·操手里剑",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353399076",
      "ninjaId": "1783310155158",
      "ninjaName": "波风水门【青年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353409880",
      "ninjaId": "1783310175876",
      "ninjaName": "旗木卡卡西【幻之真容】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353440302",
      "ninjaId": "1783310187740",
      "ninjaName": "小南【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 3
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353459443",
      "ninjaId": "1783310202753",
      "ninjaName": "角度【晓创生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353471047",
      "ninjaId": "1783310212236",
      "ninjaName": "角度【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353484866",
      "ninjaId": "1783310469533",
      "ninjaName": "照美冥【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353514036",
      "ninjaId": "1783310494403",
      "ninjaName": "照美冥【五代目水影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "8",
          "scrollName": "忍体术·反",
          "priority": 2
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353528301",
      "ninjaId": "1783310506586",
      "ninjaName": "照美冥【夏日限定】",
      "scrolls": [
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353535228",
      "ninjaId": "1783310541594",
      "ninjaName": "药师兜【半蛇半篷】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 3
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 4
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353552735",
      "ninjaId": "1783310560092",
      "ninjaName": "不风",
      "scrolls": [
        {
          "scrollId": "1783611799449",
          "scrollName": "影分身之术",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783353567824",
      "ninjaId": "1783317232603",
      "ninjaName": "卑留呼【火之意志继承者】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783353585380",
      "ninjaId": "1783310586721",
      "ninjaName": "神农【羁绊】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 6
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 7
        },
        {
          "scrollId": "1783349530165",
          "scrollName": "掌仙术·活",
          "priority": 8
        }
      ]
    },
    {
      "id": "1783353603368",
      "ninjaId": "1783310597861",
      "ninjaName": "不动",
      "scrolls": [
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353622790",
      "ninjaId": "1783310618145",
      "ninjaName": "千手扉间【漂泊武士】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353635461",
      "ninjaId": "1783315425090",
      "ninjaName": "大蛇丸【百战】",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        },
        {
          "scrollId": "1783349530165",
          "scrollName": "掌仙术·活",
          "priority": 2
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353653686",
      "ninjaId": "1783315526387",
      "ninjaName": "猿飞日斩【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783350438746",
          "scrollName": "通灵·操手里剑",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353678694",
      "ninjaId": "1783315450040",
      "ninjaName": "自来也【舞之豪杰】",
      "scrolls": [
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 5
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 6
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 7
        },
        {
          "scrollId": "1783350241768",
          "scrollName": "幻术·时间回溯",
          "priority": 8
        }
      ]
    },
    {
      "id": "1783353703207",
      "ninjaId": "1783315611859",
      "ninjaName": "宇智波佐助【永恒万花筒】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353720509",
      "ninjaId": "1783315644309",
      "ninjaName": "宇智波斑【秽土转生·解】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "8",
          "scrollName": "忍体术·反",
          "priority": 2
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 3
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353735492",
      "ninjaId": "1783315657260",
      "ninjaName": "佩恩【天道】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 5
        },
        {
          "scrollId": "11",
          "scrollName": "封印术·除魔",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353745496",
      "ninjaId": "1783315694697",
      "ninjaName": "大筒木舍人【最终章】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353753000",
      "ninjaId": "1783315719485",
      "ninjaName": "漩涡鸣人【暴怒·第六尾】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353768587",
      "ninjaId": "1783315831043",
      "ninjaName": "旗木卡卡西【元气夏日】",
      "scrolls": [
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353779304",
      "ninjaId": "1783315995490",
      "ninjaName": "纲手【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783353791463",
      "ninjaId": "1783316092726",
      "ninjaName": "日向宁次【忍界大战】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353798001",
      "ninjaId": "1783316139532",
      "ninjaName": "纲手【妖怪奇谭】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783350241768",
          "scrollName": "幻术·时间回溯",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353808847",
      "ninjaId": "1783316337877",
      "ninjaName": "漩涡鸣人【仙人模式】",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353815886",
      "ninjaId": "1783316350750",
      "ninjaName": "旗木卡卡西【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783353822970",
      "ninjaId": "1783316390820",
      "ninjaName": "志村团藏【漂泊寻者】",
      "scrolls": [
        {
          "scrollId": "1783349556366",
          "scrollName": "幻术·此处非之术",
          "priority": 1
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 4
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353833295",
      "ninjaId": "1783316484124",
      "ninjaName": "黑土【四代目土影】",
      "scrolls": [
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353852645",
      "ninjaId": "1783316531227",
      "ninjaName": "蝎【绯流琥】",
      "scrolls": [
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783353860592",
      "ninjaId": "1783316544775",
      "ninjaName": "迪达拉【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783353870882",
      "ninjaId": "1783316557259",
      "ninjaName": "迪达拉【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353877869",
      "ninjaId": "1783316568177",
      "ninjaName": "迪达拉【晓创生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353890970",
      "ninjaId": "1783316581671",
      "ninjaName": "宇智波止水",
      "scrolls": [
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 5
        },
        {
          "scrollId": "1783349977627",
          "scrollName": "解术·复",
          "priority": 6
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 7
        }
      ]
    },
    {
      "id": "1783353904025",
      "ninjaId": "1783316598915",
      "ninjaName": "药师兜【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353916981",
      "ninjaId": "1783316611067",
      "ninjaName": "宇智波止水【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353937863",
      "ninjaId": "1783316659432",
      "ninjaName": "我爱罗【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783353965513",
      "ninjaId": "1783316699625",
      "ninjaName": "长十郎【六代目水影】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353972624",
      "ninjaId": "1783316708410",
      "ninjaName": "奇拉比",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783353994437",
      "ninjaId": "1783316837191",
      "ninjaName": "自来也",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783354010917",
      "ninjaId": "1783316866447",
      "ninjaName": "宇智波斑",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354022043",
      "ninjaId": "1783317037451",
      "ninjaName": "蝎",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 3
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783354034480",
      "ninjaId": "1783317048070",
      "ninjaName": "艾【青年】",
      "scrolls": [
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350438746",
          "scrollName": "通灵·操手里剑",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354050861",
      "ninjaId": "1783317166362",
      "ninjaName": "长门【青年】",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783354058484",
      "ninjaId": "1783317000043",
      "ninjaName": "宇智波鼬【夏日限定】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783350438746",
          "scrollName": "通灵·操手里剑",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354070923",
      "ninjaId": "1783316924693",
      "ninjaName": "艾【三代目雷影】",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354080355",
      "ninjaId": "1783317107402",
      "ninjaName": "波风水门【百战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "8",
          "scrollName": "忍体术·反",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783354093891",
      "ninjaId": "1783317150636",
      "ninjaName": "佩恩·天道【百战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783354102278",
      "ninjaId": "1783317179649",
      "ninjaName": "李洛克【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 4
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 5
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783354114314",
      "ninjaId": "1783317031053",
      "ninjaName": "蝎【百机操演】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354125383",
      "ninjaId": "1783316959901",
      "ninjaName": "春野樱【百豪】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354145287",
      "ninjaId": "1783316892822",
      "ninjaName": "迪达拉",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 3
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783354172459",
      "ninjaId": "1783316945983",
      "ninjaName": "神秘面具男【忍者之路】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783354185492",
      "ninjaId": "1783316976705",
      "ninjaName": "小南【神驹佑将】",
      "scrolls": [
        {
          "scrollId": "1783350886684",
          "scrollName": "冰遁·爆雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783615817111",
      "ninjaId": "1783613067111",
      "ninjaName": "干柿鬼鲛【青年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783615832489",
      "ninjaId": "1783612963145",
      "ninjaName": "飞段【恶灵之影】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783615863743",
      "ninjaId": "1783612892533",
      "ninjaName": "飞段【晓创生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783615875561",
      "ninjaId": "1783612815098",
      "ninjaName": "三船",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783615884201",
      "ninjaId": "1783612673505",
      "ninjaName": "天天【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783615902259",
      "ninjaId": "1783612618366",
      "ninjaName": "绝",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783615936098",
      "ninjaId": "1783612495912",
      "ninjaName": "宇智波鼬",
      "scrolls": [
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 3
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 4
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783615944625",
      "ninjaId": "1783612422409",
      "ninjaName": "三船【青年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783615960961",
      "ninjaId": "1783612306958",
      "ninjaName": "桃地再不斩【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783350105829",
          "scrollName": "水遁·雾隐之术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783615971660",
      "ninjaId": "1783612223157",
      "ninjaName": "秋道丁次【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "1783349884279",
          "scrollName": "封印术·四肢重封印",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783615980885",
      "ninjaId": "1783612144356",
      "ninjaName": "宇智波泉奈",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 5
        }
      ]
    },
    {
      "id": "1783615999072",
      "ninjaId": "1783612076325",
      "ninjaName": "猿飞阿斯玛【桀骜之刃】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783616022106",
      "ninjaId": "1783591722037",
      "ninjaName": "黑绝",
      "scrolls": [
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 1
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783616037440",
      "ninjaId": "1783317094790",
      "ninjaName": "纲手【少女】",
      "scrolls": [
        {
          "scrollId": "6",
          "scrollName": "通灵·护手里剑",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783616049328",
      "ninjaId": "1783317084240",
      "ninjaName": "重吾【鹰】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783616057153",
      "ninjaId": "1783316753096",
      "ninjaName": "紫阳花",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783616071629",
      "ninjaId": "1783316968545",
      "ninjaName": "蝎【晓创生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783616087402",
      "ninjaId": "1783316859772",
      "ninjaName": "纲手【传说中的三忍】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783616095001",
      "ninjaId": "1783316800764",
      "ninjaName": "雨琉【羁绊】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783616100075",
      "ninjaId": "1783316733980",
      "ninjaName": "大和【木叶工匠】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783773764346",
      "ninjaId": "1783763999035",
      "ninjaName": "不缘",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783773783144",
      "ninjaId": "1783773559637",
      "ninjaName": "春野樱【沙滩排球】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783773796844",
      "ninjaId": "1783773718280",
      "ninjaName": "干柿鬼鲛【鲛肌融合】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783773814925",
      "ninjaId": "1783735988278",
      "ninjaName": "宇智波佐助【兄弟之战】",
      "scrolls": [
        {
          "scrollId": "1783349556366",
          "scrollName": "幻术·此处非之术",
          "priority": 1
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 6
        }
      ]
    },
    {
      "id": "1783820728398",
      "ninjaId": "1783820703293",
      "ninjaName": "猿飞日斩",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        }
      ]
    },
    {
      "id": "1784014845727",
      "ninjaId": "1784014794401",
      "ninjaName": "伊豆野山葵",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 5
        }
      ]
    },
    {
      "id": "1784014876510",
      "ninjaId": "1784014706369",
      "ninjaName": "烈斗【初代目风影】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1784014887642",
      "ninjaId": "1784014504732",
      "ninjaName": "自来也【少年】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784014919805",
      "ninjaId": "1784014419187",
      "ninjaName": "小南",
      "scrolls": [
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784014939670",
      "ninjaId": "1784014250542",
      "ninjaName": "大野木【三代目土影】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1784014950687",
      "ninjaId": "1784005003107",
      "ninjaName": "雨乃",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784014965089",
      "ninjaId": "1784005135985",
      "ninjaName": "天天【峨眉宗师】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784014982951",
      "ninjaId": "1784014307099",
      "ninjaName": "大野木【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        }
      ]
    },
    {
      "id": "1784014990825",
      "ninjaId": "1784005699565",
      "ninjaName": "新希",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1784015058369",
      "ninjaId": "1784005768895",
      "ninjaName": "野原琳【特别护理】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
        }
      ]
    },
    {
      "id": "1784015065497",
      "ninjaId": "1784005572928",
      "ninjaName": "山中井野【赛事限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1784015162998",
      "ninjaId": "1784005327339",
      "ninjaName": "汉【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784015173947",
      "ninjaId": "1784005472314",
      "ninjaName": "月光疾风【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784018863502",
      "ninjaId": "1784018835905",
      "ninjaName": "宇智波鼬【须佐能乎】",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784018875699",
      "ninjaId": "1784018790869",
      "ninjaName": "日向雏田【最终章】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1784018884871",
      "ninjaId": "1784018638140",
      "ninjaName": "迈特凯",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784018899460",
      "ninjaId": "1784018555884",
      "ninjaName": "大筒木浦式【异星钓者】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784018909318",
      "ninjaId": "1784018320448",
      "ninjaName": "小南【夏日限定】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "1783350886684",
          "scrollName": "冰遁·爆雪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784018917678",
      "ninjaId": "1784018273482",
      "ninjaName": "漩涡鸣人·宇智波佐助",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1784018926683",
      "ninjaId": "1784018208054",
      "ninjaName": "漩涡鸣人·自来也【修行之旅】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784093273217",
      "ninjaId": "1784074755345",
      "ninjaName": "大蛇丸",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784369858615",
      "ninjaId": "1784343219595",
      "ninjaName": "药师兜【少年】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 3
        },
        {
          "scrollId": "1783350283755",
          "scrollName": "雷遁·四柱束缚",
          "priority": 4
        }
      ]
    },
    {
      "id": "1784369888525",
      "ninjaId": "1784343865068",
      "ninjaName": "黑绝（附身）",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        },
        {
          "scrollId": "1783349530165",
          "scrollName": "掌仙术·活",
          "priority": 2
        }
      ]
    },
    {
      "id": "1784904671253",
      "ninjaId": "1784889021640",
      "ninjaName": "波风水门【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1785316486440",
      "ninjaId": "1785316064800",
      "ninjaName": "千手柱间【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 4
        },
        {
          "scrollId": "1783349772182",
          "scrollName": "木遁·一字连柱",
          "priority": 5
        }
      ]
    },
    {
      "id": "1785510825724",
      "ninjaId": "1785510738512",
      "ninjaName": "干柿鬼鲛【狂野鲛鲨】",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1785510968105",
      "ninjaId": "1785510624612",
      "ninjaName": "迈特凯【钢铁之躯】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1785510977004",
      "ninjaId": "1785510479412",
      "ninjaName": "自来也【仙人模式】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1785664754694",
      "ninjaId": "1785664729438",
      "ninjaName": "大野木【侠影江湖】",
      "scrolls": [
        {
          "scrollId": "1783350438746",
          "scrollName": "通灵·操手里剑",
          "priority": 1
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1785736080690",
      "ninjaId": "1785725206087",
      "ninjaName": "李洛克【截拳宗师】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        },
        {
          "scrollId": "1783349062619",
          "scrollName": "通灵·返手里剑",
          "priority": 2
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1786094309096",
      "ninjaId": "1786091194700",
      "ninjaName": "猿飞阿斯玛【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        }
      ]
    },
    {
      "id": "1786094322996",
      "ninjaId": "1786091108484",
      "ninjaName": "迈特凯【青春爆炸】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1786154996313",
      "ninjaId": "1786154974076",
      "ninjaName": "三代目风影",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1786155407951",
      "ninjaId": "1786155239203",
      "ninjaName": "壹·叁【火之意志继承者】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349530165",
          "scrollName": "掌仙术·活",
          "priority": 2
        },
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 3
        }
      ]
    },
    {
      "id": "1787320076239",
      "ninjaId": "1787320053635",
      "ninjaName": "飞段【晓·三】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "1783350557155",
          "scrollName": "掌仙术·振奋",
          "priority": 3
        }
      ]
    },
    {
      "id": "1787364349638",
      "ninjaId": "1787364324882",
      "ninjaName": "神秘面具男【百战】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1787921926405",
      "ninjaId": "1787921868771",
      "ninjaName": "不立土",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1788836366677",
      "ninjaId": "1788836283041",
      "ninjaName": "白【漂泊武士】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1788836576912",
      "ninjaId": "1788788499677",
      "ninjaName": "日向花火【武当宗师】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 3
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 4
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 5
        },
        {
          "scrollId": "1783350241768",
          "scrollName": "幻术·时间回溯",
          "priority": 6
        }
      ]
    },
    {
      "id": "1788876596676",
      "ninjaId": "1788876338242",
      "ninjaName": "日向花火【冬日限定】",
      "scrolls": [
        {
          "scrollId": "4",
          "scrollName": "雷遁·雷电击",
          "priority": 1
        },
        {
          "scrollId": "1783349884279",
          "scrollName": "封印术·四肢重封印",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 4
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 5
        }
      ]
    },
    {
      "id": "1788918438969",
      "ninjaId": "1788916901381",
      "ninjaName": "土台【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 3
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 4
        }
      ]
    },
    {
      "id": "1788918474740",
      "ninjaId": "1788917040023",
      "ninjaName": "飞段【死司凭血】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1788918494196",
      "ninjaId": "1788917165295",
      "ninjaName": "角度【地怨虞】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1788918763501",
      "ninjaId": "1788917296594",
      "ninjaName": "勘九郎【指导上忍】",
      "scrolls": [
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 3
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 4
        }
      ]
    },
    {
      "id": "1788918834146",
      "ninjaId": "1788917471152",
      "ninjaName": "达鲁伊",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1788918878826",
      "ninjaId": "1788917702688",
      "ninjaName": "猿飞日斩【三忍之师】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1788918983258",
      "ninjaId": "1788917946367",
      "ninjaName": "勘九郎【忍界大战】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        },
        {
          "scrollId": "1783350105829",
          "scrollName": "水遁·雾隐之术",
          "priority": 4
        }
      ]
    },
    {
      "id": "1788919067212",
      "ninjaId": "1788918113976",
      "ninjaName": "猿飞日斩【火影继承人】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1788919141600",
      "ninjaId": "1788918398909",
      "ninjaName": "加藤断",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1789098495281",
      "ninjaId": "1789098396723",
      "ninjaName": "宇智波鼬【晓·朱】",
      "scrolls": [
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1789178950486",
      "ninjaId": "1789178878803",
      "ninjaName": "大和【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783350557155",
          "scrollName": "掌仙术·振奋",
          "priority": 1
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 2
        }
      ]
    },
    {
      "id": "1789297100309",
      "ninjaId": "1789296416670",
      "ninjaName": "奇拉比【忍界大战】",
      "scrolls": [
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1789297127417",
      "ninjaId": "1789296484148",
      "ninjaName": "千代【近松十人卫】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 3
        }
      ]
    },
    {
      "id": "1789297139803",
      "ninjaId": "1789296538418",
      "ninjaName": "纲手",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1789297221163",
      "ninjaId": "1789296711939",
      "ninjaName": "鬼灯满月【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "5",
          "scrollName": "水遁·水冲波",
          "priority": 1
        }
      ]
    },
    {
      "id": "1789297327967",
      "ninjaId": "1789296877572",
      "ninjaName": "羽高【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1789297410352",
      "ninjaId": "1789296988071",
      "ninjaName": "佩恩【畜生道】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        }
      ]
    },
    {
      "id": "1789374380554",
      "ninjaId": "1789372944362",
      "ninjaName": "阿茨伊",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1789374945430",
      "ninjaId": "1789374915520",
      "ninjaName": "漩涡鸣人【忍者学员】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "1783349114634",
          "scrollName": "风遁·斩空波",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790213317604",
      "ninjaId": "1790212950413",
      "ninjaName": "大蛇丸【传说中的三忍】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 4
        }
      ]
    },
    {
      "id": "1790213333400",
      "ninjaId": "1790213191185",
      "ninjaName": "角度【晓·北】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790254167537",
      "ninjaId": "1790254146794",
      "ninjaName": "佐井【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790301807729",
      "ninjaId": "1790301793169",
      "ninjaName": "角都",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790309455456",
      "ninjaId": "1790308386823",
      "ninjaName": "旗木卡卡西",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790309462886",
      "ninjaId": "1790308503004",
      "ninjaName": "地陆",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790309476321",
      "ninjaId": "1790308952475",
      "ninjaName": "志村团藏",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790309482197",
      "ninjaId": "1790309313890",
      "ninjaName": "阿飞",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790309491121",
      "ninjaId": "1790309407485",
      "ninjaName": "飞段",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790395751088",
      "ninjaId": "1790395736001",
      "ninjaName": "白【中秋限定】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790396343253",
      "ninjaId": "1790396327811",
      "ninjaName": "夕日红【少女】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790396838808",
      "ninjaId": "1790396811670",
      "ninjaName": "佐井【中秋限定】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790397500512",
      "ninjaId": "1790397483276",
      "ninjaName": "宇智波带土【少年】",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790397798456",
      "ninjaId": "1790397769770",
      "ninjaName": "卯月夕颜【忍界大战】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790398090008",
      "ninjaId": "1790398050154",
      "ninjaName": "宇智波鼬【红夜之刃】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790398527096",
      "ninjaId": "1790398468018",
      "ninjaName": "萨姆伊【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790398770257",
      "ninjaId": "1790398737992",
      "ninjaName": "奥摩伊",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790399103251",
      "ninjaId": "1790399043148",
      "ninjaName": "君麻吕【漂泊浪客】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790399552949",
      "ninjaId": "1790399491995",
      "ninjaName": "药师兜【新春限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790399899041",
      "ninjaId": "1790399847047",
      "ninjaName": "重吾【忍界大战】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790400139424",
      "ninjaId": "1790400124420",
      "ninjaName": "二位由木人【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790400294302",
      "ninjaId": "1790400268224",
      "ninjaName": "矢仓【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790400466152",
      "ninjaId": "1790400451030",
      "ninjaName": "枫【七尾人柱力】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790400701110",
      "ninjaId": "1790400687728",
      "ninjaName": "枫【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790417380448",
      "ninjaId": "1790417370499",
      "ninjaName": "猿飞阿斯玛",
      "scrolls": [
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790430075659",
      "ninjaId": "1790430061845",
      "ninjaName": "佐井【最终章】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432908625",
      "ninjaId": "1790431069404",
      "ninjaName": "千手扉间【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432917947",
      "ninjaId": "1790431282374",
      "ninjaName": "宇智波斑【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432926880",
      "ninjaId": "1790431443918",
      "ninjaName": "千手柱间【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432942848",
      "ninjaId": "1790431810337",
      "ninjaName": "木叶丸军团",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        }
      ]
    },
    {
      "id": "1790432951869",
      "ninjaId": "1790432078983",
      "ninjaName": "神月出云",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432963018",
      "ninjaId": "1790432141511",
      "ninjaName": "不知火玄间",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790432976778",
      "ninjaId": "1790432207733",
      "ninjaName": "钢子铁",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1790432993671",
      "ninjaId": "1790432406944",
      "ninjaName": "次郎坊【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790433001899",
      "ninjaId": "1790432687957",
      "ninjaName": "并足雷同",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790433010884",
      "ninjaId": "1790432893282",
      "ninjaName": "月光疾风",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1790994108326",
      "ninjaId": "1790994089512",
      "ninjaName": "干柿鬼鲛",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791385272814",
      "ninjaId": "1791121006214",
      "ninjaName": "日向宁次【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791385290304",
      "ninjaId": "1791041755537",
      "ninjaName": "药师野乃宇",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791385930782",
      "ninjaId": "1791127448977",
      "ninjaName": "阿三",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791386560607",
      "ninjaId": "1791122715458",
      "ninjaName": "野原琳【漂泊浪客】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791386573045",
      "ninjaId": "1791123002916",
      "ninjaName": "自来也【木叶三忍】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791431486634",
      "ninjaId": "1791104228053",
      "ninjaName": "日向雏田【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791432742351",
      "ninjaId": "1791082452460",
      "ninjaName": "秋道蝶蝶",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791432801296",
      "ninjaId": "1791089984600",
      "ninjaName": "春野樱【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433121531",
      "ninjaId": "1791103087018",
      "ninjaName": "君麻吕",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433294001",
      "ninjaId": "1791130922568",
      "ninjaName": "风祭萌黄",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433312141",
      "ninjaId": "1791081306367",
      "ninjaName": "迈特戴",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433512643",
      "ninjaId": "1791124630751",
      "ninjaName": "夕日红【和服】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433523209",
      "ninjaId": "1791125564166",
      "ninjaName": "油女龙马",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433530789",
      "ninjaId": "1791129618324",
      "ninjaName": "鬼灯幻月【鹰】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433542382",
      "ninjaId": "1791214590702",
      "ninjaName": "汉【五尾人柱力】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433552743",
      "ninjaId": "1791084176955",
      "ninjaName": "宇智波佐助【篮球之星】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433563627",
      "ninjaId": "1791128546857",
      "ninjaName": "佩恩【地狱道】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791433571089",
      "ninjaId": "1791002694399",
      "ninjaName": "金·槌",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433581248",
      "ninjaId": "1791041418200",
      "ninjaName": "漩涡玖辛奈【少女】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433588821",
      "ninjaId": "1791083315089",
      "ninjaName": "奈良鹿台",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433598565",
      "ninjaId": "1791105093119",
      "ninjaName": "卯月夕颜",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433620846",
      "ninjaId": "1791106538813",
      "ninjaName": "贰【火之意志继承者】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433626005",
      "ninjaId": "1791107165219",
      "ninjaName": "宇智波佐助【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791433639796",
      "ninjaId": "1791107437074",
      "ninjaName": "春野樱【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433650542",
      "ninjaId": "1791108245126",
      "ninjaName": "日向雏田【八极宗师】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433665853",
      "ninjaId": "1791121249227",
      "ninjaName": "日向宁次【咏春宗师】",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433682933",
      "ninjaId": "1791126392790",
      "ninjaName": "马基",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433694295",
      "ninjaId": "1791126926251",
      "ninjaName": "白【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791433716228",
      "ninjaId": "1791105727175",
      "ninjaName": "大和【暗部】",
      "scrolls": [
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791434049538",
      "ninjaId": "1791105461603",
      "ninjaName": "大和",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434166343",
      "ninjaId": "1791004788011",
      "ninjaName": "春野樱【赛事限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434224559",
      "ninjaId": "1791000986913",
      "ninjaName": "春野樱",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434307564",
      "ninjaId": "1791103665239",
      "ninjaName": "春野樱【忍者少女】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434371470",
      "ninjaId": "1791003548591",
      "ninjaName": "春野樱【忍者新秀】",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791434382212",
      "ninjaId": "1791107314831",
      "ninjaName": "春野樱【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434388222",
      "ninjaId": "1791173456548",
      "ninjaName": "春野樱【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434420566",
      "ninjaId": "1791004159673",
      "ninjaName": "漩涡鸣人【赛事限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434498498",
      "ninjaId": "1791089755422",
      "ninjaName": "漩涡鸣人【第一尾】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434546276",
      "ninjaId": "1791000765013",
      "ninjaName": "漩涡鸣人",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434594903",
      "ninjaId": "1791089622892",
      "ninjaName": "漩涡鸣人【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434606604",
      "ninjaId": "1791172900039",
      "ninjaName": "漩涡鸣人【第四尾】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434699651",
      "ninjaId": "1791004312548",
      "ninjaName": "宇智波佐助【赛事限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434890635",
      "ninjaId": "1791000914582",
      "ninjaName": "宇智波佐助",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434899941",
      "ninjaId": "1791001151929",
      "ninjaName": "宇智波佐助【写轮眼】",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791434905346",
      "ninjaId": "1791089836126",
      "ninjaName": "宇智波佐助【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434910709",
      "ninjaId": "1791103400024",
      "ninjaName": "宇智波佐助【咒印】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791434918205",
      "ninjaId": "1791107046746",
      "ninjaName": "宇智波佐助【忍者之路】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791435034499",
      "ninjaId": "1791124933516",
      "ninjaName": "夕日红【冬日限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791435159592",
      "ninjaId": "1791125157702",
      "ninjaName": "漩涡玖辛奈【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791545237720",
      "ninjaId": "1791041992420",
      "ninjaName": "惠比寿【少年】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791545386785",
      "ninjaId": "1791126111147",
      "ninjaName": "油女取根【漂泊寻者】",
      "scrolls": [
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791638303753",
      "ninjaId": "1791080912830",
      "ninjaName": "左近右近【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776185481",
      "ninjaId": "1791173094227",
      "ninjaName": "漩涡鸣人【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776214179",
      "ninjaId": "1791177037842",
      "ninjaName": "旗木卡卡西【新春限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791776237373",
      "ninjaId": "1791102265776",
      "ninjaName": "惠比寿",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791776243569",
      "ninjaId": "1791102705453",
      "ninjaName": "勘九郎【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776293416",
      "ninjaId": "1791001452213",
      "ninjaName": "秋道丁次",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791776334764",
      "ninjaId": "1791090292396",
      "ninjaName": "秋道丁次【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776354389",
      "ninjaId": "1791121712057",
      "ninjaName": "李洛克【木叶飞人】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776362785",
      "ninjaId": "1791080341396",
      "ninjaName": "长门【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791776370617",
      "ninjaId": "1791081581999",
      "ninjaName": "结乃岩部",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791776691715",
      "ninjaId": "1791002027507",
      "ninjaName": "静香",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791777051910",
      "ninjaId": "1791002153199",
      "ninjaName": "手鞠",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791777126022",
      "ninjaId": "1791002477765",
      "ninjaName": "手鞠【镰多利】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791777137000",
      "ninjaId": "1791003256537",
      "ninjaName": "李洛克",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791777304786",
      "ninjaId": "1791003698898",
      "ninjaName": "萨克·镫",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791777410429",
      "ninjaId": "1791004034341",
      "ninjaName": "尤鲁伊",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791777534768",
      "ninjaId": "1791040710749",
      "ninjaName": "秋道丁次【赛事限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791777699359",
      "ninjaId": "1791040893366",
      "ninjaName": "天天【新春风旗袍】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791777795726",
      "ninjaId": "1791080029118",
      "ninjaName": "奇拉比【少年】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 2
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 3
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 4
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 5
        }
      ]
    },
    {
      "id": "1791778029375",
      "ninjaId": "1791001643980",
      "ninjaName": "日向雏田",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791778150391",
      "ninjaId": "1791001292342",
      "ninjaName": "奈良鹿丸",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778189821",
      "ninjaId": "1791001227443",
      "ninjaName": "山中井野",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778200140",
      "ninjaId": "1791001800702",
      "ninjaName": "犬塚牙",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778240594",
      "ninjaId": "1791001866604",
      "ninjaName": "油女志乃",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778357851",
      "ninjaId": "1791002273219",
      "ninjaName": "勘九郎",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791778411403",
      "ninjaId": "1791002346915",
      "ninjaName": "海野伊鲁卡",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778538823",
      "ninjaId": "1791002759751",
      "ninjaName": "次郎坊",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791778684434",
      "ninjaId": "1791002905935",
      "ninjaName": "左近右近",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791778725781",
      "ninjaId": "1791003035617",
      "ninjaName": "多由也",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778862050",
      "ninjaId": "1791003152075",
      "ninjaName": "日向宁次",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783350480900",
          "scrollName": "忍法·蛙变之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791778901711",
      "ninjaId": "1791003369475",
      "ninjaName": "日向花火",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791778962763",
      "ninjaId": "1791003458333",
      "ninjaName": "鬼童丸",
      "scrolls": [
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 1
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791779043463",
      "ninjaId": "1791084220633",
      "ninjaName": "圈圈脸【大和】",
      "scrolls": [
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791779102009",
      "ninjaId": "1791090126679",
      "ninjaName": "山中井野【疾风传】",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791779197589",
      "ninjaId": "1791090538339",
      "ninjaName": "天天【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 2
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791779261343",
      "ninjaId": "1791090674777",
      "ninjaName": "木叶丸【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791779324246",
      "ninjaId": "1791102951300",
      "ninjaName": "白",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791779370013",
      "ninjaId": "1791103784575",
      "ninjaName": "佐井",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791779381221",
      "ninjaId": "1791106161893",
      "ninjaName": "重吾",
      "scrolls": [
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 1
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791779386691",
      "ninjaId": "1791121340602",
      "ninjaName": "李洛克【杜门】",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791779513221",
      "ninjaId": "1791128056605",
      "ninjaName": "赤土【新春限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791779624541",
      "ninjaId": "1791128287773",
      "ninjaName": "佩恩【人间道】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791779672417",
      "ninjaId": "1791128742133",
      "ninjaName": "佩恩【饿鬼道】",
      "scrolls": [
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        }
      ]
    },
    {
      "id": "1791780367866",
      "ninjaId": "1791130042863",
      "ninjaName": "二位由木人【奇拉比落风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791780593069",
      "ninjaId": "1791130426246",
      "ninjaName": "矢仓【奇拉比落风传】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791780606194",
      "ninjaId": "1791174705363",
      "ninjaName": "奈良鹿丸【新春限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791780611445",
      "ninjaId": "1791174916610",
      "ninjaName": "奈良鹿丸【忍界大战】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791780747520",
      "ninjaId": "1791175333711",
      "ninjaName": "日向雏田【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791780806503",
      "ninjaId": "1791175887606",
      "ninjaName": "油女志乃【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 1
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791780852923",
      "ninjaId": "1791176409720",
      "ninjaName": "天天【忍者少女】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791781006727",
      "ninjaId": "1791176715602",
      "ninjaName": "天天【神驹佑将】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791781014714",
      "ninjaId": "1791209113507",
      "ninjaName": "月光疾风【七夕限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791781019658",
      "ninjaId": "1791212468386",
      "ninjaName": "黑土",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791781119650",
      "ninjaId": "1791213429186",
      "ninjaName": "君麻吕【恶灵之影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791781170486",
      "ninjaId": "1791214787664",
      "ninjaName": "羽高【六尾人柱力】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791781273883",
      "ninjaId": "1791217065240",
      "ninjaName": "枫【夏日限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        },
        {
          "scrollId": "1783350008444",
          "scrollName": "秘卷·查克拉",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791812071750",
      "ninjaId": "1791104875173",
      "ninjaName": "野原琳",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812128150",
      "ninjaId": "1791116148575",
      "ninjaName": "犬塚牙【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812135237",
      "ninjaId": "1791116528845",
      "ninjaName": "犬塚牙【忍界大战】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812145208",
      "ninjaId": "1791120465552",
      "ninjaName": "油女志乃【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812158155",
      "ninjaId": "1791122395887",
      "ninjaName": "野原琳【元气少女】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812177026",
      "ninjaId": "1791123189782",
      "ninjaName": "大蛇丸【木叶三忍】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812182653",
      "ninjaId": "1791127108489",
      "ninjaName": "西瓜山河豚鬼【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812188615",
      "ninjaId": "1791127676562",
      "ninjaName": "黑土【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812275618",
      "ninjaId": "1791130665362",
      "ninjaName": "老紫【新佩恩六道】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812280647",
      "ninjaId": "1791178414780",
      "ninjaName": "静音【元气夏日】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812285941",
      "ninjaId": "1791176069855",
      "ninjaName": "李洛克【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812292142",
      "ninjaId": "1791208710617",
      "ninjaName": "卯月夕颜【七夕限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812297495",
      "ninjaId": "1791209291942",
      "ninjaName": "漩涡玖辛奈【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791812334919",
      "ninjaId": "1791209805132",
      "ninjaName": "油女取根",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812373518",
      "ninjaId": "1791210089918",
      "ninjaName": "海野伊鲁卡【西装】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812378401",
      "ninjaId": "1791210855130",
      "ninjaName": "帕库拉",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812383465",
      "ninjaId": "1791211210192",
      "ninjaName": "帕库拉【元气夏日】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812388389",
      "ninjaId": "1791211373776",
      "ninjaName": "长十郎",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812762790",
      "ninjaId": "1791211513472",
      "ninjaName": "通草野饵人【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812773303",
      "ninjaId": "1791211847155",
      "ninjaName": "林檎雨由利【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812778079",
      "ninjaId": "1791212022913",
      "ninjaName": "萨姆伊【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812786380",
      "ninjaId": "1791212308800",
      "ninjaName": "摩托伊",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812864260",
      "ninjaId": "1791212938491",
      "ninjaName": "佩恩【修罗道】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812872823",
      "ninjaId": "1791213744403",
      "ninjaName": "香燐【鹰】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812897519",
      "ninjaId": "1791214031833",
      "ninjaName": "香燐【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812916974",
      "ninjaId": "1791214976064",
      "ninjaName": "狩【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791812938854",
      "ninjaId": "1791215274235",
      "ninjaName": "猿飞未来",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791812949216",
      "ninjaId": "1791215871437",
      "ninjaName": "秋道丁次【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812967313",
      "ninjaId": "1791216196912",
      "ninjaName": "御手洗红豆【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812984732",
      "ninjaId": "1791216803144",
      "ninjaName": "香燐【夏日限定】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812991129",
      "ninjaId": "1791002561901",
      "ninjaName": "水门【咒印】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791812999096",
      "ninjaId": "1791003901522",
      "ninjaName": "多由也【秽土转生】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813009526",
      "ninjaId": "1791041045592",
      "ninjaName": "宇智波止水【忍者新秀】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813016284",
      "ninjaId": "1791041226298",
      "ninjaName": "大蛇丸【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813021206",
      "ninjaId": "1791041550383",
      "ninjaName": "山城青叶",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813037428",
      "ninjaId": "1791042141219",
      "ninjaName": "青",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813056747",
      "ninjaId": "1791079427531",
      "ninjaName": "希",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813062555",
      "ninjaId": "1791079551720",
      "ninjaName": "卡鲁伊",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813074172",
      "ninjaId": "1791079861759",
      "ninjaName": "麻布伊",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813081816",
      "ninjaId": "1791123400949",
      "ninjaName": "纲手【木叶三忍】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813094906",
      "ninjaId": "1791080220742",
      "ninjaName": "小南",
      "scrolls": [
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813100463",
      "ninjaId": "1791080514128",
      "ninjaName": "弥彦【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813107959",
      "ninjaId": "1791080583294",
      "ninjaName": "托斯·砧",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813300138",
      "ninjaId": "1791080792911",
      "ninjaName": "鬼童丸【秽土转生】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813305525",
      "ninjaId": "1791091191760",
      "ninjaName": "漩涡玖辛奈",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813317550",
      "ninjaId": "1791081077873",
      "ninjaName": "静香",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813322536",
      "ninjaId": "1791081213435",
      "ninjaName": "丸星古介",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813334087",
      "ninjaId": "1791081438297",
      "ninjaName": "漩涡博人",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813340138",
      "ninjaId": "1791082646594",
      "ninjaName": "梅塔尔·李",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813344078",
      "ninjaId": "1791082853082",
      "ninjaName": "荒谷",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813351481",
      "ninjaId": "1791105277236",
      "ninjaName": "宇智波鼬【暗部】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813355713",
      "ninjaId": "1791106309083",
      "ninjaName": "鬼灯水月",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813367344",
      "ninjaId": "1791106754807",
      "ninjaName": "漩涡鸣人【中秋限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813371349",
      "ninjaId": "1791107756392",
      "ninjaName": "奈良鹿丸【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813395975",
      "ninjaId": "1791117486678",
      "ninjaName": "犬塚花",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813453376",
      "ninjaId": "1791123527736",
      "ninjaName": "静音【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813490403",
      "ninjaId": "1791123849140",
      "ninjaName": "静音【冬日睡衣】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791813540935",
      "ninjaId": "1791124064503",
      "ninjaName": "御手洗红豆【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813633780",
      "ninjaId": "1791124413600",
      "ninjaName": "御手洗红豆【新春限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813678917",
      "ninjaId": "1791126533450",
      "ninjaName": "千代",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349488627",
          "scrollName": "通灵·雷光剑化",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791813691625",
      "ninjaId": "1791129224238",
      "ninjaName": "红莲",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813698174",
      "ninjaId": "1791129448878",
      "ninjaName": "香燐",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813705032",
      "ninjaId": "1791174153023",
      "ninjaName": "山中井野【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813709246",
      "ninjaId": "1791174399724",
      "ninjaName": "山中井野【忍者少女】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813762106",
      "ninjaId": "1791175123960",
      "ninjaName": "日向雏田【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813788220",
      "ninjaId": "1791175561089",
      "ninjaName": "日向雏田【忍者少女】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813809160",
      "ninjaId": "1791176870602",
      "ninjaName": "日向花火【和服】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813813157",
      "ninjaId": "1791177212743",
      "ninjaName": "纲手【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813821537",
      "ninjaId": "1791209526051",
      "ninjaName": "山中风",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791813832859",
      "ninjaId": "1791210248093",
      "ninjaName": "我爱罗【凭依体】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814040086",
      "ninjaId": "1791211653434",
      "ninjaName": "无梨甚八【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814045118",
      "ninjaId": "1791212157960",
      "ninjaName": "萨姆伊【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814051283",
      "ninjaId": "1791212637533",
      "ninjaName": "黑土【冬日限定】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814058158",
      "ninjaId": "1791212858454",
      "ninjaName": "赤土",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814085246",
      "ninjaId": "1791213584199",
      "ninjaName": "香燐【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814089228",
      "ninjaId": "1791214165543",
      "ninjaName": "二位由木人【二尾人柱力】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814101307",
      "ninjaId": "1791214283349",
      "ninjaName": "矢仓【三尾人柱力】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814111087",
      "ninjaId": "1791214400903",
      "ninjaName": "老紫【四尾人柱力】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814114853",
      "ninjaId": "1791215450660",
      "ninjaName": "伊势乌冬",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814122142",
      "ninjaId": "1791216535278",
      "ninjaName": "夕日红【七夕限定】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791814136620",
      "ninjaId": "1791083091964",
      "ninjaName": "宇智波鼬【忍者新秀】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814140509",
      "ninjaId": "1791090404291",
      "ninjaName": "李洛克【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814144723",
      "ninjaId": "1791090751368",
      "ninjaName": "旗木卡卡西【少年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814148708",
      "ninjaId": "1791090898435",
      "ninjaName": "御手洗红豆",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814192494",
      "ninjaId": "1791090944714",
      "ninjaName": "夕日红",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814196488",
      "ninjaId": "1791102496048",
      "ninjaName": "手鞠【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814200708",
      "ninjaId": "1791103243287",
      "ninjaName": "君麻吕【咒印】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814252633",
      "ninjaId": "1791104518356",
      "ninjaName": "日向雏田【忍者之路】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814271215",
      "ninjaId": "1791104689799",
      "ninjaName": "油女志乃【疾风传】",
      "scrolls": [
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 1
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 2
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791814322574",
      "ninjaId": "1791105892246",
      "ninjaName": "我爱罗",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791814326734",
      "ninjaId": "1791106011102",
      "ninjaName": "药师兜",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814368288",
      "ninjaId": "1791107635759",
      "ninjaName": "山中井野【夏日泳装】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814411359",
      "ninjaId": "1791108006937",
      "ninjaName": "日向雏田【元气夏日】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814415947",
      "ninjaId": "1791115752626",
      "ninjaName": "犬塚牙【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814420066",
      "ninjaId": "1791120668231",
      "ninjaName": "日向宁次【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814432825",
      "ninjaId": "1791121526420",
      "ninjaName": "李洛克【醉拳】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814437233",
      "ninjaId": "1791121978724",
      "ninjaName": "天天【中华面点师】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814442279",
      "ninjaId": "1791122206795",
      "ninjaName": "旗木卡卡西【暗部】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814504973",
      "ninjaId": "1791125906777",
      "ninjaName": "森乃伊比喜",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814538749",
      "ninjaId": "1791128921811",
      "ninjaName": "药师兜【恶灵之影】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814542829",
      "ninjaId": "1791173721521",
      "ninjaName": "佐井【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814584151",
      "ninjaId": "1791173926098",
      "ninjaName": "山中井野【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814591691",
      "ninjaId": "1791176258740",
      "ninjaName": "天天【冬日限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814600027",
      "ninjaId": "1791210706044",
      "ninjaName": "手鞠【忍界大战】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814643347",
      "ninjaId": "1791211748336",
      "ninjaName": "栗霰串丸【忍刀七人众】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814648381",
      "ninjaId": "1791219883529",
      "ninjaName": "日向宁次【中秋限定】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814671081",
      "ninjaId": "1791001922565",
      "ninjaName": "天天",
      "scrolls": [
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 1
        },
        {
          "scrollId": "1783349802096",
          "scrollName": "水遁·水盾",
          "priority": 2
        },
        {
          "scrollId": "1783349280153",
          "scrollName": "水遁·水龙卷",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791814799775",
      "ninjaId": "1791081848993",
      "ninjaName": "巳月",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 3
        }
      ]
    },
    {
      "id": "1791814805152",
      "ninjaId": "1791081944792",
      "ninjaName": "宇智波佐良娜",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        }
      ]
    },
    {
      "id": "1791814822005",
      "ninjaId": "1791082259450",
      "ninjaName": "山中井阵",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814835200",
      "ninjaId": "1791083996093",
      "ninjaName": "我爱罗【疾风传】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814885628",
      "ninjaId": "1791213103960",
      "ninjaName": "佩恩【畜生道】",
      "scrolls": [
        {
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
          "priority": 1
        },
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1791814909195",
      "ninjaId": "1791104026118",
      "ninjaName": "奈良鹿丸【最终章】",
      "scrolls": [
        {
          "scrollId": "1783349241266",
          "scrollName": "雷遁·地走",
          "priority": 1
        }
      ]
    }
  ]