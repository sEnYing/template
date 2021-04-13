<template>
    <div class="yearBox">
       <div class="title">
            <a class="AbleClick" @click="changeMonth(-1)"><i class="el-icon-arrow-left" v-show="month"></i>{{month>1?(month-1):(11+month)}}月</a>
            <span v-show="year&&month">{{year}}年 {{month}}月</span>
            <a class="AbleClick right" @click="changeMonth(1)">{{month>11?(month-11):(month+1)}}月<i class="el-icon-arrow-right" v-show="month"></i></a>
        </div>
        <ul>
            <li v-for="(item,i) in week" :key="'week'+i" class="weekTitle">
                <div class="topBox">
                    <span class="yearText">{{item.week}}</span>
                </div>
            </li>
            <li :class="{'AbleClick':res[item.dateStr]&&res[item.dateStr].length>1}" v-for="(item,i) in list" :key="'date'+i" @mouseenter="showMore(item)" @mouseleave="showMore(null)">
                <el-scrollbar class="yearScrollbar">
                    <div class="ul">
                        <div class="time" :class="{'notThis':!item.thisM}">{{item.date}}<i class="icon" v-if='res[item.dateStr]&&res[item.dateStr].length>0'></i><i class="today" v-if="item.today">今天</i></div>
                        <div class="li" v-if='res[item.dateStr]&&res[item.dateStr].length>0'>
                            <span><unit-popover :content="res[item.dateStr][0].time_"></unit-popover></span>
                            <div><unit-popover :content="res[item.dateStr][0].visitTypeTxt+res[item.dateStr][0].customerName" :lines='2'></unit-popover></div>
                        </div>
                        <i v-if='res[item.dateStr]&&res[item.dateStr].length>1' class="more">...</i>
                    </div>
                </el-scrollbar>
                <transition name='fadeYear'>
                    <div :class="{'showLeft':i%7<5,'showRight':i%7>=5,'showTop':(i+1)/7<=4,'showTop1':(i+1)/7<=5&&(i+1)/7>4,'showTop2':(i+1)/7<=6&&(i+1)/7>5,}" v-if="more===item.dateStr&&res[item.dateStr]&&res[item.dateStr].length>1" class="moreBox">
                        <el-scrollbar class="yearScrollbar">
                            <ul>
                                <li v-for="(val,j) in res[item.dateStr]?res[item.dateStr]:[]" :key="'list'+j">
                                    <span>{{val.time_}}</span>
                                    <div>{{val.visitTypeTxt}}{{val.customerName}}</div>
                                </li>
                                <li class="empty" v-if="i<5&&(!res[item.dateStr]||res[item.dateStr].length===0)">
                                    <i></i>
                                    <span>暂无计划</span>
                                </li>
                            </ul>
                        </el-scrollbar>
                    </div>
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
export default {
    name: 'year',
    components:{unitPopover},
    data () {
        return{
            st:null,
            year:'',
            month:'',
            week:[],
            list:[],
            res:{},
            onday:24*60*60*1000,
            more:'',
            today:this.$pubfunc.timestampToTime(),
            timeStamp:this.$pubfunc.timestampToTime()
        }
    },
    computed: {
        time(){
            let time=this.timeStamp,
                today=this.today,
                onday=this.onday,
                monthF=new Date(time.Year,Number(time.Month)-1,1,0,0);
            let monthFstamp=this.$pubfunc.timestampToTime(monthF);
            this.year=time.Year;
            this.month=Number(time.Month);
            let week=monthFstamp.Week?monthFstamp.Week:7;
            let timeS=this.$pubfunc.timestampToTime(monthF-(week-1)*onday),
                timeE=this.$pubfunc.timestampToTime(monthF-(week-1-41)*onday),
                list=[],weekArr=['日','一','二','三','四','五','六'];
            let startTime=this.$pubfunc.timeToTimestamp(timeS.Year+'/'+timeS.Month+'/'+timeS.Day);
            this.week=[];
            for(let i=0;i<42;i++){
                let thisTime=this.$pubfunc.timestampToTime(startTime+i*onday)
                i<7?this.week.push({week:thisTime.Week||thisTime.Week===0?('星期'+weekArr[Number(thisTime.Week)]):'',}):null
                // console.log(Number(thisTime.Month),this.month)
                list.push({
                    today:today.Year===thisTime.Year&&today.Month===thisTime.Month&&today.Day===thisTime.Day?true:false,
                    dateStr:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(thisTime.Year,Number(thisTime.Month)-1,thisTime.Day,0,0,0)),
                    // week:thisTime.Week||thisTime.Week===0?('星期'+weekArr[Number(thisTime.Week)]):'',
                    date:this.$pubfunc.TimeTransform('DD',new Date(thisTime.Year,Number(thisTime.Month)-1,thisTime.Day,0,0,0)),
                    thisM:(Number(thisTime.Month)!==this.month?false:true),
                })
            }
            this.list=list;
            return {
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
            // console.log(param,this.list,this.time)
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
        changeMonth(i){
            // console.log(this.timeStamp)
            this.timeStamp.Month=Number(this.timeStamp.Month)+i;
            this.timeStamp.Month>12?(this.timeStamp.Month=this.timeStamp.Month-12,this.timeStamp.Year=Number(this.timeStamp.Year)+1):null
            this.timeStamp.Month<1?(this.timeStamp.Month=this.timeStamp.Month+12,this.timeStamp.Year=Number(this.timeStamp.Year)-1):null
            this.getWeekData();
        },
        showMore(item){
            clearTimeout(this.st)
            if(item){
                this.st=setTimeout(()=>{
                    this.more=item.dateStr
                },500)
            }else{
                this.more=null
            }
        },
    },
    created(){
        this.getWeekData()
    },
    mounted(){},
}
</script>

<style scoped>
.yearBox{
    width: 100%;
    height: 100%;
    padding-top: 52px;
    box-sizing: border-box;
    position: relative;
}
.yearBox>.title{
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
.yearBox>.title>*{
    color: #ffffff;
    font-size:16px;
}
.yearBox>.title>a{
    display: block;
    position: absolute;
    left: 8px;
    top: 8px;
    line-height: 30px;
    opacity: 1;
}
.yearBox>.title>a.right{
    left: auto;
    right: 8px;
}
.yearBox>.title>a:hover{
    opacity: 0.8;
}
.yearBox>ul{
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 0;
    overflow: hidden;
    padding: 78px 0 0px;
}
.yearBox>ul>li{
    display: inline-block;
    width: 14.2857%;
    height: 16.6666%;
    /* width: calc(100% / 7); */
    /* height: calc(100% / 6); */
    position: relative;
    border-right: 1px solid #cfcfcf;
    border-bottom: 1px solid #cfcfcf;
    box-sizing: border-box;
    /* background-color: #fff; */
    vertical-align: top;
    position: relative;
}
.yearBox>ul>li.weekTitle{
    margin-top: -78px;
    height: 78px;
}
.yearBox>ul>li:nth-child(7n){
    border-right: 0;
}
.yearBox>ul>li:nth-last-child(7),
.yearBox>ul>li:nth-last-child(6),
.yearBox>ul>li:nth-last-child(5),
.yearBox>ul>li:nth-last-child(4),
.yearBox>ul>li:nth-last-child(3),
.yearBox>ul>li:nth-last-child(2),
.yearBox>ul>li:nth-last-child(1){
    border-bottom: 0;
}
.yearBox>ul>li>div.topBox{
    position: absolute;
    top: 0;
    left: 0px;
    right: -1px;
    height: 75px;
    line-height: 74px;
    text-align: center;
    border-bottom: 3px solid;
}
.yearBox>ul>li>div.topBox>span.yearText{
    font-size: 14px;
    color: #444444;
}
.yearBox>ul>li:nth-last-child(1)>div>span.yearText,
.yearBox>ul>li:nth-last-child(2)>div>span.yearText{
    color: #ff3a3a;
}
.yearBox>ul>li:nth-child(1)>div{
    border-color: #68bba2;
}
.yearBox>ul>li:nth-child(2)>div{
    border-color: #f3a465;
}
.yearBox>ul>li:nth-child(3)>div{
    border-color: #f3e465;
}
.yearBox>ul>li:nth-child(4)>div{
    border-color: #f3657c;
}
.yearBox>ul>li:nth-child(5)>div{
    border-color: #69bfee;
}
.yearBox>ul>li:nth-child(6)>div{
    border-color: #b278e8;
}
.yearBox>ul>li:nth-child(7)>div{
    border-color: #78a5e8;
}
.yearBox>ul>li>div.topBox>span.dateText{
    position: absolute;
    display: block;
    right: 10px;
    font-size: 16px;
    bottom: 5px;
    line-height: 1;
}
.yearBox>ul>li>.yearScrollbar{
    height: 100%;
}
.yearBox>ul>li ul{
    padding: 6px 8px;
    box-sizing: border-box;
}
.yearBox>ul>li div.time{
    display: block;
    position: absolute;
    font-size: 16px;
    left: 10px;
    top: 10px;
}
.yearBox>ul>li div.time>i.icon{
    position: absolute;
    display: inline-block;
    vertical-align: top;
    margin: -2px 0 0 1px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #F4272E;
}
.yearBox>ul>li div.time>i.today{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    display: inline-block;
    background-color: #fb9f0c;
    color: #fff;
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 7px;
    line-height: 1;
    vertical-align: top;
}
.yearBox>ul>li div.time.notThis{
    color: #ADADAD;
}
.yearBox>ul>li i.more{
    display: block;
    position: absolute;
    font-size: 24px;
    top: 50%;
    right: 10px;
    margin-top: -20px;
    color: #666666;
    letter-spacing: -2px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}
.yearBox>ul>li.AbleClick:hover i.more{
    opacity: 0.8;
}
.yearBox>ul>li div.ul{
    padding: 10px 30px 10px 40px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.yearBox>ul>li>div:not(.moreBox) ul>li,
.yearBox>ul>li div.li{
    width: 100%;
    height: 80px;
    border-radius: 10px;
    background-color: #f7f9fd;
    margin-top: 12px;
    padding: 10px 6px;
    box-sizing: border-box;
}
.yearBox>ul>li div.li{
    min-height: 100%;
}
.yearBox>ul>li ul>li:not(.empty),
.yearBox>ul>li div.li{
    font-size: 14px;
    color: #444444;
    line-height: 18px;
}
@media screen and (max-width: 1500px){
    .yearBox>ul>li>div:not(.moreBox) ul>li:not(.empty),
    .yearBox>ul>li div.li{
        font-size: 12px;
    }
}
.yearBox>ul>li ul>li:nth-child(1),
.yearBox>ul>li div.li{
    margin-top: 0;
}
.yearBox>ul>li ul>li:not(.empty)>span,
.yearBox>ul>li div.li>span{
    display: block;
}
.yearBox>ul>li ul>li:not(.empty)>span::before,
.yearBox>ul>li div.li>span::before{
    display: inline-block;
    content: '';
    vertical-align: top;
    height: 18px;
    width: 20px;
    margin-right: 4px;
    background: url('../../../assets/images/loginIcon.png') -1px -25px no-repeat;
}
.yearBox>ul>li div.li>div{
    padding-left: 10px;
    margin-top: 6px;
    white-space: normal;
    height: 36px;
    overflow: hidden;
}
.yearBox>ul>li div.li>span>div.popover{
    width: calc(100% - 24px);
    vertical-align: top;
    display: inline-block;
}
.yearBox>ul>li div.li>div>div.popover{
    vertical-align: top;
    display: inline-block;
}
.yearBox>ul>li ul>li:not(.empty)>div::before,
.yearBox>ul>li div.li>div::before{
    content: '';
    display: inline-block;
    vertical-align: top;
    margin: 6px 4px 0 -10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #636365;
}
@media screen and (max-width: 1500px){
    .yearBox>ul>li>div:not(.moreBox) ul>li:not(.empty)>div::before,
    .yearBox>ul>li div.li>div::before{
        margin: 7px 6px 0 -10px;
        width: 4px;
        height: 4px;
    }
}
.yearBox>ul>li ul>li.empty{
    padding-top: 12px;
    box-sizing: border-box;
}
.yearBox>ul>li ul>li.empty>i{
    width: 56px;
    height: 37px;
    display: block;
    margin: 0 auto 6px;
    background: url('../../../assets/images/planEmpty.png') 100% 100% no-repeat;
}
.yearBox>ul>li ul>li.empty>span{
    display: block;
    text-align: center;
    line-height: 1;
    font-size: 12px;
    color: #cccccc;
}
.yearBox>ul>li .moreBox{
    position: absolute;
    width: 150%;
    z-index: 111;
    background-color: #EBF1FD;
    padding: 10px 0px;
    box-sizing: border-box;
    height: 200%;
    border-radius: 10px;
    box-shadow :0px 2px 4px 0px rgba(74, 90, 104, 0.5);
    margin-top: 10px;
    cursor: auto;
}
.yearBox>ul>li .moreBox.showLeft{
    left: 95%;
}
.yearBox>ul>li .moreBox.showRight{
    right: 95%;
}
.yearBox>ul>li .moreBox.showTop{
    top: 0px;
}
.yearBox>ul>li .moreBox.showTop1{
    top: 0px;
    margin-top: -10px;
}
.yearBox>ul>li .moreBox.showTop2{
    top: -100%;
    margin-top: -10px;
    height: calc(200% - 2px)
}
.yearBox>ul>li .moreBox::before,
.yearBox>ul>li .moreBox::after{
    display: block;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    z-index: 11;
}
.yearBox>ul>li .moreBox::before{
    z-index: 11;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
}
.yearBox>ul>li .moreBox::after{
    z-index: -1;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
}
.yearBox>ul>li .moreBox.showLeft::before{
    border-right: 14px solid #EBF1FD;
    right: 100%;
    top: 0;
    margin-top: 20px;
}
.yearBox>ul>li .moreBox.showRight::before{
    border-left: 14px solid #EBF1FD;
    left: 100%;
    top: 0;
    margin-top: 20px;
}
.yearBox>ul>li .moreBox.showLeft::after{
    border-right: 14px solid rgba(74, 90, 104, 0.22);
    right: 100%;
    top: 0;
    margin-top: 19px;
}
.yearBox>ul>li .moreBox.showRight::after{
    border-left: 14px solid rgba(74, 90, 104, 0.22);
    left: 100%;
    top: 0;
    margin-top: 19px;
}
.yearBox>ul>li .moreBox.showLeft:not(.showTop)::before,
.yearBox>ul>li .moreBox.showRight:not(.showTop)::before{
    margin-top: 40px;
}
.yearBox>ul>li .moreBox.showLeft:not(.showTop)::after,
.yearBox>ul>li .moreBox.showRight:not(.showTop)::after{
    margin-top: 39px;
}
.yearBox>ul>li .moreBox.showTop1.showLeft::before,
.yearBox>ul>li .moreBox.showTop1.showRight::before,
.yearBox>ul>li .moreBox.showTop1.showLeft::after,
.yearBox>ul>li .moreBox.showTop1.showRight::after{
    top: 0;
}
.yearBox>ul>li .moreBox.showTop2.showLeft::before,
.yearBox>ul>li .moreBox.showTop2.showRight::before,
.yearBox>ul>li .moreBox.showTop2.showLeft::after,
.yearBox>ul>li .moreBox.showTop2.showRight::after{
    top: 50%;
}
.yearBox>ul>li .moreBox ul{
    padding: 0
}
.yearBox>ul>li .moreBox ul>li{
    width: 100%;
    padding: 10px 6px;
    box-sizing: border-box;
}
.yearBox>ul>li .moreBox ul>li:not(.empty)>div{
    padding-left: 10px;
    margin-top: 6px;
    white-space: normal;
    height: auto;
}
.fadeYear-leave-active {
    -webkit-transition: opacity .1s ease;
    -moz-transition: opacity .1s ease;
    -o-transition: opacity .1s ease;
    transition: opacity .1s ease;
}
.fadeYear-enter-active {
    -webkit-transition: opacity .2s ease;
    -moz-transition: opacity .2s ease;
    -o-transition: opacity .2s ease;
    transition: opacity .2s ease;
}
.fadeYear-enter, .fadeYear-leave-to{
    opacity: 0;
}
</style>
<style>
.yearBox>ul>li .yearScrollbar>div.el-scrollbar__wrap{
    overflow-x: hidden;
}
.yearBox>ul>li .moreBox>.yearScrollbar{
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: #EBF1FD;
}
.yearBox>ul>li .moreBox>.yearScrollbar .el-scrollbar__view{
    padding: 0 20px;
}
</style>