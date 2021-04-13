// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/main.css'
import './assets/css/elementChange.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import pubfunc from './assets/js/public'
import api from './api'
import publicUnit from './unit'
Vue.use(router)
Vue.use(ElementUI)
Vue.use(publicUnit)
Vue.config.productionTip = false
Vue.prototype.$pubfunc=pubfunc
Vue.prototype.$api=api

/* eslint-disable no-new */
// 省略小数点宽度
Vue.directive('setwidth', {
  inserted: function (el, binding, vnode) {
    el.style.width=el.offsetWidth+'px';
  }
})
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
