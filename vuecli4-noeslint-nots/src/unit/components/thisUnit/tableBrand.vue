<template>
  <div class="tableBrand" ref="tableBrand">
    <div
      class="title"
      v-if="type !== 'FirewallProduct' && type !== 'SecuritySoftwareProduct'"
    >
      {{ name[type] }}
    </div>
    <div
      class="title"
      v-else-if="
        type === 'FirewallProduct' || type === 'SecuritySoftwareProduct'
      "
    >
      {{ name[type] }}产品
    </div>
    <div class="title" v-else-if="type === 'service'">服务</div>
    <ul class="table">
      <li class="th">
        <span
          class="index"
          v-if="
            type !== 'FirewallProduct' && type !== 'SecuritySoftwareProduct'
          "
          ><span>序号</span></span
        ><span
          v-for="(item, i) in brandTitle"
          :key="i"
          :style="{
            width:
              'calc((100% - ' +
              (edit ? 80 : 50) +
              'px)*' +
              item.width / 100 +
              ')',
          }"
          ><span
            >{{ item.name
            }}<i
              class="titleIcon"
              v-if="edit && item.title"
              :title="item.title"
            ></i></span
        ></span>
      </li>
      <li v-for="(item, i) in thisList" :key="i">
        <span
          class="index"
          v-if="
            type !== 'FirewallProduct' && type !== 'SecuritySoftwareProduct'
          "
          ><span class="result">{{ Number(i + 1) }}</span></span
        >
        <span
          v-for="(title, j) in brandTitle"
          :key="j"
          :style="{
            width:
              'calc((100% - ' +
              (edit ? 80 : 50) +
              'px)*' +
              title.width / 100 +
              ')',
          }"
        >
          <span class="result" v-if="!edit" v-showtit>{{
            item[title.key] | judgeEmpty
          }}</span>
          <unit-brand
            class="specialDrop"
            v-if="edit && title.key !== 'number'"
            :id="title.key + '_' + i"
            :newtext="newtext"
            :otherid="otherId"
            :placeholder="title.placeholder"
            :list="getlist(title.key)"
            @change="dropdownReturn"
            :result="item[title.res].length > 0 ? item[title.res] : null"
            :input="title.input"
            :multiple="title.multiple ? true : false"
            :align="true"
            :special="true"
            :thisList="thisList"
            :create="title.input"
          ></unit-brand>
          <el-input
            v-model="item[title.res]"
            v-if="edit && title.key === 'number'"
            @change="clearErr"
            type="number"
            @input="
              item[title.res].length > 4
                ? (item[title.res] = item[title.res].slice(0, 4))
                : item[title.res]
            "
            :class="{ tcn: 'title.key === number' }"
            :placeholder="title.placeholder"
          ></el-input>
        </span>
        <span class="delete" v-if="edit"
          ><a class="AbleClick el-icon-circle-close" @click="deleteItem(i)"></a
        ></span>
      </li>
      <li v-if="edit" class="addLi">
        <span
          v-if="
            type !== 'FirewallProduct' &&
            type !== 'SecuritySoftwareProduct' &&
            type !== 'service'
          "
        >
          <a class="AbleClick" @click="addItem">
            <i class="el-icon-circle-plus-outline"></i>
            添加{{ name[type] }}
          </a>
        </span>
        <span
          v-else-if="
            type === 'FirewallProduct' || type === 'SecuritySoftwareProduct'
          "
        >
          <a class="AbleClick" @click="addItem">
            <i class="el-icon-circle-plus-outline"></i>
            添加{{ name[type] }}产品
          </a>
        </span>
        <span v-else-if="type === 'service'">
          <a class="AbleClick" @click="addItem">
            <i class="el-icon-circle-plus-outline"></i>
            添加服务
          </a>
        </span>
      </li>
      <li v-if="!edit && thisList.length === 0" class="empty">暂无数据</li>
    </ul>
    <transition name="publicTransition"
      ><u class="iconU error el-icon-warning" v-if="error.show">{{
        error.text
      }}</u></transition
    >
  </div>
</template>

<script>
import unitBrand from "@/unit/components/thisUnit/brand";
export default {
  name: "tableBrand",
  props: ["type", "list", "edit", "dropdown"],
  components: { unitBrand },
  data() {
    return {
      name: {
        hardwareBrand: "硬件",
        softwareBrand: "软件",
        FirewallProduct: "卓朗防火墙",
        SecuritySoftwareProduct: "卓朗安全软件",
        service: "服务",
      },
      brandTitle: [
        {
          key: "brandName",
          res: "brandItem",
          name: "品牌名称",
          width: 30,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应品牌，您可以输入相应品牌名称并选择",
        },
        {
          key: "typeNames",
          res: "typeItem",
          name: "产品类型",
          width: 40,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应类型，您可以输入相应产品类型并选择",
          multiple: true,
        },
        {
          key: "service",
          res: "serviceItem",
          name: "服务内容",
          width: 50,
          input: true,
          placeholder: "请选择",
          title: "若未找到",
        },
        {
          key: "levelTxt",
          res: "levelItem",
          name: "供应链级别",
          width: 50,
          input: false,
          placeholder: "请选择",
        },
        {
          key: "productModel",
          res: "modelItem",
          name: "产品型号",
          width: 70,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应型号，您可以输入相应产品型号并选择",
        },
        {
          key: "number",
          res: "number",
          name: "产品数量",
          width: 40,
          input: true,
          placeholder: "请输入",
        },
      ],
      thisList: this.setList(this.list ? this.list : []),
      baseItem: {
        brand: "",
        brandName: "",
        level: "",
        service: "",
        model: "",
        number: "",
        typeList: [],
        brandItem: [],
        serviceItem: [],
        typeItem: [],
        levelItem: [],
        modelItem: [],
      },
      error: { show: false, text: "" },
      newtext: " 【新建】",
      otherId: "999",
      split: ",",
      number: "",
      nodisabled: "",
    };
  },
  computed: {
    titleNum() {
      let length = 0,
        per = 0;
      this.title.map((v) => {
        v.width ? (per += Number(v.width)) : length++;
      });
      return {
        per: Number(100 - per),
        length: length,
      };
    },
  },
  directives: {
    showtit: {
      inserted: function (el, binding, vnode) {
        setTimeout(() => {
          // console.log(el)
          let w = el.offsetWidth,
            h = el.offsetHeight,
            pw = el.parentNode.offsetWidth,
            ph = el.parentNode.offsetHeight;
          // console.log(w,pw,h,ph);
          w > pw || h > ph
            ? el.setAttribute("title", el.innerHTML)
            : el.removeAttribute("title");
        }, 0);
      },
      componentUpdated: function (el, binding, vnode) {
        setTimeout(() => {
          // console.log(el)
          let w = el.offsetWidth,
            h = el.offsetHeight,
            pw = el.parentNode.offsetWidth,
            ph = el.parentNode.offsetHeight;
          // console.log(w,pw,h,ph);
          w > pw || h > ph
            ? el.setAttribute("title", el.innerHTML)
            : el.removeAttribute("title");
        }, 0);
      },
    },
  },
  filters: {
    judgeEmpty(val) {
      return val ? val : "--";
    },
  },
  watch: {
    list() {
      this.thisList = this.setList(this.list.concat());
      console.log(this.thisList);
    },
  },
  methods: {
    getlist(k) {
      let list = this.dropdown[k];
      return list
        .filter((v) => {
          // return v.value !== this.otherId ? true : false;
          return true;
        })
        .concat();
    },
    setErr(text) {
      this.error.show = true;
      this.error.text = text;
    },
    clearErr() {
      this.error.show = false;
    },
    setList(list) {
      // console.log(list);
      return list.map((v) => {
        let arr = [],
          arr1 = [],
          typeName = [];
        v.typeList
          ? v.typeList.map((v) => {
              v.type === this.otherId
                ? ((typeName = v.typeName.split(this.split)),
                  (arr = arr.concat(typeName.map((name) => name))),
                  (arr1 = arr1.concat(
                    typeName.map((name) => ({ value: v.type, label: name }))
                  )))
                : (arr.push(v.typeName),
                  arr1.push({ value: v.type, label: v.typeName }));
            })
          : null;
        for (const [ck, cv] of Object.entries(this.dropdown.levelTxt)) {
          if (v.level === cv.value) {
            v.levelTxt = cv.label;
          }
        }
        v.brandItem = [{ value: v.brand, label: v.brandName }];
        v.levelItem = [{ value: v.level, label: v.levelTxt }];
        v.serviceItem = [{ value: v.service, label: v.serviceTxt }];

        v.modelItem = [{ value: v.model, label: v.productModel }];
        v.typeNames = arr.join("/");
        v.typeItem = arr1;
        return v;
      });
    },
    judgeItem() {
      let list = [],
        brandIds = [],
        model = [];
      // console.log(this.thisList);
      for (let i in this.thisList) {
        if (
          this.type === "FirewallProduct" ||
          this.type === "SecuritySoftwareProduct"
        ) {
          if (!this.thisList[i].model) {
            this.setErr("请选择产品型号");
            return false;
          }
          if (!this.thisList[i].number) {
            this.setErr("请输入产品数量");
            return false;
          }
          if (model.indexOf(this.thisList[i].model) > -1) {
            this.setErr(
              "产品型号重复，请重新选择（若您添加多个新建产品，请合并为一个）"
            );
            return false;
          }
        } else if (this.type === "service") {
          if (!this.thisList[i].service) {
            this.setErr("请选择服务内容");
            return false;
          }
          if (!this.thisList[i].level) {
            this.setErr("请选择供应链级别");
            return false;
          }
        } else {
          if (!this.thisList[i].brand) {
            this.setErr(
              "请选择品牌名称，若未找到对应品牌，您可以输入相应品牌名称并选择"
            );
            return false;
          }
          if (brandIds.indexOf(this.thisList[i].brand) > -1) {
            this.setErr(
              "品牌重复，请重新选择（若您添加多个新建品牌，请合并为一个）"
            );
            return false;
          }
          if (this.thisList[i].typeList.length === 0) {
            this.setErr(
              "请选择产品类型，若未找到对应类型，您可以输入相应产品类型并选择"
            );
            return false;
          }
          if (!this.thisList[i].level) {
            this.setErr("请选择供应链级别");
            return false;
          }
        }
        let typeList = [],
          other = [];
        (this.thisList[i].typeList ? this.thisList[i].typeList : []).map(
          (v) => {
            v.type === this.otherId ? other.push(v.typeName) : typeList.push(v);
          }
        );
        other.length > 0
          ? typeList.push({
              type: this.otherId,
              typeName: other.join(this.split),
            })
          : null;
        let j = {
          brand: this.thisList[i].brand,
          level: this.thisList[i].level,
          typeList: typeList,
          model: this.thisList[i].modelItem,
          number: this.thisList[i].number,
          service: this.thisList[i].service,
        };
        j.brand === this.otherId
          ? (j.brandName = this.thisList[i].brandName)
          : null;
        if (
          this.type === "FirewallProduct" ||
          this.type === "SecuritySoftwareProduct"
        ) {
          console.log(j);
          model.push(j.model[0].value);
        }
        brandIds.push(j.brand);
        list.push(j);
      }
      return list;
    },
    addItem() {
      console.log(this.thisList);
      if (this.judgeItem()) {
        this.thisList.push(JSON.parse(JSON.stringify(this.baseItem)));
      }
    },
    deleteItem(i) {
      this.thisList.splice(i, 1);
      this.clearErr();
    },
    dropdownReturn(item, key) {
      this.clearErr();
      let k = key.split("_")[0],
        index = Number(key.split("_")[1]);
      switch (k) {
        case "service":
          this.thisList[index].serviceItem = [item];
          this.thisList[index].service = item.value;
          break;
        case "levelTxt":
          console.log(item);
          this.thisList[index].levelItem = [item];
          this.thisList[index].level = item.value;
          break;
        case "brandName":
          let label = item.label.toString();
          item.value
            ? (this.thisList[index].brand = item.value)
            : ((this.thisList[index].brand = this.otherId),
              (this.thisList[index].brandName = label.replace(
                this.newtext,
                ""
              )));
          this.thisList[index].brandItem = [
            {
              label: item.value ? label : label.replace(this.newtext, ""),
              value: item.value ? item.value : this.otherId,
            },
          ];
          break;
        case "typeNames":
          if (!item) {
            this.thisList[index].typeList = [];
            this.thisList[index].typeItem = [];
            return;
          }
          let list = [],
            list1 = [];
          for (let i in item) {
            let label = item[i].label.toString();
            let json = item[i].value
              ? { type: item[i].value }
              : {
                  type: this.otherId,
                  typeName: label.replace(this.newtext, ""),
                };
            list.push(json);
            list1.push({
              value: json.type,
              label: json.typeName ? json.typeName : label,
            });
            // console.log(list1)
          }
          this.thisList[index].typeList = list;
          this.thisList[index].typeItem = list1;
          break;
        case "productModel":
          let labelN = item.label.toString();
          item.value
            ? (this.thisList[index].model = item.value)
            : ((this.thisList[index].model = this.otherId),
              (this.thisList[index].productModel = labelN.replace(
                this.newtext,
                ""
              )));
          this.thisList[index].modelItem = [
            {
              label: item.value ? labelN : labelN.replace(this.newtext, ""),
              value: item.value ? item.value : this.otherId,
            },
          ];
          // console.log(this.thisList)
          break;
      }
    },
  },
  mounted() {
    if (!this.type || !this.name[this.type] || (this.edit && !this.dropdown)) {
      this.$refs.tableBrand.remove();
    }
    if (
      this.type === "FirewallProduct" ||
      this.type === "SecuritySoftwareProduct"
    ) {
      this.brandTitle = [
        {
          key: "productModel",
          res: "modelItem",
          name: "产品型号",
          width: 70,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应型号，您可以输入相应产品型号并选择",
        },
        {
          key: "number",
          res: "number",
          name: "产品数量",
          width: 40,
          input: true,
          placeholder: "请输入",
        },
      ];
    } else if (this.type === "service") {
      this.brandTitle = [
        {
          key: "service",
          res: "serviceItem",
          name: "服务内容",
          width: 30,
          input: true,
          placeholder: "请选择",
          title: "若未找到",
        },
        {
          key: "levelTxt",
          res: "levelItem",
          name: "供应链级别",
          width: 30,
          input: false,
          placeholder: "请选择",
        },
      ];
    } else {
      this.brandTitle = [
        {
          key: "brandName",
          res: "brandItem",
          name: "品牌名称",
          width: 30,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应品牌，您可以输入相应品牌名称并选择",
        },
        {
          key: "typeNames",
          res: "typeItem",
          name: "产品类型",
          width: 40,
          input: true,
          placeholder: "请选择",
          title: "若未找到对应类型，您可以输入相应产品类型并选择",
          multiple: true,
        },
        {
          key: "levelTxt",
          res: "levelItem",
          name: "供应链级别",
          width: 30,
          input: false,
          placeholder: "请选择",
        },
      ];
    }
  },
};
</script>


<style scoped>
a.AbleClick {
  color: #4780f4;
  padding: 5px;
}
a.AbleClick:hover {
  color: #7aa3f7;
}
.el-icon-circle-plus-outline {
  margin-right: 6px;
}
.tableBrand {
  width: 100%;
}
.title {
  margin-bottom: 14px;
  font-size: 14px;
  padding-left: 10px;
}
.title::before {
  content: "";
  display: inline-block;
  vertical-align: top;
  margin: 4px 8px 0 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #636365;
}
.tableBrand > ul.table > li {
  min-height: 40px;
  border-bottom: 1px solid #ebeef5;
}
.tableBrand > ul.table > li.empty {
  height: 80px;
  line-height: 80px;
  border-bottom: 0;
}
.tableBrand > ul.table > li > * {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  padding: 5px;
  box-sizing: border-box;
}
.tableBrand > ul.table > li > span > * {
  font-size: 14px;
}
.tableBrand > ul.table > li > span > .result {
  line-height: 30px;
}
.tableBrand > ul.table > li > .delete {
  padding: 0;
}
.tableBrand > ul.table > li > .delete > a {
  color: #ff2b2a;
}
.tableBrand > ul.table > li > .delete > a:hover {
  color: #fe6c6f;
}
.tableBrand > ul.table > li > .index {
  width: 50px;
}
.tableBrand > ul.table > li > span > .elDropdown {
  width: 100%;
}
.tableBrand > ul.table > li.th,
.tableBrand > ul.table > li.addLi {
  height: 40px;
}
.tableBrand > ul.table > li.th > *,
.tableBrand > ul.table > li.addLi > * {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
u.error {
  padding-left: 30px;
  line-height: 30px;
  display: block;
  position: relative;
}
u.error::before {
  display: inline-block;
  left: 0px;
  top: 0px;
  background-color: transparent;
}
</style>
<style>
.tableBrand > ul.table > li > span > .elDropdown > .el-select {
  width: 100%;
}
.tableBrand > ul.table > li > span > .elDropdown .el-select__tags,
.tableBrand > ul.table > li > span > .elDropdown .el-select__input {
  width: 100%;
  max-width: 100% !important;
  text-align: center;
}
.tableBrand > ul.table > li > span > .elDropdown .el-input__inner,
.tableBrand > ul.table > li > span > .elDropdown .el-select__input {
  height: 30px;
  line-height: 30px;
  border: 0;
  text-align: center;
  padding-right: 10px;
}
.tableBrand
  > ul.table
  > li
  > span
  > .elDropdown
  .el-select
  .el-input.is-focus
  .el-input__inner {
  border: 0;
}
.tableBrand > ul.table > li > span > .elDropdown .el-input__icon {
  line-height: 30px;
  width: 14px;
}
.tableBrand > ul.table > li > span > .elDropdown .el-input__suffix {
  right: -4px;
}
.specialDrop.el-select-dropdown {
  border: 0;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
}
.tableBrand > ul.table > li > span > .el-input > .el-input__inner {
  border: 0;
}
.tableBrand .tcn .el-input__inner {
  text-align: center;
}
</style>
