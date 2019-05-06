# wpy-convert
wpy转换任意小程序框架代码

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
    -cache.js 缓存AST等公用信息
    -ast.js 封装解析constants|refs|componnets等部分的方法集合
    
template
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

style
  -less2css.js
    input: 'wepy.style[包含引入外链css和less]'
    output: 'less编译后的css代码'

script
  -index.js [...] 暴露解析script方法
  -resolveRefs.js 通过AST解析引入的外链模块信息
  -resolveConstants.js 通过AST解析临时变量信息
  -resolveClass.js 通过AST解析class内信息(可能继续分拆, 待定)


```