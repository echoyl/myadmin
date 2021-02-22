/*
* @Author: layui-2
* @Date:   2018-08-31 11:40:42
* @Last Modified by:   layui-2
* @Last Modified time: 2018-09-04 14:44:38
*/
layui.define(['jquery','layer'],function(exports){
  "use strict";
  var $ = layui.jquery,layer = layui.layer
  

  //外部接口
  ,inputTags = {
    config: {}

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }

    // 事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback)
    }
    
  }

   //操作当前实例
  ,thisinputTags = function(){
    var that = this
    ,options = that.config;

    return {
      config: options
    }
  }

  //字符常量
  ,MOD_NAME = 'inputTags'


  // 构造器
  ,Class = function(options){
    var that = this;
    that.config = $.extend({}, that.config, inputTags.config, options);
    that.render();
  };

   //默认配置
  Class.prototype.config = {
    close: false  //默认:不开启关闭按钮
    ,theme: ''   //背景:颜色
    ,content: [] //默认标签
    ,aldaBtn: false //默认配置
	,source:[]
  };

  // 初始化
  Class.prototype.init = function(){
    var that = this
    ,spans = ''
    ,options = that.config;
    $.each(options.content,function(index,item){
      spans +='<span><em>'+item+'</em><button type="button" class="close">×</button></span>';
      // $('<div class="layui-flow-more"><a href="javascript:;">'+ ELEM_TEXT +'</a></div>');
    })
    options.elem.before(spans);
	that.source();
	//console.log(options.source);
    that.events()
  }
	Class.prototype.source = function()
	{
		var that = this
		,options = that.config;
		if(typeof $(options.elem).data('source') != 'undefined' && $(options.elem).data('source'))
		{
			options.source = $(options.elem).data('source').split(',');
		}
		
		if(options.source.length > 0)
		{
			var source_html = '<div class="layui-input-inline" style="margin-top:6px;">';
			options.source.forEach(item=>{
				if(options.content.indexOf(item) == -1){
					source_html += '<a href="javascript:;" style="margin:2px;" class="layui-btn layui-btn-sm layui-btn-normal input_source_tag">'+item+'</a>';
				}
			});
			source_html += '</div>';
		}
		if($(options.elem).parent().next())
		{
			$(options.elem).parent().next().remove();
		}
		$(options.elem).parent().after(source_html);
		that.events()
	}

  Class.prototype.render = function(){
    var that = this
    ,options = that.config
    options.elem = $(options.elem);
    that.enter()
  };

  // 回车生成标签
  Class.prototype.enter = function(){
    var that = this
    ,options = that.config;
    //options.elem.focus();
	//console.log('input tag enter');
    options.elem.keypress(function(event){  
		//console.log(event);
      var keynum = (event.keyCode ? event.keyCode : event.which);  
      if(keynum == '13'){  
        var $val = options.elem.val().trim();
        that.addOne($val);
		return false;
      }   
    })
  };
	Class.prototype.addOne = function($val)
	{
		var that = this,spans = '';
		var options = that.config;
		//var $val = options.elem.val().trim();
        if(!$val) return false;
        if(options.content.indexOf($val) == -1){
          options.content.push($val)
          that.render();
		  that.source();
          spans ='<span><em>'+$val+'</em><button type="button" class="close">×</button></span>';
          options.elem.before(spans);
        }
		
        options.done && typeof options.done === 'function' && options.done($val,options.content);
        options.elem.val('');
	}
  //事件处理
  Class.prototype.events = function(){
     var that = this
    ,options = that.config;
    $(options.elem).parent().unbind('click').on('click','.close',function(){
      var Thisremov = $(this).parent('span').remove(),
      ThisText = $(Thisremov).find('em').text();
		if($.inArray(ThisText,options.content) > -1)
		{
			options.content.splice($.inArray(ThisText,options.content),1);
		}
		options.done && typeof options.done === 'function' && options.done(ThisText,options.content);
		that.source();
    });
	$(options.elem).parent().next().unbind('click').on('click','.input_source_tag',function(){
		var text = $(this).html();
		that.addOne(text);
    });
	
  };


  //核心入口
  inputTags.render = function(options){
    var inst = new Class(options);
    inst.init();
    return thisinputTags.call(inst);
  };
  exports('inputTags',inputTags);
}).link('./dist/js/modules/inputTags/inputTags.css?a=2')