---
title: vps搭建node运行环境
date: 2018-5-24 17:00:00
tag:
- vps
- debian
- nginx
---

之前买了搬瓦工的vps，只是在上边搭翻墙的梯子，现在准备开始做demo页面时候，想着顺便可以用`node`写一点后台代码，于是开始在vps上配置node环境。

我的vps安装的是`debian 9`，具体的安装以及设置可以移步去隔壁宿舍大佬的[博客][blog]。我在这里只是记载一下我的步骤(简化了一些)。

<!-- more -->

[blog]: rinchan.me/index.php/archives/18/

## 安装debian9

搬瓦工的`kiviVM`里边自带安装系统，找到*Install new os* 进行相关选择即可。

然后远程登录你的服务器。

```bash
ssh root@你的服务器ip地址
```

假如你的服务器端口更改过，不是默认的`22端口`，则在命令末尾加上 *-p 你更改之后的端口*，不然是无法连接到服务器的。

比如我的端口改成了8848，

```bash
ssh root@服务器ip地址 -p 8848
```

连接之后开始更新你的`debian`并安装一些我们需要的软件，因为搬瓦工自带的系统是精简版，很多我们需要的东西都没有。

### 安装所需安装包

```bash
apt -y install sudo wget curl vim git unzip screen htop net-tools socat netcat build-essential libunwind8 virt-what dnsutils traceroute hdparm
```

上边的指令包括了我们需要的软件，列表如下

>
>
>- 系统管理指令`sudo`
>- 下载工具`wget`、`curl`
>- 文本编辑器`vim`
>- 分布式版本控制系统`git`
>- 解压缩工具`unzip`
>- 窗口管理工具`screen`
>- 进程监控与管理工具`htop`
>- 网络工具`net-tools`、`socat`、`netcat`
>- 编译工具`build-essential`
>- 编程接口`libunwind8`
>- 虚拟技术查询工具`virt-what`
>- 域名解析查询工具`dnsutils`
>- 路由查询工具`traceroute`
>- 硬盘测试工具`hdparm`



直接从大佬博客粘贴过来的列表。（逃… ...

不过关于用户设置那块可以直接跳过，毕竟这个服务器只有我们使用。

### 开启BBR(拥塞控制算法)

`BBR `具有 `BBR ` 加速的作用，可以用来提升网络性能，一般 4.9 及以上的内核都自带了 BBR，只需开启即可。

```bash
sudo bash -c 'echo "net.core.default_qdisc=fq
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
net.ipv4.tcp_mtu_probing = 1" >> /etc/sysctl.conf && sysctl -p'
```

*赋值粘贴即可* 

然后输入下列指令确认安装成功

```bash
sudo sysctl net.ipv4.tcp_available_congestion_control
```

成功后会返回 `net.ipv4.tcp_available_congestion_control = bbr cubic reno`

*再次验证*

```bash
sudo sysctl -n net.ipv4.tcp_congestion_control
```

成功后会返回`bbr`

*检查内核模块是否已加载：*

```bash
lsmod | grep bbr
```

成功后返回`tcp_bbr 20480 0`



### limits & ulimit 优化

由于一般系统对资源都有限制，这里修改其数值以放宽限制。

```bash
sudo bash -c 'echo "* soft nofile 51200 * hard nofile 51200" >> /etc/security/limits.conf && ulimit -n 51200'
```



### 防火墙设置

先贴两个经常用到的指令 

*查看iptables的配置信息* `iptables -L`

然后是配置代码

```bash
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

[大佬][blog]给的配置里边的注释已经说的很清楚了，需要说明的是是开启的端口号，上边的代码里边开启了`21`，`22`，`80`，`443`端口，如果你的服务器之前更改过端口，就把你的端口加上去。

比如我的服务器默认端口为`8848`，我就在19行那里添加一条语句:

`-A INPUT -p tcp --dport 8848 -j ACCEPT` *注意-p的p是小写*

还有就是我跑node程序还需要额外监听一个端口，比如是`3000`，所以我还加了一条：

`-A INPUT -p tcp --dport 3000 -j ACCEPT`

配置完之后记得使得规则立刻生效

```bash
sudo iptables-restore < /etc/iptables.rules
```



设置开机生效：

```bash
sudo bash -c 'echo "* soft nofile 51200 * hard nofile 51200" >> /etc/security/limits.conf && ulimit -n 51200'
```





赋予执行权限:

```bash
sudo chmod +x /etc/network/if-pre-up.d/iptables
```



到这里vps的初步设置完成的差不多了，然后开始安装node相关的东西。



## 安装node

`编译源码`安装方法太慢了，我们直接用官方给的[安装教程][refer]。

[refer]: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

*安装node 8.x版本*

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装完之后查看版本：

`node -v`

## 安装nginx

```bash
sudo apt-get install nginx
```

*运行：*

```bash
systemctl start nginx.service
```

*添加系统引导时启动：*

```
systemctl enable nginx.service
```

## 测试nginx

安装好`nginx`之后，在浏览器里边访问你的`服务器ip地址`，就应该能看到默认的`nginx欢迎界面`





### 结束语

至此，就完成了基本的node环境配置，其他的软件我以后再添加。