import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/approve/' + u;
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
  approve(data, cb) {
    this.init('post', 'approve', data, cb, false)
  },
  getApprovalList(data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  getDetail(data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  approveResource(data, cb) { // 项目资源及费用流程审批、批量审批
    this.init('post', 'approveResource', data, cb, false)
  },

}

export default ajaxFn
