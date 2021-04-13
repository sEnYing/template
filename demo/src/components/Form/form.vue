<template>
  <div>
    <el-table :data="tableData" style="width: 100%" ref="multipleTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(item,index) of headList"
        :key="index"
        :label="item.name"
        :prop="item.value"
      ></el-table-column>
      <el-table-column label="操作" width="120">
        <a href="#">修改</a>
        <a href="#">删除</a>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="sizes, prev, pager, next"
      :total="2019"
      prev-text="上一页"
      next-text="下一页"
    ></el-pagination>
  </div>
</template>

<script>
import Index from "../../domain/index/index";
const indexDomain = new Index();

export default {
  data() {
    return {
      currentPage2: 2,
      pageInfo:{
        page:1,
        size:20
      },
      multipleSelection: [],
      headList: [],
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },

  methods: {
    async getHead() {
      let result = await indexDomain.getHead();
      const { headList } = result;
      this.headList = headList;
    }
  },
  created() {
    this.getHead();
  }
};
</script>

<style>
</style>