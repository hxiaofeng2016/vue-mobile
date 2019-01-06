## 默认技术栈配置

> `babel-polyfill`（提供浏览器兼容支持）

> `vue` + `vue-router` + `vuex`（vue 全家桶）

> `element-ui`（已配置按需加载）

> `axios`（提供 api 请求操作）

> `js-md5` （提供 MD5 哈希函数）

## 依赖管理器推荐使用 [yarn](https://yarn.bootcss.com/docs/)，<del>抛弃 `npm` & `cnpm`</del>

> 基本使用

```v
  // 安装全部依赖
  yarn (yarn install) // => npm install

  // 添加依赖包
  yarn add <package>  // => npm install <package> --save
  yarn add <package> -D // => npm install <package> --save-dev

  // 移除依赖包
  yarn remove <package> // => npm uninstall <package>

  // 本地运行（以现有项目为例）
  yarn start (or yarn run dev)  // => npm start (or npm run dev)
  ...
```

> 关于`yarn.lock`

- 为了在不同机器上得到一致的安装结果，`yarn` 需要比你配置在 `package.json` 文件中的依赖列表更多的信息。 `yarn` 需要知道每个安装的依赖包的准确的版本号。

- **须提交到版本管理系统**

---

## `webpack` 配置（优化及新增功能）

> 基于 `vue-cli@2.9.3` 重新搭建

- 调整依赖包以及移除不必要依赖包，并优化了打包后代码体积（后续还需要根据项目情况继续优化）；
- 沿用 `sass-resources-loader` 将 `less` 变量提升为全局引用；

* 根据项目开发需要，提供单页面打包和多页面打包（通过配置`config/index.js`中的`moduleName`来选择）

> 注意: 配置多页面，需要在每个页面添加以 `entry-` 为前缀的入口 js 文件(为了避开项目已有 js 文件)，还要添加与页面文件夹同名的 `html模板`，本地运行时需要指定到该文件夹路径，如 admin 下`localhost: 8088/admin.html`；`moduleName` 设置为 **null** 即是单页面，否则为多页面（如设置 `moduleName` 为项目中的 `views` 文件）。

- 关于主题 —— 项目提供默认主题（即打包一套主题，后续无论添加多少套主题都不会影响到项目打包体积），可通过引入 `ThemePicker` 组件实现换肤功能（该组件后续根据项目需求调整样式功能）。切换主题后本地 `localStorage` 保存主题。

  > 可通过 `config/index.js` 设置 `theme` 来打包指定的主题以替换默认主题（只适合布局不变的主题，待完善）

  > 主题存放在 `src/theme` 中维护，其中 `default.less` 为通用设置，主要设置颜色，除了该文件其他即为主题文件，一般设置变量啊布局啊，变量必须优先声明定义（必须在 `@import './default'` 前）

- 统一规则

  > 组件 & 页面: 文件名对应相关名称，该文件下提供 `index` 入口，比如一个搜索组件，文件名为 `Search` ，文件下提供 `index.vue` 入口，引用该组件时只需 `import Search from '../Search'`，它会自动找到`index`入口

---

## 目录结构

```v
│ .babelrc
│ .editorconfig
│ .eslintignore
│ .eslintrc.js
│ .gitignore
│ .postcssrc.js
│ index.html
│ package.json
│ README.md
│ yarn.lock
│  
├─build
│  
├─config
│  
├─src
│ │ App.vue
│ │ main.js
│ │  
│ ├─api
│ │  
│ ├─assets  // 资源文件
│ │ ├─icon
│ │ │  
│ │ ├─images
│ │ │  
│ │ └─style
│ │  
│ ├─components  
│ │ ├─Example // 组件统一大写字母开头？
│ │ │ index.less  // 组件样式
│ │ │ index.vue // 组件主入口
│ │ │ install.js  // 提供vue组件注册
│ │ │  
│ │ └─...
│ │  
│ ├─directives  // 指令
│ │  
│ ├─router  // 路由
│ │  
│ ├─theme // 主题（内置主题切换功能）
│ │ │ default.less  // 通用颜色样式设置
│ │ │ dark.less // dark主题
│ │ │ light.less // light主题
│ │ │ ...others theme
│ │
│ ├─utils   // 工具
│ │  
│ ├─views
│ │ └─example // 页面
│ │ │ index.less  // 页面样式
│ │ │ index.vue // 提供入口
│ │ │ ...others template
│ │ │  
│ │ └─...
│ │  
│ └─vuex
│  
├─static
│ │ │  
│ │ └─...
│  
└─test
```
