<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <span>系统使用情况统计</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
            <div >
              <span class="formBox_text">新增客户统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="customerAddDateFrom"
                             @return="dropdownReturn"
                             :value="selMod.customerAddDateFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="customerAddDateTo"
                             @return="dropdownReturn"
                             :value="selMod.customerAddDateTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">拜访情况统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="visitDateFrom"
                             @return="dropdownReturn"
                             :value="selMod.visitDateFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="visitDateTo"
                             @return="dropdownReturn"
                             :value="selMod.visitDateTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">项目更新统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="projectUpdDateFrom"
                             @return="dropdownReturn"
                             :value="selMod.projectUpdDateFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="projectUpdDateTo"
                             @return="dropdownReturn"
                             :value="selMod.projectUpdDateTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">commit项目更新统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="commitProjectUpdDateFrom"
                             @return="dropdownReturn"
                             :value="selMod.commitProjectUpdDateFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="commitProjectUpdDateTo"
                             @return="dropdownReturn"
                             :value="selMod.commitProjectUpdDateTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">预计结案日期统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <unit-time class="auto"
                             placeholder="开始日期"
                             id="planFinishTimeFrom"
                             @return="dropdownReturn"
                             :value="selMod.planFinishTimeFrom"
                             :reset="reset"
                             :clear="true"></unit-time>
                  <i>-</i>
                  <unit-time class="auto"
                             placeholder="结束日期"
                             id="planFinishTimeTo"
                             @return="dropdownReturn"
                             :value="selMod.planFinishTimeTo"
                             :reset="reset"
                             :clear="true"></unit-time>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">立项时长统计区间</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <input type="text"
                         v-model="selMod.creatTimeDaysFrom"
                         maxlength="20"
                         placeholder />
                  <i>-</i>
                  <input type="text"
                         v-model="selMod.creatTimeDaysTo"
                         maxlength="20"
                         placeholder />
                  <i>天</i>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">提交周报统计周</span>
              <div class="inputarea">
                <unit-week 
                           class="auto"
                           id="reportDate"
                           :value="reportDate"
                           @return="dropdownReturn"
                           :reset="reset"></unit-week>
              </div>
            </div>
          </div>
          <div class="formBox">
            <div >
              <span class="formBox_text">年度任务额统计年</span>
              <div class="inputarea">
                <div v-setwidth
                     class="input">
                  <input type="text"
                         v-model="selMod.salesTargetYear"
                         maxlength="20"
                         placeholder />
                  <i>年</i>
                </div>
              </div>
            </div>
          </div>
          <div class="formBox">
            <unit-btn type="large"
                text="导出"
                @click="tableOper('export',null)"></unit-btn>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
import unitWeek from '@/unit/components/element/timeWeek'
import unitTime from '@/unit/components/element/timeBox'
import unitTree from '@/unit/components/element/tree'
// import unitCustomer from '@/unit/components/thisUnit/customer'
// import unitProject from '@/unit/components/thisUnit/project'
export default {
  name: 'visitPlan',
  props: ['dom'],
  components: { unitTable, unitTime,unitTree,unitWeek }, //unitProject,unitCustomer
  data () {
    let time = this.$pubfunc.timestampToTime()
    let week = time.Week ? time.Week : 7,
      onday = 24 * 60 * 60 * 1000
    let minus = time.Week ? time.Week - 1 : 6;
    let  currentTime= new Date();
    let firstDayOfWeek=currentTime.setDate(currentTime.getDate() - minus).valueOf()
    let lastDayOfWeek=firstDayOfWeek + 6 * onday;
    let firstDayOfWeekStr=this.$pubfunc.TimeTransform(
          'YYYY/MM/DD',firstDayOfWeek); //获取周一日期
    let lastDayOfWeekStr=this.$pubfunc.TimeTransform(
          'YYYY/MM/DD',lastDayOfWeek); //获取周日日期
    return {
      selMod: {
        customerAddDateFrom:firstDayOfWeekStr,
        customerAddDateTo: lastDayOfWeekStr,
        visitDateFrom: firstDayOfWeekStr,
        visitDateTo: lastDayOfWeekStr,
        projectUpdDateFrom:firstDayOfWeekStr,
        projectUpdDateTo: lastDayOfWeekStr,
        commitProjectUpdDateFrom: firstDayOfWeekStr,
        commitProjectUpdDateTo: lastDayOfWeekStr,
        planFinishTimeFrom:'',
        planFinishTimeTo:this.$pubfunc.lastMonth().lastDay,
        creatTimeDaysFrom:'180',
        creatTimeDaysTo:'',
        workReportWeekFrom:firstDayOfWeekStr,
        workReportWeekTo:lastDayOfWeekStr,
        salesTargetYear:this.$pubfunc.TimeTransform(
          'YYYY',
          this.$pubfunc.getTimeNum()
        ),
      },
      reportDate:[
          firstDayOfWeek,
          lastDayOfWeek],
      selRes: {},
      reset: true,
      oneday: 24 * 60 * 60 * 1000,
    }
  },
  methods: {
    dropdownReturn (res, key) {
      // console.log(res,key)
      switch (key) {
        case 'customerAddDateFrom':
          this.selMod.customerAddDateFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'customerAddDateTo':
          this.selMod.customerAddDateTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          this.selMod.visitDateFrom = this.selMod.customerAddDateFrom
          this.selMod.visitDateTo = this.selMod.customerAddDateTo
          this.selMod.projectUpdDateFrom = this.selMod.customerAddDateFrom
          this.selMod.projectUpdDateTo = this.selMod.customerAddDateTo
          this.selMod.commitProjectUpdDateFrom = this.selMod.customerAddDateFrom
          this.selMod.commitProjectUpdDateTo = this.selMod.customerAddDateTo
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
        case 'projectUpdDateFrom':
          this.selMod.projectUpdDateFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'projectUpdDateTo':
          this.selMod.projectUpdDateTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'commitProjectUpdDateFrom':
          this.selMod.commitProjectUpdDateFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'commitProjectUpdDateTo':
          this.selMod.commitProjectUpdDateTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'planFinishTimeFrom':
          this.selMod.planFinishTimeFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'planFinishTimeTo':
          this.selMod.planFinishTimeTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res
          )
          break
        case 'reportDate':
          // console.log(res.valueOf() - this.oneday)
          this.selMod.workReportWeekFrom = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res.valueOf() - this.oneday
          )
          this.selMod.workReportWeekTo = this.$pubfunc.TimeTransform(
            'YYYY/MM/DD',
            res.valueOf() + this.oneday * 5
          )
          // console.log(this.selMod)
          break
        default:
          this.selMod[key] = res.value
      }
    },
    tableOper (key, item) {
      // console.log(key,item)
      switch (key) {
        case 'export':
          if (this.ajaxIng) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出报表，请稍后'
            })
            return
          }
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
          let param = JSON.parse(JSON.stringify(this.selRes))
          this.ajaxIng = true
          this.$api.download.systemUsageStatExport(param, res => {
            this.$pubfunc.downloadFile(
              res,
              '系统使用情况' +
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
    this.selRes = JSON.parse(JSON.stringify(this.selMod))
  },
  mounted () { }
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% - 8px);
}
.formBox > div:nth-child(1) {
  width: calc(20% + 70px);
}
.formBox > div:nth-child(5) {
  padding-right: 0;
  padding-left: 38px;
  width: calc(20% - 48px);
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
  width: 100%;
}
.formBox > div > div.inputarea > .el-date-editor--week {
  width: 253px;
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

.inputarea{
  padding-left: 110px;
}
.formBox > button{
    margin-left: 500px;
}
.formBox .formBox_text{
    /* font-size: 14px; */
    color: #444444;
    /* line-height: 17px; */
    padding-left: 8px;
    border-left: 3px solid #1560F6;
    white-space:nowrap;
    word-wrap:break-word;
    word-break:break-all;
}
.formBox > div > div > div.input > input {
  width: calc(70% - 19px);
}
</style>
