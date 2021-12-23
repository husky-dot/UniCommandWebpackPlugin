### 背景

目前公司业务在往小程序矩阵发力，所以陆陆续续有 10 来个小程序，每个小程序都 有对应的开发和生产环境，加起来就有20多个打包产物。目前用 vscode 开发小程序，每次开发或者生产环境编译完，都要手动找到对应的产物然后用微信开发工具打开，如果已经打开过了，下次进来，还得从开发者工具已经打开列表找，操作比较麻烦。

此外发布也是手工操作，容易误操作把开发代码提交上去。

所以必须得有个插件来做这些事，处理这些问题。于是就有  **UniCommandWebpackPlugin** 插件，这个webpack 插件主要解决下面几个问题：

* 开发的时候能够自动打开微信开发者工具
* 可以在项目的命令行里直接完成发布

### 使用

首先，需要配置系统环境变量，变量名为 `MINI_HOME`，值为小程序开发者工具的安装路径。例如，我使用是 window10，对应配置如下：

![](http://www.longstudy.club/100/miniHome.png)

命令行工具所在位置：

* macOS: <安装路径>/Contents/MacOS/

* Windows: <安装路径>/微信web开发者工具/

安装

```
uni-command-webpack-plugin
```

然后将插件添加到 WebPack Config 中。例如：

```
const UniCommandWebpackPlugin = require("uni-command-webpack-plugin");

module.exports = {
  plugins: [
	new UniCommandWebpackPlugin()
  ],
};
```

>  **注意：uni-using-components-webpack-plugin  只适用在 UniApp  开发的小程序。**

### 参数

参数是一个对象，对象上可配置以下两个属性：

| Name        | Type    | **Description**                       |
| ----------- | ------- | ------------------------------------- |
| autoOpen    | boolean | 是否自动打开开发者工具，默认值 `true` |
| autoPublish | boolean | 是否自动上传代码，默认值 `true`       |

事例：

```
const UniCommandWebpackPlugin = require("uni-command-webpack-plugin");

module.exports = {
  plugins: [
	new UniCommandWebpackPlugin({
	  autoOpen: true,
	  autoPublish: true
	})
  ],
};
```

### 小程序命令行调用

为了能自动发布和打开小程序，我们需要借助小程序的命令行工具，命令行工具所在位置：

* macOS: `<安装路径>/Contents/MacOS/cli`

* Windows: `<安装路径>/cli.bat`

小程序提供多种命令，可以通过命令登录，预览、上传、 构建、云开发等强大功能，具体可以查看 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html#%E5%91%BD%E4%BB%A4%E7%B4%A2%E5%BC%95)。

这里我们用到以下两个命令：

* 启动工具：

  ```
  # 打开路径 /Users/username/demo 下的项目
  cli open --project /Users/username/demo
  ```

* 上传代码

  ```
  # 上传路径 /Users/username/demo 下的项目，指定版本号为 1.0.0，版本备注为 initial release
  cli upload --project /Users/username/demo -v 1.0.0 -d 'initial release'
  
  # 上传并将代码包大小等信息存入 /Users/username/info.json
  cli upload --project /Users/username/demo -v 1.0.0 -d 'initial release' -i /Users/username/info.json
  ```



### 实现思路

首先，我们要获取到小程序命令行所在安装位置，这样我们才能调用小程序 `cli` 来执行特定的命令。那我们的插件要怎么知道小程序的安装路径，这里有几种方式：

* 配置系统环境变量
* 配置 npmrc 
* 插件参数传入

这里我选择第一种，配置系统环境变量，然后我们在插件里面去读取，相对比较合理。

配置 npmrc 可能初学者对这个文件比较陌生，不太好找到这个文件，不好的体验会导致使用者的厌恶，所以弃用。

至于插件参数指定的话，有个问题，每个开发者的安装路径不一样，每次改完，代码又得提交上去，当另一个开发者开发时，他的安装路径不是同个，又得改成自己安装路径，比较麻烦，所以弃用。



**UniCommandWebpackPlugin** 插件主要做两件事：

* 开发环境构建完自动打开开发者工具
* 生产环境构建完自动打开开发者工具，并提示是否需要上传代码

用到插件钩子 `done` 表示 `compilation` 执行完成。



>  **PS: 具体实现自行查看源码。**