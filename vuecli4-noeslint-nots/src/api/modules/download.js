import ajax from '../ajax'

var ajaxFn = {
  async init(m, u, d, cb) {
    ajax(
      m,
      u,
      d,
      (res) => {
        if (cb) {
          cb(res)
        }
      },
      false,
      false,
      true,
    )
  },
  customerTemplate(cb) {
    //下载客户导入模板
    this.init('get', 'service/customer/template', {}, cb)
  },
  weekreportExport(data, cb) {
    //周报详情导出
    this.init('get', 'service/weekreport/export', data, cb)
  },
  visittimeslistexport(data, cb) {
    //周客户拜访量报表导出
    this.init('get', 'service/stat/visittimeslistexport', data, cb)
  },
  yearsignamountexport(data, cb) {
    //销售人员业绩-签约额导出
    this.init('get', 'service/stat/yearsignamountexport', data, cb, false)
  },
  teamsignamountexport(data, cb) {
    //销售团队业绩-签约额导出
    this.init('get', 'service/stat/teamsignamountexport', data, cb, false)
  },
  pipelineprojexport(data, cb) {
    //Pipeline项目报表导出
    this.init('get', 'service/stat/pipelineprojexport', data, cb)
  },
  pipelineallexport(data, cb) {
    //Pipeline项目汇总报表导出
    this.init('get', 'service/stat/pipelineallexport', data, cb)
  },
  pipelineidcprojexport(data, cb) {
    //Pipeline项目IDC报表导出
    this.init('get', 'service/stat/pipelineidcprojexport', data, cb)
  },

  commitallexport(data, cb) {
    //commit项目汇总报表导出
    this.init('get', 'service/stat/commitallexport', data, cb)
  },
  commitprojexport(data, cb) {
    //commit项目报表导出
    this.init('get', 'service/stat/commitprojexport', data, cb)
  },
  commitidcprojexport(data, cb) {
    //commit项目IDC报表导出
    this.init('get', 'service/stat/commitidcprojexport', data, cb)
  },
  signallexport(data, cb) {
    //签约汇总项目报表导出
    this.init('get', 'service/stat/signallexport', data, cb)
  },
  signprojexport(data, cb) {
    //签约项目报表导出
    this.init('get', 'service/stat/signprojexport', data, cb)
  },
  signidcprojexport(data, cb) {
    //签约IDC项目报表导出
    this.init('get', 'service/stat/signidcprojexport', data, cb)
  },
  tenderprojexport(data, cb) {
    //投标项目报表导出
    this.init('get', 'service/stat/tenderprojexport', data, cb)
  },
  tenderallexport(data, cb) {
    //投标项目汇总报表导出
    this.init('get', 'service/stat/tenderallexport', data, cb)
  },
  tenderidcprojexport(data, cb) {
    //投标项目IDC报表导出
    this.init('get', 'service/stat/tenderidcprojexport', data, cb)
  },
  projstagedetailexport(data, cb) {
    //项目阶段详细数据导出
    this.init('get', 'service/stat/projstagedetailexport', data, cb)
  },
  idcprojstagedetailexport(data, cb) {
    //idc项目阶段详细数据导出
    this.init('get', 'service/stat/idcprojstagedetailexport', data, cb)
  },
  salestargetExport(data, cb) {
    //项目阶段详细数据导出
    this.init('get', 'service/salestarget/export', data, cb)
  },
  projectExport(data, cb) {
    //项目列表数据导出
    this.init('get', 'service/project/export', data, cb, false)
  },
  customerExport(data, cb) {
    //客户列表数据导出
    this.init('get', 'service/customer/export', data, cb, false)
  },
  customerContactExport(data, cb) {
    //客户联系人列表数据导出
    this.init('get', 'service/contact/customer/export', data, cb, false)
  },
  supplierContactExport(data, cb) {
    //供应商联系人列表数据导出
    this.init('get', 'service/contact/supplier/export', data, cb, false)
  },
  visitPlanExport(data, cb) {
    //拜访计划导出
    this.init('get', 'service/visit/plan/export', data, cb, false)
  },
  visitRecordExport(data, cb) {
    //拜访记录导出
    this.init('get', 'service/visit/record/export', data, cb, false)
  },
  idcprojectExport(data, cb) {
    //IDC项目导出
    this.init('get', 'service/idcproject/export', data, cb, false)
  },
  teamWorkPort(data, cb) {
    //团队工作报告全导出
    this.init('get', 'service/weekreport/exportTeamWorkReport', data, cb, false)
  },
  supplierTemplate(data, cb) {
    //供应商管理模板下载
    this.init('get', 'service/supplier/template', data, cb, false)
  },
  supplierFileDownload(data, cb) {
    //供应商资质文件下载
    this.init('get', 'service/file/download', data, cb, false)
  },
  supplierExport(data, cb) {
    //导出供应商及供应商联系人
    this.init('get', 'service/supplier/export', data, cb, false)
  },
  systemUsageStatExport(data, cb) {
    //系统使用情况统计
    this.init('get', 'service/dataexport/systemUsageStat', data, cb, false)
  },
  projResourceExport(data, cb) {
    //项目售前费用汇总表导出
    this.init('get', 'service/stat/projResourceExport', data, cb, false)
  },
  exportSupplierAssess(data, cb) {
    //供应商评审汇总表导出
    this.init('get', 'service/stat/supplierAssessExport', data, cb, false)
  },
  supplierTemplate(data, cb) { //下载供应商联系人导入模板
    this.init('get', 'service/contact/supplier/template', data, cb, false)
  },
  customerTemplate(data, cb) { //下载客户联系人导入模板
    this.init('get', 'service/contact/customer/template', data, cb, false)
  },

}

export default ajaxFn
