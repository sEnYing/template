<template>
  <div>
    <ul class="formUl exportDialog"
        @click="showSeason=false">
      <!-- <li v-if="data.name=='pipeline' || data.name=='commit'" :class="{'errorBorder':error.show}">
                <span class="formTitle">预计结案日期：</span>
                <el-date-picker
                    v-model="value1"
                    type="monthrange"
                    format="yyyy/MM"
                    class="elTimebox" 
                    :clearable='false'
                    @change="monthChange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份">
                </el-date-picker>
                <transition name="publicTransition"><u class="error" v-if="error.show">{{error.msg}}</u></transition>
            </li> -->
      <li class="small">
        <el-radio-group v-model="dateForm.expFlg"
                        @change="radioChange"
                        class="radioGroup"
                        v-if="data.name=='sign' || data.name=='bid'">
          <el-radio :label="3">月度</el-radio>
          <el-radio :label="2">季度</el-radio>
          <el-radio :label="1">年度</el-radio>
          <el-radio :label="0">全部</el-radio>
        </el-radio-group>
      </li>
      <li :class="{'errorBorder':error.show,'noPad':true}"
          style="z-index:999">
        <span class="formTitle">{{timeBox[data.name]}}：</span>
        <div class="input unable"
             v-if="(data.name=='sign' || data.name=='bid')&&dateForm.expFlg===0">--</div>
        <el-date-picker class="elTimebox"
                        v-show="data.name=='pipeline' || data.name=='commit'|| ((data.name=='sign' || data.name=='bid')&&dateForm.expFlg==3)"
                        v-model="value1"
                        type="monthrange"
                        format="yyyy/MM"
                        :clearable='false'
                        @change="monthChange"
                        range-separator="至"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份">
        </el-date-picker>
        <el-date-picker class="elTimebox"
                        v-show="(data.name=='sign' || data.name=='bid')&&dateForm.expFlg==1"
                        v-model="value2"
                        :clearable='false'
                        type="year"
                        @change="yearChange"
                        placeholder="选择年">
        </el-date-picker>
        <span class="elTimebox"
              :class="{elFocus:showSeason}"
              v-show="(data.name=='sign' || data.name=='bid')&&dateForm.expFlg==2"
              @click.stop="">
          <!-- <mark
                    style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
                    v-show="showSeason"
                    @click.stop="showSeason=false"
                    ></mark> -->
          <el-popover popper-class="seasonPopover"
                      placement="bottom"
                      transition='el-zoom-in-top'
                      trigger="manual"
                      v-model="showSeason"
                      :offset='0'
                      :width='324'>
            <el-input slot="reference"
                      placeholder="请选择季度"
                      v-model="showValue"
                      style="width:324px;"
                      @focus="showSeason=true">
              <i slot="prefix"
                 class="el-input__icon el-icon-date"></i>
            </el-input>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix"
                   style="text-align:center;padding:0">
                <button type="button"
                        aria-label="前一年"
                        class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
                        @click="prev"></button>
                <span role="button"
                      class="el-date-picker__header-label">{{year}}年</span>
                <button type="button"
                        aria-label="后一年"
                        @click="next"
                        class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"></button>
              </div>
              <div class="text item"
                   style="text-align:center;">
                <el-button :class="{'active':season===1}"
                           type="text"
                           size="medium"
                           style="width:40%;"
                           @click="selectSeason(0)">第一季度</el-button>
                <el-button :class="{'active':season===2}"
                           type="text"
                           size="medium"
                           style="width:40%;"
                           @click="selectSeason(1)">第二季度</el-button>
              </div>
              <div class="text item"
                   style="text-align:center;">
                <el-button :class="{'active':season===3}"
                           type="text"
                           size="medium"
                           style="width:40%;"
                           @click="selectSeason(2)">第三季度</el-button>
                <el-button :class="{'active':season===4}"
                           type="text"
                           size="medium"
                           style="width:40%;"
                           @click="selectSeason(3)">第四季度</el-button>
              </div>
            </el-card>
          </el-popover>
        </span>
        <transition name="publicTransition"><u class="error"
             v-if="error.show">{{error.msg}}</u></transition>
      </li>
      <li>
        <div class="btnBox">
          <unit-btn @click="submit"
                    :loading='ajaxIng'
                    text='确定'></unit-btn>
          <unit-btn type='plain'
                    @click="close"
                    text='取消'></unit-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import unitTime from '@/unit/components/element/timeRange'
export default {
  name: 'exportStat',
  props: ['data'],
  components: { unitTime },
  data () {
    return {
      timeBox: {
        pipeline: '立项时间',
        commit: '预计结案时间',
        sign: '实际签约时间',
        bid: '投标时间',
      },
      ajaxIng: false,
      value1: '',
      value2: '',
      form: {
        monthFrom: '',
        monthTo: ''
      },
      dateForm: {
        expFlg: 0,
        monthFrom: '',
        monthTo: '',
        year: ''
      },
      showSeason: false,
      showValue: '',
      year: new Date().getFullYear(),
      season: '',
      valueArr: ['01-03', '04-06', '07-09', '10-12'],
      error: {
        show: false,
        msg: null
      }
    }
  },
  inject: ['close'],
  watch: {
    'dateForm.expFlg' () {
      this.form.monthFrom = '';
      this.form.monthTo = '';
      this.dateForm.monthFrom = '';
      this.dateForm.monthTo = '';
      this.dateForm.year = '';
      this.value1 = '';
      this.value2 = '';
      this.showValue = '';
      this.season = '',
        this.clearErr();
    },
    showSeason (v) {
      if (!v) {
        this.showValue = this.season ? `${this.year}年${this.season}季度` : ''
      }
    }
  },
  methods: {
    one () {
      this.showSeason = false
    },
    prev () {
      this.year = this.year * 1 - 1
    },
    next () {
      this.year = this.year * 1 + 1
    },
    selectSeason (i) {
      this.clearErr();
      let that = this
      that.season = i + 1
      let arr = that.valueArr[i].split('-')
      that.showSeason = false
      this.showValue = `${this.year}年${this.season}季度`
      this.dateForm.monthFrom = that.year + '/' + arr[0];
      this.dateForm.monthTo = that.year + '/' + arr[1];
    },
    monthChange (data) {
      this.clearErr();
      if (this.data.name == 'pipeline' || this.data.name == 'commit') {
        if (data != '' || data != null) {
          this.form.monthFrom = this.$pubfunc.TimeTransform('YYYY/MM', data[0]);
          this.form.monthTo = this.$pubfunc.TimeTransform('YYYY/MM', data[1]);
        }
        return;
      } else if (this.data.name == 'sign' || this.data.name == 'bid') {
        if (data != '' || data != null) {
          this.dateForm.monthFrom = this.$pubfunc.TimeTransform('YYYY/MM', data[0]);
          this.dateForm.monthTo = this.$pubfunc.TimeTransform('YYYY/MM', data[1]);
        }
        return;
      }
    },
    radioChange (data) {
      switch (data) {
        case 0:
          this.dateForm.year = '';
          this.dateForm.monthFrom = '';
          this.dateForm.monthTo = '';
          break;
        case 1:
          this.dateForm.monthFrom = '';
          this.dateForm.monthTo = '';
          break;
        case 2:
          this.dateForm.year = '';
          break;
        case 3:
          this.dateForm.year = '';
          break;
      }
    },
    yearChange (data) {
      this.clearErr();
      if (data != '' || data != null) {
        this.dateForm.year = this.$pubfunc.TimeTransform('YYYY', data);
      }
    },
    clearErr () {
      this.error.show = false;
    },
    setErr (text) {
      this.error.show = true;
      this.error.msg = text;
      return false
    },
    submit () {
      if (this.ajaxIng) {
        this.$store.commit('alertFn', {
          type: 'warning',
          text: '正在导出报表，请稍后',
        })
        return
      }
      switch (this.data.name) {
        case 'pipeline':
          // if(!this.form.monthFrom||!this.form.monthTo){
          //     return this.setErr('请选择'+this.timeBox[this.data.name]);
          // }
          this.ajaxIng = true;
          this.pipelineExport();
          break;
        case 'commit':
          // if(!this.form.monthFrom||!this.form.monthTo){
          //     return this.setErr('请选择'+this.timeBox[this.data.name]);
          // }
          this.ajaxIng = true;
          this.commitExport();
          break;
        case 'sign':
          if (((this.dateForm.expFlg == 3 || this.dateForm.expFlg == 2) && (!this.dateForm.monthFrom || !this.dateForm.monthTo)) || (this.dateForm.expFlg == 1 && !this.dateForm.year)) {
            return this.setErr('请选择' + this.timeBox[this.data.name]);
          }
          this.ajaxIng = true;
          this.signExport();
          break;
        case 'bid':
          if (((this.dateForm.expFlg == 3 || this.dateForm.expFlg == 2) && (!this.dateForm.monthFrom || !this.dateForm.monthTo)) || (this.dateForm.expFlg == 1 && !this.dateForm.year)) {
            return this.setErr('请选择' + this.timeBox[this.data.name]);
          }
          this.ajaxIng = true;
          this.bidExport();
          break;
      }
    },
    pipelineExport () {
      let param = JSON.parse(JSON.stringify(this.form));
      for (let k in this.data.param) {
        param[k] = this.data.param[k]
      }
      this.$api.download[this.data.tab === '1' ? 'pipelineallexport' : (this.data.tab === '2' ? 'pipelineprojexport' : 'pipelineidcprojexport')](param, res => {
        this.$pubfunc.downloadFile(res, 'pipeline报表' + param.monthFrom.split('/').join('') + '-' + param.monthTo.split('/').join('') + '.xlsx');
        this.ajaxIng = false;
        this.$store.commit('alertFn', {
          type: 'success',
          text: '导出成功',
          func: () => {
            this.$emit('success');
          }
        })
      });
    },
    commitExport () {
      let param = JSON.parse(JSON.stringify(this.form));
      for (let k in this.data.param) {
        param[k] = this.data.param[k]
      }
      this.$api.download[this.data.tab === '1' ? 'commitallexport' : (this.data.tab === '2' ? 'commitprojexport' : 'commitidcprojexport')](param, res => {
        this.$pubfunc.downloadFile(res, 'commit报表' + param.monthFrom.split('/').join('') + '-' + param.monthTo.split('/').join('') + '.xlsx');
        this.ajaxIng = false;
        this.$store.commit('alertFn', {
          type: 'success',
          text: '导出成功',
          func: () => {
            this.$emit('success');
          }
        })
      });
    },
    signExport () {
      let param = JSON.parse(JSON.stringify(this.dateForm));
      for (let k in this.data.param) {
        param[k] = this.data.param[k]
      }
      this.$api.download[this.data.tab === '1' ? 'signallexport' : (this.data.tab === '2' ? 'signprojexport' : 'signidcprojexport')](param, res => {
        let text;
        switch (param.expFlg) {
          case 0: text = ''; break;
          case 1: text = param.year; break;
          case 2: text = this.showValue; break;
          case 3: text = param.monthFrom.split('/').join('') + '-' + param.monthTo.split('/').join(''); break;
        }
        this.$pubfunc.downloadFile(res, '签约项目报表' + text + '.xlsx');
        this.ajaxIng = false;
        this.$store.commit('alertFn', {
          type: 'success',
          text: '导出成功',
          func: () => {
            this.$emit('success');
          }
        })
      });
    },
    bidExport () {
      let param = JSON.parse(JSON.stringify(this.dateForm));
      for (let k in this.data.param) {
        param[k] = this.data.param[k]
      }
      this.$api.download[this.data.tab === '1' ? 'tenderallexport' : (this.data.tab === '2' ? 'tenderprojexport' : 'tenderidcprojexport')](param, res => {
        let text;
        switch (param.expFlg) {
          case 0: text = ''; break;
          case 1: text = param.year; break;
          case 2: text = this.showValue; break;
          case 3: text = param.monthFrom.split('/').join('') + '-' + param.monthTo.split('/').join(''); break;
        }
        this.$pubfunc.downloadFile(res, '投标项目报表' + text + '.xlsx');
        this.ajaxIng = false;
        this.$store.commit('alertFn', {
          type: 'success',
          text: '导出成功',
          func: () => {
            this.$emit('success');
          }
        })
      });
    }
  },
  created () {
    // console.log(this.data.name)
  },
  mounted () {
    this.$emit('ok');
  }
}
</script>


<style scoped>
.exportDialog .radioGroup {
  /* margin-bottom: 20px; */
  box-sizing: content-box;
  padding-left: 120px;
  width: 324px;
  overflow: hidden;
  text-indent: 0;
  text-align: left;
}
.exportDialog > li {
  width: 100%;
  /* overflow: hidden; */
}
.exportDialog > li.noPad {
  padding-bottom: 0;
}
.exportDialog > li .el-date-editor.el-input,
.exportDialog > li .input,
.exportDialog > li .el-date-editor.el-input__inner {
  width: 324px !important;
}
.exportDialog > li .input {
  line-height: 30px;
}
.exportDialog {
  width: 100%;
  padding: 4px 35px 0;
  box-sizing: border-box;
  font-size: 0;
}
/* .exportDialog>li{
    padding-top: 5px;
} */
.exportDialog > li:nth-child(1) {
  padding-top: 16px;
}
.exportDialog > li > input {
  width: 324px;
}
.exportDialog > li > div.btnBox {
  padding-top: 60px;
}
.exportDialog.formUl > li > span.formTitle {
  padding-left: 0;
  width: 140px;
}
.exportDialog.formUl > li u.error {
  width: 322px !important;
  left: 120px;
}
</style>
<style>
.seasonPopover {
  padding: 0;
  border: 0;
  box-shadow: none;
}
.seasonPopover .el-card__header {
  padding: 10px 20px;
}
.seasonPopover .el-picker-panel__icon-btn:hover {
  color: #4780f4;
}
.seasonPopover .text.item {
  font-size: 0px;
}
.seasonPopover .el-button + .el-button {
  margin-left: 18%;
  font-size: 14px;
}
.seasonPopover .box-card {
  box-shadow: unset;
  border-radius: 2px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-color: #8fb4fc;
}
.seasonPopover .el-date-picker__header-label {
  cursor: auto;
  color: #606266;
}
.seasonPopover .el-button--text {
  color: #606266;
}
.seasonPopover .el-button--text:hover,
.seasonPopover .el-button--text.active {
  color: #4780f4;
}
.seasonPopover .el-button--text.active > span {
  font-weight: bold;
}
.exportDialog .treeChoose .el-scrollbar__wrap {
  overflow-x: hidden;
  margin-bottom: 0;
  padding: 0;
}
.exportDialog .el-date-editor .el-range-separator {
  line-height: 25px;
}
.exportDialog .el-date-editor .el-range__icon {
  line-height: 30px;
}
.exportDialog .el-date-editor .el-range-input {
  background: transparent;
}
.exportDialog .el-input__icon {
  line-height: 32px;
}
.exportDialog > li .el-date-editor.el-input,
.exportDialog > li .el-date-editor.el-input__inner {
  width: 324px !important;
}
.exportDialog > li .elTimebox .el-input--prefix .el-input__inner {
  padding-right: 30px;
}
.exportDialog .el-input--prefix .el-input__inner:focus,
.exportDialog > li .elFocus .el-input--prefix .el-input__inner {
  /* padding-left: 36px; */
  border-color: #8fb4fc;
}
.exportDialog > li .el-input__prefix {
  left: auto;
  right: 3px;
  color: #95a0bd;
  font-size: 16px;
  opacity: 0.6;
  -webkit-transition: opacity 0.2s ease;
  transition: opacity 0.2s ease;
}
.exportDialog > li .elTimebox:hover .el-input__prefix,
.exportDialog > li .elFocus .el-input__prefix {
  opacity: 1;
}
.exportDialog > li .elTimebox.el-date-editor .el-range__icon {
  top: 0px;
}
</style>