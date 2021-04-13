<template>
<div class="fillBox">
    <div class="boxTitle titleFix">
        <i class="dashboard_icon"></i><span>销售行为仪表盘</span>
        <unit-btn type='auto right' @click="downloadQuery" text='导出团队成员排名' v-if="tab.choose==='team'"></unit-btn>
    </div>
    <div class="contentFix">
        <div class="boxRel behavior">
            <div class="loadingCont" v-if="loading"><unit-loading :loading='loading'></unit-loading></div>
            <div class="formBox" v-if='tab.list.length>0'>
                <div class="left">
                    <span class="formBox_text">时间</span>
                    <span>
                        <unit-time class="DialogtimeBox" id='time' @return='dropdownReturn' :value="[result.planDateFrom,result.planDateTo]"></unit-time>
                    </span>
                </div>
                <div class="btnBox left">
                    <unit-btn @click="query()" text='查询'></unit-btn>
                </div>
            </div>
            <unit-tab class="contactListTab" :tab='tab' @click="returnBtn" v-if='tab.list.length>0'></unit-tab>
            <component :is="tab.choose" :dom='dom' :range="tab.choose" :date="result" v-if="tab.choose"></component>
        </div>
    </div>
</div>
</template>

<script>
import unitTab from '@/unit/components/tab'
import unitTime from '@/unit/components/element/timeRange'
export default {
    name: 'salesBehavior',
    props:['dom'],
    components:{
        unitTab,
        unitTime,
        country:resolve => require(['./behavior/country'],resolve),  //全国
        team:resolve => require(['./behavior/team'],resolve),  //团队
    },
    data () {
        return {
            loading: false,
            selMod:{
                contactName:'',
                phone:'',
            },
            selRes:{},
            tab:{
                list:[],
                choose:null
            },
            result:{
                planDateFrom:'',
                planDateTo:'',
                queryBtn: false,
            },
        }
    },
    computed: {
        userInfo(){
            let userInfo=this.$store.state.userInfo?this.$store.state.userInfo:{};
            let isCharge=userInfo.info&&userInfo.info.staff&&userInfo.info.staff.isCharge==='1'?true:false,
                staffId=userInfo.info&&userInfo.info.staff?userInfo.info.staff.staffId:null
            return {isCharge,staffId};
        },
    },
    methods:{
        downloadQuery() {
            let param = {
                dateFrom: this.result.planDateFrom,
                dateTo: this.result.planDateTo,
                top10Flg: 0
            }
            param=JSON.parse(JSON.stringify(param));
            this.$api.download.visittimeslistexport(param,res=>{
                this.$pubfunc.downloadFile(res,'团队成员拜访量报表'+param.dateFrom.split('/').join('')+'-'+param.dateTo.split('/').join('')+'.xlsx');
                this.ajaxIng=false;
                this.$store.commit('alertFn',{
                    type:'success',
                    text:'导出成功',
                    func:()=>{
                        this.$emit('success');
                    }
                })
            });
        },
        dropdownReturn(data) {
            this.result.planDateFrom = this.$pubfunc.TimeTransform('YYYY/MM/DD',data[0]);
            this.result.planDateTo = this.$pubfunc.TimeTransform('YYYY/MM/DD',data[1]);
        },
        showDialog(data){
            // console.log(data)
            this.$emit('dialog',data)
        },
        loadingChange(j){
            this.loading=j
        },
        returnBtn(type,k){
            switch(type){
                case 'tab':
                    // this.tab.choose!==k?this.loadingChange(true):null;
                    this.tab.choose!==k?this.loadingChange(false):null;
                    this.tab.choose=k;
                    break;
            }
        },
        query(){
            this.result.queryBtn = true;
            this.result = JSON.parse(JSON.stringify(this.result))
        },
        getWeek() {
            var Nowdate=new Date();     
            var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
            var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);     
            // let M=Number(WeekFirstDay.getMonth())+1     
            // this.result.planDateFrom = WeekFirstDay.getFullYear()+"/"+M+"/"+WeekFirstDay.getDate();
            // let N=Number(WeekLastDay.getMonth())+1     
            // this.result.planDateTo = WeekLastDay.getFullYear()+"/"+N+"/"+WeekLastDay.getDate();
            this.result.planDateFrom = this.$pubfunc.TimeTransform('YYYY/MM/DD',WeekFirstDay);
            this.result.planDateTo = this.$pubfunc.TimeTransform('YYYY/MM/DD',WeekLastDay);
        },
    },
    created() {
        this.$pubfunc.judgeBtn('behavior:top10')?this.tab.list.push({id:'country',name:'拜访量Top10'}):null;
        this.$pubfunc.judgeBtn('behavior:team')?this.tab.list.push({id:'team',name:'团队成员拜访量排名'}):null;
        this.tab.list.length>0?(this.tab.choose=this.tab.list[0].id,this.getWeek()):null
    },
    mounted(){
    },
}
</script>

<style scoped>
.behavior .elTimebox.el-date-editor--daterange.el-input__inner{
    width: 300px;
}
.formBox>div:not(.btnBox){
    position: relative;
}
.formBox>div:nth-child(2){
    padding-left: 38px;
    /* width: calc(20% - 170px); */
}
.formBox>div:nth-child(1){
    padding-left: 50px;
    /* width: calc(20% + 8px); */
}
.formBox>div>.formBox_text{
    position: absolute;
    left: 0;
    top: 0;
}
.formBox>div>div>*{
    width: 100%;
}
.boxRel .contactListTab{
    margin-bottom: 16px;
}
</style>