<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="salestarget_icon"></i>
      <span>年度任务额</span>
      <unit-btn type="large right"
                text="批量导入"
                @click="tableOper('template',null)"></unit-btn>
      <unit-btn type="auto right"
                text="全部人员导出"
                @click="tableOper('import',null)"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">销售</span>
              <div>
                <input v-setwidth
                       type="text"
                       placeholder="全部"
                       v-model="selMod.staffName"
                       @keydown.enter="tableOper('select',null)" />
              </div>
            </div>
            <div class="dropTree">
              <span class="formBox_text">所属部门</span>
              <div>
                <unit-tree id="depId"
                           class="auto"
                           v-setwidth
                           :list="depList"
                           :choose="[selMod.depSel]"
                           :hid="hideTree"
                           @click="hideOther"
                           placeholder="全部"
                           @return="dropdownReturn"
                           :only="true"
                           :expendclick="false"
                           keyid="depId"
                           must="false"></unit-tree>
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
                        :title="title"
                        ref="table"
                        @click="tableOper"
                        :opern="judgeBtn.num"
                        :operation="[{key:'view',show:judgeShow},{key:'revise',show:judgeShow}]"></unit-table>
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
import unitTree from '@/unit/components/element/tree'
export default {
  name: 'salestarget',
  props: ['dom'],
  components: { unitTable, unitTree }, //unitUpload
  data () {
    return {
      selMod: {
        staffName: '',
        depId: '',
        depSel: ''
      },
      year: this.$pubfunc.timestampToTime().Year,
      selRes: {},
      title: [
        { key: 'staffName', name: '销售', width: 18 },
        { key: 'staffNo', name: '工号', width: 14 },
        { key: 'branchCompanyName', name: '分子公司', width: 18 },
        { key: 'depName', name: '所属部门', width: 18 },
        { key: 'phone', name: '电话', width: 14 },
        { key: 'salesAmount_', name: '年度任务额（元）', width: 18 }
      ],
      list: [],
      // ajaxIng:false,
      // templateLoading:false,
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
      depList: [],
      hideTree: false
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
      return { isCharge, staffId }
    },
    reload () {
      return this.$store.state.reload
    },
    judgeBtn () {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let json = {
        salestargetImport: this.$pubfunc.judgeBtn('salestarget:import'),
        salestargetUpdate: this.$pubfunc.judgeBtn('salestarget:edit')
      },
        num = 1
      json.salestargetUpdate ? num++ : null
      json.num = num
      return json
    }
  },
  watch: {
    reload () {
      if (this.reload === true) {
        this.getList(1)
        this.$store.commit('reloadFn', false)
      }
    }
  },
  methods: {
    hideOther (j) {
      this.hideTree = j ? j : false
    },
    judgeShow (item, i, key) {
      switch (key) {
        case 'view':
          return true
      }
      return this.judgeBtn.salestargetUpdate ? true : false
    },
    getList (page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.year = this.year
      param.limit = 10
      param.page = page
      // console.log(param)
      this.loading = true
      this.$api.service.salestarget.getList(param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.createTime_ = this.$pubfunc.TimeTransform(
                'YYYY年MM月DD日',
                v.createTime
              )
              v.salesAmount_ = this.$pubfunc.transformPrice(v.salesAmount, true)
              v.region =
                (v.provinceName ? v.provinceName : '') +
                (v.provinceName && v.cityName ? '/' : '') +
                (v.cityName ? v.cityName : '')
            })
            this.list = list
            break
        }
      })
    },
    dropdownReturn (res, key) {
      switch (key) {
        case 'depId':
          this.selMod.depSel = res[0].depId
          let depArr = []
          depArr.push(res[0].depId)
          depArr.push(this.getChildDep(res[0].children))
          this.selMod.depId = depArr.join(',')
          break
        default:
          this.selMod[key] = res.value
      }
    },
    getChildDep (children) {
      if (children && children.length > 0) {
        let depArr = []
        children.map((item, i) => {
          depArr.push(item.depId)
          let childArr = this.getChildDep(item.children)
          childArr && childArr.length > 0 ? depArr.push(childArr) : null
        })
        return depArr
      }
      return []
    },
    tableOper (key, item) {
      // console.log(key,item)
      let title
      this.hideTree = true
      switch (key) {
        case 'select':
          this.$store.commit('searchConditionFn', this.selMod)
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
          this.getList(1)
          return
        case 'clear':
          for (let k in this.selMod) {
            this.selMod[k] = ''
          }
          this.tableOper('select', null)
          return
        case 'view':
          title = '查看'
          break
        case 'revise':
          title = '编辑'
          break
        case 'template':
          title = '全部人员导出'
        case 'import':
          title = '批量导入'
      }
      let data = item
        ? {
          key: key,
          year: this.year,
          staffId: item.staffId,
          depId: item.depId,
          item: item
        }
        : { key: key, year: this.year }
      this.$emit('dialog', {
        show: true,
        link: 'salesAmount',
        small: true,
        title: title + '年度任务额',
        data: data
      })
    },
    getInfo () {
      this.$api.public.depmgnt(res => {
        switch (res.code) {
          case '0':
            this.depList = res.data ? res.data : []
            break
        }
      })
    }
  },
  created () {
    this.getInfo()
    this.selMod = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.selMod))
    this.getList(this.$store.state.page.page)
  },
  mounted () { }
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  position: relative;
  padding-left: 66px;
  width: calc(20% + 10px);
}
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div:nth-child(1) {
  padding-left: 38px;
  width: calc(20% + 22px);
}
.formBox > div > div > * {
  width: 100%;
}
.fillBox .boxTable {
  height: calc(100% - 68px);
}
.formBox > .dropTree:not(.btnBox) {
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
</style>
