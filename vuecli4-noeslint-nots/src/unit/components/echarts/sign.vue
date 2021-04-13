<template>
  <div class="signBox">
    <div class="signChart"
         ref='echartSign'></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'sign',
  props: ['type', 'dom', 'list'],
  components: {},
  data() {
    return {
      chart: null,
      name: [],
      firstSeason: [],
      secondSeason: [],
      thirdSeason: [],
      fourthSeason: [],
      total: [],
      max: 0,
    }
  },
  watch: {
    list: {
      deep: true,
      handler() {
        this.setDate()
      },
    },
    dom: {
      deep: true,
      handler() {
        // console.log(this.chart)
        this.chart ? this.chart.resize() : null
      },
    },
  },
  methods: {
    // 获得其他图标对应数据
    drawCanvas(text, fontsize) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = ctx.measureText(text).width + fontsize * 4 //根据文字内容获取宽度
      canvas.height = fontsize * 2 // fontsize * 1.5
      ctx.fillStyle = 'rgba(6,11,34,0.8)'
      ctx.fillRect(0, 0, canvas.width, fontsize * 2)
      ctx.fillStyle = '#fff'
      ctx.font = fontsize + 'px  Calibri,sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = '#fff' //阴影颜色
      ctx.shadowBlur = 1 //阴影的模糊范围
      ctx.fillText(text, canvas.width / 2, (fontsize * 4) / 3)
      // console.log(canvas)
      return { img: canvas, width: canvas.width }
    },
    formatDecimal(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },
    setDate() {
      let nameList = []
      let totalList = []
      let firstList = []
      let secondList = []
      let thirdList = []
      let fourthList = []
      let max = 0,
        width = this.$refs.echartSign.offsetWidth
      // this.maxRight=width/this.list.reduce((pre,json)=>{
      //     return Math.max(pre,json.targetAmount,json.amount)
      // },0);
      this.list.map(v => {
        let text =
          v.percent === null
            ? ''
            : (v.amount
                ? this.$pubfunc.getSmallPrice(v.amount) + '万元  '
                : '') +
              Number(v.percent) +
              '%'
        let canv = this.drawCanvas(text, 12),
          q4 = this.drawCanvas(this.$pubfunc.getSmallPrice(v.q4Amount), 6)
        max > canv.width ? null : (max = canv.width)
        nameList.push(v[this.type + 'Name'])
        totalList.push({
          value: this.$pubfunc.getSmallPrice(v.targetAmount),
          name: v[this.type + 'Name'],
          text: text,
          label: {
            // padding:[0,v.amount*0.9*this.maxRight>q4.width?10:q4.width],
            padding: [0, 10],
            position: [
              (v.targetAmount ? (v.amount * 100) / v.targetAmount : 0) + '%',
              '-24',
            ],
          },
        })
        firstList.push(this.formatDecimal(v.q1Amount / 10000, 2))
        secondList.push(this.formatDecimal(v.q2Amount / 10000, 2))
        thirdList.push(this.formatDecimal(v.q3Amount / 10000, 2))
        fourthList.push(this.formatDecimal(v.q4Amount / 10000, 2))
      })
      this.name = nameList
      this.total = totalList
      this.firstSeason = firstList
      this.secondSeason = secondList
      this.thirdSeason = thirdList
      this.fourthSeason = fourthList
      this.max = max
      this.setSignChart()
    },
    showTxt(text, index) {
      let ref = this.$refs.echartSign
      let width = ref.offsetWidth,
        height = ref.offsetHeight - 60
      let count = Math.floor(
        this.list.length > height / 50 ? height / 50 : this.list.length,
      )
      let maxRight =
        this.list
          .slice(
            index - count > 0 ? index - count : 0,
            index + count < this.list.length ? index + count : this.list.length,
          )
          .reduce((pre, json) => {
            return Math.max(pre, json.targetAmount, json.amount)
          }, 0) / 10000
      // text?console.log(text,maxRight,width*text/maxRight,this.drawCanvas(text,6).width):null
      return text > 0 &&
        (width * text) / maxRight > this.drawCanvas(text, 6).width
        ? text
        : ''
    },
    setSignChart() {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].amount_ = this.formatDecimal(
          this.list[i].amount / 10000,
          2,
        )
        this.list[i].q1Amount_ = this.formatDecimal(
          this.list[i].q1Amount / 10000,
          2,
        )
        this.list[i].q2Amount_ = this.formatDecimal(
          this.list[i].q2Amount / 10000,
          2,
        )
        this.list[i].q3Amount_ = this.formatDecimal(
          this.list[i].q3Amount / 10000,
          2,
        )
        this.list[i].q4Amount_ = this.formatDecimal(
          this.list[i].q4Amount / 10000,
          2,
        )
      }
      let ref = this.$refs.echartSign
      let height = ref.offsetHeight - 60
      this.chart = echarts.init(ref)
      this.chart.clear()
      const option = {
        color: ['#4680F4', '#6FCE7D', '#FBC807', '#F5814B', '#E94A54'],
        title: {
          top: 0,
          text: '年累计签约额    单位：万元',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
          },
          padding: [0, 0, 0, 30],
        },
        tooltip: {
          show: true,
          padding: [5, 10],
          formatter: (value, index) => {
            for (let i in this.list) {
              if (this.list[i][this.type + 'Name'] === value.name) {
                let text = ''
                text +=
                  "<i style='background:#4680F4;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第一季度：' +
                  this.list[i].q1Amount_ +
                  ' 万元</span><br/>'
                text +=
                  "<i style='background:#6FCE7D;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第二季度：' +
                  this.list[i].q2Amount_ +
                  ' 万元</span><br/>'
                text +=
                  "<i style='background:#FBC807;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第三季度：' +
                  this.list[i].q3Amount_ +
                  ' 万元</span><br/>'
                text +=
                  "<i style='background:#F5814B;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第四季度：' +
                  this.list[i].q4Amount_ +
                  ' 万元</span><br/>'
                text +=
                  '<span>合计：' + this.list[i].amount_ + ' 万元</span><br/>'
                return text
              }
            }
          },
        },
        legend: {
          top: 20,
          data: ['第一季度', '第二季度', '第三季度', '第四季度', '销售任务额'],
          itemGap: 20,
        },
        grid: {
          top: 60,
          left: '3%',
          right: this.max + 20,
          bottom: 0,
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'inside',
            show: true,
            height: '80%',
            xAxisIndex: null,
            yAxisIndex: [0],
            bottom: '5%',
            start: 0,
            end:
              (this.list.length > height / 50
                ? height / 50 / this.list.length
                : 1) * 100,
            zoomOnMouseWheel: false,
            moveOnMouseMove: false,
            moveOnMouseWheel: true,
            showDetail: false,
          },
        ],
        xAxis: [
          {
            type: 'value',
            show: false,
          },
        ],
        yAxis: [
          {
            type: 'category',
            data: this.name,
            inverse: true,
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: '#60636a',
              interval: 0,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '第一季度',
            type: 'bar',
            barWidth: 26,
            stack: '季度值',
            zlevel: 4,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  // console.log(value,value.dataIndex)
                  return this.showTxt(value.value, value.dataIndex)
                },
                position: 'insideLeft',
              },
            },
            data: this.firstSeason,
          },
          {
            name: '第二季度',
            type: 'bar',
            barWidth: 26,
            stack: '季度值',
            zlevel: 3,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(value.value, value.dataIndex)
                },
                position: 'insideLeft',
              },
            },
            data: this.secondSeason,
          },
          {
            name: '第三季度',
            type: 'bar',
            barWidth: 26,
            stack: '季度值',
            zlevel: 2,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(value.value, value.dataIndex)
                },
                position: 'insideLeft',
              },
            },
            data: this.thirdSeason,
          },
          {
            name: '第四季度',
            type: 'bar',
            barWidth: 26,
            stack: '季度值',
            zlevel: 1,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  // return value.value>0?value.value:''
                  return this.showTxt(value.value, value.dataIndex)
                },
                position: 'insideLeft',
              },
            },
            data: this.fourthSeason,
          },
          {
            name: '销售任务额',
            type: 'bar',
            barWidth: 5,
            stack: '销售任务额',
            barGap: 0,
            data: this.total,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return value.data.text
                },
                lineHeight: 22,
                color: '#60636a',
              },
            },
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
  mounted() {
    this.setDate()
  },
}
</script>


<style scoped>
.signBox {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}
.signChart {
  width: 100%;
  height: 100%;
}
</style>
<style>
</style>