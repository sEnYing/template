<template>
  <div class="config fillBox">
    <div class="boxTitle titleFix">
      <i class="supplier_icon"></i><span>供应商评审标准配置</span>
      <unit-btn type="large right plain" text="返回" @click="cancel"></unit-btn>
      <unit-btn
        type="large right plain"
        text="取消"
        @click="clear"
        v-show="isEdit"
      ></unit-btn>
      <unit-btn
        type="large right"
        text="编辑"
        @click="edit"
        v-show="!isEdit"
      ></unit-btn>
      <unit-btn
        type="large right"
        v-loading="ajaxLoading"
        text="保存"
        @click="save('0')"
        v-show="isEdit"
      ></unit-btn>
      <unit-btn
        type="large right"
        v-loading="ajaxLoading"
        text="发布"
        @click="save('1')"
        v-show="isEdit"
      ></unit-btn>
      <unit-btn
        type="large right"
        text="新增字段"
        @click="add"
        v-show="isEdit && activeName === 'review'"
      ></unit-btn>
    </div>

    <div class="contentFix">
      <div class="boxRel">
        <el-tabs v-model="activeName">
          <el-tab-pane label="供应商评审字段" name="review"> </el-tab-pane>
          <el-tab-pane label="评审等级" name="level"></el-tab-pane>
        </el-tabs>
        <div class="boxTable" v-show="activeName === 'review'">
          <unit-loading :loading="loading" v-if="loading"></unit-loading>
          <unit-table
            :total="total"
            :page="page"
            v-if="(!loading || list.length > 0) && ojbk"
            :opern="1"
            :list="list"
            :isEdit="isEdit"
            :reviewConfig="true"
            :arrayMethod="true"
            :title="title"
            :indexrow="0"
            :showError="showError"
            ref="table"
            :operation="
              isEdit
                ? [
                    {
                      key: 'delete',
                      show: judgeShow,
                    },
                  ]
                : null
            "
            @click="tableOper"
            @getBlurData="getTableData"
          ></unit-table>
          <unit-page
            :total="total"
            :page="page"
            @pagechange="getList"
          ></unit-page>
        </div>
        <div v-show="activeName === 'level'">
          <level
            :list="levelList"
            :reviewList="list_"
            :isEdit="isEdit"
            @getLevel="getLevel"
            @levelIdDelete="levelIdDelete"
          ></level>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/table";
import level from "./components/level";
export default {
  name: "config",
  components: { unitTable, level },
  data() {
    return {
      isEdit: false,
      loading: false,
      ajaxLoading: false,
      showError: false,
      ojbk: true,
      title: [
        { key: "standardName", name: "字段", width: 20, type: "input" },
        { key: "attributeValue", name: "选项", width: 16, type: "input" },
        { key: "score", name: "分值", width: 6, type: "input" },
        { key: "weightedScore", name: "加权分值", width: 6 },
        { key: "weight", name: "权重", width: 6, type: "input" },
      ],
      list: [],
      list_: [],
      weight: 0,
      total: 0,
      page: 1,
      standardList: [],
      standardIdsForDelete: [],
      attributeIdsForDelete: [],
      activeName: "review",
      levelList: [],
      levelListForUpdate: [],
      levelIdsForDelete: "",
      addRow: 0,
    };
  },
  methods: {
    getLevel(v) {
      this.levelListForUpdate = v;
    },
    levelIdDelete(v) {
      if (v) {
        this.levelIdsForDelete = v + "," + this.levelIdsForDelete;
      }
    },
    save(val) {
      if (this.ajaxLoading) return;
      this.standardList = [];
      var weight = 0;
      var no100ScoreArr = [];
      for (const [k, v] of Object.entries(this.list_)) {
        weight += Number(v.weight);
        if (
          v.attributeList.every((item) => {
            return Number(item.score) !== 100;
          })
        ) {
          no100ScoreArr.push(v.standardName);
        }
      }

      var query = {
        saveType: val,
        standardIdsForDelete: this.standardIdsForDelete.join(","),
        standardListForUpdate: [],
        levelIdsForDelete: this.levelIdsForDelete,
        levelListForUpdate: this.levelListForUpdate,
      };
      var obj = {};
      var attrObj = {};
      for (const [k, v] of Object.entries(this.list)) {
        v.weightedScore = (v.weight * v.score) / 100;
        if (this.standardList.indexOf(v.standardId) > -1) {
          for (const [key, val] of Object.entries(
            query.standardListForUpdate
          )) {
            if (val.standardId === v.standardId) {
              for (const [ckey, cval] of Object.entries(
                val.attributeListForUpdate[0]
              )) {
                attrObj[ckey] = v[ckey];
              }
              val.attributeListForUpdate.push({ ...attrObj });
            }
          }
        } else {
          for (const [key, val] of Object.entries(this.list_[0])) {
            obj[key] = v[key];
          }
          Reflect.deleteProperty(obj, "attributeList");
          Reflect.set(obj, "attributeListForUpdate", []);
          for (const [key, val] of Object.entries(
            this.list_[0].attributeList[0]
          )) {
            attrObj[key] = this.list[k][key];
          }
          obj.attributeListForUpdate.push({ ...attrObj });
          this.standardList.push(v.standardId);
          query.standardListForUpdate.push({ ...obj });
        }
      }
      for (const [k, v] of Object.entries(query.standardListForUpdate)) {
        if (
          this.attributeIdsForDelete[v.standardId] &&
          this.attributeIdsForDelete[v.standardId].length > 0
        ) {
          v.attributeIdsForDelete = this.attributeIdsForDelete[
            v.standardId
          ].join(",");
        }

        for (const [ck, cv] of Object.entries(v)) {
          if ((ck === "standardName" || ck === "weight") && !cv) {
            var flag = 1;
            this.showError = true;
            this.$store.commit("alertFn", {
              text: "操作失败，请修改对应内容",
              type: "error",
            });
            return;
          } else if (ck === "weight" && cv) {
            query.standardListForUpdate[k][ck] =
              query.standardListForUpdate[k][ck] + "%";
          }
          if (ck === "attributeListForUpdate") {
            for (const [ak, av] of Object.entries(cv)) {
              for (const [ack, acv] of Object.entries(av)) {
                if ((ack === "attributeValue" || ack === "score") && !acv) {
                  var flag = 1;
                  this.showError = true;
                  this.$store.commit("alertFn", {
                    text: "操作失败，请修改对应内容",
                    type: "error",
                  });
                }
              }
            }
          }
        }
      }
      if (flag) return;
      var noLevel = false;
      for (const [k, v] of Object.entries(this.levelListForUpdate)) {
        console.log(v);
        if (!v.scoreLowerLimit || !v.scoreUpperLimit) {
          this.$store.commit("alertFn", {
            text: "评审等级的分值范围不能为空",
            type: "error",
          });
          noLevel = true;
        }
      }
      if (noLevel) return;
      if (no100ScoreArr.length > 0) {
        this.$store.commit("alertFn", {
          text: `字段 ${no100ScoreArr.join("、")} 必须含有100分值项`,
          type: "error",
        });
        return;
      }
      if (this.activeName === "review") {
        if (weight !== this.weight) {
          this.$store.commit("confirmFn", {
            text: `当前总权重已改为${weight}%，请前往修改供应商评审等级。`,
            func: () => {
              this.activeName = "level";
            },
          });
          return;
        }
      }
      this.ajaxLoading = true;
      this.$api.service.supplier.saveAssessStandard(query, (res) => {
        this.ajaxLoading = false;
        if (res.code === "0") {
          this.isEdit = false;
          this.$store.commit("alertFn", {
            type: "success",
            text: "操作成功",
          });
          this.getList(1);
        } else {
          res.message
            ? this.$store.commit("alertFn", {
                type: "error",
                text: res.message,
              })
            : null;
        }
      });
    },
    add() {
      this.addRow++;
      var list = {
        addRow: this.addRow,
        standardId: "",
        standardName: "",
        weight: "",
        attributeId: "",
        attributeValue: "",
        score: "",
        standardId: "",
        weightedScore: "",
        attributeList: [
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
        ],
      };
      this.list_.push({
        addRow: this.addRow,
        standardId: "",
        standardName: "",
        weight: "",
        attributeList: [
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
          {
            attributeId: "",
            attributeValue: "",
            score: "",
            standardId: "",
            weightedScore: "",
          },
        ],
      });
      for (let i = 0; i < 3; i++) {
        this.list.push(list);
      }
      this.ojbk = false;
      this.$nextTick(() => {
        this.ojbk = true;
      });
    },
    edit() {
      this.isEdit = true;

      this.getList(0);
    },
    cancel() {
      this.$router.push({ path: "/supplier" });
    },
    clear() {
      this.getList(1);
      this.standardIdsForDelete = [];
      this.levelIdsForDelete = "";
      this.isEdit = false;
    },
    getTableData(v) {
      this.list = v;
      this.list_ = this.changeTolist_();
    },
    changeTolist_() {
      this.standardList = [];
      var standardList = [];
      var obj = {};
      var attrObj = {};
      for (const [k, v] of Object.entries(this.list)) {
        if (this.standardList.indexOf(v.standardId) > -1) {
          for (const [key, val] of Object.entries(standardList)) {
            if (val.standardId === v.standardId) {
              for (const [ckey, cval] of Object.entries(val.attributeList[0])) {
                attrObj[ckey] = v[ckey];
              }
              val.attributeList.push({ ...attrObj });
            }
          }
        } else {
          for (const [key, val] of Object.entries(this.list_[0])) {
            obj[key] = v[key];
          }
          Reflect.set(obj, "attributeList", []);
          for (const [key, val] of Object.entries(
            this.list_[0].attributeList[0]
          )) {
            attrObj[key] = this.list[k][key];
          }
          obj.attributeList.push({ ...attrObj });
          this.standardList.push(v.standardId);
          standardList.push({ ...obj });
        }
      }
      return standardList;
    },
    changeToList() {
      var standardList = [];
      var obj = {};
      for (const [k, v] of Object.entries(this.list_)) {
        for (const [ck, cv] of Object.entries(v.attributeList)) {
          const obj = Object.assign({ ...v }, { ...cv });
          standardList.push(obj);
        }
      }
      return standardList;
    },
    tableOper(key, item) {
      switch (key) {
        case "delete":
          this.$store.commit("confirmFn", {
            text: "确定删除该项吗？",
            type: "warning",
            func: () => {
              if (item.standardId) {
                var num = 0;
                var index = 0;
                for (const [k, v] of Object.entries(this.list)) {
                  if (v.standardId === item.standardId) {
                    num++;
                  }
                }
                for (const [k, v] of Object.entries(this.list)) {
                  if (v.standardId === item.standardId) {
                    index = k;
                    break;
                  }
                }
                this.list.splice(index, num);
                this.standardIdsForDelete.push(item.standardId);
                for (const [k, v] of Object.entries(this.list_)) {
                  if (v.standardId === item.standardId) {
                    this.list_.splice(k, 1);
                  }
                }
              } else {
                this.list_.splice(this.list_.length - 1, 1);
                var list = [];
                for (const [k, v] of Object.entries(this.list_)) {
                  for (const [ck, cv] of Object.entries(v.attributeList)) {
                    const obj = Object.assign({ ...v }, { ...cv });
                    list.push(obj);
                  }
                }
                this.list = list;
              }
              this.ojbk = false;
              this.$nextTick(() => {
                this.ojbk = true;
              });
            },
          });
          break;
        case "addRow":
          for (const [k, v] of Object.entries(this.list_)) {
            if (item.standardId) {
              if (v.standardId === item.standardId) {
                v.attributeList.push({
                  attributeId: "",
                  attributeValue: "",
                  score: "",
                  weightedScore: "",
                });
              }
            } else if (v.addRow === item.addRow) {
              v.attributeList.push({
                attributeId: "",
                attributeValue: "",
                score: "",
                weightedScore: "",
              });
            }
          }
          var list = [];
          for (const [k, v] of Object.entries(this.list_)) {
            for (const [ck, cv] of Object.entries(v.attributeList)) {
              const obj = Object.assign({ ...v }, { ...cv });
              list.push(obj);
            }
          }
          this.list = list;
          this.ojbk = false;
          this.$nextTick(() => {
            this.ojbk = true;
          });
          break;
        case "delRow":
          if (item.attributeId) {
            for (const [k, v] of Object.entries(this.list)) {
              if (v.attributeId === item.attributeId) {
                this.attributeIdsForDelete[v.standardId].push(item.attributeId);
                this.list.splice(k, 1);
              }
            }
            for (const [k, v] of Object.entries(this.list_)) {
              if (v.standardId === item.standardId) {
                v.attributeIdsForDelete = this.attributeIdsForDelete[
                  v.standardId
                ].join(",");
                for (const [ck, cv] of Object.entries(v.attributeList)) {
                  if (cv.attributeId === item.attributeId) {
                    v.attributeList.splice(ck, 1);
                  }
                }
              }
            }
          } else {
            for (const [k, v] of Object.entries(this.list_)) {
              if (v.addRow === item.addRow) {
                v.attributeList.splice(v.attributeList.length - 1, 1);
              }
            }
            this.list = this.changeToList();
          }
          this.ojbk = false;
          this.$nextTick(() => {
            this.ojbk = true;
          });
          break;
      }
    },
    getList(type) {
      this.loading = true;
      this.weight = 0;
      this.$api.service.supplier.assessStandard({ type: type }, (res) => {
        this.loading = false;
        if (res.code === "0") {
          this.list_ = res.data.standardList;
          for (const [k, v] of Object.entries(this.list_)) {
            this.weight += Number(v.weight);
          }
          var list = [];
          this.attributeIdsForDelete = {};
          for (const [k, v] of Object.entries(res.data.standardList)) {
            this.attributeIdsForDelete[v.standardId] = [];
            for (const [ck, cv] of Object.entries(v.attributeList)) {
              const obj = Object.assign({ ...v }, { ...cv });
              list.push(obj);
            }
          }
          this.list = list;
          this.levelList = res.data.levelList;
          this.ojbk = false;
          this.$nextTick(() => {
            this.ojbk = true;
          });
        } else {
          res.message
            ? this.$store.commit("alertFn", {
                type: "error",
                text: res.message,
              })
            : null;
        }
      });
    },
    judgeShow(item, i, key) {
      switch (key) {
        case "delete":
          return true && this.isEdit;
        case "edit":
          return true && !this.isEdit;
        case "save":
          return true && this.isEdit;
        case "cancel":
          return true && this.isEdit;
      }
    },
  },
  created() {
    this.getList(1);
  },
};
</script>

<style scoped lang="scss">
.config {
  .boxTable {
    margin-top: 34px;
    overflow: auto;
    height: 610px;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #dddee0;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #fff;
    }
    /deep/ .el-table {
      .el-table__body-wrapper {
        padding-top: 40px;
      }
      th,
      td {
        height: 40px;
        padding: 8px 0;
        .el-input {
          .el-input__inner {
            height: 23px;
            line-height: 23px;
          }
        }
      }
    }
  }
}
</style>