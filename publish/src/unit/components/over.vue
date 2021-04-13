<template>
    <div class="titleText" ref='content'>
        <div class="slot" ref="slot" v-if="!ok"><slot></slot></div>
        <div ref="div" :style="{maxHeight:lineHeight?(lineHeight*(Number(lines)?Number(lines):1)+'px'):null,lineHeight:lineHeight?(lineHeight+'px'):null}">
            <span ref="span" :class="{hidden:!ok}" v-html='judgeTxt(text)'></span>
        </div>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'over',
    props:['lines','content','show','empty','tiny','reset'],
    data () {
        return{
            text:null,
            lineHeight:null,
            ok:false,
            titIn:false,
            judgeIn:false,
            judgeOut:false,
            titleEl:null,
            titleTxt:'',
            classname:'',
            showtime:null,
            tittime:null,
            leavetime1:null,
            leavetime2:null,
        }
    },
    watch:{
        'content':{
            deep:true,
            handler(v){
                this.getContent();
            }
        },
        reset(v){
            v?this.getContent():null;
        }
    },
    methods:{
        judgeTxt(v){return v||v===0?v:(this.empty===undefined?'-':this.empty)},
        getContent(){
            this.classname&&document.getElementsByClassName('titleTit '+this.classname).length>0?document.getElementsByClassName('titleTit '+this.classname)[0].remove():null;
            let content=this.$refs.content,div=this.$refs.div,span=this.$refs.span,slot=this.$refs.slot;
            span.style.whiteSpace='nowrap';
            this.text='';
            this.lineHeight=span.clientHeight;
            span.style.whiteSpace=null;
            let text=this.content?this.content:(slot?slot.innerHTML:'');
            text=text?text.toString():'';
            this.text=text;
            this.titleTxt=text.replace(/\r\n/g,"<br/>").replace(/\n/g,"<br/>").replace(/\r/g,"<br/>");
            this.ok=true;
            // this.setTitle(div)
            // return;
            this.$nextTick(()=>{
                let w=div.clientWidth,h=div.clientHeight,sw=div.scrollWidth,sh=div.scrollHeight-(this.tiny?this.tiny:0);
                // console.log(this.$refs)
                // console.log(w,sw,h,sh);
                if(w<sw||h<sh){
                    for(let i = 0; i < text.length; i++){
                        div.getElementsByTagName('span')[0].innerHTML = text.substr(0, i+1);
                        div.getElementsByTagName('span')[0].innerHTML = div.getElementsByTagName('span')[0].innerHTML + '<i>...</i>';
                        w=div.offsetWidth,h=div.offsetHeight,sw=div.scrollWidth,sh=div.scrollHeight-(this.tiny?this.tiny:0);
                        // console.log(w,sw,h,sh);
                        if(w<sw||h<sh){
                            div.getElementsByTagName('span')[0].innerHTML = text.substr(0, i);
                            this.text = div.getElementsByTagName('span')[0].innerHTML + '<i>...</i>';
                            this.setTitle(div)
                            break;
                        }
                    }
                }else if(this.show){
                    this.setTitle(div);
                }
            })
        },
        setTitle(div){
            let titleDiv=document.createElement('div');
            this.classname?null:this.classname='titleTit'+(new Date()).valueOf()+Math.floor(Math.random()*1000000);
            // console.log(this.classname)
            titleDiv.setAttribute('class','titleTit '+this.classname);
            titleDiv.innerHTML="<div><span>"+this.titleTxt+'</span></div><i class="titleIcon"></i>';
            document.body.appendChild(titleDiv);
            // console.log(titleDiv)
            this.titleEl=document.getElementsByClassName(this.classname)[0];
            let e2=()=>{
                if(this.judgeOut){return}
                clearTimeout(this.tittime);
                this.titIn=true;
                this.tittime=setTimeout(()=>{
                    this.titIn=false;
                },100);
            }
            let l1=(e)=>{
                this.titleEl.classList.remove('title-hover');
                clearTimeout(this.showtime);
                this.judgeIn=false;
                clearTimeout(this.leavetime1);
                clearTimeout(this.leavetime2);
                this.leavetime=setTimeout(()=>{
                    if(this.titIn||this.titleEl.getElementsByClassName('light').length>0){return}
                    this.judgeOut=true;
                    this.titleEl.classList.remove('show');
                    clearTimeout(this.leavetime2);
                    this.leavetime2=setTimeout(()=>{
                        this.judgeOut=false;
                    },150)
                },100)
            }
            let e1=(e)=>{
                this.titleEl.classList.add('title-hover')
                this.showtime=setTimeout(()=>{
                    if(this.judgeIn){return}
                    this.showTit(e);
                },500)
            }
            titleDiv.removeEventListener('mouseenter',e2);
            titleDiv.removeEventListener('mouseleave',l1);
            titleDiv.addEventListener('mouseenter',e2);
            titleDiv.addEventListener('mouseleave',l1);
            div.removeEventListener('mouseenter',e1);
            div.removeEventListener('mouseleave',l1);
            div.addEventListener('mouseenter',e1);
            div.addEventListener('mouseleave',l1);
        },
        showTit(e){
            this.judgeOut=false;
            if(this.titleEl.className.indexOf('title-hover')===-1){
                return;
            }
            this.judgeIn=true;
            this.titleEl.removeAttribute('style')
            this.titleEl.innerHTML="<div><span>"+this.titleTxt+'</span></div><i class="titleIcon"></i>';
            // console.log(e,this.titleEl.getElementsByTagName('div')[0].scrollHeight,this.titleEl.getElementsByTagName('div')[0].offsetHeight,Number(this.getClientRect(e.srcElement).top))
            this.titleEl.style.left=this.getClientRect(e.srcElement).left+'px';
            this.titleEl.style.maxWidth=Number(window.innerWidth-this.getClientRect(e.srcElement).left-20)+'px';
            this.$nextTick(()=>{
                let spanEl=this.titleEl.getElementsByTagName('span')[0];
                spanEl.removeAttribute('style');
                // console.log(this.titleEl,this.titleEl.offsetHeight,Number(this.getClientRect(e.srcElement).top-30))
                if(this.titleEl.offsetHeight>Number(this.getClientRect(e.srcElement).top-30)){
                    this.titleEl.style.top='20px';
                    this.titleEl.style.transform='translate(0,0)';
                    this.titleEl.style.height=Number(this.getClientRect(e.srcElement).top-30)+'px';// console.log(this.titleEl.getElementsByTagName('div')[0].clientWidth,this.titleEl.getElementsByTagName('div')[0].offsetWidth,this.titleEl.getElementsByTagName('div')[0].scrollWidth,this.titleEl.getElementsByTagName('div'))
                    spanEl.style.width=(this.titleEl.getElementsByTagName('div')[0].clientWidth<Number(window.innerWidth-this.getClientRect(e.srcElement).left-20)?(this.titleEl.getElementsByTagName('div')[0].clientWidth+20):Number(window.innerWidth-this.getClientRect(e.srcElement).left-40))+'px';
                    spanEl.style.height=this.titleEl.getElementsByTagName('div')[0].clientHeight+'px';
                    let icon=document.createElement('i');
                    icon.style.height=spanEl.clientHeight*100/(spanEl.scrollHeight+16)+'%';
                    spanEl.appendChild(icon);
                    let scrollL=function(e){
                        e = e || window.event || arguments[0];
                        icon.style.marginTop=(e.target.scrollTop*spanEl.clientHeight)/(spanEl.scrollHeight+16)+'px';
                    }
                    spanEl.addEventListener('scroll',scrollL);
                    icon.addEventListener("mousedown",(ed)=>{
                        icon.classList.add('light');
                        let getStartY = ed.pageY,st=spanEl.scrollTop;
                        let listenMove=function(em){
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            let getEndY = em.pageY;
                            let getMove=getEndY-getStartY;
                            let move=getMove*(spanEl.scrollHeight+16)/spanEl.clientHeight;
                            move=st+move;
                            move<0?(move=0,getStartY=getEndY,st=0):null;
                            move>(spanEl.scrollHeight-spanEl.clientHeight)?(move=spanEl.scrollHeight-spanEl.clientHeight,getStartY=getEndY-move*spanEl.clientHeight/(spanEl.scrollHeight+16)):null;
                            spanEl.scrollTop=move
                        };
                        document.addEventListener("mousemove",listenMove);
                        document.addEventListener("mouseup",function(e){
                            icon.classList.remove('light');
                            document.removeEventListener("mousemove",listenMove);
                        });
                    });
                }else{
                    this.titleEl.style.top=Number(this.getClientRect(e.srcElement).top-10)+'px';
                    this.titleEl.style.transform=null;
                    this.titleEl.style.height=null;
                }
                let els=document.getElementsByClassName('titleTit');
                // console.log(els)
                for(let i=0 ;i<els.length;i++){
                    els[i].className.indexOf(this.classname)===-1?els[i].classList.remove('show'):this.$nextTick(this.titleEl.classList.add('show'));
                }
            })
        },
        // 获取el位置
        getClientRect(element){
            var bcr;
            //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
            try{
                bcr = element.getBoundingClientRect();
            }catch(e){
                bcr={left:0,top:0,height:0,width:0}
            }
            var rect = {
                left: Math.round(bcr.left),
                top: Math.round(bcr.top),
                height: Math.round(bcr.bottom - bcr.top),
                width: Math.round(bcr.right - bcr.left)
            };
            var doc;
            while ((doc = element.ownerDocument) !== document &&
                (element = this.getWindow(doc).frameElement)) {
                bcr = element.getBoundingClientRect();
                rect.left += bcr.left;
                rect.top += bcr.top;
            }
            rect.bottom = rect.top + rect.height;
            rect.right = rect.left + rect.width;
            return rect;
        },
        getWindow(node) {
            var doc = node.ownerDocument || node;
            return doc.defaultView || doc.parentWindow;
        }
    },
    mounted(){
        this.getContent();
    },
    destroyed(){
        let els=document.getElementsByClassName('titleTit');
        // console.log(els)
        for(let i=0 ;i<els.length;i++){
            els[i].remove();
        }
    },
}
</script>


<style scoped>
.titleText{
    height: auto;
    position: relative;
}
.titleText>div{
    white-space: normal;
    word-break:break-all;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
}
.titleText>div>*{
    display: inline-block;
    vertical-align: top;
}
.titleText>div>.hidden{
    opacity: 0;
}
</style>
<style>
.titleText>div i{
    font-style: normal;
}
.titleTit{
    background: #000000;
    border-radius: 6px;
    color: #fff;
    width: auto;
    height: auto;
    line-height: 18px;
    font-size: 12px;
    position: absolute;
    z-index: -1;
    max-width: 800px;
    /* min-width: 200px; */
    transform: translate(0,-100%);
    padding: 8px 10px;
    box-sizing: border-box;
    overflow: visible;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    top: -190%;
    max-height: 100%;
    transition: all 0s linear 0.1s,opacity 0.1s ease-in-out 0s;
}
.titleTit.show{
    opacity: 1;
    z-index: 111111;
    transition: all 0s linear 0s,opacity 0.15s ease-in-out 0.1s;
}
.titleTit>div{
    max-height: 100%;
    overflow: hidden;
}
.titleTit>div>span{
    max-height: 100%;
    padding-right: 20px;
    margin-right: -20px;
    overflow-x: hidden;
    overflow-y: auto;
    display: block;
    box-sizing: content-box;
}
.titleTit>div>span>i{
    display: block;
    position: absolute;
    top: 8px;
    right: 4px;
    width: 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.18);
    transition: background-color 0.1s ease;
    cursor: pointer;
}
.titleTit>div>span>i:hover,
.titleTit>div>span>i.light{
    background-color: rgba(255, 255, 255, 0.3);
}
.titleTit>i.titleIcon{
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    border-top-color: #000000;
    bottom: -12px;
}
.titleTit.rightTit>i.titleIcon{
    border-top-color: transparent;
    border-right-color: #000000;
    left: -12px;
    bottom: auto;
}
</style>