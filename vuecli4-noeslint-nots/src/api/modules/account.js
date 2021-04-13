import ajax from '../ajax'

var ajaxFn = {
  async init (m, u, d, cb, a) {
    u = 'account/' + u;
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
  getVerifyCode (data, cb) {
    this.init('GET', 'getverifycode', data, cb, false)
  },
  login (data, cb) {
    this.init('post', 'login', data, cb, false)
  },
  logout (cb) {
    this.init('get', 'logout', {}, cb, false)
  },
  async getInfo () {
    return await this.init('get', 'getInfo', {}, false, true)
  },
  changepass (data, cb) {  //修改密码
    this.init('post', 'changepass', data, cb)
  },
}

export default ajaxFn
