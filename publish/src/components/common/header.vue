<template>
    <header class="content" :class="{largeHeader:judgeLink()&&this.$route.name}">
        <i class="logo" @click="jumpLink({btn:'index'})"></i>
        <i class="fontTop"><i></i></i>
        <i class="lineTop"></i>
        <span @click="jumpLink({btn:'index'})">前端开发规范</span>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data () {
        return {
        }
    },
    computed: {
    },
    methods:{
        jumpLink(item){
            switch(item.btn){
                case 'index':
                    this.$router.push('/');
                    break;
            }
        },
        judgeLink(){
            return (this.$route.hash?this.$route.hash.replace('#',''):'')?false:true
        },
    }
}
</script>


<style scoped>
header.content{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 64px;
    background: url('../../assets/images/top.png') center 70%/cover no-repeat;
    z-index: 100;
    min-width: 1000px;
    font-size: 0;
    box-shadow: 0 8px 20px 0 rgba(110,139,234,.15);
    transition: height 0.25s ease-in-out;
    overflow: hidden;
}
header.content>i.logo{
    display: inline-block;
    width: auto;
    height: 40px;
    position: relative;
    margin-top: 13px;
    margin-left: 12px;
    font-size: 0;
    cursor: pointer;
}
header.content>i.logo::before,
header.content>i.logo::after{
    display: inline-block;
    vertical-align: top;
    content: '';
    position: relative;
}
header.content>i.logo::before{
    width: 141px;
    height: 40px;
    transform: scale(0.9);
    background: url('../../assets/images/logo.png') center center/100% 100% no-repeat;
}
header.content>i.logo::after{
    opacity: .8;
    margin: 6px 16px 0 10px;
    width: 2px;
    height: 27px;
    background-color: #fff;
}
header.content>span{
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    margin-top: 13px;
    margin-left: 0px;
    color: #fff;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
}
header.largeHeader{
    position: relative;
    height: 710px;
}
header.largeHeader>span{
    font-size: 60px;
    margin-top: 480px;
    margin-left: 190px;
}
header>i.fontTop{
    display: block;
    position: absolute;
    top: 214px;
    width: 394px;
    height: 173px;
    left: 370px;
    background: url('../../assets/images/topFont.png') center center/100% 100% no-repeat;
    opacity: 0;
    transition: opacity 0.15s ease-in-out 0s;
}
header.largeHeader>i.fontTop{
    opacity: 1;
    transition: opacity 0.1s ease-in-out 0.25s;
}
header>i.fontTop>i{
    display: block;
    position: absolute;
    bottom: -34px;
    height: 14px;
    width: 124px;
    background-color: rgba(255, 255, 255, 0.86);
    opacity: 0;
    transition: opacity 0s linear 0s;
}
header.largeHeader>i.fontTop>i{
    opacity: 1;
    transition: opacity 0.12s ease-in-out 0.45s;
    animation: fontBottom 3.4s ease-in-out 1s infinite;
}
header>i.lineTop{
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -270px;
    left: 84%;
    height: 505px;
    width: 34px;
    background: url('../../assets/images/topLineFont.png') center center/100% 100% no-repeat;
    opacity: 0;
    transition: opacity 0.1s linear 0.15s;
}
header.largeHeader>i.lineTop{
    opacity: 1;
    transition: opacity 0s linear 0s;
}
@keyframes fontBottom
{
    0% {
        left: 0px;
        width: 124px;
        transform: rotate(0deg);
    }
    
    6% {
        left: 0px;
        width: 260px;
        transform: rotate(0deg);
    }
    22% {
        left: 134px;
        width: 260px;
        transform: rotate(0deg);
    }
    38% {
        left: 380px;
        width: 14px;
        transform: rotate(0deg);
    }
    40% {
        left: 380px;
        width: 14px;
        transform: rotate(180deg);
    }
    42% {
        left: 380px;
        width: 14px;
        transform: rotate(360deg);
    }
    44% {
        left: 380px;
        width: 14px;
        transform: rotate(180deg);
    }
    46% {
        left: 380px;
        width: 14px;
        transform: rotate(360deg);
    }
    48% {
        left: 380px;
        width: 14px;
        transform: rotate(0deg);
    }
    62% {
        left: 134px;
        width: 260px;
        transform: rotate(0deg);
    }
    72% {
        left: 0px;
        width: 260px;
        transform: rotate(0deg);
    }
    90% {
        left: 0px;
        width: 124px;
        transform: rotate(0deg);
    }
    100% {
        left: 0px;
        width: 124px;
        transform: rotate(0deg);
    }
}
</style>
