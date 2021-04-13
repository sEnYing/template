<template>
  <el-date-picker
    ref="datetime"
    :editable="editable === false ? false : true"
    :disabled="disabled ? true : false"
    :picker-options="
      disableddate ? options[disableddate - 1] : { firstDayOfWeek: 1 }
    "
    :format="time ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'"
    class="elTimebox"
    :class="{ noClose: !clear }"
    v-model="res"
    :type="time ? 'datetime' : 'date'"
    :placeholder="
      placeholder || placeholder === ''
        ? placeholder
        : '请选择' + (time ? '时间' : '日期')
    "
    :default-time="this.getNow().time + ':00'"
    @change="timeChange"
    :clearable="clear ? true : false"
    size="small"
  ></el-date-picker>
</template>

<script>
// import css和第三方js
export default {
  name: "ele_Timebox",
  props: [
    "value",
    "clear",
    "id",
    "time",
    "disabled",
    "placeholder",
    "editable",
    "disableddate",
    "date",
    "reset"
  ],
  data() {
    return {
      res: this.value ? this.value : ""
    };
  },
  computed: {
    options() {
      // console.log(this.date)
      return [
        {
          firstDayOfWeek: 1,
          disabledDate: time => {
            let json = this.date
              ? this.$pubfunc.timestampToTime(this.date)
              : this.getNow().json;
            return (
              time.getTime() <
              new Date(
                json.Year,
                Number(json.Month) - 1,
                json.Day,
                this.date ? 24 : 0,
                0,
                0
              )
            );
          },
          selectableRange: "00:00:00-23:59:59"
        },
        {
          firstDayOfWeek: 1,
          disabledDate: time => {
            let json = this.date
              ? this.$pubfunc.timestampToTime(this.date)
              : this.getNow().json;
            return (
              time.getTime() >
              new Date(
                json.Year,
                Number(json.Month) - 1,
                json.Day,
                this.date ? -1 : 23,
                59,
                59
              )
            );
          },
          selectableRange: "00:00:00-23:59:59"
        }
      ];
    }
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.res = this.value;
      }
    },
    reset() {
      this.res = "";
    },
    res(v, o) {
      console.log(v, o)
      if (
        v &&
        v !== this.value &&
        this.disableddate &&
        this.$pubfunc.TimeTransform("YYYY/MM/DD", v) !==
        this.$pubfunc.TimeTransform("YYYY/MM/DD", o)
      ) {
        this.judgeOptions(v);
      }
    }
  },
  methods: {
    getNow() {
      let now = this.$pubfunc.getTimeNum();
      // console.log(now)
      let date = this.$pubfunc.TimeTransform("YYYY/MM/DD", now),
        time = this.$pubfunc.TimeTransform("hh:mm", now),
        json = this.$pubfunc.timestampToTime(now);
      // console.log(date,time)
      return { now, date, time, json };
    },
    timeChange(time) {
      this.$emit("return", time, this.id ? this.id : null);
    },
    judgeOptions(v) {
      // console.log(v,this.$refs.datetime)
      let index = this.disableddate - 1,
        now = this.getNow();
      // console.log(now)
      let chooseDate = this.$pubfunc.TimeTransform("YYYY/MM/DD", v),
        selectableRange = index ? "00:00:00-" : ":00-23:59:59",
        json = this.$pubfunc.timestampToTime(v);
      selectableRange = index
        ? selectableRange +
        (now.date === chooseDate ? now.time : "23:59") + ":59"
        : (now.date === chooseDate ? now.time : "00:00") + selectableRange;
      this.options[index].selectableRange = selectableRange;
      this.res = new Date(
        json.Year,
        Number(json.Month) - 1,
        json.Day,
        now.json.Hour,
        now.json.Minite,
        0
      );
      // console.log(this.options.selectableRange)
    }
  },
  created() {
  },
  mounted() { }
};
</script>
