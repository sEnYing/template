<template>
<!--  :time-arrow-control='true' -->
    <el-date-picker
    @click.native='click' 
    :picker-options="{'firstDayOfWeek': 1}" 
    :format="time?'yyyy/MM/dd HH:mm':'yyyy/MM/dd'" 
    class="elTimebox" :class="{'noClose':!clear}" 
    v-model="res" :type="time?'datetimerange':'daterange'" 
    range-separator="至" 
    :start-placeholder="'开始'+(time?'时间':'日期')" 
    :end-placeholder="'结束'+(time?'时间':'日期')" 
    :default-time="['08:30:00', '17:30:00']"
    @change='timeChange' 
    :clearable='clear?true:false' 
    :disabled='disabled?true:false' 
    size='small'></el-date-picker>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_TimeRange',
    props:['value','clear','id','time','disabled','reset'],
    data () {
        return{
            res:this.value?this.value:[],
            timeN:['',''],
            timeInput:[null,null]
        }
    },
    computed:{
        times(){
            let list=[];
            for(let h=0;h<24;h++){
                for(let m=0;m<60;m+=30){
                    let hh=h<10?('0'+h):h,
                        mm=m<10?('0'+m):m;
                    list.push(hh+':'+mm)
                }
            }
            list.push('24:00')
            return list
        }
    },
    watch:{
        value:{
            deep:true,
            handler(){
                // console.log(this.value)
                this.res=this.value;
            },
        },
        reset(){
            this.res=[];
        },
    },
    methods:{
        timeChange(time){
            // console.log(time)
            if(time&&this.time){
                time.map((v,i)=>{
                    // console.log(time,this.timeN)
                    this.timeN[i]?(time[i]=new Date(this.$pubfunc.TimeTransform('YYYY/MM/DD',v)+' '+this.timeN[i])):null
                    this.$nextTick(()=>{
                        this.timeN[i]='';
                        this.timeInput[i].value=this.$pubfunc.TimeTransform('hh:mm',time[i]);
                    })
                })
                time.sort((a,b)=>{
                    // console.log(a.valueOf(),b.valueOf())
                    return a.valueOf()-b.valueOf()
                })
            }
            this.$emit('return',time,this.id?this.id:null)
        },
        click(){
            this.$nextTick(()=>{
                for(let i=0;i<document.getElementsByClassName('el-date-range-picker__editors-wrap').length;i++){
                    let inputT=document.getElementsByClassName('el-date-range-picker__editors-wrap')[i].getElementsByClassName('el-date-range-picker__time-picker-wrap')[0].getElementsByTagName('input')[0];
                    let input=document.getElementsByClassName('el-date-range-picker__editors-wrap')[i].getElementsByClassName('el-date-range-picker__time-picker-wrap')[1].getElementsByTagName('input')[0];
                    this.timeInput[i]=input;
                    let timebox=document.getElementsByClassName('el-date-range-picker__editors-wrap')[i].getElementsByClassName('el-time-panel el-popper')[0];
                    if(!timebox){return}
                    timebox.style.border='0';
                    let html='<div class="el-picker-panel time-select el-popper" style="text-align:left;width: 180px; position: absolute; top: 0px; left:0px; z-index: 2005; margin:5px 0" x-placement="bottom-start"><div class="el-scrollbar"><div class="el-picker-panel__content el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;"><div class="el-scrollbar__view">';
                    for(let t in this.times){
                        html+='<div class="time-select-item">'+this.times[t]+'</div>'
                    }
                    html+='</div></div><div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div></div><div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb" style="height: 10.5903%; transform: translateY(0%);"></div></div></div><div x-arrow="" class="popper__arrow" style="left: 35px;"></div></div>'
                    let footer=timebox.getElementsByClassName('el-time-panel__footer')[0];
                    timebox.innerHTML=html;
                    timebox.appendChild(footer);
                    footer.style.display='none'
                    let content=timebox.getElementsByClassName('el-picker-panel__content el-scrollbar__wrap')[0];
                    let thumb=timebox.getElementsByClassName('el-scrollbar__bar is-vertical')[0].getElementsByClassName('el-scrollbar__thumb')[0];
                    var returnTime=(time)=>{
                        let timeArr=time?time.split(':'):[];
                        // console.log(timeArr[1].slice(0,2))
                        if(time){
                            timeArr[0]?null:timeArr[0]='00';
                            Number(timeArr[0])<10?(timeArr[0]='0'+Number(timeArr[0])):null;
                            timeArr[1]=timeArr[1]?(timeArr[1]+'0').slice(0,2):'00';
                            timeArr[1]=timeArr[1]>=30?'30':'00';
                            time=timeArr.join(':')
                        }
                        return time
                    }
                    var changeClass=(content,value,input)=>{
                        value=returnTime(value)
                        let index=this.times.indexOf(value),div=content.getElementsByClassName('time-select-item');
                        // console.log(div,index)
                        for(let j=0;j<div.length;j++){
                            div[j].classList.remove('selected')
                        }
                        index>-1?div[index].classList.add('selected'):null
                        if(input){
                            // console.log(value)
                            input.value=value
                        }else{
                            content.scrollTop=36*((index-4)>0?(index-4):0)
                            thumb.style.transform='translateY('+100*content.scrollTop/(content.offsetHeight-17)+'%)'
                        }
                    }
                    if(input){
                        input.addEventListener('click', ()=>{
                            // console.log(input.value)
                            changeClass(content,input.value);
                        })
                        input.addEventListener('blur', ()=>{
                            let time=input.value.replace(/[^0-9:]/g, '');
                            if(inputT.value){
                                time=returnTime(time)
                            }else{
                                time='';
                            }
                            this.timeN[i]=time;
                            changeClass(content,time,input)
                        })
                        input.oninput = ()=>{
                            this.timeN[i]=input.value;
                            changeClass(content,input.value);
                        }
                    }
                    content.addEventListener('scroll', ()=>{
                        // console.log(thumb)
                        thumb.style.transform='translateY('+100*content.scrollTop/(content.offsetHeight-17)+'%)'
                    })
                    content.addEventListener('mousedown', (el)=>{
                        // console.log(el.target.className.split(' ').indexOf('time-select-item'),inputT.value,el)
                        if(el.target.className.split(' ').indexOf('time-select-item')>-1&&inputT.value){
                            changeClass(content,el.target.innerHTML,input);
                            // console.log(footer.getElementsByClassName('el-time-panel__btn confirm'))
                            footer.getElementsByClassName('el-time-panel__btn confirm')[0].click();
                            this.$nextTick(()=>{
                                input.value=el.target.innerHTML;
                                this.timeN[i]=el.target.innerHTML;
                            })
                        }
                    })
                    thumb.addEventListener('mousedown', (el)=>{
                        var parent=thumb.parentNode;
                        let getStartY = el.pageY;
                        let perc=content.scrollTop/(content.offsetHeight-17);
                        let listenMove=(e)=>{
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            // console.log(el,e)
                            let getEndY =  e.pageY;
                            let getMove=getEndY-getStartY;
                            let move=perc+getMove/thumb.offsetHeight;
                            move=move<0?0:move;
                            move=move>(parent.offsetHeight-thumb.offsetHeight)/thumb.offsetHeight?(parent.offsetHeight-thumb.offsetHeight)/thumb.offsetHeight:move;
                            // console.log(move)
                            thumb.style.transform='translateY('+100*move+'%)'
                            content.scrollTop=(content.offsetHeight-17)*move
                        };
                        document.addEventListener("mousemove",listenMove);
                        document.addEventListener("mouseup",function(e){
                            document.removeEventListener("mousemove",listenMove);
                        });
                    })
                }
            })
        }
    },
    created(){
    },
    mounted(){
    },
}
</script>
