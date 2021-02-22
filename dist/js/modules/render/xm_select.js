layui.extend({
	xmSelect:"js/modules/xm-select",
}).define(['sa','xmSelect'],function(exports) {
	
	var $ = layui.$,sa = layui.sa,xmSelect = layui.xmSelect;

	var r = {
		name:'xm_select'
	};
	
	r.init = function(){

		$("."+r.name).each(function(){
			var self = this;
			var id = sa.random(r.name+'_');
			
			$(self).attr('id',id);
			
			var data_list = layui.sa.fixJson($(self).attr('data-list'));
			var prop_name = sa.getValue($(self).attr('data-prop_name'),'name');
			var prop_value = sa.getValue($(self).attr('data-prop_value'),'id');
			xmSelect.render({
				el: '#'+id,
				name:sa.getValue($(self).attr('name')),
				filterable:sa.getValue($(self).attr('filterable')),
				tips:sa.getValue($(self).attr('placeholder'),'请选择'),
				initValue:sa.getValue($(self).attr('value')).split(','),
				toolbar:{
					show:sa.getValue($(self).attr('toolbar')),
				},
				prop: {
					name: prop_name,
					value: prop_value,
				},
				theme: {
					color: '#8799a3',
				},
				data: data_list
			})
			
			$(this).removeClass(r.name);
		});
	}
	
	//return;
	exports(r.name+"_r", r);
});