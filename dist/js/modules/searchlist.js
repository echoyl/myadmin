layui.define(["sa_table", "layer","form",'render','laytpl','dropdown'], function(exports) {
	var form = layui.form,
		layer = layui.layer,
		table = layui.sa_table,
		sa = layui.sa,
		laytpl = layui.laytpl,
		$ = layui.$;
	
	var sl = {};
	
	var obj = function(config)
	{
		var table_tpl_outer = '<div class="layui-fluid"><div class="layui-row layui-col-space15"><div class="layui-col-md12"><div class="layui-card"><div class="layui-card-body">{{d.tpl}}</div></div></div></div></div>';
		var table_tpl = '<div class="layui-search-header-auto {{d.hide}}" style="padding-bottom:0;border-bottom:none;">\
								<form class="layui-form search-form" onsubmit="return false;"></form>\
								<div style="height:8px;width:100%;border-bottom:1px solid #f6f6f6;"></div>\
							</div>\
							<div class="layui-card-body" style="padding-top:0;">\
								<table id="{{d.table_id}}" lay-filter="{{d.table_id}}" lay-size="lg"></table>\
							</div>';
		var result_tpl = '<div class="layui-card-body layui-row layui-col-space20 result_html" style="padding-top:0;padding-bottom:10px;">{{d.html}}</div>';
		var is_init = false;
		var that = this;
		this.id = sa.random('sl_tb_c_');
		var table_id = sa.random('sl_tb_');
		
		
		var _config = {
			page:'',//页面路径
			page_post:'',//编辑路径
			search:{
				options:[],buttons:[]
			},
			open:false,//是否是在弹层中打开
			event:{},
			done:function(res)
			{
				//加载完数据后 可以追加统计数据在 表格底部
				let tpl = '{{#  layui.each(d.list, function(index, item){ }}<div class="layui-inline">{{item.label}}<span style="color:red;">{{item.value}}</span></div>{{#  }); }}';
				if(res.search)
				{
					layui.laytpl(tpl).render({list:res.search.desc},function(html){
						if(layui.$("#"+that.id).find('.result_html').length > 0)
						{
							layui.$("#"+that.id).find('.result_html').html(html);
						}else
						{
							layui.$("#"+that.id).append(laytpl(result_tpl).render({html:html}));
						}
					});
				}
				
			}
			,post_param:false//edit事件是 打开页面时候需要追加 router.search 中 的[key]数组  默认不追加
			,encode_type:['input','bldate','cas','sa_picker']//需要被url转义的搜索框类型
			,table:{
				//table的参数放在这里 分开设置
				url:'',//请求地址
				id:table_id,//表格的id
				size:'lg',
				height:'auto',
				elem:'#'+table_id,
				page:{limit:10},
				autoSort:false,
				initSort:false
			},
			tpls:{
				'edit':['edit','del'],
				'status':['status']
			},
			filter:[]
		};
		//table参数不再支持id参数 自动生成table
		delete config.table.id;
		delete config.table.elem;
		this.config = $.extend(true,{},_config,config);
		this.config.id = this.id;
		//初始化 
		table_tpl = ['<div id="'+this.id+'">',table_tpl,'</div>'].join('')
		if(!this.config.open)
		{
			table_tpl = laytpl(table_tpl_outer).render({tpl:table_tpl});
		}
		var table_html = laytpl(table_tpl).render({table_id:table_id,hide:this.config.search.options.length >0 || this.config.search.buttons.length >0?'':'layui-hide'});
		$("#"+sa.ids[sa.ids.length-1]).append(table_html);
		
		this.op_btns = {
			'edit':'<button type="button" class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-bianji"></i></button>',
			'del':'<button type="button" class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del" title="删除"><i class="layui-icon layui-icon-close"></i></button>',
			'add':'{{! {{# if(d.level < !}}{{d.level}} {{! ){ }}<button type="button" class="layui-btn layui-btn-xs" lay-event="add"><i class="layui-icon layui-icon-tianjia2"></i></button>{{# } }} !}}',
			'status':'<input type="checkbox" name="status" value="1" data-id="{{d.id}}" lay-skin="switch" lay-text="启用|启用" lay-filter="status" {{ d.status==1?"checked":"" }}>'
		}

		//预设值的按钮
		this.buttons = {
			search:{
				icon:'layui-icon-search',
				title:'搜索',
				classname:'layui-btn-normal',
				func:function(cfg){
					sl.search(cfg);
				}
			},
			add:{
				icon:'layui-icon-tianjia2',
				title:'添加',
				classname:'',
				func:function(cfg){
					//添加默认打开新页面
					that.post_data(0);
				}
			},
			delete:{
				icon:'layui-icon-close',
				title:'删除',
				classname:'layui-btn-danger',
				func:function(cfg){
					var checkStatus = table.checkStatus(cfg.table.id);
					if(checkStatus.data.length > 0)
					{
						var ids = [];
						for(var i in checkStatus.data)
						{
							ids.push(checkStatus.data[i].id);
						}
						that.delete_data(ids.join('.'));
					}else
					{
						layer.msg('请勾选');
					}
				}
			}
			
		};
		this.delete_data = function(ids)
		{
			var that = this;
			layer.confirm('确定要删除么', function(index){
				sa.request({
					url: that.config.table.url+'/1'
					,type:'delete'
					,data: {ids:ids}
					,done: function(res) {
						layer.msg('操作成功', {
							offset: '15px',
							icon: 1,
							time: 1000
						}, function() {
							sa.reload();
						});
						
					}
				});
			});
		}
		
		this.post_data = function(id,parent_id)
		{
			//添加默认打开新页面
			var cfg = that.config;
			var post_page = cfg.page_post?cfg.page_post:cfg.page + 'post';
			
			//添加路由参数
			let rsearch = layui.sa.router()['search'];
			let post_param = {};
			if(cfg.post_param)
			{
				for(var i in rsearch)
				{
					if($.inArray(i,cfg.post_param) > -1)
					{
						post_param[i] = rsearch[i];
					}
				}
			}
			let hash_par = ['id='+id];
			let id_param = {id:id};
			if(typeof parent_id != 'undefined')
			{
				hash_par.push('parent_id='+parent_id);
				id_param.parent_id = parent_id;
			}
			
			if(cfg.post_type == 'open')
			{
				layui.sa.open({
					data:layui.$.extend({},post_param,id_param),
					area:cfg.area?cfg.area:false,
					url:post_page,
					title:'编辑添加',
					callback:function(){
						sa.reload();
					}
				});
			}else
			{
				//默认进行页面跳转编辑
				
				for(var i in post_param)
				{
					hash_par.push([i+'='+post_param[i]]);
				}
				location.hash = '#/'+post_page+'?'+hash_par.join('&');
			}
		}
	}
	sl.search = function(cfg)
	{
		let get_search = sl.getSearch(cfg);
		if(!cfg.open)
		{
			layui.sa.justHashChange('#/'+cfg.page+'?'+get_search.str);
		}
		$("#"+cfg.id).find('.result_html').html('');
		table.reload(cfg.table.id,{where:get_search.where,page: sl.tablePage(cfg.table.page,1),cols:[cfg.cols],initSort:cfg.table.initSort});
	}
	//获取搜索参数
	sl.getSearch = function(cfg)
	{
		console.log('cfg:',cfg);
		var items = [];
		let has_name = [];
		//这里将页面设置的where参数复写在url中 防止搜索刷新后参数丢失
		if(cfg.table.where)
		{
			for(let ik in cfg.table.where)
			{
				//屏蔽page_info这个关键字
				if(ik != 'page_info')
				{
					items.push({name:ik,value:cfg.table.where[ik]});
					has_name.push(ik);
				}
			}
		}
		
		var where = {sort:cfg.table.initSort?[cfg.table.initSort.field,cfg.table.initSort.type].join('.'):''};
		items.push({name:'sort',value:where.sort});
		has_name.push('sort');
		cfg.search.options.forEach(function(option){
			var value = '';
			let more_name = false;
			if($.inArray(option.type,['input','bldate','cas','xm_select','sa_picker']) > -1)
			{
				value = $('input[name="'+option.name+'"]').val();
			}else if(option.type == 'pickerx')
			{
				if(option.name.indexOf(',') != -1)
				{
					more_name = true;
					let opt_name_arr = option.name.split(',');
					opt_name_arr.forEach(function(v){
						if($("select[name='"+v+"']").length > 0)
						{
							value = encodeURI($("select[name='"+v+"'] option:selected").val());
							items.push({name:v,value:value});
							where[v] = value;
							has_name.push(v);
						}
					});
				}else
				{
					value = $("select[name='"+option.name+"'] option:selected").val();
				}
				
			}
			
			if(option.encode || $.inArray(option.type,cfg.encode_type) > -1)
			{
				value = encodeURIComponent(value);
			}
			if(!more_name)
			{
				where[option.name] = value;
				has_name.push(option.name);
				items.push({name:option.name,value:value});
			}
			
			
			
		});
		//将表头的filter数据加进来
		cfg.filter.forEach(function(v){
			has_name.push(v.field);
			var checked_cal = '';
			v.data.forEach(function(fv){
				if(fv.show)
				{
					checked_cal = fv.id;
				}
			});
			items.push({name:v.field,value:checked_cal});
		});
		//将路由的参数预设进来
		let rsearch = layui.sa.router()['search'];
		for(var i in rsearch)
		{
			if(layui.$.inArray(i,has_name) == -1)
			{
				items.push({name:i,value:rsearch[i]});
			}
		}
		
		let items_str_arr = [];
		items.forEach(function(v){
			items_str_arr.push(v.name+'='+v.value);
		});
		return {items:items,where:$.extend({},cfg.table.where,where),str:items_str_arr.join('&')};
	}
	sl.tablePage = function(page,curr)
	{
		return page?$.extend({},page,{curr: curr}):false;
	}
	obj.prototype.renderFilter = function(data)
	{
		//渲染 filter
		var that = this;
		var pageConfig = that.config;
		var dropdownrender = function(filter)
		{
			layui.dropdown.render({
				elem: '#'+filter.id
				,data: filter.data
				,templet:'{{d.'+filter.pars.title+'}} <i class="layui-icon layui-icon-ok {{d.show?\'\':\'layui-hide\'}}" />'
				,className:'sa_sl_filter'
				,click: function(obj){
					var is_true = false;
					filter.data.forEach(function(v,i){
						if(obj.id == v.id)
						{
							filter.data[i].show = filter.data[i].show?false:true;
						}else
						{
							filter.data[i].show = false;
						}
						if(filter.data[i].show)
						{
							is_true = true;
						}
					});
					dropdownrender(filter);
					//重置搜索项
					pageConfig.cols.forEach(function(v,i){
						if(v.sa_filter && v.sa_filter.field == filter.field)
						{
							if(is_true)
							{
								pageConfig.cols[i].title = $('<div>'+pageConfig.cols[i].title+'<div>').find('.icon-filter').addClass('filter_checked').parent().html();
							}else
							{
								pageConfig.cols[i].title = $('<div>'+pageConfig.cols[i].title+'<div>').find('.icon-filter').removeClass('filter_checked').parent().html();
							}
							
						}
					});
					sl.search(pageConfig);
				}
			});
		}
		
		that.config.filter.forEach(function(filter){
			if(data[filter.field])
			{
				filter.data = data[filter.field];
			}
			var checked_val = sa.router()['search'][filter.field];
			
			filter.data.forEach(function(v,i){
				if(checked_val != '' && v.id == checked_val)
				{
					filter.data[i].show = true;
				}
			});
			dropdownrender(filter);
		});
	}
	obj.prototype.render = function()
	{
		var that = this;
		var pageConfig = this.config;
		var table_config = pageConfig.table;
		//处理表头 模板
		pageConfig.cols.forEach(function(value,index){
			var tpl = sa.getValue(pageConfig.tpls[value.field]);
			if(tpl && !sa.getValue(pageConfig.cols[index].templet))
			{
				if(typeof tpl == 'object')
				{
					var tpls = ['<div class="layui-btn-group">'];
					tpl.forEach(function(v){
						if(that.op_btns[v])
						{
							tpls.push(that.op_btns[v]);
						}
					});
					tpls.push('</div>');
					tpl = tpls.join('');
				}
				if(pageConfig.cols[index].param)
				{
					pageConfig.cols[index].templet = laytpl(tpl).render(pageConfig.cols[index].param);
				}else
				{
					pageConfig.cols[index].templet = '<div>'+tpl+'</div>';
				}
			}
			//添加表头筛选检索 添加表头筛选图标
			if(value.sa_filter)
			{
				
				var filter_id = sa.random('filter_');
				var checked_val = sa.router()['search'][value.sa_filter.field];
				var checked_class = checked_val?'filter_checked':'';
				pageConfig.cols[index].title += '<i id="'+filter_id+'" class="iconfont icon-filter '+checked_class+'"></i>';
				var data = [];
				if(value.sa_filter.data)
				{
					data = value.sa_filter.data;
				}
				
				that.config.filter.push({
					id:filter_id,data:data,field:value.sa_filter.field,pars:value.sa_filter.pars?value.sa_filter.pars:{title:'title'}
				});
			}
		});
		
		//读取当前是第几页 主要为刷新浏览器能记住当前是第几页
		let router = sa.router();
		let now_page = sa.getValue(router.search.page,1);
		//读取是否有排序方式
		if(router.search.sort)
		{
			var sort = router.search.sort.split('.');
			table_config.initSort = {field:sort[0],type:sort[1]};
		}
		//渲染数据表格
		table.render($.extend(true,{},table_config,{
			page:sl.tablePage(table_config.page,now_page)//分页设置为当前页
			,cols: [pageConfig.cols]
			,done:function(res,curr){
				//数据回调
				layui.render.init();
				if(res.code)
				{
					return;//当返回错误的时候 直接停止渲染search的头部组件
				}
				let hash = location.hash;
				
				if(res.data.length < 1 && curr > 1)
				{
					//删除数据的时候当不在第1页的时候  出现空数据的现象 这个是需要重新进入到第一页
					if(!pageConfig.open)
					{
						
						layui.sa.justHashChange('#/'+pageConfig.page);
					}
					//这里自动修改表格的参数
					table.reload(table_config.id,{where:$.extend({},table_config.where),page: sl.tablePage(table_config.page,1)});
					return;
				}
				
				//这里添加 page到url中 这样可以支持url中记住table的page
				
				
				if(hash.indexOf('page=') > -1)
				{
					hash = hash.replace(/page=(\d+)/,'page='+curr);
				}else
				{
					if(curr != 1)
					{
						if(hash.indexOf('?') > -1)
						{
							hash += '&page='+curr;
						}else
						{
							hash += '?page='+curr;
						}
					}
				}
				if(location.hash != hash && !pageConfig.open)
				{
					layui.sa.justHashChange(hash);
				}
					
				
				
				
				//在第一页的时候初始化搜索组件
				if(!that.is_init)
				{
					//先组装按钮 然后检测是否需要插入到options中
					var options = [];
					var buttons = [];
					pageConfig.search.buttons.forEach(function(value){
						if(typeof value == 'string')
						{
							if(that.buttons[value])
							{
								value = that.buttons[value];
							}else
							{
								return true;
							}
						}
					
						var s_id = sa.random('se_');
					
						var button = '<button id="'+s_id+'" title="'+(value.tip?value.tip:(value.title?value.title:''))+'" type="button" class="layui-btn '+(value.classname?value.classname:'')+'">';
						if(value.icon)
						{
							button += '<i class="layui-icon '+value.icon+'" style="'+(value.title?'':'margin-right:0;')+'"></i>';
						}
						if(value.title)
						{
							button += value.title;
						}
						button += '</button>';
						if(typeof value.func == 'function')
						{
							$('body').on('click','#'+s_id,function(){
								value.func(pageConfig,this);
							});
						}
						buttons.push(button);
						
					});

					let more_button = '<span class="layui-unselect layui-tab-bar" title="更多"><i class="layui-icon"></i></span>';
					let is_more = false;//增加搜索栏 面板展开收缩设置 这个是第一个br出现的时候会 设置为true
					
					pageConfig.search.options && pageConfig.search.options.forEach(function(value,value_index){
						var option = '';
						
						//检测url是否有参数
						if(value.name.indexOf(',') != -1)
						{
							let more_value = [];
							value.name.split(',').forEach(function(v){
								more_value.push(decodeURIComponent(sa.getValue(router.search[v])));
							});
							var r_value = more_value.join(',');
						}else
						{
							var r_value = sa.getValue(router.search[value.name]);
						}
						
						if(!r_value && value.value)
						{
							r_value = value.value;//预设默认值
						}
						
						var placeholder = sa.getValue(value.placeholder);
						
						//手动设置了uri转码 当页面刷新时需要解码 
						if(value.encode || $.inArray(value.type,pageConfig.encode_type) > -1)
						{
							r_value = decodeURIComponent(r_value);
						}
						
						//预设值数据的话直接object格式 不再使用json字符串格式
						if(value.data_name)
						{
							//后台传也使用obj不再json_encode 了
							value.data_list = res.search[value.data_name];
						}
						//处理属性
						let ext_params = '';
						if(value.params)
						{
							value.params.placeholder = value.params.placeholder?value.params.placeholder:'请选择';
						}else
						{
							value.params = {placeholder:'请选择'};
						}
						let params = [];
						for(var i in value.params)
						{
							if(typeof value.params[i] == 'object')
							{
								//如果参数是数组或者object的话
								params.push(i+"='"+JSON.stringify(value.params[i])+"'");
							}else
							{
								params.push(i+"='"+value.params[i].toString()+"'");
							}
						}
						ext_params = params.join(' ');
						
						if(value.type == 'input')
						{
							//输入框
							option = '<input type="text" name="'+value.name+'" '+ext_params+' value="'+r_value+'" autocomplete="off" class="layui-input" />';
						}else if(value.type == 'sa_picker')
						{
							//多级分类
							option = laytpl('<input type="text" '+ext_params+' name="{{d.option.name}}" data-data="{{=JSON.stringify(d.option.data_list)}}" data-value="'+r_value+'" readonly="" class="layui-input sa_picker">').render({option:value});
						}else if(value.type == 'pickerx')
						{
							//多级分类
							option = laytpl('<div class="pickerx" '+ext_params+' data-value="'+r_value+'" data-name="{{d.option.name}}" data-list="{{=JSON.stringify(d.option.data_list)}}"></div>').render({option:value});
						}else if(value.type == 'bldate')
						{
							//选择日期
							option = '<input type="text" name="'+value.name+'" value="'+r_value+'" '+ext_params+' autocomplete="off" class="layui-input bldate" />';
						}else if(value.type == 'cas')
						{
							//选择地区
							option = '<input '+ext_params+' type="text" name="'+value.name+'" value="'+r_value+'" autocomplete="off" class="layui-input layui-col-md6 cas">';
							if(!sa.getValue(value.width))
							{
								var data_level = 3;
								if(value.params.sa_pars)
								{
									data_level = value.params.sa_pars.level?value.params.sa_pars.level:3;
								}
								if(data_level == 1)
								{
									value.width = '134px';
								}else if(data_level == 2)
								{
									value.width = '266px';
								}else
								{
									value.width = '398px';
								}
							}
						}else if(value.type == 'xm_select')
						{
							option = laytpl('<div class="{{d.option.type}}" name="{{d.option.name}}" '+ext_params+' value="'+r_value+'" data-list="{{=JSON.stringify(d.option.data)}}"></div>').render({option:value});
							if(!sa.getValue(value.width))
							{
								style += ';width:160px';//设置默认宽度
							}
						}
						var style = '';
						if(value.width)
						{
							style += ';width:'+value.width;
						}
						//新增搜索项的label
						if(value.label)
						{
							option = '<div class="layui-inline search_item"><label class="layui-form-label">'+value.label+'</label>'+'<div class="layui-inline" style="'+style+'">'+option+'</div></div>';
						}else
						{
							option = '<div class="layui-inline search_item" style="'+style+'">'+option+'</div>';
						}
						if(value.br)
						{
							if(!is_more)
							{
								//插入按钮 组件
								option += '<div class="layui-inline search_item layui-btn-group">'+buttons.join('')+'</div><br />';
								option += more_button + '<div class="sa_more_options">';
								$("#"+that.id).find('.layui-search-header-auto').addClass('search_more');
								is_more = true;
							}else
							{
								option += '<br />';
							}
						}
						options.push(option);
					});
					
					if(!is_more)
					{
						options.push('<div class="layui-inline search_item layui-btn-group">'+buttons.join('')+'</div>');
					}else
					{
						options.push('</div>');
					}
					
					if(options.length > 0)
					{
						$("#"+that.id).find('.search-form').html(options.join(''));
						$("#"+that.id).find(".layui-tab-bar").click(function(){
							$("#"+that.id).find('.layui-search-header-auto').toggleClass('search_more');
						});
					}
					
					layui.render.init();
					layui.form.render();
					
				}
				that.is_init = true;
				
				//增加读取数据后的自定义回调
				pageConfig.done(res);
				
				if(typeof pageConfig.customerDone == 'function')
				{
					pageConfig.customerDone(res);
				}
				that.renderFilter(res.search);
				
			}
		}));
		//数据表格操作
		table.on('tool('+table_config.id+')', function(obj){
			var data = obj.data;
			var layEvent = obj.event;
			if(layEvent === 'del'){
				that.delete_data(data.id);
			}else if(layEvent == 'edit')
			{
				that.post_data(data.id);
			}else if(layEvent === 'add')
			{
				that.post_data(0,data.id)
			}else
			{
				//自定义事件
				if(typeof pageConfig.event[layEvent] == 'function')
				{
					pageConfig.event[layEvent](data,pageConfig);
				}
			}
		});
		//设置为只编辑排序
		table.on('edit('+table_config.id+')', function(obj){
			sa.request({
				url: table_config.url
				,type:'post'
				,data: {displayorder:obj.data.displayorder,id:obj.data.id,actype:'displayorder'}
				,done: function(res) {
					layer.msg('操作成功', {
						offset: '15px',
						icon: 1,
						time: 1000
					}, function() {
						
					});
				}
			});
		});
		table.on('sort('+table_config.id+')', function(obj){
			pageConfig.table.initSort = obj;
			sl.search(pageConfig);
		});
		//设置开关数据状态
		form.on('switch(status)', function(obj){
			sa.request({
				url: table_config.url
				,type:'post'
				,data: {id:$(obj.elem).attr('data-id'),status:obj.elem.checked == true?1:0,actype:'status'}
				,done: function(res) {
					layer.msg('操作成功', {
						offset: '15px',
						icon: 1,
						time: 1000
					});
				}
			});
		});
		
		//搜索栏渲染
		form.render();
		
		return;
	}
	
	sl.render = function(config)
	{
		sl.pageConfig = config;
		var o = new obj(config);
		o.render();
	}
	
	
	exports("searchlist", sl);
})