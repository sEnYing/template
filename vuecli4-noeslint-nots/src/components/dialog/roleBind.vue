<template>
    <div>
        <ul class="formUl roleBind">
            <li>
                <span class="formTitle"><i class="must">*</i>角色名称：</span>
                <span>{{name}}</span>
            </li>
            <li>
                <span class="formTitle">权限：</span>
                <div class="userGroupTree boxRound">
                    <input type="text" v-model="filter1" placeholder="筛选">
                    <span>全部用户</span>
                    <unit-loading :loading='loading'></unit-loading>
                    <unit-tree id="staff" v-if="!loading" :list='staffList' :choose="staffId" :hideparent='true' :input='filter1' @return='dropdownReturn'></unit-tree>
                </div>
                <div class="userGroupTree boxRound">
                    <span>已选用户<a class="textBtn AbleClick right" @click="cleaerChoose">清空</a></span>
                    <!-- <input type="text" v-model="filter2" placeholder="筛选"> -->
                    <unit-loading :loading='loading'></unit-loading>
                    <el-scrollbar class="chooseList eleTree" v-if="!loading">
                        <ul v-if='(chooseList?chooseList:[]).length>0'>
                            <li v-for="(item,i) in (chooseList?chooseList:[])" :key='i' v-show='filter2===""||item.label.indexOf(filter2)>-1'><unit-popover :content="item.label"></unit-popover><i class="el-icon-circle-close" @click="dropdownReturn(item,'remove')"></i></li>
                        </ul>
                        <div class="empty" v-if="(chooseList?chooseList:[]).length===0">暂无数据</div>
                    </el-scrollbar>
                </div> 
            </li>
            <li>
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='ajaxIng' text='确定'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消'></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitTree from '@/unit/components/element/treeBox'
export default {
    name: 'roleBind',
    props:['data'],
    components:{unitPopover,unitTree},
    data () {
        return{
            loading:true,
            ajaxIng:false,
            list:null,
            projType:'',
            id:'',
            roleId: '',
            name:'',
            filter1:'',
            filter2:'',
            staffList:[],
            chooseList:[],
            staffId:[],
            accountId:[],
        }
    },
    inject: ['close'],
    methods:{
        cleaerChoose() {
            this.chooseList=[]
            this.staffId=[]
            this.accountId=[]
        },
        dropdownReturn(item,key){
            let arr=[],acc=[];
            switch(key){
                case 'staff':
                    this.chooseList=item;
                    item.map(v=>{
                        arr.push(v.id);
                        acc.push(v.accountId);
                    })
                    this.staffId=arr;
                    this.accountId=acc;
                    break;
                case 'remove':
                    // debugger
                    this.staffId.indexOf(item.id)>-1?this.staffId.splice(this.staffId.indexOf(item.id),1):null
                    this.accountId.indexOf(item.accountId)>-1?this.accountId.splice(this.accountId.indexOf(item.accountId),1):null
                    arr=this.chooseList.concat();
                    for(let i in arr){
                        if(arr[i].id===item.id){
                            arr.splice(i,1);
                            break;
                        }
                    }
                    this.chooseList=arr;
                    break;
            }
        },
        getList(){
            this.loading=true;
            this.$api.bgmgnt.staff.getList({page:1, limit:0},res=>{
                this.loading=false;
                switch(res.code){
                    case '0':
                        var result = (res.data.list?res.data.list:[]).map(o=>{return{accountId:o.accountId, label:o.staffName+'('+o.staffNo+')', id:o.staffId}});
                        this.staffList=result.concat();
                        this.chooseList=this.getChoose(this.staffList.concat(),this.accountId.concat());
                        let list=[];
                        this.chooseList.map(v=>{
                            this.accountId.indexOf(v.accountId)>-1?list.push(v.id):null;
                        })
                        this.staffId=list;
                        break;
                    default:
                }
            })
        },
        getChoose(list,res){
            let result=[]
            for(let i in list){
                if(res.indexOf(list[i].accountId)>-1){
                    result.push(list[i]);
                    res.splice(res.indexOf(list[i].accountId),1);
                }
                if(res.length>0){
                    list[i].children&&list[i].children.length>0?result=result.concat(this.getChoose(list[i].children,res)):null
                }else{
                    break;
                }
            }
            return result;
        },
        submit(){
            if(this.ajaxIng){return;}
            // console.log(this.accountId)
            this.ajaxIng=true;
            this.$api.bgmgnt.role.bindAccount({roleId:this.roleId,accountIds:this.accountId},res=>{
                switch(res.code){
                    case '0':
                        this.$emit('close');
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'绑定成功',
                            func:()=>{
                                this.$emit('success');
                            }
                        })
                        break;
                    default:
                        this.ajaxIng=false;
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message
                        }):null;
                }
            });
        }
    },
    created(){
        this.$api.bgmgnt.role.roleDetail({roleId:this.data.roleId},res=>{
            switch(res.code){
                case '0':
                    this.name = res.data.roleName;
                    this.roleId=res.data.roleId;
                    this.accountId = (res.data.accountIds?res.data.accountIds:[])
                    this.getList();
                    break;
            }
        });
    },
    mounted(){
        this.$emit('ok');
    } 
}
</script>


<style scoped>
.roleBind{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.roleBind .formTitle{
    width: 108px;
}
.roleBind>li{
    padding-top: 5px;
}
.roleBind>li:nth-child(1){
    padding-top: 16px;
}
.roleBind>li>input{
    width: 324px;
}
.roleBind>li>div.btnBox{
    padding-top: 8px;
}
.roleBind>li>u.error{
    display: block;
    padding-left: 108px;
    margin-bottom: -24px;
    line-height: 24px;
    bottom: 18px;
    left: 113px;
}
.roleBind>li>.userGroupTree{
    display: inline-block;
    width: 250px;
    height: 400px;
    margin-top: 40px;
    margin-right: 60px;
    padding: 40px 0 10px;
}
.roleBind>li>.userGroupTree>input{
    position: absolute;
    top: -40px;
    left: 0;
    width: 250px;
}
.roleBind>li>.userGroupTree>span{
    position: absolute;
    top: 0px;
    left: 10px;
    right: 10px;
    padding: 0 8px;
    box-sizing: border-box;
    line-height: 36px;
    display: block;
    z-index: 111;
    border-bottom: 1px solid rgb(234,234,234);
}
.roleBind>li>.userGroupTree>.chooseList{
    display: block;
    height: 100%;
}
.roleBind>li>.userGroupTree>.chooseList ul{
    padding: 6px 0;
    /* margin-right: 17px; */
}
.empty{
    margin-right: 17px;
    width: auto;
}
.roleBind>li>.userGroupTree>.chooseList li{
    line-height: 26px;
    height: 26px;
    font-size: 14px;
    background-color: #ffffff;
    transition: background-color 0.15s ease;
    padding: 0 60px 0 32px;
    overflow: hidden;
    /* white-space: nowrap;
    text-overflow: ellipsis; */
    position: relative;
}
.roleBind>li>.userGroupTree>.chooseList li:hover{
    background-color: #F5F7FA;
}
.el-icon-circle-close{
    color: #FF2B2A;
    cursor: pointer;
    transition: all 0.15s ease;
    position: absolute;
    top: 50%;
    right: 20px;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    text-align: center;
    line-height: 20px;
    opacity: 0;
}
.roleBind>li>.userGroupTree>.chooseList li:hover .el-icon-circle-close{
    opacity: 1;
}
.el-icon-circle-close:hover{
    color: #fe6c6f;
}
a.textBtn{
    font-size: 14px;
    color: #4780F4;
    display: inline-block;
    -webkit-transition: color 0.15s ease;
    transition: color 0.15s ease;
}
a.textBtn:hover{
    color: #7aa3f7;
}
</style>
<style>
.roleBind .treeChoose .el-scrollbar__wrap{
    /* overflow-x: hidden; */
    margin-bottom: 0;
    padding: 0;
}
.roleBind>li>.userGroupTree>.chooseList li div{
    width: 100%;
    height: 100%;
}
/* .roleBind .el-scrollbar__wrap{
    overflow-x: hidden;
} */
</style>