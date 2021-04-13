<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='planSignDate'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&(data.tenderResult==='01'||data.projStatus==='02')">*</i>预计签约日期：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.planSignDate)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='projectEdit'&&!role"
                     placeholder=''
                     :value='result.planSignDate'
                     id='planSignDate'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='planSignDate'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='actualSignDate'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&(data.projStatus==='03'||result.contractStatus==='01')">*</i>实际签约日期：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.actualSignDate)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='projectEdit'&&!role"
                     placeholder=''
                     :value='result.actualSignDate'
                     id='actualSignDate'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='actualSignDate'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='actualSignAmount_'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&(data.projStatus==='03'||result.contractStatus==='01')">*</i>实际签约金额：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt($pubfunc.transformPrice(data.actualSignAmount,true),'money')"></unit-popover>
          </div>
          <input class="moneyInput"
                 v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.actualSignAmount_"
                 maxlength="30"
                 @input="clearErr('actualSignAmount_')"
                 @blur="inputBlur"><i v-if="name==='projectEdit'&&!role">元</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='actualSignAmount_'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role}">
          <span class="formTitle">预计收款日期：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.estimatedCollectionDate)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='projectEdit'&&!role"
                     placeholder=''
                     :value='result.estimatedCollectionDate'
                     id='estimatedCollectionDate'
                     @return='dropdownReturn'></unit-time>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='contractStatus'}">
          <span class="formTitle"><i class="must"
               v-if="name==='projectEdit'&&!role&&(data.tenderResult==='01'||data.projStatus==='02')">*</i>合同状态：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.contractStatusTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="contractStatus"
                         :list="contractStatus"
                         @change='dropdownReturn'
                         :result='result.contractStatus'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='contractStatus'">{{error.msg}}</u></transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'projsign',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  components: { unitPopover, unitTime },
  inject: ['cancel'],
  data () {
    return {
      result: {
        planSignDate: '',
        actualSignDate: '',
        actualSignAmount: '',
        actualSignAmount_: '',
        contractStatus: '',
        estimatedCollectionDate: ''
      },
      contractStatus: [],
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
      this.result.actualSignAmount_ = this.$pubfunc.transformPrice(this.result.actualSignAmount_, true);
      this.result.actualSignAmount = this.result.actualSignAmount_.split(',').join('');
    },
    getDropData () {
      this.contractStatus && this.contractStatus.length > 0 ? null : this.$api.public.dict({ codeGroup: 'contract_status', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.contractStatus = res.data ? res.data : [];
            break;
        }
      });
      for (let k in this.result) {
        this.result[k] = this.data[k]
      }
      this.result.actualSignAmount_ = this.$pubfunc.transformPrice(this.result.actualSignAmount, true)
    },
    dropdownReturn (res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case 'planSignDate':
        case 'actualSignDate':
        case 'estimatedCollectionDate':
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
      if ((this.data.tenderResult === '01' || this.data.projStatus === '02') && !this.result.planSignDate) {
        return this.setErr('planSignDate', '请选择预计签约日期');
      }
      if ((this.data.projStatus === '03' || this.result.contractStatus === '01') && !this.result.actualSignDate) {
        return this.setErr('actualSignDate', '请选择实际签约日期');
      }
      if ((this.data.projStatus === '03' || this.result.contractStatus === '01') && (!this.$pubfunc.replaceSpace(this.result.actualSignAmount_, 1) || !this.$pubfunc.replaceSpace(this.result.actualSignAmount, 1))) {
        return this.setErr('actualSignAmount_', '请填写实际签约金额');
      }
      if ((this.data.tenderResult === '01' || this.data.projStatus === '02') && !this.result.contractStatus) {
        return this.setErr('contractStatus', '请选择合同状态');
      }
      let param = {
        projId: this.data.projId
      }, hasChange = false;
      for (let k in this.result) {
        (this.result[k] ? this.result[k] : '') != (this.data[k] ? this.data[k] : '') && k !== 'actualSignAmount_' ? hasChange = true : null;
        param[k] = this.result[k]
      }
      delete param.actualSignAmount_;
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
      this.$api.service.project.savesign(param, res => {
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
    console.log(this.data)
    if (!this.data.projId) {
      return
    }
    this.name === 'projectEdit' && !this.role ? this.getDropData() : null;
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
</style>
<style>
.projectRequire .textEllipse3 {
  max-height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
</style>