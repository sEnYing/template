import Vue from 'vue'
// 验证为空则显示--
Vue.filter('emptyTxt', (v)=>{
    return v||v===0?v:'--'
})