import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import axios from './api/index'
import VueAxios from 'vue-axios'
import "reset-css"
// import 'element-ui/lib/theme-chalk/index.css' // 引入样式


Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
