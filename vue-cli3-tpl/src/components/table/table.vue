<template>
  <div class="newCom-wrap">
    {{ data.componentName }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { NewComData } from "@/types/components/newCom.interface";
// import {  } from "@/components" // 组件

@Component({})
export default class About extends Vue {
  /**
   * @description props写法:  对应 props:['name'] // props:{name:{required:false,default:''}}
   */
  @Prop({
    required: false,
    default: "",
  })
  name!: string;

  /**
   * @description Inject写法:  对应 Inject:['closeC']
   */
  @Inject("closeC")
  closeC!: void;

  // data
  data: NewComData = {
    componentName: "newCom",
  };

  created() {
    //
  }

  activated() {
    //
  }

  mounted() {
    //
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";

.newCom-wrap {
  width: 100%;
}
</style>

