//  菜单显示异常修改tinymce/skins/ui/oxide/skin.min.css:96 .tox-silver-sink的z-index值
//  http://tinymce.ax-z.cn/   中文文档

layui.define(['jquery'],function (exports) {
    var $ = layui.$

    var modFile = layui.cache.modules['tinymce'];
	

    var modPath = modFile.substr(0, modFile.lastIndexOf('.'))

    var setter = layui.env || {}//兼容layuiadmin

    var response = setter.response || {}//兼容layuiadmin

    //  ----------------  以上代码无需修改  ----------------

    var settings = {
        base_url: modPath
        , images_upload_url: 'uploader/index'//图片上传接口，可在option传入，也可在这里修改，option的值优先 这里使用layui的amdin.req
        , language: 'zh_CN'//语言，可在option传入，也可在这里修改，option的值优先
        , response: {//后台返回数据格式设置
            statusName: response.statusName || 'code'//返回状态字段
            , msgName: response.msgName || 'msg'//返回消息字段
            , dataName: response.dataName || 'data'//返回的数据
            , statusCode: response.statusCode || {
                ok: 0//数据正常
            }
        }
        , success: function (res, succFun, failFun) {//图片上传完成回调 根据自己需要修改
            if (res[this.response.statusName] == this.response.statusCode.ok) {
                succFun(res[this.response.dataName]['src']);
            } else {
                failFun(res[this.response.msgName]);
            }
        }
    };

    //  ----------------  以下代码无需修改  ----------------

    var t = {};

    //初始化
    t.render = function (option,callback) {

        var sa = layui.sa || {}
		option.convert_urls = false;
        option.base_url = isset(option.base_url) ? option.base_url : settings.base_url

        option.language = isset(option.language) ? option.language : settings.language

        option.selector = isset(option.selector) ? option.selector : option.elem

        option.quickbars_selection_toolbar = isset(option.quickbars_selection_toolbar) ? option.quickbars_selection_toolbar : 'cut copy | bold italic underline strikethrough '

        option.plugins = isset(option.plugins) ? option.plugins : 'code image axupimgs quickbars print preview searchreplace autolink fullscreen image link media codesample table charmap hr advlist lists wordcount imagetools indent2em';

        option.toolbar = isset(option.toolbar) ? option.toolbar : 'code axupimgs | fontselect | forecolor backcolor bold italic underline | indent2em alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | fontsizeselect';

        option.resize = isset(option.resize) ? option.resize : false;

        option.elementpath = isset(option.elementpath) ? option.elementpath : false;

        option.branding = isset(option.branding) ? option.branding : false;

        option.contextmenu_never_use_native = isset(option.contextmenu_never_use_native) ? option.contextmenu_never_use_native : true;

        option.menubar = isset(option.menubar) ? option.menubar : 'file edit insert format table';

		option.font_formats = "微软雅黑;黑体;宋体";
		
		option.fontsize_formats = "8px 10px 12px 14px 18px 24px 36px";

        option.images_upload_url = isset(option.images_upload_url) ? option.images_upload_url : settings.images_upload_url;
	
        option.images_upload_handler = isset(option.images_upload_handler) ? option.images_upload_handler : function (blobInfo, succFun, failFun) {

            var formData = new FormData();

            formData.append('target', 'edit');

            formData.append('file', blobInfo.blob());

            var ajaxOpt = {

                url: option.images_upload_url,

                dataType: 'json',

                type: 'POST',

                data: formData,

                processData: false,

                contentType: false,

                success: function (res) {

                    settings.success(res, succFun, failFun)

                },
                error: function (res) {

                    failFun("网络错误：" + res.status);

                }
            };

            if (typeof sa.request == 'function') {
				console.log('系统request');
                sa.request(ajaxOpt);

            } else {

                $.ajax(ajaxOpt);

            }
        }

        option.menu = isset(option.menu) ? option.menu : {
            file: {title: '文件', items: 'newdocument | print preview fullscreen | wordcount'},
            edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext selectall | searchreplace'},
            format: {
                title: '格式',
                items: 'bold italic underline strikethrough superscript subscript | formats | forecolor backcolor | removeformat'
            },
            table: {title: '表格', items: 'inserttable tableprops deletetable | cell row column'},
        };
        if(typeof tinymce == 'undefined'){

            $.ajax({//获取插件
                url: option.base_url + '/tinymce.js',

                dataType: 'script',

                cache: true,

                async: false,
            });

        }

        layui.sessionData('layui-tinymce',{

            key:option.selector,

            value:option

        })
		//修改内容后自动 赋值到form中的textarea
		option.setup = function (editor) {
			editor.on('change', function (e) {
				editor.save();
			});
		}
		
		//自动检测重载 如果已实例化后先摧毁
		var edit = t.get(option.elem);

        if(edit)
		{
			edit.destroy();
		}

        
		
        tinymce.init(option);

        if(typeof callback == 'function'){

            callback.call(option)

        }

        return tinymce.activeEditor;
    };

    t.init = t.render

    // 获取ID对应的编辑器对象
    t.get = function (elem) {

        if(elem && /^#|\./.test(elem)){

            var id = elem.substr(1)

            var edit = tinymce.editors[id];

            if(!edit){

                return false;

            }

            return edit

        } else {

            return false;

        }
    }

    //重载
    t.reload = function (option,callback) {
        option = option || {}

        var edit = t.get(option.elem);

        var optionCache = layui.sessionData('layui-tinymce')[option.elem]

        edit.destroy()

        $.extend(optionCache,option)

        tinymce.init(optionCache)

        if(typeof callback == 'function'){

            callback.call(optionCache)

        }

        return tinymce.activeEditor;
    }

    function isset(value){
        return typeof value != 'undefined' && value != null
    }

    exports('tinymce', t);
});
