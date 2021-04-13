<template>
  <div :class="['elDropdown']">
    <el-select
      :popper-class="align ? 'selectAlign' : ''"
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
      @blur="getVal"
      ref="dropdown"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "ele_Dropdown_cust",
  props: [
    "result",
    "placeholder",
    "input",
    "create",
    "multiple",
    "disabled",
    "clear",
    "id",
    "reset",
    "align",
    "showfirst",
    "param"
  ],
  data() {
    return {
      list: [],
      options: [],
      value: "",
      show: false,
    };
  },
  watch: {
    reset() {
      this.value = "";
    },
    result() {
      this.value =
        this.options.length > 0 ? this.result ? JSON.parse(JSON.stringify(this.judgeRes(this.result))) : "" : "";
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {};
    }
  },
  methods: {
    judgeRes(id) {
      let option = this.options;
      for (let i in option) {
        if (option[i].value === id) {
          return id;
        }
      }
      this.$emit("change", "", this.id ? this.id : null);
      return "";
    },
    getList() {
      this.$api.public.customer(res => {
        switch (res.code) {
          case "0":
            this.list = res.data ? res.data : [];
            this.options = res.data ? res.data : [];
            this.value = this.result
              ? JSON.parse(JSON.stringify(this.judgeRes(this.result)))
              : "";
            if (this.value && this.showfirst) {
              this.selectChange(this.value, "showfirstCus");
            }
            break;
        }
      });
    },
    getVal() {

    },
    thisFilter(v) {
      if (this.create) {
        this.value = v;
        this.selectChange(v);
      } else {
        this.value = v;
      }
      let list = [];
      for (let i in this.list) {
        if (this.list[i].label.indexOf(v) > -1) {
          list.push(this.list[i]);
        }
      }
      this.options = list;
    },
    selectChange(v, abc) {
      if (v) {
        let list = [];
        if (!this.multiple) {
          for (let i in this.options) {
            if (this.options[i].value === v) {
              // console.log(this.options[i].value,v)
              this.$emit(
                "change",
                this.options[i],
                abc ? abc : this.id ? this.id : null
              );
              return;
            }
          }
          list = { label: v, value: v };
        } else {
          for (let i in this.options) {
            if (v.indexOf(this.options[i].value) !== -1) {
              list.push(this.options[i]);
            }
          }
          list.length === 0 ? list.push({ label: v, value: v }) : null;
        }
        this.$emit("change", list, this.id ? this.id : null);
      } else {
        this.$emit(
          "change",
          { label: "", value: "" },
          abc ? abc : this.id ? this.id : null
        );
      }
    },
    clickThis(j) {
      this.$emit("click", this.id ? this.id : null);
      if (j) {
        this.options = this.list.concat();
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.input && this.create
      ? this.$refs.dropdown.$el
        .getElementsByTagName("input")[0]
        .addEventListener("keydown", e => {
          if (e.keyCode === 13) {
            let v = this.$refs.dropdown.$el.getElementsByTagName("input")[0]
              .value;
            this.selectChange(v);
            if (!v) {
              this.$refs.dropdown.$el
                .getElementsByTagName("input")[0]
                .setAttribute(
                  "placeholder",
                  this.placeholder ? this.placeholder : ""
                );
            }
            this.$nextTick(() => {
              this.$emit("enter");
            });
          }
        })
      : null;
  }
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
