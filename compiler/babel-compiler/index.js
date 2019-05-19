/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-18 23:27:41 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-19 12:50:22
 */
const babel = require('babel-core')

module.exports = function (code, visitor) {
  try {
    let t = babel.transform(code, {
      presets: [
        ["es2015", { "loose": false }],

        "stage-1"
      ],
      plugins: visitor ? [  
          ["transform-decorators-legacy"],
          
          { visitor },

          ["transform-class-properties", { "spec": true }],

      ] : [  
        ["transform-decorators-legacy"],
        
        ["transform-class-properties", { "spec": true }],

      ]
    })
    // console.log(t.code);
    return t
  } catch (error) {
    console.log(`babel-compiler error`, error);
  }
}