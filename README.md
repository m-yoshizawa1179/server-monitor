# Server Monitor 开机自启设置

这个目录包含了让server.js开机自启的所有必要文件。

## 文件说明

- `server.js` - 系统监控API服务器
- `server-monitor.service` - systemd服务配置文件
- `install-service.sh` - 安装开机自启服务的脚本
- `uninstall-service.sh` - 卸载开机自启服务的脚本

## 安装开机自启

1. 进入server_monitor目录：
   ```bash
   cd /home/aiden/codes/server_monitor
   ```

2. 运行安装脚本（需要sudo权限）：
   ```bash
   sudo ./install-service.sh
   ```

## 服务管理命令

安装完成后，你可以使用以下命令管理服务：

```bash
# 查看服务状态
sudo systemctl status server-monitor

# 启动服务
sudo systemctl start server-monitor

# 停止服务
sudo systemctl stop server-monitor

# 重启服务
sudo systemctl restart server-monitor

# 查看实时日志
sudo journalctl -u server-monitor -f

# 查看历史日志
sudo journalctl -u server-monitor

# 禁用开机自启（但不删除服务）
sudo systemctl disable server-monitor

# 重新启用开机自启
sudo systemctl enable server-monitor
```

## 卸载服务

如果需要完全移除开机自启服务：

```bash
sudo ./uninstall-service.sh
```

## 服务配置说明

服务配置了以下特性：
- 开机自动启动
- 服务异常时自动重启（10秒后重试）
- 运行在端口3001
- 以用户aiden身份运行
- 日志输出到系统日志

## 测试服务

服务启动后，你可以通过以下方式测试：

```bash
# 检查端口是否在监听
sudo netstat -tlnp | grep 3001

# 或者使用ss命令
ss -tlnp | grep 3001

# 测试API接口
curl http://localhost:3001/api/system/metrics
```

## 故障排除

如果服务无法启动，请检查：

1. Node.js是否已安装：`node --version`
2. 服务状态：`sudo systemctl status server-monitor`
3. 服务日志：`sudo journalctl -u server-monitor -n 50`
4. 端口是否被占用：`sudo netstat -tlnp | grep 3001`
