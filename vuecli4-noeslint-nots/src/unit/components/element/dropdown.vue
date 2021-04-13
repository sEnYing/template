<template>
  <div :class="['elDropdown', type]">
    <el-select
      :popper-class="
        (align ? 'selectAlign' : '') + (special ? ' specialDrop' : '')
      "
      @visible-change="clickThis"
      v-model="value"
      :placeholder="placeholder ? placeholder : ''"
      :filterable="input ? true : false"
      :multiple="multiple ? true : false"
      :clearable="multiple ? false : clear ? true : false"
      :allow-create="input && create ? true : false"
      :default-first-option="input && !create ? true : false"
      :disabled="disabled ? true : false"
      @change="selectChange"
      @clear="selectChange(null)"
    >
      <el-option
        v-for="item in options"
        :disabled="item.disabled ? item.disabled : false"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "ele_Dropdown",
  props: [
    "list",
    "result",
    "placeholder",
    "input",
    "multiple",
    "disabled",
    "type",
    "clear",
    "id",
    "reset",
    "align",
    "special",
    "create",
  ],
  data() {
    return {
      options: this.list ? this.list : [],
      value:
        this.list.length > 0
          ? this.result
            ? JSON.parse(JSON.stringify(this.result))
            : ""
          : "",
      show: false,
    };
  },
  watch: {
    reset() {
      this.value = "";
    },
    result() {
      // console.log(this.result)
      this.value =
        this.options.length > 0
          ? this.result
            ? JSON.parse(JSON.stringify(this.result))
            : ""
          : "";
    },
    list: {
      deep: true,
      handler() {
        this.value = this.result ? JSON.parse(JSON.stringify(this.result)) : "";
        this.options = this.list.concat();
        // console.log(this.options)
      },
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {};
    },
  },
  methods: {
    selectChange(v) {
      // console.log(v,this.options)
      if (v) {
        let list = [];
        if (!this.multiple) {
          for (let i in this.options) {
            if (this.options[i].value === v) {
              // console.log(this.options[i].value,v)
              this.$emit("change", this.options[i], this.id ? this.id : null);
              return;
            }
          }
        } else {
          for (let i in this.options) {
            if (v.indexOf(this.options[i].value) !== -1) {
              list.push(this.options[i]);
            }
          }
        }
        this.$emit("change", list, this.id ? this.id : null);
      } else {
        this.$emit(
          "change",
          { label: "", value: "" },
          this.id ? this.id : null
        );
      }
    },
    clickThis(j) {
      this.$emit("click", this.id ? this.id : null);
      if (j) {
        this.options = this.list.concat();
      }
    },
  },
};
</script>


<style scoped>
.elDropdown {
  display: inline-block;
  vertical-align: top;
}
</style>
<style>
.selectAlign .el-select-dropdown__item {
  text-align: center;
}
</style>
