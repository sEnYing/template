<template>
  <div class="fillBox departmentMng">
    <div class="boxTitle titleFix">
      <i class="department_icon"></i><span>部门管理</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <div class="boxTable">
          <unit-loading :loading='loading'
                        v-if="loading"></unit-loading>
          <unit-table :indexrow="0"
                      v-if="depLevel.length>0&&depType.length>0&&(!loading||list.length>0)"
                      :list='list'
                      :title="title"
                      :operation="[{key:'addDep',class:showJudge},'revise',{key:'delete',show:(item,i)=>{return i===0?false:true},class:()=>{return 'redbtn'}}]"
                      child="depId"
                      @click='tableOper'
                      :tree='true'></unit-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
  name: 'departmentManage',
  props: ['dom'],
  components: { unitTable },//unitUpload
  data () {
    return {
      loading: false,
      title: [{ key: 'depName', name: '部门' }, { key: 'depLevelTxt', name: '部门级别' }, { key: 'depTypeTxt', name: '部门类别' }],
      list: [],
      depLevel: [],
      depType: [],
    }
  },
  components: { unitTable },
  computed: {
    reload () {
      return this.$store.state.reload;
    },
  },
  watch: {
    reload () {
      // console.log(this.reload)
      if (this.reload) {
        this.getList();
        this.$store.commit('reloadFn', false);
      }
    },
  },
  methods: {
    showJudge (item, i, key) {
      if (this.depLevel.length > 0 && this.depType.length > 0) {
        return Number(item.depLevel) < Number(this.depLevel[this.depLevel.length - 1].value) ? '' : 'unable'
      }
      return ''
    },
    getDropData () {
      this.$api.public.dict({ codeGroup: 'dep_level', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.depLevel = res.data ? res.data : [];
            break;
        }
      });
      this.$api.public.dict({ codeGroup: 'dep_type', pCode: '' }, res => {
        switch (res.code) {
          case '0':
            this.depType = res.data ? res.data : [];
            break;
        }
      });
    },
    getList () {
      if (this.loading) { return; }
      this.loading = true;
      this.$api.public.depmgnt(res => {
        this.loading = false;
        switch (res.code) {
          case "0":
            this.list = this.filtersList((res.data ? res.data : []).concat(), null);
            // this.list=(res.data?res.data:[]).concat();
            console.log(this.list);

            break;
        }
      })
    },
    filtersList (list, f) {
      // console.log(list)
      let list_ = [];
      list.map((v, i) => {
        let json = v;
        json.pLevel = f ? f.depLevel : null;
        v.children = v.children && v.children.length > 0 ? (this.filtersList(v.children.concat(), v)) : [];
        list_.push(json);
      })
      // console.log(list_)
      return list_;
    },
    addBtn (item, action) {
      // console.log(item.children);
      let level = this.depLevel.concat(), min = Number(item.pLevel), max = (item.children ? item.children : []).reduce((e, val) => {
        return Number(val.depLevel) < e ? Number(val.depLevel) : e
      }, Number(this.depLevel[this.depLevel.length - 1].value) + 1);
      item.depLevelList = level.reduce((arr, v) => {
        return Number(v.value) < max && Number(v.value) > min ? arr.concat(v) : arr
      }, []);
      item.depTypeList = this.depType;
      // console.log(item)
      this.$emit('dialog', { show: true, link: 'depMgntAdd', title: (action === 'revise' ? '编辑' : '添加子') + '部门', data: item, small: true });
    },
    tableOper (type, item) {
      switch (type) {
        case 'addDep':
          if (Number(item.depLevel) >= Number(this.depLevel[this.depLevel.length - 1].value)) { return }
          this.addBtn({ pDepId: item.depId, pLevel: Number(item.pLevel) + 1 }, 'add'); return;
        case 'revise': this.addBtn(item, 'revise'); return;
        case 'delete':
          if (item.children && item.children.length > 0) {
            this.$store.commit('alertFn', {
              type: 'error',
              text: '该部门下已经添加子部门，无法删除'
            })
            return;
          }
          this.$store.commit('confirmFn', {
            func: () => {
              this.$api.bgmgnt.department.delete({ depId: item.depId }, res => {
                switch (res.code) {
                  case '0':
                    this.$store.commit('alertFn', {
                      type: 'success',
                      text: '删除成功',
                      func: () => {
                        this.getList(1);
                      }
                    })
                    break;
                  default:
                    // res.message?(param.state?this.$store.commit('alertFn',{
                    //     type:'error',
                    //     text:res.message
                    // }):this.$store.commit('confirmFn',{
                    //     type:'warn',
                    //     text:res.message
                    // })):null;
                    res.message ? this.$store.commit('alertFn', {
                      type: 'error',
                      text: res.message
                    }) : null;
                }
              })
            },
            text: '确认删除此部门吗？'
          })
          break;
      }
    },
  },
  created () {
    this.getDropData();
    this.getList();
  },
}
</script>

<style scoped>
.fillBox .boxTable {
  height: 100%;
  padding-bottom: 0;
}
.boxTable {
  position: relative;
  /* min-height: 594px; */
  padding-bottom: 40px;
  box-sizing: border-box;
}
</style>
<style>
.departmentMng .boxTable .el-table__header-wrapper table th:nth-child(1) {
  padding-left: 24px;
}
</style>
