<template>
    <div class="weekBox">
        <div class="title">
            <a class="AbleClick" @click="back"><i class="el-icon-arrow-left" v-show="month"></i>{{month}}月</a>
            <span v-show="year&&week">{{year}}年 第{{week}}周</span>
        </div>
        <ul>
            <li class="AbleClick" v-for="(item,i) in list" :key="'week'+i" @click="changeTable(item)">
                <div class="topBox">
                    <span class="weekText">{{item.week}}<i v-if="item.today">今天</i></span>
                    <span class="dateText">{{item.date}}</span>
                </div>
                <el-scrollbar class="weekScrollbar">
                    <ul>
                        <li v-for="(val,j) in res[item.dateStr]?res[item.dateStr]:[]" :key="'list'+j">
                            <span><unit-popover :content="val.time_"></unit-popover></span>
                            <div><unit-popover :content="val.visitTypeTxt+val.customerName" :lines='2'></unit-popover></div>
                        </li>
                        <li class="empty" v-if="i<5&&(!res[item.dateStr]||res[item.dateStr].length===0)">
                            <i></i>
                            <span>暂无计划</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </li>
        </ul>
    </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
export default {
    name: 'week',
    components:{unitPopover},
    data () {
        return{
            year:'',
            month:'',
            week:'',
            list:[],
            res:{},
            onday:24*60*60*1000
        }
    },
    computed: {
        time(){
            let time=this.$pubfunc.timestampToTime(),onday=this.onday;
            this.year=time.Year;
            this.month=time.Month;
            this.week=this.$pubfunc.getWeekOfYear();
            let week=time.Week?time.Week:7;
            let timeS=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()-(week-1)*onday),
                timeE=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()+(7-week)*onday),
                list=[],weekArr=['日','一','二','三','四','五','六'];
            let startTime=this.$pubfunc.timeToTimestamp(timeS.Year+'/'+timeS.Month+'/'+timeS.Day);
            for(let i=0;i<7;i++){
                let thisTime=this.$pubfunc.timestampToTime(startTime+i*onday)
                list.push({
                    today:time.Day===thisTime.Day?true:false,
                    dateStr:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(thisTime.Year,Number(thisTime.Month)-1,thisTime.Day,0,0,0)),
                    week:thisTime.Week||thisTime.Week===0?('星期'+weekArr[Number(thisTime.Week)]):'',
                    date:(Number(timeE.Day)<7&&((Number(time.Day)<7&&Number(thisTime.Day)>7)||(Number(time.Day)>7&&Number(thisTime.Day)<7)))?this.$pubfunc.TimeTransform('MM/DD',new Date(thisTime.Year,Number(thisTime.Month)-1,thisTime.Day,0,0,0)):this.$pubfunc.TimeTransform('DD',new Date(thisTime.Year,Number(thisTime.Month)-1,thisTime.Day,0,0,0)),
                })
            }
            this.list=list;
            return {
                timeT:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(time.Year,Number(time.Month)-1,time.Day,0,0,0)),
                timeS:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeS.Year,Number(timeS.Month)-1,timeS.Day,0,0,0)),
                timeE:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeE.Year,Number(timeE.Month)-1,timeE.Day,0,0,0))
            }
        },
    },
    methods:{
        getWeekData(){
            let param={
                visitDateFrom:this.time.timeS,
                visitDateTo:this.time.timeE,
                customerName:'',
                page:1,
                limit: 0
            }
            // console.log(param,this.list)
            let userInfo=this.$store.state.userInfo?this.$store.state.userInfo:{};
            userInfo.info&&userInfo.info.staff&&userInfo.info.staff.staffId?param.staffId=userInfo.info.staff.staffId:null;
            this.$api.service.visit.planList(param,res=>{
                // console.log(res)
                switch(res.code){
                    case '0':
                        this.total=res.data.total;
                        let json={};
                        (res.data.list?res.data.list:[]).map(v=>{
                            if(!json[v.date]){json[v.date]=[]}
                            v.time_=this.$pubfunc.transTime(v.time);
                            json[v.date].push(v)
                        });
                        this.res=json;
                        // console.log(json)
                        break;
                }
            })
        },
        changeTable(item){
            this.$emit('clickli',item.dateStr)
        },
        back(){
            this.$emit('back')
        }
    },
    created(){
        this.getWeekData()
    },
    mounted(){},
}
</script>

<style scoped>
.weekBox{
    width: 100%;
    height: 100%;
    padding-top: 52px;
    box-sizing: border-box;
    position: relative;
}
.weekBox>.title{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #4680f4;
    border-radius: 10px;
    text-align: center;
    z-index: 2;
}
.weekBox>.title>*{
    color: #ffffff;
    font-size:16px;
}
.weekBox>.title>a{
    display: block;
    position: absolute;
    left: 8px;
    top: 8px;
    line-height: 30px;
    opacity: 1;
}
.weekBox>.title>a:hover{
    opacity: 0.8;
}
.weekBox>ul{
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 0;
    overflow: hidden;
}
.weekBox>ul>li{
    display: inline-block;
    width: 14.2857%;
    /* width: calc(100% / 7); */
    height: 100%;
    position: relative;
    border-right: 1px solid #cfcfcf;
    padding: 84px 0 6px;
    box-sizing: border-box;
    /* background-color: #fff; */
    vertical-align: top;
}
.weekBox>ul>li:nth-last-child(1){
    border-right: 0;
}
.weekBox>ul>li>div.topBox{
    position: absolute;
    top: 0;
    left: 0px;
    right: -1px;
    height: 75px;
    line-height: 74px;
    text-align: center;
    border-bottom: 3px solid;
}
.weekBox>ul>li>div.topBox>span.weekText{
    font-size: 14px;
    color: #444444;
}
.weekBox>ul>li:nth-last-child(1)>div>span.weekText,
.weekBox>ul>li:nth-last-child(2)>div>span.weekText{
    color: #ff3a3a;
}
.weekBox>ul>li:nth-child(1)>div{
    border-color: #68bba2;
}
.weekBox>ul>li:nth-child(2)>div{
    border-color: #f3a465;
}
.weekBox>ul>li:nth-child(3)>div{
    border-color: #f3e465;
}
.weekBox>ul>li:nth-child(4)>div{
    border-color: #f3657c;
}
.weekBox>ul>li:nth-child(5)>div{
    border-color: #69bfee;
}
.weekBox>ul>li:nth-child(6)>div{
    border-color: #b278e8;
}
.weekBox>ul>li:nth-child(7)>div{
    border-color: #78a5e8;
}
.weekBox>ul>li>div.topBox>span.weekText>i{
    display: inline-block;
    background-color: #fb9f0c;
    color: #fff;
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 7px;
    line-height: 1;
    vertical-align: top;
    margin-top: 29px;
    margin-left: 4px;
}
.weekBox>ul>li>div.topBox>span.dateText{
    position: absolute;
    display: block;
    right: 10px;
    font-size: 16px;
    bottom: 5px;
    line-height: 1;
}
.weekBox>ul>li>.weekScrollbar{
    height: 100%;
}
.weekBox>ul>li ul{
    padding: 6px 8px;
    box-sizing: border-box;
}
.weekBox>ul>li ul>li{
    width: 100%;
    height: 80px;
    border-radius: 10px;
    background-color: #f7f9fd;
    margin-top: 12px;
    padding: 10px 6px;
    box-sizing: border-box;
}
.weekBox>ul>li ul>li:not(.empty){
    font-size: 14px;
    color: #444444;
    line-height: 18px;
}
@media screen and (max-width: 1500px){
    .weekBox>ul>li ul>li:not(.empty){
        font-size: 12px;
    }
}
.weekBox>ul>li ul>li:nth-child(1){
    margin-top: 0;
}
.weekBox>ul>li ul>li:not(.empty)>span{
    display: block;
}
.weekBox>ul>li ul>li:not(.empty)>span::before{
    display: inline-block;
    content: '';
    vertical-align: top;
    height: 18px;
    width: 20px;
    margin-right: 4px;
    background: url('../../../assets/images/loginIcon.png') -1px -25px no-repeat;
}
.weekBox>ul>li ul>li>span>div.popover{
    width: calc(100% - 24px);
    vertical-align: top;
    display: inline-block;
}
.weekBox>ul>li ul>li:not(.empty)>div{
    padding-left: 10px;
    margin-top: 6px;
    white-space: normal;
    height: 36px;
    overflow: hidden;
}
.weekBox>ul>li ul>li:not(.empty)>div::before{
    content: '';
    display: inline-block;
    vertical-align: top;
    margin: 6px 4px 0 -10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #636365;
}
.weekBox>ul>li ul>li>div>div.popover{
    vertical-align: top;
    display: inline-block;
}
@media screen and (max-width: 1500px){
    .weekBox>ul>li ul>li:not(.empty)>div::before{
        margin: 7px 6px 0 -10px;
        width: 4px;
        height: 4px;
    }
}
.weekBox>ul>li ul>li.empty{
    padding-top: 12px;
    box-sizing: border-box;
}
.weekBox>ul>li ul>li.empty>i{
    width: 56px;
    height: 37px;
    display: block;
    margin: 0 auto 6px;
    background: url('../../../assets/images/planEmpty.png') 100% 100% no-repeat;
}
.weekBox>ul>li ul>li.empty>span{
    display: block;
    text-align: center;
    line-height: 1;
    font-size: 12px;
    color: #cccccc;
}
</style>
<style>
.weekBox>ul>li>.weekScrollbar>div.el-scrollbar__wrap{
    overflow-x: hidden;
}
</style>