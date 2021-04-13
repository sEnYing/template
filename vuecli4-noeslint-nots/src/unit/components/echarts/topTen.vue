<template>
    <div class="content">
        <div class="title">全平台周拜访量top10</div>
        <div class="empty" v-if="list&&list.length===0">暂无数据</div>
        <div class="echartLine" v-if="list&&list.length>0">
            <div class="boxRel">
                <el-scrollbar class="unitScrollbar" ref='scrollbar'>
                    <div class="echartLineBox" ref='echartLine' :style="{height:list.length*10+'%'}"></div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'topten',
    props:['dom'],
    data () {
        return{
            title:[],
            list:null,
            chart:null,
            onday:24*60*60*1000
        }
    },
    watch:{
        dom:{
            deep:true,
            handler(){
                this.chart&&this.list?this.chart.resize():null;
            },
        }
    },
    computed:{
        time(){
            let time=this.$pubfunc.timestampToTime(),onday=this.onday;
            let week=time.Week?time.Week:7;
            let timeS=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()-(week-1)*onday),
                timeE=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()+(7-week)*onday);
            return {
                timeS:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeS.Year,Number(timeS.Month)-1,timeS.Day,0,0,0)),
                timeE:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeE.Year,Number(timeE.Month)-1,timeE.Day,0,0,0))
            }
        },
    },
    methods:{
        // 获得其他图标对应数据
        // drawCanvas(text,fontsize){
        //     var canvas=document.createElement('canvas');
        //     var ctx=canvas.getContext("2d");
        //     canvas.width = ctx.measureText(text).width + fontsize * 4; //根据文字内容获取宽度
        //     canvas.height = fontsize * 2; // fontsize * 1.5
        //     ctx.fillStyle = 'rgba(6,11,34,0.8)';
        //     ctx.fillRect(0,0,canvas.width,fontsize * 2);
        //     ctx.fillStyle = '#fff';
        //     ctx.font=fontsize+"px  Calibri,sans-serif";
        //     ctx.textAlign = "center";
        //     ctx.shadowColor = "#fff"; //阴影颜色
        //     ctx.shadowBlur = 1; //阴影的模糊范围
        //     ctx.fillText(text, canvas.width/2, fontsize*4/3);
        //     // console.log(canvas)
        //     return {img:canvas,width:canvas.width};
        // },
        getData(){
            let param={
                dateFrom:this.time.timeS,
                dateTo:this.time.timeE,
                top10Flg:"1"
            }
            // console.log(param)
            this.$api.service.stat.visittimesrank(param,res=>{
                switch(res.code){
                    case '0':
                        let list=[],title=[];
                        (res.data.list?res.data.list:[]).concat().map(v=>{
                            title.push(v.staffName)
                            // let img=this.drawCanvas(v.staffName,14);
                            list.push({
                                name:v.staffName,
                                value:v.times,
                                rank:v.rank,
                                // nameImg:img.img,
                                // width:img.width,
                                width:v.staffName.length*14,
                            })
                        })
                        this.title=title;
                        this.list=list;
                        this.$nextTick(()=>{
                            this.setechartLine()
                        })
                        break;
                }
            })
        },
        setechartLine(){
            if(this.list.length===0){return;}
            let titleW=0;
            let max=this.list.reduce(( prev, cur) => {
                titleW<cur.width?titleW=cur.width:null
                return Math.max(prev,cur.value)
            },0)*1.2;
            // console.log(max,titleW)
            let ref=this.$refs.echartLine;
            this.chart = echarts.init(ref);
            this.chart.clear();
            const option = {
                backgroundColor: 'transparent',
                grid: {
                    top: '2%',
                    right: '10%',
                    left: 6+titleW,
                    bottom: '0',
                    containLabel:false
                },
                xAxis: {
                    show: false,
                    max: max
                },
                yAxis:[{
                    show: true,
                    data: this.title,
                    inverse: true,
                    axisLine: {show: false},
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {
                        align:'left',
                        margin: titleW,
                        textStyle: {
                            fontSize:14,
                            padding:[0,0,0,10],
                        },
                        formatter: (value, index)=> {
                            return (this.list[index].rank&&(this.list[index].rank)<4?'':'{margin|}')+'{icon'+(this.list[index].rank&&(this.list[index].rank)<4?this.list[index].rank:'')+'|'+this.list[index].rank+'}'+(this.list[index].rank&&(this.list[index].rank)<4?'':'{margin|}')+'{title|'+value+'}';
                        },
                        rich: {
                            margin:{
                                width:1
                            },
                            icon1:{
                                width:18,
                                height:14,
                                fontSize:8,
                                padding:[0,0,8],
                                align:'center',
                                color:'#2897eb',
                                backgroundColor: {
                                    image: '/static/images/top10/top1.png'
                                }
                            },
                            icon2:{
                                width:18,
                                height:14,
                                fontSize:8,
                                padding:[0,0,8],
                                align:'center',
                                color:'#2897eb',
                                backgroundColor: {
                                    image: '/static/images/top10/top2.png'
                                }
                            },
                            icon3:{
                                width:18,
                                height:14,
                                fontSize:8,
                                padding:[0,0,8],
                                align:'center',
                                color:'#2897eb',
                                backgroundColor: {
                                    image: '/static/images/top10/top3.png'
                                }
                            },
                            icon:{
                                width:16,
                                height:14,
                                padding:[0,0,2],
                                align:'center',
                                fontSize:10,
                                borderRadius:2,
                                backgroundColor: '#4680f4',
                                color:'#fff'
                            },
                            title:{
                                padding:[0,0,3,6],
                                fontSize:14,
                                color: '#60636a'
                            }
                        }
                    },
                }, {
                    show: true,
                    inverse: true,
                    data: this.list,
                    axisLabel: {
                        textStyle: {
                            fontSize:14,
                            color: '#60636a'
                        },
                        formatter: function(value, index) {
                            return value+'次'
                        },
                    },
                    axisLine: {show: false},
                    splitLine: {show: false},
                    axisTick: {show: false},

                }],
                series: [{
                    name: '条',
                    type: 'bar',
                    data: this.list,
                    yAxisIndex: 0,
                    barWidth: ref.offsetHeight/(this.list.length*2),
                    barCategoryGap:'50%',
                    itemStyle: {
                        normal: {
                            barBorderRadius: ref.offsetHeight/(this.list.length*4),
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#01bffa' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#289bfa' // 100% 处的颜色
                            }], false),
                        }
                    },
                }]
            };
            this.chart.setOption(option);
        }
    },
    mounted(){
        this.getData();
    },
}
</script>


<style scoped>
.content{
    width: 100%;
    height: 100%;
    position: relative;
}
.title{
    padding: 10px 0 10px 16px;
    line-height: 20px;
    color: #444444;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
}
.echartLine{
    width: 100%;
    height: 100%;
    padding-top: 40px;
    box-sizing: border-box;
    position: relative;
}
.echartLine div.echartLineBox{
    position: relative;
    width: 100%;
    height: 100%;
}
.empty{
    font-size: 14px;
    border-top: 40px solid #ffffff;
}
</style>
<style>
.echartLine .el-scrollbar__view{
    min-height: 260px;
    height: 100%;
}
</style>