<template>
  <div class="projectResource fillBox">
    <div class="boxTitle titleFix">
      <i class="customer_icon"></i>
      <span>项目资源及费用管理</span>
      <unit-btn
        type="large right"
        text="批量导出"
        @click="tableOper('export', null)"
        v-if="true"
      ></unit-btn>
      <!-- <unit-btn
        type="large right"
        text="批量导入"
        @click="tableOper('transfers', null)"
        v-if="true"
      ></unit-btn>
      <unit-btn
        type="large right"
        text="模板下载"
        @click="tableOper('template', null)"
        v-if="true"
      ></unit-btn> -->
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="项目名称">
              <unit-dropdown
                v-setwidth
                id="projectName"
                class="auto"
                placeholder="全部"
                :list="projectName"
                @change="dropdownReturn"
                :clear="true"
                :result="form.projectName"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="项目类型">
              <unit-dropdown
                v-setwidth
                id="projectType"
                class="auto"
                placeholder="全部"
                :list="projectType"
                @change="dropdownReturn"
                :clear="true"
                :result="form.projectType"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="项目状态">
              <unit-dropdown
                v-setwidth
                id="projectStatus"
                class="auto"
                placeholder="全部"
                :list="projectStatus"
                @change="dropdownReturn"
                :clear="true"
                :result="form.projectStatus"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="项目金额(元)">
              <input
                v-setwidth
                type="text"
                v-model="form.projectMoney"
                placeholder="全部"
                @keydown.enter="tableOper('select', null)"
              />
            </el-form-item>
            <el-form-item label="分子公司/所属部门" label-width="150px">
              <unit-dropdown
                v-setwidth
                id="department"
                class="auto"
                placeholder="全部"
                :list="department"
                @change="dropdownReturn"
                :clear="true"
                :result="form.department"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="项目阶段">
              <unit-dropdown
                v-setwidth
                id="projecStage"
                class="auto"
                placeholder="全部"
                :list="projecStage"
                @change="dropdownReturn"
                :clear="true"
                :result="form.projecStage"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="审批编码">
              <input
                v-setwidth
                type="text"
                v-model="form.code"
                placeholder="全部"
                @keydown.enter="tableOper('select', null)"
              />
            </el-form-item>
            <el-form-item label="审批状态">
              <unit-dropdown
                v-setwidth
                id="approvalStatus"
                class="auto"
                placeholder="全部"
                :list="approvalStatus"
                @change="dropdownReturn"
                :clear="true"
                :result="form.approvalStatus"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="销售">
              <unit-dropdown
                v-setwidth
                id="sale"
                class="auto"
                placeholder="全部"
                :list="sale"
                @change="dropdownReturn"
                :clear="true"
                :result="form.sale"
                :reset="reset"
              ></unit-dropdown>
            </el-form-item>
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
          </el-form>
          <div class="boxTable">
            <unit-loading :loading="loading" v-if="loading"></unit-loading>
            <unit-table
              :total="total"
              :page="page"
              v-if="!loading || list.length > 0"
              :list="list"
              :opern="judgeBtn.num"
              :title="title"
              ref="table"
              :operation="[
                { key: 'view', show: judgeShow },
                { key: 'revise', show: judgeShow },
                { key: 'addResource', show: judgeShow },
                {
                  key: 'delete',
                  show: judgeShow,
                  class: () => {
                    return 'redbtn';
                  },
                },
              ]"
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
export default {
  name: "resource",
  components: { unitTable },
  data() {
    return {
      form: {
        projectName: "",
        projectType: "",
        projectStatus: "",
        projectMoney: "",
        department: "",
        projecStage: "",
        code: "",
        approvalStatus: "",
        sale: "",
      },
      projectName: [],
      projectType: [],
      projectStatus: [],
      department: [],
      projecStage: [],
      approvalStatus: [],
      sale: [],
      reset: true,
      loading: false,
      ajaxIng: false,
      title: [
        { key: "customerName", name: "标题", width: 18 },
        { key: "projName", name: "项目名称", width: 18 },
        { key: "projTypeTxt", name: "项目类型", width: 14 },
        { key: "projAmount", name: "项目金额(元)", width: 14 },
        { key: "reserveLaborCost", name: "预留售前人工费用", width: 12 },
        { key: "reserveTravelExpense", name: "预留售前差率费用", width: 12 },
        { key: "negotiateLaborCost", name: "协商后售前人工费用", width: 14 },
        { key: "actualTravelExpense", name: "实际售前差旅费用", width: 16 },
      ],
      list: [],
      total: 0,
      page: 1,
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
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === "1";
      return { isCharge, staffId, isAdmin, userInfo };
    },
    judgeBtn() {
      let json = {},
        num = 5;
      json.num = num;
      return json;
    },
  },
  methods: {
    dropdownReturn() {},
    tableOper(key, item) {
      switch (key) {
        case "select":
          this.$store.commit("searchConditionFn", this.form);
          this.getList(1);
          break;
        case "clear":
          for (let k in this.form) {
            this.form[k] = "";
          }
          this.reset = !this.reset;
          this.tableOper("select", null);
          break;
        case "addResource":
          this.$router.push({ path: "addResource", query: item });
          break;
        case "view":
          this.$router.push({ path: "resourceDetail", query: item });
          break;
        case "export":
          if (this.ajaxIng) {
            this.$store.commit("alertFn", {
              type: "warning",
              text: "正在导出报表，请稍后",
            });
            return;
          }
          this.ajaxIng = true;
          var url = [];
          for (let k in this.form) {
            if (this.form[k]) {
              url.push(k + "=" + this.form[k]);
            }
          }
          this.$pubfunc.downloadFile(
            `/api/sysservice/projectmonitor/projAcutalHoursExport?${url.join(
              "&"
            )}`,
            "",
            "url"
          );
          break;
      }
    },
    getList(page) {
      this.$store.commit("pageFn", { page: page, limit: 10 });
      this.page = page;
      let param = { ...this.form };
      param.limit = 10;
      param.page = page;
      this.loading = true;
      this.$api.service.project.getList(param, (res) => {
        this.loading = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              v.createTime_ = this.$pubfunc.TimeTransform(
                "YYYY年MM月DD日",
                v.createTime
              );
              v.region =
                (v.provinceName ? v.provinceName : "") +
                (v.provinceName && v.cityName ? "/" : "") +
                (v.cityName ? v.cityName : "");
            });
            this.list = list;
            break;
        }
      });
    },
    judgeShow(item, i, key) {
      switch (key) {
        case "view":
          return true;
        case "revise":
          return true;
        case "addResource":
          return true;
        case "delete":
          return true;
      }
    },
  },
  created() {
    this.reset = !this.reset;
    this.form = this.$store.state.searchCondition;
    this.getList(this.$store.state.page.page);
  },
};
</script>

<style scoped lang="scss">
.projectResource {
  .contentFix {
    .boxRel {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        margin-top: 12px;
        .el-form-item {
          width: 20%;
          margin-bottom: 16px;
          /deep/ .el-form-item__label {
            line-height: 32px;
          }
          /deep/ .el-form-item__content {
            height: 32px;
            line-height: 32px;
            .elDropdown {
              width: 100% !important;
            }
            input {
              width: 100% !important;
            }
          }
        }
        .btnBox {
          width: 20%;
          text-align: right;
        }
      }
    }
  }
}
.fillBox .boxTable {
  height: calc(100% - 108px);
}
</style>