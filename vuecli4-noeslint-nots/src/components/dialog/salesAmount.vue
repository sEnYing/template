<template>
    <div>
        <ul class="formUl salesAmountDialog" :class="[data.key?'class_'+data.key:'']">
            <li :class="{'errorBorder':error.key==='year'}" v-if="data.key!=='view'">
                <span class="formTitle"><i class="must">*</i>年份：</span>
                <unit-dropdown id="year" :list="yearList" @change='dropdownReturn' :result='result.year'></unit-dropdown>
                <transition name="publicTransition"><u class="error" v-if="error.key==='year'">{{error.value}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='salesAmount'}" v-if="data.key==='revise'">
                <span class="formTitle"><i class="must">*</i>年度任务额（元）：</span>
                <input type="text" v-model="result.salesAmount" maxlength="14" @input="inputChange('salesAmount')" placeholder="请输入年度任务额" ref='input' @blur='blurAmount'>
                <transition name="publicTransition"><u class="error" v-if="error.key==='salesAmount'">{{error.value}}</u></transition>
            </li>
            <li :class="{'errorBorder':error.key==='file'}" v-if="data.key==='template'">
                <span class="formTitle"><i class="must">*</i>导入文件：</span>
                <unit-upload class="marginTop" @changed="changeUpload" @getfiles='getfiles' type='excel' :api='null' :count='1' :limit='10'></unit-upload>
                <transition name="publicTransition"><u class="error inline" v-if="error.key==='file'">{{error.value}}</u></transition>
            </li>
            <li v-if="data.key==='view'">
                <div class="showRes">
                    <div class="title">{{'年度任务额（元）：'}}</div>
                    <ul class="table">
                        <li class="th"><span style="width:100px"><span>销售</span></span><span v-for='(item,i) in yearList' :key='i' :style="{width:'calc((100% - 100px) / 3)'}"><span>{{item.lable}}</span></span></li>
                        <li>
                            <span style="width:100px"><span>{{data.item.staffName}}</span></span>
                            <span v-for='(title,j) in yearList' :key='j' :style="{width:'calc((100% - 100px) / 3)'}">
                                <span class="result">{{list[title.value]|judgeEmpty}}</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </li>
            <li>
                <div class="btnBox">
                    <unit-btn @click="submit" :loading='ajaxIng' :text='data.key==="revise"?"保存":"确定"'></unit-btn>
                    <unit-btn type='plain' @click="close" v-if="data.key!=='view'" text='取消'></unit-btn>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import unitTable from '@/unit/components/element/table'
import unitUpload from '@/unit/components/upload'
export default {
    name: 'salesAmount',
    props:['data'],
    components:{unitTable,unitUpload},
    data () {
        return{
            ajaxIng:false,
            result:{
                year:'',
                salesAmount:'',
            },
            file:null,
            yearList:[],
            list:{},
            error:{key:null,value:''}
        }
    },
    inject: ['close'],
    filters:{
        judgeEmpty(val){
            return val?val:'--'
        },
    },
    methods:{
        getfiles(fn){
            this.getfiles=fn;
        },
        changeUpload(fileList){
            this.error.key==='file'?this.error.key=null:null;
            this.file=fileList.length>0?fileList[0].filePath:null
            this.$emit('ok');
        },
        inputChange(key){
            this.error.key===key?this.error.key=null:null;
        },
        blurAmount(){
            this.result.salesAmount=this.result.salesAmount?this.$pubfunc.transformPrice(this.result.salesAmount,true):'';
        },
        getInfo(year){
            this.$api.service.salestarget.getList({staffId:this.data.staffId,depId:this.data.depId},res=>{
                // console.log(res)
                this.loading=false;
                switch(res.code){
                    case '0':
                        let list={};
                        (res.data.list?res.data.list:[]).map(v=>{
                            v.year?list[v.year.toString()]=this.$pubfunc.transformPrice(v.salesAmount,true):null
                        });
                        this.list=list;
                        this.dropdownReturn({value:year},'year')
                        // console.log(this.list,this.yearList)
                        break;
                }
            })
        },
        dropdownReturn(res,key){
            switch(key){
                case 'year':
                    this.error.key==='year'?this.error.key=null:null;
                    this.result[key]=res.value;
                    this.result.salesAmount=this.list[this.result[key]]
                    break;
            }
        },
        submit(){
            switch(this.data.key){
                case 'view':
                    this.close();
                    return;
                case 'import':
                    if(this.ajaxIng){return;}
                    if(!this.result.year){
                        this.error.key='year'
                        this.error.value='请选择年份'
                        return
                    }
                    this.ajaxIng=true
                    // console.log(thisItem)
                    this.$api.download.salestargetExport({year:this.result.year},res=>{
                        this.ajaxIng=false
                        this.$pubfunc.downloadFile(res,'全部人员信息-'+this.result.year+'.xlsx','excel');
                        this.close();
                    })
                    return;
                case 'template':
                    if(this.ajaxIng){return;}
                    if(!this.result.year){
                        this.error.key='year'
                        this.error.value='请选择年份'
                        return
                    }
                    if(!this.file){
                        this.error.key='file'
                        this.error.value='请上传文件'
                        return
                    }
                    this.ajaxIng=true
                    // console.log(thisItem)
                    this.$api.service.salestarget.template({year:this.result.year,file:this.file},res=>{
                        switch(res.code){
                        case '0':
                            let msg=res.data;
                            this.$store.commit('confirmFn',{
                                okTxt:'好的',
                                cancelTxt:null,
                                func:()=>{
                                    this.$emit('success');
                                },
                                close:()=>{
                                    this.$emit('success');
                                },
                                text:'本次操作新添 '+msg.insert+' 条数据，更新 '+msg.update+' 条数据。<br/>有<span class="redTxt"> '+msg.failed+' </span>条数据操作失败。'
                            });
                            break;
                        default:
                            this.ajaxIng=false;
                            res.message?this.$store.commit('alertFn',{
                                type:'error',
                                text:res.message
                            }):null;
                    }
                    })
                    return;
            }
            if(this.ajaxIng){return;}
            if(!this.result.year){
                this.error.key='year'
                this.error.value='请选择年份'
                return
            }
            if(!this.$pubfunc.replaceSpace(this.result.salesAmount,1)){
                this.error.key='salesAmount'
                this.error.value='请输入年度任务额'
                return
            }else if(!Number(this.result.salesAmount.split(',').join(''))){
                this.error.key='salesAmount'
                this.error.value='年度任务额不得为0，请重新输入'
                return
            }else if(Number(this.result.salesAmount.split(',').join(''))>=1000000000){
                this.error.key='salesAmount'
                this.error.value='请输入少于十位的数字'
                return
            }
            this.ajaxIng=true;
            this.$api.service.salestarget.save({salesAmount:Number(this.result.salesAmount.split(',').join('')),staffId:this.data.staffId,depId:this.data.depId,year:this.result.year},res=>{
                switch(res.code){
                    case '0':
                        this.$store.commit('alertFn',{
                            type:'success',
                            text:'保存成功',
                            func:()=>{
                                this.$emit('success')
                            }
                        })
                        break;
                    default:
                        this.ajaxIng=false;
                        res.message?this.$store.commit('alertFn',{
                            type:'error',
                            text:res.message
                        }):null;
                }
            })
        }
    },
    mounted(){
        // console.log(this.data)
        if(!this.data.key||!this.data.year){
            this.close();
            return;
        }
        let year=this.data.year,key=this.data.key;
        this.year=year;
        this.result.year=year;
        for(let i=0;i<2;i++){
            this.yearList.push({
                lable:year+i,
                value:year+i
            })
        }
        if(key==='view'||key==='import'){
            this.yearList.splice(0,0,{
                lable:(year-1),
                value:(year-1)
            })
        }
        if(!this.data.staffId){
            this.$emit('ok');
            return;
        }
        this.getInfo(year);
        // console.log(this.$store.state.userInfo)
        if(this.data.key==='revise'){
            this.$nextTick(()=>{
                this.$refs.input.focus();
            })
        }
        this.$emit('ok');
    }
}
</script>


<style scoped>
.salesAmountDialog .formTitle{
    width: 160px;
}
.salesAmountDialog>li{
    white-space: nowrap;
    position: relative;
}
.salesAmountDialog>li>input{
    width: 310px;
}
.salesAmountDialog>li>u.error{
    width: 308px!important;
    left: 141px;
}
.showRes{
    line-height: 1;
    width: 100%;
}
.showRes>.title{
    line-height: 20px;
    margin-bottom: 20px;
}
ul.table>li{
    min-height: 40px;
    font-size: 0;
    border-bottom: 1px solid #EBEEF5;
}
ul.table>li>*{
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    padding: 5px;
    box-sizing: border-box;
}
ul.table>li>span>*{
    font-size: 14px;
}
ul.table>li>span>.result{
    line-height: 30px;
}
ul.table>li.th{
    height: 40px;
    background: rgb(241, 244, 251);
    color: rgb(93, 102, 128);
}
ul.table>li.th>*{
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
.salesAmountDialog.class_import.formUl>li>div.btnBox{
    padding-top: 40px;
    padding-bottom: 20px;
}
.uploadBox{
    width: 310px;
    padding-bottom: 10px;
}
u.error.inline{
    padding-left: 22px;
    line-height: 30px;
    display: block;
    position: absolute;
    text-align: left
}
u.error.inline::before{
    display: inline-block;
    left: -8px;
    top: 0px;
    background-color: transparent;
}
</style>

<style>
.salesAmountDialog>li>.elDropdown,
.salesAmountDialog>li>.elDropdown>.el-select,
.salesAmountDialog>li input{
    width: 310px!important;
    color: #484b5c;
}
</style>