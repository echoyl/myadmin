//单列选择渲染
layui.define(['form'],function(exports) {
	
	var $ = layui.$;
	
	var r = {};
	
	var tpl = '<select lay-filter="{{d.filter}}" name="{{d.name}}">\
	{{# if(d.placeholder){ }}\
		<option value="">{{d.placeholder}}</option>\
	{{# } }}\
	{{#  layui.each(d.list, function(index, item){ }}\
        <option value="{{item.id}}" {{# if(d.value == item.id){ }}selected{{# } }}>{{item.name}}</option>\
	{{# }); }}\
	</select>';
	
	r.init = function(){
		
		$(".select_single").each(function(){
			console.log('执行select_single渲染');
			var self = this;
			
			var list = layui.sa.fixJson($(self).data('list'));
			var _list = [];
			list.forEach(function(v){
				if(typeof v == 'string')
				{
					//如果是字符串数组 那么处理成 object数组进行渲染
					var item = {
						id:v,name:v
					}
				}else
				{
					//如果自定义设定id及value的 名称 读取自定义内容
					var id = 'id',name = 'name';
					if($(self).data('id'))
					{
						id = $(self).data('id');
					}
					if($(self).data('name'))
					{
						name = $(self).data('name');
					}
					var item = {
						id:v[id],name:v[name]
					};
				}
				_list.push(item);
			});
			var filter = $(self).attr('lay-filter');
			var data = {
				name:$(self).attr('name'),
				value:$(self).attr('value'),
				list:_list,
				placeholder:$(self).attr('placeholder'),
				filter:typeof filter == 'undefined'?'':filter
			};
			var tip = layui.sa.getValue($(self).attr('data-tip'),'');
			layui.laytpl(tpl).render(data,function(html){
				$(self).html(html);
				if(tip)
				{
					var tip_html = '<div class="layui-form-mid layui-word-aux">'+tip+'</div>';
					$(self).parent().after(tip_html);
				}
				layui.form.render();
			});
			$(self).removeClass('select_single');
			
		});
	}
	
	//return;
	exports("select_single_r", r);
});