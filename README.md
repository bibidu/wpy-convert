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

- [x] 去除wpy编译js后的export代码(无需删除)

- [x] app.json没有usingComponents

- [x] delete config and component in xx.js

- [x] component json文件应有component: true

- [x] 打包后的npm不应该放到src目录下

- [x] npm目录递归创建未实现

- [ ] methods平铺

- [ ] component生命周期方法名修改

- [ ] $invoke/$apply的实现

- [ ] $navigate等路由方法的实现

- [ ] problem未解决

### problem

- [x] 当前文件的编译后路径错误, 如import Player from '@componnets/answer/player' -> import Player from 'player'

- [x] npm模块require引入./connect无法自动识别为./connect/index.js, 需提前进行编译转换

- [x] 生成的npm新路径未添加main上的路径

- [x] parse5.serilize后进行html转义

- [x] parse5.serilize后自闭合标签的结尾斜杠丢失, 如<input /> --> <input >
  通过修改parse5.serilize|parseFragment解决, 代码见/utils/parse5.js

- [x] npm模块内引入其他npm模块的路径也应修改路径

- [x] store内index.js编译后丢失(twoAbsPathToRelativePath路径解析错误)

- [x] 解析npm包时，未安装该npm包依赖的其它npm包, (如redux-actions依赖invariant、reduce-reducers等)

- [x] npm库中的process.env.NODE_ENV报错, 因为小程序中没有process环境

- [x] babel处理import share from '../share'时会根据share出现次数编译为_share1/_share2/.... 目前无法获取import中share编译后的名称, hack处理, 详见compiler/babel-compiler/index.js-replaceCompsPath

- [x] 页面引入的wpy引用应删除

- [x] components = {VersionModal} 和 import VersionModal from '@/.../VersionModal/index' 形成映射关系，在babel解析前者时，错误的使用了babel-generator直接转换,但import未转换，实际上babel编译后生成了_index 和 _VersionModal, 导致映射失败

- [x] babel-compiler同时进行es降级和ast转化同时进行会影响ast识别到的不是降级后的代码, 目前采用先es降级，再ast修改的方式。后期通过引入acorn进行ast修改、babel进行es降级编译。

- [x] 无法remove 所有exports节点可能是因为import分析ast转义时重新生成了新的exports(先后顺序不同), 通过先es降级再ast分析(同上)

- [x] ImportDeclaration/VariableDeclaration会同时发生(同上)

- [ ] less中引入公共less文件, 如@import '../../common/common.less'; 在当前less中使用@circle-bgColor会报错

- [ ] 编译速度过慢


### 坑



### 可能导致编译失败的原因

*** 引用的npm模块未在package.json声明
