/*
 * @Descripttion:
 * @Author: SongEnYing
 * @Date: 2021-02-04 15:31:37
 * @LastEditors: SongEnYing
 * @LastEditTime: 2021-02-05 14:23:55
 */
import Vue from "vue";
import Router from "vue-router";
import routes from "@/router/routes.ts";
import { getToken } from "@/utils/auth";
import { judgeLink } from "@/utils/utils";
import store from "../store";
Vue.use(Router);

const createRouter: Router | any = () =>
  new Router({
    // mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }) as any,
    routes,
    mode: "history", // require service support
    base: '',
  });

const router: Router | any = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
  router.replace("/login");
}
router.beforeEach((to: any, from: any, next: any) => {
  let token = getToken();
  if (to.meta.title) {
    document.title = `-${to.meta.title}`;
  } else {
    document.title = "";
  }
  // 系统间跳转 传递token
  if (to.query.token && to.query.token !== 1) {
    token = to.query.token;
    // console.log(token);
    localStorage.setItem("token", to.query.token);
    localStorage.setItem("loginName", to.query.username);
    store.commit("user/SET_TOKEN", to.query.token);
    store.commit("user/SET_NAME", to.query.username);
    return next(to.path);
  }
  // 无token直接跳转登录页
  if (!token && to.path !== "/login") {
    return next("/login");
  }

  // 路由验证权限
  if (!judgeLink(to, next)) {
    return;
  }

  next();
});

const routerPush: any = Router.prototype.push;
Router.prototype.push = function push(location: any) {
  return routerPush.call(this, location).catch((error: any) => error);
};

export default router;
