#!/bin/bash

# 安装server.js开机自启服务的脚本

echo "正在安装Server Monitor开机自启服务..."

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo "请使用sudo运行此脚本"
    exit 1
fi

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查服务文件是否存在
if [ ! -f "server-monitor.service" ]; then
    echo "错误: server-monitor.service文件不存在"
    exit 1
fi

# 复制服务文件到systemd目录
echo "复制服务文件到systemd目录..."
cp server-monitor.service /etc/systemd/system/

# 重新加载systemd配置
echo "重新加载systemd配置..."
systemctl daemon-reload

# 启用服务（开机自启）
echo "启用开机自启..."
systemctl enable server-monitor.service

# 启动服务
echo "启动服务..."
systemctl start server-monitor.service

# 检查服务状态
echo "检查服务状态..."
systemctl status server-monitor.service

echo ""
echo "安装完成！"
echo ""
echo "常用命令："
echo "  查看服务状态: sudo systemctl status server-monitor"
echo "  启动服务:     sudo systemctl start server-monitor"
echo "  停止服务:     sudo systemctl stop server-monitor"
echo "  重启服务:     sudo systemctl restart server-monitor"
echo "  查看日志:     sudo journalctl -u server-monitor -f"
echo "  禁用开机自启: sudo systemctl disable server-monitor"
