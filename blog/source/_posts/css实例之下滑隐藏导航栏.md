---
title: css实例之下滑隐藏导航栏
date: 2018-05-21 20:57:01
tags:
- css
- demo
---

### 前言

在写这个`hexo`主题的过程中，学会了蛮多样式实现的方法，所以就不要白瞎了这些方法，一个一个记下来，最好再做成一个`demo`页面，把这些小demo一个一个都放上去，23333333333333333333。

想起来做 *下滑隐藏导航栏* 是因为做目录的时候，发现点击标题锚点跳转到的地点顶部被导航栏遮挡住了，于是就想来可以通过判断滚动条是上滑还是下滑来进行显示和隐藏的设置，提升阅读体验。<!-- more -->同理其实，返回顶部在一定距离的显示和隐藏也是通过判断滚动条距离顶部的距离(`scollTop`)来设置的。

### 思路

<u>整体思想都是，滚动条滑动的时候，判断它是上滑还是下滑，然后做出相应的设置，上滑显示，下滑隐藏。然后具体就是*通过比较滑动的相对值是正还是负*来判断是上滑还是下滑。</u>
这里需要注意的就是如何获取这个`相对值`，也就是说每次判断的时候需要获取上次的滚动值，这时候就可以应用闭包来保存上次的滚动值了。


 >为当前页面的页面滚动事件添加事件处理函数.
 >window.onscroll = function (e) { 
 // 当页面的滚动条滚动时,会执行这里的代码
}

```js
const getScroll = () => document.documentElement.scrollTop 
                        || document.body.scrollTop;
window.onscroll = (() => {
  let oldScrollTop = getScroll();

  return (scrollTop) => {
    let newScrollTop = getScroll();

    if (oldScrollTop > newScrollTop) {
      console.log('up');
      oldScrollTop = newScrollTop;
    } else {
      console.log('down');
      oldScrollTop = newScrollTop;
    }
  }
})();
```
上边这段代码就是判断是向上滚动还是向下滚动，在向上滚动时控制台输出 *up*，向下滚动时输出*down*。
![图片](https://ws2.sinaimg.cn/large/006tNc79ly1frk3p1xd5rg30do09wb2a.gif)

完成判断滚动方向后，基本也就完成了，只需要在逻辑判断里边加入导航栏的显示和隐藏就可以了，我们还可以用jquery的`fadeIn` 和 `fadeOut` 使过渡不那么生硬。

*完整代码*

```js
const getScroll = () => document.documentElement.scrollTop 
                        || document.body.scrollTop;
window.onscroll = (() => {
  let oldScrollTop = getScroll();

  return (scrollTop) => {
    let newScrollTop = getScroll();

    if (oldScrollTop > newScrollTop) {
      console.log('up');
      $('#nav'.fadeIn(); //nav为导航栏的id
      oldScrollTop = newScrollTop;
    } else {
      console.log('down');
      $('#nav').fadeOut();
      oldScrollTop = newScrollTop;
    }
  }
})();
```

效果就不贴图了，大家自己试试吧。

### By the way

返回顶部图标的显示与隐藏也是在`window.onscroll`函数里边进行的设置，顺便利用jquery还可以完成滚动到顶部和淡出淡入效果。