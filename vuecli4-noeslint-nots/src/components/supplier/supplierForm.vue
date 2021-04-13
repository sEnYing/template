<template>
  <div class="fillBox changeFormW">
    <div class="boxTitle titleFix">
      <i class="supplier_icon"></i
      ><span>{{ `${result.supplierName}（等级${result.assessLevel}）` }}</span>
      <unit-btn
        type="plain right"
        :text="!supplierId || (supplierId && edit) ? '取消' : '返回'"
        @click="cancel"
      ></unit-btn>
      <unit-btn
        type="right"
        :loading="loading"
        :text="btnTxt[$route.name] ? btnTxt[$route.name] : '创建'"
        @click="submit"
        v-if="!supplierId || (supplierId && edit)"
      ></unit-btn>
    </div>
    <div class="contentFix supplierForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formPage">
            <div class="formMainTitle"><span>基本信息</span></div>
            <div class="formMainCont">
              <ul class="formUl">
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'supplierName',
                    resultView: supplierId && !edit,
                  }"
                >
                  <span class="formTitle"
                    ><i class="must" v-if="!supplierId || (supplierId && edit)"
                      >*</i
                    >供应商名称：</span
                  >
                  <div v-if="supplierId && !edit">
                    {{ result.supplierName }}
                  </div>
                  <input
                    v-if="!supplierId || (supplierId && edit)"
                    type="text"
                    v-model="result.supplierName"
                    maxlength="30"
                    @input="clearErr('supplierName')"
                  />
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'supplierName'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'serviceScope',
                  }"
                >
                  <span class="formTitle"
                    ><i class="must" v-if="!supplierId || (supplierId && edit)"
                      >*</i
                    >服务范围：</span
                  >
                  <div v-if="supplierId && !edit">
                    {{ result.serviceScopeName }}
                  </div>
                  <unit-dropdown
                    v-if="!supplierId || (supplierId && edit)"
                    id="serviceScope"
                    :multiple="true"
                    :list="serviceScope"
                    @change="dropdownReturn"
                    :result="result.serviceScope"
                  ></unit-dropdown>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'serviceScope'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'region',
                  }"
                >
                  <span class="formTitle"
                    ><i class="must" v-if="!supplierId || (supplierId && edit)"
                      >*</i
                    >省份/城市：</span
                  >
                  <div v-if="supplierId && !edit">
                    {{
                      result.provinceName && result.cityName
                        ? result.provinceName + " / " + result.cityName
                        : ""
                    }}
                  </div>
                  <!-- <div class="input" v-if="supplierId&&edit&&(!result.province||!result.city)"></div> -->
                  <unit-region
                    :must="true"
                    id="region"
                    @change="dropdownReturn"
                    :result="
                      result.province && result.city
                        ? [result.province, result.city]
                        : []
                    "
                    v-if="!supplierId || (supplierId && edit)"
                  ></unit-region>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'region'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'legalPerson',
                  }"
                >
                  <span class="formTitle">法定代表人：</span>
                  <div v-if="supplierId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.legalPerson)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!supplierId || (supplierId && edit)"
                    type="text"
                    v-model="result.legalPerson"
                    maxlength="20"
                  />
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'legalPerson'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
              </ul>
              <ul class="formUl">
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'assessLevel',
                  }"
                >
                  <span class="formTitle">供应商评估等级：</span>
                  <div>
                    {{ result.assessLevel | emptyTxt }}
                  </div>
                  <!-- <unit-dropdown
                    v-if="!supplierId || (supplierId && edit)"
                    id="assessLevel"
                    :list="assessLevel"
                    @change="dropdownReturn"
                    :result="result.assessLevel"
                  ></unit-dropdown>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'assessLevel'">{{
                      error.msg
                    }}</u></transition
                  > -->
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'companyType',
                  }"
                >
                  <span class="formTitle">公司类型：</span>
                  <div v-if="supplierId && !edit">
                    {{ result.companyTypeTxt | emptyTxt }}
                  </div>
                  <unit-dropdown
                    v-if="!supplierId || (supplierId && edit)"
                    id="companyType"
                    :list="compType"
                    @change="dropdownReturn"
                    :result="result.companyType"
                  ></unit-dropdown>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'companyType'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'workAddress',
                  }"
                >
                  <span class="formTitle"
                    ><i class="must" v-if="!supplierId || (supplierId && edit)"
                      >*</i
                    >办公地址：</span
                  >
                  <div v-if="supplierId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.workAddress)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!supplierId || (supplierId && edit)"
                    type="text"
                    v-model="result.workAddress"
                    maxlength="100"
                    @input="clearErr('workAddress')"
                  />
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'workAddress'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'establishDate',
                  }"
                >
                  <span class="formTitle">成立日期：</span>
                  <div v-if="supplierId && !edit">
                    {{ result.establishDate | emptyTxt }}
                  </div>
                  <unit-time
                    v-if="!supplierId || (supplierId && edit)"
                    placeholder=""
                    :value="result.establishDate"
                    id="establishDate"
                    @return="dropdownReturn"
                  ></unit-time>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'establishDate'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
              </ul>
              <ul class="formUl">
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'businessScope',
                  }"
                >
                  <span class="formTitle">经营范围：</span>
                  <div v-if="supplierId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.businessScope)"
                      :lines="3"
                    ></unit-popover>
                  </div>
                  <textarea
                    v-if="!supplierId || (supplierId && edit)"
                    class="input"
                    v-model="result.businessScope"
                    maxlength="500"
                  ></textarea>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'businessScope'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'telephone_',
                  }"
                >
                  <span class="formTitle">电话：</span>
                  <div v-if="supplierId && !edit">
                    {{ result.telephone | emptyTxt }}
                  </div>
                  <input
                    v-if="!supplierId || (supplierId && edit)"
                    type="text"
                    v-model="result.telephone"
                    maxlength="20"
                  />
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'telephone_'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>

                <li
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === 'registerAddress',
                  }"
                >
                  <span class="formTitle">工商注册地址：</span>
                  <div v-if="supplierId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.registerAddress)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!supplierId || (supplierId && edit)"
                    type="text"
                    v-model="result.registerAddress"
                    maxlength="100"
                  />
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === 'registerAddress'">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
              </ul>
              <div class="remark">
                <span class="formTitle">其他：</span>
                <div v-if="supplierId && !edit" class="checkRemark">
                  {{result.remark|--}}
                </div>
                <textarea
                  v-if="!supplierId || (supplierId && edit)"
                  class="input remarkInt"
                  v-model="result.remark"
                  maxlength="200"
                ></textarea>
                <transition name="publicTransition"
                  ><u class="error" v-if="error.key === 'businessScope'">{{
                    error.msg
                  }}</u></transition
                >
              </div>
            </div>
            <div class="formMainTitle"><span>供应商业务类型</span></div>
            <div class="formMainCont">
              <ul class="tableBox">
                <li class="boxTable" :class="{ maxTable: supplierId && !edit }">
                  <unit-table
                    type="hardwareBrand"
                    :list="hardwareBrand"
                    :edit="supplierId && !edit ? false : true"
                    :dropdown="{
                      brandName: hardware,
                      typeNames: typeNames,
                      levelTxt: supplierLevel,
                    }"
                    ref="hardwareBrand"
                  ></unit-table>
                </li>
                <li class="boxTable" :class="{ maxTable: supplierId && !edit }">
                  <unit-table
                    type="softwareBrand"
                    :list="softwareBrand"
                    :edit="supplierId && !edit ? false : true"
                    :dropdown="{
                      brandName: software,
                      typeNames: typeNames,
                      levelTxt: supplierLevel,
                    }"
                    ref="softwareBrand"
                  ></unit-table>
                </li>
                <li
                  class="boxTable marginY"
                  :class="{ maxTable: supplierId && !edit }"
                >
                  <unit-table
                    type="service"
                    :list="serviceBrand"
                    :edit="supplierId && !edit ? false : true"
                    :dropdown="{
                      service: service,
                      levelTxt: serviceSupplierLevel,
                    }"
                    ref="serviceBrand"
                  ></unit-table>
                </li>
              </ul>
            </div>
            <div class="formMainTitle"><span>供应商资质文件</span></div>
            <div class="formMainCont">
              <qualificationFile
                :titleTxT="'供应商基本信息表'"
                :list="informationSheet"
                :type="0"
                :edit="edit"
                :supplierId="supplierId"
                style="margin-top: 10px"
                @getFile="getFile"
                @removePic="removePic"
              ></qualificationFile>
              <qualificationFile
                :titleTxT="'营业执照复印件'"
                :list="BusinessLicenseSheet"
                :type="1"
                :edit="edit"
                :supplierId="supplierId"
                @getFile="getFile"
                @removePic="removePic"
              ></qualificationFile>
              <qualificationFile
                :titleTxT="'法人身份证彩色复印件'"
                :list="IDSheet"
                :type="2"
                :edit="edit"
                :supplierId="supplierId"
                @getFile="getFile"
                @removePic="removePic"
              ></qualificationFile>
              <qualificationFile
                :titleTxT="'开户许可证复印件'"
                :list="openAccountSheet"
                :type="3"
                :edit="edit"
                :supplierId="supplierId"
                @getFile="getFile"
                @removePic="removePic"
              ></qualificationFile>
              <qualificationFile
                :titleTxT="'资质扫描件'"
                :list="qualificationsSheet"
                :type="4"
                :edit="edit"
                :supplierId="supplierId"
                @getFile="getFile"
                @removePic="removePic"
              ></qualificationFile>
              <qualificationFile
                :titleTxT="'近三年审计报告或财务报表扫描'"
                :list="reportSheet"
                :type="5"
                :edit="edit"
                :supplierId="supplierId"
                @getFile="getFile"
                @removePic="removePic"
                style="margin-bottom: 30px"
              ></qualificationFile>
            </div>
            <div class="formMainTitle supplierReview">
              <span
                >供应商评审
                <span style="color: #4881f9"
                  >（等级{{result.assessLevel|--}}）</span
                ></span
              >
            </div>
            <div class="formMainCont SupplieReview">
              <ul class="formUl">
                <li
                  v-for="(item, index) in standardList"
                  :key="index"
                  :class="{
                    small: supplierId && !edit,
                    errorBorder: error.key === item.standardId,
                  }"
                >
                  <span class="formTitle"
                    ><i class="must" v-if="!supplierId || (supplierId && edit)"
                      >*</i
                    >{{ item.standardName }}：</span
                  >
                  <div v-if="supplierId && !edit">
                    <template v-for="i in result.assessDetailList || []">
                      <unit-popover
                        :key="i.standardId"
                        v-if="i.standardId === item.standardId"
                        :content="emptyTxt(i.attributeValue)"
                      ></unit-popover>
                    </template>
                  </div>
                  <el-select
                    v-else
                    v-model="selectStandard[item.standardId]"
                    @change="selectStandardChange(item.standardId)"
                  >
                    <el-option
                      v-for="(i, k) in item.attributeList"
                      :key="k"
                      :label="i.attributeValue"
                      :value="i.attributeId"
                    ></el-option>
                  </el-select>
                  <transition name="publicTransition"
                    ><u class="error" v-if="error.key === item.standardId">{{
                      error.msg
                    }}</u></transition
                  >
                </li>
              </ul>
            </div>
            <div class="formMainTitle"><span>联系人</span></div>
            <div class="formMainCont contactList">
              <div>
                <ul
                  class="contactBox"
                  v-for="(item, i) in contactList"
                  :key="i"
                >
                  <li class="top">
                    <span>{{ item.contactName | filName }}</span>
                    <i
                      class="del"
                      title="删除"
                      @click="contactBtn('del', i)"
                      v-if="!supplierId || (supplierId && !item.contactId)"
                    ></i>
                    <i
                      class="edit"
                      title="编辑"
                      @click="contactBtn('edit', i)"
                      v-if="supplierId && editContact !== i"
                    ></i>
                    <i
                      class="ok"
                      title="确定"
                      @click="contactBtn('submit', item, i)"
                      v-if="supplierId && editContact === i"
                    ></i>
                  </li>
                  <li
                    class="name"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'contactName',
                    }"
                  >
                    <div
                      class="contactCon input"
                      :class="{ emptyDiv: !item.contactName }"
                      v-if="supplierId && editContact !== i"
                    >
                      {{ item.contactName ? item.contactName : "姓名" }}
                    </div>
                    <i class="must" v-if="!supplierId || editContact === i"
                      >*</i
                    >
                    <input
                      v-if="!supplierId || editContact === i"
                      v-model="item.contactName"
                      class="contactCon"
                      placeholder="姓名"
                      type="text"
                      maxlength="20"
                      @input="clearErr('contactName')"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="
                          error.contact === i && error.key === 'contactName'
                        "
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <!-- <li class="birth">
                                        <div class="contactCon input" :class="{'emptyDiv':!item.birthday}" v-if="supplierId&&editContact!==i">{{item.birthday?item.birthday:'出生日期'}}</div>
                                        <unit-time v-if="!supplierId||editContact===i" class="contactCon" placeholder="出生日期" :value='item.birthday' :editable='false' id='birthday' @return='dropdownReturn'></unit-time>
                                    </li> -->
                  <li
                    class="depart"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'department',
                    }"
                  >
                    <div
                      class="contactCon input"
                      :class="{
                        emptyDiv: !item.department,
                        countLarge:
                          item.department &&
                          item.department.toString().length > 17,
                      }"
                      v-if="supplierId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.department ? item.department : '部门'"
                      ></unit-popover>
                    </div>
                    <input
                      :style="{
                        paddingRight:
                          item.department &&
                          item.department.toString().length > 17
                            ? '16px'
                            : '',
                      }"
                      v-if="!supplierId || editContact === i"
                      v-model="item.department"
                      class="contactCon"
                      placeholder="部门"
                      type="text"
                      maxlength="30"
                      @input="clearErr('department')"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="error.contact === i && error.key === 'department'"
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li
                    class="position"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'position',
                    }"
                  >
                    <div
                      class="contactCon input countLarge"
                      :class="{ emptyDiv: !item.position }"
                      v-if="supplierId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.position ? item.position : '职务'"
                      ></unit-popover>
                    </div>
                    <input
                      :style="{
                        paddingRight:
                          item.position && item.position.toString().length > 4
                            ? '16px'
                            : '',
                      }"
                      v-if="!supplierId || editContact === i"
                      v-model="item.position"
                      class="contactCon"
                      placeholder="职务"
                      type="text"
                      maxlength="30"
                      @input="clearErr('position')"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="error.contact === i && error.key === 'position'"
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li
                    class="sex"
                    :class="{
                      errorBorder: error.contact === i && error.key === 'sex',
                    }"
                  >
                    <div
                      class="contactCon input countLarge"
                      :class="{ emptyDiv: !item.sex }"
                      v-if="supplierId && editContact !== i"
                    >
                      {{
                        item.sex === "1"
                          ? "男"
                          : item.sex === "2"
                          ? "女"
                          : "性别"
                      }}
                    </div>
                    <unit-dropdown
                      v-if="!supplierId || editContact === i"
                      class="contactCon auto"
                      placeholder="性别"
                      :result="item.sex"
                      id="sex"
                      :list="sex"
                      align="center"
                      @change="dropdownReturn"
                    ></unit-dropdown>
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="error.contact === i && error.key === 'sex'"
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li
                    class="telephone"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'telephone',
                    }"
                  >
                    <div
                      class="contactCon input countLarge"
                      :class="{ emptyDiv: !item.telephone }"
                      v-if="supplierId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.telephone ? item.telephone : '电话'"
                      ></unit-popover>
                    </div>
                    <input
                      :style="{
                        paddingRight:
                          item.telephone && item.telephone.toString().length > 7
                            ? '16px'
                            : '',
                      }"
                      v-if="!supplierId || editContact === i"
                      v-model="item.telephone"
                      class="contactCon"
                      placeholder="电话"
                      type="text"
                      maxlength="20"
                      @input="clearErr('telephone', item)"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="error.contact === i && error.key === 'telephone'"
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li
                    class="phone"
                    :class="{
                      errorBorder:
                        error.contact === i &&
                        error.key === 'mobilePhoneNumber',
                    }"
                  >
                    <div
                      class="contactCon input countLarge"
                      :class="{ emptyDiv: !item.mobilePhoneNumber }"
                      v-if="supplierId && editContact !== i"
                    >
                      {{
                        item.mobilePhoneNumber ? item.mobilePhoneNumber : "手机"
                      }}
                    </div>
                    <i class="must" v-if="!supplierId || editContact === i"
                      >*</i
                    >
                    <input
                      :style="{
                        paddingRight:
                          item.mobilePhoneNumber &&
                          item.mobilePhoneNumber.toString().length > 7
                            ? '16px'
                            : '',
                      }"
                      v-if="!supplierId || editContact === i"
                      v-model="item.mobilePhoneNumber"
                      class="contactCon"
                      placeholder="手机"
                      type="text"
                      maxlength="11"
                      @input="clearErr('mobilePhoneNumber', item)"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="
                          error.contact === i &&
                          error.key === 'mobilePhoneNumber'
                        "
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li class="email">
                    <div
                      class="contactCon input"
                      :class="{ emptyDiv: !item.email }"
                      v-if="supplierId && editContact !== i"
                    >
                      {{ item.email ? item.email : "邮箱" }}
                    </div>
                    <input
                      v-if="!supplierId || editContact === i"
                      v-model="item.email"
                      class="contactCon"
                      type="text"
                      placeholder="邮箱"
                    />
                  </li>
                  <li
                    class="region"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'region1',
                    }"
                  >
                    <div
                      class="contactCon input"
                      :class="{
                        emptyDiv: !item.provinceName || !item.cityName,
                      }"
                      v-if="supplierId && editContact !== i"
                    >
                      {{
                        item.provinceName && item.cityName
                          ? item.provinceName + " / " + item.cityName
                          : "省份/城市"
                      }}
                    </div>
                    <i class="must" v-if="!supplierId || editContact === i"
                      >*</i
                    >
                    <unit-region
                      v-if="!supplierId || editContact === i"
                      :result="
                        item.province && item.city
                          ? [item.province, item.city]
                          : []
                      "
                      class="contactCon"
                      placeholder="省份/城市"
                      :must="true"
                      id="region1"
                      @change="dropdownReturn"
                    ></unit-region>
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="error.contact === i && error.key === 'region1'"
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <!-- <li class="rCode">
                                        <div class="contactCon input" :class="{'emptyDiv':!item.postcode}" v-if="supplierId&&editContact!==i">{{item.postcode?item.postcode:'邮政编码'}}</div>
                                        <input v-if="!supplierId||editContact===i" v-model="item.postcode" class="contactCon" type="text" placeholder="邮政编码">
                                    </li> -->
                  <li
                    class="add"
                    :class="{
                      errorBorder:
                        error.contact === i && error.key === 'workAddress1',
                    }"
                  >
                    <div
                      class="contactCon input"
                      :class="{
                        emptyDiv: !item.workAddress,
                        countLarge:
                          item.workAddress &&
                          item.workAddress.toString().length > 17,
                      }"
                      v-if="supplierId && editContact !== i"
                    >
                      <unit-popover
                        :content="
                          item.workAddress ? item.workAddress : '办公地址'
                        "
                      ></unit-popover>
                    </div>
                    <i class="must" v-if="!supplierId || editContact === i"
                      >*</i
                    >
                    <input
                      @input="clearErr('workAddress1')"
                      v-if="!supplierId || editContact === i"
                      :style="{
                        paddingRight:
                          item.workAddress &&
                          item.workAddress.toString().length > 17
                            ? '16px'
                            : '',
                      }"
                      v-model="item.workAddress"
                      class="contactCon"
                      type="text"
                      maxlength="100"
                      placeholder="办公地址"
                    />
                    <transition name="publicTransition"
                      ><u
                        class="error"
                        v-if="
                          error.contact === i && error.key === 'workAddress1'
                        "
                        >{{ error.msg }}</u
                      ></transition
                    >
                  </li>
                  <li class="remark">
                    <div
                      class="contactCon input textarea"
                      v-if="supplierId && editContact !== i"
                      :class="{
                        emptyDiv: !item.remark,
                        countLarge:
                          item.remark && item.remark.toString().length > 17,
                      }"
                    >
                      <div>
                        <el-scrollbar class="unitScrollbar">{{
                          item.remark ? item.remark : "备注"
                        }}</el-scrollbar>
                      </div>
                    </div>
                    <textarea
                      v-if="!supplierId || editContact === i"
                      :style="{
                        paddingRight:
                          item.remark && item.remark.toString().length > 17
                            ? '16px'
                            : '',
                      }"
                      v-model="item.remark"
                      class="input contactCon"
                      placeholder="备注"
                      maxlength="100"
                    ></textarea>
                  </li>
                </ul>
                <unit-btn
                  type="large"
                  text="添加联系人"
                  @click="contactBtn('add')"
                ></unit-btn>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitRegion from "@/unit/components/thisUnit/region";
import unitTime from "@/unit/components/element/timeBox";
import unitPopover from "@/unit/components/popover";
import unitTable from "@/unit/components/thisUnit/tableBrand";
import qualificationFile from "./components/qualificationFile";
export default {
  name: "supplierForm",
  props: ["dom"],
  components: {
    unitRegion,
    unitTime,
    unitPopover,
    unitTable,
    qualificationFile,
  },
  data() {
    return {
      supplierId: null,
      edit: false,
      result: {
        supplierName: "",
        serviceScope: [],
        province: "",
        city: "",
        legalPerson: "",
        telephone: "",
        companyType: "",
        assessLevel: "",
        businessScope: "",
        establishDate: "",
        workAddress: "",
        registerAddress: "",
        assessDetailList: [],
        remark: "",
      },
      hardwareBrand: [],
      softwareBrand: [],
      serviceBrand: [],
      informationSheet: [],
      BusinessLicenseSheet: [],
      IDSheet: [],
      openAccountSheet: [],
      qualificationsSheet: [],
      reportSheet: [],
      contactList: [],
      baseContact: {
        contactName: "",
        sex: "",
        // birthday:'',
        department: "",
        position: "",
        telephone: "",
        mobilePhoneNumber: "",
        email: "",
        province: "",
        city: "",
        // postcode:'',
        workAddress: "",
        remark: "",
        provinceName: "",
        cityName: "",
      },
      editContact: null,
      serviceScope: [],
      compType: [],
      assessLevel: [],
      typeNames: [],
      hardware: [],
      software: [],
      service: [],
      serviceSupplierLevel: [],
      supplierLevel: [],
      sex: [
        { value: "1", label: "男" },
        { value: "2", label: "女" },
      ],
      error: {
        contact: null,
        key: null,
        msg: "",
      },
      tell: false,
      loading: false,
      contactLoading: false,
      btnTxt: {
        supplierAdd: "创建",
        supplierEdit: "保存",
      },
      standardList: [],
      selectStandard: {},
      fileList: {},
      documentIdsForDelete: "",
    };
  },
  filters: {
    filName(v) {
      v = v ? v.toString() : "姓名";
      return v.length > 2 ? v.slice(v.length - 2, v.length) : v;
    },
    emptyTxt(v) {
      return v ? v : "--";
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
      return { isCharge, staffId };
    },
    judgeBtn() {
      return {
        supplierAdd: this.$pubfunc.judgeBtn("supplier:add"),
        supplierUpdate: this.$pubfunc.judgeBtn("supplier:update"),
        supplierView: this.$pubfunc.judgeBtn("supplier:view"),
      };
    },
  },
  methods: {
    emptyTxt(v) {
      return v ? v : "--";
    },
    getDropData() {
      this.supplierId && !this.edit
        ? null
        : (this.$api.public.region({ level: 10, pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                let province = res.data && res.data.list ? res.data.list : [];
                province.splice(0, 0, {
                  label: "全国",
                  value: "0",
                });
                this.serviceScope = province;
                break;
            }
          }),
          this.$api.public.dict(
            { codeGroup: "company_type", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.compType = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "assess_level", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.assessLevel = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "product_type", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.typeNames = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "supplier_level", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.supplierLevel = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "hardware_brand", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.hardware = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "software_brand", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.software = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "supplier_service", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.service = res.data ? res.data : [];
                  break;
              }
            }
          ),
          this.$api.public.dict(
            { codeGroup: "supplier_service_level", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.serviceSupplierLevel = res.data ? res.data : [];
                  break;
              }
            }
          ));
      if (this.supplierId) {
        this.$api.service.supplier.detail(
          { supplierId: this.supplierId },
          (res) => {
            switch (res.code) {
              case "0":
                if (this.edit) {
                  for (let k in this.result) {
                    if (k === "serviceScope") {
                      this.result[k] = res.data[k].split(",");
                    } else {
                      this.result[k] = res.data[k];
                    }
                  }
                } else {
                  for (let k in res.data) {
                    this.result[k] = res.data[k];
                  }
                }
                this.hardwareBrand = res.data.hardwareList;
                this.softwareBrand = res.data.softwareList;
                this.serviceBrand = res.data.serviceList;
                for (const [index, item] of Object.entries(
                  res.data.documentList || []
                )) {
                  if (item.documentType === "0") {
                    this.informationSheet.push(item);
                  } else if (item.documentType === "1") {
                    this.BusinessLicenseSheet.push(item);
                  } else if (item.documentType === "2") {
                    this.IDSheet.push(item);
                  } else if (item.documentType === "3") {
                    this.openAccountSheet.push(item);
                  } else if (item.documentType === "4") {
                    this.qualificationsSheet.push(item);
                  } else if (item.documentType === "5") {
                    this.reportSheet.push(item);
                  }
                }
                this.$api.service.supplier.assessStandard(
                  { type: "1" },
                  (res) => {
                    if (res.code === "0") {
                      this.standardList = res.data.standardList;
                      for (const [k, v] of Object.entries(this.standardList)) {
                        this.$set(this.selectStandard, v.standardId, "");
                      }
                      for (const [k, v] of Object.entries(
                        this.selectStandard
                      )) {
                        for (const [ck, cv] of Object.entries(
                          this.result.assessDetailList
                            ? this.result.assessDetailList
                            : []
                        )) {
                          if (k === cv.standardId) {
                            this.selectStandard[k] = cv.attributeId;
                          }
                        }
                      }
                    } else {
                      res.message
                        ? this.$store.commit("alertFn", {
                            type: "error",
                            text: res.message,
                          })
                        : null;
                    }
                  }
                );

                break;
              default:
                this.cancel();
            }
          }
        );

        this.$api.service.contact.supplierList(
          { supplierId: this.supplierId },
          (res) => {
            switch (res.code) {
              case "0":
                let list = [];
                (res.data.list ? res.data.list : []).map((v) => {
                  list.push(v);
                });
                this.contactList = list;
                break;
              default:
                this.cancel();
            }
          }
        );
      } else {
        this.$api.service.supplier.assessStandard({ type: "1" }, (res) => {
          if (res.code === "0") {
            this.standardList = res.data.standardList;
            for (const [k, v] of Object.entries(this.standardList)) {
              this.$set(this.selectStandard, v.standardId, "");
            }
            console.log(this.standardList);
            console.log(this.selectStandard);
          } else {
            res.message
              ? this.$store.commit("alertFn", {
                  type: "error",
                  text: res.message,
                })
              : null;
          }
        });
      }
    },
    getFile(v) {
      for (const [key, val] of Object.entries(v)) {
        this.fileList[key] = val;
      }
    },
    removePic(v) {
      this.documentIdsForDelete = v;
    },
    selectStandardChange(id) {
      this.setErr();
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case "serviceScope":
          var arr = [];
          for (const [k, v] of Object.entries(res)) {
            arr.push(v.value);
          }
          this.result.serviceScope = arr;
          break;
        case "region":
          this.result.province = res.ids[0];
          this.result.city = res.ids[1];
          this.result.provinceName = res.labels[0];
          this.result.cityName = res.labels[1];
          break;
        case "establishDate":
          this.result.establishDate = this.$pubfunc.TimeTransform(
            "YYYY/MM/DD",
            res
          );
          break;
        case "companyType":
          this.result.companyType = res.value;
          break;
        case "assessLevel":
          this.result.assessLevel = res.value;
          break;
        case "sex":
          this.contactList[this.editContact].sex = res.value;
          break;
        case "birthday":
          this.contactList[
            this.editContact
          ].birthday = this.$pubfunc.TimeTransform("YYYY/MM/DD", res);
          break;
        case "region1":
          this.contactList[this.editContact].province = res.ids[0];
          this.contactList[this.editContact].city = res.ids[1];
          this.contactList[this.editContact].provinceName = res.labels[0];
          this.contactList[this.editContact].cityName = res.labels[1];
          break;
      }
    },
    contactBtn(key, json, index, func, submit) {
      switch (key) {
        case "add":
          if (this.contactList.length > 0 && this.editContact !== null) {
            if (!this.supplierId) {
              if (
                !this.contactBtn(
                  "submit",
                  this.contactList[this.editContact],
                  this.editContact
                )
              ) {
                return;
              }
            } else {
              this.$store.commit("confirmFn", {
                func: () => {
                  if (
                    !this.contactBtn(
                      "submit",
                      this.contactList[this.editContact],
                      this.editContact,
                      () => {
                        let base = JSON.parse(JSON.stringify(this.baseContact));
                        base.province = this.result.province;
                        base.city = this.result.city;
                        base.provinceName = this.result.provinceName;
                        base.cityName = this.result.cityName;
                        base.workAddress = this.result.workAddress;
                        this.contactList.push(base);
                        this.editContact = this.contactList.length - 1;
                      }
                    )
                  ) {
                    this.$store.commit("alertFn", {
                      type: "error",
                      text: "保存失败，请修改对应的错误内容",
                      time: 2000,
                    });
                  }
                },
                text: "您是否保存正在编辑的联系人信息？",
              });
              return;
            }
          }
          let base = JSON.parse(JSON.stringify(this.baseContact));
          base.province = this.result.province;
          base.city = this.result.city;
          base.provinceName = this.result.provinceName;
          base.cityName = this.result.cityName;
          base.workAddress = this.result.workAddress;
          this.contactList.push(base);
          this.editContact = this.contactList.length - 1;
          break;
        case "edit":
          if (this.editContact === null) {
            this.editContact = json;
          } else if (this.editContact || this.editContact === 0) {
            this.$store.commit("confirmFn", {
              func: () => {
                if (
                  !this.contactBtn(
                    "submit",
                    this.contactList[this.editContact],
                    this.editContact,
                    () => {
                      this.editContact = json;
                    }
                  )
                ) {
                  this.$store.commit("alertFn", {
                    type: "error",
                    text: this.edit
                      ? "请修改对应的错误内容"
                      : "保存失败，请修改对应的错误内容",
                    time: 2000,
                  });
                }
              },
              text: this.edit
                ? "是否结束编辑正在修改的联系人信息？"
                : "您是否保存正在编辑的联系人信息？",
            });
          }
          break;
        case "del":
          this.editContact =
            this.editContact === json
              ? null
              : this.editContact < json
              ? this.editContact
              : this.editContact - 1;
          this.error.contact === json ? this.clearErr() : null;
          this.contactList.splice(json, 1);
          break;
        case "submit":
          // console.log(json)
          if (!this.$pubfunc.replaceSpace(json.contactName, 1)) {
            return this.setErr("contactName", "请输入联系人名称", index);
          }
          // if(!this.$pubfunc.replaceSpace(json.department,1)){
          //     return this.setErr('department','请输入联系人所在部门',index);
          // }
          // if(!this.$pubfunc.replaceSpace(json.position,1)){
          //     return this.setErr('position','请输入联系人职务',index);
          // }
          // if(!json.sex){
          //     return this.setErr('sex','请选择联系人性别',index);
          // }
          // if(!this.$pubfunc.replaceSpace(json.telephone,1)){---+

          //     return this.setErr('telephone','请输入联系人电话号码',index);
          // }
          if (!this.$pubfunc.replaceSpace(json.mobilePhoneNumber, 1)) {
            return this.setErr(
              "mobilePhoneNumber",
              "请输入联系人手机号码",
              index
            );
          }
          if (!json.province) {
            return this.setErr("region1", "请选择省份/城市", index);
          }
          if (!json.city) {
            return this.setErr("region1", "请选择省份/城市", index);
          }
          if (!this.$pubfunc.replaceSpace(json.workAddress, 1)) {
            return this.setErr("workAddress1", "请输入办公地址", index);
          }
          let param = {},
            submitKeys = [
              "contactName",
              "department",
              "position",
              "telephone",
              "mobilePhoneNumber",
              "email",
              "remark",
              "province",
              "city",
              "sex",
              "workAddress",
            ];
          for (let k in submitKeys) {
            param[submitKeys[k]] = json[submitKeys[k]];
          }
          if (json.contactId) {
            param.contactId = json.contactId;
          }
          if (json.orgId) {
            param.orgId = json.orgId;
          }
          if (this.supplierId && !this.edit) {
            let url = json.contactId ? "supplierUpdate" : "supplierAdd";
            if (!json.orgId) {
              param.orgId = this.supplierId;
            }
            if (this.contactLoading) {
              return;
            }
            this.contactLoading = true;
            this.$api.service.contact[url](param, (res) => {
              // console.log(res)
              this.contactLoading = false;
              switch (res.code) {
                case "0":
                  this.$store.commit("alertFn", {
                    type: "success",
                    text: json.contactId ? "编辑成功" : "添加成功",
                    func: () => {
                      json.contactId
                        ? null
                        : (this.contactList[this.editContact].contactId =
                            res.data);
                      this.editContact = null;
                      func ? func() : null;
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
          } else if (this.tell && !submit) {
            this.$nextTick(() => {
              this.$store.commit("confirmFn", {
                func: () => {
                  this.editContact = null;
                  func ? func() : null;
                },
                text: "注意：联系人信息的更改需要跟随供应商信息一起提交",
              });
              this.tell = false;
            });
          } else {
            this.editContact = null;
            func ? func() : null;
          }
          return param;
      }
    },
    setErr(key, text, judge) {
      this.error.contact = judge;
      judge === null
        ? this.$store.commit("alertFn", {
            type: "error",
            text: (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
            time: 2000,
          })
        : null;
      this.error.key = key;
      this.error.msg = text;
      return false;
    },
    clearErr(key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null;
        this.error.contact = null;
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key]);
      }
    },
    objectKeyIsEmpty(obj) {
      let empty = false;
      if (Reflect.ownKeys(obj).length > 0) {
        for (const [k, v] of Object.entries(obj)) {
          if (Reflect.has(obj, k)) {
            if (obj[k] === null || obj[k] === "") {
              empty = true;
            }
          }
        }
      } else {
        empty = true;
      }
      return empty;
    },
    submit() {
      if (this.loading) {
        return;
      }
      this.clearErr();
      if (!this.$pubfunc.replaceSpace(this.result.supplierName, 1)) {
        return this.setErr("supplierName", "请输入供应商名称", null);
      }
      if (!this.result.serviceScope) {
        return this.setErr("serviceScope", "请选择服务范围", null);
      }
      if (!this.result.province || !this.result.city) {
        return this.setErr("region", "请选择省份", null);
      }
      if (!this.$pubfunc.replaceSpace(this.result.workAddress, 1)) {
        return this.setErr("workAddress", "请输入办公地址", null);
      }
      let hardwareList = this.$refs.hardwareBrand.judgeItem(),
        softwareList = this.$refs.softwareBrand.judgeItem();
      let serviceList = this.$refs.serviceBrand.judgeItem();
      if (!hardwareList || !softwareList || !serviceList) {
        this.$store.commit("alertFn", {
          type: "error",
          text: (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
          time: 2000,
        });
        return;
      }
      var num = false;
      for (const [k, v] of Object.entries(this.selectStandard)) {
        if (!v) {
          num = true;
          return this.setErr(k, "请选择对应内容", null);
        }
      }
      if (num) return;
      this.result.assessDetailList = [];
      for (const [k, v] of Object.entries(this.selectStandard)) {
        this.result.assessDetailList.push({ standardId: k, attributeId: v });
      }
      let param = {
        supplierName: this.result.supplierName,
        serviceScope: this.result.serviceScope.join(","),
        province: this.result.province,
        city: this.result.city,
        legalPerson: this.result.legalPerson,
        telephone: this.result.telephone,
        companyType: this.result.companyType,
        assessLevel: this.result.assessLevel,
        establishDate: this.result.establishDate,
        businessScope: this.result.businessScope,
        workAddress: this.result.workAddress,
        registerAddress: this.result.registerAddress,
        hardwareList: hardwareList,
        softwareList: softwareList,
        serviceList: serviceList,
        assessDetailList: this.result.assessDetailList,
        documentList: [],
        documentIdsForDelete: this.documentIdsForDelete,
        remark: this.result.remark,
      };

      let contactList = [];
      for (let i in this.contactList) {
        let j = this.contactBtn(
          "submit",
          this.contactList[i],
          Number(i),
          null,
          true
        );
        if (j) {
          contactList.push(j);
        } else {
          this.editContact = Number(i);
          this.$store.commit("alertFn", {
            type: "error",
            text: (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
            time: 2000,
          });
          return;
        }
      }
      param.contactList = contactList;
      for (const [key, val] of Object.entries(this.fileList)) {
        for (const [index, item] of Object.entries(val)) {
          if (!item.documentId) {
            param.documentList.push({
              documentName: item.name,
              documentType: key,
              documentAddr: item.documentAddr,
            });
          }
        }
      }
      let url = "add";
      if (this.edit) {
        url = "update";
        param.supplierId = this.supplierId;
      }
      // return
      this.loading = true;
      this.$api.service.supplier[url](param, (res) => {
        this.loading = false;
        switch (res.code) {
          case "0":
            this.$store.commit("alertFn", {
              type: "success",
              text: this.edit ? "保存成功" : "新建成功",
              func: () => {
                this.cancel();
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
    cancel() {
      this.$router.push({
        name:
          this.$route.name === "contactSupplierAdd" ? "contact" : "supplier",
      });
    },
  },
  created() {
    // console.log(this.$route)
    switch (this.$route.name) {
      case "supplierEdit":
        if (!this.judgeBtn.supplierUpdate) {
          this.cancel();
          return;
        }
        this.edit = true;
        this.tell = true;
      case "supplierView":
        // if(!this.edit&&!this.judgeBtn.supplierView){
        //     this.cancel();
        //     return
        // }
        let supplierId;
        try {
          supplierId = this.$pubfunc.decode(this.$route.params.supplierId);
        } catch (error) {
          this.cancel();
          return;
        }
        this.supplierId = supplierId;
        break;
      default:
        if (!this.judgeBtn.supplierAdd) {
          this.cancel();
          return;
        }
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
.formUl > li > span.formTitle {
  width: 120px;
}
.formUl > li u.error {
  left: 100px;
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
.contactBox {
  display: inline-block;
  width: 350px;
  box-sizing: border-box;
  height: auto;
  padding: 14px 12px 42px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin: 26px 30px 0 0;
  position: relative;
}
.contactBox > li {
  position: relative;
  margin-bottom: 8px;
  display: inline-block;
  width: 100%;
}
.contactBox > li.top {
  margin-bottom: 12px;
}
.contactBox > li.sex,
.contactBox > li.position,
.contactBox > li.telephone,
.contactBox > li.phone {
  width: 49%;
}
.contactBox > li.position,
.contactBox > li.telephone {
  margin-right: 2%;
}
.contactBox > li:not(.top):before {
  content: "";
  display: block;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 7px;
  left: 8px;
  background: url("../../assets/images/loginIcon.png") no-repeat;
  z-index: 11;
}
.contactBox > li.name::before {
  background-position: -29px -4px;
}
.contactBox > li.phone::before {
  background-position: -30px -30px;
}
.contactBox > li.birth::before {
  background-position: -29px -56px;
}
.contactBox > li.depart::before {
  background-position: -29px -82px;
}
.contactBox > li.sex::before {
  background-position: -29px -108px;
}
.contactBox > li.position::before {
  background-position: -29px -134px;
}
.contactBox > li.telephone::before {
  background-position: -29px -160px;
}
.contactBox > li.email::before {
  background-position: -29px -186px;
}
.contactBox > li.region::before {
  background-position: -57px -4px;
}
.contactBox > li.rCode::before {
  background-position: -57px -30px;
}
.contactBox > li.add::before {
  background-position: -57px -56px;
}
.contactBox > li.remark::before {
  background-position: -57px -82px;
}
.contactBox > .top > span {
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4680f4;
  color: #fff;
  font-size: 18px;
  line-height: 60px;
}
.contactBox > .top > i {
  display: block;
  margin: 0 auto;
  position: absolute;
  width: 30px;
  height: 30px;
  background: url("../../assets/images/loginIcon.png") no-repeat;
  top: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}
.contactBox > .top > i:hover {
  opacity: 1;
}
.contactBox > .top > i.del {
  background-position: -54px -105px;
}
.contactBox > .top > i.edit {
  background-position: -54px -131px;
}
.contactBox > .top > i.ok {
  background-position: -54px -157px;
}
.contactBox > .top > i:nth-last-child(2) {
  right: 35px;
}
.contactBox > .top > i:nth-last-child(1) {
  right: 0;
}
.contactBox > li:not(.top) > div.contactCon.input {
  line-height: 36px;
  padding: 0 40px;
  overflow: hidden;
}
.contactBox > li:not(.top) > div.contactCon.input.countLarge {
  padding: 0 16px 0 40px;
}
.contactBox > li:not(.top) > div.contactCon.input.textarea {
  position: relative;
  padding-right: 0;
}
.contactBox i.must {
  margin-left: 0;
  position: absolute;
  font-size: 12px;
  top: 4px;
  z-index: 1;
}
.contactBox u.error {
  position: absolute;
  white-space: nowrap;
  top: 100%;
  right: -4px;
  z-index: 111;
  background-color: #fff3f3;
  padding: 10px 15px;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  border-radius: 4px;
  margin-top: 6px;
}
.contactBox u.error::before,
.contactBox u.error::after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  right: 13px;
}
.contactBox u.error::before {
  border-bottom: 4px solid #f56c6c;
  top: -5px;
}
.contactBox u.error::after {
  border-bottom: 4px solid #fff3f3;
  top: -4px;
}
.contactBox li::after {
  content: "";
  position: absolute;
  display: block;
  right: 1px;
  top: 4px;
  height: 30px;
  width: 29px;
  background: #fff3f3 url("../../assets/images/loginIcon.png") 2px -87px no-repeat;
  transition: opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    zIndex 0s linear 0.2s;
  z-index: -1;
  opacity: 0;
}
.contactBox li.errorBorder::after {
  z-index: 1;
  opacity: 1;
  transition: opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    zIndex 0s linear 0s;
}
.supplierReview > span::after {
  width: 75px;
}
/* 表格 */
.formMainCont .tableBox {
  padding-top: 22px;
}
.formMainCont .tableBox > li {
  display: inline-block;
  width: 49%;
  vertical-align: top;
}
.formMainCont .tableBox > li.maxTable {
  display: block;
  width: 100%;
}
.formMainCont .tableBox > li:nth-child(1) {
  margin: 0 1.6% 0 0.2%;
}
.formMainCont.SupplieReview .formUl {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.formMainCont.SupplieReview .formUl li {
  width: 33%;
}
.formMainCont.SupplieReview .formUl li .formTitle {
  width: 155px;
}
.formMainCont.SupplieReview .formUl li:nth-child(1) .formTitle,
.formMainCont.SupplieReview .formUl li:nth-child(4) .formTitle {
  width: 195px;
}

.formMainCont.SupplieReview .formUl li .el-select {
  width: calc(80% - 158px) !important;
}
.formMainCont.SupplieReview
  .formUl
  li
  .el-select
  /deep/
  .el-input__suffix
  .el-input__icon {
  line-height: 32px;
}
.formMainCont.SupplieReview
  .formUl
  li
  .el-select
  /deep/
  .el-input__suffix
  .el-input__icon::before {
  content: "";
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #95a0bd;
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.formMainCont .remark {
  margin-top: -32px;
  margin-bottom: 32px;
}
.formMainCont .remark .formTitle {
  width: 120px;
  height: 32px;
  line-height: 1.5;
  margin-left: -20px;
  padding-right: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: right;
  color: #484b5c;
  white-space: nowrap;
  font-size: 14px;
  vertical-align: top;
  display: inline-block;
}
.formMainCont .remark .remarkInt {
  width: calc(90% - 137px);
  height: 80px;
  text-align: left;
}
.formMainCont .remark .input {
  text-align: left;
}
.formMainCont .remark .checkRemark {
  font-size: 14px;
  display: inline-block;
  width: calc(100% - 120px);
  line-height: 1.5;
}
.formMainCont .qualificationFile {
  margin-left: 10px;
}
.marginY {
  margin: 20px 0;
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
.contactBox > li:not(.top) > .contactCon,
.contactBox > li:not(.top) > .contactCon input,
.contactBox > li:not(.top) > .contactCon .el-input__inner {
  width: 100%;
  height: 38px;
  text-align: center;
  color: #484b5c;
}
.contactBox > li:not(.top) > .contactCon.newRegin > .reginResult > div {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}
.contactBox > li:not(.top) > input.contactCon,
.contactBox > li:not(.top) > .contactCon.newRegin > .reginResult > i,
.contactBox > li:not(.top) > .contactCon input {
  line-height: 36px;
}
.contactBox > li:not(.top) > .contactCon.emptyDiv {
  color: #c0c4cc;
}
.contactBox > li:not(.top) > input.contactCon,
.contactBox > li:not(.top) > .contactCon.newRegin > .reginResult,
.contactBox > li:not(.top) > .contactCon input {
  padding: 0 40px;
}
.contactBox > li:not(.top) > textarea.contactCon,
.contactBox > li:not(.top) > div.contactCon.input.textarea {
  height: 76px;
  line-height: 20px;
  padding: 7px 40px;
}
.contactBox > li:not(.top) > .contactCon .el-input__icon {
  font-size: 18px;
  line-height: 38px;
}
.contactBox
  > li:not(.top)
  > .contactCon.newRegin
  > .reginResult
  .el-input__icon {
  line-height: 44px;
}
.contactBox > li:not(.top) > div.contactCon.input.textarea > div {
  width: 242px;
  padding-right: 40px;
  height: 60px;
}
.contactBox
  > li:not(.top)
  > div.contactCon.input.textarea
  > div
  .el-scrollbar.unitScrollbar {
  width: 242px;
  height: 60px;
  position: unset;
}
.contactBox > li:not(.top) > div.contactCon.input.textarea.countLarge > div {
  width: 266px;
  padding: 7px 16px 7px 0;
}
.contactBox
  > li:not(.top)
  > div.contactCon.input.textarea.countLarge
  > div
  .el-scrollbar.unitScrollbar {
  width: 266px;
}
.supplierForm .textEllipse3 {
  height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
</style>
