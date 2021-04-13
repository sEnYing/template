<template>
  <div class="example">
    <div class="thisTitle">表格组件 el-table</div>
    <div class="box">
      <div class="thisText">
        <span>以下示例具有多选框功能、排序功能、启用状态及hover颜色区分、操作（编辑和删除）按钮颜色区分和对应click事件</span>
        <span>响应式布局、内容过多左右固定中间滚动效果</span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom:20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="编号" width="80" sortable fixed></el-table-column>

        <el-table-column label="启用状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='已启用'">
              <unit-btn text type="success">已启用</unit-btn>
            </div>
            <div v-else>
              <unit-btn text type="error">未启用</unit-btn>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="standards" label="规格" width="80"></el-table-column>
        <el-table-column prop="unit" label="单位" width="80"></el-table-column>

        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <unit-btn text @click="handleEdit(scope.$index, scope.row)">编辑</unit-btn>
            <unit-btn text type="error" @click="handleDelete(scope.$index, scope.row)">删除</unit-btn>
          </template>
        </el-table-column>
      </el-table>

      <textarea v-showcode>
      //模板部分
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom:20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="编号" width="80" sortable fixed></el-table-column>

        <el-table-column label="启用状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='已启用'">
              <unit-btn text type="success">已启用</unit-btn>
            </div>
            <div v-else>
              <unit-btn text type="error">未启用</unit-btn>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="standards" label="规格" width="80"></el-table-column>
        <el-table-column prop="unit" label="单位" width="80"></el-table-column>

        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <unit-btn text @click="handleEdit(scope.$index, scope.row)">编辑</unit-btn>
            <unit-btn text type="error" @click="handleDelete(scope.$index, scope.row)">删除</unit-btn>
          </template>
        </el-table-column>
      </el-table>

	  //js部分
	export default {
		name: "index",
		props: ["dom"],
		components: {},
		data() {
			return {
			tableData: [
				{
					id: 1,
					state: "已启用",
					date: "2016-05-03",
					standards: "5箱/瓶",
					unit: "毫升",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					id: 2,
					state: "已启用",
					date: "2016-05-02",
					standards: "10箱/瓶",
					unit: "升",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					id: 3,
					state: "已启用",
					date: "2016-05-04",
					standards: "15箱/瓶",
					unit: "斤",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					id: 4,
					state: "未启用",
					date: "2016-05-01",
					standards: "20箱/瓶",
					unit: "吨",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					id: 5,
					state: "未启用",
					date: "2016-05-08",
					standards: "25箱/瓶",
					unit: "吨",
					address: "上海市普陀区金沙江路 1518 弄"
				}
			],
			multipleSelection: []
			};
		},
		methods: {
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			},
			toggleSelection(rows) {
        		if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		},
		created() {},
		mounted() {}
		};
      </textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: ["dom"],
  components: {},
  data() {
    return {
      tableData: [
        {
          id: 1,
          state: "已启用",
          date: "2016-05-03",
          standards: "5箱/瓶",
          unit: "毫升",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          state: "已启用",
          date: "2016-05-02",
          standards: "10箱/瓶",
          unit: "升",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 3,
          state: "已启用",
          date: "2016-05-04",
          standards: "15箱/瓶",
          unit: "斤",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 4,
          state: "未启用",
          date: "2016-05-01",
          standards: "20箱/瓶",
          unit: "吨",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 5,
          state: "未启用",
          date: "2016-05-08",
          standards: "25箱/瓶",
          unit: "吨",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: []
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {},
  mounted() {}
};
</script>