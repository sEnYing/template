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
                :operation="[{key:'view'},{key:'revise',show:judgeShow},{key:'delete',show:judgeShow,class:()=>{return 'redbtn'}},{key:'addVisit',show:judgeShow},{key:'share',show:judgeShow}]"
                @click="tableOper"
                @selection="getData"></unit-table>
    <unit-page :total="total"
               :page="page"
               @pagechange="getList"></unit-page>
    <el-dialog title="共享联系人申请"
               :visible.sync="dialogVisibleShare"
               width="580px"
               append-to-body
               custom-class="customerManage_share_dialog"
               @close="cancel">
      <div>
        <div class="name">
          <div>
            <span>客户名称：</span>
          </div>
          <div>
            <span v-for="(item,index) of data"
                  :key="index">{{item.orgName}}</span>
          </div>
        </div>
        <div class="tel">
          <div>
            <span>共享联系人：</span>
          </div>
          <div>
            <div>
              <span v-for="(item,index) of data"
                    :key="index">{{item.contactName}}</span>
            </div>
          </div>
        </div>
        <div class="share">
          <div>
            <span><i class="must">*</i>共享给：</span>
          </div>
          <div>
            <span v-for="(item, index) of shareTo"
                  :key="index">{{ index==0?item:'、'+item }}</span>
          </div>
        </div>
        <div class="tree">
          <el-input v-model="filterText"
                    suffix-icon="iconfont icon-fangdajing"></el-input>
          <!-- <el-tree
            class="filter-tree project_share_dialog"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            @check="chooseTree"
            @click.stop
            node-key="depId"
            :default-expanded-keys="[defaultExpandedKeys]"
            :default-checked-keys="defaultCheckedKeys"
            :filter-node-method="filterNode"
            ref="tree"
          > -->
          <el-tree class="filter-tree"
                   :data="treeData"
                   node-key="id"
                   show-checkbox
                   :default-expanded-keys="['root']"
                   :filter-node-method="filterNode"
                   :default-checked-keys="defaultCheckedKeys"
                   @check="chooseTree"
                   ref="tree">
            <!-- <span slot-scope="{ node, data }" class="func">
              <span style="padding-left: 4px;">{{node.label}}</span>
            </span> -->
          </el-tree>
        </div>
        <div class="discription">
          <div>
            <span><i class="must">*</i>原因描述：</span>
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
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitClick"
                   :disabled="isDisable">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/tableScroll";
import "@/assets/font/customerManage/iconfont.css";
export default {
  name: "contact_customer",
  props: ["sel", "btn", "staff"],
  components: { unitTable },
  data () {
    return {
      data: "",
      filterText: "",
      treeData: [],
      personChoose: [],
      // CheckedKeys:[],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      dialogVisibleShare: false,
      defaultExpandedKeys: "",
      project: "",
      checkTelList: [],
      TelList: [],
      shareTo: [],
      title: [
        { key: "contactName", name: "姓名", width: 12 },
        { key: "orgName", name: "客户名称", width: 24 },
        { key: "department", name: "部门", width: 16 },
        { key: "position", name: "职位", width: 14 },
        { key: "mobilePhoneNumber", name: "手机", width: 12 },
        { key: "telephone", name: "电话", width: 12 },
        { key: "ownerName", name: "销售", width: 10 },
        { key: "isInProcess", name: "共享/转移中", width: 10 }
      ],
      list: [],
      staffList: [],
      loading: true,
      delLoading: false,
      total: 0,
      page: 1,
      textarea: "",
      transferOrShareList: [],
      defaultCheckedKeys: [],
      isDisable: false
    };
  },
  computed: {
    reload () {
      return this.$store.state.reload;
    },
    judgeBtn () {
      let json = {
        contactCustomerUpdate: this.$pubfunc.judgeBtn(
          "contact:customer:update"
        ),
        contactCustomerDelete: this.$pubfunc.judgeBtn(
          "contact:customer:delete"
        ),
        contactCustomerView: this.$pubfunc.judgeBtn("contact:customer:view"),
        contactcustomerShare: this.$pubfunc.judgeBtn(
          "contact:customer:share"
        ),
        visitrecord: this.$pubfunc.judgeBtn("visitrecord")
      },
        num = 1;
      json.contactCustomerUpdate ? num++ : null;
      json.contactCustomerDelete ? num++ : null;
      json.contactCustomerShare ? num++ : null;
      json.visitrecord ? (num += num < 2 ? 2 : 1) : null;
      json.num = num;
      return json;
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    sel () {
      this.getList(1);
    },
    reload () {
      if (this.reload === true) {
        this.getList(1);
        this.$store.commit("reloadFn", false);
      }
    }
  },
  methods: {
    submitClick () {
      this.isDisable = true
      this.$pubfunc.fnThrottle(this.submitShare, 500)()
      setTimeout(() => {
        this.isDisable = false
      }, 1500)
    },
    telChange (val) {
      this.TelList = [];
      this.checkTelList.map(item => {
        this.tel.map(it => {
          if (item == it.label) {
            this.TelList.push(it.value);
          }
        });
      });
    },

    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    chooseTree (data, node, self) {
      let _this = this;
      _this.personChoose = [];
      _this.shareTo = [];
      this.staffList = []
      var a = function (val) {
        val.map(item => {
          if (item.children != null) {
            a(item.children);
          } else {
            if (item.id != _this.$store.state.userInfo.info.staff.staffId) {
              _this.personChoose.push(item.id);
              _this.shareTo.push(item.label);
            } else {
              this.$message({
                showClose: true,
                message: '不能选择所有者!',
                type: 'error'
              });
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
      _this.personChoose.map(item => {
        this.staffList.push(item);
      });
    },

    setTreeDisabled (val) {
      val.map(item => {
        if (item.children != undefined && item.children != null && item.children.length > 0) {
          this.setTreeDisabled(item.children)
        } else if (item.accountId) {
          if (this.data != undefined && this.data != null && this.data.length > 0) {
            this.data.map(val => {
              item.id == val.owner ? item.disabled = true : ''
            })
          }

        } else {

        }
      })
    },

    async getTreeData () {
      let self = this;
      // this.$api.bgmgnt.department.getDepTreeData({}, res => {
      //   this.treeData = res.data;
      //   this.defaultExpandedKeys = this.treeData[0].depId;
      //   var a = async function (val) {
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
      //                 item.disabled = false
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
      this.$api.bgmgnt.staff.getstaffTreeData({ resourceType: '02,05,07' }, res => {
        this.treeData = res.data
      })
    },
    submitShare () {
      if (this.personChoose.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择共享人!',
          type: 'error'
        });
        return
      }
      if (!this.textarea) {
        this.$message({
          showClose: true,
          message: '请填写申请原因描述',
          type: 'error'
        });
        return
      }
      if (this.personChoose.length > 0) {
        var contactId = '';
        this.data.map(item => {
          contactId = item.contactId;
        });
        this.$api.service.contact.customerShare(
          {
            contactId: contactId,
            staffList: this.staffList,
            description: this.textarea
          },
          res => {
            if (res.code == "0") {
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.cancel()
              this.getList(1)
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
              this.cancel()
            }
          }
        );
      }
    },
    cancel () {
      this.clearSel()
      this.$refs.tree.setCheckedNodes([])
      this.textarea = ''
      this.shareTo = []
      this.personChoose = []
      this.inputData = []
      this.defaultCheckedKeys = []
      this.checkTelList = []
      this.transferOrShareList = []
      this.dialogVisibleShare = false
    },
    getData (val) {
      if (val.length > 1) {
        this.data = val;
      } else {
        this.data = [val];
      }
    },

    judgeShow (item, i, key) {
      var a = this.$store.state.userInfo.info.staff.branchCompany.split(",")
      switch (key) {
        case "view":
          return true;
        case "revise":
          return (item.owner === this.staff.staffId || this.staff.isAdmin) &&
            this.judgeBtn.contactCustomerUpdate
            ? true
            : false;
        case "delete":
          return (item.owner === this.staff.staffId || this.staff.isAdmin) &&
            this.judgeBtn.contactCustomerDelete
            ? true
            : false;
        case "share":
          return (item.isShare == '0' || this.staff.isAdmin) && this.judgeBtn.contactcustomerShare && item.isInProcess != '是' ? true : false;
      }
      return this.judgeBtn.visitrecord && item.owner === this.staff.staffId
        ? true
        : false;
    },
    returnBtn (type, k) {
      switch (type) {
        case "tab":
          this.tab.choose !== k ? this.loadingChange(true) : null;
          this.tab.choose = k;
          this.$pubfunc.setSStorage("project", k);
          if (k === "projGeneral") {
            this.getInfo();
          }
          break;
      }
    },
    getList (page) {
      this.$store.commit('pageFn', { page: page, limit: 10 })
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.sel));
      delete param.supplierName;
      param.limit = 10;
      param.page = page;
      // console.log(param)
      this.loading = true;
      this.$api.service.contact.customerList(param, res => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map(v => {
              v.sexTxt = v.sex === "1" ? "男" : v.sex === "2" ? "女" : "";
            });
            this.list = list;
            break;
        }
      });
    },
    tableOper (key, item) {
      // console.log(key,item)
      switch (key) {
        case "view":
          this.$emit("dialog", {
            show: true,
            link: "contactForm",
            small: true,
            title: "查看客户联系人",
            data: { key, item, type: "customer" }
          });
          break;
        case "revise":
          this.$emit("dialog", {
            show: true,
            link: "contactForm",
            small: true,
            title: "编辑客户联系人",
            data: { key, item, type: "customer" }
          });
          break;
        case "delete":
          this.$store.commit("confirmFn", {
            func: () => {
              if (this.delLoading) {
                return;
              }
              this.delLoading = true;
              this.$api.service.contact.customerDelete(
                { contactId: item.contactId },
                res => {
                  // console.log(res)
                  this.delLoading = false;
                  switch (res.code) {
                    case "0":
                      this.$store.commit("alertFn", {
                        type: "success",
                        text: "删除成功",
                        func: () => {
                          this.clearSel();
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
                }
              );
            },
            text: "确认删除该联系人信息吗？<br>删除后不可恢复"
          });
          break;
        case "addVisit":
          this.$emit("dialog", {
            show: true,
            link: "addVisit",
            small: true,
            title: "添加拜访记录",
            data: { key: "customerContact", item }
          });
          break;
        case "share":
          item.shareStaffList.map(i => {
            if (item.owner != i.staffId) {
              this.shareTo.push(i.staffName)
              this.personChoose.push(i.staffId)
            }
          })
          this.defaultCheckedKeys = this.personChoose
          this.transferOrShareList = []
          item.shareStaffList.map(item => {
            this.transferOrShareList.push(item.staffId)
          })
          this.transferOrShareList.push(item.owner)
          this.getData(item);
          this.setTreeDisabled(this.treeData)
          this.dialogVisibleShare = true;
          break;
      }
    },
    clearSel () {
      this.$emit("clear");
    }
  },
  created () {
    this.getList(this.$store.state.page.page)
    this.getTreeData();
  },
  mounted () {
    this.$emit("ok");
  }
};
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
  height: calc(100% - 145px);
}
</style>
