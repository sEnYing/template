<template>
    <div class="progress" :class="{'warn':total()>(warn?warn:100)}" :style="{height:height?(height+'px'):null,borderRadius:height?(height/2+'px'):null,lineHeight:(height?height:14)+'px'}">
        <div :style="{'background':background?background:null}">
            <i :style="{width:(val?Number(val):0)+'%',borderRadius:height?(height/2+'px'):null,zIndex:percents.length-i,backgroundColor:color&&color[i]?color[i]:null}" v-for="(val,i) in percents" :key="i"></i>
        </div>
        <span v-if="text!==false">{{text?text:(total()+'%')}}</span>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'unitProgress',
    props:['background','warn','percents','height','text','color'],
    data () {
        return{
        }
    },
    computed: {
        userInfo(){
            return this.$store.state.userInfo?this.$store.state.userInfo:{};
        },
    },
    methods:{
        total(){
            let val=0;
            this.percents.map(v=>{val+=v?Number(v):0});
            return (Math.round(100*(val))===100*(val)?val:(Math.round(100*(val))/100).toFixed(2))
        },
    }
}
</script>


<style scoped>
.progress{
    width: 100%;
    height: 14px;
    position: relative;
    white-space: nowrap;
    font-size: 0;
}
.progress>div{
    vertical-align: top;
    display: inline-block;
    width: 100%;
    height: 14px;
    position: relative;
    background-color: #ebeef5;
    border-radius: 7px;
    overflow: hidden;
}
.progress>span{
    display: inline-block;
    padding-left: 14px;
    font-size: 12px;
}
.progress.warn>span{
    color: #fa5135!important;
}
.progress>div>i{
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: 7px;
}
.progress>div>i:nth-child(1){
    background-color: #e8cd6d;
}
.progress>div>i:nth-child(2){
    background-color: #f6a459;
}
.progress>div>i:only-child{
    background-color: #73b8ff;
}
.progress.warn>div>i:nth-child(1){
    background-color: #ff9a77!important;
}
.progress.warn>div>i:nth-child(2),.progress.warn>div>i:only-child{
    background-color: #fa5135!important;
}
</style>
