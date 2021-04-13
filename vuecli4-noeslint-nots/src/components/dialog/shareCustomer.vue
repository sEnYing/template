<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-05-19 15:49:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-13 10:29:23
--> 
<template>
  <div class="customerManage_share_dialog">
    <div class="el-dialog__body">
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item, index) in showList"
                  :key="index">
              {{
              item
              }}
            </span>
          </div>
        </div>
        <div class="project">
          <div>
            <span>共享IDC项目：</span>
          </div>
          <div>
            <span>
              {{data.item.projName}}
            </span>
          </div>
        </div>
        <div class="share">
          <div>
            <span>
              <i class="must">*</i>共享给：
            </span>
          </div>
          <div>
            <span v-for="(item, index) of shareToName"
                  :key="index">{{ index==0?item:'、'+item }}</span>
          </div>
        </div>
        <div class="tree">
          <el-input v-model="filterText"
                    suffix-icon="iconfont icon-fangdajing"></el-input>
          <el-tree class="filter-tree"
                   :data="treeData"
                   node-key="id"
                   show-checkbox
                   :default-expanded-keys="defaultExpandedKeys"
                   :filter-node-method="filterNode"
                   :default-checked-keys="defaultCheckedKeys"
                   @check="chooseTree"
                   ref="treeShare">
          </el-tree>
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
  name: 'shareCustomer',
  props: ['data'],
  inject: ['close'],
  watch: {
    filterText(val) {
      this.$refs.treeShare ? this.$refs.treeShare.filter(val) : null
    },
  },
  data() {
    return {
      ajaxIng: false,
      textarea: '',
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      treeData: [],
      filterText: '',
      shareToName: [],
      shareToId: [],
      showList: [],
      allot: [],
      staffId: [],
    }
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {}
      let json = userInfo.info && userInfo.info.staff ? userInfo.info.staff : {}
      let depLevel = []
      if (
        Object.prototype.toString.call(json.department) === '[object Array]'
      ) {
        json.department.map(v => {
          depLevel.push(v.depLevel)
        })
      } else if (
        Object.prototype.toString.call(json.department) === '[object Object]'
      ) {
        depLevel.push(json.department.depLevel)
      }
      json.depLevel = depLevel
      return json
    },
  },
  methods: {
    submitClick() {
      if (!this.textarea) {
        this.$store.commit('alertFn', {
          text: '请输入原因描述！',
          type: 'error',
        })
        return
      }
      if (this.userInfo.resourceType == '02') {
        console.log(this.shareToId)
        if (this.shareToId.length > 0) {
          this.data.cb2({
            shareToName: this.shareToName,
            shareToId: this.shareToId,
            textarea: this.textarea,
          })
        } else {
          this.$store.commit('alertFn', {
            text: '请选择共享人！',
            type: 'error',
          })
        }
      } else {
        if (this.ajaxIng) return
        this.ajaxIng = true
        this.$api.service.IDCproject.share(
          {
            projId: this.data.item.projId,
            staffList: this.shareToId,
            description: this.textarea,
            allot: this.allot,
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
      }
    },
    chooseTree(data, node, self) {
      let _this = this
      _this.shareToId = []
      _this.shareToName = []
      var a = function(val) {
        val.map(item => {
          if (item.children != null) {
            a(item.children)
          } else {
            if (item.id != _this.owner) {
              console.log(item)
              _this.shareToId.push(JSON.parse(JSON.stringify(item.id)))
              _this.shareToName.push(JSON.parse(JSON.stringify(item.label)))
            } else {
              this.$message({
                showClose: true,
                message: '不能共享给自己!',
                type: 'error',
              })
            }
          }
        })
      }
      a(this.$refs.treeShare.getCheckedNodes())
      let removePersonChooseItem = function(ar) {
        var ret = []
        for (var i = 0, j = ar.length; i < j; i++) {
          if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i])
          }
        }
        _this.shareToId = JSON.parse(JSON.stringify(ret))
        return _this.shareToId
      }
      let removeShareToItem = function(ar) {
        var ret = []
        for (var i = 0, j = ar.length; i < j; i++) {
          if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i])
          }
        }
        _this.shareToName = JSON.parse(JSON.stringify(ret))
        return _this.shareToName
      }
      removePersonChooseItem(_this.shareToId)
      removeShareToItem(_this.shareToName)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getTreeData() {
      let self = this
      await this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: '02,05,07' },
        res => {
          this.treeData = res.data
          this.setTreeDisabled(this.treeData)
        },
      )
    },
    getDetail() {
      this.defaultCheckedKeys = []
      this.defaultExpandedKeys = []
      this.showList.push(this.data.item.customerName)
      this.data.item.shareStaffList.map(i => {
        if (this.data.item.owner != i.staffId) {
          this.shareToName.push(i.staffName)
          this.shareToId.push(i.staffId)
        }
      })
      this.defaultCheckedKeys = JSON.parse(JSON.stringify(this.shareToId))
      this.defaultExpandedKeys = JSON.parse(JSON.stringify(this.shareToId))
      if (this.defaultExpandedKeys && this.defaultExpandedKeys.length === 0) {
        this.defaultExpandedKeys.push('root')
      }
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
    this.getDetail()
  },
}
</script>

<style scoped>
.customerManage_share_dialog .el-dialog__body .project > div:nth-child(1),
.customerManage_share_dialog .el-dialog__body .share > div:nth-child(1),
.customerManage_share_dialog .el-dialog__body .name > div:nth-child(1),
.customerManage_share_dialog .el-dialog__body .discription > div:nth-child(1) {
  flex: 20%;
}
.dialog__footer {
  text-align: center;
  margin-top: 30px;
}
</style>