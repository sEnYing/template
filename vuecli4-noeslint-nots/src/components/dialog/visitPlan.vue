<template>
    <div>
        <ul class="formUl planDialog">
            <li :class="{'small':key==='planView','errorBorder':error.key==='customerId'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>客户名称：</span>
                <div v-if="key==='planView'">{{result.customerName|emptyTxt}}</div>
                <unit-customer v-if="key!=='planView'" id="customerId" placeholder='' @change='dropdownReturn' :input="true" :result='result.customerId'></unit-customer>
                <transition name="publicTransition"><u class="error" v-if="error.key==='customerId'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='projId'}">
                <span class="formTitle">项目名称：</span>
                <div v-if="key==='planView'">{{result.projName|emptyTxt}}</div>
                <unit-project v-if="key!=='planView'" id="projId" placeholder='' @change='dropdownReturn' :clear='true' :input="true" :customer='result.customerId?result.customerId:null' :result='result.projId'></unit-project>
                <transition name="publicTransition"><u class="error" v-if="error.key==='projId'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='dateTime'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>日期时间：</span>
                <div v-if="key==='planView'">{{($pubfunc.TimeTransform('YYYY年MM月DD日',result.date)+" "+$pubfunc.transTime(result.time))|emptyTxt}}</div>
                <unit-time v-if="key!=='planView'" placeholder='' :value='result.date&&result.time?(result.date+" "+result.time):""' id='dateTime' @return='dropdownReturn' :time='true' :disableddate='1' :date='data.endDate' :reset='reset'></unit-time>
                <transition name="publicTransition"><u class="error" v-if="error.key==='dateTime'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='contactId'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>拜访对象：</span>
                <div v-if="key==='planView'">{{result.contactName}}</div>
                <unit-contact v-if="key!=='planView'" id="contactId" placeholder='' @change='dropdownReturn' :input="true" :orgid='result.customerId?result.customerId:null' :result='result.contactId' type='customer'></unit-contact>
                <transition name="publicTransition"><u class="error" v-if="error.key==='contactId'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='position'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>职务：</span>
                <div v-if="key==='planView'">{{result.position|emptyTxt}}</div>
                <input v-if="key!=='planView'" v-model="result.position" placeholder="" type="text" maxlength="30" @input="clearErr('position')">
                <transition name="publicTransition"><u class="error" v-if="error.key==='position'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='city'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>地区（城市）：</span>
                <div v-if="key==='planView'">{{result.cityName|emptyTxt}}</div>
                <unit-region ref='region' :must='true' id="city" @change='dropdownReturn' :onlycity='true' :result='result.province&&result.city?[result.province,result.city]:[]' v-if="key!=='planView'" :reset='reset'></unit-region>
                <transition name="publicTransition"><u class="error" v-if="error.key==='city'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='visitType'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>拜访方式：</span>
                <div v-if="key==='planView'">{{result.visitTypeTxt}}</div>
                <unit-dropdown v-if="key!=='planView'" id="visitType" :list="visitType" @change='dropdownReturn' :result='result.visitType'></unit-dropdown>
                <transition name="publicTransition"><u class="error" v-if="error.key==='visitType'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='planView','errorBorder':error.key==='workContent'}">
                <span class="formTitle"><i class="must" v-if="key!=='planView'">*</i>工作内容：</span>
                <div v-if="key==='planView'" class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.workContent,1))"></div>
                <textarea class="input" v-if="key!=='planView'" v-model="result.workContent" placeholder="" type="text" maxlength="500" @input="clearErr('workContent')"></textarea>
                <transition name="publicTransition"><u class="error" v-if="error.key==='workContent'">{{error.msg}}</u></transition>
            </li>
            <li class="btnBoxLi">
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='loading' :text='btnTxt[key]'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消' v-if="key!=='planView'"></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitCustomer from '@/unit/components/thisUnit/customer'
import unitProject from '@/unit/components/thisUnit/project'
import unitContact from '@/unit/components/thisUnit/contact'
import unitRegion from '@/unit/components/thisUnit/region'
import unitTime from '@/unit/components/element/timeBox'
export default {
    name: 'visitPlanDialog',
    props:['data'],
    components:{unitCustomer,unitProject,unitContact,unitRegion,unitTime},
    data () {
        return{
            key:null,
            planId:null,
            edit:false,
            result:{
                customerId:'',
                projId:'',
                date:'',
                time:'',
                contactId:'',
                position:'',
                province:'',
                city:'',
                visitType:'',
                workContent:'',
            },
            visitType:[],
            contactList:[],
            error:{
                key:null,
                msg:'',
            },
            loading:false,
            reset:false,
            btnTxt:{
                planAdd:'创建',
                planEdit:'确定',
                planView:'确定',
            }
        }
    },
    inject: ['close'],
    filters:{
        emptyTxt(v){
            return v?v:'--'
        }
    },
    methods:{
        emptyTxt(v){
            return v?v:'--'
        },
        getDropData(){
            this.key==='planView'?null:this.$api.public.dict({codeGroup:'visit_type',pCode:''},res=>{
                // console.log(res)
                switch(res.code){
                    case '0':
                        this.visitType=res.data?res.data:[];
                        break;
                }
            });
            if(this.data.item){
                if(this.key==='planEdit'){
                    for(let k in this.result){
                        this.result[k]=this.data.item[k]
                    }
                }else{
                    for(let k in this.data.item){
                        this.result[k]=this.data.item[k]
                    }
                }
            }
        },
        dropdownReturn(res,key,judge){
            // console.log(res,key)
            this.clearErr(key);
            switch(key){
                case 'city':
                    this.result.province=res.ids[0];
                    this.result.city=res.ids[1];
                    this.result.provinceName=res.labels[0];
                    this.result.cityName=res.labels[1];
                    break;
                case 'dateTime':
                    this.result.date=this.$pubfunc.TimeTransform('YYYY/MM/DD',res);
                    this.result.time=this.$pubfunc.TimeTransform('hh:mm',res);
                    break;
                case 'customerId':
                    this.result.customerId=res.value;
                    this.result.customerName=res.label;
                    this.result.signAddress=res.extend.workAddress;
                    this.result.projId='';
                    this.result.contactId='';
                    this.result.position='';
                    this.result.province='';
                    this.result.city='';
                    // this.result.province=res.extend.province;
                    // this.result.city=res.extend.city;
                    // this.result.provinceName=res.extend.provinceName;
                    // this.result.cityName=res.extend.cityName;
                    break;
                case 'contactId':
                    if(res.value){
                        this.result.position=res.position;
                        this.result.contactName=res.label;
                        this.result.province=res.province;
                        this.result.provinceName=res.provinceName;
                        this.result.city=res.city;
                        this.result.cityName=res.cityName;
                        this.result[key]=res.value;
                    }else{
                        this.result.position='';
                    }
                    break
                case 'projId':
                    this.result[key]=res.value;
                    this.result.projName=res.label;
                    break
                case 'visitType':
                    this.result[key]=res.value;
                    this.result.visitTypeTxt=res.label;
                    break
            }
        },
        setErr(key,text){
            this.error.key=key;
            this.error.msg=text;
            return false
        },
        clearErr(key,item){
            if(!key||key===this.error.key){
                this.error.key=null
            }
            if(item){
                item[key]=this.$pubfunc.replacePhone(item[key]);
            }
        },
        submit(){
            if(this.key==='planView'){
                this.close();
                return
            }
            if(this.loading){return}
            this.clearErr();
            if(!this.result.customerId){
                return this.setErr('customerId','请选择客户');
            }
            if(!this.result.date||!this.result.time){
                return this.setErr('dateTime','请选择拜访日期和时间');
            }else{
                let arr=this.data.arr;
                for(let i in arr){
                    if(arr[i].date===this.result.date&&arr[i].time===this.result.time&&(!this.data.item||arr[i].planId!==this.data.item.planId)){
                        return this.setErr('dateTime','相同日期时间的拜访计划已存在，请重新选择');
                    }
                }
            }
            if(!this.result.contactId){
                return this.setErr('contactId','请选择拜访对象');
            }
            if(!this.$pubfunc.replaceSpace(this.result.position,1)){
                return this.setErr('position','请填写拜访对象对应职务');
            }
            if(!this.result.city){
                return this.setErr('city','请选择地区（城市）');
            }
            if(!this.result.visitType){
                return this.setErr('visitType','请选择拜访方式');
            }
            if(!this.$pubfunc.replaceSpace(this.result.workContent,1)){
                return this.setErr('workContent','请填写工作内容');
            }
            let param=JSON.parse(JSON.stringify(this.result))
            if(this.key==='planEdit'){
                param.planId=this.data.item.planId;
            }
            // return
            this.loading=true
            this.$emit('success',{res:param,type:'plan',key:this.key})
        },
    },
    mounted(){
        // console.log(this.data)
        if(!this.data||!this.data.key||(this.data.key==='planAdd'&&!this.data.arr)){
            this.close();
        }
        this.key=this.data.key;
        this.getDropData();
        this.$emit('ok');
    },
}
</script>

<style scoped>
.formMainCont{
    font-size: 0;
}
.formUl{
    display: inline-block;
    width: 100%;
    vertical-align: top;
}
.formUl>li>span.formTitle{
    width: 150px;
}
.formUl>li u.error{
    left: 130px;
    width: 324px!important;
}
.formUl>li>textarea{
    width: 324px;
    height: 82px;
}
.supportRadio{
    line-height: 14px;
    height: 14px;
    vertical-align: top;
    display: inline-block;
    margin-top: 1px;
}
li.radioBox>u.error{
    width: auto!important;
}
</style>
<style>
.planDialog>li>div:not(.btnBox),
.planDialog>li input,
.planDialog>li .el-select,
.planDialog>li .el-cascader{
    width: 324px!important;
    color: #484b5c;
}
.supportRadio>*{
    display: inline-block;
}
.supportRadio .el-radio__original{
    height: 14px;
    display: inline-block;
}
</style>
