layui.define(['jquery','laytpl','env','sa'], function (exports) {
    var $ = layui.$,tpl = layui.laytpl,env = layui.env,sa = layui.sa;
	var cas = function(ele){
		var t = this;
		t.datas = sa.local.get('cas');;
		
		if(!t.datas)
		{
			//数据修改了ajax同步获取
			$.ajax({
				url: env.base + '/js/modules/cas/cas.json?a=1',
				type:"get",
				dataType: "json",
				data:{},
				async:false,
				success: function(res) {
					console.log(res);
					sa.local.set('cas', res,36000000);
					t.datas = res;
				}
			});
		}
		
		t.ele = ele;
		t.scrollTop = {};
		t.config = {
			//默认参数
			level:3,//省市区级数
			enable:false,//可选项设置
			defaults:["江西"],//没有值时点击展开默认选中的省
			split:' / ',//间隔符
			cb:false//回调函数名 存在 sa.methods中
		};
		t.value = '';//选中的值
		t.isInit = false;
		
		//console.log(t.datas);

		t.ul = '{{# var lists = d.all;var enable_name = ["0"];var enable_join = "_";for(var i = 0;i<d.level;i++){var divIndex =[];for(var j=1;j<=i;j++){divIndex.push(d.values[j-1])};if(i>0){enable_name.push(lists[d.values[i-1]].name);lists = lists[d.values[i-1]].child;}; }}\
					<div class="next-cascader-menu-wrapper" style="width: 132px;">\
						<ul role="listbox" class="next-menu next-ver next-cascader-menu">\
							{{# lists.forEach(function(item,index){var nowIndex = divIndex.concat(index); }}\
							<li title="{{item.name}}" data-index="{{nowIndex}}" class="{{d.enable[enable_name.join(enable_join)] && layui.$.inArray(item.name,d.enable[enable_name.join(enable_join)]) == -1?\'next-disabled\':\'\'}} next-menu-item next-cascader-menu-item {{item.child && index == d.values[i]?"next-expanded":""}} {{index == d.values[i] && (d.level == nowIndex.length ||!item.child)?"next-selected":""}}">\
							<div class="next-menu-item-inner">\
								<i class="{{index == d.values[i] && (d.level == nowIndex.length ||!item.child)?"":"layui-hide"}} next-icon next-icon-select next-medium next-menu-icon-selected"></i>\
								<span class="next-menu-item-text">{{item.name}}<i class="{{item.child && item.child.length > 0 && d.level > nowIndex.length?"":"layui-hide"}} next-icon next-icon-arrow-right next-medium next-cascader-menu-icon-right next-cascader-menu-icon-expand"></i></span>\
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
	
	//通过文字获取index值
	cas.prototype.getIndex = function(data,index,now_selected)
	{
		var t = this;
		for (var i = 0, length = data.length; i < length; i++) {
			if(data[i].name == now_selected[index])
			{
				t.values.push(i);
				index++;
				if(typeof now_selected[index] != 'undefined' && data[i].child)
				{
					//如果还有的话继续
					t.getIndex(data[i].child,index,now_selected);
				}
			}
		}
		return;
	}
	//获取选中值
	cas.prototype.getValues = function()
	{
		var t = this;
		var now_selected = [];
		t.values = [];
		if(t.value)
		{
			now_selected = t.value.split(t.config.split);
		}else
		{
			now_selected = t.config.defaults.concat();
			//初始化 值默认选中第一列
			if(t.config.enable)
			{
				var has = false;
				$.each(t.config.enable,function(ii,v){
					if(v.name == t.config.defaults[0])
					{
						has = true;
						return;
					}
				});
				if(!has)
				{
					now_selected = [t.config.enable[0].name];
				}
			}
		}
		now_selected = t.parseEnable(now_selected);
		t.getIndex(t.datas,0,now_selected);
		//补齐0位
		for(var i=0;i<t.config.level;i++)
		{
			if(typeof t.values[i] == 'undefined')
			{
				t.values[i] = 0;
			}
		}
		return;
	}
	cas.prototype.parseEnable = function(now_selected)
	{
		var t = this;
		if(t.config.enable)
		{
			let has_title = (data,title) => {
				var _title = false;
				$.each(data,function(i,v){
					if(v.name == title && v.child)
					{
						_title = v.child[0].name;
						return;
					}
				});
				return _title;
			}
			for(var i = 0;i<t.config.level;i++)
			{
				if(typeof now_selected[i] == 'undefined')
				{
					if(i == 1)
					{
						var _tit = has_title(t.config.enable,now_selected[0]);
						if(_tit)
						{
							now_selected[i] = _tit;
						}
					}
					if(i == 2)
					{
						$.each(t.config.enable,function(ii,v){
							if(v.name == now_selected[0] && v.child)
							{
								var _tit = has_title(v.child,now_selected[1]);
								if(_tit)
								{
									now_selected[i] = _tit;
								}
							}
						});
					}
				}
			}
		}
		return now_selected;
	}
	cas.prototype.render = function()
	{
		var t = this;
		var ele = this.ele;

		var id = $(ele).attr('id')?$(ele).attr('id'):sa.random('cas_');
		$(ele).attr('id',id);
		$(ele).after('<i class="layui-edge"></i><div class="cas_con"></div>');
		$(ele).parent().addClass('layui-form-select');
		

		$('#'+id).click(function(e){
			e.stopPropagation();
			$('.cas_con').html('');//清空所有
			if($(this).parent().find('.cas_con').html())
			{
				return;
			}
			t.config = $.extend({},t.config,sa.json(sa.getValue($(this).attr('sa_pars'))));
			t.contain = $(this).parent().find('.cas_con');
			t.value = $(this).val();
			t.getValues();//获取初始值
			
			if($(this).parent().find('.cas_con').html())
			{
				t.isInit = true;
			}else
			{
				t.isInit = false;
			}
			t.init();
		});
	}
	
	cas.prototype.formatAble = function()
	{
		var ables = {},t = this;
		if(t.config.enable)
		{
			let rev = (arr,titles) => {
				var key = titles.join('_');
				ables[key]= [];
				$.each(arr,function(i,v){
					ables[key].push(v.name);
					if(v.child)
					{
						var new_titles = titles.concat();
						new_titles.push(v.name);
						rev(v.child,new_titles);
					}
					
				});
			}
			rev(t.config.enable,['0']);
		}
		
		return ables;
	}

	cas.prototype.init = function()
	{
		var t = this;
		var enable = t.formatAble();//格式化 可选项
		var param = {
			all:t.datas,
			values:t.values,
			level:t.config.level,
			isInit:t.isInit,
			enable:enable
		};
		tpl(t.tpl).render(param,function(html){
			t.contain.html(html);
			t.values.forEach(function(v,i){
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
					var topValue = (typeof t.scrollTop[i] != 'undefined' && t.isInit)?t.scrollTop[i]:32*(v-2);
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
				if(i > 0 && item.child)
				{
					item = item.child[v];
					value.push(item.name);
				}
			});
			if(item.child && t.config.level > index.length)
			{
				//检测点击的值和当前值是否一致 是的话不做操作
				if(t.values[index.length-1] == index[index.length-1])
				{
					evt.stopPropagation();
					return;
				}
				t.value = value.join(t.config.split);
				t.getValues();
				t.init();
			}else
			{
				//回调
				$(this).addClass('next-selected');
				$(this).find('.next-menu-icon-selected').removeClass('layui-hide');
				t.contain.html('');
				$(t.ele).val(value.join(t.config.split));
				if(t.config.cb && typeof sa.methods[t.config.cb] == 'function')
				{
					sa.methods[t.config.cb](value);
				}
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
}).link('./dist/js/modules/cas/cas.css?v=2');