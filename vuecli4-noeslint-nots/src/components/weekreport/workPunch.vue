<template>
   <div>
        <i class="padding"></i>
        <div class="boxRound">
            <div class="title">外勤打卡明细</div>
            <unit-table class="reportTable" id='punchDetail' :wrap='1' :indexrow='0' :list='data.attendanceList?data.attendanceList:[]' :title='title' ></unit-table>
        </div>
   </div>
</template>
<script>
import unitTable from '@/unit/components/element/table'
export default {
    name: 'workPunch',
    props:['data'],
    components:{unitTable},
    data () {
        return {
             list:[],
             name:this.$route.name,
             title:[{key:'datetimeStr',name:'时间',width:15},{key:'address',name:'地点',width:15},{key:'title',name:'外勤名称',width:25},{key:'content',name:'外勤内容',width:30}],
        }
    },
    mounted(){
        if(!this.data.reportId){
            return;
        }
        this.$emit('ok');
    },
}
</script>
<style scoped>
.padding{
    padding-top: 20px;
    display: block;
}
.boxRound{
    padding: 24px 22px 50px; 
}
.boxRound>.title{
    font-size: 14px;
    color: #444444;
    line-height: 17px;
    padding-left: 8px;
    border-left: 3px solid #1560F6;
}
.reportTable,.echarts{
    margin-top: 20px;
}
</style>