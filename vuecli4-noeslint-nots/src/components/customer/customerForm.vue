<template>
  <div class="fillBox changeFormW">
    <div class="boxTitle titleFix">
      <i class="customer_icon"></i>
      <span>
        {{ edit ? "编辑客户信息" : customerId ? "查看客户信息" : "新建客户" }}
      </span>
      <unit-btn
        type="plain right"
        :text="!customerId || (customerId && edit) ? '取消' : '返回'"
        @click="cancel"
      ></unit-btn>
      <unit-btn
        type="right"
        :loading="loading"
        :text="btnTxt[$route.name] ? btnTxt[$route.name] : '创建'"
        @click="submit"
        v-if="!customerId || (customerId && edit)"
      ></unit-btn>
    </div>
    <div class="contentFix customerForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formPage">
            <div class="formMainTitle">
              <span>基本信息</span>
            </div>
            <div class="formMainCont">
              <ul class="formUl">
                <li
                  v-if="customerId && !edit"
                  :class="{ small: true, resultView: true }"
                >
                  <span class="formTitle">销售：</span>
                  <div>{{ result.ownerName }}</div>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'customerName',
                    resultView: customerId && !edit,
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!customerId || (customerId && edit)"
                      >*</i
                    >客户名称：
                  </span>
                  <div v-if="customerId && !edit">
                    {{ result.customerName }}
                  </div>
                  <input
                    v-if="!customerId || (customerId && edit)"
                    type="text"
                    v-model="result.customerName"
                    maxlength="30"
                    @input="clearErr('customerName')"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'customerName'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'customerType',
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!customerId || (customerId && edit)"
                      >*</i
                    >客户分类：
                  </span>
                  <div v-if="customerId && !edit">
                    {{ result.customerTypeTxt }}
                  </div>
                  <unit-dropdown
                    v-if="!customerId || (customerId && edit)"
                    id="customerType"
                    :list="cusType"
                    @change="dropdownReturn"
                    :result="result.customerType"
                  ></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'customerType'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'region',
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!customerId || (customerId && edit)"
                      >*</i
                    >省份/城市：
                  </span>
                  <div v-if="customerId && !edit">
                    {{
                      result.provinceName && result.cityName
                        ? result.provinceName + " / " + result.cityName
                        : ""
                    }}
                  </div>
                  <!-- <div class="input" v-if="customerId&&edit&&(!result.province||!result.city)"></div> -->
                  <unit-region
                    :must="true"
                    id="region"
                    @change="dropdownReturn"
                    :result="
                      result.province && result.city
                        ? [result.province, result.city]
                        : []
                    "
                    v-if="!customerId || (customerId && edit)"
                  ></unit-region>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'region'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'legalPerson',
                  }"
                >
                  <span class="formTitle">法定代表人：</span>
                  <div v-if="customerId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.legalPerson)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!customerId || (customerId && edit)"
                    type="text"
                    v-model="result.legalPerson"
                    maxlength="20"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'legalPerson'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
              </ul>
              <ul class="formUl">
                <li
                  v-if="customerId && !edit"
                  :class="{ small: true, resultView: true }"
                >
                  <span class="formTitle">子公司：</span>
                  <div>{{ result.branchCompanyName | emptyTxt }}</div>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'telephone_',
                  }"
                >
                  <span class="formTitle">电话：</span>
                  <div v-if="customerId && !edit">
                    {{ result.telephone | emptyTxt }}
                  </div>
                  <input
                    v-if="!customerId || (customerId && edit)"
                    type="text"
                    v-model="result.telephone"
                    maxlength="20"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'telephone_'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'companyType',
                  }"
                >
                  <span class="formTitle">公司类型：</span>
                  <div v-if="customerId && !edit">
                    {{ result.companyTypeTxt | emptyTxt }}
                  </div>
                  <unit-dropdown
                    v-if="!customerId || (customerId && edit)"
                    id="companyType"
                    :list="compType"
                    @change="dropdownReturn"
                    :result="result.companyType"
                  ></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'companyType'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'industry',
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!customerId || (customerId && edit)"
                      >*</i
                    >行业：
                  </span>
                  <div v-if="customerId && !edit">
                    {{ result.industryTxt | emptyTxt }}
                  </div>
                  <unit-dropdown
                    v-if="!customerId || (customerId && edit)"
                    id="industry"
                    :list="industry"
                    @change="dropdownReturn"
                    :result="result.industry"
                  ></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'industry'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'establishDate',
                  }"
                >
                  <span class="formTitle">成立日期：</span>
                  <div v-if="customerId && !edit">
                    {{ result.establishDate | emptyTxt }}
                  </div>
                  <unit-time
                    v-if="!customerId || (customerId && edit)"
                    placeholder
                    :value="result.establishDate"
                    id="establishDate"
                    @return="dropdownReturn"
                  ></unit-time>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'establishDate'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
              </ul>
              <ul class="formUl">
                <li
                  v-if="customerId && !edit"
                  :class="{ small: true, resultView: true }"
                >
                  <span class="formTitle">所属部门</span>
                  <div>{{ result.depName | emptyTxt }}</div>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'businessScope',
                  }"
                >
                  <span class="formTitle">经营范围：</span>
                  <div v-if="customerId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.businessScope)"
                      :lines="3"
                    ></unit-popover>
                  </div>
                  <textarea
                    v-if="!customerId || (customerId && edit)"
                    class="input"
                    v-model="result.businessScope"
                    maxlength="500"
                  ></textarea>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'businessScope'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'workAddress',
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!customerId || (customerId && edit)"
                      >*</i
                    >办公地址：
                  </span>
                  <div v-if="customerId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.workAddress)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!customerId || (customerId && edit)"
                    type="text"
                    v-model="result.workAddress"
                    maxlength="100"
                    @input="clearErr('workAddress')"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'workAddress'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: customerId && !edit,
                    errorBorder: error.key === 'registerAddress',
                  }"
                >
                  <span class="formTitle">工商注册地址：</span>
                  <div v-if="customerId && !edit">
                    <unit-popover
                      :content="emptyTxt(result.registerAddress)"
                    ></unit-popover>
                  </div>
                  <input
                    v-if="!customerId || (customerId && edit)"
                    type="text"
                    v-model="result.registerAddress"
                    maxlength="100"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'registerAddress'">
                      {{ error.msg }}
                    </u>
                  </transition>
                </li>
              </ul>
            </div>
            <unit-tab
              class="formMainTitle"
              :tab="tab"
              @click="returnBtn"
            ></unit-tab>
            <div class="formMainCont contactList" v-show="tab.choose === 1">
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
                      v-if="!customerId || (customerId && !item.contactId)"
                    ></i>
                    <i
                      class="edit"
                      title="编辑"
                      @click="contactBtn('edit', i)"
                      v-if="customerId && editContact !== i"
                    ></i>
                    <i
                      class="ok"
                      title="确定"
                      @click="contactBtn('submit', item, i)"
                      v-if="customerId && editContact === i"
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
                      v-if="customerId && editContact !== i"
                    >
                      {{ item.contactName ? item.contactName : "姓名" }}
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <input
                      v-if="!customerId || editContact === i"
                      v-model="item.contactName"
                      class="contactCon"
                      placeholder="姓名"
                      type="text"
                      maxlength="20"
                      @input="clearErr('contactName')"
                    />
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="
                          error.contact === i && error.key === 'contactName'
                        "
                        >{{ error.msg }}</u
                      >
                    </transition>
                  </li>
                  <li class="birth">
                    <div
                      class="contactCon input"
                      :class="{ emptyDiv: !item.birthday }"
                      v-if="customerId && editContact !== i"
                    >
                      {{ item.birthday ? item.birthday : "出生日期" }}
                    </div>
                    <unit-time
                      v-if="!customerId || editContact === i"
                      class="contactCon"
                      placeholder="出生日期"
                      :value="item.birthday"
                      :editable="false"
                      id="birthday"
                      @return="dropdownReturn"
                    ></unit-time>
                  </li>
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
                      v-if="customerId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.department ? item.department : '部门'"
                      ></unit-popover>
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <input
                      :style="{
                        paddingRight:
                          item.department &&
                          item.department.toString().length > 17
                            ? '16px'
                            : '',
                      }"
                      v-if="!customerId || editContact === i"
                      v-model="item.department"
                      class="contactCon"
                      placeholder="部门"
                      type="text"
                      maxlength="30"
                      @input="clearErr('department')"
                    />
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="error.contact === i && error.key === 'department'"
                        >{{ error.msg }}</u
                      >
                    </transition>
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
                      v-if="customerId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.position ? item.position : '职务'"
                      ></unit-popover>
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <input
                      :style="{
                        paddingRight:
                          item.position && item.position.toString().length > 4
                            ? '16px'
                            : '',
                      }"
                      v-if="!customerId || editContact === i"
                      v-model="item.position"
                      class="contactCon"
                      placeholder="职务"
                      type="text"
                      maxlength="30"
                      @input="clearErr('position')"
                    />
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="error.contact === i && error.key === 'position'"
                        >{{ error.msg }}</u
                      >
                    </transition>
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
                      v-if="customerId && editContact !== i"
                    >
                      {{
                        item.sex === "1"
                          ? "男"
                          : item.sex === "2"
                          ? "女"
                          : "性别"
                      }}
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <unit-dropdown
                      v-if="!customerId || editContact === i"
                      class="contactCon auto"
                      placeholder="性别"
                      :result="item.sex"
                      id="sex"
                      :list="sex"
                      align="center"
                      @change="dropdownReturn"
                    ></unit-dropdown>
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="error.contact === i && error.key === 'sex'"
                        >{{ error.msg }}</u
                      >
                    </transition>
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
                      v-if="customerId && editContact !== i"
                    >
                      <unit-popover
                        :content="item.telephone ? item.telephone : '电话'"
                      ></unit-popover>
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <input
                      :style="{
                        paddingRight:
                          item.telephone && item.telephone.toString().length > 7
                            ? '16px'
                            : '',
                      }"
                      v-if="!customerId || editContact === i"
                      v-model="item.telephone"
                      class="contactCon"
                      placeholder="电话"
                      type="text"
                      maxlength="20"
                      @input="clearErr('telephone', item)"
                    />
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="error.contact === i && error.key === 'telephone'"
                        >{{ error.msg }}</u
                      >
                    </transition>
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
                      v-if="customerId && editContact !== i"
                    >
                      {{
                        item.mobilePhoneNumber ? item.mobilePhoneNumber : "手机"
                      }}
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
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
                      v-if="!customerId || editContact === i"
                      v-model="item.mobilePhoneNumber"
                      class="contactCon"
                      placeholder="手机"
                      type="text"
                      maxlength="11"
                      @input="clearErr('mobilePhoneNumber', item)"
                    />
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="
                          error.contact === i &&
                          error.key === 'mobilePhoneNumber'
                        "
                        >{{ error.msg }}</u
                      >
                    </transition>
                  </li>
                  <li class="email">
                    <div
                      class="contactCon input"
                      :class="{ emptyDiv: !item.email }"
                      v-if="customerId && editContact !== i"
                    >
                      {{ item.email ? item.email : "邮箱" }}
                    </div>
                    <input
                      v-if="!customerId || editContact === i"
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
                      v-if="customerId && editContact !== i"
                    >
                      {{
                        item.provinceName && item.cityName
                          ? item.provinceName + " / " + item.cityName
                          : "省份/城市"
                      }}
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <unit-region
                      v-if="!customerId || editContact === i"
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
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="error.contact === i && error.key === 'region1'"
                        >{{ error.msg }}</u
                      >
                    </transition>
                  </li>
                  <!-- <li class="rCode">
                                        <div class="contactCon input" :class="{'emptyDiv':!item.postcode}" v-if="customerId&&editContact!==i">{{item.postcode?item.postcode:'邮政编码'}}</div>
                                        <input v-if="!customerId||editContact===i" v-model="item.postcode" class="contactCon" type="text" placeholder="邮政编码">
                  </li>-->
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
                      v-if="customerId && editContact !== i"
                    >
                      <unit-popover
                        :content="
                          item.workAddress ? item.workAddress : '办公地址'
                        "
                      ></unit-popover>
                    </div>
                    <i class="must" v-if="!customerId || editContact === i"
                      >*</i
                    >
                    <input
                      @input="clearErr('workAddress1')"
                      v-if="!customerId || editContact === i"
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
                    <transition name="publicTransition">
                      <u
                        class="error"
                        v-if="
                          error.contact === i && error.key === 'workAddress1'
                        "
                        >{{ error.msg }}</u
                      >
                    </transition>
                  </li>
                  <li class="remark">
                    <div
                      class="contactCon input textarea"
                      v-if="customerId && editContact !== i"
                      :class="{
                        emptyDiv: !item.remark,
                        countLarge:
                          item.remark && item.remark.toString().length > 17,
                      }"
                    >
                      <div>
                        <el-scrollbar class="unitScrollbar">
                          {{ item.remark ? item.remark : "备注" }}
                        </el-scrollbar>
                      </div>
                    </div>
                    <textarea
                      v-if="!customerId || editContact === i"
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
                  v-if="customerId || userInfo.isAdmin"
                ></unit-btn>
                <div
                  class="empty"
                  v-if="
                    customerId &&
                    owner &&
                    owner !== userInfo.staffId &&
                    contactList.length === 0
                  "
                >
                  暂无联系人
                </div>
              </div>
            </div>
            <div
              class="formMainCont contactList boxTable"
              v-show="tab.choose === 2"
              v-if="
                $route.name === 'customerView' &&
                judgeBtn.visitrecord &&
                tab.list.length > 1
              "
            >
              <unit-loading :loading="loading1" v-if="loading1"></unit-loading>
              <unit-table
                :total="total"
                :limit="6"
                :page="page"
                v-if="!loading1 || list.length > 0"
                :list="list"
                :title="userInfo.isCharge || userInfo.isAdmin ? title1 : title"
                :operation="[{ key: 'view', show: judgeShow }]"
                @click="tableOper"
              ></unit-table>
              <unit-page
                :total="total"
                :limit="6"
                :page="page"
                @pagechange="getList"
              ></unit-page>
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
import unitTab from "@/unit/components/tab";
import unitTable from "@/unit/components/element/table";
export default {
  name: "customerForm",
  props: ["dom"],
  components: { unitRegion, unitTime, unitPopover, unitTab, unitTable },
  data() {
    return {
      customerId: null,
      edit: false,
      owner: false,
      result: {
        customerName: "",
        customerType: "",
        province: "",
        city: "",
        legalPerson: "",
        telephone: "",
        companyType: "",
        industry: "",
        establishDate: "",
        businessScope: "",
        workAddress: "",
        registerAddress: "",
        provinceName: "",
        cityName: "",
        branchCompanyName: "",
        depName: "",
      },
      contactList: [],
      baseContact: {
        contactName: "",
        sex: "",
        birthday: "",
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
      cusType: [],
      compType: [],
      industry: [],
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
        customerAdd: "创建",
        customerEdit: "保存",
      },
      tab: {
        list: [{ id: 1, name: "联系人" }],
        choose: 1,
      },
      title: [
        { key: "dateTime_", name: "拜访时间", width: 18 },
        { key: "projName", name: "项目名称", width: 20 },
        { key: "contactName", name: "拜访对象", width: 14 },
        { key: "visitTypeTxt", name: "拜访方式", width: 14 },
        { key: "description", name: "拜访情况说明", width: 32 },
      ],
      title1: [
        { key: "dateTime_", name: "拜访时间", width: 16 },
        { key: "projName", name: "项目名称", width: 20 },
        { key: "contactName", name: "拜访对象", width: 11 },
        { key: "visitTypeTxt", name: "拜访方式", width: 11 },
        { key: "creatorName", name: "销售", width: 12 },
        { key: "description", name: "拜访情况说明", width: 30 },
      ],
      list: [],
      loading1: true,
      total: 0,
      page: 1,
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
      let isAdmin =
        userInfo.info &&
        userInfo.info.staff &&
        userInfo.info.staff.isAdmin === "1";
      return { isCharge, staffId, isAdmin };
    },
    judgeBtn() {
      return {
        customerAdd: this.$pubfunc.judgeBtn("customer:add"),
        customerUpdate: this.$pubfunc.judgeBtn("customer:update"),
        customerView: this.$pubfunc.judgeBtn("customer:view"),
        visitrecord: this.$pubfunc.judgeBtn("visitrecord"),
      };
    },
  },
  methods: {
    emptyTxt(v) {
      return v ? v : "--";
    },
    judgeShow(item, i, key) {
      return true;
    },
    getDropData() {
      this.customerId && !this.edit
        ? null
        : (this.$api.public.dict(
            { codeGroup: "customer_type", pCode: "" },
            (res) => {
              // console.log(res)
              switch (res.code) {
                case "0":
                  this.cusType = res.data ? res.data : [];
                  break;
              }
            }
          ),
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
          this.$api.public.dict({ codeGroup: "industry", pCode: "" }, (res) => {
            // console.log(res)
            switch (res.code) {
              case "0":
                this.industry = res.data ? res.data : [];
                break;
            }
          }));
      if (this.customerId) {
        this.$api.service.customer.detail(
          { customerId: this.customerId },
          (res) => {
            switch (res.code) {
              case "0":
                if (this.edit) {
                  for (let k in this.result) {
                    this.result[k] = res.data[k];
                  }
                } else {
                  for (let k in res.data) {
                    this.result[k] = res.data[k];
                  }
                }
                this.owner = res.data.owner;
                // console.log(this.result)
                break;
              default:
                this.cancel();
            }
          }
        );
        this.$api.service.contact.customerList(
          { customerId: this.customerId },
          (res) => {
            switch (res.code) {
              case "0":
                let list = [];
                (res.data.list ? res.data.list : []).map((v) => {
                  if (
                    v.owner === this.userInfo.staffId ||
                    this.userInfo.isCharge ||
                    this.userInfo.isAdmin
                  ) {
                    list.push(v);
                  } else if (v.shareStaffList) {
                    var a = [];
                    v.shareStaffList.map((item) => {
                      a.push(item.staffId);
                    });
                    a.indexOf(this.userInfo.staffId) > -1 ? list.push(v) : null;
                  }
                });
                this.contactList = list;
                break;
              default:
                this.cancel();
            }
          }
        );
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case "customerType":
          this.result.customerType = res.value;
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
        case "industry":
          this.result.industry = res.value;
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
            if (!this.customerId) {
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
                text: "您是否保存正在修改的联系人信息？",
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
          if (!this.$pubfunc.replaceSpace(json.department, 1)) {
            return this.setErr("department", "请输入联系人所在部门", index);
          }
          if (!this.$pubfunc.replaceSpace(json.position, 1)) {
            return this.setErr("position", "请输入联系人职务", index);
          }
          if (!json.sex) {
            return this.setErr("sex", "请选择联系人性别", index);
          }
          if (!this.$pubfunc.replaceSpace(json.telephone, 1)) {
            return this.setErr("telephone", "请输入联系人电话号码", index);
          }
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
              "birthday",
              "workAddress",
            ]; //,"postcode"
          for (let k in submitKeys) {
            param[submitKeys[k]] = json[submitKeys[k]];
          }
          if (json.contactId) {
            param.contactId = json.contactId;
          }
          if (json.orgId) {
            param.orgId = json.orgId;
          }
          if (this.customerId && !this.edit) {
            let url = json.contactId ? "customerUpdate" : "customerAdd";
            if (!json.orgId) {
              param.orgId = this.customerId;
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
                text: "注意：联系人信息的更改需要跟随客户信息一起提交",
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
    returnBtn(type, k) {
      switch (type) {
        case "tab":
          this.tab.choose = k;
          k === 2 ? this.getList(1) : null;
          break;
      }
    },
    tableOper(key, item) {
      console.log(key, item);
      switch (key) {
        case "view":
          item.recordId
            ? this.$emit("dialog", {
                show: true,
                link: "showVisit",
                small: true,
                title: "查看拜访记录",
                data: item,
              })
            : null;
          break;
      }
    },
    getList(page) {
      this.page = page;
      let param = {
        customerId: this.customerId,
      };
      param.limit = 6;
      param.page = page;
      console.log(param);
      if (!this.userInfo.isCharge) {
        delete param.staffName;
      }
      this.loading1 = true;
      this.$api.service.visit.recordList(param, (res) => {
        console.log(res);
        this.loading1 = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              v.dateTime_ =
                this.$pubfunc.TimeTransform("YYYY年MM月DD日", v.date) +
                " " +
                this.$pubfunc.transTime(v.time);
            });
            this.list = list;
            break;
        }
      });
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
    submit() {
      if (this.loading) {
        return;
      }
      this.clearErr();
      if (!this.$pubfunc.replaceSpace(this.result.customerName, 1)) {
        return this.setErr("customerName", "请输入客户名称", null);
      }
      if (!this.result.customerType) {
        return this.setErr("customerType", "请选择客户分类", null);
      }
      if (!this.result.province || !this.result.city) {
        return this.setErr("region", "请选择省份", null);
      }
      if (!this.result.industry) {
        return this.setErr("industry", "请选择行业", null);
      }
      if (!this.$pubfunc.replaceSpace(this.result.workAddress, 1)) {
        return this.setErr("workAddress", "请输入办公地址", null);
      }
      let param = {
        customerName: this.result.customerName,
        customerType: this.result.customerType,
        province: this.result.province,
        city: this.result.city,
        legalPerson: this.result.legalPerson,
        telephone: this.result.telephone,
        companyType: this.result.companyType,
        industry: this.result.industry,
        establishDate: this.result.establishDate,
        businessScope: this.result.businessScope,
        workAddress: this.result.workAddress,
        registerAddress: this.result.registerAddress,
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
      let url = "add";
      if (this.edit) {
        url = "update";
        param.customerId = this.customerId;
      }
      // return
      this.loading = true;
      this.$api.service.customer[url](param, (res) => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.$store.commit("alertFn", {
              type: "success",
              text: this.edit ? "保存成功" : "新建成功",
              func: () => {
                if (this.$route.params.data) {
                  let edit = this.$route.params.data.edit;
                  if (this.$route.params.data.recordId) {
                    var recordId = this.$pubfunc.encode(
                      this.$route.params.data.recordId
                    );
                  }
                  if (this.$route.params.data.planId) {
                    var planId = this.$pubfunc.encode(
                      this.$route.params.data.planId
                    );
                  }
                  this.$router.push({
                    name:
                      this.$route.params.data.meta == "record"
                        ? edit
                          ? "visitrecordEdit"
                          : "visitrecordAdd"
                        : edit
                        ? "visitplanEdit"
                        : "visitplanAdd",
                    params: {
                      data: {
                        result: param,
                        recordId: recordId,
                        planId: planId,
                      },
                    },
                  });
                } else {
                  this.cancel();
                }
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
      if (this.$route.params.data) {
        let edit = this.$route.params.data.edit;
        if (this.$route.params.data.recordId) {
          var recordId = this.$pubfunc.encode(this.$route.params.data.recordId);
        }
        if (this.$route.params.data.planId) {
          var planId = this.$pubfunc.encode(this.$route.params.data.planId);
        }
        this.$router.push({
          name:
            this.$route.params.data.meta == "record"
              ? edit
                ? "visitrecordEdit"
                : "visitrecordAdd"
              : edit
              ? "visitplanEdit"
              : "visitplanAdd",
          params: {
            data: { recordId: recordId, planId: planId },
          },
        });
      } else {
        this.$router.push({
          name:
            this.$route.name === "contactCustomerAdd" ? "contact" : "customer",
        });
      }
    },
  },
  created() {
    switch (this.$route.name) {
      case "customerEdit":
        if (!this.judgeBtn.customerUpdate) {
          this.cancel();
          return;
        }
        this.edit = true;
        this.tell = true;
      case "customerView":
        // if(!this.edit&&!this.judgeBtn.customerView){
        //     this.cancel();
        //     return
        // }
        let customerId;
        try {
          customerId = this.$pubfunc.decode(this.$route.params.customerId);
        } catch (error) {
          this.cancel();
          return;
        }
        this.customerId = customerId;
        this.$route.name === "customerView" && this.judgeBtn.visitrecord
          ? this.tab.list.push({ id: 2, name: "拜访记录" })
          : null;
        break;
      default:
        if (!this.judgeBtn.customerAdd) {
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
.formUl > li > textarea {
  width: 230px;
  height: 82px;
}
.contactList {
  overflow: hidden;
}
.contactList:not(.boxTable) > div {
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
.customerForm ul.formMainTitle {
  padding: 0;
}
.fillBox .boxTable {
  position: relative;
  height: 400px;
  margin-top: 20px;
}
</style>
<style>
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
.customerForm .textEllipse3 {
  height: 54px;
  line-height: 18px;
  margin: -1px 0 -3px;
  box-sizing: content-box;
}
.customerForm ul.formMainTitle > li {
  padding: 6px 6px 6px 0;
  min-width: auto;
  color: #444444;
}
.customerForm ul.formMainTitle > li:nth-child(1) {
  margin-left: 0;
}
.customerForm ul.formMainTitle > li:hover {
  color: #777777;
}
.customerForm ul.formMainTitle > li.checked {
  color: #444444;
}
.customerForm ul.formMainTitle > li::before {
  background-color: #4680f4;
  bottom: -1px;
}
.customerForm .el-table__fixed-right::before {
  opacity: 0;
}
.customerForm .el-pagination {
  bottom: 0;
}
</style>
