/*
 * @Descripttion:
 * @Author: SongEnYing
 * @Date: 2021-02-04 16:46:14
 * @LastEditors: SongEnYing
 * @LastEditTime: 2021-02-04 17:59:48
 */
import moduleRouter from "./modules";
// 除菜单之外的路由
const otherRouter: any[] = [

  {
    path: "",
    meta: {
      title: "项目架构",
    },
    redirect: "/reception",
  },
  {
    path: "/login",
    component: () => import("@/pages/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/reception",
    component: () => import("@/pages/reception_view/reception.vue"),
    meta: {
      title: "reception",
    },
  },

];
const allModules = otherRouter.concat(moduleRouter).concat({
  path: "*",
  redirect: "/",
});
export default allModules;
