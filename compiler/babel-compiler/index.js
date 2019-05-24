/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-22 15:22:42 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-24 14:16:59
 */

const babel = require('babel-core')
const generate = require('babel-generator').default

const {
  safeGet
} = require('../../utils')

const astResolveApis = [
  'collectAllRequire',
  'replaceRequirePath',
  'getWepyFileType',
  'getWepyFileBody',
  'removeComponent',
  'collectWepyConfig',
  'collectWepyComponents',
  'removeRequireNode'
]

function initAstResolveApis(apis) {
  astResolveApis.forEach(api => {
    apis[api] = apis[api] || function() {}
  })
}


function collectWepyConfig(path, config) {
  const { object, property } = path.node.callee
  if (
    safeGet(object, 'object.name') === 'Object'
    && safeGet(property, 'property.name') === 'defineProperty'
  ) {
    const params = path.node.arguments
    Array.from(params).forEach(param => {
      /* 解析config属性 */
      if (param.type === 'StringLiteral' && param.value === 'config') {
        const cfgProps = (Array.from(params).find(i => 
          i.type === 'ObjectExpression'
        ) || {}).properties
        const properties = Array.from(cfgProps).find(i => i.key.name === 'value')
        
        Array.from(
          safeGet(properties, 'properties.value.properties', [])
        ).forEach(prop => {

          const configKey = generate(prop.key, {}).code
          const configValue = generate(prop.value, {
            compact: true,
            jsonCompatibleStrings: true,
            comments: true,
          }).code

          config[configKey] = new Function(`return ${configValue}`)()
        })
      }
    })
  }
}
function collectWepyComponents(path) {
  let components = {}
  const { object, property } = path.node.callee
  if (
    safeGet(object, 'object.name') === 'Object'
    && safeGet(property, 'property.name') === 'defineProperty'
  ) {
    const params = path.node.arguments
    Array.from(params).forEach(param => {
      /* 解析components属性 */
      if (param.type === 'StringLiteral' && param.value === 'components') {
        const configureProperties = (
          Array.from(params).find(
            i => i.type === 'ObjectExpression'
          ) || {}
        ).properties

        const properties = Array.from(configureProperties).find(
          i => i.key.name === 'value'
        )
        
        Array.from(
          safeGet(properties, 'properties.value.properties', [])
        ).forEach(prop => {
          components[prop.key.name] = prop.value.object.name
        })
        // path.remove()
      }
    })
  }
  return components
}
module.exports = function babelCompiler(
  code = '',
  apis = {},
  compile = true,
) {

  let config = {}
  let components = {}
  let newCompsPaths = {}
  let waitToDeleteNodes = []

  initAstResolveApis(apis)

  const visitor = {

    // 解析wpy文件类型: [app|page|component]
    // VariableDeclarator(_path) {
    //   const { init } = _path.node
    //   if (init && init.arguments && init.arguments[0]) {
    //     const { object, property } = init.arguments[0]
    //     if (
    //       safeGet(object, 'object.object.name') === '_wepy2'
    //       && object.property.name === 'default'
    //     ) {
    //       const fileType = property.name
    //       // 获取wepy文件类型
    //       apis.getWepyFileType(fileType)
    //     }
    //   }
    // },

    MemberExpression(_path) {
      const { object, property } = _path.node
      if (
        safeGet(object, 'object.object.name') === '_wepy2'
        && safeGet(object, 'object.property.name') === 'default'
        && ['app', 'page', 'component'].includes(property.name)
      ) {
        const fileType = property.name
        // console.log('filetype');
        // console.log(fileType);
        // 获取wepy文件类型
        apis.getWepyFileType(fileType)
      }
    },

    ExpressionStatement(path) {
      const expression = safeGet(path, 'path.node.expression')
      if (expression
        && expression.type === 'AssignmentExpression'
        && expression.right.name
      ) {
        let t
        if (t = safeGet(expression, 'expression.right.name')) {
          // AST中不存在的属性可能会是string类型的undefined
          if (t === 'undefined') return

          // 获取wepy文件body体
          apis.getWepyFileBody(t)
        }
      }
    },

    VariableDeclaration(path) {
      const { declarations, kind } = path.node
      let module
      declarations.forEach(dec => {
        if (
          safeGet(dec, 'dec.init.type') === 'CallExpression'
          && safeGet(dec, 'dec.init.callee.name')
        ) {
          if (dec.init.callee.name === 'require') {
            module = dec.init.arguments[0].value
            const requireExpression = dec.init.arguments[0].value
            /* k: 组件路径 v: 组件名 */
            newCompsPaths[
              dec.id.name
              // dec.id.name.replace(/^\_/, '')
            ] = requireExpression
            
            /* 判断是否需要移除该require节点 */
            if (
              requireExpression.replace('.wpy', '')
              && apis.removeRequireNode(requireExpression.replace('.wpy', ''))
            ) {
              waitToDeleteNodes.push(dec.id.name)
              return path.remove()
            }
            
            /* 移除引入的wpy.component */
            if (apis.removeComponent()) {
              if (module.includes('components/')) {
                path.remove()
              }
            }
          } else {
            // newCompsPaths = [{_kcLoading: '@/xxx/'}]
            // waitToDeleteNodes = ['_kcLoading', '']
            // methodParam = '_kcLoading'
            // dec.id.name = '_kcLoading2'
            if (waitToDeleteNodes.length) {
              const methodParam = dec.init.arguments[0].name
              if (waitToDeleteNodes.includes(methodParam)) {
                newCompsPaths[dec.id.name] = newCompsPaths[methodParam]
                delete newCompsPaths[methodParam]
                path.remove()
              }
            }
          }
        }
      })
    },

    CallExpression(_path) {
      const { callee, arguments } = _path.node
      if (callee.name === 'require') {
        const depName = arguments[0].value

        // 收集require依赖
        apis.collectAllRequire(depName)

        // 替换require依赖路径
        arguments[0].value = apis.replaceRequirePath(depName)
      }

      // 提取wepy中config属性
      collectWepyConfig(_path, config)

      // 提取wepy中components属性
      const wepyComps = collectWepyComponents(_path)
      if (Object.keys(wepyComps).length) {
        components = wepyComps
      }
    },
  }
  let cache = babel.transform(
    code,
    {
      presets: [
        ["es2015", { "loose": false }],
        "stage-1"
      ],
      plugins: [  
        ["transform-decorators-legacy"],
        ["transform-class-properties", { "spec": true }],
      ]
    }
  )
  let t = babel.transform(
    cache.code,
    {
      plugins: [  
        { visitor: visitor },
      ]
    }
  )
  
  // 收集wepy文件config
  apis.collectWepyConfig(config)

  replaceCompsPath(components, newCompsPaths)
  
  // 收集wepy文件声明的components
  apis.collectWepyComponents(components)

  return t
}


/**
 * 替换components的编译后路径
 * 
 * @param {*} components 
 * @param {*} newCompsPaths 
 */
function replaceCompsPath(components, newCompsPaths) {
  const firstLower = (str) => str.replace(/^\w/, (s) => s.toLowerCase())
  let upperNewCompsPaths = {}

  Object.entries(newCompsPaths).forEach(([key, value]) => {
    upperNewCompsPaths[key.toLowerCase()] = value
  })
  Object.keys(components).forEach(comp => {
    let lowerComp = components[comp].toLowerCase()
    // hacker处理
    if (!(lowerComp in upperNewCompsPaths)) {
      const matchPath = Object.values(upperNewCompsPaths).find(com => new RegExp(`${comp}$`).test(com))
      components[comp] = matchPath
    } else {
      components[comp] = upperNewCompsPaths[lowerComp]
    }
  })
}