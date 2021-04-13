<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-14 09:48:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-23 13:48:25
--> 
<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='haveVisitedRoom'}">
          <span class="formTitle"><i class="must"
               v-if="name==='IDCProjectEdit'&&!role">*</i>是否参观过机房：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.haveVisitedRoomTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='IDCProjectEdit'&&!role"
                         id="haveVisitedRoom"
                         :list="haveVisitedRoomList"
                         @change='dropdownReturn'
                         :result='result.haveVisitedRoom'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='haveVisitedRoom'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">参观时间：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.visitTime)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :value='result.visitTime'
                     id='visitTime'
                     :clear='true'
                     @return='dropdownReturn'></unit-time>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='visitIdcRoom'}">
          <span class="formTitle"><i class="must"
               v-show="result.haveVisitedRoom==='1'">*</i>参观机房：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.visitIdcRoomTxt)"></unit-popover>
          </div>
          <unit-dropdown id="visitIdcRoom"
                         class="auto"
                         v-if="!role&&(name==='IDCProjectEdit')"
                         :list="visitIdcRoomList"
                         @change='dropdownReturn'
                         :result='result.visitIdcRoom'></unit-dropdown>

          <transition name="publicTransition"><u class="error"
               v-if="error.key==='visitIdcRoom'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='visitor'}">
          <span class="formTitle"><i class="must"
               v-show="result.haveVisitedRoom==='1'">*</i>参观人员及职务：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.visitor)"></unit-popover>
          </div>
          <input id="visitor"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="clearErr('visitor')"
                 v-model='result.visitor'></input>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='visitor'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role,'errorBorder':error.key==='receptionName'}">
          <span class="formTitle"><i class="must"
               v-show="result.haveVisitedRoom==='1'">*</i>参观接待人员：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.receptionName)"></unit-popover>
          </div>
          <input id="receptionName"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="clearErr('receptionName')"
                 v-model='result.receptionName'></input>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='receptionName'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">测试开始时间：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.testStartTime)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :value='result.testStartTime'
                     id='testStartTime'
                     :clear='true'
                     @return='dropdownReturn'></unit-time>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">测试截止时间：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.testEndTime)"></unit-popover>
          </div>
          <unit-time class="auto"
                     v-if="name==='IDCProjectEdit'&&!role"
                     placeholder=''
                     :value='result.testEndTime'
                     id='testEndTime'
                     :clear='true'
                     @return='dropdownReturn'></unit-time>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">测试机型及数量：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.testTypeAndNumber)"></unit-popover>
          </div>
          <input id="testTypeAndNumber"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="clearErr('testTypeAndNumber')"
                 v-model='result.testTypeAndNumber'></input>
        </li>
        <li :class="{'small':name==='IDCProjectView'||role}">
          <span class="formTitle">测试内容：</span>
          <div v-if="name==='IDCProjectView'||role">
            <unit-popover :content="emptyTxt(data.testContent)"></unit-popover>
          </div>
          <textarea v-if="name==='IDCProjectEdit'&&!role"
                    class="input"
                    v-model="result.testContent"
                    maxlength="500"
                    @input="clearErr('testContent')"></textarea>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'projVisit',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  inject: ['cancel'],
  components: {
    unitPopover,
    unitTime,
  },
  data() {
    return {
      haveVisitedRoomList: [
        { value: '0', label: '否' },
        { value: '1', label: '是' },
      ],
      visitTimeList: [],
      visitIdcRoomList: [],
      visitorList: [],
      receptionNameList: [],
      testStartTimeList: [],
      testEndTimeList: [],
      testTypeAndNumberList: [],
      testContentList: [],
      result: {
        haveVisitedRoom: '',
        visitTime: '',
        visitIdcRoom: '',
        visitor: '',
        receptionName: '',
        testStartTime: '',
        testEndTime: '',
        testTypeAndNumber: '',
        testContent: '',
      },
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
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let isCharge =
          userInfo.info &&
          userInfo.info.staff &&
          userInfo.info.staff.isCharge === '1'
            ? true
            : false,
        staffId =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffId
            : null
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === '1'
      return { isCharge, staffId, isAdmin }
    },
  },
  methods: {
    emptyTxt(v, money) {
      return v ? v + (money ? ' 元' : '') : '--'
    },
    dropdownReturn(res, key) {
      this.clearErr(key)
      switch (key) {
        case 'haveVisitedRoom':
          this.result.haveVisitedRoom = res.value
          break
        case 'testStartTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        case 'testEndTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        case 'visitTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        default:
          this.result[key] = res.value
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
      if (!this.result.haveVisitedRoom) {
        return this.setErr('haveVisitedRoom', '请选择是否参观过机房')
      }
      if (this.result.haveVisitedRoom === '1') {
        if (!this.result.visitIdcRoom) {
          return this.setErr('visitIdcRoom', '请输入参观机房')
        }
        if (!this.result.visitor) {
          return this.setErr('visitor', '请输入参观人员及职务')
        }
        if (!this.result.receptionName) {
          return this.setErr('receptionName', '请输入参观接待人员')
        }
      }
      for (let k in this.result) {
        if (k !== 'src') {
          ;(this.result[k] ? this.result[k] : '') !=
          (this.data[k] ? this.data[k] : '')
            ? (hasChange = true)
            : null
        }
        param[k] = this.result[k]
      }
      if (hasChange && !this.role) {
        delete param.src
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
      this.$api.service.IDCproject.savevisitandtest(param, res => {
        this.$emit('loadingfn', false)
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: this.role ? '操作成功' : '保存成功',
              func: () => {
                console.log(this.cancel)
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
    getDropData() {
      this.$api.service.IDCproject.idcroomlist({}, res => {
        switch (res.code) {
          case '0':
            let list = []
            ;(res.data ? res.data : []).map(v => {
              list.push({
                value: v.roomId,
                label: v.roomName,
              })
            })
            this.visitIdcRoomList = list
            break
        }
      })
      if (!this.role) {
        for (let k in this.result) {
          k !== 'projStatusReason' ? (this.result[k] = this.data[k]) : null
        }
        this.result.haveVisitedRoom = this.result.haveVisitedRoom.toString()
      }
    },
    ajaxingChang(j) {
      // console.log(j)
      this.ajaxIng = j
    },
    showDialog(data) {
      // console.log(data)
      this.$emit('dialog', data)
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
  width: 100%;
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