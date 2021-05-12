layui.define(['jquery'],function (exports) {
	
	var $ = layui.$;
	var npr = null;

	if(typeof NProgress == 'undefined'){

		$.ajax({//获取插件
			url: layui.cache.base+'/js/modules/nprogress/nprogress/nprogress.js',

			dataType: 'script',

			cache: true,

			async: false,
		});

		npr = NProgress;
	}
	exports("nprogress", npr);
	
}).link('./dist/js/modules/nprogress/nprogress/nprogress.css');