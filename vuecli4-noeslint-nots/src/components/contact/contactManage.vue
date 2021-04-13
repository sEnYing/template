<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="contact_icon"></i>
      <span>联系人管理</span>
      <unit-btn
        type="large right"
        text="模板下载"
        v-if="judgeBtn.contactSupplierImport || judgeBtn.contactCustomerImport"
        @click="tableOper('template', null)"
      ></unit-btn>
      <unit-btn
        type="auto right"
        text="导出供应商联系人"
        @click="tableOper('contactSupplierExport', null)"
        v-if="judgeBtn.contactSupplierExport && tab.choose === 'supplier'"
      ></unit-btn>
      <el-upload
        class="upload-demo right"
        action="/api/service/contact/supplier/import"
        :show-file-list="false"
        :on-success="uploadSuc"
        :on-error="uploadErr"
        :file-list="fileList"
        :headers="{
          Authorization: $store.state.token,
        }"
      >
        <el-button
          size="small"
          type="primary"
          v-if="judgeBtn.contactSupplierImport && tab.choose === 'supplier'"
          >导入供应商联系人</el-button
        >
      </el-upload>
      <unit-btn
        type="auto right"
        text="导出客户联系人"
        @click="tableOper('contactCustomerExport', null)"
        v-if="judgeBtn.contactCustomerExport && tab.choose === 'customer'"
      ></unit-btn>
      <el-upload
        class="upload-demo right"
        action="/api/service/contact/customer/import"
        :show-file-list="false"
        :on-success="uploadSuc"
        :on-error="uploadErr"
        :before-upload="uploadBefore"
        :file-list="fileList"
        :headers="{
          Authorization: $store.state.token,
        }"
      >
        <el-button
          size="small"
          type="primary"
          v-if="judgeBtn.contactCustomerImport && tab.choose === 'customer'"
          >导入客户联系人</el-button
        >
      </el-upload>
      <unit-btn
        type="auto right"
        text="添加供应商联系人"
        @click="tableOper('supplierAdd')"
        v-if="judgeBtn.contactSupplierAdd"
      ></unit-btn>
      <unit-btn
        type="auto right"
        text="添加客户联系人"
        @click="tableOper('customerAdd')"
        v-if="judgeBtn.contactCustomerAdd"
      ></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <div class="loadingCont" v-if="loading">
          <unit-loading :loading="loading"></unit-loading>
        </div>
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formBox">
            <div class="div1">
              <span class="formBox_text">联系人姓名</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.contactName"
                  maxlength="20"
                  placeholder="全部"
                  @keydown.enter="tableOper('select')"
                />
              </div>
            </div>
            <div class="customerFormBox" v-if="tab.choose === 'customer'">
              <span class="formBox_text">客户名称</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.customerName"
                  placeholder="全部"
                  @keydown.enter="tableOper('select', null)"
                />
              </div>
            </div>
            <div class="supplierFormBox" v-if="tab.choose === 'supplier'">
              <span class="formBox_text">供应商名称</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.supplierName"
                  placeholder="全部"
                  @keydown.enter="tableOper('select', null)"
                />
              </div>
            </div>
            <!-- <div class="customerFormBox" v-if="tab.choose==='customer'"><span class="formBox_text">客户名称</span><div><unit-customer v-setwidth id="customerName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-customer></div></div>
            <div class="supplierFormBox" v-if="tab.choose==='supplier'"><span class="formBox_text">供应商名称</span><div><unit-supplier v-setwidth id="supplierName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-supplier></div></div>-->
            <div class="div2">
              <span class="formBox_text">电话/手机</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.phone"
                  maxlength="20"
                  placeholder="全部"
                  @keydown.enter="tableOper('select')"
                />
              </div>
            </div>

            <div class="div3" v-if="tab.choose === 'customer'">
              <span class="formBox_text">销售</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="owner"
                  class="auto"
                  placeholder="全部"
                  :list="ownerList"
                  @change="dropdownReturn"
                  :result="selMod.owner"
                  :clear="true"
                  :reset="reset"
                  :input="true"
                ></unit-dropdown>
              </div>
            </div>
            <div class="dropTree" v-if="tab.choose === 'customer'">
              <span class="formBox_text">分子公司/所属部门</span>
              <div>
                <unit-tree
                  id="branchCompany"
                  class="auto"
                  v-setwidth
                  :list="depList"
                  :choose="[selMod.branchCompany]"
                  :hid="hideTree"
                  @click="hideOther"
                  placeholder="全部"
                  @return="dropdownReturn"
                  :hidedisable="true"
                  :only="true"
                  :expendclick="false"
                  keyid="depId"
                  :must="true"
                ></unit-tree>
              </div>
            </div>
            <div class="btnBox right">
              <unit-btn @click="tableOper('select')" text="查询"></unit-btn>
              <unit-btn
                type="plain"
                @click="tableOper('clear')"
                text="重置"
              ></unit-btn>
            </div>
          </div>
          <unit-tab
            class="contactListTab"
            :tab="tab"
            @click="returnBtn"
            v-if="tab.list && tab.list.length > 0"
          ></unit-tab>
          <component
            :is="tab.choose"
            :sel="selRes"
            :btn="judgeBtn"
            :staff="userInfo"
            @ok="loadingChange(false)"
            @dialog="showDialog"
            @clear="tableOper('clear')"
            @select="tableOper('select')"
            :selMod="selMod"
            v-if="tab.choose"
          ></component>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTab from "@/unit/components/tab";
import unitTree from "@/unit/components/element/tree";
// import unitCustomer from '@/unit/components/thisUnit/customer'
// import unitSupplier from '@/unit/components/thisUnit/supplier'
export default {
  name: "contactManage",
  props: ["dom"],
  components: {
    unitTab,
    unitTree,
    // unitCustomer,
    // unitSupplier,
    customer: (resolve) => require(["./customer"], resolve), //客户联系人
    supplier: (resolve) => require(["./supplier"], resolve), //供应商联系人
  },
  data() {
    return {
      reset: false,
      ownerList: [],
      selMod: {
        customerName: "",
        supplierName: "",
        contactName: "",
        phone: "",
        owner: "",
        branchCompany: "",
      },
      selRes: {},
      tab: {
        list: [],
        choose: null,
      },
      loading: true,
      ajaxIng: false,
      templateLoading: false,
      depList: [],
      hideTree: false,
      fileList: [],
    };
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
      let contactCustomer = this.$pubfunc.judgeBtn("contact:customer"),
        contactSupplier = this.$pubfunc.judgeBtn("contact:supplier");
      if (contactCustomer) {
        this.tab.list.push({ id: "customer", name: "客户联系人" });
      }
      if (contactSupplier) {
        this.tab.list.push({ id: "supplier", name: "供应商联系人" });
      }
      this.tab.list.length > 0 ? (this.tab.choose = this.tab.list[0].id) : null;
      return {
        contactCustomerAdd: this.$pubfunc.judgeBtn("contact:customer:add"),
        contactSupplierAdd: this.$pubfunc.judgeBtn("contact:supplier:add"),
        contactCustomerExport: this.$pubfunc.judgeBtn(
          "contact:customer:export"
        ),
        contactSupplierExport: this.$pubfunc.judgeBtn(
          "contact:supplier:export"
        ),
        contactCustomerImport: this.$pubfunc.judgeBtn(
          "contact:customer:import"
        ),
        contactSupplierImport: this.$pubfunc.judgeBtn(
          "contact:supplier:import"
        ),
      };
    },
  },
  methods: {
    showDialog(data) {
      // console.log(data)
      this.$emit("dialog", data);
    },
    loadingChange(j) {
      this.loading = j;
    },
    hideOther(j) {
      this.hideTree = j ? j : false;
    },
    returnBtn(type, k) {
      switch (type) {
        case "tab":
          this.tab.choose !== k ? this.loadingChange(true) : null;
          this.tab.choose = k;
          break;
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        case "owner":
          this.selMod.owner = res.value;
          break;
        case "branchCompany":
          this.selMod.branchCompany = res[0].depId;
          break;
      }
    },
    uploadBefore(file) {
      if (this.ajaxIng) {
        return false;
      } else {
        this.ajaxIng = true;
        return true;
      }
    },
    uploadSuc(response, file, fileList) {
      this.ajaxIng = false;
      if (response.code === "0") {
        this.$store.commit("alertFn", {
          text: "上传成功！",
          type: "success",
        });
        this.getList(1);
      } else {
        this.$store.commit("alertFn", {
          text: response.message,
          type: "error",
        });
      }
    },
    uploadErr(err, file, fileList) {
      this.$store.commit("alertFn", {
        text: err.message,
        type: "error",
      });
    },
    tableOper(key) {
      // console.log(key)
      switch (key) {
        case "select":
          this.$store.commit("searchConditionFn", this.selMod);
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          break;
        case "contactSupplierExport":
          if (this.ajaxIng) {
            this.$store.commit("alertFn", {
              type: "warning",
              text: "正在导出报表，请稍后",
            });
            return;
          }
          // let param = JSON.parse(JSON.stringify(this.selRes))
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          let param1 = JSON.parse(JSON.stringify(this.selRes));
          this.ajaxIng = true;
          this.$api.download.supplierContactExport(param1, (res) => {
            this.$pubfunc.downloadFile(
              res,
              "供应商联系人清单" +
                this.$pubfunc.TimeTransform(
                  "YYYYMMDDhhmmss",
                  this.$pubfunc.getTimeNum()
                ) +
                ".xlsx"
            );
            this.ajaxIng = false;
            this.$store.commit("alertFn", {
              type: "success",
              text: "导出成功",
              func: () => {
                this.$emit("success");
              },
            });
          });
          break;
        case "contactCustomerExport":
          if (this.ajaxIng) {
            this.$store.commit("alertFn", {
              type: "warning",
              text: "正在导出报表，请稍后",
            });
            return;
          }
          // let param = JSON.parse(JSON.stringify(this.selRes))
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          let param2 = JSON.parse(JSON.stringify(this.selRes));
          this.ajaxIng = true;
          this.$api.download.customerContactExport(param2, (res) => {
            this.$pubfunc.downloadFile(
              res,
              "客户联系人清单" +
                this.$pubfunc.TimeTransform(
                  "YYYYMMDDhhmmss",
                  this.$pubfunc.getTimeNum()
                ) +
                ".xlsx"
            );
            this.ajaxIng = false;
            this.$store.commit("alertFn", {
              type: "success",
              text: "导出成功",
              func: () => {
                this.$emit("success");
              },
            });
          });
          break;
        case "clear":
          for (let k in this.selMod) {
            this.selMod[k] = "";
          }
          this.reset = !this.reset;
          this.tableOper("select");
          break;
        case "customerAdd":
          this.$emit("dialog", {
            show: true,
            link: "contactForm",
            small: true,
            title: "添加客户联系人",
            data: { key, type: "customer" },
          });
          break;
        case "supplierAdd":
          this.$emit("dialog", {
            show: true,
            link: "contactForm",
            small: true,
            title: "添加供应商联系人",
            data: { key, type: "supplier" },
          });
          break;
        case "template":
          if (this.templateLoading) {
            return;
          }
          this.templateLoading = true;
          this.$api.download[
            this.tab.choose === "customer"
              ? "customerTemplate"
              : "supplierTemplate"
          ]({}, (res) => {
            this.templateLoading = false;
            this.$pubfunc.downloadFile(
              res,
              this.tab.choose === "customer"
                ? "客户联系人模板.xlsx"
                : "供应商联系人模板.xlsx",
              "excel"
            );
          });
          break;
      }
    },
    async getTreeData() {
      let self = this;
      this.$api.public.depmgnt((res) => {
        switch (res.code) {
          case "0":
            this.depList = res.data ? res.data : [];
            break;
        }
      });
    },
    getDropData() {
      this.$api.bgmgnt.staff.getList({ resourceType: "02,05,07" }, (res) => {
        //分公司总+销售总监+销售
        // console.log(res)
        switch (res.code) {
          case "0":
            let list = [];
            (res.data.list ? res.data.list : []).map((v) => {
              list.push({
                value: v.staffId,
                label: v.staffName + "(" + v.staffNo + ")",
              });
            });
            this.ownerList = list;
            break;
        }
      });
    },
  },
  created() {
    this.selMod = this.$store.state.searchCondition;
    this.selRes = JSON.parse(JSON.stringify(this.selMod));
    this.getDropData();
    this.getTreeData();
    if (this.$route.params.data) {
      this.tableOper("customerAdd");
    }
  },
};
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  position: relative;
}
.formBox > div:nth-last-child(1) {
  padding-left: 50px;
}
.formBox > div.div1 {
  padding-left: 80px;
  width: calc(20% + 18px);
}
.formBox > div.div2 {
  padding-left: 70px;
  width: calc(20% + 8px);
}
.formBox > div.div3 {
  padding-left: 38px;
  width: calc(20% - 34px);
  padding-right: 0;
}
.formBox > div.customerFormBox {
  padding-left: 66px;
  width: calc(20% + 4px);
}
.formBox > div.supplierFormBox {
  padding-left: 80px;
  width: calc(20% + 18px);
}
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div > div > * {
  width: 100%;
}
.boxRel .contactListTab {
  margin-bottom: 16px;
}
.formBox > .dropTree:not(.btnBox) {
  padding-left: 126px;
  padding-right: 0;
  position: relative;
  width: calc(20% + 40px);
  font-size: 14px;
}
.upload-demo {
  width: 135px;
  display: inline-block;
  margin: -2px 0 -2px 20px;
}
.upload-demo .el-button {
  padding: 0;
  color: #fff;
  background-color: #4780f4;
  border: 1px solid #4780f4;
  border-radius: 2px;
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  width: 135px;
  height: 32px;
  line-height: 30px;
}
</style>
