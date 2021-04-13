<!--
 * @Descripttion:
 * @Author: SongEnYing
 * @Date: 2020-09-30 16:59:47
 * @LastEditors:
 * @LastEditTime: 2020-09-30 17:01:55
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
console.log(process);

@Options({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
