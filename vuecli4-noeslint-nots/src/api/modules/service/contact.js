import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/contact/' + u;
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
  customerTel(data, cb) {
    this.init('get', 'customer/dropdown', data, cb, false)
  },
  customerShare(data, cb) {
    this.init('post', 'customer/share', data, cb, false)
  },
  customerList(data, cb) {
    this.init('get', 'customer/list', data, cb, false)
  },
  customerAdd(data, cb) {
    this.init('post', 'customer/add', data, cb, false)
  },
  customerUpdate(data, cb) {
    this.init('post', 'customer/update', data, cb, false)
  },
  customerDelete(data, cb) {
    this.init('get', 'customer/delete', data, cb, false)
  },
  supplierList(data, cb) {
    this.init('get', 'supplier/list', data, cb, false)
  },
  supplierAdd(data, cb) {
    this.init('post', 'supplier/add', data, cb, false)
  },
  supplierUpdate(data, cb) {
    this.init('post', 'supplier/update', data, cb, false)
  },
  supplierDelete(data, cb) {
    this.init('get', 'supplier/delete', data, cb, false)
  },
  supplierImport(data, cb) { //导入供应商联系人
    this.init('post', 'supplier/import', data, cb, false)
  },
  customerImport(data, cb) { //导入客户联系人
    this.init('post', 'customer/import', data, cb, false)
  },
}

export default ajaxFn
