layui.define(['sa'],function(exports) {
	var $ = layui.$,sa = layui.sa;
	
	var r = {name:'sa_attachment'};
	
	r.render = function(par,cb){
		sa.open({
			data:{
				limit:par.limit,
				isMultiple:par.isMultiple,
				isfile:par.isfile,
				name:par.name
			},
			area:['820px','734px'],
			url:'system/attachment',
			title:par.isfile?'文件管理':'图片管理',
			callback:function(res){
				if(typeof cb == 'function')
				{
					cb(res);
				}
			}
		});
	}
	exports(r.name, r);
})