<template>
    <div class="newTree" @click.stop>
        <el-popover
            popper-class="treeBox"
            placement="bottom-start"
            transition='el-zoom-in-top'
            trigger="manual"
            v-model="show"
            :offset='0'
            :width='width'>
            <div ref="treeF" @click='judgeShow(true)' slot="reference" class="treeResult el-input__inner" :class="{'is_focus':show}" @mouseenter="changeIcon(false)" @mouseleave="changeIcon(true)"><i v-if="placeholder&&result.length===0">{{placeholder}}</i><unit-popover :open='show' :left='16' :content='returnResult("label").join("/")'></unit-popover><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-select__caret el-input__icon el-icon-arrow-up" v-show='!clear||(clear&&(showIcon||result.length===0))'></i><i class="el-select__caret el-input__icon el-icon-circle-close" v-if="clear&&(result.length>0&&!showIcon)" @click.stop='clearRes'></i></span></span></div>
            <input type="text" v-model="input" @click='judgeShow' placeholder="筛选" v-if="list&&list.length>0">
            <p class="el-select-dropdown__empty" v-if="!list||list.length===0">无数据</p>
            <el-scrollbar v-if="list&&list.length>0">
                <el-tree @check='getCheck' :data="list" show-checkbox default-expand-all 
                :check-on-click-node="hideparent||expendclick===false?true:false" 
                :expand-on-click-node="expendclick===false?false:true" 
                :check-strictly="true" 
                :node-key="keyid?keyid:'id'" 
                :props="{children:'children',label:'label'}"
                :filter-node-method="filterNode"
                ref="tree" highlight-current 
                ></el-tree>
            </el-scrollbar>
        </el-popover>
        <!-- <transition name="el-zoom-in-top">
            <div class="treeBox" v-show="show" :class="{'hideparent':hideparent,'hidedisable':hidedisable}" ref="treeF">
                <input type="text" v-model="input" @click.stop placeholder="筛选" v-if="list&&list.length>0">
                <p class="el-select-dropdown__empty" v-if="!list||list.length===0">无数据</p>
                <el-scrollbar v-if="list&&list.length>0">
                    <el-tree @check='getCheck' :data="list" show-checkbox default-expand-all 
                    :check-on-click-node="hideparent||expendclick===false?true:false" 
                    :expand-on-click-node="expendclick===false?false:true" 
                    :check-strictly="true" 
                    :node-key="keyid?keyid:'id'" 
                    :props="{children:'children',label:'label'}"
                    :filter-node-method="filterNode"
                    ref="tree" highlight-current 
                    ></el-tree>
                </el-scrollbar>
            </div>
        </transition> -->
    </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
export default {
    name: 'ele_Tree',
    props:['list','id','placeholder','choose','hid','only','hideparent','hidedisable','clear','keyid','expendclick','must'],
    components:{unitPopover},
    data () {
        return{
            input:'',
            showIcon:true,
            show:false,
            width:324,
            result:this.choose?this.getRes(this.list.concat()):[],
        }
    },
    watch:{
        hid(v){
            v!==this.id?this.show=false:null;
        },
        choose:{
            deep:true,
            handler(){
                this.result=this.getRes(this.list.concat());
            },
        },
        result:{
            deep:true,
            handler(){
                // console.log(this.result,this.returnResult("id"))
                // console.log(this.result,this.returnResult(this.keyid?this.keyid:'id'))
                this.$refs.tree?this.$refs.tree.setCheckedKeys(this.returnResult(this.keyid?this.keyid:'id')):null
            },
        },
        list:{
            deep:true,
            handler(){
                this.result=this.getRes(this.list.concat());
            },
        },
        input:{
            deep:true,
            handler(val){
                if(val||val===''){
                    // console.log(val)
                    this.$refs.tree?this.$refs.tree.filter(val):null;
                }
            },
        },
        show(v){
            if(v){
                this.input='';
                let w=this.$refs.treeF.offsetWidth;
                this.width=Math.ceil(w/2)*2;
            }
        },
    },
    methods:{
        judgeShow(j){
            this.$emit('click',this.id)
            this.show=j===true?!this.show:true;
            // console.log(this.show)
            this.show&&this.list&&this.list.length>0?this.$nextTick(()=>{
                // console.log(this.result,this.returnResult("id"))
                this.$refs.tree.setCheckedKeys(this.returnResult(this.keyid?this.keyid:'id'));
            }):null
        },
        listenClick(){
            this.show?this.show=false:null;
        },
        clearRes(){
            this.result=[];
            this.listenClick();
            this.$emit('return',this.result,this.id?this.id:null);
        },
        getCheck(item,choose){
            // console.log(item,choose,this.$refs.tree.getCheckedNodes(true))
            if(this.only){
                this.result=choose.checkedKeys.indexOf(item[this.keyid?this.keyid:'id'])===-1?(this.must?[item]:[]):[item];
                this.judgeShow();
            }else{
                let arr=this.$refs.tree.getCheckedNodes(true);
                this.result=this.must?(arr.length===0?[item]:arr):arr
            }
            this.$emit('return',this.result,this.id?this.id:null);
        },
        returnResult(k){
            let label=[];
            this.result.map(v=>{
                label.push(v[k]);
            })
            return label
        },
        getRes(list){
            let arr=[];
            list.map(v=>{
                if(this.choose.indexOf(v[this.keyid?this.keyid:'id'])!==-1){
                    arr.push(v);
                }
                arr=arr.concat(v.children&&v.children.length>0?this.getRes(v.children):[])
            })
            return arr
        },
        changeIcon(j){this.clear?this.showIcon=j:null;},
        filterNode(value, data) {
            // console.log(value,data)
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
    },
    mounted(){
        this.choose?this.result=this.getRes(this.list.concat()):null;
        window.addEventListener('click',this.listenClick);
    },
    destroyed(){
        window.removeEventListener('click',this.listenClick);
    },
}
</script>


<style scoped>
.newTree{
    width: 324px;
    height: 32px;
    position: relative;
}
.newTree.auto{
    width: 100%;
}
.newTree .treeResult{
    cursor: pointer;
    padding-right: 30px;
    position: relative;
    /* white-space: nowrap; */
}
.newTree .treeResult>i{
    color: #c0c4cc; 
    line-height: 30px;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
}
.newTree .treeResult>div{
    display: block;
    float: left;
    width: 100%;
    line-height: 30px;
}
.newTree .treeResult:not(.is_focus)>span i{
    transform: rotateZ(180deg);
}
.newTree.auto>.treeBox{
    width: 100%!important;
}
/* .treeBox::before{
    position: absolute;
    display: block;
    content: " ";
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
    top: -6px;
    left: 35px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #EBEEF5;
}
.treeBox::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    content: "";
    border-width: 6px;
    top: -5px;
    left: 35px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #FFF;
} */
.el-select__caret.el-input__icon.el-icon-arrow-up::before{
    content: '';
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #95a0bd;
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
}
.newTree .treeResult:not(.is_focus)>span i{
    transition: opacity 0.2s ease,transform 0.2s ease,-webkit-transform 0.2s ease;
    opacity: 0.6;
    line-height: 32px;
    vertical-align: top;
}
</style>
<style>
.treeBox{
    /* position: absolute; */
    border: 1px solid #8fb4fc;
    box-shadow: none;
    /* border: 1px solid #E4E7ED; */
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    /* border-radius: 2px; */
    background-color: #FFF;
    /* -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
    /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* margin: 12px 0; */
    padding: 0;
    z-index: 11;
    margin-top: -1px;
}
.treeBox .el-scrollbar__wrap{
    max-height: 200px;
}
.treeResult.is_focus{
    border-color: #8fb4fc;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}
.form190 .treeBox{
    max-width: 190%;
}
.treeBox>.el-select-dropdown__empty{
    line-height: 1;
}
.treeBox .el-tree__empty-block{
    padding: 10px 0;
    height: 60px;
    line-height: 40px;
    margin: 0;
    text-align: center;
}
.treeBox .el-tree__empty-block>.el-tree__empty-text{
    color: #999;
    font-size: 14px;
    top: 40%;
}
.treeBox>div{
    position: relative;
    width: 100%;
    border-radius: 2px;
}
.treeBox>input{
    width: 96%;
    height: 30px;
    margin: 6px 2% 4px;
    border-color: #dcdfe6;
}
.treeBox .el-checkbox{
    margin-right: 6px;
}
</style>