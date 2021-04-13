<template>
    <div class="fillBox">
        <div class="boxRel">
            <div class="title">修改项：{{(total>0?list[0].alterFieldName:'')|emptyTxt}}</div>
            <div class="boxTable">
                <unit-table :total='total' :page='page' v-if="list.length>0" :limit='limit' :list='list.slice((page-1)*limit,page*limit)' :title='keys.indexOf(data.key)>-1?title1:title' ref='table'></unit-table>
                <unit-page :total='total' :page='page' @pagechange="(p)=>{page=p}" :limit='limit'></unit-page>
            </div>
        </div>
    </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
    name: 'updateDetail',
    props:['data'],
    components:{unitTable},
    data () {
        return{
            keys:['projAmount','policymarker','planFinishTime','buyType','customerMoneySource','mainBrand','winRate','projStatus','commitConfirm'],
            title:[{key:'updateTime_',name:'修改时间',width:25},{key:'updateUsername',name:'修改人',width:15},{key:'oldValue',name:'修改前',width:30},{key:'newValue',name:'修改后',width:30}],
            title1:[{key:'updateTime_',name:'修改时间',width:25},{key:'updateUsername',name:'修改人',width:15},{key:'oldValue',name:'修改前',width:20},{key:'newValue',name:'修改后',width:20},{key:'modifyReason',name:'修改原因',width:20}],
            list:[],
            total:0,
            page:1,
            limit:6,
            commitStatus:{
                '0':'否',
                '1':'是',
            },
            commitConfirm:{
                '0':'不同意',
                '1':'同意',
            },
        }
    },
    filters:{
        emptyTxt(v){
            return v?v:'--'
        }
    },
    methods:{
    },
    created(){
    },
    mounted(){
        let list=[];
        (this.data.list?this.data.list:[]).map(v=>{
            let json=JSON.parse(JSON.stringify(v));
            let time=json.updateTime?json.updateTime.split(' '):null;
            json.updateTime_=time&&time.length>0?(this.$pubfunc.TimeTransform('YYYY年MM月DD日',time[0])+(time.length>1?(' '+this.$pubfunc.transTime(time[1].split(':').slice(0,2).join(':'))):'')):'';
            this.data.key==='commitStatus'?(json.oldValue=this.commitStatus[json.oldValue],json.newValue=this.commitStatus[json.newValue]):null
            this.data.key==='commitConfirm'?(json.oldValue=this.commitConfirm[json.oldValue],json.newValue=this.commitConfirm[json.newValue]):null
            list.push(json)
        })
        this.list=list;
        this.total=this.data.list.length;
        // console.log(this.data)
        this.$emit('ok');
    },
}
</script>

<style scoped>
.fillBox{
    padding: 0 20px;
    height: 460px;
    max-height: 100%;
}
.title{
    line-height: 48px;
}
.fillBox .boxTable{
    height: calc(100% - 48px);
    max-height: calc(100% - 48px);
}
</style>
