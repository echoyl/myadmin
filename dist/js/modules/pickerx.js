;layui.define(['laytpl', 'form','jquery'], function(exports) {
	var $ = layui.$,form = layui.form,tpl = layui.laytpl;
	var Pickerx = function(opt){
		this.id = opt.id;
		if(typeof opt.field === 'undefined')
		{
			
			this.field = {value:'id',name:'name',sons:'sons'};
		}else
		{
			this.field = {
				value:opt.field.value?opt.field.value:'id',
				name:opt.field.name?opt.field.name:'name',
				sons:opt.field.sons?opt.field.sons:'sons',
			};
		}
		
		this.placeholder = opt.placeholder;
		this.datas = opt.datas?opt.datas:[];	

		//console.log(this.datas);
		this.isinit = false;
		this.level = 3;//设定层级为3级
		this.selectname = opt.selectname;
		this.callback = opt.callback;
		this.required = opt.required;
		//初始化选中值
		if(opt.selected)
		{
			this.svalue = opt.selected;
		}else
		{
			this.svalue = [];
			for(var i=0;i<this.level;i++)
			{
				this.svalue.push('');
			}
		}
		//初始化selectname  倒序追加
	}
	Pickerx.prototype.render = function(){
		//读取初始化数据
		if(this.datas.length <= 0){
			console.error('pickx hint：缺少分类数据');
			return false;
		}
		var t = this;
		
		if(typeof t.placeholder == 'undefined')
		{
			t.placeholder = ['请选择'];
		}
		var ran_id = Math.floor(Math.random()*(99999-10000+1)+10000);
		var filter_name = 'pickekx_filter_'+ran_id;
		var now_data = [];
		var value = this.svalue;
		var datas = [].concat(t.datas);
		for(var l=0;l<t.level;l++)
		{
			var value_index = -1;
			if(!t.placeholder[l])
			{
				t.placeholder[l] = t.placeholder[0];//没有数据的话设置为第一个
			}
			
			var plc = {id:''};
			plc[t.field.name] = t.placeholder[l];
			datas.unshift(plc);
			
			var level_data = [];
			if(datas.length < 1)
			{
				break;
			}
			for(var i in datas)
			{
				var item = datas[i];
				
				level_data.push({
						id:item.id == ''?'':item[t.field.value],
						name:item[t.field.name],
						index:i,
						selected:value[l] == item[t.field.value] ? 1:0
					});
				
				if(value[l] == item[t.field.value])
				{
					value_index = i;;
				}
			}
			if(value_index < 0)
			{
				value_index = 0;
			}
			now_data.push(level_data);
			t.svalue[l] = datas[value_index][t.field.value];//重新设值
			if(datas[value_index] && datas[value_index][t.field.sons])
			{
				datas = [].concat(datas[value_index][t.field.sons]);
			}else
			{
				datas = [];
			}
		}
		var select_tpl = '{{# for(var i in d.data){var item = d.data[i]; }}\
				{{# if(item.length > 1){ }}\
				<div class="layui-input-inline picker_select_div" style="width:160px;{{# if((parseInt(i)+1) == d.data.length){ }}margin-right:0;{{# } }}">\
					<select {{# if(d.required == 1){ }}lay-verify="required"{{# } }} {{# if(d.selectname && d.selectname[i]){ }}name="{{d.selectname[i]}}"{{# } }} data-index="{{i}}" lay-filter="{{d.filter_name}}_{{i}}">\
						{{# for(var j in item){var op=item[j]; }}\
							<option data-index="{{j}}" value="{{op.id}}" {{# if(op.selected){ }}selected{{# } }}>{{op.name}}</option>\
						{{# } }}\
					</select>\
				</div>\
				{{# } }}\
				{{# } }}';
		//console.log(tpl);
		t.isinit = true;
		//console.log(now_data);
		//动态调整select的name属性，从后往前的原则，即如果select项不足的话从前面删除selectname
		var select_length = 0;
		now_data.forEach(function(v,i){
			var has_selected = false;
			v.forEach(function(v_value){
				if(v_value.selected == 1 && v_value.id)
				{
					has_selected = true;
				}
			});
			if(has_selected && v.length > 1)
			{
				select_length++;
			}
		});
		//console.log(select_length);
		var selectname = t.selectname.concat();
		//console.log(selectname);
		//从前面清除数据 这个是name多余实际列数的情况
		if(select_length == 0 && selectname.length == 1)
		{
			//等于 是默认进来啥都没选的情况 设定selectname = [1个]
			//selectname = 
		}else
		{
			while(selectname.length > select_length + 1)
			{
				selectname.shift();
			}
		}
		
		
		var new_selectname = [];
		if(selectname.length < select_length)
		{
			//这个是name小于实际列数的情况
			var s_how_many = select_length - selectname.length;
			for(var sl_i=0;sl_i<s_how_many;sl_i++)
			{
				selectname.push('');
			}
			selectname = selectname.reverse();
		}
		

		//console.log(select_length);
		tpl(select_tpl).render({data:now_data,filter_name:filter_name,selectname:selectname,required:t.required},function(html){
			$(t.id).html(html);
			//添加联动事件
			var level = now_data.length - 1;
			//console.log(level);
			//数据长度为本次 层级
			if(level >= 0)
			{
				//大于1时需要联动事件
				for(var i=0;i<=level;i++)
				{
					var filter = filter_name+'_'+i;
					form.on('select(' + filter + ')', function(data) {
                        //全部重新渲染select html
						//console.log($(data.elem).find("option:selected").data('index'));
						var select_index = $(data.elem).data('index');
						//var select_value = parseInt($(data.elem).find("option:selected").data('index'));
						for(var x in t.svalue)
						{
							if(x == select_index)
							{
								t.svalue[x] = data.value;
							}
							if(x > select_index)
							{
								//默认选中第一个值
								t.svalue[x] = '';
							}
						}
						//返回值
						t.render();
                    });
				}
			}
		});
		//回调
		if(typeof t.callback !== 'undefined')
		{
			t.callback(t.svalue);
		}
		//$("#ppca").html(tpl);
		form.render('select');
		
	};
	exports('pickerx', function(opt){
		var _this = new Pickerx(opt);
		_this.render();
		return _this;
	});
});