<template>
  <div class="boxTable">
    <unit-loading :loading="loading"
                  v-if="loading"></unit-loading>
    <unit-table :total="total"
                :page="page"
                v-if="!loading||list.length>0"
                :opern="judgeBtn.num"
                :list="list"
                :title="title"
                ref="table"
                :operation="[{key:'view'},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}}]"
                @click="tableOper"></unit-table>
    <unit-page :total="total"
               :page="page"
               @pagechange="getList"></unit-page>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'contact_supplier',
  props: ['sel', 'btn', 'staff'],
  components: { unitTable },
  data () {
    return {
      title: [{ key: 'contactName', name: '姓名', width: 12 }, { key: 'orgName', name: '供应商名称', width: 24 }, { key: 'department', name: '部门', width: 16 }, { key: 'position', name: '职位', width: 14 }, { key: 'mobilePhoneNumber', name: '手机', width: 12 }, { key: 'telephone', name: '电话', width: 12 }, { key: 'sexTxt', name: '性别', width: 10 }],
      list: [],
      loading: true,
      delLoading: false,
      total: 0,
      page: 1,
    }
  },
  computed: {
    reload () {
      return this.$store.state.reload;
    },
    judgeBtn () {
      let json = {
        contactSupplierUpdate: this.$pubfunc.judgeBtn('contact:supplier:update'),
        contactSupplierDelete: this.$pubfunc.judgeBtn('contact:supplier:delete'),
        contactSupplierView: this.$pubfunc.judgeBtn('contact:supplier:view')
      }, num = 1;
      json.contactSupplierUpdate ? num++ : null;
      json.contactSupplierDelete ? num++ : null;
      json.num = num;
      return json
    },
  },
  watch: {
    sel () {
      this.getList(1)
    },
    reload () {
      if (this.reload === true) {
        this.getList(1);
        this.$store.commit('reloadFn', false);
      }
    },
  },
  methods: {
    judgeShow (item, i, key) {
      switch (key) {
        case 'view':
          return true
        case 'revise':
          return this.judgeBtn.contactSupplierUpdate ? true : false
        case 'delete':
          return this.judgeBtn.contactSupplierDelete ? true : false
      }
      return true
    },
    returnBtn (type, k) {
      switch (type) {
        case 'tab':
          this.tab.choose !== k ? this.loadingChange(true) : null;
          this.tab.choose = k;
          this.$pubfunc.setSStorage('project', k);
          if (k === 'projGeneral') {
            this.getInfo();
          }
          break;
      }
    },
    getList (page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.sel));
      delete param.customerName;
      param.limit = 10;
      param.page = page;
      // console.log(param)
      this.loading = true;
      this.$api.service.contact.supplierList(param, res => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case '0':
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map(v => {
              v.sexTxt = v.sex === '1' ? '男' : (v.sex === '2' ? '女' : '');
            })
            this.list = list;
            break;
        }
      })
    },
    tableOper (key, item) {
      // console.log(key,item)
      switch (key) {
        case 'view':
          this.$emit('dialog', { show: true, link: 'contactForm', small: true, title: '查看供应商联系人', data: { key, item, type: 'supplier' } });
          break;
        case 'revise':
          this.$emit('dialog', { show: true, link: 'contactForm', small: true, title: '编辑供应商联系人', data: { key, item, type: 'supplier' } });
          break;
        case 'delete':
          this.$store.commit('confirmFn', {
            func: () => {
              if (this.delLoading) { return }
              this.delLoading = true
              this.$api.service.contact.supplierDelete({ contactId: item.contactId }, res => {
                // console.log(res)
                this.delLoading = false
                switch (res.code) {
                  case '0':
                    this.$store.commit('alertFn', {
                      type: 'success',
                      text: '删除成功',
                      func: () => {
                        this.clearSel();
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
            text: '确认删除该联系人信息吗？<br>删除后不可恢复'
          });
          break;
      }
    },
    clearSel () {
      this.$emit('clear')
    }
  },
  created () {
    this.getList(this.$store.state.page.page)
  },
  mounted () {
    this.$emit('ok');
  },
}
</script>

<style scoped>
.formBox > div:not(.btnBox) {
  padding-left: 66px;
  position: relative;
  width: calc(20% + 4px);
}
.formBox > div:nth-child(3) {
  padding-left: 70px;
  width: calc(20% + 8px);
}
.formBox > div:nth-child(4) {
  padding-left: 80px;
  width: calc(20% + 18px);
}
.formBox > div:nth-child(5) {
  padding-left: 38px;
  padding-right: 0;
  width: calc(20% - 34px);
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
  height: calc(100% - 112px);
}
</style>
