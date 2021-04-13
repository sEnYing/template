<template>
    <div>
        <ul class="formUl staffDialog">
            <li :class="{'errorBorder':error.key==='headImage'}" class="hImg">
                <span class="formTitle"><i class="must">*</i>头像：</span>
                <ul class="headImage">
                    <li v-for="i in 4" :key="i" @click="dropdownReturn(i,'headImage')" :class="{'active':returnIndex(form.headImage)===i.toString()}"><i><img :src="'/static/images/headImage/'+i+'.png'" alt=""></i><i class="el-icon-check"></i></li>
                </ul>
                <transition name="publicTransition"><u class="error" v-if="error.key==='headImage'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='name'}">
                <span class="formTitle"><i class="must">*</i>姓名：</span>
                <input type="text" v-model="form.staffName" maxlength="10" @input="inputChange('name')" placeholder="请输入姓名" ref='input'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='name'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='jobNum'}">
                <span class="formTitle"><i class="must">*</i>工号：</span>
                <input type="text" v-model="form.staffNo" maxlength="30" @input="inputChange('jobNum')" placeholder="工号即为登录账号" ref='input'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='jobNum'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='phone'}">
                <span class="formTitle"><i class="must">*</i>手机号：</span>
                <input type="text" v-model="form.phone" maxlength="11" @input="inputChange('phone')" placeholder="手机号即为登录密码" ref='input'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='phone'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='entryDate'}">
                <span class="formTitle">入职日期：</span>
                <unit-time placeholder='请选择' :value='form.entryDate' id='entryDate' @return='dropdownReturn'></unit-time>
                <transition name="publicTransition"><u class="error" v-if="error.key==='entryDate'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='staffType'}">
                <span class="formTitle">
                    <i class="must">*</i>职位类别：
                </span>
                <unit-dropdown v-setwidth id="staffType" class="dropdownMenu" placeholder='请选择' :list="staffType" @click='hideOther' @change="dropdownReturn" :reset='reset' :result="form.resourceType"></unit-dropdown>
                <transition name="publicTransition"><u class="error" v-if="error.key==='staffType'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='depId'}">
                <span class="formTitle">
                    <i class="must">*</i>部门：
                </span>
                <unit-tree id="depId" :list='depList' :choose="form.depId" :hid='hideTree' @click='hideOther' placeholder='请选择' @return='dropdownReturn' :hidedisable='true' :only='true' :expendclick="false" keyid="depId" :must='true'></unit-tree>
                <transition name="publicTransition"><u class="error" v-if="error.key==='depId'">{{error.msg}}</u></transition>
            </li>
            <li class="radioBox small" :class="{'errorBorder':error.key==='isAdmin'}">
                <span class="formTitle"><i class="must">*</i>是否为管理员：</span>
                <el-radio class="sexRadio" v-model="form.isAdmin" label="1">是</el-radio>
                <el-radio class="sexRadio" v-model="form.isAdmin" label="0">否</el-radio>
                <transition name="publicTransition"><u class="error" v-if="error.key==='isAdmin'">{{error.msg}}</u></transition>
            </li>
            <li class="radioBox small" :class="{'errorBorder':error.key==='isCharge'}">
                <span class="formTitle"><i class="must">*</i>是否为部门负责人：</span>
                <el-radio class="sexRadio" v-model="form.isCharge" label="1">是</el-radio>
                <el-radio class="sexRadio" v-model="form.isCharge" label="0">否</el-radio>
                <transition name="publicTransition"><u class="error" v-if="error.key==='isCharge'">{{error.msg}}</u></transition>
            </li>
            <!-- <li>
                <span class="formTitle">角色：</span>
                <el-checkbox-group v-model="form.roles" @change="roleChange">
                    <el-checkbox v-for="i in roleList" :key="i.roleId" :label="i.roleId">{{i.roleName}}</el-checkbox>
                </el-checkbox-group>
            </li> -->
            <li>
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='ajaxIng' :text='(staffId==null?"创建":"保存")'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消'></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitTree from '@/unit/components/element/tree'
import unitTime from '@/unit/components/element/timeBox'
// import css和第三方js
export default {
    name: 'staffForm',
    props:['data'],
    components:{unitTree,unitTime},
    data () {
        return{
            staffId:null,
            reset:true,
            staffType: [],
            depList_: null,
            depList: [],
            roleList: [],
            hideTree:false,
            error: {
                key:null,
                msg:'',
            },
            
            form: {
                headImage: null,
                staffName: '',
                staffNo: '',
                phone: '',
                isAdmin: '',
                isCharge: '',
                resourceType: null,
                depId: [],
                entryDate: '',
                roles: []
            },
            btnTxt:{
                revise:'保存',
                view:'确定',
            },
            ajaxIng: false
        }
    },
    inject: ['close'],
    computed:{
        specialResourceType(){return this.$store.state.special.resourceType},
        specialDepLevel(){return this.$store.state.special.depLevel},
    },
    watch:{
        'form.isAdmin'(){this.clearErr('isAdmin')},
        'form.isCharge'(){this.clearErr('isCharge')}
    },
    methods:{
        submit() {
            if(this.ajaxIng){return;}
            if (!this.form.headImage||!this.returnIndex(this.form.headImage)) {
                this.showErr('headImage','请选择头像');
                return;
            }
            if (!this.$pubfunc.replaceSpace(this.form.staffName,1)) {
                this.showErr('name','请输入员工姓名')
                return;
            }
            if (!this.$pubfunc.replaceSpace(this.form.staffNo,1)) {
                this.showErr('jobNum','请输入员工工号')
                return;
            }
            if (!this.$pubfunc.replaceSpace(this.form.phone,1)) {
                this.showErr('phone','请输入员工手机号码')
                return;
            }else if(!this.$pubfunc.judgePhone(this.$pubfunc.replaceSpace(this.form.phone))){
                this.showErr('phone','手机号码格式有误，请重新上输入')
                return;
            }
            // if (!this.form.entryDate) {
            //     this.showErr('entryDate','请选择员工入职日期')
            //     return;
            // }
            if (!this.form.resourceType) {
                this.showErr('staffType','请选择员工职位类别')
                return;
            }
            if (!this.form.depId||this.form.depId.length===0) {
                this.showErr('depId','请选择员工部门')
                return;
            }
            if (!this.form.isAdmin) {
                this.showErr('isAdmin','请选择是否为管理员')
                return;
            }
            if (!this.form.isCharge) {
                this.showErr('isCharge','请选择是否为部门负责人')
                return;
            }
            let param={};
            for(let k in this.form){
                k==='depId'?param[k]=this.form[k].join(','):param[k]=(this.form[k]?JSON.parse(JSON.stringify(this.form[k])):'')
            }
            let api=this.staffId?'update':'add';
            this.staffId?param.staffId=this.staffId:null;
            this.ajaxIng=true;
            this.$api.bgmgnt.staff[api](param,res=>{
                switch(res.code){
                    case '0':
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:(this.staffId?'编辑成功':'新建成功'),
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
        inputChange(key) {
            this.error.key===key?this.error.key=null:null;
            switch(key){
                case 'name':this.form[key]?this.form[key]=this.form[key].toString().replace(/[^0-9a-zA-Z-]/g, ""):null;
                    break;
                case 'jobNum':this.form.staffNo=this.$pubfunc.replaceSpace(this.form.staffNo,2);
                    break;
                case 'phone':this.form.phone=this.$pubfunc.replaceSpace(this.form.phone,2);
                    break;
            }
        },
        showErr(k,message){
            this.error.key=k;
            this.error.msg=message;
        },
        clearErr (key,item) {
            if(!key||key===this.error.key){
                this.error.key=null
            }
            if(item){
                item[key]=this.$pubfunc.replacePhone(item[key]);
            }
        },
        roleChange(data) {
            
        },
        returnIndex(url){
            let base=['1','2','3','4'];
            if(url){
                let arr=url.split('/');
                url=arr[arr.length-1];
                arr=url.split('.');
                url=arr[0];
            }
            return url&&base.indexOf(url)>-1?url:''
        },
        hideOther(j){this.hideTree=j?j:false},
        changeTree(arr,id){
            let ids=[]
            for(let i in arr){
                if(arr[i].depLevel!==id){
                    arr[i].disabled=true;
                }else{
                    ids.push(arr[i].depId);
                }
                if(arr[i].children&&arr[i].children.length>0){
                    let json=this.changeTree(arr[i].children,id);
                    arr[i].children=json.arr;
                    ids=ids.concat(json.ids)
                }
            }
            return {arr:arr,ids:ids}
        },
        dropdownReturn(item,key,thisItem) {
            // console.log(item,key,thisItem)
            this.error.key===key?this.error.key=null:null;
            switch(key) {
                case "headImage":
                    this.form.headImage='/static/images/headImage/'+item+'.png';
                    break;
                case "entryDate":
                    this.form.entryDate = this.$pubfunc.TimeTransform('YYYY/MM/DD',item);
                    break;
                case 'depId':
                    if(this.form.resourceType!==this.specialResourceType){
                        this.form.depId=[item[0].depId];
                    }else{
                        for(let i in item){
                            if(this.form.depId.indexOf(item[i].depId)>-1){
                                this.form.depId.splice(this.form.depId.indexOf(item[i].depId),1)
                            }else{
                                this.form.depId.push(item[i].depId)
                            }
                        }
                    }
                    break;
                case 'staffType':
                    let arr=JSON.parse(this.depList_),ids=[];
                    if(item.value!==this.specialResourceType){
                        this.depList=arr;
                    }else{
                        let json=this.changeTree(arr,this.specialDepLevel);
                        this.depList=json.arr?json.arr:[];
                        ids=json.ids?json.ids:[];
                    }
                    if(this.form.resourceType===this.specialResourceType&&item.value!==this.specialResourceType&&this.form.depId.length>1){
                        this.form.depId=[];
                    }
                    if(item.value===this.specialResourceType&&this.form.resourceType!==this.specialResourceType&&this.form.depId.length>0&&ids.indexOf(this.form.depId[0])===-1){
                        this.form.depId=[];
                    }
                    this.form.resourceType = item.value;
                    break;
            }
        },
        getDropData() {
            this.$api.public.dict({codeGroup:'resource_type',pCode:''},res=>{
                switch(res.code){
                    case '0':
                        this.staffType=res.data?res.data:[];
                        break;
                }
            });
            // tree
            this.$api.public.depmgnt(res=>{
                switch(res.code){
                    case '0':
                        this.depList_=JSON.stringify(res.data);
                        if(this.form.resourceType===this.specialResourceType){
                            let json=this.changeTree(res.data,this.specialDepLevel);
                            this.depList=json.arr?json.arr:[];
                        }else{
                            this.depList=res.data;
                        }
                        break;
                }
            })
            // role
            // this.$api.public.role({page:1,limit:0},res=>{
            //     switch(res.code){
            //         case '0':
            //             this.roleList=res.data.list;
            //             this.$emit('ok');
            //             break;
            //     }
            // })
        },
        getDetail(id) {
            this.$api.bgmgnt.staff.getDetail({staffId:id},res=>{
                if(res.code==='0'&&res.data){
                    this.form.headImage = res.data.headImage
                    this.form.staffName = res.data.staffName
                    this.form.staffNo = res.data.staffNo
                    this.form.phone = res.data.phone
                    this.form.isAdmin = res.data.isAdmin?res.data.isAdmin:'0'
                    this.form.isCharge = res.data.isCharge?res.data.isCharge:'0'
                    this.form.resourceType = res.data.resourceType
                    this.form.depId = res.data.depId?res.data.depId.split(','):[]
                    this.form.entryDate = res.data.entryDate
                    // this.form.roles = (res.data.roles === null?[]:res.data.roles)
                    if(res.data.resourceType===this.specialResourceType&&this.depList_){
                        let json=this.changeTree(JSON.parse(this.depList_),this.specialDepLevel);
                        this.depList=json.arr?json.arr:[];
                        let ids=json.ids?json.ids:[];
                        for(let i in this.form.depId){
                            if(ids.indexOf(this.form.depId[i])===-1){
                                this.form.depId.splice(i,1)
                            }
                        }
                    }
                }
            })
        }
    },
    created() {
        this.getDropData();
    },
    mounted(){
        if (this.data != null) {
            this.staffId = this.data.staffId
            this.getDetail(this.staffId);
        }else{
            this.form.isAdmin = '0'
            this.form.isCharge = '0'
        }
        this.$emit('ok');
    } 
}
</script>


<style scoped>
.formUl>li>div:not(.btnBox){
    width: 324px;
}
.formUl>li u.error {
    left: 147px;
}
ul.headImage>li{
    display: inline-block;
    width: 60px;
    height: 60px;
    margin-right: 18px;
    vertical-align: top;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(197,197,197,0);
    transition: all 0.15s ease;
    position: relative;
}
ul.headImage>li>i:not(.el-icon-check){
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
}
ul.headImage>li>i.el-icon-check{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: block;
    position: absolute;
    background-color: #4780F4;
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
    opacity: 1;
    right: 2px;
    bottom: -2px;
    transform: scale(0.86);
    opacity: 0;
    transition: all 0.15s ease;
}
ul.headImage>li:hover,
ul.headImage>li.active{
    box-shadow: 0 0 10px rgba(197,197,197,1);
}
ul.headImage>li.active>i.el-icon-check{
    opacity: 1;
}
ul.headImage>li>i>img{
    width: 62px;
    height: 62px;
    display: block;
    margin: -1px;
}
.staffDialog{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.staffDialog .formTitle{
    width: 165px;
}
.staffDialog>li {
    padding-bottom: 18px;
}
.staffDialog>li>input{
    width: 324px;
}
/* .staffDialog>li>div.btnBox{
    padding-top: 28px;
} */
.staffDialog>li>u.error{
    width: 322px!important;
}
.staffDialog>li:nth-child(1)>u.error{
    text-align: left;
}
.hImg u.error::before{
    display: inline-block!important;
    /* left: 235px!important; */
    /* top: -7px!important; */
    position: relative;
    margin: -10px 0;
    top: 0!important;
    right: unset!important;
    background-color: transparent!important;
} 
/* u.headerr{
    color: #FD2624;
    font-size: 12px;
    padding-left: 20px;
    text-decoration: none;
    vertical-align: top;
}
.formUl>li u.headerr{
    line-height: 18px;
    position: absolute;
    bottom: 0;
    left: 90px;
    width: 230px;
    padding-left: 0;
    text-align: right;
}
@media screen and (max-width: 1400px){
    .formUl>li u.headerr{
        width: 378px!important;
    }
}
.formUl>li.radioBox u.headerr{
    position: relative;
    display: inline-block;
    line-height: 16px;
}
.formUl>li.radioBox u.headerr::before{
    display: inline-block;
    left: -30px;
    top: -7px;
    background-color: transparent;
} */
/* .hImg u.error::before{
    display: inline-block!important;
    left: 235px!important;
    top: -7px!important;
    background-color: transparent!important;
} */
.staffDialog>li.radioBox>u.error{
    width: auto!important;
    left: 60px;
}
</style>
<style>
.staffDialog>li>.dropdownMenu,
.staffDialog>li .el-date-editor.el-input,
.staffDialog .elDropdown>.el-select{
    width: 324px!important;
}
/* .Dialog>div {
    min-height: 716px!important;
} */
</style>
