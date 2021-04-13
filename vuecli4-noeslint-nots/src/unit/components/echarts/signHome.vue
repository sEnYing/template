<template>
  <div class="signBox">
    <div class="leftLiquid">
      <unit-liquid :type="'home'"
                   :data='data'
                   :dom='dom'></unit-liquid>
    </div>
    <div class="signChart"
         ref='echartSign'></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import unitLiquid from '@/unit/components/echarts/liquid'
export default {
  name: 'signHome',
  props: ['dom'],
  components: { unitLiquid },
  data() {
    return {
      chart: null,
      name: [],
      firstSeason: [],
      secondSeason: [],
      thirdSeason: [],
      fourthSeason: [],
      all: [],
      total: [],
      data: {},
      max: 0,
    }
  },
  watch: {
    dom: {
      deep: true,
      handler() {
        this.chart ? this.chart.resize() : null
      },
    },
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      return userInfo.info && userInfo.info.staff ? userInfo.info.staff : {}
    },
  },
  methods: {
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
    setDate(type, list) {
      let nameList = []
      let totalList = []
      let firstList = []
      let secondList = []
      let thirdList = []
      let fourthList = []
      let allList = []
      let max = 0
      list.map(v => {
        let text = v.percent === null ? '' : Number(v.percent) + '%'
        // let canv=this.drawCanvas(v[type+'Name'],12);
        // max>canv.width?null:max=canv.width;
        let width = v[type + 'Name']
          ? v[type + 'Name'].length * 14 - 42 + 18
          : 18
        max > width ? null : (max = width)
        nameList.push(v[type + 'Name'])
        totalList.push({
          value: this.$pubfunc.getSmallPrice(v.targetAmount),
          name: v[type + 'Name'],
          text: text,
        })
        firstList.push(this.formatDecimal(v.q1Amount / 10000, 2))
        secondList.push(this.formatDecimal(v.q2Amount / 10000, 2))
        thirdList.push(this.formatDecimal(v.q3Amount / 10000, 2))
        fourthList.push(this.formatDecimal(v.q4Amount / 10000, 2))
        allList.push({
          value: 0,
          name: v[type + 'Name'],
          text: parseInt(this.formatDecimal(v.amount / 10000, 2)),
        })
      })
      // console.log(max)
      this.name = nameList
      this.total = totalList
      this.all = allList
      this.firstSeason = firstList
      this.secondSeason = secondList
      this.thirdSeason = thirdList
      this.fourthSeason = fourthList
      this.max = max + 10
      this.setSignChart(type, list)
    },
    getYearsData() {
      //个人
      let param = {
        year: new Date().getFullYear(),
        quarter: '',
      }
      this.$api.service.stat.yearsignamountstat(param, res => {
        // console.log(res);
        switch (res.code) {
          case '0':
            let list = res.data.list ? res.data.list : []
            this.setDate('staff', list)
            let teamPercent =
              res.data.teamPercent === null ? 100 : res.data.teamPercent
            let teamPercent_ = Number(teamPercent / 100)
            let teamAmount =
              res.data.teamAmount === null
                ? null
                : this.$pubfunc.transformPrice(res.data.teamAmount, 1)
            this.data = { teamPercent, teamPercent_, teamAmount }
            break
        }
      })
    },
    getTeamsData() {
      //团队
      let param = {
        year: new Date().getFullYear(),
        quarter: '',
      }
      this.$api.service.stat.teamsignamountlist(param, res => {
        // console.log(res);
        switch (res.code) {
          case '0':
            this.setDate('team', res.data.list ? res.data.list : [])
            let teamPercent =
              res.data.teamTotalPercent === null
                ? 100
                : res.data.teamTotalPercent
            let teamPercent_ = Number(teamPercent / 100)
            let teamAmount =
              res.data.teamTotalAmount === null
                ? null
                : this.$pubfunc.transformPrice(res.data.teamTotalAmount, 1)
            this.data = { teamPercent, teamPercent_, teamAmount }
            break
        }
      })
    },
    showTxt(list, text, index) {
      let ref = this.$refs.echartSign
      let width = ref.offsetWidth * 0.94,
        height = ref.offsetHeight - 60
      let count = Math.floor(
        this.name.length + 1 > width / this.max
          ? width / this.max
          : this.name.length + 1,
      )
      let maxHeight =
        list
          .slice(
            index - count > 0 ? index - count : 0,
            index + count < list.length ? index + count : list.length,
          )
          .reduce((pre, json) => {
            return Math.max(pre, json.targetAmount, json.amount)
          }, 0) / 10000
      return text > 0 && (height * text) / maxHeight > 30 ? text : ''
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
    setSignChart(type, list) {
      for (var i = 0; i < list.length; i++) {
        list[i].amount_ = this.formatDecimal(list[i].amount / 10000, 2)
        list[i].q1Amount_ = this.formatDecimal(list[i].q1Amount / 10000, 2)
        list[i].q2Amount_ = this.formatDecimal(list[i].q2Amount / 10000, 2)
        list[i].q3Amount_ = this.formatDecimal(list[i].q3Amount / 10000, 2)
        list[i].q4Amount_ = this.formatDecimal(list[i].q4Amount / 10000, 2)
      }
      let ref = this.$refs.echartSign
      let width = ref.offsetWidth * 0.94
      this.chart = echarts.init(ref)
      this.chart.clear()
      const option = {
        color: [
          '#4680F4',
          '#6FCE7D',
          '#FBC807',
          '#F5814B',
          'transparent',
          '#E94A54',
        ],
        title: {
          top: 0,
          text: '年累计签约额    单位：万元',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
          },
          padding: [0, 0, 0, 30],
        },
        legend: {
          top: 20,
          data: ['第一季度', '第二季度', '第三季度', '第四季度', '销售任务额'],
          itemGap: 20,
        },
        grid: {
          top: 60,
          left: '3%',
          right: '3%',
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          show: true,
          padding: [5, 10],
          formatter: (value, index) => {
            for (let i in list) {
              if (list[i][type + 'Name'] === value.name) {
                let text = ''
                text +=
                  "<i style='background:#4680F4;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第一季度：' + list[i].q1Amount_ + ' 万元</span><br/>'
                text +=
                  "<i style='background:#6FCE7D;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第二季度：' + list[i].q2Amount_ + ' 万元</span><br/>'
                text +=
                  "<i style='background:#FBC807;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第三季度：' + list[i].q3Amount_ + ' 万元</span><br/>'
                text +=
                  "<i style='background:#F5814B;width:10px;height:10px;display:inline-block;border-radius:50%;margin-right:5px'></i>"
                text +=
                  '<span>第四季度：' + list[i].q4Amount_ + ' 万元</span><br/>'
                text += '<span>合计：' + list[i].amount_ + ' 万元</span><br/>'
                return text
              }
            }
          },
        },
        dataZoom: [
          {
            type: 'inside',
            show: true,
            yAxisIndex: null,
            xAxisIndex: [0],
            start: 0,
            end:
              (this.name.length + 1 > width / this.max
                ? width / this.max / (this.name.length + 1)
                : 1) * 100,
            zoomOnMouseWheel: false,
            moveOnMouseMove: false,
            moveOnMouseWheel: true,
            showDetail: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#D0D0D0',
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        xAxis: [
          {
            type: 'category',
            show: true,
            data: this.name,
            minInterval: 1,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#D0D0D0',
              },
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
            barWidth: 28,
            stack: '季度值',
            zlevel: 4,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(list, value.value, value.dataIndex)
                },
                position: 'insideBottom',
              },
            },
            data: this.firstSeason,
          },
          {
            name: '第二季度',
            type: 'bar',
            barWidth: 28,
            stack: '季度值',
            zlevel: 3,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(list, value.value, value.dataIndex)
                },
                position: 'insideBottom',
              },
            },
            data: this.secondSeason,
          },
          {
            name: '第三季度',
            type: 'bar',
            barWidth: 28,
            stack: '季度值',
            zlevel: 2,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(list, value.value, value.dataIndex)
                },
                position: 'insideBottom',
              },
            },
            data: this.thirdSeason,
          },
          {
            name: '第四季度',
            type: 'bar',
            barWidth: 28,
            stack: '季度值',
            zlevel: 1,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return this.showTxt(list, value.value, value.dataIndex)
                },
                position: 'insideBottom',
              },
            },
            data: this.fourthSeason,
          },
          {
            name: '总和',
            type: 'bar',
            barWidth: 28,
            stack: '季度值',
            zlevel: 0,
            label: {
              normal: {
                show: true,
                formatter: (value, index) => {
                  return value.data.text > 0 ? value.data.text : ''
                },
                lineHeight: 22,
                color: '#60636a',
                position: 'top',
              },
            },
            data: this.all,
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
                padding: [0, 10],
                color: '#60636a',
                position: ['-5', '-22'],
              },
            },
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
  mounted() {
    if (
      this.userInfo.resourceType === '01' ||
      this.userInfo.resourceType === '11'
    ) {
      this.getTeamsData()
    } else {
      this.getYearsData()
    }
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
  width: 80%;
  height: 100%;
  float: left;
}
.leftLiquid {
  width: 20%;
  height: 100%;
  float: left;
}
</style>
<style>
</style>