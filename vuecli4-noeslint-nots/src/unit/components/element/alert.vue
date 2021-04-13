<template>
    <transition name="right">
        <div class="content">
            <!--  v-if="show" -->
            <!-- <el-alert :title="text" :type="type" :closable="false" show-icon></el-alert> -->
        </div>
    </transition>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_Alert',
    data () {
        return{
        }
    },
    computed:{
        alert(){
            return this.$store.state.alert;
        },
    },
    watch:{
        'alert':{
            deep:true,
            handler(alert){
                if(alert.show){
                    let type=alert.type?alert.type:'success'
                    let text=alert.text;
                    let time=alert.time?alert.time:(type==='error'?10000:((text.length>4?(text.length>8?(text.length>10?(text.length>15?(text.length>28?4000:3000):2400):1800):1500):1200)))
                    let msg={
                        showClose: type==='error'||type==='warning'?true:false,
                        message: text,
                        type: type,
                        duration:time
                    }
                    this.$message.closeAll();
                    this.$message(msg);
                    alert.func?alert.func():null;
                    this.$store.commit('alertFn',{
                        show: false
                    })
                }else{
                    this.show=false
                }
            },
        }
    },
    created(){
    },
    mounted(){
    },
    methods:{
    }
}
</script>


<style scoped>
.content{
    position: absolute;
    right: 0;
    top: 85px;
    z-index: 10000;
    transform:translate(0,0);
    opacity: 1;
}
.right-leave-active {
    opacity: 0;
    -webkit-transform:translate(100%,0);
    transform:translate(100%,0);
    -webkit-transition: all .3s cubic-bezier(.55,0,.1,1),opacity .3s cubic-bezier(.23,1,.32,1) .02s;
    -moz-transition: all .3s cubic-bezier(.55,0,.1,1),opacity .3s cubic-bezier(.23,1,.32,1) .02s;
    -o-transition: all .3s cubic-bezier(.55,0,.1,1),opacity .3s cubic-bezier(.23,1,.32,1) .02s;
    transition: all .3s cubic-bezier(.55,0,.1,1),opacity .3s cubic-bezier(.23,1,.32,1) .02s;
}
.right-enter-active {
    -webkit-transition: all .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.55,0,.1,1) .02s;
    -moz-transition: all .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.55,0,.1,1) .02s;
    -o-transition: all .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.55,0,.1,1) .02s;
    transition: all .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.55,0,.1,1) .02s;
}
.right-enter,.right-leave{
    opacity: 0;
    -webkit-transform:translate(100%,0);
    transform:translate(100%,0);
}
</style>