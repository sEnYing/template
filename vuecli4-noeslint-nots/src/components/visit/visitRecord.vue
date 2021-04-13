<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="visit_icon"></i>
      <span>拜访记录</span>
      <unit-btn type="large right"
                text="新建拜访记录"
                @click="tableOper('add',null)"></unit-btn>
      <unit-btn type="large right"
                text="批量导出"
                @click="tableOper('export',null)"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">拜访日期</span>
              <div>
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="visitDateFrom"
                             @return="dropdownReturn"
                             :value="selRes.visitDateFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="visitDateTo"
                             @return="dropdownReturn"
                             :value="selRes.visitDateTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
            <div>
              <span class="formBox_text">客户名称</span>
              <div>
                <input v-setwidth
                       type="text"
                       v-model="selMod.customerName"
                       placeholder="全部"
                       @keydown.enter="tableOper('select',null)" />
              </div>
            </div>
            <div>
              <span class="formBox_text">项目名称</span>
              <div>
                <input v-setwidth
                       type="text"
                       v-model="selMod.projName"
                       placeholder="全部"
                       @keydown.enter="tableOper('select',null)" />
              </div>
            </div>
            <!-- <div><span class="formBox_text">客户名称</span><div><unit-customer v-setwidth id="customerName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-customer></div></div> -->
            <!-- <div><span class="formBox_text">项目名称</span><div><unit-project v-setwidth id="projName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-project></div></div> -->
            <div>
              <span class="formBox_text">拜访对象</span>
              <div>
                <input v-setwidth
                       type="text"
                       v-model="selMod.contactName"
                       maxlength="20"
                       placeholder="全部"
                       @keydown.enter="tableOper('select',null)" />
              </div>
            </div>
            <div>
              <span class="formBox_text">拜访方式</span>
              <div>
                <unit-dropdown v-setwidth
                               id="visitType"
                               class="auto"
                               placeholder="全部"
                               :list="visitType"
                               @change="dropdownReturn"
                               :result="selMod.visitType"
                               :clear="true"
                               :reset="reset"></unit-dropdown>
              </div>
            </div>
            <div>
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
            <div class="dropTree">
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
              <unit-btn type="plain"
                        @click="tableOper('clear',null)"
                        text="重置"></unit-btn>
            </div>
          </div>
          <div class="boxTable">
            <unit-loading :loading="loading"
                          v-if="loading"></unit-loading>
            <unit-table :total="total"
                        :page="page"
                        v-if="!loading||list.length>0"
                        :list="list"
                        :title="(userInfo.isCharge||userInfo.isAdmin)?title1:title"
                        :operation="[{key:'view',show:judgeShow},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]"
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
import unitTime from '@/unit/components/element/timeBox'
import unitTree from '@/unit/components/element/tree'
// import unitCustomer from '@/unit/components/thisUnit/customer'
// import unitProject from '@/unit/components/thisUnit/project'
export default {
  name: 'visitRecord',
  props: ['dom'],
  components: { unitTable, unitTime, unitTree }, //,unitCustomer,unitProject
  data () {
    let time = this.$pubfunc.timestampToTime()
    let week = time.Week ? time.Week : 7,
      onday = 24 * 60 * 60 * 1000
    return {
      selMod: {
        visitDateFrom: this.$pubfunc.TimeTransform(
          'YYYY/MM/DD',
          this.$pubfunc.getTimeNum() - (week - 1) * onday
        ),
        visitDateTo: this.$pubfunc.TimeTransform(
          'YYYY/MM/DD',
          this.$pubfunc.getTimeNum()
        ),
        customerName: '',
        projName: '',
        visitType: '',
        contactName: '',
        staffName: '',
        depId:'',
        staffId:'',
      },
      selRes: {
        visitDateFrom: ''
      },
      reset: true,
      visitType: [],
      title: [
        { key: 'dateTime_', name: '拜访时间', width: 18 },
        { key: 'customerName', name: '客户名称', width: 22 },
        { key: 'projName', name: '项目名称', width: 22 },
        { key: 'contactName', name: '拜访对象', width: 19 },
        { key: 'visitTypeTxt', name: '拜访方式', width: 19 }
      ],
      title1: [
        { key: 'dateTime_', name: '拜访时间', width: 16 },
        { key: 'customerName', name: '客户名称', width: 18 },
        { key: 'projName', name: '项目名称', width: 18 },
        { key: 'contactName', name: '拜访对象', width: 16 },
        { key: 'visitTypeTxt', name: '拜访方式', width: 16 },
        { key: 'creatorName', name: '销售', width: 16 }
      ],
      list: [],
      ajaxIng: false,
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
      depList:[],
      staffList:[],
      hideTree: false,
    }
  },
  computed: {
    userInfo () {
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
            : null
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === '1'
      return { isCharge, staffId, isAdmin }
    }
  },
  methods: {
    judgeShow (item, i, key) {
      switch (key) {
        case 'view':
          return true
      }
      return item.creator === this.userInfo.staffId || this.userInfo.isAdmin
        ? true
        : false
    },
    hideOther (j) { this.hideTree = j ? j : false },
    getDropData () {
      this.$api.public.dict({ codeGroup: 'visit_type', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.visitType = res.data ? res.data : []
            break
        }
      })
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
    getList (page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.limit = 10
      param.page = page
      // console.log(param)
      if (!this.userInfo.isCharge) {
        delete param.staffName
      }
      this.loading = true
      this.$api.service.visit.recordList(param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.dateTime_ =
                this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.date) +
                ' ' +
                this.$pubfunc.transTime(v.time)
            })
            this.list = list
            break
        }
      })
    },
    dropdownReturn (res, key) {
      // console.log(res,key)
      switch (key) {
        case 'customerName':
          this.selMod.customerName = res.label
          break
        case 'projName':
          this.selMod.projName = res.label
          break
        case 'visitType':
          this.selMod.visitType = res.value
          break
        case 'visitDateFrom':
          this.selMod.visitDateFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'visitDateTo':
          this.selMod.visitDateTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'depId':
          this.selMod.depId = res[0].depId;
          break;
        default:
          this.selMod[key] = res.value
          break;
      }
    },
    tableOper (key, item) {
      // console.log(key,item)
      switch (key) {
        case 'select':
          this.$store.commit('searchConditionFn', this.selMod)
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
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
          this.$router.push({ name: 'visitrecordAdd' })
          break
        case 'view':
          item.recordId
            ? this.$router.push({
              name: 'visitrecordView',
              params: { recordId: this.$pubfunc.encode(item.recordId) }
            })
            : null
          break
        case 'revise':
          item.recordId
            ? this.$router.push({
              name: 'visitrecordEdit',
              params: { recordId: this.$pubfunc.encode(item.recordId) }
            })
            : null
          break
        case 'delete':
          this.$store.commit('confirmFn', {
            func: () => {
              if (this.delLoading) {
                return
              }
              this.delLoading = true
              this.$api.service.visit.deleteRecord(
                { recordId: item.recordId },
                res => {
                  // console.log(res)
                  this.delLoading = false
                  switch (res.code) {
                    case '0':
                      this.$store.commit('alertFn', {
                        type: 'success',
                        text: '删除成功',
                        func: () => {
                          this.tableOper('select', null)
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
            text: '确认删除该拜访记录吗？<br>删除后不可恢复'
          })
          break
        case 'export':
          if (this.ajaxIng) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出报表，请稍后'
            })
            return
          }
          let param = JSON.parse(JSON.stringify(this.selRes))
          this.ajaxIng = true
          this.$api.download.visitRecordExport(param, res => {
            this.$pubfunc.downloadFile(
              res,
              '拜访记录' +
              this.$pubfunc.TimeTransform(
                'YYYYMMDDhhmmss',
                this.$pubfunc.getTimeNum()
              ) +
              '.xlsx'
            )
            this.ajaxIng = false
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
  created () {
    this.getTreeData()
    this.getDropData()
    this.selMod = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.selMod))
    this.getList(this.$store.state.page.page)
  },
  mounted () { }
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% - 20px);
}
.formBox > div:nth-child(1) {
  width: calc(20% + 60px);
}
.formBox > div:nth-child(5) {
  padding-right: 0;
  width: calc(20% - 10px);
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
  height: calc(100% - 108px);
}
.formBox > div > div > div.input {
  white-space: nowrap;
  position: relative;
  border: 0;
  padding: 0;
  font-size: 0;
}
.formBox > div > div > div.input > .elTimebox {
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
.marl {
  margin-left: 28px;
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
</style>
