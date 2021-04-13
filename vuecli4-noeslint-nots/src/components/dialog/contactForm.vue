<template>
  <div>
    <ul class="formUl contactFormDialog">
      <li
        v-if="data.key === 'view' && result.contactType === '1'"
        class="small"
      >
        <span class="formTitle">销售：</span>
        <div class="contactCon">{{ result.ownerName | emptyTxt }}</div>
      </li>
      <li
        v-if="data.key === 'view' && result.contactType === '1'"
        class="small"
      >
        <span class="formTitle">子公司：</span>
        <div class="contactCon">{{ result.branchCompanyName | emptyTxt }}</div>
      </li>
      <li
        v-if="data.key === 'view' && result.contactType === '1'"
        class="small"
      >
        <span class="formTitle">所属部门：</span>
        <div class="contactCon">{{ result.depName | emptyTxt }}</div>
      </li>
      <li
        class="org"
        :class="{
          small: data.key !== 'customerAdd' && data.key !== 'supplierAdd',
          errorBorder: error.key === 'orgId',
        }"
      >
        <span class="formTitle">
          <i
            class="must"
            v-if="data.key === 'customerAdd' || data.key === 'supplierAdd'"
            >*</i
          >
          {{ name[data.type] }}：
        </span>
        <div
          class="contactCon"
          v-if="data.key !== 'customerAdd' && data.key !== 'supplierAdd'"
        >
          {{ result.orgName | emptyTxt }}
        </div>
        <unit-customer
          v-if="data.key === 'customerAdd'"
          id="orgId"
          class="contactCon auto"
          placeholder
          @change="dropdownReturn"
          :input="true"
          :result="result.orgId"
        ></unit-customer>
        <unit-supplier
          v-if="data.key === 'supplierAdd'"
          id="orgId"
          class="contactCon auto"
          placeholder
          @change="dropdownReturn"
          :input="true"
        ></unit-supplier>
        <i
          v-if="data.key === 'customerAdd' || data.key === 'supplierAdd'"
          class="addBtn el-icon-circle-plus-outline AbleClick"
          @click="jumpAdd"
        ></i>
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'orgId'">{{ error.msg }}</u>
        </transition>
      </li>
      <li
        class="name"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'contactName',
        }"
      >
        <span class="formTitle">
          <i class="must" v-if="data.key !== 'view'">*</i>姓名：
        </span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{ result.contactName | emptyTxt }}
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.contactName"
          class="contactCon"
          placeholder
          type="text"
          maxlength="20"
          @input="clearErr('contactName')"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'contactName'">{{
            error.msg
          }}</u>
        </transition>
      </li>
      <li
        class="birth"
        :class="{ small: data.key === 'view' }"
        v-if="data.type === 'customer'"
      >
        <span class="formTitle">出生日期：</span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{ result.birthday | emptyTxt }}
        </div>
        <unit-time
          v-if="data.key !== 'view'"
          class="contactCon"
          placeholder
          :value="result.birthday"
          :editable="false"
          id="birthday"
          @return="dropdownReturn"
        ></unit-time>
      </li>
      <li
        class="depart"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'department',
        }"
      >
        <span class="formTitle"> 部门： </span>
        <div class="contactCon" v-if="data.key === 'view'">
          <unit-popover :content="emptyTxt(result.department)"></unit-popover>
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.department"
          class="contactCon"
          placeholder
          type="text"
          maxlength="30"
          @input="clearErr('department')"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'department'">{{ error.msg }}</u>
        </transition>
      </li>
      <li
        class="position"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'position',
        }"
      >
        <span class="formTitle"> 职务： </span>
        <div class="contactCon" v-if="data.key === 'view'">
          <unit-popover :content="emptyTxt(result.position)"></unit-popover>
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.position"
          class="contactCon"
          placeholder
          type="text"
          maxlength="30"
          @input="clearErr('position')"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'position'">{{ error.msg }}</u>
        </transition>
      </li>
      <li
        class="radioBox small"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'sex',
        }"
      >
        <span class="formTitle"> 性别： </span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{
            (result.sex === "1" ? "男" : result.sex === "2" ? "女" : "")
              | emptyTxt
          }}
        </div>
        <el-radio
          class="sexRadio"
          v-if="data.key !== 'view'"
          v-model="result.sex"
          label="1"
          >男</el-radio
        >
        <el-radio
          class="sexRadio"
          v-if="data.key !== 'view'"
          v-model="result.sex"
          label="2"
          >女</el-radio
        >
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'sex'">{{ error.msg }}</u>
        </transition>
      </li>
      <li
        class="telephone"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'telephone',
        }"
      >
        <span class="formTitle"> 电话： </span>
        <div class="contactCon" v-if="data.key === 'view'">
          <unit-popover :content="emptyTxt(result.telephone)"></unit-popover>
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.telephone"
          class="contactCon"
          placeholder
          type="text"
          maxlength="20"
          @input="clearErr('telephone', result)"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'telephone'">{{ error.msg }}</u>
        </transition>
      </li>
      <li
        class="phone"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'mobilePhoneNumber',
        }"
      >
        <span class="formTitle">
          <i class="must" v-if="data.key !== 'view'">*</i>手机：
        </span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{ result.mobilePhoneNumber | emptyTxt }}
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.mobilePhoneNumber"
          class="contactCon"
          placeholder
          type="text"
          maxlength="11"
          @input="clearErr('mobilePhoneNumber', result)"
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'mobilePhoneNumber'">{{
            error.msg
          }}</u>
        </transition>
      </li>
      <li class="email" :class="{ small: data.key === 'view' }">
        <span class="formTitle">邮箱：</span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{ result.email | emptyTxt }}
        </div>
        <input
          v-if="data.key !== 'view'"
          v-model="result.email"
          class="contactCon"
          type="text"
          placeholder
        />
      </li>
      <li
        class="region"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'region',
        }"
      >
        <span class="formTitle">
          <i class="must" v-if="data.key !== 'view'">*</i>省份/城市：
        </span>
        <div class="contactCon" v-if="data.key === 'view'">
          {{
            (result.provinceName && result.cityName
              ? result.provinceName + " / " + result.cityName
              : "") | emptyTxt
          }}
        </div>
        <unit-region
          v-if="data.key !== 'view'"
          :result="
            result.province && result.city ? [result.province, result.city] : []
          "
          class="contactCon"
          placeholder
          :must="true"
          id="region"
          @change="dropdownReturn"
        ></unit-region>
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'region'">{{ error.msg }}</u>
        </transition>
      </li>
      <!-- <li class="rCode" :class="{'small':data.key==='view',}" v-if='data.type==="customer"'>
                <span class="formTitle">邮政编码：</span>
                <div class="contactCon" v-if="data.key==='view'">{{result.postcode|emptyTxt}}</div>
                <input v-if="data.key!=='view'" v-model="result.postcode" class="contactCon" type="text" placeholder="">
      </li>-->
      <li
        class="add"
        :class="{
          small: data.key === 'view',
          errorBorder: error.key === 'workAddress',
        }"
      >
        <span class="formTitle">
          <i class="must" v-if="data.key !== 'view'">*</i>办公地址：
        </span>
        <div class="contactCon" v-if="data.key === 'view'">
          <unit-popover :content="emptyTxt(result.workAddress)"></unit-popover>
        </div>
        <input
          @input="clearErr('workAddress')"
          v-if="data.key !== 'view'"
          v-model="result.workAddress"
          class="contactCon"
          type="text"
          maxlength="100"
          placeholder
        />
        <transition name="publicTransition">
          <u class="error" v-if="error.key === 'workAddress'">{{
            error.msg
          }}</u>
        </transition>
      </li>
      <li class="remark" :class="{ small: data.key === 'view' }">
        <span class="formTitle">备注：</span>
        <div class="contactCon textarea" v-if="data.key === 'view'">
          <unit-popover
            :content="emptyTxt(result.remark)"
            :lines="4"
          ></unit-popover>
        </div>
        <textarea
          v-if="data.key !== 'view'"
          v-model="result.remark"
          class="input contactCon"
          placeholder
          maxlength="100"
        ></textarea>
      </li>
      <li>
        <div class="btnBox">
          <unit-btn
            @click="submit"
            :loading="ajaxIng"
            :text="btnTxt[data.key] ? btnTxt[data.key] : '创建'"
          ></unit-btn>
          <unit-btn
            type="plain"
            @click="close"
            v-if="data.key !== 'view' && !$route.params.data"
            text="取消"
          ></unit-btn>
          <unit-btn
            type="plain"
            @click="skip"
            v-if="$route.params.data"
            text="取消"
          ></unit-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import unitCustomer from "@/unit/components/thisUnit/customer";
import unitSupplier from "@/unit/components/thisUnit/supplier";
import unitRegion from "@/unit/components/thisUnit/region";
import unitTime from "@/unit/components/element/timeBox";
import unitPopover from "@/unit/components/popover";
export default {
  name: "contactForm",
  props: ["data"],
  components: { unitCustomer, unitSupplier, unitRegion, unitTime, unitPopover },
  data() {
    return {
      ajaxIng: false,
      result: {
        contactId: null,
        orgId: "",
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
        orgName: "",
        provinceName: "",
        cityName: "",
        ownerName: "",
        contactType: "",
        branchCompanyName: "",
        depName: "",
      },
      sex: [
        { value: "1", label: "男" },
        { value: "2", label: "女" },
      ],
      error: {
        contact: null,
        key: null,
        msg: "",
      },
      name: {
        customer: "客户名称",
        supplier: "供应商名称",
      },
      btnTxt: {
        revise: "保存",
        view: "确定",
      },
    };
  },
  inject: ["close"],
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {};
    },
  },
  filters: {
    emptyTxt(v) {
      return v ? v : "--";
    },
  },
  watch: {
    "result.sex"() {
      this.clearErr("sex");
    },
  },
  methods: {
    jumpAdd() {
      this.close();
      let name = "contact";
      switch (this.data.type) {
        case "customer":
          name += "Customer";
          break;
        case "supplier":
          name += "Supplier";
          break;
        default:
          return;
      }
      name += "Add";
      this.$router.push({ name: name });
    },
    emptyTxt(v) {
      return v ? v : "--";
    },
    setErr(key, text) {
      this.$store.commit("alertFn", {
        type: "error",
        text:
          (this.data.key === "revise" ? "保存" : "新建") +
          "失败，请修改对应的错误内容",
        time: 2000,
      });
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
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case "orgId":
          this.result.orgId = res.value;
          let p = {};
          p[this.data.type + "Id"] = res.value;
          // this.$api.service[this.data.type].detail(p,res=>{
          //     switch(res.code){
          //         case '0':
          //             this.result.province=res.data.province;
          //             this.result.city=res.data.city;
          //             this.result.workAddress=res.data.workAddress;
          //             // console.log(this.result)
          //             break;
          //     }
          // })
          this.result.province = res.extend.province;
          this.result.city = res.extend.city;
          this.result.workAddress = res.extend.workAddress;
          break;
        case "region":
          this.result.province = res.ids[0];
          this.result.city = res.ids[1];
          break;
        case "birthday":
          this.result.birthday = this.$pubfunc.TimeTransform("YYYY/MM/DD", res);
          break;
      }
    },
    skip() {
      if (this.$route.params.data) {
        const edit = this.$route.params.data.edit;
        const data = this.$route.params.data.result;
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
            data: {
              result: this.result,
              recordId: recordId,
              planId: planId,
              data,
            },
          },
        });
      }
      this.$emit("close", { link: this.link, show: false });
      this.$route.params.data = "";
    },
    submit() {
      if (this.data.key === "view") {
        this.close();
        return;
      }
      if (this.ajaxIng) {
        return;
      }
      let json = this.result;
      if (!json.orgId) {
        return this.setErr("orgId", "请选择客户");
      }
      if (!this.$pubfunc.replaceSpace(json.contactName, 1)) {
        return this.setErr("contactName", "请输入联系人名称");
      }
      // if (!this.$pubfunc.replaceSpace(json.department, 1)) {
      //   return this.setErr('department', '请输入联系人所在部门');
      // }
      // if (!this.$pubfunc.replaceSpace(json.position, 1)) {
      //   return this.setErr('position', '请输入联系人职务');
      // }
      // if (!json.sex) {
      //   return this.setErr('sex', '请选择联系人性别');
      // }
      // if (!this.$pubfunc.replaceSpace(json.telephone, 1)) {
      //   return this.setErr('telephone', '请输入联系人电话号码');
      // }
      if (!this.$pubfunc.replaceSpace(json.mobilePhoneNumber, 1)) {
        return this.setErr("mobilePhoneNumber", "请输入联系人手机号码");
      }
      if (!json.province || !json.city) {
        return this.setErr("region", "请选择省份/城市");
      }
      if (!this.$pubfunc.replaceSpace(json.workAddress, 1)) {
        return this.setErr("workAddress", "请输入办公地址");
      }
      let param = {},
        KeyJson = {
          customer: [
            "orgId",
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
          ], //,"postcode"
          supplier: [
            "orgId",
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
          ],
        };
      let submitKeys = KeyJson[this.data.type];
      for (let k in submitKeys) {
        param[submitKeys[k]] = json[submitKeys[k]];
      }
      if (this.data.key === "revise") {
        param.contactId = json.contactId;
      }
      let url =
        this.data.type + (this.data.key === "revise" ? "Update" : "Add");
      this.ajaxIng = true;
      this.$api.service.contact[url](param, (res) => {
        // console.log(res)
        this.ajaxIng = false;
        switch (res.code) {
          case "0":
            this.$store.commit("alertFn", {
              type: "success",
              text: json.contactId ? "编辑成功" : "添加成功",
              func: () => {
                if (this.$route.params.data) {
                  const edit = this.$route.params.data.edit;
                  const data = this.$route.params.data.result;
                  this.result.contactId = res.data;
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
                        result: this.result,
                        recordId: recordId,
                        planId: planId,
                        data,
                      },
                    },
                  });
                }
                this.$emit("success");
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
  },
  mounted() {
    console.log(this.$route);
    if (this.$route.params.data) {
      var { result, param } = this.$route.params.data;
      this.result.orgId = result.customerId ? result.customerId : null;
      this.result.orgName = param.value;
      if (this.result.orgId) {
        this.$api.service.customer.detail(
          { customerId: this.result.orgId },
          (res) => {
            this.result.province = res.data.province;
            this.result.city = res.data.city;
            this.result.provinceName = res.data.provinceName;
            this.result.cityName = res.data.cityName;
            this.result.workAddress = res.data.workAddress;
          }
        );
      }
    }
    // console.log(this.$store.state.userInfo)
    if (
      !this.data ||
      !this.data.key ||
      !this.data.type ||
      ((this.data.key === "revise" || this.data.key === "view") &&
        !this.data.item)
    ) {
      this.close();
      return;
    }
    if (this.data.item) {
      for (let k in this.result) {
        this.result[k] = this.data.item[k];
      }
    }
    this.$emit("ok");
  },
};
</script>


<style scoped>
.contactFormDialog .formTitle {
  width: 108px;
}
.contactFormDialog > li {
  white-space: nowrap;
}
.contactFormDialog > li > u.error {
  width: 322px !important;
}
.contactFormDialog > li.radioBox > u.error {
  width: auto !important;
}
.formUl > li:nth-last-child(1) {
  padding-bottom: 10px;
}
.sexRadio {
  line-height: 14px;
  height: 14px;
  vertical-align: top;
  display: inline-block;
  margin-top: 1px;
}
.contactFormDialog > li > i.addBtn {
  display: inline-block;
  font-size: 20px;
  line-height: 1;
  margin-top: 6px;
  margin-left: 10px;
  color: #95a0bd;
}
.contactFormDialog > li > i.addBtn:hover {
  color: #4780f4;
}
</style>
<style>
.contactFormDialog > li > .contactCon,
.contactFormDialog > li > .contactCon input,
.contactFormDialog > li > .contactCon .el-cascader {
  width: 324px !important;
  color: #484b5c;
}
.contactFormDialog > li > div.contactCon.textarea {
  max-height: 80px;
  line-height: 20px;
  padding: 0px;
  margin: -1px 0 -3px;
  white-space: pre-wrap;
}
.sexRadio > * {
  display: inline-block;
}
.sexRadio .el-radio__original {
  height: 14px;
  display: inline-block;
}
</style>
