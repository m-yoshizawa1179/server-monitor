// server.js
const express = require('express');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// 允许跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 获取CPU使用率
function getCPUUsage() {
    return new Promise((resolve) => {
        const startMeasure = process.cpuUsage();
        const startTime = Date.now();
        
        setTimeout(() => {
            const endMeasure = process.cpuUsage(startMeasure);
            const endTime = Date.now();
            const totalTime = (endTime - startTime) * 1000; // 转换为微秒
            const totalUsage = endMeasure.user + endMeasure.system;
            const cpuPercent = Math.round((totalUsage / totalTime) * 100);
            resolve(Math.min(cpuPercent, 100));
        }, 100);
    });
}

// 获取内存使用率
function getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    return Math.round((usedMem / totalMem) * 100);
}

// 获取磁盘使用率
function getDiskUsage() {
    return new Promise((resolve) => {
        exec("df -h / | awk 'NR==2{print $5}' | sed 's/%//'", (error, stdout) => {
            if (error) {
                resolve(0);
            } else {
                resolve(parseInt(stdout.trim()) || 0);
            }
        });
    });
}

// 获取系统负载
function getSystemLoad() {
    const loads = os.loadavg();
    return loads[0].toFixed(1); // 1分钟平均负载
}

// API端点
app.get('/api/system/metrics', async (req, res) => {
    try {
        const [cpu, disk] = await Promise.all([
            getCPUUsage(),
            getDiskUsage()
        ]);
        
        const metrics = {
            cpu: cpu,
            memory: getMemoryUsage(),
            disk: disk,
            load: getSystemLoad(),
            timestamp: new Date().toISOString()
        };
        
        res.json(metrics);
    } catch (error) {
        console.error('获取系统指标失败:', error);
        res.status(500).json({ error: '获取系统指标失败' });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`系统监控API服务器运行在端口 ${PORT}`);
});