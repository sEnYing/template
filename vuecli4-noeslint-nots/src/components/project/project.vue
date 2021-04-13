<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>项目管理</span>
      <unit-btn
        type="large right"
        text="新建项目"
        @click="tableOper('add', null)"
        v-if="judgeBtn.projectAdd"
      ></unit-btn>
      <unit-btn
        type="large right"
        text="批量导出"
        @click="tableOper('export', null)"
        v-if="judgeBtn.projectExport"
      ></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">项目名称</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.projName"
                  placeholder="全部"
                  @keydown.enter="tableOper('select', null)"
                />
              </div>
            </div>
            <div>
              <span class="formBox_text">客户名称</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.customerName"
                  placeholder="全部"
                  @keydown.enter="tableOper('select', null)"
                />
              </div>
            </div>
            <!-- <div><span class="formBox_text">项目名称</span><div><unit-project v-setwidth id="projName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-project></div></div>
            <div><span class="formBox_text">客户名称</span><div><unit-customer v-setwidth id="customerName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-customer></div></div>-->
            <div>
              <span class="formBox_text">项目类型</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="projType"
                  class="auto"
                  placeholder="全部"
                  :list="projType"
                  @change="dropdownReturn"
                  :result="selMod.projType"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目状态</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="projStatus"
                  class="auto"
                  placeholder="全部"
                  :list="projStatus"
                  @change="dropdownReturn"
                  :result="selMod.projStatus"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目阶段</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="projStage"
                  class="auto"
                  placeholder="全部"
                  :list="projStage"
                  @change="dropdownReturn"
                  :result="selMod.projStage"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目赢率</span>
              <div>
                <div v-setwidth class="input">
                  <unit-dropdown
                    :title="selMod.minWinRateTxt"
                    id="minWinRate"
                    class="auto"
                    placeholder="全部"
                    :list="winRate"
                    @change="dropdownReturn"
                    :result="selMod.minWinRate"
                    :clear="true"
                    :reset="reset"
                  ></unit-dropdown>
                  <i>-</i>
                  <unit-dropdown
                    id="maxWinRate"
                    :title="selMod.maxWinRateTxt"
                    class="auto"
                    placeholder="全部"
                    :list="winRate"
                    @change="dropdownReturn"
                    :result="selMod.maxWinRate"
                    :clear="true"
                    :reset="reset"
                  ></unit-dropdown>
                </div>
              </div>
            </div>
            <div>
              <span class="formBox_text">项目金额</span>
              <div>
                <div v-setwidth class="input">
                  <input
                    type="text"
                    v-model="selMod.minAmount"
                    maxlength="20"
                    placeholder
                    @keydown.enter="tableOper('select', null)"
                  />
                  <i>-</i>
                  <input
                    type="text"
                    v-model="selMod.maxAmount"
                    maxlength="20"
                    placeholder
                    @keydown.enter="tableOper('select', null)"
                  />
                  <i>万元</i>
                </div>
              </div>
            </div>
            <div>
              <span class="formBox_text marl">销售</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="owner"
                  class="auto"
                  placeholder="全部"
                  :list="ownerList"
                  @change="dropdownReturn"
                  :result="selMod.owner"
                  :clear="true"
                  :reset="reset"
                  :input="true"
                ></unit-dropdown>
              </div>
            </div>
            <div class="dropTree">
              <span class="formBox_text">分子公司/所属部门</span>
              <div>
                <unit-tree
                  id="depId"
                  class="auto"
                  v-setwidth
                  :list="depList"
                  :choose="[selMod.depId]"
                  :hid="hideTree"
                  @click="hideOther"
                  placeholder="全部"
                  @return="dropdownReturn"
                  :hidedisable="true"
                  :only="true"
                  :expendclick="false"
                  keyid="depId"
                  :must="true"
                ></unit-tree>
              </div>
            </div>
            <div class="btnBox right">
              <unit-btn
                @click="tableOper('select', null)"
                text="查询"
              ></unit-btn>
              <unit-btn
                type="plain"
                @click="tableOper('clear', null)"
                text="重置"
              ></unit-btn>
            </div>
          </div>
          <div class="boxTable">
            <unit-loading :loading="loading" v-if="loading"></unit-loading>
            <unit-table
              :total="total"
              :page="page"
              :select="false"
              v-if="!loading || list.length > 0"
              :opern="judgeBtn.num"
              :list="list"
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
                  },
                },
                { key: 'addVisit', show: judgeShow },
                { key: 'share', show: judgeShow },
                { key: 'transfer', show: judgeShow },
                { key: 'amountallot', show: judgeShow },
                { key: 'addApplication', show: judgeShow },
              ]"
              @click="tableOper"
              @selection="getData"
            ></unit-table>
            <unit-page
              :total="total"
              :page="page"
              @pagechange="getList"
            ></unit-page>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      title="转移项目申请"
      :visible.sync="dialogVisible"
      width="580px"
      append-to-body
      custom-class="customerManage_transfers_dialog"
      @close="cancel('transfer')"
    >
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item, index) in showList" :key="index">
              {{ item }}
              <span v-if="index != showList.length - 1">、</span>
            </span>
            <span v-show="!showAll">等共{{ customerNames.length }}家</span>
            <p @click="showAll = !showAll" v-if="customerNames.length >= 6">
              {{ word }}
            </p>
          </div>
        </div>
        <div class="project">
          <div>
            <span>转移项目：</span>
          </div>
          <div>
            <div>
              <span v-for="(item, index) of data" :key="index">{{
                item.projName
              }}</span>
            </div>
          </div>
        </div>
        <div class="transfer">
          <div>
            <span> <i class="must">*</i>转移给： </span>
            <span>{{ shareTo[0] }}</span>
          </div>
          <div style="margin-top: 30px">
            <el-input
              v-model="filterText"
              suffix-icon="iconfont icon-fangdajing"
            ></el-input>
            <!-- <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :default-expanded-keys="[defaultExpandedKeys]"
              :default-checked-keys="defaultCheckedKeys"
              node-key="id"
              :filter-node-method="filterNode"
              @node-click="chooseTree"
              ref="tree"
            > -->
            <el-tree
              class="filter-tree"
              :data="treeData"
              node-key="id"
              show-checkbox
              :default-expanded-keys="['root']"
              :filter-node-method="filterNode"
              @check="chooseTree"
              ref="tree"
            >
              <!-- <span slot-scope="{ node, data }" class="func">
                <span style="padding-left: 4px">{{node.label}}</span>
              </span> -->
            </el-tree>
          </div>
        </div>
        <div class="discription">
          <div>
            <span> <i class="must">*</i>原因描述： </span>
          </div>
          <div>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" :disabled="isDisable"
          >提 交</el-button
        >
        <el-button @click="cancel('transfer')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="共享项目申请"
      :visible.sync="dialogVisibleShare"
      width="580px"
      append-to-body
      custom-class="customerManage_share_dialog"
      @close="cancel('share')"
    >
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item, index) in showList" :key="index">{{
              item
            }}</span>
          </div>
        </div>
        <div class="project">
          <div>
            <span>共享项目：</span>
          </div>
          <div>
            <div>
              <span v-for="(item, index) of data" :key="index">{{
                item.projName
              }}</span>
            </div>
          </div>
        </div>
        <div class="share">
          <div>
            <span> <i class="must">*</i>共享给： </span>
          </div>
          <div>
            <span v-for="(item, index) of shareTo" :key="index">{{
              index == 0 ? item : "、" + item
            }}</span>
          </div>
        </div>
        <div class="tree">
          <el-input
            v-model="filterText"
            suffix-icon="iconfont icon-fangdajing"
          ></el-input>
          <!-- <el-tree
            class="filter-tree project_share_dialog"
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
          <el-tree
            class="filter-tree"
            :data="treeData"
            node-key="id"
            show-checkbox
            :default-expanded-keys="['root']"
            :filter-node-method="filterNode"
            :default-checked-keys="defaultCheckedKeys"
            @check="chooseTree"
            ref="treeShare"
          >
            <!-- <span slot-scope="{ node, data }" class="func">
              <span style="padding-left: 4px;">{{node.label}}</span>
            </span> -->
          </el-tree>
        </div>
        <div class="discription">
          <div>
            <span> <i class="must">*</i>原因描述： </span>
          </div>
          <div>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" :disabled="isDisable"
          >提 交</el-button
        >
        <el-button @click="cancel('share')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleAdmin"
      width="580px"
      append-to-body
      custom-class="customerManage_admin_dialog"
      @close="cancel('admin')"
    >
      <!-- <div v-for="item of project"> -->
      <div>
        <!-- <h1>项目名称：{{item.label}}</h1> -->
        <h1 v-for="(item, index) of data" :key="index">
          项目名称：{{ item.projName }}
        </h1>
        <div class="content">
          <div>
            <span>分配比例：</span>
          </div>
          <div class="content_right">
            <div v-for="(item, index) of showStaffName" :key="index">
              <span>{{ item }}</span>
              <el-input
                v-model="inputData[index]"
                @input="checkInput(index)"
              ></el-input>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" :disabled="isDisable"
          >确 定</el-button
        >
        <el-button @click="cancel('admin')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/tableScroll";
import unitTree from "@/unit/components/element/tree";
// import unitProject from '@/unit/components/thisUnit/project'
// import unitCustomer from '@/unit/components/thisUnit/customer'
import "@/assets/font/customerManage/iconfont.css";
export default {
  name: "projManage",
  props: ["dom"],
  components: { unitTree, unitTable }, //,unitProject,unitCustomer
  data() {
    return {
      filterText: "",
      treeData: [],
      personChoose: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label',
      //   isLeaf: 'leaf'
      // },
      selMod: {
        projName: "",
        customerName: "",
        projType: "",
        projStatus: "",
        projStage: "",
        minWinRate: "",
        maxWinRate: "",
        minAmount: "",
        maxAmount: "",
        owner: "",
        depId: "",
      },
      selRes: {},
      reset: true,
      projType: [],
      projStatus: [],
      projStage: [],
      winRate: [],
      title: [
        { key: "projName", name: "项目名称", width: 17 },
        { key: "customerName", name: "客户名称", width: 17 },
        { key: "ownerName", name: "销售", width: 10 },
        { key: "projTypeTxt", name: "项目类型", width: 10 },
        { key: "projStageTxt", name: "项目阶段", width: 10 },
        { key: "projScore", name: "项目得分", width: 10 },
        { key: "projAmount_", name: "项目金额（元）", width: 12 },
        { key: "planFinishTime_", name: "预计结案日期", width: 14 },
        { key: "isInProcess", name: "申请流程中", width: 10 },
      ],
      list: [],
      ajaxIng: false,
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
      data: "",
      dialogVisible: false,
      dialogVisibleShare: false,
      dialogVisibleAdmin: false,
      customerNames: "",
      showAll: false,
      num1: 0,
      defaultExpandedKeys: "",
      defaultCheckedKeys: [],
      checkNodes: [],
      shareCustomerId: "",
      shareTo: [],
      showStaffName: [],
      showStaff: [],
      allot: [],
      inputData: [],
      textarea: "",
      Atextarea: "",
      transferOrShareList: [],
      isDisable: false,
      meta: "",
      ownerList: [],
      depList: [],
      hideTree: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree ? this.$refs.tree.filter(val) : null;
      this.$refs.treeShare ? this.$refs.treeShare.filter(val) : null;
    },
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      let json =
        userInfo.info && userInfo.info.staff ? userInfo.info.staff : {};
      let depLevel = [];
      if (
        Object.prototype.toString.call(json.department) === "[object Array]"
      ) {
        json.department.map((v) => {
          depLevel.push(v.depLevel);
        });
      } else if (
        Object.prototype.toString.call(json.department) === "[object Object]"
      ) {
        depLevel.push(json.department.depLevel);
      }
      json.depLevel = depLevel;
      return json;
    },
    judgeBtn() {
      let json = {
          projectAdd: this.$pubfunc.judgeBtn("project:add"),
          projectExport: this.$pubfunc.judgeBtn("project:export"),
          projectUpdate: this.$pubfunc.judgeBtn("project:update"),
          projectView: this.$pubfunc.judgeBtn("project:view"),
          projectTecd: this.$pubfunc.judgeBtn("project:tecdifficulty"),
          projectFeas: this.$pubfunc.judgeBtn("project:feasibility"),
          projectCommit: this.$pubfunc.judgeBtn("project:commit"),
          projectDelete: this.$pubfunc.judgeBtn("project:delete"),
          projectShare: this.$pubfunc.judgeBtn("project:share"),
          projectTransfer: this.$pubfunc.judgeBtn("project:transfer"),
          visitrecord: this.$pubfunc.judgeBtn("visitrecord"),
          projectAmountallot: true,
          projectAddApplication: this.$pubfunc.judgeBtn("project:resource"),
        },
        num = 1;
      json.projectUpdate ||
      json.projectTecd ||
      json.projectFeas ||
      json.projectCommit
        ? num++
        : null;
      json.projectDelete ? num++ : null;
      json.projectShare ? num++ : null;
      json.projectTransfer ? num++ : null;
      json.projectProportion ? num++ : null;
      json.visitrecord ? (num += num < 2 ? 2 : 1) : null;
      json.projectAddApplication ? (num += num < 2 ? 2 : 1) : null;
      json.num = num;
      return json;
    },
    special() {
      return this.$store.state.special.depLevel;
    },
    showList: function () {
      if (this.showAll == false) {
        var showList = []; //定义一个空数组
        if (this.customerNames.length > 3) {
          //显示前三个
          for (var i = 0; i < 6; i++) {
            showList.push(this.customerNames[i]);
          }
        } else {
          showList = this.customerNames;
        }
        return showList; //返回当前数组
      } else {
        return this.customerNames;
      }
    },
    word: function () {
      if (this.showAll == false) {
        //对文字进行处理
        return "展开";
      } else {
        return "收起";
      }
    },
  },
  methods: {
    submitClick() {
      if (this.dialogVisibleShare == true) {
        this.isDisable = true;
        this.$pubfunc.fnThrottle(this.submitShare, 500)();
        setTimeout(() => {
          this.isDisable = false;
        }, 1500);
      } else if (this.dialogVisible == true) {
        this.isDisable = true;
        this.$pubfunc.fnThrottle(this.submit, 500)();
        setTimeout(() => {
          this.isDisable = false;
        }, 1500);
      } else {
        this.isDisable = true;
        this.$pubfunc.fnThrottle(this.submitAdmin, 500)();
        setTimeout(() => {
          this.isDisable = false;
        }, 1500);
      }
    },
    hideOther(j) {
      this.hideTree = j ? j : false;
    },
    submitAdmin() {
      if (this.showStaffName.length != this.inputData.length) {
        this.$message({
          showClose: true,
          message: "请为所有人员分配比例",
          type: "error",
        });
      } else {
        var a = 0;
        this.inputData.map((item) => {
          a += parseFloat(item);
        });
        if (a != 100 && this.data[0].allot.length > 0) {
          this.$message({
            showClose: true,
            message: "分配比例总和应为100%",
            type: "error",
          });
        } else {
          var projId = "";
          this.data.map((item) => {
            projId = item.projId;
            for (var i = 0; i < this.inputData.length; i++) {
              this.allot.push({
                staffId: this.showStaff[i],
                percent: this.inputData[i],
              });
            }
            const index = this.showStaff.indexOf(item.owner);
            this.showStaff.splice(index, 1);
          });
          if (this.meta == "share") {
            this.$api.service.project.share(
              {
                projId: projId,
                staffList: this.showStaff,
                description: this.Atextarea,
                allot: this.allot,
              },
              (res) => {
                if (res.code == "0") {
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.cancel("admin");
                  this.Atextarea = "";
                  this.getList(1);
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              }
            );
          } else {
            this.$api.service.project.amountallot(
              {
                projId: projId,
                staffList: this.personChoose,
                description: this.textarea,
                allot: this.allot,
              },
              (res) => {
                if (res.code == "0") {
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.cancel("admin");
                  this.getList(1);
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              }
            );
          }
        }
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setTreeDisabled(val) {
      val.map((item) => {
        if (item.children != null) {
          this.setTreeDisabled(item.children);
        } else if (item.accountId) {
          item.disabled = false;
          if (
            this.data != undefined &&
            this.data != null &&
            this.data.length > 0
          ) {
            this.data.map((val) => {
              item.id == val.owner ? (item.disabled = true) : "";
            });
          }
        } else {
        }
      });
    },
    chooseTree(data, node, self) {
      let _this = this;
      if (this.dialogVisible) {
        // console.log(data);
        if (data.accountId != null && data.disabled != true) {
          this.personChoose =
            this.personChoose.indexOf(data.id) > -1 ? [] : [data.id];
          this.shareTo =
            this.shareTo.indexOf(data.label) > -1 ? [] : [data.label];
        }
        this.$refs.tree.setCheckedKeys(this.personChoose);
      } else {
        // 递归循环.
        _this.personChoose = [];
        _this.shareTo = [];
        var a = function (val) {
          val.map((item) => {
            if (item.children != null) {
              a(item.children);
            } else {
              if (item.id) {
                if (item.id == _this.userInfo.staffId) {
                  this.$message({
                    message: "不能选择所有者",
                    type: "error",
                  });
                } else {
                  _this.personChoose.push(item.id);
                  _this.shareTo.push(item.label);
                }
              }
            }
          });
        };
        a(this.$refs.treeShare.getCheckedNodes());
        let removePersonChooseItem = function (ar) {
          var ret = [];
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i]);
            }
          }
          _this.personChoose = ret;
          return _this.personChoose;
        };
        let removeShareToItem = function (ar) {
          var ret = [];
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i]);
            }
          }
          _this.shareTo = ret;
          return _this.shareTo;
        };
        removePersonChooseItem(_this.personChoose);
        removeShareToItem(_this.shareTo);
      }
    },

    async getTreeData() {
      let self = this;
      // this.$api.bgmgnt.staff.getstaffTreeData({resourceType: '02,05,07'}, res => {
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
      //             // console.log(res);
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
      this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: "02,05,07" },
        (res) => {
          this.treeData = res.data;
        }
      );
      this.$api.public.depmgnt((res) => {
        switch (res.code) {
          case "0":
            this.depList = res.data ? res.data : [];
            break;
        }
      });
    },

    cancel(key) {
      this.$refs.tree ? this.$refs.tree.setCheckedNodes([]) : null;
      this.$refs.treeShare ? this.$refs.treeShare.setCheckedNodes([]) : null;
      this.textarea = "";
      this.shareTo = [];
      this.filterText = "";
      this.inputData = [];
      this.ProjectList = [];
      this.allot = [];
      this.checkProjectList = [];
      this.personChoose = [];
      this.defaultCheckedKeys = [];
      switch (key) {
        case "transfer":
          this.dialogVisible = false;
          break;
        case "share":
          this.dialogVisibleShare = false;
          break;
        case "admin":
          this.dialogVisibleShare = false;
          this.dialogVisibleAdmin = false;
          this.Atextarea = "";
          break;
      }
    },

    submit() {
      if (this.personChoose.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择转移人!",
          type: "error",
        });
        return;
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: "请填写申请原因描述",
          type: "error",
        });
        return;
      }
      if (this.personChoose.length > 0) {
        var projId = "";
        this.data.map((item) => {
          projId = item.projId;
        });
        this.$api.service.project.transfer(
          {
            projList: [projId],
            staffId: this.personChoose[0],
            description: this.textarea,
          },
          (res) => {
            if (res.code == "0") {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.cancel("transfer");
              this.getList(1);
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
              this.cancel("transfer");
            }
          }
        );
      }
    },
    submitShare() {
      if (this.personChoose.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择共享人!",
          type: "error",
        });
        return;
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: "请填写申请原因描述",
          type: "error",
        });
        return;
      }
      if (this.personChoose.length > 0) {
        var projId = "";
        this.data.map((item) => {
          projId = item.projId;
        });
        this.showStaff = this.personChoose;
        this.showStaffName = this.shareTo;
        if (this.userInfo.resourceType == "02") {
          this.data.map((item) => {
            this.showStaff.push(item.owner);
            this.showStaffName.push(item.ownerName);
          });
          this.Atextarea = this.textarea;
          this.dialogVisibleShare = false;
          this.dialogVisibleAdmin = true;
        } else {
          this.$api.service.project.share(
            {
              projId: projId,
              staffList: this.personChoose,
              description: this.textarea,
            },
            (res) => {
              if (res.code == "0") {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this.cancel("share");
                this.getList(1);
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
                this.cancel("share");
              }
            }
          );
        }
      }
    },
    getData(val) {
      if (val.length > 1) {
        this.data = val;
      } else {
        this.data = [val];
      }
      this.shareCustomerId = val.customerId;
      var customerList = [];
      this.data.map((item) => {
        customerList.push(item.customerName);
      });
      this.customerNames = customerList;
    },

    judgeShow(item, i, key) {
      switch (key) {
        case "view":
          return true;
        case "revise":
          return this.userInfo.isAdmin === "1" ||
            (this.judgeBtn.projectCommit &&
              this.userInfo.depLevel.indexOf(this.special) > -1 &&
              item.commitStatus === "1") ||
            (this.judgeBtn.projectFeas &&
              this.userInfo.staffId === item.tecDirector &&
              item.tecDifficulty) ||
            (this.judgeBtn.projectTecd &&
              this.userInfo.staffId === item.preSale) ||
            (this.judgeBtn.projectUpdate &&
              item.owner === this.userInfo.staffId)
            ? true
            : false;
        case "delete":
          return this.judgeBtn.projectDelete &&
            (this.userInfo.isAdmin === "1" ||
              item.owner === this.userInfo.staffId)
            ? true
            : false;
        case "share":
          return (this.userInfo.isAdmin == "1" || item.isShare == "0") &&
            this.judgeBtn.projectShare &&
            item.isInProcess != "是"
            ? true
            : false;
        case "transfer":
          return item.projStatus != "03" &&
            item.projStatus != "04" &&
            item.projStatus != "06" &&
            (this.userInfo.isAdmin == "1" || item.isShare == "0") &&
            this.judgeBtn.projectTransfer &&
            item.isInProcess != "是"
            ? true
            : false;
        case "amountallot":
          return this.userInfo.resourceType == "02" &&
            item.isShare == "0" &&
            this.judgeBtn.projectAmountallot &&
            item.shareStaffList.length > 0 &&
            item.isInProcess != "是"
            ? true
            : false;
        case "addApplication":
          return (
            (this.userInfo.isAdmin == "1" || item.isShare == "0") &&
            this.judgeBtn.projectAddApplication &&
            item.isInProcess != "是"
          );
        default:
          return this.judgeBtn.visitrecord &&
            item.owner === this.userInfo.staffId
            ? true
            : false;
      }
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: "proj_type", pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.projType = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.dict({ codeGroup: "proj_status", pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.projStatus = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.dict({ codeGroup: "proj_stage", pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.projStage = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.dict({ codeGroup: "win_rate", pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.winRate = res.data ? res.data : [];
            break;
        }
      });
      this.$api.bgmgnt.staff.getList({ resourceType: "02,05,07" }, (res) => {
        //分公司总+销售总监+销售
        // console.log(res)
        switch (res.code) {
          case "0":
            let list = [];
            (res.data.list ? res.data.list : []).map((v) => {
              list.push({
                value: v.staffId,
                label: v.staffName + "(" + v.staffNo + ")",
              });
            });
            this.ownerList = list;
            break;
        }
      });
    },
    getList(page) {
      this.$store.commit("pageFn", { page: page, limit: 10 });
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.selRes));
      param.minWinRate || param.minWinRate === 0
        ? (param.minWinRate = Number(param.minWinRate))
        : null;
      param.maxWinRate || param.maxWinRate === 0
        ? (param.maxWinRate = Number(param.maxWinRate))
        : null;
      param.minAmount || param.minAmount === 0
        ? (param.minAmount = Number(param.minAmount) * 10000)
        : null;
      param.maxAmount || param.maxAmount === 0
        ? (param.maxAmount = Number(param.maxAmount) * 10000)
        : null;
      param.limit = 10;
      param.page = page;
      this.loading = true;
      this.$api.service.project.getList(param, (res) => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              v.planFinishTime_ = this.$pubfunc.TimeTransform(
                "YYYY年MM月DD日",
                v.planFinishTime
              );
              v.projAmount_ = this.$pubfunc.transformPrice(v.projAmount, true);
            });
            this.list = list;
            break;
        }
      });
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        case "projName":
          this.selMod.projName = res.label;
          break;
        case "customerName":
          this.selMod.customerName = res.label;
          break;
        case "depId":
          this.selMod.depId = res[0].depId;
          break;
        case "minWinRate":
          this.selMod[key] = res.value;
          this.$set(this.selMod, "minWinRateTxt", res.label);
          break;
        case "maxWinRate":
          this.selMod[key] = res.value;
          this.$set(this.selMod, "maxWinRateTxt", res.label);
          break;
        default:
          this.selMod[key] = res.value;
      }
    },
    tableOper(key, item) {
      // console.log(key,item)
      let staffId;
      switch (key) {
        case "select":
          this.$store.commit("searchConditionFn", this.selMod);
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          this.getList(1);
          break;
        case "clear":
          for (let k in this.selMod) {
            this.selMod[k] = "";
          }
          this.reset = !this.reset;
          this.tableOper("select", null);
          break;
        case "add":
          this.$router.push({ name: "projectAdd" });
          break;
        case "revise":
          console.log(item);
          staffId = this.userInfo.staffId;
          item.projId
            ? ((staffId === item.preSale && item.owner !== staffId) ||
                (staffId === item.tecDirector && item.owner !== staffId)) &&
              !(
                this.judgeBtn.projectCommit &&
                this.userInfo.department &&
                this.userInfo.depLevel.indexOf(this.special) > -1
              )
              ? this.$router.push({
                  name: "projectBack",
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
              : this.$router.push({
                  name: "projectEdit",
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
            : null;
          break;
        case "view":
          staffId = this.userInfo.staffId;
          item.projId
            ? ((staffId === item.preSale && item.owner !== staffId) ||
                (staffId === item.tecDirector && item.owner !== staffId)) &&
              !(
                this.judgeBtn.projectCommit &&
                this.userInfo.department &&
                this.userInfo.depLevel.indexOf(this.special) > -1
              )
              ? this.$router.push({
                  name: "projectBackView",
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
              : this.$router.push({
                  name: "projectView",
                  params: { projId: this.$pubfunc.encode(item.projId) },
                })
            : null;
          break;
        case "delete":
          this.$store.commit("confirmFn", {
            func: () => {
              if (this.delLoading) {
                return;
              }
              this.delLoading = true;
              this.$api.service.project.delete(
                { projId: item.projId },
                (res) => {
                  // console.log(res)
                  this.delLoading = false;
                  switch (res.code) {
                    case "0":
                      this.$store.commit("alertFn", {
                        type: "success",
                        text: "删除成功",
                        func: () => {
                          this.tableOper("select", null);
                        },
                      });
                      break;
                    default:
                      res.message
                        ? this.$store.commit("alertFn", {
                            type: "error",
                            text: res.message,
                          })
                        : null;
                  }
                }
              );
            },
            text: "确认删除该项目信息吗？<br>删除后不可恢复",
          });
          break;
        case "addVisit":
          this.$emit("dialog", {
            show: true,
            link: "addVisit",
            small: true,
            title: "添加拜访记录",
            data: { key: "project", item },
          });
          break;
        case "share":
          this.meta = "share";
          console.log(item);
          item.shareStaffList.map((i) => {
            if (item.owner != i.staffId) {
              this.shareTo.push(i.staffName);
              this.personChoose.push(i.staffId);
            }
          });
          this.defaultCheckedKeys = this.personChoose;
          this.transferOrShareList = [];
          item.shareStaffList.map((item) => {
            this.transferOrShareList.push(item.staffId);
          });
          this.transferOrShareList.push(item.owner);
          var a = item.customerName.split(",");
          this.customerNames = a;
          this.getData(item);
          this.setTreeDisabled(this.treeData);
          this.dialogVisibleShare = true;
          break;
        case "transfer":
          var a = item.customerName.split(",");
          this.customerNames = a;
          this.showAll = true;
          this.getData(item);
          this.setTreeDisabled(this.treeData);
          this.dialogVisible = true;
          break;
        case "amountallot":
          this.meta = "amountallot";
          this.showStaffName = [];
          this.showStaff = [];
          this.personChoose = [];
          this.data = [];
          this.data.push(item);
          if (item.allot.length > 0) {
            item.allot.map((item) => {
              this.showStaffName.push(item.staffName);
              this.showStaff.push(item.staffId);
              this.personChoose.push(item.staffId);
              this.inputData.push(item.percent);
            });
          } else {
            if (item.shareStaffList.length > 0) {
              item.shareStaffList.map((item) => {
                this.showStaffName.push(item.staffName);
                this.showStaff.push(item.staffId);
                this.personChoose.push(item.staffId);
              });
            } else {
              this.showStaffName.push(item.ownerName);
              this.showStaff.push(item.staffId);
              this.personChoose.push(item.owner);
            }
          }
          // this.$api.service.project.detail({ projId: item.projId }, res => {
          // console.log(res);
          // })
          this.dialogVisibleAdmin = true;
          break;
        case "export":
          if (this.ajaxIng) {
            this.$store.commit("alertFn", {
              type: "warning",
              text: "正在导出报表，请稍后",
            });
            return;
          }
          let param = JSON.parse(JSON.stringify(this.selRes));
          param.minWinRate || param.minWinRate === 0
            ? (param.minWinRate = Number(param.minWinRate))
            : null;
          param.maxWinRate || param.maxWinRate === 0
            ? (param.maxWinRate = Number(param.maxWinRate))
            : null;
          param.minAmount || param.minAmount === 0
            ? (param.minAmount = Number(param.minAmount) * 10000)
            : null;
          param.maxAmount || param.maxAmount === 0
            ? (param.maxAmount = Number(param.maxAmount) * 10000)
            : null;
          this.ajaxIng = true;
          this.$api.download.projectExport(param, (res) => {
            this.$pubfunc.downloadFile(
              res,
              "项目列表" +
                this.$pubfunc.TimeTransform(
                  "YYYYMMDDhhmmss",
                  this.$pubfunc.getTimeNum()
                ) +
                ".xlsx"
            );
            this.ajaxIng = false;
            this.$store.commit("alertFn", {
              type: "success",
              text: "导出成功",
              func: () => {
                this.$emit("success");
              },
            });
          });
          break;
        case "addApplication":
          console.log(item);
          item.type = "add";
          this.$router.push({ path: "/addResource", query: item });
          break;
      }
    },
    checkInput(index) {
      this.inputData[index] = this.inputData[index].replace(
        /^0*(0\.|[1-9])/,
        "$1"
      );
      this.inputData[index] = this.inputData[index].replace(/[^\d]/g, ""); //清除"数字"以外的字符
      this.inputData[index] = this.inputData[index].replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      this.inputData[index] =
        this.inputData[index].indexOf(".") > 0
          ? this.inputData[index].split(".")[0].substring(0, 10) +
            "." +
            this.inputData[index].split(".")[1]
          : this.inputData[index].substring(0, 3);
      if (parseFloat(this.inputData[index]) > 100) {
        this.inputData[index] = "100";
      }
      if (parseFloat(this.inputData[index]) == 0) {
        this.inputData[index] = "0";
      }
      return this.inputData[index];
    },
  },
  created() {
    this.getTreeData();
    this.getDropData();
    this.reset = !this.reset;
    this.$store.state.searchCondition
      ? (this.selMod = this.$store.state.searchCondition)
      : null;
    this.selRes = JSON.parse(JSON.stringify(this.selMod));
    this.getList(this.$store.state.page.page);
  },
  mounted() {
    this.$pubfunc.delSStorage("proMsg");
  },
};
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
