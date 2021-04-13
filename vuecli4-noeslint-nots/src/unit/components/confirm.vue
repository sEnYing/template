<template>
    <transition name="fade">
        <div class="content" v-if="show">
            <div class="confirm">
                <div ref="content">
                    <h1>提示</h1>
                    <i @click="showConfirm(null)"></i>
                    <span v-html='text'></span>
                    <div>
                        <unit-btn @click="showConfirm(true)" :text='confirm.okTxt?confirm.okTxt:"确定"' v-if="confirm.type!=='warn'"></unit-btn>
                        <unit-btn type='plain' @click="showConfirm(false)" :text='confirm.cancelTxt?confirm.cancelTxt:"取消"' v-if="confirm.type!=='warn'&&confirm.cancelTxt!==null"></unit-btn>
                        <unit-btn @click="showConfirm(false)" text='朕知道了' v-if="confirm.type==='warn'"></unit-btn>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'unitConfirm',
    data () {
        return{
            show:false,
            func:null,
            cancel:null,
            text:''
        }
    },
    computed:{
        confirm(){
            return this.$store.state.confirm;
        },
    },
    watch:{
        'confirm':{
            deep:true,
            handler(confirm){
                if(confirm.show){
                    this.show=true;
                    // console.log(confirm)
                    this.func=confirm.func;
                    this.cancel=confirm.cancel;
                    this.text=confirm.text;
                    this.setHeight();
                }else{
                    this.show=false
                }
            }
        }
    },
    created(){
    },
    mounted(){
    },
    methods:{
        showConfirm(j){
            j&&this.confirm.func?this.confirm.func():(j===false&&this.confirm.cancel?this.confirm.cancel():(this.confirm.close?this.confirm.close():null));
            this.$store.commit('confirmFn',{
                show: false
            })
        },
        setHeight(){
            this.$nextTick(()=>{
                // this.showLoading(false);
                setTimeout(()=>{
                    let h=this.$refs.content.offsetHeight;
                    let w=this.$refs.content.offsetWidth;
                    // console.log(h,Math.ceil(h/2)*2,w,Math.ceil(w/2)*2)
                    if(h%2){
                        this.$refs.content.style.height=Math.ceil(h/2)*2+'px';
                    }
                    if(w%2){
                        this.$refs.content.style.width=Math.ceil(w/2)*2+'px';
                    }
                },200)
            })
        },
    }
}
</script>


<style scoped>
.content{
    content: '';
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(246,246,246,0.55);
}
div.confirm{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
div.confirm>div{
    position: fixed;
    min-width: 430px;
    max-width: 800px;
    min-height: 64px;
    padding: 40px 50px 20px;
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow :0px 2px 10px 0px rgba(31,118,189,0.23);
    text-align: center;
    font-size: 0;
    border: 0;
    z-index: 2;
    overflow: hidden;
}
div.confirm>div>h1{
    font-size: 16px;
    color: #333333;
    position: absolute;
    background-color: #f6f9fd;
    top: 0px;
    height: 44px;
    line-height: 46px;
    /* border-bottom: 1px solid rgb(229, 229, 229); */
    left: 0px;
    right: 0px;
    padding: 0 18px;
    text-align: left;
    display: block;
}
div.confirm>div>i{
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    right: 14px;
    top: 12px;
    background: url("../../assets/images/close.png") center no-repeat;
    opacity: 0.8;
    cursor: pointer;
    transition: opacity 0.2s ease;
}
div.confirm>div>i:hover{
    opacity: 0.6;
}
div.confirm>div>span{
    display: block;
    width: 100%;
    line-height: 28px;
    font-size: 14px;
    color: #333333;
    min-height: 48px;
    padding: 40px 0 30px;
}
div.confirm>div>div{
    text-align: center;
    padding-bottom: 20px;
    font-size: 1px;
    word-spacing: 30px;
}
div.confirm>div>div>button{
    vertical-align: top;
}
div.confirm>div>div>button:only-child{
    width: 120px;
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
		-webkit-transform: scale(.5);
		transform: scale(.5)
	}

	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1)
	}
}

@keyframes layer-bounceIn {
	0% {
		opacity: 0;
		-webkit-transform: scale(.5);
		-ms-transform: scale(.5);
		transform: scale(.5)
	}

	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1)
	}
}
@-webkit-keyframes layer-bounceOut {
	100% {
		opacity: 0;
		-webkit-transform: scale(.7);
		transform: scale(.7)
	}

	30% {
		-webkit-transform: scale(1.05);
		transform: scale(1.05)
	}

	0% {
		-webkit-transform: scale(1);
		transform: scale(1)
	}
}
@keyframes layer-bounceOut {
	100% {
		opacity: 0;
		-webkit-transform: scale(.7);
		-ms-transform: scale(.7);
		transform: scale(.7)
	}

	30% {
		-webkit-transform: scale(1.05);
		-ms-transform: scale(1.05);
		transform: scale(1.05)
	}

	0% {
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1)
	}
}
</style>

