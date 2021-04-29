{
	"code": 0
	,"msg": ""
	,"data":{
		"select":{
			"simple":"选择文字1,选择文字2,选择文字3,默认选中文字",
			"id":[{"id":"1","name":"选项Id1"},{"id":"2","name":"选项Id2"},{"id":"3","name":"选项Id3"},{"id":"4","name":"默认选中Id"}],
			"customer":[
				{"cid":"1","title":"指定字段1","child":[{"cid":5,"title":"子项1","child":[{"cid":6,"title":"子项111"}]}]},
				{"cid":"2","title":"指定字段2"},
				{"cid":"3","title":"指定字段3"},
				{"cid":"4","title":"默认选中字段"}
			]
		},
		"picker":[
			{"title":"第一列1","id":"1","child":[
					{"title":"第二列1","id":"2","child":[
						{"title":"第三列1","id":"5"},
						{"title":"第三列2","id":"6"}
					]},
					{"title":"第二列2","id":"3"},
					{"title":"第二列3","id":"4"}
				]
			},
			{
				"title":"第一列2","id":"7"
			}
		],
		"option":{
			"default":[
				{
					"name":"pic",
					"title":"图片",
					"type":"image",
					"required":1
				},
				{
					"name":"title",
					"title":"标题",
					"type":"input"
				},
				{
					"name":"select",
					"title":"下拉",
					"type":"sa_picker",
					"data":[
						{"title":"下拉1","id":"值1"},
						{"title":"下拉2","id":"值2"}
					]
				},
				{
					"name":"date",
					"title":"日期",
					"type":"date"
				},
				{
					"name":"text",
					"title":"描述",
					"type":"textarea"
				}
			]
		},
		"xm_select":{
			"simple":[
				{"name": "张三", "id": 1},
				{"name": "李四", "id": 2},
				{"name": "王五", "id": 3}
			],
			"group":[
				{"name": "销售员", "children": [
					{"name": "张三", "id": 1},
					{"name": "李四", "id": 2},
					{"name": "王五", "id": 3}
				]},
				{"name": "奖品", "children": [
					{"name": "苹果2", "id": 4},
					{"name": "香蕉2", "id": 5},
					{"name": "葡萄2", "id": 6}
				]}
			]
		},
		"images":{
			"titlepic":"images/202012/6GcFhR3aiOZ20duJETNKXbRaYyahGilpn2pbzTlx.jpg",
			"pics":"images/202012/BsxZEoH3I1N9qYmbCj7OUqda9CiMzxRGDrI2ELuO.jpg,images/202012/muXftPjHaWvPDPHrQAWtMEom3woQZu8nnyNvXg6e.jpg,images/202012/sFppR1Gmvvca8yrmuuXpgCKlLZ1SUUak7zy3Mchm.jpg,images/202012/xSvCJIfCkC0eGLQfeDNY42Y86AbRfSdJ91AAWC2F.jpg,images/202012/HFCbS7oWUt15zwNily7U2SrhKLORNgQ5ITsQphNn.jpg,images/202012/JTaay91tHZGwsJ38HHYynVH0ut7z0o3hodgqqfTX.jpg",
			"showpics":"images/202012/OVZjnVUjOnkFenJjn99u5nwuTsS5TmcPdF07G2YK.jpg,images/202012/3PrwydOOzU1ScjSMCZ76EizBWPt6AbBMRGl6TPm8.jpg,images/202012/cAg3Jqbz7lxjf6zAjstzAz0HY764rn2dJpaQVB2d.jpg"
		}
	}
}