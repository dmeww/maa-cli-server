# MAA CLI Server
# Tips: arm64 平台需要额外安装 `@img/sharp-linux-arm64`

## 核心功能
- 即时/定时 MAA任务执行
- 查看MAA实时运行日志
- 查看设备运行截图
- 任务结束的回调通知

# 安装使用
你可以单独部署本项目作为API Server来控制MAA的运行

## 1. 单独使用
使用 PM2 进行运行项目, `pm2 start -n maa-cli-server npm -- run start`

## 2. 结合 WebUI 使用
这里使用Caddy 将webui前端和本项目部署在一个端口中

```Caddyfile
:80 {
    root * /root/software/maa_cli_webui
    file_server

    @api {
        path /api/*
    }
    reverse_proxy @api http://127.0.0.1:3000
}
```

