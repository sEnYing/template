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
                @click="exportStat('commit')"></unit-btn>
    </div>
    <div class="formBox pipeline">
      <div>
        <span class="formBox_text">销售</span>
        <div>
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
      <div v-if="tab.choose!=='1'">
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
      <div v-if="tab.choose!=='1'">
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
      <div v-if="tab.choose!=='1'">
        <span class="formBox_text">项目赢率</span>
        <div>
          <div v-setwidth
               class="input">
            <unit-dropdown id="winRateFrom"
                           class="auto"
                           placeholder='全部'
                           :list="rateList"
                           @change='dropdownReturn'
                           :result="sel.winRateFrom"
                           :clear='true'
                           :reset='reset'></unit-dropdown>
            <i>-</i>
            <unit-dropdown id="winRateTo"
                           class="auto"
                           placeholder='全部'
                           :list="rateList"
                           @change='dropdownReturn'
                           :result="sel.winRateTo"
                           :clear='true'
                           :reset='reset'></unit-dropdown>
          </div>
        </div>
      </div>
      <div class="score"
           v-if="tab.choose ==='2'">
        <span class="formBox_text">项目得分</span>
        <div>
          <div v-setwidth
               class="input">
            <input type="text"
                   v-model="sel.projScoreFrom"
                   maxlength="20"
                   placeholder="">
            <i>-</i>
            <input type="text"
                   v-model="sel.projScoreTo"
                   maxlength="20"
                   placeholder="">
          </div>
        </div>
      </div>
      <div class="dropDate">
        <span class="formBox_text">预计结案日期</span>
        <div>
          <unit-time v-setwidth
                     class="DialogtimeBox auto"
                     id='time'
                     @return='dropdownReturn'
                     :value="[sel.planFinishTimeFrom,sel.planFinishTimeTo]"></unit-time>
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
    <div class="boxTable">
      <unit-loading :loading='loading'
                    v-if="loading"></unit-loading>
      <unit-table :total='total'
                  :smallRel="true"
                  :page='page'
                  v-if="!loading||list.length>0"
                  :list='list'
                  :title='title'
                  :scroll='4800'
                  ref='table'
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
          { key: 'projNo', name: '项目编号', mustwidth: 120 },
          { key: 'customerName', name: '客户名称', mustwidth: 230 },
          { key: 'projName', name: '项目名称', mustwidth: 270 },
          { key: 'projAmount_', name: '项目金额（元）', mustwidth: 120 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 100 },
          { key: 'winRateTxt', name: '项目赢率', mustwidth: 120 },
          { key: 'projStageTxt', name: '项目阶段', mustwidth: 100 },
          { key: 'projStatusTxt', name: '项目状态', mustwidth: 100 },
          { key: 'planFinishTime_', name: '预计结案日期', mustwidth: 200 },
          { key: 'createTime_', name: '立项时间', mustwidth: 200 },
          { key: 'duration', name: '立项时长（天）', mustwidth: 120 },
          { key: 'remark', name: '备注', width: 1000 },
        ],
        system: [
          { key: 'projNo', name: '项目编号', mustwidth: 120 },
          { key: 'projName', name: '项目名称', mustwidth: 250 },
          { key: 'staffName', name: '销售', mustwidth: 120 },
          { key: 'subCompanyName', name: '分子公司', mustwidth: 120 },
          { key: 'depName', name: '所属部门', mustwidth: 120 },
          { key: 'customerName', name: '客户名称', mustwidth: 220 },
          { key: 'projAmount_', name: '项目金额（元）', mustwidth: 120 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 120 },
          { key: 'projScore', name: '项目得分', mustwidth: 100 },
          { key: 'winRateTxt', name: '项目赢率', mustwidth: 150 },
          { key: 'projStageTxt', name: '项目阶段', mustwidth: 120 },
          { key: 'commitConfirmTxt', name: 'commit确认', mustwidth: 120 },
          { key: 'projStatusTxt', name: '项目状态', mustwidth: 120 },
          { key: 'planFinishTime_', name: '预计结案日期', mustwidth: 200 },
          { key: 'createTime_', name: '立项时间', mustwidth: 200 },
          { key: 'duration', name: '立项时长（天）', mustwidth: 120 },
          { key: 'contactName', name: '客户联系人', mustwidth: 120 },
          { key: 'policymarkerName', name: '决策人', mustwidth: 120 },
          { key: 'mainBrand', name: '主要品牌', mustwidth: 200 },
          { key: 'feasibilityTxt', name: '技术可行性判断', mustwidth: 300 },
          { key: 'feasibilityDesc', name: '技术可行性判断说明', mustwidth: 300 },
          { key: 'competitiveBrand', name: '竞争品牌', mustwidth: 300 },
          { key: 'competitor', name: '竞争对手', mustwidth: 300 },
          { key: 'competitiveAdvantage', name: '竞争优势', mustwidth: 300 },
          { key: 'competitiveWeakness', name: '竞争劣势', mustwidth: 300 },
          { key: 'companySupport', name: '需要公司层面支持', mustwidth: 300 },
          { key: 'tenderTime_', name: '投标时间', mustwidth: 120 },
          { key: 'remark', name: '备注', width: 500 },
        ],
        IDC: [
          { key: 'subCompanyName', name: '分子公司',mustwidth: 120 },
          { key: 'depName', name: '所属部门', mustwidth: 120 },
          { key: 'staffName', name: '销售员', mustwidth: 120 },
          { key: 'projNo', name: '项目编号', mustwidth: 150 },
          { key: 'customerName', name: '客户名称', mustwidth: 220 },
          { key: 'idcRoomTxt', name: '所属机房', mustwidth: 200 },
          { key: 'projName', name: '项目名称', mustwidth: 250 },
          { key: 'estAnnualConAmount_', name: '预计年合同额（元）', mustwidth: 120 },
          { key: 'projTypeTxt', name: '项目类型', mustwidth: 120 },
          { key: 'winRateTxt', name: '项目赢率', mustwidth: 150 },
          { key: 'projStageTxt', name: '项目阶段', mustwidth: 120 },
          { key: 'projStatusTxt', name: '项目状态', mustwidth: 120 },
          { key: 'planFinishTime_', name: '预计结案日期', mustwidth: 200 },
          { key: 'createTime_', name: '立项时间', mustwidth: 200 },
          { key: 'duration', name: '立项时长（天）', mustwidth: 120 },
          { key: 'contactName', name: '联系人', mustwidth: 120 },
          { key: 'contactPosition', name: '联系人职务', mustwidth: 120 },
          { key: 'cabinetNumber', name: '机柜数量', mustwidth: 120 },
          { key: 'cabinetElectricity', name: '机柜电量', mustwidth: 120 },
          { key: 'bandwidth', name: '宽带要求', mustwidth: 120 },
          { key: 'others', name: '其他要求', mustwidth: 300 },
          { key: 'customerDemandFocus', name: '客户需求侧重点', mustwidth: 300 },
          { key: 'customerKeyBussiness', name: '客户重点业务说明', mustwidth: 300 },
          { key: 'scheduleDescription', name: '项目进度说明', mustwidth: 300 },
          { key: 'tenderTime_', name: '投标时间', mustwidth: 200 },
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
        winRateFrom: '',
        winRateTo: '',
        planFinishTimeFrom: '',
        planFinishTimeTo: '',
        projScoreFrom: '',
        projScoreTo: '',
      },
      selRes: {},
      projectType: [],
      idcprojectType: [],
      projectStage: [],
      idcprojectStage: [],
      rateList: [],
      rateListAll: {
        system: [],
        idc: [],
      },
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
    getList(page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.limit = 10
      param.page = page
      if (this.tab.list && this.tab.list.length > 0 && !this.tab.choose) {
        this.tab.choose = JSON.parse(JSON.stringify(this.tab.list[0].id))
      }
      if (this.tab.choose === '2') {
        this.rateList = this.rateListAll.system
      } else if (this.tab.choose === '3') {
        this.rateList = this.rateListAll.idc
      }
      this.loading = true
      this.$api.service.stat[
        this.tab.choose === '1'
          ? 'commitalllist'
          : this.tab.choose === '2'
          ? 'commitprojlist'
          : 'commitidcprojlist'
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
              // v.projId='8FD3C07F9E4D4A4F89FB700394B5CA3F'
              v.commitStatus_ =
                v.commitStatus === '1'
                  ? '是'
                  : v.commitStatus === '0'
                  ? '否'
                  : ''
              v.projAmount_ = v.projAmount
                ? this.$pubfunc.transformPrice(v.projAmount, true)
                : ''
              v.estAnnualConAmount_ = v.estAnnualConAmount
                ? this.$pubfunc.transformPrice(v.estAnnualConAmount, true)
                : ''
              v.planFinishTime_ = v.planFinishTime
                ? this.$pubfunc.TimeTransform(
                    'YYYY年MM月DD日',
                    v.planFinishTime,
                  )
                : ''
              v.createTime_ = v.createTime
                ? this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.createTime) +
                  ' ' +
                  this.$pubfunc.transTime(
                    this.$pubfunc.TimeTransform('hh:mm', v.createTime),
                  )
                : ''
              v.tenderTime_ = v.tenderTime
                ? this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.tenderTime)
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
          this.sel.projType = ''
          this.sel.projStage = ''
          this.sel.winRateFrom = ''
          this.sel.winRateTo = ''
          this.$pubfunc.setSStorage('tabChoose', k)
          this.getList(1)
          break
      }
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
        case 'winRateFrom':
          this.sel.winRateFrom = item.value
          break
        case 'winRateTo':
          this.sel.winRateTo = item.value
          break
        case 'time':
          this.sel.planFinishTimeFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            item[0],
          )
          this.sel.planFinishTimeTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            item[1],
          )
          break
      }
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
          this.$pubfunc.setSStorage('tag', 'commit')
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
      this.$api.public.dict({ codeGroup: 'win_rate', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.rateListAll.system = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'idc_win_rate', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.rateListAll.idc = res.data ? res.data : []
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
  },
  created() {
    // this.getList(1);
    this.getDropData()
    this.sel = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.sel))
    let tag = this.$pubfunc.getSStorage('tag'),
      judge = false
    this.$pubfunc.judgeBtn('performance:commit:sum')
      ? (this.tab.list.push({ id: '1', name: 'commit-汇总' }),
        tag === 'commit-汇总' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:commit:sysinte')
      ? (this.tab.list.push({ id: '2', name: 'commit-系统集成项目' }),
        tag === 'commit-系统集成项目' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:commit:idc')
      ? (this.tab.list.push({ id: '3', name: 'commit-IDC项目' }),
        tag === 'commit-IDC项目' ? (judge = true) : null)
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
  width: calc(20% - 10px);
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
.formBox > .dropDate:not(.btnBox) {
  padding-left: 94px;
  position: relative;
  width: calc(20% + 40px);
}
@media screen and (max-width: 1600px) {
  .formBox > .dropDate:not(.btnBox) {
    width: calc(30%);
  }
}
@media screen and (max-width: 1400px) {
  .formBox > .dropDate:not(.btnBox) {
    width: calc(30% + 40px);
  }
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
  height: calc(100% - 180px);
  position: relative;
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
  width: 450px;
  vertical-align: bottom;
}
.pipelineTable .exportBtn /deep/ .null {
  display: inline-block;
  width: calc(100% - 455px);
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
