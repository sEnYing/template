<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-11-19 14:01:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-30 09:37:56
-->
<template>
  <div class="addResource" v-loading="reloading">
    <div class="fillBox changeFormW">
      <div class="boxTitle titleFix">
        <i class="customer_icon"></i>
        <span>创建项目资源及费用流程</span>
        <unit-btn type="plain right" text="取消" @click="cancel"></unit-btn>
        <!-- <unit-btn
          type="plain right"
          :loading="loading"
          text="保存草稿"
          @click="submit('save')"
        ></unit-btn> -->
        <unit-btn
          type="right"
          :loading="loading"
          text="提交"
          @click="submit('submit')"
        ></unit-btn>
      </div>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="form">流程表单</el-menu-item>
            <el-menu-item index="picture">流程图</el-menu-item>
          </el-menu>
          <div class="form" v-show="activeIndex === 'form'">
            <process-form
              ref="processForm"
              :data="data"
              :type="type"
              @change="getForm"
            ></process-form>
          </div>
          <div class="picture" v-show="activeIndex === 'picture'">
            <div>
              <img src="../../assets/images/process.png" alt="" />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import processForm from "./components/processForm";
export default {
  name: "addResource",
  components: {
    processForm,
  },
  data() {
    return {
      id: null,
      type: null,
      data: {},
      activeIndex: "form",
      loading: false,
      reloading: false,
      form: null,
    };
  },
  methods: {
    /**
     * @param {object} v 表单数据变化后，传出的表单值
     */
    getForm(v) {
      this.form = v;
    },
    /**
     * @param {string} key 切换后的选中页的key
     * @param {Array} keyPath 切换后的选中页的[key]
     */
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    submit(key) {
      if (this.loading) return;
      this.$refs.processForm.validateChange();
      if (!this.form) return;
      this.form.projId = this.data.projId;
      Reflect.deleteProperty(this.form, "preSaleIdsArr");
      this.form.reserveLaborCost = this.form.reserveLaborCost
        .split(",")
        .join("");
      this.form.reserveTravelExpense = this.form.reserveTravelExpense
        .split(",")
        .join("");
      this.loading = true;
      this.$api.service.project.resourceApply(this.form, (res) => {
        this.loading = false;
        switch (res.code) {
          case "0":
            this.$store.commit("alertFn", {
              text: "操作成功",
              type: "success",
            });
            this.cancel();
            break;
          default:
            res.message
              ? this.$store.commit("alertFn", {
                  text: res.message,
                  type: "error",
                })
              : null;
            break;
        }
      });
    },
    getDetail() {
      this.reloading = true;
      this.$api.service.project.detail({ projId: this.id }, (res) => {
        this.reloading = false;
        if (res.code === "0") {
          this.data = res.data;
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
      this.$router.push({ path: "/project" });
    },
  },
  created() {
    this.id = this.$route.query.projId;
    this.type = this.$route.query.type;
    this.getDetail();
  },
};
</script>

<style scoped lang="scss">
.addResource {
  .contentFix {
    .boxRel {
      min-height: 670px;
      .el-menu {
        .el-menu-item {
          padding: 10px 7px;
          margin-right: 57px;
        }
      }
    }
  }
}
</style>