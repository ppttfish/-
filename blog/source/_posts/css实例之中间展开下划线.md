---
title: css实例之中间展开下划线
date: 2018-5-12
tags:
- css
- demo
---

逛别人博客的时候发现有个好玩的东西，就是触发标题hover事件的时候，下划线是从中间向两边展开。我开始想着直接用border实现，先给boder设置为0，然后`hover`的时候变为1px，添加了`tansition`属性后，发现行不通。于是又仔细看了一下，发现人家用的是伪元素实现的，看得差不多后开始自己实验。

<!-- more -->

### 正文

文档结构如下

```html
<div>
    <h1 class="title">我是标题</h1>
</div>
```

css属性

```css
.title {
    position: relative;
    display: inline-block; /* 让h1的宽度为自身长度，而不是充满父元素*/
    			   /* 因为block元素默认宽度为父元素 */
}
.title::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    left: 50%;
    transform: translate(-50%); /* 核心，从中间向两边展开 */
    border-bottom: solid;
    transition: all .2s ease-in-out;
}

.test-title:hover::after {
  width: 100%;
}

```

具体效果看我文章标题。

打完收工。