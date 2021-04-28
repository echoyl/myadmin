# myadmin

这个主要是一个js+html的后台管理 接口模式使用api的 可以使用不同的后台框架
已经有一个项目使用的是laravel，详见 

gitee
https://gitee.com/q1669608739/pro

github
https://github.com/echoyl/pro



# 使用方法
clone到本地后部署到 localhost中访问。

# 线上示例

请访问 https://inandan.com/admin

每个接口的请求数据已经写死，需要看实际效果请访问

https://inandan.com/myadmin

# 使用线上模式
将 dist/js/env.js 中的 is_local去除后设置为false即可以使用数据线上模式调用
修改后需要自行实现接口api获取数据
