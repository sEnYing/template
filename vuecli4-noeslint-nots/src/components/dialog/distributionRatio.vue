<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-05-19 12:09:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-19 14:43:46
--> 
<template>
  <div class="customerManage_admin_dialog">
    <div class="el-dialog__body">
      <div>
        <h1>项目名称：{{ message.projName }}</h1>
        <div class="content">
          <div>
            <span>分配比例：</span>
          </div>
          <div class="content_right">
            <div v-for="(item, index) of staffListName"
                 :key="index">
              <span>{{ item }}</span>
              <el-input v-model="inputData[index]"
                        @input="checkInput(index)"></el-input>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="el-dialog__footer">
      <span slot="footer"
            class="dialog-footer">
        <unit-btn type="primary"
                  :loading="loading"
                  text="确 定"
                  @click="submitAdmin"></unit-btn>
        <unit-btn type="plain"
                  @click="close"
                  text="取 消"></unit-btn>
      </span>
    </div>
  </div>
</template>

<script>
import '../../../static/css/customerManage.css'
export default {
  name: 'distributionRatio',
  props: ['data'],
  inject: ['close'],
  data() {
    return {
      message: this.data.item,
      staffListName: [],
      staffList: [],
      projectList: [],
      inputData: [],
      loading: false,
      allot: [],
    }
  },
  methods: {
    submitAdmin() {
      if (this.loading) {
        return
      }
      this.projectList = []
      this.allot = []
      if (this.staffListName.length != this.inputData.length) {
        this.$message({
          showClose: true,
          message: '请为所有人员分配比例',
          type: 'error',
        })
        return
      } else {
        var a = 0
        this.inputData.map(item => {
          a += parseInt(item)
        })
        if (a != 100) {
          this.$message({
            showClose: true,
            message: '分配比例总和应为100%',
            type: 'error',
          })
          return
        } else {
          this.projectList.push(this.message.projId)
          for (var j = 0; j < this.projectList.length; j++) {
            for (var i = 0; i < this.inputData.length; i++) {
              this.allot.push({
                projId: this.message.projId,
                staffId: this.staffList[i],
                percent: this.inputData[i],
              })
            }
          }
          this.loading === true
          this.$api.service.IDCproject[
            this.data.item.meta === 'share' ? 'share' : 'amountallot'
          ](
            {
              projId: this.message.projId,
              staffList: this.data.d.shareToId,
              description: this.data.d.textarea,
              allot: this.allot,
            },
            res => {
              this.loading === false
              if (res.code === '0') {
                this.$emit('close')
                this.$store.commit('alertFn', {
                  type: 'success',
                  text: '操作成功',
                  func: () => {
                    this.$emit('success')
                    this.data.cb()
                  },
                })
              } else {
                res.message
                  ? this.$message({
                      message: res.message,
                      type: 'error',
                    })
                  : null
              }
            },
          )
        }
      }
    },
    checkInput(index) {
      this.inputData[index] = this.inputData[index].replace(
        /^0*(0\.|[1-9])/,
        '$1',
      )
      this.inputData[index] = this.inputData[index].replace(/[^\d]/g, '') //清除"数字"以外的字符
      this.inputData[index] = this.inputData[index].replace(/^\./g, '') //验证第一个字符是数字而不是字符
      this.inputData[index] =
        this.inputData[index].indexOf('.') > 0
          ? this.inputData[index].split('.')[0].substring(0, 10) +
            '.' +
            this.inputData[index].split('.')[1]
          : this.inputData[index].substring(0, 3)
      if (parseFloat(this.inputData[index]) > 100) {
        this.inputData[index] = '100'
      }
      if (parseFloat(this.inputData[index]) == 0) {
        this.inputData[index] = '0'
      }
      return this.inputData[index]
    },
    getData() {
      this.staffList = []
      this.staffListName = []
      if (this.data.item && this.data.d) {
        this.staffList = JSON.parse(JSON.stringify(this.data.d.shareToId))
        this.staffListName = JSON.parse(JSON.stringify(this.data.d.shareToName))
        this.staffList.push(this.data.item.owner)
        this.staffListName.push(this.data.item.ownerName)
      }
    },
  },
  created() {
    this.$emit('ok')
    this.getData()
    if (
      this.staffList &&
      this.staffList.length > 0 &&
      this.data.item.allot &&
      this.data.item.allot.length > 0 &&
      this.data.item.meta === 'amountallot'
    ) {
      this.staffList.map(item => {
        this.data.item.allot.map(i => {
          if (item === i.staffId) {
            this.inputData.push(i.percent)
          }
        })
      })
    }
  },
}
</script>

<style>
</style>