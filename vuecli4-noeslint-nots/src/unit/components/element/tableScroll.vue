<template>
  <div
    class="boxRel tableScrollBox"
    :class="[
      scroll ? 'scrollWidth' : '',
      (total && total > (limit ? limit : 10)) || smallRel ? 'smallRel' : '',
    ]"
    v-if="ojbk"
  >
    <el-scrollbar class="unitScrollbar" ref="scrollbar">
      <unit-table
        @selection="getData"
        :style="{
          width: scroll ? scroll + 'px' : null,
          maxWidth: scroll ? scroll + 'px' : null,
        }"
        ref="table"
        :title="title"
        :list="list"
        :operation="operation"
        :opern="opern"
        :classname="classname"
        :child="child"
        :indexrow="indexrow"
        :clickrow="clickrow"
        :checkbox="checkbox"
        :isEdit="isEdit"
        :showError="showError"
        :page="page"
        :wrap="wrap"
        :limit="limit"
        :arrayMethod="arrayMethod"
        @click="tableClick"
        @getBlurData="getBlurData"
      ></unit-table>
    </el-scrollbar>
  </div>
</template>

<script>
import unitTable from "@/unit/components/element/table";
export default {
  name: "tablescroll",
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
  //arrayMethod(boolean) 是否存在合并行
  //isEdit(boolean) 切换编辑状态的标识
  //showError(boolean) 是否显示错误状态
  props: [
    "title",
    "total",
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
    "scroll",
    "dom",
    "tree",
    "smallRel",
    "checkbox",
    "arrayMethod",
    "isEdit",
    "showError",
  ],
  components: { unitTable },
  data() {
    return {
      ojbk: true, //重置scroll
      data: "",
    };
  },
  watch: {
    list: {
      deep: true,
      handler() {
        if (this.tree) {
          return;
        }
        this.ojbk = false;
        this.$nextTick((v) => {
          this.ojbk = true;
          this.setDate();
        });
      },
    },
    dom: {
      deep: true,
      handler() {
        this.$nextTick((v) => {
          let width = this.$refs.scrollbar.$el.firstChild.offsetWidth - 17;
          this.scroll &&
          this.$refs.scrollbar &&
          this.$refs.scrollbar.$el &&
          this.$refs.scrollbar.$el.firstChild &&
          this.$refs.table.$el.getElementsByClassName("el-table__empty-text")
            .length > 0
            ? (this.$refs.table.$el.getElementsByClassName(
                "el-table__empty-text"
              )[0].style.width = Number(width / this.scroll) * 100 + "%")
            : null;
        });
      },
    },
  },
  methods: {
    getBlurData(v) {
      console.log(v);
      this.$emit("getBlurData", v);
    },
    getData(val) {
      this.data = val;
      this.$emit("selection", this.data);
    },
    tableClick(k, v) {
      this.$emit("click", k, v);
    },
    setDate() {
      this.$nextTick(() => {
        // console.log(this.$refs.table.$el.childNodes[1].style.top,this.$refs.scrollbar.$el.firstChild.scrollTop)
        if (
          this.$refs.scrollbar &&
          this.$refs.scrollbar.$el &&
          this.$refs.scrollbar.$el.firstChild
        ) {
          this.$refs.scrollbar.$el.firstChild.scrollTop = 0;
          this.$refs.scrollbar.$el.firstChild.scrollLeft = 0;
          let width = this.$refs.scrollbar.$el.firstChild.offsetWidth - 17;
          this.scroll &&
          this.$refs.table.$el.getElementsByClassName("el-table__empty-text")
            .length > 0
            ? (this.$refs.table.$el.getElementsByClassName(
                "el-table__empty-text"
              )[0].style.width = Number(width / this.scroll) * 100 + "%")
            : null;
          // this.$refs.table.$el.childNodes[1].style.top=0;
          // this.$refs.table.$el.getElementsByClassName('el-table__empty-text').length>0?(this.$refs.table.$el.getElementsByClassName('el-table__empty-text')[0].style.left=0):null
          // console.log(this.$refs,this.list)
          this.$refs.scrollbar.$el.firstChild.addEventListener(
            "scroll",
            () => {
              // this.$refs.scrollbar.$el.firstChild.scrollTop
              // console.log(this.$refs.scrollbar,this.$refs.scrollbar.$el.firstChild.scrollTop)
              // console.log(this.$refs.table.$el.getElementsByClassName('el-table__empty-text'))
              // console.log(266-this.$pubfunc.getClientRect(this.$refs.scrollbar.$el.firstChild.firstChild).top,this.$refs.scrollbar.$el.firstChild.scrollTop)
              this.$refs.table.$el.childNodes[1].style.top =
                this.$refs.scrollbar.$el.firstChild.scrollTop + "px";
              this.scroll &&
              this.$refs.table.$el.getElementsByClassName(
                "el-table__empty-text"
              ).length > 0
                ? (this.$refs.table.$el.getElementsByClassName(
                    "el-table__empty-text"
                  )[0].style.left =
                    this.$refs.scrollbar.$el.firstChild.scrollLeft + "px")
                : null;
            },
            { capture: true, passive: true }
          );
        }
      });
    },
  },
  mounted() {
    this.setDate();
  },
};
</script>
<style scoped>
.fillBox .boxTable .smallRel {
  height: calc(100% - 46px);
}
</style>
<style>
/* .boxRel .unitScrollbar>.el-scrollbar__wrap{
    padding-bottom: 0;
    overflow-x: hidden;
} */
.fillBox .boxTable .boxRel.tableScrollBox:not(.smallRel) + div.pageBox {
  display: none;
}
.tableScrollBox.scrollWidth
  .unitScrollbar
  > .el-scrollbar__wrap
  .el-table__empty-text {
  float: left;
  display: block;
  position: absolute;
  left: 0;
}
</style>

