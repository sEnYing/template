<template>
  <div>
    <unit-loading :loading="loading" v-if="loading"></unit-loading>
    <ul class="formUl visitDialog">
      <li class="small">
        <span class="formTitle">销售：</span>
        <div>{{result.creatorName}}</div>
      </li>
      <li class="small">
        <span class="formTitle">拜访方式：</span>
        <div>{{result.visitTypeTxt}}</div>
      </li>
      <li class="small" v-if="result.visitType!=='04'">
        <span class="formTitle">签到地址：</span>
        <div>{{result.signAddress|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">日期时间：</span>
        <div>{{($pubfunc.TimeTransform('YYYY年MM月DD日',result.date)+" "+$pubfunc.transTime(result.time))|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">客户名称：</span>
        <div>{{result.customerName|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">项目名称：</span>
        <div>{{result.projName|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">拜访对象：</span>
        <div>{{result.contactName}}</div>
      </li>
      <li class="small">
        <span class="formTitle">职务：</span>
        <div>{{result.position|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">地区（城市）：</span>
        <div>{{result.cityName|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">项目机会说明：</span>
        <div class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.projChanceDesc,1))"></div>
      </li>
      <li class="small">
        <span class="formTitle">是否提供技术支持：</span>
        <div
          class="contactCon"
        >{{(result.tecSupport==='1'?'是':(result.tecSupport==='0'?'否':''))|emptyTxt}}</div>
      </li>
      <li class="small">
        <span class="formTitle">技术支持说明：</span>
        <div class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.tecSupportDesc,1))"></div>
      </li>
      <li class="small">
        <span class="formTitle">拜访情况说明：</span>
        <div class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.description,1))"></div>
      </li>
      <li class="btnBoxLi">
        <div class="btnBox">
          <unit-btn @click="close" text="关闭"></unit-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'showVisit',
  props: ['data'],
  data() {
    return {
      edit: false,
      result: {},
      loading: false,
    }
  },
  inject: ['close'],
  computed: {
    time() {
      let time = this.$pubfunc.getTimeNum();
      // console.log(time)
      return { date: this.$pubfunc.TimeTransform('YYYY/MM/DD', time), time: this.$pubfunc.TimeTransform('hh:mm', time), }
    },
  },
  watch: {
    'result.tecSupport'() { this.clearErr('tecSupport') }
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    }
  },
  methods: {
    emptyTxt(v) {
      return v ? v : '--'
    },
    getDropData() {
      this.loading = true;
      this.$api.service.visit.detailRecord({ recordId: this.data.recordId }, res => {
        this.loading = false;
        console.log(res);

        switch (res.code) {
          case '0':
            this.result = res.data;
            this.$emit('ok');
            break;
          default:
            this.$message({
              message: res.message,
              type: 'error'
            });
            this.close();
        }
      })
    },
  },
  created() {
    if (!this.data.recordId) {
      this.close();
    }
    this.getDropData();
    this.$emit('ok');
  },
}
</script>

<style scoped>
.formMainCont {
  font-size: 0;
}
.formUl {
  display: inline-block;
  width: 100%;
  vertical-align: top;
}
.formUl > li > span.formTitle {
  width: 150px;
}
</style>
<style>
.visitDialog > li > div:not(.btnBox),
.visitDialog > li input,
.visitDialog > li .el-select,
.visitDialog > li .el-cascader {
  width: 340px !important;
  color: #484b5c;
}
</style>
