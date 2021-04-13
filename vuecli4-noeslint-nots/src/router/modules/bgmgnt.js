const departmentManage = () => import('@/components/department/departmentManage')   //部门管理列表
const staffManage = () => import('@/components/staff/staffManage')
const roleManage = () => import('@/components/role/roleManage')

export const homeRouter = [
  {
    path: '/department',
    name: 'department',
    component: departmentManage,
    meta: { title: '部门管理', auth: true }
  },
  {
    path: '/staff',
    name: 'staff',
    component: staffManage,
    meta: { title: '人员管理', auth: true }
  },
  {
    path: '/role',
    name: 'role',
    component: roleManage,
    meta: { title: '角色管理', auth: true }
  }
]
