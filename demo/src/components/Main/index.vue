<template>
  <div class="main">
    <div class="nameBox">
      <span class="date">日 期</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
      ></el-date-picker>
      <span class="name">姓 名</span>
      <el-input placeholder="输入姓名搜索" class="el-input"></el-input>
      <span class="name">内容</span>
      <el-input placeholder="输入姓名搜索" class="el-input"></el-input>
    </div>
    <div class="btnBox">
      <el-button type="primary">查询</el-button>
      <el-button>清空</el-button>
    </div>
    <div class="add">
      <el-button type="primary">新增</el-button>
    </div>
  <Form></Form>
</div>
</template>

<script>
import "../../style/helloworld/helloworld_child/helloworld_child.less";
import Form from '../Form/form'
export default {
  data() {
    return {
      value1: "",
      input: "",
    };
  },

  
  components:{
    Form
  }
};
</script>

<style>
</style>