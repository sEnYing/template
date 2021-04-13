<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="main_icon"></i>
      <span>首页</span>
      <unit-btn v-if="year" type="large right plain" text="返回" @click="showYears(false)"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="topDate" v-if="!year">
            <div class="left dateBox">
              <unit-week @clickli="changeList" @back="showYears(true)"></unit-week>
            </div>
            <div class="left echartBox">
              <unit-liquid :dom="dom" :type="'self'" @click="changeStage"></unit-liquid>
            </div>
          </div>
          <div class="boxTable homeTable" v-if="!year">
            <unit-loading :loading="loading" v-if="loading"></unit-loading>
            <unit-table
              :total="total"
              :indexrow="0"
              :opern="2"
              :limit="4"
              :page="page"
              v-if="!loading||list.length>0"
              :list="list"
              :title="title"
              ref="table"
              :operation="[{key:'addVisit',show:judgeShow}]"
              @click="tableOper"
            ></unit-table>
            <unit-page :total="total" :page="page" @pagechange="getList" :limit="4"></unit-page>
          </div>
          <unit-year v-if="year"></unit-year>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
import unitLiquid from '@/unit/components/echarts/liquid'
import unitWeek from '@/unit/components/thisUnit/week'
import unitYear from '@/unit/components/thisUnit/year'
export default {
  name: 'home',
  props: ['dom'],
  components: { unitTable, unitLiquid, unitWeek, unitYear },
  data () {
    return {
      year: false,
      total: 0,
      page: 1,
      paramTime: '',
      loading: true,
      list: [],
      title: [{ key: 'date_', name: '日期', width: 14 }, { key: 'time_', name: '时间', width: 12 }, { key: 'visitTypeTxt', name: '拜访方式', width: 11 }, { key: 'contactName', name: '拜访对象', width: 11 }, { key: 'position', name: '职务', width: 11 }, { key: 'cityName', name: '地区（城市）', width: 11 }, { key: 'customerName', name: '客户名称', width: 15 }, { key: 'projName', name: '项目名称', width: 15 }],
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {};
    },
    staffId () {
      return this.userInfo && this.userInfo.info && this.userInfo.info.staff ? this.userInfo.info.staff.staffId : null
    },
    time () {
      let time = this.$pubfunc.timestampToTime();
      return this.$pubfunc.TimeTransform('YYYY/MM/DD', new Date(time.Year, time.Month - 1, time.Day, 0, 0, 0))
    },
    judgeBtn () {
      return {
        visitrecord: this.$pubfunc.judgeBtn('visitrecord'),
      }
    },
    reload () {
      return this.$store.state.reload;
    },
  },
  watch: {
    reload () {
      console.log(this.reload)
      if (this.reload === true) {
        this.getList(1);
        this.$store.commit('reloadFn', false);
      }
    },
  },
  methods: {
    changeStage (s) {
      console.log(s);
    },
    judgeShow (item, i, key) {
      switch (key) {
        case 'addVisit': return this.judgeBtn.visitrecord && item.creator === this.staffId && !item.recordId ? true : false
      }
    },
    showYears (j) {
      this.year = j;
    },
    getList (page, time) {
      this.page = page;
      time ? this.paramTime = time : null;
      // console.log(this.userInfo.info.staff.staffId)
      let param = {
        visitDateFrom: this.paramTime,
        visitDateTo: this.paramTime,
        customerName: '',
        page: page,
        limit: 4
      }
      this.userInfo.info && this.userInfo.info.staff && this.userInfo.info.staff.staffId ? param.staffId = this.userInfo.info.staff.staffId : null
      // console.log(param)
      this.loading = true;
      this.$api.service.visit.planList(param, res => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case '0':
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map(v => {
              v.date_ = this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.date);
              v.time_ = this.$pubfunc.transTime(v.time);
            })
            this.list = list;
            break;
        }
      })
    },
    tableOper (type, item) {
      // console.log(type,item)
      switch (type) {
        case 'addVisit':
          this.$emit('dialog', { show: true, link: 'addVisit', small: true, title: '添加拜访记录', data: { key: 'visitPlan', item } });
          break;
      }
    },
    changeList (time) {
      this.getList(1, time ? time : this.paramTime);
    },
  },
  created () {
    this.getList(1, this.time);
  },
  mounted () {
  },
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
  padding-bottom: 25px;
  box-sizing: border-box;
}
.topDate > div.dateBox {
  width: 75%;
  padding-right: 30px;
}
.topDate > div.echartBox {
  width: 25%;
}
.boxTable {
  height: 40%;
  width: 100%;
  position: relative;
}
</style>
