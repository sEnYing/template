<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-14 09:48:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-04 09:38:07
--> 
<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">预计签约日期：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.planSignDate)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :clear='true'
                     :value='result.planSignDate'
                     id='planSignDate'
                     @return='dropdownReturn'></unit-time>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='actualSignDate'}">
          <span class="formTitle">实际签约日期：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.actualSignDate)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :clear='true'
                     :value='result.actualSignDate'
                     id='actualSignDate'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='actualSignDate'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='estAnnualSignedAmount_'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role&&result.actualSignDate">*</i>预计签约年合同额：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt($pubfunc.transformPrice(data.estAnnualSignedAmount,true),'money')"></unit-popover>
          </div>
          <input class="moneyInput"
                 v-if="name==='IDCProjectEdit'&&!role"
                 type="text"
                 v-model="result.estAnnualSignedAmount_"
                 maxlength="30"
                 @input="clearErr('estAnnualSignedAmount_')"
                 @blur="inputBlur"><i v-if="name==='IDCProjectEdit'&&!role">元</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='estAnnualSignedAmount_'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='contractStatus'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role&&result.actualSignDate">*</i>合同状态：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.contractStatusTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="contractStatus"
                         :list="contractStatus"
                         @change='dropdownReturn'
                         :result='result.contractStatus'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='contractStatus'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='scheduleDescription'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role">*</i>项目进度说明：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.scheduleDescription)"></unit-popover>
          </div>
          <textarea id="scheduleDescription"
                    v-if="!role&&(name==='IDCProjectEdit')"
                    class="input"
                    maxlength="500"
                    @input="clearErr('scheduleDescription')"
                    v-model='result.scheduleDescription'></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='scheduleDescription'">{{error.msg}}</u></transition>
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
  data() {
    return {
      result: {
        planSignDate: '',
        actualSignDate: '',
        estAnnualSignedAmount: '',
        estAnnualSignedAmount_: '',
        contractStatus: '',
        scheduleDescription: '',
      },
      contractStatus: [],
      error: {
        key: null,
        msg: '',
      },
    }
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    },
  },
  watch: {
    name(v) {
      v === 'IDCProjectEdit' ? this.getDropData() : null
      this.clearErr()
    },
    'result.commitConfirm'(v) {
      this.clearErr('commitConfirm', 'commitConfirmReason')
      this.result.commitConfirmReason === undefined
        ? null
        : (this.result.commitConfirmReason = '')
    },
  },
  methods: {
    emptyTxt(v, money) {
      return v ? v + (money ? ' 元' : '') : '--'
    },
    inputBlur() {
      this.result.estAnnualSignedAmount_ = this.$pubfunc.transformPrice(
        this.result.estAnnualSignedAmount_,
        true,
      )
      this.result.estAnnualSignedAmount = this.result.estAnnualSignedAmount_
        .split(',')
        .join('')
    },
    getDropData() {
      this.contractStatus && this.contractStatus.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'contract_status', pCode: '' },
            res => {
              // console.log(res)
              switch (res.code) {
                case '0':
                  this.contractStatus = res.data ? res.data : []
                  break
              }
            },
          )
      for (let k in this.result) {
        this.result[k] = this.data[k]
      }
      this.result.estAnnualSignedAmount_ = this.$pubfunc.transformPrice(
        this.result.estAnnualSignedAmount,
        true,
      )
    },
    dropdownReturn(res, key) {
      this.clearErr(key)
      switch (key) {
        case 'planSignDate':
        case 'actualSignDate':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        case 'contractStatus':
          this.result.contractStatus = res.value
          break
      }
    },
    setErr(key, text) {
      this.$store.commit('alertFn', {
        type: 'error',
        text: '保存失败，请修改对应的错误内容',
        time: 2000,
      })
      this.error.key = key
      this.error.msg = text
      return false
    },
    clearErr(key) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
    },
    submit(cb) {
      if (this.loading) {
        return
      }
      if (
        this.result.actualSignDate &&
        (!this.$pubfunc.replaceSpace(this.result.estAnnualSignedAmount_, 1) ||
          !this.$pubfunc.replaceSpace(this.result.estAnnualSignedAmount, 1))
      ) {
        return this.setErr('estAnnualSignedAmount_', '请填写预计签约年合同额')
      }
      if (this.result.actualSignDate && !this.result.contractStatus) {
        return this.setErr('contractStatus', '请选择合同状态')
      }
      if (!this.result.scheduleDescription) {
        return this.setErr('scheduleDescription', '请输入项目进度说明')
      }
      let param = {
          projId: this.data.projId,
        },
        hasChange = false
      for (let k in this.result) {
        ;(this.result[k] ? this.result[k] : '') !=
          (this.data[k] ? this.data[k] : '') && k !== 'actualSignAmount_'
          ? (hasChange = true)
          : null
        param[k] = this.result[k]
      }
      delete param.actualSignAmount_
      if (hasChange && !this.role) {
        cb
          ? this.$store.commit('confirmFn', {
              func: () => {
                this.ajaxFn(param, cb)
              },
              cancel: () => {
                cb()
              },
              text: '是否保存您本页更改的信息？<br/>取消即放弃保存修改',
            })
          : this.ajaxFn(param, cb)
      } else {
        cb ? cb() : this.cancel(true)
      }
    },
    ajaxFn(param, cb) {
      this.$emit('loadingfn', true)
      this.$api.service.IDCproject.savesign(param, res => {
        this.$emit('loadingfn', false)
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: this.role ? '操作成功' : '保存成功',
              func: () => {
                cb ? cb() : this.cancel(true)
              },
            })
            break
          default:
            res.message
              ? this.$store.commit('alertFn', {
                  type: 'error',
                  text: res.message,
                })
              : null
        }
      })
    },
  },
  created() {
    if (!this.data.projId) {
      return
    }
    this.name === 'IDCProjectEdit' && !this.role ? this.getDropData() : null
    this.$emit('ok')
  },
  mounted() {},
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