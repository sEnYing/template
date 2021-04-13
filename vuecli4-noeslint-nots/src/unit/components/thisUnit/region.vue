<template>
    <div class="newRegin" @click.stop="judgeShow" ref="regin">
        <div class="reginResult el-input__inner" :class="{'is_focus':show}" @mouseenter="changeIcon(false)" @mouseleave="changeIcon(true)"><i v-if="placeholder&&labelShow.length===0">{{placeholder}}</i><unit-popover v-if="labelShow.length>0" :open='show' :left='16' :content='onlycity?(labelShow.length>1?labelShow[1]:""):labelShow.join(" / ")'></unit-popover><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-select__caret el-input__icon el-icon-arrow-up" v-show='!clear||(clear&&(showIcon||(!res||res.length===0)))'></i><i class="el-select__caret el-input__icon el-icon-circle-close" v-if="clear&&(res&&res.length>0&&!showIcon)" @click.stop='clearRes'></i></span></span></div>
        <transition name="el-zoom-in-top">
            <div class="reginBox" v-show="show" ref="reginF">
                <div>
                    <p class="el-select-dropdown__empty" v-if="!list||list.length===0">无数据</p>
                    <el-scrollbar class="unitScrollbar" v-if="list&&list.length>0">
                        <ul class="reginUl">
                            <li :class="{'is-checked':(result?result:res).indexOf(item.value)>-1}" v-for="(item,i) in list" :key='i' @click.stop='clickThis(item,0)'><span class="el-cascader-node__label"><unit-popover :content='item.label'></unit-popover></span><i class="el-icon-arrow-right el-cascader-node__postfix"></i></li>
                        </ul>
                    </el-scrollbar>
                </div>
                <div v-if="res.length>0">
                    <unit-loading :loading='true' v-if="!children"></unit-loading>
                    <p class="el-select-dropdown__empty" v-if="children&&children.length===0">无数据</p>
                    <el-scrollbar class="unitScrollbar" v-if="children&&children.length>0">
                        <ul class="reginUl">
                            <li :class="{'is-checked':(result?result:res).indexOf(item.value)>-1}" v-for="(item,i) in children" :key='i' @click.stop='clickThis(item,1)'><span class="el-cascader-node__label"><unit-popover :content='item.label'></unit-popover></span></li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
export default {
    name: 'ele_Regin',
    props:['id','placeholder','clear','result','reset','must','onlycity'],
    components:{unitPopover},
    data () {
        return{
            input:'',
            showIcon:true,
            show:false,
            children:null,
            res:[],
            label:[],
            labelShow:[],
            list:[],
            city: {
                label:[],
                labelShow:[],
                list:[],
            }
        }
    },
    watch:{
        hid(){
            this.hid!==this.id?this.show=false:null;
        },
        reset(){
            this.clearRes();
        },
        result:{
            deep:true,
            handler(){
                this.res=this.result.concat();
                this.setValue(this.res[1]?this.res[1]:null)
            },
        },
        show(v){
            if(v){
                if(this.result&&this.res.length>0&&this.result.length>0){
                    this.setValue()
                }else{
                    this.setWidth();
                }
            }
        },
    },
    methods:{
        setWidth(){
            this.$nextTick(()=>{
                let w=this.$refs.regin.offsetWidth;
                this.$refs.reginF.style.width=Math.ceil(w/2)*2*(this.res.length>0&&w<300?2:1)+'px';
            })
        },
        setValue(j){
            if(this.res.length>0){
                for(let i in this.list){
                    if(this.list[i].value===this.res[0]){
                        this.res.splice(0,this.res.length,this.result[0]);
                        this.label.splice(0,this.label.length,this.list[i].label);
                        this.getList(this.res[0],j);
                        this.setWidth();
                    }
                }
            }else{
                this.clearRes();
            }
        },
        getList(id,edit){
            let p={},i = 0;
            if(id){
                for(i;i<this.list.length;i++){
                    if(this.list[i].value===id){
                        if(this.list[i].children.length>0){
                            this.children=this.list[i].children.concat();
                            if(edit&&id){
                                for(let k in this.children){
                                    if(this.children[k].value===edit){this.label.splice(1,this.label.length,this.children[k].label);this.labelShow=this.label.concat();return}
                                }
                            }
                            return;
                        }
                        break
                    }
                }
                this.children=null;
            }
            id?p.pCode=id:p.level=10;
            this.$api.public.region(p,res=>{
                switch(res.code){
                    case '0':
                        let list=(res.data.list?res.data.list:[]).map(v=>{
                            if(edit&&id){
                                if(v.value===edit){this.label.splice(1,this.label.length,v.label);this.labelShow=this.label.concat()}
                            }
                            return{
                                value:v.value,
                                label:v.label,
                                leaf:id?true:false,
                                children:id?null:[],
                            }
                        });
                        if(id){
                            this.list[i].children=list.concat();
                            this.children=list.concat()
                        }else{
                            this.list=list;
                            if(this.result&&this.result.length>0){
                                this.res=this.result.concat();
                                this.setValue(this.res[1]?this.res[1]:null)
                            }
                        }
                }
            })
        },
        judgeShow(){
            this.$emit('click',this.id)
            this.show=!this.show;
            this.show&&this.list&&this.list.length>0?this.$nextTick(()=>{
            }):null
        },
        listenClick(){
            this.show?this.show=false:null;
        },
        clearRes(){
            this.listenClick();
            this.res=[];
            this.label=[];
            this.labelShow=[];
            this.$emit('change',{ids:[],labels:{}},this.id?this.id:null);
        },
        clickThis(item,i){
            i?(
                    this.label.splice(1,this.label.length,item.label),
                    this.res.splice(1,this.res.length,item.value),
                    this.$emit('change',{ids:this.res.concat(),labels:this.label},this.id?this.id:null),
                    this.labelShow=this.label.concat(),
                    this.judgeShow()
                ):(
                    this.res.splice(0,this.res.length,item.value),
                    this.label.splice(0,this.label.length,item.label),
                    this.getList(this.res[0]),
                    this.setWidth(),
                    (this.must?null:(this.$emit('change',{ids:this.res.concat(),labels:this.label},this.id?this.id:null),this.labelShow=this.label.concat()))
                );
        },
        changeIcon(j){this.clear?this.showIcon=j:null;},
    },
    mounted(){
        this.getList(0);
        window.addEventListener('click',this.listenClick);
    },
    destroyed(){
        window.removeEventListener('click',this.listenClick);
    },
}
</script>


<style scoped>
.newRegin{
    width: 230px;
    height: 32px;
    position: relative;
}
.newRegin>.reginResult{
    cursor: pointer;
    padding-right: 30px;
    position: relative;
    font-size: 14px;
    /* white-space: nowrap; */
}
.newRegin>.reginResult>i{
    color: #c0c4cc; 
    line-height: 30px;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
}
.reginResult.is_focus{
    border-color: #8fb4fc;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
.newRegin>.reginResult>div{
    display: block;
    float: left;
    width: 100%;
    line-height: 30px;
}
.newRegin>.reginResult>span i.el-icon-arrow-up{
    opacity: 0.6;
    transition: opacity 0.2s ease;
}
.newRegin>.reginResult>span i.el-icon-arrow-up::before{
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../../assets/images/loginIcon.png') -1px -120px no-repeat;
}
.reginResult.is_focus>span i.el-icon-arrow-up,
.newRegin>.reginResult:hover>span i.el-icon-arrow-up{
    opacity: 1;
}
.newRegin>.reginResult>span i.el-icon-circle-close{
    line-height: 31px;
    width: 20px;
}
.reginBox{
    position: absolute;
    width: 100%;
    border: 1px solid #8fb4fc;
    border-radius: 2px;
    background-color: #FFF;
    /* -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
    /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* margin: 12px 0; */
    margin-top: -1px;
    top: 100%;
    z-index: 11;
    height: 189px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    white-space: nowrap;
    font-size: 0;
    z-index: 111;
}
.form190 .reginBox{
    max-width: 190%;
}
.reginBox>.el-select-dropdown__empty{
    line-height: 3;
}
/* .reginBox::before{
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
.reginBox::after {
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
.reginBox>div{
    position: relative;
    width: 50%;
    height: 100%;
    border-radius: 2px;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    box-sizing: border-box;
}
.reginBox>div:nth-child(1){
    border-right: 1px solid #E4E7ED;
}
.reginBox>div:only-child{
    width: 100%;
    border-right: 0;
}
.reginUl{
    position: relative;
    min-height: 100%;
    margin: 0;
    padding: 6px 0;
    list-style: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.reginUl>li{
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 30px 0 12px;
    height: 34px;
    line-height: 34px;
    outline: 0;
    cursor: pointer;
}
.reginBox>div:nth-child(2) .reginUl>li{
    padding-right: 12px;
}
.reginUl>li.is-checked{
    color: #4780F4;
}
.reginUl>li:hover{
    background: #F5F7FA;
}
</style>
