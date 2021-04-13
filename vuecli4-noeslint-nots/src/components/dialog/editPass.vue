<template>
    <div>
        <ul class="formUl editpassDialog">
            <li class="small"><span class="formTitle">登录账号</span><a>{{userInfo&&userInfo.info?userInfo.info.loginName:''}}</a><input type='text' style="width:0;height:0;border:0;padding:0;z-index:-1;opacity:0"/><input type='password' style="width:0;height:0;border:0;padding:0;z-index:-1;opacity:0" autocomplete="on"/></li>
            <li :class="{'errorBorder':error.key==='oldPass'}">
                <span class="formTitle"><i class="must">*</i>原密码：</span>
                <input type="password" v-model="oldPass" maxlength="20" @input="inputChange('oldPass')" placeholder="请输入原密码" ref='input'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='oldPass'">{{error.value}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='newPass'}">
                <span class="formTitle"><i class="must">*</i>新密码：</span>
                <input type="password" v-model="newPass" maxlength="20" @input="inputChange('newPass')" placeholder="长度不少于8位，必须包含大小写字母和数字">
                <transition name="publicTransition"><u class="error" v-if="error.key==='newPass'">{{error.value}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='confirmPass'}">
                <span class="formTitle"><i class="must">*</i>确认密码：</span>
                <input type="password" v-model="confirmPass" maxlength="20" @input="inputChange('confirmPass')" placeholder="请重新输入您的新密码">
                <transition name="publicTransition"><u class="error" v-if="error.key==='confirmPass'">{{error.value}}</u></transition>
            </li>
            <li>
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='ajaxIng' text='确定'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消'></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'editPass',
    props:['data'],
    data () {
        return{
            password:false,
            ajaxIng:false,
            oldPass:'',
            newPass:'',
            confirmPass:'',
            error:{key:null,value:''}
        }
    },
    inject: ['close'],
    computed: {
        userInfo(){
            return this.$store.state.userInfo?this.$store.state.userInfo:{};
        },
    },
    methods:{
        inputChange(key){
            this.error.key===key?this.error.key=null:null;
        },
        submit(){
            if(this.ajaxIng){return;}
            if(!this.oldPass){
                this.error.key='oldPass'
                this.error.value='请输入原密码'
                return
            }
            if(!this.newPass){
                this.error.key='newPass'
                this.error.value='请输入新密码'
                return
            }else{
                let reg1=/^[a-z]+$/,reg2=/^[A-Z]+$/,reg3=/^[0-9]+$/,val=this.newPass;
                // console.log(!reg1.test(val.trim()),!reg2.test(val.trim()),!reg3.test(val.trim()))
                if (val.trim().length<8||reg1.test(val.trim())||reg2.test(val.trim())||reg3.test(val.trim())) {
                    this.error.key='newPass'
                    this.error.value='密码长度不少于8位，且必须包含大小写字母和数字'
                    return
                }
            }
            if(!this.confirmPass){
                this.error.key='confirmPass'
                this.error.value='请确认密码'
                return
            }else if(this.confirmPass.trim()!==this.newPass.trim()){
                this.error.key='confirmPass'
                this.error.value='密码输入不一致，请重新输入'
                return
            }
            this.ajaxIng=true;
            this.$api.account.changepass({oldPass:this.oldPass,newPass:this.newPass,confirmPass:this.confirmPass},res=>{
                switch(res.code){
                    case '0':
                        this.$emit('close');
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'编辑成功',
                            func:()=>{
                                this.$api.account.logout(res=>{
                                    switch(res.code){
                                        case '0':
                                            this.$store.dispatch('clearlogin');
                                            break;
                                    }
                                })
                            }
                        })
                        break;
                    default:
                        this.ajaxIng=false;
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message
                        }):null;
                }
            })
        }
    },
    mounted(){
        // console.log(this.$store.state.userInfo)
        this.$emit('ok');
    }
}
</script>


<style scoped>
.editpassDialog .formTitle{
    width: 108px;
}
.editpassDialog>li{
    white-space: nowrap;
}
.editpassDialog>li>input{
    width: 310px;
}
.editpassDialog>li>u.error{
    width: 308px!important;
}
</style>
