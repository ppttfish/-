---
title: vps搭建个人网站
data: 2018-11-12
tags:
- vps
- 搬瓦工
- 域名
- nginx
- 域名解析
---

之前的域名到期后，`Godaddy`续费又比较坑，就没有续费。然后在`[namesilo](www.namesilo.com)`又买了一个域名，作为日常练习使用。`namesilo`比起`Godaddy`续费价格要良心很多，续费价格和第一次购买的价钱是一样的，而且没那么多广告烦人。

<!-- more -->

## 域名解析

买好域名之后，我把dns解析服务交给了阿里云。在域名商的dns管理里边修改了dns记录，托管到阿里云了。

然后在阿里云的云解析DNS里给域名添加记录。

![](http://pi4jkdkk3.bkt.clouddn.com/dns1.png)

每个记录类型代表的意思：

- **A** -将域名指向一个IPV4地址
- **CNAME**-将域名指向另外一个域名
- **AAAA** -将域名指向一个IPV6地址
- **NS** -将子域名指定其他DNS服务器解析
- **MX** -将域名指向邮件服务器地址
- **SRV** -记录提供特定的服务的服务器
- **TXT** -文本长度限制512，通常做SPF记录（反垃圾邮件）
- **CAA** -CA证书颁发机构授权校验

主机记录就是域名前缀，常见用法有：

- **www**：解析后的域名为www.aliyun.com。

- **@**：直接解析主域名 aliyun.com。

- *****：泛解析，匹配其他所有域名 *.aliyun.com。

- **mail**：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器。

- **二级域名**：如：abc.aliyun.com，填写abc。

- **手机网站：**如：m.aliyun.com，填写m。

- **显性URL：**不支持泛解析（泛解析：将所有子域名解析到同一地址）

## 服务器Nginx设置

### 多域名指向同一个IP地址设置

闹着玩多买了一个域名，就想着把两个域名指向同一个IP地址，然后通过Nginx来做代理，使得访问不同域名返回不同的页面。

思路是这样：

1. 首先把域名都指向同一个服务器IP地址。
2. 在服务器里安装好Nginx之后，进行相应的配置。

首先我把Nginx的默认配置都注释掉，不然我们的配置不会生效。找到`/etc/nginx/sites-enabled/default`文件，把里边的相关内容全部注释掉。

在`/etc/nginx/`新建一个文件夹`servers`用来存放我们的配置文件，也可以直接在默认的配置文件里进行配置，但是分开写比较好维护，看起来也清晰。然后在`/etc/nginx/nginx.conf`里http里增加`include /etc/nginx/servers/*.conf;`，这样我们`servers`里的配置才会被读取到。接下来就可以在`/etc/nginx/servers`为每一个域名写一个对应的配置文件。

比如我现在有两个域名，a.com和b.com，我就在servers下新建两个文件分别为a.conf，b.conf。

a.conf:

```
server {
    listen 80;
	server_name a.com www.a.com; #这两个最好都要写
	index index.php index.html;
	root /home/www/a.com; #存放相应网页文件的根目录,比如存放我a.com域名要显示的网页文件夹叫做a.com
}
```

b.conf:

```bash
server {
    listen 80;
	server_name b.com www.b.com; #这两个最好都要写
	index index.php index.html;
	root /home/www/b.com; #存放相应网页文件的根目录
}
```

更改完Nginx配置，记得要重新启动Nginx。

`nginx -s reload`

然后就可以通过不同的域名访问不同的网页了。