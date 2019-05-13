// mixins/test.js
import wepy from 'wepy'

let dataFromMixin = {}
export default class TestMixin extends wepy.mixin {
    methods = {
        tap() {
            console.log('mixin tap')
        }
    }
    normalMethod() {
        console.log('i am methods from mixin')
    }
    onLoad() {
    }
}