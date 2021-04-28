layui.define(["searchlist"], function(exports) {
	var $ = layui.$;
	
	var sl = {};
	
	var obj = function(config)
	{		
		var that = this;
		var _config = {
			title:'title',
			child:'children',
			pre:'　├　',
			table:{page:false},
			tpls:{
				'edit':['add','edit','del'],
				'status':['status']
			}
		};
		this.config = $.extend(true,{},_config,config);
		this.config.table.parseData = function(res)
		{
			res.data = obj.getChild(res.data,that.config);
			res.count = res.data.length;
			return res;
		}
	}
	
	obj.getChild = function(data,config,pre,level)
	{
		var new_data = [];
		data.forEach(v=>{
			var now_prev = '';
			v.origin_title = v[config.title];
			if(typeof pre != 'undefined')
			{
				v[config.title] = pre + v[config.title];
				now_prev = pre + config.pre;
				v.level = level + 1;
			}else
			{
				now_prev = config.pre;
				v.level = 1;
			}
			new_data.push(v);
			if(v[config.child] && v[config.child].length > 0)
			{
				new_data = new_data.concat(obj.getChild(v[config.child],config,now_prev,v.level));
			}
		});
		return new_data;
	}
	
	obj.prototype.parseData = function()
	{
		//先获取一次数据
		
		//这里新建一个 方法处理 分类数据的层级关系
		var data = obj.getChild(this.config.data,this.config);
		console.log(data);
	}
	
	obj.prototype.render = function()
	{
		//直接通过searchlist 渲染
		//this.parseData();
		layui.searchlist.render(this.config);
		return;
	}
	
	sl.render = function(config)
	{
		var o = new obj(config);
		o.render();
	}
	
	
	exports("sa_category", sl);
})