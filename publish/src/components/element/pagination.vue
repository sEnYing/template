<template>
  <div class="example">
    <div class="thisTitle">页码组件 el-pagination</div>
    <div class="box">
		<div class="thisText">
			<span>主要以Element UI组件为主</span>
		</div>
		<p class="thisText">1.带有背景颜色</p>
		<div class="thisEx"><el-pagination background layout="prev, pager, next" :total="1000"></el-pagination></div>

		<p class="thisText">2.大于7页时的效果</p>
		<div class="thisEx"><el-pagination layout="prev, pager, next" :total="1000"></el-pagination></div>

		<p class="thisText">3.小型分页</p>
		<div class="thisEx"><el-pagination small layout="prev, pager, next" :total="50"></el-pagination></div>

		<p class="thisText">4.完整功能</p>
		<div class="thisEx"><el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage1"
			:page-sizes="[100, 200, 300, 400]"
			:page-size="100"
			layout="total, sizes, prev, pager, next, jumper"
			:total="400"
		></el-pagination></div>

		<p class="thisText">5.自定义样式：.troilaPage</p>
		<div class="thisEx"><el-pagination class="troilaPage" hide-on-single-page  layout="prev, pager, next, total" :total="100" :page-size='10' :current-page='1' @current-change='currentChange' prev-text="上一页" next-text="下一页"></el-pagination></div>

      <textarea v-showcode>
<template>
	<p class="thisText">1.带有背景颜色</p>
	<el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>

	<p class="thisText">2.大于7页时的效果</p>
	<el-pagination layout="prev, pager, next" :total="1000"></el-pagination>

	<p class="thisText">3.小型分页</p>
	<el-pagination small layout="prev, pager, next" :total="50"></el-pagination>

	<p class="thisText">4.完整功能</p>
	<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="currentPage1"
		:page-sizes="[100, 200, 300, 400]"
		:page-size="100"
		layout="total, sizes, prev, pager, next, jumper"
		:total="400"
	></el-pagination>
	<p class="thisText">5.自定义样式：.troilaPage</p>
	<el-pagination 
		class="troilaPage" 
		hide-on-single-page  
		layout="prev, pager, next, total" 
		:total="100" 
		:page-size='10' 
		:current-page='pageBase'
		@current-change='currentChange' 
		prev-text="上一页" 
		next-text="下一页"
	></el-pagination>
</template>
//js
<script>
	export default {
		name: "index",
		props: ["dom"],
		components: {},
		data() {
			return {
				currentPage1: 4,
				pageBase:1,
			};
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			currentChange(page){
				this.pageBase=page;
				this.$emit('pagechange',page)
			},
		},
		created() {},
		mounted() {}
	};
</script>
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
		currentPage1: 4,
		pageBase:1,
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
	},
	currentChange(page){
		this.pageBase=page;
		this.$emit('pagechange',page)
	},
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.thisEx+.thisText{
	padding-top: 10px;
}
.showCode{
	margin-top: 20px;
}
</style>