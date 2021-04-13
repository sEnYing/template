import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/main.css";
import "./assets/css/public.css";
import "./assets/css/theme/colors.css";
import "./assets/css/theme/default.css";
import "./assets/css/elementChange.css";

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
