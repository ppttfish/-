---
title: 服务器端运行node程序
data: 2018-5-26 14:44
tags: 
- vps
- node
- nginx
---

因为之前想着去搭一个`demo`页面来放一些我的小例子，所以一步步开始在服务器端配置`node环境`，最后是打算做出来一个node.js作为后台的网站出来。

之前不是刚刚把环境配置好，也完成了服务器端的自动部署代码，相关的两篇文章在这里([1](https://ppttfish.me/2018/05/24/vps%E6%90%AD%E5%BB%BAnode%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83/), [2](https://ppttfish.me/2018/05/24/%E5%9C%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E9%83%A8%E7%BD%B2%E4%BB%A3%E7%A0%81/))。现在就正式开始在服务器端运行我的node程序，并且通过`nginx`进行反向代理，这样就可以通过我的`域名`或者`服务器ip`直接看到我的程序结果了。

<!-- more -->

### 服务器端的第一个node程序

之前我不是已经配置好了vps的node环境，现在正式开始写程序😜。



先简单写一个`hello world`程序，下边是`server.js`文件内容:

```bash
const http = require('http');

http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
  res.end('<h1>你好哇</h1>');
}).listen(3000);
```

在终端执行 `node server.js`

在浏览器地址栏输入`localhost:3000`，就可以看到亲切的问候了，本地测试完成之后，就可以把文件上传到服务器端了。

而我之前已经设置好了服务器端的自动部署，我们在本地仓库写好`server.js`之后，push上去，服务器端我们的工作仓库里就也有了一份`server.js`。

现在登录到我们的服务器。

```bash
ssh root@你的服务器ip -p 8848 #我是改过ssh默认的端口
```



在相应的仓库下找到我们的`server.js`程序，我的文件在`/home/project/repos/`目录下。

然后执行它：`node server.js`

浏览器地址栏输入`你的域名或者服务器ip地址:3000`，发现刚刚亲切的问候又出现了，和在本地运行结果是一样的。

但是每次都输入`域名:端口号`访问不太雅观，我们可以通过`nginx`来进行代理我们的端口进程。

### nginx代理端口进程

这一步我卡了很久，搜到的方法都是在`/etc/nginx/conf.d`或者`/etc/nginx/conf.d/ `下的`default.conf`里边进行`server`的配置，但是我配置好之后，就是不生效，直接输入域名跳转的还是`nginx`欢迎页面。

纳闷了一会，我想着`nginx`的默认页面是在那里设置的，于是顺着这个思路我找到了`/etc/nginx/sites-enabled/`这个目录下边的`default`文件，注释掉了里边相关的`server`配置，这下我在`/etc/nginx/conf.d/default.conf`里边的配置终于生效了。😋😋😋

下面是`default.conf`文件里的相关配置。

```bash
server {
  listen 80;
  server_name exampl.com;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_pass http://127.0.0.1:3000;
  }
}
```

配置完后，重启`nginx`使之生效。重启命令: `sudo service nginx reload`。

如果重启失败，可以通过命令`sudo nginx -t`来检测我们的配置是否存在问题。

> - `listen`监听的是端口，如果没有特殊指定，一般网站监听的都是`80`
> - `server_name`指定的是域名或者你服务的ip
> - `proxy_pass` 指定的是代理的路径，127.0.0.1就是localhost，后边跟你程序里的端口号

> - 127.0.0.1是IANA保留的回环IP地址，通常称为localhost

现在，在浏览器地址栏输入你的域名(不需要加端口号)就可以再次看到亲切的问候了。🤓



### 守护进程

想让我们的程序一直在服务器端运行的话，可以应用`node`的一些工具，比如`forever`。

```bash
npm install forever -g
cd /path/to/your/project
npm install forever-monitor
```

安装完成之后，就可以用它来运行我们的程序。

`forever server.js`

与守护进程相关的更多内容，可以去阮老师的博客看一看，👉👉👉[传送门](http://www.ruanyifeng.com/blog/2016/02/linux-daemon.html)。

下面贴几个常用的命令:

```
# 作为前台任务启动
$ forever server.js

# 作为服务进程启动 
$ forever start app.js

# 停止服务进程
$ forever stop Id

# 重启服务进程
$ forever restart Id

# 监视当前目录的文件变动，一有变动就重启
$ forever -w server.js

# -m 参数指定最多重启次数
$ forever -m 5 server.js 

# 列出所有进程
$ forever list
```