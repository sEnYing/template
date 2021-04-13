import moduleRouter from './modules'
// 除菜单之外的路由
const otherRouter = [
    {
        path: '/',
        name: 'index',
        component:() => import('@/components/index'),
        meta:{title:'',auth:false},
    },{
        path: '*',
        redirect: '/',
    }
]
var allModules = moduleRouter.concat(otherRouter)
export const routes = allModules
