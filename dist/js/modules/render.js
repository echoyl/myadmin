layui.extend({
	sortable:"js/modules/sortable",
	inputTags:"js/modules/inputTags/inputTags"
}).define(["env"], function(exports) {
	var env = layui.env;
	var $ = layui.$,sa = layui.sa;
	
	var r = {
		isinit:false
	};
	
	let render_more = [
		{
			name:'pickerx',
			path:"js/modules/render/pickerx",
		},
		{
			name:'select_single',
			path:"js/modules/render/select_single"
		},
		{
			name:'attachment',
			path:"js/modules/render/attachment"
		},
		{
			name:'bldate',
			path:"js/modules/render/bldate"
		},
		{
			name:'tinymce',
			path:"js/modules/render/tinymce"
		},
		{
			name:'cas',
			path:"js/modules/render/cas"
		},
		{
			name:'clipboard',
			path:"js/modules/render/clipboard"
		},
		{
			name:'blmap',
			path:"js/modules/render/blmap"
		},
		{
			name:'bloption',
			path:"js/modules/render/bloption"
		},
		{
			name:'sa_query',
			path:"js/modules/render/sa_query"
		},
		{
			name:'input_tags',
			path:"js/modules/render/input_tags"
		},
		{
			name:'xm_select',
			path:"js/modules/render/xm_select"
		},
		{
			name:'sa_radio',
			path:"js/modules/render/sa_radio"
		}
		,
		{
			name:'sa_images',
			path:"js/modules/render/sa_images"
		}
	];//加载样式渲染直接绑定模块
	
	r.init = function()
	{
		console.log("render init");
		render_more.forEach(function(v){
			var _extend = {}
			var name = v.name + '_r';//添加render的名称后缀
			_extend[name] = v.path;
			//console.log(_extend);
			
			//检测有没有name的class的dom 有的话去渲染
			
			if($("."+v.name).length > 0)
			{
				if(typeof layui.modules[name] == 'undefined' || !layui.modules[name])
				{
					//去加载
					console.log('加载：'+name);
					layui.extend(_extend).use(name,function(){
						layui[name].init();
					});
				}else
				{
					console.log('加载使用：'+name);
					layui.use(name,function(){
						layui[name].init();
					});
				}
			}
		});
		//注册通用的dom点击事件
		if(!r.isinit)
		{
			$("body").on("click",'.show_image',function(){
			//图片组
				var view_pics = [];
				var bigsrc = $(this).attr('data-bigsrc');
				view_pics.push({
					"alt": '',
					"pid": 0, //图片id
					"src": typeof bigsrc != 'undefined'?bigsrc:$(this).attr('src'), //原图地址
					"thumb": $(this).attr('src') //缩略图地址
				});
				var json = {
				  "title": "浏览图片", //相册标题
				  "id": 'news_666', //相册id
				  "start": 0, //初始显示的图片序号，默认0
				  "data": view_pics
				}
				layui.layer.photos({
					photos: json //格式见API文档手册页
					,closeBtn: 1
					,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
				});
			});
			//logout点击
			$("body").on("click", "*[a-event]", function() {
				var e = $(this),
					t = e.attr("a-event");
				switch(t)
				{
					case 'userinfo':
					layui.sa.open({
						data:{},
						url:'system/userinfo',
						title:'用户信息'
					});
					break;
					case 'about':
					location.hash = "/system/welcome";
					break;
					case 'logout':
					layui.sa.request({
						url: "index/logout",
						type: "get",
						data: {},
						done: function(e) {
							layui.layer.msg(e.msg);
							setTimeout(function(){layui.sa.exit();},600);
						}
					});
					break;
					case 'refresh':
					layui.sa.reload();
					break;
				}
			})
			//userinfo 点击
			
			
		}
		r.isinit = true;
	}
	
	exports('render',r);
});