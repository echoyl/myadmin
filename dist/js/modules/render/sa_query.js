;layui.define(['table'],function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {
		name:'sa_query'
	};
	
	var tpl = '<div class="layui-input-inline">\
						<div class="layui-col-md10 form-input-icon">\
							<input type="text" {{# if(d.required == 1){ }}lay-verify="required"{{# } }} placeholder="{{d.placeholder}}" autocomplete="off"  value="{{d.title}}" class="layui-input" />\
							<i title="清除" class="icow icow-error query_delete"></i>\
						</div>\
						<div class="layui-col-md2 query_select form-input-button">\
							<button type="button" class="layui-btn layui-btn-fluid">选择</button>\
						</div>\
						<input name="{{d.name}}" value="{{d.value}}" type="hidden" />\
				</div>\
				<div class="layui-form-mid layui-word-aux"> {{d.tip}} </div>';
	r.init = function(){

		$("."+r.name).each(function(){
			var that = this;
			let tpl_title = layui.sa.getValue($(that).attr('tpl-title'),'{{d.title}}');
			let tpl_value = layui.sa.getValue($(that).attr('tpl-value'),'{{d.id}}');
			//出入额外的参数
			var param = $(that).attr('data-param');
			if(typeof param != 'undefined')
			{
				param = JSON.parse(param);
			}else
			{
				param = {};
			}
			var data = {
				title:layui.sa.getValue($(that).attr('data-title')),
				value:layui.sa.getValue($(that).attr('data-value')),
				name:layui.sa.getValue($(that).attr('name')),
				tip:layui.sa.getValue($(that).attr('data-tip')),
				required:layui.sa.getValue($(that).attr('data-required')),
				placeholder:layui.sa.getValue($(that).attr('placeholder'),'请选择')
			};
			
			layui.laytpl(tpl).render(data,function(html){
				$(that).html(html);
				var url = $(that).attr('data-url')
				$(that).find('.query_select').click(function(){
					sa.open({
						data:{page_info:{},param:param},
						area:['820px','600px'],
						url:url,
						title:'选择数据',
						callback:function(res){
							//默认返回res为多个数组
							let _value = [],_title = [];
							layui.each(res,function(i,v){
								if(v.origin_title)
								{
									v.title = v.origin_title;
								}
								_title.push(layui.laytpl(tpl_title).render(v));
								_value.push(layui.laytpl(tpl_value).render(v));
							});
							$(that).find("input:eq(0)").val(_title.join('|'));
							$(that).find("input:eq(1)").val(_value.join('|'));
						}
					})
				});
				$(that).find('.query_delete').click(function(){
					$(that).find("input:eq(0)").val('');
					$(that).find("input:eq(1)").val(0);
				});
			});
			$(this).removeClass(r.name);//防止重复渲染
		});
		
	}
	exports(r.name+"_r", r);
});