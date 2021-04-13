<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="dashboard_icon"></i>
      <span>销售漏斗</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="funnelBox">
            <unit-tab :tab='tab'
                      v-if="tab.list&&tab.list.length>0"
                      @click="returnBtn"></unit-tab>
            <div class="left">
              <unit-funnel :dom="dom"
                           :list="list"
                           @click="changeStage"
                           :stage="stage"></unit-funnel>
            </div>
            <unit-btn type="plain large"
                      @click="tableOper('clear',null)"
                      text="全部项目"></unit-btn>
            <unit-btn type="large"
                      @click="tableOper('export')"
                      text="导出报表"></unit-btn>
          </div>
          <div class="tableContent">
            <div class="boxTable">
              <unit-loading :loading="loading"
                            v-if="loading"></unit-loading>
              <unit-table :total="total"
                          :page="page"
                          v-if="!loading||tableList.length>0"
                          :list="tableList"
                          :title="title"
                          :operation="['view']"
                          @click="tableOper"
                          :limit="4"></unit-table>
              <unit-page :total="total"
                         :page="page"
                         @pagechange="getList_"
                         :limit="4"></unit-page>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
import unitFunnel from '@/unit/components/echarts/statFunnel'
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'statFunnel',
  props: ['dom'],
  components: {
    unitTab,
    unitFunnel,
    unitTable,
  },
  data() {
    return {
      title: [],
      list: [],
      loading: false,
      ajaxIng: false,
      total: 0,
      page: 1,
      tableList: [],
      stage: '',
      title: [],
      titleList: {
        idc: [
          { key: 'projName', name: '项目名称', width: 23 },
          { key: 'customerName', name: '客户名称', width: 23 },
          { key: 'staffName', name: '销售', width: 19 },
          { key: 'projTypeTxt', name: '项目类型', width: 16 },
          { key: 'projStageTxt', name: '项目阶段', width: 16 },
          { key: 'bandwidth', name: '带宽要求', width: 14 },
          { key: 'cabinetNumber', name: '机柜数量', width: 14 },
          { key: 'cabinetElectricity', name: '机柜电量', width: 14 },
          { key: 'estAnnualConAmount_', name: '预计年合同额（元）', width: 22 },
          { key: 'createTime_', name: '预计结案日期', width: 22 },
        ],
        system: [
          { key: 'projName', name: '项目名称', width: 23 },
          { key: 'customerName', name: '客户名称', width: 23 },
          { key: 'staffName', name: '销售', width: 19 },
          { key: 'projTypeTxt', name: '项目类型', width: 16 },
          { key: 'projStageTxt', name: '项目阶段', width: 16 },
          { key: 'projScore', name: '项目得分', width: 14 },
          { key: 'projAmount_', name: '项目金额（元）', width: 22 },
          { key: 'planFinishTime_', name: '预计结案日期', width: 22 },
        ],
      },
      tab: {
        list: [],
        choose: '',
      },
    }
  },
  computed: {},
  methods: {
    getData() {
      this.$api.service.stat[
        this.tab.choose === '3' ? 'idcprojstagestat' : 'projstagestat'
      ](res => {
        switch (res.code) {
          case '0':
            this.list = res.data.list ? res.data.list : []
            break
        }
      })
    },
    changeStage(s) {
      this.$pubfunc.setSStorage('stage', s)
      this.getList(1, s)
    },
    getList_(p) {
      this.getList(p, this.stage)
    },
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          this.$pubfunc.setSStorage('tab', k)
          this.$pubfunc.setSStorage('stage', '')
          this.stage = ''
          this.tab.choose = k
          this.getList_(1)
          this.getData()
          break
      }
    },
    getList(p, s) {
      if (this.loading) {
        return
      }
      // s?this.stage=s:null;
      this.$store.commit('pageFn', { page: p, limit: 10 })
      this.stage = s
      this.page = p
      let param = {
        projStage: this.stage,
        page: p,
        limit: 4,
      }
      this.loading = true
      if (this.tab.list && this.tab.list.length > 0 && !this.tab.choose) {
        this.tab.choose = JSON.parse(JSON.stringify(this.tab.list[0].id))
      }
      this.$api.service.stat[
        this.tab.choose === '3' ? 'idcprojstagedetail' : 'projstagedetail'
      ](param, res => {
        this.loading = false
        switch (res.code) {
          case '0':
            this.title =
              this.tab.choose === '3'
                ? JSON.parse(JSON.stringify(this.titleList.idc))
                : JSON.parse(JSON.stringify(this.titleList.system))
            this.total = res.data.count
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.planFinishTime_ = this.$pubfunc.TimeTransform(
                'YYYY年MM月DD日',
                v.planFinishTime,
              )
              v.createTime_ = this.$pubfunc.TimeTransform(
                'YYYY年MM月DD日',
                v.createTime,
              )
              v.projAmount_ = this.$pubfunc.transformPrice(v.projAmount, true)
              v.estAnnualConAmount_ = this.$pubfunc.transformPrice(
                v.estAnnualConAmount,
                true,
              )
            })

            this.tableList = list
            break
        }
      })
    },
    tableOper(key, item) {
      switch (key) {
        case 'view':
          this.$pubfunc.setSStorage('proMsg', 2)
          item.projId
            ? this.tab.choose === '3'
              ? this.$router.push({
                  name: 'IDCProjectView',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
              : this.$router.push({
                  name: 'projectView',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
            : null
          break
        case 'clear':
          this.changeStage('')
          break
        case 'export':
          this.exportStat()
          break
      }
    },
    exportStat() {
      if (this.ajaxIng) {
        this.$store.commit('alertFn', {
          type: 'warning',
          text: '正在导出报表，请稍后',
        })
        return
      }
      this.ajaxIng = true
      let param = { projStage: this.stage }
      this.$api.download[
        this.tab.choose === '3'
          ? 'idcprojstagedetailexport'
          : 'projstagedetailexport'
      ](param, res => {
        let text
        switch (param.projStage) {
          case '01':
            text = '-立项'
            break
          case '02':
            text = '-需求确认'
            break
          case '03':
            text = '-投标准备'
            break
          case '04':
            text = '-签单'
            break
          default:
            text = '-全部'
        }
        this.$pubfunc.downloadFile(res, '项目阶段详细数据导出' + text + '.xlsx')
        this.ajaxIng = false
        this.$store.commit('alertFn', {
          type: 'success',
          text: '导出成功',
          func: () => {
            this.$emit('success')
          },
        })
      })
    },
  },
  mounted() {
    let tag = this.$pubfunc.getSStorage('tag'),
      judge = false
    this.$pubfunc.judgeBtn('salesfunnel:sysinte')
      ? (this.tab.list.push({ id: '2', name: '系统集成项目' }),
        tag === '系统集成项目' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('salesfunnel:idc')
      ? (this.tab.list.push({ id: '3', name: 'IDC项目' }),
        tag === 'IDC项目' ? (judge = true) : null)
      : null
    this.tab.list.length > 0
      ? (this.tab.choose = judge ? tag : this.tab.list[0].id)
      : null
    if (this.$route.query.choose) {
      this.tab.choose = JSON.parse(JSON.stringify(this.$route.query.choose))
    }
    if (this.$route.query.data) {
      this.changeStage(this.$route.query.data)
    } else {
      if (this.$pubfunc.getSStorage('stage')) {
        this.stage = JSON.parse(
          JSON.stringify(this.$pubfunc.getSStorage('stage')),
        )
      }
      if (this.$pubfunc.getSStorage('tab')) {
        this.tab.choose = JSON.parse(
          JSON.stringify(this.$pubfunc.getSStorage('tab')),
        )
      }
      this.getList(this.$store.state.page.page, this.stage)
      this.getData()
    }
  },
}
</script>


<style scoped>
.content {
  width: 60%;
  height: 60%;
  position: relative;
  display: inline-block;
}
.btnBox {
  margin-top: 50px;
}
.title {
  padding: 10px 0 10px 16px;
  line-height: 20px;
  color: #444444;
  font-size: 18px;
  position: absolute;
  left: 0;
  top: 0;
}
.funnelBox {
  height: 59%;
  position: relative;
}
.funnelBox > div {
  width: 50%;
  height: 100%;
}
.funnelBox > button {
  position: absolute;
  bottom: 16px;
  right: 0;
}
.funnelBox > button:nth-last-child(1) {
  right: 120px;
}
.tableContent {
  height: 41%;
  margin-bottom: -17px;
}
.tableContent .boxTable {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
<style>
.echartLine .el-scrollbar__view {
  min-height: 260px;
  height: 100%;
}
</style>
