<template>
  <div class="processList">
    <div class="listBox clearfix">
      <div v-for="(item, index) in data" :key="index" class="list-item">
        <div class="leftBox">
          <div class="round">
            <div class="sonRound"></div>
          </div>
          <div class="line" v-if="index !== data.length - 1"></div>
        </div>
        <div class="rightBox">
          <div class="operate">
            <span>{{ item.operateUserName }}</span
            ><span>{{ item.operateDep }}</span>
          </div>
          <div class="receiver">
            <span v-if="item.receiver">接收人：{{ item.receiver }}</span>
          </div>
          <div class="description">
            <span>{{
              $pubfunc.TimeTransform(
                "YYYY-MM-DD hh:mm:ss",
                new Date(
                  $pubfunc.timestampToTime(item.operateTime).Year,
                  $pubfunc.timestampToTime(item.operateTime).Month - 1,
                  $pubfunc.timestampToTime(item.operateTime).Day,
                  $pubfunc.timestampToTime(item.operateTime).Hour,
                  $pubfunc.timestampToTime(item.operateTime).Minite,
                  $pubfunc.timestampToTime(item.operateTime).Second
                )
              ) ||
              $pubfunc.TimeTransform(
                "YYYY-MM-DD hh:mm:ss",
                new Date(
                  $pubfunc.timestampToTime(item.createTime).Year,
                  $pubfunc.timestampToTime(item.createTime).Month - 1,
                  $pubfunc.timestampToTime(item.createTime).Day,
                  $pubfunc.timestampToTime(item.createTime).Hour,
                  $pubfunc.timestampToTime(item.createTime).Minite,
                  $pubfunc.timestampToTime(item.createTime).Second
                )
              )
            }}</span
            ><span
              :style="{
                color:
                  item.approveStatus && item.approveStatus === '3'
                    ? '#d9001b'
                    : 'unset',
              }"
              >{{ item.operateDesc }}</span
            >
            <span
              v-if="item.approveStatus && item.approveStatus === '3'"
              style="color: #d9001b"
              >不通过原因：{{ item.suggestion }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "processList",
  /**
   * @param {object[]} data 流程列表数组
   */
  props: ["data"],
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style scoped lang="scss">
.processList {
  box-shadow: 0px 0px 6px 1px rgba(70, 128, 244, 0.11);
  padding: 51px 122px 50px 30px;
  .listBox {
    .list-item {
      min-height: 100px;
      display: flex;
      position: relative;
      .leftBox {
        width: 2%;
        height: 100%;
        position: absolute;
        .round {
          width: 18px;
          height: 18px;
          background: rgba(70, 128, 244, 0.67);
          opacity: 0.67;
          border-radius: 50%;
          margin: 0 auto;
          position: relative;
          .sonRound {
            width: 10px;
            height: 10px;
            background: #4680f4;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .line {
          height: calc(100% - 18px);
          width: 1px;
          border-right: 1px dashed #4680f4;
          margin: 0 auto;
        }
      }
      .rightBox {
        width: 97%;
        display: flex;
        margin-top: 3px;
        margin-left: 3%;
        & > div:nth-child(1) {
          width: 40%;
          & > span {
            display: block;
          }
          & > span:nth-child(1) {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #4680f4;
            margin-bottom: 9px;
          }
          & > span:nth-child(2) {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #1e1e1e;
          }
        }
        & > div:nth-child(2) {
          width: 40%;
          margin-top: 23px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #1e1e1e;
        }
        & > div:nth-child(3) {
          margin-top: 23px;
          width: 20%;
          & > span {
            display: block;
          }
          & > span:nth-child(1) {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #1e1e1e;
            margin-bottom: 6px;
          }
          & > span:nth-child(2) {
            margin-top: 10px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #4680f4;
          }
          & > span:nth-child(3) {
            margin-top: 10px;
          }
        }
        .description {
        }
      }
    }
  }
}
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.clearfix {
  *zoom: 1;
}
</style>