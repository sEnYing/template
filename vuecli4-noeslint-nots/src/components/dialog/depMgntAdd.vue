<template>
    <div>
        <ul class="formUl depmgntDialog">
            <li :class="{'errorBorder':error.key==='name'}">
                <span class="formTitle"><i class="must">*</i>部门名称：</span>
                <input type="text" v-model="form.name" maxlength="30" @input="clearErr('name')" placeholder="请输入部门名称" ref='input'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='name'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='departmentLevel'}">
                <span class="formTitle">
                    <i class="must">*</i>部门级别：
                </span>
                <unit-dropdown v-setwidth id="departmentLevel" class="dropdownMenu" placeholder='全部' :list="depLevel" @change="dropdownReturn" :reset='reset' :result="form.level"></unit-dropdown>
                <transition name="publicTransition"><u class="error" v-if="error.key==='departmentLevel'">{{error.msg}}</u></transition>
            </li>
            <li v-if="data.depId!=='root'" :class="{'errorBorder':error.key==='departmentType'}">
                <span class="formTitle">
                    <i class="must">*</i>部门类型：
                </span>
                <unit-dropdown v-setwidth id="departmentType" class="dropdownMenu" placeholder='全部' :list="depType" @change="dropdownReturn" :reset='reset' :result="form.type"></unit-dropdown>
                <transition name="publicTransition"><u class="error" v-if="error.key==='departmentType'">{{error.msg}}</u></transition>
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
// import css和第三方js
export default {
    name: 'depMgntAdd',
    props:['data'],
    data () {
        return{
            ajaxIng:false,
            pDepId:'',
            id:'',
            name:'',
            error:{
                key:null,
                msg:'',
            },
            await:false,
            depLevel: [],
            depType: [],
            reset:true,
            form: {
                name: '',
                level: null,
                type: null
            }
        }
    },
    inject: ['close'],
    methods:{
        async submit(){
            if(this.ajaxIng||this.await||this.error.key){return;}
            if (!this.$pubfunc.replaceSpace(this.form.name,1)) {
                return this.setErr('name','部门名称不可为空');
            }
            if (this.form.level === null) {
                return this.setErr('departmentLevel','请选择部门级别');
            }
            if (this.form.type === null) {
                return this.setErr('departmentType','请选择部门类型');
            }
            this.await=true;
            this.ajaxIng=true;
            let res = await this.$api.bgmgnt.department.depmgntcheckName({pDepId:this.pDepId,depName:this.form.name,depId:this.id})
            this.await=false;
            switch(res.code){
                case '0':
                    if(res.data.exist){
                        return this.setErr('name','部门名称已存在，请重新输入');
                    }
                    break;
                default:
                    res.message?this.$store.commit('alertFn',{
                        type:'error',
                        text:res.message
                    }):null;
                    return
            }
            let judge=this.data&&this.id&&this.form.name;
            this.$api.bgmgnt.department[judge?'update':'add'](judge?{pDepId:this.pDepId,depName:this.form.name,depLevel:this.form.level,depType:this.form.type,depId:this.id}:
            {pDepId:this.pDepId,depName:this.form.name,depLevel:this.form.level,depType:this.form.type},res=>{
                switch(res.code){
                    case '0':
                        this.$emit('close');
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:judge?'编辑成功':'添加成功',
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
            })
        },
        // getDropData() {
        //     this.$api.public.dict({codeGroup:'dep_level',pCode:''},res=>{
        //         switch(res.code){
        //             case '0':
        //                 this.depLevel=res.data?res.data:[];
        //                 break;
        //         }
        //     });
        //     this.$api.public.dict({codeGroup:'dep_type',pCode:''},res=>{
        //         switch(res.code){
        //             case '0':
        //                 this.depType=res.data?res.data:[];
        //                 break;
        //         }
        //     });
        // },
        setErr(key,text){
            this.error.key=key;
            this.error.msg=text;
            return false
        },
        clearErr(key){
            if(!key||key===this.error.key){
                this.error.key=null
            }
        },
        dropdownReturn(res,key) {
            this.clearErr(key);
            switch(key){
                case 'departmentLevel':
                    this.form.level=res.value;
                    break;
                case 'departmentType':
                    this.form.type=res.value;
                    break;
            }
        }
    },
    created() {
        // this.getDropData();
    },
    mounted(){
        if(!this.data||!this.data.depTypeList||!this.data.depLevelList){
            this.close();
            return;
        }
        // this.data?(
        this.depType=this.data.depTypeList;
        this.depLevel=this.data.depLevelList;
        this.data.pDepId?this.pDepId=this.data.pDepId:null;
        this.data.depName?this.form.name=this.data.depName:null;
        this.data.depLevel ? this.form.level = this.data.depLevel : null;
        this.data.depType ? this.form.type = this.data.depType : null;
        this.data.depId?this.id=this.data.depId:null
        // ):null
        this.$emit('ok');
        this.$nextTick(()=>{
            this.$refs.input?this.$refs.input.focus():null;
        })
    } 
}
</script>


<style scoped>
.depmgntDialog{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.depmgntDialog .formTitle{
    width: 108px;
}
.depmgntDialog>li {
    padding-bottom: 18px;
}
.depmgntDialog>li>input{
    width: 324px;
}
.depmgntDialog>li>div.btnBox{
    padding-top: 28px;
}
.depmgntDialog>li>u.error{
    width: 322px!important;
}
</style>
<style>
.depmgntDialog>li>.dropdownMenu,
.depmgntDialog .elDropdown>.el-select{
    width: 324px!important;
}
</style>
