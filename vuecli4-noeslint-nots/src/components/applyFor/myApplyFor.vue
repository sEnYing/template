<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="staff_icon"></i>
      <span>我的申请</span>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="boxTable">
            <unit-loading :loading="loading" v-if="loading"></unit-loading>
            <el-table
              :data="tableData"
              style="width: 100%; color: #636980; fontsize: 14px"
              :header-cell-style="{
                background: 'rgba(241,244,251,1)',
                color: '#5D6680',
              }"
            >
              <el-table-column label="序号" width="50">
                <template scope="scope">
                  <span>{{
                    scope.$index + (page.currentPage - 1) * page.pageSize + 1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, i) in thData"
                :key="i"
                :label="item.label"
                :prop="item.prop"
                :style="{ background: '#fff' }"
                :min-width="item.width ? item.width : null"
                :width="setWidth(item.label)"
                :align="item.align ? item.align : 'left'"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="item.prop == 'applyCustomerName'">
                    {{
                      scope.row["applyCustomerName"]
                        ? scope.row["applyCustomerName"]
                        : scope.row["applyContactName"]
                        ? scope.row["applyContactName"]
                        : scope.row["applyProjName"]
                    }}
                  </div>
                  <div v-else>{{ scope.row[item.prop] }}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="left">
                <template slot-scope="scope">
                  <el-button
                    style="padding: 3px 0"
                    @click="check(scope.row)"
                    type="text"
                    >查看</el-button
                  >
                  <el-button
                    style="padding: 3px 0"
                    @click="edit(scope.row, scope)"
                    type="text"
                    v-if="
                      scope.row.processStatus == '3' ||
                      scope.row.processStatus == '5'
                    "
                    >修改</el-button
                  >
                  <el-button
                    style="padding: 3px 0"
                    @click="del(scope.row)"
                    type="text"
                    v-if="
                      scope.row.processStatus == '3' ||
                      scope.row.processStatus == '5'
                    "
                    >删除</el-button
                  >
                  <el-button
                    style="padding: 3px 0"
                    @click="back(scope.row, scope.$index)"
                    type="text"
                    v-if="
                      scope.row.processStatus == '0' ||
                      scope.row.processStatus == '6'
                    "
                    >撤回</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pageBox">
              <div>
                <el-pagination
                  layout="prev, pager, next, total, sizes"
                  :total="page.total"
                  :page-size="page.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :current-page="page.currentPage"
                  @current-change="currentChange"
                  @size-change="handleSizeChange"
                  prev-text="上一页"
                  next-text="下一页"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="580px"
      append-to-body
      custom-class="myApply_edit_dialog"
      @close="cancel('edit')"
    >
      <span slot="title" class="dialog_header">
        <h1>{{ message.processTypeTxt }}{{ message.applyTypeTxt }}</h1>
      </span>
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>

          <div v-if="message.applyType == '3'">
            <div v-for="(item, index) of message.projList" :key="index">
              <span>{{ item.customerName }}</span>
            </div>
          </div>
          <div v-else-if="message.applyType == '1'">
            <div v-for="(item, index) of message.customerList" :key="index">
              <span>{{ item.customerName }}</span>
            </div>
          </div>
          <div v-else>
            <div v-for="(item, index) of message.contactList" :key="index">
              <span>{{ item.orgName }}</span>
            </div>
          </div>
        </div>
        <div
          class="project"
          v-if="
            message.projList !== undefined &&
            message.projList !== null &&
            message.projList.length > 0
          "
        >
          <div>
            <span>{{ message.processTypeTxt }}项目：</span>
          </div>
          <div v-if="message.applyType == '3'">
            <div v-for="(item, index) of message.projList" :key="index">
              <span>{{ item.projName }}</span>
            </div>
          </div>
        </div>
        <div
          class="contact"
          v-if="
            message.processType != '1' &&
            message.contactList !== undefined &&
            message.contactList !== null &&
            message.contactList.length > 0 &&
            message.applyType == '2'
          "
        >
          <div>
            <span>{{ message.processTypeTxt }}联系人：</span>
          </div>
          <div v-if="message.applyType != '2'">
            <div>
              <el-checkbox-group v-model="checkTelList" @change="telChange">
                <el-checkbox
                  v-for="(item, index) of message.contactList"
                  :key="index"
                  :label="item.contactList"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-if="message.applyType == '2'">
            <div v-for="(item, index) of message.contactList" :key="index">
              <span>{{ item.contactName }}</span>
            </div>
          </div>
        </div>
        <div class="second">
          <div>
            <span><i class="must">*</i>{{ message.processTypeTxt }}给：</span>
          </div>
          <div>
            <span v-for="(item, index) of shareTo" :key="index">{{
              index == 0 ? item : "、" + item
            }}</span>
          </div>
        </div>
        <div class="tree">
          <el-input
            v-model="filterText"
            suffix-icon="iconfont icon-fangdajing"
          ></el-input>

          <el-tree
            class="filter-tree"
            :data="treeData"
            node-key="id"
            show-checkbox
            :default-expanded-keys="['root']"
            :filter-node-method="filterNode"
            :default-checked-keys="defaultCheckedKeys"
            @check="chooseTree"
            ref="tree"
          >
          </el-tree>
        </div>

        <div class="discription">
          <div>
            <span><i class="must">*</i>原因描述：</span>
          </div>
          <div>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick">提 交</el-button>
        <el-button @click="cancel('edit')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleAdmin"
      width="580px"
      append-to-body
      custom-class="customerManage_admin_dialog"
      @close="cancel('admin')"
    >
      <div v-for="(item, index) of message.projList" :key="index">
        <h1>项目名称：{{ item.projName }}</h1>
        <div class="content">
          <div>
            <span>分配比例：</span>
          </div>
          <div class="content_right">
            <div v-for="(item, index) of staffListName" :key="index">
              <span>{{ item }}</span>
              <el-input
                v-model="inputData[index]"
                @input="checkInput(index)"
              ></el-input>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick">确 定</el-button>
        <el-button @click="cancel('admin')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/font/customerManage/iconfont.css";
export default {
  data() {
    return {
      filterText: "",
      treeData: [],
      personChoose: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      loading: true,
      tableData: [],
      thData: [
        { number: 1, prop: "applyTypeTxt", label: "对象类型" },
        { number: 2, prop: "applyCustomerName", label: "对象名称" },
        { number: 3, prop: "createTime", label: "申请时间" },
        { number: 4, prop: "processTypeTxt", label: "申请类型" },
        { number: 5, prop: "processStatusTxt", label: "申请状态" },
      ],
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      message: "",
      dialogVisible: false,
      dialogVisibleAdmin: false,
      showAll: false,
      staffListName: [],
      staffList: [],
      shareTo: [],
      textarea: "",
      Atextarea: "",
      defaultExpandedKeys: "",
      defaultCheckedKeys: [],
      checkTelList: [],
      TelList: [],
      projectList: [],
      allot: [],
      inputData: [],
      data: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    word: function () {
      if (this.showAll == false) {
        //对文字进行处理
        return "展开";
      } else {
        return "收起";
      }
    },
  },

  methods: {
    submitClick() {
      if (this.dialogVisibleAdmin == true) {
        this.$pubfunc.fnThrottle(this.submitAdmin, 500, 500)();
      } else {
        this.$pubfunc.fnThrottle(this.submit, 500, 500)();
      }
    },

    telChange(val) {
      this.TelList = [];
      this.checkTelList.map((item) => {
        this.message.contactList.map((it) => {
          if (item == it.contactName) {
            this.TelList.push(it.contactId);
          }
        });
      });
    },
    async getTreeData() {
      let self = this;
      // this.$api.bgmgnt.department.getDepTreeData({}, res => {
      //   this.treeData = res.data;
      //   // console.log(this.treeData);
      //   this.defaultExpandedKeys = this.treeData[0].depId;
      //   var a = function (val) {
      //     val.map(item => {
      //       if (item.children != null) {
      //         item.leaf = false;
      //         a(item.children);
      //       } else {
      //         item.leaf = false;
      //         self.$api.bgmgnt.staff.getstaffTreeData(
      //           { depId: item.depId, resourceType: '02,05,07' },
      //           res => {
      //             // console.log(res);
      //             item.children = res.data.list ? res.data.list : [];
      //             if (item.children != null) {
      //               item.children.map(item => {
      //                 item.leaf = true;
      //                 item.depId ? null : item.depId = item.staffId
      //                 item.label = item.staffName;
      //                 item.icon = "people";
      //               });
      //             }
      //             return item;
      //           }
      //         );
      //       }
      //     });
      //   };
      //   a(this.treeData);
      // });
      this.$api.bgmgnt.staff.getstaffTreeData(
        { resourceType: "02,05,07" },
        (res) => {
          this.treeData = res.data;
        }
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    setTreeDisabled(val) {
      val.map((item) => {
        if (item.children != null && item.children.length > 0) {
          this.setTreeDisabled(item.children);
        } else if (item.accountId != null) {
          // if (this.data != undefined && this.data != null && this.data.length > 0) {
          // console.log(this.data);
          // this.data.map(val => {
          //   item.id == val.applyUser ? item.disabled = true : ''
          // })
          // }
          // console.log(this.data[0].projList[0].owner);
          // console.log(this.data[0].applyType);
          if (this.data && this.data[0].applyType == "3") {
            item.id == this.data[0].projList[0].owner
              ? (item.disabled = true)
              : "";
          } else if (this.data && this.data[0].applyType == "2") {
            item.id == this.data[0].contactList[0].owner
              ? (item.disabled = true)
              : "";
          } else if (this.data && this.data[0].applyType == "1") {
            item.id == this.data[0].customerList[0].owner
              ? (item.disabled = true)
              : "";
          }
        } else {
        }
      });
    },

    chooseTree(data, node, self) {
      let _this = this;
      // console.log(data);

      if (this.message.processType == "1") {
        if (data.accountId != null && data.disabled != true) {
          this.personChoose =
            this.personChoose.indexOf(data.id) > -1 ? [] : [data.id];
          this.shareTo =
            this.shareTo.indexOf(data.label) > -1 ? [] : [data.label];
        }
        this.$refs.tree.setCheckedKeys(this.personChoose);
      } else {
        // 递归循环
        _this.personChoose = [];
        _this.shareTo = [];
        _this.staffListName = _this.staffListName.splice(0, 1);
        _this.staffList = _this.staffList.splice(0, 1);
        var a = function (val) {
          val.map((item) => {
            if (item.children != null) {
              a(item.children);
            } else {
              if (item.id) {
                if (item.id == _this.$store.state.userInfo.info.staff.staffId) {
                  this.$message({
                    message: "不能选择所有者",
                    type: "error",
                  });
                  return;
                } else {
                  _this.personChoose.push(item.id);
                  _this.shareTo.push(item.label);
                }
              }
            }
          });
        };
        a(this.$refs.tree.getCheckedNodes());
        let removePersonChooseItem = function (ar) {
          var ret = [];
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i]);
            }
          }
          _this.personChoose = ret;
          return _this.personChoose;
        };
        let removeShareToItem = function (ar) {
          var ret = [];
          for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
              ret.push(ar[i]);
            }
          }
          _this.shareTo = ret;
          return _this.shareTo;
        };
        removePersonChooseItem(_this.personChoose);
        removeShareToItem(_this.shareTo);
      }
      _this.shareTo.map((item) => {
        this.staffListName.push(item);
      });
      _this.personChoose.map((item) => {
        this.staffList.push(item);
      });
    },
    setWidth(str) {
      if (str === "对象类型") {
        return "150px";
      } else {
        return;
      }
    },
    del(row) {
      this.$confirm("确定删除该申请吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "customerManage_messageBox",
        iconClass: "iconfont icon-gantanhao-sanjiaokuang",
      })
        .then(() => {
          // 删除项接口
          this.$api.service.myApply[
            row.processType === "4" ? "deleteResource" : "getDelete"
          ]({ processId: row.processId }, (res) => {
            if (res.code == "0") {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.getList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          });
          this.tableData.splice(row, 1);
        })
        .catch(() => {
          this.dialogVisible = false;
        });
    },

    back(val, index) {
      this.$confirm("确定撤回该申请吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "customerManage_messageBox",
        iconClass: "iconfont icon-gantanhao-sanjiaokuang",
      })
        .then(() => {
          // 删除项接口
          this.$api.service.myApply[
            val.processType === "4" ? "backResource" : "getBack"
          ]({ processId: val.processId }, (res) => {
            if (res.code == "0") {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.getList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          });
          // this.tableData.splice(index, 1);
        })
        .catch(() => {
          this.dialogVisible = false;
        });
    },
    edit(val, s) {
      if (val.processType !== "4") {
        this.shareTo = [];
        this.personChoose = [];
        this.staffListName = [];
        this.staffList = [];
        this.data = [];
        this.$api.service.myApply.getDetail(
          { processId: val.processId },
          (res) => {
            this.message = res.data;
            this.data.push(this.message);
            this.setTreeDisabled(this.treeData);
            this.message.staffList.map((item) => {
              if (this.message.applyUser != item.staffId && item.flag != "2") {
                this.shareTo.push(item.staffName);
                this.personChoose.push(item.staffId);
              }
            });
            if (
              this.message.applyType == "3" &&
              this.message.processType == "1"
            ) {
              if (this.message.projList && this.message.projList.length > 0) {
                this.message.projList[0].allot.map((item) => {
                  this.shareTo.push(item.staffName);
                  this.personChoose.push(item.staffId);
                });
              }
            }
            this.defaultCheckedKeys = this.personChoose;
            if (this.message.processType == "1") {
              this.defaultExpandedKeys = this.personChoose[0];
            }
            // console.log(this.message);
            if (this.message.processType == "3") {
              this.message.projList[0].allot.map((item) => {
                this.staffListName.push(item.staffName);
                this.staffList.push(item.staffId);
                this.inputData.push(item.percent);
                item.staffId != this.message.projList[0].owner
                  ? this.personChoose.push(item.staffId)
                  : "";
              });
              // console.log(this.personChoose);
              this.Atextarea = this.message.applyReason;
              this.dialogVisibleAdmin = true;
            } else {
              this.textarea = this.message.applyReason;
              this.dialogVisible = true;
            }
          }
        );
      } else {
        val.type = "apply";
        val.isEdit = true;
        this.$router.push({
          path: "/myapply/resourceProcess",
          query: val,
        });
      }

      // this.message = val;
    },
    submit() {
      if (!this.personChoose || this.personChoose.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择共享或转移人",
          type: "error",
        });
        return;
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: "请填写申请原因描述",
          type: "error",
        });
        return;
      }
      let userInfo = this.$store.state.userInfo;
      if (
        userInfo.info.staff.resourceType == "02" &&
        this.message.applyType == "3" &&
        this.message.projList.length > 0
      ) {
        this.staffListName = this.shareTo;
        this.staffList = this.personChoose;
        if (
          this.staffList.indexOf(userInfo.info.staff.staffId) < 0 &&
          userInfo.info.staff.resourceType != "02"
        ) {
          this.staffListName.push(userInfo.info.staff.staffName);
          this.staffList.push(userInfo.info.staff.staffId);
        }
        this.Atextarea = this.textarea;
        this.dialogVisible = false;
        this.dialogVisibleAdmin = true;
      } else {
        var customerList = [];
        var contactList = [];
        var projList = [];
        if (this.message.applyType == "1") {
          this.message.customerList.map((item) => {
            customerList.push(item.customerId);
          });
        }
        if (this.message.applyType == "2") {
          this.message.contactList.map((item) => {
            contactList.push(item.contactId);
          });
        }
        if (this.message.applyType == "3") {
          this.message.projList.map((item) => {
            projList.push(item.projId);
          });
        }
        this.$api.service.myApply.update(
          {
            processId: this.message.processId,
            customerId:
              this.message.applyType == "1"
                ? this.message.customerList[0].customerId
                : "",
            contactId:
              this.message.applyType == "2"
                ? this.message.contactList[0].contactId
                : "",
            projId:
              this.message.applyType == "3"
                ? this.message.projList[0].projId
                : "",
            customerList: this.message.applyType == "1" ? customerList : [],
            contactList: this.message.applyType == "2" ? contactList : [],
            projList: this.message.applyType == "3" ? projList : [],
            staffList: this.personChoose,
            staffId:
              this.message.processType == "1" ? this.personChoose[0] : "",
            description: this.textarea,
          },
          (res) => {
            if (res.code == "0") {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.cancel("edit");
              this.getList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
              this.cancel("edit");
            }
          }
        );
      }
    },

    submitAdmin() {
      if (this.staffListName.length != this.inputData.length) {
        this.$message({
          showClose: true,
          message: "请为所有人员分配比例",
          type: "error",
        });
        return;
      } else {
        var a = 0;
        this.inputData.map((item) => {
          a += parseInt(item);
        });
        if (a != 100) {
          this.$message({
            showClose: true,
            message: "分配比例总和应为100%",
            type: "error",
          });
          return;
        } else {
          this.projectList.push(this.message.projList[0].projId);
          for (var j = 0; j < this.message.projList.length; j++) {
            for (var i = 0; i < this.inputData.length; i++) {
              this.allot.push({
                projId: this.projectList[0],
                staffId: this.staffList[i],
                percent: this.inputData[i],
              });
            }
          }
          this.$api.service.myApply.update(
            {
              processId: this.message.processId,
              projId: this.message.projList[0].projId,
              projList: this.projectList,
              staffList: this.personChoose,
              description: this.Atextarea,
              allot: this.allot,
            },
            (res) => {
              if (res.code == "0") {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this.cancel("admin");
                this.getList();
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
            }
          );
        }
      }
    },
    cancel(key) {
      this.shareTo = [];
      this.filterText = "";
      this.personChoose = [];
      this.checkNodes = [];
      this.checkTelList = [];
      this.inputData = [];
      this.textarea = "";
      this.allot = [];
      switch (key) {
        case "edit":
          this.dialogVisible = false;
          break;
        case "admin":
          this.dialogVisible = false;
          this.dialogVisibleAdmin = false;
          this.Atextarea = "";
          break;
      }
      this.$refs.tree ? this.$refs.tree.setCheckedNodes([]) : "";
    },
    refresh() {
      this.$route.params.processId = "";
    },
    check(row) {
      if (row.processType !== "4") {
        // 查看详情接口
        this.$api.service.myApply.getDetail(
          { processId: row.processId },
          (res) => {
            switch (res.code) {
              case "0":
                this.message = res.data;
                this.message.staffList && this.message.staffList.length > 0
                  ? this.message.staffList.forEach((item, index) => {
                      if (
                        this.message.applyType == "1" &&
                        this.message.processStatus !== "2"
                      ) {
                        if (
                          item.staffId == this.message.customerList[0].owner
                        ) {
                          this.message.staffList.splice(index, 1);
                        }
                      }
                      if (this.message.applyType == "2") {
                        if (item.staffId == this.message.contactList[0].owner) {
                          this.message.staffList.splice(index, 1);
                        }
                      }
                      if (this.message.applyType == "3") {
                        if (item.staffId == this.message.projList[0].owner) {
                          this.message.staffList.splice(index, 1);
                        }
                      }
                    })
                  : null;
                if (this.message.processStatus == "3") {
                  this.message.taskList.map((item) => {
                    item.suggestion
                      ? (this.message.suggestion = item.suggestion)
                      : "";
                  });
                }
                const item = this.message;
                this.$emit("dialog", {
                  show: true,
                  small: true,
                  link: "checkMyApply",
                  title: `${this.message.processTypeTxt}申请详情`,
                  data: { item },
                });

                break;
              default:
                res.message
                  ? this.$store.commit("alertFn", {
                      text: res.message,
                      type: "error",
                    })
                  : null;
            }
          }
        );
      } else {
        row.type = "apply";
        row.isEdit = false;
        this.$router.push({
          path: "/myapply/resourceProcess",
          query: row,
        });
      }
    },

    getList() {
      // 获取列表接口
      this.loading = true;
      this.$store.commit("pageFn", {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      });
      this.$api.service.myApply.getApplyList(
        { page: this.page.currentPage, limit: this.page.pageSize },
        (res) => {
          this.tableData = res.data.list;
          this.loading = false;
          this.page.total = res.data.total;
        }
      );
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList(val);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    jump() {
      if (
        this.$route.params.processId !== undefined &&
        this.$route.params.processId !== null
      ) {
        var id = this.$route.params.processId;
        this.$api.service.myApply.getDetail({ processId: id }, (res) => {
          if (res.code == "0") {
            this.message = res.data;
            const item = this.message;
            this.$emit("dialog", {
              show: true,
              link: "checkMyApply",
              small: true,
              title: `${this.message.processTypeTxt}申请详情`,
              data: { item },
            });
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      }
    },

    checkInput(index) {
      this.inputData[index] = this.inputData[index].replace(
        /^0*(0\.|[1-9])/,
        "$1"
      );
      this.inputData[index] = this.inputData[index].replace(/[^\d]/g, ""); //清除"数字"以外的字符
      this.inputData[index] = this.inputData[index].replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      this.inputData[index] =
        this.inputData[index].indexOf(".") > 0
          ? this.inputData[index].split(".")[0].substring(0, 10) +
            "." +
            this.inputData[index].split(".")[1]
          : this.inputData[index].substring(0, 3);
      if (parseFloat(this.inputData[index]) > 100) {
        this.inputData[index] = "100";
      }
      if (parseFloat(this.inputData[index]) == 0) {
        this.inputData[index] = "0";
      }
      return this.inputData[index];
    },
  },
  created() {
    this.jump();
    this.$store.state.page.page
      ? (this.page.currentPage = this.$store.state.page.page)
      : "";
    this.getList();
    this.getTreeData();
    if (this.$route.params.processId) {
      var row = {};
      row.processId = this.$route.params.processId;
      this.check(row);
    }
  },
};
</script>

<style scoped>
.boxTable {
  height: 60vh;
  overflow-y: auto;
}
.pageBox {
  padding: 16px 0 0px;
  text-align: left;
}
.pageBox > div {
  height: 30px;
}
div.ableClick {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  position: absolute;
  right: 16px;
  top: 2px;
  background-color: #fff;
  color: #fff;
  font-size: 12px;
  line-height: 14px;
  z-index: 1;
  -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.tree .func div.ableClick {
  right: 100px;
  top: 8px;
}
.single .func div.ableClick {
  left: -165px;
  top: 3px;
}
div.ableClick.active {
  background-color: #409eff;
  border-color: #409eff;
}
div.ableClick::before {
  opacity: 0;
  -webkit-transition: opacity 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  transition: opacity 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
div.ableClick.active::before {
  opacity: 1;
}
div.ableClick.disabled {
  border: 1px solid rgb(220, 223, 230);
  background-color: rgb(227, 226, 229);
}
</style>
<style>
.customerManage_transfers_dialog .el-tree-node__content,
.customerManage_share_dialog .el-tree-node__content {
  position: relative;
}
.customerManage_transfers_dialog .el-tree-node__content:hover div.ableClick,
.customerManage_share_dialog .el-tree-node__content:hover div.ableClick {
  border-color: #409eff;
}
.myApply_edit_dialog .el-tree-node__content:hover div.ableClick.disabled {
  border: 1px solid rgb(220, 223, 230);
  cursor: no-drop;
}
.addColor {
  color: green;
}
.delColor {
  text-decoration: line-through;
  color: red;
}
</style>
