<template>
  <div class="formPage projectApproval">
    <div class="formMainCont">
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">销售：</span>
          <div>{{ data.ownerName | emptyTxt }}</div>
        </li>
      </ul>
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">子公司：</span>
          <div>{{ data.subCompanyName | emptyTxt }}</div>
        </li>
      </ul>
      <ul class="formUl padding0">
        <li class="small">
          <span class="formTitle">所属部门：</span>
          <div>{{ data.depName | emptyTxt }}</div>
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
          <span class="formTitle">项目编号：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projNo)"></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle">项目名称：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projName)"></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle">招标项目名称：</span>
          <div
            v-if="name === 'projectView' || data.tenderProjName"
            class="popoverTxt"
          >
            <unit-popover
              :content="emptyTxt(data.tenderProjName)"
            ></unit-popover>
          </div>
          <input
            class="smallInput"
            v-if="name === 'projectEdit' && !data.tenderProjName"
            type="text"
            v-model="result.tenderProjName"
            maxlength="50"
            @input="clearErr('tenderProjName')"
          />
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle">立项原因：</span>
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.proposalReasonTxt)"
            ></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('projAmount')"
              v-if="judgeUpdate('projAmount')"
            ></i
            >项目金额：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="
                emptyTxt(
                  $pubfunc.transformPrice(data.projAmount, true),
                  'money'
                )
              "
            ></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle">项目类型：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projTypeTxt)"></unit-popover>
          </div>
        </li>
      </ul>
      <ul class="formUl">
        <li class="small" v-if="name === 'projectEdit'">
          <span class="formTitle">立项原因：</span>
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.proposalReasonTxt)"
            ></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectEdit'">
          <span class="formTitle">项目类型：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.projTypeTxt)"></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('winRate')"
              v-if="judgeUpdate('winRate')"
            ></i
            >项目赢率：</span
          >
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.winRateTxt)"></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle">项目阶段：</span>
          <div>
            {{ data.projStageTxt ? data.projStageTxt : "立项" | emptyTxt }}
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('policymarker')"
              v-if="judgeUpdate('policymarker')"
            ></i
            >决策人：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.policymarkerName)"
            ></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle">客户联系人：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.contactName)"></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('planFinishTime')"
              v-if="judgeUpdate('planFinishTime')"
            ></i
            >预计结案日期：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.planFinishTime)"
            ></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('buyType')"
              v-if="judgeUpdate('buyType')"
            ></i
            >采购方式：</span
          >
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.buyTypeTxt)"></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('customerMoneySource')"
              v-if="judgeUpdate('customerMoneySource')"
            ></i
            >客户资金来源：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.customerMoneySourceTxt)"
            ></unit-popover>
          </div>
        </li>
      </ul>
      <ul class="formUl">
        <li class="small" v-if="name === 'projectEdit'">
          <span class="formTitle">客户联系人：</span>
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.contactName)"></unit-popover>
          </div>
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('mainBrand')"
              v-if="judgeUpdate('mainBrand')"
            ></i
            >主要品牌：</span
          >
          <div class="popoverTxt">
            <unit-popover :content="emptyTxt(data.mainBrand)"></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle textsmall">是否包含自有产品：</span>
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.containOwnerProductTxt)"
            ></unit-popover>
          </div>
        </li>
        <li class="small">
          <span class="formTitle textsmall">需要公司层面支持：</span>
          <div
            v-if="name === 'projectView' || data.companySupport"
            class="popoverTxt"
          >
            <unit-popover
              :content="emptyTxt(data.companySupport)"
            ></unit-popover>
          </div>
          <input
            class="smallInput"
            type="text"
            v-if="name === 'projectEdit' && !data.companySupport"
            v-model="result.companySupport"
            maxlength="100"
            @input="clearErr('companySupport')"
          />
        </li>
        <li class="small" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('projStatus')"
              v-if="judgeUpdate('projStatus')"
            ></i
            >项目状态：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.projStatusTxt)"
            ></unit-popover>
          </div>
        </li>
        <li
          class="small"
          v-if="name === 'projectView' && Number(data.projStatus) > 3"
        >
          <span class="formTitle">{{ data.projStatusTxt }}原因：</span>
          <div class="popoverTxt">
            <unit-popover
              :content="
                emptyTxt(
                  data.updatefielddetail &&
                    data.updatefielddetail.projStatus &&
                    data.updatefielddetail.projStatus.length > 0
                    ? data.updatefielddetail.projStatus[
                        data.updatefielddetail.projStatus.length - 1
                      ].modifyReason
                    : data.projStatusReason
                )
              "
              :lines="3"
            ></unit-popover>
          </div>
        </li>
        <li class="small marginBottom" v-if="name === 'projectView'">
          <span class="formTitle"
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('remark')"
              v-if="judgeUpdate('remark')"
            ></i
            >备注：</span
          >
          <div class="popoverTxt">
            <unit-popover
              :content="emptyTxt(data.remark)"
              :lines="3"
            ></unit-popover>
          </div>
        </li>
      </ul>
    </div>

    <div class="formMainTitle">
      <span>安全产品</span>
    </div>
    <div class="formMainCont">
      <div class="formMainCont_top">
        <ul class="formUl clearfix">
          <li :class="{ small: name !== 'projectAdd' }">
            <span class="formTitle lh25"> 最终用户： </span>
            <el-input
              v-if="name === 'projectEdit'"
              class="contactCon auto"
              maxlength="50"
              placeholder
              v-model="result.finalCustomer"
            ></el-input>
            <div class="popoverTxt lh25" v-if="name === 'projectView'">
              <unit-popover
                :content="emptyTxt(data.finalCustomer)"
              ></unit-popover>
            </div>
          </li>
        </ul>
        <ul class="formUl">
          <li :class="{ small: name !== 'projectAdd' }" class="fl">
            <span class="formTitle textsmall lh25"> 卓朗安全产品金额： </span>
            <el-input
              v-if="name === 'projectEdit'"
              class="contactCon auto"
              placeholder
              @input="replacetroilaProductAmount"
              @blur="blurproductamount"
              v-model="result.troilaProductAmount_"
            >
              <span slot="suffix" class="line-height: 30px">元</span>
            </el-input>
            <div class="popoverTxt lh25" v-if="name === 'projectView'">
              <unit-popover
                :content="
                  emptyTxt(
                    $pubfunc.transformPrice(data.troilaProductAmount_, true),
                    'money'
                  )
                "
              ></unit-popover>
            </div>
          </li>
        </ul>
      </div>
      <div class="formMainCont_bottom">
        <ul class="tableBox">
          <li class="boxTable borderRight1">
            <unit-table
              type="FirewallProduct"
              :list="FirewallProduct"
              :edit="name === 'projectEdit'"
              :dropdown="{ productModel: FirewallProductModels }"
              ref="FirewallProduct"
            ></unit-table>
          </li>
          <!-- :dropdown='{brandName:Firewall,typeNames:typeNames,levelTxt:supplierLevel}' -->
          <li class="boxTable borderRight1">
            <unit-table
              type="SecuritySoftwareProduct"
              :list="SecuritySoftwareProduct"
              :edit="name === 'projectEdit'"
              :dropdown="{ productModel: SecuritySoftwareProductModels }"
              ref="SecuritySoftwareProduct"
            ></unit-table>
          </li>
          <li class="boxTable li30">
            <span class="formTitle textsmall otherProduct">其他产品：</span>
            <el-input
              type="textarea"
              v-if="name === 'projectEdit'"
              v-model="result.otherProduct"
              maxlength="255"
              :rows="5"
            ></el-input>
            <div
              class="popoverTxt lh25 otherProductBrother"
              v-if="name === 'projectView'"
            >
              <unit-popover
                :content="emptyTxt(data.otherProduct)"
              ></unit-popover>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="formMainTitle"><span>协同信息</span></div>
    <div class="formMainCont">
      <ul class="formUl">
        <li
          class="radioBox small"
          :class="{
            small1:
              name === 'projectEdit' &&
              !(
                (!result.commitStatus && data.commitStatus === '0') ||
                result.commitStatus === '0' ||
                data.staffRole !== 'isCharge'
              ),
            errorBorder: error.key === 'commitStatus',
          }"
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="name === 'projectEdit' && data.commitConfirm !== '1'"
              >*</i
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('commitStatus')"
              v-if="judgeUpdate('commitStatus')"
            ></i
            >commit状态：</span
          >
          <div v-if="name === 'projectView' || !(data.commitConfirm !== '1')">
            {{
              data.commitStatus
                ? commitStatusTxt[
                    (!result.commitStatus && data.commitStatus) ||
                      result.commitStatus
                  ]
                : "" | emptyTxt
            }}
          </div>
          <el-radio
            v-if="name === 'projectEdit' && data.commitConfirm !== '1'"
            class="projRadio projRadio1"
            v-model="result.commitStatus"
            label="1"
            >是</el-radio
          >
          <el-radio
            v-if="name === 'projectEdit' && data.commitConfirm !== '1'"
            class="projRadio projRadio1"
            v-model="result.commitStatus"
            label="0"
            >否</el-radio
          >
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'commitStatus'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="radioBox"
          :class="{
            small:
              data.staffRole !== 'isCharge' ||
              name === 'projectView' ||
              (!result.commitStatus && data.commitStatus === '0') ||
              result.commitStatus === '0',
            errorBorder: error.key === 'commitConfirm',
            unableTxt:
              (!result.commitStatus && data.commitStatus !== '1') ||
              result.commitStatus === '0',
          }"
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="
                data.staffRole === 'isCharge' &&
                ((!result.commitStatus && data.commitStatus === '1') ||
                  result.commitStatus === '1') &&
                name === 'projectEdit'
              "
              >*</i
            ><i
              class="updatedetail"
              title="查看修改信息"
              @click="showDetail('commitConfirm')"
              v-if="judgeUpdate('commitConfirm')"
            ></i
            >commit确认：</span
          >
          <div
            :class="{ orangeTxt: !data.commitConfirm }"
            v-if="
              data.staffRole !== 'isCharge' ||
              (!result.commitStatus && data.commitStatus === '0') ||
              result.commitStatus === '0' ||
              name === 'projectView'
            "
          >
            <unit-popover
              :content="emptyTxt(commitConfirmTxt[data.commitConfirm])"
              :lines="3"
              v-if="data.commitConfirm"
            ></unit-popover
            >{{ data.commitConfirm ? "" : "待回填" }}
          </div>
          <el-radio
            v-if="
              data.staffRole === 'isCharge' &&
              ((!result.commitStatus && data.commitStatus === '1') ||
                result.commitStatus === '1') &&
              name === 'projectEdit'
            "
            class="projRadio"
            v-model="result.commitConfirm"
            label="1"
            >同意</el-radio
          >
          <el-radio
            v-if="
              data.staffRole === 'isCharge' &&
              ((!result.commitStatus && data.commitStatus === '1') ||
                result.commitStatus === '1') &&
              name === 'projectEdit'
            "
            class="projRadio"
            v-model="result.commitConfirm"
            label="0"
            >不同意</el-radio
          >
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'commitConfirm'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="thisTextarea small"
          :class="{
            errorBorder: error.key === 'commitConfirmReason',
            unableTxt:
              (!result.commitStatus && data.commitStatus !== '1') ||
              result.commitStatus === '0',
          }"
          v-if="
            (name === 'projectView' && data.commitConfirm === '0') ||
            (name === 'projectEdit' &&
              ((!result.commitConfirm && data.commitConfirm === '0') ||
                result.commitConfirm === '0' ||
                (result.commitStatus === '0' && data.commitConfirm)))
          "
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="
                data.staffRole === 'isCharge' &&
                ((!result.commitStatus && data.commitStatus === '1') ||
                  result.commitStatus === '1') &&
                name === 'projectEdit'
              "
              >*</i
            >不同意原因：</span
          >
          <div
            v-if="
              data.staffRole !== 'isCharge' ||
              (!result.commitStatus && data.commitStatus === '0') ||
              result.commitStatus === '0' ||
              name === 'projectView'
            "
            class="popoverTxt"
          >
            <unit-popover
              :content="emptyTxt(data.commitConfirmReason)"
              :lines="3"
            ></unit-popover>
          </div>
          <textarea
            v-if="
              data.staffRole === 'isCharge' &&
              ((!result.commitStatus && data.commitStatus === '1') ||
                result.commitStatus === '1') &&
              name === 'projectEdit'
            "
            class="input smallInput"
            v-model="result.commitConfirmReason"
            maxlength="200"
            @input="clearErr('commitConfirmReason')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'commitConfirmReason'">{{
              error.msg
            }}</u></transition
          >
        </li>
      </ul>
    </div>
    <div class="formMainTitle" v-if="name === 'projectEdit'">
      <span>限制修改信息</span><a>（每项最多修改两次）</a>
    </div>
    <div class="formMainCont" v-if="name === 'projectEdit'">
      <ul class="formUl">
        <li :class="{ errorBorder: error.key === 'projAmount_' }">
          <span class="formTitle"><i class="must">*</i>项目金额：</span>
          <!-- <div class="input is-disable moneyInput" v-if="!data.updateFlag.projAmount"><unit-popover :content="emptyTxt($pubfunc.transformPrice(result.projAmount,true))"></unit-popover></div><i v-if="!data.updateFlag.projAmount">元</i> -->
          <!--  v-if="data.updateFlag.projAmount" -->
          <!--  v-if="data.updateFlag.projAmount" -->
          <input
            class="moneyInput"
            type="text"
            v-model="result.projAmount_"
            maxlength="30"
            @input="clearErr('projAmount_', 'updateReason_projAmount')"
            @blur="inputBlur"
          /><i>元</i>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'projAmount_'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="padding28"
          :class="{ errorBorder: error.key === 'updateReason_projAmount' }"
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="Number(result.projAmount) !== Number(data.projAmount)"
              >*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.projAmount">您已修改两次项目金额，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.projAmount" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.projAmount"
            maxlength="500"
            @input="clearErr('updateReason_projAmount')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'updateReason_projAmount'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li>
          <span class="formTitle">决策人：</span>
          <!--  :disabled='!data.updateFlag.policymarker' -->
          <unit-contact
            id="policymarker"
            placeholder=""
            @change="dropdownReturn"
            :input="true"
            :orgid="data.customerId ? data.customerId : null"
            :result="result.policymarker"
            type="customer"
            :clear="true"
          ></unit-contact>
        </li>
        <li
          class="padding28"
          :class="{ errorBorder: error.key === 'updateReason_policymarker' }"
        >
          <span class="formTitle"
            ><i class="must" v-if="result.policymarker !== data.policymarker"
              >*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.policymarker">您已修改两次决策人，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.policymarker" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.policymarker"
            maxlength="500"
            @input="clearErr('updateReason_policymarker')"
          ></textarea>
          <transition name="publicTransition"
            ><u
              class="error"
              v-if="error.key === 'updateReason_policymarker'"
              >{{ error.msg }}</u
            ></transition
          >
        </li>
      </ul>
      <ul class="formUl">
        <li :class="{ errorBorder: error.key === 'planFinishTime' }">
          <span class="formTitle"><i class="must">*</i>预计结案日期：</span>
          <!--  :disabled='!data.updateFlag.planFinishTime' -->
          <unit-time
            placeholder=""
            :value="result.planFinishTime"
            id="planFinishTime"
            @return="dropdownReturn"
          ></unit-time>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'planFinishTime'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="padding28"
          :class="{ errorBorder: error.key === 'updateReason_planFinishTime' }"
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="result.planFinishTime !== data.planFinishTime"
              >*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.planFinishTime">您已修改两次预计结案日期，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.planFinishTime" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.planFinishTime"
            maxlength="500"
            @input="clearErr('updateReason_planFinishTime')"
          ></textarea>
          <transition name="publicTransition"
            ><u
              class="error"
              v-if="error.key === 'updateReason_planFinishTime'"
              >{{ error.msg }}</u
            ></transition
          >
        </li>
        <li :class="{ errorBorder: error.key === 'buyType' }">
          <span class="formTitle"><i class="must">*</i>采购方式：</span>
          <!--  :disabled='!data.updateFlag.buyType' -->
          <unit-dropdown
            id="buyType"
            :list="buyType"
            @change="dropdownReturn"
            :result="result.buyType"
          ></unit-dropdown>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'buyType'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="padding28"
          :class="{ errorBorder: error.key === 'updateReason_buyType' }"
        >
          <span class="formTitle"
            ><i class="must" v-if="result.buyType !== data.buyType">*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.buyType">您已修改两次采购方式，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.buyType" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.buyType"
            maxlength="500"
            @input="clearErr('updateReason_buyType')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'updateReason_buyType'">{{
              error.msg
            }}</u></transition
          >
        </li>
      </ul>
      <ul class="formUl">
        <li :class="{ errorBorder: error.key === 'customerMoneySource' }">
          <span class="formTitle"><i class="must">*</i>客户资金来源：</span>
          <!--  :disabled='!data.updateFlag.customerMoneySource' -->
          <unit-dropdown
            id="customerMoneySource"
            :list="customerMoneySource"
            @change="dropdownReturn"
            :result="result.customerMoneySource"
          ></unit-dropdown>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'customerMoneySource'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          class="padding28"
          :class="{
            errorBorder: error.key === 'updateReason_customerMoneySource',
          }"
        >
          <span class="formTitle"
            ><i
              class="must"
              v-if="result.customerMoneySource !== data.customerMoneySource"
              >*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.customerMoneySource">您已修改两次客户资金来源，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.customerMoneySource" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.customerMoneySource"
            maxlength="500"
            @input="clearErr('updateReason_customerMoneySource')"
          ></textarea>
          <transition name="publicTransition"
            ><u
              class="error"
              v-if="error.key === 'updateReason_customerMoneySource'"
              >{{ error.msg }}</u
            ></transition
          >
        </li>
        <li>
          <span class="formTitle">主要品牌：</span>
          <!-- <div class="input is-disable" v-if="!data.updateFlag.mainBrand"><unit-popover :content="emptyTxt(result.mainBrand)"></unit-popover></div> -->
          <!--  v-if="data.updateFlag.mainBrand" -->
          <input
            type="text"
            v-model="result.mainBrand"
            maxlength="100"
            @input="clearErr('mainBrand', 'updateReason_mainBrand')"
          />
        </li>
        <li
          class="padding28"
          :class="{ errorBorder: error.key === 'updateReason_mainBrand' }"
        >
          <span class="formTitle"
            ><i class="must" v-if="result.mainBrand !== data.mainBrand">*</i
            >修改原因：</span
          >
          <!-- <div class="input is-disable textarea" v-if="!data.updateFlag.mainBrand">您已修改两次主要品牌，无法再次修改</div> -->
          <!--  v-if="data.updateFlag.mainBrand" -->
          <textarea
            class="input"
            placeholder="请输入修改原因"
            v-model="updateReason.mainBrand"
            maxlength="500"
            @input="clearErr('updateReason_mainBrand')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'updateReason_mainBrand'">{{
              error.msg
            }}</u></transition
          >
        </li>
      </ul>
    </div>
    <div class="formMainTitle" v-if="name === 'projectEdit'">
      <span>无限制修改信息</span>
    </div>
    <div class="formMainCont" v-if="name === 'projectEdit'">
      <ul class="formUl">
        <li :class="{ errorBorder: error.key === 'winRate' }">
          <span class="formTitle"><i class="must">*</i>赢率：</span>
          <unit-dropdown
            id="winRate"
            :list="winRate"
            @change="dropdownReturn"
            :result="result.winRate"
          ></unit-dropdown>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'winRate'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          :class="{ errorBorder: error.key === 'winRateReason' }"
          v-if="Number(result.winRate) < Number(data.winRate)"
        >
          <span class="formTitle smalltext"
            ><i class="must">*</i>赢率变小原因：</span
          >
          <textarea
            class="input"
            v-model="result.winRateReason"
            maxlength="500"
            @input="clearErr('winRateReason')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'winRateReason'">{{
              error.msg
            }}</u></transition
          >
        </li>
      </ul>
      <ul class="formUl">
        <li :class="{ errorBorder: error.key === 'projStatus' }">
          <span class="formTitle"><i class="must">*</i>项目状态：</span>
          <unit-dropdown
            id="projStatus"
            :list="projStatus"
            @change="dropdownReturn"
            :result="result.projStatus"
          ></unit-dropdown>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'projStatus'">{{
              error.msg
            }}</u></transition
          >
        </li>
        <li
          :class="{ errorBorder: error.key === 'projStatusReason' }"
          v-if="Number(result.projStatus) > 3"
        >
          <span class="formTitle"
            ><i class="must">*</i>{{ result.projStatusTxt }}原因：</span
          >
          <textarea
            class="input"
            v-model="result.projStatusReason"
            maxlength="500"
            @input="clearErr('projStatusReason')"
          ></textarea>
          <transition name="publicTransition"
            ><u class="error" v-if="error.key === 'projStatusReason'">{{
              error.msg
            }}</u></transition
          >
        </li>
      </ul>
      <ul class="formUl">
        <li class="marginBottom">
          <span class="formTitle">备注：</span>
          <textarea
            class="input"
            v-model="result.remark"
            maxlength="500"
          ></textarea>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import unitCustomer from "@/unit/components/thisUnit/customer";
import unitContact from "@/unit/components/thisUnit/contact";
import unitTime from "@/unit/components/element/timeBox";
import unitPopover from "@/unit/components/popover";
import unitTable from "@/unit/components/thisUnit/tableBrand";
export default {
  name: "projapproval",
  props: ["dom", "data", "role", "name", "loading"],
  components: { unitCustomer, unitContact, unitTime, unitPopover, unitTable },
  inject: ["cancel"],
  data() {
    return {
      result: {
        tenderProjName: "",
        projAmount: "",
        projAmount_: "",
        policymarker: "",
        planFinishTime: "",
        buyType: "",
        customerMoneySource: "",
        mainBrand: "",
        companySupport: "",
        projStatus: "",
        projStatusReason: "",
        winRate: "",
        winRateReason: "",
        remark: "",
        preSale: "",
        // commitConfirm:'',
        // commitConfirmReason:'',
        finalCustomer: "",
        troilaProductAmount_: "",
        troilaProductAmount: "",
        otherProduct: "",
        FireProductList: [],
        safetyProductList: [],
      },
      updateReason: {
        projAmount: "",
        policymarker: "",
        planFinishTime: "",
        buyType: "",
        customerMoneySource: "",
        mainBrand: "",
      },
      winRate: [],
      projStatus: [],
      buyType: [],
      customerMoneySource: [],
      tecDifficulty: [],
      feasibility: [],
      preSale: [],
      tecDirector: [],
      FirewallProduct: [],
      SecuritySoftwareProduct: [],
      SecuritySoftwareProductNumbers: "",
      SecuritySoftwareProductModels: [],
      FirewallProductNumbers: "",
      FirewallProductModels: [],
      error: {
        key: null,
        msg: "",
      },
      commitStatusTxt: {
        0: "否",
        1: "是",
      },
      commitConfirmTxt: {
        0: "不同意",
        1: "同意",
      },
      feasibilityTxt: {
        0: "不可行",
        1: "可行",
      },
    };
  },
  filters: {
    emptyTxt(v) {
      return v ? v : "--";
    },
  },
  watch: {
    name(v) {
      v === "projectEdit" ? this.getDropData() : null;
      this.clearErr();
    },
    "result.commitStatus"(v) {
      this.clearErr("commitStatus");
      this.clearErr("commitConfirm", "commitConfirmReason");
      // this.result.commitConfirmReason===undefined?null:this.result.commitConfirmReason=''
    },
    "result.commitConfirm"(v) {
      this.clearErr("commitConfirm", "commitConfirmReason");
      this.result.commitConfirmReason === undefined
        ? null
        : (this.result.commitConfirmReason =
            this.result.commitConfirm === "0" && this.data.commitConfirm === "0"
              ? this.data.commitConfirmReason
              : "");
    },
    data() {
      this.changeItem();
    },
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      let isCharge =
          userInfo.info &&
          userInfo.info.staff &&
          userInfo.info.staff.isCharge === "1"
            ? true
            : false,
        staffId =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffId
            : null;
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === "1";
      return { isCharge, staffId, isAdmin };
    },
  },
  methods: {
    replacetroilaProductAmount() {
      this.result.troilaProductAmount_ = this.result.troilaProductAmount_.replace(
        /[^\d.]/g,
        ""
      );
      this.result.troilaProductAmount_ = this.result.troilaProductAmount_.replace(
        /^\./g,
        ""
      );
      this.result.troilaProductAmount_ = this.result.troilaProductAmount_.replace(
        /\.{2,}/g,
        ""
      );
      this.result.troilaProductAmount_ = this.result.troilaProductAmount_
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this.result.troilaProductAmount_ =
        this.result.troilaProductAmount_.indexOf(".") > 0
          ? this.result.troilaProductAmount_.split(".")[0].substring(0, 12)
          : this.result.troilaProductAmount_.substring(0, 12);
      if (
        this.result.troilaProductAmoun_t.length > 1 &&
        this.result.troilaProductAmount_ === "0"
      ) {
        this.result.troilaProductAmount_ = this.result.troilaProductAmount_.slice(
          1
        );
      }

      return this.result.troilaProductAmount_;
    },
    blurproductamount() {
      this.result.troilaProductAmount_ = this.$pubfunc.transformPrice(
        this.result.troilaProductAmount_,
        true
      );
      this.result.troilaProductAmount = this.result.troilaProductAmount_
        .split(",")
        .join("");
      console.log(this.result.troilaProductAmount);
    },
    emptyTxt(v, money) {
      return v ? v + (money ? " 元" : "") : "--";
    },
    judgeUpdate(k) {
      // console.log(this.data.updatefielddetail)
      let keys = [
          "projAmount",
          "winRate",
          "policymarker",
          "planFinishTime",
          "buyType",
          "customerMoneySource",
          "mainBrand",
          "projStatus",
          "remark",
          "commitStatus",
          "commitConfirm",
          "preSale",
        ],
        preSaleKeys = ["tecDifficulty", "tecDifficultyDesc", "tecDirector"],
        tecDirectorKeys = ["feasibility", "feasibilityDesc"];
      if (this.name !== "projectView") {
        return false;
      }
      switch (this.data.staffRole) {
        case "preSale":
          if (preSaleKeys.indexOf(k) === -1) {
            return false;
          }
          break;
        case "tecDirector":
          if (tecDirectorKeys.concat(preSaleKeys).indexOf(k) === -1) {
            return false;
          }
          break;
        default:
          if (
            keys.concat(tecDirectorKeys).concat(preSaleKeys).indexOf(k) === -1
          ) {
            return false;
          }
          break;
      }
      return this.data.updatefielddetail &&
        this.data.updatefielddetail[k] &&
        this.data.updatefielddetail[k].length > 0
        ? true
        : false;
    },
    showDetail(key) {
      this.$emit("dialog", {
        scroll: false,
        show: true,
        link: "updateDetail",
        small: 900,
        title: "查看修改信息",
        data: { key, list: this.data.updatefielddetail[key] },
      });
    },
    getDropData() {
      this.$api.public.dict(
        { codeGroup: "firewall_product", pCode: "" },
        (res) => {
          switch (res.code) {
            case "0":
              this.FirewallProductModels = res.data;
              break;
          }
        }
      );
      this.$api.public.dict(
        { codeGroup: "safety_product", pCode: "" },
        (res) => {
          switch (res.code) {
            case "0":
              this.SecuritySoftwareProductModels = res.data;
              break;
          }
        }
      );
      this.buyType && this.buyType.length > 0
        ? null
        : this.$api.public.dict({ codeGroup: "buy_type", pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                this.buyType = res.data ? res.data : [];
                break;
            }
          });
      this.customerMoneySource && this.customerMoneySource.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: "customer_money_source", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.customerMoneySource = res.data ? res.data : [];
                  break;
              }
            }
          );
      this.projStatus && this.projStatus.length > 0
        ? null
        : this.$api.public.dict(
            { codeGroup: "proj_status", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  let list = [];
                  (res.data ? res.data : []).map((v) => {
                    list.push({
                      value: v.value,
                      label: v.label,
                      disabled: v.value === "02" || v.value === "03",
                    });
                    v.value === this.data.projStatus ? this.result.projStatusTxt = v.label : null;
                  });
                  this.projStatus = list;
                  break;
              }
            }
          );
      this.winRate && this.winRate.length > 0
        ? null
        : this.$api.public.dict({ codeGroup: "win_rate", pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                this.winRate = res.data ? res.data : [];
                break;
            }
          });

      // console.log(this.data.staffRole,this.role)
      for (let k in this.result) {
        this.result[k] = this.data[k];
      }
      this.result.projAmount_ = this.$pubfunc.transformPrice(
        this.data.projAmount,
        true
      );
      if (this.data.tenderProjName) {
        delete this.result.tenderProjName;
      }
      if (this.data.companySupport) {
        delete this.result.companySupport;
      }
      if (
        this.data.firewallProductList &&
        this.data.firewallProductList.length > 0
      ) {
        this.FirewallProduct = [];
        const f = this.data.firewallProductList;
        var a = {};
        f.map((i, index) => {
          a.number = i.firewallNum;
          a.productModel = i.firewallTypeName;
          a.model = i.firewallType;
          a.typeList = [];
        });
        this.FirewallProduct.push(a);
      }
      if (
        this.data.safetyProductList &&
        this.data.safetyProductList.length > 0
      ) {
        this.SecuritySoftwareProduct = [];
        const s = this.data.safetyProductList;
        var b = {};
        s.map((i, index) => {
          b.number = i.safetyNum;
          b.productModel = i.safetyTypeName;
          b.model = i.safetyType;
          b.typeList = [];
        });
        this.SecuritySoftwareProduct.push(b);
      }
      if (this.name === "projectEdit") {
        this.$set(this.result, "commitStatus", this.data.commitStatus);
        for (let i in this.updateReason) {
          this.updateReason[i] = "";
        }
        this.$api.bgmgnt.staff.getList({ resourceType: "08,06" }, (res) => {
          //售前
          // console.log(res)
          switch (res.code) {
            case "0":
              let list = [];
              (res.data.list ? res.data.list : []).map((v) => {
                list.push({
                  value: v.staffId,
                  label: v.staffName,
                });
              });

              //  满足在数组 或是管理员 isAdmin
              // if (this.$store.state.notecDepartment.indexOf(this.data.subCompany) > -1 || this.userInfo.isAdmin) {
              list.unshift({ label: "不需要技术支持", value: "0" });
              // }
              this.preSale = list;
              break;
          }
        });
      } else {
        delete this.result.commitStatus;
      }
      if (this.data.staffRole === "isCharge") {
        this.$set(this.result, "commitConfirm", this.data.commitConfirm);
        this.$nextTick(() => {
          this.$set(
            this.result,
            "commitConfirmReason",
            this.data.commitConfirmReason
          );
        });
      }
      if (this.data.staffRole === "preSale") {
        this.tecDifficulty.length > 0
          ? null
          : this.$api.public.dict(
              { codeGroup: "tec_difficulty", pCode: "" },
              (res) => {
                // console.log(res)
                switch (res.code) {
                  case "0":
                    this.tecDifficulty = res.data ? res.data : [];
                    break;
                }
              }
            );
        this.$api.bgmgnt.staff.getList({ resourceType: "02,06" }, (res) => {
          //部门总+技术经理
          // console.log(res)
          switch (res.code) {
            case "0":
              let list = [];
              (res.data.list ? res.data.list : []).map((v) => {
                list.push({
                  value: v.staffId,
                  label: v.staffName,
                });
              });
              this.tecDirector = list;
              break;
          }
        });
        this.$set(this.result, "tecDirector", this.data.tecDirector);
        this.$set(this.result, "tecDifficulty", this.data.tecDifficulty);
        this.$set(
          this.result,
          "tecDifficultyDesc",
          this.data.tecDifficultyDesc
        );
      }
      if (this.data.staffRole === "tecDirector") {
        this.feasibility.length > 0
          ? null
          : this.$api.public.dict(
              { codeGroup: "feasibility", pCode: "" },
              (res) => {
                // console.log(res)
                switch (res.code) {
                  case "0":
                    this.feasibility = res.data ? res.data : [];
                    break;
                }
              }
            );
        this.$set(this.result, "feasibility", this.data.feasibility);
        this.$set(this.result, "feasibilityDesc", this.data.feasibilityDesc);
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key, "updateReason_" + key);
      switch (key) {
        case "planFinishTime":
          this.result.planFinishTime = this.$pubfunc.TimeTransform(
            "YYYY/MM/DD",
            res
          );
          break;
        // case 'projStatus':
        //     this.result.projStatus=res.value;
        //     this.result.projStatusTxt=res.label;
        //     this.result.projStatusReason='';
        //     break;
        case "projStatus":
          this.result.projStatus = res.value;
          this.result.projStatusTxt = res.label;
          this.result.projStatusReason = "";
          this.result.projStatus === "02" && this.result.buyType !== "04"
            ? this.$store.commit("alertFn", {
                type: "warning",
                text: "项目阶段达到投标准备阶段时请填写投标结果",
                time: 2000,
              })
            : null;
          break;
        case "buyType":
          this.result.projStatus === "02" &&
          this.result.buyType === "04" &&
          res.value !== "04"
            ? this.$store.commit("alertFn", {
                type: "warning",
                text: "项目阶段达到投标准备阶段时请填写投标结果",
                time: 2000,
              })
            : null;
        default:
          this.result[key] = res.value;
      }
    },
    inputBlur() {
      this.result.projAmount_ = this.$pubfunc.transformPrice(
        this.result.projAmount_,
        true
      );
      this.result.projAmount = this.result.projAmount_.split(",").join("");
    },
    setErr(key, text) {
      // console.log(key,text)
      this.$store.commit("alertFn", {
        type: "error",
        text: "保存失败，请修改对应的错误内容",
        time: 2000,
      });
      this.error.key = key;
      this.error.msg = text;
      return false;
    },
    clearErr(key, key1) {
      if (!key || key === this.error.key || key1 === this.error.key) {
        this.error.key = null;
      }
    },
    submit(cb) {
      if (this.loading) {
        return;
      }
      let param = {
          projId: this.data.projId,
        },
        url,
        hasChange = false;
      // 项目金额
      if (!this.$pubfunc.replaceSpace(this.result.projAmount_, 1)) {
        return this.setErr("projAmount_", "请输入项目金额");
      } else if (!Number(this.result.projAmount_.split(",").join(""))) {
        return this.setErr("projAmount_", "项目金额不可为0，请重新输入");
      } else if (
        Number(this.result.projAmount_.split(",").join("")) !==
          Number(this.data.projAmount) &&
        !this.updateReason.projAmount
      ) {
        return this.setErr("updateReason_projAmount", "请输入项目金额修改原因");
      }
      // 决策人
      if (
        this.result.policymarker !== this.data.policymarker &&
        !this.$pubfunc.replaceSpace(this.updateReason.policymarker, 1)
      ) {
        return this.setErr("updateReason_policymarker", "请输入决策人修改原因");
      }
      // 预计结案日期
      if (!this.result.planFinishTime) {
        return this.setErr("planFinishTime", "请选择预计结案日期");
      } else if (
        this.result.planFinishTime !== this.data.planFinishTime &&
        !this.$pubfunc.replaceSpace(this.updateReason.planFinishTime, 1)
      ) {
        return this.setErr(
          "updateReason_planFinishTime",
          "请输入预计结案日期修改原因"
        );
      }
      // 采购方式
      if (!this.result.buyType) {
        return this.setErr("buyType", "请选择采购方式");
      } else if (
        this.result.buyType !== this.data.buyType &&
        !this.$pubfunc.replaceSpace(this.updateReason.buyType, 1)
      ) {
        return this.setErr("updateReason_buyType", "请输入采购方式修改原因");
      }
      // 客户资金来源
      if (!this.result.customerMoneySource) {
        return this.setErr("customerMoneySource", "请选择客户资金来源");
      } else if (
        this.result.customerMoneySource !== this.data.customerMoneySource &&
        !this.$pubfunc.replaceSpace(this.updateReason.customerMoneySource, 1)
      ) {
        return this.setErr(
          "updateReason_customerMoneySource",
          "请输入客户资金来源修改原因"
        );
      }
      // 主要品牌
      if (
        this.result.mainBrand !== this.data.mainBrand &&
        !this.$pubfunc.replaceSpace(this.updateReason.mainBrand, 1)
      ) {
        return this.setErr("updateReason_mainBrand", "请输入主要品牌修改原因");
      }
      // 项目赢率
      if (!this.result.winRate) {
        return this.setErr("winRate", "请选择项目状态");
      }
      if (
        Number(this.result.winRate) < Number(this.data.winRate) &&
        !this.$pubfunc.replaceSpace(this.result.winRateReason, 1)
      ) {
        return this.setErr("winRateReason", "请输入赢率变小原因");
      }
      // 项目状态
      if (!this.result.projStatus) {
        return this.setErr("projStatus", "请选择项目状态");
      }

      if (
        Number(this.result.projStatus) > 3 &&
        !this.$pubfunc.replaceSpace(this.result.projStatusReason, 1)
      ) {
        return this.setErr(
          "projStatusReason",
          "请输入" + this.result.projStatusTxt + "原因"
        );
      }
      let firewallProductList = this.$refs.FirewallProduct.judgeItem(),
        safetyProductList = this.$refs.SecuritySoftwareProduct.judgeItem();
      if (!firewallProductList || !safetyProductList) {
        this.$store.commit("alertFn", {
          type: "error",
          text: (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
          time: 2000,
        });
        return;
      } else {
        this.result.firewallProductList = [];
        this.result.safetyProductList = [];
        var a = {};
        var b = {};
        firewallProductList.map((item, index) => {
          this.$set(item, "firewallNum", item.number);
          this.$set(item, "firewallType", item.model[0].value);
          this.$set(item, "firewallTypeName", item.model[0].label);
          // a.firewallNum = item.number
          // a.firewallType = item.model[0].value
          // a.firewallTypeName = item.model[0].label
          // this.result.firewallProductList.push(a)
        });
        this.result.firewallProductList = firewallProductList;
        safetyProductList.map((item, index) => {
          this.$set(item, "safetyNum", item.number);
          this.$set(item, "safetyType", item.model[0].value);
          this.$set(item, "safetyTypeName", item.model[0].label);
          // b.safetyNum = item.number
          // b.safetyType = item.model[0].value
          // b.safetyTypeName = item.model[0].label
          // this.result.safetyProductList.push(b)
        });
        this.result.safetyProductList = safetyProductList;
      }
      let keys = [
        "customerId",
        "projName",
        "tenderProjName",
        "proposalReason",
        "projAmount",
        "projType",
        "winRate",
        "policymarker",
        "contact",
        "planFinishTime",
        "buyType",
        "customerMoneySource",
        "mainBrand",
        "containOwnerProduct",
        "companySupport",
        "projStatus",
        "remark",
        "commitStatus",
        "preSale",
        "finalCustomer",
        "troilaProductAmount",
        "otherProduct",
        "firewallProductList",
        "safetyProductList",
        "projStatusReason",
      ];
      for (let k in keys) {
        this.result[keys[k]] !== undefined &&
        (this.result[keys[k]] ? this.result[keys[k]] : "") !==
          (this.data[keys[k]] ? this.data[keys[k]] : "") &&
        k !== "projAmount_"
          ? (hasChange = true)
          : null;
        param[keys[k]] =
          this.result[keys[k]] !== undefined &&
          this.data.updateFlag[keys[k]] !== false
            ? this.result[keys[k]]
            : this.data[keys[k]];
      }
      if (this.data.commitStatus !== this.result.commitStatus) {
        param.commitStatus = this.result.commitStatus;
      }
      param.updateReason = {};
      for (let k in this.updateReason) {
        this.result[k] !== this.data[k]
          ? (param.updateReason[k] = this.updateReason[k])
          : null;
      }
      if (Number(this.result.winRate) < Number(this.data.winRate)) {
        param.updateReason.winRate = this.result.winRateReason;
      }
      if (
        Number(this.result.projStatus) > 3 &&
        this.result.projStatus !== this.data.projStatus
      ) {
        param.updateReason.projStatus = this.result.projStatusReason;
      }
      let keys_ = [
        "tecDirector",
        "tecDifficulty",
        "tecDifficultyDesc",
        "feasibility",
        "feasibilityDesc",
      ];
      for (let k in keys_) {
        param[keys_[k]] = this.data[keys_[k]];
      }
      url = "saveproposal";
      // 自己就是售前、技术
      switch (this.data.staffRole) {
        case "isCharge":
          if (this.result.commitStatus === "0") {
            break;
          }
          if (!this.result.commitConfirm) {
            return this.setErr("commitConfirm", "请选择commit确认");
          }
          if (
            this.result.commitConfirm === "0" &&
            this.result.commitConfirm !== this.data.commitConfirm &&
            !this.$pubfunc.replaceSpace(this.result.commitConfirmReason, 1)
          ) {
            return this.setErr("commitConfirmReason", "请输入不同意原因");
          }
          break;
        case "preSale":
          if (!this.result.tecDifficulty) {
            return this.setErr("tecDifficulty", "请选择项目交付核心技术难点");
          }
          if (!this.$pubfunc.replaceSpace(this.result.tecDifficultyDesc, 1)) {
            return this.setErr(
              "tecDifficultyDesc",
              "请输入项目交付核心技术难点说明"
            );
          }
          break;
        case "tecDirector":
          if (!this.data.tecDifficulty) {
            break;
          }
          if (!this.result.feasibility) {
            return this.setErr("feasibility", "请选择技术可行性判断");
          }
          if (!this.$pubfunc.replaceSpace(this.result.feasibilityDesc, 1)) {
            return this.setErr("feasibilityDesc", "请输入技术可行性判断说明");
          }
          break;
      }
      console.log(hasChange);
      if (hasChange) {
        cb
          ? this.$store.commit("confirmFn", {
              func: () => {
                this.ajaxFn(url, param, cb);
              },
              cancel: () => {
                cb();
              },
              text: "是否保存您本页更改的信息？<br/>取消即放弃保存修改",
            })
          : this.ajaxFn(url, param, cb);
      } else {
        this.judgeNext(null, () => {
          cb ? cb() : this.cancel(true);
        });
      }
    },
    showSuc(cb, text) {
      this.$store.commit("alertFn", {
        type: "success",
        text: text ? text : "保存成功",
        func: () => {
          cb ? cb() : this.cancel(true);
        },
      });
    },
    judgeNext(cb, cb1) {
      let p;
      switch (this.data.staffRole) {
        case "isCharge":
          if (this.result.commitStatus === "0") {
            cb1 ? cb1() : this.showSuc(cb);
            break;
          }
          if (this.result.commitConfirm === this.data.commitConfirm) {
            cb1 ? cb1() : this.showSuc(cb);
            return;
          }
          p = {
            projId: this.data.projId,
            commitConfirm: this.result.commitConfirm,
            commitConfirmReason: this.result.commitConfirmReason,
          };
          this.$api.service.project.savecommitconfirm(p, (res) => {
            console.log(res);
            this.$emit("loadingfn", false);
            switch (res.code) {
              case "0":
                this.showSuc(cb);
                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      type: "error",
                      text: res.message,
                    })
                  : null;
            }
          });
          break;
        case "preSale":
          if (
            this.result.tecDifficulty === this.data.tecDifficulty &&
            this.result.tecDifficultyDesc === this.data.tecDifficultyDesc
          ) {
            cb1 ? cb1() : this.showSuc(cb);
            return;
          }
          p = {
            projId: this.data.projId,
            tecDifficulty: this.result.tecDifficulty,
            tecDifficultyDesc: this.result.tecDifficultyDesc,
          };
          p.tecDirector = this.result.tecDirector
            ? this.result.tecDirector
            : null;
          this.$api.service.project.savetecdifficulty(p, (res) => {
            // console.log(res)
            this.$emit("loadingfn", false);
            switch (res.code) {
              case "0":
                this.showSuc(cb);
                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      type: "error",
                      text: res.message,
                    })
                  : null;
            }
          });
          break;
        case "tecDirector":
          if (!this.data.tecDifficulty) {
            cb1 ? cb1() : this.showSuc(cb);
            break;
          }
          if (
            this.result.feasibility === this.data.feasibility &&
            this.result.feasibilityDesc === this.data.feasibilityDesc
          ) {
            cb1 ? cb1() : this.showSuc(cb);
            return;
          }
          p = {
            projId: this.data.projId,
            feasibility: this.result.feasibility,
            feasibilityDesc: this.result.feasibilityDesc,
          };
          this.$api.service.project.savefeasibility(p, (res) => {
            // console.log(res)
            this.$emit("loadingfn", false);
            switch (res.code) {
              case "0":
                this.showSuc(cb);
                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      type: "error",
                      text: res.message,
                    })
                  : null;
            }
          });
          break;
        default:
          cb1
            ? cb1()
            : (this.$emit("loadingfn", false),
              this.showSuc(cb, this.role ? "操作成功" : "保存成功"));
      }
    },
    ajaxFn(url, param, cb) {
      this.$emit("loadingfn", true);
      this.$api.service.project[url](param, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.judgeNext(cb);
            break;
          default:
            this.$emit("loadingfn", false);
            res.message
              ? this.$store.commit("alertFn", {
                  type: "error",
                  text: res.message,
                })
              : null;
        }
      });
    },
    changeItem() {
      console.log(this.data);
      this.result.troilaProductAmount_ = this.data.troilaProductAmount;
      this.data.troilaProductAmount_ = this.data.troilaProductAmount;
      this.blurproductamount();
      this.data.firewallProductList.map((item) => {
        this.$set(item, "number", item.firewallNum);
        this.$set(item, "model", item.firewallType);
        this.$set(item, "productModel", item.firewallTypeName);
        this.$set(item, "typeList", []);
        // item.number = item.firewallNum
        // item.model = item.firewallType
        // item.productModel = item.firewallTypeName
        // item.typeList = []
      });
      this.FirewallProduct = this.data.firewallProductList;
      console.log(this.FirewallProduct);
      this.data.safetyProductList.map((item) => {
        this.$set(item, "number", item.safetyNum);
        this.$set(item, "model", item.safetyType);
        this.$set(item, "productModel", item.safetyTypeName);
        this.$set(item, "typeList", []);
        // item.number = item.safetyNum
        // item.model = item.safetyType
        // item.productModel = item.safetyTypeName
        // item.typeList = []
      });
      this.SecuritySoftwareProduct = this.data.safetyProductList;
    },
  },
  created() {
    console.log(this.data);
    if (!this.data.projId) {
      return;
    }
    if (this.name === "projectEdit") {
      this.getDropData();
      // this.changeItem()
    } else {
      // this.changeItem()
    }
    this.result.projStatusReason = this.data.projStatusReason;
    this.changeItem();
    this.$emit("ok");
  },
  mounted() {},
};
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
ul.formUl {
  padding-bottom: 0px;
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
  background: url("../../assets/images/updatedetail.png") center/100% 100%
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
</style>
<style>
.projectApproval .textEllipse3 {
  max-height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
@media screen and (max-width: 1600px) {
  .projectApproval .formUl > li > textarea,
  .projectApproval .formUl > li > input,
  .projectApproval .formUl > li > div,
  .projectApproval .formUl > li > div > .el-select,
  .projectApproval .formUl > li .el-date-editor.el-input,
  .projectApproval .formUl > li .el-date-editor.el-input__inner {
    width: 170px !important;
  }
}
@media screen and (max-width: 1600px) {
  .projectApproval .formUl > li u.error {
    width: 170px !important;
  }
}
@media screen and (max-width: 1350px) {
  .projectApproval .formUl > li > textarea,
  .projectApproval .formUl > li > input,
  .projectApproval .formUl > li > div,
  .projectApproval .formUl > li > div > .el-select,
  .projectApproval .formUl > li .el-date-editor.el-input,
  .projectApproval .formUl > li .el-date-editor.el-input__inner {
    width: 150px !important;
  }
}
@media screen and (max-width: 1350px) {
  .projectApproval .formUl > li u.error {
    width: 150px !important;
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
  content: "";
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