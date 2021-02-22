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
							data-index={{index}} data-src="{{item.url}}" class="show_image" />\
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
	}
	
	//return;
	exports(r.name+"_r", r);
});