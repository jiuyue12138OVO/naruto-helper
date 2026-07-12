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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
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
      "id": "1783351295746",
      "ninjaId": "5",
      "ninjaName": "波风水门【九喇嘛连结】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
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
        }
      ]
    },
    {
      "id": "1783351406172",
      "ninjaId": "9",
      "ninjaName": "宇智波斑【白面具】",
      "scrolls": [
        {
          "scrollId": "8",
          "scrollName": "忍体术·反",
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
      "id": "1783351482712",
      "ninjaId": "12",
      "ninjaName": "千手柱间",
      "scrolls": [
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
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
        }
      ]
    },
    {
      "id": "1783351515693",
      "ninjaId": "14",
      "ninjaName": "桃地再不斩",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 3
        },
        {
          "scrollId": "1783350043475",
          "scrollName": "风遁·气旋",
          "priority": 4
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
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
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
        }
      ]
    },
    {
      "id": "1783352466839",
      "ninjaId": "1783308796552",
      "ninjaName": "宇智波斑【神驹佑将】",
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
        }
      ]
    },
    {
      "id": "1783352517203",
      "ninjaId": "1783308858692",
      "ninjaName": "漩涡鸣人·宇智波佐助【宿命连结】",
      "scrolls": [
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
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
      "id": "1783352550436",
      "ninjaId": "1783308961488",
      "ninjaName": "宇智波带土【暴怒】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 4
        },
        {
          "scrollId": "1783349453506",
          "scrollName": "火遁·豪炎矢",
          "priority": 5
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
        }
      ]
    },
    {
      "id": "1783352923088",
      "ninjaId": "1783309572540",
      "ninjaName": "纲手【百豪】",
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
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
        }
      ]
    },
    {
      "id": "1783353059693",
      "ninjaId": "1783309774545",
      "ninjaName": "药师兜【仙人模式】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 2
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
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
          "scrollId": "1783350663437",
          "scrollName": "火遁·火炎阵",
          "priority": 3
        },
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        },
        {
          "scrollId": "3",
          "scrollName": "岚遁·雷云",
          "priority": 5
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
        }
      ]
    },
    {
      "id": "1783353135926",
      "ninjaId": "1783309816393",
      "ninjaName": "宇智波斑【木叶创立】",
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
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 3
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
        }
      ]
    },
    {
      "id": "1783353293524",
      "ninjaId": "1783309960047",
      "ninjaName": "千手柱间【木叶创立】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
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
      "id": "1783353309536",
      "ninjaId": "1783309985981",
      "ninjaName": "大筒木桃式",
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
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 4
        },
        {
          "scrollId": "1783349733336",
          "scrollName": "冰遁·燕吹雪",
          "priority": 5
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
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 2
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
      "id": "1783353471047",
      "ninjaId": "1783310212236",
      "ninjaName": "角度【秽土转生】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
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
          "scrollId": "8",
          "scrollName": "忍体术·反",
          "priority": 1
        },
        {
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
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
      "id": "1783353528301",
      "ninjaId": "1783310506586",
      "ninjaName": "照美冥【夏日限定】",
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
        }
      ]
    },
    {
      "id": "1783353552735",
      "ninjaId": "1783310560092",
      "ninjaName": "不风",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        },
        {
          "scrollId": "7",
          "scrollName": "忍体术·御",
          "priority": 2
        },
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 3
        },
        {
          "scrollId": "1783349530165",
          "scrollName": "掌仙术·活",
          "priority": 4
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
      "id": "1783353678694",
      "ninjaId": "1783315450040",
      "ninjaName": "自来也【舞之豪杰】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 3
        }
      ]
    },
    {
      "id": "1783353798001",
      "ninjaId": "1783316139532",
      "ninjaName": "纲手【妖怪奇谭】",
      "scrolls": [
        {
          "scrollId": "2",
          "scrollName": "冰遁·冻雪",
          "priority": 1
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
        }
      ]
    },
    {
      "id": "1783353822970",
      "ninjaId": "1783316390820",
      "ninjaName": "志村团藏【漂泊寻者】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
        }
      ]
    },
    {
      "id": "1783353833295",
      "ninjaId": "1783316484124",
      "ninjaName": "黑土【四代目土影】",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
      "id": "1783353860592",
      "ninjaId": "1783316544775",
      "ninjaName": "迪达拉【新春限定】",
      "scrolls": [
        {
          "scrollId": "1783349683914",
          "scrollName": "禁术·阴愈伤灭",
          "priority": 1
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
        }
      ]
    },
    {
      "id": "1783353890970",
      "ninjaId": "1783316581671",
      "ninjaName": "宇智波止水",
      "scrolls": [
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
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
      "id": "1783353904025",
      "ninjaId": "1783316598915",
      "ninjaName": "药师兜【侠影江湖】",
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
        },
        {
          "scrollId": "1783350583210",
          "scrollName": "幻术·一叶障",
          "priority": 4
        }
      ]
    },
    {
      "id": "1783353916981",
      "ninjaId": "1783316611067",
      "ninjaName": "宇智波止水【新春限定】",
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
      "id": "1783353937863",
      "ninjaId": "1783316659432",
      "ninjaName": "我爱罗【新春限定】",
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
        },
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
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
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783354034480",
      "ninjaId": "1783317048070",
      "ninjaName": "艾【青年】",
      "scrolls": [
        {
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 1
        },
        {
          "scrollId": "1783350518958",
          "scrollName": "忍体术·毅力",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783354050861",
      "ninjaId": "1783317166362",
      "ninjaName": "长门【青年】",
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
      "id": "1783354058484",
      "ninjaId": "1783317000043",
      "ninjaName": "宇智波鼬【夏日限定】",
      "scrolls": [
        {
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 1
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783354114314",
      "ninjaId": "1783317031053",
      "ninjaName": "蝎【百机操演】",
      "scrolls": [
        {
          "scrollId": "1783350925467",
          "scrollName": "时空间忍术",
          "priority": 1
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
          "scrollId": "1783349842473",
          "scrollName": "木遁·扦插之术",
          "priority": 1
        },
        {
          "scrollId": "9",
          "scrollName": "火遁·鬼灯笼",
          "priority": 2
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
          "priority": 3
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
          "scrollId": "12",
          "scrollName": "火遁·烈焰弹",
          "priority": 2
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
          "scrollId": "1783349379011",
          "scrollName": "风遁·真空波",
          "priority": 2
        },
        {
          "scrollId": "10",
          "scrollName": "土遁·地动",
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
        }
      ]
    },
    {
      "id": "1783616037440",
      "ninjaId": "1783317094790",
      "ninjaName": "纲手【少女】",
      "scrolls": [
        {
          "scrollId": "4",
          "scrollName": "雷遁·雷电击",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
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
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 2
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
          "scrollId": "1783349647927",
          "scrollName": "解术·散",
          "priority": 2
        }
      ]
    },
    {
      "id": "1783616095001",
      "ninjaId": "1783316800764",
      "ninjaName": "雨琉【羁绊】",
      "scrolls": [
        {
          "scrollId": "1",
          "scrollName": "风遁·风沙阵",
          "priority": 1
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
        }
      ]
    },
    {
      "id": "1783773814925",
      "ninjaId": "1783735988278",
      "ninjaName": "宇智波佐助【兄弟之战】",
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
          "scrollId": "1783349328947",
          "scrollName": "土遁·土流枪",
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
      "id": "1783820728398",
      "ninjaId": "1783820703293",
      "ninjaName": "猿飞日斩",
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
        }
      ]
    }
  ]