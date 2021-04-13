<template>
  <el-table
    :row-key="child ? child : null"
    :expand-row-keys="child ? ['taskname'] : null"
    :data="judgeEmpty"
    style="width: 100%; color: #636980; fontsize: 14px"
    :header-cell-style="{ background: 'rgba(241,244,251,1)', color: '#5D6680' }"
    :row-class-name="wrap && wrap > 1 ? 'height' + wrap : ''"
    :header-row-class-name="wrap && wrap > 1 ? 'height' + wrap : ''"
    :cell-class-name="cellName"
    default-expand-all
    :tree-props="{ children: 'children' }"
    @cell-click="clickCell"
    ref="table"
    @selection-change="changeFun"
    :span-method="arraySpanMethod"
    :border="arrayMethod"
  >
    <el-table-column
      type="selection"
      :width="indexrow ? indexrow : 50"
      :index="indexMethod"
      v-if="indexrow !== 0 && checkbox"
      :selectable="checkSelectable"
    ></el-table-column>
    <el-table-column
      type="index"
      label="序号"
      :width="indexrow ? indexrow : 50"
      :index="indexMethod"
      v-if="indexrow !== 0"
    ></el-table-column>
    <!--  align='center' -->
    <el-table-column
      v-for="(item, i) in title"
      :key="i"
      :prop="item.key"
      :label="item.name"
      :style="{ background: '#fff' }"
      :min-width="item.width ? item.width : null"
      :width="item.mustwidth ? item.mustwidth : null"
      :align="item.align ? item.align : 'left'"
      :label-class-name="item.name.indexOf('<br/>') > -1 ? 'moreRow' : ''"
      :render-header="renderHeader"
    >
      <template slot-scope="scope">
        <span
          class="isEdit"
          v-if="isEdit && scope.column.property !== 'weightedScore'"
        >
          <el-input
            :placeholder="
              item.key === 'standardName'
                ? '请输入字段内容'
                : item.key === 'attributeValue'
                ? '请输入选项内容'
                : item.key === 'score'
                ? '请输入分值'
                : '请输入权重'
            "
            :class="{
              errorBorder:
                showError && !tableData[scope.$index][scope.column.property],
            }"
            v-model="tableData[scope.$index][scope.column.property]"
            @input="editTableData(scope.$index, scope.column.property)"
            @change="getBlurData"
            v-if="item.type === 'input'"
          ></el-input>
          <span
            class="add el-icon-plus"
            v-if="
              spanArr[scope.$index] > 0 &&
              scope.column.property === 'attributeValue'
            "
            @click="handleClick('addRow', scope.row)"
          ></span>
          <span
            class="del el-icon-close"
            v-else-if="
              spanArr[scope.$index] === 0 &&
              scope.column.property === 'attributeValue' &&
              scope.row.attributeList.length > 2
            "
            @click="handleClick('delRow', scope.row)"
          ></span>
        </span>
        <u class="isU" v-else-if="scope.column.property === 'weightedScore'">
          {{
            (
              (Number(tableData[scope.$index].score) *
                Number(tableData[scope.$index].weight)) /
              100
            ).toFixed(2) | emptyTxt
          }}
        </u>
        <u
          class="isU"
          v-else-if="scope.column.property === 'weight' && !isEdit"
        >
          {{ tableData[scope.$index][scope.column.property] + "%" }}
        </u>
        <u
          v-else
          class="isU"
          v-showtit="item.title ? false : true"
          :title="item.title ? item.title(item.key, scope.row) : ''"
          >{{ scope.row[item.key] | emptyTxt }}</u
        >
      </template>
    </el-table-column>
    <!--  align='center' -->
    <el-table-column
      fixed="right"
      label="操作"
      v-if="operation && operation.length > 0 && list.length > 0"
      :width="
        (opern ? opern : operation.length) > 1
          ? ((opern ? opern : operation.length) > 4
              ? 4
              : opern
              ? opern
              : operation.length) * 75
          : 120
      "
    >
      <template slot-scope="scope">
        <el-button
          style="padding: 3px 0"
          @click="handleClick(val.key ? val.key : val, scope.row)"
          type="text"
          v-for="(val, i) in operBtn(scope.row, scope.$index).length > 4
            ? operBtn(scope.row, scope.$index).slice(0, 3)
            : operBtn(scope.row, scope.$index)"
          :key="i"
          :class="[val.class ? val.class(scope.row) : null]"
          >{{ oper[val.key ? val.key : val] }}</el-button
        >
        <el-dropdown
          class="operationMore"
          placement="bottom"
          @command="
            (res) => {
              handleClick(res.key, res.row);
            }
          "
          @visible-change="
            (j) => {
              hoverIndex = j ? scope.$index : null;
            }
          "
          v-if="operBtn(scope.row, scope.$index).length > 4"
        >
          <el-button
            :class="{ hover: hoverIndex === scope.$index }"
            type="text"
            style="padding: 3px 0"
          >
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="operationMore_">
            <el-dropdown-item
              :class="[val.class ? val.class(scope.row) : null]"
              :command="{ row: scope.row, key: val.key ? val.key : val }"
              v-for="(val, i) in operBtn(scope.row, scope.$index).slice(
                3,
                operBtn(scope.row, scope.$index).length
              )"
              :key="i + 3"
              >{{ oper[val.key ? val.key : val] }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <span
          v-if="operBtn(scope.row, scope.$index).length === 0"
          style="padding: 0 2px"
          >--</span
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "ele_Table",
  // title:[{key:(string),name:(string),width:(string/number 选填)},...]
  // list:[{key(key对应title的key) :value,...},...]
  // operation:[{{key:(string 对应oper),show:(boolean/function 返回是否显示)}},...]
  // opern(number) operation中按钮个数，为了计算操作列行宽
  // classname:[{key(就是显示的class名) :{key(对应title中key class显示的列) :{key(对应list的value list的对应值包含在此对应的value中才会显示class) :value(可多个，逗号分隔),...}}},...]
  // child(string 对应title) 为row-key（树形必传）
  // indexrow(number) index行宽度
  // clickrow(arr 对应title) 需要传出点击事件的列
  // page(number) 当前页数
  // wrap(number) 改为表格1行内容可显示warp行,
  // checkbox 选择列
  //arrayMethod(boolean) 是否存在合并行
  //isEdit(boolean) 切换编辑状态的标识
  //showError(boolean) 是否显示错误状态
  //reviewConfig(boolean) 是否是供应商评审标准页面
  props: [
    "id",
    "title",
    "meta",
    "list",
    "operation",
    "opern",
    "classname",
    "child",
    "indexrow",
    "clickrow",
    "page",
    "wrap",
    "limit",
    "checkbox",
    "arrayMethod",
    "isEdit",
    "showError",
    "reviewConfig",
  ],
  data() {
    return {
      width: null,
      oper: {
        view: "查看",
        edit: "编辑",
        revise: "编辑",
        del: "移除",
        delete: "删除",
        addVisit: "添加拜访记录",
        share: "共享",
        transfer: "转移",
        submit: "提交",
        export: "导出",
        // addTask:'新建子任务',
        addDep: "添加子部门",
        stop: "停用",
        start: "启用",
        reset: "重置密码",
        assignRole: "分配角色",
        bindRole: "用户绑定",
        // download:'下载',
        // recall:'撤回',
        pass: "通过",
        reject: "驳回",
        amountallot: "分配比例",
        addApplication: "资源费用申请",
        save: "保存",
        cancel: "取消",
      },
      pageNum: this.page ? this.page - 1 : 0,
      multipleSelection: [],
      hoverIndex: null,
      spanArr: [],
      position: 0,
      tableData: [],
    };
  },
  watch: {
    list: {
      deep: true,
      handler(newV, oldV) {
        this.pageNum = this.page ? this.page - 1 : 0;
        this.tableData = JSON.parse(JSON.stringify(newV));
      },
    },
  },
  computed: {
    judgeEmpty() {
      return this.getlist(this.list.concat());
    },
  },
  directives: {
    showtit: {
      inserted: function (el, binding, vnode) {
        setTimeout(() => {
          if (!binding.value) {
            return;
          }
          // console.log(el,binding.value,vnode)
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
          if (!binding.value) {
            return;
          }
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
    emptyTxt(v) {
      // console.log(v)
      return v ? v : "--";
    },
  },
  methods: {
    renderHeader(h, { column, $index }) {
      // console.log(h, column, column.label)
      let html = [],
        arr = column.label.split("<br/>");
      // console.log(arr)
      for (let i in arr) {
        html.push(h("span", { style: "line-height:18px" }, arr[i]));
        html.push(h("br", null, ""));
      }
      return h("span", null, arr.length > 1 ? html : arr[0]);
    },
    changeFun(val) {
      this.multipleSelection = val; // 返回的是选中的列的数组集合
      this.$emit("selection", this.multipleSelection);
    },
    indexMethod(index) {
      return (
        (this.pageNum
          ? Number(this.pageNum) * (this.limit ? this.limit : 10) + index
          : index) + 1
      );
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.arrayMethod) {
        if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: this.spanArr[rowIndex] > 0 ? 1 : 0,
          };
        }
      }
    },
    editTableData(index, val) {
      switch (val) {
        case "standardName":
          this.tableData[index][val] = this.tableData[index][val].substring(
            0,
            10
          );
          break;
        case "attributeValue":
          this.tableData[index][val] = this.tableData[index][val].substring(
            0,
            20
          );
          break;
        case "score":
          var reg = /^(1|([1-9]\d{0,1})|100)$/;
          reg.test(this.tableData[index][val])
            ? null
            : (this.tableData[index][val] = "");
          break;
        case "weight":
          var reg = /^(1|([1-9]\d{0,1})|100)$/;
          reg.test(this.tableData[index][val])
            ? null
            : (this.tableData[index][val] = "");
          var obj = {};
          for (const [k, v] of Object.entries(this.tableData)) {
            if (k === 0) {
              obj[v.standardId] = v.weight;
            } else {
              if (Reflect.ownKeys(obj).indexOf(v.standardId) === -1) {
                obj[v.standardId] = v.weight;
              }
            }
          }
          var num = 0;
          for (const [k, v] of Object.entries(obj)) {
            if (v.indexOf("%") > -1) {
              num += Number(v.substring(0, v.indexOf("%")));
            } else {
              num += Number(v);
            }
          }
          if (num > 100) {
            this.$store.commit("confirmFn", {
              type: "error",
              text: "当前权重总和不得超过100%",
            });
            this.tableData[index][val] = "";
          }
          var standardId = this.tableData[index].standardId;
          for (const [k, v] of Object.entries(this.tableData)) {
            if (v.standardId === standardId) {
              v.weight = this.tableData[index][val];
            }
          }
          break;
      }
      this.tableData[index].weightedScore =
        (this.tableData[index].score * this.tableData[index].weight) / 100;
    },
    getBlurData() {
      this.$emit("getBlurData", this.tableData);
    },
    getRowSpan(data) {
      this.spanArr = [];
      data.map((item, index) => {
        if (index > 0) {
          if (
            (data[index].standardId &&
              data[index - 1].standardId &&
              data[index].standardId === data[index - 1].standardId) ||
            (!data[index].standardId &&
              data[index].addRow &&
              data[index - 1].addRow &&
              data[index].addRow === data[index - 1].addRow)
          ) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
            // spanOff2 = false
          }
        } else {
          this.spanArr.push(1);
        }
      });
    },
    getlist(list) {
      list.map((v) => {
        for (let k in this.title) {
          v[this.title[k].key] ? null : (v[this.title[k].key] = "");
        }
        v.children && v.children.length > 0
          ? (v.children = this.getlist(v.children.concat()))
          : null;
      });
      return list;
    },
    handleClick(type, row) {
      this.$emit("click", type, row, this.id ? this.id : null);
    },
    operBtn(item, i, k) {
      return this.operation.filter((val) => {
        return val.show ? val.show(item, i, val.key) : true;
      });
    },
    cellName({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex);
      let key = column.property,
        className = this.wrap ? [] : ["height1"];
      // console.log(key)
      if (this.classname) {
        for (let k in this.classname) {
          if (this.classname[k][key]) {
            for (let keys in this.classname[k][key]) {
              if (this.classname[k][key][keys] === true) {
                className.push(k);
              } else {
                let arr = this.classname[k][key][keys].split(",");
                // console.log(arr,row[keys],k)
                if (arr.indexOf(row[keys]) !== -1) {
                  className.push(k);
                }
              }
            }
          }
        }
      }
      if (this.clickCell(null, column)) {
        className.push("ableClick");
      }
      // if(column.type==='index'){className.push('indexCol')}
      return className.join(" ");
    },
    clickCell(row, column, cell, event) {
      // console.log(row, column, cell, event)
      if (this.clickrow) {
        let click = this.clickrow.split(",");
        if (click.indexOf(column.property) !== -1) {
          if (row) {
            let el = event
              ? event.toElement || event.target
              : { classList: [] };
            for (let k in el.classList) {
              if (el.classList[k] === "isU") {
                this.$emit(
                  "click",
                  column.property,
                  { row, column, cell, event },
                  this.id ? this.id : null
                );
                break;
              }
            }
          } else {
            row = true;
          }
        }
      }
      return row;
    },
    checkSelectable(row) {
      return row.isShare == "0";
    },
  },
  created() {
    this.getRowSpan(this.list);
    this.tableData = JSON.parse(JSON.stringify(this.list));
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.table && this.$refs.table.doLayout();
    });
  },
};
</script>

<style scoped>
.operationMore {
  display: inline-block;
  position: relative;
  margin-left: 18px;
}
.operationMore > span {
  color: #4780f4;
  padding: 10px 0;
}
.operationMore_ {
  margin-top: 0;
  padding: 10px 0;
  min-width: 100px;
}
.operationMore_ > li {
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}
.operationMore_ > li:not(.is-disabled) {
  color: #4780f4;
}
.operationMore_ > li.redbtn:not(.is-disabled) {
  color: #ff2b2a;
}
.operationMore_ > li:hover {
  background-color: #f5f7fa;
}
.el-icon-arrow-down.el-icon--right {
  transform: rotate(0deg);
  transition: transform 0.15s linear 0.05s;
}
.hover .el-icon-arrow-down.el-icon--right {
  transform: rotate(-180deg);
}
.uploadBox {
  width: auto !important;
  margin-right: 10px;
}
.isEdit {
  display: inline-block;
  width: 100%;
}
.isEdit .el-input {
  width: 80%;
}
.isEdit .add,
.isEdit .del {
  cursor: pointer;
}
.errorBorder .isEdit /deep/ .el-input__inner {
  border: 1px solid #f56c6c;
}
</style>
<style>
.boxRel .unitScrollbar > .el-scrollbar__wrap .el-table th.moreRow > .cell {
  white-space: pre-wrap;
  line-height: 18px;
  max-height: 34px;
  margin: -3px 0 -4px;
  -webkit-line-clamp: 2;
}
</style>