<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-14 09:48:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-03 14:37:30
--> 
<template>
  <div class="formPage projectApproval">
    <div class="formMainCont">
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">销售：</span>
          <div>{{data.ownerName|emptyTxt}}</div>
        </li>
      </ul>
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">子公司：</span>
          <div>{{data.subCompanyName|emptyTxt}}</div>
        </li>
      </ul>
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">所属部门：</span>
          <div>{{data.depName|emptyTxt}}</div>
        </li>
      </ul>
    </div>
    <div class="formMainTitle"><span>项目基本信息</span></div>
    <div class="formMainCont">
      <ul class="formUl">
        <li class="small">
          <span class="formTitle">客户名称：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.customerName)"></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle">客户等级：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.customerLevelTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">项目编号：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projNo)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">项目名称：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projName)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">预计年合同额：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.estAnnualConAmount_)+' '+'元'"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle"><i class="updatedetail"
               title='查看修改信息'
               @click="showDetail('winRate')"
               v-if="judgeUpdate('winRate')"></i>项目赢率：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.winRateTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle"><i class="updatedetail"
               title='查看修改信息'
               @click="showDetail('projStatus')"
               v-if="judgeUpdate('projStatus')"></i>项目状态：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projStatusTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if="(role||name==='IDCProjectView') && Number(data.projStatus)>3">
          <span class="formTitle">
            {{data.projStatusTxt}}原因：
          </span>
          <div>
            <unit-popover :content="emptyTxt(data.projStatusReason)"
                          :lines="3"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle"><i class="updatedetail"
               title='查看修改信息'
               @click="showDetail('projType')"
               v-if="judgeUpdate('projType')"></i>项目类型：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projTypeTxt)"></unit-popover>
          </div>
        </li>
      </ul>
      <ul class="formUl">
        <li class="small"
            v-if="!role&&(name==='IDCProjectEdit')">
          <span class="formTitle">项目编号：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projNo)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if="!role&&(name==='IDCProjectEdit')">
          <span class="formTitle va_m">项目名称：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"||!data.updateFlag.projName'>
            <unit-popover :content="emptyTxt(data.projName)"></unit-popover>
          </div>
          <input id="contactPosition"
                 class="va_m"
                 v-if="!role&&(name==='IDCProjectEdit')&&data.updateFlag.projName"
                 type="text"
                 v-model='result.projName'></input>
        </li>
        <li class="small"
            v-if="!role&&(name==='IDCProjectEdit')">
          <span class="formTitle">项目类型：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projTypeTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">客户联系人：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.contactName)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">所属机房：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.idcRoomTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">机柜数量：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.cabinetNumber)+' '+'个'"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">机柜电量：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.cabinetElectricity)+' '+'A'"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">带宽要求：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.bandwidth)+' '+'M'"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">其他要求：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.others)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">预计结案日期：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.planFinishTime)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">项目进度说明：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.scheduleDescription)"></unit-popover>
          </div>
        </li>
      </ul>
      <ul class="formUl">
        <li class="small"
            v-if="!role&&(name==='IDCProjectEdit')">
          <span class="formTitle">所属机房：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.idcRoomTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if="!role&&(name==='IDCProjectEdit')">
          <span class="formTitle">预计年合同额：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.estAnnualConAmount_)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">客户联系人职务：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.contactPosition)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle formTitle3">是否预约参观机房：</span>
          <div class="popoverTxt"
               v-if='role||name==="IDCProjectView"'>
            <unit-popover :content="emptyTxt(data.haveVisitAppointmentTxt)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">客户需求侧重点：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.customerDemandFocus)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle formTitle3">客户重点业务说明：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.customerKeyBussiness)"></unit-popover>
          </div>
        </li>
        <li class="small"
            v-if='role||name==="IDCProjectView"'>
          <span class="formTitle">备注：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.remark)"></unit-popover>
          </div>
        </li>
      </ul>
    </div>
    <div class="formMainTitle"><span>协同信息</span></div>
    <div class="formMainCont">
      <ul class="formUl">
        <li class="radioBox small"
            :class="{'small1':name==='IDCProjectEdit'&&!(((!result.commitStatus&&data.commitStatus==='0')||(result.commitStatus==='0'))||(!role&&data.staffRole!=='isCharge')),'errorBorder':error.key==='commitStatus'}">
          <span class="formTitle"><i class="must"
               v-if="!role&&name==='IDCProjectEdit'&&(data.commitConfirm!=='1')">*</i><i class="updatedetail"
               title='查看修改信息'
               @click="showDetail('commitStatus')"
               v-if="judgeUpdate('commitStatus')"></i>commit状态：</span>
          <div v-if="role||name==='IDCProjectView'||!(data.commitConfirm!=='1')">{{data.commitStatus?commitStatusTxt[(!result.commitStatus&&data.commitStatus)||result.commitStatus]:''|emptyTxt}}</div>
          <el-radio v-if="!role&&name==='IDCProjectEdit'&&(data.commitConfirm!=='1')"
                    class="projRadio projRadio1"
                    v-model="result.commitStatus"
                    label="1">是</el-radio>
          <el-radio v-if="!role&&name==='IDCProjectEdit'&&(data.commitConfirm!=='1')"
                    class="projRadio projRadio1"
                    v-model="result.commitStatus"
                    label="0">否</el-radio>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='commitStatus'">{{error.msg}}</u></transition>
        </li>
        <li class="radioBox"
            :class="{'small':(!role&&data.staffRole!=='isCharge')||name==='IDCProjectView'||(!result.commitStatus&&data.commitStatus==='0')||result.commitStatus==='0','errorBorder':error.key==='commitConfirm','unableTxt':(!result.commitStatus&&data.commitStatus!=='1')||result.commitStatus==='0'}">
          <span class="formTitle"><i class="must"
               v-if="(role||data.staffRole==='isCharge')&&((!result.commitStatus&&data.commitStatus==='1')||result.commitStatus==='1')&&name==='IDCProjectEdit'">*</i><i class="updatedetail"
               title='查看修改信息'
               @click="showDetail('commitConfirm')"
               v-if="judgeUpdate('commitConfirm')"></i>commit确认：</span>
          <div :class="{'orangeTxt':!data.commitConfirm}"
               v-if="(!role&&data.staffRole!=='isCharge')||(!result.commitStatus&&data.commitStatus==='0')||result.commitStatus==='0'||name==='IDCProjectView'">
            <unit-popover :content="emptyTxt(commitConfirmTxt[data.commitConfirm])"
                          :lines='3'
                          v-if="data.commitConfirm"></unit-popover>{{data.commitConfirm?'':'待回填'}}
          </div>
          <el-radio v-if="(role||data.staffRole==='isCharge')&&((!result.commitStatus&&data.commitStatus==='1')||result.commitStatus==='1')&&name==='IDCProjectEdit'"
                    class="projRadio"
                    v-model="result.commitConfirm"
                    label="1">同意</el-radio>
          <el-radio v-if="(role||data.staffRole==='isCharge')&&((!result.commitStatus&&data.commitStatus==='1')||result.commitStatus==='1')&&name==='IDCProjectEdit'"
                    class="projRadio"
                    v-model="result.commitConfirm"
                    label="0">不同意</el-radio>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='commitConfirm'">{{error.msg}}</u></transition>
        </li>
        <li class="thisTextarea small"
            :class="{'errorBorder':error.key==='commitConfirmReason','unableTxt':(!result.commitStatus&&data.commitStatus!=='1')||result.commitStatus==='0'}"
            v-if="((name==='IDCProjectView'&&data.commitConfirm==='0')||(name==='IDCProjectEdit'&&((!result.commitConfirm&&data.commitConfirm==='0')||result.commitConfirm==='0'||(result.commitStatus==='0'&&data.commitConfirm))))">
          <span class="formTitle"><i class="must"
               v-if="(role||data.staffRole==='isCharge')&&((!result.commitStatus&&data.commitStatus==='1')||result.commitStatus==='1')&&name==='IDCProjectEdit'">*</i>不同意原因：</span>
          <div v-if="(!role&&data.staffRole!=='isCharge')||(!result.commitStatus&&data.commitStatus==='0')||result.commitStatus==='0'||name==='IDCProjectView'"
               class="popoverTxt">
            <unit-popover :content="emptyTxt(data.commitConfirmReason)"
                          :lines='3'></unit-popover>
          </div>
          <textarea v-if="(role||data.staffRole==='isCharge')&&((!result.commitStatus&&data.commitStatus==='1')||result.commitStatus==='1')&&name==='IDCProjectEdit'"
                    class="input smallInput"
                    v-model="result.commitConfirmReason"
                    maxlength="200"
                    @input="clearErr('commitConfirmReason')"></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='commitConfirmReason'">{{error.msg}}</u></transition>
        </li>

      </ul>
    </div>
    <div class="formMainTitle"
         v-if="!role&&name==='IDCProjectEdit'"><span>修改信息</span></div>
    <div class="formMainCont"
         v-if="!role&&name==='IDCProjectEdit'">
      <ul class="formUl">
        <li :class="{'errorBorder':error.key==='contact'}">
          <span class="formTitle formTitle2"><i class="must">*</i>客户联系人：</span>
          <unit-contact v-if="!role&&(name==='IDCProjectEdit')"
                        id="contact"
                        placeholder
                        @change="dropdownReturn"
                        :input="true"
                        :orgid="data.customerId?data.customerId:null"
                        :result="data.contact"
                        type="customer"></unit-contact>

          <transition name="publicTransition"><u class="error"
               v-if="error.key==='contact'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='contactPosition'}">
          <span class="formTitle formTitle2"><i class="must">*</i>联系人职务：</span>
          <input id="contactPosition"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="clearErr('contactPosition')"
                 v-model='result.contactPosition'></input>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='contactPosition'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='customerDemandFocus'}">
          <span class="formTitle formTitle2"><i class="must">*</i>需求侧重点：</span>
          <textarea id="customerDemandFocus"
                    v-if="!role&&(name==='IDCProjectEdit')"
                    class="input"
                    maxlength="200"
                    @input="clearErr('customerDemandFocus')"
                    v-model='result.customerDemandFocus'></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='customerDemandFocus'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='customerKeyBussiness'}">
          <span class="formTitle formTitle2"><i class="must">*</i>重点业务说明：</span>
          <textarea id="customerKeyBussiness"
                    v-if="!role&&(name==='IDCProjectEdit')"
                    class="input"
                    maxlength="200"
                    @input="clearErr('customerKeyBussiness')"
                    v-model='result.customerKeyBussiness'></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='customerKeyBussiness'">{{error.msg}}</u></transition>
        </li>
      </ul>
      <ul class="formUl">
        <li :class="{'errorBorder':error.key==='cabinetNumber'}">
          <span class="formTitle"><i class="must">*</i>机柜数量：</span>
          <input id="cabinetNumber"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="int('cabinetNumber')"
                 v-model='result.cabinetNumber'></input>
          <i v-if="!role&&(name==='IDCProjectEdit')"
             class="company">个</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='cabinetNumber'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='cabinetElectricity'}">
          <span class="formTitle"><i class="must">*</i>机柜电量：</span>
          <input id="cabinetElectricity"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="int('cabinetElectricity')"
                 v-model='result.cabinetElectricity'></input>
          <i v-if="!role&&(name==='IDCProjectEdit')"
             class="company">A</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='cabinetElectricity'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='bandwidth'}">
          <span class="formTitle"><i class="must">*</i>带宽要求：</span>
          <input id="bandwidth"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="int('bandwidth')"
                 v-model='result.bandwidth'></input><i v-if="!role&&(name==='IDCProjectEdit')"
             class="company">M</i>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='bandwidth'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='others'}">
          <span class="formTitle"><i class="must">*</i>其他要求：</span>
          <input id="others"
                 v-if="!role&&(name==='IDCProjectEdit')"
                 type="text"
                 @input="clearErr('others')"
                 v-model='result.others'></input>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='others'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='scheduleDescription'}">
          <span class="formTitle"><i class="must"
               v-if="(data.projStage==='03'||data.projStage==='04')&&name==='IDCProjectEdit'">*</i>项目进度说明：</span>
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
      <ul class="formUl">
        <li :class="{'errorBorder':error.key==='planFinishTime'}">
          <span class="formTitle"><i class="must">*</i>预计结案日期：</span>
          <unit-time placeholder=''
                     :value='result.planFinishTime'
                     id='planFinishTime'
                     :clear='true'
                     @return='dropdownReturn'></unit-time>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='planFinishTime'">{{error.msg}}</u></transition>
        </li>
        <li>
          <span class="formTitle"
                style="margin-left: -37px;width: 137px">是否预约参观机房：</span>
          <unit-dropdown id="haveVisitAppointment"
                         :clear='true'
                         :list="haveVisitAppointment"
                         @change='dropdownReturn'
                         :result='result.haveVisitAppointment'></unit-dropdown>

        </li>
        <li :class="{'errorBorder':error.key==='winRate'}">
          <span class="formTitle"><i class="must">*</i>项目赢率：</span>
          <unit-dropdown id="winRate"
                         :list="winRate"
                         @change='dropdownReturn'
                         :result='result.winRate'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='winRate'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='winRateReason'}"
            v-if="Number(result.winRate)<Number(data.winRate)">
          <span class="formTitle smalltext"><i class="must">*</i>赢率变小原因：</span>
          <textarea class="input"
                    v-model="result.winRateReason"
                    maxlength="500"
                    @input="clearErr('winRateReason')"></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='winRateReason'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='projStatus'}">
          <span class="formTitle"><i class="must">*</i>项目状态：</span>
          <unit-dropdown id="projStatus"
                         :list="projStatus"
                         @change='dropdownReturn'
                         :result='result.projStatus'></unit-dropdown>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='projStatus'">{{error.msg}}</u></transition>
        </li>
        <li :class="{'errorBorder':error.key==='projStatusReason'}"
            v-if="Number(result.projStatus)>3">
          <span class="formTitle"><i class="must">*</i>{{result.projStatusTxt}}原因：</span>
          <textarea class="input"
                    v-model="result.projStatusReason"
                    maxlength="500"
                    @input="clearErr('projStatusReason')"></textarea>
          <transition name="publicTransition"><u class="error"
               v-if="error.key==='projStatusReason'">{{error.msg}}</u></transition>
        </li>
        <li>
          <span class="formTitle">
            备注：
          </span>
          <textarea class="input"
                    v-model="result.remark"
                    maxlength="500"></textarea>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitPopover from '@/unit/components/popover'
import unitContact from '@/unit/components/thisUnit/contact'
import unitTime from '@/unit/components/element/timeBox'
export default {
  name: 'IDCProjapproval',
  props: ['dom', 'data', 'role', 'name', 'loading'],
  components: { unitPopover, unitContact, unitTime },
  inject: ['cancel'],
  data() {
    return {
      result: {
        contact: '',
        contactPosition: '',
        cabinetNumber: '',
        cabinetElectricity: '',
        bandwidth: '',
        others: '',
        scheduleDescription: '',
        customerDemandFocus: '',
        customerKeyBussiness: '',
        projStatus: '',
        projStatusTxt: '',
        projStatusReason: '',
        winRate: '',
        winRateReason: '',
        remark: '',
        commitStatus: '',
        commitConfirm: '',
        estAnnualConAmount: '',
        estAnnualConAmount_: '',
        planFinishTime: '',
        haveVisitAppointment: '',
        remark: '',
        // commitConfirm:'',
        // commitConfirmReason:'',
      },
      error: {
        key: null,
        msg: '',
      },
      commitStatusTxt: {
        '0': '否',
        '1': '是',
      },
      commitConfirmTxt: {
        '0': '不同意',
        '1': '同意',
      },
      feasibilityTxt: {
        '0': '不可行',
        '1': '可行',
      },
      projStatus: [],
      winRate: [],
      haveVisitAppointment: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
        { label: '无需参观', value: '-1' },
      ],
    }
  },
  filters: {
    emptyTxt(v) {
      return v || v==0 ? v : '--'
    },
  },
  watch: {
    name(v) {
      v === 'IDCProjectEdit' ? this.getDropData() : null
      // console.log(v)
      this.clearErr()
    },
    'result.commitStatus'(v) {
      this.clearErr('commitStatus')
      this.clearErr('commitConfirm', 'commitConfirmReason')
      // this.result.commitConfirmReason===undefined?null:this.result.commitConfirmReason=''
    },
    'result.commitConfirm'(v) {
      this.clearErr('commitConfirm', 'commitConfirmReason')
      this.result.commitConfirmReason === undefined
        ? null
        : (this.result.commitConfirmReason =
            this.result.commitConfirm === '0' && this.data.commitConfirm === '0'
              ? this.data.commitConfirmReason
              : '')
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
      return v||v==0 ? v + (money ? ' 元' : '') : '--'
    },
    getDropData() {
      this.projStatus && this.projStatus.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'idc_proj_status', pCode: '' },
            res => {
              // console.log(res)
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
                  this.projStatus = list
                  break
              }
            },
          )
      this.winRate && this.winRate.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: 'idc_win_rate', pCode: '' },
            res => {
              // console.log(res)
              switch (res.code) {
                case '0':
                  this.winRate = res.data ? res.data : []
                  break
              }
            },
          )
      if (!this.role) {
        for (let k in this.result) {
          this.result[k] = this.data[k]
        }
        this.result.estAnnualConAmount_ = this.$pubfunc.transformPrice(
          this.data.estAnnualConAmount,
          true,
        )
        this.result.projName = JSON.parse(JSON.stringify(this.data.projName))
        if (this.data.tenderProjName) {
          delete this.result.tenderProjName
        }
        if (this.data.companySupport) {
          delete this.result.companySupport
        }
        if (this.name === 'IDCProjectEdit') {
          this.$set(this.result, 'commitStatus', this.data.commitStatus)
          for (let i in this.updateReason) {
            this.updateReason[i] = ''
          }
        } else {
          delete this.result.commitStatus
        }
      } else {
        this.result = {}
        this.$set(this.result, 'commitConfirm', this.data.commitConfirm)
        this.$nextTick(() => {
          this.$set(
            this.result,
            'commitConfirmReason',
            this.data.commitConfirmReason,
          )
        })
      }
      if (this.data.staffRole === 'isCharge') {
        this.$set(this.result, 'commitConfirm', this.data.commitConfirm)
        this.$nextTick(() => {
          this.$set(
            this.result,
            'commitConfirmReason',
            this.data.commitConfirmReason,
          )
        })
      }
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
      this.clearErr(key, 'updateReason_' + key)
      switch (key) {
        case 'projStatus':
          this.result.projStatus = res.value
          this.result.projStatusTxt = res.label
          this.result.projStatusReason = ''
          this.result.projStatus === '02' && this.result.buyType !== '04'
            ? this.$store.commit('alertFn', {
                type: 'warning',
                text: '项目阶段达到投标准备阶段时请填写投标结果',
                time: 2000,
              })
            : null
          break
        case 'planFinishTime':
          this.result[key] = this.$pubfunc.TimeTransform('YYYY/MM/DD', res)
          break
        case 'contact':
          this.result.contact = res.value
          this.result.contactPosition = res.position
          break
        default:
          this.result[key] = res.value
          break
      }
    },
    clearErr(key, key1) {
      if (!key || key === this.error.key || key1 === this.error.key) {
        this.error.key = null
      }
    },
    setErr(key, text) {
      // console.log(key,text)
      this.$store.commit('alertFn', {
        type: 'error',
        text: '保存失败，请修改对应的错误内容',
        time: 2000,
      })
      this.error.key = key
      this.error.msg = text
      return false
    },
    projName(e) {
      this.result.projName = e.target.value
      console.log(this.result.projName)
    },
    showDetail(key) {
      this.$emit('dialog', {
        scroll: false,
        show: true,
        link: 'updateDetail',
        small: 900,
        title: '查看修改信息',
        data: { key, list: this.data.updatefielddetail[key] },
      })
    },
    judgeUpdate(k) {
      // console.log(this.data.updatefielddetail)
      let keys = [
          'projAmount',
          'winRate',
          'policymarker',
          'planFinishTime',
          'buyType',
          'customerMoneySource',
          'mainBrand',
          'projStatus',
          'remark',
          'commitStatus',
          'commitConfirm',
          'preSale',
        ],
        preSaleKeys = ['tecDifficulty', 'tecDifficultyDesc', 'tecDirector'],
        tecDirectorKeys = ['feasibility', 'feasibilityDesc']
      if (this.name !== 'IDCProjectView') {
        return false
      }
      switch (this.data.staffRole) {
        case 'preSale':
          if (preSaleKeys.indexOf(k) === -1) {
            return false
          }
          break
        case 'tecDirector':
          if (tecDirectorKeys.concat(preSaleKeys).indexOf(k) === -1) {
            return false
          }
          break
        default:
          if (
            keys
              .concat(tecDirectorKeys)
              .concat(preSaleKeys)
              .indexOf(k) === -1
          ) {
            return false
          }
          break
      }
      return this.data.updatefielddetail &&
        this.data.updatefielddetail[k] &&
        this.data.updatefielddetail[k].length > 0
        ? true
        : false
    },
    submit(cb) {
      if (this.loading) {
        return
      }
      let param = {
          projId: this.data.projId,
        },
        url,
        hasChange = false
      if (this.role && this.data.commitStatus === '1') {
        if (!this.result.commitConfirm) {
          return this.setErr('commitConfirm', '请选择commit确认')
        }
        if (
          this.result.commitConfirm === '0' &&
          this.result.commitConfirm !== this.data.commitConfirm &&
          !this.$pubfunc.replaceSpace(this.result.commitConfirmReason, 1)
        ) {
          return this.setErr('commitConfirmReason', '请输入不同意原因')
        }
        for (let k in this.result) {
          ;(this.result[k] ? this.result[k] : '') !=
          (this.data[k] ? this.data[k] : '')
            ? (k !== 'commitConfirmReason' ? (hasChange = true) : null,
              (param[k] = this.result[k]))
            : null
        }
        param.commitConfirmReason && param.commitConfirm === undefined
          ? (param.commitConfirm = this.result.commitConfirm)
          : null
        param.commitConfirm ? (url = 'savecommitconfirm') : null
      } else if (this.data.owner === this.data.userInfo.staffId || this.data.userInfo.isAdmin==='1') {
        // 项目赢率
        if (!this.result.winRate) {
          return this.setErr('winRate', '请选择项目赢率')
        }
        if (
          Number(this.result.winRate) < Number(this.data.winRate) &&
          !this.$pubfunc.replaceSpace(this.result.winRateReason, 1)
        ) {
          return this.setErr('winRateReason', '请输入赢率变小原因')
        }

        // 项目状态
        if (!this.result.projStatus) {
          return this.setErr('projStatus', '请选择项目状态')
        }
        if (
          Number(this.result.projStatus) > 3 &&
          // this.result.projStatus !== this.data.projStatus &&
          !this.$pubfunc.replaceSpace(this.result.projStatusReason, 1)
        ) {
          return this.setErr(
            'projStatusReason',
            '请输入' + this.result.projStatusTxt + '原因',
          )
        }

        //联系人
        if (!this.result.contact) {
          return this.setErr('contact', '请输入联系人')
        }
        //联系人职务
        if (!this.result.contactPosition) {
          return this.setErr('contactPosition', '请输入联系人职务')
        }
        //  需求侧重点
        if (!this.$pubfunc.replaceSpace(this.result.customerDemandFocus, 1)) {
          return this.setErr('customerDemandFocus', '请输入客户需求侧重点')
        }
        // 重点业务说明
        if (
          !this.$pubfunc.replaceSpace(this.result.customerKeyBussiness, 1)
        ) {
          return this.setErr('customerKeyBussiness', '请输入客户重点业务说明')
        }
        // 机柜数量
        if (!this.$pubfunc.replaceSpace(this.result.cabinetNumber, 1)) {
          return this.setErr('cabinetNumber', '请输入机柜数量')
        }
        // 机柜电量
        if (!this.$pubfunc.replaceSpace(this.result.cabinetElectricity, 1)) {
          return this.setErr('cabinetElectricity', '请输入机柜电量')
        }
        // 带宽
        if (!this.$pubfunc.replaceSpace(this.result.bandwidth, 1)) {
          return this.setErr('bandwidth', '请输入带宽')
        }
        //其他要求
        if (!this.$pubfunc.replaceSpace(this.result.others, 1)) {
          return this.setErr('others', '请输入其他要求')
        }
        // 项目进度说明
        if (
          (this.data.projStage === '03' || this.data.projStage === '04') &&
          !this.result.scheduleDescription
        ) {
          return this.setErr('scheduleDescription', '请输入项目进度说明')
        }
        //预计结案日期
        if (!this.result.planFinishTime) {
          return this.setErr('planFinishTime', '请选择预计结案日期')
        }

        let keys = [
          'projId',
          'depId',
          'projNo',
          'customerLevel',
          'customerId',
          'idcRoom',
          'projName',
          'estAnnualConAmount',
          'projType',
          'projTypeTxt',
          'contact',
          'contactPosition',
          'cabinetNumber',
          'cabinetElectricity',
          'bandwidth',
          'others',
          'customerDemandFocus',
          'customerKeyBussiness',
          'commitStatus',
          'winRate',
          'scheduleDescription',
          'projStatus',
          'projStatusReason',
          'planFinishTime',
          'haveVisitAppointment',
          'remark',
          'updateReason',
        ]
        for (let k in keys) {
          this.result[keys[k]] !== undefined &&
          (this.result[keys[k]] ? this.result[keys[k]] : '') !==
            (this.data[keys[k]] ? this.data[keys[k]] : '') &&
          k !== 'projAmount_'
            ? (hasChange = true)
            : null
          param[keys[k]] =
            this.result[keys[k]] !== undefined &&
            this.data.updateFlag[keys[k]] !== false
              ? this.result[keys[k]]
              : this.data[keys[k]]
        }
        if (this.data.commitStatus !== this.result.commitStatus) {
          param.commitStatus = this.result.commitStatus
        }
        param.updateReason = {}
        for (let k in this.updateReason) {
          this.result[k] !== this.data[k]
            ? (param.updateReason[k] = this.updateReason[k])
            : null
        }
        if (Number(this.result.winRate) < Number(this.data.winRate)) {
          param.updateReason.winRate = this.result.winRateReason
        }
        if (
          Number(this.result.projStatus) > 3 &&
          this.result.projStatus !== this.data.projStatus
        ) {
          param.updateReason.projStatus = this.result.projStatusReason
        }
        let keys_ = [
          'tecDirector',
          'tecDifficulty',
          'tecDifficultyDesc',
          'feasibility',
          'feasibilityDesc',
        ]
        for (let k in keys_) {
          param[keys_[k]] = this.data[keys_[k]]
        }
        url = 'saveproposal'
      }
      //         console.log('result',this.result.projStatusReason);
      //   console.log('data',this.data.projStatusReason);
      // console.log(hasChange);
      if (hasChange) {
        cb
          ? this.$store.commit('confirmFn', {
              func: () => {
                this.ajaxFn(url, param, cb)
              },
              cancel: () => {
                cb()
              },
              text: '是否保存您本页更改的信息？<br/>取消即放弃保存修改',
            })
          : this.ajaxFn(url, param, cb)
      } else {
        this.judgeNext(null, () => {
          cb ? cb() : this.cancel(true)
        })
      }
    },
    ajaxFn(url, param, cb) {
      if (url) {
        this.$emit('loadingfn', true)
        this.$api.service.IDCproject[url](param, res => {
          // console.log(res)
          switch (res.code) {
            case '0':
              this.judgeNext(cb)
              break
            default:
              this.$emit('loadingfn', false)
              res.message
                ? this.$store.commit('alertFn', {
                    type: 'error',
                    text: res.message,
                  })
                : null
          }
        })
      } else {
        this.judgeNext(cb)
      }
    },
    judgeNext(cb, cb1) {
      if (this.role && this.data.staffRole === 'isCharge') {
        cb1 ? cb1() : this.showSuc(cb)
        return
      }
      let p
      switch (this.data.staffRole) {
        case 'isCharge':
          if (this.result.commitStatus === '0') {
            cb1 ? cb1() : this.showSuc(cb)
            break
          }
          if (this.result.commitConfirm === this.data.commitConfirm) {
            cb1 ? cb1() : this.showSuc(cb)
            return
          }
          p = {
            projId: this.data.projId,
            commitConfirm: this.result.commitConfirm,
            commitConfirmReason: this.result.commitConfirmReason,
          }
          this.$api.service.project.savecommitconfirm(p, res => {
            // console.log(res)
            this.$emit('loadingfn', false)
            switch (res.code) {
              case '0':
                this.showSuc(cb)
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
          c
        default:
          cb1
            ? cb1()
            : (this.$emit('loadingfn', false),
              this.showSuc(cb, this.role ? '操作成功' : '保存成功'))
          break
      }
    },
    showSuc(cb, text) {
      this.$store.commit('alertFn', {
        type: 'success',
        text: text ? text : '保存成功',
        func: () => {
          cb ? cb() : this.cancel(true)
        },
      })
    },
  },
  created() {
    if (!this.data.projId) {
      return
    }
    if (this.name === 'IDCProjectEdit') {
      this.getDropData()
    }
    this.$emit('ok')
  },
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
  display: inline-block;
  width: 33.33333%;
  vertical-align: top;
}

.formUl100 {
  width: 100%;
}
ul.formUl {
  padding-bottom: 0px;
}
ul.formUl .small {
  margin-bottom: 10px;
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
  width: 120px;
}
.formUl > li > span.formTitle2 {
  width: 125px;
}
.formUl > li > span.formTitle3 {
  margin-left: -35px;
  width: 135px;
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
li > .otherProductBrother {
  width: 100%;
  font-size: 14px;
}
li > span.otherProduct + .el-textarea {
  float: right;
  width: 83%;
}
.formUl > li u.error {
  left: 100px;
}
ul.formUl.padding0 {
  padding-bottom: 0px;
}
.formUl > li > span.textsmall {
  width: 200px;
  margin-left: -100px;
}
.formUl > li > span.smalltext {
  font-size: 13px;
}
.formUl > li > .projRadio {
  line-height: 32px;
}
.formUl > li > .projRadio.projRadio1 {
  line-height: 16px;
  height: 16px;
}
.formUl > li .projRadio.projRadio_ {
  line-height: 26px;
  display: block;
}
.formUl > li.small.small1 {
  margin-bottom: -8px;
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
  margin-bottom: -34px;
}
.popoverTxt {
  width: calc(100% - 200px);
}
.smallInput {
  margin: -8px 0;
}
.padding28 {
  margin-bottom: 10px;
}
.is-disable {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
.input.textarea {
  height: 82px;
  line-height: 20px;
  padding: 5px 10px;
}
.input.smallInput {
  margin-bottom: 0;
}
@media screen and (max-width: 1800px) {
  .projectApproval .formUl > li.thisTextarea > textarea {
    width: 200px !important;
  }
}
@media screen and (max-width: 1800px) {
  .projectApproval .formUl > li.thisTextarea > u.error {
    width: 200px !important;
  }
}
@media screen and (max-width: 1660px) {
  .projectApproval .formUl > li.thisTextarea > textarea {
    width: 170px !important;
  }
}
@media screen and (max-width: 1660px) {
  .projectApproval .formUl > li.thisTextarea > u.error {
    width: 170px !important;
  }
}
@media screen and (max-width: 1500px) {
  .projectApproval .formUl > li.thisTextarea > textarea {
    width: 150px !important;
  }
}
@media screen and (max-width: 1500px) {
  .projectApproval .formUl > li.thisTextarea > u.error {
    width: 150px !important;
  }
}
.projectApproval .formUl > li > div {
  width: 230px;
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
.projectApproval .textEllipse3 {
  max-height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
@media screen and (max-width: 1500px) {
  .projectApproval .formUl > li > textarea,
  .projectApproval .formUl > li > input,
  .projectApproval .formUl > li > div,
  .projectApproval .formUl > li > div > .el-select,
  .projectApproval .formUl > li .el-date-editor.el-input,
  .projectApproval .formUl > li .el-date-editor.el-input__inner {
    width: 190px !important;
  }
}
@media screen and (max-width: 1500px) {
  .projectApproval .formUl > li u.error {
    width: 190px !important;
  }
}
@media screen and (max-width: 1350px) {
  .projectApproval .formUl > li > textarea,
  .projectApproval .formUl > li > input,
  .projectApproval .formUl > li > div,
  .projectApproval .formUl > li > div > .el-select,
  .projectApproval .formUl > li .el-date-editor.el-input,
  .projectApproval .formUl > li .el-date-editor.el-input__inner {
    width: 180px !important;
  }
}
@media screen and (max-width: 1350px) {
  .projectApproval .formUl > li u.error {
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
.formUl > li > span.formTitle.va_m,
.formUl > li > input.va_m {
  vertical-align: middle;
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
.projectApproval .formMainCont .tableBox > li.borderRight1 {
  border-right: 1px solid #ccc;
  padding-right: 20px;
  box-sizing: border-box;
  position: relative;
}
.projectApproval .formMainCont .tableBox > li.borderRight1:nth-child(2) {
  margin: 0 1.6% 0 0.2%;
}
.lh25 {
  line-height: 2.5;
}
.projectApproval .formUl .fl .el-input--suffix .el-input__suffix {
  line-height: 30px;
}
</style>