layui.define(["treeGrid", "layer",'render',"form",'render'], function(exports) {
	var form = layui.form,
		layer = layui.layer,
		sa = layui.sa,
		laytpl = layui.laytpl,
		table = layui.treeGrid,
		$ = layui.$;
	
	var sl = {};
	
	var obj = function(config)
	{		
		var self = this;
		var _config = {
			url:'',//请求地址
			page:'',//页面路径
			page_post:'',//编辑路径
			tableId:'tableId',//表格的id
			search:{
				buttons:[]
			},
			form_id:'search_form',
			event:{}
		};
		
		this.config = $.extend({},_config,config);
		this.tpls = {
			'edit':'{{! {{# if(d.level < !}}{{d.level}} {{! ){ }}<a href="javascript:;" lay-event="add" ><button class="layui-btn layui-btn-xs"><i class="layui-icon layui-icon-tianjia2"></i></button></a>{{# } }} !}}\
					<a href="javascript:;" title="编辑"><button class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-bianji"></i></button></a>\
					<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del" title="删除"><i class="layui-icon layui-icon-delete"></i></button>',
			'status':'<input type="checkbox" name="status" value="1" data-id="{{d.id}}" lay-skin="switch" lay-text="启用|启用" lay-filter="status" {{ d.status==1?"checked":"" }}>'
		};
		//预设值的按钮
		this.buttons = {
			add:{
				icon:'layui-icon-tianjia2',
				title:'添加',
				classname:'',
				func:function(cfg){
					self.post_data(0,0);
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
		};
		
		this.post_data = function(id,parent_id)
		{
			//添加默认打开新页面
			var cfg = self.config;
			var post_page = cfg.page_post?cfg.page_post:cfg.page + 'post';			
			
			if(cfg.post_type == 'open')
			{
				layui.sa.open({
					data:{id:id,parent_id:parent_id},
					url:post_page,
					title:'编辑添加',
					callback:function(){
						layui.sa.reload();
					}
				});
			}else
			{
				//默认进行页面跳转编辑
				location.hash = '#/'+post_page+'?'+['id='+id,'parent_id='+parent_id].join('&');
			}
		}
	}
	
	obj.prototype.render = function()
	{
		var self = this;
		var pageConfig = this.config;

		pageConfig.cols.forEach(function(value,index){
			var tpl = sa.getValue(self.tpls[value.field]);
			if(tpl && !sa.getValue(pageConfig.cols[index].templet))
			{
				//table的版本不同 模板规则不一样 --！
				//pageConfig.cols[index].templet = '<div>'+tpl+'</div>';
				if(pageConfig.cols[index].param)
				{
					pageConfig.cols[index].templet = laytpl(tpl).render(pageConfig.cols[index].param);
				}else
				{
					pageConfig.cols[index].templet = tpl;
				}
				
			}
		});
		
		table.render({
			elem: '#'+pageConfig.tableId
			,url:pageConfig.url
			,where:pageConfig.where
			,cellMinWidth: 100
			,size:pageConfig.size?pageConfig.size:'lg'
			,treeId:'id'//树形id字段名称
			,treeUpId:'parent_id'//树形父id字段名称
			,treeShowName:'title'//以树形式显示的字段
			//,width:800
			,cols: [pageConfig.cols]
			,page:false
			,done:function(res){

				var options = [];
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
				
					var button = '<a id="'+s_id+'" href="javascript:;"><button class="layui-btn layui-btn-sm '+(value.classname?value.classname:'')+'">';
					if(value.icon)
					{
						button += '<i class="layui-icon '+value.icon+'"></i>';
					}
					if(value.title)
					{
						button += value.title;
					}
					button += '</button></a>';
					$('body').on('click','#'+s_id,function(){
						value.func(pageConfig);
					})
					buttons.push(button);
					
				});
				options.push('<div class="layui-input-inline search_item">'+buttons.join('')+'</div>');
				$("#"+pageConfig.form_id).html(options.join(''));
				layui.render.init();
				layui.form.render();
				
			}
		});
		table.on('tool('+pageConfig.tableId+')', function(obj){
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
			if(layEvent === 'del'){ //删除
				self.delete_data(data.id);
			}else if(layEvent === 'edit')
			{
				self.post_data(data.id,0);
			}else if(layEvent === 'add')
			{
				self.post_data(0,data.id)
			}else
			{
				//自定义事件
				if(typeof pageConfig.event[layEvent] == 'function')
				{
					pageConfig.event[layEvent](data);
				}
			}
		});
		table.on('edit('+pageConfig.tableId+')', function(obj){ //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
			layui.sa.request({
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
		
		return;
	}
	
	sl.render = function(config)
	{
		sl.pageConfig = config;
		var o = new obj(config);
		o.render();
	}
	
	
	exports("categoryList", sl);
})