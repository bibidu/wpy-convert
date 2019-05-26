### 前言
本项目意在将1.x的 **wepy** 项目无缝转换到 **原生小程序** (支持component)

### 思路
compile(main task) + runtime(lightweight)

### 技术栈
AST + RegExp + parse5

### 目录结构
```
-compiler
  -babel-compiler
    babel编译 + ast封装
  -less-compiler
    less文件编译

-init
  -cacheWepyrc()
  -cacheConfig()

-script
  -index.js
  -compileScript.js
  -utils.js

-style
  -index.js
  -compileStyle.js
  -compileLess.js

-template
  -mapping
  -index.js
  -compileTemplate.js
  -tpl2obj.js
  -obj2mp.js

-traverse
  -index.js
  -traverseJs.js
  -traverseJsInWpy.js
  -traverseNpm.js

-utils
  -index.js
  -file.js
  -logger.js
  -logger.js
  -parse5.js

-config.js
-index.js
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

- [x] 
`var global = module.exports = typeof window !== 'undefined' && window.Math === Math ? window : typeof self !== 'undefined' && self.Math === Math ? self : this;`
转换后 最后的this 编译成了undefined 导致报错

=> babel-preset-es2015添加{modules: false} -> 即不编译es6特性如import
  或自行添加插件babel-plugin-es2015-modules-commonjs并配置 "allowTopLevelThis": true
  或修改为非顶层this调用，如使用IIFE

- [x] less中引入公共less文件, 如@import '../../common/common.less'; 在当前less中使用@circle-bgColor会报错
  依次向上遍历引用less, 将引用less文件中的@color:#fff; 替换为当前引用的less文件路径。当less文件中只有less变量声明时, 不生成dist文件。原本的less文件引用改为wxss后缀。

- [x] 编译速度过慢。通过使用cache对编译过的文件进行标记。

- [ ] template编译时 :class="{nosure: true, 'bingo': realAnswer}" 需要被编译成:
      class="{{true ? 'nosure' : ''}} {{right ? 'bingo' : ''}}", 目前配置的通用正则无法实现

- [ ] 引入hook机制, 以实现以下设计：
      wpy -> 判断编译类型(less | babel | ...)
      -> this.hook(less-compiler | babel-compiler | ...)
      -> 执行xx-compiler时需要递归继续执行 -> this.hook(xx-compiler)
      



### 坑



### 可能导致编译失败的原因

*** 引用的npm模块未在package.json声明
