//单列选择渲染
layui.extend({
	cas: "js/modules/cas/cas",
}).define(['cas'],function(exports) {
	
	var $ = layui.$,cas = layui.cas;
	
	var r = {};
	
	var tpl = '';
	
	r.init = function(){
		$(".cas").each(function(){
			cas(this);
			$(this).removeClass('.cas');
		})
	}
	
	//return;
	exports("cas_r", r);
});