<template>
    <div class="maskTable" :class="[classname?classname:'']">
        <div>
            <i class="el-icon-arrow-left" @click="judgeClick(left===0?0:-1)" :class="{'unable':left===0}" :style="{left:Number(100-titleNum.per)+'%'}" v-if="maxrow&&titleNum.length>maxrow"></i>
            <span v-for="(row,r) in title" :key='r' 
            :class="{'today':row.today,'relativeLi':judgeSth(row,'relative')}"
            :style="{
                textAlign:row.align?row.align:'',
                padding:padding?('0 '+padding+'px'):'',
                width:(getWidth(row)+'%'),
                left:-(judgeSth(row,'relative')?0:getWidth(row)*left)+'%'
            }" v-html="$pubfunc.replaceBr(row.name,1)"></span>
            <i class="el-icon-arrow-right" @click="judgeClick(left===titleNum.length-maxrow?0:1)" :class="{'unable':left===titleNum.length-maxrow}" v-if="maxrow&&titleNum.length>maxrow"></i>
        </div>
        <ul v-for="(line,l) in list" :key='l'
            :class="{'markline':markline&&markline.split(',').indexOf(l.toString())>-1}">
            <li v-for="(row,r) in title" :key='r' 
            :class="[
                judgeSth(row,'relative')?'relativeLi':'',
                judgeSth(row,'otherclick')?'otherclick':'',
                judgeSth(row,'color',line),
            ]"
            :style="{
                textAlign:row.align?row.align:'',
                padding:padding?('0 '+padding+'px'):'',
                width:(getWidth(row)+'%'),
                left:-(judgeSth(row,'relative')?0:getWidth(row)*left)+'%',
                height:classname==='stafftask'?(getLines(line)+'px'):''}">
                <a v-if="classname!=='stafftask'" @click="clickThis(line,row)"><div class="textEllipse"><a v-showtit>{{judgeSth(row,'relative')?line[row.key]:(line[row.key]?(classname==='taskTime'?(judgeSth(row,'value',line)?line[row.key].value:'--'):line[row.key].value):'')}}</a></div></a>
                <ul v-if="classname==='stafftask'">
                    <li v-if="row.key==='stafFName'">
                        <i class="photo"><img :src="line['headImage']" alt=""></i><span class="textEllipse"><u v-showtit>{{line[row.key]}}</u></span>
                    </li>
                    <li v-else-if="row.key==='resTypeName'">
                        <span class="notextEllipse"><u>{{line[row.key]}}</u></span>
                    </li>
                    <li v-else v-for="(item,i) in (line[row.key]?(line[row.key].more?line[row.key].arr.slice(0,4):line[row.key].arr):[])" :key="i" class="taskList" :class="{'finish':item.startTime&&item.endTime}">
                        <div><i class="el-icon-time"></i><span>{{item.manhour}}<i class="nbsp"></i>{{(item.startTime||item.planStartTime)|judgeEmpty('time')}}{{(item.endTime||item.planEndTime)|judgeEmpty('time','—')}}</span></div>
                        <div class="textEllipse"><u v-showtit>{{item.projName}}</u></div>
                        <a v-if="line[row.key].arr.length>4&&((line[row.key].more&&i===3)||(!line[row.key].more&&i===line[row.key].arr.length-1))"><a @click="showAll(line,row)">{{line[row.key].more?'more...':'close'}}</a></a>
                    </li>
                </ul>
            </li>
        </ul>
        <span class="emptyLi" v-if="list.length===0">暂无数据</span>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'unitTable',
    props:['title','list','index','relative','markline','otherclick','maxrow','padding','classname','color'],
    data () {
        return{
            left:0
        }
    },
    computed:{
        titleNum(){
            let length=0,per=0;
            this.title.map(v=>{
                v.width?per+=Number(v.width):length++;
            })
            return {
                per:Number(100-per),
                length:length,
            }
        },
    },
    directives : {
        showtit:{
            inserted:function(el,binding,vnode){
                setTimeout(()=>{
                    // console.log(el)
                    let w=el.offsetWidth,h=el.offsetHeight,pw=el.parentNode.offsetWidth,ph=el.parentNode.offsetHeight;
                    // console.log(w,pw,h,ph);
                    (w>pw||h>ph)?el.setAttribute('title',el.innerHTML):el.removeAttribute('title')
                },0)
            },
            componentUpdated:function(el,binding,vnode){
                setTimeout(()=>{
                    // console.log(el)
                    let w=el.offsetWidth,h=el.offsetHeight,pw=el.parentNode.offsetWidth,ph=el.parentNode.offsetHeight;
                    // console.log(w,pw,h,ph);
                    (w>pw||h>ph)?el.setAttribute('title',el.innerHTML):el.removeAttribute('title')
                },0)
            },
        }
    },
    watch:{
        list:{
            deep:true,
            handler(){
                this.left=0;
            },
        }
    },
    filters:{
        judgeEmpty(val,t,icon){
            return val?((icon?icon:'')+(t==='time'?val.split(':').slice(0,2).join(':'):val)):(icon?'':'--')
        },
    },
    methods:{
        judgeClick(n){
            switch(n){
                case 1:
                    this.left+=(this.titleNum.length-(this.left+this.maxrow))>this.maxrow?this.maxrow:(this.titleNum.length-(this.left+this.maxrow));
                    break;
                case -1:
                    this.left-=(this.left)>this.maxrow?this.maxrow:this.left;
                    break;

            }
        },
        judgeSth(row,key,line){
            switch(key){
                case 'color':
                    if(this.color){
                        let arr=this.color
                        let classname=[];
                        arr.map(v=>{
                            if(v.key===row.key){
                                if(v.value&&v.value.split(',').indexOf(line.state)>-1){
                                    classname.push(v.class)
                                }
                            }
                        })
                        return classname.join(' ')
                    }
                    return ''
                case 'value':
                    let today=row.key.split('/').join(''),
                        start=(line.actualStartTime?line.actualStartTime.split(' ')[0]:'0').split('/').join(''),
                        finish=(line.actualFinishTime?line.actualFinishTime.split(' ')[0]:'90000000').split('/').join('');
                    // console.log(today,start,finish);
                    return today>=start&&today<=finish?true:false;
                default:
                    return (this[key]?this[key].split(','):[]).indexOf(row.key)>-1
            }
        },
        getWidth(row){
            return Number(row.width?(row.width):(this.titleNum.per)/(this.maxrow&&this.maxrow<=this.titleNum.length?this.maxrow:this.titleNum.length))
        },
        clickThis(line,row){
            !this.judgeSth(row,'relative')||this.judgeSth(row,'otherclick')?this.$emit('click',line[row.key],line,row):null
        },
        showAll(line,row){
            line[row.key].more=!line[row.key].more;
        },
        getLines(line){
            let max=0,more=false;
            this.title.map(v=>{
                let key=v.key;
                if(!this.judgeSth(v,'relative')&&line[key]){
                    let length=line[key].arr.length<2?2:line[key].arr.length;
                    line[key].more?length=4:null
                    if(max<length){
                        max=length;
                        more=line[key].more;
                    }
                }
            })
            return Number(max*44+25)
        },
    },
    mounted(){
    } 
}
</script>


<style scoped>
.maskTable{
    position: relative;
    width: 100%;
    height: auto;
}
.maskTable>div,
.maskTable>ul{
    width: 100%;
    font-size: 0;
    line-height: 48px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}
.maskTable>div>i{
    position: absolute;
    display: block;
    z-index: 3;
    top: 0px;
    bottom: 1px;
    line-height: 49px;
    width: 24px;
    text-align: center;
    font-size: 20px;
    color: #C0C4CC;
    background: #f1f4fb;
    -webkit-transition: all .15s ease;
    transition: all .15s ease;
    cursor: pointer;
}
.maskTable>div>i.el-icon-arrow-left{
    margin-left: -24px;
}
.maskTable>div>i.el-icon-arrow-right{
    right: 0px;
}
.maskTable>div>i.unable{
    color: #e3e4e6;
    cursor: default;
}
.maskTable>div>i:not(.unable):hover{
    color: #5d6680;
    background-color: #e5e9f3;
}
.maskTable>div>span,
.maskTable>ul>li{
    display: inline-block;
    vertical-align: top;
    position: relative;
    min-height: 48px;
    border-bottom: 1px solid #EBEEF5;
    box-sizing: border-box;
    color: #636980;
    background-color: #fff;
    padding: 0 15px;
    -webkit-transition: all .25s ease;
    transition: all .25s ease;
    left: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.maskTable>div>span{
    background: #f1f4fb;
    color: #5d6680;
    font-size: 14px;
}
/* .maskTable>div>span.today{
    font-weight: bold;
    text-shadow: 0 0 2px rgba(99, 105, 128,0.2);
} */
.maskTable>div>span.today::after{
    content: '今天';
    padding: 3px 5px;
    text-align: center;
    font-size: 12px;
    vertical-align: top;
    margin-left: 4px;
    background-image: linear-gradient(135deg, 
		#e8cd6e 0%, 
        #f69339 100%);
    color: #fff;
}
.maskTable>ul.markline>li{
    background-color: #fff8ee;
}
.maskTable>ul:hover>li{
    background-color: #f5f7fa;
}
/* .maskTable>ul.markline:hover>li{
    background-color: #fdf5e6;
} */
.maskTable>div>span.relativeLi,
.maskTable>ul>li.relativeLi{
    z-index: 2;
}
.maskTable>div>span:not(.relativeLi),
.maskTable>ul>li:not(.relativeLi){
    z-index: 1;
}
.maskTable>ul>li>a{
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin-top: 12px;
    line-height: 1;
    -webkit-transition: color 0.15s ease;
    transition: color 0.15s ease;
    padding: 5px;
    margin-left: -5px;
    font-size: 14px;
    max-width: 100%;
}
.maskTable>ul>li:not(.relativeLi)>a{
    color: #4780F4;
}
.maskTable>ul>li:not(.relativeLi)>a:hover,.maskTable>ul>li.otherclick>a:hover{
    color: #66b1ff;
    cursor: pointer;
}
.emptyLi{
    font-size: 14px;
    text-align: center;
    color: #909399;
    display: block;
    line-height: 60px;
    height: 60px;
    border-bottom: 1px solid #EBEEF5;
    box-sizing: border-box;
}
.red a{
    color: rgb(255, 64, 64);
}
/* 人员任务状况 */
.stafftask.maskTable>div>span{
    padding: 7px 15px;
    line-height: 20px
}
.stafftask.maskTable>div>span.relativeLi{
    padding: 17px 15px;
}
.stafftask.maskTable>div>i{
    line-height: 54px;
}
.stafftask.maskTable>ul>li>ul{
    position: relative;
    width: 100%;
    height: 100%;
}
.stafftask.maskTable>ul>li.relativeLi>ul{
    max-height: 170px;
}
.stafftask.maskTable>ul>li>ul>li{
    padding: 4px 0;
}
.stafftask.maskTable>ul>li>ul>li:nth-child(1){
    padding-top: 8px;
}
.stafftask.maskTable>ul>li>ul>li:nth-last-child(1){
    padding-bottom: 8px;
}
.stafftask.maskTable>ul>li>ul>li:not(.taskList){
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
.stafftask.maskTable>ul>li>ul>li>i.photo{
    width: 40px;
    height: 40px;
    display: inline-block;
    border: 1px solid #bbbfce;
    border-radius: 50%;
    vertical-align: top;
    margin-bottom: 10px;
    overflow: hidden;
    box-sizing: border-box;
}
.stafftask.maskTable>ul>li>ul>li>i.photo>img{
    width: 100%;
    height: 100%;
    display: block;
}
.stafftask.maskTable>ul>li>ul>li>span{
    display: block;
    color: #5d6680;
    font-size: 12px;
    line-height: 1;
}
.stafftask.maskTable>ul>li>ul>li:not(.taskList)>span{
    font-size: 14px;
    line-height: 18px;
}
i.nbsp{
    display: inline-block;
    width: 16px;
    vertical-align: top;
}
.stafftask.maskTable>ul>li>ul>li>div{
    font-size: 12px;
    line-height: 18px;
    color: #5d6680;
    max-height: 18px;
}
.stafftask.maskTable>ul>li>ul>li>div *{
    color: #4780F4;
    display: inline-block;
    vertical-align: top;
    line-height: 18px;
}
.stafftask.maskTable>ul>li>ul>li.finish>div *{
    color: #8e95a8;
}
.stafftask.maskTable>ul>li>ul>li>div>i.el-icon-time{
    padding-right: 6px;
}
.stafftask.maskTable>ul>li>ul>li>a{
    display: block;
    line-height: 1;
    padding-top: 4px;
    text-align: right;
    font-size: 12px;
}
.stafftask.maskTable>ul>li>ul>li>a>a{
    color: #4780F4;
    padding: 5px;
    margin-right: -5px;
    -webkit-transition: color 0.15s ease;
    transition: color 0.15s ease;
    cursor: pointer;
}
.stafftask.maskTable>ul>li>ul>li.finish>a>a{
    color: #8e95a8;
}
.stafftask.maskTable>ul>li>ul>li>a>a:hover{
    color: #66b1ff;
}
.stafftask.maskTable>ul>li>ul>li.finish>a>a:hover{
    color: #a8b0ca;
}
.stafftask.maskTable>ul>li u{
    color: #5d6680!important;
    text-decoration: none;
}
.textEllipse{
    max-height: 16px;
    line-height: 16px;
    overflow: hidden;
}
.stafftask.maskTable>ul>li>ul>li>div.textEllipse>*{
    display: inline;
}
.stafftask.maskTable>ul>li>ul>li>span.textEllipse{
    display: -webkit-box;
    max-height: 18px;
}
.stafftask.maskTable>ul>li>ul>li>span.notextEllipse{
    white-space: normal;
}
</style>
