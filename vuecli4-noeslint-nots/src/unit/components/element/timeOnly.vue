<template>
<!-- arrow-control -->
    <!-- <el-time-picker @click.native="click" ref='time' popper-class='timeOnly' @focus="clickThis" is-range format="HH:mm:ss" class="elTimebox" v-model="res" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @change='timeChange' :clearable='clear?true:false' size='small'></el-time-picker> -->
    <div>
        <div v-if="disabled!==true" :class="{'hasclear':clear,'is-active':active}" :asf='active' class="el-date-editor el-range-editor el-input__inner elTimebox el-date-editor--timerange el-range-editor--small" @mouseenter="showEmp(true)" @mouseleave="showEmp(false)">
            <i class="el-input__icon el-range__icon el-icon-time"></i>
            <input v-model='start' autocomplete="off" placeholder="开始时间" name="" class="el-range-input" @click="click('start')" ref='startInput' @input="input('start')" @blur="blur('start')" @focus="focus">
            <span class="el-range-separator">至</span>
            <input v-model='end' autocomplete="off" placeholder="结束时间" name="" class="el-range-input" @click="click('end')" ref='endInput' @input="input('end')" @blur="blur('end')" @focus="focus">
            <i class="el-select__caret el-input__icon el-icon-circle-close" v-show="show&&(this.start||this.end)" v-if="clear" @click='clearThis'></i>
            <div class="hideTime">
                <span>
                    <el-time-select
                        v-model="start1"
                        :picker-options="{
                        start: starttime?starttime:'00:00',
                        step: '00:30',
                        end: endtime?endtime:'24:00'
                        }" ref='start' @change='timeChange'>
                    </el-time-select>
                </span>
                <span>
                    <el-time-select
                        v-model="end1"
                        :picker-options="{
                        start: starttime?starttime:'00:00',
                        step: '00:30',
                        end: endtime?endtime:'24:00'
                        }" ref='end' @change='timeChange'>
                    </el-time-select>
                </span>
            </div>
        </div>
        <div v-if="disabled===true"><div class="input unable el-date-editor el-range-editor el-input__inner elTimebox el-date-editor--timerange el-range-editor--small">
            <i class="el-input__icon el-range__icon el-icon-time"></i>
            <span class="el-range-input">开始时间</span>
            <span class="el-range-separator">至</span>
            <span class="el-range-input">结束时间</span>
        </div></div>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_TimeOnly',
    props:['value','clear','id','date','disabled','starttime','endtime'],
    data () {
        return{
            active:false,
            show:false,
            start: this.value?this.value[0]:'',
            end: this.value?this.value[1]:'',
            start1:this.value?this.value[0].split(':').splice(0,2).join(':'):'',
            end1:this.value?this.value[1].split(':').splice(0,2).join(':'):''
        }
    },
    watch:{
        value:{
            deep:true,
            handler(){
                // console.log(this.value[0].split(':').splice(0,2).join(':'))
                this.value?(
                    this.start=this.value[0],
                    this.end=this.value[1],
                    this.start1=this.value[0].split(':').splice(0,2).join(':'),
                    this.end1=this.value[1].split(':').splice(0,2).join(':')
                    ):(
                        this.start='',
                        this.end='',
                        this.start1='',
                        this.end1=''
                        );
            },
        },
    },
    methods:{
        showEmp(j){this.show=j;},
        click(ref){
            switch(ref){
                case 'start':this[ref+'1']?null:(this[ref+'1']=this.starttime?this.starttime:'08:30');break
                case 'end':this[ref+'1']?null:(this[ref+'1']=this.endtime?this.endtime:'17:30');break
            }
            this.$nextTick(()=>{
                this.$refs[ref].focus();
                this.$nextTick(()=>{
                    this.$refs[ref+'Input'].focus();
                })
            })
            this.timeChange()
        },
        input(ref){
            let time=this[ref]?this[ref].split(':').splice(0,2).join(':'):'';
            time=time.replace(/[^0-9:]/g, '');
            let timeArr=time?time.split(':'):[];
            // console.log(timeArr[1].slice(0,2))
            // time?(timeArr[1]=timeArr[1].slice(0,2),(timeArr[1]=timeArr[1]>=30?'30':'00'),time=timeArr.join(':')):null;
            if(time){
                timeArr[0]?null:timeArr[0]='00';
                Number(timeArr[0])<10?(timeArr[0]='0'+Number(timeArr[0])):null;
                timeArr[1]=timeArr[1]?(timeArr[1]+'0').slice(0,2):'00';
                timeArr[1]=timeArr[1]>=30?'30':'00';
                time=timeArr.join(':')
            }
            this[ref+'1']=time;
            return time
        },
        focus(){
            this.active=true;
        },
        blur(ref){
            this.active=false;
            let time=this.input(ref)
            this[ref]=time?(time+':00'):'';
        },
        clearThis(){
            this.start1='';
            this.end1='';
            this.timeChange();
        },
        timeChange(time){
            this.start=this.start1?(this.start1+':00'):'';
            this.end=this.end1?(this.end1+':00'):this.end1;
            this.$emit('return',this.start&&this.end?[this.start,this.end]:null,this.id?this.id:null)
        }
    },
    created(){
        // this.start1?null:this.start1='08:30';
        // this.end1?null:this.end1='17:30';
        // this.timeChange()
    },
    mounted(){},
}
</script>
<style scoped>
.hideTime{
    position: absolute;
    left: 0;
    border: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    z-index: -1;
}
.hideTime>span{
    position: absolute;
    border: 0;
    top: 0;
    bottom: 0;
    width: 50%;
    display: block;
}
.hideTime>span:nth-child(1){
    left: 0;
}
.hideTime>span:nth-last-child(1){
    right: 0;
}
.hideTime>span>div{
    width: 100%!important;
    height: 100%;
}
.elTimebox.hasclear{
    padding-right: 30px;
}
.elTimebox .el-input__icon.el-icon-circle-close{
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    width: 30px;
    line-height: 30px;
    color: #C0C4CC;
}
.input.unable>span.el-range-input{
    line-height: 24px;
    font-size: 13px;
}
.input.unable.el-range-editor{
    border-color: #E4E7ED;
}
</style>
