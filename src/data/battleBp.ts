// EXPORTS: IBPCounter, MOCK_COUNTERS

export interface IBPCounter {
  id: string                   // 唯一标识
  ninjaId: string              // 被克制的忍者ID
  counterNinjaIds: string[]    // 克制该忍者的忍者ID列表
  counterScrollIds: string[]   // 克制该忍者的密卷ID列表
  counterSummonIds: string[]   // 克制该忍者的通灵兽ID列表
}

// 初始为空，后续在管理页面配置
export const MOCK_COUNTERS: IBPCounter[] = [
    {
      "id": "1783594887769",
      "ninjaId": "6",
      "counterNinjaIds": [
        "1783309130139",
        "1783309415054",
        "1783310202753"
      ],
      "counterScrollIds": [
        "1783350952440",
        "12"
      ],
      "counterSummonIds": [
        "1783589344138"
      ]
    },
    {
      "id": "1783595220259",
      "ninjaId": "1783315644309",
      "counterNinjaIds": [
        "1783309415054",
        "1783310541594",
        "1783309398928"
      ],
      "counterScrollIds": [
        "1783349062619",
        "1"
      ],
      "counterSummonIds": [
        "1783588411488",
        "1783588233106"
      ]
    },
    {
      "id": "1783595588071",
      "ninjaId": "1783309257305",
      "counterNinjaIds": [
        "8",
        "1783309774545",
        "1783310042732",
        "9",
        "1783315644309"
      ],
      "counterScrollIds": [
        "1783349453506",
        "1783351060243",
        "1783350283755"
      ],
      "counterSummonIds": [
        "1783589344138"
      ]
    },
    {
      "id": "1783595886977",
      "ninjaId": "3",
      "counterNinjaIds": [
        "1783308767737",
        "1783310202753",
        "1783309415054",
        "1783309348233",
        "1783309130139",
        "1783309172598",
        "1783316484124",
        "1783315644309"
      ],
      "counterScrollIds": [
        "12",
        "1783349280153",
        "1783349379011",
        "1783349488627",
        "9"
      ],
      "counterSummonIds": [
        "1783587352179",
        "1783587125412"
      ]
    },
    {
      "id": "1783595970594",
      "ninjaId": "4",
      "counterNinjaIds": [
        "1783309162593",
        "5"
      ],
      "counterScrollIds": [],
      "counterSummonIds": [
        "1783589213344",
        "1783587234386"
      ]
    },
    {
      "id": "1783596074028",
      "ninjaId": "1783310042732",
      "counterNinjaIds": [
        "1783310187740",
        "1783309398928",
        "12",
        "1783310202753",
        "1783315644309"
      ],
      "counterScrollIds": [
        "1783349488627",
        "1783350043475"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783596096451",
      "ninjaId": "5",
      "counterNinjaIds": [
        "1783310187740",
        "1783309415054",
        "1783310202753"
      ],
      "counterScrollIds": [],
      "counterSummonIds": [
        "1783589344138"
      ]
    },
    {
      "id": "1783596179690",
      "ninjaId": "1783309311486",
      "counterNinjaIds": [
        "1783309186224",
        "1783309415054",
        "1783310541594",
        "1783310042732",
        "1783309691119"
      ],
      "counterScrollIds": [
        "1",
        "1783349453506",
        "1783349733336",
        "4"
      ],
      "counterSummonIds": [
        "1783588233106",
        "1783588271625",
        "1783589093236"
      ]
    },
    {
      "id": "1783596221427",
      "ninjaId": "1783591722037",
      "counterNinjaIds": [
        "1783309208477",
        "1783315719485"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    },
    {
      "id": "1783596280435",
      "ninjaId": "15",
      "counterNinjaIds": [
        "1783309311486",
        "1783316557259",
        "1783309172598",
        "1783315644309"
      ],
      "counterScrollIds": [
        "1783350283755",
        "1783349328947"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783596350597",
      "ninjaId": "1783309398928",
      "counterNinjaIds": [
        "1783308767737",
        "1783309208477",
        "1783309415054",
        "1783310586721",
        "1783310187740",
        "20",
        "1783310541594"
      ],
      "counterScrollIds": [
        "1783351060243",
        "2",
        "1783350480900"
      ],
      "counterSummonIds": [
        "1783587571165"
      ]
    },
    {
      "id": "1783596402991",
      "ninjaId": "1783309208477",
      "counterNinjaIds": [
        "1783309311486",
        "1783316557259",
        "1783308944026"
      ],
      "counterScrollIds": [
        "6"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783596447691",
      "ninjaId": "1783310202753",
      "counterNinjaIds": [
        "1783309186224",
        "1783309257305"
      ],
      "counterScrollIds": [
        "1783350480900",
        "1783351060243",
        "1783349062619"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783596505695",
      "ninjaId": "1783309172598",
      "counterNinjaIds": [
        "1783309208477",
        "12",
        "1783308767737",
        "1783309880298",
        "1783309850660"
      ],
      "counterScrollIds": [
        "1",
        "1783350043475",
        "1783349062619"
      ],
      "counterSummonIds": [
        "1783588411488"
      ]
    },
    {
      "id": "1783596537327",
      "ninjaId": "1783308767737",
      "counterNinjaIds": [
        "1783308944026",
        "1783309311486",
        "1783316557259"
      ],
      "counterScrollIds": [
        "1783349379011"
      ],
      "counterSummonIds": [
        "1783589300960"
      ]
    },
    {
      "id": "1783596584983",
      "ninjaId": "1783309046156",
      "counterNinjaIds": [
        "1783309880298",
        "1783309311486",
        "11",
        "1783310082543"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    },
    {
      "id": "1783596622845",
      "ninjaId": "1783307504056",
      "counterNinjaIds": [
        "1783310187740",
        "1783316557259",
        "1783308767737",
        "1783309172598"
      ],
      "counterScrollIds": [
        "1",
        "1783350583210"
      ],
      "counterSummonIds": [
        "1783588233106"
      ]
    },
    {
      "id": "1783596644243",
      "ninjaId": "1783315526387",
      "counterNinjaIds": [
        "1783309880298"
      ],
      "counterScrollIds": [
        "1783350283755"
      ],
      "counterSummonIds": [
        "1783587402912"
      ]
    },
    {
      "id": "1783596669260",
      "ninjaId": "9",
      "counterNinjaIds": [
        "1783309162593"
      ],
      "counterScrollIds": [
        "1783350952440"
      ],
      "counterSummonIds": [
        "1783589344138"
      ]
    },
    {
      "id": "1783596693446",
      "ninjaId": "1783315719485",
      "counterNinjaIds": [
        "11",
        "1783309880298"
      ],
      "counterScrollIds": [
        "6"
      ],
      "counterSummonIds": [
        "1783589300960"
      ]
    },
    {
      "id": "1783596731067",
      "ninjaId": "12",
      "counterNinjaIds": [
        "1783309947097",
        "9"
      ],
      "counterScrollIds": [
        "1",
        "10"
      ],
      "counterSummonIds": [
        "1783589344138",
        "1783588233106"
      ]
    },
    {
      "id": "1783596810534",
      "ninjaId": "1783309880298",
      "counterNinjaIds": [
        "1783310541594",
        "1783316659432",
        "1783309774545"
      ],
      "counterScrollIds": [
        "1783349453506",
        "1783349733336",
        "1783351060243"
      ],
      "counterSummonIds": [
        "1783587402912"
      ]
    },
    {
      "id": "1783596848546",
      "ninjaId": "1783308944026",
      "counterNinjaIds": [
        "1783310541594",
        "1783309415054",
        "1783309880298"
      ],
      "counterScrollIds": [
        "1783349802096"
      ],
      "counterSummonIds": [
        "1783588233106"
      ]
    },
    {
      "id": "1783596882857",
      "ninjaId": "1783309415054",
      "counterNinjaIds": [
        "1783309208477",
        "1783308767737",
        "19",
        "1783309257305",
        "1783309850660",
        "9"
      ],
      "counterScrollIds": [
        "1783350480900",
        "2"
      ],
      "counterSummonIds": [
        "1783587571165"
      ]
    },
    {
      "id": "1783596936884",
      "ninjaId": "1783316659432",
      "counterNinjaIds": [
        "1783309311486",
        "1783315644309",
        "1783310541594"
      ],
      "counterScrollIds": [
        "1783349453506"
      ],
      "counterSummonIds": [
        "1783587402912"
      ]
    },
    {
      "id": "1783596972178",
      "ninjaId": "11",
      "counterNinjaIds": [
        "1783309398928",
        "1783315644309",
        "1783309612984",
        "1783309172598"
      ],
      "counterScrollIds": [
        "1",
        "1783350043475",
        "1783349062619"
      ],
      "counterSummonIds": [
        "1783587820594"
      ]
    },
    {
      "id": "1783596998789",
      "ninjaId": "1783310494403",
      "counterNinjaIds": [
        "1783309398928"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    },
    {
      "id": "1783597041368",
      "ninjaId": "1783310541594",
      "counterNinjaIds": [
        "1783308767737",
        "1783309208477"
      ],
      "counterScrollIds": [
        "1783350480900",
        "1783351060243",
        "2"
      ],
      "counterSummonIds": [
        "1783587571165",
        "1783589556699"
      ]
    },
    {
      "id": "1783597077977",
      "ninjaId": "1783308987411",
      "counterNinjaIds": [
        "1783316699625",
        "1783309046156",
        "1783309572540"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    },
    {
      "id": "1783597087711",
      "ninjaId": "1783316699625",
      "counterNinjaIds": [
        "1783308944026"
      ],
      "counterScrollIds": [
        "1783349280153"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783613285709",
      "ninjaId": "1783309096309",
      "counterNinjaIds": [
        "1783309415054",
        "1783310541594",
        "1783316708410"
      ],
      "counterScrollIds": [],
      "counterSummonIds": [
        "1783588465585"
      ]
    },
    {
      "id": "1783613319626",
      "ninjaId": "1783309084993",
      "counterNinjaIds": [
        "1783309148171",
        "10",
        "1783309783866",
        "1783309186224",
        "1783310541594"
      ],
      "counterScrollIds": [
        "1783349802096"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783660675150",
      "ninjaId": "8",
      "counterNinjaIds": [
        "1783309162593"
      ],
      "counterScrollIds": [
        "1783350952440"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783693125830",
      "ninjaId": "1783309148171",
      "counterNinjaIds": [
        "1783309084993"
      ],
      "counterScrollIds": [
        "1783350438746",
        "1783349488627"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783693169329",
      "ninjaId": "2",
      "counterNinjaIds": [
        "10",
        "1783309186224",
        "1783309415054"
      ],
      "counterScrollIds": [
        "1783350480900"
      ],
      "counterSummonIds": [
        "1783587571165",
        "1783587352179",
        "1783589093236"
      ]
    },
    {
      "id": "1783693203131",
      "ninjaId": "1783309186224",
      "counterNinjaIds": [
        "1783309208477"
      ],
      "counterScrollIds": [],
      "counterSummonIds": [
        "1783587234386",
        "1783588906858"
      ]
    },
    {
      "id": "1783693492042",
      "ninjaId": "10",
      "counterNinjaIds": [
        "1783316557259",
        "1783309774545",
        "19"
      ],
      "counterScrollIds": [
        "1783349453506",
        "1783350438746"
      ],
      "counterSummonIds": [
        "1783589093236"
      ]
    },
    {
      "id": "1783693742366",
      "ninjaId": "18",
      "counterNinjaIds": [
        "1783309208477",
        "1783309850660"
      ],
      "counterScrollIds": [
        "2",
        "1783351060243"
      ],
      "counterSummonIds": [
        "1783587571165"
      ]
    },
    {
      "id": "1783693863394",
      "ninjaId": "1783309850660",
      "counterNinjaIds": [
        "1783309208477"
      ],
      "counterScrollIds": [
        "12"
      ],
      "counterSummonIds": [
        "1783588233106"
      ]
    },
    {
      "id": "1783694344378",
      "ninjaId": "19",
      "counterNinjaIds": [
        "1783309783866",
        "1783316910582"
      ],
      "counterScrollIds": [
        "1783350952440"
      ],
      "counterSummonIds": [
        "1783587820594",
        "1783587352179"
      ]
    },
    {
      "id": "1783695144904",
      "ninjaId": "1783309774545",
      "counterNinjaIds": [
        "1783309850660",
        "1783317048070"
      ],
      "counterScrollIds": [
        "1783351060243",
        "1783349328947"
      ],
      "counterSummonIds": [
        "1783589344138",
        "1783589300960"
      ]
    },
    {
      "id": "1783695250959",
      "ninjaId": "1783308752772",
      "counterNinjaIds": [
        "1783309880298"
      ],
      "counterScrollIds": [
        "1783351060243"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783695631721",
      "ninjaId": "1",
      "counterNinjaIds": [
        "1783309398928"
      ],
      "counterScrollIds": [
        "1783349488627"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783697246919",
      "ninjaId": "1783310187740",
      "counterNinjaIds": [],
      "counterScrollIds": [
        "10",
        "1783350952440"
      ],
      "counterSummonIds": [
        "1783588411488"
      ]
    },
    {
      "id": "1783697559455",
      "ninjaId": "1783316557259",
      "counterNinjaIds": [
        "1783310541594",
        "1783310042732",
        "1783310202753",
        "1783309783866"
      ],
      "counterScrollIds": [
        "12",
        "1783349733336"
      ],
      "counterSummonIds": [
        "1783588233106"
      ]
    },
    {
      "id": "1783697747226",
      "ninjaId": "1783317048070",
      "counterNinjaIds": [
        "9"
      ],
      "counterScrollIds": [],
      "counterSummonIds": [
        "1783587571165",
        "1783589889497"
      ]
    },
    {
      "id": "1783697984783",
      "ninjaId": "1783309130139",
      "counterNinjaIds": [
        "1783309415054"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    },
    {
      "id": "1783698865069",
      "ninjaId": "1783309348233",
      "counterNinjaIds": [],
      "counterScrollIds": [
        "1783350480900"
      ],
      "counterSummonIds": []
    },
    {
      "id": "1783699407892",
      "ninjaId": "1783308961488",
      "counterNinjaIds": [
        "1783309311486",
        "1783310042732",
        "1783308752772"
      ],
      "counterScrollIds": [],
      "counterSummonIds": []
    }
  ]