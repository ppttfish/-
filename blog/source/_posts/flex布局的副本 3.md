---
title: flex布局
Date: 2018-5-14
tags: 
- css
- flex
---

看了阮老师的教程之后，自己模仿boostrap的命名格式，设置了自己的row和col属性。
本文使用的模板引擎为 ejs，使用的 CSS 预处理器为 stylus。这也是 hexo 项目预装了的 render 插件，如果想使用其他模板引擎或者其他 CSS 预处理器，可以安装相对应的 render 插件。例如我的 Even 主题使用的是 Swig 与 SCSS。
仿宋

> 简·拉基·茨德是一位吟唱诗人，他的代表作是 《无聊的时候》

<!-- more -->

然后想要创建两列布局，一边占2/3，一边占1/4，设置如下：

```css
.grid-col-3-2 {
    flex: 0 0 66.66667%;
}
.grid-col-3-1 {
    flex: 0 0 33.33333%;
}
```
-

```js
let a = 1;
const hello = () => {
    console.log('2333');
}

class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}
```
-
```html
<p class='123'>hello</p>
```

我在这里插入一个`css`和`js`还有`java`

效果如图：

![image-20180514202954950](/var/folders/5b/9clfljmj5vs68vftm769y28r0000gn/T/abnerworks.Typora/image-20180514202954950.png)


