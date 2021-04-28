layui.define(['sa'], function(exports) {
	//使用layui的 下拉菜单来做 picker 默认绑定到一个input中
	var $ = layui.$,sa = layui.sa;
	var dropdown = layui.dropdown;
	var r = {
		name:'sa_picker',
		pars:{
			title:'title'
			,id:'id'
			,child:'child'
			//,empty:"请选择"
			,cb:false
		}
	};
	//获取选中的内容
	r.getSelect = function(source_data, id) {
		if (source_data.length == 0 || !id) {
			return [];
		}
		function findPathByLeafId(leafId, nodes, path){
			if(path === undefined) {
				path = [];
			}
			for(var i = 0; i < nodes.length; i++) {
				var tmpPath = path.concat();
				tmpPath.push({id:nodes[i].id,title:nodes[i].title});
				if(leafId == nodes[i].id) {
					return tmpPath;
				}
				if(nodes[i].child) {
					var findResult = findPathByLeafId(leafId, nodes[i].child, tmpPath);
					if(findResult) {
						return findResult;
					}
				}
			}
		}
		return findPathByLeafId(id,source_data);
	}
	//处理数据
	r.parseData = function(source_data,pars)
	{
		var res = [];
		let rev = (data,top_id) => {
			var empty_open = r.empty(pars,top_id);
			var items = empty_open?[empty_open]:[];
			for (var i = 0, length = data.length; i < length; i++) {
				var item = {};
				if (data[i][pars.child] && data[i][pars.child].length > 0) {
					//有子元素
					item[r.pars.title] = data[i][pars.title];
					item[r.pars.id] = data[i][pars.id];
					item[r.pars.child] = rev(data[i][pars.child],data[i][pars.id]);
				}
				else {
					item[r.pars.title] = data[i][pars.title];
					item[r.pars.id] = data[i][pars.id];
				}
				items.push(item);
			}
			return items;
		};
		//自定义字段的话 重新生成数据
		res = rev(source_data);
		return res;
	}
	
	r.empty = function(pars,id)
	{
		if(pars.empty)
		{
			var item = {};
			item[r.pars.title] = "<span style='color:rgba(0,0,0,.35);'>"+pars.empty+"</span>";
			item[r.pars.id] = typeof id != 'undefined'?[id,'empty'].join('_'):'empty';
			return item;
		}else
		{
			return false;
		}
		
	}
	
	r.parseStringData = function(data,pars)
	{
		var empty_open = r.empty(pars);
		var res = empty_open?[empty_open]:[];
		data = data.split(',');
		data.forEach((v)=>{
			var item = {};
			item[r.pars.title] = v;
			item[r.pars.id] = v;
			res.push(item);
		});
		return res;
	}
	
	r.select = function(that,selected,pars,is_cb)
	{
		var obj = selected[selected.length - 1];
		var title = '';
		var id = '';
		if((obj[r.pars.id]+'').indexOf('empty') > -1)
		{
			selected = selected.slice(0, -1);
			if(selected.length > 0)
			{
				obj = selected[selected.length - 1];
				title = obj[r.pars.title];
				id = obj[r.pars.id];
			}
		}else
		{
			title = obj[r.pars.title];
			id = obj[r.pars.id];
		}
		$(that).val(title);
		$(that).parent().find('input:eq(1)').val(id);
		if(is_cb == 1 && pars.cb && typeof sa.methods[pars.cb] == 'function')
		{
			sa.methods[pars.cb](selected);
		}
		return;
	}
	
	r.init = function(){
		
		$("."+r.name).each(function(){
			var that = this;
			let pars = $.extend({},r.pars,sa.json(sa.getValue($(this).attr('sa_pars'))));

			var id = $(that).attr('id')?$(that).attr('id'):sa.random(r.name + '_');
			$(that).attr('id',id);
			var input_name = $(that).attr('name');
			$(that).removeAttr('name');
			$(that).after('<i class="layui-edge"></i><input name="'+input_name+'" type="hidden" />');
			$(that).parent().addClass('layui-form-select');

			var data = $(that).data('data');
			
			//字符串类型
			if(typeof data == 'string')
			{
				data = r.parseStringData(data,pars);
			}else
			{
				data = r.parseData(data,pars);//处理数据
			}
			
			//初始选中数据
			var value = r.getSelect(data,$(that).attr('data-value'));
			if(value && value.length > 0)
			{
				r.select(that,value,pars);
			}
			
			dropdown.render({
				elem: '#'+id
				,data: data
				,click: function(obj){
					r.select(that,r.getSelect(data,obj[r.pars.id]),pars,1);
				}
			});

			$(that).removeClass(r.name);
		});
	}
	exports(r.name+"_r", r);
});