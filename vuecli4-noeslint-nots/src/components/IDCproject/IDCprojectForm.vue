<template>
  <div class="fillBox projectForm_">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>
        <unit-popover :content="data.projName?data.projName:''"></unit-popover>
      </span>
      <unit-btn type='plain right'
                :text='name!=="IDCProjectView"?"取消":"返回"'
                @click="judgeCancel"></unit-btn>
      <unit-btn :type='name!=="IDCProjectView"&&!role?"right large":"right"'
                :loading='loading'
                :text='name!=="IDCProjectView"?(role?"保存":"保存本页"):"编辑"'
                @click="submit"
                v-if="!showChild&&(!role||name==='IDCProjectEdit'||(role&&(data.staffRole!=='check')))"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="topBox boxRound">
        <div>客户名称<span>
            <unit-popover :content="data.customerName?data.customerName:''"></unit-popover>
          </span></div>
        <div><i class="nbsp"></i>预计年合同额（元）<span>{{$pubfunc.transformPrice(data.estAnnualConAmount?data.estAnnualConAmount:'',true)}}</span></div>
        <div>项目类型<span>{{data.projTypeTxt}}</span></div>
        <div>销售<span>{{data.ownerName}}</span></div>
      </div>
      <div class="bottomBox"
           :class="{smallBox:name==='IDCProjectView'}">
        <unit-tab type="top"
                  :tab='tab1'
                  @click="returnBtn"
                  v-if="name==='IDCProjectView'&&judgeBtn.visitrecord&&tab1.list.length>1"></unit-tab>
        <div class="boxRound"
             :class="{smallPad:name==='IDCProjectView'&&judgeBtn.visitrecord&&tab1.list.length>1&&tab1.choose===2}">
          <ul class="projStatusBox"
              v-show="tab1.choose===1">
            <li v-for="(item,i) in tab.list"
                :key='i'
                :class="{'already':Number(item.id)<=Number(data.projStage),'active':item.id===tab.choose}"
                @click="dropdownReturn(item.id,'tab')"><span>{{item.name}}<i></i></span><i></i></li>
          </ul>
          <div class="boxRel projContentBox"
               :class="{largeBox:this.tab.choose==='01'}"
               v-show="tab1.choose===1">
            <el-scrollbar class="unitScrollbar">
              <div class="loadingCont"
                   v-if="loading">
                <unit-loading :loading='loading'></unit-loading>
              </div>
              <component :is="'proj'+(data.staffRole==='isAdmin'&&tab.choose==='01'?'01_':tab.choose)"
                         @loadingfn="loadingChange"
                         :data='data?data:{userInfo}'
                         :loading='loading'
                         :name='name'
                         :role='role'
                         :dom='dom'
                         v-show="!loading"
                         v-if="!showChild&&data.projId&&tab.choose"
                         @dialog='showDialog'
                         ref="children"></component>
            </el-scrollbar>
          </div>
          <div class="boxTable"
               v-show='tab1.choose===2'
               v-if="name==='IDCProjectView'&&judgeBtn.visitrecord&&tab1.list.length>1">
            <unit-loading :loading='loading1'
                          v-if="loading1"></unit-loading>
            <unit-table :total='total'
                        :limit='7'
                        :page='page'
                        v-if="!loading1||list.length>0"
                        :list='list'
                        :title='userInfo.isCharge==="1"?title1:title'
                        :operation="[{key:'view',show:judgeShow}]"
                        @click='tableOper'></unit-table>
            <unit-page :total='total'
                       :limit='7'
                       :page='page'
                       @pagechange="getList"></unit-page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
import unitPopover from '@/unit/components/popover'
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'IDCProjectForm',
  props: ['dom'],
  components: {
    unitTab,
    unitPopover,
    unitTable,
    proj01: resolve => require(['./approval'], resolve), //立项
    // proj01_: resolve => require(['./approval_isAdmin'], resolve), //立项
    proj01_: resolve => require(['./approval'], resolve), //立项
    proj02: resolve => require(['./visit'], resolve), //参观测试
    proj03: resolve => require(['./tender'], resolve), //投标
    proj04: resolve => require(['./sign'], resolve), //签单
  },
  data() {
    return {
      loading: false,
      list: [],
      loading1: true,
      total: 0,
      page: 1,
      role: false,
      name: null,
      nameChange: false,
      data: {},
      error: {
        key: null,
        msg: '',
      },
      tab: {
        list: [],
        choose: '',
      },
      tab1: {
        list: [{ id: 1, name: '项目信息' }],
        choose: 1,
      },
      title: [
        { key: 'dateTime_', name: '拜访时间', width: 22 },
        { key: 'contactName', name: '拜访对象', width: 17 },
        { key: 'visitTypeTxt', name: '拜访方式', width: 17 },
        { key: 'description', name: '拜访情况说明', width: 42 },
      ],
      title1: [
        { key: 'dateTime_', name: '拜访时间', width: 20 },
        { key: 'contactName', name: '拜访对象', width: 15 },
        { key: 'visitTypeTxt', name: '拜访方式', width: 15 },
        { key: 'creatorName', name: '销售', width: 15 },
        { key: 'description', name: '拜访情况说明', width: 35 },
      ],
      showChild: true,
      loading: true,
      loading1: false,
      reset: false,
    }
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    },
  },
  provide() {
    return {
      cancel: this.judgeCancel,
    }
  },
  computed: {
    special() {
      return this.$store.state.special.depLevel
    },
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let json = userInfo.info && userInfo.info.staff ? userInfo.info.staff : {}
      let depLevel = []
      if (
        Object.prototype.toString.call(json.department) === '[object Array]'
      ) {
        json.department.map(v => {
          depLevel.push(v.depLevel)
        })
      } else if (
        Object.prototype.toString.call(json.department) === '[object Object]'
      ) {
        depLevel.push(json.department.depLevel)
      }
      json.depLevel = depLevel
      return json
    },
    judgeBtn() {
      return {
        idcprojectUpdate: this.$pubfunc.judgeBtn('idcproject:update'),
        idcprojectView: this.$pubfunc.judgeBtn('idcproject:view'),
        idcprojectCommit: this.$pubfunc.judgeBtn('idcproject:commit'),
        visitrecord: this.$pubfunc.judgeBtn('visitrecord'),
      }
    },
  },
  provide() {
    return {
      cancel: this.judgeCancel,
    }
  },
  methods: {
    judgeShow(item, i, key) {
      return true
    },
    returnBtn(type, k) {
      switch (type) {
        case 'tab':
          this.tab1.choose = k
          k === 2 ? this.getList(1) : null
          break
      }
    },
    tableOper(key, item) {
      // console.log(key, item)
      switch (key) {
        case 'view':
          item.recordId
            ? this.$emit('dialog', {
                show: true,
                link: 'showVisit',
                small: true,
                title: '查看拜访记录',
                data: item,
              })
            : null
          break
      }
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key])
      }
    },
    loadingChange(j) {
      this.loading = j
      // console.log(this.loading)
    },
    showDialog(data) {
      // console.log(data)
      this.$emit('dialog', data)
    },
    dropdownReturn(res, key) {
      console.log(this.data)
      this.clearErr(key)
      switch (key) {
        case 'tab':
          if (
            this.tab.choose === res ||
            Number(res) > Number(this.data.projStage)
          ) {
            return
          }
          this.name === 'IDCProjectView'
            ? (this.tab.choose = res)
            : this.$refs.children.submit(() => {
                this.getDropData()
                this.tab.choose = res
              })
          break
        default:
          this.result[key] = res.value
          break
      }
    },
    getList(page) {
      this.page = page
      let param = {
        projId: this.projId,
      }
      param.limit = 7
      param.page = page
      if (!this.userInfo.isCharge) {
        delete param.staffName
      }
      this.loading1 = true
      this.$api.service.visit.recordList(param, res => {
        // console.log(res)
        this.loading1 = false
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
    getDropData() {
      let staffRoleFn = (userInfo, data, judgeBtn) => {
        let staffId = userInfo.staffId
        let proMsg = this.$pubfunc.getSStorage('proMsg')
        proMsg ? (proMsg = Number(proMsg)) : null
        if (userInfo.isAdmin === '1') {
          return 'isAdmin'
        }
        if (
          proMsg === 1 &&
          userInfo.isCharge === '1' &&
          userInfo.depLevel.indexOf(this.special) > -1 &&
          judgeBtn.idcprojectCommit
        ) {
          return 'isCharge'
        }
        if (
          userInfo.isCharge === '1' &&
          userInfo.depLevel.indexOf(this.special) > -1 &&
          judgeBtn.idcprojectCommit
        ) {
          if (data.commitStatus === '1') {
            return 'isCharge'
          } else if (!(data.owner === staffId)) {
            return 'check'
          }
        }
        if (data.owner === staffId) {
          return 'onlySelf'
        }
        return 'check'
      }

      this.tab.list && this.tab.list.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'idc_proj_stage', pCode: '' },
            res => {
              // console.log(res)
              switch (res.code) {
                case '0':
                  let list = []
                  ;(res.data ? res.data : []).map(v => {
                    list.push({ id: v.value, name: v.label })
                  })
                  this.tab.list = list
                  this.tab.choose = list[0].id
                  break
              }
            },
          )

      this.$api.service.IDCproject.getDetail({ projId: this.projId }, res => {
        this.showChild = false
        this.loading = false
        switch (res.code) {
          case '0':
            let staffId = this.userInfo.staffId
            this.data = res.data
            this.data.userInfo = this.userInfo
            this.data.haveVisitedRoom === null
              ? null
              : this.data.haveVisitedRoom === 0
              ? (this.data.haveVisitedRoomTxt = '否')
              : (this.data.haveVisitedRoomTxt = '是')
            this.data.tenderAmount_ = this.$pubfunc.transformPrice(
              this.data.tenderAmount,
              true,
            )
            this.data.estAnnualConAmount_ = this.$pubfunc.transformPrice(
              this.data.estAnnualConAmount,
              true,
            )
            this.data.signPossible === null
              ? null
              : this.data.signPossible === 1
              ? (this.data.signPossibleTxt = '是')
              : (this.data.signPossibleTxt = '否')
            this.role = this.userInfo.staffId !== this.data.owner && this.userInfo.isAdmin!='1' ? true : false
            let staffRole = staffRoleFn(this.userInfo, res.data, this.judgeBtn)
            if (
              !staffRole ||
              (staffRole === 'check' && this.name === 'IDCProjectEdit')
            ) {
              this.cancel()
              return
            }
            this.data.staffRole = staffRole
            let url = res.data.orgStructurePath
            url
              ? this.$api.public.getImg({ filePath: url }, res => {
                  let typeArr = url.split('.')
                  let src =
                    'data:image/' +
                    typeArr[typeArr.length - 1] +
                    ';base64,' +
                    res.data
                  this.$set(this.data, 'src', src)
                })
              : null
            break
          default:
            res.message
              ? this.$store.commit('alertFn', {
                  type: 'error',
                  text: res.message,
                  func: () => {
                    this.$router.push('/')
                  },
                })
              : this.$router.push('/')
        }
      })
    },

    cancel(j) {
      if (j) {
        this.$router.push({
          name: 'IDCProjectView',
          params: { projId: this.$pubfunc.encode(this.projId) },
        })
        this.name = 'IDCProjectView'
        this.judgeBtn.visitrecord && this.tab1.list.length === 1
          ? this.tab1.list.push({ id: 2, name: '拜访记录' })
          : null
        this.getDropData()
        j === true ? null : j()
        return
      }
      let proMsg = this.$pubfunc.getSStorage('proMsg')
      proMsg ? (proMsg = Number(proMsg)) : null
      let name =
        proMsg === 1
          ? 'message'
          : proMsg === 2
          ? 'salesfunnel'
          : proMsg === 3
          ? 'salesperformance'
          : null
      this.$router.push({ name: name ? name : 'idcproject' })
    },
    submit() {
      if (this.name === 'IDCProjectView') {
        this.nameChange = true
        this.judgeBtn.visitrecord && this.tab1.list.length > 1
          ? this.tab1.list.splice(1, 1)
          : null
        this.tab1.choose = 1
        this.name = 'IDCProjectEdit'
        this.getDropData()
      } else {
        this.$refs.children.submit()
      }
    },
    judgeCancel(j) {
      this.nameChange
        ? ((this.nameChange = false),
          (this.name = 'IDCProjectView'),
          this.getDropData(),
          this.judgeBtn.visitrecord && this.tab1.list.length === 1
            ? this.tab1.list.push({ id: 2, name: '拜访记录' })
            : null)
        : this.cancel(j)
    },
  },
  created() {
    if (!this.$route.params.projId) {
      this.cancel()
      return
    }
    this.name = this.$route.name
    console.log(this.name)
    this.projId = this.$route.params.projId
      ? this.$pubfunc.decode(this.$route.params.projId)
      : null
    switch (this.name) {
      case 'IDCProjectEdit':
        if (!this.judgeBtn.idcprojectUpdate) {
          this.cancel()
          return
        }
        break
      case 'IDCProjectView':
        this.judgeBtn.visitrecord
          ? this.tab1.list.push({ id: 2, name: '拜访记录' })
          : null
        break
    }
    this.getDropData()
  },
}
</script>

<style scoped>
.boxTitle > span {
  width: 68%;
}
.boxTitle > span > div {
  display: inline-block;
  vertical-align: top;
  max-width: calc(100% - 80px);
}
/* 头部 */
.topBox {
  box-sizing: border-box;
  padding: 20px 10px;
  font-size: 0;
  margin: 12px 0 22px;
  height: 98px;
  box-sizing: border-box;
}
.topBox > div {
  display: inline-block;
  width: 20%;
  text-align: center;
  font-size: 14px;
  color: #444444;
  box-sizing: border-box;
  padding-bottom: 12px;
  line-height: 30px;
  position: relative;
  vertical-align: top;
}
.topBox > div > span {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #4680f4;
  line-height: 22px;
}
/* 底部 */
.bottomBox {
  height: calc(100% - 140px);
  box-sizing: border-box;
  position: relative;
}
.bottomBox.smallBox {
  height: calc(100% - 140px - 42px);
  top: 42px;
}
.bottomBox > div {
  width: 100%;
  height: 100%;
  /* padding-top: 80px; */
  box-sizing: border-box;
  position: relative;
  padding: 80px 38px 0;
  z-index: 2;
}
.bottomBox > div.smallPad {
  padding: 30px 22px 18px;
}
/* tab */
.projStatusBox {
  position: absolute;
  z-index: 1;
  height: 32px;
  width: 100%;
  top: 28px;
  left: 0;
  text-align: center;
  font-size: 0;
}
.projStatusBox > li {
  display: inline-block;
  font-size: 16px;
  width: 111px;
  height: 32px;
  background-color: #bfbfbf;
  color: #787687;
  margin-right: 20px;
  position: relative;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.projStatusBox > li:nth-last-child(1) {
  margin-right: 0;
}
.projStatusBox > li > i,
.projStatusBox > li > i::before,
.projStatusBox > li > i::after {
  display: block;
  position: absolute;
  right: 0;
  z-index: 1;
}
.projStatusBox > li > i {
  width: 15px;
  height: 100%;
  top: 0;
}
.projStatusBox > li > i::before,
.projStatusBox > li > i::after {
  content: '';
  width: 0;
  height: 0;
  border-right: 15px solid #fff;
  transition: border-color 0.15s ease;
}
.projStatusBox > li > i::before {
  top: 0;
  border-bottom: 16px solid transparent;
}
.projStatusBox > li > i::after {
  bottom: 0;
  border-top: 16px solid transparent;
}
.projStatusBox > li::before {
  content: '';
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  border-left: 15px solid #fff;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
}
.projStatusBox > li > span {
  background-color: #f1f1f1;
  display: block;
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 16px;
  right: 16px;
  line-height: 30px;
  z-index: 2;
  transition: background-color 0.15s ease;
}
.projStatusBox > li > span::before,
.projStatusBox > li > span::after {
  content: '';
  display: block;
  position: absolute;
  z-index: 1;
  width: 0;
  height: 0;
  border-right: 15px solid #f1f1f1;
  left: -14px;
  transition: border-color 0.15s ease;
}
.projStatusBox > li > span::before {
  top: 0;
  border-bottom: 16px solid transparent;
}
.projStatusBox > li > span::after {
  bottom: 0;
  border-top: 16px solid transparent;
}
.projStatusBox > li > span > i {
  display: block;
  position: absolute;
  width: 15px;
  height: 100%;
  right: -15px;
  top: 0;
  overflow: hidden;
}
.projStatusBox > li > span > i::after {
  content: '';
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  right: 0px;
  top: -1px;
  border-left: 15px solid #f1f1f1;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  transition: border-color 0.15s ease;
}
.projStatusBox > li:nth-child(1):before {
  border: 0;
  width: 10px;
  background-color: #fff;
  height: 100%;
}
.projStatusBox > li:nth-child(1) > span {
  left: 11px;
}
.projStatusBox > li:nth-child(1) > span::before,
.projStatusBox > li:nth-child(1) > span::after {
  display: none;
}
.projStatusBox > li.already {
  background-color: #4780f4;
  color: #4780f4;
}
.projStatusBox > li.already > span {
  background-color: #d9e6ff;
}
.projStatusBox > li.already > span > i::after {
  border-left-color: #d9e6ff;
}
.projStatusBox > li.already > span > i::after {
  border-left-color: #d9e6ff;
}
.projStatusBox > li.already > span::before,
.projStatusBox > li.already > span::after {
  border-right-color: #d9e6ff;
}
.projStatusBox > li.already:not(.active):not(.unable) {
  cursor: pointer;
}
.projStatusBox > li.already:not(.active):hover {
  background-color: #1560f6;
  color: #1560f6;
}
.projStatusBox > li.already:not(.active):hover > span {
  background-color: #c0d5fd;
}
.projStatusBox > li.already:not(.active):hover > span > i::after {
  border-left-color: #c0d5fd;
}
.projStatusBox > li.already:not(.active):hover > span > i::after {
  border-left-color: #c0d5fd;
}
.projStatusBox > li.already:not(.active):hover > span::before,
.projStatusBox > li.already:not(.active):hover > span::after {
  border-right-color: #c0d5fd;
}
.projStatusBox > li.active {
  background-color: #4780f4;
  color: #fff;
}
.projStatusBox > li.active > span {
  background-color: #4780f4;
}
.projStatusBox > li.active > span > i::after {
  border-left-color: #4780f4;
}
.projStatusBox > li.active > span > i::after {
  border-left-color: #4780f4;
}
.projStatusBox > li.active > span::before,
.projStatusBox > li.active > span::after {
  border-right-color: #4780f4;
}
.projStatusBox > li.unable {
  background-color: #dddddd !important;
  color: #d1d1d1 !important;
  cursor: no-drop;
}
.projStatusBox > li.unable > span {
  background-color: #f8f8f8 !important;
}
.projStatusBox > li.unable > span > i::after {
  border-left-color: #f8f8f8 !important;
}
.projStatusBox > li.unable > span > i::after {
  border-left-color: #f8f8f8 !important;
}
.projStatusBox > li.unable > span::before,
.projStatusBox > li.unable > span::after {
  border-right-color: #f8f8f8 !important;
}
/* 内容 */
.projContentBox {
  height: calc(100% - 20px);
}
.formPage {
  padding: 0 16px;
}
/* 拜访记录 */
.fillBox .boxTable {
  position: relative;
  height: 100%;
}
</style>
<style>
.projectForm_
  > .contentFix
  > .bottomBox
  > div
  > .boxRel.largeBox
  > .unitScrollbar
  > .el-scrollbar__wrap
  > .el-scrollbar__view {
  min-width: 1000px;
}
.projectForm_ .el-scrollbar__view {
  height: auto;
}
.projectForm_ > .contentFix > .bottomBox ul.top > li {
  margin-left: 0px;
}
.projectForm_ > .contentFix > .bottomBox ul.top > li:nth-child(1) {
  margin-left: 10px;
}
</style>