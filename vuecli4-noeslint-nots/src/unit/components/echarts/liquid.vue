<template>
  <div class="liquidBox"
       :class="[type]">
    <div v-if="type!=='home'"
         class="title">销售任务完成情况</div>
    <div class="liquidChart"
         ref="echartLiquid"></div>
    <div class="result"
         v-if="chart&&teamAmount!==null">
      已签单金额（元）：
      <u>￥{{teamAmount}}</u>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
export default {
  name: 'statLiquid',
  props: ['type', 'dom', 'data'],
  components: {},
  data() {
    return {
      chart: null,
      teamPercent: null,
      teamPercent_: null,
      teamAmount: null,
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.setDate()
      },
    },
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
    setDate() {
      this.teamPercent = this.data.teamPercent
      this.teamPercent_ = this.data.teamPercent_
      this.teamAmount = this.data.teamAmount
      this.setChartLiquid()
    },
    getData() {
      let param = { year: new Date().getFullYear(), quarter: '' }
      // param.staffId=this.userInfo.staffId
      this.$api.service.stat.yearsignamountstat(param, res => {
        // console.log(res);
        switch (res.code) {
          case '0':
            let list = res.data.list ? res.data.list : []
            for (let i in list) {
              if (list[i].staffId === this.userInfo.staffId) {
                this.teamPercent =
                  list[i].percent === null ? 100 : list[i].percent
                this.teamPercent_ = Number(this.teamPercent / 100)
                this.teamAmount =
                  list[i].amount === null
                    ? null
                    : this.$pubfunc.transformPrice(list[i].amount, 1)
                this.setChartLiquid()
                break
              }
            }
            break
        }
      })
    },
    setChartLiquid() {
      let ref = this.$refs.echartLiquid
      this.chart = echarts.init(ref)
      this.chart.clear()
      var value = this.teamPercent_
      var data = [value * 0.97, value * 0.95, value * 0.98, value]
      const option = {
        // backgroundColor: '#fff',
        // title: {
        //     text: '销售任务完成情况',
        //     left: 'left',
        //     top: 20
        // },
        // graphic: [{
        //     type: 'group',
        //     left: 'center',
        //     bottom: '20%',
        //     children: [{
        //         type: 'text',
        //         z: 100,
        //         left: '10',
        //         style: {
        //             fill: '#000',
        //             text: '已签单金额：',
        //             font: '16px Microsoft YaHei'
        //         }
        //     }, {
        //         type: 'text',
        //         z: 100,
        //         left: '120',
        //         style: {
        //             fill: '#000',
        //             text: this.teamAmount,
        //             font: '24px Microsoft YaHei'
        //         }
        //     }]
        // }],
        series: [
          {
            type: 'liquidFill',
            radius: this.type === 'home' ? '80%' : '70%',
            center: ['50%', '48%'],
            data: data,
            backgroundStyle: {
              borderWidth: 5,
              borderColor: '#1daaeb',
            },
            color: ['#45AFEA', '#294F99', '#45AFEA', '#294F99'],
            itemStyle: {
              opacity: 0.8,
            },
            emphasis: {
              itemStyle: {
                opacity: 0.9,
              },
            },
            label: {
              normal: {
                formatter: this.teamPercent + '%',
                textStyle: {
                  fontSize: this.type === 'home' ? 18 : 20,
                },
              },
            },
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
  mounted() {
    if (this.type == 'self') {
      this.getData()
      return
    } else {
      if (this.data.teamPercent !== undefined) {
        this.setDate()
      }
    }
  },
}
</script>


<style scoped>
.title {
  padding: 10px 16px;
  width: 100%;
  box-sizing: border-box;
  line-height: 20px;
  color: #444444;
  font-size: 18px;
  position: absolute;
  left: 0;
  top: 0;
}
.liquidBox:not(.self) > .title {
  text-align: center;
}
.result {
  font-size: 16px;
  text-align: center;
  line-height: 20px;
}
.result > u {
  text-decoration: none;
  font-size: 20px;
  vertical-align: top;
}
.liquidBox {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 40px;
  box-sizing: border-box;
}
.liquidChart {
  width: 100%;
  height: 70%;
  position: relative;
}
.liquidBox.self .liquidChart {
  height: 75%;
}
.liquidBox.home {
  padding-top: 0;
}
.liquidBox.home .liquidChart {
  height: 80%;
}
.liquidBox.home .result {
  font-size: 14px;
  padding-top: 10px;
}
.liquidBox.home .result > u {
  font-size: 16px;
}
</style>
<style>
</style>
