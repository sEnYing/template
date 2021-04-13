<template>
  <div :class="['elDropdown']">
    <el-select
      :popper-class="
        (align ? 'selectAlign' : '') + (special ? ' specialDrop' : '')
      "
      v-model="value"
      :placeholder="placeholder ? placeholder : ''"
      :filterable="input ? true : false"
      :multiple="multiple ? true : false"
      :clearable="multiple ? false : clear ? true : false"
      :filter-method="thisFilter"
      :disabled="disabled ? true : false"
      @visible-change="clickThis"
      @change="selectChange"
      @clear="selectChange(null)"
      ref="dropdown"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :disabled="item.disabled"
        :value="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "ele_Dropdown_cust",
  props: [
    "result",
    "list",
    "placeholder",
    "input",
    "create",
    "multiple",
    "disabled",
    "clear",
    "id",
    "reset",
    "align",
    "special",
    "newtext",
    "otherid",
    "thisList",
  ],
  data() {
    return {
      optionsNew: [],
      options: this.list ? this.list : [],
      value: "",
    };
  },
  watch: {
    reset() {
      this.value = "";
    },
    result: {
      deep: true,
      handler(v) {
        this.setValue(v);
      },
    },
    list: {
      deep: true,
      handler() {
        this.options = this.list ? this.list : [];
        this.setValue(this.result);
      },
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {};
    },
    newList() {
      return this.optionsNew.concat(this.list);
    },
  },
  mounted() {
    this.setValue(this.result);
    // console.log(this.thisList);

    this.options.map((item, index) => {
      this.thisList.map((i) => {
        i.model
          ? i.model === item.value
            ? (this.options[index].disabled = true)
            : (this.options[index].disabled = false)
          : (this.options[index].disabled = false);
      });
    });
  },
  methods: {
    setValue(v) {
      this.optionsNew = [];
      if (!v) {
        this.value = "";
        return;
      }
      // console.log(v)
      if (this.options.length > 0) {
        if (this.multiple) {
          this.value = v.map((v) => {
            let res = "";
            if (v.value !== this.otherid) {
              res = v.label;
            } else {
              this.optionsNew.push({
                label: v.label + this.newtext,
                value: v.label + this.newtext,
              });
              res = v.label + this.newtext;
            }
            return res;
          });
        } else {
          v[0].value === this.otherid
            ? (this.optionsNew.push({
                label: v[0].label + this.newtext,
                value: v[0].label + this.newtext,
              }),
              (this.value = v[0].label + this.newtext))
            : (this.value = v[0].label);
        }
      }
    },
    thisFilter(v) {
      let v_ = v + this.newtext;
      let list = [],
        judge = true;
      for (let i in this.newList) {
        if (this.newList[i].label.indexOf(v) > -1) {
          if (this.newList[i].label === v || this.newList[i].label === v_) {
            judge = false;
          }
          list.push(this.newList[i]);
        }
      }
      if (this.create) {
        judge && v ? list.splice(0, 0, { label: v_, value: v_ }) : null;
      }
      this.options = list;
    },
    selectChange(v) {
      if (v) {
        let list = [];
        if (!this.multiple) {
          for (let i in this.list) {
            if (this.list[i].label === v) {
              // console.log(this.options[i].value,v)
              this.$emit("change", this.list[i], this.id ? this.id : null);
              return;
            }
          }
          list = { value: "", label: v };
        } else {
          let value = v.concat();
          for (let i in this.list) {
            if (value.indexOf(this.list[i].label) !== -1) {
              list.push(JSON.parse(JSON.stringify(this.list[i])));
              value.splice(value.indexOf(this.list[i].label), 1);
            }
          }
          if (value.length > 0) {
            this.optionsNew = [];
            value.map((v) => {
              list.push({
                value: "",
                label: v,
              });
            });
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
        this.options = this.newList;
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
