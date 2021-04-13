<template>
    <ul :class="[type?type:'']" @mousedown="mousedown" ref='ul' :style="{left:left+'px'}">
        <li :style='{zIndex:tab.list?(tab.list.length-index):0,textAlign:btn?"left":"middle"}' :class="{'checked':tab.choose===item.id}" v-for="(item,index) in tab.list" :key="'tab'+index" @mousedown="could(true)" @click.stop="click(item,null,$event)">{{item.name}}<button type="button" v-if="btn" @click.stop="click(item,'btn',$event)"><i @click.stop='click1($event)'></i><span @click.stop='click1($event)'>{{btn}}</span></button></li>
    </ul>
</template>

<script>
export default {
    name: 'unitTab',
    props:['tab','type','btn'],
    data () {
        return{
            left:0,
            couldClick:true,
            st:null
        }
    },
    watch: {
        'tab.list':{
            deep:true,
            handler(){
                this.left=0;
            }
        }
    },
    methods:{
        could(j){
            // console.log(j)
            this.couldClick=j;
        },
        click1(event){
            if(!event){return}
            let el=event.target;
            el=el.parentNode;
            el.click();
        },
        click(item,key,event){
            if(!this.couldClick){return;}
            this.$emit('click',(key?key:'tab'),item.id);
            if(!event){return}
            let ref=this.$refs.ul;
            let parent=ref.parentNode;
            let diff=parent.clientWidth-ref.clientWidth;
            if(diff>=0){return;}
            let el=event.target;
            key?el=el.parentNode:null;
            // console.log(event)
            let elAll=el.offsetWidth+el.offsetLeft,nowAll=parent.clientWidth-this.left
            // console.log(elAll,nowAll)
            this.$refs.ul.style.transition='left 0.2s ease';
            this.$nextTick(()=>{
                elAll>nowAll-1?this.left=-((el.offsetLeft+parent.clientWidth)<ref.clientWidth?el.offsetLeft:(ref.clientWidth-parent.clientWidth)):null;
                el.offsetLeft<-this.left-1?this.left=-el.offsetLeft:null;
                clearTimeout(this.st);
                this.st=setTimeout(()=>{
                    this.$refs.ul.style.transition=null;
                },201)
            })
            // el.offsetWidth+el.offsetLeft>parent.clientWidth-this.left-1?
        },
        mousedown(el){
            let ref=this.$refs.ul;
            let parent=ref.parentNode;
            let diff=parent.clientWidth-ref.clientWidth;
            if(diff>=0){return;}
            let getStartX = el.pageX;
            let left=this.left;
            let listenMove = (e)=>{
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                let getEndX = e.pageX;
                let getMove=getEndX-getStartX;
                // console.log(getMove)
                getMove?this.could(false):null;
                let move=left+getMove;
                move>0?(getStartX=getEndX+left):null;
                move<diff?(getStartX=getEndX+left-diff):null;
                this.left=move>0?0:(move<(diff)?(diff):move);
                // console.log(this.left)
            };
            document.addEventListener("mousemove",listenMove);
            document.addEventListener("mouseup",function(e){
                document.removeEventListener("mousemove",listenMove);
            });
        },
    }
}
</script>


<style scoped>
ul{
    position: relative;
    z-index: 1;
    padding: 3px 0;
}
ul::before{
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    border-bottom: 1px solid #E0E0E0;
}
ul>li{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: #484B5C;
    line-height: 1;
    box-sizing: border-box;
    min-width: 60px;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s linear;
    position: relative;
    padding: 10px 5px 6px;
    margin-left: 30px;
}
ul>li:nth-child(1){
    margin-left: 10px;
}
ul>li:hover,ul>li.checked{
    color: #1560F7;
}
ul>li::before{
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 0px;
    opacity: 0;
    background-color: #1560F7;
    /* background:linear-gradient(-90deg,rgba(0,132,254,1) 0%,rgba(0,194,255,1) 100%); */
    transition: all 0.2s linear;
}
ul>li.checked::before{
    opacity: 1;
    height: 3px;
}
ul.top{
    height: 42px;
    padding: 0;
    position: absolute;
    top: -42px;
    /* width: 100%; */
    white-space: nowrap;
}
ul.top.small{
    height: 34px;
    top: -34px;
}
ul.top::before{
    content: '';
    display: block;
    position: absolute;
    height: 10px;
    box-shadow: 0px -4px 20px 0px rgba(110,139,234,0.2);
    z-index: 98;
    border-bottom: 0;
    background-color:transparent;
    border-radius: 6px;
}
ul.top>li{
    min-width: 116px;
    height: 42px;
    line-height: 42px;
    padding: 0px 24px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f1f4fb;
    color: #7f879d;
    font-size: 14px;
    z-index: 1;
    box-shadow: 2px -2px 20px 0px rgba(110,139,234,0.2);
    transition: all 0.2s linear;
    padding-bottom: 10px;
    box-sizing: content-box;
}
ul.top.small>li{
    height: 34px;
    line-height: 34px;
}
ul.top>li.checked{
    background-color: #fff;
    color:#4C4F61;
    z-index: 99!important;
}
ul.top>li.checked::before{
    opacity: 0;
    height: 0px;
}
ul.top>li>button{
    display: inline-block;
    margin: 0 -5px 0 15px;
    padding: 2px 5px;
    line-height: 16px;
    background-color: transparent;
    border: 0;
    color: #409EFF;
    transition: all 0.15s linear;
    font-size: 12px;
}
ul.top>li>button>*{
    display: inline-block;
    vertical-align: top;
}
ul.top>li>button>i{
    width: 16px;
    height: 16px;
    margin-right: 2px;
    position: relative;
    background: url("../../assets/images/icon.png") -15px -177px no-repeat;
    transition: all 0.15s linear;
    opacity: 1;
}
ul.top>li>button:hover{
    color: #66b1ff;
}
ul.top>li>button:hover>i{
    opacity: 0.8;
}
</style>
