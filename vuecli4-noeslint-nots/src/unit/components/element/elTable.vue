<template>
  <div class="elTable">
    <el-table
      :data="list"
      style="width: 100%; color: #636980; fontsize: 14px"
      :header-cell-style="{
        background: 'rgba(241,244,251,1)',
        color: '#5D6680',
      }"
      :row-key="child ? child : null"
      :expand-row-keys="child ? ['taskname'] : null"
      default-expand-all
      ref="table"
      @selection-change="changeFun"
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
      <el-table-column
        v-for="(item, i) in title"
        :key="i"
        :prop="item.key"
        :label="item.name"
        :style="{ background: '#fff' }"
        :min-width="item.width ? item.width : null"
        :align="item.align ? item.align : 'left'"
      >
      </el-table-column>
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
  </div>
</template>

<script>
export default {
  props: [
    "indexrow",
    "checkbox",
    "list",
    "title",
    "page",
    "limit",
    "operation",
    "opern",
    "child",
  ],
  data() {
    return {
      tableData: [],
      pageNum: this.page ? this.page - 1 : 0,
      multipleSelection: [],
      oper: {},
    };
  },
  watch: {
    list: {
      deep: true,
      handler(newV, oldV) {
        this.pageNum = this.page ? this.page - 1 : 0;
      },
    },
  },

  methods: {
    handleClick(type, row) {
      this.$emit("click", type, row, this.id ? this.id : null);
    },
    checkSelectable(row) {
      return false;
    },
    operBtn(item, i, k) {
      return this.operation.filter((val) => {
        return val.show ? val.show(item, i, val.key) : true;
      });
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
  },
};
</script>

<style scoped lang='scss'>
.elTable {
}
</style>
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
</style>