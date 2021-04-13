<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-05-19 11:41:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-19 12:04:10
--> 
<template>
  <div class="myApply_check_dialog">
    <div class="el-dialog__body">
      <div class="content_top">
        <div>
          <div>
            <span>申请类型：</span>
            <span>{{ message.processTypeTxt }}</span>
          </div>
          <div>
            <span>申请人：</span>
            <span>{{ message.applyUserName }}</span>
          </div>
          <div v-if="message.processType !='3'">
            <span>申请时间：</span>
            <span>{{ message.createTime }}</span>
          </div>
        </div>
        <div v-if="message.processType =='3'">
          <span>申请时间：</span>
          <span>{{ message.createTime }}</span>
        </div>
        <div>
          <div style="margin-bottom: 15px">
            <span style="margin-left: 14px">{{ message.processTypeTxt }}给：</span>
            <span v-if="message.staffList&&message.staffList.length>0">
              <span v-for="(item, index) of message.staffList"
                    :key="index"
                    :class="item.flag == '1'?'addColor':(item.flag == '2'?'delColor':'')">{{ item.staffName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </span>
            <span v-else-if="message.processType == '1' && message.projList && message.projList.length>0">
              <span v-for="(item, index) of message.projList"
                    :key="index"
                    :class="item.flag == '1'?'addColor':(item.flag == '2'?'delColor':'')">
                {{ item.ownerName }}
              </span>
            </span>
            <span v-else-if="message.processType == '3'">
              <span v-for="(item, index) of message.projList[0].allot"
                    :key="index"
                    :class="item.flag == '1'?'addColor':(item.flag == '2'?'delColor':'')">{{ item.staffName }}
              </span>
            </span>
          </div>
          <div>
            <span>申请状态：</span>
            <span>{{ message.processStatusTxt }}</span>
          </div>
        </div>
        <div>
          <span>申请原因：</span>
        </div>
        <div>
          <span style="margin: 2px 0 10px 30px;display:inline-block;width: 100%;line-height:1.5">
            {{
            message.applyReason
            }}
          </span>
        </div>
        <div v-if="message.processStatus == '3'">
          <span>不通过原因：</span>
        </div>
        <div style="width: 100%;padding-right:30px;box-sizing: border-box"
             v-if="message.processStatus == '3'">
          <span style="margin: 2px 0 10px 30px;display:inline-block;width: 100%;line-height:1.5">
            {{
            message.suggestion
            }}
          </span>
        </div>
      </div>
      <div class="content_bottom">
        <div v-for="(item, index) of message.customerList"
             :key="index"
             class="customerMessage">
          <span style="font-weight: 800">客户名称：</span>
          <span style="font-weight: 800">{{ item.customerName }}</span>
        </div>
        <div v-for="(item, index) of message.projList"
             :key="index"
             class="projectMessage">
          <span>项目名称:</span>
          <span>{{ item.projName }}</span>
          <div>
            <span v-if="item.allot&&item.allot.length>0">分配比例详情：</span>
            <div class="allot">
              <span v-for="(item,index) of item.allot"
                    :key="index">{{ item.staffName }}&nbsp;&nbsp;{{item.percent}}%</span>
            </div>
          </div>
        </div>
        <div v-for="(item, index) of message.contactList"
             :key="index"
             style="margin-bottom: 18px"
             class="peopleMessage">
          <div>
            <span>联系人名称：</span>
            <span>{{ item.contactName }}</span>
          </div>
          <div>
            <span>联系电话：</span>
            <span>{{ item.telephone }}</span>
          </div>
          <div>
            <span>职务：</span>
            <span>{{ item.position }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="el-dialog__footer">
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </div>
  </div>

</template>

<script>
import '../../../static/css/customerManage.css'
export default {
  name: 'checkMyApply',
  props: ['data'],
  inject: ['close'],
  data() {
    return {
      message: '',
    }
  },
  created() {
    this.$emit('ok')
    this.message = JSON.parse(JSON.stringify(this.data.item))
    console.log(this.message)
  },
}
</script>

<style>
.addColor {
  color: green;
}
.delColor {
  text-decoration: line-through;
  color: red;
}
</style>