layui.define(['jquery','laytpl','env','sa'], function (exports) {
    var $ = layui.$,tpl = layui.laytpl,env = layui.env,sa = layui.sa;
	var cas = function(ele){
		var t = this;
		var e = sa.local.get('cas');;
		
		if(!e)
		{
			//数据修改了ajax同步获取
			$.ajax({
				url: env.base + '/js/modules/cas/cas.json',
				type:"get",
				dataType: "json",
				data:{},
				async:false,
				success: function(res) {
					console.log(res);
					sa.local.set('cas', res,36000000);
					e = res;
				}
			});
		}
		
		t.ele = ele;
		t.scrollTop = {};
		t.config = {};
		t.isInit = false;
		for(var i in e){
			e[i].id = e[i].name;
			for(var j in e[i].sons)
			{
				e[i].sons[j].id = e[i].sons[j].name;
				e[i].sons[j].sons2 = [];

				for(var x in e[i].sons[j].sons)
				{
					e[i].sons[j].sons2.push({
						id:e[i].sons[j].sons[x],name:e[i].sons[j].sons[x]
					});
				}
				e[i].sons[j].sons = e[i].sons[j].sons2;
				delete e[i].sons[j].sons2;
			}
		}
		t.datas = e;
		//检测css是否已经加入没有的话 添加一次
		t.css = '<style type="text/css" id="cas_css">.next-icon-arrow-right:before{content:"\\E619";}\
		.next-icon-select:before{content:"\\E632";}\
		.next-menu{border:1px solid #ebecec;-webkit-box-shadow:none;box-shadow:none;}\
		.next-menu-item{padding:0 20px;color:#373d41;}\
		.next-menu-item.next-selected{color:#373d41;background-color:#fff;}\
		.next-menu-item.next-selected .next-menu-icon-selected{color:#00c1de;}\
		.next-menu-item:not(.next-disabled).next-selected:focus,.next-menu-item:not(.next-disabled).next-selected:focus:hover,.next-menu-item:not(.next-disabled).next-selected:hover,.next-menu-item:not(.next-disabled):hover{color:#373d41;background-color:#ebecec;}\
		.next-menu-item:not(.next-disabled).next-selected:focus .next-menu-icon-selected,.next-menu-item:not(.next-disabled).next-selected:focus:hover .next-menu-icon-selected,.next-menu-item:not(.next-disabled).next-selected:hover .next-menu-icon-selected,.next-menu-item:not(.next-disabled):hover .next-menu-icon-selected{color:#00c1de;}\
		.next-menu .next-menu-icon-selected.next-icon{margin-left:-16px;}\
		.next-cascader{border:1px solid #f5f5f6;}\
		.next-cascader-menu-wrapper+.next-cascader-menu-wrapper{border-left:1px solid #f5f5f6;}\
		.next-cascader-menu-item.next-expanded{color:#373d41;background-color:#ebecec;}\
		.next-cascader-menu-icon-right,.next-cascader-menu-icon-right:hover{color:#9b9ea0;}\
		.next-cascader-menu-icon-expand.next-icon:before{width:8px;font-size:8px;line-height:inherit;}\
		@media (-webkit-min-device-pixel-ratio:0) and (min-resolution:0.001dpcm){\
		.next-cascader-menu-icon-expand.next-icon{-webkit-transform:scale(.5);-ms-transform:scale(.5);transform:scale(.5);margin-left:-4px;margin-right:-4px;}\
		.next-cascader-menu-icon-expand.next-icon:before{width:16px;font-size:16px;}\
		}\
		.next-cascader-menu-item.next-expanded .next-cascader-menu-icon-right{color:#9b9ea0;}\
		.next-cascader-select-dropdown{border:1px solid #ebecec;-webkit-box-shadow:none;box-shadow:none;}\
		.next-overlay-inner,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;}\
		.next-overlay-inner ul{list-style:none;margin:0;padding:0;}\
		.next-overlay-inner li{margin-left:0;}\
		.next-overlay-wrapper .next-overlay-inner{z-index:1001;}\
		.next-icon{display:inline-block;font-family:NextIcon;font-style:normal;font-weight:400;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}\
		.next-icon:before{display:inline-block;vertical-align:middle;text-align:center;}\
		.next-icon-arrow-right:before{content:"\\E67E";}\
		.next-icon-select:before{content:"\\E687";}\
		.next-icon.next-medium:before{width:20px;font-size:20px;line-height:inherit;}\
		.next-menu{position:relative;min-width:100px;padding:8px 0;margin:0;list-style:none;border:1px solid #ebebeb;border-radius:0;-webkit-box-shadow:2px 2px 8px 0 rgba(0,0,0,.13);box-shadow:2px 2px 8px 0 rgba(0,0,0,.13);background:#fff;line-height:32px;font-size:12px;}\
		.next-menu,.next-menu *,.next-menu :after,.next-menu :before{-webkit-box-sizing:border-box;box-sizing:border-box;}\
		.next-menu:focus,.next-menu :focus{outline:0;}\
		.next-menu-item{position:relative;padding:0 16px;-webkit-transition:background .2s ease;transition:background .2s ease;color:#333;cursor:pointer;}\
		.next-menu-item.next-selected{color:#111;background-color:#f3faff;}\
		.next-menu-item.next-selected .next-menu-icon-selected{color:#0070cc;}\
		.next-menu-item:not(.next-disabled).next-selected:focus,.next-menu-item:not(.next-disabled).next-selected:focus:hover,.next-menu-item:not(.next-disabled).next-selected:hover,.next-menu-item:not(.next-disabled):hover{color:#333;background-color:#ebebeb;}\
		.next-menu-item:not(.next-disabled).next-selected:focus .next-menu-icon-selected,.next-menu-item:not(.next-disabled).next-selected:focus:hover .next-menu-icon-selected,.next-menu-item:not(.next-disabled).next-selected:hover .next-menu-icon-selected,.next-menu-item:not(.next-disabled):hover .next-menu-icon-selected{color:#0070cc;}\
		.next-disabled{color:#aaa}\
		.next-menu-item-inner{height:32px;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;}\
		.next-menu-item-text{vertical-align:middle;}\
		.next-menu .next-menu-icon-selected.next-icon{margin-left:-14px;}\
		.next-menu .next-menu-icon-selected.next-icon:before{width:12px;font-size:12px;line-height:inherit;}\
		.next-cascader{display:inline-block;overflow:auto;border:1px solid #dedede;border-radius:0;}\
		.next-cascader,.next-cascader *,.next-cascader :after,.next-cascader :before{-webkit-box-sizing:border-box;box-sizing:border-box;}\
		.next-cascader-inner:after{visibility:hidden;display:block;height:0;font-size:0;content:" ";clear:both;}\
		.next-cascader-menu-wrapper{float:left;overflow:auto;width:100px;height:192px;overflow-x:hidden;overflow-y:auto;}\
		.next-cascader-menu-wrapper+.next-cascader-menu-wrapper{border-left:1px solid #dedede;}\
		.next-cascader-menu{position:relative;padding:0;border:none;border-radius:0;-webkit-box-shadow:none;box-shadow:none;min-width:auto;min-height:100%;}\
		.next-cascader-menu-item.next-expanded{color:#333;background-color:#f7f7f7;}\
		.next-cascader-menu-icon-right{position:absolute;top:0;right:10px;color:#888;}\
		.next-cascader-menu-icon-right:hover{color:#555;}\
		.next-cascader-menu-icon-expand.next-icon:before{width:12px;font-size:12px;line-height:inherit;}\
		.next-cascader-menu-item.next-expanded .next-cascader-menu-icon-right{color:#555;}\
		.next-cascader-select-dropdown{-webkit-box-sizing:border-box;box-sizing:border-box;}\
		.next-cascader-select-dropdown{border:1px solid #ebebeb;border-radius:0;-webkit-box-shadow:2px 2px 8px 0 rgba(0,0,0,.13);box-shadow:2px 2px 8px 0 rgba(0,0,0,.13);}\
		.next-cascader-select-dropdown *,.next-cascader-select-dropdown :after,.next-cascader-select-dropdown :before{-webkit-box-sizing:border-box;box-sizing:border-box;}\
		.next-cascader-select-dropdown .next-cascader{display:block;border:none;-webkit-box-shadow:none;box-shadow:none;}\
		.next-menu .next-menu-icon-selected.next-icon{position:absolute;top:0;right:8px;margin-left:0;}\
		@font-face{font-family:NextIcon;src:url(//at.alicdn.com/t/font_632247_qjjfl3epbqo.eot);src:url(//at.alicdn.com/t/font_632247_qjjfl3epbqo.eot#iefix) format("embedded-opentype"),url(//at.alicdn.com/t/font_632247_qjjfl3epbqo.woff) format("woff"),url(//at.alicdn.com/t/font_632247_qjjfl3epbqo.ttf) format("truetype"),url(//at.alicdn.com/t/font_632247_qjjfl3epbqo.svg#NextIcon) format("svg");}\
		@font-face{font-family:NextIcon;src:url(//at.alicdn.com/t/font_1146799_gorohruuo2m.eot);src:url(//at.alicdn.com/t/font_1146799_gorohruuo2m.eot#iefix) format("embedded-opentype"),url(//at.alicdn.com/t/font_1146799_gorohruuo2m.woff) format("woff"),url(//at.alicdn.com/t/font_1146799_gorohruuo2m.ttf) format("truetype"),url(//at.alicdn.com/t/font_1146799_gorohruuo2m.svg#NextIcon) format("svg");}</style>';

		if($("#cas_css").length <= 0)
		{
			$('head').append(t.css);
		}

		t.ul = '{{# var lists = d.all;for(var i = 0;i<d.level;i++){var divIndex =[];for(var j=1;j<=i;j++){divIndex.push(d.values[j-1])};if(i>0){lists = lists[d.values[i-1]].sons;};if(d.plc && typeof d.plc[i] != "undefined" && d.plc[i]){if(!lists[0] || lists[0].name != d.plc[i]){lists.unshift({id:d.plc[i],name:d.plc[i],sons:[]});};} }}\
					<div class="next-cascader-menu-wrapper " style="width: 132px;">\
						<ul role="listbox" class="next-menu next-ver next-cascader-menu">\
							{{# lists.forEach(function(item,index){var nowIndex = divIndex.concat(index); }}\
							<li title="{{item.name}}" data-index="{{nowIndex}}" class="{{d.enable[i] && layui.$.inArray(item.name,d.enable[i]) == -1?\'next-disabled\':\'\'}} next-menu-item next-cascader-menu-item {{item.sons && index == d.values[i]?"next-expanded":""}} {{index == d.values[i] && (d.level == nowIndex.length ||!item.sons)?"next-selected":""}}">\
							<div class="next-menu-item-inner">\
								<i class="{{index == d.values[i] && (d.level == nowIndex.length ||!item.sons)?"":"layui-hide"}} next-icon next-icon-select next-medium next-menu-icon-selected"></i>\
								<span class="next-menu-item-text">{{item.name}}<i class="{{item.sons && item.sons.length > 0 && d.level > nowIndex.length?"":"layui-hide"}} next-icon next-icon-arrow-right next-medium next-cascader-menu-icon-right next-cascader-menu-icon-expand"></i></span>\
							</div>\
							</li>\
							{{# }); }}\
						</ul>\
					</div>\
				{{# } }}';
		t.tpl = '<div class="next-overlay-inner next-select-popup-wrap {{d.isInit?"":"layui-anim layui-anim-upbit"}}" aria-hidden="false" style="position: absolute;top:42px;z-index:9999">\
					<div class="next-cascader-select-dropdown">\
						<div class="next-cascader">\
							<div class="next-cascader-inner">'+t.ul+'</div>\
						</div>\
					</div>\
				</div>';
		
	};
	cas.prototype.getValues = function()
	{
		var t = this;
		var now_selected = [];
		t.config.values = [];
		var plc = t.config.columns_placeholder;
		if(!t.config.value)
		{
			//获取初始值的时候需要检测是否有设定 可用值，如果有的话 初始值需要在设定值中
			for(var i=1;i<t.config.level;i++)
			{
				if(!t.config.enable)
				{
					if(i == 1)
					{
						if(plc)
						{
							t.config.values.push(14);//默认设置14
						}else
						{
							t.config.values.push(13);//默认设置14
						}
						
					}else
					{
						t.config.values.push(0);
					}
				}
				
			}
			if(t.config.enable)
			{
				//读取已设定的可用值
				for(var ii in t.datas){
					if(t.datas[ii].name == t.config.enable[0][0])
					{
						t.config.values.push(ii);
						for(var j in t.datas[ii].sons)
						{
							if(layui.$.inArray(t.datas[ii].sons[j].name,t.config.enable[1]) != -1)
							{
								t.config.values.push(j);
								for(var x in t.datas[ii].sons[j].sons)
								{
									if(typeof t.config.enable[2] != 'undefined' && layui.$.inArray(t.datas[ii].sons[j].sons[x].name,t.config.enable[2]) != -1)
									{
										t.config.values.push(x);
										break;
									}
								}
								break;
							}
							
						}
						break;
					}
					
				}
			}
		}else
		{
			
			if(t.config.value)
			{
				now_selected = t.config.value.split(' / ');
				//console.log(now_selected);
				
				for(var i in t.datas){
					if(t.datas[i].name == now_selected[0])
					{
						if(plc && plc[0] && !t.isInit)
						{
							t.config.values.push(parseInt(i)+1);
						}else
						{
							t.config.values.push(i);
						}
						
						for(var j in t.datas[i].sons)
						{
							if(t.datas[i].sons[j].name == now_selected[1])
							{
								if(plc && plc[1] && !t.isInit)
								{
									t.config.values.push(parseInt(j)+1);
								}else
								{
									t.config.values.push(j);
								}
								//t.config.values.push(j);
								for(var x in t.datas[i].sons[j].sons)
								{
									if(t.datas[i].sons[j].sons[x].name == now_selected[2])
									{
										if(plc && plc[2] && !t.isInit)
										{
											t.config.values.push(parseInt(x)+1);
										}else
										{
											t.config.values.push(x);
										}
										//t.config.values.push(x);
										break;
									}
								}
								break;
							}
							
						}
						break;
					}
					
				}
				for(var i=0;i<t.config.level;i++)
				{
					if(typeof t.config.values[i] == 'undefined')
					{
						t.config.values[i] = 0;
					}
					
				}
			}
			
		}
		
		console.log(t.config.values);
	}
	
	cas.prototype.render = function()
	{
		var t = this;
		var ele = this.ele;
		var id = Math.floor(Math.random()*(99999-10000+1)+10000);
		var required = $(ele).data('required') == 1?'lay-verify="required"':'';
		var enable = $(ele).data('enable');
		var columns_placeholder = sa.getValue($(ele).data('columns_placeholder'));

		enable = typeof enable != 'undefined'?JSON.stringify(enable):'';
		var h = '<div class="layui-unselect layui-form-select">\
					<div id="'+id+'" class="layui-select-title" data-columns_placeholder=\''+columns_placeholder+'\' data-enable=\''+enable+'\' data-level="'+$(ele).data('level')+'">\
						<input '+required+' type="text" name="'+$(ele).attr('name')+'" placeholder="'+$(ele).attr('placeholder')+'" value="'+$(ele).val()+'" readonly="" class="layui-input layui-unselect"><i class="layui-edge"></i>\
					</div><div class="cas_con"></div>\
				</div>';
		$(ele).parent().html(h);
		

		$('#'+id).click(function(e){
			e.stopPropagation();
			$('.cas_con').html('');//清空所有
			var input = $(this).find('input');
			if($(this).parent().find('.cas_con').html())
			{
				return;
			}
			t.config.level = $(this).data('level');
			t.config.enable = $(this).data('enable');
			t.config.columns_placeholder = $(this).data('columns_placeholder');//每列的第一个默认数据 

			if(t.config.columns_placeholder)
			{
				t.config.columns_placeholder = t.config.columns_placeholder.split(',');
			}else
			{
				t.config.columns_placeholder = false;
			}
			//console.log(t.config.columns_placeholder);
			t.contain = $(this).next('.cas_con');
			t.config.value = input.val();
			t.getValues();
			
			t.config.callback = function(res){
				input.val(res);
			}
			if($(this).next('.cas_con').html())
			{
				//console.log('has');
				t.isInit = true;
			}else
			{
				//console.log('no');
				t.isInit = false;
			}
			t.init();
		});

		
	}


	cas.prototype.init = function()
	{
		var t = this;
		var param = {
			all:t.datas,
			values:t.config.values,
			level:t.config.level,
			isInit:t.isInit,
			enable:t.config.enable,
			plc:t.config.columns_placeholder
		};
		tpl(t.tpl).render(param,function(html){
			t.contain.html(html);
			t.config.values.forEach(function(v,i){
				v = parseInt(v);
				var topValue = 0;
				
				if(typeof t.scrollTop[i] != 'undefined')
				{
					if(t.scrollTop[i]%32 != 0)
					{
						t.scrollTop[i] = parseInt(t.scrollTop[i]/32)*32;
					}
				}
				
				if(v > 3)
				{
					var topValue = typeof t.scrollTop[i] != 'undefined'?t.scrollTop[i]:32*(v-2);	
				}else if(typeof t.scrollTop[i] != 'undefined')
				{
					topValue = t.scrollTop[i];
				}
				
				t.contain.find('.next-cascader-menu-wrapper:eq('+i+')').animate({scrollTop:topValue},0);
			})
			t.bindEvents();
			t.isInit = true;
		});
		$(document).click(function(e){
			$('.cas_con').html('');
		});
	}
	cas.prototype.bindEvents = function(){
		var t = this;
		$(".next-overlay-inner li[data-index]").unbind('click').click(function(evt){
			if($(this).hasClass('next-disabled'))
			{
				evt.stopPropagation();
				return;
			}
			var index = ($(this).data('index')+'').split(',');
			//检测点击li是中级还是有子集，有子集则重新render一遍，没有子集那么回调返回选择结果
			var item = t.datas[index[0]];
			var value = [item.name];
			t.scrollTop[index.length-1] = $(this).parent().parent().scrollTop();
			index.forEach(function(v,i){
				if(i > 0 && item.sons)
				{
					item = item.sons[v];
					value.push(item.name);
				}
			});
			//console.log(index);
			
			if(item.sons && t.config.level > index.length)
			{
				//检测点击的值和当前值是否一致 是的话不做操作
				//console.log(t.config.values[index.length-1]);
				//console.log(index[index.length-1]);
				if(t.config.values[index.length-1] == index[index.length-1])
				{
					evt.stopPropagation();
					return;
				}
				
				//检测点击的是第几列 追加补0
				var index_length = t.config.level - index.length;
				for(var i=0;i<index_length-1;i++)
				{
					index.push(0);
				}
				//如果有子集 那么重新渲染
				t.config.values = index;
				t.init();
			}else
			{
				//回调
				$(this).addClass('next-selected');
				$(this).find('.next-menu-icon-selected').removeClass('layui-hide');
				t.contain.html('');
				t.config.callback(value.join(' / '));
			}
			evt.stopPropagation();
		});
		$(".next-overlay-inner ul").unbind('click').click(function(evt){evt.stopPropagation();});
	}
	exports('cas', function(opt){
		var _this = new cas(opt);
		_this.render();
		return cas;
	});
});