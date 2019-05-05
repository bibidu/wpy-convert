/*
 * @Author: kc.duxianzhang 
 * @Date: 2019-05-05 18:38:21 
 * @Last Modified by: kc.duxianzhang
 * @Last Modified time: 2019-05-05 19:03:35
 */
require('babel-polyfill')
const less2css = require('./style/less2css')
const tpl2obj = require('./template/tpl2obj')


// test

let node = `<template>
<view class="mask" wx:if='{{show}}' @tap.stop='tap1' @touchmove.stop='move1'>
  <view class="modal-wrap" style="height:{{status===2?hasMobile&&!edit?'766rpx':'938rpx':'736rpx'}}">
      <view wx:if='{{status === 2}}'>
        <view class='input-wrap' wx:if='{{!hasMobile || edit}}'>
          <input type="number" class='input' placeholder='请填写手机号' maxlength='11' value='{{mobile}}' @input='changeMobile' style="border:2rpx solid {{color}};border-right:none;" />
          <view class='submit' @tap='submit'>提交</view>
        </view>
      </view>
    </view>
  </view>
</view>
</template>`


let rst = tpl2obj(node)
console.log('rst');
console.log(rst);