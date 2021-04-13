<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
    <div class="norgress" id="norgress"></div>
  </div>
</template>
<script>
export default {
  name: "App",
  components: {},
};
</script>
<style lang="scss" scoped>
#app {
  font-family: "MicrosoftYaHei", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #121634;
  width: 100%;
  height: 100%;
  background-color: #e9eef3;
}
</style>
