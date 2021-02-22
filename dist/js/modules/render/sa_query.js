;layui.define(['table'],function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {
		name:'sa_query'
	};
	
	var tpl = '<div class="layui-input-inline">\
					<div class="layui-col-space5">\
						<div class="layui-col-md8">\
							<input type="text" {{# if(d.required == 1){ }}lay-verify="required"{{# } }} placeholder="{{d.placeholder}}" autocomplete="off"  value="{{d.title}}" class="layui-input" />\
						</div>\
						<div class="layui-col-md2 query_delete">\
							<a class="layui-btn layui-btn-fluid layui-btn-danger">清除</a>\
						</div>\
						<div class="layui-col-md2 query_select">\
							<a href="javascript:;" class="layui-btn layui-btn-fluid">选择</a>\
						</div>\
						<input name="{{d.name}}" value="{{d.value}}" type="hidden" />\
					</div>\
				</div>\
				<div class="layui-form-mid layui-word-aux"> {{d.tip}} </div>';
	r.init = function(){

		$("."+r.name).each(function(){
			var self = this;

			let tpl_title = layui.sa.getValue($(self).attr('tpl-title'),'{{d.title}}');
			let tpl_value = layui.sa.getValue($(self).attr('tpl-value'),'{{d.id}}');
			//出入额外的参数
			var param = $(self).attr('data-param');
			if(typeof param != 'undefined')
			{
				param = JSON.parse(param);
			}else
			{
				param = {};
			}
			var data = {
				title:layui.sa.getValue($(self).attr('data-title')),
				value:layui.sa.getValue($(self).attr('data-value')),
				name:layui.sa.getValue($(self).attr('name')),
				tip:layui.sa.getValue($(self).attr('data-tip')),
				required:layui.sa.getValue($(self).attr('data-required')),
				placeholder:layui.sa.getValue($(self).attr('placeholder'),'请选择')
			};
			
			layui.laytpl(tpl).render(data,function(html){
				$(self).html(html);
				var url = $(self).attr('data-url')
				$(self).find('.query_select').click(function(){
					sa.open({
						data:{page_info:{},param:param},
						area:['820px','600px'],
						url:url,
						title:'选择数据',
						callback:function(res){
							//默认返回res为多个数组
							let _value = [],_title = [];
							console.log(res);
							layui.each(res,function(i,v){
								_title.push(layui.laytpl(tpl_title).render(v));
								_value.push(layui.laytpl(tpl_value).render(v));
							});
							$(self).find("input:eq(0)").val(_title.join('|'));
							$(self).find("input:eq(1)").val(_value.join('|'));
						}
					})
				});
				$(self).find('.query_delete').click(function(){
					$(self).find("input:eq(0)").val('');
					$(self).find("input:eq(1)").val(0);
				});
			});
			$(this).removeClass(r.name);//防止重复渲染
		});
		
	}
	exports(r.name+"_r", r);
});