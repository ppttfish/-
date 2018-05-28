---
title: webpack学习笔记
date: 2018-5-27 16:47
tags:
- webpack
- 学习笔记
---

本来打算开始学习`sass`，结果不知道为啥今天看了一天`webpack`，官方文档看了前几节算是简单入了个门。在这里记录一下学习笔记。不定期更新系列...

<!-- more -->

## webpack能干什么？

因为之前一直也没有用过打包工具，比如`Grunt`和`gulp`（虽然一直没有用过，但是对这两个工具倒是眼熟的很，`boostrap`官网的实例上边有他两的官网，还照着做过2333333）。所以并不清楚`webpack`到底是什么以及它能干嘛，经过简单的学习后，发现，**卧槽**？真好用。

> 简单的说，webpack是一个程序模块打包器。它能把我们不同的程序模块，构建成一个包，而且在该包里产生一个映射图，通过该图，可以找到所有需要的依赖。

也就是说，本来我们有两个js文件，`a.js`和`b.js`，而且存在a对b的依赖，正常的写法：

```html
<srcipt src="./b.js"></srcipt>
<srcipt src="./a.js"></srcipt>
```

分别导入两个文件，通过webpack打包后，假设我们打包成了`bundle.js`，写为这样:

```html
<srcipt src="./bundle.js"></srcipt>
```

当然这并不能体现出`webpack`的强大。它的强大之处是可以让我们在node环境下写的js运行在浏览器里！！！

这样做的好处当然是非常多的，首先就是使我们的程序模块化。

假设我们在b中定义了一个变量，要想让a也能使用，只能把这个变量定义为全局变量。但是这样随便的定义全局变量并不是一件很好的事情，你不知道这个全局变量会在什么时候被更改，导致出现一些难以预料的结果。

在`node`中，因为每一个文件就是一个`模块`，文件之间是相互独立的，在这个文件里的定义的`变量`、`函数`、`类`，都是私有的，对其他文件不可见。想让其他文件共享这个`属性`，可以把这个属性`暴露`出去，这样在其他文件里就可以访问到这个属性了。

现在回过头来说想要在b中定义一个非全局的变量，而且在a中也可以取到，在node中是非常容易实现的。

假设b.js内容如下:

```js
const msg = 'i am b';

module.exports = {msg: msg};
```

b的私有属性`msg`被暴露出去了，要a中引用这个msg非常方便。

a.js内容如下：

```js
const msg = require('./b.js').msg;
console.log(msg);
```

遗憾的是，这种写法只有在node环境下才可以运行，在浏览器中运行会报错的。

但是，我们有`webpack`啊，我们可以通过`webpack`把这两个文件打包成一个，然后就可以在浏览器中正确的运行了！是不是很厉害，我们写前端也可以是模块化编程了。



## webpack配置

接下来记录一下使用webpack的流程。

官方文档其实说的挺清楚的，传送门→→[官方教程](https://webpack.js.org/guides/getting-started/)。

首先安装：

```ba
npm install -g webpack webpack-cli
```

`-g 安装到全局，webpack v4以上需要安装 webpack-cli`

这是全局安装，但是最好还是在每次工程目录下边都安装一下，在工程目录下安装去掉-g。

假设我们的工程目录是 ，

```bash
webpack-demo
|- /dist
   |-index.html
|- /src
   |-a.js
   |-b.js
```

新建一个package.json

```ba
npm init -y 
```

安装`webpack`及`webpack-cli`

```Ba
npm install webpack webpack-cli -s-d
```

`-s-d`会自动更新`package.json`里边的信息。

新建`webpack.config.js`

现在目录如下：

```ba
webpack-demo
|- /dist
   |-index.html
|- /src
   |-a.js
   |-b.js
|- webpack.config.js
|- package.json
```

配置webpack

```js
module.exports = {
  entry: './src/a.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  }
};
```

> - `entry` 是入口，指定要进行打包的文件。
> - `output`是出口，指定打包后的文件的名字和路径。
> - `webpack v4`默认的入口文件是 `./src/index.js`

执行 `webpack`，就可以在`/dist`目录下看到新生成的`bundle.js`了。

现在的目录：

```ba
webpack-demo
|- /dist
   |-index.html
   |-bundle.js
|- /src
   |-a.js
   |-b.js
|- webpack.config.js
|- package.json
```

我们也可以通过更改执行指令，在package.json中找到 srcipts属性，添加我们自定义的脚本。

```Js
"scripts": {
    "start": "webpack"
  }
```

这下就可以通过 `npm run start`来打包我们的程序了。