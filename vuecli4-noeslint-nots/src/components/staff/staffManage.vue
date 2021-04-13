<template>
<div class="fillBox staffMgnt">
    <div class="boxTitle titleFix">
        <i class="staff_icon"></i><span>人员管理</span>
        <unit-btn type='large right' @click="addBtn('add')" text='新建人员'></unit-btn>
    </div>
    <div class="contentFix">
        <div class="boxRel">
            <el-scrollbar class="unitScrollbar" ref='scrollbar'>
                <div class="formBox">
                    <div>
                        <span class="formBox_text">姓名</span>
                        <div><input type="text" v-setwidth v-model="selectObj.staffName" maxlength="20" placeholder="按姓名查找" ref='input' @keydown.enter="selectBtn"></div>
                    </div>
                    <div>
                        <span class="formBox_text">状态</span>
                        <div><unit-dropdown id="state" class="auto" v-setwidth :list="select" :result='selectObj.state' placeholder="全部" @change='returnBtn' :clear='true'></unit-dropdown></div>
                    </div>
                    <div class="btnBox">
                        <unit-btn style="margin-right:20px" type='plain right' @click="clearBtn" text='重置'></unit-btn>
                        <unit-btn style="margin-right:20px" type='right' @click="selectBtn" text='查询'></unit-btn>
                    </div>
                </div>
                <unit-loading style="marginTop:200px;" :loading='loadingT' v-if="loadingT"></unit-loading>
                <div class="boxRound" v-if="!loadingT">
                    <div class="title">部门</div>
                    <unit-tree id="staff" :list='staffList' :only='true' :must='true' :choose="[choose]" :hideparent='false' @return='tableOper' keyid='depId' :expendclick="false" :showclick='false'></unit-tree>
                </div>
                <div class="boxTable" v-if="!loadingT">
                    <unit-loading :loading='loading' v-if="loading"></unit-loading>
                    <unit-table :total='total' class="tableTable" :indexrow='0' :opern='4' :page='page' v-if="!loading||list.length>0" :list='list' :title='title' @click='tableOper' :classname="{red:{stateTxt:{state:'0'}}}" :operation="['revise',{key:'start',show:(item)=>{return item.state==='1'?false:true}},{key:'stop',show:(item)=>{return item.state==='1'?true:false},class:()=>{return 'redbtn'}},'assignRole','reset',{key:'delete',class:()=>{return 'redbtn'}}]"></unit-table>
                    <unit-page :total='total' :page='page' @pagechange="getList"></unit-page>
                </div>
            </el-scrollbar>
        </div>
    </div>
</div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
import unitTree from '@/unit/components/element/treeBox'
export default {
    name: 'staffManage',
    props:['dom'],
    components:{unitTable,unitTree},
    data () {
        return{
            loadingT:false,
            loading:false,
            choose:null,
            selectObj:{
                staffName:'',
                state:'',
            },
            selectRes:{
                staffName:'',
                state:'',
            },
            select:[{value:'1',label:'启用'},{value:'0',label:'停用'}],
            page:1,
            total:0,
            title:[{key:'staffName',name:'姓名',width:25},{key:'depName',name:'部门',width:30},{key:'resTypeName',name:'职位类别',width:30},{key:'staffNo',name:'账号',width:25},{key:'stateTxt',name:'状态',width:20}],//{key:'password',name:'密码',width:30},
            list:[],
            staffList:[],
        }
    },
    computed: {
        reload(){
            return this.$store.state.reload;
        },
    },
    watch:{
        reload(){
            // console.log(this.reload)
            if(this.reload){
                this.getList(1);
                this.$store.commit('reloadFn',false);
            }
        },
    },
    methods:{
        returnBtn(item,type){
            switch(type){
                case 'state':
                    this.selectObj.state=item.value;
                    break;
                default:
            }
        },
        clearBtn(){
            for(let k in this.selectObj){
                this.selectObj[k]=null;
            }
            this.selectBtn();
        },
        selectBtn(){
            for(let k in this.selectRes){
                this.selectRes[k]=this.selectObj[k];
            }
            this.getList(1);
        },
        getList(page){
            if(this.loading){return;}
            this.loading=true;
            this.page=page;
            let param=JSON.parse(JSON.stringify(this.selectRes));
            param.depId=this.choose;
            param.limit=10;
            param.page=page;
            this.$api.bgmgnt.staff.getList(param,res=>{
                this.loading=false;
                switch(res.code){
                    case "0":
                        this.total=Number(res.data.total);
                        let list=(res.data.list?res.data.list:[]).concat();
                        list.map(v=>{
                            v.stateTxt=v.state&&v.state==='1'?'启用':'停用'
                        })
                        this.list=list;
                        break;
                }
            })
        },
        addBtn(action,item){
            // this.$router.push({name: item&&item.staffId?'staffEdit':'staffAdd', params: item&&item.staffId?{ staffId:item.staffId}:{}})
            this.$emit('dialog',{show:true,link:'staffForm',title:(action === 'revise'?'编辑':'新建')+'人员',data:item,small:true})
        },
        assignBtn(item) {
            this.$emit('dialog',{show:true,link:'staffAssign',title:'分配角色',data:item,small:true})
        },
        tableOper(type,item){
            let param={
                accountId:item.accountId
            },text='您确定';
            switch(type){
                case 'revise':this.addBtn('revise',item);return;
                case 'stop':
                    param.state="0";
                    text+='停用';
                    break;
                case 'start':
                    param.state="1";
                    text+='启用';
                    break;
                case 'assignRole': this.assignBtn(item);return;
                case 'reset':
                    this.$store.commit('confirmFn',{
                        func:()=>{
                            param.staffId=item.staffId;
                            this.$api.bgmgnt.staff.resetpass(param,res=>{
                                switch(res.code){
                                    case '0':
                                        this.$store.commit('alertFn',{
                                            type:'success',
                                            text:'操作成功',
                                            func:()=>{
                                                this.getList(this.page);
                                            }
                                        })
                                        break;
                                    default:
                                        res.message?this.$store.commit('alertFn',{
                                            type:'error',
                                            text:res.message
                                        }):null;
                                }
                            })
                        },
                        text:'确认重置'+item.staffName+'的登录密码为人员手机号<span class="blueTxt">'+item.phone+'</span>吗?'
                    })
                    return;
                case 'delete':
                    this.$store.commit('confirmFn',{
                        func:()=>{
                            param.staffId=item.staffId;
                            this.$api.bgmgnt.staff.delete(param,res=>{
                                switch(res.code){
                                    case '0':
                                        this.$store.commit('alertFn',{
                                            type:'success',
                                            text:'操作成功',
                                            func:()=>{
                                                this.getList(this.page);
                                            }
                                        })
                                        break;
                                    default:
                                        res.message?this.$store.commit('alertFn',{
                                            type:'error',
                                            text:res.message
                                        }):null;
                                }
                            })
                        },
                        text:'确认删除该人员及账号吗?'
                    })
                    return;
                default:
                    // console.log(type,item)
                    this.choose=type[0].depId;
                    this.selectObj.staffName='';
                    this.selectObj.state='';
                    this.selectBtn();
                    return;
            }
            text+='该账号吗？'
            this.$store.commit('confirmFn',{
                func:()=>{
                    this.$api.bgmgnt.staff.changestate(param,res=>{
                        switch(res.code){
                            case '0':
                                this.$store.commit('alertFn',{
                                    type:'success',
                                    text:'操作成功',
                                    func:()=>{
                                        this.getList(this.page);
                                    }
                                })
                                break;
                            default:
                                // res.message?(param.state?this.$store.commit('alertFn',{
                                //     type:'error',
                                //     text:res.message
                                // }):this.$store.commit('confirmFn',{
                                //     type:'warn',
                                //     text:res.message
                                // })):null;
                                res.message?this.$store.commit('alertFn',{
                                    type:'error',
                                    text:res.message
                                }):null;
                        }
                    })
                },
                text:text
            })
        },
    },
    mounted(){
        this.loadingT=true;
        this.$api.public.depmgnt(res=>{
            this.loadingT=false;
            switch(res.code){
                case "0":
                    this.staffList=(res.data?res.data:[]).concat();
                    this.choose=this.staffList[0].depId;
                    break;
            }
        })
        this.selectBtn();
    },
}
</script>

<style scoped>
.formBox>div:not(.btnBox){
    position: relative;
    padding-left: 38px;
    width: calc( 20% - 28px);
}
.formBox>div>.formBox_text{
    position: absolute;
    left: 0;
    top: 0;
}
.formBox>div>div>*{
    width: 100%;
}
.formBox>div:nth-child(1){
    margin-right: 20px;
}
.formBox{
    padding: 13px 0 11px;
}
.boxTable{
    position: relative;
    /* min-height: 594px; */
    padding-bottom: 0px;
    box-sizing: border-box;
}
.formBox>div.right>input{
    margin-right: 20px;
    font-size: 13px;
}
.formBox>div.right>input:-moz-placeholder,
.formBox>div.right>input::-moz-placeholder{   
    color: #caced7; 
    opacity: 1;
}
.formBox>div.right>input:-ms-input-placeholder{   
    color: #caced7; 
}
.formBox>div.right>input::-webkit-input-placeholder{   
    color: #caced7; 
}
.boxContent{
    font-size: 0;
    position: relative;
}
.boxContent>*{
    display: inline-block;
    vertical-align: top;
}
.boxRound{
    width: 28%;
    /* margin-bottom: 26px; */
    /* margin-bottom: 20px; */
    display: inline-block;
    vertical-align: top;
    padding: 50px 22px 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* height: 86%; */
    height: calc(100% - 92px);
}
.boxRound>.title{
    position: absolute;
    top: 0;
    left: 0;
    line-height: 60px;
    font-size: 14px;
    padding-left: 22px;
    height: 50px;
}
.boxTable{
    /* position: absolute; */
    /* left: 30%; */
    /* top: 72px; */
    /* right: 0; */
    width: 70%;
    margin-left: 2%;
    float: right;
    height: calc(100% - 100px);
}
.formBox>div.btnBox {
    padding-left: 50px;
}
.staffMgnt>.contentFix>.boxRel{
    margin-left: -20px;
    width: auto;
}
.tableTable{
    height: calc(100% - 54px);
}
</style>
<style>
.staffMgnt>.contentFix>.boxRel>.unitScrollbar>.el-scrollbar__wrap>.el-scrollbar__view{
    padding-left: 20px;
}
</style>