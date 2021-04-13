<template>
  <div class="fillBox changeFormW">
    <div class="boxTitle titleFix">
      <i class="manufacturer_icon"></i><span>{{edit?'编辑厂商信息':(manufacturerId?'查看厂商信息':'新建厂商')}}</span>
      <unit-btn type='plain right'
                :text='!manufacturerId||(manufacturerId&&edit)?"取消":"返回"'
                @click="cancel"></unit-btn>
      <unit-btn type='right'
                :loading='loading'
                :text='btnTxt[$route.name]?btnTxt[$route.name]:"创建"'
                @click="submit"
                v-if="!manufacturerId||(manufacturerId&&edit)"></unit-btn>
    </div>
    <div class="contentFix manufacturerForm">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref='scrollbar'>
          <div class="formPage">
            <div class="formMainTitle"><span>基本信息</span></div>
            <div class="formMainCont">
              <ul class="formUl">
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='manufacturerName','resultView':manufacturerId&&!edit}">
                  <span class="formTitle"><i class="must"
                       v-if="!manufacturerId||(manufacturerId&&edit)">*</i>厂商名称：</span>
                  <div v-if="manufacturerId&&!edit">{{result.manufacturerName}}</div>
                  <input v-if="!manufacturerId||(manufacturerId&&edit)"
                         type="text"
                         v-model="result.manufacturerName"
                         maxlength="30"
                         @input="clearErr('manufacturerName')">
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='manufacturerName'">{{error.msg}}</u></transition>
                </li>
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='serviceScope'}">
                  <span class="formTitle"><i class="must"
                       v-if="!manufacturerId||(manufacturerId&&edit)">*</i>服务范围：</span>
                  <div v-if="manufacturerId&&!edit">{{result.serviceScopeName}}</div>
                  <unit-dropdown v-if="!manufacturerId||(manufacturerId&&edit)"
                                 id="serviceScope"
                                 :list="serviceScope"
                                 @change='dropdownReturn'
                                 :result='result.serviceScope'></unit-dropdown>
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='serviceScope'">{{error.msg}}</u></transition>
                </li>
              </ul>
              <ul class="formUl">
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='industry'}">
                  <span class="formTitle">行业：</span>
                  <div v-if="manufacturerId&&!edit">{{result.industryTxt|emptyTxt}}</div>
                  <unit-dropdown v-if="!manufacturerId||(manufacturerId&&edit)"
                                 id="industry"
                                 :list="industry"
                                 @change='dropdownReturn'
                                 :result='result.industry'></unit-dropdown>
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='industry'">{{error.msg}}</u></transition>
                </li>
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='companyType'}">
                  <span class="formTitle">公司类型：</span>
                  <div v-if="manufacturerId&&!edit">{{result.companyTypeTxt|emptyTxt}}</div>
                  <unit-dropdown v-if="!manufacturerId||(manufacturerId&&edit)"
                                 id="companyType"
                                 :list="compType"
                                 @change='dropdownReturn'
                                 :result='result.companyType'></unit-dropdown>
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='companyType'">{{error.msg}}</u></transition>
                </li>
              </ul>
              <ul class="formUl">
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='contact'}">
                  <span class="formTitle">联系人：</span>
                  <div v-if="manufacturerId&&!edit">
                    <unit-popover :content="emptyTxt(result.contact)"></unit-popover>
                  </div>
                  <input v-if="!manufacturerId||(manufacturerId&&edit)"
                         type="text"
                         v-model="result.contact"
                         maxlength="20">
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='contact'">{{error.msg}}</u></transition>
                </li>
                <li :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='position'}">
                  <span class="formTitle">联系人职务：</span>
                  <div v-if="manufacturerId&&!edit">{{result.position|emptyTxt}}</div>
                  <input v-if="!manufacturerId||(manufacturerId&&edit)"
                         type="text"
                         v-model="result.position"
                         maxlength="30">
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='position'">{{error.msg}}</u></transition>
                </li>
                <li class="smaller"
                    :class="{'small':manufacturerId&&!edit,'errorBorder':error.key==='telephone'}">
                  <span class="formTitle">电话：</span>
                  <div v-if="manufacturerId&&!edit">{{result.telephone|emptyTxt}}</div>
                  <input v-if="!manufacturerId||(manufacturerId&&edit)"
                         type="text"
                         v-model="result.telephone"
                         maxlength="20">
                  <transition name="publicTransition"><u class="error"
                       v-if="error.key==='telephone'">{{error.msg}}</u></transition>
                </li>
              </ul>
            </div>
            <div class="formMainTitle"><span>供应品牌分类</span></div>
            <div class="formMainCont">
              <ul class="tableBox">
                <li class="boxTable"
                    :class="{maxTable:manufacturerId&&!edit}">
                  <unit-table type='hardwareBrand'
                              :list='hardwareBrand'
                              :edit="manufacturerId&&!edit?false:true"
                              :dropdown='{brandName:hardware,typeNames:typeNames,levelTxt:supplierLevel}'
                              ref='hardwareBrand'></unit-table>
                </li>
                <li class="boxTable"
                    :class="{maxTable:manufacturerId&&!edit}">
                  <unit-table type='softwareBrand'
                              :list='softwareBrand'
                              :edit="manufacturerId&&!edit?false:true"
                              :dropdown='{brandName:software,typeNames:typeNames,levelTxt:supplierLevel}'
                              ref='softwareBrand'></unit-table>
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
import unitTable from '@/unit/components/thisUnit/tableBrand'
export default {
  name: 'manufacturerForm',
  props: ['dom'],
  components: { unitPopover, unitTable },
  data () {
    return {
      manufacturerId: null,
      edit: false,
      result: {
        manufacturerName: '',
        serviceScope: '',
        industry: '',
        companyType: '',
        contact: '',
        position: '',
        telephone: '',
      },
      hardwareBrand: [],
      softwareBrand: [],
      serviceScope: [],
      industry: [],
      compType: [],
      typeNames: [],
      hardware: [],
      software: [],
      supplierLevel: [],
      error: {
        key: null,
        msg: '',
      },
      loading: false,
      btnTxt: {
        manufacturerAdd: '创建',
        manufacturerEdit: '保存',
      }
    }
  },
  filters: {
    filName (v) {
      v = v ? v.toString() : '姓名';
      return v.length > 2 ? v.slice(v.length - 2, v.length) : v
    },
    emptyTxt (v) {
      return v ? v : '--'
    }
  },
  computed: {
    userInfo () {
      let userInfo = this.$store.state.userInfo ? this.$store.state.userInfo : {};
      let isCharge = userInfo.info && userInfo.info.staff && userInfo.info.staff.isCharge === '1' ? true : false,
        staffId = userInfo.info && userInfo.info.staff ? userInfo.info.staff.staffId : null
      return { isCharge, staffId };
    },
    judgeBtn () {
      return {
        manufacturerAdd: this.$pubfunc.judgeBtn('manufacturer:add'),
        manufacturerUpdate: this.$pubfunc.judgeBtn('manufacturer:update'),
        manufacturerView: this.$pubfunc.judgeBtn('manufacturer:view'),
      }
    },
  },
  methods: {
    emptyTxt (v) {
      return v ? v : '--'
    },
    getDropData () {
      this.manufacturerId && !this.edit ? null :
        (this.$api.public.region({ level: 10, pCode: '' }, res => {
          // console.log(res)
          switch (res.code) {
            case '0':
              let province = res.data && res.data.list ? res.data.list : [];
              province.splice(0, 0, {
                label: '全国',
                value: '0'
              })
              this.serviceScope = province
              break;
          }
        }),
          this.$api.public.dict({ codeGroup: 'company_type', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.compType = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: 'industry', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.industry = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: 'product_type', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.typeNames = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: 'supplier_level', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.supplierLevel = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: 'hardware_brand', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.hardware = res.data ? res.data : [];
                break;
            }
          }),
          this.$api.public.dict({ codeGroup: 'software_brand', pCode: '' }, res => {
            // console.log(res)
            switch (res.code) {
              case '0':
                this.software = res.data ? res.data : [];
                break;
            }
          }))
      if (this.manufacturerId) {
        this.$api.service.manufacturer.detail({ manufacturerId: this.manufacturerId }, res => {
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
              this.hardwareBrand = res.data.hardwareList;
              this.softwareBrand = res.data.softwareList;
              // console.log(this.hardwareBrand,this.softwareBrand)
              break;
            default:
              this.cancel();
          }
        })
      }
    },
    dropdownReturn (res, key) {
      // console.log(res,key)
      this.clearErr(key);
      switch (key) {
        case 'serviceScope':
          this.result.serviceScope = res.value;
          break;
        case 'industry':
          this.result.industry = res.value;
          break;
        case 'companyType':
          this.result.companyType = res.value;
          break;
      }
    },
    setErr (key, text, judge) {
      judge === null ? this.$store.commit('alertFn', {
        type: 'error',
        text: (this.edit ? '保存' : '新建') + '失败，请修改对应的错误内容',
        time: 2000
      }) : null;
      this.error.key = key;
      this.error.msg = text;
      return false
    },
    clearErr (key, item) {
      if (!key || key === this.error.key) {
        this.error.key = null
      }
      if (item) {
        item[key] = this.$pubfunc.replacePhone(item[key]);
      }
    },
    submit () {
      if (this.loading) { return }
      this.clearErr();
      if (!this.$pubfunc.replaceSpace(this.result.manufacturerName, 4)) {
        return this.setErr('manufacturerName', '请输入厂商名称', null);
      }
      if (!this.result.serviceScope) {
        return this.setErr('serviceScope', '请选择服务范围', null);
      }
      let hardwareList = this.$refs.hardwareBrand.judgeItem(),
        softwareList = this.$refs.softwareBrand.judgeItem();
      if (!hardwareList || !softwareList) {
        this.$store.commit('alertFn', {
          type: 'error',
          text: (this.edit ? '保存' : '新建') + '失败，请修改对应的错误内容',
          time: 2000
        })
        return
      }
      let param = {
        manufacturerName: this.result.manufacturerName,
        serviceScope: this.result.serviceScope,
        industry: this.result.industry,
        companyType: this.result.companyType,
        contact: this.result.contact,
        position: this.result.position,
        telephone: this.result.telephone,
        hardwareList: hardwareList,
        softwareList: softwareList,
      }
      let url = 'add'
      if (this.edit) {
        url = 'update'
        param.manufacturerId = this.manufacturerId;
      }
      // return
      this.loading = true
      this.$api.service.manufacturer[url](param, res => {
        // console.log(res)
        this.loading = false
        switch (res.code) {
          case '0':
            this.$store.commit('alertFn', {
              type: 'success',
              text: this.edit ? '保存成功' : '新建成功',
              func: () => {
                this.cancel();
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
    cancel () {
      this.$router.push({ name: 'manufacturer' });
    }
  },
  created () {
    // console.log(this.$route)
    switch (this.$route.name) {
      case 'manufacturerEdit':
        if (!this.judgeBtn.manufacturerUpdate) {
          this.cancel();
          return
        }
        this.edit = true;
        this.tell = true;
      case 'manufacturerView':
        // if(!this.edit&&!this.judgeBtn.manufacturerView){
        //     this.cancel();
        //     return
        // }
        let manufacturerId;
        try {
          manufacturerId = this.$pubfunc.decode(this.$route.params.manufacturerId);
        } catch (error) {
          this.cancel();
          return
        }
        this.manufacturerId = manufacturerId;
        break;
      default:
        if (!this.judgeBtn.manufacturerAdd) {
          this.cancel();
          return
        }
    }
    this.getDropData();
  },
  mounted () { },
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
.smaller {
  padding-bottom: 0;
  margin-bottom: -30px;
}
.smaller.small {
  padding-bottom: 0;
  margin-bottom: -16px;
}
/* 表格 */
.formMainCont .tableBox {
  padding: 22px 0 32px;
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
</style>