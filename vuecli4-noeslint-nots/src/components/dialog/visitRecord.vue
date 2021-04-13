<template>
    <div>
        <ul class="formUl recordDialog">
            <li :class="{'small':true}">
                <span class="formTitle">客户名称：</span>
                <div>{{result.customerName|emptyTxt}}</div>
            </li>
            <li :class="{'small':true}">
                <span class="formTitle">项目名称：</span>
                <div>{{result.projName|emptyTxt}}</div>
            </li>
            <li :class="{'small':true}">
                <span class="formTitle">拜访时间：</span>
                <div class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.visitDatetime,1))"></div>
            </li>
            <li :class="{'small':key==='view','errorBorder':error.key==='description'}">
                <span class="formTitle"><i class="must" v-if="key!=='view'">*</i>拜访情况说明：</span>
                <div v-if="key==='view'" class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.description,1))"></div>
                <textarea v-showtit class="input" v-if="key!=='view'" v-model="result.description" placeholder="" type="text" maxlength="1000" @input="clearErr('description')"></textarea>
                <transition name="publicTransition"><u class="error" v-if="error.key==='description'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='view','errorBorder':error.key==='projChanceDesc'}">
                <span class="formTitle">项目机会说明：</span><!--<i class="must" v-if="key!=='view'&&data.projChanceDesc">*</i>*</i>-->
                <div v-if="key==='view'" class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.projChanceDesc,1))"></div>
                <textarea v-showtit class="input" v-if="key!=='view'" v-model="result.projChanceDesc" placeholder="" type="text" maxlength="1000" @input="clearErr('projChanceDesc')"></textarea>
                <transition name="publicTransition"><u class="error" v-if="error.key==='projChanceDesc'">{{error.msg}}</u></transition>
            </li>
            <li :class="{'small':key==='view','errorBorder':error.key==='tecSupportDesc'}">
                <span class="formTitle">技术支持说明：</span><!--<i class="must" v-if="key!=='view'&&data.tecSupportDesc">*</i>-->
                <div v-if="key==='view'" class="bigCont" v-html="emptyTxt($pubfunc.replaceBr(result.tecSupportDesc,1))"></div>
                <textarea v-showtit class="input" v-if="key!=='view'" v-model="result.tecSupportDesc" placeholder="" type="text" maxlength="1000" @input="clearErr('tecSupportDesc')"></textarea>
                <transition name="publicTransition"><u class="error" v-if="error.key==='tecSupportDesc'">{{error.msg}}</u></transition>
            </li>
            <li class="btnBoxLi">
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='loading' text='确定'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消' v-if="key!=='view'"></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitProject from '@/unit/components/thisUnit/project'
export default {
    name: 'visitRecordDialog',
    props:['data'],
    components:{unitProject},
    data () {
        return{
            key:null,
            edit:false,
            result:{
                description:'',
                projChanceDesc:'',
                tecSupportDesc:'',
            },
            error:{
                key:null,
                msg:'',
            },
            loading:false,
            reset:false,
        }
    },
    inject: ['close'],
    filters:{
        emptyTxt(v){
            return v?v:'--'
        }
    },
    directives : {
        showtit:{
            inserted:function(el,binding,vnode){
                setTimeout(()=>{
                    // console.log(el)
                    let w=el.scrollWidth,h=el.scrollHeight,pw=el.offsetWidth,ph=el.offsetHeight;
                    // console.log(w,pw,h,ph,el.value);
                    (w>pw||h>ph)?el.setAttribute('title',el.value):el.removeAttribute('title')
                },0)
            },
            componentUpdated:function(el,binding,vnode){
                setTimeout(()=>{
                    // console.log(el)
                    let w=el.scrollWidth,h=el.scrollHeight,pw=el.offsetWidth,ph=el.offsetHeight;
                    // console.log(w,pw,h,ph);
                    (w>pw||h>ph)?el.setAttribute('title',el.value):el.removeAttribute('title')
                },0)
            },
        }
    },
    methods:{
        emptyTxt(v){
            return v?v:'--'
        },
        getDropData(){
            console.log(this.data.item)
            if(this.data.item){
                if(this.edit){
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
                case 'recordId':
                    this.result[key]=res.value;
                    this.result.projName=res.label;
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
            if(this.key==='view'){
                this.close();
                return
            }
            if(this.loading){return}
            this.clearErr();
            if(!this.$pubfunc.replaceSpace(this.result.description,4)){
                return this.setErr('description','请填写拜访情况说明');
            }
            // if(this.data.projChanceDesc&&!this.$pubfunc.replaceSpace(this.result.projChanceDesc,4)){
            //     return this.setErr('projChanceDesc','请填写项目机会说明');
            // }
            // if(this.data.tecSupportDesc&&!this.$pubfunc.replaceSpace(this.result.tecSupportDesc,4)){
            //     return this.setErr('tecSupportDesc','请填写技术支持说明');
            // }
            let param=JSON.parse(JSON.stringify(this.result))
            if(this.key==='edit'){
                param.recordId=this.data.item.recordId;
            }
            // return
            this.loading=true
            this.$emit('success',{res:param,type:'visit',key:this.key})
        },
    },
    mounted(){
        // console.log(this.data)
        if(!this.data||!this.data.key){
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
    width: 680px!important;
}
.formUl>li>textarea{
    width: 680px;
    height: 122px;
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
.recordDialog>li>div:not(.btnBox),
.recordDialog>li input,
.recordDialog>li .el-select,
.recordDialog>li .el-cascader{
    width: 680px!important;
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
