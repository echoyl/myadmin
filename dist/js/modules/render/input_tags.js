//单列选择渲染
layui.define(['inputTags'],function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {
		name:'input_tags'
	};
	
	var tpl = 	'<input type="hidden" name="{{d.name}}" value="{{d.value}}">\
				<div class="inputtags">\
					<input type="text" id="{{d.id}}" data-source="{{=d.source}}"  value="" placeholder="{{d.placeholder}}" autocomplete="off" >\
				</div>';
	
	r.init = function(){

		$("."+r.name).each(function(){
			var self = this;
			var id = sa.random(r.name+'_');
			
			var value = sa.getValue($(self).attr('data-value'));
			
			var data = {
				id:id,
				name:$(self).attr('data-name'),
				value:$(self).attr('data-value'),
				source:$(self).attr('data-source'),
				placeholder:sa.getValue($(self).attr('data-placeholder'),'请输入标签')
			};
			
			layui.laytpl(tpl).render(data,function(html){
				$(self).html(html);
				
				layui.inputTags.render({
					elem:'#'+id,
					content: value?value.split(','):[],
					aldaBtn: true,
					done: function(value,all){
						console.log(all);
						$("input[name='"+data.name+"']").val(all.join(','));
					}
				});
				
				
			});
			$(this).removeClass(r.name);
		});
	}
	
	exports(r.name+"_r", r);
	
});