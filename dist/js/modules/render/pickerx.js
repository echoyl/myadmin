layui.extend({
	pickerx: "js/modules/pickerx",
}).define(['pickerx','sa'], function(exports) {
	
	
	
	var $ = layui.$,sa = layui.sa;
	
	var r = {};
	
	r.init = function(){
		//console.log('pickerx数量：'+$(".pickerx").length);
		function getParent(data2, nodeId2,children) {
			var arrRes = [];
			if (data2.length == 0) {
				if (!!nodeId2) {
					arrRes.unshift(data2.id)
				}
				return arrRes;
			}
			let rev = (data, nodeId) => {
				for (var i = 0, length = data.length; i < length; i++) {
					let node = data[i];
					if (node.id == nodeId) {
						arrRes.unshift(node.id)
						rev(data2, node.parent_id);
						break;
					}
					else {
						if (!!node[children]) {
							rev(node[children], nodeId);
						}
					}
				}
				return arrRes;
			};
			arrRes = rev(data2, nodeId2);
			return arrRes;
		}
		
		$(".pickerx").each(function(){
			//console.log('执行pickerx渲染');
			var field = $(this).data('field');//console.log(field);
			if(typeof field == 'undefined' || field == 'undefined')
			{
				field = {value:'id',name:'name','sons':'children'};
			}else
			{
				//field = JSON.stringify(field);
			}
			var id = layui.sa.random();
			$(this).attr('id',id);
			var selectname = ($(this).data('name')+'').split(',');
			
			var placeholderValue = sa.getValue($(this).data('placeholder'));
			
			if(placeholderValue)
			{
				var placeholder = ($(this).data('placeholder')+'').split(',');
			}else
			{
				var placeholder = ['请选择'];
			}
			//console.log("开始记录placeholder");
			//console.log(placeholder);
			var datas = $(this).data('list');
			
			if($(this).data('value'))
			{
				var valueStr = $(this).data('value')+'';
				if(valueStr.indexOf(',') > -1)
				{
					var value = valueStr.split(',');
				}else
				{
					var value = getParent(datas,valueStr,field.sons);
					//console.log(value);
				}
				
				//在这里我们直接根据最后一个值向前反推计算出前面选中值
				//console.log(datas);
				
				
			}else
			{
				var value = ['','',''];
			}
			
			
			//console.log(value);
			//layui.pca.init("#province_"+id,"#city_"+id,'#area_'+id,value[0],value[1],value[2]);
			//console.log('picker');
			layui.pickerx({
				selected:value,
				field:field,
				placeholder:placeholder,
				id:'#'+id,
				required:$(this).data('required'),
				datas:$(this).data('list'),
				selectname:selectname,
				callback:function(data){
					//console.log(data);
				}
			});
			$(this).removeClass('pickerx');
			
		});
	}
	
	//return;
	exports("pickerx_r", r);
});