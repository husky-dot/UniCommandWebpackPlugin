### 使用

首先，需要配置系统环境变量，变量名为 `WX_MINI_HOME`，值为小程序开发者工具的安装路径。例如，我使用是 window10，对应配置如下：

![](http://www.longstudy.club/100/miniHome2.png)

命令行工具所在位置：

* macOS: <安装路径>/Contents/MacOS/

* Windows: <安装路径>/微信web开发者工具/

安装

```
npm i uni-command-webpack-plugin -D
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

