<template>
  <div
    class="difficultyDescription"
    v-if="data.preSaleName || (difficultyList && difficultyList.length > 0)"
  >
    <div class="presaleBox" v-if="userInfo.resourceType === '08'">
      <div class="preSale">
        <ul>
          <li>
            <span>售前工程师</span><span>{{ data.preSaleName }}</span>
          </li>
          <li>
            <span>
              <span style="margin-right: 5px; color: #fd2624" v-if="isEdit"
                >*</span
              >
              项目交付核心技术难点 </span
            ><span v-show="!isEdit" :title="data.tecDifficultyTxt">{{
              data.tecDifficultyTxt
            }}</span>
            <span v-show="isEdit">
              <unit-dropdown
                id="tecDifficulty"
                :list="tecDifficulty"
                @change="dropdownReturn"
                :result="form.tecDifficulty"
              ></unit-dropdown>
              <span v-show="error.value === 'tecDifficulty'" class="error">{{
                error.message
              }}</span>
            </span>
          </li>
          <li>
            <span style="height: 71px; ling-height: 1.5">
              <span
                style="margin-right: 5px; color: #fd2624; border-bottom: 0"
                v-if="isEdit"
                >*</span
              >
              项目交付核心技术难点说明 </span
            ><span
              v-show="!isEdit"
              style="height: 71px; ling-height: 1.5; padding-top: 5px"
              :title="data.tecDifficultyDesc"
              >{{ data.tecDifficultyDesc }}</span
            >
            <span v-show="isEdit" style="height: 71px; ling-height: 1.5"
              ><el-input
                v-model="form.tecDifficultyDesc"
                type="textarea"
                placeholder="请输入"
                @input="error = { value: '', message: '' }"
                :maxlength="500"
                show-word-limit
                :rows="3"
              ></el-input>
              <span
                v-show="error.value === 'tecDifficultyDesc'"
                class="error"
                >{{ error.message }}</span
              >
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="technicalDirectorBox"
      v-for="(i, index) in difficultyList || []"
      :key="index"
      v-else
    >
      <div
        class="preSale"
        v-for="(item, index) in i.tecDifficultyList"
        :key="index"
      >
        <ul>
          <li>
            <span>售前工程师</span><span>{{ item.preSaleName }}</span>
          </li>
          <li>
            <span>项目交付核心技术难点</span
            ><span :title="item.tecDifficultyTxt">{{
              item.tecDifficultyTxt
            }}</span>
          </li>
          <li>
            <span style="height: 71px; ling-height: 1.5"
              >项目交付核心技术难点说明</span
            ><span
              style="height: 71px; ling-height: 1.5; padding-top: 5px"
              :title="item.tecDifficultyDesc"
              >{{ item.tecDifficultyDesc }}</span
            >
          </li>
        </ul>
      </div>
      <div class="preSale">
        <ul>
          <li>
            <span>技术总监/负责人</span
            ><span>{{ i.technicalDirectorName }}</span>
          </li>
          <li>
            <span>
              <span style="margin-right: 5px; color: #fd2624" v-if="isEdit"
                >*</span
              >
              技术可行性判断 </span
            ><span v-show="!isEdit" :title="i.feasibilityTxt">{{
              i.feasibilityTxt
            }}</span>
            <span v-show="isEdit">
              <unit-dropdown
                id="feasibility"
                :list="feasibility"
                @change="dropdownReturn"
                :result="form.feasibility"
              ></unit-dropdown>
              <span v-show="error.value === 'feasibility'" class="error">{{
                error.message
              }}</span>
            </span>
          </li>
          <li>
            <span style="height: 71px; ling-height: 1.5">
              <span
                style="margin-right: 5px; color: #fd2624; border-bottom: 0"
                v-if="isEdit"
                >*</span
              >
              技术可行性判断说明 </span
            ><span
              :title="i.feasibilityDesc"
              v-show="!isEdit"
              style="height: 71px; ling-height: 1.5; padding-top: 5px"
              >{{ i.feasibilityDesc }}</span
            >
            <span v-show="isEdit" style="height: 71px; ling-height: 1.5"
              ><el-input
                v-model="form.feasibilityDesc"
                placeholder="请输入"
                :maxlength="500"
                show-word-limit
                @input="error = { value: '', message: '' }"
                :rows="3"
                type="textarea"
              ></el-input>
              <span v-show="error.value === 'feasibilityDesc'" class="error">{{
                error.message
              }}</span>
            </span>
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
        @click="save"
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
   * @param {string} name 通过父级页面的name判断是否为编辑状态  projectEdit/projectView||projectBackView/projectBack
   */
  props: ["data", "name"],
  data() {
    return {
      isEdit: false,
      showEditBtn: true,
      form: {
        tecDifficulty: "",
        tecDifficultyDesc: "",
        feasibility: "",
        feasibilityDesc: "",
      },
      tecDifficulty: [],
      feasibility: [],
      difficultyList: [],
      ajaxIng: false,
      error: {
        value: "",
        message: "",
      },
    };
  },
  watch: {
    data: {
      deep: true,
      handler: function (newV, oldV) {
        this.difficultyList = [];
        (newV.difficultyList ? newV.difficultyList : []).map((item) => {
          if (
            this.userInfo.resourceType === "06" &&
            this.userInfo.staffId === item.technicalDirector
          ) {
            this.difficultyList.push(item);
            if (item.feasibility || item.feasibilityDesc) {
              this.showEditBtn = true;
            } else {
              for (const [k, v] of Object.entries(item.tecDifficultyList)) {
                for (const [ck, cv] of Object.entries(v)) {
                  if (!cv) {
                    this.showEditBtn = false;
                  }
                }
              }
            }
          } else if (this.userInfo.resourceType === "08") {
            item.tecDifficultyList.map((i) => {
              if (this.userInfo.staffId === i.preSaleId) {
                this.data.tecDifficulty = i.tecDifficulty;
                this.data.tecDifficultyTxt = i.tecDifficultyTxt;
                this.data.tecDifficultyDesc = i.tecDifficultyDesc;
                this.data.preSaleName = i.preSaleName;
              }
            });
          }
        });
        if (
          this.userInfo.resourceType !== "06" &&
          this.userInfo.resourceType !== "08"
        ) {
          if (
            newV.difficultyList.every((item) => {
              return item.technicalDirector !== this.userInfo.staffId;
            })
          ) {
            this.difficultyList = newV.difficultyList;
            this.showEditBtn = false;
          } else {
            for (const [k, v] of Object.entries(newV.difficultyList)) {
              if (v.technicalDirector === this.userInfo.staffId) {
                this.difficultyList.push(v);
                for (const [k, v] of Object.entries(this.form)) {
                  this.difficultyList && this.difficultyList.length > 0
                    ? (this.form[k] = this.difficultyList[0][k])
                    : null;
                }
                if (v.feasibility || v.feasibilityDesc) {
                  this.showEditBtn = true;
                } else {
                  for (const [ck, cv] of Object.entries(v.tecDifficultyList)) {
                    for (const [ckey, cval] of Object.entries(cv)) {
                      if (!cval) {
                        this.showEditBtn = false;
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (this.userInfo.resourceType === "08") {
          for (let i in this.form) {
            this.form[i] = this.data[i];
          }
        } else {
          for (const [k, v] of Object.entries(this.form)) {
            this.difficultyList && this.difficultyList.length > 0
              ? (this.form[k] = this.difficultyList[0][k])
              : null;
          }
        }
      },
    },
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
    dropdownReturn(res, key) {
      switch (key) {
        case "tecDifficulty":
          this.form.tecDifficulty = res.value;
          this.error = {
            value: "",
            message: "",
          };
          break;
        case "feasibility":
          this.form.feasibility = res.value;
          this.error = {
            value: "",
            message: "",
          };
          break;
      }
    },
    edit() {
      this.isEdit = true;
    },
    save() {
      if (this.ajaxIng) return;
      if (this.userInfo.resourceType === "08") {
        if (!this.form.tecDifficulty) {
          this.error = {
            value: "tecDifficulty",
            message: "请选择项目交付核心技术难点",
          };
          return;
        }
        if (!this.form.tecDifficultyDesc) {
          this.error = {
            value: "tecDifficultyDesc",
            message: "请输入项目交付核心技术难点说明",
          };
          return;
        }
      } else {
        if (!this.form.feasibility) {
          this.error = {
            value: "feasibility",
            message: "请选择技术可行性判断",
          };
          return;
        }
        if (!this.form.feasibilityDesc) {
          this.error = {
            value: "feasibilityDesc",
            message: "请输入技术可行性判断说明",
          };
          return;
        }
      }
      this.ajaxIng = true;
      let params = { ...this.form };
      params.projId = this.data.projId;
      this.$api.service.project[
        this.userInfo.resourceType === "08"
          ? "savetecdifficulty"
          : "savefeasibility"
      ](params, (res) => {
        this.ajaxIng = false;
        if (res.code === "0") {
          this.$store.commit("alertFn", {
            text: "操作成功！",
            type: "success",
          });
          this.$emit("getList");
          this.isEdit = false;
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
    cancel() {
      this.isEdit = false;
      for (const [k, v] of Object.entries(this.form)) {
        if (this.userInfo.resourceType === "08") {
          this.form[k] = this.data[k];
        } else if (this.userInfo.resourceType === "06") {
          if (this.difficultyList[0][k]) {
            this.form[k] = this.difficultyList[0][k];
          }
        }
      }

      this.error = {
        value: "",
        message: "",
      };
    },
    judgeShow(key) {
      switch (key) {
        case "edit":
          return (
            !this.isEdit &&
            ((this.difficultyList &&
              this.difficultyList.length > 0 &&
              this.showEditBtn) ||
              this.userInfo.resourceType === "08")
          );
      }
    },
    getDict() {
      this.$api.public.dict(
        { codeGroup: "tec_difficulty", pCode: "" },
        (res) => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.tecDifficulty = res.data;
              break;
          }
        }
      );
      this.$api.public.dict({ codeGroup: "feasibility", pCode: "" }, (res) => {
        switch (res.code) {
          case "0":
            this.feasibility = res.data;
            break;
        }
      });
    },
  },
  created() {
    this.getDict();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.difficultyDescription {
  .technicalDirectorBox,
  .presaleBox {
    width: 67%;
    position: relative;
  }
  .preSale {
    ul {
      margin-bottom: 30px;
      li {
        & > span {
          display: inline-block;
          box-sizing: border-box;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          border: 1px solid #333;
          border-bottom: 0;
        }
        & > span:nth-child(1) {
          background-color: #ccc;
          width: 25%;
          text-align: center;
          border-right: 0;
        }
        & > span:nth-child(2),
        & > span:nth-child(3) {
          width: 50%;
          text-align: left;
          padding-left: 20px;
          .el-textarea {
            height: auto;
            vertical-align: top;
            /deep/ .el-textarea__inner {
              min-height: 28px !important;
              max-height: 68px;
              padding: 3px 15px;
              border: 0;
              resize: none;
            }
          }
        }
        & > span:nth-child(3) {
          margin-left: -4px;
          padding-left: 0;
        }
      }
      & > li:last-child {
        span {
          border-bottom: 1px solid #333;
        }
        span:nth-child(2) {
          overflow: auto;
          line-height: 15px;
          &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
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
        }
      }
      .elDropdown {
        /deep/ .el-select {
          vertical-align: middle;
          margin-left: 10px;
          .el-input__inner {
            height: 27px;
          }
          .el-input__icon {
            line-height: 30px;
          }
        }
      }
    }
  }
  .btn {
    text-align: right;
    margin-right: 37%;
    .button {
      margin-top: -150px;
    }
  }
  .error {
    position: absolute;
    bottom: -10px;
    right: 15px;
    z-index: 10;
    height: 25px;
    line-height: 25px;
    color: #fd2624;
    border: 0 !important;
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