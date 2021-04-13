<template>
  <div class="fillBox changeFormW projectForm">
    <div class="boxTitle titleFix">
      <i class="project_icon"></i>
      <span>{{ nameTxt[name] }}</span>
      <unit-btn
        type="plain right"
        :text="name !== 'projectBackView' ? '取消' : '返回'"
        @click="cancel(nameChange)"
      ></unit-btn>
      <unit-btn
        type="right"
        :loading="loading"
        :text="name === 'projectBack' ? '保存' : '创建'"
        @click="submit"
        v-if="
          name !== 'projectBackView' &&
          !(role === 'tecDirector' && !result.tecDifficulty)
        "
      ></unit-btn>
      <unit-btn
        type="right"
        text="编辑"
        @click="editBtn"
        v-if="
          name === 'projectBackView' &&
          (role === 'preSale' ||
            (role === 'tecDirector' && result.tecDifficulty))
        "
      ></unit-btn>
    </div>
    <div class="contentFix projForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <unit-loading :loading="true" v-if="waiting"></unit-loading>
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClick($event)"
          >
            <el-tab-pane label="项目信息" name="first">
              <div class="formPage" v-if="!waiting">
                <div class="formMainCont" v-if="name === 'projectAdd'">
                  <ul class="formUl padding0">
                    <li class="small">
                      <span class="formTitle">销售：</span>
                      <div v-if="name === 'projectAdd'">
                        {{ userInfo.staffName | emptyTxt }}
                      </div>
                    </li>
                  </ul>
                  <ul class="formUl padding0">
                    <li class="small">
                      <span class="formTitle">子公司：</span>
                      <div v-if="name === 'projectAdd'">
                        {{
                          depList.length > 0
                            ? judgebranchCompanyName()
                            : userInfo.branchCompanyName | emptyTxt
                        }}
                      </div>
                    </li>
                  </ul>
                  <ul class="formUl padding0">
                    <li
                      :style="{ margin: depList.length > 0 ? '-8px 0' : null }"
                      :class="{
                        small: depList.length === 0,
                        errorBorder: error.key === 'depId',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="depList.length > 0">*</i
                        >所属部门：
                      </span>
                      <unit-dropdown
                        v-if="depList.length > 0"
                        id="depId"
                        :list="depList"
                        @change="dropdownReturn"
                      ></unit-dropdown>
                      <div v-if="depList.length === 0">
                        {{ userInfo.depName | emptyTxt }}
                      </div>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'depId'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                  </ul>
                </div>
                <div class="formMainCont" v-if="name !== 'projectAdd'">
                  <ul class="formUl padding0">
                    <li class="small">
                      <span class="formTitle">项目名称：</span>
                      <div>{{ result.projName | emptyTxt }}</div>
                    </li>
                  </ul>
                  <ul class="formUl padding0">
                    <li class="small">
                      <span class="formTitle">项目编号：</span>
                      <div>{{ result.projNo | emptyTxt }}</div>
                    </li>
                  </ul>
                  <ul class="formUl padding0">
                    <li class="small">
                      <span class="formTitle">销售：</span>
                      <div>{{ result.ownerName | emptyTxt }}</div>
                    </li>
                  </ul>
                </div>
                <div class="formMainTitle">
                  <span>项目基本信息</span>
                </div>
                <div class="formMainCont">
                  <ul class="formUl">
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'customerId',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >客户名称：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.customerName)"
                        ></unit-popover>
                      </div>
                      <unit-customer
                        v-if="name === 'projectAdd'"
                        id="customerId"
                        class="contactCon auto"
                        placeholder
                        @change="dropdownReturn"
                        :input="true"
                      ></unit-customer>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'customerId'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'projName',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >项目名称：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.projName)"
                        ></unit-popover>
                      </div>
                      <input
                        v-if="name === 'projectAdd'"
                        type="text"
                        v-model="result.projName"
                        maxlength="50"
                        @input="clearErr('projName')"
                      />
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'projName'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'tenderProjName',
                      }"
                    >
                      <span class="formTitle">招标项目名称：</span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.tenderProjName)"
                        ></unit-popover>
                      </div>
                      <input
                        v-if="name === 'projectAdd'"
                        type="text"
                        v-model="result.tenderProjName"
                        maxlength="50"
                        @input="clearErr('tenderProjName')"
                      />
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'tenderProjName'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'proposalReason',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >立项原因：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.proposalReasonTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="proposalReason"
                        :list="proposalReason"
                        @change="dropdownReturn"
                        :result="result.proposalReason"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'proposalReason'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'projAmount_',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >项目金额：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="
                            emptyTxt(
                              $pubfunc.transformPrice(result.projAmount, true),
                              'money'
                            )
                          "
                        ></unit-popover>
                      </div>
                      <input
                        class="moneyInput"
                        v-if="name === 'projectAdd'"
                        type="text"
                        v-model="result.projAmount_"
                        maxlength="30"
                        @input="clearErr('projAmount_')"
                        @blur="inputBlur"
                      />
                      <i v-if="name === 'projectAdd'">元</i>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'projAmount_'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'projType',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >项目类型：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.projTypeTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="projType"
                        :list="projType"
                        @change="dropdownReturn"
                        :result="result.projType"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'projType'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'winRate',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >项目赢率：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.winRateTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="winRate"
                        :list="winRate"
                        @change="dropdownReturn"
                        :result="result.winRate"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'winRate'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                  </ul>
                  <ul class="formUl">
                    <li :class="{ small: name !== 'projectAdd' }">
                      <span class="formTitle">项目阶段：</span>
                      <div>
                        {{
                          result.projStageTxt
                            ? result.projStageTxt
                            : "立项" | emptyTxt
                        }}
                      </div>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'policymarker',
                      }"
                    >
                      <span class="formTitle">决策人：</span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.policymarkerName)"
                        ></unit-popover>
                      </div>
                      <unit-contact
                        v-if="name === 'projectAdd'"
                        id="policymarker"
                        placeholder
                        @change="dropdownReturn"
                        :input="true"
                        :orgid="result.customerId ? result.customerId : null"
                        :result="result.policymarker"
                        type="customer"
                        :clear="true"
                      ></unit-contact>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'policymarker'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'contact',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >客户联系人：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.contactName)"
                        ></unit-popover>
                      </div>
                      <unit-contact
                        v-if="name === 'projectAdd'"
                        id="contact"
                        placeholder
                        @change="dropdownReturn"
                        :input="true"
                        :orgid="result.customerId ? result.customerId : null"
                        :result="result.contact"
                        type="customer"
                      ></unit-contact>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'contact'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'planFinishTime',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >预计结案日期：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.planFinishTime)"
                        ></unit-popover>
                      </div>
                      <unit-time
                        v-if="name === 'projectAdd'"
                        placeholder
                        :value="result.planFinishTime"
                        id="planFinishTime"
                        @return="dropdownReturn"
                      ></unit-time>
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'planFinishTime'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'buyType',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >采购方式：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.buyTypeTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="buyType"
                        :list="buyType"
                        @change="dropdownReturn"
                        :result="result.buyType"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'buyType'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'customerMoneySource',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >客户资金来源：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.customerMoneySourceTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="customerMoneySource"
                        :list="customerMoneySource"
                        @change="dropdownReturn"
                        :result="result.customerMoneySource"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'customerMoneySource'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'mainBrand',
                      }"
                    >
                      <span class="formTitle">主要品牌：</span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.mainBrand)"
                        ></unit-popover>
                      </div>
                      <input
                        v-if="name === 'projectAdd'"
                        type="text"
                        v-model="result.mainBrand"
                        maxlength="100"
                        @input="clearErr('mainBrand')"
                      />
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'mainBrand'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                  </ul>
                  <ul class="formUl">
                    <li
                      class="radioBox"
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'containOwnerProduct',
                      }"
                    >
                      <span class="formTitle textsmall">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >是否包含自有产品：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.containOwnerProductTxt)"
                        ></unit-popover>
                      </div>
                      <div v-if="name === 'projectAdd'">
                        <el-radio
                          class="projRadio projRadio_"
                          v-model="result.containOwnerProduct"
                          :label="value.value"
                          v-for="(value, i) in containOwnerProduct"
                          :key="i"
                          >{{ value.label }}</el-radio
                        >
                      </div>
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'containOwnerProduct'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'companySupport',
                      }"
                    >
                      <span class="formTitle textsmall"
                        >需要公司层面支持：</span
                      >
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.companySupport)"
                        ></unit-popover>
                      </div>
                      <input
                        type="text"
                        v-if="name === 'projectAdd'"
                        v-model="result.companySupport"
                        maxlength="100"
                        @input="clearErr('companySupport')"
                      />
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'companySupport'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'projStatus',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >项目状态：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.projStatusTxt)"
                        ></unit-popover>
                      </div>
                      <unit-dropdown
                        v-if="name === 'projectAdd'"
                        id="projStatus"
                        :list="projStatus"
                        @change="dropdownReturn"
                        :result="result.projStatus"
                      ></unit-dropdown>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'projStatus'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'projStatusReason',
                      }"
                      v-if="Number(result.projStatus) > 3"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i>
                        {{ result.projStatusTxt }}原因：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.projStatusReason)"
                          :lines="3"
                        ></unit-popover>
                      </div>
                      <textarea
                        v-if="name === 'projectAdd'"
                        class="input"
                        v-model="result.projStatusReason"
                        maxlength="500"
                        @input="clearErr('projStatusReason')"
                      ></textarea>
                      <transition name="publicTransition">
                        <u
                          class="error"
                          v-if="error.key === 'projStatusReason'"
                          >{{ error.msg }}</u
                        >
                      </transition>
                    </li>
                    <li
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'remark',
                        marginBottom: true,
                      }"
                    >
                      <span class="formTitle">备注：</span>
                      <div v-if="name !== 'projectAdd'">
                        <unit-popover
                          :content="emptyTxt(result.remark)"
                          :lines="3"
                        ></unit-popover>
                      </div>
                      <textarea
                        v-if="name === 'projectAdd'"
                        class="input"
                        v-model="result.remark"
                        maxlength="500"
                      ></textarea>
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'remark'">{{
                          error.msg
                        }}</u>
                      </transition>
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
                        <span class="formTitle"> 最终用户： </span>
                        <el-input
                          v-if="name === 'projectAdd'"
                          class="contactCon auto"
                          maxlength="50"
                          placeholder
                          v-model="result.finalCustomer"
                        ></el-input>
                        <div
                          class="popoverTxt lh25"
                          v-if="name !== 'projectAdd'"
                        >
                          <unit-popover
                            :content="emptyTxt(data.finalCustomer)"
                          ></unit-popover>
                        </div>
                      </li>
                    </ul>
                    <ul class="formUl">
                      <li :class="{ small: name !== 'projectAdd' }" class="fl">
                        <span class="formTitle textsmall">
                          卓朗安全产品金额：
                        </span>
                        <el-input
                          v-if="name === 'projectAdd'"
                          class="contactCon auto"
                          placeholder
                          @input="replacetroilaProductAmount"
                          @blur="blurproductamount"
                          v-model="result.troilaProductAmount_"
                        >
                          <span slot="suffix">元</span>
                        </el-input>
                        <div
                          class="popoverTxt lh25"
                          v-if="name !== 'projectAdd'"
                        >
                          <unit-popover
                            :content="
                              emptyTxt(
                                $pubfunc.transformPrice(
                                  data.troilaProductAmount,
                                  true
                                ),
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
                          :edit="name === 'projectAdd'"
                          :dropdown="{ productModel: FirewallProductModels }"
                          ref="FirewallProduct"
                        ></unit-table>
                      </li>
                      <!-- :dropdown='{brandName:Firewall,typeNames:typeNames,levelTxt:supplierLevel}' -->
                      <li class="boxTable borderRight1">
                        <unit-table
                          type="SecuritySoftwareProduct"
                          :list="SecuritySoftwareProduct"
                          :edit="name === 'projectAdd'"
                          :dropdown="{
                            productModel: SecuritySoftwareProductModels,
                          }"
                          ref="SecuritySoftwareProduct"
                        ></unit-table>
                      </li>
                      <li class="boxTable li30">
                        <span class="formTitle textsmall otherProduct"
                          >其他产品：</span
                        >
                        <el-input
                          v-if="name === 'projectAdd'"
                          type="textarea"
                          v-model="result.otherProduct"
                          maxlength="255"
                          :rows="5"
                        ></el-input>
                        <div
                          class="popoverTxt lh25 otherProductBrother"
                          v-if="name !== 'projectAdd'"
                        >
                          <unit-popover
                            :content="emptyTxt(data.otherProduct)"
                          ></unit-popover>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="formMainTitle">
                  <span>协同信息</span>
                </div>
                <div class="formMainCont">
                  <ul class="formUl">
                    <li
                      class="radioBox"
                      :class="{
                        small: name !== 'projectAdd',
                        errorBorder: error.key === 'commitStatus',
                      }"
                    >
                      <span class="formTitle">
                        <i class="must" v-if="name === 'projectAdd'">*</i
                        >commit状态：
                      </span>
                      <div v-if="name !== 'projectAdd'">
                        {{
                          result.commitStatus
                            ? commitStatusTxt[result.commitStatus]
                            : "" | emptyTxt
                        }}
                      </div>
                      <el-radio
                        v-if="name === 'projectAdd'"
                        class="projRadio"
                        v-model="result.commitStatus"
                        label="1"
                        >是</el-radio
                      >
                      <el-radio
                        v-if="name === 'projectAdd'"
                        class="projRadio"
                        v-model="result.commitStatus"
                        label="0"
                        >否</el-radio
                      >
                      <transition name="publicTransition">
                        <u class="error" v-if="error.key === 'commitStatus'">{{
                          error.msg
                        }}</u>
                      </transition>
                    </li>
                    <li
                      class="radioBox small"
                      :class="{ unableTxt: result.commitStatus !== '1' }"
                    >
                      <span class="formTitle">commit确认：</span>
                      <div :class="{ orangeTxt: !result.commitConfirm }">
                        <unit-popover
                          :content="
                            emptyTxt(commitConfirmTxt[result.commitConfirm])
                          "
                          :lines="3"
                          v-if="result.commitConfirm"
                        ></unit-popover>
                        {{ result.commitConfirm ? "" : "待回填" }}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="技术难点说明"
              name="second"
              v-if="name !== 'projectAdd'"
            >
              <difficulty-description
                :data="data"
                :name="name"
                style="margin: 30px 0"
                ref="tabChoose4"
              ></difficulty-description>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitCustomer from "@/unit/components/thisUnit/customer";
import unitContact from "@/unit/components/thisUnit/contact";
import unitTime from "@/unit/components/element/timeBox";
import unitPopover from "@/unit/components/popover";
import unitTable from "@/unit/components/thisUnit/tableBrand";
import unitTab from "@/unit/components/tab";
export default {
  name: "projAdd",
  props: ["dom"],
  components: {
    unitCustomer,
    unitContact,
    unitTime,
    unitPopover,
    unitTable,
    unitTab,
    difficultyDescription: (resolve) =>
      require(["./components/difficultyDescription"], resolve), //技术难点说明
  },
  data() {
    return {
      role: null,
      nameChange: false,
      updatefielddetail: {},
      data: {},
      result: {
        customerId: "",
        projName: "",
        tenderProjName: "",
        proposalReason: "",
        projAmount_: "",
        projType: "",
        winRate: "",
        policymarker: "",
        contact: "",
        planFinishTime: "",
        buyType: "",
        customerMoneySource: "",
        mainBrand: "",
        containOwnerProduct: "",
        companySupport: "",
        projStatus: "",
        remark: "",
        commitStatus: "",
        preSale: "",
        tecDirector: "",
        finalCustomer: "",
        troilaProductAmount: "",
        troilaProductAmount_: "",
        otherProduct: "",
        FireProductList: [],
        safetyProductList: [],
      },
      proposalReason: [],
      projType: [],
      winRate: [],
      buyType: [],
      customerMoneySource: [],
      projStatus: [],
      preSale: [],
      tecDirector: [],
      containOwnerProduct: [],
      tecDifficulty: [],
      feasibility: [],
      depList: [],
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
      waiting: false,
      loading: false,
      nameTxt: {
        projectAdd: "新建项目",
        projectBack: "编辑项目",
        projectBackView: "查看项目",
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
      activeName: "first",
    };
  },
  filters: {
    emptyTxt(v) {
      return v ? v : "--";
    },
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      let json =
        userInfo.info && userInfo.info.staff ? userInfo.info.staff : {};
      let depList = [];
      // console.log(json)
      if (
        Object.prototype.toString.call(json.department) === "[object Array]"
      ) {
        json.department.map((v) => {
          depList.push({ value: v.depId, label: v.depName });
        });
        this.$set(this.result, "depId", null);
      }
      this.depList = depList;
      return json;
    },
    judgeBtn() {
      return {
        projectAdd: this.$pubfunc.judgeBtn("project:add"),
        projectTecd: this.$pubfunc.judgeBtn("project:tecdifficulty"),
        projectFeas: this.$pubfunc.judgeBtn("project:feasibility"),
      };
    },
  },
  watch: {
    "result.containOwnerProduct"() {
      this.clearErr("containOwnerProduct");
    },
    "result.commitStatus"() {
      this.clearErr("commitStatus");
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
        this.result.troilaProductAmount_.length > 1 &&
        this.result.troilaProductAmount_ === "0"
      ) {
        this.result.troilaProductAmount_ = this.result.troilaProductAmount_.slice(
          1
        );
      }
      return this.result.troilaProductAmount_;
    },
    handleClick(tab, event) {
      console.log(tab);
    },
    blurproductamount() {
      this.result.troilaProductAmount_ = this.$pubfunc.transformPrice(
        this.result.troilaProductAmount_,
        true
      );
      this.result.troilaProductAmount = this.result.troilaProductAmount_
        .split(",")
        .join("");
    },
    emptyTxt(v, money) {
      return v ? v + (money ? " 元" : "") : "--";
    },
    judgeUpdate(k) {
      let tecDirectorKeys = ["feasibility", "feasibilityDesc"],
        preSaleKeys = ["tecDifficulty", "tecDifficultyDesc", "tecDirector"];
      if (this.name !== "projectBackView") {
        return false;
      }
      switch (this.role) {
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
      }
      // console.log(this.updatefielddetail[k],this.name,this.role,k)
      return this.updatefielddetail &&
        this.updatefielddetail[k] &&
        this.updatefielddetail[k].length > 0
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
        data: { key, list: this.updatefielddetail[key] },
      });
    },
    judgebranchCompanyName() {
      if (!this.result.depId) {
        return this.userInfo.branchCompanyName.split(",").join("/");
      }
      for (let i in this.depList) {
        if (this.depList[i].value === this.result.depId) {
          return this.depList[i].label;
        }
      }
      return this.userInfo.branchCompanyName.split(",").join("/");
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
      this.$api.public.dict(
        { codeGroup: "contain_owner_product", pCode: "" },
        (res) => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.containOwnerProduct = res.data ? res.data : [];
              break;
          }
        }
      );
      this.name === "projectAdd"
        ? (this.$api.public.dict(
            { codeGroup: "proposal_reason", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.proposalReason = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "proj_type", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.projType = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict({ codeGroup: "win_rate", pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                this.winRate = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: "buy_type", pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                this.buyType = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict(
            { codeGroup: "customer_money_source", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.customerMoneySource = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
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
                  });
                  this.projStatus = list;
                  res.data && res.data.length > 0
                    ? (this.result.projStatus = res.data[0].value)
                    : null;
                  break;
              }
            }
          ),
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

                // if (
                //   this.$store.state.notecDepartment.indexOf(
                //     this.userInfo.branchCompany,
                //   ) > -1 ||
                //   this.userInfo.isAdmin === '1'
                // ) {
                list.unshift({ label: "不需要技术支持", value: "0" });
                // }
                this.preSale = list;
                break;
            }
          }))
        : ((this.waiting = true),
          this.$api.service.project.detail({ projId: this.projId }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                let staffId = this.userInfo.staffId;
                if (staffId === res.data.preSale && this.judgeBtn.projectTecd) {
                  this.role = "preSale";
                  this.$api.public.dict(
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
                  this.$api.public.dict(
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
                  this.$api.bgmgnt.staff.getList(
                    { resourceType: "02,06" },
                    (res) => {
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
                    }
                  );
                } else if (
                  staffId === res.data.tecDirector &&
                  this.judgeBtn.projectFeas
                ) {
                  this.role = "tecDirector";
                  this.$api.public.dict(
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
                } else {
                  this.cancel();
                  return;
                }
                this.name !== "projectBackView"
                  ? null
                  : this.$api.service.project.updatefielddetail(
                      { projId: this.projId },
                      (res) => {
                        // console.log(res)
                        switch (res.code) {
                          case "0":
                            this.updatefielddetail = res.data;
                            // console.log(this.data)
                            break;
                          default:
                        }
                      }
                    );
                this.result = res.data;
                this.data = JSON.parse(JSON.stringify(res.data));
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
                this.waiting = false;
                // console.log(this.result)
                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      type: "error",
                      text: res.message,
                      func: () => {
                        this.$router.push("/");
                      },
                    })
                  : this.$router.push("/");
            }
          }));
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case "customerId":
          this.result.customerId = res.value;
          break;
        case "planFinishTime":
          this.result.planFinishTime = this.$pubfunc.TimeTransform(
            "YYYY/MM/DD",
            res
          );
          break;
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
    },
    setErr(key, text) {
      // this.$store.commit("alertFn", {
      //   type: "error",
      //   text:
      //     (this.name === "projectAdd" ? "新建" : "保存") +
      //     "失败，请修改对应的错误内容",
      //   time: 2000,
      // });
      this.error.key = key;
      this.error.msg = text;
      return false;
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null;
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key]);
      }
    },
    submit() {
      if (this.loading) {
        return;
      }
      this.clearErr();
      let url,
        keys = [];
      switch (this.name) {
        case "projectAdd":
          if (this.depList.length > 0 && !this.result.depId) {
            return this.setErr("depId", "请选择所属部门");
          }
          if (!this.result.customerId) {
            return this.setErr("customerId", "请选择客户名称");
          }
          if (!this.$pubfunc.replaceSpace(this.result.projName, 1)) {
            return this.setErr("projName", "请输入项目名称");
          }
          if (!this.result.proposalReason) {
            return this.setErr("proposalReason", "请选择立项原因");
          }
          if (!this.$pubfunc.replaceSpace(this.result.projAmount_, 1)) {
            return this.setErr("projAmount_", "请输入项目金额");
          } else if (!Number(this.result.projAmount_.split(",").join(""))) {
            return this.setErr("projAmount_", "项目金额不可为0，请重新输入");
          }
          if (!this.result.projType) {
            return this.setErr("projType", "请选择项目类型");
          }
          if (!this.result.winRate) {
            return this.setErr("winRate", "请选择项目赢率");
          }
          if (!this.result.contact) {
            return this.setErr("contact", "请选择客户联系人");
          }
          if (!this.result.planFinishTime) {
            return this.setErr("planFinishTime", "请选择预计结案日期");
          }
          if (!this.result.buyType) {
            return this.setErr("buyType", "请选择采购方式");
          }
          if (!this.result.customerMoneySource) {
            return this.setErr("customerMoneySource", "请选择客户资金来源");
          }
          if (!this.result.containOwnerProduct) {
            return this.setErr("containOwnerProduct", "请选择是否包含自有产品");
          }
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
          if (!this.result.commitStatus) {
            return this.setErr("commitStatus", "请选择commit状态");
          }
          // if(!this.result.preSale){
          //     return this.setErr('preSale','请选择售前工程师');
          // }
          let firewallProductList = this.$refs.FirewallProduct.judgeItem(),
            safetyProductList = this.$refs.SecuritySoftwareProduct.judgeItem();
          if (!firewallProductList || !safetyProductList) {
            this.$store.commit("alertFn", {
              type: "error",
              text:
                (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
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

          this.$store.commit("confirmFn", {
            func: () => {
              url = "saveproposal";
              this.result.projAmount = this.result.projAmount_
                .split(",")
                .join("");
              keys = [
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
                "projStatusReason",
                "remark",
                "commitStatus",
                "preSale",
                "finalCustomer",
                "troilaProductAmount",
                "otherProduct",
                "firewallProductList",
                "safetyProductList",
              ];
              this.depList.length > 0 ? keys.push("depId") : null;
              this.ajaxFun(url, keys);
            },
            text: "请您确认所填信息准确无误！",
          });
          break;
        case "projectBack":
          if (this.activeName === "first") {
            switch (this.role) {
              case "preSale":
                if (!this.result.tecDifficulty) {
                  return this.setErr(
                    "tecDifficulty",
                    "请选择项目交付核心技术难点"
                  );
                  break;
                }
                if (
                  !this.$pubfunc.replaceSpace(this.result.tecDifficultyDesc, 1)
                ) {
                  return this.setErr(
                    "tecDifficultyDesc",
                    "请输入项目交付核心技术难点说明"
                  );
                  break;
                }
                if (this.result.tecDirector === this.userInfo.staffId) {
                  if (!this.result.feasibility) {
                    return this.setErr("feasibility", "请选择技术可行性判断");
                    break;
                  }
                  if (
                    !this.$pubfunc.replaceSpace(this.result.feasibilityDesc, 1)
                  ) {
                    return this.setErr(
                      "feasibilityDesc",
                      "请输入技术可行性判断说明"
                    );
                    break;
                  }
                }
                // if(!this.result.tecDirector){
                //     return this.setErr('tecDirector','请选择技术总监/技术负责人');
                // }
                url = "savetecdifficulty";
                keys = [
                  "projId",
                  "tecDirector",
                  "tecDifficulty",
                  "tecDifficultyDesc",
                ];
                let param = {};
                for (let k in keys) {
                  param[keys[k]] = this.result[keys[k]]
                    ? this.result[keys[k]]
                    : null;
                }
                this.role ? null : (param.updateReason = {});
                this.loading = true;
                this.$api.service.project[url](param, (res) => {
                  // console.log(res)
                  this.loading = false;
                  switch (res.code) {
                    case "0":
                      if (this.result.tecDirector === this.userInfo.staffId) {
                        url = "savefeasibility";
                        keys = ["projId", "feasibility", "feasibilityDesc"];
                        this.ajaxFun(url, keys);
                      } else {
                        this.$store.commit("alertFn", {
                          type: "success",
                          text: "操作成功",
                          func: () => {
                            this.cancel(true);
                          },
                        });
                      }
                      break;
                    default:
                      res.message
                        ? this.$store.commit("alertFn", {
                            type: "error",
                            text: res.message,
                          })
                        : null;
                  }
                  // this.ajaxFun(url, keys)
                  // console.log(this.result.tecDirector,this.userInfo.staffId)
                  // if(this.result.tecDirector===this.userInfo.staffId){
                  //   if (!this.result.feasibility) {
                  //     return this.setErr('feasibility', '请选择技术可行性判断')
                  //   }
                  // if (!this.$pubfunc.replaceSpace(this.result.feasibilityDesc, 1)) {
                  //   return this.setErr(
                  //     'feasibilityDesc',
                  //     '请输入技术可行性判断说明',
                  //   )
                  // }
                  // url = 'savefeasibility'
                  // keys = ['projId', 'feasibility', 'feasibilityDesc']
                  // this.ajaxFun(url, keys)
                });
                break;
              case "tecDirector":
                if (!this.result.feasibility) {
                  return this.setErr("feasibility", "请选择技术可行性判断");
                }
                if (
                  !this.$pubfunc.replaceSpace(this.result.feasibilityDesc, 1)
                ) {
                  return this.setErr(
                    "feasibilityDesc",
                    "请输入技术可行性判断说明"
                  );
                }
                url = "savefeasibility";
                keys = ["projId", "feasibility", "feasibilityDesc"];
                this.ajaxFun(url, keys);
                break;
            }
          } else {
            this.$refs.tabChoose4.submit();
          }
      }
    },
    ajaxFun(url, keys) {
      let param = {};
      for (let k in keys) {
        param[keys[k]] = this.result[keys[k]] ? this.result[keys[k]] : null;
      }
      this.role ? null : (param.updateReason = {});
      this.loading = true;
      this.$api.service.project[url](param, (res) => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.name === "projectAdd"
              ? this.$store.commit("confirmFn", {
                  okTxt: "好的",
                  cancelTxt: null,
                  func: () => {
                    this.$store.commit("alertFn", {
                      type: "success",
                      text: "新建成功",
                      func: () => {
                        this.cancel();
                      },
                    });
                  },
                  text:
                    '您的项目得分为<span class="projScore">' +
                    res.data +
                    "</span>分",
                })
              : this.$store.commit("alertFn", {
                  type: "success",
                  text: "操作成功",
                  func: () => {
                    this.cancel(true);
                  },
                });
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
    },
    cancel(j) {
      if (j) {
        this.nameChange ? (this.nameChange = false) : null;
        this.clearErr();
        this.$router.push({
          name: "projectBackView",
          params: { projId: this.$pubfunc.encode(this.projId) },
        });
        this.name = "projectBackView";
        this.getDropData();
        return;
      }
      let proMsg = this.$pubfunc.getSStorage("proMsg");
      this.$router.push({ name: proMsg ? "message" : "project" });
    },
    editBtn() {
      this.nameChange = true;
      this.$router.push({
        name: "projectBack",
        params: { projId: this.$pubfunc.encode(this.projId) },
      });
      this.name = "projectBack";
      this.getDropData();
    },
  },
  created() {
    // console.log(this.$route)
    this.name = this.$route.name;
    this.projId = this.$route.params.projId
      ? this.$pubfunc.decode(this.$route.params.projId)
      : null;
    if (
      (!this.projId && this.name !== "projectAdd") ||
      (this.name === "projectAdd" && !this.judgeBtn.projectAdd)
    ) {
      this.cancel();
      return;
    }
    this.getDropData();
  },
  mounted() {},
};
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
</style>
<style lang="scss" scoped>
.fillBox {
  .contentFix {
    .boxRel {
      .el-tabs {
        /deep/ .el-tabs__header {
          margin: 0;
          border-bottom: 0;
          margin-left: 20px;
          .el-tabs__nav {
            border: 0;
            padding: 20px 20px 0 10px;
            .el-tabs__item {
              box-shadow: 2px -2px 20px 0px rgba(110, 139, 234, 0.2);
              background-color: #f1f4fb;
              border: 0;
              min-width: 130px;
              height: 42px;
              line-height: 42px;
              text-align: center;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
              color: #7f879d;
              font-size: 14px;
              position: relative;
            }
            .is-active {
              color: #4c4f61;
              background-color: #fff;
              z-index: 99 !important;
            }
          }
        }
        /deep/ .el-tabs__content {
          width: 95%;
          height: 100%;
          padding: 20px 30px;
          margin-left: 10px;
          margin-bottom: 15px;
          box-shadow: 0px 2px 20px 0px rgba(110, 139, 234, 0.2);
          position: relative;
          z-index: 2;
          border-radius: 6px;
        }
      }
    }
  }
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
