<template>
  <div class="resourceDetail fillBox projectForm_">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>项目资源及费用流程-YLX20200924001{{ data.applyNo }}</span>
      <unit-btn type="plain right" text="返回" @click="cancel"></unit-btn>
    </div>
    <div class="contentFix">
      <el-scrollbar class="unitScrollbar" ref="scrollbar">
        <div class="topBox boxRound">
          <div>
            项目名称/售前项目名称<span>
              <unit-popover
                :content="data.relaProjName ? data.relaProjName : ''"
              ></unit-popover>
            </span>
          </div>
          <div>
            <i class="nbsp"></i>项目编号
            <span>{{ data.relaProjNo }}</span>
          </div>
          <div>
            预留项目售前费用合计
            <span
              >{{
                $pubfunc.TimeTransform(
                  "YYYY年MM月DD日",
                  data.reservePreSaleCost
                )
              }}(元)</span
            >
          </div>
          <div>
            实际项目售前费用合计
            <span
              >{{
                $pubfunc.TimeTransform(
                  "YYYY年MM月DD日",
                  data.reservePreSaleCost
                )
              }}(元)</span
            >
          </div>
          <div>
            审批状态<span>{{ data.projStatus }}</span>
          </div>
          <div>
            销售<span>{{ data.preSaleName }}</span>
          </div>
        </div>
        <div class="contentBox">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="process">流程表单</el-menu-item>
            <el-menu-item index="picture">流程图</el-menu-item>
            <!-- <el-menu-item index="explain">技术难点说明</el-menu-item> -->
          </el-menu>
          <div class="process" v-show="activeIndex === 'process'">
            <process-form :data="data" @change="getForm"></process-form>
            <process-list :data="data.taskList"></process-list>
          </div>
          <div class="picture" v-show="activeIndex === 'picture'">picture</div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import unitPopover from "@/unit/components/popover";
import processForm from "./components/processForm";
import processList from "./components/processList";
export default {
  name: "resourceDetail",
  components: {
    unitPopover,
    processForm,
    processList,
  },
  data() {
    return {
      processId: null,
      data: {
        taskList: [
          {
            operateUser: "张三",
            operateDep: "北京系统集成",
            operateTime: "2020-10-01 08:00:00",
            operateDesc: "[申请人/提交]",
            receiver: "吴军",
          },
          {
            operateUser: "张三2",
            operateDep: "北京系统集成",
            operateTime: "2020-10-01 08:00:00",
            operateDesc: "[申请人/提交]",
            receiver: "吴军",
          },
          {
            operateUser: "张三3",
            operateDep: "北京系统集成",
            operateTime: "2020-10-01 08:00:00",
            operateDesc: "[申请人/提交]",
            receiver: "吴军",
          },
        ],
      },
      form: {},
      activeIndex: "process",
    };
  },
  methods: {
    /**
     * @param {object} v 表单数据变化后，传出的表单值
     */
    getForm(v) {
      console.log(v);
      this.form = { ...v };
    },
    /**
     * @param {string} key 切换后的选中页的key
     * @param {Array} keyPath 切换后的选中页的[key]
     */
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    cancel() {
      this.$router.push({ path: "/project" });
    },
    getDetail() {
      this.$api.service.project.resourceDetail(
        { processId: this.processId },
        (res) => {
          switch (res.code) {
            case "0":
              this.data = res.data;
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
        }
      );
    },
  },
  created() {
    this.processId = this.$route.query.processId;
    this.getDetail();
  },
};
</script>

<style scoped>
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
  width: 16%;
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
</style>
<style lang="scss" scoped>
.resourceDetail {
  .contentFix {
    .contentBox {
      box-shadow: 0px 0px 6px 1px rgba(70, 128, 244, 0.11);
      padding: 0 27px 38px 28px;
      .el-menu {
        .el-menu-item {
          padding: 10px 7px;
          margin-right: 57px;
          height: 43px;
          line-height: 35px;
        }
      }
      .process {
        margin-top: 65px;
        .processForm {
          /deep/ .formbox {
            .four {
              & > span:nth-child(1),
              & > span:nth-child(3) {
                width: 20%;
                background-color: #e7f3fc;
              }
              & > span:nth-child(2),
              & > span:nth-child(4) {
                width: 30%;
              }
            }
            .two {
              & > span:nth-child(1) {
                width: calc(20% - 1px);
                background-color: #e7f3fc;
              }
              & > span:nth-child(2) {
                width: calc(80% - 1px);
              }
            }
          }
        }
      }
    }
    .processBox {
      width: 100%;
      margin-top: 26px;
      box-shadow: 0px 0px 6px 1px rgba(70, 128, 244, 0.11);
    }
  }
}
</style>