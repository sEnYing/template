<template>
  <div>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="3">
        <div class="grid-content bg-purple left">
          <img src="" alt="">
          <h1>千家MIS</h1>
          <h5>至哲篇</h5>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple right">
          <span class="el-icon-erp-smallbell">
            <span>99</span>
          </span>
          <span class="el-icon-erp-backlog1">
            <span>99</span>
          </span>
          <span class="el-icon-erp-My"></span>
          <span class="el-icon-erp-minimize"></span>
          <span class="el-icon-erp-Close"></span>
        </div>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
import "../style/helloworld/helloworld.css";
export default {};
</script>

<style scoped lang="less">
  
</style>
