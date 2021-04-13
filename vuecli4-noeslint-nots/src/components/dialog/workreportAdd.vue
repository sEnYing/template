<template>
    <div>
        <ul class="formUl workreportAddDialog">
            <li :class="{'errorBorder':error.key==='date'}">
                <span class="formTitle"><i class="must">*</i>报告日期：</span>
                <unit-time id='date' @return='dropdownReturn' :maxtime='$pubfunc.timeToTimestamp(weeks.next)' :mintime='$pubfunc.timeToTimestamp(weeks.before)'></unit-time>
                <transition name="publicTransition"><u class="error" v-if="error.key==='date'">{{error.value}}</u></transition>
            </li>
            <li>
                <div class="btnBox">
                    <unit-btn @click="submit" text='确定'></unit-btn>
                    <unit-btn type='plain' @click="close" text='取消'></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitTime from '@/unit/components/element/timeWeek'
export default {
    name: 'workreportAdd',
    props:['data'],
    components:{unitTime},
    data () {
        return{
            date:'',
            date_:'',
            error:{key:null,value:''},
            oneday:24*60*60*1000,
        }
    },
    inject: ['close'],
    computed: {
        userInfo(){
            return this.$store.state.userInfo?this.$store.state.userInfo:{};
        },
        weeks(){
            let today=this.$pubfunc.timestampToTime(),oneday=this.oneday;
            let week=today.Week?today.Week:7;
            let timeB=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()-(week-1+7)*oneday),
                timeN=this.$pubfunc.timestampToTime(this.$pubfunc.getTimeNum()-(week-1-7)*oneday);
            // console.log(week,time)
            return {
                before:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeB.Year,Number(timeB.Month)-1,timeB.Day,0,0,0)),
                next:this.$pubfunc.TimeTransform('YYYY/MM/DD',new Date(timeN.Year,Number(timeN.Month)-1,timeN.Day,0,0,0))
            }
        }
    },
    methods:{
        dropdownReturn(res,key){
            switch(key){
                case 'date':
                    this.date=this.$pubfunc.TimeTransform('YYYY/MM/DD',(res.valueOf()-this.oneday));
                    this.date_=this.$pubfunc.TimeTransform('YYYY/MM/DD',(res.valueOf()+this.oneday*5));
                    break
            }
            this.error.key===key?this.error.key=null:null;
        },
        submit(){
            if(!this.date){
                this.error.key='date'
                this.error.value='请选择报告日期'
                return
            }
            if(this.date<this.weeks.before){
                this.error.key='date'
                this.error.value='报告日期不可选择更早的日期';
                return
            }
            if(this.date>=this.weeks.next){
                this.error.key='date'
                this.error.value='报告日期不可选择未来日期';
                return
            }
            // console.log(this.date)
            this.$api.service.weekreport.mylist({startDate:this.date,endDate:this.date_},res=>{
                // console.log(res)
                this.loading=false;
                switch(res.code){
                    case '0':
                        res.data.total>0?
                            (this.error.key='date',this.error.value='该周已建立工作报告，不可重复创建'):
                            this.$store.commit('confirmFn',{
                                func:()=>{
                                    this.$router.push({name:'workreportAdd',params:{time:this.$pubfunc.encode(this.date)}})
                                },
                                text:'确定生成工作报告吗？<br>生成后，报告内容将不会跟随拜访管理的修改而更新'
                            });
                        break;
                }
            })
        }
    },
    mounted(){
        // console.log(this.$store.state.userInfo)
        this.$emit('ok');
    }
}
</script>


<style scoped>
.workreportAddDialog .formTitle{
    width: 108px;
    margin-left: 0px;
}
.workreportAddDialog>li{
    white-space: nowrap;
    padding-bottom: 30px
}
.workreportAddDialog>li>u.error{
    width: 322px!important;
    left: 109px;
    bottom: 12px;
}
</style>
<style>
.formUl.workreportAddDialog>li .el-date-editor.el-input,
.workreportAddDialog>li input{
    width: 324px;
}
</style>