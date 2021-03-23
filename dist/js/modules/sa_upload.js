layui.define(["env","upload"], function(exports) {
	var env = layui.env;
	var $ = layui.$,sa = layui.sa;
	
	var r = {};
	
	r.importExcel = (elem,url,callback)=>{
		
		layui.upload.render({
			elem: elem
			,accept:'file'
			,headers:{
				'Authorization':'Bearer '+sa.getAccessToken()
			}
			,acceptMime:'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			,field:'file'
			,url:env.request_host+url
			,before:function(){
				_msg = layui.layer.msg('文件上传中', {
					icon: 16
					,shade: 0.01
					,time:-1
				});
			}
			,done: function(res, index, upload){
				layui.layer.close(_msg);
				if(!res.code)
				{
					layui.layer.msg('导入成功');
					if(typeof callback == "function")
					{
						callback(res);
					}
				}
			}
		});
	}
	
	
	
	exports('sa_upload',r);
});