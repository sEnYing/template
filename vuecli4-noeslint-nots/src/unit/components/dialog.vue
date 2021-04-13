<template>
  <div class="Dialog"
       :class="{'fade-leave-active':hidden,'noTitle':noTitle.indexOf(link)>-1}">
    <i class="imgBox"
       v-if='link==="showImg"'><i class="el-icon-error"
         @click="close"></i><img :src="data.url"
           alt=""></i>
    <div v-if="link!=='showImg'"
         :style="{width:trueWidth?trueWidth:(small?(small===true?'580px':(small+'px')):null),minWidth:(small?'unset':'1000px'),height:trueHeight?trueHeight:(height?(height+'%'):null)}"
         ref='box'>
      <i @click="close"></i>
      <span v-if='title'>{{title}}</span>
      <div :style="{height:height?'100%':null}"
           ref='boxCont'>
        <unit-loading :loading='loading'></unit-loading>
        <el-scrollbar class="DialogScrollbar"
                      :class="{noScroll:scroll===false}">
          <component :is="link"
                     v-if="link"
                     :data='data?data:null'
                     @ok="setHeight"
                     @loading='showLoading'
                     @success='success'
                     @close="hideBox"
                     @width='setWidth'></component>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitLoading from '@/unit/components/element/loading'
export default {
  name: 'unitDialog',
  props: ['link', 'data', 'title', 'small', 'height', 'scroll', 'dom'],
  data() {
    return {
      loading: false,
      hidden: false,
      noTitle: [],
      trueHeight: null,
      trueWidth: null,
    }
  },
  watch: {
    small() {
      this.setHeight()
    },
    height() {
      this.setHeight()
    },
    dom: {
      deep: true,
      handler() {
        this.setHeight()
      },
    },
  },
  provide() {
    return {
      close: this.close,
    }
  },
  components: {
    unitLoading,
    editPass: resolve => require(['@/components/dialog/editPass'], resolve), //修改个人密码
    contactForm: resolve =>
      require(['@/components/dialog/contactForm'], resolve), //添加联系人
    addVisit: resolve => require(['@/components/dialog/addVisit'], resolve), //添加拜访记录
    salesAmount: resolve =>
      require(['@/components/dialog/salesAmount'], resolve), //年度任务额
    workreportAdd: resolve =>
      require(['@/components/dialog/workreportAdd'], resolve), //新建工作报告
    visitPlan: resolve => require(['@/components/dialog/visitPlan'], resolve), //下周工作计划
    visitRecord: resolve =>
      require(['@/components/dialog/visitRecord'], resolve), //本周拜访总结
    pointProj: resolve => require(['@/components/dialog/pointProj'], resolve), //重点项目情况说明
    depMgntAdd: resolve => require(['@/components/dialog/depMgntAdd'], resolve), //添加部门
    staffForm: resolve => require(['@/components/dialog/staffForm'], resolve), //添加人员
    staffAssign: resolve =>
      require(['@/components/dialog/staffAssign'], resolve), //分配角色
    roleAdd: resolve => require(['@/components/dialog/roleAdd'], resolve), //添加角色
    roleBind: resolve => require(['@/components/dialog/roleBind'], resolve), //用户绑定
    exportStat: resolve => require(['@/components/dialog/exportStat'], resolve), //导出报表
    updateDetail: resolve =>
      require(['@/components/dialog/updateDetail'], resolve), //项目修改信息
    showVisit: resolve => require(['@/components/dialog/showVisit'], resolve), //项目修改信息
    checkMyApply: resolve =>
      require(['@/components/dialog/checkMyApply'], resolve), //查看我的申请
    distributionRatio: resolve =>
      require(['@/components/dialog/distributionRatio'], resolve), //分配比例
    shareCustomer: resolve =>
      require(['@/components/dialog/shareCustomer'], resolve), //共享
    transferCustomer: resolve =>
      require(['@/components/dialog/transferCustomer'], resolve), //转移
  },
  methods: {
    hideBox() {
      this.hidden = true
      // console.log(this.hidden)
    },
    close() {
      this.$emit('close', { link: this.link, show: false })
    },
    showLoading(j) {
      this.loading = j
    },
    success(j) {
      this.$store.commit('reloadFn', j ? j : true)
      this.close()
    },
    setHeight(v) {
      if (this.link === 'showImg') {
        return
      }
      this.$nextTick(() => {
        v === null ? null : this.showLoading(false)
        // setTimeout(()=>{
        // console.log(this.$refs,this.$refs.box.offsetHeight)
        this.$refs.boxCont.classList.remove('maxWindow')
        this.$refs.box.classList.remove('maxWindow')
        let h = this.$refs.boxCont.offsetHeight
        let w = this.$refs.box.offsetWidth
        // console.log((h+45)%2)
        // this.$refs.box.style.height=Math.ceil((h+45)/2)*2+'px';
        // this.$refs.box.style.width=Math.ceil(w/2)*2+'px';
        // this.trueHeight=Math.ceil((h+45)/2)*2+'px';
        // this.trueWidth=Math.ceil(w/2)*2+'px';
        // console.log(Math.ceil((h+45)/2)*2,window.innerHeight)
        if (Math.ceil((h + 45) / 2) * 2 > window.innerHeight) {
          this.trueHeight = Math.floor((h + 45) / 2) * 2 + 'px'
          this.trueWidth = Math.floor(w / 2) * 2 + 'px'
          this.$refs.boxCont.classList.add('maxWindow')
          this.$refs.box.classList.add('maxWindow')
        } else {
          h = this.$refs.boxCont.offsetHeight
          w = this.$refs.box.offsetWidth
          this.trueHeight = Math.floor((h + 45) / 2) * 2 + 'px'
          this.trueWidth = Math.floor(w / 2) * 2 + 'px'
        }
        // if((h+45)%2){
        //     this.$refs.box.style.height=Math.ceil((h+45)/2)*2+'px';
        // }else{
        //     this.$refs.box.style.height=this.height?(this.height+'%'):'';
        // }
        // if(w%2){
        //     this.$refs.box.style.width=Math.ceil(w/2)*2+'px';
        // }
        // },200)
      })
    },
    setWidth(w) {
      this.trueWidth = w + 'px'
    },
  },
  mounted() {
    this.setHeight(false)
    this.showLoading(true)
  },
}
</script>


<style scoped>
.Dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(246, 246, 246, 0.55);
  z-index: 9998;
}
.Dialog > div {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* overflow: hidden; */
  background-color: rgb(255, 255, 255);
  border: 0;
  border-radius: 10px;
  box-shadow: 0px 2px 10px 0px rgba(31, 118, 189, 0.23);
  width: 70%;
  height: auto;
  min-width: 900px;
  max-height: 100%;
  padding-top: 45px;
  box-sizing: border-box;
  overflow: hidden;
  /* -webkit-transition: all .15s ease;
    transition: all .15s ease; */
}
.Dialog > div > span {
  display: block;
  background-color: #f6f9fd;
  height: 44px;
  line-height: 46px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 0px;
  right: 0px;
  padding: 0 18px;
  font-size: 16px;
  color: #333333;
  position: absolute;
  top: 0;
  z-index: 98;
}
.noTitle.Dialog > div > span {
  border-color: transparent;
  padding: 0 9px;
  line-height: 60px;
}
.Dialog > div > i {
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  right: 14px;
  top: 12px;
  background: url('../../assets/images/close.png') center no-repeat;
  opacity: 0.8;
  cursor: pointer;
  z-index: 99;
  transition: opacity 0.2s ease;
}
.Dialog > div > i:hover {
  opacity: 0.6;
}
.Dialog > div > div {
  position: relative;
  width: 100%;
  top: 0px;
  left: 0;
  padding: 10px 0 32px;
  box-sizing: border-box;
  min-height: 200px;
}
.Dialog > div > div.maxWindow {
  height: 100%;
}
.Dialog > div.maxWindow {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
.imgBox {
  width: 80%;
  height: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.imgBox > img {
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.imgBox > i.el-icon-error {
  font-size: 40px;
  position: absolute;
  display: block;
  top: -10px;
  right: -10px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.15s ease;
}
.imgBox > i.el-icon-error:hover {
  opacity: 1;
}
</style>
<style>
.DialogScrollbar {
  height: 100%;
}
.DialogScrollbar > .el-scrollbar__wrap {
  overflow-x: hidden;
  margin-bottom: 0px !important;
}
.DialogScrollbar.noScroll > .el-scrollbar__wrap > .el-scrollbar__view {
  height: 100%;
}
/* .Dialog>div>div.maxWindow .btnBoxLi{
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    background-color: #fff;
} */
</style>