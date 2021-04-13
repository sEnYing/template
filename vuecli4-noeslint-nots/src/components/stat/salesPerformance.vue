<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="dashboard_icon"></i><span>销售业绩仪表盘</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <div class="loadingCont"
             v-if="loading">
          <unit-loading :loading='loading'></unit-loading>
        </div>
        <unit-tab class="contactListTab"
                  :tab='tab'
                  @click="returnBtn"
                  v-if='tab.list.length>0'></unit-tab>
        <!-- <el-scrollbar class="unitScrollbar" ref='scrollbar' v-if="tab.choose!='task'&&tab.choose!='teamTask'">
                <component :is="tab.choose" @dialog='showDialog' v-if="tab.choose!='task'&&tab.choose!='teamTask'" :dom='dom'></component>
            </el-scrollbar> -->
        <component :dom='dom'
                   :is="tab.choose"
                   @dialog='showDialog'
                   v-if='tab.choose'></component>
      </div>
    </div>
  </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
export default {
  name: 'salesPerformance',
  props: ['dom'],
  components: {
    unitTab,
    bid: resolve => require(['./performance/bid'], resolve), //投标项目
    commit: resolve => require(['./performance/commit'], resolve), //commit
    pipeline: resolve => require(['./performance/pipeline'], resolve), //pipeline
    sign: resolve => require(['./performance/sign'], resolve), //签约项目
    task: resolve => require(['./performance/task'], resolve), //销售人员任务
    teamtask: resolve => require(['./performance/teamTask'], resolve), //销售团队任务
  },
  data() {
    return {
      loading: false,
      tab: {
        list: [],
        choose: null,
      },
    }
  },
  methods: {
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          // this.tab.choose!==k?this.loadingChange(true):null;
          this.tab.choose !== k ? this.loadingChange(false) : null
          this.tab.choose = k
          this.$store.commit('searchConditionFn', {})
          this.$store.commit('pageFn', { page: 1, limit: 10 })
          this.$pubfunc.setSStorage('tabChoose', '')
          break
      }
    },
    showDialog(data) {
      // console.log(data)
      this.$emit('dialog', data)
    },
    loadingChange(j) {
      this.loading = j
    },
  },
  created() {
    let tag = this.$pubfunc.getSStorage('tag'),
      judge = false
    this.$pubfunc.judgeBtn('performance:completecondition')
      ? this.tab.list.push({ id: 'task', name: '销售人员任务完成情况' })
      : null
    this.$pubfunc.judgeBtn('performance:teamcompletecondition')
      ? this.tab.list.push({ id: 'teamtask', name: '销售团队任务完成情况' })
      : null
    this.$pubfunc.judgeBtn('performance:pipeline')
      ? (this.tab.list.push({ id: 'pipeline', name: 'pipeline' }),
        tag === 'pipeline' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:commit')
      ? (this.tab.list.push({ id: 'commit', name: 'commit' }),
        tag === 'commit' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:tender')
      ? (this.tab.list.push({ id: 'bid', name: '投标项目' }),
        tag === 'bid' ? (judge = true) : null)
      : null
    this.$pubfunc.judgeBtn('performance:sign')
      ? (this.tab.list.push({ id: 'sign', name: '签约项目' }),
        tag === 'sign' ? (judge = true) : null)
      : null
    console.log(judge, tag)
    this.tab.list.length > 0
      ? (this.tab.choose = judge ? tag : this.tab.list[0].id)
      : null
  },
  mounted() {},
}
</script>

<style scoped>
.contactListTab {
  z-index: 11;
  white-space: nowrap;
}
.boxRel {
  min-width: 960px;
}
</style>