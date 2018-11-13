---
title: vps初次配置记录
date: 2018-11-12
tag:
- vps
- debian
---

去年的搬瓦工到期后，趁着双十一新入手了一个配置更好一点的。本来之前的vps里面也没啥东西，想着重新弄一下，也不迁移了，顺便做个记录。之前一片文章里也记录了一些初始化的操作，现在重新都写一下。

<!-- more -->

## 前言

我的vps里的系统选择了`Debian 9 x86_64 `，在搬瓦工KiwiVM里选择更改。

## 更新

更新包列表和已安装包，由于内核也更新了，所以更新完需要重启：

`apt update && apt -y full-upgrade && shutdown -r now`

回车之后漫长的等待～会出现一个蓝色的界面，直接回车就好。

## 安装软件包

`apt -y install sudo wget curl vim git unzip screen htop net-tools socat netcat build-essential libunwind8 virt-what dnsutils traceroute hdparm`

安装软件包括以下：

- 系统管理指令`sudo`
- 下载工具`wget`、`curl`
- 文本编辑器`vim`
- 分布式版本控制系统`git`
- 解压缩工具`unzip`
- 窗口管理工具`screen`
- 进程监控与管理工具`htop`
- 网络工具`net-tools`、`socat`、`netcat`
- 编译工具`build-essential`
- 编程接口`libunwind8`
- 虚拟技术查询工具`virt-what`
- 域名解析查询工具`dnsutils`
- 路由查询工具`traceroute`
- 硬盘测试工具`hdparm`

> 接下来是一些优化配置

## 开启 Google BBR

BBR 具有 TCP 加速的作用，可以用来提升网络性能，一般 4.9 及以上的内核都自带了 BBR，只需开启即可。

### 修改 sysctl 配置

`sudo bash -c 'echo "net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
fs.file-max = 51200
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.core.netdev_max_backlog = 250000
net.core.somaxconn = 4096
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 0
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.ip_local_port_range = 10000 65000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5000
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_mem = 25600 51200 102400
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_mtu_probing = 1" >> /etc/sysctl.conf && sysctl -p'`

### 确认 BBR 已启用

`sudo sysctl net.ipv4.tcp_available_congestion_control`

得到输出结果：`net.ipv4.tcp_available_congestion_control = bbr cubic reno`

### limits & ulimit 优化

由于一般系统对资源都有限制，这里修改其数值以放宽限制。

```sudo bash -c 'echo "* soft nofile 51200
* hard nofile 51200" >> /etc/security/limits.conf && ulimit -n 51200'
```

## 配置防火墙

因为我自己平时会用到一些端口，所以我自己开了`3000`、`27017`、`28245`这个可以根据需要自行修改。

下边的配置是示例，在20行处修改端口。

```sudo bash -c 'echo "*filter
sudo bash -c 'echo "*filter

:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]

# 允许本地回环地址进
-A INPUT -i lo -j ACCEPT

# 允许所有出
-A OUTPUT -j ACCEPT

# 允许已建立的连接进
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许被ping
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# 允许FTP:21，SSH:22，HTTP:80，HTTPS:443端口进
-A INPUT -p tcp --dport 21 -j ACCEPT
-A INPUT -p tcp --dport 22 -j ACCEPT
-A INPUT -p tcp --dport 80 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT

# 记录iptables拒绝的调用
-A INPUT -m limit --limit 5/min -j LOG --log-prefix \"iptables denied: \" --log-level 7

# 拒绝规则以外进
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT" >> /etc/iptables.rules'
```

### 使规则立即生效

`sudo iptables-restore < /etc/iptables.rules`

### 使开机生效

`sudo bash -c 'echo "#!/bin/bash
/sbin/iptables-restore < /etc/iptables.rules" > /etc/network/if-pre-up.d/iptables'`

### 赋予执行权限

`sudo chmod +x /etc/network/if-pre-up.d/iptables`

## 安装node

`编译源码`安装方法太慢了，我们直接用官方给的[安装教程](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)。

*安装node 8.x版本*

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装完之后查看版本：`node -v`

## 安装nginx

`sudo apt-get install nginx`

*运行：*

```
systemctl start nginx.service
```

*添加系统引导时启动：*

```
systemctl enable nginx.service
```

## 测试nginx

安装好`nginx`之后，在浏览器里边访问你的`服务器ip地址`，就应该能看到默认的`nginx欢迎界面`