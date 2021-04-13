<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="manufacturer_icon"></i><span>厂商管理</span>
      <unit-btn type='large right'
                text='新建厂商'
                @click="tableOper('add',null)"
                v-if="judgeBtn.manufacturerAdd"></unit-btn>
      <!-- <unit-btn type='large right' text='厂商导入' @click="tableOper('import',null)"></unit-btn>
            <unit-btn type='large right' text='模板下载' @click="tableOper('template',null)"></unit-btn> -->
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar"
                      ref='scrollbar'>
          <div class="formBox">
            <div><span class="formBox_text">厂商名称</span>
              <div><input v-setwidth
                       type="text"
                       placeholder='全部'
                       v-model="selMod.manufacturerName"
                       @keydown.enter="tableOper('select',null)"></div>
            </div>

            <div><span class="formBox_text">服务范围</span>
              <div>
                <unit-dropdown v-setwidth
                               id="serviceScope"
                               class="auto"
                               placeholder='全部'
                               :list="serviceScope"
                               @change='dropdownReturn'
                               :result="selMod.serviceScope"
                               :clear='true'
                               :input="true"
                               :reset='reset'></unit-dropdown>
              </div>
            </div>
            <div><span class="formBox_text">硬件品牌</span>
              <div>
                <unit-dropdown v-setwidth
                               id="hardwareBrand"
                               class="auto"
                               placeholder='全部'
                               :list="hardwareBrand"
                               @change='dropdownReturn'
                               :result="selMod.hardwareBrand"
                               :clear='true'
                               :input="true"
                               :reset='reset'></unit-dropdown>
              </div>
            </div>
            <div><span class="formBox_text">软件品牌</span>
              <div>
                <unit-dropdown v-setwidth
                               id="softwareBrand"
                               class="auto"
                               placeholder='全部'
                               :list="softwareBrand"
                               @change='dropdownReturn'
                               :result="selMod.softwareBrand"
                               :clear='true'
                               :input="true"
                               :reset='reset'></unit-dropdown>
              </div>
            </div>
            <div><span class="formBox_text">供应链级别</span>
              <div>
                <unit-dropdown v-setwidth
                               id="level"
                               class="auto"
                               placeholder='全部'
                               :list="level"
                               @change='dropdownReturn'
                               :result="selMod.level"
                               :clear='true'
                               :reset='reset'></unit-dropdown>
              </div>
            </div>
            <div class="btnBox right">
              <unit-btn @click="tableOper('select',null)"
                        text='查询'></unit-btn>
              <unit-btn type='plain'
                        @click="tableOper('clear',null)"
                        text='重置'></unit-btn>
            </div>
          </div>
          <div class="boxTable">
            <unit-loading :loading='loading'
                          v-if="loading"></unit-loading>
            <unit-table :total='total'
                        :page='page'
                        v-if="!loading||list.length>0"
                        :opern='judgeBtn.num'
                        :list='list'
                        :title='title'
                        ref='table'
                        :operation="[{key:'view',show:judgeShow},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]"
                        @click='tableOper'></unit-table>
            <unit-page :total='total'
                       :page='page'
                       @pagechange="getList"></unit-page>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'manufacturerManage',
  props: ['dom'],
  components: { unitTable },
  data () {
    return {
      selMod: {
        manufacturerName: '',
        serviceScope: '',
        hardwareBrand: '',
        softwareBrand: '',
        level: '',
      },
      selRes: {},
      reset: true,
      serviceScope: [],
      hardwareBrand: [],
      softwareBrand: [],
      level: [],
      title: [{ key: 'manufacturerName', name: '厂商名称', width: 24 }, { key: 'serviceScopeName', name: '服务范围', width: 18 }, { key: 'industryTxt', name: '行业划分', width: 18 }, { key: 'creatorName', name: '创建人', width: 20 }, { key: 'createTime_', name: '创建日期', width: 20 }],//,{key:'telephone',name:'电话',width:16}
      list: [],
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
    }
  },
  computed: {
    userInfo () {
      let userInfo = this.$store.state.userInfo ? this.$store.state.userInfo : {};
      let isCharge = userInfo.info && userInfo.info.staff && userInfo.info.staff.isCharge === '1' ? true : false,
        staffId = userInfo.info && userInfo.info.staff ? userInfo.info.staff.staffId : null;
      let isAdmin = userInfo.info && userInfo.info.staff && userInfo.info.staff.isAdmin === '1';
      return { isCharge, staffId, isAdmin };
    },
    judgeBtn () {
      let json = {
        manufacturerAdd: this.$pubfunc.judgeBtn('manufacturer:add'),
        manufacturerUpdate: this.$pubfunc.judgeBtn('manufacturer:update'),
        manufacturerDelete: this.$pubfunc.judgeBtn('manufacturer:delete'),
        manufacturerView: this.$pubfunc.judgeBtn('manufacturer:view'),
      }, num = 1;
      json.manufacturerUpdate ? num++ : null;
      json.manufacturerDelete ? num++ : null;
      json.num = num;
      return json
    },
  },
  methods: {
    judgeShow (item, i, key) {
      switch (key) {
        case 'view':
          return true
        case 'revise':
          return (item.creator === this.userInfo.staffId || this.userInfo.isAdmin) && this.judgeBtn.manufacturerUpdate ? true : false
        case 'delete':
          return (item.creator === this.userInfo.staffId || this.userInfo.isAdmin) && this.judgeBtn.manufacturerDelete ? true : false
      }
      return true
    },
    getDropData () {
      this.$api.public.region({ level: 10, pCode: '' }, res => {
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
      })
      this.$api.public.dict({ codeGroup: 'hardware_brand', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.hardwareBrand = res.data ? res.data : [];
            break;
        }
      })
      this.$api.public.dict({ codeGroup: 'software_brand', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            console.log(res);

            this.softwareBrand = res.data ? res.data : [];
            break;
        }
      })
      this.$api.public.dict({ codeGroup: 'supplier_level', pCode: '' }, res => {
        // console.log(res)
        switch (res.code) {
          case '0':
            this.level = res.data ? res.data : [];
            break;
        }
      })
    },
    getList (page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.selRes));
      param.limit = 10;
      param.page = page;
      // console.log(param)
      this.loading = true;
      this.$api.service.manufacturer.getList(param, res => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case '0':
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map(v => {
              v.createTime_ = this.$pubfunc.TimeTransform('YYYY年MM月DD日', v.createTime);
              v.region = (v.provinceName ? v.provinceName : '') + (v.provinceName && v.cityName ? '/' : '') + (v.cityName ? v.cityName : '')
            })
            this.list = list;
            break;
        }
      })
    },
    dropdownReturn (res, key) {
      // console.log(res,key)
      this.selMod[key] = res.value;
    },
    tableOper (key, item) {
      // console.log(key,item)
      switch (key) {
        case 'select':
          this.$store.commit('searchConditionFn', this.selMod)
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          this.getList(1)
          break;
        case 'clear':
          for (let k in this.selMod) {
            this.selMod[k] = '';
          }
          this.reset = !this.reset;
          this.tableOper('select', null);
          break;
        case 'add':
          this.$router.push({ name: 'manufacturerAdd' });
          break;
        case 'revise':
          item.manufacturerId ? this.$router.push({ name: 'manufacturerEdit', params: { manufacturerId: this.$pubfunc.encode(item.manufacturerId) } }) : null;
          break;
        case 'view':
          item.manufacturerId ? this.$router.push({ name: 'manufacturerView', params: { manufacturerId: this.$pubfunc.encode(item.manufacturerId) } }) : null;
          break;
        case 'delete':
          this.$store.commit('confirmFn', {
            func: () => {
              if (this.delLoading) { return }
              this.delLoading = true;
              this.$api.service.manufacturer.delete({ manufacturerId: item.manufacturerId }, res => {
                // console.log(res)
                this.delLoading = false
                switch (res.code) {
                  case '0':
                    this.$store.commit('alertFn', {
                      type: 'success',
                      text: '删除成功',
                      func: () => {
                        this.tableOper('select', null);
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
            text: '确认删除该厂商信息吗？<br>删除后不可恢复'
          });
          break
      }
    },
  },
  created () {
    this.getDropData();
    this.selMod = this.$store.state.searchCondition
    this.selRes = JSON.parse(JSON.stringify(this.selMod));
    this.getList(this.$store.state.page.page)
  },
  mounted () { },
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% - 4px);
}
.formBox > div:nth-child(1) {
  padding-left: 80px;
  width: calc(20% + 10px);
}
.formBox > div:nth-child(5) {
  padding-right: 0;
  padding-left: 81px;
  width: calc(20% + 1px);
}
.formBox > div > .formBox_text {
  position: absolute;
  left: 0;
  top: 0;
}
.formBox > div > div > * {
  width: 100%;
}
.fillBox .boxTable {
  height: calc(100% - 108px);
}
</style>
