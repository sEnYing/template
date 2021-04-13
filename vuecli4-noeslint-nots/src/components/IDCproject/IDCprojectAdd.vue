<template>
  <div class="fillBox changeFormW projectForm">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>{{nameTxt[name]}}</span>
      <unit-btn type="plain right"
                :text="name!=='IDCProjectBackView'?'取消':'返回'"
                @click="cancel(nameChange)"></unit-btn>
      <unit-btn type="right"
                :loading="loading"
                :text="name==='IDCProjectBack'?'保存':'创建'"
                @click="submit"
                v-if="name!=='IDCProjectBackView'&&!(role==='tecDirector'&&!result.tecDifficulty)"></unit-btn>
      <unit-btn type="right"
                text="编辑"
                @click="editBtn"
                v-if="name==='IDCProjectBackView'&&(role==='preSale'||role==='tecDirector'&&result.tecDifficulty)"></unit-btn>
    </div>
    <div class="contentFix projForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref="scrollbar">
          <unit-loading :loading="true"
                        v-if="waiting"></unit-loading>
          <div class="formPage"
               v-if="!waiting">
            <div class="formMainCont"
                 v-if="name==='IDCProjectAdd'">
              <ul class="formUl padding0">
                <li class="small">
                  <span class="formTitle">销售：</span>
                  <div v-if="name==='IDCProjectAdd'">{{userInfo.staffName|emptyTxt}}</div>
                </li>
              </ul>
              <ul class="formUl padding0">
                <li class="small">
                  <span class="formTitle">子公司：</span>
                  <div v-if="name==='IDCProjectAdd'">{{depList.length>0?judgebranchCompanyName():userInfo.branchCompanyName|emptyTxt}}</div>
                </li>
              </ul>
              <ul class="formUl padding0">
                <li :style="{margin:(depList.length>0)?'-8px 0':null}"
                    :class="{'small':depList.length===0,'errorBorder':error.key==='depId'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="depList.length>0">*</i>所属部门：
                  </span>
                  <unit-dropdown v-if="depList.length>0"
                                 id="depId"
                                 :list="depList"
                                 @change="dropdownReturn"></unit-dropdown>
                  <div v-if="depList.length===0">{{userInfo.depName|emptyTxt}}</div>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='depId'">{{error.msg}}</u>
                  </transition>
                </li>
              </ul>
            </div>
            <div class="formMainCont"
                 v-if="name!=='IDCProjectAdd'">
              <ul class="formUl padding0">
                <li class="small">
                  <span class="formTitle">项目名称：</span>
                  <div>{{result.projName|emptyTxt}}</div>
                </li>
              </ul>
              <ul class="formUl padding0">
                <li class="small">
                  <span class="formTitle">项目编号：</span>
                  <div>{{result.projNo|emptyTxt}}</div>
                </li>
              </ul>
              <ul class="formUl padding0">
                <li class="small">
                  <span class="formTitle">销售：</span>
                  <div>{{result.ownerName|emptyTxt}}</div>
                </li>
              </ul>
            </div>
            <div class="formMainTitle">
              <span>项目基本信息</span>
            </div>
            <div class="formMainCont">
              <ul class="formUl">
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='customerName'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户名称：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.customerName)"></unit-popover>
                  </div>
                  <unit-customer v-if="name==='IDCProjectAdd'"
                                 id="customerName"
                                 class="contactCon auto"
                                 placeholder
                                 @change="dropdownReturn"
                                 :input="true"></unit-customer>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='customerName'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='customerLevel'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户等级：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.customerLevelTxt)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="customerLevel"
                                 :list="customerLevelList"
                                 @change="dropdownReturn"
                                 :result="result.customerLevel"></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='customerLevel'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='contact'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户联系人：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.contactName)"></unit-popover>
                  </div>
                  <unit-contact v-if="name==='IDCProjectAdd'"
                                id="contact"
                                placeholder
                                @change="dropdownReturn"
                                :input="true"
                                :orgid="result.customerId?result.customerId:null"
                                :result="result.contact"
                                type="customer"></unit-contact>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='contact'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='contactPosition'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户联系人职位：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.contactPosition)"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.contactPosition"
                         @input="clearErr('contactPosition')" />
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='contactPosition'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='projName'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>项目名称：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.projName)"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.projName"
                         maxlength="50"
                         @input="clearErr('projName')" />
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='projName'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='projType'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>项目类型：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.projTypeTxt)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="projType"
                                 :list="projTypeList"
                                 @change="dropdownReturn"
                                 :result="result.projType"></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='projType'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='estAnnualConAmount_'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>预计年合同额：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt($pubfunc.transformPrice(result.estAnnualConAmount,true),'money')"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.estAnnualConAmount_"
                         maxlength="50"
                         @blur="inputBlur"
                         @input="int('estAnnualConAmount_')" /><i v-if="name==='IDCProjectAdd'"
                     class="company">元</i>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='estAnnualConAmount_'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='planFinishTime'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>预计结案日期：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.planFinishTime)"></unit-popover>
                  </div>
                  <unit-time class="auto"
                             v-if="name==='IDCProjectAdd'"
                             placeholder=''
                             :value='result.planFinishTime'
                             id='planFinishTime'
                             :clear='true'
                             @return='dropdownReturn'></unit-time>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='planFinishTime'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd'}">
                  <span class="formTitle">
                    是否预约参观机房：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.haveVisitAppointment)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="haveVisitAppointment"
                                 :list="haveVisitAppointmentList"
                                 @change="dropdownReturn"
                                 :result="result.haveVisitAppointment"></unit-dropdown>
                </li>
              </ul>
              <ul class="formUl">
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='idcRoom'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i> 所属机房：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.idcRoomTxt)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="idcRoom"
                                 :list="idcRoomList"
                                 @change="dropdownReturn"
                                 :result="result.idcRoom"></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='idcRoom'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='cabinetNumber'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>机柜数量：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.cabinetNumber)"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.cabinetNumber"
                         maxlength="50"
                         @input="int('cabinetNumber')" /><i v-if="name==='IDCProjectAdd'"
                     class="company">个</i>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='cabinetNumber'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='cabinetElectricity'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>机柜电量：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.cabinetElectricity)"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.cabinetElectricity"
                         maxlength="50"
                         @input="int('cabinetElectricity')" /><i v-if="name==='IDCProjectAdd'"
                     class="company">A</i>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='cabinetElectricity'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='bandwidth'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>带宽：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.bandwidth)"></unit-popover>
                  </div>
                  <input v-if="name==='IDCProjectAdd'"
                         type="text"
                         v-model="result.bandwidth"
                         maxlength="50"
                         @input="int('bandwidth')" /><i v-if="name==='IDCProjectAdd'"
                     class="company">M</i>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='bandwidth'">{{error.msg}}</u>
                  </transition>
                </li>

                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='winRate'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>项目赢率：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.winRateTxt)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="winRate"
                                 :list="winRateList"
                                 @change="dropdownReturn"
                                 :result="result.winRate"></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='winRate'">{{error.msg}}</u>
                  </transition>
                </li>

                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='projStatus'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>项目状态：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.projStatusTxt)"></unit-popover>
                  </div>
                  <unit-dropdown v-if="name==='IDCProjectAdd'"
                                 id="projStatus"
                                 :list="projStatusList"
                                 @change="dropdownReturn"
                                 :result="result.projStatus"></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='projStatus'">{{error.msg}}</u>
                  </transition>
                </li>

                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='projStatusReason'}"
                    v-if="Number(result.projStatus)>3">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>
                    {{result.projStatusTxt}}原因：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.projStatusReason)"
                                  :lines="3"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.projStatusReason"
                            maxlength="500"
                            @input="clearErr('projStatusReason')"></textarea>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='projStatusReason'">{{error.msg}}</u>
                  </transition>
                </li>

                <li class="radioBox"
                    :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='commitStatus'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>commit状态：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">{{result.commitStatus?commitStatusTxt[result.commitStatus]:''|emptyTxt}}</div>
                  <el-radio v-if="name==='IDCProjectAdd'"
                            class="projRadio"
                            v-model="result.commitStatus"
                            label="1">是</el-radio>
                  <el-radio v-if="name==='IDCProjectAdd'"
                            class="projRadio"
                            v-model="result.commitStatus"
                            label="0">否</el-radio>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='commitStatus'">{{error.msg}}</u>
                  </transition>
                </li>
                <li class="radioBox small"
                    :class="{'unableTxt':result.commitStatus!=='1'}">
                  <span class="formTitle">commit确认：</span>
                  <div :class="{'orangeTxt':!result.commitConfirm}">
                    <unit-popover :content="emptyTxt(commitConfirmTxt[result.commitConfirm])"
                                  :lines="3"
                                  v-if="result.commitConfirm"></unit-popover>
                    {{result.commitConfirm?'':'待回填'}}
                  </div>
                </li>
              </ul>
              <ul class="formUl">
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='customerDemandFocus'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户需求侧重点：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.customerDemandFocus)"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.customerDemandFocus"
                            maxlength="500"
                            @input="clearErr('customerDemandFocus')"></textarea>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='customerDemandFocus'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='customerKeyBussiness'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>客户重点业务说明：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.customerKeyBussiness)"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.customerKeyBussiness"
                            maxlength="500"
                            @input="clearErr('customerKeyBussiness')"></textarea>
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='customerKeyBussiness'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd','errorBorder':error.key==='others'}">
                  <span class="formTitle">
                    <i class="must"
                       v-if="name==='IDCProjectAdd'">*</i>其他要求：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.others)"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.others"
                            maxlength="500"
                            @input="clearErr('others')" />
                  <transition name="publicTransition">
                    <u class="error"
                       v-if="error.key==='others'">{{error.msg}}</u>
                  </transition>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd'}">
                  <span class="formTitle">
                    项目进度说明：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.scheduleDescription)"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.scheduleDescription"
                            maxlength="500"
                            @input="clearErr('scheduleDescription')"></textarea>
                </li>
                <li :class="{'small':name!=='IDCProjectAdd'}">
                  <span class="formTitle">
                    备注：
                  </span>
                  <div v-if="name!=='IDCProjectAdd'">
                    <unit-popover :content="emptyTxt(result.remark)"></unit-popover>
                  </div>
                  <textarea v-if="name==='IDCProjectAdd'"
                            class="input"
                            v-model="result.remark"
                            maxlength="500"
                            @input="clearErr('remark')"></textarea>
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
import unitPopover from '@/unit/components/popover'
import unitCustomer from '@/unit/components/thisUnit/customer'
import unitContact from '@/unit/components/thisUnit/contact'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'IDCProjectAdd',
  props: ['dom'],
  components: { unitCustomer, unitContact, unitPopover, unitTime },
  data() {
    return {
      nameTxt: {
        IDCProjectAdd: '新建IDC项目',
        IDCProjectBack: '编辑IDC项目',
        IDCProjectBackView: '查看IDC项目',
      },
      error: {
        key: null,
        msg: '',
      },
      role: null,
      nameChange: false,
      loading: false,
      waiting: false,
      result: {
        customerId: '',
        customerName: '',
        customerLevelTxt: '',
        customerLevel: '',
        contact: '',
        contactPosition: '',
        projName: '',
        projId: '',
        projType: '',
        estAnnualConAmount: '',
        estAnnualConAmount_: '',
        idcRoom: '',
        cabinetNumber: '',
        cabinetElectricity: '',
        bandwidth: '',
        others: '',
        winRate: '',
        projStatus: '',
        projStatusReason: '',
        commitStatus: '',
        customerDemandFocus: '',
        customerKeyBussiness: '',
        scheduleDescription: '',
        haveVisitAppointment: '',
        remark: '',
      },
      commitStatusTxt: {
        '0': '否',
        '1': '是',
      },
      commitConfirmTxt: {
        '0': '不同意',
        '1': '同意',
      },
      winRateList: [],
      projStatusList: [],
      customerLevelList: [],
      projTypeList: [],
      depList: [],
      idcRoomList: [],
      haveVisitAppointmentList: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
        { label: '无需参观', value: '-1' },
      ],
    }
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let json = userInfo.info && userInfo.info.staff ? userInfo.info.staff : {}
      let depList = []
      // console.log(json)
      if (
        Object.prototype.toString.call(json.department) === '[object Array]'
      ) {
        json.department.map(v => {
          depList.push({ value: v.depId, label: v.depName })
        })
        this.$set(this.result, 'depId', null)
      }
      this.depList = depList
      return json
    },
    judgeBtn() {
      return {
        idcprojectAdd: this.$pubfunc.judgeBtn('idcproject:add'),
      }
    },
  },
  watch: {
    'result.commitStatus'() {
      this.clearErr('commitStatus')
    },
  },
  filters: {
    emptyTxt(v) {
      return v ? v : '--'
    },
  },
  methods: {
    cancel(j) {
      if (j) {
        this.nameChange ? (this.nameChange = false) : null
        this.clearErr()
        this.$router.push({
          name: 'IDCProjectBackView',
          params: { projId: this.$pubfunc.encode(this.projId) },
        })
        console.log()
        this.name = 'IDCProjectBackView'
        this.getDropData()
        return
      }
      let proMsg = this.$pubfunc.getSStorage('proMsg')
      this.$router.push({ name: proMsg ? 'message' : 'idcproject' })
    },
    judgebranchCompanyName() {
      if (!this.result.depId) {
        return this.userInfo.branchCompanyName.split(',').join('/')
      }
      for (let i in this.depList) {
        if (this.depList[i].value === this.result.depId) {
          return this.depList[i].label
        }
      }
      return this.userInfo.branchCompanyName.split(',').join('/')
    },
    int(key) {
      this.clearErr(key)
      switch (key) {
        case 'estAnnualConAmount_':
        case 'cabinetElectricity':
          this.result[key] = this.result[key].replace(/[^\d.]/g, '')
          this.result[key] = this.result[key].replace(/^\./g, '')
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
          if (this.result[key].length > 1 && this.result[key][0] === '0') {
            this.result[key] = this.result[key].slice(1)
          }
          break
        case 'cabinetNumber':
        case 'bandwidth':
          this.result[key] = this.result[key].replace(/[^\d.]/g, '')
          this.result[key] = this.result[key].replace(/^\./g, '')
          this.result[key] = this.result[key].replace(/\.{2,}/g, '')
          this.result[key] = this.result[key]
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace('$#$', '.')
          this.result[key] =
            this.result[key].indexOf('.') > 0
              ? this.result[key].split('.')[0].substring(0, 4)
              : this.result[key].substring(0, 4)
          if (this.result[key].length > 1 && this.result[key][0] === '0') {
            this.result[key] = this.result[key].slice(1)
          }
          break
      }
      return this.result[key]
    },
    dropdownReturn(res, key) {
      this.clearErr(key)
      switch (key) {
        case 'customerName':
          this.result.customerId = res.value
          break
        case 'customerLevel':
          this.result.customerLevel = res.value
          break
        case 'projType':
          this.result.projType = res.value
          break
        case 'winRate':
          this.result.winRate = res.value
          break
        case 'projStatus':
          this.result.projStatus = res.value
          this.result.projStatusTxt = res.label
          this.result.projStatusReason = ''
          break
        case 'planFinishTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        case 'contact':
          console.log(res)
          this.result.contact = res.value
          this.result.contactPosition = res.position
          break
        case 'haveVisitAppointment':
          this.result.haveVisitAppointment = res.value
          break
        case 'idcRoom':
          this.result.idcRoom = res.value
          break
        default:
          this.result[key] = res.value
          break
      }
    },
    inputBlur() {
      this.result.estAnnualConAmount_ = this.$pubfunc.transformPrice(
        this.result.estAnnualConAmount_,
        true,
      )
    },
    setErr(key, text) {
      this.$store.commit('alertFn', {
        type: 'error',
        text:
          (this.name === 'IDCProjectAdd' ? '新建' : '保存') +
          '失败，请修改对应的错误内容',
        time: 2000,
      })
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
    emptyTxt(v, money) {
      return v ? v + (money ? ' 元' : '') : '--'
    },
    submit() {
      if (this.loading) {
        return
      }
      this.clearErr()
      let url,
        keys = []
      switch (this.name) {
        case 'IDCProjectAdd':
          if (this.depList.length > 0 && !this.result.depId) {
            return this.setErr('depId', '请选择所属部门')
          }
          if (!this.$pubfunc.replaceSpace(this.result.customerId, 1)) {
            return this.setErr('customerName', '请选择客户名称')
          }
          if (!this.$pubfunc.replaceSpace(this.result.customerLevel, 1)) {
            return this.setErr('customerLevel', '请选择客户等级')
          }
          if (!this.$pubfunc.replaceSpace(this.result.contact, 1)) {
            return this.setErr('contact', '请输入客户联系人')
          }
          if (!this.$pubfunc.replaceSpace(this.result.contactPosition, 1)) {
            return this.setErr('contactPosition', '请输入客户联系人职位')
          }
          if (!this.$pubfunc.replaceSpace(this.result.projName, 1)) {
            return this.setErr('projName', '请输入项目名称')
          }
          if (!this.$pubfunc.replaceSpace(this.result.projType, 1)) {
            return this.setErr('projType', '请选择项目类型')
          }
          if (!this.$pubfunc.replaceSpace(this.result.estAnnualConAmount_, 1)) {
            return this.setErr('estAnnualConAmount_', '请输入预计年合同额')
          } else if (
            !Number(this.result.estAnnualConAmount_.split(',').join(''))
          ) {
            return this.setErr(
              'estAnnualConAmount_',
              '项目金额不可为0，请重新输入',
            )
          }
          if (!this.$pubfunc.replaceSpace(this.result.idcRoom, 1)) {
            return this.setErr('idcRoom', '请输入所属机房')
          }
          if (!this.$pubfunc.replaceSpace(this.result.cabinetNumber, 1)) {
            return this.setErr('cabinetNumber', '请输入机柜数量')
          }
          if (!this.$pubfunc.replaceSpace(this.result.cabinetElectricity, 1)) {
            return this.setErr('cabinetElectricity', '请输入机柜电量')
          }
          if (!this.$pubfunc.replaceSpace(this.result.bandwidth, 1)) {
            return this.setErr('bandwidth', '请输入带宽')
          }
          if (!this.$pubfunc.replaceSpace(this.result.others, 1)) {
            return this.setErr('others', '请输入其他要求')
          }
          if (!this.result.winRate) {
            return this.setErr('winRate', '请选择项目赢率')
          }
          if (!this.result.projStatus) {
            return this.setErr('projStatus', '请选择项目状态')
          }
          if (
            Number(this.result.projStatus) > 3 &&
            !this.$pubfunc.replaceSpace(this.result.projStatusReason, 1)
          ) {
            return this.setErr(
              'projStatusReason',
              '请输入' + this.result.projStatusTxt + '原因',
            )
          }
          if (!this.result.commitStatus) {
            return this.setErr('commitStatus', '请选择commit状态')
          }
          if (!this.$pubfunc.replaceSpace(this.result.customerDemandFocus, 1)) {
            return this.setErr('customerDemandFocus', '请输入客户需求侧重点')
          }
          if (
            !this.$pubfunc.replaceSpace(this.result.customerKeyBussiness, 1)
          ) {
            return this.setErr('customerKeyBussiness', '请输入客户重点业务说明')
          }
          if (!this.result.planFinishTime) {
            return this.setErr('planFinishTime', '请选择预计结案日期')
          }

          this.$store.commit('confirmFn', {
            func: () => {
              url = 'saveproposal'
              this.result.estAnnualConAmount = this.result.estAnnualConAmount_
                .split(',')
                .join('')
              keys = [
                'projId',
                'projNo',
                'customerLevel',
                'customerId',
                'idcRoom',
                'projName',
                'estAnnualConAmount',
                'projType',
                'contact',
                'contactPosition',
                'cabinetNumber',
                'cabinetElectricity',
                'bandwidth',
                'winRate',
                'others',
                'customerDemandFocus',
                'customerKeyBussiness',
                'commitStatus',
                'commitStatus',
                'scheduleDescription',
                'planFinishTime',
                'projStatus',
                'projStatusReason',
                'haveVisitAppointment',
                'remark',
              ]
              this.depList.length > 0 ? keys.push('depId') : null
              this.ajaxFun(url, keys)
            },
            text: '请您确认所填信息准确无误！',
          })
          break
      }
    },
    ajaxFun(url, keys) {
      let param = {}
      for (let k in keys) {
        param[keys[k]] = this.result[keys[k]] ? this.result[keys[k]] : null
      }
      this.role ? null : (param.updateReason = {})
      this.loading = true
      this.$api.service.IDCproject[url](param, res => {
        this.loading = false
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: '操作成功',
              func: () => {
                this.cancel()
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
            break
        }
      })
    },
    editBtn() {
      this.nameChange = true
      this.$router.push({
        name: 'IDCProjectBack',
        params: { projId: this.$pubfunc.encode(this.projId) },
      })
      this.name = 'IDCProjectBack'
      this.getDropData()
    },
    getDropData() {
      this.$api.public.dict({ codeGroup: 'idc_win_rate', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.winRateList = res.data
            break
        }
      })
      this.$api.public.dict(
        { codeGroup: 'idc_proj_status', pCode: '' },
        res => {
          switch (res.code) {
            case '0':
              let list = []
              ;(res.data ? res.data : []).map(v => {
                list.push({
                  value: v.value,
                  label: v.label,
                  disabled: v.value === '02' || v.value === '03',
                })
              })
              this.projStatusList = list
              res.data && res.data.length > 0
                ? (this.result.projStatus = res.data[0].value)
                : null
              break
          }
        },
      )
      this.$api.public.dict({ codeGroup: 'customer_level', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.customerLevelList = res.data
            break
        }
      })
      this.$api.public.dict({ codeGroup: 'idc_proj_type', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.projTypeList = res.data
            break
        }
      })
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
            this.idcRoomList = list
            break
        }
      })
      if (this.projId) {
        this.$api.service.IDCproject.getDetail({ projId: this.projId }, res => {
          console.log(res)
          switch (res.code) {
            case '0':
              this.result = res.data
              this.data = JSON.parse(JSON.stringify(res.data))
              break
            default:
              res.message
                ? this.$store.commit('alertFn', {
                    type: 'error',
                    text: res.message,
                    func: () => {
                      this.$router.push('/')
                    },
                  })
                : this.$router.push('/')
              break
          }
        })
      }
    },
  },
  created() {
    this.name = this.$route.name
    this.projId = this.$route.params.projId
      ? this.$pubfunc.decode(this.$route.params.projId)
      : null
    if (
      (!this.projId && this.name !== 'IDCProjectAdd') ||
      (this.name === 'IDCProjectAdd' && !this.judgeBtn.idcprojectAdd)
    ) {
      this.cancel()
      return
    }
    this.getDropData()
  },
}
</script>

<style scoped>
.formMainCont {
  font-size: 0;
}
.formUl {
  display: inline-block;
  width: 33.33333%;
  vertical-align: top;
}
.formUl100 {
  width: 100%;
}
ul.formUl {
  padding-bottom: 20px;
}
.formUl > li > textarea {
  width: 230px;
  height: 82px;
}
.contactList {
  overflow: hidden;
}
.contactList > div {
  margin-right: -30px;
  padding-bottom: 32px;
}
.contactList > div > button {
  margin: 26px 30px 0 0;
  vertical-align: top;
}
.formUl > li > span.formTitle {
  width: 155px;
}
li > span.otherProduct {
  display: inline-block;
  height: 30px;
  font-size: 14px;
  box-sizing: border-box;
  text-align: right;
  color: #484b5c;
  white-space: nowrap;
  float: left;
}
li > span.otherProduct + .el-textarea {
  float: right;
  width: 83%;
}
.formUl > li u.error {
  left: 100px;
}
ul.formUl.padding0 {
  padding-bottom: 12px;
}
.formUl > li > span.textsmall {
  width: 200px;
  margin-left: -100px;
}
.formUl > li > .projRadio {
  line-height: 32px;
}
.formUl > li .projRadio.projRadio_ {
  line-height: 26px;
  display: block;
}
.formUl > li .projRadio.projRadio_:nth-child(1) {
  margin-top: 3px;
}
.formUl > li .projRadio.projRadio_:nth-last-child(1) {
  margin-bottom: 1px;
}
.formUl > li.radioBox u.error {
  text-align: left;
  padding-left: 24px;
  line-height: 22px;
  position: absolute;
}
.formUl > li.radioBox u.error::before {
  left: -6px;
  top: -4px;
}
@media screen and (max-width: 1550px) {
  .textsmall {
    font-size: 12px;
  }
}
.orangeTxt {
  color: #e6a23c;
}
.unableTxt * {
  color: #bbbbbb !important;
}
.formUl > li.marginBottom {
  margin-bottom: -50px;
}
.updatedetail {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('../../assets/images/updatedetail.png') center/100% 100%
    no-repeat;
  vertical-align: top;
  margin: 0 2px;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;
}
.updatedetail:hover {
  opacity: 0.8;
}
.smallTxt {
  font-size: 12px;
  padding: 0 2px;
}
/* 表格 */
.formMainCont .tableBox {
  padding: 22px 0 32px;
}
.formMainCont .tableBox > li {
  display: inline-block;
  width: 33.33%;
  vertical-align: top;
}
.formMainCont .tableBox > .li30 {
  width: 29%;
}
.formMainCont .tableBox > li.maxTable {
  display: block;
  width: 100%;
}
.formMainCont .tableBox > li:nth-child(1) {
  margin: 0 1.6% 0 0.2%;
}
.company {
  font-size: 14px;
  display: inline-block;
  line-height: 32px;
  margin-left: -30px;
  width: 30px;
  text-align: center;
  color: #c2c6cd;
  text-indent: -5px;
}
</style>
<style>
.formMainCont .tableBox > li.maxTable:nth-child(2) .tableBrand > .title {
  margin-top: 34px;
}
.formMainCont .tableBox > li.maxTable .tableBrand > .title {
  color: #4680f4;
  margin-bottom: 8px;
}
.formMainCont .tableBox > li.maxTable .tableBrand > .title::before {
  background-color: #4680f4;
}
.projectForm
  > .contentFix
  > .boxRel
  > .unitScrollbar
  > .el-scrollbar__wrap
  > .el-scrollbar__view {
  min-width: 1000px;
}
.projectForm .textEllipse3 {
  max-height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
@media screen and (max-width: 1500px) {
  .changeFormW.projectForm .formUl > li > textarea,
  .changeFormW.projectForm .formUl > li > input,
  .changeFormW.projectForm .formUl > li > div,
  .changeFormW.projectForm .formUl > li > div > .el-select,
  .changeFormW.projectForm .formUl > li .el-date-editor.el-input,
  .changeFormW.projectForm .formUl > li .el-date-editor.el-input__inner {
    width: 190px !important;
  }
}
@media screen and (max-width: 1500px) {
  .changeFormW.projectForm .formUl > li u.error {
    width: 190px !important;
  }
}
@media screen and (max-width: 1350px) {
  .changeFormW.projectForm .formUl > li > textarea,
  .changeFormW.projectForm .formUl > li > input,
  .changeFormW.projectForm .formUl > li > div,
  .changeFormW.projectForm .formUl > li > div > .el-select,
  .changeFormW.projectForm .formUl > li .el-date-editor.el-input,
  .changeFormW.projectForm .formUl > li .el-date-editor.el-input__inner {
    width: 180px !important;
  }
}
@media screen and (max-width: 1350px) {
  .changeFormW.projectForm .formUl > li u.error {
    width: 180px !important;
  }
}
.confirm > div > span > span.projScore {
  color: #ff2424;
  font-size: 20px;
  padding: 0 5px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:after {
  content: '';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.clearfix {
  *zoom: 1;
}
.mr300 {
  margin-right: 300px;
}
.projectForm .formMainCont .tableBox > li.borderRight1 {
  border-right: 1px solid #ccc;
  padding-right: 20px;
  box-sizing: border-box;
  position: relative;
}
.projectForm .formMainCont .tableBox > li.borderRight1:nth-child(2) {
  margin: 0 1.6% 0 0.2%;
}
</style>
