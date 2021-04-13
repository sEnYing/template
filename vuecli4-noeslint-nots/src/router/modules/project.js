// const projectResource = () => import(/* webpackChunkName: 'projectResource' */ '@/components/projectResource/projectResource') // 项目资源及费用管理
const addResource = () => import(/* webpackChunkName: 'addResource' */ '@/components/projectResource/addResource') // 新增项目资源及费用管理
const resourceDetail = () => import(/* webpackChunkName: 'resourceDetail' */ '@/components/projectResource/resourceDetail') // 项目资源及费用管理详情

export const homeRouter = [
  // {
  //   path: '/resource',
  //   name: 'resource',
  //   component: projectResource,
  //   meta: { title: '', auth: true },
  // },
  {
    path: '/addResource',
    name: 'addResource',
    component: addResource,
    meta: { title: '新建项目资源及费用流程', pname: 'project', auth: true },
  },
  {
    path: '/resourceDetail',
    name: 'resourceDetail',
    component: resourceDetail,
    meta: { title: '新项目资源及费用流程详情', pname: 'project', auth: true },
  },
]