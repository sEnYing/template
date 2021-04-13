<template>
    <div class="suggest">
        <!-- <div class="boxRound" @mouseenter="changeBox(true)" @mouseleave="changeBox(false)">
            <div @click="changeShow(true)">
                <i></i>
                <span>建议反馈</span>
            </div>
            <transition name="box">
                <div class="boxRound" v-show='box'>
                    <i class="close" @click='changeBox(false)'></i>
                    <i class="icon"></i>
                    <div>程序GG日夜苦干~<br/>新版本上线啦<span>亲~求鼓励~求支持</span></div>
                </div>
            </transition>
        </div> -->
        <div class="boxRound download" @mouseenter="changeBox(1)" @mouseleave="changeBox(false)">
            <div>
                <i></i>
                <span>使用手册</span>
            </div>
            <transition name="box">
                <div class="boxRound" v-show='box===1'>
                    <i class="close" @click='changeBox(false)'></i>
                    <ul>
                        <li class="AbleClick" @click='download("pc")'><i></i>PC端</li>
                        <li class="AbleClick" @click='download("app")'><i></i>APP端</li>
                    </ul>
                </div>
            </transition>
        </div>
        <div class="boxRound qrCode" @mouseenter="changeBox(2)" @mouseleave="changeBox(false)">
            <div>
                <i></i>
                <span>手机端</span>
                <!-- <span><i>APP</i>下载</span> -->
            </div>
            <transition name="box">
                <div class="boxRound" v-show='box===2'>
                    <img src="/static/images/qrCode.png" alt="">
                </div>
            </transition>
        </div>
        <!-- <transition name="fade">
            <div class="suggestBox" v-if="show">
                <div>
                    <i class="el-icon-close" @click="changeShow(false)"></i>
                    <div>
                        <span><i class="must">*</i>填写您的建议，我们会努力做得更好~ ( <i :class="{red:text.length>200}">{{text.length}}</i> / 200 )</span>
                        <div :class="{'errorBorder':error}">
                            <textarea class="input" v-model="text" ref="textarea" @input="()=>{error=''}"></textarea>
                            <i class="placeholder" v-show="(!text||text==='')&&!composition">请填写10个字以上的建议描述以便我们做更好的修改</i>
                            <transition name="publicTransition"><u class="error" v-if="error">{{error}}</u></transition>
                        </div>
                        <span>上传图片，选填，提供问题截图 ( {{list.length}} / 4 )</span>
                        <div class="imageBox">
                            <i v-for="(item,i) in list" :key='i' @click="imgBig(item)">
                                <i class="el-icon-circle-close" @click.stop='deleteImg(item)'></i>
                                <img class="defaultImg" :src="'/api'+item.filePath" alt="">
                                <transition name="fade">
                                    <div v-show='item.big' class="bigImg" :style="{width:dom.width+'px',height:dom.height+'px'}">
                                        <img :src="'/api'+item.filePath" alt="" :style="{maxWidth:dom.width*0.9+'px',maxHeight:dom.height*0.9+'px'}">
                                    </div>
                                </transition>
                            </i>
                            <i class="add" @click="addBtnjudge" v-if="list.length<4"></i>
                            <unit-upload class="marginTop" :hid='true' @click='setAddBtn' @success='uploadSuc' :limit='4' @ajaxing='ajaxingChang' api='suggest'></unit-upload>
                        </div>
                    </div>
                    <unit-btn type='large sgBtn' :loading='ajaxIng' @click="submit" text='提交'></unit-btn>
                </div>
            </div>
        </transition> -->
    </div>
</template>

<script>
import unitUpload from '@/unit/components/upload'

export default {
    name: 'index',
    props:['dom'],
    data () {
        return{
            box:false,
            show:false,
            ajaxIng:false,
            composition:false,
            text:'',
            list:[],
            ajaxImg:false,
            error:'',
            addBtn:()=>{}
        }
    },
    components:{unitUpload},
    inject: ['reload'],
    watch:{
        show(){
            if(this.show){
                this.$nextTick(()=>{
                    this.$refs.textarea.addEventListener('compositionstart', ()=>{
                        this.composition=true;
                    });
                    this.$refs.textarea.addEventListener('compositionend', ()=>{
                        this.composition=false;
                    });
                })
            }
        }
    },
    methods:{
        changeBox(j){
            this.box=j;
        },
        changeShow(j){
            this.show=j;
            j?null:(this.text='',this.list=[],this.error='')
        },
        ajaxingChang(j){
            this.ajaxImg=j;
        },
        addBtnjudge(){
            if(this.length>=4||this.ajaxIng||this.ajaxImg){return;}
            this.addBtn();
        },
        setAddBtn(fn){
            this.addBtn=fn;
        },
        uploadSuc(item){
            this.ajaxingChang(false);
            this.$set(item,'big',false);
            this.list.push(item);
        },
        deleteImg(item){
            if(item.del){return}
            item.del=true;
            this.$api.suggest.deleteFile({filePath:item.filePath},res=>{
                if(res.code==='0'){
                    for(let i in this.list){
                        if(this.list[i].id===item.id){
                            this.list.splice(i,1)
                            return;
                        }
                    }
                }
            });
        },
        imgBig(item){
            item.big=!item.big
        },
        download(n){
            // http://172.27.111.102:9999
            switch(n){
                case 'pc':this.$pubfunc.downloadFile('/api/download/user_guide_pc.pdf','PC端用户手册.pdf','url');break;
                case 'app':this.$pubfunc.downloadFile('/api/download/user_guide_app.pdf','APP端用户手册.pdf','url');break;
            }
        },
        submit(){
            if(this.ajaxIng){return}
            if(!this.$pubfunc.replaceSpace(this.text,1)){
                this.text='';
                this.error='填写您的建议描述';
                return;
            }else if(this.text.length<10){
                this.error='请填写10个字以上的建议描述以便我们做更好的修改';
                return;
            }else if(this.text.length>200){
                this.error='建议描述请少于200字';
                return;
            }
            this.ajaxIng=true;
            let list=[];
            this.list.map(v=>{
                list.push({
                    // id:'',
                    realName:v.realName,
                    fileSize:v.fileSize,
                    fileType:v.fileType,
                    filePath:v.filePath,
                })
            })
            this.$api.suggest.addFeedback({content:this.text,fileList:list},res=>{
                // console.log(res)
                this.ajaxIng=false;
                switch(res.code){
                    case '0':
                        this.changeShow(false);
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'提交成功',
                            func:()=>{
                                this.$route.name==='feedback'?this.reload():null;
                            }
                        })
                        break;
                    default:
                        this.warn.text=res.message?res.message:res.msg;
                        this.warn.show=true;
                }
            })
        },
    },
}
</script>

<style scoped>
.suggest{
    position: fixed;
    z-index: 9997;
    right: 0;
}
.suggest>div.boxRound{
    font-size: 0;
    position: fixed;
    right: 14px;
    bottom: 2%;
    padding: 0;
    width: 46px;
    height: 128px;
    margin-top: -108px;
}
.suggest>div.boxRound.download{
    /* margin-top: 30px; */
    /* height: 98px; */
    height: 130px;
}
.suggest>div.boxRound.qrCode{
    /* margin-top: 30px; */
    /* height: 98px; */
    height: auto;
    margin-bottom: 140px;
}
.suggest>div.boxRound::before{
    content: '';
    display: block;
    width: 10px;
    height: 100%;
    left: -9px;
    position: absolute;
}
.suggest>div.boxRound>div:not(.boxRound){
    width: 100%;
    height: 100%;
    padding: 9px 8px;
    cursor: pointer;
    box-sizing: border-box;
}
.suggest>div.boxRound>div:not(.boxRound)>i{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    background-color: #d6efff;
    text-align: center;
    padding-top: 4px;
    box-sizing: border-box;
}
.suggest>div.boxRound>div:not(.boxRound)>i::before{
    display: inline-block;
    content: '';
    width: 22px;
    height: 22px;
    vertical-align: top;
}
.suggest>div.boxRound.download>div>i{
    opacity: 1;
    background: url('../../assets/images/icon.png') -51px -98px no-repeat;
    transition: opacity 0.15s ease;
}
.suggest>div.boxRound.download>div:not(.boxRound):hover>i{
    opacity: 0.66;
}
.suggest>div.boxRound.qrCode>div>i{
    opacity: 1;
    background: url('../../assets/images/icon.png') -51px -134px no-repeat;
    transition: opacity 0.15s ease;
}
.suggest>div.boxRound.qrCode>div:not(.boxRound):hover>i{
    opacity: 0.66;
}
.suggest>div.boxRound.download>div>i::before,
.suggest>div.boxRound.qrCode>div>i::before{
    display: none;
}
.suggest>div.boxRound>div:not(.boxRound)>span{
    font-size: 14px;
    line-height: 18px;
    padding: 5px;
    display: block;
    text-align: center;
    color: #0057dd;
    transition: color 0.15s ease;
}
.suggest>div.boxRound>div:not(.boxRound)>span>i{
    white-space: nowrap;
    margin-left: 50%;
    transform: translateX(-50%);
    display: block;
    width: 200%;
    text-align: center;
    padding: 3px 0;
}
.suggest>div.boxRound>div:not(.boxRound):hover>span{
    color: #4780F4;
}
.suggest>div.boxRound>div.boxRound{
    width: 154px;
    height: 156px;
    position: absolute;
    bottom: 0;
    right: 54px;
}
.suggest>div.boxRound.qrCode>div.boxRound{
    padding: 10px;
    height: auto;
    width: auto;
}
.suggest>div.boxRound>div.boxRound>i.close{
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    right: 4px;
    top: 4px;
    background: url("../../assets/images/close.png") center no-repeat;
    opacity: 0.6;
    cursor: pointer;
}
.suggest>div.boxRound>div.boxRound>i.icon{
    display: block;
    width: 32px;
    height: 32px;
    background: url("../../assets/images/icon.png") -44px -7px no-repeat;
    margin: 20px auto 8px;
}
.suggest>div.boxRound>div.boxRound>img{
    display: block;
    width: 120px;
    height: 120px;
}
.suggest>div.boxRound>div.boxRound>ul{
    display: block;
    font-size: 14px;
    padding-top: 28px;
}
.suggest>div.boxRound.download>div.boxRound>ul>li{
    line-height: 50px;
    margin-bottom: 10px;
    color: #0057dd;
}
.suggest>div.boxRound.download>div.boxRound>ul>li.AbleClick{
    opacity: 1;
    transition: opacity 0.2s ease;
}
.suggest>div.boxRound.download>div.boxRound>ul>li.AbleClick:hover{
    opacity: 0.66;
}
.suggest>div.boxRound.download>div.boxRound>ul>li>i{
    display: inline-block;
    width: 50px;
    height: 50px;
    vertical-align: top;
    margin-right: 8px;
    position: relative;
}
.suggest>div.boxRound.download>div.boxRound>ul>li>i::after{
    content: '';
    display: block;
}
.suggest>div.boxRound.download>div.boxRound>ul>li:nth-child(1)>i::after{
    width: 100%;
    height: 100%;
    background: url('../../assets/images/book.png') -3px 0 no-repeat;
}
.suggest>div.boxRound.download>div.boxRound>ul>li:nth-child(2)>i::after{
    width: 36px;
    height: 100%;
    margin: 0 auto;
    background: url('../../assets/images/book.png') -60px 0 no-repeat;
}
.suggest>div.boxRound>div.boxRound>li{
    display: block;
    font-size: 14px;
}
.suggest>div.boxRound>div.boxRound>div{
    line-height: 22px;
    font-size: 12px;
    color: #646c81;
    text-align: center;
}
.suggest>div.boxRound>div.boxRound>div>span{
    color: #888888;
    padding-top: 10px;
    line-height: 1;
    display: block;
    transform: scale(0.9);
}
.suggestBox{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(51,51,51,0.3);
}
.suggestBox>div{
    position: absolute;
    background-color: #fff;
    height: 420px;
    width: 100%;
    max-width: 940px;
    min-width: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    margin-left: 20px;
    border-radius: 20px;
    border-bottom-right-radius: 80px; 
    padding: 26px 70px 80px;
    box-sizing: border-box;
}
.suggestBox>div::after{
    width: 208px;
    height: 258px;
    position: absolute;
    content: '';
    left: -40px;
    bottom: -15px;
    background: url("../../assets/images/pen.png") center no-repeat;
}
.suggestBox>div>i{
    position: absolute;
    width: 39px;
    height: 39px;
    border-radius: 50%;
    text-align: center;
    line-height: 39px;
    font-size: 27px;
    top: -62px;
    right: 50px;
    color: #fff;
    background-color: #618EE9;
    transition: background-color 0.15s linear;
    cursor: pointer;
}
.suggestBox>div>i:hover{
    background-color: #46BBFF;
}
.suggestBox>div::before{
    width: 5px;
    height: 30px;
    background-color: #fff;
    content: '';
    position: absolute;
    display: block;
    top: -26px;
    margin-top: -2px;
    right: 67px;
    z-index: -1;
}
.suggestBox>div>div{
    width: 100%;
    height: 100%;
    font-size: 0;
    position: relative;
    z-index: 111;
}
.suggestBox>div>div>span{
    display: block;
    padding: 26px 0 14px;
    font-size: 16px;
    color: #484b5c;
    position: relative;
}
.suggestBox>div>div>span>i.red{
    color: rgb(255, 64, 64);
}
.suggestBox>div>div>div{
    position: relative;
}
.suggestBox>div>div>div>textarea.input{
    border-radius: 7px;
    width: 100%;
    height: 120px;
    font-size: 16px;
    line-height: 20px;
    padding: 8px 15px;
    background: transparent;
}
.suggestBox>div>div>div>i.placeholder{
    font-size: 16px;
    color: #a9a9a9;
    line-height: 19px;
    position: absolute;
    z-index: -1;
    left: 16px;
    top: 8px;
}
.suggestBox>div>div>div>i.placeholder::before{
    content: '';
    display: inline-block;
    vertical-align: top;
    width: 19px;
    height: 19px;
    background: url("../../assets/images/icon.png") -50px -67px no-repeat;
    margin-right: 6px;
}
.suggestBox>div>div>div.imageBox>i{
    width: 76px;
    height: 76px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    margin-right: 18px;
}
.suggestBox>div>div>div.imageBox>i>img.defaultImg{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.suggestBox>div>div>div.imageBox>i>i.el-icon-circle-close{
    position: absolute;
    z-index: 11;
    margin-left: 62px;
    font-weight: bold;
    margin-top: -8px;
    font-size: 19px;
    height: 20px;
    width: 19px;
    line-height: 21px;
    text-align: center;
    cursor: pointer;
    color: #FF2B2A;
    transition: color 0.15s linear;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #fff;
}
.suggestBox>div>div>div.imageBox>i>i.el-icon-circle-close:hover{
    color: #fe6c6f;
}
.suggestBox>div>div>div.imageBox>i>div.bigImg{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: rgba(51,51,51,0.3);
    margin-left: -20px;
    z-index: 111;
}
.suggestBox>div>div>div.imageBox>i>div.bigImg>img{
    display: block;
    width: unset;
    height: unset;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.suggestBox>div>div>div.imageBox>i.add{
    border: 1px dashed #cdcdcd;
    font-size: 30px;
    position: relative;
    cursor: pointer;
    transition: border-color 0.15s ease;
}
.suggestBox>div>div>div.imageBox>i.add::before,
.suggestBox>div>div>div.imageBox>i.add::after{
    content: '';
    position: absolute;;
    display: block;
    background-color: #cdcdcd;
    top: 50%;
    left: 50%;
    transition: background-color 0.15s ease;
}
.suggestBox>div>div>div.imageBox>i.add::before{
    width: 28px;
    height: 2px;
    margin: -1px 0 0 -14px;
}
.suggestBox>div>div>div.imageBox>i.add::after{
    width: 2px;
    height: 28px;
    margin: -14px 0 0 -1px;
}
.suggestBox>div>div>div.imageBox>i.add:hover{
    border-color: #c0c4cc;
}
.suggestBox>div>div>div.imageBox>i.add:hover::before,
.suggestBox>div>div>div.imageBox>i.add:hover::after{
    background-color: #c0c4cc;
}
i.must{
    position: absolute;
    margin-left: -20px;
}
.suggestBox>div>.sgBtn{
    position: absolute;
    left: 50%;
    margin-left: -50px;
    bottom: 26px;
}
u.error{
    line-height: 20px;
    margin-bottom: -20px;
    display: block;
    padding-left: 10px;
}
/* 渐变 */
.box-leave-active {
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    transition: all .2s ease;
}
.box-enter-active {
    -webkit-transition: all .5s ease .3s;
    -moz-transition: all .5s ease .3s;
    -o-transition: all .5s ease .3s;
    transition: all .5s ease .3s;
}
.box-enter, .box-leave-to{
    opacity: 0;
}
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
.fade-leave-active>div,
.fade-leave-active>img{
    animation: layer-bounceOut .2s linear 0s;
}
.fade-enter-active>div,
.fade-enter-active>img{
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
