<template>
  <div class="resourceDetail fillBox projectForm_">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>项目资源及费用流程({{ data.applyNo }})</span>
      <unit-btn
        type="plain right"
        text="返回"
        @click="operaBtn('cancel')"
      ></unit-btn>
      <unit-btn
        type="plain right"
        v-if="judgeShow('revoke')"
        :loading="ajaxing"
        text="撤回"
        @click="operaBtn('revoke')"
      ></unit-btn>
      <unit-btn
        type=" right"
        v-if="judgeShow('submitApply')"
        :loading="ajaxing"
        text="提交"
        @click="operaBtn('submitApply')"
      ></unit-btn>
      <unit-btn
        type="right"
        v-if="judgeShow('return')"
        text="不通过"
        :loading="ajaxing"
        @click="operaBtn('return')"
      ></unit-btn>
      <unit-btn
        type=" right"
        v-if="judgeShow('pass')"
        text="通过"
        :loading="ajaxing"
        @click="operaBtn('pass')"
      ></unit-btn>
    </div>
    <div class="contentFix">
      <el-scrollbar class="unitScrollbar" ref="scrollbar">
        <div class="contentBox">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="process">流程表单</el-menu-item>
            <el-menu-item index="picture">流程图</el-menu-item>
            <!-- <el-menu-item index="explain">技术难点说明</el-menu-item> -->
          </el-menu>
          <div class="process" v-show="activeIndex === 'process'">
            <process-form
              :data="data"
              @change="getForm"
              ref="processForm"
            ></process-form>
            <process-list :data="data.taskList"></process-list>
          </div>
          <div class="picture" v-show="activeIndex === 'picture'">
            <div>
              <img src="../../assets/images/process.png" alt="" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      ref="noPass"
      width="580px"
      append-to-body
      custom-class="approval_nopass_dialog"
      @opened="setHeight('noPass')"
      @close="operaBtn('close')"
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
        <unit-btn
          :loading="loading"
          @click="operaBtn('submit')"
          text="提交"
        ></unit-btn>
        <unit-btn
          type="plain"
          @click="operaBtn('close')"
          text="取消"
        ></unit-btn>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unitPopover from "@/unit/components/popover";
import processForm from "./components/processForm";
import processList from "./components/processList";
export default {
  name: "resourceDetail",
  components: {
    unitPopover,
    processForm,
    processList,
  },
  data() {
    return {
      processId: null,
      type: null,
      isEdit: false,
      data: {},
      form: {},
      activeIndex: "process",
      dialogVisible: false,
      textarea: "",
      loading: false,
      ajaxing: false,
      showOperaBtn: false,
    };
  },
  computed: {
    /**
     * @name: 账号资源类型（岗位）
     * @param {string}resourceType 01总经理 02销售团队总经理    03技术副总 04采购部长 05销售总监 06技术总监/负责人 07销售经理 08售前技术工程师 09采购经理 10采购主管 11副总经理 99其他
     * @description  01 02 05 07 11 admin 可查看所有
     */

    userInfo() {
      const userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      if (
        this.$store.state.userInfo &&
        this.$store.state.userInfo.info &&
        this.$store.state.userInfo.info.staff
      ) {
        const resourceType = this.$store.state.userInfo.info.staff.resourceType
          ? this.$store.state.userInfo.info.staff.resourceType
          : "";
        const staffId = this.$store.state.userInfo.info.staff.staffId
          ? this.$store.state.userInfo.info.staff.staffId
          : "";
        return { userInfo, resourceType, staffId };
      }
      return { userInfo };
    },
  },
  methods: {
    /**
     * @param {object} v 表单数据变化后，传出的表单值
     */
    getForm(v) {
      this.form = { ...v };
    },
    /**
     * @param {string} key 切换后的选中页的key
     * @param {Array} keyPath 切换后的选中页的[key]
     */
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },

    operaBtn(key) {
      switch (key) {
        case "close":
          this.dialogVisible = false;
          this.textarea = "";
          break;
        case "cancel":
          this.$router.go(-1);
          break;
        case "revoke":
          if (this.ajaxing) return;
          this.$store.commit("confirmFn", {
            text: "确定要撤回该流程吗？",
            type: "warning",
            func: () => {
              this.ajaxing = true;
              this.$api.service.myApply.backResource(
                { processId: this.processId },
                (res) => {
                  this.ajaxing = false;
                  if (res.code === "0") {
                    this.$store.commit("alertFn", {
                      text: "操作成功",
                      type: "success",
                    });
                    this.getDetail();
                  } else {
                    res.message
                      ? this.$store.commit("alertFn", {
                          text: res.message,
                          type: "error",
                        })
                      : null;
                  }
                }
              );
            },
          });
          break;
        case "pass":
          if (this.ajaxing) return;
          this.$store.commit("confirmFn", {
            text: "确定要通过该流程吗？",
            type: "warning",
            func: () => {
              this.ajaxing = true;
              this.$api.service.myApproval.approveResource(
                {
                  approveStatus: "2",
                  taskList: [{ taskId: this.$route.query.taskId }],
                },
                (res) => {
                  this.ajaxing = false;
                  if (res.code === "0") {
                    this.$store.commit("alertFn", {
                      text: "操作成功",
                      type: "success",
                    });
                    this.getDetail();
                  } else {
                    res.message
                      ? this.$store.commit("alertFn", {
                          text: res.message,
                          type: "error",
                        })
                      : null;
                  }
                }
              );
            },
          });
          break;
        case "return":
          this.dialogVisible = true;
          break;
        case "submitApply":
          if (this.ajaxing) return;
          this.$refs.processForm.submit();
          if (!this.form) return;
          Reflect.deleteProperty(this.form, "preSaleIdsArr");
          this.form.reserveLaborCost = this.form.reserveLaborCost
            .split(",")
            .join("");
          this.form.reserveTravelExpense = this.form.reserveTravelExpense
            .split(",")
            .join("");
          this.ajaxing = true;
          this.$api.service.project.resourceReApply(this.form, (res) => {
            this.ajaxing = false;
            switch (res.code) {
              case "0":
                this.$store.commit("alertFn", {
                  text: "操作成功",
                  type: "success",
                });
                this.isEdit = false;
                this.getDetail();
                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      text: res.message,
                      type: "error",
                    })
                  : null;
                break;
            }
          });
          break;
        case "submit":
          if (this.loading) return;
          this.loading = true;
          this.$api.service.myApproval.approveResource(
            {
              approveStatus: "3",
              suggestion: this.textarea,
              taskList: [{ taskId: this.$route.query.taskId }],
            },
            (res) => {
              this.loading = false;
              if (res.code === "0") {
                this.$store.commit("alertFn", {
                  text: "操作成功",
                  type: "success",
                });
                this.operaBtn("close");
                this.getDetail();
              } else {
                res.message
                  ? this.$store.commit("alertFn", {
                      text: res.message,
                      type: "error",
                    })
                  : null;
              }
            }
          );
          break;
      }
    },
    judgeShow(key) {
      switch (key) {
        case "revoke":
          return (
            this.type === "apply" &&
            (this.data.processStatus == "0" || this.data.processStatus == "6")
          );
        case "submitApply":
          return this.type === "apply" && this.isEdit;
        case "pass":
          return this.type === "approval" && this.showOperaBtn;
        case "return":
          return this.type === "approval" && this.showOperaBtn;
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
    getDetail() {
      this.$api.service.project.resourceDetail(
        { processId: this.processId },
        (res) => {
          switch (res.code) {
            case "0":
              this.data = res.data;
              this.data.type = this.type;
              this.data.isEdit = this.isEdit;
              this.data.projId = this.$route.query.projId;
              for (const [k, v] of Object.entries(this.data.taskList)) {
                if (
                  this.userInfo.staffId === v.operateUser &&
                  v.approveStatus === "1" &&
                  this.data.processStatus !== "5"
                ) {
                  this.showOperaBtn = true;
                } else if (
                  this.userInfo.staffId === v.operateUser &&
                  v.approveStatus !== "1"
                ) {
                  this.showOperaBtn = false;
                }
              }
              break;
            default:
              res.message
                ? this.$store.commit("alertFn", {
                    text: res.message,
                    type: "error",
                  })
                : null;
              break;
          }
        }
      );
    },
  },
  created() {
    this.processId = this.$route.query.processId;
    this.type = this.$route.query.type;
    this.isEdit = this.$route.query.isEdit;
    this.getDetail();
  },
};
</script>

<style scoped>
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
  width: 16%;
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
</style>
<style lang="scss" scoped>
.resourceDetail {
  .contentFix {
    .contentBox {
      box-shadow: 0px 0px 6px 1px rgba(70, 128, 244, 0.11);
      padding: 0 27px 38px 28px;
      .el-menu {
        .el-menu-item {
          padding: 10px 7px;
          margin-right: 57px;
          height: 43px;
          line-height: 35px;
        }
      }
      .process {
        margin-top: 65px;
        .processForm {
          /deep/ .formbox {
            .four {
              & > span:nth-child(1),
              & > span:nth-child(3) {
                width: 20%;
                background-color: #e7f3fc;
              }
              & > span:nth-child(2),
              & > span:nth-child(4) {
                width: 30%;
              }
            }
            .two {
              & > span:nth-child(1) {
                width: calc(20% - 1px);
                background-color: #e7f3fc;
              }
              & > span:nth-child(2) {
                width: calc(80% - 1px);
              }
            }
          }
        }
      }
    }
    .processBox {
      width: 100%;
      margin-top: 26px;
      box-shadow: 0px 0px 6px 1px rgba(70, 128, 244, 0.11);
    }
  }
}
</style>