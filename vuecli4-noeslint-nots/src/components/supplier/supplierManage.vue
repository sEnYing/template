<template>
  <div class="fillBox">
    <div class="boxTitle titleFix">
      <i class="supplier_icon"></i><span>供应商管理</span>
      <unit-btn
        type="large right"
        style="width: 150px"
        text="供应商评审标准配置"
        v-if="judgeShow('assessStandard')"
        @click="tableOper('config', null)"
      ></unit-btn>
      <unit-btn
        type="large right"
        style="width: 185px"
        text="导出供应商及供应商联系人"
        v-if="judgeShow('export')"
        @click="tableOper('export', null)"
      ></unit-btn>
      <el-upload
        class="upload-demo right"
        action="/api/service/supplier/import"
        :show-file-list="false"
        :on-success="uploadSuc"
        :on-error="uploadErr"
        :file-list="fileList"
        :headers="{
          Authorization: $store.state.token,
        }"
      >
        <el-button size="small" type="primary" v-if="judgeShow('import')"
          >导入供应商</el-button
        >
      </el-upload>

      <unit-btn
        type="large right"
        text="模板下载"
        v-if="judgeShow('import')"
        @click="tableOper('template', null)"
      ></unit-btn>
      <unit-btn
        type="large right"
        text="新建供应商"
        @click="tableOper('add', null)"
        v-if="judgeBtn.supplierAdd"
      ></unit-btn>
    </div>
    <div class="contentFix">
      <div class="boxRel">
        <el-scrollbar class="unitScrollbar" ref="scrollbar">
          <div class="formBox">
            <div>
              <span class="formBox_text">供应商名称</span>
              <div>
                <input
                  v-setwidth
                  type="text"
                  v-model="selMod.supplierName"
                  placeholder="全部"
                  @keydown.enter="tableOper('select', null)"
                />
              </div>
            </div>
            <!-- <div><span class="formBox_text">供应商名称</span><div><unit-supplier v-setwidth id="supplierName" class="auto" placeholder='全部' @change='dropdownReturn' :clear='true' :reset='reset' :input="true" :create='true' @enter='tableOper("select",null)'></unit-supplier></div></div> -->
            <div>
              <span class="formBox_text">服务范围</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="serviceScope"
                  class="auto"
                  placeholder="全部"
                  :list="serviceScope"
                  @change="dropdownReturn"
                  :result="selMod.serviceScope"
                  :clear="true"
                  :input="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">硬件品牌</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="hardwareBrand"
                  class="auto"
                  placeholder="全部"
                  :list="hardwareBrand"
                  @change="dropdownReturn"
                  :result="selMod.hardwareBrand"
                  :clear="true"
                  :input="true"
                  :reset="reset"
                  @enter="tableOper('select', null)"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">软件品牌</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="softwareBrand"
                  class="auto"
                  placeholder="全部"
                  :list="softwareBrand"
                  @change="dropdownReturn"
                  :result="selMod.softwareBrand"
                  :clear="true"
                  :input="true"
                  :reset="reset"
                  @enter="tableOper('select', null)"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">供应链级别</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="level"
                  class="auto"
                  placeholder="全部"
                  :list="level"
                  @change="dropdownReturn"
                  :result="selMod.level"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div>
              <span class="formBox_text">产品类型</span>
              <div>
                <unit-dropdown
                  v-setwidth
                  id="type"
                  class="auto"
                  placeholder="全部"
                  :list="type"
                  @change="dropdownReturn"
                  :result="selMod.type"
                  :clear="true"
                  :reset="reset"
                ></unit-dropdown>
              </div>
            </div>
            <div class="btnBox right">
              <unit-btn
                @click="tableOper('select', null)"
                text="查询"
              ></unit-btn>
              <unit-btn
                type="plain"
                @click="tableOper('clear', null)"
                text="重置"
              ></unit-btn>
            </div>
          </div>
          <div class="boxTable">
            <unit-loading :loading="loading" v-if="loading"></unit-loading>
            <unit-table
              :total="total"
              :page="page"
              v-if="!loading || list.length > 0"
              :opern="judgeBtn.num"
              :list="list"
              :title="title"
              ref="table"
              :operation="[
                { key: 'view', show: judgeShow },
                { key: 'revise', show: judgeShow },
                {
                  key: 'delete',
                  show: judgeShow,
                  class: () => {
                    return 'redbtn';
                  },
                },
              ]"
              @click="tableOper"
            ></unit-table>
            <unit-page
              :total="total"
              :page="page"
              @pagechange="getList"
            ></unit-page>
          </div>
        </el-scrollbar>
      </div>
      <!-- <unit-upload api="service.supplier" :hid='true' @click='addBtn' @success='uploadSuc' @ajaxing='ajaxingChang' :total='total'></unit-upload> -->
    </div>
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/tableScroll";
// import unitSupplier from '@/unit/components/thisUnit/supplier'
// import unitUpload from '@/unit/components/upload'
export default {
  name: "supplierManage",
  props: ["dom"],
  components: { unitTable }, //unitUpload,unitSupplier
  data() {
    return {
      selMod: {
        supplierName: "",
        serviceScope: "",
        hardwareBrand: "",
        softwareBrand: "",
        level: "",
        type: "",
      },
      selRes: {},
      reset: true,
      serviceScope: [],
      hardwareBrand: [],
      softwareBrand: [],
      type: [],
      level: [],
      title: [
        { key: "supplierName", name: "供应商名称", width: 20 },
        { key: "serviceScopeName", name: "服务范围", width: 16 },
        { key: "region", name: "省份/城市", width: 16 },
        { key: "legalPerson", name: "法定代表人", width: 16 },
        { key: "telephone", name: "电话", width: 16 },
        { key: "createTime_", name: "创建日期", width: 16 },
      ],
      list: [],
      // ajaxIng:false,
      templateLoading: false,
      delLoading: false,
      loading: true,
      total: 0,
      page: 1,
      fileList: [],
    };
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.state.userInfo
        ? this.$store.state.userInfo
        : {};
      let isCharge =
          userInfo.info &&
          userInfo.info.staff &&
          userInfo.info.staff.isCharge === "1"
            ? true
            : false,
        staffId =
          userInfo.info && userInfo.info.staff
            ? userInfo.info.staff.staffId
            : null;
      return { isCharge, staffId };
    },
    judgeBtn() {
      let json = {
          supplierAdd: this.$pubfunc.judgeBtn("supplier:add"),
          supplierUpdate: this.$pubfunc.judgeBtn("supplier:update"),
          supplierDelete: this.$pubfunc.judgeBtn("supplier:delete"),
          supplierView: this.$pubfunc.judgeBtn("supplier:view"),
          supplierImport: this.$pubfunc.judgeBtn("supplier:import"),
          supplierExport: this.$pubfunc.judgeBtn("supplier:export"),
          supplierAssessStandard: this.$pubfunc.judgeBtn(
            "supplier:assessStandard"
          ),
        },
        num = 1;
      json.supplierUpdate ? num++ : null;
      json.supplierDelete ? num++ : null;
      json.num = num;
      return json;
    },
  },
  methods: {
    uploadSuc(response, file, fileList) {
      if (response.code === "0") {
        this.$store.commit("alertFn", {
          text: "上传成功！",
          type: "success",
        });
        this.getList();
      } else {
        this.$store.commit("alertFn", {
          text: response.message,
          type: "error",
        });
      }
    },
    uploadErr(err, file, fileList) {
      this.$store.commit("alertFn", {
        text: err.message,
        type: "error",
      });
    },
    judgeShow(item, i, key) {
      switch (key) {
        case "view":
          return true;
        case "revise":
          return this.judgeBtn.supplierUpdate ? true : false;
        case "delete":
          return this.judgeBtn.supplierDelete ? true : false;
        case "import":
          return this.judgeBtn.supplierImport;
        case "export":
          return this.judgeBtn.supplierExport;
        case "assessStandard":
          return this.judgeBtn.supplierAssessStandard;
      }
      return true;
    },
    // ajaxingChang(j){
    //     // console.log(j)
    //     this.ajaxIng=j;
    // },
    // addBtnjudge(){
    //     if(this.ajaxIng){return;}
    //     this.addBtn();
    // },
    // addBtn(fn){
    //     this.addBtn=fn;
    // },
    // uploadSuc(item){
    //     this.$api.user.saveFileData({
    //             projId:this.projid,
    //             id:item.id,
    //             realName:item.realName,
    //             fileSize:item.fileSize,
    //             fileType:item.fileType,
    //             filePath:item.filePath,
    //         },res=>{
    //         this.ajaxingChang(false);
    //         switch(res.code){
    //             case '0':
    //                 this.$store.commit('alertFn',{
    //                     type:'success',
    //                     text:'上传成功',
    //                     func:()=>{
    //                         this.getList(1);
    //                     }
    //                 });
    //                 break;
    //             default:
    //                 this.$store.commit('alertFn',{
    //                     type:'error',
    //                     text:'上传失败'
    //                 });
    //         }
    //     })
    // },
    getDropData() {
      this.$api.public.region({ level: 10, pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            let province = res.data && res.data.list ? res.data.list : [];
            province.splice(0, 0, {
              label: "全国",
              value: "0",
            });
            this.serviceScope = province;
            break;
        }
      });
      this.$api.public.dict(
        { codeGroup: "hardware_brand", pCode: "" },
        (res) => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.hardwareBrand = res.data ? res.data : [];
              break;
          }
        }
      );
      this.$api.public.dict(
        { codeGroup: "software_brand", pCode: "" },
        (res) => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.softwareBrand = res.data ? res.data : [];
              break;
          }
        }
      );
      this.$api.public.dict(
        { codeGroup: "supplier_level", pCode: "" },
        (res) => {
          // console.log(res)
          switch (res.code) {
            case "0":
              this.level = res.data ? res.data : [];
              break;
          }
        }
      );
      this.$api.public.dict({ codeGroup: "product_type", pCode: "" }, (res) => {
        // console.log(res)
        switch (res.code) {
          case "0":
            this.type = res.data ? res.data : [];
            break;
        }
      });
    },
    getList(page) {
      this.$store.commit("pageFn", { page: page, limit: 10 });
      this.page = page;
      let param = JSON.parse(JSON.stringify(this.selRes));
      param.limit = 10;
      param.page = page;
      // console.log(param)
      this.loading = true;
      this.$api.service.supplier.getList(param, (res) => {
        // console.log(res)
        this.loading = false;
        switch (res.code) {
          case "0":
            this.total = res.data.total;
            let list = res.data.list ? res.data.list : [];
            list.map((v) => {
              v.createTime_ = this.$pubfunc.TimeTransform(
                "YYYY年MM月DD日",
                v.createTime
              );
              v.region =
                (v.provinceName ? v.provinceName : "") +
                (v.provinceName && v.cityName ? "/" : "") +
                (v.cityName ? v.cityName : "");
            });
            this.list = list;
            break;
        }
      });
    },
    dropdownReturn(res, key) {
      // console.log(res,key)
      switch (key) {
        case "supplierName":
          this.selMod.supplierName = res.label;
          break;
        default:
          this.selMod[key] = res.value;
      }
    },
    tableOper(key, item) {
      // console.log(key,item)
      switch (key) {
        case "select":
          this.$store.commit("searchConditionFn", this.selMod);
          this.selRes = JSON.parse(JSON.stringify(this.selMod));
          this.getList(1);
          break;
        case "clear":
          for (let k in this.selMod) {
            this.selMod[k] = "";
          }
          this.reset = !this.reset;
          this.tableOper("select", null);
          break;
        case "add":
          this.$router.push({ name: "supplierAdd" });
          break;
        case "revise":
          item.supplierId
            ? this.$router.push({
                name: "supplierEdit",
                params: { supplierId: this.$pubfunc.encode(item.supplierId) },
              })
            : null;
          break;
        case "view":
          item.supplierId
            ? this.$router.push({
                name: "supplierView",
                params: { supplierId: this.$pubfunc.encode(item.supplierId) },
              })
            : null;
          break;
        case "delete":
          this.$store.commit("confirmFn", {
            func: () => {
              if (this.delLoading) {
                return;
              }
              this.delLoading = true;
              this.$api.service.supplier.delete(
                { supplierId: item.supplierId },
                (res) => {
                  // console.log(res)
                  this.delLoading = false;
                  switch (res.code) {
                    case "0":
                      this.$store.commit("alertFn", {
                        type: "success",
                        text: "删除成功",
                        func: () => {
                          this.tableOper("select", null);
                        },
                      });
                      break;
                    default:
                      res.message
                        ? this.$store.commit("alertFn", {
                            type: "error",
                            text: res.message,
                          })
                        : null;
                  }
                }
              );
            },
            text: "确认删除该供应商信息吗？<br>删除后不可恢复",
          });
          break;
        case "template":
          if (this.templateLoading) {
            return;
          }
          this.templateLoading = true;
          this.$api.download.supplierTemplate({}, (res) => {
            this.templateLoading = false;
            this.$pubfunc.downloadFile(res, "供应商管理模板.xlsx", "excel");
          });
          break;
        case "import":
          break;
        case "export":
          if (this.templateLoading) {
            return;
          }
          this.templateLoading = true;
          this.$api.download.supplierExport(this.selRes, (res) => {
            this.templateLoading = false;
            this.$pubfunc.downloadFile(res, "供应商及供应商联系人.zip", "zip");
          });
          break;
        case "config":
          this.$router.push({ path: "/supplier/config", query: item });
          break;
      }
    },
  },
  created() {
    this.getDropData();
    this.reset = !this.reset;
    this.$store.state.searchCondition
      ? (this.selMod = this.$store.state.searchCondition)
      : null;
    this.selRes = JSON.parse(JSON.stringify(this.selMod));
    this.getList(this.$store.state.page.page);
  },
  mounted() {},
};
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
<style lang="scss" scoped>
.fillBox {
  .boxTitle {
    .upload-demo {
      width: 135px;
      display: inline-block;
      margin: -2px 0 -2px 20px;
      .el-button {
        padding: 0;
        color: #fff;
        background-color: #4780f4;
        border: 1px solid #4780f4;
        border-radius: 2px;
        overflow: hidden;
        font-size: 14px;
        text-align: center;
        width: 135px;
        height: 32px;
        line-height: 30px;
      }
    }
  }
}
</style>
