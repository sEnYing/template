import ajax from '../../ajax'

var ajaxFn = {
  async init(m, u, d, cb, a) {
    u = 'service/stat/' + u
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
  visittimesrank(data, cb) {
    //周客户拜访量排名
    this.init('get', 'visittimesrank', data, cb, false)
  },
  yearsignamountstat(data, cb) {
    //销售人员业绩-签约额统计
    this.init('get', 'yearsignamountstat', data, cb, false)
  },
  teamsignamountstat(data, cb) {
    //销售团队业绩-签约额统计
    this.init('get', 'teamsignamountstat', data, cb, false)
  },
  yearsignamountlist(data, cb) {
    //销售人员业绩-签约额报表
    this.init('get', 'yearsignamountlist', data, cb, false)
  },
  teamsignamountlist(data, cb) {
    //销售团队业绩-签约额报表
    this.init('get', 'teamsignamountlist', data, cb, false)
  },
  pipelinealllist(data, cb) {
    //Pipeline项目汇总报表
    this.init('get', 'pipelinealllist', data, cb, false)
  },
  pipelineprojlist(data, cb) {
    //Pipeline项目报表
    this.init('get', 'pipelineprojlist', data, cb, false)
  },
  pipelineidcprojlist(data, cb) {
    //PipelineIDC项目报表
    this.init('get', 'pipelineidcprojlist', data, cb, false)
  },
  commitalllist(data, cb) {
    //commit项目汇总报表
    this.init('get', 'commitalllist', data, cb, false)
  },
  commitprojlist(data, cb) {
    //commit项目报表
    this.init('get', 'commitprojlist', data, cb, false)
  },
  commitidcprojlist(data, cb) {
    //commit项目IDC报表
    this.init('get', 'commitidcprojlist', data, cb, false)
  },
  signalllist(data, cb) {
    //签约项目汇总报表
    this.init('get', 'signalllist', data, cb, false)
  },
  signprojlist(data, cb) {
    //签约项目报表
    this.init('get', 'signprojlist', data, cb, false)
  },
  signidcprojlist(data, cb) {
    //签约IDC项目报表
    this.init('get', 'signidcprojlist', data, cb, false)
  },
  tenderprojlist(data, cb) {
    //投标项目报表
    this.init('get', 'tenderprojlist', data, cb, false)
  },
  tenderalllist(data, cb) {
    //投标项目汇总报表
    this.init('get', 'tenderalllist', data, cb, false)
  },
  tenderidcprojlist(data, cb) {
    //投标项目IDC报表
    this.init('get', 'tenderidcprojlist', data, cb, false)
  },
  projstagestat(cb) {
    //各阶段项目数量统计
    this.init('get', 'projstagestat', {}, cb, false)
  },
  idcprojstagestat(cb) {
    //idc各阶段项目数量统计
    this.init('get', 'idcprojstagestat', {}, cb, false)
  },
  projstagedetail(data, cb) {
    //项目阶段详细数据
    this.init('get', 'projstagedetail', data, cb, false)
  },
  idcprojstagedetail(data, cb) {
    //idc项目阶段详细数据
    this.init('get', 'idcprojstagedetail', data, cb, false)
  },
  projResourceDetail(data, cb) { // 销售管理仪表盘列表
    this.init('get', 'projResourceDetail', data, cb, false)
  },
  supplierAssess(data, cb) { // 供应商管理仪表盘列表
    this.init('get', 'supplierAssess', data, cb, false)
  },
  exportSupplierAssess(data, cb) { // 供应商管理仪表盘导出
    this.init('get', 'exportSupplierAssess', data, cb, false)
  },

}

export default ajaxFn
