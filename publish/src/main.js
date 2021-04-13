// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/main.css'
import './assets/css/public.css'
import './assets/css/elementChange.css'
import './filter'
import './directive'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import pubfunc from './assets/js/public'
import socket from './assets/js/socket'
import api from './api'
import publicUnit from './unit'
Vue.use(router)
Vue.use(ElementUI)
Vue.use(publicUnit)
Vue.config.productionTip = false
Vue.prototype.$pubfunc=pubfunc
Vue.prototype.$socket=socket
Vue.prototype.$api=api

/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})