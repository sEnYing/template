import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/apply/' + u;
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
  update(data, cb) {
    this.init('post', 'update', data, cb, false)
  },
  getBack(data, cb) {
    this.init('get', 'back', data, cb, false)
  },
  getDelete(data, cb) {
    this.init('get', 'delete', data, cb, false)
  },
  getApplyList(data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  getDetail(data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  backResource(data, cb) { // 项目资源及费用申请撤回
    this.init('get', 'backResource', data, cb, false)
  },
  deleteResource(data, cb) { // 删除项目资源费用申请
    this.init('get', 'deleteResource', data, cb, false)
  },
}

export default ajaxFn
