import Vue from 'vue'
import VueRouter from 'vue-router'
import helloWord from '../components/HelloWorld.vue'
import Main from '../components/Main'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'helloword',
    component: helloWord,
    children:[{
      path:'',
      component: Main
    }]
  },
  // {
    // path: '/about',
    // name: 'about',
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
