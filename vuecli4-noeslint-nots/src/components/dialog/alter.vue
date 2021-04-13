<template>
    <ul class="alterDialog formUl" ref="formUl">
        <li style="padding:0"><unit-loading :loading='loading' v-if="loading"></unit-loading></li>
        <li :class="[dropDown.length>0?'dropDown':'dropDown1']" v-if="data.type==='pass'&&!loading">
            <span class="formTitle">确认通过该审核吗？</span>
        </li>
        <li :class="{'errorBorder':error.key===item.fieldKey}" v-for="(item,i) in dropDown" :key="i">
            <span class="formTitle"><i class="must">*</i>{{item.fieldName}}</span>
            <unit-tree class="form190" :id="item.fieldKey" :list='tree?tree:[]' :choose="result[item.fieldKey]" :must='true' :hid='hideTree' @click='hideOther' placeholder='请选择' @return='dropdownReturn' :hideparent='true' :hidedisable='true'></unit-tree>
            <transition name="publicTransition"><u class="error" v-if="error.key===item.fieldKey">{{error.text}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='suggestion'}" v-if="data.type==='reject'">
            <span class="formTitle"><i class="must">*</i>驳回原因</span>
            <textarea class="input" v-model="result.suggestion" @input='setErr(null)' maxlength="200"></textarea>
            <transition name="publicTransition"><u class="error brErr" v-if="error.key==='suggestion'">{{error.text}}</u></transition>
        </li>
        <li><div class="btnBox" v-if="!loading">
            <unit-btn @click="submit" :loading='ajaxIng' text='确定'></unit-btn>
            <unit-btn type='plain' @click="close" text='取消'></unit-btn>
        </div></li>
    </ul>
</template>

<script>
import unitTree from '@/components/element/tree'
export default {
    name: 'projChange',
    props:['data'],
    components:{unitTree},
    data () {
        return{
            loading:false,
            error:{
                key:null,
                text:'',
            },
            ajaxIng:false,
            tree:null,
            result:{},
            dropDown:[],
            hideTree:false,
        }
    },
    inject: ['close'],
    methods:{
        hideOther(j){this.hideTree=j?j:false},
        getTree(){
            this.$api.public.staffmgnt(res=>{
                // console.log(res)
                switch(res.code){
                    case '0':
                        this.tree=res.data;
                        break;
                }
            })
        },
        dropdownReturn(item,key){
            // console.log(key,this.error.key)
            key===this.error.key?this.setErr(null):null
            let arr=[];
            item.map(v=>{
                arr.push(v.id)
            })
            this.result[key]=arr
            // console.log(this.result[key])
        },
        setErr(key,text){
            // console.log(key)
            this.error.key=key;
            text?this.error.text=text:null;
        },
        submit(){
            if(this.ajaxIng){return}
            let status;
            switch(this.data.type){
                case 'pass':
                    for(let i in this.dropDown){
                        if(this.result[this.dropDown[i].fieldKey].length===0){
                            // console.log(this.dropDown[i].fieldKey,'请选择'+this.dropDown[i].fieldName)
                            this.setErr(this.dropDown[i].fieldKey,'请选择'+this.dropDown[i].fieldName)
                            return;
                        }
                    }
                    status='1';
                    break;
                case 'reject':
                    if(!this.$pubfunc.replaceSpace(this.result.suggestion,1)){
                        this.setErr('suggestion','请输入拒绝原因')
                        return;
                    }
                    status='2';
                    break;
            }
            let info=this.data.info?this.data.info:{}
            let param={
                taskId:this.data.taskId,
                status:status,
            };
            for(let k in this.result){
                // console.log(typeof this.result[k])
                typeof this.result[k]==='string'?param[k]=this.result[k]:(param.businessObj?null:param.businessObj={},param.businessObj[k]=this.result[k].join(','))
            }
            // console.log(param)
            // return;
            this.ajaxIng=true;
            this.$api.user.workflowDotask(param,res=>{
                switch(res.code){
                    case '0':
                        this.$emit('close');
                        this.$emit('success');
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'操作成功',
                            // func:()=>{
                            // }
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
    },
    async mounted(){
        this.loading=true;
        if(this.data.type==='pass'){
            let res=await this.$api.user.workflowTasknode({taskId:this.data.taskId});
            // console.log(res)
            this.dropDown=res.data.fieldList;
            this.dropDown.length===0?this.$emit('width',400):this.dropDown.map(v=>{
                this.$set(this.result,v.fieldKey,[])
            });
            this.getTree(); 
        }else{
            this.$set(this.result,'suggestion','')
        }
        this.$emit('ok');
        this.loading=false;
    },
}
</script>


<style scoped>
.alterDialog{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.alterDialog>li>span{
    width: 100px;
    padding-right: 10px;
    text-align: right;
    box-sizing: border-box;
}
.alterDialog>li>textarea{
    width: 410px;
    height: 90px;
}
.alterDialog>li>div.btnBox{
    padding-top: 24px;
}
u.error.brErr{
    padding-left: 100px;
    margin-bottom: -32px;
    display: block;
}
.alterDialog .dropDown .formTitle,
.alterDialog .dropDown1 .formTitle{
    width: 100%;
    padding:0;
    text-align: left;
    text-indent: 34px;
}
.alterDialog .dropDown1 .formTitle{
    text-align: center;
    text-indent: 0;
}
.alterDialog .dropDown1{
    padding: 30px 0 10px;
}
.newTree.form190{
    width: 260px;
}
</style>
