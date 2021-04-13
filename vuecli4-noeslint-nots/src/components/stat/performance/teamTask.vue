<template>
    <div class="taskContainer">
        <div class="leftLiquid">
            <unit-liquid :type="'team'" :data='data' :dom='dom'></unit-liquid>
        </div>
        <div class="column"></div>
        <div class="rightStat">
            <div class="exportBtn">
                <unit-dropdown id="year" class="elTimebox1 auto" placeholder='全部' :result='year' :list="years" @change='dropdownReturn'></unit-dropdown>
                <unit-btn type='large' :loading='ajaxIng' text='导出报表' @click="exportStat()"></unit-btn>
            </div>
            <div class="echartBox">
                <unit-line :list='list?list:[]' :dom='dom' type='team'></unit-line>
            </div>
            <div class="boxTable">
                <unit-loading :loading='loading' v-if="loading" style="marginTop:1px;"></unit-loading>
                <unit-table :total='total' :page='1' v-if="!loading||list.length>0" :list='list' :title='title' ref='table'></unit-table>
            </div>
        </div>
    </div>
</template>

<script>
import unitLiquid from '@/unit/components/echarts/liquid'
import unitLine from '@/unit/components/echarts/sign'
import unitTable from '@/unit/components/element/tableScroll'
export default {
    name: 'sales_teamTask',
    props:['dom'],
    components: {unitLiquid, unitLine, unitTable},
    data () {
        return{
            loading:false,
            ajaxIng:false,
            title:[
                {key:'teamName',name:'团队名称',width:12},
                {key:'targetAmount_',name:'年签约任务额（万元）',width:14,title:this.showTitle},
                {key:'amount_',name:'累计签约额（万元）',width:14,title:this.showTitle},
                {key:'percent_',name:'签约任务完成比例',width:12,title:this.showTitle},
                {key:'q1Amount_',name:'Q1-签约额（万元）',width:12,title:this.showTitle},
                {key:'q2Amount_',name:'Q2-签约额（万元）',width:12,title:this.showTitle},
                {key:'q3Amount_',name:'Q3-签约额（万元）',width:12,title:this.showTitle},
                {key:'q4Amount_',name:'Q4-签约额（万元）',width:12,title:this.showTitle},
            ],
            list:[],
            data:{},
            total:0,
            year:new Date().getFullYear()
        }
    },
    computed:{
        years(){
            let arr=[];
            for(let i = Number(new Date().getFullYear());i>=2018;i--){
                arr.push({value:i,label:i})
            }
            return arr;
        },
    },
    methods:{
        dropdownReturn(item,key,thisItem){
            switch(key){
                case 'year':this.year=item.value;this.getList();break;
            }
        },
        showTitle(key,item){
            // console.log(key,item)
            return Number(Math.round(item[key.replace('_','')])/10000)
        },
        getList() {
            this.loading=true;
            let param={
                year: this.year,
                limit: 0,
                page: 1
            }
            this.$api.service.stat.teamsignamountlist(param,res=>{
                this.loading=false;
                switch(res.code){
                    case '0':
                        this.total=res.data.total;
                        let list=res.data.list?res.data.list:[];
                        let teamPercent = (res.data.teamTotalPercent===null?100:res.data.teamTotalPercent);
                        let teamPercent_ = Number(teamPercent/100);
                        let teamAmount = res.data.teamTotalAmount===null?null:this.$pubfunc.transformPrice(res.data.teamTotalAmount,1);
                        list.map(v=>{
                            v.entryDate_=this.$pubfunc.TimeTransform('YYYY年MM月DD日',v.entryDate);
                            v.percent_=v.percent===null?'':(Number(v.percent)+'%');
                            v.amount_=(this.$pubfunc.getSmallPrice(v.amount)).toString();
                            v.targetAmount_=(this.$pubfunc.getSmallPrice(v.targetAmount)).toString();
                            v.q1Amount_=(this.$pubfunc.getSmallPrice(v.q1Amount)).toString();
                            v.q2Amount_=(this.$pubfunc.getSmallPrice(v.q2Amount)).toString();
                            v.q3Amount_=(this.$pubfunc.getSmallPrice(v.q3Amount)).toString();
                            v.q4Amount_=(this.$pubfunc.getSmallPrice(v.q4Amount)).toString();
                        })
                        this.list=list;
                        this.data={teamPercent,teamPercent_,teamAmount}
                        break;
                }
            })
        },
        exportStat() {
            if(this.ajaxIng){
                this.$store.commit('alertFn',{
                    type:'warning',
                    text:'正在导出报表，请稍后',
                })
                return
            }
            this.ajaxIng=true;
            let param={ year: this.year }
            this.$api.download.teamsignamountexport(param,res=>{
                this.$pubfunc.downloadFile(res,'销售团队业绩签约额报表-'+param.year+'.xlsx');
                this.ajaxIng=false;
                this.$store.commit('alertFn',{
                    type:'success',
                    text:'导出成功',
                    func:()=>{
                        this.$emit('success');
                    }
                })
            });
        }
    },
    created(){
        this.getList();
    },
    mounted(){
        
    },
}
</script>

<style scoped>
.taskContainer {
    width: 100%;
    height: calc(100% - 36px);
    font-size: 0;
}
.leftLiquid {
    width: 20%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    padding-top: 20px;
    box-sizing: border-box;
}
.column {
    display: inline-block;
    width: 13px;
    height: 100%;
    padding-bottom: 20px;
    box-sizing: content-box;
    background-color: #F0F3FA;
    vertical-align: top;
    margin: 0 20px;
}
.rightStat {
    display: inline-block;
    height: 100%;
    width: calc(80% - 53px);
    vertical-align: top;
    position: relative;
}
.rightStat .el-scrollbar.unitScrollbar{
    width: 100%;
    height: calc(100% - 16px);
}
.boxTable{
    width: 100%;
    height: 40%;
}
.boxTable .boxRel{
    min-height: 100px;
}
.echartBox{
    height: calc(60% - 50px);
    width: 100%;
    min-width: 600px;
}
.exportBtn {
    padding-top: 10px;
    text-align: right;
}
.elTimebox1{
    width: 120px;
    margin-right: 20px;
}
</style>
<style>
.taskContainer .boxRel .unitScrollbar>.el-scrollbar__wrap .el-table th>.cell{
    white-space: pre-wrap;
    line-height: 16px;
    max-height: 32px;
    margin: -4px 0 -5px;
    -webkit-line-clamp: 2;
}
.taskContainer .elTimebox1 .el-input__icon{
    line-height: 32px;
}
</style>