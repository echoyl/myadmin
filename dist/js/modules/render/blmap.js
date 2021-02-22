//单列选择渲染
layui.define(function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {};
	
	var tpl = '<div class="layui-input-inline" style="width:211px;">\
					<input type="text" name="{{d.latname}}" value="{{d.lat}}" placeholder="经度" autocomplete="off" class="layui-input">\
				</div>\
				<div class="layui-input-inline" style="width: 211px;">\
					<input type="text" name="{{d.lngname}}" value="{{d.lng}}" placeholder="纬度" autocomplete="off" class="layui-input layui-col-md6">\
				</div>\
				<button type="button" class="layui-btn" id="{{d.id}}"><i class="layui-icon layui-icon-find-fill"></i></button>';
	
	r.init = function(){
		
		$(".blmap").each(function(){
			console.log('执行blmap渲染');
			var self = this;
			
			var value = $(this).attr('data-value');
			
			if(typeof value == 'undefined' || !value)
			{
				var v = ['',''];
			}else
			{
				var v = value.split(',');
			}
			var name = $(this).attr('name');
			var _name = ['data[lat]','data[lng]'];
			
			if(typeof name != 'undefined' && name)
			{
				_name = name.split(',')
			}
			
			var id = sa.random('blmap_')
			var data = {
				lat:v[0],
				lng:v[1],
				id:id,
				latname:_name[0],
				lngname:_name[1],
			};
			
			layui.laytpl(tpl).render(data,function(html){
				$(self).html(html);
				
				//绑定事件
				$("#"+id).bind('click',function(){
					var ele = this;
					
					sa.open({
						data:{
							lat:$(ele).parent().find('input:eq(0)').val(),
							lng:$(ele).parent().find('input:eq(1)').val(),
							address:$(ele).parent().find('input:eq(2)').val()
						},//传入默认值 如果不传则默认选中当前城市
						url:'system/map',
						title:'地图定位',
						callback:function(data){
							$(ele).parent().find('input:eq(0)').val(data.lat);
							$(ele).parent().find('input:eq(1)').val(data.lng);
							if(data.address)
							{
								$(ele).parent().find('input:eq(2)').val(data.address);
								if($(ele).attr('data-aname'))
								{
									$("input[name='"+$(ele).attr('data-aname')+"']").val(data.address);
								}
							}
						}
					});
				});
				
			});
			console.log(data);
			$(self).removeClass('blmap');
		});
	}
	
	//return;
	exports("blmap_r", r);
});