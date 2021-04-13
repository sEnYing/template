<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-08 14:38:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-23 16:04:14
--> 
<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>IDC项目管理</span>
      <unit-btn type="large right"
                text="新建IDC项目"
                @click="tableOper('add',null)"
                v-if="judgeBtn.idcprojectAdd"></unit-btn>
      <unit-btn type="large right"
                text="批量导出"
                @click="tableOper('export',null)"
                v-if="judgeBtn.idcprojectExport"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
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
              <span class="formBox_text">项目类型</span>
              <div>
                <unit-dropdown v-setwidth
                               id="projType"
                               class="auto"
                               placeholder="全部"
                               :list="projType"
                               @change="dropdownReturn"
                               :result="selMod.projType"
                               :clear="true"
                               :reset="reset"></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目状态</span>
              <div>
                <unit-dropdown v-setwidth
                               id="projStatus"
                               class="auto"
                               placeholder="全部"
                               :list="projStatus"
                               @change="dropdownReturn"
                               :result="selMod.projStatus"
                               :clear="true"
                               :reset="reset"></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目阶段</span>
              <div>
                <unit-dropdown v-setwidth
                               id="projStage"
                               class="auto"
                               placeholder="全部"
                               :list="projStage"
                               @change="dropdownReturn"
                               :result="selMod.projStage"
                               :clear="true"
                               :reset="reset"></unit-dropdown>
              </div>
            </div>

            <div>
              <span class="formBox_text">项目赢率</span>
              <div>
                <div v-setwidth
                     class="input">
                  <unit-dropdown id="minWinRate"
                                 class="auto"
                                 placeholder="全部"
                                 :list="winRate"
                                 @change="dropdownReturn"
                                 :result="selMod.minWinRate"
                                 :clear="true"
                                 :reset="reset"></unit-dropdown>
                  <i>-</i>
                  <unit-dropdown id="maxWinRate"
                                 class="auto"
                                 placeholder="全部"
                                 :list="winRate"
                                 @change="dropdownReturn"
                                 :result="selMod.maxWinRate"
                                 :clear="true"
                                 :reset="reset"></unit-dropdown>
                </div>
              </div>
            </div>

            <div>
              <span class="formBox_text marl">销售</span>
              <div>
                <unit-dropdown v-setwidth
                               id="owner"
                               class="auto"
                               placeholder="全部"
                               :list="ownerList"
                               @change="dropdownReturn"
                               :result="selMod.owner"
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
                        :select="false"
                        v-if="!loading||list.length>0"
                        :opern="judgeBtn.num"
                        :list="list"
                        :title="title"
                        ref="table"
                        :operation="[{key:'view',show:judgeShow},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}},{key:'share',show:judgeShow},{key:'transfer',show:judgeShow},{key:'addVisit',show:judgeShow},{key:'amountallot',show:judgeShow}]"
                        @click="tableOper"
                        @selection="getData"></unit-table>
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
import '@/assets/font/customerManage/iconfont.css'
export default {
  name: 'idcproject',
  props: ['dom'],
  components: { unitTree, unitTable },
  data() {
    return {
      selMod: {
        depId: '',
        projName: '',
        customerName: '',
        projType: '',
        projStatus: '',
        projStage: '',
        minWinRate: '',
        maxWinRate: '',

        owner: '',
      },
      selRes: {},
      reset: true,
      projType: [],
      projStatus: [],
      projStage: [],
      winRate: [],
      treeData: [],
      title: [
        { key: 'projName', name: '项目名称', width: 17 },
        { key: 'customerName', name: '客户名称', width: 17 },
        { key: 'customerLevelTxt', name: '客户等级', width: 17 },
        { key: 'ownerName', name: '销售', width: 10 },
        { key: 'projTypeTxt', name: '项目类型', width: 10 },
        { key: 'projStageTxt', name: '项目阶段', width: 10 },
        { key: 'projStatusTxt', name: '项目状态', width: 10 },
        { key: 'commitStatusTxt', name: 'commit状态', width: 10 },
        { key: 'commitConfirmTxt', name: '	commit确认', width: 12 },
        { key: 'isInProcess', name: '共享/转移中', width: 10 },
      ],
      list: [],
      loading: false,
      ajaxIng: false,
      total: 0,
      page: 1,
      hideTree: false,
      depList: [],
      ownerList: [],
    }
  },
  computed: {
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
    special() {
      return this.$store.state.special.depLevel
    },
    judgeBtn() {
      let json = {
          idcprojectAdd: this.$pubfunc.judgeBtn('idcproject:add'),
          idcprojectUpdate: this.$pubfunc.judgeBtn('idcproject:update'),
          idcprojectView: this.$pubfunc.judgeBtn('idcproject:view'),
          idcprojectCommit: this.$pubfunc.judgeBtn('idcproject:commit'),
          idcprojectDelete: this.$pubfunc.judgeBtn('idcproject:delete'),
          idcprojectExport: this.$pubfunc.judgeBtn('idcproject:export'),
          idcprojectShare: this.$pubfunc.judgeBtn('idcproject:share'),
          idcprojectTransfer: this.$pubfunc.judgeBtn('idcproject:transfer'),
          visitrecord: this.$pubfunc.judgeBtn('visitrecord'),
          idcprojectAmountallot: true,
        },
        num = 1
      json.idcprojectUpdate || json.idcprojectCommit ? num++ : null
      json.idcprojectView ? num++ : null
      json.idcprojectCommit ? num++ : null
      json.idcprojectDelete ? num++ : null
      json.idcprojectShare ? num++ : null
      json.idcprojectTransfer ? num++ : null
      json.visitrecord ? (num += num < 2 ? 2 : 1) : null
      json.num = num
      return json
    },
  },
  methods: {
    judgeShow(item, i, key) {
      switch (key) {
        case 'view':
          return true
        case 'delete':
          return this.judgeBtn.idcprojectDelete &&
            (this.userInfo.isAdmin === '1' ||
              item.owner === this.userInfo.staffId)
            ? true
            : false
        case 'share':
          return (this.userInfo.isAdmin == '1' || item.isShare == '0') &&
            item.isInProcess != '是' &&
            this.judgeBtn.idcprojectShare
            ? true
            : false
        case 'transfer':
          return item.projStatus != '03' &&
            item.projStatus != '04' &&
            item.projStatus != '06' &&
            (this.userInfo.isAdmin == '1' || item.isShare == '0') &&
            this.judgeBtn.idcprojectTransfer &&
            item.isInProcess != '是'
            ? true
            : false
        case 'revise':
          return this.userInfo.isAdmin === '1' ||
            (this.judgeBtn.idcprojectCommit &&
              this.userInfo.depLevel.indexOf(this.special) > -1 &&
              item.commitStatus === '1') ||
            (this.judgeBtn.idcprojectUpdate &&
              item.owner === this.userInfo.staffId)
            ? true
            : false
        case 'amountallot':
          return this.userInfo.resourceType == '02' &&
            item.isShare == '0' &&
            this.judgeBtn.idcprojectAmountallot &&
            item.shareStaffList.length > 0 &&
            item.isInProcess != '是'
            ? true
            : false
        default:
          return this.judgeBtn.visitrecord &&
            item.owner === this.userInfo.staffId
            ? true
            : false
      }
    },
    hideOther(j) {
      this.hideTree = j ? j : false
    },
    dropdownReturn(res, key) {
      switch (key) {
        case 'projName':
          this.selMod.projName = res.label
          break
        case 'customerName':
          this.selMod.customerName = res.label
          break
        case 'depId':
          this.selMod.depId = res[0].depId
          break
        default:
          this.selMod[key] = res.value
          break
      }
    },
    tableOper(key, item) {
      let staffId
      switch (key) {
        case 'view':
          console.log(item)
          staffId = this.userInfo.staffId
          item.projId
            ? ((staffId === item.preSale && item.owner !== staffId) ||
                (staffId === item.tecDirector && item.owner !== staffId)) &&
              !(
                this.judgeBtn.idcprojectCommit &&
                this.userInfo.department &&
                this.userInfo.depLevel.indexOf(this.special) > -1
              )
              ? this.$router.push({
                  name: 'IDCProjectBackView',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
              : this.$router.push({
                  name: 'IDCProjectView',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
            : null
          break
        case 'add':
          this.$router.push({ name: 'IDCProjectAdd' })
          break
        case 'delete':
          this.$store.commit('confirmFn', {
            func: () => {
              if (this.loading) {
                return
              }
              this.loading = true
              this.$api.service.IDCproject.delIDCProject(
                { projId: item.projId },
                res => {
                  // console.log(res)
                  this.loading = false
                  switch (res.code) {
                    case '0':
                      this.$store.commit('alertFn', {
                        type: 'success',
                        text: '删除成功',
                        func: () => {
                          this.tableOper('select', null)
                        },
                      })
                      break
                    default:
                      res.message
                        ? this.$store.commit('alertFn', {
                            type: 'error',
                            text: res.message,
                          })
                        : null
                  }
                },
              )
            },
            text: '确认删除该项目信息吗？<br>删除后不可恢复',
          })
          break
        case 'addVisit':
          this.$emit('dialog', {
            show: true,
            link: 'addVisit',
            small: true,
            title: '添加拜访记录',
            data: { key: 'project', item },
          })
          break
        case 'share':
          const that = this
          item.meta = 'share'
          this.$emit('dialog', {
            show: true,
            link: 'shareCustomer',
            small: true,
            title: `共享IDC项目申请`,
            data: {
              item,
              cb: () => {
                this.getList(1)
              },
              cb2: d => {
                this.$emit('dialog', {
                  show: true,
                  link: 'distributionRatio',
                  small: true,
                  title: '共享IDC项目分配比例',
                  data: {
                    item,
                    d,
                    cb: () => {
                      that.getList(1)
                    },
                  },
                })
              },
            },
          })
          break
        case 'transfer':
          this.$emit('dialog', {
            show: true,
            link: 'transferCustomer',
            small: true,
            title: `转移IDC项目申请`,
            data: {
              item,
              cb: () => {
                this.getList(1)
              },
            },
          })
          break
        case 'export':
          if (this.ajaxIng) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出报表，请稍后',
            })
            return
          }
          let param = JSON.parse(JSON.stringify(this.selRes))
          param.minWinRate || param.minWinRate === 0
            ? (param.minWinRate = Number(param.minWinRate))
            : null
          param.maxWinRate || param.maxWinRate === 0
            ? (param.maxWinRate = Number(param.maxWinRate))
            : null
          param.minAmount || param.minAmount === 0
            ? (param.minAmount = Number(param.minAmount) * 10000)
            : null
          param.maxAmount || param.maxAmount === 0
            ? (param.maxAmount = Number(param.maxAmount) * 10000)
            : null
          this.ajaxIng = true
          this.$api.download.idcprojectExport(param, res => {
            this.$pubfunc.downloadFile(
              res,
              'IDC项目列表' +
                this.$pubfunc.TimeTransform(
                  'YYYYMMDDhhmmss',
                  this.$pubfunc.getTimeNum(),
                ) +
                '.xlsx',
            )
            this.ajaxIng = false
            this.$store.commit('alertFn', {
              type: 'success',
              text: '导出成功',
              func: () => {
                this.$emit('success')
              },
            })
          })
          break
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
        case 'revise':
          staffId = this.userInfo.staffId
          item.projId
            ? ((staffId === item.preSale && item.owner !== staffId) ||
                (staffId === item.tecDirector && item.owner !== staffId)) &&
              !(
                this.judgeBtn.idcprojectCommit &&
                this.userInfo.department &&
                this.userInfo.depLevel.indexOf(this.special) > -1
              )
              ? this.$router.push({
                  name: 'IDCProjectBack',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
              : this.$router.push({
                  name: 'IDCProjectEdit',
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
            : null
          break
        case 'amountallot':
          item.meta = 'amountallot'
          console.log(item)
          let shareToName = []
          let shareToId = []
          if (item.shareStaffList && item.shareStaffList.length > 0) {
            for (var i = 0; i < item.shareStaffList.length; i++) {
              shareToId.push(item.shareStaffList[i].staffId)
              shareToName.push(item.shareStaffList[i].staffName)
            }
          }
          let d = { shareToName, shareToId }
          this.$emit('dialog', {
            show: true,
            link: 'distributionRatio',
            small: true,
            title: `共享IDC项目分配比例`,
            data: {
              item,
              d,
              cb: () => {
                this.getList(1)
              },
            },
          })
          break
      }
    },
    getData(val) {},
    getList(page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.minWinRate || param.minWinRate === 0
        ? (param.minWinRate = Number(param.minWinRate))
        : null
      param.maxWinRate || param.maxWinRate === 0
        ? (param.maxWinRate = Number(param.maxWinRate))
        : null
      param.minAmount || param.minAmount === 0
        ? (param.minAmount = Number(param.minAmount) * 10000)
        : null
      param.maxAmount || param.maxAmount === 0
        ? (param.maxAmount = Number(param.maxAmount) * 10000)
        : null
      param.limit = 10
      param.page = page
      this.loading = true
      this.$api.service.IDCproject.getIDCProject(param, res => {
        this.loading = false
        switch (res.code) {
          case '0':
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            this.list = list
            this.list.push()
            break
        }
      })
    },
    getTreeData() {
      this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: '02,05,07' },
        res => {
          this.treeData = res.data
        },
      )
      this.$api.public.depmgnt(res => {
        switch (res.code) {
          case '0':
            this.depList = res.data ? res.data : []
            break
        }
      })
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: 'idc_proj_type', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.projType = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict(
        { codeGroup: 'idc_proj_status', pCode: '' },
        res => {
          // console.log(res)
          switch (res.code) {
            case '0':
              this.projStatus = res.data ? res.data : []
              break
          }
        },
      )
      this.$api.public.dict({ codeGroup: 'idc_proj_stage', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.projStage = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'idc_win_rate', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.winRate = res.data ? res.data : []
            break
        }
      })
      this.$api.bgmgnt.staff.getList({ resourceType: '02,05,07' }, res => {
        //分公司总+销售总监+销售
        // console.log(res)
        switch (res.code) {
          case '0':
            let list = []
            ;(res.data.list ? res.data.list : []).map(v => {
              list.push({
                value: v.staffId,
                label: v.staffName + '(' + v.staffNo + ')',
              })
            })
            this.ownerList = list
            break
        }
      })
    },
  },
  created() {
    this.getTreeData()
    this.getDropData()
    this.reset = !this.reset
    this.selMod = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.selMod))
    this.getList(this.$store.state.page.page)
  },
  mounted() {
    this.$pubfunc.delSStorage('proMsg')
  },
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% + 2px);
}
.formBox > div:nth-child(5) {
  /* padding-left: 38px; */
  padding-right: 0;
  width: calc(20% - 9px);
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
.formBox > div > div > div.input > input {
  width: calc(45% - 19px);
}
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
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
.marl {
  margin-left: 28px;
}
div.ableClick {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  position: absolute;
  left: -15px;
  top: 2px;
  background-color: #fff;
  color: #fff;
  font-size: 12px;
  line-height: 14px;
  z-index: 1;
  -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.tree .func div.ableClick {
  left: -15px;
  top: 8px;
}
div.ableClick.active {
  background-color: #409eff;
  border-color: #409eff;
}
div.ableClick::before {
  opacity: 0;
  -webkit-transition: opacity 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  transition: opacity 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
div.ableClick.active::before {
  opacity: 1;
}
div.ableClick.disabled {
  border: 1px solid rgb(220, 223, 230);
  background-color: rgb(227, 226, 229);
}
</style>
<style>
.customerManage_transfers_dialog .el-tree-node__content,
.customerManage_share_dialog .el-tree-node__content {
  position: relative;
}
.customerManage_transfers_dialog .el-tree-node__content:hover div.ableClick,
.customerManage_share_dialog .el-tree-node__content:hover div.ableClick {
  border-color: #409eff;
}
.customerManage_transfers_dialog
  .el-tree-node__content:hover
  div.ableClick.disabled,
.customerManage_share_dialog
  .el-tree-node__content:hover
  div.ableClick.disabled {
  border: 1px solid rgb(220, 223, 230);
  cursor: no-drop;
}
</style>