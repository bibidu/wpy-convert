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
    -log [log/warn/error] 输出日志

template
  -tpl2obj.js
    input: 'wepy.template标签内容'
    output: '一个表示template内容的对象'
  -mapping.js
    input: '表示template内容的对象'
    output: '遍历输入，进行每个字段的替换'
  -obj2mp.js
    input: '经过转换的template内容的对象',
    output: '原生小程序的wxml及一个描述（该描述用于表示template与script的事件关系，格式待定）'

style
  -less2css.js
    input: 'wepy.style[包含引入外链css和less]'
    output: 'less编译后的css代码'

script
  -待定

```