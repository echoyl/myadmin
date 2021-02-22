# myadmin

这个主要是一个js+html的后台管理 接口模式使用api的 可以使用不同的后台框架
已经有一个项目使用的是laravel，详见 https://github.com/echoyl/pro 项目

# 使用方法
clone到本地后部署到 localhost中访问。


# 使用线上模式
将 dist/js/env.js 中的 is_local去除后设置为false即可以使用数据线上模式调用
修改后需要自行实现接口api获取数据
