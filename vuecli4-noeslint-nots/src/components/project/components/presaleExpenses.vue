<template>
  <div
    v-if="data.reserveCostList && data.reserveCostList.length > 0"
    class="presaleExpenses"
  >
    <div v-for="(item, index) in data.reserveCostList || []" :key="index">
      <div class="number">
        <span>项目资源及费用申请单号({{ item.applyNo }})</span>
      </div>
      <div class="reserve">
        <div class="title">
          <span>预留售前项目费用</span>
        </div>
        <div class="content">
          <ul>
            <li v-for="(i, index) of title" :key="index">
              <div class="left">{{ i.label }}</div>
              <div class="right" :title="item[i.value]">{{ item[i.value] }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      class="actual"
      v-if="data.reserveCostList && data.reserveCostList.length > 0"
    >
      <div class="title">
        <span>实际售前项目费用</span>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item, index) of actualTitle" :key="index">
            <div class="left">
              <span
                style="margin-right: 5px; color: #fd2624"
                v-if="name === 'projectEdit'"
                >*</span
              >{{ item.label }}
            </div>
            <div
              class="right rightInt"
              style="position: relative"
              v-if="
                isEdit &&
                item.value !== 'actualPreSaleCost' &&
                item.value !== 'actualLaborDays'
              "
            >
              <el-input
                v-model="form[item.value]"
                @input="intChange(item.value)"
                :class="{ errorBorder: error.value === item.value }"
              ></el-input>
              <span v-show="error.value === item.value" class="error">{{
                error.message
              }}</span>
            </div>
            <div
              class="right"
              v-else-if="!isEdit && item.value === 'actualPreSaleCost'"
            >
              {{
                $pubfunc.transformPrice(
                  Number(data.negotiateLaborCost) +
                    Number(data.actualTravelExpense),
                  true
                )
              }}
            </div>
            <div
              class="right"
              v-else-if="
                (name === 'projectEdit' || isEdit) &&
                item.value === 'actualPreSaleCost'
              "
            >
              {{
                $pubfunc.transformPrice(
                  Number(form.negotiateLaborCost) +
                    Number(form.actualTravelExpense),
                  true
                )
              }}
            </div>
            <div class="right" v-else  :title="data[item.value]">
              {{ data[item.value] }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn">
      <unit-btn
        type="primary"
        text="编辑"
        v-if="judgeShow('edit')"
        @click="edit"
      ></unit-btn>
      <unit-btn
        type="primary"
        text="保存"
        :loading="ajaxIng"
        v-show="isEdit"
        @click="submit"
      ></unit-btn>
      <unit-btn
        type="plain"
        text="取消"
        v-show="isEdit"
        @click="cancel"
      ></unit-btn>
    </div>
  </div>
  <div v-else class="midCont">
    <div class="noData">
      <img src="@/assets/images/noData.png" alt="" srcset="" />
      <h1>暂无数据</h1>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * @param {Array<object>} data 表单字段的数据
   * @param {string} name 通过父级页面的name判断是否为编辑状态  projectEdit/projectView
   */
  props: ["data", "name"],
  watch: {
    data: {
      deep: true,
      handler: function (newV, oldV) {
        for (const [k, v] of Object.entries(this.form)) {
          this.form[k] = newV[k];
        }
      },
    },
  },
  data() {
    return {
      form: {
        actualLaborDays: "",
        actualLaborCost: "",
        negotiateLaborCost: "",
        actualTravelExpense: "",
      },
      title: [
        { value: "reserveLaborCost", label: "预留项目售前人工费用合计" },
        { value: "reserveLaborDays", label: "预计售前工作人天" },
        { value: "reserveLaborDetail", label: "预计售前人工明细" },
        { value: "reserveTravelExpense", label: "预计项目售前差旅费用合计" },
        { value: "reserveTravelDetail", label: "预计售前差旅费用明细" },
        { value: "reservePreSaleCost", label: "预计项目售前费用合计" },
      ],
      actualTitle: [
        { value: "actualLaborDays", label: "实际售前工作人天" },
        { value: "actualLaborCost", label: "实际售前人工费用" },
        { value: "negotiateLaborCost", label: "协商后售前人工费用" },
        { value: "actualTravelExpense", label: "实际售前差旅费用" },
        { value: "actualPreSaleCost", label: "实际项目售前费用合计" },
      ],
      error: {
        value: "",
        message: "",
      },
      isEdit: false,
      ajaxIng: false,
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
    judgeBtn() {
      return {
        visitrecord: this.$pubfunc.judgeBtn("visitrecord"),
      };
    },
  },
  methods: {
    intChange(key) {
      if (this.form[key]) {
        this.error = {
          value: "",
          message: "",
        };
      }
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
    },
    judgeShow(key) {
      switch (key) {
        case "edit":
          return (
            !this.isEdit &&
            (this.userInfo.resourceType === "02" ||
              this.userInfo.resourceType === "05" ||
              this.userInfo.resourceType === "07" ||
              this.userInfo.userInfo.info.staff.isAdmin === "1")
          );
      }
    },
    edit() {
      this.isEdit = true;
    },
    cancel() {
      this.isEdit = false;
      for (const [k, v] of Object.entries(this.form)) {
        this.form[k] = this.data[k];
      }
    },
    submit() {
      if (this.ajaxIng) return;
      if (!this.form.actualLaborCost) {
        this.error = {
          value: "actualLaborCost",
          message: "请输入实际售前人工费用",
        };
        return;
      }
      if (!this.form.negotiateLaborCost) {
        this.error = {
          value: "negotiateLaborCost",
          message: "请输入协商后售前人工费用",
        };
        return;
      }
      if (!this.form.actualTravelExpense) {
        this.error = {
          value: "actualTravelExpense",
          message: "请输入实际售前差旅费用",
        };
        return;
      }
      this.ajaxIng = true;
      let params = { ...this.form };
      params.projId = this.data.projId;
      this.$api.service.project.saveActualCost(params, (res) => {
        this.ajaxIng = false;
        if (res.code === "0") {
          this.$store.commit("alertFn", {
            text: "操作成功",
            type: "success",
          });
          this.cancel();
          this.$emit("success");
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
  },
  created() {},
};
</script>

<style scoped lang="scss">
.presaleExpenses {
  .btn {
    text-align: right;
    margin-right: 37%;
    .button {
      margin-top: -150px;
    }
  }
  .reserve,
  .actual {
    width: 50%;
    border: 1px solid #333333;
    text-align: center;
    .title,
    .content ul li {
      height: 30px;
      line-height: 30px;
    }
    .title {
      background-color: #f2f2f2;
    }
    .content ul li {
      border-top: 1px solid #333333;
      .left {
        width: 25%;
        background-color: #f2f2f2;
        border-right: 1px solid #333333;
      }
      .right {
        width: 73%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
      }
      .right.rightInt {
        width: 72%;
        height: 30px;
        text-align: left;
        box-sizing: border-box;
        .el-input {
          width: 25%;
          height: 22px;
          margin-top: 4px;
          /deep/ .el-input__inner {
            height: 22px;
            line-height: 22px;
          }
        }
      }
    }
  }
  .reserve {
    margin-bottom: 30px;
  }
  .number {
    height: 30px;
    line-height: 30px;
    text-align: left;
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
.midCont .noData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 50px;
  position: relative;
}
.midCont .noData h1 {
  position: absolute;
  bottom: 70px;
  font-size: 20px;
  color: #666666;
  left: 50%;
  margin-left: -36px;
}
</style>