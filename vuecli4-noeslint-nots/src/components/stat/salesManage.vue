<template>
  <div class="salesManage fillBox">
    <div class="boxTitle titleFix">
      <i class="dashboard_icon"></i><span>销售管理仪表盘</span>
    </div>
    <div class="contentFix">
      <div class="boxRel behavior">
        <div class="loadingCont" v-if="loading">
          <unit-loading :loading="loading"></unit-loading>
        </div>
        <div class="formBox">
          <el-form :model="form" label-width="100px" ref="form">
            <el-form-item label="项目名称：">
              <!-- <unit-project
                id="projId"
                placeholder
                @change="dropdownReturn"
                :clear="true"
                :input="true"
                :result="form.projName"
              ></unit-project> -->
              <input
                v-setwidth
                class="input"
                type="text"
                v-model="form.projName"
                placeholder="全部"
              />
            </el-form-item>
            <el-form-item label="客户名称：">
              <!-- <unit-customer
                id="customerId"
                placeholder
                @change="dropdownReturn"
                :input="true"
                :result="form.customerName"
                :showfirst="true"
              ></unit-customer> -->
              <input
                v-setwidth
                class="input"
                type="text"
                v-model="form.customerName"
                placeholder="全部"
              />
            </el-form-item>
            <el-form-item label="销售：">
              <unit-dropdown
                v-setwidth
                id="owner"
                class="auto"
                placeholder="全部"
                :list="ownerList"
                @change="dropdownReturn"
                :result="form.owner"
                :clear="true"
                :reset="reset"
                :input="true"
              ></unit-dropdown>
            </el-form-item>
            <el-form-item label="分子公司/所属部门：" label-width="150px">
              <unit-tree
                id="depId"
                class="auto"
                v-setwidth
                :list="depList"
                :hid="hideTree"
                @click="hideOther"
                placeholder="全部"
                @return="dropdownReturn"
                :hidedisable="true"
                :only="true"
                :expendclick="false"
                keyid="depId"
                :clear="true"
                :must="false"
                ref="unitTree"
              ></unit-tree>
            </el-form-item>
            <el-form-item label="项目类型：">
              <el-select v-model="form.projType">
                <el-option
                  v-for="item in projType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目阶段：">
              <el-select v-model="form.projStage">
                <el-option
                  v-for="item in projStage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目状态：">
              <el-select v-model="form.projStatus">
                <el-option
                  v-for="item in projStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计结案日期：" label-width="150px">
              <unit-time
                placeholder=""
                :value="form.planFinishTime"
                id="planFinishTime"
                @return="dropdownReturn"
                :clear="true"
                ref="unitTime"
              ></unit-time>
            </el-form-item>
          </el-form>
        </div>
        <div class="titleBox">
          <div class="title">
            <span>项目售前费用汇总表：</span>
          </div>
          <div class="btn right">
            <unit-btn @click="tableOper('select')" text="查询"></unit-btn>
            <unit-btn
              type="plain"
              @click="tableOper('clear')"
              text="重置"
            ></unit-btn>
            <unit-btn
              @click="tableOper('export')"
              v-if="judgeShow('', '', 'export')"
              text="导出"
            ></unit-btn>
          </div>
        </div>
        <div class="tableBox">
          <el-table
            :data="tableData"
            :header-cell-style="{
              background: 'rgba(241,244,251,1)',
              color: '#5D6680',
            }"
          >
            <el-table-column
              v-for="(item, index) in titleData"
              :key="index"
              :prop="item.value"
              :label="item.label"
              :width="item.width"
              align="center"
              show-overflow-tooltip
            >
              <el-table-column
                prop="reserveLaborDays"
                label="预留售前工作人天"
                width="150"
                v-if="item.value === 'reserve'"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.reserveLaborDays, true)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="reserveLaborCost"
                label="预留项目售前人工费用合计"
                width="190"
                v-if="item.value === 'reserve'"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.reserveLaborCost, true)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="reserveTravelExpense"
                label="预留项目售前差旅费用合计"
                v-if="item.value === 'reserve'"
                width="190"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(
                      scope.row.reserveTravelExpense,
                      true
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="reservePreSaleCost"
                label="预留项目售前费用合计"
                v-if="item.value === 'reserve'"
                width="190"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.reservePreSaleCost, true)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="actualLaborDays"
                label="实际售前工作人天"
                v-if="item.value === 'actual'"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="negotiateLaborCost"
                label="协商后售前人工费用"
                v-if="item.value === 'actual'"
                width="150"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.negotiateLaborCost, true)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="actualTravelExpense"
                label="实际售前差旅费用"
                v-if="item.value === 'actual'"
                width="150"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.actualTravelExpense, true)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="actualPreSaleCost"
                label="实际项目售前费用合计"
                v-if="item.value === 'actual'"
                width="180"
              >
                <template slot-scope="scope">
                  {{
                    $pubfunc.transformPrice(scope.row.actualPreSaleCost, true)
                  }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <unit-page
            :total="total"
            :page="page"
            @pagechange="getList"
          ></unit-page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitTime from "@/unit/components/element/timeRange";
import unitCustomer from "@/unit/components/thisUnit/customer";
import unitProject from "@/unit/components/thisUnit/project";
import unitTree from "@/unit/components/element/tree";
export default {
  name: "salesmanagement",
  props: ["dom"],
  components: {
    unitTime,
    unitCustomer,
    unitProject,
    unitTree,
  },
  computed: {
    judgeBtn() {
      let json = {
          salesmanagementExport: this.$pubfunc.judgeBtn(
            "salesmanagement:export"
          ),
        },
        num = 1;
      json.salesmanagementExport ? num++ : null;
      json.num = num;
      return json;
    },
  },
  data() {
    return {
      form: {
        projName: "",
        customerName: "",
        owner: "",
        depId: "",
        projType: "",
        projStatus: "",
        projStage: "",
        planFinishTimeStart: "",
        planFinishTimeEnd: "",
      },
      loading: false,
      sales: [],
      projType: [],
      projStage: [],
      projStatus: [],
      depList: [],
      ownerList: [],
      reset: true,
      hideTree: false,
      tableData: [
      ],
      titleData: [
        {
          value: "saleName",
          label: "销售员",
        },
        {
          value: "branchCompanyName",
          label: "子公司",
          width: "150",
        },
        {
          value: "projNo",
          label: "项目编号",
          width: "150",
        },
        {
          value: "projName",
          label: "项目名称",
          width: "150",
        },
        {
          value: "customerName",
          label: "客户名称",
          width: "120",
        },
        {
          value: "projAmount",
          label: "项目金额",
          width: "110",
        },
        {
          value: "projTypeTxt",
          label: "项目类型",
        },
        {
          value: "projStageTxt",
          label: "项目阶段",
        },
        {
          value: "projStatusTxt",
          label: "项目状态",
        },
        {
          value: "projStatusReason",
          label: "项目延期原因",
          width: "200",
        },
        {
          value: "planFinishTime",
          label: "预计结案日期",
          width: "120",
        },
        {
          value: "createTime",
          label: "立项时间",
          width: "150",
        },
        {
          value: "createDuration",
          label: "立项时长（天）",
          width: "120",
        },
        {
          value: "applyNo",
          label: "项目资源及费用申请单号",
          width: "180",
        },
        {
          value: "reserve",
          label: "预留项目售前费用",
        },
        {
          value: "actual",
          label: "实际项目售前费用",
        },
        {
          value: "reserveBalance",
          label: "预留费用余额",
          width: "120",
        },
        {
          value: "preSaleName",
          label: "售前工程师",
          width: "150",
        },
        {
          value: "remark",
          label: "备注",
        },
      ],
      ajaxIng: false,
      loading: false,
      total: 0,
      page: 1,
    };
  },
  methods: {
    dropdownReturn(res, key, judge) {
      switch (key) {
        case "projId":
          break;
        case "customerId":
          break;
        case "depId":
          this.form.depId = res[0].depId;
          break;
        case "planFinishTime":
          this.form.planFinishTimeStart = this.$pubfunc.TimeTransform(
            "YYYY/MM/DD",
            res[0]
          );
          this.form.planFinishTimeEnd = this.$pubfunc.TimeTransform(
            "YYYY/MM/DD",
            res[1]
          );
          break;
        default:
          this.form[key] = res.value;
      }
    },
    tableOper(key) {
      switch (key) {
        case "select":
          this.getList();
          break;
        case "export":
          if (this.ajaxIng) {
            this.$store.commit("alertFn", {
              type: "warning",
              text: "正在导出报表，请稍后",
            });
            return;
          }
          let params = { ...this.form };
          this.ajaxIng = true;
          this.$api.download.projResourceExport(params, (res) => {
            this.$pubfunc.downloadFile(
              res,
              "项目售前费用汇总表" +
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
        case "clear":
          this.form = {
            projName: "",
            customerName: "",
            owner: "",
            depId: "",
            projType: "",
            projStatus: "",
            projStage: "",
            planFinishTimeStart: "",
            planFinishTimeEnd: "",
          };
          this.$refs.unitTree.clearRes();
          this.$refs.unitTime.res = [];
          this.tableOper("select");
          break;
      }
    },
    judgeShow(item, i, key) {
      switch (key) {
        case "export":
          console.log(this.judgeBtn);
          return this.judgeBtn.salesmanagementExport;
      }
    },
    hideOther(j) {
      this.hideTree = j ? j : false;
    },
    getList(page) {
      let params = { ...this.form };
      params.page = page;
      this.page = page;
      params.limit = 10;
      this.loading = true;
      this.$api.service.stat.projResourceDetail(params, (res) => {
        this.loading = false;
        if (res.code === "0") {
          this.total = res.data.total;
          let list = res.data.list ? res.data.list : [];
          var reserveBalance
          for (const [k, v] of Object.entries(list)) {
            reserveBalance = this.$pubfunc.transformPrice(
              v.reserveBalance,
              true
            );
            if(Number(v.reserveBalance)<0) {
              reserveBalance = `-${reserveBalance}`
            }
            v.reserveBalance = reserveBalance
            v.projAmount = this.$pubfunc.transformPrice(v.projAmount, true);
          }
          this.tableData = list;
        } else {
          res.message
            ? this.$store.commit("alertFn", {
                text: res.message,
                type: "error",
              })
            : null;
        }
      });
    },
    getDict() {
      this.$api.public.dict({ codeGroup: "proj_type", pCode: "" }, (res) => {
        switch (res.code) {
          case "0":
            this.projType = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.dict({ codeGroup: "proj_stage", pCode: "" }, (res) => {
        switch (res.code) {
          case "0":
            this.projStage = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.depmgnt((res) => {
        switch (res.code) {
          case "0":
            this.depList = res.data ? res.data : [];
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
  },
  created() {
    this.getDict();
    this.getList(1);
  },
};
</script>

<style scoped lang="scss">
.salesManage {
  .contentFix {
    .boxRel {
      overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 9px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background: #dddee0;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
        border-radius: 10px;
        background: #fff;
      }
      .formBox {
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 25%;
            height: 32px;
            line-height: 32px;
            /deep/ .el-form-item__label {
              height: 32px;
              line-height: 32px;
            }
            /deep/ .el-form-item__content {
              vertical-align: middle;
              height: 32px;
              line-height: 32px;
              .elDropdown {
                width: 80%;
                height: 32px;
                line-height: 32px;
                .el-select {
                  width: 100%;
                }
              }
              .input {
                width: 80%;
              }
              .newTree {
                width: 100%;
                height: 32px;
                line-height: 32px;
              }
              .elTimebox {
                width: 100%;
                height: 32px;
                line-height: 32px;
              }
              .el-select {
                width: 80%;
                height: 32px;
                line-height: 32px;
                .el-input__suffix {
                  .el-input__icon {
                    line-height: 32px;
                    &::before {
                      content: "";
                      width: 0;
                      height: 0;
                      border-left: 6px solid transparent;
                      border-right: 6px solid transparent;
                      border-bottom: 6px solid #95a0bd;
                      display: block;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                    }
                  }
                }
              }
            }
          }
        }
      }
      .titleBox {
        margin-bottom: 25px;
        & > * {
          display: inline-block;
        }
        .btn {
          .button {
            margin-right: 10px;
          }
          .button:last-child {
            margin-right: 0;
          }
        }
      }
      .tableBox {
        .el-table {
          /deep/ tr {
            th {
              padding: 0;
            }
          }
          /deep/ .el-table__body-wrapper {
            padding-top: 48px;
            td {
              height: 40px;
              line-height: 40px;
            }
          }
        }
      }
      .pageBox {
        margin-top: 16px;
        /deep/ .el-pagination {
          position: relative;
        }
      }
    }
  }
}
</style>