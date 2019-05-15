### 前言
本项目意在将1.x的 **wepy** 项目无缝转换到 **原生小程序** (支持component)

### 思路
compile(main task) + runtime(lightweight)

### 技术栈
AST + RegExp + parse5

### 目录结构
```
编译工厂
  -compiler
    -index.js [type, ...args] 根据type调用对应的编译器, 返回promise
    
    -less-compiler
      input: 'less 代码'
      output: 'css 代码'

    -babel-compiler
      input: 'esNext 代码'
      output: 'es5 代码'

工具函数
  -utils
    -index.js [...] 工具方法集合
    
    -logger.js [log/warn/error] 输出日志

    -file.js [...] 文件方法集合
      -[method]selectExtFiles.js 传入文件路径、文件后缀, 返回文件夹内所有该后缀文件
      -[method]writeFileWithDir.js 传入文件路径、写入内容, 创建文件夹并写入

    -cache.js 缓存wepyrc/config等公用信息


-template
  -tpl2obj.js
    input: 'wepy.template标签内容'
    output: '一个表示template内容的对象'

  -mapping
    -index.js [replaceWpyAttrName] 映射方法集合

    -rules.js 映射规则

    -match.js 映射方法
      input: '原值, 映射规则'
      output: '替换后的值'

  -obj2mp.js
    input: '经过转换的template内容的对象',
    output: '原生小程序的wxml及一个描述（该描述用于表示template与script的事件关系，格式待定）'

-style
  -less2css.js
    input: 'wepy.style[包含引入外链css和less]'
    output: 'less编译后的css代码'

-script
  -index.js [...] 暴露解析script方法

  -analysisScript.js 根据AST解析script内容
    input: scriptCode: String
    output: AST解析并编译成原生小程序后的代码(过程中会一并处理import相关的npm文件创建、删除components对象等)

  -createMpRootFunc.js 创建小程序根函数(App({}) | Page({}) | Component({}))
    input: AST.bodys
    output: Function: AST

  -resolveCompsByAst.js 解析script中components(components={Auth: AuthModel})
    input: AST.bodys
    output: components: Object

  -resolveImportByAst
    -index.js 解析script中引入第三方模块(import|require)
      input: null
      output: AST.visitor: Object(包含各种规范的引入方式visitor)

    -copyModuleRetNewPath.js 复制npm/自定义模块文件并返回新路径

-traverse
  -index.js 遍历文件并输出到dist_

-init
  -index.js 初始化编译环境
    -cacheWepyrc 缓存wepy.config.js


-index.js 入口

-config.js 定义源代码入口reciteword、编译代码出口dist_reciteword、源代码路径src等
```

### todolist

- [x] analysisScript中fileType输出undefined

- [x] project.config.js未创建

- [x] 没有创建原生小程序函数, 如Page({}) | Component({})

- [x] config.js 中确实usingComponents

<<<<<<< HEAD
- [ ] 去除wpy编译js后的export代码(无需删除)

- [ ] app.json没有usingComponents

- [ ] delete config and component in xx.js

- [x] methods平铺

- [x] component生命周期方法名修改

- [x] $invoke/$apply的实现

- [x] $navigate等路由方法的实现
=======
- [ ] 去除wpy编译js后的export代码
>>>>>>> 99dd5c23dc47db50013df2b4a64e797794a36d29

- [ ] npm目录递归创建未实现

- [ ] 代码目录结构未调整

- [ ] problem未解决

### problem

- [ ] 当前文件的编译后路径错误, 如import Player from '@componnets/answer/player' -> import Player from 'player'

- [ ] less中引入公共less文件, 如@import '../../common/common.less'; 在当前less中使用@circle-bgColor会报错

<<<<<<< HEAD
- [x] ImportDeclaration/VariableDeclaration会同时发生

### 坑
- [x] 无法remove 所有exports节点可能是因为import分析ast转义时重新生成了新的exports(先后顺序不同)
=======
- [ ] ImportDeclaration/VariableDeclaration会同时发生
>>>>>>> 99dd5c23dc47db50013df2b4a64e797794a36d29
