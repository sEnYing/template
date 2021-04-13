const home = () => import('@/components/home') //首页
const homeLeader = () => import('@/components/homeLeader') //首页
const customerManage = () => import('@/components/customer/customerManage') //客户列表
const customerForm = () => import('@/components/customer/customerForm') //客户表单
const supplierManage = () => import('@/components/supplier/supplierManage') //供应商列表
const supplierForm = () => import('@/components/supplier/supplierForm') //供应商表单
const supplierConfig = () => import('@/components/supplier/config') //供应商评审标准配置
const manufacturerManage = () =>
  import('@/components/manufacturer/manufacturerManage') //厂商列表
const manufacturerForm = () =>
  import('@/components/manufacturer/manufacturerForm') //厂商表单
const contactManage = () => import('@/components/contact/contactManage') //联系人列表
const visitPlan = () => import('@/components/visit/visitPlan') //拜访计划列表
const visitPlanForm = () => import('@/components/visit/visitPlanForm') //拜访计划表单
const visitRecord = () => import('@/components/visit/visitRecord') //拜访记录列表
const visitRecordForm = () => import('@/components/visit/visitRecordForm') //拜访记录表单
const salestarget = () => import('@/components/salestarget/salestarget') //年度任务额
const workreport = () => import('@/components/weekreport/weekreport') //工作报告
const workreportForm = () => import('@/components/weekreport/weekreportForm') //工作报告
const project = () => import('@/components/project/project') //项目列表
const projectAdd = () => import('@/components/project/projectAdd') //项目新建
const projectForm = () => import('@/components/project/projectForm') //项目修改查看
const message = () => import('@/components/message') //消息列表
const salesBehavior = () => import('@/components/stat/salesBehavior') //销售行为仪表盘
const salesPerformance = () => import('@/components/stat/salesPerformance') //销售业绩仪表盘
const salesFunnel = () => import('@/components/stat/salesFunnel') //销售漏斗
const salesManage = () => import('@/components/stat/salesManage') //销售管理仪表盘
const suppliermanagement = () => import('@/components/stat/supplierManage') // 供应商管理仪表盘
const myApproval = () => import('@/components/Approval/myApproval') //我的审批
const myApply = () => import('@/components/applyFor/myApplyFor') //我的申请
const resourceProcess = () => import('@/components/applyFor/resourceProcess') // 资源申请流程
const IDCproject = () => import('@/components/IDCproject/IDCproject') //IDC项目列表
const IDCprojectAdd = () => import('@/components/IDCproject/IDCprojectAdd') //IDC项目新建
const IDCprojectForm = () => import('@/components/IDCproject/IDCprojectForm') //IDC目修改查看
const systemUsageStat = () => import('@/components/dataexport/systemUsageStat') //数据导出-系统使用情况

export const homeRouter = [
  {
    path: '/main',
    name: 'main',
    component: home,
    meta: { title: '', auth: true },
  },
  {
    path: '/mainleader',
    name: 'mainleader',
    component: homeLeader,
    meta: { title: '', auth: true },
  },
  {
    path: '/customer',
    name: 'customer',
    component: customerManage,
    meta: { title: '客户管理', auth: true },
  },
  {
    path: '/customer/add',
    name: 'customerAdd',
    component: customerForm,
    meta: { title: '客户管理', pname: 'customer', auth: true },
  },
  {
    path: '/customer/edit/:customerId',
    name: 'customerEdit',
    component: customerForm,
    meta: { title: '客户管理', pname: 'customer', auth: true },
  },
  {
    path: '/customer/view/:customerId',
    name: 'customerView',
    component: customerForm,
    meta: { title: '客户管理', pname: 'customer', auth: true },
  },
  {
    path: '/supplier',
    name: 'supplier',
    component: supplierManage,
    meta: { title: '供应商管理', auth: true },
  },
  {
    path: '/supplier/add',
    name: 'supplierAdd',
    component: supplierForm,
    meta: { title: '供应商管理', pname: 'supplier', auth: true },
  },
  {
    path: '/supplier/edit/:supplierId',
    name: 'supplierEdit',
    component: supplierForm,
    meta: { title: '供应商管理', pname: 'supplier', auth: true },
  },
  {
    path: '/supplier/config',
    name: 'supplierConfig',
    component: supplierConfig,
    meta: { title: '供应商管理', pname: 'supplier', auth: true },
  },
  {
    path: '/supplier/view/:supplierId',
    name: 'supplierView',
    component: supplierForm,
    meta: { title: '供应商管理', pname: 'supplier', auth: true },
  },
  {
    path: '/contact',
    name: 'contact',
    component: contactManage,
    meta: { title: '联系人管理', auth: true },
  },
  {
    path: '/contact/customerAdd',
    name: 'contactCustomerAdd',
    component: customerForm,
    meta: { title: '联系人管理', pname: 'contact', auth: true },
  },
  {
    path: '/contact/supplierAdd',
    name: 'contactSupplierAdd',
    component: supplierForm,
    meta: { title: '联系人管理', pname: 'contact', auth: true },
  },
  {
    path: '/visitplan',
    name: 'visitplan',
    component: visitPlan,
    meta: { title: '拜访管理', pname: 'visit', auth: true },
  },
  {
    path: '/visitplan/add',
    name: 'visitplanAdd',
    component: visitPlanForm,
    meta: { title: '拜访管理', pname: 'visitplan', auth: true },
  },
  {
    path: '/visitplan/edit/:planId',
    name: 'visitplanEdit',
    component: visitPlanForm,
    meta: { title: '拜访管理', pname: 'visitplan', auth: true },
  },
  {
    path: '/visitplan/view/:planId',
    name: 'visitplanView',
    component: visitPlanForm,
    meta: { title: '拜访管理', pname: 'visitplan', auth: true },
  },
  {
    path: '/visitrecord',
    name: 'visitrecord',
    component: visitRecord,
    meta: { title: '拜访管理', pname: 'visit', auth: true },
  },
  {
    path: '/visitrecord/add',
    name: 'visitrecordAdd',
    component: visitRecordForm,
    meta: { title: '拜访管理', pname: 'visitrecord', auth: true },
  },
  {
    path: '/visitrecord/edit/:recordId',
    name: 'visitrecordEdit',
    component: visitRecordForm,
    meta: { title: '拜访管理', pname: 'visitrecord', auth: true },
  },
  {
    path: '/visitrecord/view/:recordId',
    name: 'visitrecordView',
    component: visitRecordForm,
    meta: { title: '拜访管理', pname: 'visitrecord', auth: true },
  },
  {
    path: '/visitrecord/edit/:recordId',
    name: 'visitrecordEdit',
    component: visitRecordForm,
    meta: { title: '拜访管理', pname: 'visitrecord', auth: true },
  },
  {
    path: '/manufacturer',
    name: 'manufacturer',
    component: manufacturerManage,
    meta: { title: '厂商资源', auth: true },
  },
  {
    path: '/manufacturer/add',
    name: 'manufacturerAdd',
    component: manufacturerForm,
    meta: { title: '厂商资源', pname: 'manufacturer', auth: true },
  },
  {
    path: '/manufacturer/edit/:manufacturerId',
    name: 'manufacturerEdit',
    component: manufacturerForm,
    meta: { title: '厂商资源', pname: 'manufacturer', auth: true },
  },
  {
    path: '/manufacturer/view/:manufacturerId',
    name: 'manufacturerView',
    component: manufacturerForm,
    meta: { title: '厂商资源', pname: 'manufacturer', auth: true },
  },
  {
    path: '/salestarget',
    name: 'salestarget',
    component: salestarget,
    meta: { title: '年度任务额', auth: true },
  },
  {
    path: '/workreport',
    name: 'workreport',
    component: workreport,
    meta: { title: '工作报告', auth: true },
  },
  {
    path: '/workreport/add/:time',
    name: 'workreportAdd',
    component: workreportForm,
    meta: { title: '工作报告', pname: 'workreport', auth: true },
  },
  {
    path: '/workreport/addNext/:reportId',
    name: 'workreportAddNext',
    component: workreportForm,
    meta: { title: '工作报告', pname: 'workreport', auth: true },
  },
  {
    path: '/workreport/edit/:reportId',
    name: 'workreportEdit',
    component: workreportForm,
    meta: { title: '工作报告', pname: 'workreport', auth: true },
  },
  {
    path: '/workreport/view/:reportId',
    name: 'workreportView',
    component: workreportForm,
    meta: { title: '工作报告', pname: 'workreport', auth: true },
  },
  {
    path: '/project',
    name: 'project',
    component: project,
    meta: { title: '项目管理', auth: true },
  },
  {
    path: '/project/add',
    name: 'projectAdd',
    component: projectAdd,
    meta: { title: '项目管理', pname: 'project', auth: true },
  },
  {
    path: '/project/view/:projId',
    name: 'projectBackView',
    component: projectAdd,
    meta: { title: '项目管理', pname: 'project', auth: true },
  },
  {
    path: '/project/backfill/:projId',
    name: 'projectBack',
    component: projectAdd,
    meta: { title: '项目管理', pname: 'project', auth: true },
  },
  {
    path: '/project/edit/:projId',
    name: 'projectEdit',
    component: projectForm,
    meta: { title: '项目管理', pname: 'project', auth: true },
  },
  {
    path: '/project/detail/:projId',
    name: 'projectView',
    component: projectForm,
    meta: { title: '项目管理', pname: 'project', auth: true },
  },
  {
    path: '/message',
    name: 'message',
    component: message,
    meta: { title: '我的消息', auth: false },
  },
  {
    path: '/salesperformance',
    name: 'salesperformance',
    component: salesPerformance,
    meta: { title: '销售业绩仪表盘', auth: true },
  },
  {
    path: '/salesbehavior',
    name: 'salesbehavior',
    component: salesBehavior,
    meta: { title: '销售行为仪表盘', auth: true },
  },
  {
    path: '/salesfunnel',
    name: 'salesfunnel',
    component: salesFunnel,
    meta: { title: '销售漏斗', auth: true },
  },
  {
    path: '/salesmanagement',
    name: 'salesmanagement',
    component: salesManage,
    meta: { title: '销售管理仪表盘', auth: true },
  },
  {
    path: '/suppliermanagement',
    name: 'suppliermanagement',
    component: suppliermanagement,
    meta: { title: '供应商管理仪表盘', auth: true },
  },
  {
    path: '/myapply',
    name: 'myapply',
    component: myApply,
    meta: { title: '我的申请', auth: true },
  },
  {
    path: '/myapply/resourceProcess',
    name: 'resourceProcess',
    component: resourceProcess,
    meta: { title: '项目资源及费用流程', pname: 'myapply', auth: true },
  },
  {
    path: '/myapprove',
    name: 'myapprove',
    component: myApproval,
    meta: { title: '我的审批', auth: true },
  },
  {
    path: '/myapprove/resourceProcess',
    name: 'resourceProcess',
    component: resourceProcess,
    meta: { title: '项目资源及费用流程', pname: 'myapprove', auth: true },
  },
  {
    path: '/idcproject',
    name: 'idcproject',
    component: IDCproject,
    meta: { title: 'IDC项目管理', auth: true },
  },
  {
    path: '/idcproject/add',
    name: 'IDCProjectAdd',
    component: IDCprojectAdd,
    meta: { title: 'IDC项目管理', pname: 'idcproject', auth: true },
  },
  {
    path: '/idcproject/view/:projId',
    name: 'IDCProjectBackView',
    component: IDCprojectAdd,
    meta: { title: 'IDC项目管理', pname: 'idcproject', auth: true },
  },
  {
    path: '/idcproject/detail/:projId',
    name: 'IDCProjectView',
    component: IDCprojectForm,
    meta: { title: 'IDC项目管理', pname: 'idcproject', auth: true },
  },
  {
    path: '/idcproject/backfill/:projId',
    name: 'IDCProjectBack',
    component: IDCprojectAdd,
    meta: { title: 'IDC项目管理', pname: 'idcproject', auth: true },
  },
  {
    path: '/idcproject/edit/:projId',
    name: 'IDCProjectEdit',
    component: IDCprojectForm,
    meta: { title: 'IDC项目管理', pname: 'idcproject', auth: true },
  },
  {
    path: '/systemUsageStat',
    name: 'systemUsageStat',
    component: systemUsageStat,
    meta: { title: '系统使用情况', auth: true },
  },
]
