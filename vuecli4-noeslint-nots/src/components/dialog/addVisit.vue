<template>
  <div>
    <ul class="formUl visitDialog">
      <li :class="{'errorBorder':error.key==='visitType'}">
        <span class="formTitle">
          <i class="must">*</i>拜访方式：
        </span>
        <unit-dropdown
          id="visitType"
          :list="visitType"
          @change="dropdownReturn"
          :result="result.visitType"
        ></unit-dropdown>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='visitType'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='signAddress'}" v-if="result.visitType!=='04'">
        <span class="formTitle">
          <i class="must">*</i>签到地址：
        </span>
        <input
          v-model="result.signAddress"
          placeholder
          type="text"
          maxlength="100"
          @input="clearErr('signAddress')"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='signAddress'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='dateTime'}">
        <span class="formTitle">
          <i class="must">*</i>日期时间：
        </span>
        <unit-time
          placeholder
          :value="result.date&&result.time?(result.date+' '+result.time):''"
          id="dateTime"
          @return="dropdownReturn"
          :time="true"
          :disableddate="2"
          :reset="reset"
        ></unit-time>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='dateTime'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='customerId','resultView':recordId&&!edit}">
        <span class="formTitle">
          <i class="must">*</i>客户名称：
        </span>
        <unit-customer
          id="customerId"
          placeholder
          @change="dropdownReturn"
          :input="true"
          :result="result.customerId"
          :showfirst="true"
        ></unit-customer>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='customerId'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='projId','resultView':recordId&&!edit}">
        <span class="formTitle">项目名称：</span>
        <unit-project
          id="projId"
          placeholder
          @change="dropdownReturn"
          :clear="true"
          :input="true"
          :customer="result.customerId?result.customerId:null"
          :result="result.projId"
        ></unit-project>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='projId'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='contactId'}">
        <span class="formTitle">
          <i class="must">*</i>拜访对象：
        </span>
        <unit-contact
          id="contactId"
          placeholder
          @change="dropdownReturn"
          :input="true"
          :orgid="result.customerId?result.customerId:null"
          :result="result.contactId"
          type="customer"
          :showfirst="true"
        ></unit-contact>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='contactId'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='position'}">
        <span class="formTitle">
          <i class="must">*</i>职务：
        </span>
        <input
          v-model="result.position"
          placeholder
          type="text"
          maxlength="30"
          @input="clearErr('position')"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='position'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='city'}">
        <span class="formTitle">
          <i class="must">*</i>地区（城市）：
        </span>
        <unit-region
          :must="true"
          id="city"
          @change="dropdownReturn"
          :onlycity="true"
          :result="result.province&&result.city?[result.province,result.city]:[]"
          :reset="reset"
        ></unit-region>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='city'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='projChanceDesc'}">
        <span class="formTitle">
          <i class="must" v-if="(!recordId||(recordId&&edit))&&result.visitType==='03'">*</i>项目机会说明：
        </span>
        <textarea
          class="input"
          v-model="result.projChanceDesc"
          placeholder
          type="text"
          maxlength="200"
          @input="clearErr('projChanceDesc')"
        ></textarea>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='projChanceDesc'">{{error.msg}}</u>
        </transition>
      </li>
      <li class="radioBox" :class="{'small':true,'errorBorder':error.key==='tecSupport'}">
        <span class="formTitle">
          <i class="must">*</i>是否提供技术支持：
        </span>
        <el-radio class="supportRadio" v-model="result.tecSupport" label="1">是</el-radio>
        <el-radio class="supportRadio" v-model="result.tecSupport" label="0">否</el-radio>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='tecSupport'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='tecSupportDesc'}">
        <span class="formTitle">
          <i class="must" v-if="(!recordId||(recordId&&edit))&&result.tecSupport==='1'">*</i>技术支持说明：
        </span>
        <textarea
          class="input"
          v-model="result.tecSupportDesc"
          placeholder
          type="text"
          maxlength="200"
          @input="clearErr('tecSupportDesc')"
        ></textarea>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='tecSupportDesc'">{{error.msg}}</u>
        </transition>
      </li>
      <li :class="{'errorBorder':error.key==='description'}">
        <span class="formTitle">
          <i class="must">*</i>拜访情况说明：
        </span>
        <textarea
          class="input"
          v-model="result.description"
          placeholder
          type="text"
          maxlength="500"
          @input="clearErr('description')"
        ></textarea>
        <transition name="publicTransition">
          <u class="error" v-if="error.key==='description'">{{error.msg}}</u>
        </transition>
      </li>
      <li class="btnBoxLi">
        <div class="btnBox">
          <unit-btn @click="submit" :loading="loading" text="创建"></unit-btn>
          <unit-btn type="plain" @click="close" text="取消"></unit-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import unitCustomer from '@/unit/components/thisUnit/customer'
import unitProject from '@/unit/components/thisUnit/project'
import unitContact from '@/unit/components/thisUnit/contact'
import unitRegion from '@/unit/components/thisUnit/region'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'addVisit',
  props: ['data'],
  components: { unitCustomer, unitProject, unitContact, unitRegion, unitTime },
  data() {
    return {
      recordId: null,
      edit: false,
      result: {
        visitType: '',
        signAddress: '',
        date: '',
        time: '',
        customerId: '',
        projId: '',
        contactId: '',
        position: '',
        province: '',
        city: '',
        projChanceDesc: '',
        tecSupport: '',
        tecSupportDesc: '',
        description: '',
      },
      visitType: [],
      contactList: [],
      error: {
        key: null,
        msg: '',
      },
      loading: false,
      reset: false,
      btnTxt: {
        visitrecordAdd: '创建',
        visitrecordEdit: '保存',
      }
    }
  },
  inject: ['close'],
  computed: {
    time() {
      let time = this.$pubfunc.getTimeNum();
      // console.log(time)
      return { date: this.$pubfunc.TimeTransform('YYYY/MM/DD', time), time: this.$pubfunc.TimeTransform('hh:mm', time), }
    },
  },
  watch: {
    'result.tecSupport'() { this.clearErr('tecSupport') }
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    }
  },
  methods: {
    emptyTxt(v) {
      return v ? v : '--'
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: 'visit_type', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.visitType = res.data ? res.data : [];
            break;
        }
      })
      if (this.recordId) {
        this.$api.service.visit.detailRecord({ recordId: this.recordId }, res => {
          switch (res.code) {
            case '0':
              if (this.edit) {
                for (let k in this.result) {
                  this.result[k] = res.data[k]
                }
              } else {
                for (let k in res.data) {
                  this.result[k] = res.data[k]
                }
              }
              // console.log(this.result)
              break;
            default:
              this.close();
          }
        })
      }
    },
    dropdownReturn(res, key, judge) {
      // console.log(res,key)
      this.clearErr(key);
      let phone = (key === 'visitType' && this.result[key] != res.value && (this.result[key] === '04' || res.value === '04')) ? true : false;
      switch (key) {
        case 'city':
          this.result.province = res.ids[0];
          this.result.city = res.ids[1];
          break;
        case 'dateTime':
          this.result.date = this.$pubfunc.TimeTransform('YYYY/MM/DD', res);
          this.result.time = this.$pubfunc.TimeTransform('hh:mm', res);
          break;
        case 'customerId':
          this.result.customerId = res.value;
          this.result.projId = ''
          this.result.contactId = '';
          this.result.position = '';
          this.result.province = '';
          this.result.city = '';
          this.result.signAddress = res.extend.workAddress;
          // this.result.province=res.extend.province;
          // this.result.city=res.extend.city;
          break;
        case 'showfirstCon':
          this.result.position = res.position;//项目+计划+客户+联系人
          this.judge === 0 ? (//项目
            this.result.province = res.extend.province,
            this.result.city = res.extend.city) : null;
          break;
        case 'showfirstCus'://项目+计划+客户+联系人
          this.result.signAddress = res.extend.workAddress;
          break;
        case 'contactId':
          this.result.position = res.position;
          this.result.province = res.province;
          this.result.city = res.city;
        default:
          this.result[key] = res.value;
      }
      phone ? this.$emit('ok') : null;
    },
    setErr(key, text) {
      this.$store.commit('alertFn', {
        type: 'error',
        text: '新建失败，请修改对应的错误内容',
        time: 2000
      })
      this.error.key = key;
      this.error.msg = text;
      return false
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key]);
      }
    },
    submit() {
      if (this.loading) { return }
      this.clearErr();
      if (!this.result.visitType) {
        return this.setErr('visitType', '请选择拜访方式');
      }
      if (this.result.visitType !== '04' && !this.$pubfunc.replaceSpace(this.result.signAddress, 1)) {
        return this.setErr('signAddress', '请填写签到地址');
      }
      if (!this.result.date || !this.result.time) {
        return this.setErr('dateTime', '请选择拜访日期和时间');
      }
      if (!this.result.customerId) {
        return this.setErr('customerId', '请选择客户');
      }
      if (!this.result.contactId) {
        return this.setErr('contactId', '请选择拜访对象');
      }
      if (!this.$pubfunc.replaceSpace(this.result.position, 1)) {
        return this.setErr('position', '请填写拜访对象对应职务');
      }
      if (!this.result.city) {
        return this.setErr('city', '请选择地区（城市）');
      }
      if (this.result.visitType === '03' && !this.$pubfunc.replaceSpace(this.result.projChanceDesc, 1)) {
        return this.setErr('projChanceDesc', '请填写项目机会说明');
      }
      if (!this.result.tecSupport) {
        return this.setErr('tecSupport', '请选择是否提供技术支持');
      }
      if (this.result.tecSupport === '1' && !this.$pubfunc.replaceSpace(this.result.tecSupportDesc, 1)) {
        return this.setErr('tecSupportDesc', '请填写技术支持说明');
      }
      if (!this.$pubfunc.replaceSpace(this.result.description, 1)) {
        return this.setErr('description', '请填写拜访情况说明');
      }
      // let keys=['visitType','signAddress','date','time','customerId','projId','contactId','position','city','projChanceDesc','tecSupport','tecSupportDesc']
      // let param={}
      // for(let k in keys){
      //     param[keys[k]]=this.result[keys[k]]
      // }
      let param = JSON.parse(JSON.stringify(this.result))
      if (param.visitType === '04') {
        delete param.signAddress;
      }
      if (this.data.key === 'visitPlan') {
        param.planId = this.data.item.planId;
      }
      let url = 'addRecord'
      if (this.edit) {
        url = 'updateRecord'
        param.recordId = this.recordId;
      }
      // return
      this.loading = true
      this.$api.service.visit[url](param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: this.edit ? '保存成功' : '新建成功',
              func: () => {
                this.$emit('success')
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
  created() {
    // console.log(this.$route)
    this.getDropData();
    // },
    // mounted(){
    // console.log(this.data)
    if (!this.data.key || !this.data.item) {
      this.close();
    }
    let item = this.data.item, judge = 0;
    switch (this.data.key) {
      case 'visitPlan':
        judge = 1;
        this.result.visitType = item.visitType;
        this.result.projId = item.projId;
        this.result.date=item.date;
        this.result.time=item.time;
      case 'customerContact':
        this.result.contactId = item.contactId;
        this.result.position = item.position;
        this.result.province = item.province;
        this.result.city = item.city;
      case 'customer':
        judge ? null : judge = 2;
        this.result.signAddress = item.workAddress;
        this.result.customerId = item.customerId ? item.customerId : item.orgId;
        // this.dropdownReturn({value:item.customerId?item.customerId:item.orgId},'customerId',judge);
        break;
      case 'project':
        this.result.projId = item.projId;
        this.result.customerId = item.customerId ? item.customerId : item.orgId;
        this.result.contactId = item.contact;
        break;
    }
    // console.log(judge)
    this.judge = judge;
    let today = this.$pubfunc.getTimeNum();
    this.result.date? null: this.result.date= this.$pubfunc.TimeTransform('YYYY/MM/DD', today);
    this.result.time? null: this.result.time= this.$pubfunc.TimeTransform('hh:mm', today);
    this.$emit('ok');
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
.visitDialog > li > div:not(.btnBox),
.visitDialog > li input,
.visitDialog > li .el-select,
.visitDialog > li .el-cascader {
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
