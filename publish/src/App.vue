<template>
	<div id="app" ref='body'>
		<unit-header></unit-header>
        <div class="main" :class="{noScroll:!(this.$route.hash?this.$route.hash.replace('#',''):'')||!canScroll}">
             <el-scrollbar class="unitScrollbar appScroll">
                <div class="mainContent" ref='scroll'>
                    <div class="mainLeft">
                        <unit-left></unit-left>
                    </div>
                    <div class="mainRight">
                        <router-view class="ClearFloat" v-if="reloadView" :dom='{width:innerWidth,height:innerHeight,left:scrollLeft,top:scrollTop}'/>
                    </div>
                </div>
                <footer v-html="footer"></footer>
            </el-scrollbar>
        </div>
	</div>
</template>

<script>
import unitHeader from './components/common/header'
import unitLeft from './components/common/left'
// import './assets/js/SSOMid'
export default {
	name: 'App',
	components:{
        unitHeader,unitLeft,
	},
	provide(){
        return {
            reload:this.reload,
            judgelogin:this.judgeLogin
        }
    },
    data:function(){
        return{
            footer:'版权所有 卓朗科技有限公司 津ICP备10200312号-3',
            innerWidth:null,
            innerHeight:null,
            scrollTop:0,
            scrollLeft:0,
            callback:null,
            listenScroll:null,
            reloadView:true,
            canScroll:false
        }
    },
    computed: {
        userInfo(){
            return this.$store.state.userInfo;
        },
        token(){
            return this.$store.state.token;
        },
    },
    watch:{
        $route:{
            handler(val, oldVal){
                this.judgeLogin();
                if(this.$refs.scroll&&this.$refs.scroll.parentNode&&this.$refs.scroll.parentNode.parentNode){
                    this.$refs.scroll.parentNode.parentNode.scrollTop=0;
                }
            },
            deep: true
        },
        token(token){
            this.judgeLogin();
        },
    },
    methods:{
        // 刷新页面
        reload(){
            this.reloadView=false;
            this.$nextTick(()=>{
                this.reloadView=true;
            })
        },
        // 验证登陆
        judgeLogin(){
            this.$store.dispatch('login');
            this.login=this.$store.state.token?true:false;
            if(!this.canScroll){
                setTimeout(()=>{
                    this.canScroll=(this.$route.hash?this.$route.hash.replace('#',''):'')?true:false;
                },300)
            }
        },
        scrollFunc(e){
            e = e || window.event || arguments[0];
            let value;
            if(e.wheelDelta){//IE/Opera/Chrome
                value=e.wheelDelta/120;
            }else if(e.detail){//Firefox
                value=-e.detail/3;
            }
            let scrolls=document.getElementsByClassName('unitScrollbar'),top=0;
            for(let i =0;i<scrolls.length;i++){
                top+=scrolls[i].getElementsByClassName('el-scrollbar__wrap')[0].scrollTop;
            }
            // console.log(this.$route.hash?this.$route.hash.replace('#',''):'')
            if(top===0&&value<0&&!(this.$route.hash?this.$route.hash.replace('#',''):'')){
                this.$router.push('/#theme');
            }
        }
    },
    created(){
        this.$store.commit('tokenFn','token')
        this.$store.commit('userInfoFn',{})
        this.judgeLogin();
        this.innerWidth=window.innerWidth;
        this.innerHeight=window.innerHeight;
        window.onresize=function(){
            this.innerWidth=window.innerWidth;
            this.innerHeight=window.innerHeight;
            if(this.callback){this.callback();}
        }.bind(this);
    },
    mounted(){
        this.$nextTick(()=>{
            let div=this.$refs.scroll;
            if(div){div=div.parentNode;}else{return;}
            if(div){div=div.parentNode;}else{return;}
            this.scroll=div;
            this.listenScroll=() => {
                this.scrollTop=div.scrollTop
                this.scrollLeft=div.scrollLeft
            }
            this.scroll.addEventListener('scroll', this.listenScroll);
            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',this.scrollFunc,false);
            }//W3C
            window.onmousewheel=document.onmousewheel=this.scrollFunc;//IE/Opera/Chrome
        })
    },
    destroyed(){
        this.scroll&&this.listenScroll?this.scroll.removeEventListener("scroll", this.listenScroll):null;
        document.removeEventListener('DOMMouseScroll',this.scrollFunc);
    },
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif; /*'Microsoft YaHei','STHeiti',*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
}
#app.unlogin {
    min-width: unset;
}
div.main{
    position: absolute;
    left: 0;
    right: 0;
    top: 64px;
    bottom: 0;
    z-index: 99;
    transition: top 0.25s ease-in-out;
}
div.main .mainContent{
    min-width: 900px;
    position: relative;
    height: 100%;
    z-index: 1;
    padding: 26px 0 80px;
    margin: 0 100px;
    box-sizing: border-box;
}
@media screen and (max-width: 1000px){
    div.main .mainContent{
        margin: 0 auto;
        width: 900px;
    }
}
div.mainLeft{
    position: fixed;
    top: 96px;
    width: 160px;
    bottom: 36px;
    z-index: 2;
    transition: top 0.25s ease-in-out;
}
div.mainRight{
    position: relative;
    /* margin-left: 196px; */
    /* width: 1204px; */
    box-sizing: border-box;
    padding-left: 196px;
    width: 100%;
    z-index: 1;
}
footer{
    /* background-color: #fff; */
    position: absolute;
    bottom: 7px;
    left: 0;
    height: 20px;
    line-height: 20px;
    text-align: center;
    z-index: 99;
    width: 100%;
}
header.largeHeader+.main{
    top: 710px;
}
header.largeHeader+.main .mainLeft{
    top: 726px;
}
/* 渐变 */
.fade-leave-active {
    opacity: 0;
    transition: all 0.2s linear;
}
.fade-enter-active {
    transition: all 0.2s linear;
}
.fade-leave,.fade-enter{
    opacity: 0;
}
.fade-leave-active>div {
    animation: layer-bounceOut .2s linear 0s;
}
.fade-enter-active>div {
    animation: layer-bounceIn .15s linear 0s;
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
</style>
<style>
.el-scrollbar.unitScrollbar{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
}
.noScroll .unitScrollbar>.el-scrollbar__wrap{
    overflow: hidden;
}
.unitScrollbar>.el-scrollbar__wrap{
    height: 100%;
    padding-bottom: 17px;
}
.unitScrollbar.appScroll>.el-scrollbar__wrap{
    margin-bottom: 0!important;
    padding-bottom: 0px;
    overflow-x: hidden;
}
.unitScrollbar>.el-scrollbar__bar{
    z-index: 3;
}
.el-select-dropdown .el-scrollbar.is-empty{
    display: none;
}
.main>.unitScrollbar>.el-scrollbar__wrap>.el-scrollbar__view{
    min-height: 100%;
    position: relative;
}
/* 内容 */
.example{
    font-size: 0;
    color: #3c4353;
    display: inline-block;
    text-align: left;
    max-width: 100%;
    width: 1000px;
}
.codeTxt{
    display: block;
    width: 40px;
    margin-left: 600px;
    margin-bottom: -22px;
    line-height: 32px;
    height: 22px;
    z-index: 1;
    position: relative;
    color: #c8c8c8;
    font-size: 12px;
}
.showCode{
    width: 640px;
    height: auto;
    font-size: 12px;
    background-color: #fafafa;
    border: 1px solid #eaeaea;
    border-radius: 3px;
    line-height: 20px;
    padding: 16px;
    box-sizing: border-box;
    margin-bottom: 16px;
    word-spacing: 2px;
    opacity: 0;
}
.showCode:read-only{
    opacity: 1;
}
.thisTitle{
    padding: 8px 0;
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
}
.thisText{
    padding: 4px 0 8px;
    font-size: 16px;
    line-height: 34px;
}
.thisText>span{
    display: block;
    font-size: 14px;
    line-height: 14px;
    padding: 4px 0;
    color: #838a9d;
}
.thisEx>span{
    text-indent: 14px;
    width: 96px;
    font-size: 14px;
    line-height: 32px;
    display: inline-block;
    vertical-align: top;
}
.thisEx span.tips{
    width: auto;
    color: #a6aabb;
}
.thisEx .divEx{
    font-size: 14px;
    /* width: 80%; */
    line-height: 22px;
    padding: 16px;
    border-radius: 3px;
    /* background-color: #fafafa; */
    color: #606661;
    width: 640px;
    box-sizing: border-box;
    border: 1px solid #eaeaea;
}
.thisIndex{
    text-indent: 28px;
}
.thisIndex::before{
    content: '';
    border: 1px solid #a6aabb;
    border-top: 0px;
    border-right: 0px;
    display: inline-block;
    width: 5px;
    height: 5px;
    vertical-align: top;
    margin: 2px 8px 0 -14px;
}
</style>