<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="visit_icon"></i>
      <span>{{edit?'修改拜访记录':(recordId?'查看拜访记录':'新建拜访记录')}}</span>
      <unit-btn type="plain right" :text="!recordId||(recordId&&edit)?'取消':'返回'" @click="cancel"></unit-btn>
      <unit-btn
        type="large right"
        :loading="loading"
        text="创建并继续"
        @click="addMore"
        v-if="!recordId"
      ></unit-btn>
      <unit-btn
        type="right"
        :loading="loading"
        :text="btnTxt[$route.name]"
        @click="submit"
        v-if="!recordId||(recordId&&edit)"
      ></unit-btn>
    </div>
    <div class="contentFix visitForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <unit-loading :loading="loading1" v-if="loading1"></unit-loading>
          <div class="formPage" v-if="!loading1">
            <div class="formMainCont">
              <ul class="formUl">
                <li v-if="recordId&&!edit" class="small resultView">
                  <span class="formTitle">所属分公司：</span>
                  <div>{{result.branchCompanyName|emptyTxt}}</div>
                </li>
                <li v-if="recordId&&!edit" class="small resultView">
                  <span class="formTitle">销售：</span>
                  <div>{{result.creatorName|emptyTxt}}</div>
                </li>
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='visitType'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>拜访方式：
                  </span>
                  <div v-if="recordId&&!edit">{{result.visitTypeTxt}}</div>
                  <unit-dropdown
                    v-if="!recordId||(recordId&&edit)"
                    id="visitType"
                    :list="visitType"
                    @change="dropdownReturn"
                    :result="result.visitType"
                  ></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key==='visitType'">{{error.msg}}</u>
                  </transition>
                </li>
                <li
                  :class="{'small':recordId&&!edit,'errorBorder':error.key==='signAddress'}"
                  v-if="result.visitType!=='04'"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>签到地址：
                  </span>
                  <div v-if="recordId&&!edit">{{result.signAddress|emptyTxt}}</div>
                  <input
                    v-if="!recordId||(recordId&&edit)"
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
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='dateTime'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>日期时间：
                  </span>
                  <div
                    v-if="recordId&&!edit"
                  >{{($pubfunc.TimeTransform('YYYY年MM月DD日',result.date)+" "+$pubfunc.transTime(result.time))|emptyTxt}}</div>
                  <unit-time
                    v-if="!recordId||(recordId&&edit)"
                    placeholder
                    :value="result.date&&result.time?result.date+' '+result.time:''"
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
                <li
                  :class="{'small':recordId&&!edit,'errorBorder':error.key==='customerId','resultView':recordId&&!edit}"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>客户名称：
                  </span>
                  <div v-if="recordId&&!edit">{{result.customerName|emptyTxt}}</div>
                  <unit-customer
                    v-if="!recordId||(recordId&&edit)"
                    id="customerId"
                    placeholder
                    @getVal="getValue"
                    @change="dropdownReturn"
                    :input="true"
                    :result="result.customerId"
                  ></unit-customer>
                  <i
                    class="addBtn el-icon-circle-plus-outline AbleClick"
                    v-if="!recordId||(recordId&&edit)"
                    @click="jumpBtn('customer')"
                  ></i>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key==='customerId'">{{error.msg}}</u>
                  </transition>
                </li>
                <li
                  :class="{'small':recordId&&!edit,'errorBorder':error.key==='projId','resultView':recordId&&!edit}"
                >
                  <span class="formTitle">项目名称：</span>
                  <div v-if="recordId&&!edit">{{result.projName|emptyTxt}}</div>
                  <unit-project
                    v-if="!recordId||(recordId&&edit)"
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
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='contactId'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>拜访对象：
                  </span>
                  <div v-if="recordId&&!edit">{{result.contactName}}</div>
                  <unit-contact
                    v-if="!recordId||(recordId&&edit)"
                    id="contactId"
                    placeholder
                    @getVal="getContact"
                    @change="dropdownReturn"
                    :input="true"
                    :orgid="result.customerId?result.customerId:null"
                    :result="result.contactId"
                    type="customer"
                  ></unit-contact>
                  <i
                    class="addBtn el-icon-circle-plus-outline AbleClick"
                    v-if="!recordId||(recordId&&edit)"
                    @click="jumpBtn('contact')"
                  ></i>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key==='contactId'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='position'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>职务：
                  </span>
                  <div v-if="recordId&&!edit">{{result.position|emptyTxt}}</div>
                  <input
                    v-if="!recordId||(recordId&&edit)"
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
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='city'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>地区（城市）：
                  </span>
                  <div v-if="recordId&&!edit">{{result.cityName|emptyTxt}}</div>
                  <unit-region
                    :must="true"
                    id="city"
                    @change="dropdownReturn"
                    :onlycity="true"
                    :result="result.province&&result.city?[result.province,result.city]:[]"
                    v-if="!recordId||(recordId&&edit)"
                    :reset="reset"
                  ></unit-region>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key==='city'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='projChanceDesc'}">
                  <span class="formTitle">
                    <i class="must" v-if="(!recordId||(recordId&&edit))&&result.visitType==='03'">*</i>项目机会说明：
                  </span>
                  <div
                    v-if="recordId&&!edit"
                    class="bigCont"
                    v-html="emptyTxt($pubfunc.replaceBr(result.projChanceDesc,1))"
                  ></div>
                  <textarea
                    class="input"
                    v-if="!recordId||(recordId&&edit)"
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
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>是否提供技术支持：
                  </span>
                  <div
                    class="contactCon"
                    v-if="recordId&&!edit"
                  >{{(result.tecSupport==='1'?'是':(result.tecSupport==='0'?'否':''))|emptyTxt}}</div>
                  <el-radio
                    class="supportRadio"
                    v-if="!recordId||(recordId&&edit)"
                    v-model="result.tecSupport"
                    label="1"
                  >是</el-radio>
                  <el-radio
                    class="supportRadio"
                    v-if="!recordId||(recordId&&edit)"
                    v-model="result.tecSupport"
                    label="0"
                  >否</el-radio>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key==='tecSupport'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='tecSupportDesc'}">
                  <span class="formTitle">
                    <i class="must" v-if="(!recordId||(recordId&&edit))&&result.tecSupport==='1'">*</i>技术支持说明：
                  </span>
                  <div
                    v-if="recordId&&!edit"
                    class="bigCont"
                    v-html="emptyTxt($pubfunc.replaceBr(result.tecSupportDesc,1))"
                  ></div>
                  <textarea
                    class="input"
                    v-if="!recordId||(recordId&&edit)"
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
                <li :class="{'small':recordId&&!edit,'errorBorder':error.key==='description'}">
                  <span class="formTitle">
                    <i class="must" v-if="!recordId||(recordId&&edit)">*</i>拜访情况说明：
                  </span>
                  <div
                    v-if="recordId&&!edit"
                    class="bigCont"
                    v-html="emptyTxt($pubfunc.replaceBr(result.description,1))"
                  ></div>
                  <textarea
                    class="input"
                    v-if="!recordId||(recordId&&edit)"
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
              </ul>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitCustomer from '@/unit/components/thisUnit/customer'
import unitProject from '@/unit/components/thisUnit/project'
import unitContact from '@/unit/components/thisUnit/contact'
import unitRegion from '@/unit/components/thisUnit/region'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'visitRecordForm',
  props: ['dom'],
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
        creatorName: ''
      },
      visitType: [],
      contactList: [],
      error: {
        key: null,
        msg: '',
      },
      loading: false,
      loading1: false,
      reset: false,
      btnTxt: {
        visitrecordAdd: '创建',
        visitrecordEdit: '保存',
      },
      param: {
        value: "",
        customerId: '',
        project: "",
        contact: "",
        city: ""
      }
    }
  },
  computed: {
    time() {
      let time = this.$pubfunc.getTimeNum();
      // console.log(time)
      return { date: this.$pubfunc.TimeTransform('YYYY/MM/DD', time), time: this.$pubfunc.TimeTransform('hh:mm', time), }
    },
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    }
  },
  watch: {
    'result.tecSupport'() { this.clearErr('tecSupport') }
  },
  methods: {
    emptyTxt(v) {
      return v ? v : '--'
    },
    getValue(v) {
      console.log(v);

      if (v) {
        this.param.value = v;
      }
    },
    getContact(v) {
      if (v) {
        this.param.contact = v;
      }
    },
    jumpBtn(key) {
      switch (key) {
        case 'customer':
          let name = "customerAdd";
          let value = this.param;
          let result = this.result
          let meta = 'record'
          let edit = this.edit
          let recordId = this.recordId
          let data = { result, value, meta, edit, recordId }
          this.$router.push({
            name,
            params: {
              data
            }
          });
          break;
        case 'contact':
          let name2 = "contact";
          let data2 = { result: this.result, param: this.param, meta: 'record', edit: this.edit, recordId: this.recordId }
          this.$router.push({
            name: name2,
            params: {
              data: data2
            }
          });
          break;
      }
    },
    getDropData() {
      this.recordId && !this.edit ? null :
        this.$api.public.dict({ codeGroup: 'visit_type', pCode: '' }, res => {
          // console.log(res)
          switch (res.code) {
            case '0':
              this.visitType = res.data ? res.data : [];
              break;
          }
        });
      if (this.recordId) {
        this.loading1 = true;
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
              this.cancel();
          }
          this.loading1 = false;
        })
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
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
          this.result.signAddress = res.extend.workAddress;
          // this.result.province=res.extend.province;
          // this.result.city=res.extend.city;
          this.result.province = '';
          this.result.city = '';
          this.result.projId = '';
          this.result.contactId = '';
          this.result.position = '';
          break;
        case 'contactId':
          this.result.position = res.position;
          this.result.province = res.province;
          this.result.city = res.city;
        default:
          this.result[key] = res.value;
      }
    },
    setErr(key, text) {
      this.$store.commit('alertFn', {
        type: 'error',
        text: (this.edit ? '保存' : '新建') + '失败，请修改对应的错误内容',
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
    submit(j) {
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
                j && !this.recordId && !this.edit ? this.clear() : this.cancel();
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
    addMore() {
      this.submit(true)
    },
    clear() {
      this.result.visitType = '';
      this.result.signAddress = '';
      this.result.date = '';
      this.result.time = '';
      this.result.customerId = '';
      this.result.projId = '';
      this.result.contactId = '';
      this.result.position = '';
      this.result.province = '';
      this.result.city = '';
      this.result.projChanceDesc = '';
      this.result.tecSupport = '';
      this.result.tecSupportDesc = '';
      this.result.description = '';
      this.reset = !this.reset;
    },
    cancel() {
      this.$router.push({ name: 'visitrecord' });
    },
    getData() {
      if (this.$route.params.data) {
        if (this.$route.params.data.result && this.$route.params.data.data) {
          console.log(this.$route.params.data);
          const { result, data } = this.$route.params.data
          this.result.visitType = data.visitType
          this.result.signAddress = data.signAddress
          this.result.date = data.date
          this.result.time = data.time
          this.result.customerId = result.orgId
          this.result.projId = data.projId
          this.result.contactId = result.contactId
          this.result.position = result.position
          this.result.province = result.province
          this.result.city = result.city
        }
      }
    }
  },
  created() {
    // console.log(this.$route)
    switch (this.$route.name) {
      case 'visitrecordEdit':
        this.edit = true;
      case 'visitrecordView':
        let recordId;
        try {
          recordId = this.$pubfunc.decode(this.$route.params.recordId || this.$route.params.data.recordId);
        } catch (error) {
          this.cancel();
          return
        }
        this.recordId = recordId;
        break;
    }
    let today = this.$pubfunc.getTimeNum();
    this.result.date = this.$pubfunc.TimeTransform('YYYY/MM/DD', today);
    this.result.time = this.$pubfunc.TimeTransform('hh:mm', today);
    this.getDropData();
    this.getData()
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
  width: 160px;
}
.formUl > li u.error {
  left: 140px;
  width: 230px !important;
}
.formUl > li > textarea {
  width: 450px;
  height: 122px;
}
.formUl > li textarea + u.error {
  width: 450px !important;
}
.supportRadio {
  line-height: 14px;
  height: 14px;
  vertical-align: top;
  display: inline-block;
  margin-top: 1px;
}
.bigCont {
  width: 80%;
}
li.radioBox > u.error {
  width: auto !important;
}
</style>
<style>
.supportRadio > * {
  display: inline-block;
}
.supportRadio .el-radio__original {
  height: 14px;
  display: inline-block;
}
i.addBtn {
  display: inline-block;
  font-size: 20px;
  line-height: 1;
  margin-top: 6px;
  margin-left: 10px;
  color: #95a0bd;
}
i.addBtn:hover {
  color: #4780f4;
}
</style>
