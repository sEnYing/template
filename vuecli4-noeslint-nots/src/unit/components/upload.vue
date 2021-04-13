<template>
    <div class="uploadBox">
        <!-- &&uploadbtn -->
        <ul class="ClearFloat small" v-if="!hid&&!img&&count===1" v-show='fileList.length>0'>
            <li class="el-upload-list__item is-success left" ref="file" v-for="(item,i) in fileList" :key='i'><a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.realName}}</a><i :class="[item.loading==='error'?'el-icon-circle-close':'el-icon-circle-check']" class="el-icon-upload-success" v-if="item.filePath||item.loading==='error'"></i><i class="el-icon-close" v-if="item.filePath||item.loading==='error'" @click='removeFile(item)'></i><span v-show="item.loading||item.loading===0"><i :class="{'error':item.loading==='error'}" :style="{width:((item.loading==='error'?100:item.loading)+'%')}"></i></span></li>
        </ul>
        <div class="imgBox CoverImg" v-if="!hid&&img">{{onlyshow&&fileList.length===0?'--':''}}<i v-for="(item,i) in fileList" :key='i'><img v-if="item.src" :src="item.src" alt="" title="点击查看大图" @click='showImg(item)'><div class="el-icon-error" title='删除' @click='removeFile(item)' v-if="!onlyshow"></div></i></div><i class="uploadIcon" @click="clickInput" :class="{'unable':!getCount()}" v-if="!hid&&!(count<=1&&fileList.length>0)&&!onlyshow"></i>
        <div slot="tip" class="el-upload__tip marginTop-10" v-if="!hid&&!onlyshow">{{img?('支持jpeg,jpg,png 单次上传图片大小≤'+(limit?limit:20)+'MB'):('支持'+(type?((text[type]?text[type]:'')+' 单次上传文件大小≤'+(limit?limit:20)+'MB'+(count>1?('，文件总数≤'+(count?count:30)+'个'):'')):'jpeg,jpg,png,doc,docx,xls,xlsx,ppt,pptx,txt,pdf,zip,rar'))}}</div>
        <div slot="tip" class="el-upload__tip" v-if="!hid&&!onlyshow&&!img&&!type">单次上传文件大小≤{{limit?limit:20}}MB，文件总数≤{{count?count:30}}个</div>
        <ul class="ClearFloat" v-if="!hid&&!img&&count>1">
            <!-- &&(deletebtn||!item.id) -->
            <li class="el-upload-list__item is-success left" ref="file" v-for="(item,i) in fileList" :key='i'><a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.realName}}</a><i :class="[item.loading==='error'?'el-icon-circle-close':'el-icon-circle-check']" class="el-icon-upload-success" v-if="item.filePath||item.loading==='error'"></i><i class="el-icon-close" v-if="item.filePath||item.loading==='error'" @click='removeFile(item)'></i><span v-show="item.loading||item.loading===0"><i :class="{'error':item.loading==='error'}" :style="{width:((item.loading==='error'?100:item.loading)+'%')}"></i></span></li>
        </ul>
        <input type="file" class="fileBox" ref="fileBox" @change="uploadthis">
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_Upload',
    props:['limit','count','list','hid','total','api','img','onlyshow','type'],
    data () {
        // console.log(this.list)
        return{
            fileList: this.list?this.list:[],
            imgType:[
                'image/jpeg',
                'image/png',
            ],
            text:{
                excel:'xls,xlsx'
            },
            fileTypes:{
                excel:[
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]
            },
            fileType:[
                'image/jpeg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'text/plain',
                'application/pdf',
                'application/x-zip-compressed',
                'application/x-rar-compressed',
            ]
        }
    },
    watch:{
        list:{
            deep:true,
            handler(){
                // console.log(this.list)
                this.fileList=this.list.concat();
            },
        },
    },
    methods:{
        showImg(item){
            this.$emit('dialog',{show:true,link:'showImg',small:true,title:'',data:{url:item.src}});
        },
        getCount(){
            let count=Number(this.count?this.count:30);
            let total=Number(this.total?this.total:this.fileList.length);
            return total<count?true:false
        },
        clickInput(){
            if(!this.getCount()){
                this.hid?this.$emit('ajaxing',false):null;
                // this.showErr('文件个数达到最大，无法继续上传');
                return;
            }
            this.fileList.length<Number(this.count?this.count:30)?(this.$refs.fileBox?this.$refs.fileBox.click():null):null;
        },
        uploadthis(){
            var File = this.$refs.fileBox.files[0];
            if(File){
                // console.log(File)
                var FileSize = File.size;
                var Limit = 1024 * 1024 * (this.limit?this.limit:20);
                let type=this.img?this.imgType:(this.type?(this.fileTypes[this.type]?this.fileTypes[this.type]:[]):this.fileType);
                // console.log(FileSize,Limit)
                // console.log(type.indexOf(File.type),File.type)
                if(type.indexOf(File.type)===-1){
                    let text='文件格式错误，仅支持上传';
                    // console.log(this.text[this.type])
                    text+=this.img?'jpeg,jpg,png':(this.type?(this.text[this.type]?this.text[this.type]:''):'jpeg,jpg,png,doc,docx,xls,xlsx,ppt,pptx,txt,pdf,zip,rar');
                    text+='文件'
                    this.showErr(text);
                    this.$refs.fileBox.value = '';
                    return;
                }
                if (FileSize <= Limit&&Limit) {
                    if(this.api===null){
                        this.fileList.push({id:this.$pubfunc.getTimeNum(),realName:File.name,filePath:File,loading:100});
                        this.$nextTick(()=>{
                            this.$emit('changed',this.fileList);
                        })
                        setTimeout(()=>{
                            this.fileList[0].loading=null;
                        },20)
                        // console.log(this.fileList)
                        return;
                    }
                    let arr=this.api?this.api.split('.'):['public']
                    let api=arr.reduce((prev,cur)=>{
                        return prev[cur]
                    },this.$api)
                    // console.log(api)
                    if(this.hid){
                        this.$emit('ajaxing',true)
                        api.uploadFile({file:File},res=>{
                            switch(res.code){
                                case '0':
                                    this.$emit('success',res.data);
                                    break;
                                default:
                                    this.$emit('ajaxing',false);
                                    res.message?this.showErr(res.message):null;
                            }
                        });
                    }else{
                        let time=this.$pubfunc.getTimeNum();
                        this.fileList.push({id:time,realName:File.name,loading:0});
                        this.$nextTick(()=>{
                            this.$emit('changed');
                        })
                        api.uploadFile({file:File},res=>{
                            for(let i in this.fileList){
                                // console.log(this.fileList[i].id)
                                if(this.fileList[i].id===time){
                                    let item=this.fileList[i];
                                    // console.log(res.status)
                                    if(res.status||res.status===0){
                                        item.loading='error';
                                        this.$refs.fileBox.value = '';
                                        return
                                    }
                                    switch(res.code){
                                        case '0':
                                            item.id='';
                                            item.loading=100;
                                            // item.realName=res.data.realName;
                                            // item.fileSize=res.data.fileSize;
                                            // item.fileType=res.data.fileType;
                                            // item.filePath=res.data.filePath;
                                            let url=res.data;
                                            item.filePath=url;
                                            this.img?this.$api.public.getImg({filePath:url},res=>{
                                                let typeArr=url.split('.');
                                                let src='data:image/'+typeArr[typeArr.length-1]+';base64,'+res.data
                                                this.$set(item,'src',src)
                                                this.$emit('upload',this.fileList,'upload')
                                            }):null
                                            setTimeout(()=>{
                                                item.loading=null;
                                                delete item.loading;
                                            },20)
                                            // console.log(this.fileList)
                                            break;
                                        default:
                                            item.loading='error';
                                            res.message?this.showErr(res.message):null;
                                    }
                                    break;
                                }
                            }
                        },progress=>{
                            for(let i in this.fileList){
                                if(this.fileList[i].id===time){
                                    let item=this.fileList[i];
                                    item.loading=(progress.loaded / progress.total * 100 | 0)
                                    break;
                                }
                            }
                        })
                    }
                } else {
                    this.showErr('文件大小不可超过'+(this.limit?this.limit:20)+'MB，请重新上传');
                }
                this.$refs.fileBox.value = '';
            }
        },
        removeFile(item) {
            if(this.api===null){
                this.deleteFile(item);
                this.$emit('changed',this.fileList);
                return;
            }
            this.$store.commit('confirmFn',{
                func:()=>{
                    item.id?this.$api.user.deleteFileData({id:item.id},res=>{
                        switch(res.code){
                            case '0':
                                item.filePath?this.$api.user.deleteFile({filePath:item.filePath},res=>{
                                    switch(res.code){
                                        case '0':
                                            this.deleteFile(item);
                                            this.$emit('upload',this.fileList,'upload');
                                            break;
                                        default:
                                            res.message?this.showErr(res.message):null;
                                    }
                                }):this.deleteFile(item);
                                break;
                            default:
                                res.message?this.showErr(res.message):null;
                        }
                    }):(this.deleteFile(item),this.$emit('upload',this.fileList,'upload'));
                },
                text:'确定删除该'+(this.img?'图片':'资料')+'吗？'
            })
        },
        deleteFile(item){
            for(let i in this.fileList){
                if(this.fileList[i].filePath===item.filePath){
                    this.fileList.splice(i,1);
                    return;
                }
            }
        },
        showErr(message){
            // console.log(message)
            this.$store.commit('alertFn',{
                type:'error',
                text:message
            });
        },
        getList(){
            let list=[];
            this.fileList.map(v=>{
                if(v.loading===null||v.loading===undefined){
                    list.push(v)
                }
            })
            return list;
        }
    },
    created(){
    },
    mounted(){
        this.$emit('click',this.clickInput);
    },
}
</script>


<style scoped>
.uploadBox{
    position: relative;
}
.el-upload__tip{
    font-size: 12px;
    line-height: 20px;
    color: #484b5c;
    margin-top: 0;
}
.uploadIcon{
    display: block;
    width: 45px;
    height: 45px;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px dashed #dcdcdc;
    /* margin-bottom: 10px; */
    transition: border-color 0.2s cubic-bezier(.645,.045,.355,1);
}
.uploadIcon::before,.uploadIcon::after{
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    transition: border-color 0.2s cubic-bezier(.645,.045,.355,1);
}
.uploadIcon::before{
    border-right: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    margin: 14px 0 0 14px;
}
.uploadIcon::after{
    border-left: 1px solid #dcdcdc;
    border-top: 1px solid #dcdcdc;
    margin: -1px 0 0 21px;
}
.uploadIcon:hover,
.uploadIcon:hover::before,
.uploadIcon:hover::after{
    border-color: #4780F4;
}
.uploadIcon.unable,
.uploadIcon.unable::before,
.uploadIcon.unable::after{
    border-color: #E5E5E5;
    cursor: no-drop;
}
.el-icon-upload-success{
    position: absolute;
    top: 5px;
    right: 5px;
    color: #4780F4;
}
.el-icon-circle-close{
    color: #fa5135;
}
.el-upload-list__item:hover .el-icon-upload-success{
    opacity: 0;
}
.uploadBox>ul{
    width: 800px;
    padding-top: 5px;
}
.uploadBox>ul>li{
    width: 360px;
    margin-right: 30px;
    margin-top: 5px;
}
.fileBox{
    display: none;
    opacity: 0;
    z-index: -1;
}
.el-upload-list__item>span{
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 2px;
    overflow: hidden;
}
.el-upload-list__item>span>i{
    position: relative;
    display: block;
    height: 100%;
    background-color: #73b8ff;
    width: 0;
    transition: width 0.1s linear;
}
.el-upload-list__item>span>i.error{
    background-color: #fa5135;
}
.el-upload-list__item-name{
    margin-right: 0;
    padding-right: 24px;
    line-height: 25px;
    max-height: 25px;
}
.imgBox{
    display: inline-block;
    vertical-align: top;
    margin-bottom: -10px; 
}
.imgBox.hasBig{
    width: 100%;
}
.imgBox>i{
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    width: 60px;
    height: 60px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 10px;
}
.imgBox>i.bigImg{
    width: 100%;
    height: 0;
    padding-bottom: 100%;
}
.imgBox>i>img{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.imgBox>i>div{
    z-index: 11;
    display: block;
    width: 22px;
    height: 22px;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
    color: #FD2624;
    transition: opacity 0.15s ease;
    opacity: 0;
    cursor: pointer;
}
.el-icon-error{
    position: relative;
}
.el-icon-error::after{
    content: '';
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #fff;
    z-index: -1;
    top: 50%;
    left: 50%;
    margin: -7px;
}
.imgBox>i:hover>div{
    opacity: 0.8;
}
.imgBox>i:hover>div:hover{
    opacity: 1;
}
.imgBox+i.uploadIcon{
    display: inline-block;
    vertical-align: top;
    width: 60px;
    height: 60px;
}
.imgBox+i.uploadIcon::before,.imgBox+i.uploadIcon::after{
    width: 11px;
    height: 11px;
}
.imgBox+i.uploadIcon::before{
    margin: 18px 0 0 18px;
}
.imgBox+i.uploadIcon::after{
    margin: -1px 0 0 28px;
}
.marginTop-10{
    margin-top: 10px;
}
.uploadBox>ul.small{
    display: inline-block;
    vertical-align: top;
    width: 100%;
    padding-top: 5px;
}
.uploadBox>ul.small>li{
    width: 100%;
    margin-right: 0;
}
.uploadBox>ul.small>li:nth-child(1){
    margin-top: 0;
}
ul.small+i.uploadIcon{
    display: inline-block;
    vertical-align: top;
}
</style>
