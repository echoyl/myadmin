//单列选择渲染
layui.extend({
	clipboardJS:"js/modules/clipboard",
}).define(['layer','clipboardJS'],function(exports) {
	
	var $ = layui.$,layer = layui.layer,clipboardJS = layui.clipboardJS;

	var r = {
		isinit:false
	};
	
	var tpl = '';
	
	r.init = function(){
		if(r.isinit)
		{
			return;
		}
		var clipboard = new clipboardJS('.clipboard', {
			text: function(trigger) {
				return trigger.getAttribute('data-text');
			}
		});
		clipboard.on('success',function(){
			layer.msg('复制成功');
			
		});
		r.isinit = true;
	}
	
	//return;
	exports("clipboard_r", r);
});