<template>
  <el-date-picker ref="time"
                  class="elTimebox"
                  :class="{'noClose':!clear}"
                  :disabled='disabled?true:false'
                  :picker-options="pickerOptions"
                  v-model="res"
                  type="week"
                  format="yyyy/MM/dd"
                  placeholder="选择周"
                  :clearable='clear?true:false'
                  @change='timeChange'
                  size='small'></el-date-picker>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_timeWeek',
    props:['value','clear','id','disabled','reset','maxtime','mintime'],
    data () {
        return{
            res:this.value&&this.value[0]?this.value[0]+this.oneday:'',
            oneday:24*60*60*1000,
            pickerOptions:{
                firstDayOfWeek: 1,
                disabledDate: (time)=>{
                   return this.maxtime&&this.mintime?(time.getTime() >= this.maxtime||time.getTime() < this.mintime):(this.maxtime?(time.getTime() >= this.maxtime):(this.mintime?(time.getTime() < this.mintime):false));
                }
            }
        }
    },
    created() {
      this.res = this.value&&this.value[0]?this.value[0]+this.oneday:''
    },
    watch:{
        res:{
            deep:true,
            handler(){
                this.setTime(this.res);
            },
        },
        value:{
            deep:true,
            handler(){
                this.res=this.value[0]+this.oneday;
                // this.setTime(this.res);
            },
        },
        reset(){
            this.res='';
        },
    },
    methods:{
        timeChange(time){
            // console.log(time)
            // this.setTime(time);
            this.$emit('return',time,this.id?this.id:null)
        },
        setTime(time){
            // console.log(time)
            let text=time?(this.$pubfunc.TimeTransform('YYYY/MM/DD',time.valueOf()-this.oneday)+'  至  '+this.$pubfunc.TimeTransform('YYYY/MM/DD',(time.valueOf()+this.oneday*5))):'';
            // text=text.split('/').join('-');
            this.$nextTick(()=>{
                this.$refs.time.$el.firstElementChild.value=text;
            })
            // console.log(this.$refs.time.$el.firstElementChild.value)
        }
    },
}
</script>
