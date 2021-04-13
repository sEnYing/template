<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="main_icon"></i>
      <span>我的消息</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">消息状态</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="read"
                  class="auto"
                  placeholder="全部"
                  :list="read"
                  @change="dropdownReturn"
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
            <unit-table
              :total="total"
              :opern="2"
              :wrap="2"
              :page="page"
              v-if="!loading || list.length > 0"
              :list="list"
              :title="title"
              ref="table"
              :classname="{ red: { isRead_: { isRead: '0' } } }"
              :operation="[{ key: 'view', show: judgeShow }]"
              @click="tableOper"
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
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/tableScroll";
import unitProject from "@/unit/components/thisUnit/project";
import unitCustomer from "@/unit/components/thisUnit/customer";
export default {
  name: "message",
  props: ["dom"],
  components: { unitTable, unitProject, unitCustomer },
  data() {
    return {
      selMod: {
        read: "",
      },
      selRes: {},
      reset: true,
      read: [
        { value: "0", label: "未读" },
        { value: "1", label: "已读" },
      ],
      title: [
        { key: "fromUsername", name: "发送人", width: 10 },
        { key: "title", name: "消息主题", width: 25 },
        { key: "content", name: "消息内容", width: 38 },
        { key: "createTime_", name: "发送时间", width: 17 },
        { key: "isRead_", name: "消息状态", width: 10 },
      ],
      list: [],
      ajaxIng: false,
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
    };
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      let isCharge =
          userInfo.info &&
          userInfo.info.staff &&
          userInfo.info.staff.isCharge === "1"
            ? true
            : false,
        staffId =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffId
            : null;
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
      return { isCharge, staffId, depLevel: depLevel };
    },
    special() {
      return this.$store.state.special.depLevel;
    },
  },
  methods: {
    judgeShow(item, i, key) {
      return key === "view" ||
        (key === "revise" && item.commitStatus === "1") ||
        item.owner === this.userInfo.staffId ||
        item.creator === this.userInfo.staffId
        ? true
        : false;
    },
    getList(page) {
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.selRes));
      param.limit = 10;
      param.page = page;
      // console.log(param)
      this.loading = true;
      this.$api.service.message.getList(param, (res) => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              let time = v.createTime ? v.createTime.split(" ") : [];
              v.createTime_ =
                time.length > 0
                  ? this.$pubfunc.TimeTransform("YYYY年MM月DD日", time[0]) +
                    (time.length > 1
                      ? " " +
                        this.$pubfunc.transTime(
                          time[1].split(":").slice(0, 2).join(":")
                        )
                      : "")
                  : "";
              v.isRead_ = v.isRead === "0" ? "未读" : "已读";
            });
            this.list = list;
            break;
        }
      });
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        default:
          this.selMod[key] = res.value;
      }
    },
    showErr(text, j) {
      this.$store.commit("alertFn", {
        type: "error",
        text: text,
      });
      j
        ? (this.$store.dispatch("getCount"),
          this.getList(this.page),
          this.$pubfunc.delSStorage("proMsg"))
        : null;
      return false;
    },
    tableOper(key, item) {
      switch (key) {
        case "select":
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
        case "view":
          let json = item.ext;
          switch (json.type) {
            case "11":
              this.$api.service.message.read({ msgList: [item.mid] });
              this.$store.dispatch("getCount")
              this.$api.service.myApproval.getDetail(
                { taskId: json.taskId },
                (res) => {
                  if (res.code == "0") {
                    if (res.data.processStatus != "5") {
                      this.$router.push({
                        name: "myapprove",
                        params: { taskId: json.taskId },
                      });
                    } else {
                      this.$message({
                        message: "该流程已撤回！",
                        type: "error",
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 2500);
                    }
                  } else {
                    this.$message({
                      message: res.message,
                      type: "error",
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 2500);
                  }
                }
              );
              break;
            case "12":
              this.$api.service.message.read({ msgList: [item.mid] });
              this.$store.dispatch("getCount")
              this.$router.push({
                name: "myapply",
                params: { processId: json.processId },
              });
              break;
            case "13":
              this.$api.service.message.read({ msgList: [item.mid] });
              this.$store.dispatch("getCount")
              this.$api.service.myApply.getDetail(
                { processId: json.processId },
                (res) => {
                  console.log(res);
                  if (res.code == "0") {
                    if (res.data.processStatus != "5") {
                      this.$router.push({
                        name: "myapply",
                        params: { processId: json.processId },
                      });
                    } else {
                      this.$message({
                        message: "该流程已撤回！",
                        type: "error",
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 2500);
                    }
                  } else {
                    this.$message({
                      message: res.message,
                      type: "error",
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 2500);
                  }
                }
              );
              break;
            case "14":
            case "16":
              this.$api.service.message.read({ msgList: [item.mid] });
              this.$store.dispatch("getCount")
              item.ext.type = "apply";
              item.ext.isEdit = false;
              this.$router.push({
                path: "/myapply/resourceProcess",
                query: item.ext,
              });
              break;
            case "15":
              this.$api.service.message.read({ msgList: [item.mid] });
              this.$store.dispatch("getCount")
              item.ext.type = "approval";
              item.ext.isEdit = false;
              this.$router.push({
                path: "/myapprove/resourceProcess",
                query: item.ext,
              });
              break;
          }
          if (json.projId) {
            this.$api.service.message.read({ msgList: [item.mid] }, (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.$api.service[
                    json.projectObjType === "2" ? "IDCproject" : "project"
                  ][json.projectObjType === "2" ? "getDetail" : "detail"](
                    { projId: json.projId },
                    (res) => {
                      console.log(res.data);
                      console.log(json);
                      switch (res.code) {
                        case "0":
                          this.$pubfunc.setSStorage("proMsg", 1);
                          switch (json.type) {
                            case "1":
                              this.$store.dispatch("getCount")
                              var arr = [];
                              // console.log(res.data.preSale,this.userInfo.staffId)
                              for (const [k, v] of Object.entries(
                                res.data.difficultyList
                              )) {
                                for (const [ck, cv] of Object.entries(
                                  v.tecDifficultyList
                                )) {
                                  arr.push(cv.preSaleId);
                                }
                              }
                              if (
                                arr.every((item) => {
                                  return item !== this.userInfo.staffId;
                                })
                              ) {
                                return this.showErr(
                                  "您已不在该项目中，暂无权限操作",
                                  true
                                );
                              }
                              this.$router.push({
                                name: "projectView",
                                params: {
                                  tabChoose: 4,
                                  projId: this.$pubfunc.encode(json.projId),
                                },
                              });
                              break;
                            case "2":
                              this.$store.dispatch("getCount")
                              if (
                                res.data.difficultyList.every((item) => {
                                  return (
                                    item.technicalDirector !==
                                    this.userInfo.staffId
                                  );
                                })
                              ) {
                                return this.showErr(
                                  "您已不在该项目中，暂无权限操作",
                                  true
                                );
                              }
                              this.$router.push({
                                name: "projectView",
                                params: {
                                  tabChoose: 4,
                                  projId: this.$pubfunc.encode(json.projId),
                                },
                              });
                              break;
                            case "3":
                              this.$store.dispatch("getCount")
                              if (res.data.owner !== this.userInfo.staffId) {
                                return this.showErr(
                                  "您已不在该项目中，暂无权限操作",
                                  true
                                );
                              }
                              if (json.projectObjType === "2") {
                                this.$router.push({
                                  name: "IDCProjectView",
                                  params: {
                                    projId: this.$pubfunc.encode(json.projId),
                                  },
                                });
                              } else {
                                this.$router.push({
                                  name: "projectView",
                                  params: {
                                    projId: this.$pubfunc.encode(json.projId),
                                  },
                                });
                              }
                              break;
                            case "4":
                              this.$store.dispatch("getCount")
                              if (
                                !this.userInfo.isCharge ||
                                this.userInfo.depLevel.indexOf(this.special) ===
                                  -1 ||
                                res.data.commitStatus === "0"
                              ) {
                                return this.showErr(
                                  "您已不在该项目中，暂无权限操作",
                                  true
                                );
                              }
                              if (json.projectObjType === "2") {
                                this.$router.push({
                                  name: "IDCProjectEdit",
                                  params: {
                                    projId: this.$pubfunc.encode(json.projId),
                                  },
                                });
                              } else {
                                this.$router.push({
                                  name: "projectEdit",
                                  params: {
                                    projId: this.$pubfunc.encode(json.projId),
                                  },
                                });
                              }
                              break;
                          }
                          break;
                        default:
                          this.$store.dispatch("getCount")
                          this.showErr("您已不在该项目中，暂无权限操作", true);
                      }
                    }
                  );
                  break;
                default:
                  res.message ? this.showErr(res.message) : null;
              }
            });
          }
          break;
      }
    },
  },
  created() {
    this.tableOper("clear", null);
  },
  mounted() {
    this.$store.dispatch("getCount");
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
  width: calc(20% - 8px);
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
  height: calc(100% - 60px);
}
.formBox > div > div > div.input {
  white-space: nowrap;
  position: relative;
  border: 0;
  padding: 0;
}
.formBox > div > div > div.input > input,
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
}
.formBox > div > div > div.input > i:nth-last-child(1) {
  padding: 0 10px;
}
</style>
