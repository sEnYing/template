<template>
	<div class="example">
		<div class="thisTitle">文字样式</div>
		<div class="box">
			<div class="thisText">文字样式
				<span>根据字号不同，行高也不同</span>
			</div>
			<div class="thisEx">
				<div class="divEx divEx1">
					<p class="font12">字体：12px&nbsp;&nbsp;&nbsp;&nbsp;行高：20px&nbsp;&nbsp;&nbsp;&nbsp;类名：.font12</p>
					<p class="font14">字体14px&nbsp;&nbsp;&nbsp;&nbsp;行高22px&nbsp;&nbsp;&nbsp;&nbsp;类名：.font14</p>
					<p class="font16">字体16px&nbsp;&nbsp;&nbsp;&nbsp;行高24px&nbsp;&nbsp;&nbsp;&nbsp;类名：.font16</p>
					<p class="font20">字体20px&nbsp;&nbsp;&nbsp;&nbsp;行高28px&nbsp;&nbsp;&nbsp;&nbsp;类名：.font20</p>
					<p class="font24">字体24px&nbsp;&nbsp;&nbsp;&nbsp;行高32px&nbsp;&nbsp;&nbsp;&nbsp;类名：.font24</p>
				</div>
			</div>
		</div>
		<div class="box">
			<div class="thisText">常用场景</div>
			<div class="thisEx">
				<div class="divEx divEx1">
					<p class="nav-css">顶部导航栏&nbsp;&nbsp;&nbsp;&nbsp;大小：14px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#333333&nbsp;&nbsp;&nbsp;&nbsp;类名：.nav-css</p>
					<p class="aside-first-title">侧边导航栏一级标题&nbsp;&nbsp;&nbsp;&nbsp;大小：medium&nbsp;&nbsp;&nbsp;&nbsp;颜色：#333333&nbsp;&nbsp;&nbsp;&nbsp;类名：.aside-first-title</p>
					<p class="aside-second-title">侧边导航栏二/三级标题&nbsp;&nbsp;&nbsp;&nbsp;大小：14px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#777777&nbsp;&nbsp;&nbsp;&nbsp;类名：.aside-second-title</p>
					<p class="main-title">页面大标题&nbsp;&nbsp;&nbsp;&nbsp;大小：20px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#333333&nbsp;&nbsp;&nbsp;&nbsp;类名：.main-title</p>
					<p class="main-article">正文/表格内容/表单/组件&nbsp;&nbsp;&nbsp;&nbsp;大小：14px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#333333&nbsp;&nbsp;&nbsp;&nbsp;类名：.main-article</p>
					<p class="main-button">表格表头/按钮&nbsp;&nbsp;&nbsp;&nbsp;大小：medium&nbsp;&nbsp;&nbsp;&nbsp;颜色：#333333&nbsp;&nbsp;&nbsp;&nbsp;类名：.main-button</p>
					<p class="main-input-tips">输入框提示文字&nbsp;&nbsp;&nbsp;&nbsp;大小：14px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#c8c8c8&nbsp;&nbsp;&nbsp;&nbsp;类名：.main-input-tips</p>
					<p class="main-extra">面包导航/辅助文字说明&nbsp;&nbsp;&nbsp;&nbsp;大小：12px&nbsp;&nbsp;&nbsp;&nbsp;颜色：#999999&nbsp;&nbsp;&nbsp;&nbsp;类名：.main-extra</p>
				</div>
			</div>
		</div>
		<div class="thisText"></div>
		<div class="thisText"><span>css代码如下：</span></div>
      	<textarea v-showcode>
//文字样式
.font12 {
  font-size: 12px;
  line-height: 20px;
}
.font14 {
  font-size: 14px;
  line-height: 22px;
}
.font16 {
  font-size: 16px;
  line-height: 24px;
}
.font20 {
  font-size: 20px;
  line-height: 28px;
}
.font24 {
  font-size: 24px;
  line-height: 32px;
}

//常用场景
.nav-css,
.main-article {
  font-size: 14px;
  color: #333333;
}
.aside-first-title，.main-button {
  font-size: medium;
  color: #333333;
}
.aside-second-title {
  font-size: 14px;
  color: #777777;
}
.main-title {
  font-size: 20px;
  color: #333333;
}
.main-input-tips {
  font-size: 14px;
  color: #c8c8c8;
}
.main-extra {
  font-size: 12px;
  color: #999999;
} 
		</textarea>
	</div>
</template>

<script>
export default {
	name: "index",
	props: ["dom"],
	components: {},
	data() {
		return {
		
		};
	},
	methods: {},
	created() {},
	mounted() {}
};
</script>

<style scoped>
.title {
	padding: 8px 0;
	font-size: 16px;
	line-height: 24px;
}
.example {
  	line-height: 30px;
}
</style>