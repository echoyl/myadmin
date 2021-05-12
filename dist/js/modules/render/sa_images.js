;layui.define(function(exports) {
	
	var $ = layui.$,sa = layui.sa;

	var r = {
		name:'sa_images'
	};
	
	let image_tpl = '{{#  layui.each(d.list, function(index, item){if(typeof item == "string"){item = {thumb_url:(item.indexOf("http") > -1?item:(layui.env.storage_path+item)),url:item};} }}\
						<div class="layui-col-md4 muti_one_img_c" style="float:left">\
							<div class="muti_one_img_cc">\
							<div class="muti_one_img">\
							<img onload="layui.sa.loadImg(this)" data-id="{{item.id}}" src="{{item.thumb_url?item.thumb_url:"./dist/lib/banlv/nopic.jpg"}}" \
							data-bigsrc="{{item.url?(item.url.indexOf("http") > -1?item.url:layui.env.storage_path+item.url):""}}" \
							data-index={{index}} data-src="{{item.url}}" />\
							</div>\
							</div>\
							{{# if(item.type == 1){ }}\
							<div style="text-align:center;">{{item.name}}</div>\
							{{# } }}\
						</div>\
					{{# }) }}';
	r.init = function(){
		
		$("."+r.name).each(function(){
			console.log('执行attachment渲染');

			//单图上传
			//console.log($(this).data('value'));
			var value_val = $(this).data('value')+'';
			var value = value_val?value_val.split(','):[];

			let images_html = "";
			
			layui.laytpl(image_tpl).render({list:value},function(html){images_html+=html});
			
			$(this).html(images_html);
			//移除属性防止二次渲染
			$(this).removeClass(r.name);
		});
		//绑定点击事件
		$("body").on("click",'.muti_one_img_cc',function(){
			var index = $(this).parent().index();
			var view_pics = [];
			$(this).parent().parent().find('img').each(function(){
				var bigsrc = $(this).attr('data-bigsrc');
				view_pics.push({
					"alt": '',
					"pid": 0, //图片id
					"src": typeof bigsrc != 'undefined'?bigsrc:$(this).attr('src'), //原图地址
					"thumb": $(this).attr('src') //缩略图地址
				});
			});
			var json = {
			  "title": "浏览图片", //相册标题
			  "id": layui.sa.random('attachment_photos_'), //相册id
			  "start": index, //初始显示的图片序号，默认0
			  "data": view_pics
			}
			layui.layer.photos({
				photos: json //格式见API文档手册页
				,closeBtn: 1
				,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
			});
			
		});
	}
	
	//return;
	exports(r.name+"_r", r);
});