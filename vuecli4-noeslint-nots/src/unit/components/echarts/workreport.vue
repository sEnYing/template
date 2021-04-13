<template>
    <div class="echartLineBox" ref='echartLine'></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'topten',
    props:['dom','data'],
    data () {
        return{
            title:[],
            list:[],
            chart:null,
        }
    },
    watch:{
        data:{
            deep:true,
            handler(){
                this.getData();
            }
        },
        dom:{
            deep:true,
            handler(){
                this.chart?this.chart.resize():null;
            },
        }
    },
    methods:{
        getData(){
            let list=[],title=[];
            (this.data?this.data:[]).map(v=>{
                title.push(v.customerName)
                list.push({
                    name:v.customerName,
                    value:v.visitTimes,
                })
            })
            this.title=title;
            this.list=list;
            // console.log(this.title,this.list)
            this.setechartLine()
        },
        setechartLine(){
            let max=this.list.reduce(( prev, cur) => {
                return Math.max(prev,cur.value)
            },0)*1.2;
            // console.log(max)
            let ref=this.$refs.echartLine;
            this.chart = echarts.init(ref);
            this.chart.clear();
            const option = {
                backgroundColor: 'transparent',
                grid: {
                    top: '10',
                    right: '5%',
                    left: '1%',
                    bottom: '-10',
                    containLabel:true
                },
                xAxis: {
                    show: false,
                    max: max
                },
                yAxis:{
                    show: true,
                    data: this.title,
                    inverse: true,
                    axisLine: {show: false},
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {
                        align:'right',
                        margin:16,
                        textStyle: {
                            fontSize:14,
                            padding:[0,0,0,10],
                        },
                        formatter: (value, index)=> {
                            return '{title|'+value+'}';
                        },
                        rich: {
                            title:{
                                padding:[0,0,3,6],
                                fontSize:14,
                                color: '#60636a'
                            }
                        }
                    },
                },
                series: [{
                    name: '条',
                    type: 'bar',
                    data: this.list,
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 10,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#7DCFF7' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#4563FB' // 100% 处的颜色
                            }], false),
                        }
                    },
                    label:{
                        show:true,
                        position:'right',
                        padding:[5,6,2,6],
                        backgroundColor:'#FEB956',
                        color:'#fff',
                        formatter: '{c}次',
                        fontSize:13,
                        borderRadius:14
                    }
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
div.echartLineBox{
    position: relative;
    width: 100%;
    height: 100%;
}
</style>