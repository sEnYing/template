<template>
    <header class="content">
        <i @click="jumpLink({btn:'index'})"><i></i></i>
        <span ref="rightBox"><a class="AbleClick message" @click="jumpLink({btn:'message'})"><i v-if='msgCount'>{{msgCount>99?'99+':msgCount}}</i></a><a class="AbleClick manage"><ul class="DefaultClick"><li class="AbleClick AllHover" v-for="(item,index) in more" :key='index' @click="jumpLink(item)">{{item.name}}</li></ul></a></span>
    </header>
</template>

<script>
import unitSelect from '@/unit/components/select'
export default {
    name: 'Header',
    components:{unitSelect},
    data () {
        return {
            focus:false,
            blur:false,
            selectInput:'',
            more:[
                {
                    name:'修改密码',
                    url:null,
                    btn:'editPass'
                },
                {
                    name:'退出',
                    url:null,
                    btn:'logout'
                },
            ]
        }
    },
    computed: {
        userInfo(){
            return this.$store.state.userInfo?this.$store.state.userInfo:{};
        },
        msgCount(){
            return this.$store.state.msgCount?Number(this.$store.state.msgCount):0;
        }
    },
    methods:{
        jumpLink(item){
            switch(item.btn){
                case 'index':
                    this.$router.push('/');
                    break;
                case 'message':
                    this.$router.push({name:'message'});
                    break;
                case 'logout':
                    this.logout();
                    break;
                case 'editPass':
                    this.$emit('showdialog',{show:true,link:'editPass',title:'修改密码',small:true,data:{account:this.userInfo.account,logout:this.logout}});
                    break;
            }
        },
        logout(){
            this.$api.account.logout(res=>{
                switch(res.code){
                    case '0':
                        this.$store.dispatch('clearlogin');
                        break;
                }
            })
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
    height: 80px;
    background-color: #fff;
    z-index: 100;
    min-width: 1000px;
}
header.content>i{
    display: block;
    width: auto;
    height: 40px;
    position: absolute;
    top: 21px;
    left: 12px;
    font-size: 0;
    cursor: pointer;
}
header.content>i::before,
header.content>i::after{
    display: inline-block;
    vertical-align: top;
    content: '';
    position: relative;
}
header.content>i::before{
    width: 141px;
    height: 40px;
    background: url('../../assets/images/logo.png') center center/100% 100% no-repeat;
}
header.content>i::after{
    width: 390px;
    height: 30px;
    margin-top: 5px;
    background: url('../../assets/images/loginLogo.png') center center/100% 100% no-repeat;
}
header.content>i>i{
    display: inline-block;
    position: relative;
    vertical-align: top;
    width: 2px;
    height: 27px;
    background-color: #3f3a39;
    opacity: 0.8;
    margin: 6px 8px;
}
header.content>div{
    position: absolute;
    right: 290px;
    color: #7f879d;
    width: 300px;
    height: 35px;
    top: 21px;
    padding-left: 20px;
    box-sizing: border-box;
    background-color: #fff;
}
header.content>div::before{
    position: absolute;
    content: '';
    display: block;
    top: 50%;
    left: 0;
    width: 17px;
    height: 17px;
    background: url('../../assets/images/icon.png') -14px -65px no-repeat;
    transform: translateY(-50%);
}
header.content>div>input{
    height: 100%;
    width: 100%;
    border: 0;
    font-size: 14px;
    color: #5d6680;
    padding: 0 10px;
}
header.content>div>input+i{
    position: absolute;
    display: block;
    width: 100%;
    height: 1px;
    background-color:rgba(234,234,234,0);
    transition: background-color 0.2s linear;
    bottom: 0;
    left: 0;
}
header.content>div>input:focus+i{
    background-color:rgba(234,234,234,1);
}
header.content>span{
    display: block;
    white-space: nowrap;
    box-sizing: border-box;
    line-height: 30px;
    margin-top: 25px;
    top: 0;
    right: 14px;
    z-index: 1;
    position: absolute;
    text-align: right;
    color: #535353;
}
header.content>span>a{
    font-size: 16px;
    display: inline-block;
    position: relative;
    vertical-align: top;
    /* padding: 0 5px 0 30px; */
    opacity: 1;
    transition: opacity 0.15s linear;
    margin-left: 20px;
    height: 30px;
    width: 30px;
}
header.content>span>a.manage{
    width: 50px;
}
header.content>span>a::before{
    width: 23px;
    height: 23px;
    display: block;
    content: '';
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../../assets/images/loginIcon.png') no-repeat;
    transition: opacity 0.15s linear;
}
header.content>span>a.manage::before{
    background-position: 0px 1px;
}
header.content>span>a.message::before{
    background-position: 0px -43px;
}
/* header.content>span>a:hover{
    opacity: 0.8;
} */
header.content>span>a:hover::before{
    opacity: 0.72;
}
header.content>span>a.manage::after{
    content: '';
    display: inline-block;
    vertical-align: top;
    margin: 12px 2px 6px 5px;
    width: 16px;
    height: 12px;
    background: url("../../assets/images/icon.png") -14px -92px no-repeat;
    transform: rotate(0deg) scale(0.8);
    transition: transform 0.2s linear;
}
header.content>span>a.manage:hover::after{
    transform: rotate(-180deg) scale(0.8);
}
header.content>span>a>i{
    font-size: 12px;
    position: absolute;
    color: #fff;
    background-color: #e82121;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    display: block;
    border-radius: 9px;
    padding: 0 4px;
    text-align: center;
    box-sizing: border-box;
    left: 12px;
    top: -5px;
    transform: scale(0.9);
}
header.content>span>a>ul{
    position: absolute;
    background-color: #fff;
    right: 0px;
    top: 35px;
    border-radius: 5px;
    box-shadow :0px 2px 10px 0px rgba(31,118,189,0.23);
    /* border: 1px solid rgba(227,230,239,1); */
    z-index: 100;
    opacity: 0;
    transition: opacity 0.15s linear,transform 0.2s linear 0.15s;
    padding: 10px 0;
}
header.content>span>a>ul{
    transform: scaleY(0) translateY(-100%);
}
header.content>span>a>ul::before{
    content: '';
    top: -5px;
    display: block;
    position: absolute;
    width: 50px;
    right: 0;
    height: 5px;
}
header.content>span>a:hover>ul{
    transition: transform 0.2s linear,opacity 0.2s linear;
    opacity: 1;
}
header.content>span>a:hover>ul{
    transform: scaleY(1) translateY(0);
}
div>ul>li>a:hover>ul{
    transform: scaleY(1) translate(50%,0);
}
/* header.content>span>a>ul::after{
    position: absolute;
    content: '';
    display: inline-block;
    border-bottom: 6px solid #fff;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    top: -6px;
    z-index: 100;
}
header.content>span>a>ul::after{
    right: 50px;
} */
header.content>span>a>ul>li{
    line-height: 35px;
    font-size: 14px;
    color: #60636a;
    padding: 0 15px;
    text-align: center;
    transition: all 0.15s linear;
    min-width: 150px;
    box-sizing: border-box;
}
header.content>span>a>ul>li:hover{
    /* background-color: #ecf5ff; */
    color: #4780F4;
}
</style>
