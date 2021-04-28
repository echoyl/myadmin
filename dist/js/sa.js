layui.extend({
	sa_table:'js/modules/sa/table',
	searchlist: "js/modules/searchlist",
	treeGrid:"js/modules/treeGrid/treeGrid",
	categoryList:"js/modules/categoryList",
	render:'js/modules/render',
	echartsTheme:'js/modules/echarts/echartsTheme',
	echarts:'js/modules/echarts/echarts',
	sa_upload:'js/modules/sa_upload',
	sa_category:'js/modules/sa/category'
}).define(["laytpl", "layer",'render'], function(exports) {
	
	var $ = layui.$,
		laytpl = layui.laytpl,
		layer = layui.layer,
		env = layui.env;

	var f = function(e){
		return new sa(e);
	}
	f.app_body_id = 'LAY_app_body';
	f.app_id = 'LAY_app';
	f.inited = false;
	f.request_status = false;
	f.ids = [];
	//cccv 类
	var sa = function(e){
		if(e)
		{
			f.ids.push(e);
		}else
		{
			if(f.ids.length < 1)
			{
				//非reload才添加id
				f.ids.push(f.app_body_id);
			}
		}
		
		this.container = $("#"+(e || f.app_body_id));
		this.id = e;
		
	};
	
	
	
	f.correctRouter = function(e) {
		return /^\//.test(e) || (e = "/" + e), e.replace(/^(\/+)/, "/").replace(new RegExp("/" + env.entry + "$"), "/");
	}
	f.getAccessToken = function()
	{
		var token = f.local.get(env.request.tokenName);
		if(!token)
		{
			return '';
		}
		return token;
	}
	f.request = function(param) {
		var request = env.request;
		var response = env.response;
		var error_msg = env.debug?"<br><cite>URL：</cite>" + param.url : "";

		param.url = (/json/.test(param.url) || param.data.ptype == 'html') ? param.url : (env.is_local?(param.type = 'get','json/local/'+param.url+'.json'):env.request_host + param.url);
		
		if(param.type == 'post')
		{
			//
			if(f.request_status)
			{
				return;
			}
			f.request_status = true;
		}
		f.loading();
		var router = f.router();
		if(typeof param.processData == 'undefined')
		{
			var pdata = $.extend({},router.search,param.data,{v:layui.cache.version});
			delete pdata.page_info;
		}else
		{
			var pdata = param.data;
		}

		$.ajax($.extend({},param,{
			headers:{
				'Authorization':'Bearer '+f.getAccessToken()
			},
			url: param.url,
			type: param.type || "get",
			dataType: "json",
			data: pdata || {},
			success: function(res) {
				f.removeLoading();
				if(param.type == 'post')
				{
					f.request_status = false;
				}
				
				if (res[response.statusName] == response.statusCode.ok)
				{
					if("function" == typeof param.done)
					{
						param.done(res);
					}
				}else if (res[response.statusName] == response.statusCode.logout)
				{
					layui.layer.msg('您的登录已失效!', {
						offset: '15px',
						icon: 1,
						time: 1000
					}, function() {
						f.exit();
					});
				}else
				{
					if (param.data.ptype == 'html') {
						"function" == typeof param.done && param.done(res);
					} else {
						var r = ["<cite>Error：</cite> ", res.msg].join("");
						f.error(r);
					}
				}
				"function" == typeof param.success && param.success(res);
			},
			error: function(e,textStatus) {
				console.log(e,textStatus);
				console.error(param.url+'文件获取失败');
			}
		}));
		
		return;
	}
	
	//仅仅只是修改hash而不做重载页面
	f.justHashChange = function(hash)
	{
		//检测现有的hash和下一个hash是否一致
		if(location.hash == hash)
		{
			return;
		}
		f.local.set('hash_not_reload',1,360000000);
		location.hash = hash;
	}
	
	sa.prototype.hashChange = function(c_flag)
	{
		//页面路径变化后调用
		
		var t = this;
		var router = f.router();
		var path = router.path;
		if(path.length == 0)
		{
			path = [env.entry];
		}
		
		!path[path.length - 1] && (path[path.length - 1] = env.entry);
		
		t.ind_page = false;//是否是独立页面
		
		
		
		env.indPage.forEach(function(v){
			if(v == f.correctRouter(path.join("/")))
			{
				t.ind_page = true;
			}
		});

		var filename = path.join("/");
		
		//通过justHashChange触发 不刷新页面机制
		if(f.local.get('hash_not_reload'))
		{
			f.local.set('hash_not_reload',0,360000000);
			if(f.inited)
			{
				console.log('inited and has not reload');
				return;
			}
		}
		var check_login = false;
		if(!f.inited && !t.ind_page)
		{
			filename = env.layout;
			check_login = true;
		}
		//判断容器
		if(t.ind_page || !f.inited)
		{
			t.container = $("#"+f.app_id);
		}else
		{
			t.container = $("#"+f.app_body_id);
		}

		f.loading(t.container);
		f.methods = {};//页面变化后充值方法对象
		//添加判断如果是加载layout需要先检测一下是否已经登录了
		f.checkLogin(check_login,function(){
			t.render(filename,{},function() {
				if(!t.ind_page && !f.inited)
				{
					//加载默认首页
					f.inited = true;
					f.getMenu();
					t.hashChange();
					return;
				}
				if(t.ind_page)
				{
					f.inited = false;
				}

				
				if(f.inited && !t.ind_page)
				{
					//初始化左侧的菜单
					f.initMenu();
					//自动追加bread
					t.bread(filename);
				}	
			});//渲染
		});
		
	}
	//自动解析面包屑 导航
	sa.prototype.bread = function(filename)
	{
		if(!$(this.container).find('.layui-breadcrumb').length)
		{
			let menu_data = f.local.get('menu_data')['data'];
			let file_arr = filename.split('/');
			let bread = [];//3级菜单
			let is_post = 0;
			file_arr.map(function(v,i){
				
				menu_data.forEach(function(m_v){
					if(v == m_v.name)
					{
						bread.push(m_v.title);
						if(m_v.list)
						{
							menu_data = m_v.list;
						}else
						{
							menu_data = [];
						}
						return;
					}
				});
				if(v == 'post')
				{
					bread.push('编辑添加');
					is_post = i;
				}
			});
			let index = is_post-1;
			file_arr.pop();
			let href = file_arr.join('/') + '/';
			let bread_html = laytpl($("#page_bread").html()).render({bread:bread,index:index,href:href});
			
			$(this.container).children().first().before(bread_html);
		}
		
		
		layui.element.render("breadcrumb", "breadcrumb");
		layui.element.render();
	}
	//解析name的html页面
	sa.prototype.render = function(filename,params,callback)
	{
		var t = this;
		f.loading(t.container);
		filename = env.views + filename + env.engine;

		//return;
		$.ajax({
			url: filename,
			type: "get",
			dataType: "html",
			data: {
				v: layui.cache.version
			},
			success: function(html) {
				f.removeLoading();
				html = "<div>" + html + "</div>";
				//检测是否有la标签
				
				var las = $(html).find("*[la]");
				if(las.length > 0)
				{
					var new_file = $(las[0]).attr('la');
					var page_info = JSON.parse($(las[0]).html());
					//t.container.html($(html).children());
					return t.render(new_file,$.extend({},params,{page_info:page_info}),callback);
				}else
				{
					var title_ele = $(html).find("title");
					var title = title_ele.text();
					var data = {
						title: title,
						body: html
					};
					title_ele.remove();
					t.params = params || {};
					t.parse(html);
					
					
					'function' == typeof callback && callback(data);
				}
				
				
				
			},
			error: function(e) {
				console.error(filename+'文件获取失败')
			}
		});
		
		return t;

		
	}
	
	
	//解析页面函数
	sa.prototype.parse = function(html,is_add,callback) {
		var t = this;

		var $html = $(html);
		var tpls = $html.find("*[tpl]");
		var router = f.router();
		router.params = t.params || {};
		
		//$html.find("title").remove();

		t.container[is_add?"append":"html"]($html.children());
		
		//这个方法将获取的doom对象及获取的数据的结果 render成html插入 doom中
		function toHtml(v)
		{
			//将undefined都给去除了
			//没有page_info 预设
			if(!v.res.page_info)
			{
				v.res.page_info = {};
			}
			var html = laytpl(v.dataElem.html()).render(v.res).replace(/undefined/g,'').replace(/null/g,'');
			v.dataElem.after(html);
			if("function" == typeof callback)
			{
				callback();
			}
			
			/* 渲染 render文件夹中的模块*/
			layui.render.init();
			try {
				//这里将tpl中的 lay-done 属性转换成函数 函数形参为d 实参就是v传过来的值
				//这个回调函数有时候在浏览器中会报找不到方法的错误提示 延迟执行
				//这里将 done写到最外面 然后再 use 延时执行的话不设置个200毫秒还是有时候会出现is not function 但是延迟感太强烈了
				var done = v.dataElem.attr('lay-done');
				if(done)
				{
					new Function("d", done)(v.res);
				}
			} catch (o) {
				console.error(v.dataElem[0], "\n存在错误回调脚本\n\n", o)
			}
			
		}
		
		//循环检测 是template的块
		
		var tpl_length = tpls.length;
		for(var i = tpl_length;i > 0;i--)
		{
			//倒序循环 最先解析的是最里面嵌套的 template

			(function(item){
				//var done = item.attr("lay-done");//解析完后回调函数
				//将参数合并到 url中 例如 使用 d.search.id 可以获取到hash中 /id=2中的 2值
				item.removeAttr('tpl');
				var url = laytpl(item.attr("lay-url") || "").render(router);//这里加载路由参数进去
				var data = laytpl(item.attr("lay-data") || "").render(router);
				data = $.extend(router.search,f.json(data),router.params);
				if(!url)
				{
					toHtml({
						dataElem: item,
						res: data
					});
				}else
				{
					//整个渲染 请求ajax数据信息
					
					f.request({
						type:item.attr("lay-type"),
						url:url,
						data:data,
						dataType: "json",
						success: function(res) {
							if(res.code == 0)
							{
								toHtml({
									dataElem: item,
									res: $.extend({},data,res)
								});
							}
						}
					});
				}
				
				
			})(tpls.eq(i-1));
			
		}

		return t;
	}
	//重新设置路由路径
	f.router = function(){
		var router = layui.router();
		var path = [];
		
		router.path.forEach(function(v){
			var v_arr = v.split('?');
			if(v_arr.length > 1)
			{
				//存在?
				var search_arr = v_arr[1].split('&');
				search_arr.forEach(function(item){
					var key_val = item.split('=');
					if(key_val.length == 2)
					{
						router.search[key_val[0]] = key_val[1];
					}
				});
				
				
				
				v = v_arr[0];
			}
			path.push(v);
		});
		
		router.path = path;
		return router;
	}
	f.json = function(str)
	{
		return new Function("return " + (str || "{}"))();
	}
	/*
	f.loading = function(e) {
		//检测是已经有loading

		if($(".layadmin-loading").length > 0 || $(".layui-icon-loading").length > 0)
		{
			//console.log('已经在loading了');
			return;
		}
		if(typeof e == 'undefined')
		{
			e = $('#'+f.app_body_id);
			//在这里检测是否有弹出层，如果有的话将loding罩在弹出层上面
			if($(".layui-layer[type=page]").length > 0)
			{
				//console.log('有layer');
				e = $(".layui-layer[type=page]");
			}
		}

		//console.log('show loading');
		e.append($('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading" style="z-index:9999"></i>'));

	}
	*/
	f.loading = function(e)
	{
		if($(".new_loading").length > 0)
		{
			return;
		}
		if(typeof e == 'undefined')
		{
			e = $('#'+f.app_body_id);
			//在这里检测是否有弹出层，如果有的话将loding罩在弹出层上面
			if($(".layui-layer[type=page]").length > 0)
			{
				e = $(".layui-layer[type=page]");
			}
		}
		e.append($('<svg width="30" height="30" class="new_loading" style="position: fixed;left: 50%;top: 50%;z-index: 9999;margin-left: -15px;margin-top: -15px;"><circle class="mouth" cx="15" cy="15" r="10"></circle><circle class="eye" cx="15" cy="15" r="10"></circle></svg>'));
	}
	f.loadingIcon = function(e,show)
	{
		let loading_icon = '<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size:28px;position:absolute;left: 50%;top: 50%;margin-left: -14px;margin-top: -19px;"></i>';
		e.html(show?show:loading_icon);
		
	}
	f.removeLoading = function() {
		if($(".layadmin-loading").length > 0)
		{
			$(".layadmin-loading").remove();
		}
		if($(".new_loading").length > 0)
		{
			$(".new_loading").remove();
		}
	}
	//渲染左侧菜单
	f.initMenu = function()
	{
		var tpl = $("#menus").html();
		var menu_data = f.local.get('menu_data');
		var nav_fold = $(".wb-nav").hasClass('fold');//记住是否开合
		var subnav_fold = $(".wb-subnav").hasClass('fold');
		if(menu_data)
		{
			menu_data.nav_fold = nav_fold;
			menu_data.subnav_fold = subnav_fold;
			laytpl(tpl).render(menu_data,function(html){
				$(".wb-nav").remove();
				$(".wb-subnav").remove();
				$("#menus").before(html);
				f.menuClickEvent();
			});
		}else
		{
			console.log('菜单获取失败，请刷新页面');
		}
	}
	f.getMenu = function()
	{
		f.request({
			type:'get',
			url:env.menu_url,
			data:{},
			async:false,
			dataType: "json",
			success: function(res) {
				if(!res.code)
				{
					f.local.set('menu_data',res,360000000);//记录缓存 下次不再网络请求
				}
			}
		});
		return;
	}
	f.menuClickEvent = function()
	{
		$(".wb-nav-menu").click(function(){
			var index = $('.wb-nav-menu ').index(this);
			$('.wb-nav-menu ').removeClass('active');
			$(this).addClass('active');
			$(".wb-subnav > div").hide();
			$(".wb-subnav > div").eq(index).show();
			$(".wb-subnav").removeClass('fold');
			//点击大菜单 默认跳转该菜单中的第一个子菜单
			var wb_subnav = $(".wb-subnav > div").eq(index);
			if(wb_subnav.find('.subnav-scene').next().hasClass('menu-header '))
			{
				//第一个菜单是 多级的
				wb_subnav.find('.subnav-scene').next().click();
				wb_subnav.find('.subnav-scene').next().next().find('li:eq(0) > a').click();
			}else
			{
				//单级菜单直接点击触发
				wb_subnav.find('ul.single:eq(0) > li > a').click();
			}
		});
		$(".wb-subnav ul.single").click(function(){
			$('ul.single').find('li').removeClass('active');
			$(".secondMenu > li").removeClass('active');
			$(this).find('li').addClass('active');
		});
		$(".secondMenu > li").click(function(){
			$(".secondMenu > li").removeClass('active');
			$(".wb-subnav ul.single").find('li').removeClass('active');
			$(this).addClass('active');
		})
		$(".wb-nav-fold").click(function(){
			$(this).parent().toggleClass('fold');
		})
		$(".menu-header").click(function(){
			$(this).toggleClass('active');
			if($(this).hasClass('active'))
			{
				$(this).next().show();
			}else
			{
				$(this).next().hide();
			}
		});
		$(".wb-subnav-fold").click(function(){
			$(this).parent().toggleClass('fold');
		});
	}
	f.local = {
		//存储,可设置过期时间
		set(key, value, expires) {
			let params = { key, value, expires };
			if (expires) {
				// 记录何时将值存入缓存，毫秒级
				var data = Object.assign(params, { startTime: new Date().getTime() });
				localStorage.setItem(key, JSON.stringify(data));
			} else {
				if (Object.prototype.toString.call(value) == '[object Object]') {
					value = JSON.stringify(value);
				}
				if (Object.prototype.toString.call(value) == '[object Array]') {
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			}
		},
		//取出
		get(key) {
			let item = localStorage.getItem(key);
			// 先将拿到的试着进行json转为对象的形式
			try {
				item = JSON.parse(item);
			} catch (error) {
				// eslint-disable-next-line no-self-assign
				item = item;
			}
			// 如果有startTime的值，说明设置了失效时间
			if (item && item.startTime) {
				let date = new Date().getTime();
				// 如果大于就是过期了，如果小于或等于就还没过期
				if (date - item.startTime > item.expires) {
					localStorage.removeItem(name);
					return false;
				} else {
					return item.value;
				}
			} else {
				return item;
			}
		},
		// 删除
		remove(key) {
			localStorage.removeItem(key);
		},
		// 清除全部
		clear() {
			localStorage.clear();
		}
	}
	f.popup = function(e) {
		var a = e.success,
			c = e.close,
			r = e.skin;
		return delete e.success, delete e.skin,delete e.close, layer.open($.extend({
			type: 1,
			title: "提示",
			content: "",
			id: "LAY-system-view-popup",
			skin: "layui-layer-admin" + (r ? " " + r : ""),
			shadeClose: !0,
			closeBtn: !1,
			success: function(e, r) {
				var o = $('<i class="layui-icon" close>&#x1006;</i>');
				e.append(o), o.on("click", function() {
					if(typeof c == 'function')
					{
						c(r);
					}
					layer.close(r);
				}), "function" == typeof a && a.apply(this, arguments)
			}
		}, e))
	}
	f.error = function(msg,e)
	{
		if(typeof e == 'undefined')
		{
			e = {};
		}
		f.popup($.extend({
			content: msg,
			id: "LAY_adminError",
			maxWidth: 300,
			anim: 6,
		},e));
	}
	f.open = function (opt){
		var need_pop_function = false;//是否需要清除回调
		if(typeof opt.callback != 'undefined')
		{
			if(typeof layui.frameCallback == 'function')
			{
				layui.frameCallback = [layui.frameCallback,opt.callback];
			}else if(typeof layui.frameCallback == 'object')
			{
				layui.frameCallback.push(opt.callback);
			}else
			{
				layui.frameCallback = [opt.callback];
			}
			need_pop_function = true;
		}
		var area = opt.area?opt.area:['800px', '600px'];
		var data = opt.data?opt.data:{};
		var title = opt.title?opt.title:'选择框';
		var view_url = opt.url;
		var id = view_url.split('/').join('_');
		f.popup({
			title: title,
			area: area,
			id: id,
			success: function(e, i) {
				var new_sa = new sa(id);
				new_sa.render(view_url, data);
			},
			shadeClose:false,
			close:function(r){
				//这里是点击×关闭需要的处理
				f.ids.pop();
				if(need_pop_function)
				{
					layui.frameCallback.pop();
				}
			}
		});
	}
	
	f.close = function(res,index){
		//对应上面的open方法 处理回调函数逻辑
		f.ids.pop();
		if(typeof layui.frameCallback == 'function')
		{
			layui.frameCallback(res);
		}else if(typeof layui.frameCallback == 'object')
		{
			var cb = layui.frameCallback.pop();
			cb(res);
		}
		
		layui.layer.close(index);
	}
	f.random = function(prev)
	{
		prev = typeof prev == 'undefined'?'':prev;
		return prev + Math.floor(Math.random()*(999999-100000+1)+100000);
	}
	f.loadImg = function(self){
		var img = new Image(); 
		img.src = $(self).attr('src');
		w = img.width;
		h = img.height;
		if(w > h)
		{
			$(self).css({width:'154px',height:'auto'});
		}else
		{
			$(self).css({width:'auto',height:'122px'});
		}
	};
	f.fixJson = function(data,type){
		
		if(typeof data == 'undefined' || !data)
		{
			if(type == 'object')
			{
				return {};
			}else
			{
				return [];
			}
		}else
		{
			if(typeof data == 'string')
			{
				//这里list是string的话 应为存在单引号，这里直接全部转化为双引号
				return JSON.parse(data.replace(/'/g,'"'));
			}else
			{
				return data;
			}
		}
		
	}
	/**
	*查看图片函数
	**/
	f.img = function(img)
	{
		var url = f.fixUrl(img);
		var ct = '<img src="'+url+'" style="width: 100%;height:auto;">';
		var img = new Image(); 
		img.src = url;

		img.onload = function() {
			var w = img.width;
			var h = img.height;
			//限制打开层的最大宽高
			if(w >= h)
			{
				if(w > 900)
				{
					h = parseInt((900/w)*h);
					w = 900;
				}
			}else
			{
				if(h > 600)
				{
					w = parseInt((600/h)*w);
					h = 600;
				}
			}
			layui.layer.open({
			  type: 1,
			  title: false,
			  closeBtn: 0,
			  area: [w+'px',h+'px'],
			  skin: 'layui-layer-nobg', //没有背景色
			  shadeClose: true,
			  content: ct
			});
		}
		return false;
	}
	f.fixUrl = function(img)
	{
		return img.indexOf("http") > -1 || img.indexOf("https") > -1?img:env.storage_path+img;
	}
	f.exit = function()
	{
		layui.data(env.tableName, {
			key: env.request.tokenName,
			remove: !0
		});
		layui.layer.closeAll();
		location.hash = "/system/login";
	}
	f.reload = function(sec)
	{
		if(typeof sec == 'undefined')
		{
			sec = 100;//默认300毫秒
		}
		var _sa = new sa();
		setTimeout(function(){_sa.hashChange();},sec);
	}
	f.checkLogin = function(check_login,callback)
	{
		//f.loading();
		if(!check_login || env.is_local)
		{
			callback();
		}else
		{
			var response = env.response;
			$.ajax({
				headers:{
					'Authorization':'Bearer '+f.getAccessToken()
				},
				url: env.request_host,
				type: "get",
				dataType: "json",
				success: function(res) {
					f.removeLoading();
					if (res[response.statusName] == response.statusCode.logout)
					{
						is_login = false;
						f.exit();
					}else
					{
						callback();
					}
				}
			});
		}
		
	}
	f.getValue = function(value,default_value){
		if(typeof value == 'undefined')
		{
			return typeof default_value == 'undefined'?'':default_value;
		}else
		{
			return value;
		}
	}
	f.alert = function(msg,title){
		f.open({
			data:{content:msg},
			url:'system/alert',
			title:f.getValue(title,'信息详情')
		});
	}
	f.methods = {};//页面方法
	exports("sa", f);
})