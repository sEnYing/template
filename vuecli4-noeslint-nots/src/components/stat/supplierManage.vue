<template>
  <div class="supplierManage fillBox">
    <div class="boxTitle titleFix">
      <i class="dashboard_icon"></i><span>供应商管理仪表盘</span>
    </div>
    <div class="contentFix">
      <div class="boxRel behavior">
        <div class="loadingCont" v-if="loading">
          <unit-loading :loading="loading"></unit-loading>
        </div>
        <div class="formBox">
          <el-form :model="form" label-width="130px" ref="form">
            <el-form-item label="供应商名称：">
              <input
                v-setwidth
                class="input"
                type="text"
                v-model="form.supplierName"
                placeholder="全部"
              />
            </el-form-item>
            <el-form-item label="供应商评估等级：">
              <el-select v-model="form.assessLevel" clearable>
                <el-option
                  v-for="item in supplierLevel"
                  :key="item.levelId"
                  :label="item.levelValue"
                  :value="item.levelValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="btn">
              <unit-btn @click="tableOper('select')" text="查询"></unit-btn>
              <unit-btn
                type="plain"
                @click="tableOper('clear')"
                text="重置"
              ></unit-btn>
            </div>
          </el-form>
        </div>
        <div class="titleBox">
          <div class="title">
            <span>供应商评审汇总表：</span>
          </div>
          <div class="btn right">
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
                v-for="(i, k) in standardList"
                :key="k"
                :prop="i.standardId"
                :label="i.standardName"
                width="170"
                v-if="item.value === 'supplierScore'"
              >
                <template slot-scope="scope">
                  {{ scope.row[i.standardId] | emptyTxt }}
                </template>
              </el-table-column>
              <template slot-scope="scope">
                {{ scope.row[item.value] | emptyTxt }}
              </template>
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
export default {
  name: "suppliermanagement",
  data() {
    return {
      loading: false,
      ajaxIng: false,
      form: {
        supplierName: "",
        assessLevel: "",
      },
      supplierLevel: [],
      total: 0,
      page: 1,
      titleData: [
        {
          value: "supplierName",
          label: "供应商名称",
        },
        {
          value: "assessLevel",
          label: "供应商评估等级",
        },
        {
          value: "supplierScore",
          label: "供应商评审得分",
        },
        {
          value: "assessScore",
          label: "总分",
        },
      ],
      tableData: [],
      standardList: [],
    };
  },
  filters: {
    emptyTxt(v) {
      // console.log(v)
      return v ? v : "--";
    },
  },
  computed: {
    judgeBtn() {
      let json = {
          suppliermanagementExport: this.$pubfunc.judgeBtn(
            "suppliermanagement:export"
          ),
        },
        num = 1;
      json.suppliermanagementExport ? num++ : null;
      json.num = num;
      return json;
    },
  },
  methods: {
    tableOper(key) {
      switch (key) {
        case "select":
          this.getList(1);
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
          this.$api.download.exportSupplierAssess(params, (res) => {
            this.$pubfunc.downloadFile(
              res,
              "供应商评审汇总表" +
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
            supplierName: "",
            assessLevel: "",
          };
          this.tableOper("select");
          break;
      }
    },
    getList(page) {
      let params = { ...this.form };
      params.page = page;
      this.page = page;
      params.limit = 10;
      this.loading = true;
      this.$api.service.stat.supplierAssess(params, (res) => {
        this.loading = false;
        if (res.code === "0") {
          this.total = res.data.supplierList.length;
          let list = res.data.supplierList ? res.data.supplierList : [];
          this.tableData = list;
          for (const [index, value] of Object.entries(this.tableData)) {
            for (const [i, v] of Object.entries(value.scoreList)) {
              this.tableData[index][v.standardId] = v.standardScore;
            }
          }
          this.standardList = res.data.standardList
            ? res.data.standardList
            : [];
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
      this.$api.service.supplier.assessLevelDropDown({}, (res) => {
        switch (res.code) {
          case "0":
            this.supplierLevel = res.data ? res.data : [];
            break;
        }
      });
    },
    judgeShow(item, i, key) {
      switch (key) {
        case "export":
          return this.judgeBtn.suppliermanagementExport;
      }
    },
  },
  created() {
    this.getDict();
    this.getList(1);
  },
};
</script>

<style scoped lang="scss">
.supplierManage {
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
              .input {
                width: 80%;
              }
              .el-select {
                width: 80%;
                height: 32px;
                line-height: 32px;
                .el-input__suffix {
                  .el-input__icon {
                    line-height: 32px;
                    // &::before {
                    //   content: "";
                    //   width: 0;
                    //   height: 0;
                    //   border-left: 6px solid transparent;
                    //   border-right: 6px solid transparent;
                    //   border-bottom: 6px solid #95a0bd;
                    //   display: block;
                    //   position: absolute;
                    //   left: 50%;
                    //   top: 50%;
                    //   transform: translate(-50%, -50%);
                    // }
                  }
                }
              }
            }
          }
          .btn {
            width: 50%;
            text-align: right;
            .button {
              margin-right: 10px;
            }
            .button:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .titleBox {
        margin: 25px 0;
        height: 32px;
        line-height: 32px;
        & > * {
          display: inline-block;
        }
        .btn {
          .button {
            margin-right: 10px;
            width: 80px;
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
