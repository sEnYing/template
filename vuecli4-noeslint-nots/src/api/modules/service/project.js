import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/project/' + u;
    if (a) {
      let res = await ajax(m, u, d, false, true);
      // console.log(res)
      return res
    } else {
      ajax(m, u, d, res => {
        if (cb) { cb(res); }
      })
    }
  },
  getProject(data, cb) {
    this.init('get', 'dropdown', data, cb, false)
  },
  getList(data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  updateList(data, cb) {
    this.init('get', 'updatelist', data, cb, false)
  },
  saveproposal(data, cb) {//立项信息
    this.init('post', 'saveproposal', data, cb, false)
  },
  saverequire(data, cb) {//需求确认信息
    this.init('post', 'saverequire', data, cb, false)
  },
  savetender(data, cb) {//投标信息
    this.init('post', 'savetender', data, cb, false)
  },
  savesign(data, cb) {//签单信息
    this.init('post', 'savesign', data, cb, false)
  },
  savecommitconfirm(data, cb) {//commit确认状态
    this.init('post', 'savecommitconfirm', data, cb, false)
  },
  savetecdifficulty(data, cb) {//核心技术难点
    this.init('post', 'savetecdifficulty', data, cb, false)
  },
  savefeasibility(data, cb) {//技术可行性判断
    this.init('post', 'savefeasibility', data, cb, false)
  },
  detail(data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  updateDetail(data, cb) {
    this.init('get', 'updatedetail', data, cb, false)
  },
  delete(data, cb) {
    this.init('get', 'delete', data, cb, false)
  },
  updatefielddetail(data, cb) {
    this.init('get', 'updatefielddetail', data, cb, false)
  },
  transfer(data, cb) {
    this.init('post', 'transfer', data, cb, false)
  },
  share(data, cb) {
    this.init('post', 'share', data, cb, false)
  },
  amountallot(data, cb) {
    this.init('post', 'amountallot', data, cb, false)
  },
  resourceApply(data, cb) { // 资源费用申请新建
    this.init('post', 'resourceApply', data, cb, false)
  },
  resourceReApply(data, cb) { // 资源费用申请重新提交
    this.init('post', 'resourceReApply', data, cb, false)
  },
  resourceDetail(data, cb) { // 资源费用申请详情
    this.init('get', 'resourceDetail', data, cb, false)
  },
  saveActualCost(data, cb) { // 保存项目实际售前费用
    this.init('post', 'saveActualCost', data, cb, false)
  },
  resourceForm(data, cb) { // 项目资源及费用申请表单
    this.init('get', 'resourceForm', data, cb, false)
  },

}

export default ajaxFn
