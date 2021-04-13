<template>
    <transition name='publicTransition'>
        <div class="selectId" v-if="value&&show">
            <div class="show">
                <el-scrollbar>
                    <ul v-if="list&&list.length>0">
                        <li v-for="(item,i) in list" :key="i" @click="choose(item)"><unit-popover :content='item.projName'></unit-popover></li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
    </transition>
</template>

<script>
import unitPopover from '@/unit/components/popover'
export default {
    name: 'unitSelect',
    props:['value','focus','blur'],
    components:{unitPopover},
    data () {
        return{
            show:false,
            list:[],
            base:[],
            st:null
        }
    },
    watch:{
        focus(){
            this.getList();
        },
        blur(){
            this.$nextTick(v=>{
                this.show=false;
            })
        },
        value(){
            this.show=true;
            this.selectId();
        },
    },
    methods:{
        getList(){
            this.$api.user.getMyProjectList(res=>{
                switch(res.code){
                    case "0":
                        this.base=(res.data?res.data:[]).concat();
                        this.selectId()
                        break;
                }
            })
        },
        selectId(){
            if(this.value){
                let list=[];
                this.base.map(v=>{
                    v.projName.indexOf(this.value)>-1?list.push(v):null
                })
                list.length>0?this.show=true:null;
                this.list=list;
            }else{
                clearTimeout(this.st);
                this.st=setTimeout(()=>{
                    this.list=[];
                },200)
            }
        },
        choose(item){
            this.$emit('result',item);
            this.list=[];
            this.show=false;
        }
    },
    created(){
        this.getList();
    },
}
</script>


<style scoped>
.selectId{
    position: absolute;
    width: 100%;
    height: 0;
    bottom: 0;
}
.selectId>div{
    position: relative;
    z-index: 1000;
    width: 100%;
    height: auto;
    background-color: #fff;
    box-shadow: 0px 0px 20px 0px rgba(110,139,234,0.25);
    border-top: 0px;
    box-sizing: border-box;
    overflow: hidden;
    opacity: 0;
    transform: scale(0);
    margin-top: 10px;
}
.selectId>div.show{
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.2s linear 0.3s;
}
.selectId>div::before,.selectId>div::after{
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    left: 20%;
    transform: translateX(-50%);
}
.selectId>div::before{
    top: -6px;
    border-bottom: 6px solid #1f2a53;
}
.selectId>div ul{
    padding: 5px 0;
}
.selectId>div ul>li{
    font-size: 14px;
    padding: 0px 12px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 28px;
    height: 28px;
    box-sizing: border-box;
    background-color: transparent;
    transition: background-color .05s linear;
    color: #636781;
    cursor: pointer;
}
.selectId>div ul>li:hover{
    background-color: #ecf5ff;
}
</style>
<style>
.selectId>div>div>.el-scrollbar__wrap{
    max-height: 448px;
}
</style>