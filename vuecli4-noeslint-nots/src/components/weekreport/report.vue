<template>
    <div>
        <i class="padding"></i>
        <div class="boxRound">
            <div class="title">本周拜访总结</div>
            <div class="echarts" v-if="data.customerList&&data.customerList.length>0" :style="{height:(data.customerList&&data.customerList.length>0?(data.customerList.length*40+20):0)+'px'}"><unit-line :dom='dom' :data='data.customerList?data.customerList:[]'></unit-line></div>
            <div class="ClearFloat" v-if="name!=='workreportView'"><unit-btn v-if="data.delVisit&&data.delVisit.length>0" type='right' text='恢复删除' @click="tableOper('recover',null)"></unit-btn></div>
            <unit-table class="reportTable" id='visit' :wrap='6' :indexrow='0' :list='data.visitList?data.visitList:[]' :title='title' :operation="$route.name==='workreportView'?[]:[{key:'view',show:judgeShow},{key:'edit',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]" @click='tableOper'></unit-table>
        </div>
        <i class="padding"></i>
        <div class="boxRound">
            <div class="title">重点项目情况说明<unit-btn type='right' text='添加' @click="tableOper('add',null)" v-if="name!=='workreportView'"></unit-btn></div>
            <unit-table class="reportTable" id='project' :wrap='2' :indexrow='0' :list='data.projList?data.projList:[]' :title='title1' :operation="$route.name==='workreportView'?[]:[{key:'view',show:judgeShow},{key:'edit',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]" @click='tableOper'></unit-table>
        </div>
        <i class="padding"></i>
        <div class="boxRound">
            <div class="title">其他工作情况说明</div>
            <textarea v-if="name!=='workreportView'" class="input" placeholder="500个字以内" v-model="data.description" type="text" maxlength="500"></textarea>
            <div v-if="name==='workreportView'" class="viewDiv">{{data.description}}</div>
        </div>
        <i class="padding"></i>
    </div>
</template>
re
<script>
import unitTable from '@/unit/components/element/table'
import unitLine from '@/unit/components/echarts/workreport'
export default {
    name: 'plan',
    props:['data','dom'],
    components:{unitTable,unitLine},
    data () {
        return{
            name:this.$route.name,
            title:[{key:'customerName',name:'客户名称',width:14},{key:'projName',name:'项目名称',width:14},{key:'visitDatetime',name:'拜访时间',mustwidth:130},{key:'description',name:'拜访情况说明',width:24},{key:'projChanceDesc',name:'项目机会说明',width:24},{key:'tecSupportDesc',name:'技术支持说明',width:24}],
            title1:[{key:'projName',name:'项目名称',width:14},{key:'customerName',name:'客户名称',width:14},{key:'conditionDesc',name:'情况说明',width:60}],
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
            },
        },
        reload(v){
            // console.log(v)
            if(v&&(v.type==='visit'||v.type==='project')){
                this.edit();
                let data=v.res;
                switch(v.type){
                    case 'visit':
                        switch(v.key){
                            case 'add':
                                this.data.visitList.push(data)
                                break;
                            case 'edit':
                                for(let i in this.data.visitList){
                                    // console.log(this.data.planList[i].planId,data.planId)
                                    if(this.data.visitList[i].recordId===data.recordId){
                                        for(let k in data){
                                            this.data.visitList[i][k]=data[k]
                                        }
                                        break;
                                    }
                                }
                                break;
                        }
                        break;
                    case 'project':
                        switch(v.key){
                            case 'add':
                                this.data.projList.push(data)
                                break;
                            case 'edit':
                                for(let i in this.data.projList){
                                    // console.log(this.data.planList[i].planId,data.planId)
                                    if(this.data.projList[i].projId===data.projId){
                                        for(let k in data){
                                            this.data.projList[i][k]=data[k]
                                        }
                                        break;
                                    }
                                }
                                break;
                        }
                        break;
                }
                this.$store.commit('reloadFn',false);
            }
        },
    },
    methods:{
        edit(){
            this.$emit('edit')
        },
        judgeShow(item,i,key){
            return this.data.creator===this.data.userInfo.staffId?true:false
            // return true
        },
        tableOper(key,item,id){
            // console.log(key,item,id)
            switch(key){
                case 'recover':
                    if(!this.data.delVisit||this.data.delVisit.length===0){
                        return
                    }
                    this.data.delVisit.map(v=>{
                        delete v.isDeleted
                    })
                    this.data.visitList=this.data.visitList.concat(this.data.delVisit.concat())
                    this.data.delVisit.splice(0,this.data.delVisit.length)
                    // console.log(this.data.delVisit,this.data.visitList)
                    break;
                case 'add':
                    this.$emit('dialog',{show:true,link:'pointProj',small:true,title:'添加重点项目情况说明',data:{key:key,arr:this.data.projList}});
                    break;
                case 'view':
                    switch(id){
                        case 'visit':
                            this.$emit('dialog',{show:true,link:'visitRecord',small:900,title:'查看本周拜访详情',data:{item,key:key}});
                            break;
                        case 'project':
                            this.$emit('dialog',{show:true,link:'pointProj',small:true,title:'查看重点项目详情',data:{item,key:key}});
                            break;
                    }
                    break;
                case 'edit':
                    switch(id){
                        case 'visit':
                            this.$emit('dialog',{show:true,link:'visitRecord',small:900,title:'编辑本周拜访详情',data:{item,key:key}});
                            break;
                        case 'project':
                            this.$emit('dialog',{show:true,link:'pointProj',small:true,title:'编辑重点项目详情',data:{item,key:key}});
                            break;
                    }
                    break;
                case 'delete':
                    switch(id){
                        case 'visit':
                            this.$store.commit('confirmFn',{
                                func:()=>{
                                    this.edit();
                                    for(let i in this.data.visitList){
                                        if(this.data.visitList[i].recordId===item.recordId){
                                            this.data.visitList[i].isDeleted='1';
                                            let json=JSON.stringify(this.data.visitList[i])
                                            this.data.visitList.splice(i,1);
                                            this.data.delVisit.push(JSON.parse(json))
                                            break;
                                        }
                                    }
                                },
                                text:'确认删除该拜访信息吗？'
                            });
                            break;
                        case 'project':
                            this.$store.commit('confirmFn',{
                                func:()=>{
                                    this.edit();
                                    for(let i in this.data.projList){
                                        if(this.data.projList[i].projId===item.projId){
                                            this.data.projList[i].isDeleted='1';
                                            let json=JSON.stringify(this.data.projList[i])
                                            this.data.projList.splice(i,1);
                                            this.data.delProj.push(JSON.parse(json))
                                            break;
                                        }
                                    }
                                },
                                text:'确认删除该重点项目吗？'
                            });
                            break;
                    }
                    break
            }
        },
    },
    created(){
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
.boxRound>.title>button{
    margin-top: -6px;
}
.reportTable,.echarts{
    margin-top: 20px;
}
.echarts{
    width: 100%;
}
</style>
<style lang="">
.boxRel1 .el-scrollbar__bar{
    opacity: 1;
}
.boxRound>textarea{
    width: 80%;
    height: 108px;
    margin-top: 20px;
    margin-left: 50px;
}
.boxRound>.viewDiv{
    width: 80%;
    min-height: 108px;
    display: block;
    font-size: 14px;
    line-height: 18px;
    margin-top: 20px;
    margin-left: 50px;
    white-space: pre-line;
}
</style>