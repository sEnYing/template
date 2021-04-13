import ajax from '../../ajax'
import qs from 'qs'

var ajaxFn = {
  async init(m, u, d, cb, a, pro, download, ct) {
    u = 'service/supplier/' + u;
    if (a) {
      let res = await ajax(m, u, d, false, true);
      // console.log(res)
      return res
    } else {
      ajax(m, u, d, res => {
        if (cb) { cb(res); }
      },
        a,
        pro,
        download,
        ct)
    }
  },
  getList(data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  add(data, cb) {
    this.init('post', 'add', data, cb, false)
  },
  update(data, cb) {
    this.init('post', 'update', data, cb, false)
  },
  detail(data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  delete(data, cb) {
    this.init('get', 'delete', data, cb, false)
  },
  assessStandard(data, cb) { // 获取评审标准
    this.init('get', 'assessStandard', data, cb, false)
  },
  saveAssessStandard(data, cb) { // 保存/发布评审标准
    this.init('post', 'saveAssessStandard', data, cb, false)
  },
  assessLevelDropDown(data, cb) { // 供应商管理仪表盘获取评审等级下拉框
    this.init('get', 'assessLevelDropDown', data, cb, false)
  },
}

export default ajaxFn
