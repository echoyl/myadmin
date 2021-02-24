layui.define(["table", "layer","form",'render','laytpl'], function(exports) {
	var form = layui.form,
		layer = layui.layer,
		table = layui.table,
		sa = layui.sa,
		laytpl = layui.laytpl,
		$ = layui.$;
	
	var sl = {};
	
	var obj = function(config)
	{
		var is_init = false;
		var self = this;
		var _config = {
			url:'',//请求地址
			page:'',//页面路径
			page_post:'',//编辑路径
			tableId:'tableId',//表格的id
			search:{
				options:[],buttons:[]
			},
			form_id:'search_form',
			page_zie:10,
			open:false,//是否是在弹层中打开
			event:{},
			done:function(res)
			{
				//加载完数据后 可以追加统计数据在 表格底部
				let tpl = '{{#  layui.each(d.list, function(index, item){ }}<div class="layui-inline">{{item.label}}<span style="color:red;">{{item.value}}</span></div>{{#  }); }}';
				if(res.search)
				{
					layui.laytpl(tpl).render({list:res.search.desc},function(html){
						if(layui.$("#result_html").length > 0)
						{
							layui.$("#result_html").html(html);
						}
					});
				}
				
			}
		};
		this.config = $.extend({},_config,config);
		this.tpls = {
			'edit':'<a href="javascript:;" title="编辑"><button class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-bianji"></i></button></a>\
					<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del" title="删除"><i class="layui-icon layui-icon-delete"></i></button>',
			'status':'<input type="checkbox" name="status" value="1" data-id="{{d.id}}" lay-skin="switch" lay-text="启用|启用" lay-filter="status" {{ d.status==1?"checked":"" }}>'
		};
		//预设值的按钮
		this.buttons = {
			search:{
				icon:'layui-icon-search',
				title:'搜索',
				classname:'layui-btn-normal',
				func:function(cfg){
					var items = [];
					let has_name = [];
					//这里将页面设置的where参数复写在url中 防止搜索刷新后参数丢失
					if(cfg.where)
					{
						for(let ik in cfg.where)
						{
							//屏蔽page_info这个关键字
							if(ik != 'page_info')
							{
								items.push(ik+'='+cfg.where[ik]);
							}
						}
					}
					
					var where = {};
					cfg.search.options.forEach(function(option){
						var value = '';
						if(option.type == 'input' || option.type == 'bldate' || option.type == 'cas' || option.type == 'xm_select')
						{
							value = $('input[name="'+option.name+'"]').val();
						}else if(option.type == 'pickerx' || option.type == 'select_single')
						{
							value = $("select[name='"+option.name+"'] option:selected").val();
						}
						
						if(option.encode || (option.type == 'cas' || option.type == 'keyword' || option.type == 'bldate'))
						{
							value = encodeURI(value);
						}
						where[option.name] = value;
						has_name.push(option.name);
						items.push(option.name+'='+value);
					});
					//将路由的参数预设进来
					let rsearch = layui.sa.router()['search'];
					for(var i in rsearch)
					{
						if(layui.$.inArray(i,has_name) == -1)
						{
							items.push(i+'='+rsearch[i]);
						}
					}
					//console.log(where);
					if(!cfg.open)
					{
						layui.sa.justHashChange('#/'+cfg.page+'?'+items.join('&'));
					}
					//这里自动修改表格的参数
					table.reload(cfg.tableId,{where:$.extend({},cfg.where,where),page: {limit:cfg.page_zie,curr: 1}});
					
				}
			},
			add:{
				icon:'layui-icon-tianjia2',
				title:'添加',
				classname:'',
				func:function(cfg){
					//添加默认打开新页面
					self.post_data(0);
				}
			},
			delete:{
				icon:'layui-icon-delete',
				title:'删除',
				classname:'layui-btn-danger',
				func:function(cfg){
					var checkStatus = table.checkStatus(cfg.tableId);
					if(checkStatus.data.length > 0)
					{
						var ids = [];
						for(var i in checkStatus.data)
						{
							ids.push(checkStatus.data[i].id);
						}
						self.delete_data(ids.join('.'));
					}else
					{
						layer.msg('请勾选');
					}
				}
			}
			
		};
		this.delete_data = function(ids)
		{
			var self = this;
			layer.confirm('确定要删除么', function(index){
				sa.request({
					url: self.config.url+'/1'
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
		
		this.post_data = function(id)
		{
			//添加默认打开新页面
			var cfg = self.config;
			var post_page = cfg.page_post?cfg.page_post:cfg.page + 'post';
			
			//添加路由参数
			let rsearch = layui.sa.router()['search'];
			
			if(cfg.post_type == 'open')
			{
				layui.sa.open({
					data:layui.$.extend({},rsearch,{id:id}),
					area:cfg.area?cfg.area:false,
					url:post_page,
					title:'编辑添加',
					callback:function(){
						layui.sa.reload();
					}
				});
			}else
			{
				//默认进行页面跳转编辑
				let hash_par = ['id='+id];
				for(var i in rsearch)
				{
					hash_par.push([i+'='+rsearch[i]]);
				}
				location.hash = '#/'+post_page+'?'+hash_par.join('&');
			}
		}
	}
	
	obj.prototype.render = function()
	{
		var self = this;
		var pageConfig = this.config;
		
		//处理表头 模板
		pageConfig.cols.forEach(function(value,index){
			var tpl = sa.getValue(self.tpls[value.field]);
			if(tpl && !sa.getValue(pageConfig.cols[index].templet))
			{
				if(pageConfig.cols[index].param)
				{
					pageConfig.cols[index].templet = laytpl(tpl).render(pageConfig.cols[index].param);
				}else
				{
					pageConfig.cols[index].templet = '<div>'+tpl+'</div>';
				}
			}
		});
		
		//读取当前是第几页 主要为刷新浏览器能记住当前是第几页
		let router = sa.router();
		let now_page = sa.getValue(router.search.page,1);
		//渲染数据表格
		table.render({
			elem: '#'+pageConfig.tableId
			,height: pageConfig.height?pageConfig.height:'auto'
			,size:pageConfig.size?pageConfig.size:'lg'
			,url: pageConfig.url
			,where:pageConfig.where
			,page: {
				limit:pageConfig.page_zie
				,curr: now_page
			} //开启分页
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
					table.reload(pageConfig.tableId,{where:$.extend({},pageConfig.where),page: {limit:pageConfig.page_zie,curr: 1}});
					return;
				}
				
				//这里添加 page到url中 这样可以支持url中记住table的page
				
				console.log('page is:'+curr);
				
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
				if(!self.is_init)
				{
					var options = [];
					pageConfig.search.options.forEach(function(value){
						var option = '';
						
						//检测url是否有参数
						
						var r_value = sa.getValue(router.search[value.name]);
						var placeholder = sa.getValue(value.placeholder);
						
						//手动设置了uri转码 当页面刷新时需要解码 
						if(value.encode || (value.type == 'cas' || value.type == 'keyword' || value.type == 'bldate'))
						{
							r_value = decodeURI(r_value);
						}
						
						//预设值数据的话直接object格式 不再使用json字符串格式
						if(value.list_name)
						{
							//后台传也使用obj不再json_encode 了
							value.data_list = res.search[value.list_name];
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
							params.push(i+'="'+value.params[i].toString()+'"');
						}
						ext_params = params.join(' ');
						
						if(value.type == 'input')
						{
							//输入框
							option = '<input type="text" name="'+value.name+'" '+ext_params+' value="'+r_value+'" autocomplete="off" class="layui-input" />';
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
							option = '<input data-level="'+(value.data_level?value.data_level:3)+'" '+ext_params+' type="text" name="'+value.name+'" value="'+r_value+'" autocomplete="off" class="layui-input layui-col-md6 cas">';
							if(!sa.getValue(value.width))
							{
								if(value.data_level)
								{
									if(value.data_level == 1)
									{
										value.width = '135px';
									}else if(value.data_level == 2)
									{
										value.width = '270px';
									}else
									{
										value.width = '400px';
									}
								}else
								{
									value.width = '400px';
								}
							}
						}else if(value.type == 'select_single')
						{
							option = laytpl('<div class="{{d.option.type}}" name="{{d.option.name}}" '+ext_params+' value="'+r_value+'" data-list="{{=JSON.stringify(d.option.data_list)}}"></div>').render({option:value});
						}else if(value.type == 'xm_select')
						{
							option = laytpl('<div class="{{d.option.type}}" name="{{d.option.name}}" '+ext_params+' value="'+r_value+'" data-list="{{=JSON.stringify(d.option.data_list)}}"></div>').render({option:value});
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
						option = '<div class="layui-input-inline search_item" style="'+style+'">'+option+'</div>';
						options.push(option);
					});
					var buttons = [];
					pageConfig.search.buttons.forEach(function(value){
						if(typeof value == 'string')
						{
							if(self.buttons[value])
							{
								value = self.buttons[value];
							}else
							{
								return true;
							}
						}
					
						var s_id = sa.random('se_');
					
						var button = '<a id="'+s_id+'" href="javascript:;"><button class="layui-btn '+(value.classname?value.classname:'')+'">';
						if(value.icon)
						{
							button += '<i class="layui-icon '+value.icon+'"></i>';
						}
						if(value.title)
						{
							button += value.title;
						}
						button += '</button></a>';
						if(typeof value.func == 'function')
						{
							$('body').on('click','#'+s_id,function(){
								value.func(pageConfig);
							});
						}
						buttons.push(button);
						
					});
					if(buttons.length > 0)
					{
						options.push('<div class="layui-input-inline search_item">'+buttons.join('')+'</div>');
					}
					if(options.length > 0)
					{
						$("#"+pageConfig.form_id).html(options.join(''));
					}else
					{
						//$("#"+pageConfig.form_id).parent().hide();
					}
					
					layui.render.init();
					layui.form.render();
				}
				self.is_init = true;
				
				//增加读取数据后的自定义回调
				pageConfig.done(res);
				
				if(typeof pageConfig.customerDone == 'function')
				{
					pageConfig.customerDone(res);
				}
			}
		});
		//数据表格操作
		table.on('tool('+pageConfig.tableId+')', function(obj){
			var data = obj.data;
			var layEvent = obj.event;
			if(layEvent === 'del'){
				self.delete_data(data.id);
			}else if(layEvent == 'edit')
			{
				self.post_data(data.id);
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
		table.on('edit('+pageConfig.tableId+')', function(obj){
			sa.request({
				url: pageConfig.url
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
		//设置开关数据状态
		form.on('switch(status)', function(obj){
			sa.request({
				url: pageConfig.url
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