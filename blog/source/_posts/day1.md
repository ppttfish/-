---
title: hexo自定义模板第一天
discription: 自己开始定制自己模板的第一天笔记
date: 2017-03-22 
---



开始照着http://litten.me/和http://lewis.suclub.cn/tags/写自己的模板，官方文档一直没怎么看懂，反正就是走一步看一步慢慢摸索。

弄清楚各个文件之间的关系后，就按着这个目录开始写样式了。

![mage-20180320220922](/var/folders/5b/9clfljmj5vs68vftm769y28r0000gn/T/abnerworks.Typora/image-201803202209227.png)
<!-- more -->

landscape是默认的主题，按照官方文档建立我自己的主题文件夹ppttfish，上边的目录是按着官方文档(如下)建立的

> ```
>
> ```

layout下_partial目录的ejs文件算是模板，可以反复利用，通过partial函数来调用，比如在layou.ejs里边就可以通过调用三个写好的模板来构建，如下为layout.ejs：

```
<!DOCTYPE html>
<html lang="zh-CN">
  <%- partial('_partial/head') %>
<body>
  <%- partial('_partial/header') %>
  <%- body %>
  <%- partial('_partial/footer') %>
</body>
</html>
```

通过partial()函数来调用head、header、footer模板就可以构建好页面，所以接下来的时间，我重点去写这些可以反复调用的模板文件。



#### ejs格式说明

<% xxx %>格式是逻辑代码应用的，这些代码不会在html文档中显示。

<%- xxx %>格式是可以在html文档中显示的。

![mage-20180320222933](/var/folders/5b/9clfljmj5vs68vftm769y28r0000gn/T/abnerworks.Typora/image-201803202229330.png)![mage-20180320223009](/var/folders/5b/9clfljmj5vs68vftm769y28r0000gn/T/abnerworks.Typora/image-201803202230096.png)

如上图，只有在<%- %>中的内容被显示出来了。

#### 接下里说一下今天遇到的一些问题(无法更新hexo主题)

之前应用过主题，但是今天更新主题的时候发现无法推送到github页面上去，没办法更新页面。

hexo g 之后 hexo d发现页面没有更新，找了半天原因发现是在根目录下的_config.yml中没有配置部署参数，导致没有办法更新，于是照着官方文档去添加了属性。

> ```
> deploy:
> - type: git
>   repo:
> - type: heroku
>   repo:
> ```

​                                                                           <!--hexo官方文档-->

![mage-20180320223651](/var/folders/5b/9clfljmj5vs68vftm769y28r0000gn/T/abnerworks.Typora/image-201803202236511.png)

repo是你自己的github仓库地址 ***github.com/user/user.github.io***

branch和message可以不写。

然后就可以了，如果是第一次部署，还需要安装git，按照官方文档来部署就好。

如果hexo d 出现error deployer not found:git 的错误，重新装一下git就好了。

```
npm install hexo-deployer-git --save
```

