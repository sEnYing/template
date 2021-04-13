<template>
  <div class="pipelineTable"
       v-if="tab.list&&tab.list.length>0">
    <div class="exportBtn"
         :style="{'padding-top':tab.list&&tab.list.length>0?'':'0px'}">
      <unit-tab :tab='tab'
                class="tab"
                v-if="tab.list&&tab.list.length>0"
                @click="returnBtn"></unit-tab>
      <div class="null"
           v-if="tab.list&&tab.list.length>0"></div>
      <unit-btn type='large right export'
                text='导出报表'
                @click="exportStat('sign')"></unit-btn>
    </div>
    <div class="formBox pipeline">
      <div>
        <span class="formBox_text">销售</span>
        <div style="margin-left: -26px;">
          <input v-setwidth
                 type="text"
                 v-model="sel.staffName"
                 maxlength="20"
                 placeholder="全部"
                 @keydown.enter="tableOper('select',null)">
        </div>
      </div>
      <div>
        <span class="formBox_text">项目名称</span>
        <div>
          <input v-setwidth
                 type="text"
                 v-model="sel.projName"
                 maxlength="30"
                 placeholder="全部"
                 @keydown.enter="tableOper('select',null)">
        </div>
      </div>
      <div v-if="tab.choose !== '1'">
        <span class="formBox_text">项目类型</span>
        <div>
          <unit-dropdown v-setwidth
                         id="projectType"
                         class="auto"
                         placeholder='全部'
                         :list="tab.choose === '3'?idcprojectType:projectType"
                         @change='dropdownReturn'
                         :result="sel.projType"
                         :clear='true'
                         :input="true"
                         :reset='reset'></unit-dropdown>
        </div>
      </div>
      <div v-if="tab.choose !== '1'">
        <span class="formBox_text">项目阶段</span>
        <div>
          <unit-dropdown v-setwidth
                         id="projectStage"
                         class="auto"
                         placeholder='全部'
                         :list="tab.choose === '3'?idcprojectStage:projectStage"
                         @change='dropdownReturn'
                         :result="sel.projStage"
                         :clear='true'
                         :input="true"
                         :reset='reset'></unit-dropdown>
        </div>
      </div>
      <div class="dropTree">
        <span class="formBox_text">分子公司/所属部门</span>
        <div>
          <unit-tree id="depId"
                     class="auto"
                     v-setwidth
                     :list='depList'
                     :choose="[sel.depId]"
                     :hid='hideTree'
                     @click='hideOther'
                     placeholder='全部'
                     @return='dropdownReturn'
                     :hidedisable='true'
                     :only='true'
                     :expendclick="false"
                     keyid="depId"
                     :must='true'></unit-tree>
        </div>
      </div>
      <div class="btnBox right">
        <unit-btn @click="tableOper('select',null)"
                  text='查询'></unit-btn>
        <unit-btn type='plain'
                  @click="tableOper('clear',null)"
                  text='重置'></unit-btn>
      </div>
    </div>
    <div class="boxTable"
         :class="{'boxTable2':tab.choose !=='1'}">
      <unit-loading :loading='loading'
                    v-if="loading"></unit-loading>
      <unit-table :total='total'
                  :page='page'
                  :smallRel="true"
                  v-if="!loading||list.length>0"
                  :list='list'
                  :title='title'
                  ref='table'
                  :scroll='3000'
                  :dom='dom'
                  :clickrow="'projNo,projName'"
                  @click="tableOper"></unit-table>
      <unit-page :total='total'
                 :page='page'
                 @pagechange="getList"></unit-page>
    </div>
  </div>
  <div v-else
       class="midCont">
    <div class="noData">
      <img src="@/assets/images/noData.png"
           alt=""
           srcset="">
      <h1>暂无权限</h1>
    </div>
  </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
import unitTable from '@/unit/components/element/tableScroll'
import unitTree from '@/unit/components/element/tree'
import unitTime from '@/unit/components/element/timeRange'
export default {
  name: 'sales_commit',
  props: ['dom'],
  components: { unitTab, unitTable, unitTree, unitTime },
  data() {
    return {
      loading: true,
      title: [],
      titleList: {
        all: [
          { key: 'subCompanyName', name: '分子公司', mustwidth: 120 },
          { key: 'depName', name: '所属部门', mustwidth: 120 },
          { key: 'staffName', name: '销售员', mustwidth: 120 },
          { key: 'projNo', name: '项目编号', mustwidth: 150 },
          { key: 'customerName', name: '客户名称', mustwidth: 220 },
          { key: 'customerIndustryTxt', name: '客户行业', mustwidth: 120 },
          { key: 'projName', name: '项目名称', mustwidth: 250 },
          { key: 'projAmount_', name: '项目金额<br/>/预计年合同额（元）', mustwidth: 200 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 120 },
          { key: 'tenderAmount_', name: '中标金额（元）', mustwidth: 120 },
          { key: 'actualSignDate_', name: '实际签约日期', mustwidth: 200 },
          {
            key: 'actualAmount_',
            name: '实际签约金额<br/>/预计签约年合同额（元）',
            width: 200,
          },
          { key: 'remark', name: '备注', width: 500 },
        ],
        system: [
          { key: 'projNo', name: '项目编号', mustwidth: 120 },
          { key: 'projName', name: '项目名称', mustwidth: 250 },
          { key: 'staffName', name: '销售', mustwidth: 120 },
          { key: 'subCompanyName', name: '分子公司', mustwidth: 120 },
          { key: 'depName', name: '所属部门', mustwidth: 120 },
          { key: 'customerName', name: '客户名称', mustwidth: 220 },
          { key: 'industryTxt', name: '客户行业', mustwidth: 150 },
          { key: 'tenderAmount_', name: '中标金额（元）', mustwidth: 200 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 120 },
          { key: 'mainBrand', name: '主要品牌', mustwidth: 300 },
          { key: 'actualSignDate_', name: '实际签约日期', mustwidth: 200 },
          { key: 'actualSignAmount_', name: '实际签约金额（元）', mustwidth: 200},
          { key: 'contractStatusTxt', name: '合同状态', mustwidth: 120 },
          { key: 'remark', name: '备注', width: 500 },
        ],
        IDC: [
          { key: 'subCompanyName', name: '分子公司', mustwidth: 120 },
          { key: 'depName', name: '所属部门', mustwidth: 120 },
          { key: 'staffName', name: '销售员', mustwidth: 120 },
          { key: 'projNo', name: '项目编号', mustwidth: 150 },
          { key: 'customerName', name: '客户名称', mustwidth: 220 },
          { key: 'customerIndustryTxt', name: '客户行业', mustwidth: 150 },
          { key: 'idcRoomTxt', name: '所属机房', mustwidth: 200 },
          { key: 'projName', name: '项目名称', mustwidth: 250 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 120 },
          { key: 'tenderAmount_', name: '中标金额（元）', mustwidth: 200 },
          { key: 'actualSignDate_', name: '实际签约日期', mustwidth: 200 },
          { key: 'estAnnualConAmount_', name: '预计年合同额（元）', mustwidth: 200 },
          { key: 'remark', name: '备注', width: 500 },
        ],
      },
      list: [],
      total: 0,
      page: 1,
      reset: true,
      sel: {
        staffName: '',
        projName: '',
        projType: '',
        projStage: '',
        depId: '',
      },
      selRes: {},
      projectType: [],
      idcprojectType: [],
      projectStage: [],
      idcprojectStage: [],
      depList: [],
      hideTree: false,
      tab: {
        list: [],
        choose: '',
      },
    }
  },
  computed: {
    reload() {
      return this.$store.state.reload
    },
  },
  methods: {
    exportStat(name) {
      this.$emit('dialog', {
        show: true,
        link: 'exportStat',
        title: '导出报表',
        data: { name, param: this.selRes, tab: this.tab.choose },
        small: true,
      })
    },
    hideOther(j) {
      this.hideTree = j ? j : false
    },
    dropdownReturn(item, key, thisItem) {
      switch (key) {
        case 'projectType':
          this.sel.projType = item.value
          break
        case 'projectStage':
          this.sel.projStage = item.value
          break
        case 'depId':
          this.sel.depId = item[0].depId
          break
      }
    },
    getList(page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.limit = 10
      param.page = page
      if (this.tab.list && this.tab.list.length > 0 && !this.tab.choose) {
        this.tab.choose = JSON.parse(JSON.stringify(this.tab.list[0].id))
      }
      this.loading = true
      this.$api.service.stat[
        this.tab.choose === '1'
          ? 'signalllist'
          : this.tab.choose === '2'
          ? 'signprojlist'
          : 'signidcprojlist'
      ](param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            switch (this.tab.choose) {
              case '1':
                this.title = this.titleList.all
                break
              case '2':
                this.title = this.titleList.system
                break
              case '3':
                this.title = this.titleList.IDC
                break
            }
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.estAnnualConAmount_ = v.estAnnualConAmount
                ? this.$pubfunc.transformPrice(v.estAnnualConAmount, true)
                : ''
              v.projAmount_ = v.projAmount
                ? this.$pubfunc.transformPrice(v.projAmount, true)
                : ''
              v.tenderAmount_ = v.tenderAmount
                ? this.$pubfunc.transformPrice(v.tenderAmount, true)
                : ''
              v.actualAmount_ = v.actualAmount
                ? this.$pubfunc.transformPrice(v.actualAmount, true)
                : ''
              v.actualSignAmount_ = v.actualSignAmount
                ? this.$pubfunc.transformPrice(v.actualSignAmount, true)
                : ''
              v.actualSignDate_ = v.actualSignDate
                ? this.$pubfunc.TimeTransform(
                    'YYYY年MM月DD日',
                    v.actualSignDate,
                  )
                : ''
            })
            this.list = list
            break
        }
      })
    },
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          this.tab.choose = k
          this.$pubfunc.setSStorage('tabChoose', k)
          this.sel.projType = ''
          this.sel.projStage = ''
          this.getList(1)
          break
      }
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: 'proj_type', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.projectType = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'idc_proj_type', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.idcprojectType = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'proj_stage', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.projectStage = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'idc_proj_stage', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.idcprojectStage = res.data ? res.data : []
            break
        }
      })
      this.$api.public.depmgnt(res => {
        switch (res.code) {
          case '0':
            this.depList = res.data ? res.data : []
            break
        }
      })
    },
    tableOper(key, item) {
      switch (key) {
        case 'select':
          this.$store.commit('searchConditionFn', this.sel)
          this.selRes = JSON.parse(JSON.stringify(this.sel))
          this.getList(1)
          break
        case 'clear':
          for (let k in this.sel) {
            this.sel[k] = ''
          }
          this.reset = !this.reset
          this.tableOper('select', null)
          break
        case 'projNo':
        case 'projName':
          this.$pubfunc.setSStorage('proMsg', 3)
          this.$pubfunc.setSStorage('tag', 'sign')
          if(item && item.row && item.row.projId){
            if(this.tab.choose === '1'){// 汇总
              if(item.row.projectObjType==='1'){// 系统集成
                this.$router.push({
                  name:'projectView',
                  params: { projId: this.$pubfunc.encode(item.row.projId) },
                })
              }else if(item.row.projectObjType==='2'){// IDC
                this.$router.push({
                  name:'IDCProjectView',
                  params: { projId: this.$pubfunc.encode(item.row.projId) },
                })
              }else{

              }
            }else if(this.tab.choose==='2'){// 系统集成
              this.$router.push({
                name: 'projectView',
                params: { projId: this.$pubfunc.encode(item.row.projId) },
              })
            }else if(this.tab.choose==='3'){// IDC
              this.$router.push({
                name:'IDCProjectView',
                params: { projId: this.$pubfunc.encode(item.row.projId) },
              })
            }else{

            }
          }
          break
      }
    },
  },
  created() {
    // this.getList(1);
    this.getDropData()
    this.sel = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.sel))
    let tag = this.$pubfunc.getSStorage('tag'),
      judge = false
    this.$pubfunc.judgeBtn('performance:sign:sum')
      ? (this.tab.list.push({ id: '1', name: '签约项目-汇总' }),
        tag === '签约项目-汇总' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:sign:sysinte')
      ? (this.tab.list.push({ id: '2', name: '签约项目-系统集成项目' }),
        tag === '签约项目-系统集成项目' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:sign:idc')
      ? (this.tab.list.push({ id: '3', name: '签约项目-IDC项目' }),
        tag === '签约项目-IDC项目' ? (judge = true) : null)
      : null
    this.tab.list.length > 0
      ? (this.tab.choose = judge ? tag : this.tab.list[0].id)
      : null
    this.tab.choose = this.$pubfunc.getSStorage('tabChoose')
      ? this.$pubfunc.getSStorage('tabChoose')
      : ''
    this.getList(this.$store.state.page.page)
  },
  mounted() {},
}
</script>

<style scoped>
.pipelineTable {
  height: calc(100% - 36px);
}
.pipeline {
  padding: 60px 20px 0;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.formBox > .score > div > input,
.formBox > .rate > div > div {
  width: 46%;
}
.formBox > .score > div > span,
.formBox > .rate > div > span {
  display: inline-block;
  margin-top: 14px;
  width: 8%;
  height: 2px;
  color: #000;
  background-color: #000;
}
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: 19%;
}
.formBox > div > div > .auto {
  width: 230px;
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div > div > * {
  width: 100%;
}
.formBox > div > div > div.input {
  white-space: nowrap;
  position: relative;
  border: 0;
  padding: 0;
  font-size: 0;
}
.formBox > div > div > div.input > input,
.formBox > div > div > div.input > .elDropdown {
  width: 45%;
}
.formBox > div > div > div.input > i {
  display: inline-block;
  top: 0;
  line-height: 32px;
  color: #c2c6cd;
  text-align: center;
  min-width: 10%;
  font-size: 14px;
}
.formBox > div > div > div.input > i:nth-last-child(1) {
  padding: 0 10px;
}
.fillBox .boxTable {
  height: calc(100% - 132px);
  position: relative;
}
.fillBox .boxTable2 {
  height: calc(100% - 180px);
}
.exportBtn {
  padding-top: 10px;
}
.boxTable {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0 20px;
}
.pipelineTable .exportBtn /deep/ .tab {
  border-left: 1px solid #ddd;
  border-top-left-radius: 15px;
  padding-bottom: 0;
  display: inline-block;
  width: 456px;
  vertical-align: bottom;
}
.pipelineTable .exportBtn /deep/ .null {
  display: inline-block;
  width: calc(100% - 461px);
  height: 10px;
  vertical-align: bottom;
  border-bottom: 1px solid #ddd;
  margin-left: -6px;
  padding-right: 6px;
}
.pipelineTable .exportBtn /deep/ ul.tab::before {
  border-bottom: 0;
}
.pipelineTable .exportBtn /deep/ ul.tab li {
  border: 1px solid #ddd;
  border-left: 0;
  border-bottom: 0;
  margin-left: 0px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: rgba(241, 244, 251, 1);
  height: 39px;
  display: inline-block;
  min-width: 150px;
}
.pipelineTable .exportBtn /deep/ ul.tab li.checked {
  background-color: #fff;
}
.pipelineTable .exportBtn /deep/ ul.tab li.checked::before {
  height: 0;
}
.pipelineTable .exportBtn /deep/ ul.tab li:nth-child(1) {
  border-top-left-radius: 8px;
}
.pipelineTable /deep/ .boxTable .pageBox .el-pagination {
  left: 20px;
}
.pipelineTable .exportBtn .export {
  margin-top: 20px;
  margin-right: 20px;
}
.midCont .noData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 50px;
  position: relative;
}
.midCont .noData h1 {
  position: absolute;
  bottom: 70px;
  font-size: 20px;
  color: #666666;
  left: 50%;
  margin-left: -36px;
}
</style>
