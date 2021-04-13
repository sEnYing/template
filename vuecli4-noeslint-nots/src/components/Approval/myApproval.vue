<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="staff_icon"></i>
      <span>我的审批</span>
      <unit-btn
        type="large right"
        text="批量审批"
        @click="tableOper('approvals', null)"
      ></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">审批类型</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="approvalType"
                  class="auto"
                  placeholder="全部"
                  :list="appType"
                  @change="dropdownReturn"
                  :result="selMod.processType"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">对象类型</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="objectType"
                  class="auto"
                  placeholder="全部"
                  :list="objType"
                  @change="dropdownReturn"
                  :result="selMod.applyType"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">审批状态</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="approvalState"
                  class="auto"
                  placeholder="全部"
                  :list="appState"
                  @change="dropdownReturn"
                  :result="selMod.approveStatus"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
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
            <el-table
              :data="tableData"
              style="width: 100%; color: #636980; fontsize: 14px"
              :header-cell-style="{
                background: 'rgba(241,244,251,1)',
                color: '#5D6680',
              }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                :selectable="checkboxT"
              ></el-table-column>
              <el-table-column
                label="序号"
                width="50px"
                :index="indexMethod"
                type="index"
              ></el-table-column>
              <el-table-column
                v-for="(item, i) in thData"
                :key="i"
                :label="item.label"
                :prop="item.prop"
                :style="{ background: '#fff' }"
                :min-width="item.width ? item.width : null"
                :width="setWidth(item.label)"
                :align="item.align ? item.align : 'left'"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="item.prop == 'applyCustomerName'">
                    {{
                      scope.row.processType === "4"
                        ? scope.row.applyProjName
                        : scope.row["applyCustomerName"]
                        ? scope.row["applyCustomerName"]
                        : scope.row["applyContactName"]
                        ? scope.row["applyContactName"]
                        : scope.row["applyProjName"]
                    }}
                  </div>
                  <div v-else>{{ scope.row[item.prop] }}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="left">
                <template slot-scope="scope">
                  <el-button
                    style="padding: 3px 0"
                    @click="tableOper('check', scope.row)"
                    type="text"
                    >查看</el-button
                  >
                  <el-button
                    style="padding: 3px 0"
                    @click="tableOper('pass', scope.row)"
                    type="text"
                    v-if="judgeShow('pass', scope.row)"
                    >通过</el-button
                  >
                  <el-button
                    style="padding: 3px 0"
                    @click="tableOper('nopass', scope.row)"
                    type="text"
                    v-if="judgeShow('nopass', scope.row)"
                    >不通过</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pageBox">
              <div>
                <el-pagination
                  layout="prev, pager, next, total, sizes"
                  :total="page.total"
                  :page-size="page.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :current-page="page.currentPage"
                  @current-change="currentChange"
                  @size-change="handleSizeChange"
                  prev-text="上一页"
                  next-text="下一页"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisibleCheck"
      width="580px"
      append-to-body
      ref="check"
      custom-class="myApproval_check_dialog"
      @opened="setHeight('check')"
      @close="cancel('check')"
    >
      <div slot="title" class="dialog_header">
        <span class="el-dialog__title"
          >{{ message.processTypeTxt }}申请详情</span
        >
      </div>
      <div class="content_top">
        <div>
          <div>
            <span>申请类型：</span>
            <span>{{ message.processTypeTxt }}</span>
          </div>
          <div>
            <span>申请人：</span>
            <span>{{ message.applyUserName }}</span>
          </div>
          <div v-if="message.processType != '3'">
            <span>申请时间：</span>
            <span>{{ message.createTime }}</span>
          </div>
        </div>
        <div v-if="message.processType == '3'">
          <span>申请时间：</span>
          <span>{{ message.createTime }}</span>
        </div>
        <div style="margin-bottom: 10px">
          <div>
            <span>{{ message.processTypeTxt }}给：</span>
            <span
              v-if="
                message.processType == '2' ||
                (message.staffList && message.staffList.length > 0)
              "
            >
              <span
                v-for="(item, index) of message.staffList"
                :key="index"
                :class="
                  item.flag == '1'
                    ? 'addColor'
                    : item.flag == '2'
                    ? 'delColor'
                    : ''
                "
              >
                <span v-if="item.staffId != message.applyUser"
                  >{{ item.staffName }}&nbsp;&nbsp;&nbsp;&nbsp;</span
                >
              </span>
            </span>
            <span
              v-else-if="
                message.processType == '3' &&
                message.projList &&
                message.projList.length > 0
              "
            >
              <span
                v-for="(item, index) of message.projList[0].allot"
                :key="index"
                :class="
                  item.flag == '1'
                    ? 'addColor'
                    : item.flag == '2'
                    ? 'delColor'
                    : ''
                "
              >
                <span v-if="item.staffId != message.applyUser"
                  >{{ item.staffName }}&nbsp;&nbsp;&nbsp;&nbsp;</span
                >
              </span>
            </span>
            <span v-else>
              <span v-for="(item, index) of message.projList" :key="index">{{
                item.ownerName
              }}</span>
            </span>
          </div>
        </div>
        <div
          style="height: 24px"
          v-for="(item, index) of message.applyType == '1'
            ? message.customerList
            : message.applyType == '2'
            ? message.contactList
            : message.projList"
          :key="index"
        >
          <div>
            <span>客户名称：</span>
            <span>{{ item.customerName || item.orgName }}</span>
          </div>
        </div>
        <div
          v-for="(item, index) of message.projList"
          :key="index"
          class="project"
        >
          <div>
            <span>项目名称：</span>
            <span>{{ item.projName }}</span>
          </div>
          <div v-if="item.allot && item.allot.length > 0">
            <span>分配比例详情：</span>
            <div class="allot">
              <span v-for="(item, index) of item.allot" :key="index"
                >{{ item.staffName }}&nbsp;&nbsp;{{ item.percent }}%</span
              >
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) of message.contactList"
          :key="index"
          class="peopleMessage"
        >
          <div>
            <div>
              <span>联系人名称：</span>
              <span>{{ item.contactName }}</span>
            </div>
            <div>
              <span>联系电话：</span>
              <span>{{ item.telephone }}</span>
            </div>
            <div>
              <span>职务：</span>
              <span>{{ item.position }}</span>
            </div>
          </div>
        </div>
        <div>
          <span>申请原因：</span>
        </div>
        <div>
          <span
            style="
              margin: 10px 0 10px 30px;
              display: inline-block;
              line-height: 1.5;
            "
          >
            {{ message.applyReason }}
          </span>
        </div>
        <div v-if="message.processStatus == '3'">
          <span>不通过原因：</span>
        </div>
        <div
          v-if="message.processStatus == '3'"
          style="width: 100%; padding-right: 30px; box-sizing: border-box"
        >
          <span
            style="
              margin: 10px 0 10px 30px;
              display: inline-block;
              line-height: 1.5;
            "
            v-for="(item, index) of message.taskList"
            :key="index"
          >
            {{ item.suggestion }}
          </span>
        </div>
      </div>
      <div
        class="content_bottom"
        v-for="(item, index) of message.taskList"
        :key="index"
      >
        <div>
          <h1>审批:</h1>
        </div>
        <div>
          <el-radio-group v-model="radio" :disabled="item.approveStatus != '1'">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入不通过理由，少于200个字符"
            v-model="textarea"
            maxlength="200"
            show-word-limit
            :disabled="radio == '2'"
          ></el-input>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-for="(item, index) of message.taskList"
        :key="index"
        v-if="item.approveStatus == '1'"
      >
        <el-button
          type="primary"
          @click="submitClick('checkSubmit')"
          :disabled="isDisable"
          >确 定</el-button
        >
        <el-button @click="cancel('check')">取 消</el-button>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
        v-for="(item, index) of message.taskList"
        :key="index"
        v-if="item.approveStatus != '1'"
      >
        <el-button @click="cancel('check')">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleApprovals"
      ref="approvals"
      width="580px"
      append-to-body
      custom-class="approvals_dialog"
      @opened="setHeight('approvals')"
      @close="cancel"
    >
      <div>
        <h1>批量审批</h1>
      </div>
      <div>
        <el-radio-group v-model="radio">
          <el-radio :label="2">批量通过</el-radio>
          <el-radio :label="3">批量不通过</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入少于200个字符"
          v-model="textarea"
          :disabled="radio == '2' ? true : false"
          maxlength="200"
          show-word-limit
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitClick('approvals')"
          :disabled="isDisable"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisiblePass"
      width="580px"
      append-to-body
      ref="Pass"
      custom-class="approval_pass_dialog"
      @opened="setHeight('Pass')"
      @close="cancel('pass')"
    >
      <div class="pass">
        <span>审批通过：</span>
      </div>
      <div
        class="message"
        v-for="(item, index) of message.projList"
        :key="index"
      >
        <div>
          <div>
            <span>项目名称：</span>
          </div>
          <div>
            <span>{{ item.projName }}</span>
          </div>
        </div>
        <div class="content">
          <div>
            <span>分配比例：</span>
          </div>
          <div class="content_right">
            <div v-for="(item, index) of message.staffList" :key="index">
              <span>{{ item.staffName }}</span>
              <el-input
                v-model="inputData[index]"
                @input="checkInput(index)"
              ></el-input>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitClick('pass')"
          :disabled="isDisable"
          >提 交</el-button
        >
        <el-button @click="cancel('pass')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleNoPass"
      ref="noPass"
      width="580px"
      append-to-body
      custom-class="approval_nopass_dialog"
      @opened="setHeight('noPass')"
      @close="cancel"
    >
      <div>
        <span>请输入不通过理由</span>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入少于200个字符"
          v-model="textarea"
          maxlength="200"
          show-word-limit
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitClick('nopass')"
          :disabled="isDisable"
          >提 交</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/font/customerManage/iconfont.css";
export default {
  name: "myApproval",
  props: ["dom"],
  data() {
    return {
      tableData: [],
      thData: [
        { number: 1, prop: "applyTypeTxt", label: "对象类型" },
        { number: 2, prop: "applyCustomerName", label: "对象名称" },
        { number: 3, prop: "createTime", label: "申请时间" },
        { number: 4, prop: "processTypeTxt", label: "申请类型" },
        { number: 5, prop: "processStatusTxt", label: "申请状态" },
        { number: 6, prop: "approveStatusTxt", label: "审批状态" },
      ],
      selMod: {
        processType: "",
        applyType: "",
        approveStatus: "",
        page: "",
        limit: "",
        // legalPerson:'',
        // telephone:'',
      },
      selRes: {},
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      loading: true,
      appType: [],
      objType: [],
      appState: [],
      reset: true,
      message: "",
      dialogVisibleCheck: false,
      dialogVisiblePass: false,
      dialogVisibleNoPass: false,
      dialogVisibleApprovals: false,
      radio: "",
      textarea: "",
      selectData: [],
      inputData: [],
      taskList: [],
      taskOrder: "",
      isDisable: false,
      pageNum: "",
      trueHeight: "",
      trueWidth: "",
    };
  },
  methods: {
    indexMethod(index) {
      this.pageNum = this.page.currentPage
        ? Number(this.page.currentPage - 1)
        : 0;

      return (
        (this.pageNum
          ? Number(this.pageNum) *
              (this.page.pageSize ? this.page.pageSize : 10) +
            index
          : index) + 1
      );
    },
    submitClick(key) {
      switch (key) {
        case "checkSubmit":
          this.isDisable = true;
          this.$pubfunc.fnThrottle(this.submit, 500)("checkSubmit");
          setTimeout(() => {
            this.isDisable = false;
          }, 1500);
          break;
        case "approvals":
          this.isDisable = true;
          this.$pubfunc.fnThrottle(this.submit, 500)("approvals");
          setTimeout(() => {
            this.isDisable = false;
          }, 1500);
          break;
        case "pass":
          this.isDisable = true;
          this.$pubfunc.fnThrottle(this.submit, 500)("pass");
          setTimeout(() => {
            this.isDisable = false;
          }, 1500);
          break;
        case "nopass":
          this.isDisable = true;
          this.$pubfunc.fnThrottle(this.submit, 500)("nopass");
          setTimeout(() => {
            this.isDisable = false;
          }, 2000);
          break;
      }
    },
    getList(page) {
      this.$store.commit("pageFn", { page: page, limit: 10 });
      this.page.currentPage = page;
      let param = JSON.parse(JSON.stringify(this.selRes));
      param.limit = this.page.pageSize;
      param.page = page;
      this.loading = true;
      // 获取列表接口
      this.$api.service.myApproval.getApprovalList(param, (res) => {
        this.page.total = res.data.total;
        // console.log(res);
        this.tableData = res.data.list;
        this.loading = false;
      });
    },
    setWidth(str) {
      if (str === "对象类型") {
        return "150px";
      } else {
        return;
      }
    },
    setHeight(k) {
      this.$nextTick(() => {
        let h = this.$refs[k].$refs.dialog.offsetHeight;
        let w = this.$refs[k].$refs.dialog.offsetWidth;
        this.$refs[k].$refs.dialog.style.height = Math.floor(h / 2) * 2 + "px";
        this.$refs[k].$refs.dialog.style.width = Math.floor(w / 2) * 2 + "px";
      });
    },
    submit(key) {
      switch (key) {
        case "checkSubmit":
          if (this.radio == 2) {
            if (
              this.message.taskList[0].taskOrder == 1 &&
              this.message.applyType == "3" &&
              this.message.processType != "1"
            ) {
              // 本部门分总审核通过
              var a = [];
              this.message.staffList.forEach((item, index) => {
                a.push(item.staffId);
                if (item.flag == "2") {
                  this.message.staffList.splice(index, 1);
                }
              });
              if (a.indexOf(this.message.projList[0].owner) == -1) {
                this.message.staffList.push({
                  staffId: this.message.projList[0].owner,
                  staffName: this.message.projList[0].ownerName,
                });
              }

              this.dialogVisiblePass = true;
            } else {
              // 其他部门分总审核通过
              this.message.taskList.map((item) => {
                this.taskList.push({ taskId: item.taskId });
              });
              this.$api.service.myApproval.approve(
                {
                  taskList: this.taskList,
                  approveStatus: JSON.stringify(this.radio),
                },
                (res) => {
                  if (res.code == "0") {
                    this.$message({
                      message: "操作成功！",
                      type: "success",
                    });
                    this.cancel("check");
                    this.getList();
                  } else {
                    this.$message({
                      message: res.message,
                      type: "error",
                    });
                  }
                }
              );
            }
          } else if (this.radio == 3) {
            // 审核不通过
            if (this.textarea) {
              this.message.taskList.map((item) => {
                this.taskList.push({ taskId: item.taskId });
              });
              this.$api.service.myApproval.approve(
                {
                  taskList: this.taskList,
                  approveStatus: JSON.stringify(this.radio),
                  suggestion: this.textarea,
                },
                (res) => {
                  if (res.code == "0") {
                    this.$message({
                      message: "操作成功！",
                      type: "success",
                    });
                    this.cancel("check");
                    this.getList();
                  } else {
                    this.$message({
                      message: res.message,
                      type: "error",
                    });
                  }
                }
              );
            } else {
              this.$message({
                message: "请输入不通过原因",
                type: "error",
              });
            }
          } else {
            this.$message({
              message: "请选择是否通过",
              type: "error",
            });
          }
          break;
        case "approvals":
          this.message = [];
          this.selectData.map((item) => {
            this.message.push({ taskId: item.taskId });
          });
          if (this.radio == 2) {
            this.$api.service.myApproval.approve(
              {
                taskList: this.message,
                approveStatus: JSON.stringify(this.radio),
              },
              (res) => {
                if (res.code == "0") {
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.cancel();
                  this.getList();
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              }
            );
          } else if (this.radio == 3) {
            this.submit("nopass");
          } else {
            this.$message({
              message: "请选择是否通过！",
              type: "error",
            });
          }
          break;
        case "pass":
          if (this.message.staffList.length != this.inputData.length) {
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
            if (a != 100 && this.message.projList.length > 0) {
              this.$message({
                showClose: true,
                message: "分配比例总和应为100%",
                type: "error",
              });
            } else {
              this.radio = 2;
              var allot = [];
              for (var j = 0; j < this.message.projList.length; j++) {
                for (var i = 0; i < this.inputData.length; i++) {
                  allot.push({
                    projId: this.message.projList[j].projId,
                    staffId: this.message.staffList[i].staffId,
                    percent: this.inputData[i],
                  });
                }
              }
              this.message.taskList.map((item) => {
                this.taskList.push({ taskId: item.taskId, allot: allot });
              });
              this.$api.service.myApproval.approve(
                {
                  taskList: this.taskList,
                  approveStatus: JSON.stringify(this.radio),
                },
                (res) => {
                  // console.log(res);
                  if (res.code == "0") {
                    this.$message({
                      message: "操作成功！",
                      type: "success",
                    });
                    this.cancel("pass");
                    this.dialogVisibleCheck = false;
                    this.getList();
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
          break;
        case "nopass":
          if (this.textarea) {
            this.radio = 3;
            this.$api.service.myApproval[
              this.message.processType === "4" ? "approveResource" : "approve"
            ](
              {
                taskList: Array.isArray(this.message)
                  ? this.message
                  : [{ taskId: this.message.taskId }],
                approveStatus: JSON.stringify(this.radio),
                suggestion: this.textarea,
              },
              (res) => {
                if (res.code == "0") {
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.cancel();
                  this.getList();
                } else {
                  this.$message({
                    message: res.message,
                    type: "error",
                  });
                }
              }
            );
          } else {
            this.$message({
              message: "请输入不通过原因",
              type: "error",
            });
          }

          break;
      }
    },
    jump() {
      if (this.$route.params.taskId) {
        this.$api.service.myApproval.getDetail(
          { taskId: this.$route.params.taskId },
          (res) => {
            this.message = res.data;
            // console.log(this.message);

            this.radio = parseInt(this.message.taskList[0].approveStatus);
            this.textarea = this.message.taskList[0].suggestion;
            this.dialogVisibleCheck = true;
          }
        );
      }
    },
    cancel(key) {
      this.textarea = "";
      this.message = "";
      this.inputData = [];
      this.ProjectList = [];
      this.checkProjectList = [];
      this.TelList = [];
      this.checkTelList = [];
      this.defaultCheckedKeys = [];
      switch (key) {
        case "check":
          this.dialogVisibleCheck = false;
          break;
        case "pass":
          this.dialogVisibleCheck = false;
          this.dialogVisiblePass = false;
          break;
      }
      this.dialogVisibleNoPass = false;
      this.dialogVisibleApprovals = false;
      if (this.$route.params.taskId) {
        this.$route.params.taskId = "";
      }
      // this.$refs.tree.setCheckedNodes([])
    },
    dropdownReturn(res, key) {
      switch (key) {
        case "approvalType":
          this.selMod.processType = res.value;
          break;
        case "objectType":
          this.selMod.applyType = res.value;
          break;
        case "approvalState":
          this.selMod.approveStatus = res.value;
          break;
      }
    },
    tableOper(key, item) {
      this.taskList = [];
      switch (key) {
        case "approvals":
          this.radio = "";
          if (this.selectData.length <= 0) {
            this.$alert("请先勾选需要批量审批的客户", "提示", {
              confirmButtonText: "知道了",
              customClass: "customerManage_messageBox",
              iconClass: "iconfont icon-gantanhao-sanjiaokuang",
              callback: (action) => {
                this.dialogVisible = false;
              },
            });
          } else {
            this.dialogVisibleApprovals = true;
          }
          break;
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
        case "check":
          if (item.processType !== "4") {
            this.taskOrder = item.taskOrder;
            this.$api.service.myApproval.getDetail(
              { taskId: item.taskId },
              (res) => {
                this.message = res.data;
                this.message.taskList.map((item) => {
                  this.textarea = item.suggestion;
                  if (item.approveStatus == "3") {
                    this.radio = 3;
                  } else if (item.approveStatus == "2") {
                    this.radio = 2;
                  }
                });
                this.message.staffList.forEach((item, index) => {
                  if (this.message.applyType == "1") {
                    if (item.staffId == this.message.customerList[0].owner) {
                      this.message.staffList.splice(index, 1);
                    }
                  }
                  if (this.message.applyType == "2") {
                    if (item.staffId == this.message.contactList[0].owner) {
                      this.message.staffList.splice(index, 1);
                    }
                  }
                  if (this.message.applyType == "3") {
                    if (item.staffId == this.message.projList[0].owner) {
                      this.message.staffList.splice(index, 1);
                    }
                  }
                });
                this.dialogVisibleCheck = true;
              }
            );
          } else {
            item.type = "approval";
            item.isEdit = false;
            this.$router.push({
              path: "/myapprove/resourceProcess",
              query: item,
            });
          }
          break;
        case "pass":
          if (this.loading) return;
          this.$confirm("确定审批通过吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "customerManage_messageBox",
            iconClass: "iconfont icon-gantanhao-sanjiaokuang",
          })
            .then(() => {
              var params;
              item.processType === "4"
                ? (params = { processId: item.processId })
                : (params = { taskId: item.taskId });
              this.loading = true;
              this.$api.service[
                item.processType === "4" ? "project" : "myApproval"
              ][item.processType === "4" ? "resourceDetail" : "getDetail"](
                params,
                (res) => {
                  this.loading = false;
                  if (res.code === "0") {
                    this.message = res.data;
                    if (item.processType === "4") {
                      this.$api.service.myApproval.approveResource(
                        {
                          approveStatus: "2",
                          taskList: [{ taskId: item.taskId }],
                        },
                        (res) => {
                          if (res.code == "0") {
                            this.$message({
                              message: "操作成功！",
                              type: "success",
                            });
                            this.cancel();
                            this.getList();
                          } else {
                            this.$message({
                              message: res.message,
                              type: "error",
                            });
                          }
                        }
                      );
                    } else {
                      if (
                        item.taskOrder == 1 &&
                        this.message.applyType == "3" &&
                        this.message.processType != "1"
                      ) {
                        var a = [];
                        this.message.staffList.forEach((item, index) => {
                          a.push(item.staffId);
                          if (item.flag == "2") {
                            this.message.staffList.splice(index, 1);
                          }
                        });
                        if (a.indexOf(this.message.projList[0].owner) == -1) {
                          this.message.staffList.push({
                            staffId: this.message.projList[0].owner,
                            staffName: this.message.projList[0].ownerName,
                            flag: "0",
                          });
                        }
                        this.dialogVisiblePass = true;
                      } else {
                        this.radio = 2;
                        this.taskList.push({ taskId: item.taskId, allot: [] });
                        this.$api.service.myApproval.approve(
                          {
                            taskList: this.taskList,
                            approveStatus: JSON.stringify(this.radio),
                          },
                          (res) => {
                            if (res.code == "0") {
                              this.$message({
                                message: "操作成功！",
                                type: "success",
                              });
                              this.cancel();
                              this.getList();
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
                  } else {
                    this.$message({
                      message: res.message,
                      type: "error",
                    });
                  }
                }
              );
            })
            .catch(() => {});
          break;
        case "nopass":
          this.message = item;
          this.dialogVisibleNoPass = true;
          break;
      }
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList(val);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selectData = val;
      // console.log(this.selectData);
    },
    checkboxT(row, index) {
      if (
        row.approveStatus === "1" &&
        row.applyType === "3" &&
        row.processType !== "4"
      ) {
        return true;
      } else {
        return false;
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
    judgeShow(key, item) {
      switch (key) {
        case "pass":
          return (
            (item.processStatus === "0" ||
              item.processStatus === "1" ||
              item.processStatus === "6") &&
            item.approveStatus === "1"
          );
          break;
        case "nopass":
          return (
            (item.processStatus === "0" ||
              item.processStatus === "1" ||
              item.processStatus === "6") &&
            item.approveStatus === "1"
          );
          break;
      }
    },
    getDict() {
      this.$api.public.dict({ codeGroup: "process_type", pCode: "" }, (res) => {
        switch (res.code) {
          case "0":
            this.appType = res.data;
            break;
        }
      });
      this.$api.public.dict({ codeGroup: "apply_type", pCode: "" }, (res) => {
        switch (res.code) {
          case "0":
            this.objectType = res.data;
            break;
        }
      });
      this.$api.public.dict(
        { codeGroup: "approve_status", pCode: "" },
        (res) => {
          switch (res.code) {
            case "0":
              this.appState = res.data;
              break;
          }
        }
      );
    },
  },
  created() {
    this.jump();
    this.selMod = this.$store.state.searchCondition;
    this.selRes = JSON.parse(JSON.stringify(this.selMod));
    this.getList(this.$store.state.page.page);
    this.getDict();
  },
};
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% + 4px);
}
.formBox > div:nth-child(3) {
  padding-left: 70px;
  width: calc(20% + 8px);
}
/* .formBox>div:nth-child(5){
    padding-left: 38px;
    padding-right: 0;
    width: calc(20% - 34px);
} */
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div > div > * {
  width: 100%;
}
.boxTable {
  height: 60vh;
  overflow-y: auto;
}
.pageBox {
  padding: 16px 0 0px;
  text-align: left;
}
.pageBox > div {
  height: 30px;
}
.addColor {
  color: green;
}
.delColor {
  text-decoration: line-through;
  color: red;
}
</style>
