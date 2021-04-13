import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/idcproject/' + u
    if (a) {
      let res = await ajax(m, u, d, false, true)
      // console.log(res)
      return res
    } else {
      ajax(m, u, d, (res) => {
        if (cb) {
          cb(res)
        }
      })
    }
  },
  getIDCProject(data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  delIDCProject(data, cb) {
    this.init('get', 'delete', data, cb, false)
  },
  saveproposal(data, cb) {
    this.init('post', 'saveproposal', data, cb, false)
  },
  savevisitandtest(data, cb) {
    this.init('post', 'savevisitandtest', data, cb, false)
  },
  savetender(data, cb) {
    this.init('post', 'savetender', data, cb, false)
  },
  savesign(data, cb) {
    this.init('post', 'savesign', data, cb, false)
  },
  getDetail(data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  share(data, cb) {
    this.init('post', 'share', data, cb, false)
  },
  transfer(data, cb) {
    this.init('post', 'transfer', data, cb, false)
  },
  amountallot(data, cb) {
    this.init('post', 'amountallot', data, cb, false)
  },
  savecommitconfirm(data, cb) {
    this.init('post', 'savecommitconfirm', data, cb, false)
  },
  idcroomlist(data, cb) {
    this.init('get', 'idcroomlist', data, cb, false)
  },
}

export default ajaxFn
