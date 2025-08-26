#!/bin/bash

# 卸载server.js开机自启服务的脚本

echo "正在卸载Server Monitor开机自启服务..."

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo "请使用sudo运行此脚本"
    exit 1
fi

# 停止服务
echo "停止服务..."
systemctl stop server-monitor.service

# 禁用开机自启
echo "禁用开机自启..."
systemctl disable server-monitor.service

# 删除服务文件
echo "删除服务文件..."
rm -f /etc/systemd/system/server-monitor.service

# 重新加载systemd配置
echo "重新加载systemd配置..."
systemctl daemon-reload

# 重置失败状态
systemctl reset-failed

echo ""
echo "卸载完成！Server Monitor服务已从系统中移除。"
