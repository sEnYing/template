<template>
  <div class="echartLineBox" ref="echartLine"></div>
</template>

<script>
import echarts from 'echarts'
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'statFunnel',
  props: ['dom', 'list', 'stage'],
  components: {
    unitTable
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    list: {
      deep: true,
      handler () {
        this.setechartFunnel();
      },
    },
    stage: {
      deep: true,
      handler () {
        this.setechartFunnel();
      },
    },
    dom: {
      deep: true,
      handler () {
        this.chart ? this.chart.resize() : null;
      },
    },
  },
  methods: {
    setechartFunnel () {
      let ref = this.$refs.echartLine;
      this.chart ? null : this.chart = echarts.init(ref);
      // this.chart.clear();
      let colors = ['#013BA7', '#0048CE', '#2572FF', '#3FB0FF'], colors_ = ['#1049B2', '#1052CC', '#296EEF', '#3997EE'], num = 1;
      let listArr = this.list.concat().sort((a, b) => {
        return Number(b.projStage) - Number(a.projStage)
      });
      let list = listArr.reduce((arr, item) => {
        let json = JSON.parse(JSON.stringify(item))
        json.value = (arr.length + 1);
        json.itemStyle = { color: colors[arr.length] };
        return arr.concat(json)
      }, []),
        list_ = listArr.reduce((arr, item) => {
          let json = JSON.parse(JSON.stringify(item))
          num += json.count ? json.count : 0;
          json.value = num;
          json.itemStyle = { color: colors_[arr.length] };
          return arr.concat(json)
        }, []).sort((a, b) => {
          return Number(a.projStage) - Number(b.projStage)
        });
      // console.log(list,list_)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c}"
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: '10%',
            bottom: '10%',
            width: '60%',
            min: 0,
            max: 4,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 0,
            zlevel: 1,
            itemStyle: {
              borderWidth: 0,
              // opacity: 0.9
            },
            label: {
              show: true,
              formatter: (item) => {
                let json = item.data;
                // console.log(item.dataIndex,this.list,json)
                return "{margin" + (this.stage === json.projStage ? '1' : '') + "| " + json.projStageTxt + "（" + json.count + "）\n￥" + this.$pubfunc.transformPrice(json.sumProjAmount, 1) + "}";
              },
              position: 'right',
              rich: {
                margin: {
                  color: '#60636C',
                  fontSize: 14,
                  padding: [0, 40, 10, 40]
                },
                margin1: {
                  color: '#4780F4',
                  fontSize: 14,
                  padding: [0, 40, 10, 40]
                },
              }
            },
            labelLine: false,
            tooltip: {
              show: false,
            },
            legendHoverLink: false,
            data: list
          },
          {
            name: '漏斗图1',
            type: 'funnel',
            left: '10%',
            top: '10%',
            bottom: '10%',
            width: '60%',
            min: 0,
            max: num * 4,
            minSize: '0%',
            maxSize: '100%',
            sort: 'none',
            gap: 0,
            zlevel: 2,
            itemStyle: {
              borderWidth: 0
            },
            label: {
              show: true,
              formatter: (item) => {
                let json = item.data;
                // console.log(item,this.list,json)
                // console.log(item)
                return Math.round(Number(json.count) * 10000 / (num > 1 ? (num - 1) : 1)) / 100 + '%';
              },
              fontSize: 14,
              position: 'inside'
            },
            labelLine: false,
            tooltip: {
              show: false,
            },
            data: list_
          }
        ]
      }
      this.chart.setOption(option);
      this.chart.off('click');
      this.chart.on('click', (params) => {
        // console.log(params.data.projStageTxt)
        this.$emit('click', params.data.projStage)
      });
    },
  },
  mounted () {
    this.setechartFunnel()
  },
}
</script>


<style scoped>
div.echartLineBox {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
