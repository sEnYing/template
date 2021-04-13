<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-07-13 10:17:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-13 10:50:33
--> 
<template>
  <div class="customerManage_transfers_dialog">
    <div class="el-dialog__body">
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span>
              {{ data.item.customerName }}
            </span>
          </div>
        </div>
        <div class="project">
          <div>
            <span>转移IDC项目：</span>
          </div>
          <div>
            <div>
              <span>{{data.item.projName}}</span>
            </div>
          </div>
        </div>
        <div class="transfer">
          <div>
            <span>
              <i class="must">*</i>转移给：
            </span>
            <span>{{shareToName[0]}}</span>
          </div>
          <div style="margin-top: 30px">
            <el-input v-model="filterText"
                      suffix-icon="iconfont icon-fangdajing"></el-input>
            <el-tree class="filter-tree"
                     :data="treeData"
                     node-key="id"
                     show-checkbox
                     :default-expanded-keys="['root']"
                     :filter-node-method="filterNode"
                     @check="chooseTree"
                     ref="tree">
            </el-tree>
          </div>
        </div>
        <div class="discription">
          <div>
            <span>
              <i class="must">*</i>原因描述：
            </span>
          </div>
          <div>
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea"
                      maxlength="200"
                      show-word-limit></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog__footer">
      <span slot="footer"
            class="dialog-footer">
        <unit-btn @click="submitClick"
                  :loading='ajaxIng'
                  text='提交'></unit-btn>
        <unit-btn @click="close"
                  type="plain"
                  text='取消'></unit-btn>
      </span>
    </div>
  </div>

</template>

<script>
export default {
  name: 'transferCustomer',
  props: ['data'],
  inject: ['close'],
  watch: {
    filterText(val) {
      this.$refs.tree ? this.$refs.tree.filter(val) : null
    },
  },
  data() {
    return {
      ajaxIng: false,
      textarea: '',
      treeData: [],
      filterText: '',
      shareToName: [],
      shareToId: [],
    }
  },
  methods: {
    submitClick() {
      if (this.shareToId.length === 0) {
        this.$store.commit('alertFn', {
          text: '请选择转移人！',
          type: 'error',
        })
        return
      }
      if (!this.textarea) {
        this.$store.commit('alertFn', {
          text: '请输入原因描述！',
          type: 'error',
        })
        return
      }
      if (this.ajaxIng) return
      this.ajaxIng = true
      var projList = [this.data.item.projId]
      this.$api.service.IDCproject.transfer(
        {
          projList,
          staffId: this.shareToId[0],
          description: this.textarea,
        },
        res => {
          this.ajaxIng = false
          switch (res.code) {
            case '0':
              this.$store.commit('alertFn', {
                type: 'success',
                text: '操作成功',
                func: () => {
                  this.close()
                  this.$emit('success')
                  this.data.cb()
                },
              })
              break
            default:
              res.message
                ? this.$store.commit('alertFn', {
                    type: 'error',
                    text: res.message,
                  })
                : null
          }
        },
      )
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    chooseTree(data, node, self) {
      if (data.accountId != null && data.disabled != true) {
        this.shareToId = this.shareToId.indexOf(data.id) > -1 ? [] : [data.id]
        this.shareToName =
          this.shareToName.indexOf(data.label) > -1 ? [] : [data.label]
      }
      this.$refs.tree.setCheckedKeys(this.shareToId)
    },
    async getTreeData() {
      let self = this
      this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: '02,05,07' },
        res => {
          this.treeData = res.data
          this.setTreeDisabled(this.treeData)
        },
      )
    },
    setTreeDisabled(val) {
      const data = [this.data.item]
      val.map(item => {
        if (item.children != null) {
          this.setTreeDisabled(item.children)
        } else if (item.accountId) {
          item.disabled = false
          if (data != undefined && data != null && data.length > 0) {
            data.map(val => {
              item.id == val.owner ? (item.disabled = true) : ''
            })
          }
        } else {
        }
      })
    },
  },
  created() {
    this.$emit('ok')
    this.getTreeData()
  },
}
</script>

<style scoped>
.customerManage_transfers_dialog .el-dialog__body .project > div:nth-child(1),
.customerManage_transfers_dialog .el-dialog__body .transfer > div:nth-child(1),
.customerManage_transfers_dialog .el-dialog__body .name > div:nth-child(1),
.customerManage_transfers_dialog
  .el-dialog__body
  .discription
  > div:nth-child(1) {
  flex: 20%;
}
.customerManage_transfers_dialog .el-dialog__body .transfer > div:nth-child(1) {
  left: 90px;
}
.dialog__footer {
  text-align: center;
  margin-top: 30px;
}
</style>