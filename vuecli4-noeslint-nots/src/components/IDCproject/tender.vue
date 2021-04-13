<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-14 09:48:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-03 14:43:21
--> 
<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='signPossible'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role">*</i>是否可签约：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.signPossibleTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="signPossible"
                         :list="signPossibleList"
                         @change='dropdownReturn'
                         :result='result.signPossible'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='signPossible'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='majorSupport'}">
          <span class="formTitle">多数人支持：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.majorSupportTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="majorSupportArr"
                         :list="majorSupportList"
                         @change='dropdownReturn'
                         :result='result.majorSupportArr'
                         :multiple='true'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='majorSupport'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='keyPersonSupport'}">
          <span class="formTitle">关键人支持：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.keyPersonSupportTxt)"
                          :text='true'></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="keyPersonSupportArr"
                         :list="keyPersonSupportList"
                         @change='dropdownReturn'
                         :result='result.keyPersonSupportArr'
                         :multiple='true'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='keyPersonSupport'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='tenderTime'}">
          <span class="formTitle">投标时间：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.tenderTime)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :value='result.tenderTime'
                     id='tenderTime'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderTime'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='tenderResult'}">
          <span class="formTitle">投标结果：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.tenderResultTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="tenderResult"
                         :list="tenderResultList"
                         @change='dropdownReturn'
                         :result='result.tenderResult'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderResult'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='projStatusReason'}"
            v-if="result.tenderResult==='02'">
          <span class="formTitle">
            <i class="must"
               v-if="name==='IDCProjectEdit'&&!role">*</i>
            落标原因：
          </span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.projStatusReason)"
                          :lines="3"></unit-popover>
          </div>
          <textarea v-if="name==='IDCProjectEdit'&&!role"
                    class="input"
                    v-model="result.projStatusReason"
                    maxlength="500"
                    @input="clearErr('projStatusReason')"></textarea>
          <transition name="publicTransition">
            <u class="error"
               v-if="error.key==='projStatusReason'">{{error.msg}}</u>
          </transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='tenderAmount_'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role&&result.tenderResult==='01'">*</i>中标金额：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.tenderAmount_)+' '+'元'"></unit-popover>
          </div>
          <input class="moneyInput"
                 v-if="name==='IDCProjectEdit'&&!role"
                 type="text"
                 v-model="result.tenderAmount_"
                 maxlength="30"
                 @input="int('tenderAmount_')"
                 @blur="inputBlur"><i v-if="name==='IDCProjectEdit'&&!role">元</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='tenderAmount_'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='scheduleDescription'}">
          <span class="formTitle"><i class="must"
               v-if="(data.projStage==='03'||data.projStage==='04')&&name==='IDCProjectEdit'">*</i>项目进度说明：</span>
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
  name: 'projtender',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  components: { unitPopover, unitTime },
  inject: ['cancel'],
  data() {
    return {
      result: {
        signPossible: '',
        majorSupport: '',
        majorSupportArr: [],
        keyPersonSupport: '',
        keyPersonSupportArr: [],
        tenderTime: '',
        tenderResult: '',
        projStatusReason:'',
        tenderAmount: '',
        tenderAmount_: '',
        scheduleDescription: '',
      },
      signPossibleList: [
        { value: '0', label: '否' },
        { value: '1', label: '是' },
      ],
      majorSupportList: [],
      keyPersonSupportList: [],
      tenderResultList: [],
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
      console.log(this.data)
      if (v === 'IDCProjectEdit') {
        this.getDropData()
      } else {
        this.data.tenderAmount_ = this.$pubfunc.transformPrice(
          this.data.tenderAmount,
          true,
        )
        this.data.signPossible === 1
          ? (this.data.signPossibleTxt = '是')
          : (this.data.signPossibleTxt = '否')
      }
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
    getDropData() {
      this.majorSupportList && this.majorSupportList.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'major_support', pCode: '' },
            res => {
              switch (res.code) {
                case '0':
                  this.majorSupportList = res.data ? res.data : []
                  break
              }
            },
          )
      this.keyPersonSupportList && this.keyPersonSupportList.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'key_person_support', pCode: '' },
            res => {
              switch (res.code) {
                case '0':
                  this.keyPersonSupportList = res.data ? res.data : []
                  break
              }
            },
          )
      this.tenderResultList && this.tenderResultList.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'tender_result', pCode: '' },
            res => {
              // console.log(res)
              switch (res.code) {
                case '0':
                  this.tenderResultList = res.data ? res.data : []
                  break
              }
            },
          )
      for (let k in this.result) {
        this.result[k] = this.data[k]
      }
      this.result.signPossible = this.result.signPossible.toString()
      this.result.tenderAmount_ = this.$pubfunc.transformPrice(
        this.result.tenderAmount,
        true,
      )
    },
    int(key) {
      this.clearErr(key)
      this.result[key] = this.result[key].replace(/[^\d.]/g, '')
      this.result[key] = this.result[key].replace(/^\./g, '')
      // this.result[key] = this.result[key].replace(/\.\d\d\d$/, '')
      this.result[key] = this.result[key].replace(/\.{2,}/g, '')
      this.result[key] = this.result[key]
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      this.result[key] =
        this.result[key].indexOf('.') > 0
          ? this.result[key].split('.')[0].substring(0, 12) +
            '.' +
            this.result[key].split('.')[1].substring(0, 2)
          : this.result[key].substring(0, 12)

      // if (parseFloat(this.result[key]) == 0) {
      // this.result[key] = '0'
      // }
      if (this.result[key].length > 1 && this.result[key][0] === '0') {
        this.result[key] = this.result[key].slice(1)
      }
      return this.result[key]
    },
    inputBlur() {
      this.result.tenderAmount_ = this.$pubfunc.transformPrice(
        this.result.tenderAmount_,
        true,
      )
      this.result.tenderAmount = this.result.tenderAmount_.split(',').join('')
    },
    dropdownReturn(res, key) {
      this.clearErr(key)
      switch (key) {
        case 'signPossible':
          this.result.signPossible = res.value
          break
        case 'majorSupportArr':
        case 'keyPersonSupportArr':
          this.result[key] = res.reduce((arr, item) => {
            return arr.concat(item.value)
          }, [])
          console.log(this.result)
          break
        case 'tenderResult':
          this.result.tenderResult = res.value
          break
        case 'tenderTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
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
      let param = {
          projId: this.data.projId,
        },
        hasChange = false
      if (!this.result.signPossible) {
        return this.setErr('signPossible', '请选择是否可签约')
      }
      if (this.result.tenderResult === '02' && !this.result.projStatusReason) {
        return this.setErr('projStatusReason', '请输入落标原因');
      }
      if (!this.result.scheduleDescription) {
        return this.setErr('scheduleDescription', '请输入项目进度说明')
      }
      for (let k in this.result) {
        ;(this.result[k] ? this.result[k] : '') !=
          (this.data[k] ? this.data[k] : '') && k !== 'tenderAmount_'
          ? (hasChange = true)
          : null
        param[k] = this.result[k]
      }
      delete param.tenderAmount_
      if (param.tenderResult === '01') {
        if (!param.tenderAmount) {
          return this.setErr('tenderAmount_', '请填写中标金额')
        }
      }
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
      // this.$emit('loadingfn', true)
      param.keyPersonSupportArr ? null : (param.keyPersonSupportArr = [])
      param.majorSupportArr ? null : (param.majorSupportArr = [])
      this.$api.service.IDCproject.savetender(param, res => {
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
    if (this.name === 'IDCProjectEdit' && !this.role) {
      this.getDropData()
    }
    this.result.projStatusReason=this.data.projStatusReason
    this.result.tenderResult=this.data.tenderResult
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