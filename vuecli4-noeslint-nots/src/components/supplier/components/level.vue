<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-12-10 09:55:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-10 16:25:30
-->
<template>
  <div class="level">
    <div class="top">
      <span>等级数：</span>
      <span v-show="!isEdit">{{ list.length }}</span>
      <el-select v-show="isEdit" v-model="level" @change="levelChange">
        <el-option
          v-for="item in levelList"
          :key="item.value"
          :label="item.value"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="bottom">
      <unit-loading :loading="loading" v-if="loading"></unit-loading>
      <el-table
        :data="isEdit ? emptyList : tableData"
        border
        style="width: 30%"
        :header-cell-style="{
          background: 'rgba(241,244,251,1)',
          color: '#5D6680',
        }"
      >
        <el-table-column
          prop="levelValue"
          label="等级值"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="area" label="分值范围" align="center">
          <template slot-scope="scope">
            <div v-if="scope.$index === 0 && isEdit">
              <el-input
                v-model="scope.row.scoreLowerLimit"
                @blur="blurMethod(scope.row, scope.$index)"
                @input="intMethod(scope.$index)"
              ></el-input>
              <span>
                ≤ 分值 ≤
                {{ Number(scope.row.scoreUpperLimit).toFixed(2) }}</span
              >
            </div>
            <div v-else-if="scope.$index === 0 && !isEdit">
              {{ Number(scope.row.scoreLowerLimit).toFixed(2) }} ≤ 分值 ≤
              {{ Number(scope.row.scoreUpperLimit).toFixed(2) }}
            </div>
            <div v-else-if="scope.$index !== emptyList.length - 1 && isEdit">
              <el-input
                v-model="scope.row.scoreLowerLimit"
                @blur="blurMethod(scope.row, scope.$index)"
                @input="intMethod(scope.$index)"
              ></el-input>
              <span>
                ≤ 分值＜{{
                  isEdit
                    ? Number(
                        emptyList[scope.$index - 1].scoreLowerLimit
                      ).toFixed(2)
                    : Number(list[scope.$index - 1].scoreLowerLimit).toFixed(2)
                }}</span
              >
            </div>
            <div v-else-if="scope.$index === emptyList.length - 1 && isEdit">
              <span
                >{{ scope.row.scoreLowerLimit }} ≤ 分值＜{{
                  isEdit
                    ? Number(
                        emptyList[scope.$index - 1].scoreLowerLimit
                      ).toFixed(2)
                    : Number(list[scope.$index - 1].scoreLowerLimit).toFixed(2)
                }}</span
              >
            </div>
            <span v-else>
              {{ Number(scope.row.scoreLowerLimit).toFixed(2) }} ≤ 分值＜{{
                Number(scope.row.scoreUpperLimit).toFixed(2)
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list", "isEdit", "reviewList"],
  watch: {
    list: {
      deep: true,
      handler(newV, oldV) {
        this.tableData = newV;
        this.emptyList = [];
        for (const [k, v] of Object.entries(
          JSON.parse(JSON.stringify(this.tableData))
        )) {
          this.emptyList.push(v);
        }
        for (const [k, v] of Object.entries(this.levelList)) {
          if (Number(v.value) === this.emptyList.length) {
            this.level = v;
          }
        }
      },
    },
    reviewList: {
      deep: true,
      handler(newV, oldV) {
        var numUpperArr = [];
        var numLowerArr = [];
        var numUpper = 0;
        var numLower = 0;
        for (const [index, item] of Object.entries(newV)) {
          var numArr = [];
          for (const [ind, ite] of Object.entries(item.attributeList)) {
            numArr.push(Number(ite.weightedScore));
          }
          var numArr2 = this.sort(numArr);
          numUpperArr.push(numArr2[numArr2.length - 1]);
          numLowerArr.push(numArr2[0]);
        }
        for (const [k, v] of Object.entries(numUpperArr)) {
          numUpper += v;
        }
        for (const [k, v] of Object.entries(numLowerArr)) {
          numLower += v;
        }
        this.emptyList[0].scoreUpperLimit = numUpper.toFixed(2);
        this.emptyList[
          this.emptyList.length - 1
        ].scoreLowerLimit = numLower.toFixed(2);
        this.$emit("getLevel", this.emptyList);
      },
    },
  },
  data() {
    return {
      loading: false,
      page: 1,
      total: 0,
      level: "",
      levelList: [
        { label: "B", value: "2" },
        { label: "C", value: "3" },
        { label: "D", value: "4" },
        { label: "E", value: "5" },
      ],
      tableData: [],
      emptyList: [],
    };
  },
  methods: {
    sort(arr) {
      if (Array.isArray(arr)) {
        let _arr = arr.concat();
        let arrLength = _arr.length;
        if (arrLength < 2) {
          return _arr;
        }
        for (let i = 0, ilen = arrLength - 1; i < ilen; i++) {
          for (let j = 0; j < arrLength - i - 1; j++) {
            if (_arr[j] > _arr[j + 1]) {
              let temp = _arr[j];
              _arr[j] = _arr[j + 1];
              _arr[j + 1] = temp;
            }
          }
        }
        return _arr;
      }
    },
    intMethod(index) {
      this.emptyList[index].scoreLowerLimit = this.emptyList[
        index
      ].scoreLowerLimit.replace(/[^\d.]/g, "");
      this.emptyList[index].scoreLowerLimit = this.emptyList[
        index
      ].scoreLowerLimit.replace(/^\./g, "");
      this.emptyList[index].scoreLowerLimit = this.emptyList[
        index
      ].scoreLowerLimit.replace(/\.{2,}/g, "");
      this.emptyList[index].scoreLowerLimit = this.emptyList[
        index
      ].scoreLowerLimit
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this.emptyList[index].scoreLowerLimit =
        this.emptyList[index].scoreLowerLimit.indexOf(".") > 0
          ? this.emptyList[index].scoreLowerLimit
              .split(".")[0]
              .substring(0, 2) +
            "." +
            this.emptyList[index].scoreLowerLimit.split(".")[1].substring(0, 2)
          : this.emptyList[index].scoreLowerLimit.substring(0, 2);
      if (
        this.emptyList[index].scoreLowerLimit.length > 1 &&
        this.emptyList[index].scoreLowerLimit[0] === "0"
      ) {
        this.emptyList[index].scoreLowerLimit = this.emptyList[
          index
        ].scoreLowerLimit.slice(1);
      }
      return this.emptyList[index].scoreLowerLimit;
    },
    blurMethod(val, index) {
      if (
        Number(val.scoreLowerLimit) > Number(val.scoreUpperLimit) ||
        Number(val.scoreLowerLimit) === Number(val.scoreUpperLimit)
      ) {
        this.$store.commit("confirmFn", {
          text: `${val.levelValue}等级分值范围的最小值需小于该等级最大值`,
          type: "error",
        });
        val.scoreLowerLimit = "";
        return;
      } else if (
        Number(val.scoreLowerLimit) <
          Number(this.emptyList[this.emptyList.length - 1].scoreLowerLimit) ||
        Number(val.scoreLowerLimit) ===
          Number(this.emptyList[this.emptyList.length - 1].scoreLowerLimit)
      ) {
        this.$store.commit("confirmFn", {
          text: `${val.levelValue}等级分值范围的最小值需大于其下等级最小值`,
          type: "error",
        });
        val.scoreLowerLimit = "";
        return;
      }
      this.emptyList[index + 1].scoreUpperLimit = val.scoreLowerLimit;
      this.$emit("getLevel", this.emptyList);
    },
    levelChange() {
      for (const [k, v] of Object.entries(this.emptyList)) {
        if (k === "0") {
          v.scoreLowerLimit = "";
        } else if (k == this.emptyList.length - 1) {
          v.scoreUpperLimit = "";
        } else {
          v.scoreLowerLimit = "";
          v.scoreUpperLimit = "";
        }
      }
      if (Number(this.level.value) > this.emptyList.length) {
        const num = Number(this.level.value) - this.emptyList.length;
        for (let i = 0; i < num; i++) {
          this.emptyList.splice(1, 0, {
            levelId: "",
            levelValue: "",
            levelNo: "",
            scoreUpperLimit: "",
            scoreLowerLimit: "",
            incloudUpperLimit: "0",
            incloudLowerLimit: "1",
          });
        }
        for (let i = 0; i < this.emptyList.length; i++) {
          if (i === 0) {
            this.emptyList[i].levelNo = "1";
            this.emptyList[i].levelValue = "A";
          } else {
            this.emptyList[i].levelNo = this.levelList[i - 1].value;
            this.emptyList[i].levelValue = this.levelList[i - 1].label;
          }
        }
      } else {
        const num = this.emptyList.length - Number(this.level.value);
        var newList = JSON.parse(JSON.stringify(this.emptyList));
        const arr = newList.splice(1, num);
        var str = [];
        for (const [k, v] of Object.entries(arr)) {
          if (v.levelId) {
            str.push(v.levelId);
          }
        }
        this.$emit("levelIdDelete", str.join(","));
        this.emptyList.splice(1, num);
        for (let i = 0; i < this.emptyList.length; i++) {
          if (i === 0) {
            this.emptyList[i].levelNo = "1";
            this.emptyList[i].levelValue = "A";
          } else {
            this.emptyList[i].levelNo = this.levelList[i - 1].value;
            this.emptyList[i].levelValue = this.levelList[i - 1].label;
          }
        }
      }
      console.log(this.emptyList);
      this.$emit("getLevel", this.emptyList);
    },
  },
};
</script>

<style scoepd lang="scss">
.level {
  .top {
    line-height: 32px;
    margin: 20px 0 40px 0;
    /deep/ .el-input {
      width: 150px;
      .el-input__suffix {
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
  }
  .bottom {
    overflow: auto;
    .el-table {
      /deep/ .el-table__body-wrapper {
        .el-input {
          width: 40px;
          vertical-align: middle;
          .el-input__inner {
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>