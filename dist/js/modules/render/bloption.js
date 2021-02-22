//单列选择渲染
layui.define(['table'],function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {
		name:'bloption'
	};
	
	var tpl = '<div class="layui-input-inline" style="width:500px;">\
					<table id="table_{{d.id}}"></table>\
				</div>\
				<button type="button" class="layui-btn layui-btn-primary" id="{{d.id}}" data-col="{{=d.col}}" style="margin:10px 0;">去设置</button>\
				<input type="hidden" name="{{d.name}}" value=\'{{d.value}}\' />';
	
	r.init = function(){

		$("."+r.name).each(function(){
			var self = this;
			var id = sa.random(r.name+'_');
			
			var value = $(self).attr('data-value');
			
			var data = {
				id:id,
				name:$(self).attr('name'),
				value:$(self).attr('data-value'),
				col:$(self).attr('data-col')
			};
			
			layui.laytpl(tpl).render(data,function(html){
				$(self).html(html);
				
				var ele = '#'+id;
				//console.log($(ele).data('col'));
				var col = sa.fixJson($(ele).data('col'));
				//console.log(col);
				var tableId = 'table_'+id;
				var value = $(ele).next().val()
				if(value && value != 'null')
				{
					console.log(value);
					var val = JSON.parse(value);
				}else
				{
					var val = [];
				}
				

				var __cols = [];
				var table_width = parseInt($('#'+tableId).parent().width());
				var width = parseInt(table_width/col.length);
				col.forEach(function(colunm,cindex){
					//增加表格的图片暂时 改成图片组件
					if(colunm.type == 'image')
					{
						__cols.push({
							field:colunm.name,
							title:colunm.title,
							width:cindex+1==col.length?'':width,
							templet:function(d){return '<img class="show_image" title="点击查看大图" src="'+sa.fixUrl(d[colunm.name])+'" />';}
						});
					}else
					{
						__cols.push({
							field:colunm.name,
							title:colunm.title,
							width:cindex+1==col.length?'':width
						});
					}
					
					
				});
				//console.log(__cols);
				val = r.toTableValue(val,col);
				layui.table.render({
					elem: '#'+tableId
					,page: true //开启分页
					,data:val
					,width:table_width
					,cols: [__cols],
					done:function(){
						//layer.close(_msg);
					}
				});
				
				//绑定事件
				$(ele).click(function(){				
					
					if($(this).next().val())
					{
						var val = JSON.parse($(ele).next().val());
					}else
					{
						var val = [];
					}
					sa.open({
						data:{col:col,val:val},
						area:['940px','600px'],
						url:'system/options',
						title:'属性设置',
						callback:function(res){
							console.log(res);
							$(ele).next().val(JSON.stringify(res));
							//添加table渲染
							if(typeof tableId != 'undefined')
							{
								res = r.toTableValue(res,col);
								layui.table.render({
									elem: '#'+tableId
									,page: false //开启分页
									,data:res
									,width:table_width
									,cols: [__cols],
									done:function(){
										//layer.close(_msg);
									}
								});
							}
						}
					});

				});
			});
			$(this).removeClass('bloption');
		});
	}
	r.toTableValue = function(value,cols){
		//var ret = [];
		var select = {};
		cols.forEach(function(c,i){
			if(c.type == 'select')
			{
				var item = {};
				c.data.forEach(function(v){
					item[v.value] = v.name;
				});
				select[c.name] = item;
			}
			
		});
		//console.log('这个是选项');
		//console.log(select);
		value.forEach(function(v,i){
			for(var indexname in v)
			{
				if(select[indexname] && select[indexname][v[indexname]])
				{
					value[i][indexname] = select[indexname][v[indexname]];
				}
			}
		});
		return value;
	}
	
	//return;
	exports(r.name+"_r", r);
});