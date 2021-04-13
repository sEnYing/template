<template>
    <div class="boxTable">
        <div class="ClearFloat"><unit-btn v-if="name!=='workreportView'" type='right' text='添加' @click="tableOper('add',null)"></unit-btn><unit-btn v-if="name!=='workreportView'" type='right auto' text='载入工作计划' @click="tableOper('in',null)"></unit-btn></div>
        <unit-table :list='data.planList?data.planList:[]' :title='title' :operation="name==='workreportView'?[]:[{key:'view',show:judgeShow},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]" @click='tableOper'></unit-table>
    </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
    name: 'report',
    props:['data','dom'],
    components:{unitTable},
    data () {
        return{
            name:this.$route.name,
            title:[{key:'dateTime_',name:'拜访时间',width:20},{key:'customerName',name:'客户名称',width:16},{key:'projName',name:'项目名称',width:16},{key:'contactName',name:'拜访对象',width:12},{key:'visitTypeTxt',name:'拜访方式',width:12},{key:'position',name:'职务',width:12},{key:'cityName',name:'地区（城市）',width:12}],
            planIndex:0
        }
    },
    computed: {
        reload(){
            return this.$store.state.reload;
        },
    },
    watch:{
        data:{
            deep:true,
            handler(){
                if(!this.data.reportId){
                    return;
                }
                this.$emit('ok');
                this.getList(1);
            },
        },
        reload(v){
            // console.log(v)
            if(v&&v.type==='plan'){
                this.edit();
                this.$store.commit('reloadFn',false);
                let data=v.res;
                switch(v.key){
                    case 'planAdd':
                        this.$set(data,'dateTime_',this.$pubfunc.TimeTransform('YYYY年MM月DD日',data.date)+' '+this.$pubfunc.transTime(data.time))
                        data.creator=this.data.userInfo.staffId;
                        data.planId='plan_'+this.planIndex;
                        this.planIndex++
                        this.data.planList.push(data)
                        break;
                    case 'planEdit':
                        for(let i in this.data.planList){
                            if(this.data.planList[i].planId===data.planId){
                                // console.log(this.data.planList[i],data.planId)
                                for(let k in data){
                                    this.data.planList[i][k]=data[k]
                                }
                                this.$set(this.data.planList[i],'dateTime_',this.$pubfunc.TimeTransform('YYYY年MM月DD日',this.data.planList[i].date)+' '+this.$pubfunc.transTime(this.data.planList[i].time))
                                break;
                            }
                        }
                        break;
                }
            }
        },
    },
    methods:{
        edit(){
            this.$emit('edit')
        },
        judgeShow(item,i,key){
            return item.creator===this.data.userInfo.staffId?true:false
            // return true
        },
        getList(n){
            this.page=n;
        },
        tableOper(key,item){
            // console.log(key,item)
            switch(key){
                case 'in':
                    this.$parent.$parent.$parent.insetPlanList(this.data.planList);
                    this.edit();
                    break;
                case 'add':
                    this.$emit('dialog',{show:true,link:'visitPlan',small:true,title:'添加工作计划',data:{key:'planAdd',arr:this.data.planList,endDate:this.data.endDate}});
                    break;
                case 'view':
                    this.$emit('dialog',{show:true,link:'visitPlan',small:true,title:'查看工作计划',data:{item,key:'planView'}});
                    break;
                case 'revise':
                    this.$emit('dialog',{show:true,link:'visitPlan',small:true,title:'编辑工作计划',data:{item,key:'planEdit',arr:this.data.planList,endDate:this.data.endDate}});
                    break;
                case 'delete':
                    this.$store.commit('confirmFn',{
                        func:()=>{
                            for(let i in this.data.planList){
                                if(this.data.planList[i].planId===item.planId){
                                    let json;
                                    if(this.data.planList[i].planId.indexOf('plan_')){
                                        this.data.planList[i].isDeleted='1';
                                        json=JSON.stringify(this.data.planList[i])
                                    }
                                    this.data.planList.splice(i,1);
                                    if(json){
                                        for(let j in this.data.delPlan){
                                            // console.log(this.data.delPlan[j].planId,JSON.parse(json).planId)
                                            if(this.data.delPlan[j].planId===JSON.parse(json).planId){
                                                return;
                                            }
                                        }
                                        this.data.delPlan.push(JSON.parse(json))
                                    }
                                    break;
                                }
                            }
                            this.edit();
                        },
                        text:'确认删除该工作计划吗？'
                    });
                    break;
            }
        },
    },
    mounted(){
        if(!this.data.reportId){
            return;
        }
        this.getList(1);
        this.$emit('ok');
    },
}
</script>

<style scoped>
.fillBox .boxTable{
    position: absolute;
    top: 50px;
    width: calc(100% - 28px);
    height: calc(100% - 60px);
}
.fillBox .boxTable:only-child{
    height: calc(100% - 40px);
}
.fillBox .boxTable>.ClearFloat{
    margin-top: -40px;
    margin-bottom: 8px;
    min-height: 2px;
}
.fillBox .boxTable>.ClearFloat>button{
    margin-left: 20px;
}
</style>
