<!--
 * @Descripttion:
 * @Author: SongEnYing
 * @Date: 2021-02-04 17:23:22
 * @LastEditors: SongEnYing
 * @LastEditTime: 2021-02-05 14:13:56
-->
<template>
  <el-container style="position: relative">
    <div class="background"></div>
    <el-header>
      <unit-header></unit-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <unit-aside></unit-aside>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import unitHeader from "@/components/common/mainHeader.vue";
import unitAside from "@/components/common/mainAside.vue";
import Vue from "vue";
export default Vue.extend({
  name: "layOut",
  components: {
    unitAside,
    unitHeader,
  },
});
</script>

<style>
.background {
  width: 100vw;
  height: 325px;
  position: absolute;
  top: 0;
  background-image: linear-gradient(#1a2a60, #eceef6);
  z-index: 1;
}
.el-header {
  padding: 0;
  height: 78px !important;
  line-height: 78px;
  background: transparent;
  color: #fff;
  z-index: 2;
}
.el-aside {
  margin: 0 8px 0 15px;
  width: 192px !important;
}
.el-main {
  background-color: #fff;
  color: #333;
  margin-right: 15px;
}
.el-aside,
.el-main {
  z-index: 2;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
body > .el-container {
  margin-bottom: 40px;
}
</style>
