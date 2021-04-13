<template>
  <div class="formPage projectRequire">
    <div class="formMainCont">
      <ul class="formUl">
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='doTender'}">
          <span class="formTitle">是否投标：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.doTender?(data.doTender==='1'?'是':'否'):'')"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="doTender"
                         :list="doTenderList"
                         @change='dropdownReturn'
                         :result='result.doTender'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='doTender'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='orgStructurePath'}">
          <span class="formTitle">项目组织结构（ADRU）：</span>
          <unit-upload @dialog='showDialog'
                       @click='addBtn'
                       @upload='dropdownReturn'
                       @ajaxing='ajaxingChang'
                       :limit='4'
                       :count='1'
                       :img='true'
                       :list="name==='projectEdit'?(result.src?[{src:result.src,filePath:data.orgStructurePath}]:[]):(data.src?[{src:data.src,filePath:data.orgStructurePath}]:[])"
                       :onlyshow="name==='projectView'||role"></unit-upload>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='orgStructurePath'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='highestPolicymarker'}">
          <span class="formTitle">A（最高决策人）：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.highestPolicymarkerTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="highestPolicymarker"
                         :list="supportLevel"
                         @change='dropdownReturn'
                         :result='result.highestPolicymarker'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='highestPolicymarker'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='decider'}">
          <span class="formTitle">D（拍板人）：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.deciderTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="decider"
                         :list="supportLevel"
                         @change='dropdownReturn'
                         :result='result.decider'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='decider'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='estimator'}">
          <span class="formTitle">R（评估者）：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.estimatorTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="estimator"
                         :list="supportLevel"
                         @change='dropdownReturn'
                         :result='result.estimator'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='estimator'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='user'}">
          <span class="formTitle">U（使用者）：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.userTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="user"
                         :list="supportLevel"
                         @change='dropdownReturn'
                         :result='result.user'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='user'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='competitor'}">
          <span class="formTitle">竞争对手：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.competitor)"></unit-popover>
          </div>
          <input v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.competitor"
                 maxlength="100"
                 @input="clearErr('competitor')">
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='competitor'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='competitiveAdvantage'}">
          <span class="formTitle">竞争优势：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.competitiveAdvantage)"></unit-popover>
          </div>
          <input v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.competitiveAdvantage"
                 maxlength="100"
                 @input="clearErr('competitiveAdvantage')">
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='competitiveAdvantage'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='competitiveWeakness'}">
          <span class="formTitle">竞争劣势：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.competitiveWeakness)"></unit-popover>
          </div>
          <input v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.competitiveWeakness"
                 maxlength="100"
                 @input="clearErr('competitiveWeakness')">
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='competitiveWeakness'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='competitiveBrand'}">
          <span class="formTitle">竞争品牌：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.competitiveBrand)"></unit-popover>
          </div>
          <input v-if="name==='projectEdit'&&!role"
                 type="text"
                 v-model="result.competitiveBrand"
                 maxlength="100"
                 @input="clearErr('competitiveBrand')">
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='competitiveBrand'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='manufacturerSupport'}">
          <span class="formTitle">厂商支持：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.manufacturerSupportTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="manufacturerSupport"
                         :list="manufacturerSupport"
                         @change='dropdownReturn'
                         :result='result.manufacturerSupport'
                         :clear='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='manufacturerSupport'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='majorSupportArr'}">
          <span class="formTitle">多数人支持：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.majorSupportTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="majorSupportArr"
                         :list="majorSupportArr"
                         @change='dropdownReturn'
                         :result='result.majorSupportArr'
                         :multiple='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='majorSupportArr'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'small':name==='projectView'||role,'errorBorder':error.key==='keyPersonSupportArr'}">
          <span class="formTitle">关键人支持：</span>
          <div v-if="name==='projectView'||role">
            <unit-popover :content="emptyTxt(data.keyPersonSupportTxt)"></unit-popover>
          </div>
          <unit-dropdown class="auto"
                         v-if="name==='projectEdit'&&!role"
                         id="keyPersonSupportArr"
                         :list="keyPersonSupportArr"
                         @change='dropdownReturn'
                         :result='result.keyPersonSupportArr'
                         :multiple='true'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='keyPersonSupportArr'">{{error.msg}}</u></transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitUpload from '@/unit/components/upload'
export default {
  name: 'projrequire',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  components: { unitPopover, unitUpload },
  inject: ['cancel'],
  data () {
    return {
      result: {
        doTender:'',
        orgStructurePath: '',
        src: '',
        highestPolicymarker: '',
        decider: '',
        estimator: '',
        user: '',
        competitor: '',
        competitiveAdvantage: '',
        competitiveWeakness: '',
        competitiveBrand: '',
        manufacturerSupport: '',
        majorSupportArr: [],
        keyPersonSupportArr: [],
      },
      supportLevel: [],
      manufacturerSupport: [],
      majorSupportArr: [],
      keyPersonSupportArr: [],
      error: {
        key: null,
        msg: '',
      },
      doTenderList:[{value:'1',label:'是'},{value:'0',label:'否'}]
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
    showDialog (data) {
      // console.log(data)
      this.$emit('dialog', data)
    },
    emptyTxt (v) {
      return v ? v : '--'
    },
    ajaxingChang (j) {
      // console.log(j)
      this.ajaxIng = j;
    },
    addBtnjudge () {
      if (this.ajaxIng) { return; }
      this.addBtn();
    },
    addBtn (fn) {
      this.addBtn = fn;
    },
    getDropData () {
      this.supportLevel && this.supportLevel.length > 0 ? null : this.$api.public.dict({ codeGroup: 'support_level', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.supportLevel = res.data ? res.data : [];
            break;
        }
      });
      this.manufacturerSupport && this.manufacturerSupport.length > 0 ? null : this.$api.public.dict({ codeGroup: 'manufacturer_support', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.manufacturerSupport = res.data ? res.data : [];
            break;
        }
      });
      this.majorSupportArr && this.majorSupportArr.length > 0 ? null : this.$api.public.dict({ codeGroup: 'major_support', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.majorSupportArr = res.data ? res.data : [];
            break;
        }
      });
      this.keyPersonSupportArr && this.keyPersonSupportArr.length > 0 ? null : this.$api.public.dict({ codeGroup: 'key_person_support', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.keyPersonSupportArr = res.data ? res.data : [];
            break;
        }
      });
      for (let k in this.result) {
        this.result[k] = this.data[k]
      }
      this.result.majorSupportArr ? null : this.result.majorSupportArr = [];
      this.result.keyPersonSupportArr ? null : this.result.keyPersonSupportArr = [];
    },
    dropdownReturn (res, key) {
      // console.log(res,key,this.result)
      this.clearErr(key);
      switch (key) {
        case 'majorSupportArr':
        case 'keyPersonSupportArr':
          this.result[key] = res.reduce((arr, item) => {
            return arr.concat(item.value)
          }, [])
          break;
        case 'upload':
          res.length > 0 ? (this.result.orgStructurePath = res[0].filePath, this.result.src = res[0].src) : (this.result.orgStructurePath = '', this.result.src = '')
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
      let param = {
        projId: this.data.projId
      }, hasChange = false;
      //if (!this.result.doTender) {
      //  return this.setErr('doTender', '请选择是否投标')
      //}
      // let imgs=this.$refs.upload.getList();
      // this.result.orgStructurePath=imgs.length>0?imgs[0].filePath:'';
      for (let k in this.result) {
        if (k !== 'src') {
          if (k === 'majorSupportArr' || k === 'keyPersonSupportArr') {
            (this.result[k] ? this.result[k].join(',') : '') != (this.data[k] ? this.data[k].join(',') : '') && !(!this.data[k] && this.result[k].length === 0) ? hasChange = true : null;
          } else {
            (this.result[k] ? this.result[k] : '') != (this.data[k] ? this.data[k] : '') ? hasChange = true : null;
          }
        }
        param[k] = this.result[k]
      }
      // console.log(this.data,param,hasChange)
      // return;
      if (hasChange && !this.role) {
        delete param.src
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
      this.$api.service.project.saverequire(param, res => {
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