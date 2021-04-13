<template>
    <div class="eleTree" :class="{'hideparent':hideparent,'hidedisable':hidedisable}">
        <el-scrollbar>
            <el-tree @check='getCheck' :data="list" default-expand-all 
            :show-checkbox="showclick===false?false:true" 
            :check-on-click-node="hideparent||expendclick===false?true:false" 
            :expand-on-click-node="expendclick===false?false:true" 
            :check-strictly="strictly===false?false:true" 
            :node-key="keyid?keyid:'id'" ref="tree" 
            highlight-current 
            :props="{children:'children',label:'label'}"
            :filter-node-method="input||input===''?filterNode:null">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span :class="judgeSpecial(data)">{{ node.label }}</span>
            </span>
            </el-tree>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'ele_Tree1',
    props:['list','id','choose','only','must','hideparent','hidedisable','strictly','keyid','expendclick','showclick','needparent','input','special'],
    data () {
        return{
            show:false,
            result:this.choose?this.getRes(this.list.concat()):[],
        }
    },
    watch:{
        choose:{
            deep:true,
            handler(){
                this.result=this.getRes(this.list.concat());
                // console.log(this.result)
            },
        },
        result:{
            deep:true,
            handler(){
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
                    this.$refs.tree.filter(val);
                }
            },
        },
    },
    methods:{
        getCheck(item,choose){
            // console.log(item,choose,this.$refs.tree.getCheckedNodes(true),choose.checkedKeys.indexOf(item.id)===-1)
            if(this.only){
                this.result=choose.checkedKeys.indexOf(item[this.keyid?this.keyid:'id'])===-1?(this.must?[item]:[]):[item];
                // console.log(this.result)
            }else{
                let arr=this.needparent?this.$refs.tree.getCheckedNodes():this.$refs.tree.getCheckedNodes(true);
                this.result=this.must?(arr.length===0?[item]:arr):arr
            }
            this.$emit('return',this.result,this.id?this.id:null,item);
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
                // console.log(this.choose,v[this.keyid?this.keyid:'id'])
                if(this.choose.indexOf(v[this.keyid?this.keyid:'id'])!==-1){
                    arr.push(v);
                }
                arr=arr.concat(v.children&&v.children.length>0?this.getRes(v.children):[])
            })
            return arr
        },
        filterNode(value, data) {
            // console.log(value,data)
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        judgeSpecial(data){
            if(this.special){
                let special=this.special.split(':');
                if(special.length<2){
                    return ''
                }else{
                    return data[special[0]]===special[1]?'specialEl':''
                }
            }
        },
    },
    mounted(){
        this.choose?(this.result=this.getRes(this.list.concat()),this.$refs.tree.setCheckedKeys(this.returnResult(this.keyid?this.keyid:'id'))):null;
        let dom=document.getElementsByClassName('el-tree-node__label');
        // console.log(dom)
        for(let i=0;i<dom.length;i++){
            dom[i].addEventListener('mouseenter',(e)=>{
                let el=e.target;
                // console.log(el)
                setTimeout(()=>{
                    // let w=el.offsetWidth,h=el.offsetHeight,pw=el.parentNode.offsetWidth,ph=el.parentNode.offsetHeight;
                    // console.log(el.parentNode.clientWidth,el.parentNode.scrollWidth);
                    (el.parentNode.scrollWidth>el.parentNode.clientWidth)?el.setAttribute('title',el.innerHTML):el.removeAttribute('title')
                },0)
            });
        }
    },
}
</script>
