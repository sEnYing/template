<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="workreport_icon"></i>
      <span>工作报告</span>
      <unit-btn type="auto right"
                text="生成工作报告"
                @click="tableOper('add',null)"
                v-if="judgeBtn.personal&&tab.choose==='personal'"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
            <!-- <div v-if="!tab.choose==="team""><span class="formBox_text">日期</span><div><unit-time v-setwidth class="auto" id='date' @return='dropdownReturn' :reset='reset'></unit-time></div></div> -->
            <div>
              <span class="formBox_text">报告日期</span>
              <div>
                <unit-time v-setwidth
                           class="auto"
                           id="date"
                           :value="reportDate"
                           @return="dropdownReturn"
                           :reset="reset"></unit-time>
              </div>
            </div>
            <div v-if="tab.choose==='team'">
              <span class="formBox_text marl">销售</span>
              <div>
                <unit-dropdown v-setwidth
                               id="staffId"
                               class="auto"
                               placeholder="全部"
                               :list="staffList"
                               @change="dropdownReturn"
                               :result="selMod.staffId"
                               :clear="true"
                               :reset="reset"
                               :input="true"></unit-dropdown>
              </div>
            </div>
            <div class="dropTree"
                 v-if="tab.choose==='team'">
              <span class="formBox_text">分子公司/所属部门</span>
              <div>
                <unit-tree id="depId"
                           class="auto"
                           v-setwidth
                           :list='depList'
                           :choose="[selMod.depId]"
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
                        text="查询"></unit-btn>
              <unit-btn @click="tableOper('exportAll',null)"
                        style="margin-right:20px"
                        v-if="tab.choose==='team'"
                        text="导出"></unit-btn>
              <unit-btn type="plain"
                        @click="tableOper('clear',null)"
                        text="重置"></unit-btn>
            </div>
          </div>
          <unit-tab class="contactListTab"
                    :tab="tab"
                    @click="returnBtn"
                    v-if="tab.list.length>1"></unit-tab>
          <div class="boxTable"
               :class="{'smallTable':tab.list.length>1}"
               v-if="tab.list.length>0">
            <unit-loading :loading="loading"
                          v-if="loading"></unit-loading>
            <unit-table :total="total"
                        :page="page"
                        v-if="!loading"
                        :list="list"
                        :title="tab.choose==='team'?title:title1"
                        :opern="tab.choose==='team'?2:3"
                        :operation="[{key:'view',show:judgeShow},{key:'revise',show:judgeShow},{key:'submit',show:judgeShow},{key:'export',show:judgeShow}]"
                        @click="tableOper"></unit-table>
            <unit-page :total="total"
                       :page="page"
                       @pagechange="getList"></unit-page>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
import unitTab from '@/unit/components/tab'
import unitTime from '@/unit/components/element/timeWeek'
import unitTree from '@/unit/components/element/tree'
export default {
  name: 'workreport',
  props: ['dom'],
  components: { unitTable, unitTime, unitTab,unitTree },
  data() {
    return {
      selMod: {
        startDate: '',
        endDate: '',
        staffName: '',
        depId:'',
        depName:'',
        staffId:'',
      },
      selRes: {},
      reset: true,
      tab: {
        list: [],
        choose: null
      },
      status: {
        '0': '已保存',
        '1': '已提交'
      },
      title: [
        { key: 'creatorName', name: '提交人', width: 20 },
        { key: 'depName', name: '部门', width: 20 },
        { key: 'dateTime_', name: '报告日期', width: 30 },
        { key: 'submitTime', name: '提交时间', width: 30 }
      ],
      title1: [
        { key: 'dateTime_', name: '报告日期', width: 40 },
        { key: 'createTime', name: '创建时间', width: 30 },
        { key: 'statusTxt', name: '状态', width: 30 }
      ],
      list: [],
      ajaxIng: false,
      delLoading: false,
      templateLoading: false,
      loading: true,
      total: 0,
      page: 1,
      oneday: 24 * 60 * 60 * 1000,
      judgeBtn: { personal: false },
      depList:[],
      staffList:[],
      hideTree: false,
      reportDate:[]
    }
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let isCharge =
          userInfo.info &&
          userInfo.info.staff &&
          userInfo.info.staff.isCharge === '1'
            ? true
            : false,
        staffId =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffId
            : null,
        resourceType =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.resourceType
            : null,
        staffName = userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffName
            : null
      return { isCharge, staffId, resourceType, staffName }
    }
  },
  methods: {
    judgeShow(item, i, key) {
      let all = ['view','export'], j
      if (this.tab.choose === 'team') {
        j = all.indexOf(key) > -1 
      } else {
        j = item.creator === this.userInfo.staffId 
        j && all.indexOf(key) === -1 && item.status === '1' ? (j = false) : null
      }
      return j
    },
    hideOther (j) { this.hideTree = j ? j : false },
    getDropData () {
      this.$api.bgmgnt.staff.getList({ resourceType: '02,05,07' }, res => {
        //分公司总+销售总监+销售
        // console.log(res)
        switch (res.code) {
          case '0':
            let list = []
              ; (res.data.list ? res.data.list : []).map(v => {
                list.push({
                  value: v.staffId,
                  label: v.staffName + '(' + v.staffNo + ')'
                })
              })
            this.staffList = list
            break
        }
      })
    },
   async getTreeData () {
      let self = this
      this.$api.public.depmgnt(res => {
        switch (res.code) {
          case '0':
            this.depList = res.data ? res.data : [];
            break;
        }
      })
    },
    getList(page) {
      if (!this.tab.list || this.tab.list.length === 0) {
        return
      }
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.limit = 10
      param.page = page
      // console.log(param)
      let url = 'list'
      if (this.tab.choose === 'personal') {
        delete param.staffName
        url = 'mylist'
      }
      console.log(param);
      this.loading = true
      this.$api.service.weekreport[url](param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.statusTxt = v.status ? this.status[v.status] : ''
              v.dateTime_ =
                this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.startDate) +
                ' - ' +
                this.$pubfunc.TimeTransform('MM月DD日', v.endDate)
            })
            this.list = list
            break
        }
      })
    },
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          this.tab.choose !== k
            ? ((this.tab.choose = k), this.getList(1))
            : (this.tab.choose = k)
          break
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        case 'date':
          this.selMod.startDate = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res.valueOf() - this.oneday
          )
          this.selMod.endDate = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res.valueOf() + this.oneday * 5
          )
          break
        case 'depId':
          this.selMod.depId = res[0].depId;
          this.selMod.depName = res[0].depName
          break;
        case 'staffId':
          this.selMod.staffId = res.value
          this.selMod.staffName = res.label
          break
        default:
          this.selMod[key] = res.value
      }
    },
    tableOper(key, item) {
      // console.log(key,item)
      switch (key) {
        case 'select':
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
          this.$store.commit('searchConditionFn', this.selRes)
          this.getList(1)
          break
        case 'clear':
          for (let k in this.selMod) {
            this.selMod[k] = ''
          }
          this.reset = !this.reset
          this.tableOper('select', null)
          break
        case 'add':
          this.$emit('dialog', {
            show: true,
            link: 'workreportAdd',
            small: true,
            title: '生成工作报告'
          })
          break
        case 'view':
          this.$pubfunc.setSStorage('workreport', this.tab.choose)
          item.reportId
            ? this.$router.push({
                name: 'workreportView',
                params: { reportId: this.$pubfunc.encode(item.reportId) }
              })
            : null
          break
        case 'revise':
          item.reportId
            ? this.$router.push({
                name: 'workreportEdit',
                params: { reportId: this.$pubfunc.encode(item.reportId) }
              })
            : null
          break
        case 'submit':
          if (this.ajaxIng) {
            return
          }
          this.$store.commit('confirmFn', {
            func: () => {
              this.ajaxIng = true
              this.$api.service.weekreport.submit(
                { reportId: item.reportId },
                res => {
                  // console.log(res)
                  this.ajaxIng = false
                  switch (res.code) {
                    case '0':
                      this.$store.commit('alertFn', {
                        type: 'success',
                        text: '提交成功',
                        func: () => {
                          this.tableOper('clear', null)
                        }
                      })
                      break
                    default:
                      res.message
                        ? this.$store.commit('alertFn', {
                            type: 'error',
                            text: res.message
                          })
                        : null
                  }
                }
              )
            },
            text:
              '确定提交该工作报告吗？<br/>提交后下周工作计划将会覆盖拜访管理中数据'
          })
          break
        case 'export':
          if (this.templateLoading) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出工作报告，请稍后'
            })
            return
          }
          this.templateLoading = true
          let thisItem = item
          // console.log("haha:"+JSON.stringify(this.userInfo));
          let creatorName = thisItem.creatorName ? thisItem.creatorName : this.userInfo.staffName
          // console.log(thisItem)
          this.$api.download.weekreportExport(
            { reportId: item.reportId },
            res => {
              this.$pubfunc.downloadFile(
                res,
                '工作报告-' +
                  creatorName  +
                  thisItem.startDate.split('/').join('') +
                  '-' +
                  thisItem.endDate.split('/').join('') +
                  '.docx',
                'doc'
              )
              this.templateLoading = false
              this.$store.commit('alertFn', {
                type: 'success',
                text: '导出成功',
                func: () => {
                  this.$emit('success')
                }
              })
            }
          )
          break
        case'exportAll':
        if (this.templateLoading) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出工作报告，请稍后'
            })
            return
          }
          this.templateLoading = true
          let params = this.selRes
          this.$api.download.teamWorkPort(params,res =>{
            this.$pubfunc.downloadFile(
              res,
              '团队工作报告_'+
              this.$pubfunc.TimeTransform(
                'YYYYMMDDhhmmss',
                this.$pubfunc.getTimeNum()
              ) +'.xlsx' ,
              'xlsx'
            )
             this.templateLoading = false
              this.$store.commit('alertFn', {
                type: 'success',
                text: '导出成功',
                func: () => {
                  this.$emit('success')
                }
              })
          })
        break
      }
    }
  },
  created() {
     this.getTreeData()
    this.getDropData()
    let workreportPersonal = this.$pubfunc.judgeBtn('workreport:personal'),
      workreportTeam = this.$pubfunc.judgeBtn('workreport:team'),
      workreport = this.$pubfunc.getSStorage('workreport')
     const weekreportSelect = this.$pubfunc.getSStorage('weekreportSelect')
       this.selMod = this.$store.state.searchCondition
      if(this.$store.state.searchCondition) {
        const keys = Object.keys(this.$store.state.searchCondition)
        if(keys&&keys.length>0) {
          this.reportDate = [this.$pubfunc.timeToTimestamp(this.$store.state.searchCondition.startDate),this.$pubfunc.timeToTimestamp(this.$store.state.searchCondition.endDate)]
          this.selRes = this.$store.state.searchCondition
        }
      }
    if (workreportPersonal) {
      this.judgeBtn.personal = true
      this.tab.list.push({ id: 'personal', name: '个人工作报告' })
      if (workreport === 'personal') {
        this.tab.choose = workreport
      }
    }
    if (workreportTeam) {
      this.tab.list.push({ id: 'team', name: '团队工作报告' })
      if (workreport === 'team') {
        this.tab.choose = workreport
      }
      console.log(
        workreport,
        this.userInfo.resourceType,
        this.$store.state.special.resourceType1.split(',')
      )
      if (
        !workreport &&
        this.$store.state.special.resourceType1
          .split(',')
          .indexOf(this.userInfo.resourceType) > -1
      ) {
        this.tab.choose = 'team'
      }
    }
    this.tab.list.length > 0 && !this.tab.choose
      ? (this.tab.choose = this.tab.list[0].id)
      : null
    this.$pubfunc.delSStorage('workreport')
    this.reset = !this.reset
    this.getList(this.$store.state.page.page)
  },
  mounted() {}
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% + 2px);
}
.formBox > div:nth-child(1) {
  width: calc(20% + 60px);
}
.formBox > div:nth-child(2) {
  padding-left: 37px;
  width: calc(20% + 50px);
  padding-right: 30px;
}
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div > div > * {
  width: 100%;
}
.fillBox .boxTable {
  height: calc(100% - 60px);
}
.fillBox .boxTable.smallTable {
  height: calc(100% - 112px);
}
.contactListTab {
  margin-bottom: 16px;
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
</style>
