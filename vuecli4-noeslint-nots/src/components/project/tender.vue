<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='policymarkerSupport'}">
          <span class="formTitle">决策人支持：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.policymarkerSupportTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="policymarkerSupport"
                         :list="policymarkerSupport"
                         @change='dropdownReturn'
                         :result='result.policymarkerSupport'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='policymarkerSupport'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='tenderTime'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&Number(data.winRate)>=80">*</i>投标时间：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.tenderTime)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='projectEdit'&&!role"
                     placeholder=''
                     :value='result.tenderTime'
                     id='tenderTime'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderTime'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='tenderResult'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&data.projStatus==='02'&&data.buyType!=='04'">*</i>投标结果：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.tenderResultTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="tenderResult"
                         :list="tenderResult"
                         @change='dropdownReturn'
                         :result='result.tenderResult'
                         :clear="data.projStatus==='02'&&data.buyType!=='04'?false:true"></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderResult'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='projStatusReason'}"
            v-if="result.tenderResult==='02'">
          <span class="formTitle">
            <i class="must"
               v-if="name==='projectEdit'&&!role">*</i>
            落标原因：
          </span>
          <div  v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(result.projStatusReason)"
                          :lines="3"></unit-popover>
          </div>
          <textarea v-if="name==='projectEdit'&&!role"
                    class="input"
                    v-model="result.projStatusReason"
                    maxlength="500"
                    @input="clearErr('projStatusReason')"></textarea>
          <transition name="publicTransition">
            <u class="error"
               v-if="error.key==='projStatusReason'">{{error.msg}}</u>
          </transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='tenderAmount_'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&result.tenderResult==='01'">*</i>中标金额：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt($pubfunc.transformPrice(data.tenderAmount,true),'money')"></unit-popover>
          </div>
          <input class="moneyInput"
                 v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.tenderAmount_"
                 maxlength="30"
                 @input="clearErr('tenderAmount_')"
                 @blur="inputBlur"><i v-if="name==='projectEdit'&&!role">元</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderAmount_'">{{error.msg}}</u></transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'projtender',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  components: { unitPopover, unitTime },
  inject: ['cancel'],
  data () {
    return {
      result: {
        policymarkerSupport: '',
        tenderTime: '',
        tenderResult: '',
        tenderAmount: '',
        tenderAmount_: '',
      },
      policymarkerSupport: [],
      tenderResult: [],
      error: {
        key: null,
        msg: '',
      },
    }
  },
  filters: {
    emptyTxt (v) {
      return v ? v : '--'
    }
  },
  watch: {
    'name' (v) {
      v === 'projectEdit' ? this.getDropData() : null;
      this.clearErr();
    },
    'result.commitConfirm' (v) {
      this.clearErr('commitConfirm', 'commitConfirmReason')
      this.result.commitConfirmReason === undefined ? null : this.result.commitConfirmReason = ''
    }
  },
  methods: {
    emptyTxt (v, money) {
      return v ? v + (money ? ' 元' : '') : '--'
    },
    inputBlur () {
      this.result.tenderAmount_ = this.$pubfunc.transformPrice(this.result.tenderAmount_, true);
      this.result.tenderAmount = this.result.tenderAmount_.split(',').join('');
    },
    getDropData () {
      this.policymarkerSupport && this.policymarkerSupport.length > 0 ? null : this.$api.public.dict({ codeGroup: 'policymarker_support', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.policymarkerSupport = res.data ? res.data : [];
            break;
        }
      });
      this.tenderResult && this.tenderResult.length > 0 ? null : this.$api.public.dict({ codeGroup: 'tender_result', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.tenderResult = res.data ? res.data : [];
            break;
        }
      });
      for (let k in this.result) {
        this.result[k] = this.data[k]
      }
      this.result.tenderAmount_ = this.$pubfunc.transformPrice(this.result.tenderAmount, true)
    },
    dropdownReturn (res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case 'tenderTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res);
          break;
        default:
          this.result[key] = res.value;
      }
    },
    setErr (key, text) {
      this.$store.commit('alertFn', {
        type: 'error',
        text: '保存失败，请修改对应的错误内容',
        time: 2000
      })
      this.error.key = key;
      this.error.msg = text;
      return false
    },
    clearErr (key) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
    },
    submit (cb) {
      if (this.loading) { return; }
      if (Number(this.data.winRate) >= 80 && !this.result.tenderTime) {
        return this.setErr('tenderTime', '请选择投标时间');
      }
      if (this.data.projStatus === '02' && this.data.buyType !== '04' && !this.$pubfunc.replaceSpace(this.result.tenderResult, 4)) {
        return this.setErr('tenderResult', '请输入投标结果');
      }
      if (this.result.tenderResult === '02' && !this.result.projStatusReason) {
        return this.setErr('projStatusReason', '请输入落标原因');
      }
      if (this.result.tenderResult === '01' && (!this.$pubfunc.replaceSpace(this.result.tenderAmount_, 1) || !this.$pubfunc.replaceSpace(this.result.tenderAmount, 1))) {
        return this.setErr('tenderAmount_', '请输入中标金额');
      }
      let param = {
        projId: this.data.projId
      }, hasChange = false;
      for (let k in this.result) {
        (this.result[k] ? this.result[k] : '') != (this.data[k] ? this.data[k] : '') && k !== 'tenderAmount_' ? hasChange = true : null;
        param[k] = this.result[k]
      }
      delete param.tenderAmount_;
      // console.log(param,hasChange)
      if (hasChange && !this.role) {
        cb ? this.$store.commit('confirmFn', {
          func: () => {
            this.ajaxFn(param, cb)
          },
          cancel: () => {
            cb();
          },
          text: '是否保存您本页更改的信息？<br/>取消即放弃保存修改'
        }) : this.ajaxFn(param, cb)
      } else {
        cb ? cb() : this.cancel(true)
      }
    },
    ajaxFn (param, cb) {
      this.$emit('loadingfn', true)
      this.$api.service.project.savetender(param, res => {
        // console.log(res)
        this.$emit('loadingfn', false)
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: this.role ? '操作成功' : '保存成功',
              func: () => {
                cb ? cb() : this.cancel(true)
              }
            })
            break;
          default:
            res.message ? this.$store.commit('alertFn', {
              type: 'error',
              text: res.message,
            }) : null
        }
      })
    },
  },
  created () {
    // console.log(this.data)
    if (!this.data.projId) {
      return
    }
    this.name === 'projectEdit' && !this.role ? this.getDropData() : null;
    this.result.projStatusReason=this.data.projStatusReason
    this.result.tenderResult=this.data.tenderResult
    this.$emit('ok');
  },
  mounted () { },
}
</script>

<style scoped>
.formMainTitle > a {
  color: #999;
  font-size: 12px;
}
.formMainCont {
  font-size: 0;
}
.formUl {
  display: block;
  width: 33.33333%;
  min-width: 300px;
  margin: 0 auto;
}
ul.formUl {
  padding-bottom: 0px;
}
.formUl > li {
  position: relative;
  padding-left: 100px;
}
.formUl > li > span.formTitle {
  width: 200px;
  margin-left: -200px;
}
.formUl > li > div,
.formUl > li > input {
  width: 100%;
}
.formUl > li u.error {
  left: 0;
  width: 100% !important;
}
textarea.input {
  height: 82px;
  width: 100%;
  line-height: 20px;
  padding: 5px 10px;
}
</style>
<style>
.projectRequire .textEllipse3 {
  max-height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
</style>