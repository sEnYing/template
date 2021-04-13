<template>
  <div class="fillBox projectForm_">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i
      ><span>
        <unit-popover
          :content="data.projName ? data.projName : ''"
        ></unit-popover
        >{{ data.projName ? "（" + data.projScore + "分）" : "" }}
      </span>
      <unit-btn
        type="plain right"
        :text="name !== 'projectView' ? '取消' : '返回'"
        @click="judgeCancel"
      ></unit-btn>
      <unit-btn
        :type="name !== 'projectView' && !role ? 'right large' : 'right'"
        :loading="loading"
        :text="name !== 'projectView' ? (role ? '保存' : '保存本页') : '编辑'"
        @click="submit"
        v-if="
          !showChild &&
          (!role ||
            name === 'projectEdit' ||
            (role && data.staffRole !== 'check'))
        "
      ></unit-btn>
    </div>
    <div class="contentFix">
      <div class="topBox boxRound">
        <div>
          客户名称<span>
            <unit-popover
              :content="data.customerName ? data.customerName : ''"
            ></unit-popover>
          </span>
        </div>
        <div>
          <i class="nbsp"></i>项目金额（元）<span>{{
            $pubfunc.transformPrice(
              data.projAmount ? data.projAmount : "",
              true
            )
          }}</span>
        </div>
        <div>
          预计结案日期<span>{{
            $pubfunc.TimeTransform("YYYY年MM月DD日", data.planFinishTime)
          }}</span>
        </div>
        <div>
          项目类型<span>{{ data.projTypeTxt }}</span>
        </div>
        <div>
          销售<span>{{ data.ownerName }}</span>
        </div>
      </div>
      <div class="bottomBox smallBox">
        <unit-tab
          type="top"
          :tab="tab1"
          @click="returnBtn"
          v-if="tab1.list.length > 1"
        ></unit-tab>
        <div
          class="boxRound"
          :class="{
            smallPad:
              name === 'projectView' &&
              judgeBtn.visitrecord &&
              tab1.list.length > 1 &&
              tab1.choose === 2,
          }"
        >
          <ul class="projStatusBox" v-show="tab1.choose === 1">
            <li
              v-for="(item, i) in tab.list"
              :key="i"
              :class="{
                already: Number(item.id) <= Number(data.projStage),
                active: item.id === tab.choose,
                unable: item.id === '03' && data.buyType === '04',
              }"
              @click="dropdownReturn(item.id, 'tab')"
            >
              <span>{{ item.name }}<i></i></span><i></i>
            </li>
          </ul>
          <div
            class="boxRel projContentBox"
            :class="{ largeBox: this.tab.choose === '01' }"
            v-show="tab1.choose === 1"
          >
            <el-scrollbar class="unitScrollbar">
              <div class="loadingCont" v-if="loading">
                <unit-loading :loading="loading"></unit-loading>
              </div>
              <component
                :is="
                  'proj' +
                  (data.staffRole === 'isAdmin' && tab.choose === '01'
                    ? '01_'
                    : tab.choose)
                "
                @loadingfn="loadingChange"
                :data="data ? data : { userInfo }"
                :loading="loading"
                :name="name"
                :role="role"
                :dom="dom"
                v-show="!loading"
                v-if="!showChild && data.projId && tab.choose"
                @dialog="showDialog"
                ref="children"
              ></component>
            </el-scrollbar>
          </div>
          <div
            class="boxTable"
            v-show="tab1.choose === 2"
            v-if="
              name === 'projectView' &&
              judgeBtn.visitrecord &&
              tab1.list.length > 1
            "
          >
            <unit-loading :loading="loading1" v-if="loading1"></unit-loading>
            <unit-table
              :total="total"
              :limit="7"
              :page="page"
              v-if="!loading1 || list.length > 0"
              :list="list"
              :title="userInfo.isCharge === '1' ? title1 : title"
              :operation="[{ key: 'view', show: judgeShow }]"
              @click="tableOper"
            ></unit-table>
            <unit-page
              :total="total"
              :limit="7"
              :page="page"
              @pagechange="getList"
            ></unit-page>
          </div>
          <div
            class="boxTable boxTableScroll"
            style="overflow: auto; margin-top: -40px"
            v-show="tab1.choose === 3"
          >
            <presale-expenses
              :data="data"
              :name="name"
              ref="tabChoose3"
              @success="getDropData"
            ></presale-expenses>
          </div>
          <div
            class="boxTable boxTableScroll"
            style="overflow: auto; margin-top: -40px"
            v-show="tab1.choose === 4"
          >
            <difficulty-description
              :data="data"
              :name="name"
              ref="tabChoose4"
              @getList="getDropData"
            ></difficulty-description>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitPopover from "@/unit/components/popover";
import unitTab from "@/unit/components/tab";
import unitTable from "@/unit/components/element/tableScroll";
export default {
  name: "projectForm",
  props: ["dom"],
  components: {
    unitPopover,
    unitTab,
    unitTable,
    proj01: (resolve) => require(["./approval"], resolve), //立项
    proj01_: (resolve) => require(["./approval_isAdmin"], resolve), //立项
    proj02: (resolve) => require(["./require"], resolve), //需求确认
    proj03: (resolve) => require(["./tender"], resolve), //投标
    proj04: (resolve) => require(["./sign"], resolve), //签单
    presaleExpenses: (resolve) =>
      require(["./components/presaleExpenses"], resolve), //预留/实际项目售前费用
    difficultyDescription: (resolve) =>
      require(["./components/difficultyDescription"], resolve), //项目售前技术评估
  },
  data() {
    return {
      role: false,
      name: null,
      reportId: null,
      nameChange: false,
      error: {
        key: null,
        msg: "",
      },
      tab: {
        list: [],
        choose: "",
      },
      baseData: null,
      data: {},
      showChild: true,
      loading: true,
      reset: false,
      tab1: {
        list: [{ id: 1, name: "项目信息" }],
        choose: 1,
      },
      title: [
        { key: "dateTime_", name: "拜访时间", width: 22 },
        { key: "contactName", name: "拜访对象", width: 17 },
        { key: "visitTypeTxt", name: "拜访方式", width: 17 },
        { key: "description", name: "拜访情况说明", width: 42 },
      ],
      title1: [
        { key: "dateTime_", name: "拜访时间", width: 20 },
        { key: "contactName", name: "拜访对象", width: 15 },
        { key: "visitTypeTxt", name: "拜访方式", width: 15 },
        { key: "creatorName", name: "销售", width: 15 },
        { key: "description", name: "拜访情况说明", width: 35 },
      ],
      list: [],
      loading1: true,
      total: 0,
      page: 1,
    };
  },
  filters: {
    emptyTxt(v) {
      return v ? v : "--";
    },
  },
  provide() {
    return {
      cancel: this.judgeCancel,
    };
  },
  computed: {
    special() {
      return this.$store.state.special.depLevel;
    },
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
      return {
        projectUpdate: this.$pubfunc.judgeBtn("project:update"),
        projectView: this.$pubfunc.judgeBtn("project:view"),
        projectCommit: this.$pubfunc.judgeBtn("project:commit"),
        projectTecd: this.$pubfunc.judgeBtn("project:tecdifficulty"),
        projectFeas: this.$pubfunc.judgeBtn("project:feasibility"),
        visitrecord: this.$pubfunc.judgeBtn("visitrecord"),
      };
    },
  },
  methods: {
    judgeShow(item, i, key) {
      return true;
    },
    showDialog(data) {
      // console.log(data)
      this.$emit("dialog", data);
    },
    emptyTxt(v) {
      return v ? v : "--";
    },
    getDropData() {
      let staffRoleFn = (userInfo, data, judgeBtn) => {
        let staffId = userInfo.staffId;
        let proMsg = this.$pubfunc.getSStorage("proMsg");
        proMsg ? (proMsg = Number(proMsg)) : null;
        if (userInfo.isAdmin === "1") {
          return "isAdmin";
        }
        if (data.preSale === staffId && judgeBtn.projectTecd) {
          return "preSale";
        }
        if (data.tecDirector === staffId && judgeBtn.projectFeas) {
          return "tecDirector";
        }
        if (
          proMsg === 1 &&
          userInfo.isCharge === "1" &&
          userInfo.depLevel.indexOf(this.special) > -1 &&
          judgeBtn.projectCommit
        ) {
          return "isCharge";
        }
        if (
          userInfo.isCharge === "1" &&
          userInfo.depLevel.indexOf(this.special) > -1 &&
          judgeBtn.projectCommit
        ) {
          if (data.commitStatus === "1") {
            return "isCharge";
          } else if (!(data.owner === staffId)) {
            return "check";
          }
        }
        if (data.owner === staffId) {
          return "onlySelf";
        }
        return "check";
      };
      this.tab.list && this.tab.list.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: "proj_stage", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  let list = [];
                  (res.data ? res.data : []).map((v) => {
                    list.push({ id: v.value, name: v.label });
                  });
                  this.tab.list = list;
                  this.tab.choose = list[0].id;
                  break;
              }
            }
          );
      this.$api.service.project.detail({ projId: this.projId }, (res) => {
        console.log(res);
        this.showChild = false;
        this.loading = false;
        switch (res.code) {
          case "0":
            let staffId = this.userInfo.staffId;
            this.data = res.data;
            // console.log(this.data);
            this.data.userInfo = this.userInfo;
            this.role =
              this.userInfo.staffId !== this.data.owner &&
              this.userInfo.isAdmin != "1"
                ? true
                : false;
            // console.log(this.role,this.judgeBtn.projectCommit)
            // if(this.role&&!this.judgeBtn.projectCommit){
            //     this.cancel();
            //     return
            // }
            let staffRole = staffRoleFn(this.userInfo, res.data, this.judgeBtn);
            if (
              !staffRole ||
              (staffRole === "check" && this.name === "projectEdit")
            ) {
              this.cancel();
              return;
            }
            // console.log(staffRole)
            this.data.staffRole = staffRole;
            let url = res.data.orgStructurePath;
            url
              ? this.$api.public.getImg({ filePath: url }, (res) => {
                  let typeArr = url.split(".");
                  let src =
                    "data:image/" +
                    typeArr[typeArr.length - 1] +
                    ";base64," +
                    res.data;
                  this.$set(this.data, "src", src);
                })
              : null;
            this.name === "projectView"
              ? this.$api.service.project.updatefielddetail(
                  { projId: this.projId },
                  (res) => {
                    // console.log(res)
                    switch (res.code) {
                      case "0":
                        let updatefielddetail = res.data;
                        this.data.projStatusReason &&
                        updatefielddetail.projStatus &&
                        updatefielddetail.projStatus.length > 0
                          ? updatefielddetail.projStatus.splice(0, 0, {
                              alterField: "projStatus",
                              alterFieldName: "项目状态",
                              modifyReason: this.data.projStatusReason,
                              newValue:
                                updatefielddetail.projStatus[0].oldValue,
                              oldValue: null,
                              recordId: null,
                              updateTime: this.data.createTime,
                              updateUser: this.data.owner, //creator
                              updateUsername: this.data.ownerName,
                            })
                          : null;
                        this.$set(
                          this.data,
                          "updatefielddetail",
                          updatefielddetail
                        );
                        // console.log(updatefielddetail)
                        break;
                      default:
                    }
                  }
                )
              : null;
            break;
          default:
            res.message
              ? this.$store.commit("alertFn", {
                  type: "error",
                  text: res.message,
                  func: () => {
                    this.$router.push("/");
                  },
                })
              : this.$router.push("/");
        }
      });
    },
    dropdownReturn(res, key) {
      this.clearErr(key);
      switch (key) {
        case "tab":
          if (
            this.tab.choose === res ||
            Number(res) > Number(this.data.projStage) ||
            (res === "03" && this.data.buyType === "04")
          ) {
            return;
          }
          this.name === "projectView"
            ? (this.tab.choose = res)
            : this.$refs.children.submit(() => {
                this.getDropData();
                this.tab.choose = res;
              });
          break;
        default:
          this.result[key] = res.value;
      }
    },
    loadingChange(j) {
      this.loading = j;
      // console.log(this.loading)
    },
    setErr(key, text) {
      this.$store.commit("alertFn", {
        type: "error",
        text: "保存失败，请修改对应的错误内容",
        time: 2000,
      });
      this.error.key = key;
      this.error.msg = text;
      return false;
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null;
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key]);
      }
    },

    submit() {
      // console.log(this.name);
      if (this.name === "projectView") {
        this.nameChange = true;
        this.judgeBtn.visitrecord && this.tab1.list.length > 1
          ? this.tab1.list.splice(1, 3)
          : null;
        this.tab1.choose = 1;
        // this.$router.push({name:'projectEdit',params:{projId:this.$pubfunc.encode(this.projId)}});
        this.name = "projectEdit";
        this.getDropData();
      } else {
        if (this.tab1.choose == 1) {
          this.$refs.children.submit();
        } else if (this.tab1.choose == 3) {
          this.$refs.tabChoose3.submit();
        } else if (this.tab1.choose == 4) {
          this.$refs.tabChoose4.submit();
        }
      }
    },
    judgeCancel(j) {
      this.nameChange
        ? ((this.nameChange = false),
          (this.name = "projectView"),
          this.getDropData(),
          this.judgeBtn.visitrecord
            ? this.userInfo.resourceType === "06" ||
              this.userInfo.resourceType === "08"
              ? this.tab1.list.splice(
                  1,
                  0,
                  { id: 2, name: "拜访记录" },
                  { id: 4, name: "项目售前技术评估" }
                )
              : this.tab1.list.splice(
                  1,
                  0,
                  { id: 2, name: "拜访记录" },
                  { id: 3, name: "项目售前费用" },
                  { id: 4, name: "项目售前技术评估" }
                )
            : null)
        : this.cancel(j);
    },
    cancel(j) {
      if (j) {
        this.$router.push({
          name: "projectView",
          params: { projId: this.$pubfunc.encode(this.projId) },
        });
        this.name = "projectView";
        this.judgeBtn.visitrecord
          ? this.tab1.list.splice(1, 0, { id: 2, name: "拜访记录" })
          : null;
        this.getDropData();
        j === true ? null : j();
        return;
      }
      let proMsg = this.$pubfunc.getSStorage("proMsg");
      proMsg ? (proMsg = Number(proMsg)) : null;
      let name =
        proMsg === 1
          ? "message"
          : proMsg === 2
          ? "salesfunnel"
          : proMsg === 3
          ? "salesperformance"
          : null;
      this.$router.push({ name: name ? name : "project" });
    },
    returnBtn(type, k) {
      switch (type) {
        case "tab":
          this.tab1.choose = k;
          k === 2 ? this.getList(1) : null;
          break;
      }
    },
    getList(page) {
      this.page = page;
      let param = {
        projId: this.projId,
      };
      param.limit = 7;
      param.page = page;
      // console.log(param)
      if (!this.userInfo.isCharge) {
        delete param.staffName;
      }
      this.loading1 = true;
      this.$api.service.visit.recordList(param, (res) => {
        // console.log(res)
        this.loading1 = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              v.dateTime_ =
                this.$pubfunc.TimeTransform("YYYY年MM月DD日", v.date) +
                " " +
                this.$pubfunc.transTime(v.time);
            });
            this.list = list;
            break;
        }
      });
    },
    tableOper(key, item) {
      // console.log(key, item)
      switch (key) {
        case "view":
          item.recordId
            ? this.$emit("dialog", {
                show: true,
                link: "showVisit",
                small: true,
                title: "查看拜访记录",
                data: item,
              })
            : null;
          break;
      }
    },
  },
  created() {
    // console.log(this.$route)
    if (!this.$route.params.projId && !this.$route.query.projId) {
      this.cancel();
      return;
    }
    this.name = this.$route.name;
    this.projId = this.$route.params.projId
      ? this.$pubfunc.decode(this.$route.params.projId)
      : null;
    switch (this.name) {
      case "projectEdit":
        if (!this.judgeBtn.projectUpdate) {
          this.cancel();
          return;
        }
        break;
      case "projectView":
        this.judgeBtn.visitrecord
          ? this.tab1.list.splice(1, 0, { id: 2, name: "拜访记录" })
          : null;
    }
    if (
      this.userInfo.resourceType === "06" ||
      this.userInfo.resourceType === "08"
    ) {
      this.tab1.list.push({ id: 4, name: "项目售前技术评估" });
    } else if (
      this.userInfo.resourceType === "01" ||
      this.userInfo.resourceType === "02" ||
      this.userInfo.resourceType === "05" ||
      this.userInfo.resourceType === "07" ||
      this.userInfo.resourceType === "11" ||
      this.userInfo.isAdmin === "1"
    ) {
      this.tab1.list.push(
        { id: 3, name: "项目售前费用" },
        { id: 4, name: "项目售前技术评估" }
      );
    }
    if (this.$route.params && this.$route.params.tabChoose) {
      this.tab1.choose = this.$route.params.tabChoose;
    }
    this.getDropData();
  },
};
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
  content: "";
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
  content: "";
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
  content: "";
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
  content: "";
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
.fillBox .boxTable.boxTableScroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.fillBox .boxTable.boxTableScroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ddd;
}
.fillBox .boxTable.boxTableScroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
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