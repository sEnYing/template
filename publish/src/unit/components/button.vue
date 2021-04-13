<template>
    <button ref='button' type="button" v-judgew='circle!==undefined&&circle!==false?true:false' :class="[
        'button',
        type?(type+'Btn'):'',
        loading?'unable':'',
        large!==undefined?'large':'',
        plain!==undefined&&plain!==false?'plain':'',
        text!==undefined&&text!==false?'textBtn':'',
        circle!==undefined&&circle!==false?'circle':'',
        disable!==undefined&&disable!==false?'unableBtn':'',
        list&&list.length>0?'btnList':'',
        more?'btnClick':'',
        color?'btnColor':'']"
        :style="{
            borderRadius:typeof round!=='number'&&typeof round!=='boolean'&&round!==''?null:(!round&&round!==''?'0px':(round===true||round===''?'16px':(round+'px')))
        }" @click.stop='click'>
            <i class="btnLoading" v-if="loading?loading:false" v-loading='true' element-loading-spinner='el-icon-loading' element-loading-background="rgba(255, 255, 255, 0)"></i>
            <i :class="[icon,loading?'hiddenBtn':'']" v-if="icon&&icon.split(' ').indexOf('right')===-1"></i>
            <slot></slot>
            <i :class="[icon,loading?'hiddenBtn':'']" v-if="icon&&icon.split(' ').indexOf('right')>-1"></i>
            <i class="el-icon-arrow-down iconList" :class="{hiddenBtn:loading}" v-if="list&&list.length>0"></i>
        <transition name='fade'>
            <ul v-if="more" @click.stop>
                <li v-for="(item,i) in list" :key='i' @click.stop='clickList(item)'>{{item.label}}</li>
            </ul>
        </transition>
    </button>
</template>

<script>
// import css和第三方js
export default {
    name: 'unitBtn',
    props:['type','disable','plain','text','large','round','circle','loading','icon','list'],
    data () {
        return{
            more:false,
            color:false
        }
    },
    watch: {
        more(){
            this.more?this.color=true:setTimeout(()=>{this.color=false},200)
        }
    },
    directives : {
        judgew:{
            inserted:function(el,binding,vnode){
                // console.log(el,binding,vnode)
                // console.log(w,iw,h,ih);
                if(!binding.value){
                    let w=el.offsetWidth,h=el.offsetHeight,iw=el.scrollWidth,ih=el.scrollHeight;
                    let className = el.className.split(' ');
                    (el.innerText.length>5||w<iw||h<ih||w>96)?(className.indexOf('autoWidth')>-1?null:className.push('autoWidth')):(className.indexOf('autoWidth')>-1?className.splice(className.indexOf('autoWidth'),1):null);
                    el.setAttribute('class',className.join(' '));
                }
            },
            componentUpdated:function(el,binding,vnode){
                if(!binding.value){
                    let w=el.offsetWidth,h=el.offsetHeight,iw=el.scrollWidth,ih=el.scrollHeight;
                    let className = el.className.split(' ');
                    (el.innerText.length>5||w<iw||h<ih||w>96)?(className.indexOf('autoWidth')>-1?null:className.push('autoWidth')):(className.indexOf('autoWidth')>-1?className.splice(className.indexOf('autoWidth'),1):null);
                    el.setAttribute('class',className.join(' '));
                }
            },
        }
    },
    methods:{
        click(){
            if(this.loading){return}
            // console.log(this.more)
            if(this.list&&this.list.length>0){
                this.more=!this.more;
            // console.log(this.more)
            }else{
                this.$emit('click')
            }
        },
        listenClick(e){
            this.more?this.more=false:null;
        },
        clickList(item){
            if(this.loading){return}
            this.$emit('click',item);
            this.more=false;
        },
    },
    mounted(){
        if(this.list)(window.addEventListener('click',this.listenClick));
    },
    destroyed(){
        if(this.list){window.removeEventListener('click',this.listenClick)};
    },
}
</script>


<style scoped>
.button{
    border: 0;
    padding: 0;
    border-radius: 3px;
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    position: relative;
    width: 80px;
    height: 32px;
    background-color: transparent;
    transition: all 0.15s linear,width 0s linear,height 0s linear,padding 0s linear;
    vertical-align: middle;
    z-index: 1;
    line-height: 30px;
    color: #fff;
    background-color: #4c5bff;
    border: 1px solid #4c5bff;
}
.button.large{
    width: 96px;
}
.button.autoWidth{
    width: auto!important;
    padding: 0 15px;
    min-width: 50px;
}
.button.circle{
    width: 32px;
    border-radius: 50%;
    padding: 0 5px;
}
.button.textBtn{
    width: unset;
    padding: 2px;
    height: unset;
    line-height: 1;
    background-color: transparent;
    border: 0;
    color: #4c5bff;
}
.button:not(.textBtn):not(.unableBtn):hover,.button.unable{
    background-color: #606df5;
    border-color: #606df5;
}
.button.textBtn:not(.unableBtn):hover{
    color: #747ff8;
}
.button.plain:not(.textBtn):not(.unableBtn){
    color: #4c5bff;
    background-color: #fff;
    border-color: #606df5;
}
.button.plain:not(.textBtn):not(.unableBtn):hover{
    background-color: #e8ecff;
    border-color: #4c5bff;
}
/* success */
.button.successBtn:not(.textBtn):not(.plain):not(.unableBtn){
    background-color: #00cd3d;
    border-color: #00cd3d;
}
.button.successBtn.textBtn{
    color: #00cd3d;
}
.button.successBtn:not(.textBtn):not(.unableBtn):hover,.button.successBtn.unable{
    background-color: #38da69;
    border-color: #38da69;
}
.button.successBtn.textBtn:not(.unableBtn):hover{
    color: #6bd68b;
}
.button.successBtn.plain:not(.textBtn):not(.unableBtn){
    color: #00cd3d;
    border-color: #38da69;
}
.button.successBtn.plain:not(.textBtn):not(.unableBtn):hover{
    background-color: #e8f8eb;
    border-color: #00cd3d;
}
/* warn */
.button.warnBtn:not(.textBtn):not(.plain):not(.unableBtn){
    background-color: #ffab14;
    border-color: #ffab14;
}
.button.warnBtn.textBtn{
    color: #ffab14;
}
.button.warnBtn:not(.textBtn):not(.unableBtn):hover,.button.warnBtn.unable{
    background-color: #fbbd48;
    border-color: #fbbd48;
}
.button.warnBtn.textBtn:not(.unableBtn):hover{
    color: #fdbd45;
}
.button.warnBtn.plain:not(.textBtn):not(.unableBtn){
    color: #ffab14;
    border-color: #fbbd48;
}
.button.warnBtn.plain:not(.textBtn):not(.unableBtn):hover{
    background-color: #fff6e6;
    border-color: #ffab14;
}
/* error */
.button.errorBtn:not(.textBtn):not(.plain):not(.unableBtn){
    background-color: #ff4247;
    border-color: #ff4247;
}
.button.errorBtn.textBtn{
    color: #ff4247;
}
.button.errorBtn:not(.textBtn):not(.unableBtn):hover,.button.errorBtn.unable{
    background-color: #fb6166;
    border-color: #fb6166;
}
.button.errorBtn.textBtn:not(.unableBtn):hover{
    color: #fb7e82;
}
.button.errorBtn.plain:not(.textBtn):not(.unableBtn){
    color: #ff4247;
    border-color: #fb6166;
}
.button.errorBtn.plain:not(.textBtn):not(.unableBtn):hover{
    background-color: #fbebec;
    border-color: #ff4247;
}
/* link */
.button.linkBtn:not(.textBtn):not(.plain):not(.unableBtn){
    background-color: #3299eb;
    border-color: #3299eb;
}
.button.linkBtn.textBtn{
    color: #3299eb;
}
.button.linkBtn:not(.textBtn):not(.unableBtn):hover,.button.linkBtn.unable{
    background-color: #51a9f1;
    border-color: #51a9f1;
}
.button.linkBtn.textBtn:not(.unableBtn):hover{
    color: #78bcf3;
}
.button.linkBtn.plain:not(.textBtn):not(.unableBtn){
    color: #3299eb;
    border-color: #5dadf0;
}
.button.linkBtn.plain:not(.textBtn):not(.unableBtn):hover{
    background-color: #e7f2fb;
    border-color: #3299eb;
}
/* 不可点击 */
.button.unable{
    cursor: default;
}
.button.unableBtn{
    cursor: no-drop;
    color: #a6a9b0;
    background:#e6e9ef;
    border-color:#e6e9ef;
}
.button.plain.unableBtn{
    color: #c7c7cf;
    background-color: #fff;
    border-color:#e7eaef;
}
.button.textBtn.unableBtn{
    color: #b3b6bd;
    cursor: no-drop;
    background-color: transparent;
}
/* icon */
.button>i{
    float: none;
}
/* 按钮组 */
.btnGroup>.button:not(:first-child){
    border-top-left-radius:0px!important; 
    border-bottom-left-radius:0px!important;
    border-left-color: hsla(0,0%,100%,.5)!important;
}
.btnGroup>.button:not(:last-child){
    border-top-right-radius:0px!important;
    border-bottom-right-radius:0px!important;
}
/* 多选按钮 */
.button.btnList{
    width: auto!important;
    padding: 0 15px;
    overflow: visible;
}
.button.btnList i.iconList{
    margin-left: 4px;
    margin-right: 0;
    transform: rotate(0deg);
    transition: transform 0.15s ease;
}
.button.btnList.btnClick i.iconList{
    transform: rotate(-180deg);
}
.button:not(.btnList)>ul{
    display: none
}
.button.btnList>ul{
    position: absolute;
    top: 100%;
    transform: translateY(12px);
    left: -1px;
    width: 120%;
    text-align: center;
    font-size: 14px;
    background-color: #ffffff;
    line-height: 34px;
    color: #606266;
    border-radius: 2px;
    padding: 6px 4px;
    border: 1px solid #EBEEF5;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.button.btnList>ul::before{
    position: absolute;
    display: block;
    content: " ";
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
    top: -6px;
    left: 35px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #EBEEF5;
    opacity: 0;
}
.button.btnList>ul::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    content: "";
    border-width: 6px;
    top: -5px;
    left: 35px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #FFF;
    opacity: 0;
}
.button.btnList.btnClick>ul::before,
.button.btnList.btnClick>ul::after {
    opacity: 1;
}
.button.btnList.btnColor,
.button.btnList.btnColor:hover{
    background-color: #606df5;
    border-color: #606df5;
}
.button.btnList>ul>li{
    background-color: transparent;
    transition: all 0.15s ease;
    border-radius: 2px;
}
.button.btnList>ul>li:hover{
    color: #606df5;
    background-color: #f5f6ff;
}
/* 渐变 */
.fade-leave-active {
    opacity: 0;
    transition: all 0.2s linear;
    animation: layer-bounceOut .2s linear 0s;
}
.fade-enter-active {
    transition: all 0.2s linear;
    animation: layer-bounceIn .15s linear 0s;
}
.fade-leave,.fade-enter{
    opacity: 0;
}
.button.btnList.btnClick>ul.fade-enter-active::before,
.button.btnList.btnClick>ul.fade-enter-active::after {
    opacity: 0;
    transition: all 0s linear 0.2s;
}
@-webkit-keyframes layer-bounceIn {
	0% {
        opacity: 0;
        margin-top: -20px;
	}

	100% {
        opacity: 1;
        margin-top: 0px;
	}
}

@keyframes layer-bounceIn {
	0% {
        opacity: 0;
        margin-top: -20px;
	}

	100% {
        opacity: 1;
        margin-top: 0px;
	}
}
@-webkit-keyframes layer-bounceOut {
	100% {
        opacity: 0;
        margin-top: -20px;
	}

	30% {
        margin-top: 10px;
	}

	0% {
        opacity: 1;
        margin-top: 0px;
	}
}
@keyframes layer-bounceOut {
	100% {
		opacity: 0;
        margin-top: -20px;
	}

	30% {
        margin-top: 10px;
	}

	0% {
        opacity: 1;
        margin-top: 0px;
	}
}
/* loading */
.button>i.btnLoading{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: top;
}
.button>i.hiddenBtn,
.button.btnList i.iconList.hiddenBtn{
    opacity: 0;
    margin-right: -18px;
}
</style>
<style>
.btnLoading .el-loading-spinner i{
    color: #fff;
}
.btnLoading .el-loading-spinner{
    margin-top: 0;
    top: 0;
}
</style>