layui.extend({
	sa: "js/sa",
	env:"js/env"
}).define(["env","sa","element"], function(exports) {
	var env = layui.env;
	var $ = layui.$;
	var laytpl = layui.laytpl;
	var sa = layui.sa;
	
	console.log(layui.router().path.length);
	
	
	
	//初始化页面
	function init()
	{
		layui.link(env.base + "style/admin.css");//加载后台样式
		//加载字体样式
		env.fonts.forEach(function(v){
			layui.link(env.base + "style/font/"+v+"/iconfont.css");//加载后台样式
			
		});
		//预加载一些click事件
		var $body = $('body');
		$body.on("click", "*[a-href]", function() {
			location.hash = sa.correctRouter($(this).attr('a-href'));
		});
		
		var _sa = new sa();
		
		window.addEventListener("popstate", function(e) { 
			//console.log(e);
		}, false);
		
		//添加hash变化后的事件处理
		window.onhashchange = function(e) {
			//console.log(e);
			_sa.hashChange(true);
		}
		
		_sa.hashChange();
		
	}
	
	
	init();
	exports("main", {});
});