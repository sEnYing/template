<template>
  <div>
    <ul class="formUl projDialog">
      <li :class="{'small':key==='view','errorBorder':error.key==='projId','resultView':key==='view'}">
        <span class="formTitle"><i class="must"
             v-if="key!=='view'">*</i>项目名称：</span>
        <div v-if="key!=='add'">{{result.projName|emptyTxt}}</div>
        <unit-project v-if="key==='add'"
                      id="projId"
                      placeholder=''
                      @change='dropdownReturn'
                      :clear='true'
                      :input="true"
                      :result='result.projId'></unit-project>
        <transition name="publicTransition"><u class="error"
             v-if="error.key==='projId'">{{error.msg}}</u></transition>
      </li>
      <li :class="{'small':true}">
        <span class="formTitle">客户名称：</span>
        <div>{{result.customerName|emptyTxt}}</div>
      </li>
      <li :class="{'small':key==='view','errorBorder':error.key==='conditionDesc'}">
        <span class="formTitle"><i class="must"
             v-if="key!=='view'">*</i>情况说明：</span>
        <div v-if="key==='view'"
             class="bigCont"
             v-html="emptyTxt($pubfunc.replaceBr(result.conditionDesc,1))"></div>
        <textarea class="input"
                  v-if="key!=='view'"
                  v-model="result.conditionDesc"
                  placeholder=""
                  type="text"
                  maxlength="200"
                  @input="clearErr('conditionDesc')"></textarea>
        <transition name="publicTransition"><u class="error"
             v-if="error.key==='conditionDesc'">{{error.msg}}</u></transition>
      </li>
      <li class="btnBoxLi">
        <div class="btnBox">
          <unit-btn @click="submit"
                    :loading='loading'
                    :text='btnTxt[key]'></unit-btn>
          <unit-btn type='plain'
                    @click="close"
                    text='取消'
                    v-if="key!=='view'"></unit-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import unitProject from '@/unit/components/thisUnit/project'
export default {
  name: 'pointProjDialog',
  props: ['data'],
  components: { unitProject },
  data() {
    return {
      key: null,
      edit: false,
      result: {
        projId: '',
        customerId: '',
        customerName: '',
        conditionDesc: '',
      },
      error: {
        key: null,
        msg: '',
      },
      loading: false,
      reset: false,
      btnTxt: {
        add: '创建',
        edit: '确定',
        view: '确定',
      },
    }
  },
  inject: ['close'],
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    },
  },
  methods: {
    emptyTxt(v) {
      return v ? v : '--'
    },
    getDropData() {
      if (this.data.item) {
        if (this.edit) {
          for (let k in this.result) {
            this.result[k] = this.data.item[k]
          }
        } else {
          for (let k in this.data.item) {
            this.result[k] = this.data.item[k]
          }
        }
      }
    },
    dropdownReturn(res, key, judge) {
      console.log(res, key, judge)
      this.clearErr(key)
      switch (key) {
        case 'projId':
          this.result[key] = res.value
          this.result.projName = res.label
          this.result.customerId = res.extend.customerId
          this.result.customerName = res.extend.customerName
          break
      }
    },
    setErr(key, text) {
      this.error.key = key
      this.error.msg = text
      return false
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key])
      }
    },
    submit() {
      if (this.key === 'view') {
        this.close()
        return
      }
      if (this.loading) {
        return
      }
      this.clearErr()
      if (!this.result.projId) {
        return this.setErr('projId', '请选择重点项目')
      } else if (this.key === 'add') {
        let arr = this.data.arr
        for (let i in arr) {
          if (arr[i].projId === this.result.projId) {
            return this.setErr('projId', '您已添加该项目，请重新选择')
          }
        }
      }
      if (!this.$pubfunc.replaceSpace(this.result.conditionDesc, 1)) {
        return this.setErr('conditionDesc', '请填写情况说明')
      }
      let param = JSON.parse(JSON.stringify(this.result))
      // return
      this.loading = true
      this.$emit('success', { res: param, type: 'project', key: this.key })
    },
  },
  mounted() {
    if (
      !this.data ||
      !this.data.key ||
      (this.data.key === 'add' && !this.data.arr)
    ) {
      this.close()
    }
    this.key = this.data.key
    this.getDropData()
    this.$emit('ok')
  },
}
</script>

<style scoped>
.formMainCont {
  font-size: 0;
}
.formUl {
  display: inline-block;
  width: 100%;
  vertical-align: top;
}
.formUl > li > span.formTitle {
  width: 150px;
}
.formUl > li u.error {
  left: 130px;
  width: 324px !important;
}
.formUl > li > textarea {
  width: 324px;
  height: 82px;
}
.supportRadio {
  line-height: 14px;
  height: 14px;
  vertical-align: top;
  display: inline-block;
  margin-top: 1px;
}
li.radioBox > u.error {
  width: auto !important;
}
</style>
<style>
.projDialog > li > div:not(.btnBox),
.projDialog > li input,
.projDialog > li .el-select,
.projDialog > li .el-cascader {
  width: 324px !important;
  color: #484b5c;
}
.supportRadio > * {
  display: inline-block;
}
.supportRadio .el-radio__original {
  height: 14px;
  display: inline-block;
}
</style>
