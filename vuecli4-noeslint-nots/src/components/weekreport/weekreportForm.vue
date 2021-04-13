<template>
    <div class="fillBox weekreportForm">
        <div class="boxTitle titleFix">
            <i class="workreport_icon"></i><span>{{title[name]}}</span>
            <unit-btn type='plain right' :text='name!=="workreportView"?"取消":"返回"' @click="cancel" v-if="name!=='workreportAdd'&&name!=='workreportAddNext'"></unit-btn>
            <unit-btn type='right' :loading='ajaxIng' text='提交' @click="submit" v-if="!(userInfo.isCharge&&userInfo.staffId!==data.creator)&&data.status==='0'"></unit-btn>
            <unit-btn type='right' :loading='ajaxIng' :text='name==="workreportAdd"&&!data.status?"下一步":"保存"' @click="save" v-if="name!=='workreportView'"></unit-btn>
        </div>
        <div class="contentFix workreportForm">
            <ul class="stepBox" v-if="!(userInfo.isCharge&&userInfo.staffId!==data.creator)"><li class="active"><i>完善周报信息</i></li><li :class="{'active':data.status}"><i>填写下周工作计划</i></li><li :class="{'active':data.status==='1'}"><i>提交完成</i></li></ul>
            <div class="topBox boxRound">
                <div>{{data.creatorName}}的工作报告</div>
                <span>{{data.depName}}</span>
                <span>{{data.time_}}</span>
            </div>
            <unit-tab class="contactListTab" :tab='tab' @click="returnBtn"></unit-tab>
            <div class="boxRel" :class="{'boxRel_':userInfo.isCharge&&userInfo.staffId!==data.creator}">
                <el-scrollbar class="unitScrollbar">
                    <div class="boxRel1 boxRel" :class="{'tablePage':tab.choose==='plan'}">
                        <div class="loadingCont" v-if="loading"><unit-loading :loading='loading'></unit-loading></div>
                        <el-scrollbar class="unitScrollbar">
                            <div class="formMainCont">
                                <component :is="tab.choose" @ok="loadingChange(false)" :data='data?data:{userInfo}' :dom='dom' v-if="data" @edit='childchange(true)' @dialog='showDialog' ref="children"></component>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import unitTab from '@/unit/components/tab'
export default {
    name: 'workreportForm',
    props:['dom'],
    components:{
        unitTab,
        report:resolve => require(['./report'],resolve),  //工作报告
        plan:resolve => require(['./plan'],resolve),  //下周工作计划
        work:resolve => require(['./workPunch'],resolve), //外请打卡明细
    },
    data () {
        return{
            name:null,
            reportId:null,
            edit:false,
            tab:{
                list:[{id:'report',name:'工作报告'},{id:'plan',name:'下周工作计划'},{id:'work',name:'外勤打卡记录'}],
                choose:''
            },
            error:{
                contact:null,
                key:null,
                msg:'',
            },
            baseData:null,
            data:{},
            ajaxIng:false,
            loading:false,
            reset:false,
            title:{
                workreportAdd:'保存工作报告',
                workreportAddNext:'保存工作报告',
                workreportEdit:'编辑工作报告',
                workreportView:'查看工作报告详情',
            },
            iknow:false,
        }
    },
    filters:{
        emptyTxt(v){
            return v?v:'--'
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
        showDialog(data){
            // console.log(data)
            this.$emit('dialog',data)
        },
        emptyTxt(v){
            return v?v:'--'
        },
        getDropData(){
            let url,param={};
            this.tab.choose=this.tab.list[0].id;
            switch(this.name){
                case 'workreportAddNext':
                    this.tab.choose=this.tab.list[1].id;
                case 'workreportEdit':
                case 'workreportView':
                    let reportId;
                    try {
                        !this.reportId?reportId=this.$pubfunc.decode(this.$route.params.reportId):reportId=this.reportId;
                    } catch (error) {
                        this.cancel();
                        return
                    }
                    this.reportId=reportId;
                    param.reportId=reportId
                    url='detail';
                    break;
                default:
                    let time;
                    try {
                        time=this.$pubfunc.decode(this.$route.params.time);
                    } catch (error) {
                        this.cancel();
                        return
                    }
                    param.date=time
                    url='generate';
            }
            this.ajaxIng=true
            this.$api.service.weekreport[url](param,res=>{
                console.log(res)
                this.ajaxIng=false
                switch(res.code){
                    case '0':
                        if(!res.data){
                            this.cancel();
                            return
                        }
                        this.baseData=JSON.stringify(res.data);
                        let data=JSON.parse(JSON.stringify(res.data));
                        data.time_=this.$pubfunc.TimeTransform('YYYY年MM月DD日',data.startDate)+' - '+this.$pubfunc.TimeTransform('MM月DD日',data.endDate);
                        data.userInfo=this.userInfo;
                        data.delVisit=[];
                        data.delProj=[];
                        data.delPlan=[];
                        data.planList.map(v=>{
                            this.$set(v,'dateTime_',this.$pubfunc.TimeTransform('YYYY年MM月DD日',v.date)+' '+this.$pubfunc.transTime(v.time))
                        })
                        this.name==='workreportAdd'?(data.status=null,this.tab.list.splice(1,1)):null;
                        this.data=data;
                        break;
                    default:
                        this.cancel();
                }
            })
        },
        loadingChange(j){
            this.loading=j
        },
        returnBtn(type,k){
            switch(type){
                case 'tab':
                    if(this.name==='workreportEdit'&&this.edit){
                        this.$store.commit('confirmFn',{
                            func:()=>{
                                this.save(k)
                            },
                            cancel:()=>{
                                this.returnBtn('changeTab',k)
                            },
                            text:'是否保存您本页更改的信息？<br/>您也可以全部编辑结束后一起保存'
                        })
                    }else{
                        this.returnBtn('changeTab',k)
                    }
                    break;
                case 'changeTab':
                    this.childchange(false);
                    this.tab.choose!==k?this.loadingChange(true):null;
                    this.tab.choose=k;
                    break;
            }
        },
        childchange(j){
            this.edit=j;
        },
        insetPlanList(d,next){
            let oneday=24*60*60*1000;
            let param={
                visitDateFrom:this.$pubfunc.TimeTransform('YYYY/MM/DD',this.$pubfunc.timeToTimestamp(this.data.startDate)+7*oneday),
                visitDateTo:this.$pubfunc.TimeTransform('YYYY/MM/DD',this.$pubfunc.timeToTimestamp(this.data.endDate)+7*oneday),
                page:1,
                limit: 0
            }
            this.iknow&&next?next():this.$api.service.visit.planList(param,res=>{
                // console.log(res)
                this.loading=false;
                switch(res.code){
                    case '0':
                        this.total=res.data.total;
                        let list=[];
                        (res.data.list?res.data.list:[]).map(v=>{
                            // console.log(v.creator,this.userInfo.staffId)
                            if(v.creator===this.userInfo.staffId){
                                let json=v,j=true;
                                for(let i in d){
                                    if(d[i].planId===v.planId||(d[i].date===v.date&&d[i].time===v.time)){
                                        j=false;break
                                    }
                                }
                                j?(this.$set(json,'dateTime_',this.$pubfunc.TimeTransform('YYYY年MM月DD日',json.date)+' '+this.$pubfunc.transTime(json.time),list.push(json))):null;
                            }
                        })
                        list.length>0?
                        (next?this.$store.commit('confirmFn',{
                            okTxt:'好的',
                            cancelTxt:null,
                            func:()=>{
                                this.returnBtn('changeTab','plan');
                                this.data.planList=this.data.planList.concat(list);
                                // next();
                            },
                            close:()=>{
                                this.returnBtn('changeTab','plan');
                            },
                            text:'您有新的工作计划需要载入！'
                        }):this.data.planList=this.data.planList.concat(list)):(next?next():this.$store.commit('alertFn',{
                            type:'error',
                            text: '暂无新的工作计划',
                            time: 2000
                        }));
                        this.iknow=true;
                        break;
                }
            })
        },
        save(k,submit){
            if(this.loading||this.ajaxIng){return}
            let param={},baseData=JSON.parse(this.baseData);
            let delPlan=this.data.delPlan?this.data.delPlan.concat():[];
            for(let i in delPlan){
                for(let j in this.data.planList){
                    if(this.data.planList[j].planId===delPlan[i].planId){
                        delPlan.splice(i,1)
                        break
                    }
                }
            }
            param.description=this.data.description;
            if(k&&!submit){
                switch(k){
                    case 'plan':
                        param.visitList=this.data.visitList.concat(this.data.delVisit?this.data.delVisit:[]);
                        param.projList=this.data.projList.concat(this.data.delProj?this.data.delProj:[]);
                        param.planList=baseData.planList;
                        break;
                    case 'report':
                        param.visitList=baseData.visitList;
                        param.projList=baseData.projList;
                        param.planList=this.data.planList.concat(delPlan);
                        break;
                    case 'work':

                        break;
                }
                this.next(param,k,submit);
            }else{
                this.insetPlanList(this.data.planList.concat(delPlan),()=>{
                    param.visitList=this.data.visitList.concat(this.data.delVisit?this.data.delVisit:[]);
                    param.projList=this.data.projList.concat(this.data.delProj?this.data.delProj:[]);
                    param.planList=this.data.planList.concat(delPlan);
                    this.next(param,k,submit);
                });
            }
        },
        next(param,k,submit){
            let times={date:[],time:[]};
            for(let i in param.planList){
                let err=times.date.indexOf(param.planList[i].date);
                if(err>-1&&times.time[err]===param.planList[i].time&&param.planList[i].isDeleted!=='1'){
                    this.$store.commit('alertFn',{
                        type:'error',
                        text: param.planList[i].dateTime_+' 的拜访计划有重复，请修改后保存',
                        time: 5000
                    })
                    return
                }else{
                    times.date.push(param.planList[i].date);
                    times.time.push(param.planList[i].time);
                }
            }
            let formatlist=function(list,keys,special){
                let specialK=special?Object.keys(special):[];
                return list.map(v=>{
                    let json=JSON.parse(JSON.stringify(v))
                    // let json=v
                    for(let k in json){
                        if(keys.indexOf(k)===-1||(special&&specialK.indexOf(k)>-1&&json[k].indexOf(special[k])>-1)){
                            delete json[k];
                        }
                    }
                    return json
                })
            }
            let p={
                reportId:this.data.reportId
            }
            p.description=param.description;
            p.visitList=formatlist(param.visitList,['recordId','projChanceDesc','tecSupportDesc','description','isDeleted'])
            p.projList=formatlist(param.projList,['projId','conditionDesc','isDeleted'])
            p.planList=formatlist(param.planList,['planId','reportId','date','time','workContent','customerId','projId','contactId','position','province','city','visitType','isDeleted'],{planId:'plan_'})
            // console.log(p,this.data)
            this.ajaxIng=true;
            this.$api.service.weekreport.save(p,res=>{
                // console.log(res)
                submit?null:this.ajaxIng=false
                switch(res.code){
                    case '0':
                        submit?this.submit(p.reportId):
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'保存成功',
                            func:()=>{
                                this.reportId?
                                (k?this.$api.service.weekreport.detail({reportId:this.reportId},res=>{
                                    // console.log(res)
                                    this.ajaxIng=false
                                    switch(res.code){
                                        case '0':
                                            if(!res.data){
                                                this.cancel();
                                                return
                                            }
                                            this.baseData=JSON.stringify(res.data);
                                            let data=JSON.parse(JSON.stringify(res.data));
                                            data.time_=this.$pubfunc.TimeTransform('YYYY年MM月DD日',data.startDate)+' - '+this.$pubfunc.TimeTransform('MM月DD日',data.endDate);
                                            data.userInfo=this.userInfo;
                                            data.delVisit=[];
                                            data.delPlan=[];
                                            data.planList.map(v=>{
                                                this.$set(v,'dateTime_',this.$pubfunc.TimeTransform('YYYY年MM月DD日',v.date)+' '+this.$pubfunc.transTime(v.time))
                                            })
                                            this.data=data;
                                            this.returnBtn('changeTab',k,'detail')
                                            break;
                                        default:
                                            this.cancel();
                                    }
                                }):this.cancel()):(
                                this.$router.push({name:'workreportAddNext',params:{reportId:this.$pubfunc.encode(this.data.reportId)}}),
                                this.reportId=this.data.reportId,
                                this.name='workreportAddNext',
                                (this.tab.list.length<=1?this.tab.list.push({id:'plan',name:'下周工作计划'}):null),
                                this.$nextTick(v=>{this.getDropData()}));
                            }
                        });
                        break;
                    default:
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message,
                        }):null
                }
            })
        },
        submit(j){
            if(!j&&(this.loading||this.ajaxIng)){return}
            j?this.$api.service.weekreport.submit({reportId:this.data.reportId},res=>{
                // console.log(res)
                this.ajaxIng=false
                switch(res.code){
                    case '0':
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'提交成功',
                            func:()=>{
                                this.cancel()
                            }
                        });
                        break;
                    default:
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message,
                        }):null
                }
            }):this.$store.commit('confirmFn',{
                func:()=>{
                    this.save(false,'submit')
                },
                text:'确定提交该工作报告吗？<br/>提交后下周拜访计划将会被覆盖'
            });
        },
        cancel(){
            this.$router.push({name:'workreport'});
        }
    },
    created(){
        let workreportPersonal=this.$pubfunc.judgeBtn('workreport:personal'),
            workreportTeam=this.$pubfunc.judgeBtn('workreport:team'),
            name=this.$route.name;
        // console.log(this.$route)
        if((!workreportPersonal&&!workreportTeam)||(!workreportPersonal&&(name==='workreportAdd'||name==='workreportAddNext'||name==='workreportEdit'))){
            this.cancel();
            return;
        }
        this.name=name;
        this.getDropData();
    },
}
</script>

<style scoped>
/* 步骤 */
.stepBox{
    display: block;
    width: 100%;
    height: 68px;
    text-align: center;
    font-size: 0;
    padding-top: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
}
.stepBox>li{
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1px solid #1560F6;
    margin-right: 200px;
    position: relative;
    white-space: nowrap;
}
.stepBox>li::before,
.stepBox>li::after,
.stepBox>li>i{
    display: block;
    position: absolute;
}
.stepBox>li::before{
    top: 1px;
    bottom: 1px;
    left: 1px;
    right: 1px;;
    font-size: 14px;
    line-height: 20px;
    color: #1560F6;
    border-radius: 50%;
    transform: scale(0.8);
}
.stepBox>li:nth-child(1):before{
    content: '1';
}
.stepBox>li:nth-child(2):before{
    content: '2';
}
.stepBox>li:nth-child(3):before{
    content: '3';
}
.stepBox>li::after{
    content: '';
    left: 100%;
    top: 50%;
    margin-top: -1px;
    width: 200px;
    height: 0;
    border: 1px dashed #1560F6;
}
.stepBox>li:nth-last-child(1){
    margin-right: 0;
}
.stepBox>li:nth-last-child(1)::after{
    display: none;
}
.stepBox>li>i{
    color: #787687;
    top: 34px;
    left: 50%;
    transform: translateX(-50%);
}
.stepBox>li.active::before{
    background-color: #1560F6;
    color: #fff;
}
.stepBox>li.active>i{
    color: #1560F6;
}
/* 用户信息 */
.topBox{
    box-sizing: border-box;
    padding: 20px 18px 20px 48px;
    font-size: 0;
    margin-bottom: 12px;
    height: 98px;
    box-sizing: border-box;
}
.topBox>div{
    font-size: 16px;
    color: #60636A;
    box-sizing: border-box;
    padding-bottom: 12px;
    line-height: 20px;
    position: relative;
}
.topBox>div::before{
    display: block;
    content: '';
    position: absolute;
    left: -28px;
    top: 0;
    width: 19px;
    height: 22px;
    background: url('../../assets/images/workreport.png') center/100% 100% no-repeat;
}
.topBox>span{
    display: inline-block;
    padding: 6px 12px;
    font-size: 14px;
    background-color: #F8F8F8;
    color: #60636A;
    border-radius:10px;
    margin-right: 12px;
}
/* 工作报告 */
.contactListTab{
    margin-bottom: 1px;
}
.boxRel{
    height: calc(100% - 98px - 50px - 78px);
    width:  calc(100% + 28px);
    margin-left: -14px;
}
.boxRel1{
    min-width: 960px;
    height: 100%;
    width: 100%;
    margin-left: 0;
    position: relative;
}
.tablePage{
    height: 100%;
}
.boxRel_{
    height: calc(100% - 98px - 14px - 50px );
}
.formMainCont{
    font-size: 0;
    margin: 0 14px ;
}
</style>
<style>
.fillBox.weekreportForm .boxRel1 .el-scrollbar__view{
    height: auto;
}
</style>