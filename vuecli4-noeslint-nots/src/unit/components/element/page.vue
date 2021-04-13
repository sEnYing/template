<template>
  <div class="pageBox">
    <div v-if="total>(limit?limit:10)">
      <el-pagination
        hide-on-single-page
        layout="prev, pager, next, total"
        :total="total"
        :page-size="(limit?limit:10)"
        :current-page="page?page:pageBase"
        @current-change="currentChange"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: 'ele_Page',
  props: ['total', 'page', 'limit'],
  data() {
    return {
      pageBase: 1,
    }
  },
  methods: {
    currentChange(page) {
      this.pageBase = page;
      this.$emit('pagechange', page)
    },
  }
}
</script>


<style scoped>
.pageBox {
  padding: 16px 0 0px;
  text-align: left;
}
.pageBox > div {
  height: 30px;
}
</style>

