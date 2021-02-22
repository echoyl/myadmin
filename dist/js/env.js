layui.define(function(exports) {
	exports('env', {
		container: 'LAY_app', //容器ID
		
		base: layui.cache.base, //记录layuiAdmin文件夹所在路径

		views: layui.cache.base + 'views/', //视图所在目录
		
		entry: 'index', //默认视图文件名

		engine: '.html', //视图文件后缀名
		//menu_url:'./json/menu.js',
		menu_url:'index/getmenus',
		//pageTabs: false, //是否开启页面选项卡功能。单页版不推荐开启
		
		siteinfo:{
			name: '村里程序员的后台',
			systemName: 'Inandan',
			tech:'Inandan 技术支持',
			tech_url:"https://inandan.com",
			tech_domain:"inandan.com",
			links:[
				{name:"文章",url:"https://inandan.com/news"},
				{name:"文档",url:"https://inandan.com/guide"},
			]
		},
		
		
		tableName: 'sa', //本地存储表名		
	
		request_host: '/sadmin/',
		storage_path: '/storage/',
		debug: true, //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息

		
		interceptor: true, //是否开启未登入拦截

		//自定义请求字段
		
		request: {
			tokenName: 'access_token' //自动携带 token 的字段名。可设置 false 不携带。
		},
		//增加admin用户信息字段
		
		admin_user: {
			key: 'id',
			name: 'username'
		},
		//自定义响应字段
		
		response: {
			statusName: 'code', //数据状态的字段名称
			statusCode: {
				ok: 0, //数据状态一切正常的状态码
				logout: 1001 //登录状态失效的状态码
			},
			msgName: 'msg', //状态信息的字段名称
			dataName: 'data' //数据详情的字段名称
		},
		//独立页面路由，可随意添加（无需写参数）
		
		indPage: [
			'/system/login' //登入页
		]

		//扩展的第三方模块
		,
		layout:'system/layout',
		extend: [],
		fonts:['rr'],//加载字体
		bmap_ak:'srA5yxQDsKtgxazvx0jCNhW56uCnWFoV'
	});
});