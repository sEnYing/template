import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes'
import store from '@/store'
// import pubfunc from '@/assets/js/public'
// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

let routers=new Router({
    mode:'history',
    routes
})
// 根据路由设置标题
routers.beforeEach((to, from, next) => {
    /*路由发生改变修改页面的title */
    if(to.meta.title) {
        document.title = '前端开发规范-'+to.meta.title
    }else{
        document.title = '前端开发规范'
    }
    // 路由验证权限
    if(to.meta.auth){
        let userInfo=store.state.userInfo;
        if(userInfo){
            if(store.state.token&&((!to.meta.pname&&userInfo.modules.indexOf(to.name)===-1)||(to.meta.pname&&userInfo.modules.indexOf(to.meta.pname)===-1))){
                return next('/');
            }
        }
    }
    next();
})
routers.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if(isChunkLoadFailed){
    	// 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
        location.reload();
        // const targetPath = $router.history.pending.fullPath;
        // $router.replace(targetPath);
    }
    
});
export default routers
