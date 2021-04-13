<template>
    <div>
        <ul class="formUl roleDialog">
            <li :class="{'errorBorder':error}">
                <span class="formTitle"><i class="must">*</i>角色名称：</span>
                <input type="text" v-model="name" maxlength="20" @input="inputChange('name')" placeholder="请输入角色名称" ref='input'>
                <transition name="publicTransition"><u class="error error1" v-if="error">{{error}}</u></transition>
            </li>
            <li>
                <span class="formTitle">权限：</span>
                <div class="treeChoose input">
                    <unit-loading :loading='!list' v-if="!list"></unit-loading>
                    <unit-tree v-if="list" id="resources" :list='list' :choose="resources" :hideparent='false' :needparent='true' :expendclick="false" @return='dropdownReturn' keyid="resId" special='resourceType:1'></unit-tree>
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
import unitTree from '@/unit/components/element/treeBox'
export default {
    name: 'roleAdd',
    props:['data'],
    components:{unitTree},
    data () {
        return{
            ajaxIng:false,
            list:null,
            id:'',
            name:'',
            resources:[],
            error:'',
        }
    },
    inject: ['close'],
    methods:{
        inputChange(type){
            switch(type){
                case 'name':
                    this.name=this.$pubfunc.replaceSpace(this.name,1);
                    this.error=''
                    break;
            }
        },
        dropdownReturn(list,key){
            console.log(list,key,this.resources)
            switch(key){
                case 'resources':
                    let listJson={},listn=[],listo=this.resources.concat();
                    let addChild = function (json) {
                        if(json.children&&json.children.length>0){
                            json.children.map(v=>{
                                listn.indexOf(v.resId)===-1?listn.push(v.resId):null;
                                addChild(v)
                            })
                        }
                    }
                    list.map(v=>{
                        listJson[v.resId]=v
                        listn.push(v.resId);
                    })
                    // 删除子
                    listo.map(v=>{
                        if(listn.indexOf(v)===-1){
                            for(let i=0;i<listn.length;i++){
                                if(listn[i].indexOf(v)===0){
                                    listn.splice(i,1);
                                    i--
                                }
                            }
                        }
                    })
                    // 添加
                    listn.map(v=>{
                        if(listo.indexOf(v)===-1){
                            // 添加父级
                            let parentArr=v.split('-');
                            if(parentArr.length>0){
                                let parentA=[];
                                for(let i in parentArr){
                                    parentA.push(parentArr[i]);
                                    let parent=parentA.join('-');
                                    // console.log('添加:',parent)
                                    listn.indexOf(parent)===-1?listn.push(parent):null;
                                }
                            }
                            // 添加子集
                            addChild(listJson[v])
                        }
                    })
                    // console.log(listn)
                    this.resources=listn;
                    break;
            }
        },
        submit(){
            if(this.ajaxIng||this.error){return;}
            if(!this.name){
                this.error='角色名称不可为空';
                return
            }
            let judge=this.data&&this.id&&this.name;
            this.ajaxIng=true;
            this.$api.bgmgnt.role[judge?'update':'add'](judge?{roleName:this.name,roleId:this.id,resources:this.resources}:{roleName:this.name,resources:this.resources},res=>{
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
        }
    },
    created(){
        this.$api.bgmgnt.role.resourcetreelist(res=>{
            switch(res.code){
                case '0':
                    this.list=res.data.concat();
                    break;
            }
        })
        this.data&&this.data.roleId?this.$api.bgmgnt.role.roleDetail({roleId:this.data.roleId},res=>{
            switch(res.code){
                case '0':
                    this.resources=res.data.resources.concat();
                    break;
            }
        }):null
    },
    mounted(){
        this.data?(this.data.roleName?this.name=this.data.roleName:null,this.data.roleId?this.id=this.data.roleId:null):null
        this.$emit('ok');
        this.$nextTick(()=>{
            this.$refs.input?this.$refs.input.focus():null;
        })
    } 
}
</script>


<style scoped>
.roleDialog{
    width: 100%;
    padding: 4px 35px 0;
    box-sizing: border-box;
    font-size: 0;
}
.roleDialog .formTitle{
    width: 108px;
}
.roleDialog>li{
    padding-top: 5px;
}
.roleDialog>li:nth-child(1){
    padding-top: 16px;
}
.roleDialog>li>input{
    width: 324px;
}
.roleDialog>li>div.btnBox{
    padding-top: 8px;
}
.roleDialog>li>u.error{
    display: block;
    padding-left: 108px;
    margin-bottom: -24px;
    line-height: 24px;
    bottom: 18px;
    left: 113px;
}
.treeChoose{
    width: 324px;
    height: 350px;
    padding: 0;
    overflow: hidden;
    position: relative;
}
</style>
<style>
.roleDialog .treeChoose .el-scrollbar__wrap{
    overflow-x: hidden;
    margin-bottom: 0;
    padding: 0;
}
.roleDialog .treeChoose .specialEl{
    font-weight: bold;
    color: #555555;
}
</style>