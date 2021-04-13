<template>
  <div class="content">
    <show-button v-if="judgeShow('button')"></show-button>
    <show-upload v-if="judgeShow('upload')"></show-upload>
    <show-over v-if="judgeShow('over')"></show-over>
    <show-treebox v-if="judgeShow('treebox')"></show-treebox>
    <show-calendar v-if="judgeShow('calendar')"></show-calendar>
  </div>
</template>

<script>
import showButton from "./unit/button";
import showUpload from "./unit/upload";
import showOver from "./unit/over";
import showTreebox from "./unit/treebox";
import showCalendar from "./unit/calendar";
export default {
  name: "other",
  props: ["dom"],
  components: {
    showButton,
    showUpload,
    showOver,
    showTreebox,
    showCalendar
  },
  data() {
    return {};
  },
  methods: {
    judgeShow(key) {
      let code = this.$route.hash ? this.$route.hash.replace("#", "") : "";
      return code === key ? true : false;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped>
.content {
  padding: 12px 16px;
  text-align: center;
}
</style>
