//单列选择渲染
layui.define(['laydate'],function(exports) {
	
	var $ = layui.$,laydate = layui.laydate,sa = layui.sa;
	
	var r = {};
	
	var tpl = '';
	
	r.init = function(){
		
		$(".bldate").each(function(){
			//console.log('#'+$(this).attr('id'));
			
			if(!$(this).attr("id"))
			{
				var id = sa.random('bldate_');
			
				$(this).attr("id",id);
			}else
			{
				var id = $(this).attr("id");
			}
			
			if(id.indexOf('{') > -1)
			{
				//这里检测到 dom实际上只是一个模板 那么直接过滤
				return;
			}
		
			
			var type = sa.getValue($(this).attr('data-type'));
			var isRange = sa.getValue($(this).attr('data-range'));
			var format = sa.getValue($(this).attr('data-format'));
			//重新引入 参数都放在同一个json中
			let pars = sa.json(sa.getValue($(this).attr('sa-pars')));
			if(type)
			{
				if(!format)
				{
					if(type == 'date')
					{
						format = 'yyyy-MM-dd';
					}else if(type == 'month')
					{
						format = 'yyyy-MM';
					}else
					{
						format = 'yyyy-MM-dd HH:mm:ss';
					}
				}
				
				if(isRange)
				{
					pars = $.extend({},{
						elem: '.layui-layout-body #'+id,
						type:type
						,range:isRange
						,format:format
					},pars);
				}else
				{
					pars = $.extend({},{
						elem: '.layui-layout-body #'+id,
						type:type,
						format:format
					},pars);
				}
				
			}else
			{
				pars = $.extend({},{
					elem: '.layui-layout-body #'+id,
					type:'date'
				},pars);
			}
			laydate.render(pars);
			$(this).removeClass('bldate');
		});
	}
	
	//return;
	exports("bldate_r", r);
});