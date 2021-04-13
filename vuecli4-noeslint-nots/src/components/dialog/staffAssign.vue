<template>
    <div>
        <ul class="formUl assignDialog">
            <li>
                <span class="formTitle"><i class="must">*</i>姓名：</span>
                <span class="groupBox"><unit-popover :content="staffName"></unit-popover></span>
            </li>
            <li>
                <span class="formTitle">
                    <i class="must">*</i>工号：
                </span>
                <span class="groupBox"><unit-popover :content="staffNo"></unit-popover></span>
            </li>
            <li :class="{'errorBorder':error.key==='roles'}">
                <span class="formTitle"><i class="must">*</i>角色：</span>
                <el-checkbox-group class="groupBox" v-model="roles" @change="roleChange">
                    <el-checkbox v-for="i in roleList" :key="i.roleId" :label="i.roleId">{{i.roleName}}</el-checkbox>
                </el-checkbox-group>
                <transition name="publicTransition"><u class="error" v-if="error.key==='roles'">{{error.msg}}</u></transition>
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
export default {
    name: 'staffAssign',
    props:['data'],
    components:{unitPopover},
    data () {
        return{
            ajaxIng: false,
            staffId: null,
            accountId: null,
            staffName: null,
            staffNo: null,
            roles: [],
            error: {
                key: null,
                msg: null
            },
            roleList: []
        }
    },
    inject: ['close'],
    methods:{
        submit() {
            if(this.ajaxIng){return;}
            if (this.roles.length === 0) {
                this.showErr('roles','请选择角色');
                return;
            }
            this.ajaxIng=true;
            this.$api.bgmgnt.staff.bindrole({accountId: this.accountId,roles: this.roles},res => {
                switch(res.code){
                    case '0':
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'分配成功',
                            func:()=>{
                                this.$emit('success');
                            }
                        });
                        break;
                    default:
                    this.ajaxIng=false;
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message
                        }):null;
                }
            })
        },
        showErr(k,message){
            this.error.key=k;
            this.error.msg=message;
        },
        getDetail(id) {
            this.$api.bgmgnt.staff.getDetail({staffId:id},res=>{
                switch(res.code){
                    case '0':
                        this.staffName = res.data.staffName;
                        this.staffNo = res.data.staffNo;
                        this.accountId = res.data.accountId;
                        this.roles = (res.data.roles === null?[]:res.data.roles)
                        break;
                }
            })
        },
        getRole() {
            // role
            this.$api.public.role({page:1,limit:0},res=>{
                switch(res.code){
                    case '0':
                        this.roleList=res.data.list;
                        this.$emit('ok');
                        break;
                }
            })
        },
        roleChange() {
            this.error.key = null;
        }
    },
    created() {
        this.getRole();
    },
    mounted(){
        if (this.data != null) {
            this.staffId = this.data.staffId
            this.getDetail(this.staffId);
        }
        this.$emit('ok');
    } 
}
</script>


<style scoped>
.assignDialog li u.error::before {
    display: inline-block!important;
    left: -30px!important;
    top: -6px!important;
    background-color: transparent!important;
}
.assignDialog li u.error {
    left: 128px;
    bottom: 0px;
    text-align: left;
    /* width: 60px!important; */
}
.assignDialog{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.assignDialog .formTitle{
    width: 125px;
}
.assignDialog>li {
    padding-bottom: 18px;
}
.assignDialog>li>input{
    width: 324px;
}
/* .assignDialog>li>div.btnBox{
    padding-top: 28px;
} */
.groupBox{
    width: 365px;
}
</style>
<style>
.assignDialog>li>.dropdownMenu,
.assignDialog>li .el-date-editor.el-input,
.assignDialog .elDropdown>.el-select{
    width: 324px!important;
}
/* .Dialog>div {
    min-height: 368px!important;
} */
</style>
