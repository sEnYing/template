import ajax from '../../ajax'

var ajaxFn = {
  async init (m, u, d, cb, a) {
    u = 'bgmgnt/staff/' + u;
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
  getList (data, cb) {
    this.init('get', 'list', data, cb, false)
  },
  add (data, cb) {
    this.init('post', 'add', data, cb, false)
  },
  update (data, cb) {
    this.init('post', 'update', data, cb, false)
  },
  getDetail (data, cb) {
    this.init('get', 'detail', data, cb, false)
  },
  changestate (data, cb) {
    this.init('post', 'changestate', data, cb, false)
  },
  getdefaultpass (cb) {
    this.init('get', 'getdefaultpass', {}, cb, false)
  },
  resetpass (data, cb) {
    this.init('post', 'resetpass', data, cb, false)
  },
  bindrole (data, cb) {
    this.init('post', 'bindrole', data, cb, false)
  },
  getstaffTreeData (data, cb) {
    this.init('get', 'treelist', data, cb, false)
  },
  delete (data, cb) {
    this.init('get', 'delete', data, cb, false)
  }
}

export default ajaxFn
