<template>
    <button type="button" :class="['button',type,loading?'unable':'',list&&list.length>0?'btnList':'',more?'btnClick':'',color?'btnColor':'']" @click.stop='click'><unit-loading class="btnLoading" :white='true' :loading='loading?loading:false'></unit-loading>{{loading?'':text}}<i class="el-icon-arrow-down" v-if="!loading&&list&&list.length>0"></i><transition name='fade'>
        <ul v-if="more" @click.stop>
            <li v-for="(item,i) in list" :key='i' @click.stop='clickList(item)'>{{item.name}}</li>
        </ul>
    </transition></button>
</template>

<script>
// import css和第三方js
export default {
    name: 'unitBtn',
    props:['text','type','loading','list'],
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
    methods:{
        click(){
            // console.log(this.more)
            if(this.list&&this.list.length>0&&this.type.split(' ').indexOf('unableBtn')===-1){
                this.more=!this.more;
            // console.log(this.more)
            }else{
                this.$emit('click')
            }
        },
        listenClick(){
            // console.log(this.more)
            this.more?this.more=false:null;
        },
        clickList(item){
            this.$emit('click',item.key);
            this.more=false;
        },
    },
    mounted(){
        window.addEventListener('click',this.listenClick);
    },
    destroyed(){
        window.removeEventListener('click',this.listenClick);
    },
}
</script>


<style scoped>
.button{
    border: 0;
    padding: 0;
    border-radius: 2px;
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    position: relative;
    width: 80px;
    height: 32px;
    background-color: transparent;
    transition: all 0.15s linear,width 0s linear,height 0s linear;
    vertical-align: middle;
    z-index: 1;
    line-height: 30px;
    color: #fff;
    background-color: #4780F4;
    border: 1px solid #4780F4;
}
.button.large{
    width: 100px;
}
.button.auto{
    width: auto;
    padding: 0 10px;
}
.button.textBtn{
    width: unset;
    padding: 2px;
    height: unset;
    line-height: 1;
    background-color: transparent;
    border: 0;
    color: #4780F4;
}
.button.textBtn.unableBtn{
    color: #bbbbbb;
    cursor: no-drop;
    background-color: transparent;
}
.button:not(.textBtn):not(.unableBtn):hover,.button.unable{
    background-color: #618EE9;
    border-color: #618EE9;
}
.button.textBtn:not(.unableBtn):hover{
    color: #66b1ff;
}
.button.textBtn.redbtn{
    color: #FF2B2A;
}
.button.textBtn.redbtn:hover{
    color: #fe6c6f;
}
.button.unable{
    cursor: default;
}
.button.plain:not(.textBtn):not(.unableBtn){
    color: #4780F4;
    background-color: #ecf5ff;
    border-color: #8fb4fc;
}
.button.plain:not(.textBtn):not(.unableBtn):hover{
    color: #5b81c1;
    background-color: #DFEAFE;
    border-color: #809dd1;
}
.button.unableBtn{
    cursor: no-drop;
    color: #333333;
    background:#E5E5E5;
    border-color:#E5E5E5;
}
.button.btnList{
    width: 100px;
    overflow: visible;
}
.button.btnList i.el-icon-arrow-down{
    margin-left: 5px;
    transform: rotate(0deg);
    transition: all 0.15s ease;
}
.button.btnList.btnClick i.el-icon-arrow-down{
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
    padding: 6px 0;
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
    background-color: #618EE9;
    border-color: #618EE9;
}
.button.btnList>ul>li{
    background-color: transparent;
    transition: all 0.15s ease;
}
.button.btnList>ul>li:hover{
    background-color: #F5F7FA;
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
/* .button>a{
    position: relative;
    vertical-align: middle;
    z-index: 2;
}
.buttonSolid{
    color: #ffffff;
    box-shadow: 0px 3px 8px 0px rgba(3,127,222,0.46);
    line-height: 30px;
}
.buttonGray{
    color: #6d6d6d;
    border:1px solid #e9e9e9;
    background-color: #f3f3f3;
    box-shadow: 0px 3px 8px 0px rgba(233,233,233,0.9);
    line-height: 30px;
}
.buttonBlue{
    color: #333333;
    border:1px solid rgba(168,176,202,1);
    line-height: 28px;
}
.buttonBlue:hover{
    color: #0085FE;
    border-color: rgba(0,133,254,1);
}
.buttonGray:hover{
    background-color: #ececec;
}
.buttonSolid::before,.buttonSolid::after{
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
}
.buttonSolid::before{
    background: -webkit-linear-gradient( -90deg,rgba(0,131,254,1) 0%,rgba(0,195,255,1) 100%);
    background: -o-linear-gradient( -90deg,rgba(0,131,254,1) 0%,rgba(0,195,255,1) 100%); 
    background: -moz-linear-gradient( -90deg,rgba(0,131,254,1) 0%,rgba(0,195,255,1) 100%); 
    background: linear-gradient( -90deg,rgba(0,131,254,1) 0%,rgba(0,195,255,1) 100%); 
}
.buttonSolid::after{
    opacity: 0;
    transition: opacity 0.2s linear;
    background: -webkit-linear-gradient( -90deg,rgba(0,107,206,1) 0%,rgba(0,177,231,1) 100%);
    background: -o-linear-gradient( -90deg,rgba(0,107,206,1) 0%,rgba(0,177,231,1) 100%); 
    background: -moz-linear-gradient( -90deg,rgba(0,107,206,1) 0%,rgba(0,177,231,1) 100%); 
    background: linear-gradient( -90deg,rgba(0,107,206,1) 0%,rgba(0,177,231,1) 100%); 
}
.buttonSolid:not(.unable):hover::after{
    opacity: 1;
} */

</style>
