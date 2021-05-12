//单列选择渲染
;layui.define(['sortable','sa_attachment'],function(exports) {
	
	var $ = layui.$,sa = layui.sa,sortable = layui.sortable;

	var r = {};
	
	var tpl = '<div class="layui-form-item">\
					<label class="layui-form-label">{{d.title?d.title:"多图"}}</label>\
					<div class="layui-input-inline">\
						<div class="layui-col-space5">\
							{{# if(d.input == 1){ }}\
							<div class="layui-col-md10 form-input-icon">\
								<input type="text" name="{{d.name}}" {{# if(d.required == 1){ }}lay-verify="required"{{# } }} placeholder="请选择" autocomplete="off"  value="{{d.value}}" class="layui-input">\
								<i title="清除" class="icow icow-error attachment_delete"></i>\
							</div>\
							{{# }else{ }}\
								{{# var aindex=d.name.indexOf("]");if(aindex > -1){var ids_name = d.name.substr(0,aindex)+"_ids"+d.name.substr(aindex);}else{var ids_name = d.name+"_ids";} }}\
								<input type="hidden" name="{{d.name}}" value="{{d.value}}" />\
								<!--<input type="hidden" name="{{ids_name}}" value="{{d.value}}" />-->\
							{{# } }}\
							<div class="layui-col-md2 attachment_button form-input-button" data-name="{{d.name}}" data-file="{{d.file}}" data-limit="{{d.limit}}" data-id="sortable_{{d.id}}">\
								<button type="button" class="layui-btn layui-btn-fluid">选择</button>\
							</div>\
						</div>\
					</div>\
					<div class="layui-form-mid layui-word-aux"> {{d.tip}} </div>\
				</div>\
				<div class="layui-form-item {{d.value.length >0?\'\':\'layui-hide\'}}" id="attachmentcon_{{d.id}}">\
					<label class="layui-form-label"></label>\
					<div class="layui-input-inline attachmentcon" id="sortable_{{d.id}}">\
						{{# var images ="";layui.laytpl(d.image_tpl).render({list:d.value},function(html){images+=html}) }}\
							{{images}}\
					</div>\
				</div>';
	var image_tpl = '{{#  layui.each(d.list, function(index, item){if(typeof item == "string"){item = {thumb_url:(item.indexOf("http") > -1?item:(layui.env.storage_path+item)),url:item};} }}\
						<div class="layui-col-md4 muti_one_img_c" style="float:left">\
							<div class="muti_one_img_cc">\
							<div class="muti_one_img">\
							<img onload="layui.sa.loadImg(this)" data-id="{{item.id}}" src="{{item.thumb_url?item.thumb_url:"./dist/lib/banlv/nopic.jpg"}}" \
							data-bigsrc="{{item.url?(item.url.indexOf("http") > -1?item.url:layui.env.storage_path+item.url):""}}" \
							data-index={{index}} data-src="{{item.url}}" style="cursor:move;" class="attachment_image" />\
							</div>\
							</div>\
							<i class="layui-icon layui-icon-close delete_image"></i> \
							{{# if(item.type == 1){ }}\
							<div style="text-align:center;">{{item.name}}</div>\
							{{# } }}\
						</div>\
					{{# }) }}';
	var changeImg = function(item){
		var img_src = [];
		var img_ids = [];
		$(item).next().find('.attachment_image').each(function(){
			img_src.push($(this).attr('data-src'));
			img_ids.push($(this).attr('data-id'));
		})
		$(item).find('input:eq(0)').val(img_src.join(','));
		$(item).find('input:eq(1)').val(img_ids.join(','));
		if(img_src.length > 0)
		{
			$(item).next().removeClass('layui-hide');
		}else
		{
			$(item).next().addClass('layui-hide');
		}
	}
	r.init = function(){
		
		$(".attachment").each(function(){
			var isfile = $(this).data('file');
			var value_val = $(this).data('value')+'';
			if(typeof isfile == 'undefined')
			{
				isfile = 0;
				var value = value_val?value_val.split(','):[];
			}else{
				isfile = 1;
				
				var value = value_val?value_val:[];
				
			}
			var tip = $(this).data('tip');
			var param = {
				title:$(this).data('title'),
				value:value,
				tip:typeof tip == 'undefined'?'':tip,
				name:$(this).data('name'),
				required:$(this).data('required'),
				input:$(this).data('input'),
				limit:$(this).data('limit'),
				file:isfile,
				id:sa.random(),
				image_tpl:image_tpl
			};

			var this_con = this;
			layui.laytpl(tpl).render(param,function(html){
				$(this_con).html(html);
				changeImg($(this_con).find('div:eq(0)'));
				//绑定事件
				$(this_con).find('.attachment_delete').click(function(){
					var parent_id = 'attachmentcon_'+param.id;
					$("#"+parent_id).find(".attachmentcon").html('');
					changeImg($("#"+parent_id).prev());
				});
				var con_btn = $(this_con).find('.attachment_button');
				sortable.create(document.getElementById($(con_btn).data('id')), { group: $(con_btn).data('id'),onEnd:function(){changeImg($(con_btn).parent());} });
				
				$(con_btn).click(function(){
					var t = this;
					var limit = $(this).data('limit');
					var isfile = $(this).data('file');
					var name = $(this).data('name');

					var parent_id = 'attachmentcon_'+param.id;
					
					var now_length  = $("#"+parent_id).find(".attachmentcon").children().length;
					var length_distance = parseInt(limit) - now_length;
					if(length_distance <= 0 && limit != 1)
					{
						layer.msg('数量达到最大，无法选取',{time:1000});
						return false;
					}
					if(length_distance <= 0 && limit == 1)
					{
						length_distance = 1;
					}
					layui.sa_attachment.render({
							limit:length_distance <= 0?-1:length_distance,
							isMultiple:limit,
							isfile:isfile?1:0,
							name:name
						},function(res){
						
						layui.laytpl(image_tpl).render({list:res}, function(html){
							if(limit == 1)
							{
								$("#"+parent_id).find(".attachmentcon").html(html);
							}else
							{
								$("#"+parent_id).find(".attachmentcon").append(html);
							}
							
						});
						changeImg($("#"+parent_id).prev());
					});
				});
			});
			//移除属性防止二次渲染
			$(this_con).removeClass('attachment');
			
			
		});
		$("body").on("click",'.delete_image',function(){
			var parent3 = $(this).parent().parent().parent().prev();
			$(this).parent().remove();
			changeImg(parent3);
			
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
	exports("attachment_r", r);
});