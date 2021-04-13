<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="visit_icon"></i>
      <span>
        {{
        edit ? "修改拜访计划" : planId ? "查看拜访计划" : "新建拜访计划"
        }}
      </span>
      <unit-btn
        type="plain right"
        :text="!planId || (planId && edit) ? '取消' : '返回'"
        @click="cancel"
      ></unit-btn>
      <unit-btn type="large right" :loading="loading" text="创建并继续" @click="addMore" v-if="!planId"></unit-btn>
      <unit-btn
        type="right"
        :loading="loading"
        :text="btnTxt[$route.name]"
        @click="submit"
        v-if="!planId || (planId && edit)"
      ></unit-btn>
    </div>
    <div class="contentFix visitForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <unit-loading :loading="loading1" v-if="loading1"></unit-loading>
          <div class="formPage" v-if="!loading1">
            <unit-tab
              class="contactListTab"
              :tab="tab"
              @click="returnBtn"
              v-if="tab.list.length > 1"
            ></unit-tab>
            <div class="formMainCont">
              <ul class="formUl" v-if="tab.choose === 'plan'">
                <li v-if="planId && !edit" class="small resultView">
                  <span class="formTitle">所属分公司：</span>
                  <div>{{ result.branchCompanyName | emptyTxt }}</div>
                </li>
                <li v-if="planId && !edit" class="small resultView">
                  <span class="formTitle">销售：</span>
                  <div>{{ result.creatorName | emptyTxt }}</div>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'customerId',
                    resultView: planId && !edit
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>客户名称：
                  </span>
                  <div v-if="planId && !edit">{{ result.customerName | emptyTxt }}</div>
                  <unit-customer
                    v-if="!planId || (planId && edit)"
                    id="customerId"
                    placeholder
                    @change="dropdownReturn"
                    @getVal="getValue"
                    :input="true"
                    :result="result.customerId"
                    :param="param"
                  ></unit-customer>
                  <i
                    class="addBtn el-icon-circle-plus-outline AbleClick"
                    v-if="!planId || (planId && edit)"
                    @click="jumpBtn('customer')"
                  ></i>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'customerId'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'projId',
                    resultView: planId && !edit
                  }"
                >
                  <span class="formTitle">项目名称：</span>
                  <div v-if="planId && !edit">{{ result.projName | emptyTxt }}</div>
                  <unit-project
                    v-if="!planId || (planId && edit)"
                    id="projId"
                    placeholder
                    @change="dropdownReturn"
                    @getProj="getProject"
                    :clear="true"
                    :input="true"
                    :customer="result.customerId ? result.customerId : null"
                    :result="result.projId"
                  ></unit-project>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'projId'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'dateTime'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>日期时间：
                  </span>
                  <div v-if="planId && !edit">
                    {{
                    ($pubfunc.TimeTransform("YYYY年MM月DD日", result.date) +
                    " " +
                    $pubfunc.transTime(result.time))
                    | emptyTxt
                    }}
                  </div>
                  <unit-time
                    v-if="!planId || (planId && edit)"
                    placeholder
                    :value="result.date && result.time? result.date + ' ' + result.time: ''"
                    id="dateTime"
                    @return="dropdownReturn"
                    :time="true"
                    :disableddate="1"
                    :reset="reset"
                  ></unit-time>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'dateTime'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'contactId'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>拜访对象：
                  </span>
                  <div v-if="planId && !edit">{{ result.contactName }}</div>
                  <unit-contact
                    v-if="!planId || (planId && edit)"
                    id="contactId"
                    placeholder
                    @change="dropdownReturn"
                    @getVal="getContact"
                    :input="true"
                    :orgid="result.customerId ? result.customerId : null"
                    :result="result.contactId"
                    type="customer"
                  ></unit-contact>
                  <i
                    v-if="!planId || (planId && edit)"
                    class="addBtn el-icon-circle-plus-outline AbleClick"
                    @click="jumpBtn('contact')"
                  ></i>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'contactId'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'position'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>职务：
                  </span>
                  <div v-if="planId && !edit">{{ result.position | emptyTxt }}</div>
                  <input
                    v-if="!planId || (planId && edit)"
                    v-model="result.position"
                    placeholder
                    type="text"
                    maxlength="30"
                    @input="clearErr('position')"
                  />
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'position'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'city'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>地区（城市）：
                  </span>
                  <div v-if="planId && !edit">{{ result.cityName | emptyTxt }}</div>
                  <unit-region
                    :must="true"
                    id="city"
                    @change="dropdownReturn"
                    :onlycity="true"
                    :result="
                      result.province && result.city
                        ? [result.province, result.city]
                        : []
                    "
                    v-if="!planId || (planId && edit)"
                    :reset="reset"
                  ></unit-region>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'city'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'visitType'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>拜访方式：
                  </span>
                  <div v-if="planId && !edit">{{ result.visitTypeTxt }}</div>
                  <unit-dropdown
                    v-if="!planId || (planId && edit)"
                    id="visitType"
                    :list="visitType"
                    @change="dropdownReturn"
                    :result="result.visitType"
                  ></unit-dropdown>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'visitType'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
                <li
                  :class="{
                    small: planId && !edit,
                    errorBorder: error.key === 'workContent'
                  }"
                >
                  <span class="formTitle">
                    <i class="must" v-if="!planId || (planId && edit)">*</i>工作内容：
                  </span>
                  <div
                    v-if="planId && !edit"
                    class="bigCont"
                    v-html="emptyTxt($pubfunc.replaceBr(result.workContent, 1))"
                  ></div>
                  <textarea
                    class="input"
                    v-if="!planId || (planId && edit)"
                    v-model="result.workContent"
                    placeholder
                    type="text"
                    maxlength="500"
                    @input="clearErr('workContent')"
                  ></textarea>
                  <transition name="publicTransition">
                    <u class="error" v-if="error.key === 'workContent'">
                      {{
                      error.msg
                      }}
                    </u>
                  </transition>
                </li>
              </ul>
              <ul
                class="formUl formUl1"
                v-if="
                  planId &&
                    !edit &&
                    tab.list.length > 1 &&
                    tab.choose === 'record'
                "
              >
                <li class="small">
                  <span class="formTitle">拜访方式：</span>
                  <div>{{ recordRes.visitTypeTxt | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">签到地址：</span>
                  <div>{{ recordRes.signAddress | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">日期时间：</span>
                  <div>
                    {{
                    (recordRes.date && recordRes.time
                    ? $pubfunc.TimeTransform(
                    "YYYY年MM月DD日",
                    recordRes.date
                    ) +
                    " " +
                    $pubfunc.transTime(recordRes.time)
                    : "") | emptyTxt
                    }}
                  </div>
                </li>
                <li class="small">
                  <span class="formTitle">客户名称：</span>
                  <div>{{ recordRes.customerName | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">项目名称：</span>
                  <div>{{ recordRes.projName | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">拜访对象：</span>
                  <div>{{ recordRes.contactName | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">职务：</span>
                  <div>{{ recordRes.position | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">地区（城市）：</span>
                  <div>{{ recordRes.cityName | emptyTxt }}</div>
                </li>
                <li class="small">
                  <span class="formTitle">项目机会说明：</span>
                  <div
                    class="bigCont"
                    v-html="
                      emptyTxt($pubfunc.replaceBr(recordRes.projChanceDesc, 1))
                    "
                  ></div>
                </li>
                <li class="small">
                  <span class="formTitle">是否提供技术支持：</span>
                  <div class="contactCon">
                    {{
                    (recordRes.tecSupport === "1"
                    ? "是"
                    : recordRes.tecSupport === "0"
                    ? "否"
                    : "") | emptyTxt
                    }}
                  </div>
                </li>
                <li class="small">
                  <span class="formTitle">技术支持说明：</span>
                  <div
                    class="bigCont"
                    v-html="
                      emptyTxt($pubfunc.replaceBr(recordRes.tecSupportDesc, 1))
                    "
                  ></div>
                </li>
                <li class="small">
                  <span class="formTitle">拜访情况说明：</span>
                  <div
                    class="bigCont"
                    v-html="
                      emptyTxt($pubfunc.replaceBr(recordRes.description, 1))
                    "
                  ></div>
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
import unitCustomer from "@/unit/components/thisUnit/customer";
import unitProject from "@/unit/components/thisUnit/project";
import unitContact from "@/unit/components/thisUnit/contact";
import unitRegion from "@/unit/components/thisUnit/region";
import unitTime from "@/unit/components/element/timeBox";
import unitTab from "@/unit/components/tab";
export default {
  name: "visitPlanForm",
  props: ["dom"],
  components: {
    unitCustomer,
    unitProject,
    unitContact,
    unitRegion,
    unitTime,
    unitTab
  },
  data() {
    return {
      planId: null,
      edit: false,
      result: {
        customerId: "",
        projId: "",
        date: "",
        time: "",
        contactId: "",
        position: "",
        province: "",
        city: "",
        visitType: "",
        workContent: "",
        creatorName: ""
      },
      recordRes: {},
      visitType: [],
      contactList: [],
      error: {
        key: null,
        msg: ""
      },
      loading1: false,
      loading: false,
      reset: false,
      btnTxt: {
        visitplanAdd: "创建",
        visitplanEdit: "保存"
      },
      tab: {
        list: [{ id: "plan", name: "拜访计划" }],
        choose: "plan"
      },
      param: {
        value: "",
        customerId: '',
        project: "",
        contact: "",
        city: ""
      }
    };
  },
  computed: {
    time() {
      let time = this.$pubfunc.getTimeNum();
      // console.log(time)
      return {
        date: this.$pubfunc.TimeTransform("YYYY/MM/DD", time),
        time: this.$pubfunc.TimeTransform("hh:mm", time)
      };
    }
  },
  filters: {
    emptyTxt(v) {
      return v ? v : "--";
    }
  },
  methods: {
    emptyTxt(v) {
      return v ? v : "--";
    },
    getValue(v) {
      if (v) {
        this.param.value = v;
      }
    },
    getProject(v) {
      if (v) {
        this.param.project = v;
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
          let value = this.result;
          let edit = this.edit
          let planId = this.planId
          let data = { value, edit, planId }
          this.$router.push({
            name,
            params: {
              data
            }
          });
          break;
        case 'contact':
          let name2 = "contact";
          let data2 = { result: this.result, param: this.param, edit: this.edit, planId: this.planId }
          console.log(data2);
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
      this.planId && !this.edit
        ? null
        : this.$api.public.dict({ codeGroup: "visit_type", pCode: "" }, res => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.visitType = res.data ? res.data : [];
              break;
          }
        });
      if (this.planId) {
        this.loading1 = true;
        this.$api.service.visit.detailPlan({ planId: this.planId }, res => {
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
              if (this.planId && !this.edit && res.data.recordId) {
                this.$api.service.visit.detailRecord(
                  { recordId: res.data.recordId },
                  res => {
                    this.loading1 = false;
                    switch (res.code) {
                      case "0":
                        this.tab.list.length < 2
                          ? this.tab.list.push({
                            id: "record",
                            name: "拜访记录"
                          })
                          : null;
                        this.recordRes = res.data;
                        break;
                      default:
                        this.cancel();
                    }
                  }
                );
              } else {
                this.loading1 = false;
              }
              // console.log(this.result)
              break;
            default:
              this.loading1 = false;
              this.cancel();
          }
        });
      }
    },
    returnBtn(type, k) {
      switch (type) {
        case "tab":
          this.tab.choose = k;
          break;
      }
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case "city":
          this.result.province = res.ids[0];
          this.result.city = res.ids[1];
          break;
        case "dateTime":
          this.result.date = this.$pubfunc.TimeTransform("YYYY/MM/DD", res);
          this.result.time = this.$pubfunc.TimeTransform("hh:mm", res);
          break;
        case "customerId":
          console.log(res);

          this.result.customerId = res.value;
          // this.result.province=res.extend.province;
          // this.result.city=res.extend.city;
          this.result.province = "";
          this.result.city = "";
          this.result.projId = "";
          this.result.contactId = "";
          this.result.position = "";
          this.param.value = res.label
          this.param.customerId = res.value
          break;
        case "contactId":
          this.result.position = res.position;
          this.result.province = res.province;
          this.result.city = res.city;
        default:
          this.result[key] = res.value;
      }
    },
    setErr(key, text) {
      this.$store.commit("alertFn", {
        type: "error",
        text: (this.edit ? "保存" : "新建") + "失败，请修改对应的错误内容",
        time: 2000
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
    submit(j) {
      if (this.loading) {
        return;
      }
      this.clearErr();
      if (!this.result.customerId) {
        return this.setErr("customerId", "请选择客户");
      }
      if (!this.result.date || !this.result.time) {
        return this.setErr("dateTime", "请选择拜访日期和时间");
      }
      if (!this.result.contactId) {
        return this.setErr("contactId", "请选择拜访对象");
      }
      if (!this.$pubfunc.replaceSpace(this.result.position, 1)) {
        return this.setErr("position", "请填写拜访对象对应职务");
      }
      if (!this.result.city) {
        return this.setErr("city", "请选择地区（城市）");
      }
      if (!this.result.visitType) {
        return this.setErr("visitType", "请选择拜访方式");
      }
      if (!this.$pubfunc.replaceSpace(this.result.workContent, 1)) {
        return this.setErr("workContent", "请填写工作内容");
      }
      // let keys=['customerId','projId','date','time','contactId','position','city','visitType','workContent']
      // let param={}
      // for(let k in keys){
      //     param[keys[k]]=this.result[keys[k]]
      // }
      let param = JSON.parse(JSON.stringify(this.result));
      let url = "addPlan";
      if (this.edit) {
        url = "updatePlan";
        param.planId = this.planId;
      }
      this.loading = true;
      this.$api.service.visit[url](param, res => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.$store.commit("alertFn", {
              type: "success",
              text: this.edit ? "保存成功" : "新建成功",
              func: () => {
                j && !this.planId && !this.edit ? this.clear() : this.cancel();
              }
            });
            break;
          default:
            res.message
              ? this.$store.commit("alertFn", {
                type: "error",
                text: res.message
              })
              : null;
        }
      });
    },
    addMore() {
      this.submit(true);
    },
    clear() {
      this.result.customerId = "";
      this.result.projId = "";
      this.result.date = "";
      this.result.time = "";
      this.result.contactId = "";
      this.result.position = "";
      this.result.province = "";
      this.result.city = "";
      this.result.visitType = "";
      this.result.workContent = "";
      this.reset = !this.reset;
    },
    cancel() {
      this.$router.push({ name: "visitplan" });
    },
    getData() {
      if (this.$route.params.data) {
        if (this.$route.params.data.result && this.$route.params.data.data) {
          
          const { result, data } = this.$route.params.data
          this.result.customerId = result.orgId
          this.result.projId = data.projId
          this.result.date = data.date
          this.result.time = data.time
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
      case "visitplanEdit":
        this.edit = true;
      case "visitplanView":
        let planId;
        try {
          planId = this.$pubfunc.decode(this.$route.params.planId || this.$route.params.data.planId);
        } catch (error) {
          this.cancel();
          return;
        }
        this.planId = planId;
        break;
    }
    this.getDropData();
    this.getData();
  }
};
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
  width: 130px;
}
.formUl.formUl1 > li > span.formTitle {
  width: 160px;
}
.formUl > li u.error {
  left: 110px;
  width: 230px !important;
}
.formUl > li > textarea {
  width: 450px;
  height: 122px;
}
.formUl > li textarea + u.error {
  width: 450px !important;
}
.bigCont {
  width: 80%;
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
