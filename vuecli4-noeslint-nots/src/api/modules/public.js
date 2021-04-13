import ajax from '../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
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
  dict(data, cb) {
    this.init('get', 'dict/getcodelist', data, cb, false)
  },
  region(data, cb) {
    this.init('get', 'region/list', data, cb, false)
  },
  customer(cb) {
    this.init('get', 'service/customer/dropdown', {}, cb, false)
  },
  supplier(cb) {
    this.init('get', 'service/supplier/dropdown', {}, cb, false)
  },
  manufacturer(cb) {
    this.init('get', 'service/manufacturer/dropdown', {}, cb, false)
  },
  project(data, cb) {
    this.init('get', 'service/project/dropdown', data, cb, false)
  },
  customerCont(data, cb) {
    this.init('get', 'service/contact/customer/dropdown', data, cb, false)
  },
  supplierCont(data, cb) {
    this.init('get', 'service/contact/supplier/dropdown', data, cb, false)
  },
  depmgnt(cb) {
    this.init('get', 'bgmgnt/dep/treelist', {}, cb)
  },
  role(data, cb) {
    this.init('get', 'bgmgnt/role/list', data, cb, false)
  },
  uploadFile(data, cb) {
    var formData = new FormData()
    for (var key in data) {
      formData.append(key, data[key])
    }
    this.init('post', 'service/file/upload', formData, cb, false)
  },
  uploadDelete(data, cb) {
    this.init('post', 'service/file/delete', data, cb, false)
  },
  getImg(data, cb) {
    this.init('post', 'service/file/img', data, cb, false)
  }
}

export default ajaxFn
