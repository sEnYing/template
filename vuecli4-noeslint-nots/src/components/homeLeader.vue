<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="main_icon"></i>
      <span>首页</span>
      <unit-btn v-if="year"
                type="large right plain"
                text="返回"
                @click="showYears(false)"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="topDate">
            <div class="left dateBox">
              <unit-tab :tab='tab'
                        v-if="tab.list&&tab.list.length>0"
                        class="tab"
                        @click="returnBtn"></unit-tab>
              <unit-funnel :dom="dom"
                           :list="list"
                           @click="changeStage"></unit-funnel>
            </div>
            <div class="right echartBox echartBox1">
              <unit-line :dom="dom"></unit-line>
            </div>
          </div>
          <div class="boxTable homeTable">
            <div class="title">销售任务完成情况</div>
            <unit-sign :dom="dom"></unit-sign>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
import unitLine from '@/unit/components/echarts/topTen'
import unitFunnel from '@/unit/components/echarts/statFunnel'
import unitSign from '@/unit/components/echarts/signHome'
export default {
  name: 'homeLeader',
  props: ['dom'],
  components: { unitLine, unitFunnel, unitSign, unitTab },
  data() {
    return {
      year: false,
      total: 0,
      page: 1,
      loading: true,
      list: [],
      tab: {
        list: [],
        choose: '',
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {}
    },
    time() {
      let time = this.$pubfunc.timestampToTime()
      return this.$pubfunc.TimeTransform(
        'YYYY/MM/DD',
        new Date(time.Year, time.Month - 1, time.Day, 0, 0, 0),
      )
    },
  },
  methods: {
    changeStage(s) {
      const data = s
      this.$router.push({
        path: '/salesfunnel',
        query: {
          choose: this.tab.choose,
        },
      })
    },
    showYears(j) {
      this.year = j
    },
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          this.tab.choose = k
          this.getList(1, this.time)
          break
      }
    },
    getList(page, time) {
      this.$api.service.stat[
        this.tab.choose === '2' ? 'projstagestat' : 'idcprojstagestat'
      ](res => {
        switch (res.code) {
          case '0':
            this.list = res.data.list ? res.data.list : []
            break
        }
      })
    },
  },
  created() {
    let tag = this.$pubfunc.getSStorage('tag'),
      judge = false
    this.$pubfunc.judgeBtn('salesfunnel:sysinte')
      ? (this.tab.list.push({ id: '2', name: '系统集成销售漏斗' }),
        tag === '系统集成销售漏斗' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('salesfunnel:idc')
      ? (this.tab.list.push({ id: '3', name: 'IDC销售漏斗' }),
        tag === 'IDC销售漏斗' ? (judge = true) : null)
      : null
    this.tab.list.length > 0
      ? (this.tab.choose = judge ? tag : this.tab.list[0].id)
      : null
    this.getList(1, this.time)
  },
  mounted() {},
}
</script>

<style scoped>
.topDate {
  height: 60%;
  width: 100%;
  box-sizing: border-box;
}
.topDate > div {
  height: 100%;
  padding-bottom: 76px;
  box-sizing: border-box;
}
.topDate > div.dateBox {
  width: 50%;
  padding-top: 40px;
  padding-left: 76px;
}
.topDate > div.dateBox > .title {
  padding: 10px 0 10px 16px;
  line-height: 20px;
  color: #444444;
  font-size: 18px;
  position: absolute;
  top: 0;
  margin-left: -76px;
}
.topDate > div.dateBox > .tab {
  position: absolute;
  top: -15px;
  margin-left: -5px;
  padding: 10px 0 10px 16px;
  line-height: 20px;
}
.topDate > div.dateBox > .tab::before {
  border-bottom: 0px;
}
.topDate > div.echartBox {
  width: 38%;
}
.boxTable {
  height: 40%;
  width: 100%;
  position: relative;
  padding-top: 40px;
  box-sizing: border-box;
}
.contentFix {
  min-width: 980px;
}
.fillBox .boxTable .title {
  padding: 10px 0 10px 16px;
  line-height: 20px;
  color: #444444;
  font-size: 18px;
  position: absolute;
  left: 0;
  top: 0;
}
.contentFix::before {
  content: '';
  width: 14px;
  position: absolute;
  right: 38%;
  bottom: 40%;
  top: -20px;
  background-color: #f0f3fa;
  z-index: 111;
  margin-right: 30px;
  margin-bottom: 14px;
}
.contentFix::after {
  content: '';
  height: 16px;
  position: absolute;
  left: -30px;
  right: -30px;
  bottom: 40%;
  margin-bottom: 14px;
  background-color: #f0f3fa;
  z-index: 111;
}
</style>
<style>
.echartBox > div > div.title {
  padding-left: 0;
}
</style>
