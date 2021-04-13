<template>
	<div class="example">
		<div class="thisTitle">文字/组件颜色</div>
		<div class="box">
			<div class="thisEx">
				<div class="divEx divEx1">
					<p class="main-color"><span>主色/品牌色</span><a>#4d5aff</a>类名：.main-color</p>
					<p class="green"><span>成功反馈</span><a>#00cd3e</a>类名：.green</p>
					<p class="orange"><span>警示反馈</span><a>#ffab14</a>类名：.orange</p>
					<p class="red"><span>错误/异常</span><a>#ff4247</a>类名：.red</p>
					<p class="blue"><span>链接</span><a>#3299eb</a>类名：.blue</p>
					<p class="first-title"><span>一级文字信息<br>正文<br>标题</span><a>#3c4353</a>类名：.first-title</p>
					<p class="second-title"><span>二级文字信息<br>不可修改文字</span><a>#838a9d</a>类名：.second-title</p>
					<p class="tips"><span>提示信息文字<br>次要文字<br>三级<br>副文</span><a>#a6aabb</a>类名：.tips</p>
				</div>
			</div>
			<div class="thisText"></div>
			<div class="thisText"><span>css样式如下</span></div>
			<textarea v-showcode>
.main-color {
  color: #4d5aff;
}
.green {
  color: #00cd3e;
}
.orange {
  color: #ffab14;
}
.red {
  color: #ff4247;
}
.blue {
  color: #3299eb;
}

.first-title {
  color: #3c4353;
}
.second-title {
  color: #838a9d;
}
.tips {
  color: #a6aabb;
}
			</textarea>
		</div>
		<div class="box">
			<div class="thisText">常用色系参考</div>
			<div class="thisEx">
				<div class="cardBody">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>1.红色系</span>
						</div>
						<ul class="text item">
							<li class="red-1">1.颜色：#fef3ef&nbsp;&nbsp;&nbsp;类名：.red-1</li>
							<li class="red-2">2.颜色：#ffcdc7&nbsp;&nbsp;&nbsp;类名：.red-2</li>
							<li class="red-3">3.颜色：#fea59e&nbsp;&nbsp;&nbsp;类名：.red-3</li>
							<li class="red-4">4.颜色：#ff7975&nbsp;&nbsp;&nbsp;类名：.red-4</li>
							<li class="red-5">5.颜色：#ff4e4f&nbsp;&nbsp;&nbsp;类名：.red-5</li>
							<li class="red-6">6.颜色：#f5232c&nbsp;&nbsp;&nbsp;类名：.red-6</li>
							<li class="red-7">7.颜色：#cf1422&nbsp;&nbsp;&nbsp;类名：.red-7</li>
							<li class="red-8">8.颜色：#a70819&nbsp;&nbsp;&nbsp;类名：.red-8</li>
							<li class="red-9">9.颜色：#810213&nbsp;&nbsp;&nbsp;类名：.red-9</li>
							<li class="red-10">10.颜色：#5d0111&nbsp;&nbsp;&nbsp;类名：.red-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>2.橘红系</span>
						</div>
						<ul class="text item">
							<li class="volcano-1">1.颜色：#fef4e8&nbsp;&nbsp;&nbsp;类名：.volcano-1</li>
							<li class="volcano-2">2.颜色：#ffd9bf&nbsp;&nbsp;&nbsp;类名：.volcano-2</li>
							<li class="volcano-3">3.颜色：#febc95&nbsp;&nbsp;&nbsp;类名：.volcano-3</li>
							<li class="volcano-4">4.颜色：#f49d6d&nbsp;&nbsp;&nbsp;类名：.volcano-4</li>
							<li class="volcano-5">5.颜色：#ff7b4f&nbsp;&nbsp;&nbsp;类名：.volcano-5</li>
							<li class="volcano-6">6.颜色：#fa551b&nbsp;&nbsp;&nbsp;类名：.volcano-6</li>
							<li class="volcano-7">7.颜色：#d4390c&nbsp;&nbsp;&nbsp;类名：.volcano-7</li>
							<li class="volcano-8">8.颜色：#ad2101&nbsp;&nbsp;&nbsp;类名：.volcano-8</li>
							<li class="volcano-9">9.颜色：#861400&nbsp;&nbsp;&nbsp;类名：.volcano-9</li>
							<li class="volcano-10">10.颜色：#610c00&nbsp;&nbsp;&nbsp;类名：.volcano-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>3.橙色系</span>
						</div>
						<ul class="text item">
							<li class="orange-1">1.颜色：#fff9e6&nbsp;&nbsp;&nbsp;类名：.orange-1</li>
							<li class="orange-2">2.颜色：#ffe7ba&nbsp;&nbsp;&nbsp;类名：.orange-2</li>
							<li class="orange-3">3.颜色：#ffd691&nbsp;&nbsp;&nbsp;类名：.orange-3</li>
							<li class="orange-4">4.颜色：#ffc169&nbsp;&nbsp;&nbsp;类名：.orange-4</li>
							<li class="orange-5">5.颜色：#ffaa40&nbsp;&nbsp;&nbsp;类名：.orange-5</li>
							<li class="orange-6">6.颜色：#fb8d15&nbsp;&nbsp;&nbsp;类名：.orange-6</li>
							<li class="orange-7">7.颜色：#d46c08&nbsp;&nbsp;&nbsp;类名：.orange-7</li>
							<li class="orange-8">8.颜色: #ad4f00&nbsp;&nbsp;&nbsp;类名：.orange-8</li>
							<li class="orange-9">9.颜色：#863900&nbsp;&nbsp;&nbsp;类名：.orange-9</li>
							<li class="orange-10">10.颜色：#612600&nbsp;&nbsp;&nbsp;类名：.orange-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>4.金黄系</span>
						</div>
						<ul class="text item">
							<li class="gold-1">1.颜色：#fffce6&nbsp;&nbsp;&nbsp;类名：.gold-1</li>
							<li class="gold-2">2.颜色：#fff2b8&nbsp;&nbsp;&nbsp;类名：.gold-2</li>
							<li class="gold-3">3.颜色：#ffe68f&nbsp;&nbsp;&nbsp;类名：.gold-3</li>
							<li class="gold-4">4.颜色：#ffd766&nbsp;&nbsp;&nbsp;类名：.gold-4</li>
							<li class="gold-5">5.颜色：#ffc63c&nbsp;&nbsp;&nbsp;类名：.gold-5</li>
							<li class="gold-6">6.颜色：#faae15&nbsp;&nbsp;&nbsp;类名：.gold-6</li>
							<li class="gold-7">7.颜色：#d48905&nbsp;&nbsp;&nbsp;类名：.gold-7</li>
							<li class="gold-8">8.颜色：#ad6a00&nbsp;&nbsp;&nbsp;类名：.gold-8</li>
							<li class="gold-9">9.颜色：#874f00&nbsp;&nbsp;&nbsp;类名：.gold-9</li>
							<li class="gold-10">10.颜色：#613500&nbsp;&nbsp;&nbsp;类名：.gold-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>5.黄色系</span>
						</div>
						<ul class="text item">
							<li class="yellow-1">1.颜色：#feffe6&nbsp;&nbsp;&nbsp;类名：.yellow-1</li>
							<li class="yellow-2">2.颜色：#ffffb8&nbsp;&nbsp;&nbsp;类名：.yellow-2</li>
							<li class="yellow-3">3.颜色：#fffc8e&nbsp;&nbsp;&nbsp;类名：.yellow-3</li>
							<li class="yellow-4">4.颜色：#fff666&nbsp;&nbsp;&nbsp;类名：.yellow-4</li>
							<li class="yellow-5">5.颜色：#ffed3c&nbsp;&nbsp;&nbsp;类名：.yellow-5</li>
							<li class="yellow-6">6.颜色：#fadd13&nbsp;&nbsp;&nbsp;类名：.yellow-6</li>
							<li class="yellow-7">7.颜色：#d3b206&nbsp;&nbsp;&nbsp;类名：.yellow-7</li>
							<li class="yellow-8">8.颜色：#ac8c00&nbsp;&nbsp;&nbsp;类名：.yellow-8</li>
							<li class="yellow-9">9.颜色：#866800&nbsp;&nbsp;&nbsp;类名：.yellow-9</li>
							<li class="yellow-10">10.颜色：#614800&nbsp;&nbsp;&nbsp;类名：.yellow-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>6.黄绿系</span>
						</div>
						<ul class="text item">
							<li class="lime-1">1.颜色：#fcffe5&nbsp;&nbsp;&nbsp;类名：.lime-1</li>
							<li class="lime-2">2.颜色：#feffb7&nbsp;&nbsp;&nbsp;类名：.lime-2</li>
							<li class="lime-3">3.颜色：#eaff8f&nbsp;&nbsp;&nbsp;类名：.lime-3</li>
							<li class="lime-4">4.颜色：#d2f361&nbsp;&nbsp;&nbsp;类名：.lime-4</li>
							<li class="lime-5">5.颜色：#b9e737&nbsp;&nbsp;&nbsp;类名：.lime-5</li>
							<li class="lime-6">6.颜色：#a0d911&nbsp;&nbsp;&nbsp;类名：.lime-6</li>
							<li class="lime-7">7.颜色：#7cb404&nbsp;&nbsp;&nbsp;类名：.lime-7</li>
							<li class="lime-8">8.颜色：#5a8d00&nbsp;&nbsp;&nbsp;类名：.lime-8</li>
							<li class="lime-9">9.颜色：#3f6701&nbsp;&nbsp;&nbsp;类名：.lime-9</li>
							<li class="lime-10">10.颜色：#254101&nbsp;&nbsp;&nbsp;类名：.lime-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>7.绿色系</span>
						</div>
						<ul class="text item">
							<li class="green-1">1.颜色：#f5ffed&nbsp;&nbsp;&nbsp;类名：.green-1</li>
							<li class="green-2">2.颜色：#d9f8bf&nbsp;&nbsp;&nbsp;类名：.green-2</li>
							<li class="green-3">3.颜色：#b7eb8f&nbsp;&nbsp;&nbsp;类名：.green-3</li>
							<li class="green-4">4.颜色：#94df63&nbsp;&nbsp;&nbsp;类名：.green-4</li>
							<li class="green-5">5.颜色：#72d13d&nbsp;&nbsp;&nbsp;类名：.green-5</li>
							<li class="green-6">6.颜色：#52c51a&nbsp;&nbsp;&nbsp;类名：.green-6</li>
							<li class="green-7">7.颜色：#389e0d&nbsp;&nbsp;&nbsp;类名：.green-7</li>
							<li class="green-8">8.颜色：#227903&nbsp;&nbsp;&nbsp;类名：.green-8</li>
							<li class="green-9">9.颜色：#125300&nbsp;&nbsp;&nbsp;类名：.green-9</li>
							<li class="green-10">10.颜色：#092c00&nbsp;&nbsp;&nbsp;类名：.green-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>8.青色系</span>
						</div>
						<ul class="text item">
							<li class="cyan-1">1.颜色：#e6fffa&nbsp;&nbsp;&nbsp;类名：.cyan-1</li>
							<li class="cyan-2">2.颜色：#b5f6eb&nbsp;&nbsp;&nbsp;类名：.cyan-2</li>
							<li class="cyan-3">3.颜色：#86eadd&nbsp;&nbsp;&nbsp;类名：.cyan-3</li>
							<li class="cyan-4">4.颜色：#5bdcd2&nbsp;&nbsp;&nbsp;类名：.cyan-4</li>
							<li class="cyan-5">5.颜色：#36d1c9&nbsp;&nbsp;&nbsp;类名：.cyan-5</li>
							<li class="cyan-6">6.颜色：#14c3c3&nbsp;&nbsp;&nbsp;类名：.cyan-6</li>
							<li class="cyan-7">7.颜色：#08989c&nbsp;&nbsp;&nbsp;类名：.cyan-7</li>
							<li class="cyan-8">8.颜色：#006e73&nbsp;&nbsp;&nbsp;类名：.cyan-8</li>
							<li class="cyan-9">9.颜色：#00484f&nbsp;&nbsp;&nbsp;类名：.cyan-9</li>
							<li class="cyan-10">10.颜色：#002328&nbsp;&nbsp;&nbsp;类名：.cyan-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>9.蓝色系</span>
						</div>
						<ul class="text item">
							<li class="blue-1">1.颜色：#e6f8ff&nbsp;&nbsp;&nbsp;类名：.blue-1</li>
							<li class="blue-2">2.颜色：#bae8ff&nbsp;&nbsp;&nbsp;类名：.blue-2</li>
							<li class="blue-3">3.颜色：#92d6ff&nbsp;&nbsp;&nbsp;类名：.blue-3</li>
							<li class="blue-4">4.颜色：#68c1f4&nbsp;&nbsp;&nbsp;类名：.blue-4</li>
							<li class="blue-5">5.颜色：#40aaff&nbsp;&nbsp;&nbsp;类名：.blue-5</li>
							<li class="blue-6">6.颜色：#1891ff&nbsp;&nbsp;&nbsp;类名：.blue-6</li>
							<li class="blue-7">7.颜色：#086ed8&nbsp;&nbsp;&nbsp;类名：.blue-7</li>
							<li class="blue-8">8.颜色：#0051b2&nbsp;&nbsp;&nbsp;类名：.blue-8</li>
							<li class="blue-9">9.颜色：#003b8c&nbsp;&nbsp;&nbsp;类名：.blue-9</li>
							<li class="blue-10">10.颜色：#002866&nbsp;&nbsp;&nbsp;类名：.blue-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>10.深蓝系</span>
						</div>
						<ul class="text item">
							<li class="geekblue-1">1.颜色：#f0f6ff&nbsp;&nbsp;&nbsp;类名：.geekblue-1</li>
							<li class="geekblue-2">2.颜色：#d6e5ff&nbsp;&nbsp;&nbsp;类名：.geekblue-2</li>
							<li class="geekblue-3">3.颜色：#adc7ff&nbsp;&nbsp;&nbsp;类名：.geekblue-3</li>
							<li class="geekblue-4">4.颜色：#85a6fe&nbsp;&nbsp;&nbsp;类名：.geekblue-4</li>
							<li class="geekblue-5">5.颜色：#597ef7&nbsp;&nbsp;&nbsp;类名：.geekblue-5</li>
							<li class="geekblue-6">6.颜色：#2e55eb&nbsp;&nbsp;&nbsp;类名：.geekblue-6</li>
							<li class="geekblue-7">7.颜色：#1d3ac4&nbsp;&nbsp;&nbsp;类名：.geekblue-7</li>
							<li class="geekblue-8">8.颜色：#10239e&nbsp;&nbsp;&nbsp;类名：.geekblue-8</li>
							<li class="geekblue-9">9.颜色：#061277&nbsp;&nbsp;&nbsp;类名：.geekblue-9</li>
							<li class="geekblue-10">10.颜色：#030852&nbsp;&nbsp;&nbsp;类名：.geekblue-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>11.紫色系</span>
						</div>
							<ul class="text item">
							<li class="purple-1">1.颜色：#f8f0fe&nbsp;&nbsp;&nbsp;类名：.purple-1</li>
							<li class="purple-2">2.颜色：#eedcff&nbsp;&nbsp;&nbsp;类名：.purple-2</li>
							<li class="purple-3">3.颜色：#d3aef7&nbsp;&nbsp;&nbsp;类名：.purple-3</li>
							<li class="purple-4">4.颜色：#b280ea&nbsp;&nbsp;&nbsp;类名：.purple-4</li>
							<li class="purple-5">5.颜色：#9254de&nbsp;&nbsp;&nbsp;类名：.purple-5</li>
							<li class="purple-6">6.颜色：#722fd1&nbsp;&nbsp;&nbsp;类名：.purple-6</li>
							<li class="purple-7">7.颜色：#531daa&nbsp;&nbsp;&nbsp;类名：.purple-7</li>
							<li class="purple-8">8.颜色：#391286&nbsp;&nbsp;&nbsp;类名：.purple-8</li>
							<li class="purple-9">9.颜色：#21085e&nbsp;&nbsp;&nbsp;类名：.purple-9</li>
							<li class="purple-10">10.颜色：#120438&nbsp;&nbsp;&nbsp;类名：.purple-10</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>12.洋红系</span>
						</div>
						<ul class="text item">
							<li class="magenta-1">1.颜色：#fef1f6&nbsp;&nbsp;&nbsp;类名：.magenta-1</li>
							<li class="magenta-2">2.颜色：#fed7e7&nbsp;&nbsp;&nbsp;类名：.magenta-2</li>
							<li class="magenta-3">3.颜色：#ffaed2&nbsp;&nbsp;&nbsp;类名：.magenta-3</li>
							<li class="magenta-4">4.颜色：#fe86bf&nbsp;&nbsp;&nbsp;类名：.magenta-4</li>
							<li class="magenta-5">5.颜色：#f65baa&nbsp;&nbsp;&nbsp;类名：.magenta-5</li>
							<li class="magenta-6">6.颜色：#eb3096&nbsp;&nbsp;&nbsp;类名：.magenta-6</li>
							<li class="magenta-7">7.颜色：#c41d7f&nbsp;&nbsp;&nbsp;类名：.magenta-7</li>
							<li class="magenta-8">8.颜色：#9e1268&nbsp;&nbsp;&nbsp;类名：.magenta-8</li>
							<li class="magenta-9">9.颜色：#780750&nbsp;&nbsp;&nbsp;类名：.magenta-9</li>
							<li class="magenta-10">10.颜色：#520539&nbsp;&nbsp;&nbsp;类名：.magenta-10</li>
						</ul>
					</el-card>
				</div>
			</div>
			<div class="thisText"><span>css样式如下</span></div>
			<textarea v-showcode style="maxHeight:640px">
.red-1 {
    background-color: #fef3ef;
}
.red-2 {
    background-color: #ffcdc7;
}
.red-3 {
    background-color: #fea59e;
}
.red-4 {
    background-color: #ff7975;
}
.red-5 {
    background-color: #ff4e4f;
}
.red-6 {
    background-color: #fa551b;
}
.red-7 {
    background-color: #d4390c;
}
.red-8 {
    background-color: #a70819;
}
.red-9 {
    background-color: #810213;
}
.red-10 {
    background-color: #5d0111;
}

.volcano-1 {
    background-color: #fef4e8;
}
.volcano-2 {
    background-color: #ffd9bf;
}
.volcano-3 {
    background-color: #febc95;
}
.volcano-4 {
    background-color: #f49d6d;
}
.volcano-5 {
    background-color: #ff7b4f;
}
.volcano-6 {
    background-color: #fa551b;
}
.volcano-7 {
    background-color: #d4390c;
}
.volcano-8 {
    background-color: #ad2101;
}
.volcano-9 {
    background-color: #861400;
}
.volcano-10 {
    background-color: #610c00;
}

.orange-1 {
    background-color: #fff9e6;
}
.orange-2 {
    background-color: #ffe7ba;
}
.orange-3 {
    background-color: #ffd691;
}
.orange-4 {
    background-color: #ffc169;
}
.orange-5 {
    background-color: #ffaa40;
}
.orange-6 {
    background-color: #fb8d15;
}
.orange-7 {
    background-color: #d46c08;
}
.orange-8 {
    background-color: #ad4f00;
}
.orange-9 {
    background-color: #863900;
}
.orange-10 {
    background-color: #612600;
}

.gold-1 {
    background-color: #fffce6;
}
.gold-2 {
    background-color: #fff2b8;
}
.gold-3 {
    background-color: #ffe68f;
}
.gold-4 {
    background-color: #ffd766;
}
.gold-5 {
    background-color: #ffc63c;
}
.gold-6 {
    background-color: #faae15;
}
.gold-7 {
    background-color: #d48905;
}
.gold-8 {
    background-color: #ad6a00;
}
.gold-9 {
    background-color: #874f00;
}
.gold-10 {
    background-color: #613500;
}

.yellow-1 {
    background-color: #feffe6;
}
.yellow-2 {
    background-color: #ffffb8;
}
.yellow-3 {
    background-color: #fffc8e;
}
.yellow-4 {
    background-color: #fff666;
}
.yellow-5 {
    background-color: #ffed3c;
}
.yellow-6 {
    background-color: #fadd13;
}
.yellow-7 {
    background-color: #d3b206;
}
.yellow-8 {
    background-color: #ac8c00;
}
.yellow-9 {
    background-color: #866800;
}
.yellow-10 {
    background-color: #614800;
}

.lime-1 {
    background-color: #fcffe5;
}
.lime-2 {
    background-color: #feffb7;
}
.lime-3 {
    background-color: #eaff8f;
}
.lime-4 {
    background-color: #d2f361;
}
.lime-5 {
    background-color: #b9e737;
}
.lime-6 {
    background-color: #a0d911;
}
.lime-7 {
    background-color: #7cb404;
}
.lime-8 {
    background-color: #5a8d00;
}
.lime-9 {
    background-color: #3f6701;
}
.lime-10 {
    background-color: #254101;
}

.green-1 {
    background-color: #f5ffed;
}
.green-2 {
    background-color: #d9f8bf;
}
.green-3 {
    background-color: #b7eb8f;
}
.green-4 {
    background-color: #94df63;
}
.green-5 {
    background-color: #72d13d;
}
.green-6 {
    background-color: #52c51a;
}
.green-7 {
    background-color: #389e0d;
}
.green-8 {
    background-color: #227903;
}
.green-9 {
    background-color: #125300;
}
.green-10 {
    background-color: #092c00;
}

.cyan-1 {
    background-color: #e6fffa;
}
.cyan-2 {
    background-color: #b5f6eb;
}
.cyan-3 {
    background-color: #86eadd;
}
.cyan-4 {
    background-color: #5bdcd2;
}
.cyan-5 {
    background-color: #36d1c9;
}
.cyan-6 {
    background-color: #14c3c3;
}
.cyan-7 {
    background-color: #08989c;
}
.cyan-8 {
    background-color: #006e73;
}
.cyan-9 {
    background-color: #00484f;
}
.cyan-10 {
    background-color: #002328;
}

.blue-1 {
    background-color: #e6f8ff;
}
.blue-2 {
    background-color: #bae8ff;
}
.blue-3 {
    background-color: #92d6ff;
}
.blue-4 {
    background-color: #68c1f4;
}
.blue-5 {
    background-color: #40aaff;
}
.blue-6 {
    background-color: #2e55eb;
}
.blue-7 {
    background-color: #086ed8;
}
.blue-8 {
    background-color: #0051b2;
}
.blue-9 {
    background-color: #003b8c;
}
.blue-10 {
    background-color: #002866;
}

.geekblue-1 {
    background-color: #f0f6ff;
}
.geekblue-2 {
    background-color: #d6e5ff;
}
.geekblue-3 {
    background-color: #adc7ff;
}
.geekblue-4 {
    background-color: #85a6fe;
}
.geekblue-5 {
    background-color: #597ef7;
}
.geekblue-6 {
    background-color: #1891ff;
}
.geekblue-7 {
    background-color: #1d3ac4;
}
.geekblue-8 {
    background-color: #10239e;
}
.geekblue-9 {
    background-color: #061277;
}
.geekblue-10 {
    background-color: #030852;
}

.purple-1 {
    background-color: #f8f0fe;
}
.purple-2 {
    background-color: #eedcff;
}
.purple-3 {
    background-color: #d3aef7;
}
.purple-4 {
    background-color: #b280ea;
}
.purple-5 {
    background-color: #9254de;
}
.purple-6 {
    background-color: #722fd1;
}
.purple-7 {
    background-color: #531daa;
}
.purple-8 {
    background-color: #391286;
}
.purple-9 {
    background-color: #21085e;
}
.purple-10 {
    background-color: #120438;
}

.magenta-1 {
    background-color: #fef1f6;
}
.magenta-2 {
    background-color: #fed7e7;
}
.magenta-3 {
    background-color: #ffaed2;
}
.magenta-4 {
    background-color: #fe86bf;
}
.magenta-5 {
    background-color: #f65baa;
}
.magenta-6 {
    background-color: #eb3096;
}
.magenta-7 {
    background-color: #c41d7f;
}
.magenta-8 {
    background-color: #9e1268;
}
.magenta-9 {
    background-color: #780750;
}
.magenta-10 {
    background-color: #520539;
}
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
    return {};
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
.divEx1 {
  line-height: 30px;
  font-size: 14px;
}
.divEx1>p>span{
	width: 220px;
	padding-right: 20px;
	box-sizing: border-box;
	text-align: right;
	display: inline-block;
	vertical-align: top;
	line-height: 22px;
	padding: 4px 20px 4px 0;
}
.divEx1>p>a{
	width: 80px;
	box-sizing: border-box;
	display: inline-block;
	vertical-align: top;
}
/* 表格样式 */
.item {
  margin-bottom: 8px;
  font-size: 12px;
  color: #3c4353d7;
  border-radius: 3px;
  overflow: hidden;
}
.item>li{
	padding: 4px 16px;
	line-height: 22px;
}
.item>li:nth-child(n+6){
  color: #ffffffd7;
}
.item>li:nth-last-child(1){
  text-indent: -7px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  display: inline-block;
  width: 306px;
  margin-right: 24px;
  margin-bottom: 30px;
  font-size: 14px;
  color: #838a9d;
}
.el-card__body {
  padding: 20px;
  line-height: 20px;
}
</style>
<style>
</style>