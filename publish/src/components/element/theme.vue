<template>
	<div class="content">
		<div class="thisTitle">更改主题颜色</div>
		<div class="box">
			<div class="thisText">
				<i class="must"></i>清除默认格式css：&nbsp;&nbsp;&nbsp;&nbsp;main.css<br>
				<i class="must"></i>开发规范css：&nbsp;&nbsp;&nbsp;&nbsp;public.css<br>
				<i class="must"></i>element相关css：&nbsp;&nbsp;&nbsp;&nbsp;elementChange.css<br>
			</div>
			<div class="thisText">
				更改主题色网址:
				<unit-btn text @click='clickBtn'>https://element.eleme.cn/2.13/#/zh-CN/theme</unit-btn>
				<span>点击官方主题的 “ 查看 ” 按钮，进入如下页面</span>
				<span>在右侧设置需要的颜色，设置完成后点击右上角下载，得到style.zip压缩包，把压缩包里面的theme文件夹放到/static/目录下，在index.html中引用index.css文件即可。</span>
			</div>
			<img :src="imgURL" alt />
			<textarea v-showcode>
//main.js

import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import './assets/css/main.css'
import './assets/css/public.css'
import './assets/css/elementChange.css'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
}).$mount('#app')
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
		imgURL: require("../../assets/images/theme.png")
		};
	},
	methods: {
		clickBtn(){
			window.open("https://element.eleme.cn/2.13/#/zh-CN/theme")
		},
	},
	created() {},
	mounted() {}
};
</script>

<style scoped>
.thisText>button{
	font-size: 16px;
}
.title {
  padding: 0px;
  font-size: 16px;
  line-height: 24px;
}
.title > span {
  display: block;
  font-size: 14px;
  line-height: 22px;
  padding: 4px 0;
  color: #838a9d;
}
.describe {
  font-size: 14px;
  line-height: 22px;
  color: #838a9d;
  text-indent: 2em;
}
img {
  display: block;
  width: 640px;
  margin: 20px 0;
}
</style>