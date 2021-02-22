//单列选择渲染
layui.extend({
	tinymce:"js/modules/tinymce/tinymce",
}).define(['tinymce'],function(exports) {
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {};
	
	var tpl = '';
	
	r.init = function(){
		console.log('初始化tinymce')
		$(".tinymce").each(function(){
			var id = sa.random('tinymce_')
			$(this).attr('id',id);
			var edi = layui.tinymce.render({
				elem: "#"+id
				, height: 600
				// ...
				// 其余配置可参考官方文档
			},function(opt){
				//加载完成后回调
			});
			//console.log(edi.ui.registry.getAll().menuItems);
			$(this).removeClass('tinymce');
		});
	}
	
	//return;
	exports("tinymce_r", r);
});