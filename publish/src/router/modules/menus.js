export const homeRouter = [
    {
        path: '/index',
        name: 'index',
        component:() => import('@/components/index'),
        meta:{title:'',auth:false},//auth 为权限验证，title 为页面title
    },
    {
        path: '/other',
        name: 'other',
        component:() => import('@/components/other'),
        meta:{title:'',auth:false},
    },
    {
        path: '/function',
        name: 'function',
        component:() => import('@/components/function'),
        meta:{title:'',auth:false},
    },
    {
        path: '/socket',
        name: 'socket',
        component:() => import('@/components/socket'),
        meta:{title:'',auth:false},
    },
    {
        path: '/video',
        name: 'video',
        component:() => import('@/components/video'),
        meta:{title:'',auth:false},
    },
]
