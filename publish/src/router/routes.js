import moduleRouter from './modules'
// 除菜单之外的路由
const otherRouter = [
    {
        path: '*',
        redirect: '/index',
    }
]
var allModules = moduleRouter.concat(otherRouter)
export const routes = allModules
