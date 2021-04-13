<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="customer_icon"></i>
      <span>客户管理</span>
      <unit-btn type="large right"
                text="批量导出"
                @click="tableOper('export',null)"
                v-if="judgeBtn.customerExport"></unit-btn>
      <unit-btn type="large right"
                text="批量转移"
                @click="tableOper('transfers', null)"
                v-if="judgeBtn.customerTransfer"></unit-btn>
      <unit-btn type="large right"
                text="客户导入"
                @click="tableOper('import', null)"
                v-if="judgeBtn.customerImport"></unit-btn>
      <unit-btn type="large right"
                text="模板下载"
                @click="tableOper('template', null)"
                v-if="judgeBtn.customerImport"></unit-btn>
      <unit-btn type="large right"
                text="新建客户"
                @click="tableOper('add', null)"
                v-if="judgeBtn.customerAdd"></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">客户名称</span>
              <div>
                <input v-setwidth
                       type="text"
                       v-model="selMod.customerName"
                       placeholder="全部"
                       @keydown.enter="tableOper('select', null)" />
              </div>
            </div>
            <!-- <div><span class="formBox_text">客户名称</span><div><unit-customer v-setwidth id="customerName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-customer></div></div> -->
            <div>
              <span class="formBox_text">客户分类</span>
              <div>
                <unit-dropdown v-setwidth
                               id="customerType"
                               class="auto"
                               placeholder="全部"
                               :list="cusType"
                               @change="dropdownReturn"
                               :clear="true"
                               :result='selMod.customerType'
                               :reset="reset"></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">省份/城市</span>
              <div>
                <unit-region v-setwidth
                             id="region"
                             class="auto"
                             @change="dropdownReturn"
                             placeholder="全部"
                             :clear="true"
                             :result="selMod.province&&selMod.city?[selMod.province,selMod.city]:[]"
                             :reset="reset"></unit-region>
              </div>
            </div>
            <div>
              <span class="formBox_text">行业</span>
              <div>
                <unit-dropdown v-setwidth
                               id="industry"
                               class="auto"
                               placeholder="全部"
                               :list="industry"
                               @change="dropdownReturn"
                               :result='selMod.industry'
                               :clear="true"
                               :reset="reset"></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">销售</span>
              <div>
                <unit-dropdown v-setwidth
                               id="owner"
                               class="auto"
                               placeholder="全部"
                               :list="ownerList"
                               @change="dropdownReturn"
                               :result='selMod.owner'
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
            <!-- <div><span class="formBox_text">法定代表人</span><div><input v-setwidth type="text" v-model="selMod.legalPerson" maxlength="20" placeholder="全部" @keydown.enter="tableOper('select',null)"></div></div>
            <div><span class="formBox_text">电话</span><div><input v-setwidth type="text" v-model="selMod.telephone" maxlength="20" placeholder="全部" @keydown.enter="tableOper('select',null)"></div></div>-->
            <div class="btnBox right">
              <unit-btn @click="tableOper('select', null)"
                        text="查询"></unit-btn>
              <unit-btn type="plain"
                        @click="tableOper('clear', null)"
                        text="重置"></unit-btn>
            </div>
          </div>
          <div class="boxTable">
            <unit-loading :loading="loading"
                          v-if="loading"></unit-loading>
            <unit-table :total="total"
                        :page="page"
                        v-if="!loading || list.length > 0"
                        :list="list"
                        :checkbox='true'
                        :opern="judgeBtn.num"
                        :title="title"
                        ref="table"
                        :operation="[
                { key: 'view', show: judgeShow },
                { key: 'revise', show: judgeShow },
                {
                  key: 'delete',
                  show: judgeShow,
                  class: () => {
                    return 'redbtn';
                  }
                },
                { key: 'addVisit', show: judgeShow },
                { key: 'share', show: judgeShow },
                { key: 'transfer', show: judgeShow }
              ]"
                        @click="tableOper"
                        @selection="getData"></unit-table>
            <unit-page :total="total"
                       :page="page"
                       @pagechange="getList"></unit-page>
          </div>
        </el-scrollbar>
      </div>
      <unit-upload api="service.customer"
                   :hid="true"
                   @click="addBtn"
                   @success="uploadSuc"
                   @ajaxing="ajaxingChang"></unit-upload>
    </div>
    <el-dialog :title="customerNames.length > 1 ? '批量转移申请' : '转移客户申请'"
               :visible.sync="dialogVisible"
               width="580px"
               append-to-body
               custom-class="customerManage_transfers_dialog"
               @close="cancel">
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item, index) in showList"
                  :key="index">
              {{ item }}
              <span v-if="index != showList.length - 1">、</span>
            </span>
            <span v-show="!showAll">等共{{ customerNames.length }}家</span>
            <p @click="showAll = !showAll"
               v-if="customerNames.length >= 6"
               style="color: blue">{{ word }}</p>
          </div>
        </div>
        <div class="transfer">
          <div>
            <span>
              <i class="must">*</i>转移给：
            </span>
            <span>{{shareTo[0]}}</span>
          </div>
          <div style="margin-top: 30px">
            <el-input v-model="filterText"
                      suffix-icon="iconfont icon-fangdajing"></el-input>
            <!-- <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :default-expanded-keys="[defaultExpandedKeys]"
              :default-checked-keys="defaultCheckedKeys"
              node-key="depId"
              :filter-node-method="filterNode"
              @node-click="chooseTree"
              ref="tree"
            > -->
            <el-tree class="filter-tree"
                     :data="treeData"
                     node-key="id"
                     show-checkbox
                     :default-expanded-keys="['root']"
                     :filter-node-method="filterNode"
                     @check="chooseTree"
                     ref="tree">
              <!-- <span slot-scope="{ node, data }" class="func">
                <div
                  class="ableClick el-icon-check"
                  :class="{ active: personChoose.indexOf(data.staffId) > -1&&data.disabled!=true , disabled: data.disabled}"
                  v-if="data.icon == 'people'"
                ></div>
                <span style="padding-left: 4px">{{ node.label }}</span>
              </span> -->
            </el-tree>
          </div>
        </div>
        <div class="discription">
          <div>
            <span>
              <i class="must">*</i>原因描述：
            </span>
          </div>
          <div>
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea"
                      maxlength="200"
                      show-word-limit></el-input>
          </div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitClick('transfer')"
                   :disabled="isDisable">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="共享客户申请"
               :visible.sync="dialogVisibleShare"
               width="580px"
               append-to-body
               destroy-on-close
               custom-class="customerManage_share_dialog"
               @close="cancel">
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item, index) in showList"
                  :key="index">
              {{
              item
              }}
            </span>
          </div>
        </div>
        <div class="share">
          <div>
            <span>
              <i class="must">*</i>共享给：
            </span>
          </div>
          <div>
            <span v-for="(item, index) of shareTo"
                  :key="index">{{ index==0?item:'、'+item }}</span>
          </div>
        </div>
        <div class="tree">
          <el-input v-model="filterText"
                    suffix-icon="iconfont icon-fangdajing"></el-input>
          <!-- <el-tree
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            @check="chooseTree"
            @click.stop
            node-key="depId"
            :default-expanded-keys="[defaultExpandedKeys]"
            :default-checked-keys="defaultCheckedKeys"
            :filter-node-method="filterNode"
            ref="treeShare"
          > -->
          <el-tree class="filter-tree"
                   :data="treeData"
                   node-key="id"
                   show-checkbox
                   :default-expanded-keys="['root']"
                   :filter-node-method="filterNode"
                   :default-checked-keys="defaultCheckedKeys"
                   @check="chooseTree"
                   ref="treeShare">
            <!-- <span slot-scope="{ node, data }" class="func">
              <span style="padding-left: 4px;">{{ node.label }}</span>
            </span> -->
          </el-tree>
        </div>
        <div class="discription">
          <div>
            <span>
              <i class="must">*</i>原因描述：
            </span>
          </div>
          <div>
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea"
                      maxlength="200"
                      show-word-limit></el-input>
          </div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitClick('share')"
                   :disabled="isDisable">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
import unitRegion from '@/unit/components/thisUnit/region'
import unitTree from '@/unit/components/element/tree'
// import unitCustomer from '@/unit/components/thisUnit/customer'
import unitUpload from '@/unit/components/upload'
import '@/assets/font/customerManage/iconfont.css'
import store from '@/store'
export default {
  name: 'customerManage',
  props: ['dom'],
  components: { unitTable, unitRegion, unitTree, unitUpload }, //unitCustomer
  data() {
    return {
      filterText: '',
      treeData: [],
      personChoose: [],
      // CheckedKeys:[],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
      },
      selMod: {
        customerName: '',
        customerType: '',
        province: '',
        city: '',
        industry: '',
        owner: '',
        depId: '',
        // legalPerson:'',
        // telephone:'',
      },
      selRes: {},
      reset: true,
      cusType: [],
      industry: [],
      ownerList: [],
      title: [
        { key: 'customerName', name: '客户名称', width: 18 },
        { key: 'customerTypeTxt', name: '客户分类', width: 14 },
        { key: 'region', name: '省份/城市', width: 14 },
        { key: 'industryTxt', name: '行业', width: 12 },
        { key: 'telephone', name: '电话', width: 12 },
        { key: 'ownerName', name: '销售', width: 14 },
        { key: 'createTime_', name: '创建日期', width: 16 },
        { key: 'isInProcess', name: '共享/转移中', width: 10 },
      ],
      list: [],
      ajaxIng: false,
      delLoading: false,
      templateLoading: false,
      loading: true,
      total: 0,
      page: 1,
      data: [],
      dialogVisible: false,
      dialogVisibleShare: false,
      customerNames: '',
      showAll: false,
      num1: 0,
      defaultExpandedKeys: '',
      defaultCheckedKeys: [],
      tel: '',
      project: '',
      checkProjectList: [],
      checkTelList: [],
      TelList: [],
      ProjectList: [],
      checkNodes: [],
      shareCustomerId: '',
      shareTo: [],
      allot: [],
      inputData: [],
      textarea: '',
      transferOrShareList: [],
      owner: '',
      isDisable: false,
      depList: [],
      hideTree: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree ? this.$refs.tree.filter(val) : null
      this.$refs.treeShare ? this.$refs.treeShare.filter(val) : null
    },
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
            : null
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === '1'
      return { isCharge, staffId, isAdmin, userInfo }
    },
    judgeBtn() {
      let json = {
          customerTransfer: this.$pubfunc.judgeBtn('customer:transfer'),
          customerShare: this.$pubfunc.judgeBtn('customer:share'),
          customerAdd: this.$pubfunc.judgeBtn('customer:add'),
          customerUpdate: this.$pubfunc.judgeBtn('customer:update'),
          customerDelete: this.$pubfunc.judgeBtn('customer:delete'),
          customerView: this.$pubfunc.judgeBtn('customer:view'),
          customerImport: this.$pubfunc.judgeBtn('customer:import'),
          visitrecord: this.$pubfunc.judgeBtn('visitrecord'),
          customerExport: this.$pubfunc.judgeBtn('customer:export'),
        },
        num = 1
      json.customerUpdate ? num++ : null
      json.customerDelete ? num++ : null
      json.customerTransfer ? num++ : null
      json.visitrecord ? (num += num < 2 ? 2 : 1) : null
      json.num = num
      return json
    },
    showList: function() {
      if (this.showAll == false) {
        var showList = [] //定义一个空数组
        if (this.customerNames.length > 3) {
          //显示前三个
          for (var i = 0; i < 6; i++) {
            showList.push(this.customerNames[i])
          }
        } else {
          showList = this.customerNames
        }
        return showList //返回当前数组
      } else {
        return this.customerNames
      }
    },
    word: function() {
      if (this.showAll == false) {
        //对文字进行处理
        return '展开 ∨'
      } else {
        return '收起 ∧'
      }
    },
  },
  methods: {
    submitClick(key) {
      switch (key) {
        case 'share':
          this.isDisable = true
          this.$pubfunc.fnThrottle(this.submitShare, 500)(key)
          setTimeout(() => {
            this.isDisable = false
          }, 2000)
          break
        case 'transfer':
          this.isDisable = true
          this.$pubfunc.fnThrottle(this.submit, 500)(key)
          setTimeout(() => {
            this.isDisable = false
          }, 2000)
          break
      }
    },

    telChange(val) {
      this.TelList = []
      this.checkTelList.map(item => {
        this.tel.map(it => {
          if (item == it.label) {
            this.TelList.push(it.value)
          }
        })
      })
    },
    projectChange(val) {
      this.ProjectList = []
      this.checkProjectList.map(item => {
        this.project.map(it => {
          if (item == it.label) {
            this.ProjectList.push(it.value)
          }
        })
      })
    },

    getTel(val) {
      if (Array.isArray(val)) {
        this.data = val
      } else {
        this.data = [val]
      }
      this.owner = val.owner
      this.shareCustomerId = val.customerId
      this.$api.service.contact.customerTel(
        { orgId: val.customerId, flag: 1 },
        res => {
          this.tel = res.data
        },
      )
    },
    getProject(val) {
      this.$api.service.project.getProject(
        { customerId: val.customerId, flag: 1 },
        res => {
          this.project = res.data
        },
      )
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    chooseTree(data, node, self) {
      let _this = this
      if (this.dialogVisible) {
        if (data.accountId != null && data.disabled != true) {
          this.personChoose =
            this.personChoose.indexOf(data.id) > -1 ? [] : [data.id]
          this.shareTo =
            this.shareTo.indexOf(data.label) > -1 ? [] : [data.label]
        }
        this.$refs.tree.setCheckedKeys(this.personChoose)
      } else {
        // 递归循环
        _this.personChoose = []
        _this.shareTo = []
        var a = function(val) {
          val.map(item => {
            if (item.children != null) {
              a(item.children)
            } else {
              if (item.id != _this.owner) {
                console.log(item)
                _this.personChoose.push(JSON.parse(JSON.stringify(item.id)))
                _this.shareTo.push(JSON.parse(JSON.stringify(item.label)))
              } else {
                this.$message({
                  showClose: true,
                  message: '不能共享给自己!',
                  type: 'error',
                })
              }
            }
          })
        }
        a(this.$refs.treeShare.getCheckedNodes())
        let removePersonChooseItem = function(ar) {
          var ret = []
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i])
            }
          }
          _this.personChoose = JSON.parse(JSON.stringify(ret))
          return _this.personChoose
        }
        let removeShareToItem = function(ar) {
          var ret = []
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i])
            }
          }
          _this.shareTo = JSON.parse(JSON.stringify(ret))
          return _this.shareTo
        }
        removePersonChooseItem(_this.personChoose)
        removeShareToItem(_this.shareTo)
      }
    },

    async getTreeData() {
      let self = this
      // this.$api.bgmgnt.department.getDepTreeData({}, res => {
      //   this.treeData = res.data
      //   // console.log(this.treeData);
      //   this.defaultExpandedKeys = this.treeData[0].depId
      //   var a = async function(val) {
      //     val.map(item => {
      //       if (item.children != null) {
      //         item.leaf = false
      //         a(item.children)
      //       } else {
      //         item.leaf = false
      //         self.$api.bgmgnt.staff.getstaffTreeData(
      //           { depId: item.depId, resourceType: '02,05,07' },
      //           res => {
      //             item.children = res.data.list ? res.data.list : []
      //             if (item.children != null) {
      //               item.children.map(item => {
      //                 item.leaf = true
      //                 item.depId ? null : (item.depId = item.staffId)
      //                 item.label = item.staffName
      //                 item.icon = 'people'
      //                 item.disabled = false
      //               })
      //             }
      //             return item
      //           }
      //         )
      //       }
      //     })
      //   }
      //   a(this.treeData)
      // })
      this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: '02,05,07' },
        res => {
          this.treeData = res.data
        },
      )
    },

    setTreeDisabled(val) {
      val.map(item => {
        if (
          item.children != undefined &&
          item.children != null &&
          item.children.length > 0
        ) {
          this.setTreeDisabled(item.children)
        } else if (item.accountId != null) {
          if (
            this.data != undefined &&
            this.data != null &&
            this.data.length > 0
          ) {
            this.data.map(val => {
              item.id == val.owner ? (item.disabled = true) : ''
            })
          }
        } else {
        }
      })
    },

    submit(key) {
      console.log(key)
      if (this.personChoose.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择转移人!',
          type: 'error',
        })
        return
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: '请填写申请原因描述',
          type: 'error',
        })
        return
      }
      if (this.personChoose.length > 0) {
        var customerList = []
        const staffId = this.personChoose[0]
        this.data.map(item => {
          customerList.push(item.customerId)
        })
        this.$api.service.customer.transfers(
          {
            customerList: customerList,
            staffId: staffId,
            description: this.textarea,
          },
          res => {
            this.shareTo = []
            this.personChoose = []
            if (res.code == '0') {
              this.$message({
                message: '操作成功！',
                type: 'success',
              })
              this.cancel()
              this.getList(1)
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              })
              this.cancel()
            }
          },
        )
      }
    },

    submitShare(key) {
      console.log(key)
      if (this.personChoose.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择共享人!',
          type: 'error',
        })
        return
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: '请填写申请原因描述',
          type: 'error',
        })
        return
      }
      if (this.personChoose.length > 0) {
        this.$api.service.customer.share(
          {
            customerId: this.shareCustomerId,
            staffList: this.personChoose,
            description: this.textarea,
          },
          res => {
            // console.log(res);
            this.shareTo = []
            this.personChoose = []
            if (res.code == '0') {
              this.$message({
                message: '操作成功！',
                type: 'success',
              })
              this.cancel()
              this.getList(1)
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              })
              this.cancel()
            }
          },
        )
      }
    },
    cancel() {
      this.personChoose = []
      this.textarea = ''
      this.shareTo = []
      this.filterText = ''
      this.inputData = []
      this.ProjectList = []
      this.checkProjectList = []
      this.TelList = []
      this.checkTelList = []
      this.defaultCheckedKeys = []
      this.$refs.tree ? this.$refs.tree.setCheckedNodes([]) : null
      this.$refs.treeShare ? this.$refs.treeShare.setCheckedNodes([]) : null
      this.dialogVisible = false
      this.dialogVisibleShare = false
    },
    getData(val) {
      if (Array.isArray(val)) {
        this.data = val
      } else {
        this.data = [val]
      }
      var customerList = []
      this.data.map(item => {
        // console.log(item);
        customerList.push(item.customerName)
      })
      // console.log(customerList);
      this.customerNames = customerList
    },
    hideOther(j) {
      this.hideTree = j ? j : false
    },
    judgeShow(item, i, key) {
      var a = this.$store.state.userInfo.info.staff.branchCompany.split(',')
      switch (key) {
        case 'view':
          return true
        case 'revise':
          return (item.owner === this.userInfo.staffId ||
            this.userInfo.isAdmin) &&
            this.judgeBtn.customerUpdate
            ? true
            : false
        case 'delete':
          return (item.owner === this.userInfo.staffId ||
            this.userInfo.isAdmin) &&
            this.judgeBtn.customerDelete
            ? true
            : false
        case 'addVisit':
          return (item.owner === this.userInfo.staffId ||
            this.userInfo.isAdmin) &&
            this.judgeBtn.visitrecord
            ? true
            : false
        case 'share':
          return (item.isShare == '0' || this.userInfo.isAdmin) &&
            this.judgeBtn.customerShare &&
            item.isInProcess != '是'
            ? true
            : false
        case 'transfer':
          return (item.isShare == '0' || this.userInfo.isAdmin) &&
            this.judgeBtn.customerTransfer &&
            item.isInProcess != '是'
            ? true
            : false
      }
      return this.judgeBtn.visitrecord && item.owner === this.userInfo.staffId
        ? true
        : false
    },
    ajaxingChang(j) {
      // console.log(j)
      this.ajaxIng = j
    },
    addBtnjudge() {
      if (this.ajaxIng) {
        return
      }
      // console.log(this.$refs.upload)
      this.addBtn()
    },
    addBtn(fn) {
      this.addBtn = fn
    },
    uploadSuc(item) {
      // console.log(item)
      this.ajaxingChang(false)
      this.$store.commit('alertFn', {
        type: 'success',
        text: '导入成功',
        func: () => {
          this.getList(1)
        },
      })
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: 'customer_type', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.cusType = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'industry', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.industry = res.data ? res.data : []
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'industry', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.industry = res.data ? res.data : []
            break
        }
      })

      this.$api.public.depmgnt(res => {
        switch (res.code) {
          case '0':
            this.depList = res.data ? res.data : []
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
    getList(page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page
      let param = JSON.parse(JSON.stringify(this.selRes))
      param.limit = 10
      param.page = page
      // console.log(param)
      this.loading = true
      this.$api.service.customer.getList(param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.total = res.data.total
            let list = res.data.list ? res.data.list : []
            list.map(v => {
              v.createTime_ = this.$pubfunc.TimeTransform(
                'YYYY年MM月DD日',
                v.createTime,
              )
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
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        case 'customerName':
          this.selMod.customerName = res.label
          break
        case 'customerType':
          this.selMod.customerType = res.value
          break
        case 'industry':
          this.selMod.industry = res.value
          break
        case 'region':
          switch (res.ids.length) {
            case 0:
              this.selMod.province = ''
              this.selMod.city = ''
              break
            case 1:
              this.selMod.province = res.ids[0]
              this.selMod.city = ''
              break
            case 2:
              this.selMod.province = res.ids[0]
              this.selMod.city = res.ids[1]
              break
          }

          break
        case 'owner':
          this.selMod.owner = res.value
          break
        case 'depId':
          this.selMod.depId = res[0].depId
          break
      }
    },
    tableOper(key, item) {
      // console.log(key,item)
      switch (key) {
        case 'select':
          this.$store.commit('searchConditionFn', this.selMod)
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
          this.getList(1)
          break
        case 'export':
          if (this.ajaxIng) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在导出报表，请稍后',
            })
            return
          }
          // let param = JSON.parse(JSON.stringify(this.selRes))
          this.selRes = JSON.parse(JSON.stringify(this.selMod))
          let param = JSON.parse(JSON.stringify(this.selRes))
          this.ajaxIng = true
          this.$api.download.customerExport(param, res => {
            this.$pubfunc.downloadFile(
              res,
              '客户清单' +
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
        case 'clear':
          for (let k in this.selMod) {
            this.selMod[k] = ''
          }
          this.reset = !this.reset
          this.tableOper('select', null)
          break
        case 'add':
          this.$router.push({ name: 'customerAdd' })
          break
        case 'revise':
          item.customerId
            ? this.$router.push({
                name: 'customerEdit',
                params: { customerId: this.$pubfunc.encode(item.customerId) },
              })
            : null
          break
        case 'view':
          item.customerId
            ? this.$router.push({
                name: 'customerView',
                params: { customerId: this.$pubfunc.encode(item.customerId) },
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
              this.$api.service.customer.delete(
                { customerId: item.customerId },
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
            text: '确认删除该客户信息吗？<br>删除后不可恢复',
          })
          break
        case 'addVisit':
          this.$emit('dialog', {
            show: true,
            link: 'addVisit',
            small: true,
            title: '添加拜访记录',
            data: { key: 'customer', item },
          })
          break
        case 'template':
          if (this.templateLoading) {
            this.$store.commit('alertFn', {
              type: 'warning',
              text: '正在下载模板，请稍后',
            })
            return
          }
          this.templateLoading = true
          this.$api.download.customerTemplate(res => {
            this.$pubfunc.downloadFile(res, '客户管理模板.xlsx', 'excel')
            this.templateLoading = false
          })
          break
        case 'import':
          this.addBtnjudge()
          break
        case 'transfers':
          if (this.data.length > 0) {
            this.setTreeDisabled(this.treeData)
            this.dialogVisible = true
          } else {
            this.$alert('请先勾选需要批量转移的客户', '提示', {
              confirmButtonText: '确定',
              customClass: 'customerManage_messageBox',
              iconClass: 'iconfont icon-gantanhao-sanjiaokuang',
              callback: action => {
                this.dialogVisible = false
              },
            })
          }
          break
        case 'transfer':
          this.transferOrShareList = []
          item.shareStaffList.map(item => {
            this.transferOrShareList.push(item.staffId)
          })
          this.transferOrShareList.push(item.owner)
          var a = item.customerName.split(',')
          this.getData(item)
          this.customerNames = a
          this.showAll = true
          this.setTreeDisabled(this.treeData)
          this.dialogVisible = true
          break
        case 'share':
          if (item.shareStaffList) {
            item.shareStaffList.map(i => {
              if (item.owner != i.staffId) {
                this.shareTo.push(i.staffName)
                this.personChoose.push(i.staffId)
              }
            })
          }
          this.defaultCheckedKeys = this.personChoose
          this.transferOrShareList = []
          if (item.shareStaffList.length) {
            item.shareStaffList.map(item => {
              this.transferOrShareList.push(item.staffId)
            })
          }
          this.transferOrShareList.push(item.owner)
          var a = item.customerName.split(',')
          this.customerNames = a
          this.getTel(item)
          this.getProject(item)
          this.setTreeDisabled(this.treeData)
          this.dialogVisibleShare = true
          break
      }
    },
  },
  created() {
    this.getDropData()
    // this.tableOper('clear', null)
    this.reset = !this.reset
    this.selMod = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.selMod))
    this.getList(this.$store.state.page.page)
    this.getTreeData()
  },
  mounted() {},
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% + 12px);
}
.formBox > div:nth-child(3) {
  padding-left: 70px;
  width: calc(20% + 16px);
}
.formBox > div:nth-child(4) {
  padding-left: 38px;
  width: calc(20% - 16px);
  margin-left: 1px;
}
.formBox > div:nth-child(5) {
  padding-left: 38px;
  padding-right: 0;
  width: calc(20% - 27px);
  margin-left: 1px;
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
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
div.ableClick {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  position: absolute;
  left: -15px;
  top: 2px;
  background-color: #fff;
  color: #fff;
  font-size: 12px;
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
