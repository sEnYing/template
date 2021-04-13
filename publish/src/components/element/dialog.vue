<template>
  <div class="example">
    <div class="thisTitle">提示和弹窗 $message/$confirm/el-dialog</div>
    <div class="box">
      <div class="thisText">$confirm
        <span>customClass设置为troilaConfirm</span>
      </div>
      <div class="troila-dialogE">
        <el-button type="text" @click="showConfirm">点击显示confirm</el-button>
      </div>

      <textarea v-showcode>
//模板部分
<template>
	<div>
		<el-button type="text" @click="showConfirm">点击显示confirm</el-button>
	</div>
</template>

//js部分
<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
			showConfirm(){
				this.$confirm('确定删除该资料吗？','提示',{
					customClass:'troilaConfirm',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					callback:(action, instance)=>{
					}
				})
			},
		}
	};
</script>
</textarea>
    </div>
    <div class="box">
      <div class="thisText">$message
        <span>customClass设置为troilaAlart</span>
      </div>
      <div class="troila-dialogE">
        <el-button type="text" @click="showAlert(true)">1.成功</el-button>
        <el-button type="text" @click="showAlert(false)">2.失败</el-button>
      </div>

      <textarea v-showcode>
//模板部分
<template>
	<div>
		<el-button type="text" @click="showAlert(true)">1.成功</el-button>
		<el-button type="text" @click="showAlert(false)">2.失败</el-button>
	</div>
</template>

//js部分
<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
			showAlert(j){
				this.$message({
					customClass:'troilaAlart',
					message: j?'成功提示':'失败提示',
					type: j?'success':'error',
					showClose:j?false:true,
					duration:3000
				});
			},
		}
	};
</script>
</textarea>
    </div>
    <div class="box">
      <div class="thisText">el-dialog 一共分为三种</div>
      <div class="troila-dialogE">
        <el-button type="text" @click="dialogVisible = true">1.存在确认、取消按钮</el-button>

        <el-dialog
          class="troilaDialog"
          title="导入异常"
          :visible.sync="dialogVisible"
          width="30%"
          :modal-append-to-body="true"
          :append-to-body="true"
        >
          <div class="small-image"></div>
          <span class="desc">导入的数据存在导入异常，请下载后修改，并重新导入</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">下 载</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>

      <div class="troila-dialogE">
        <el-button type="text" @click="dialogTableVisible = true">2.自动倒计时</el-button>

        <el-dialog
          class="troilaDialog"
          title="提示"
          :visible.sync="dialogTableVisible"
          width="30%"
          @open="changeNum"
          :modal-append-to-body="true"
          :append-to-body="true"
        >
          <div class="image"></div>
          <p class="detail">以下商品存在于货架上，请先下架再上架</p>
          <p class="time">{{this.timer}}S</p>
        </el-dialog>
      </div>

      <div class="troila-dialogE">
        <el-button type="text" @click="dialogFormVisible = true">3.嵌套表单的 Dialog</el-button>

        <el-dialog
          class="troilaDialog"
          title="添加来访人"
          :visible.sync="dialogFormVisible"
          :modal-append-to-body="true"
          :append-to-body="true"
          width="30%"
        >
          <el-form :model="form">
            <el-form-item label="来访人" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="form.phone" auto-complete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input v-model="form.card" auto-complete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="访客类型" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="类型一" value="shanghai"></el-option>
                <el-option label="类型二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="来访人单位" :label-width="formLabelWidth">
              <el-input v-model="form.company" auto-complete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>

      <textarea v-showcode>
//模板部分
<template>
<div>
	<div>
	<el-button type="text" @click="dialogVisible = true">1.存在确认、取消按钮</el-button>
	<el-dialog
		class="troilaDialog"
		title="导入异常"
		:visible.sync="dialogVisible"
		width="30%"
		:modal-append-to-body="true"
		:append-to-body="true"
	>
		<div class="small-image"></div>
		<span class="desc">导入的数据存在导入异常，请下载后修改，并重新导入</span>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogVisible = false">下 载</el-button>
			<el-button @click="dialogVisible = false">取 消</el-button>
		</span>
	</el-dialog>
	</div>

	<div>
	<el-button type="text" @click="dialogTableVisible = true">2.自动倒计时</el-button>
	<el-dialog
		class="troilaDialog"
		title="提示"
		:visible.sync="dialogTableVisible"
		width="30%"
		@open="changeNum"
		:modal-append-to-body="true"
		:append-to-body="true"
	>
		<div class="image"></div>
		<p class="detail">以下商品存在于货架上，请先下架再上架</p>
		<p class="time">{{text1}}S</p>
	</el-dialog>
	</div>

	<div>
	<el-button type="text" @click="dialogFormVisible = true">3.嵌套表单的 Dialog</el-button>
	<el-dialog
		class="troilaDialog"
		title="添加来访人"
		:visible.sync="dialogFormVisible"
		:modal-append-to-body="true"
		:append-to-body="true"
		width="30%"
	>
		<el-form :model="form">
			<el-form-item label="来访人" :label-width="formLabelWidth">
				<el-input v-model="form.name" auto-complete="off" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="手机号" :label-width="formLabelWidth">
				<el-input v-model="form.phone" auto-complete="off" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="身份证号" :label-width="formLabelWidth">
				<el-input v-model="form.card" auto-complete="off" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="访客类型" :label-width="formLabelWidth">
				<el-select v-model="form.region" placeholder="请选择活动区域">
					<el-option label="类型一" value="shanghai"></el-option>
					<el-option label="类型二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="来访人单位" :label-width="formLabelWidth">
				<el-input v-model="form.company" auto-complete="off" placeholder="请输入内容"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			<el-button @click="dialogFormVisible = false">取 消</el-button>
		</div>
	</el-dialog>
	</div>
</div>
</template>

//js部分
<script>
	export default {
		props: {
			timer: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				time: this.timer,
				st: null,
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {
					name: "",
					phone:"",
					card:"",
					company:"",
					region: "",
				},
				formLabelWidth: "120px",
				dialogVisible: false
			};
		},
		methods: {
			timeChange() {
				clearTimeout(this.st);
				this.st = setTimeout(() => {
					this.time--;
					if (this.time) {
						this.$nextTick(() => {
							document.getElementsByClassName("time")[0].innerHTML =
							this.time + "S";
						});
						this.timeChange();
					} else {
						this.dialogTableVisible = false;
						this.time = this.timer;
					}
				}, 1000);
			},
			changeNum() {
				this.time = this.timer;
				this.$nextTick(() => {
					document.getElementsByClassName("time")[0].innerHTML = this.time + "S";
				});
				this.timeChange();
			},
		}
	};
</script>
</textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    timer: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      time: this.timer,
      st: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        phone:"",
        card:"",
        company:"",
        region: "",
      },
      formLabelWidth: "120px",
	  dialogVisible: false,
	  text1:"{{this.timer}}"
    };
  },
  methods: {
    timeChange() {
      clearTimeout(this.st);
      this.st = setTimeout(() => {
        this.time--;
        if (this.time) {
          this.$nextTick(() => {
            document.getElementsByClassName("time")[0].innerHTML =
              this.time + "S";
          });
          this.timeChange();
        } else {
          this.dialogTableVisible = false;
          this.time = this.timer;
        }
      }, 1000);
    },
    changeNum() {
      this.time = this.timer;
      this.$nextTick(() => {
        document.getElementsByClassName("time")[0].innerHTML = this.time + "S";
      });
      this.timeChange();
    },
    showConfirm(){
      this.$confirm('确定删除该资料吗？','提示',{
          customClass:'troilaConfirm',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback:(action, instance)=>{
          }
      })
    },
    showAlert(j){
      this.$message({
          customClass:'troilaAlart',
          message: j?'成功提示':'失败提示',
          type: j?'success':'error',
          showClose:j?false:true,
          duration:3000
      });
    },
  }
};
</script>

<style scoped>
.troila-dialogE{
  padding-bottom: 8px;
}
.showCode{
  margin-top: 8px;
}
</style>
<style>
.troila-dialogE .el-button.el-button--text {
    width: unset;
    padding: 2px;
    height: unset;
}
</style>
