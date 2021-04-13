<template>
  <div class="processForm">
    <h1 class="title">项目资源及费用申请单</h1>
    <div class="formbox">
      <div class="four">
        <span>销售员</span>
        <span>{{ data.applyUserName }}</span>
        <span>申请单号</span>
        <span>{{ data.applyNo }}</span>
      </div>
      <div class="four">
        <span>子公司</span>
        <span>{{ data.applyBranchCompany }}</span>
        <span>所属部门</span>
        <span>{{ data.applyDepName }}</span>
      </div>
      <div class="four">
        <span :title="data.projName">项目名称</span>
        <span>{{ data.relaProjName }}</span>
        <span>项目编号</span>
        <span>{{ data.relaProjNo }}</span>
      </div>
      <div class="four">
        <span>客户名称</span>
        <span>{{ data.customerName }}</span>

        <span>项目金额</span>
        <span>{{ $pubfunc.transformPrice(data.projAmount, true) }}（元）</span>
      </div>
      <div class="four">
        <span>项目类型</span>
        <span>{{ data.projType }}</span>

        <span>项目赢率</span>
        <span>{{ data.winRate }}</span>
      </div>
      <div class="two">
        <span style="height: 120px"
          ><i class="require" v-if="data.isEdit">*</i>项目背景及内容描述</span
        >
        <span
          style="height: 120px; line-height: 1.5"
          class="textarea"
          :title="data.projDesc"
          v-html="emptyTxt(data.projDesc)"
          v-if="!data.isEdit"
        ></span>
        <span
          style="height: 120px; padding-left: 12px"
          :class="{ errorBorder: error.value === 'projDesc' }"
          v-else
        >
          <!-- 编辑状态不需要编辑的话 注释代码可以删除 -->
          <el-input
            type="textarea"
            placeholder="请输入,最多500字"
            v-model="form.projDesc"
            @input="formChange"
          ></el-input>
          <span v-show="error.value === 'projDesc'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span>售前工程师</span>
        <span v-if="!data.isEdit">{{ data.preSaleName }}</span>
        <span v-else>
          <el-select
            v-model="form.preSaleIdsArr"
            filterable
            placeholder="请选择"
            multiple
            @change="formChange('preSaleIds')"
          >
            <el-option
              v-for="item in preSaleIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="selectedPresaleList.indexOf(item.value) > 0"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="two">
        <span
          ><i class="require" v-if="data.isEdit">*</i
          >预留项目售前人工费用合计（元）</span
        >
        <span v-if="!data.isEdit">{{
          $pubfunc.transformPrice(data.reserveLaborCost, true)
        }}</span>
        <span
          v-else
          style="padding-left: 0; position: relative"
          :class="{ errorBorder: error.value === 'reserveLaborCost' }"
        >
          <el-input
            v-model="form.reserveLaborCost"
            placeholder="请输入"
            @input="formChange('reserveLaborCost')"
            @blur="formBlur('reserveLaborCost')"
          ></el-input>
          <span v-show="error.value === 'reserveLaborCost'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span
          ><i class="require" v-if="data.isEdit">*</i
          >预计售前工作人天（人天）</span
        >
        <span v-if="!data.isEdit">{{
          $pubfunc.transformPrice(data.reserveLaborDays, true)
        }}</span>
        <!-- 编辑状态不需要编辑的话 注释代码可以删除 -->
        <span
          v-else
          style="padding-left: 0"
          :class="{ errorBorder: error.value === 'reserveLaborDays' }"
        >
          <el-input
            v-model="form.reserveLaborDays"
            placeholder="请输入"
            @input="formChange('reserveLaborDays')"
          ></el-input>
          <span v-show="error.value === 'reserveLaborDays'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span style="height: 80px"
          ><i class="require" v-if="data.isEdit">*</i>预计售前人工明细</span
        >
        <span
          v-if="!data.isEdit"
          style="height: 80px; line-height: 1.5"
          class="textarea"
          v-html="emptyTxt(data.reserveLaborDetail)"
        ></span>
        <!-- 编辑状态不需要编辑的话 注释代码可以删除 -->
        <span
          style="height: 80px; padding-left: 0"
          :class="{ errorBorder: error.value === 'reserveLaborDetail' }"
          v-else
        >
          <el-input
            v-model="form.reserveLaborDetail"
            type="textarea"
            placeholder="请输入，最多200字"
            @input="formChange('reserveLaborDetail')"
          ></el-input>
          <span v-show="error.value === 'reserveLaborDetail'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span
          ><i class="require" v-if="data.isEdit">*</i
          >预留项目售前差旅费用合计（元）</span
        >
        <span v-if="!data.isEdit">{{
          $pubfunc.transformPrice(data.reserveTravelExpense, true)
        }}</span>
        <span
          style="padding-left: 0"
          :class="{ errorBorder: error.value === 'reserveTravelExpense' }"
          v-else
        >
          <el-input
            v-model="form.reserveTravelExpense"
            type="textarea"
            placeholder="请输入"
            @input="formChange('reserveTravelExpense')"
            @blur="formBlur('reserveTravelExpense')"
          ></el-input>
          <span v-show="error.value === 'reserveTravelExpense'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span style="height: 80px"
          ><i class="require" v-if="data.isEdit">*</i>预计售前差旅费用明细</span
        >
        <span
          v-if="!data.isEdit"
          style="height: 80px; line-height: 1.5"
          class="textarea"
          >{{ data.reserveTravelDetail }}</span
        >
        <!-- 编辑状态不需要编辑的话 注释代码可以删除 -->
        <span
          style="height: 80px; padding-left: 0"
          :class="{ errorBorder: error.value === 'reserveTravelDetail' }"
          v-else
        >
          <el-input
            v-model="form.reserveTravelDetail"
            type="textarea"
            placeholder="请输入，最多200字"
            @input="formChange('reserveTravelDetail')"
          ></el-input>
          <span v-show="error.value === 'reserveTravelDetail'" class="error">{{
            error.message
          }}</span>
        </span>
      </div>
      <div class="two">
        <span>预留项目售前费用合计（元）</span>
        <span v-if="!data.isEdit">{{
          $pubfunc.transformPrice(
            Number(data.reserveLaborCost) + Number(data.reserveTravelExpense),
            true
          )
        }}</span>
        <span v-else>{{
          $pubfunc.transformPrice(
            Number(
              form.reserveLaborCost
                ? form.reserveLaborCost.split(",").join("")
                : 0
            ) +
              Number(
                form.reserveTravelExpense
                  ? form.reserveTravelExpense.split(",").join("")
                  : 0
              ),
            true
          )
        }}</span>
        <!-- 编辑状态不需要编辑的话 注释代码可以删除 -->
        <!-- <span v-else style="padding-left: 0">
          <el-input
            v-model="form.totalCost"
            placeholder="请输入"
            @input="formChange"
          ></el-input>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "processForm",
  /**
   * @param {object} data 项目详情数据
   */
  props: ["data"],
  data() {
    return {
      form: {
        projId: "",
        processId: "",
        reserveLaborDays: "",
        reserveLaborCost: "",
        reserveLaborDetail: "",
        reserveTravelExpense: "",
        reserveTravelDetail: "",
        preSaleIds: "",
        preSaleIdsArr: [],
        projType: "",
        projDesc: "",
      },
      error: {
        value: "",
        message: "",
      },
      projectName: [],
      customerName: [],
      projectType: [],
      projType: [],
      preSaleIds: [],
      selectedPresaleList: [],
    };
  },
  filters: {
    emptyTxt(v) {
      return v ? this.getFormatCode(v) : "--";
    },
  },
  watch: {
    data: {
      deep: true,
      handler: function (newV, oldV) {
        for (const [k, v] of Object.entries(this.form)) {
          this.form[k] = this.data[k];
        }
        this.form.reserveLaborCost = this.$pubfunc.transformPrice(
          this.form.reserveLaborCost,
          true
        );
        this.form.reserveTravelExpense = this.$pubfunc.transformPrice(
          this.form.reserveTravelExpense,
          true
        );
        this.form.preSaleIdsArr = newV.preSaleIds
          ? newV.preSaleIds.split(",")
          : [];
        this.getForm();
      },
    },
  },
  methods: {
    emptyTxt(v) {
      return v ? this.getFormatCode(v) : "--";
    },
    getFormatCode(strValue) {
      return strValue
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, " ");
    },
    submit() {
      if (!this.form.projDesc) {
        this.error = {
          message: "请输入项目背景及内容描述",
          value: "projDesc",
        };
        return this.$emit("change", false);
      } else if (!this.form.reserveLaborCost) {
        this.error = {
          message: "请输入预留项目售前人工费用合计（元）",
          value: "reserveLaborCost",
        };
        return this.$emit("change", false);
      } else if (!this.form.reserveLaborDays) {
        this.error = {
          message: "请输入预计售前工作人天（人天）",
          value: "reserveLaborDays",
        };
        return this.$emit("change", false);
      } else if (!this.form.reserveLaborDetail) {
        this.error = {
          message: "请输入预计售前人工明细",
          value: "reserveLaborDetail",
        };
        return this.$emit("change", false);
      } else if (!this.form.reserveTravelExpense) {
        this.error = {
          message: "请输入预留项目售前差旅费用合计（元）",
          value: "reserveTravelExpense",
        };
        return this.$emit("change", false);
      } else if (!this.form.reserveTravelDetail) {
        this.error = {
          message: "请输入预计售前差旅费用明细",
          value: "reserveTravelDetail",
        };
        return this.$emit("change", false);
      } else {
        this.error = {
          message: "",
          value: "",
        };
        this.$emit("change", this.form);
      }
    },
    formChange(key) {
      if (key !== "preSaleIds") {
        if (this.form[key]) {
          this.error = {
            message: "",
            value: "",
          };
        }
        if (key !== "reserveLaborDetail" && key !== "reserveTravelDetail") {
          this.form[key] = this.form[key].replace(/[^\d.]/g, "");
          this.form[key] = this.form[key].replace(/^\./g, "");
          this.form[key] = this.form[key].replace(/\.{2,}/g, "");
          this.form[key] = this.form[key]
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
          this.form[key] =
            this.form[key].indexOf(".") > 0
              ? this.form[key].split(".")[0].substring(0, 7) +
                "." +
                this.form[key].split(".")[1].substring(0, 2)
              : this.form[key].substring(0, 7);
          if (this.form[key].length > 1 && this.form[key][0] === "0") {
            this.form[key] = this.form[key].slice(1);
          }
          this.$emit("change", this.form);
          return this.form[key];
        }
      } else {
        this.form.preSaleIds = this.form.preSaleIdsArr.join(",");
      }
      this.$emit("change", this.form);
    },
    formBlur(key) {
      this.form[key] = this.$pubfunc.transformPrice(this.form[key], true);
    },
    getDict() {
      this.$api.bgmgnt.staff.getList({ resourceType: "08,06" }, (res) => {
        switch (res.code) {
          case "0":
            let list = [];
            (res.data.list ? res.data.list : []).map((v) => {
              list.push({
                value: v.staffId,
                label: v.staffName,
              });
            });
            this.preSaleIds = list;
            break;
        }
      });
    },
    getForm() {
      this.$api.service.project.resourceForm(
        { projId: this.form.projId, processId: this.form.processId },
        (res) => {
          if (res.code === "0") {
            this.selectedPresaleList = res.data.selectedPresaleList || [];
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
  },
  created() {
    this.getDict();
  },
};
</script>

<style lang="scss" scoped>
.processForm {
  margin: 20px 0;
  .title {
    text-align: center;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #60636a;
  }
  .formbox {
    margin-top: 21px;
    text-align: center;
    .four,
    .two {
      span {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: left;
        .el-select {
          width: 67%;
          height: 30px;
          line-height: 30px;
          margin-top: 4px;
          overflow: auto;
          &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
          }
          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: #ddd;
          }
          &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            background: #ededed;
          }
          /deep/ .el-input__inner {
            width: 100%;
            height: 30px;
            line-height: 30px;
            border: 1px solid #e3e5ea;
          }
          /deep/ .el-input__icon {
            line-height: 30px;
          }
        }
        .el-textarea {
          height: 100%;
          /deep/ .el-textarea__inner {
            border: 0;
            height: 95%;
            min-height: unset !important;
          }
        }
        .el-input {
          width: 100%;
          height: 100%;
          /deep/ .el-input__inner {
            border: 0;
            height: 95%;
            min-height: unset !important;
          }
        }
      }
      span:nth-child(1) {
        width: 288px;
        height: 40px;
        line-height: 40px;
        background: #eaeef9;
        border: 1px solid #e3e5ea;
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #60636a;
        padding-left: 20px;
        margin-top: -1px;
        .require {
          color: #d9001b;
          margin-right: 5px;
        }
      }
    }
    .four {
      span:nth-child(2) {
        width: 360px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border: 1px solid #e3e5ea;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #60636a;
        padding-left: 12px;
        margin-left: -5px;
        margin-top: -1px;
      }
      span:nth-child(3) {
        width: 288px;
        height: 40px;
        line-height: 40px;
        background: #eaeef9;
        border: 1px solid #e3e5ea;
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #60636a;
        padding-left: 20px;
        margin-top: -1px;
        margin-left: -5px;
      }
      span:nth-child(4) {
        width: 360px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border: 1px solid #e3e5ea;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #60636a;
        padding-left: 12px;
        margin-left: -5px;
        margin-top: -1px;
      }
    }
    .two {
      span:nth-child(2) {
        width: 1006px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border: 1px solid #e3e5ea;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #60636a;
        padding-left: 12px;
        margin-left: -5px;
        margin-top: -1px;
      }
      .textarea {
        overflow: auto;
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
      }
    }
    .error {
      position: absolute;
      bottom: 0;
      right: 15px;
      z-index: 10;
      height: 25px;
      line-height: 25px;
      color: #fd2624;
    }
    .errorBorder {
      border: 1px solid #fd2624 !important;
    }
  }
}
</style>