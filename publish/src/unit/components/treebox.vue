<template>
  <div class="newTree toila-form" @click.stop>
    <el-popover
      popper-class="toila-treeBox"
      placement="bottom"
      transition="el-zoom-in-top"
      trigger="manual"
      v-model="show"
      :offset="0"
      :width="width"
    >
      <div
        ref="treeF"
        @click="judgeShow(true)"
        slot="reference"
        class="treeResult el-input__inner"
        :class="{ is_focus: show }"
        @mouseenter="changeIcon(false)"
        @mouseleave="changeIcon(true)"
      >
        <i v-if="placeholder && result.length === 0">{{ placeholder }}</i
        ><unit-over
          :content="returnResult(this.label).join(' / ')"
          v-if="returnResult(this.label).length > 0"
        ></unit-over
        ><span class="el-input__suffix"
          ><span class="el-input__suffix-inner"
            ><i
              class="el-select__caret el-input__icon el-icon-arrow-up"
              v-show="
                !(clear !== undefined && clear !== false) ||
                  (clear !== undefined &&
                    clear !== false &&
                    (showIcon || result.length === 0))
              "
            ></i
            ><i
              class="el-select__caret el-input__icon el-icon-circle-close"
              v-if="
                clear !== undefined &&
                  clear !== false &&
                  result.length > 0 &&
                  !showIcon
              "
              @click.stop="clearRes"
            ></i></span
        ></span>
      </div>
      <el-input
        v-model="inputTxt"
        @click="judgeShow"
        placeholder="筛选"
        v-if="list && list.length > 0 && input !== undefined && input !== false"
      ></el-input>
      <p class="el-select-dropdown__empty" v-if="!list || list.length === 0">
        无数据
      </p>
      <el-scrollbar v-if="list && list.length > 0">
        <el-tree
          @check="getCheck"
          :data="list"
          show-checkbox
          :default-expand-all="
            defaultexpand === true || defaultexpand === undefined ? true : false
          "
          :default-expanded-keys="expandArr"
          :expand-on-click-node="
            onlyleave !== undefined &&
            onlyleave !== false &&
            !(relation !== undefined && relation !== false)
              ? true
              : false
          "
          :check-on-click-node="
            (onlyone !== undefined && onlyone !== false) ||
            (onlyleave !== undefined &&
              onlyleave !== false &&
              !(relation !== undefined && relation !== false))
              ? true
              : false
          "
          :class="{
            hidParent:
              onlyleave !== undefined &&
              onlyleave !== false &&
              !(relation !== undefined && relation !== false)
          }"
          :check-strictly="
            relation !== undefined && relation !== false ? false : true
          "
          :node-key="keyid"
          :props="{
            children: this.children,
            label: this.label,
            disabled: this.disabled
          }"
          :filter-node-method="filterNode"
          ref="tree"
          highlight-current
        ></el-tree>
        <!-- expand-on-click-node 是否在点击节点的时候展开或者收缩节点 -->
        <!-- check-on-click-node 是否在点击节点的时候选中节点 -->
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "treebox",
  props: [
    "list",
    "id",
    "placeholder",
    "choose",
    "onlyleave",
    "relation",
    "clear",
    "input",
    "must",
    "onlyone",
    "option",
    "defaultexpand"
  ],
  data() {
    return {
      name: new Date().valueOf() + Math.floor(Math.random() * 1000000),
      inputTxt: "",
      showIcon: true,
      show: false,
      width: 324,
      result: this.choose ? this.getRes(this.list.concat()) : [],
      keyid: this.option && this.option.key ? this.option.key : "value",
      label: this.option && this.option.label ? this.option.label : "label",
      children:
        this.option && this.option.children ? this.option.children : "children",
      disabled:
        this.option && this.option.disabled ? this.option.disabled : "disabled",
      expandArr: []
    };
  },
  computed: {
    treebox() {
      return this.$store.state.treebox;
    }
  },
  watch: {
    choose: {
      deep: true,
      handler() {
        this.result = this.getRes(this.list.concat());
      }
    },
    result: {
      deep: true,
      handler() {
        // console.log(this.result,this.returnResult("id"))
        // console.log(this.result,this.returnResult(this.keyid))
        this.$refs.tree
          ? this.$refs.tree.setCheckedKeys(this.returnResult(this.keyid))
          : null;
      }
    },
    list: {
      deep: true,
      handler(v) {
        this.result = this.getRes(v.concat());
        if (this.defaultexpand && Number(this.defaultexpand) > 0) {
          this.expandArr = this.judgeExpand(v);
          // console.log(this.expandArr)
        }
      }
    },
    inputTxt: {
      deep: true,
      handler(val) {
        if (val || val === "") {
          // console.log(val)
          this.$refs.tree ? this.$refs.tree.filter(val) : null;
        }
      }
    },
    show(v) {
      if (v) {
        this.inputTxt = "";
        let w = this.$refs.treeF.offsetWidth;
        this.width = Math.ceil(w / 2) * 2;
        this.$store.commit("treeboxFn", this.name);
      }
    },
    treebox(v) {
      v !== this.name ? (this.show = false) : null;
    }
  },
  methods: {
    judgeExpand(list, arr, index) {
      arr ? null : (arr = []);
      index ? null : (index = 0);
      if (index >= Number(this.defaultexpand)) {
        return arr;
      }
      index++;
      for (let k in list) {
        arr = [...arr, list[k][this.keyid]];
        if (list[k][this.children] && list[k][this.children].length > 0) {
          arr = this.judgeExpand(list[k][this.children], arr, index);
        }
      }
      return arr;
    },
    judgeShow(j) {
      if (j === true) {
        this.show = !this.show;
      } else {
        this.show = true;
      }
      // console.log(this.show)
      this.show && this.list && this.list.length > 0
        ? this.$nextTick(() => {
            // console.log(this.result,this.returnResult("id"))
            this.$refs.tree.setCheckedKeys(this.returnResult(this.keyid));
          })
        : null;
    },
    listenClick(e) {
      this.show ? (this.show = false) : null;
    },
    clearRes() {
      this.result = [];
      this.$emit("return", this.result, this.id ? this.id : "treebox");
    },
    getCheck(item, choose) {
      // console.log(item,choose,this.$refs.tree.getCheckedNodes(true))
      let arr = this.$refs.tree.getCheckedNodes(
        this.onlyleave !== undefined && this.onlyleave !== false ? true : false
      );
      if (this.onlyone !== undefined && this.onlyone !== false) {
        this.result = [item];
      } else {
        this.result =
          this.must !== undefined && this.must !== false
            ? arr.length === 0
              ? [item]
              : arr
            : arr;
      }
      this.$emit("return", this.result, this.id ? this.id : "treebox");
    },
    returnResult(k) {
      let label = [];
      this.result.map(v => {
        label.push(v[k]);
      });
      return label;
    },
    getRes(list) {
      let arr = [];
      list.map(v => {
        if (this.choose.indexOf(v[this.keyid]) !== -1) {
          arr.push(v);
        }
        arr = arr.concat(
          v[this.children] && v[this.children].length > 0
            ? this.getRes(v[this.children])
            : []
        );
      });
      return arr;
    },
    changeIcon(j) {
      this.clear !== undefined && this.clear !== false
        ? (this.showIcon = j)
        : null;
    },
    filterNode(value, data) {
      // console.log(value,data)
      if (!value) return true;
      return data[this.label].indexOf(value) !== -1;
    }
  },
  mounted() {
    this.choose ? (this.result = this.getRes(this.list.concat())) : null;
    window.addEventListener("click", this.listenClick);
    if (
      this.list &&
      this.list.length > 0 &&
      this.defaultexpand &&
      Number(this.defaultexpand) > 0
    ) {
      this.expandArr = this.judgeExpand(this.list);
      // console.log(this.expandArr)
    }
  },
  destroyed() {
    window.removeEventListener("click", this.listenClick);
  }
};
</script>

<style scoped>
.newTree {
  width: 324px;
  height: 32px;
  position: relative;
  line-height: 30px;
  font-size: 14px;
}
.newTree.auto {
  width: 100%;
}
.newTree .treeResult {
  cursor: pointer;
  padding-right: 30px;
  position: relative;
}
.newTree .treeResult > i {
  color: #c0c4cc;
  line-height: 30px;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
}
.newTree .treeResult > div {
  display: block;
  float: left;
  width: 100%;
  line-height: 30px;
}
.newTree .treeResult:not(.is_focus) > span i:not(.el-icon-circle-close) {
  transform: rotateZ(180deg);
}
.newTree .treeResult > span {
  top: -1px;
  height: 32px;
}
.newTree .treeResult:not(.is_focus) > span i:not(.el-icon-circle-close) {
  transition: opacity 0.2s ease, transform 0.2s ease,
    -webkit-transform 0.2s ease;
  opacity: 0.6;
  line-height: 32px;
  vertical-align: top;
}
</style>
<style>
.toila-treeBox {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.toila-treeBox .el-scrollbar__wrap {
  max-height: 200px;
}
.toila-treeBox .el-tree__empty-block {
  padding: 10px 0;
  height: 60px;
  line-height: 40px;
  margin: 0;
  text-align: center;
}
.toila-treeBox .el-tree__empty-block > .el-tree__empty-text {
  color: #999;
  font-size: 14px;
  top: 40%;
}
.toila-treeBox > div {
  position: relative;
  width: 100%;
  border-radius: 2px;
}
.toila-treeBox .el-input__inner {
  width: 96%;
  height: 30px;
  margin: 6px 2% 4px;
  padding: 0 14px;
  border-radius: 3px;
}
.toila-treeBox .el-checkbox {
  margin-right: 6px;
}
.toila-treeBox .popper__arrow {
  left: 35px !important;
}
.toila-treeBox
  .hidParent
  .el-tree-node__expand-icon:not(.is-leaf)
  + .el-checkbox {
  display: none;
}
</style>
