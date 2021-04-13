<template>
    <div class="uploadBox">
        <!-- &&uploadbtn -->
        <div class="imgBox CoverImg" v-if="!(hid!==undefined&&hid!==false)&&(imgshow!==undefined&&imgshow!==false)">
            <span v-if="fileList.length===0&&imgshow==='check'" style="font-size:14px">--</span>
            <i v-for="(item,i) in fileList" :key='i' :class="{imgLoading:typeof item.loading==='number',errorImg:typeof item.loading==='string'}">
                <i class="uploading" v-if='typeof item.loading==="number"'>
                    <b><i :style="{'transform':'rotate('+(Number((item.loading/50)*180-135)<45?Number((item.loading/50)*180-135):45)+'deg)'}"></i></b>
                    <b v-if="item.loading>50"><i :style="{'transform':'rotate('+Number(((item.loading-50)/50)*180-135)+'deg)'}"></i></b>
                </i>
                <el-tooltip class="item" effect="dark" :content="typeof item.loading==='string'?((item.loading==='error'?'链接超时':item.loading)+'，上传失败'):'点击查看大图'" placement="top" v-if="item.src" :open-delay='500'>
                    <img v-showimg :src='item.src' alt="" @click='showThis(item)'>
                </el-tooltip>
                <div class="deleteImg" @click='removeFile(item)' v-if="imgshow!=='check'">删 除</div>
                <span class="errorTxt" v-if="typeof item.loading==='string'">上传失败</span>
            </i>
            <i class="uploadIcon" @click="clickInput" :class="{'unable':!getCount()}" v-if="!(count<=1&&fileList.length>0)&&(imgshow!=='check'&&!title)"></i>
        </div>
        <i class="uploadIcon" @click="clickInput" :class="{'unable':!getCount()}" v-if="!(hid!==undefined&&hid!==false)&&!(imgshow!==undefined&&imgshow!==false)&&!(count<=1&&fileList.length>0)&&(imgshow!=='check'&&!title)"></i>
        <div class="uploadBox_tip" v-if="!(hid!==undefined&&hid!==false)&&imgshow!=='check'">
            <span>支持 {{getType()}} 格式文件</span>
            <span>单次上传文件大小≤{{limit?limit:20}}MB<a v-if="!(imgshow!==undefined&&imgshow!==false)">，文件总数≤{{count?count:30}}个</a>{{other?('，'+other):''}}</span>
        </div>
        <div class="uploadTitle" v-if='!(hid!==undefined&&hid!==false)&&title'><span>{{title}}（{{fileList.length}}个）</span><unit-btn text :class="{'unable':!getCount()}" @click="clickInput">添加{{title}}</unit-btn></div><!-- <a class="textBtn" :class="{'unable':!getCount()}" @click="clickInput">添加{{title}}</a> -->
        <ul class="ClearFloat" v-if="!(hid!==undefined&&hid!==false)&&!(imgshow!==undefined&&imgshow!==false)&&fileList.length>0">
            <li class="uploadBoxItem" ref="file" v-for="(item,i) in fileList" :key='i'>
                <i class="documentIcon"><i><span>{{item.realName.split('.')[item.realName.split('.').length-1]}}</span></i></i>
                <div>
                    <a class="uploadBoxItemName"><span><unit-over :content="item.realName.split('.').slice(0,item.realName.split('.').length-1).join('.')"></unit-over></span>.{{item.realName.split('.')[item.realName.split('.').length-1]}}<i>（{{getSize(item.fileSize)}}）</i></a>
                    <div class="uploadBoxItemBottom">
                        <span v-show="(item.loading||item.loading===0)&&typeof item.loading==='number'">
                            <i v-if="typeof item.loading==='number'" :class="{'error':item.loading==='error'}" :style="{width:((item.loading==='error'?100:item.loading)+'%')}"></i>
                            <span>{{item.loading+'%'}}</span>
                        </span>
                        <span class="errorTxt" v-if="typeof item.loading==='string'">{{(item.loading==='error'?'链接超时':item.loading)+'，上传失败'}}</span>
                        <div>
                            <!-- <a class="textBtn" v-if='!item.loading&&item.loading!==0' @click='showThis(item)'>预览</a>
                            <a class="textBtn" v-if='typeof item.loading==="string"' @click='clickInput(true,item)'>重新上传</a>
                            <a class="textBtn" @click='removeFile(item)'>删除</a> -->
                            <unit-btn text v-if='!item.loading&&item.loading!==0' @click='showThis(item)'>预览</unit-btn>
                            <unit-btn text v-if='typeof item.loading==="string"' @click='clickInput(true,item)'>重新上传</unit-btn>
                            <unit-btn text @click='removeFile(item)'>删除</unit-btn>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- <button class="button" :class="[btnclass,loading?'unable':'',]" type="button" v-if="(hid!==undefined&&hid!==false)" @click='clickInput'><i class="btnLoading" v-if="loading?loading:false" v-loading='true' element-loading-spinner='el-icon-loading' element-loading-background="rgba(255, 255, 255, 0)"></i>上传{{title?title:'文件'}}</button> -->
        <unit-btn :disable='disable===true?true:false' :large='large?true:false' :loading='loading?loading:false' v-if="(hid!==undefined&&hid!==false)" @click='clickInput'>上传{{title?title:'文件'}}</unit-btn>
        <input :multiple='multiple!==undefined&&multiple!==false?true:false' type="file" class="fileBox" ref="fileBox" @change="uploadthis">
        <el-dialog fullscreen :visible.sync="view.show" append-to-body custom-class='uploadView' @close='closeDialog'>
            <img class="uploadViewComtent hidden" v-showimg :src="view.file" alt="" v-if='fileType.img.indexOf(view.type)>-1||(option&&option.fileType&&option.fileType.img&&option.fileType.img.indexOf(view.type)>-1)' ref="imgView">
            <iframe v-if='fileType.pdf.indexOf(view.type)>-1' :src='view.file' width='100%' height='100%' frameborder='1'></iframe>
            <video class="uploadViewComtent" controls v-if='video.indexOf(view.type)>-1' :src='view.file' :type='"video/"+view.type' ref='video'></video>
            <div class="uploadViewComtent uploadViewErr" v-if='!view.file&&view.type'>
                <i :class="['uploadView'+view.type.slice(0,1)]">{{view.type.slice(0,1).toLocaleUpperCase()}}</i>
                <span>暂不支持该类型文件预览</span>
            </div>
            <i class="el-icon-loading"></i>
        </el-dialog>
    </div>
</template>

<script>
import EXIF from '@/assets/js/exif'
export default {
    name: 'upload',
    props:['list','api','title','limit','count','other','multiple','type','hid','total','id','disable','large','loading','imgshow','param','option'],
    data () {
        return{
            fileList: this.list?this.list.concat():[],
            dels:[],
            changeItem:null,
            fileType:{
                img:['jpeg','jpg','png'],
                word:['doc','docx'],
                excel:['xls','xlsx'],
                ppt:['ppt','pptx'],
                txt:['txt'],
                pdf:['pdf'],
                zip:['zip','rar'],
            },
            video:['mp4','ogg','webm'],
            view:{
                file:null,
                type:null,
                show:false
            }
        }
    },
    directives:{
        showimg:{
            inserted:function(el,binding,vnode){
                el.onload = function(){
                    el.style.transform=null;
                    el.style.maxWidth=null;
                    el.style.maxHeight=null;
                    el.style.width=null;
                    el.style.height=null;
                    el.exifdata=null;
                    let width=el.width,height=el.height,judge=el.className.indexOf('uploadViewComtent')>-1;
                    EXIF.getData(el, function() {
                        EXIF.getAllTags(this);
                        let Orientation = EXIF.getTag(this, 'Orientation');
                        console.log(Orientation)
                        switch(Orientation){
                            case 3:
                                judge?
                                el.style.transform='translate(-50%,-50%) rotate(180deg)':
                                el.style.transform='translate(-50%,-50%)';
                                break;
                            case 6:
                                judge?
                                (
                                    el.style.transform='translate(-50%,-50%) rotate(90deg)',
                                    el.style.maxWidth=height+'px',
                                    el.style.maxHeight=width+'px'
                                ):(
                                    el.style.transform='rotate(90deg) translate('+Number(height-width)/2+'px,'+Number(height-width)/2+'px)',
                                    el.style.width=height+'px',
                                    el.style.height=width+'px'
                                )
                                break;
                            case 8:
                                judge?
                                (
                                    el.style.transform='translate(-50%,-50%) rotate(-90deg)',
                                    el.style.maxWidth=height+'px',
                                    el.style.maxHeight=width+'px'
                                ):(
                                    el.style.transform='rotate(-90deg) translate('+Number(width-height)/2+'px,'+Number(width-height)/2+'px)',
                                    el.style.width=height+'px',
                                    el.style.height=width+'px'
                                )
                                break;
                        }
                        judge?el.classList.remove('hidden'):null;
                    });
                };
            },
        }
    },
    watch:{
        list:{
            deep:true,
            handler(){
                // console.log(this.list)
                this.fileList=this.list?this.list.concat():[];
            },
        },
    },
    methods:{
        showThis(item){
            if(item.loading===null||item.loading===undefined){
                let type=(item.filePath?item.filePath:item.realName).split('.')[(item.filePath?item.filePath:item.realName).split('.').length-1],file=null;
                this.view.type=type;
                if(this.fileType.img.indexOf(type)>-1||(this.option&&this.option.fileType.img.indexOf(type)>-1)){
                    file=item.src?item.src:item.filePath;
                }else if(this.fileType.pdf.indexOf(type)>-1||this.video.indexOf(type)>-1){
                    file=item.filePath;
                }else {
                    file=null;
                }
                this.$refs.imgView&&this.view.file!==file?this.$refs.imgView.classList.add('hidden'):null;
                this.view.file=file
                this.view.show=true;
            }
        },
        closeDialog(){
            this.$refs.video?this.$refs.video.pause():null;
        },
        getType(j){
            if(this.type==='all'){
                return j?null:'所有'
            }
            let arr=[],key='fileType';
            let base=this.option&&this.option[key]?this.option[key]:this[key];
            let type=this.imgshow!==undefined&&this.imgshow!==false?['img']:(this.type?this.type.split(','):null);
            if(type){
                for(let i in type){
                    arr=arr.concat(base[type[i]])
                }
            }else{
                for(let k in base){
                    arr=arr.concat(base[k])
                }
            }
            return j?arr:arr.join(',');
        },
        getSize(size){
            size=size&&Number(size)?Number(size):0;
            // console.log(size/(1024*1024*1024*1024),size/(1024*1024*1024),size/(1024*1024),size/(1024))
            return size/(1024*1024*1024*1024)>1?((Math.round(size*100/(1024*1024*1024*1024))/100)+'TB'):(size/(1024*1024*1024)>1?((Math.round(size*100/(1024*1024*1024))/100)+'GB'):(size/(1024*1024)>1?((Math.round(size*100/(1024*1024))/100)+'MB'):(size/(1024)>1?((Math.round(size*100/(1024))/100)+'KB'):(size+'B'))))
        },
        getCount(n){
            let count=Number(this.count?this.count:30);
            let total=Number(this.total?this.total:this.fileList.length);
            return total+(n?n:0)<=count?true:false
        },
        clickInput(e,item){
            if((e!==true||!item)&&!this.getCount()){
                this.hid!==undefined&&this.hid!==false?this.$emit('ajaxing',false):null;
                this.showErr('文件个数达到最大，无法继续上传');
                return;
            }
            e===true&&item?this.changeItem=item:null;
            this.$refs.fileBox?this.$refs.fileBox.click():null
        },
        getIndex(id){
            for(let i in this.fileList){
                // console.log(this.fileList[i].id,id)
                if(this.fileList[i].id===id){
                    return i
                }
            }
        },
        getRes(res){
            if(!this.option){return res}
            let res_=res;
            if(this.option.statusKey===''){
                res_.status=true;
            }
            if(this.option.statusKey){
                res_.status=res[this.option.statusKey];
            }
            if(this.option.statusValue){
                res_.status=res_.status===this.option.statusValue?true:false;
            }
            if(this.option.id){
                let id=this.getPath(this.option.id,res);
                res_.data?null:res_.data={};
                res_.data.id=id;
            }
            if(this.option.path){
                let path=this.getPath(this.option.path,res);
                res_.data?null:res_.data={};
                res_.data.path=path;
            }
            if(this.option.message&&!res_.status){
                let message=this.getPath(this.option.message,res);
                res_.data?null:res_.data={};
                res_.data.message=message;
            }
            return res_
        },
        getPath(string,res){
            let paths=string.split('.');
            let path=paths.slice(0,paths.length-1).reduce((prev,cur)=>{
                return prev[cur]
            },res);
            return path[paths[paths.length-1]]
        },
        uploadthis(){
            // console.log(this.$refs.fileBox.files)
            let Files = this.$refs.fileBox.files,File;
            if(!this.getCount(Files.length)){
                this.hid!==undefined&&this.hid!==false?this.$emit('ajaxing',false):null;
                this.showErr('文件个数达到最大，无法继续上传');
                this.$refs.fileBox.value = '';
                return;
            }
            for(let a=0;a<Files.length;a++){
                File = this.$refs.fileBox.files[a];
                let changeItem=this.changeItem;
                if(File){
                    // console.log(File)
                    let FileSize = File.size;
                    let Limit = 1024 * 1024 * (this.limit?this.limit:20);
                    let type=this.getType(true);
                    // console.log(FileSize,Limit)
                    // console.log(File.type)
                    if(type&&type.indexOf(File.name.split('.')[File.name.split('.').length-1])===-1){
                        this.showErr('文件格式错误，仅支持上传 '+this.getType()+' 文件');
                        this.$refs.fileBox.value = '';
                        return;
                    }
                    if (FileSize <= Limit&&Limit) {
                        if(this.api===false){
                            let time=(new Date()).valueOf(),index;
                            if(changeItem){
                                index=this.getIndex(changeItem.id);
                                this.fileList[index].loading===undefined?this.$set(this.fileList[index],'loading',0):this.fileList[index].loading=0;
                                this.fileList[index].id=time;
                                this.fileList[index].realName=File.name;
                                this.fileList[index].fileSize=FileSize;
                                this.changeItem=null;
                            }else{
                                this.fileList.push({id:time,realName:File.name,fileSize:FileSize,file:File,loading:0});
                            }
                            if(this.imgshow!==undefined&&this.imgshow!==false){
                                let reader = new FileReader();
                                reader.readAsDataURL(File);
                                reader.onload = ()=>{
                                    this.fileList[this.getIndex(time)].src=reader.result;
                                    this.fileList[this.getIndex(time)].loading=100;
                                    setTimeout(()=>{
                                        this.fileList[this.getIndex(time)].loading=null;
                                        delete this.fileList[this.getIndex(time)].loading;
                                    },20)
                                    // console.log(this.fileList)
                                };
                            }
                        }else{
                            if(!this.api){
                                this.showErr('文件上传路径异常！');
                                this.$refs.fileBox.value = '';
                                return;
                            }
                            let arr=this.api.split('.');
                            let api=arr.slice(0,arr.length-1).reduce((prev,cur)=>{
                                return prev[cur]
                            },this.$api),param={file:File};
                            if(this.param){
                                for(let k in this.param){
                                    param[k]=this.param[k]
                                }
                            }
                            if(!api||!api[arr[arr.length-1]]){
                                this.showErr('文件上传路径异常！');
                                this.$refs.fileBox.value = '';
                                return;
                            }
                            // console.log(api)
                            if(this.hid!==undefined&&this.hid!==false){
                                this.$emit('ajaxing',true)
                                api[arr[arr.length-1]](param,res_=>{
                                    let res=this.getRes(res_)
                                    this.$emit('ajaxing',false);
                                    if(res.status){
                                        this.$emit('success',res.data,this.id?this.id:'upload');
                                    }else{
                                        res.message?this.showErr(res.message):null;
                                    }
                                });
                            }else{
                                let time=(new Date()).valueOf(),index;
                                if(changeItem){
                                    index=this.getIndex(changeItem.id);
                                    this.fileList[index].loading===undefined?this.$set(this.fileList[index],'loading',0):this.fileList[index].loading=0;
                                    this.fileList[index].id=time;
                                    this.fileList[index].realName=File.name;
                                    this.fileList[index].fileSize=FileSize;
                                    this.changeItem=null;
                                }else{
                                    this.fileList.push({id:time,realName:File.name,fileSize:FileSize,file:File,loading:0});
                                }
                                if(this.imgshow!==undefined&&this.imgshow!==false){
                                    let reader = new FileReader();
                                    reader.readAsDataURL(File);
                                    reader.onload = ()=>{
                                        this.fileList[this.getIndex(time)].src=reader.result;
                                    };
                                }
                                api[arr[arr.length-1]](param,res_=>{
                                    let res=this.getRes(res_)
                                    // console.log(res)
                                    if(this.dels.indexOf(time)>-1){
                                        res.status?this.$emit('delete',{fileId:res.data.id,filePath:res.data.path}):null;
                                        return;
                                    }
                                    this.$emit('change',this.id?this.id:'upload');
                                    index=this.getIndex(time);
                                    let item=this.fileList[index];
                                    // console.log(res.status)
                                    if(res.status){
                                        item.id='';
                                        item.fileId=res.data.id;
                                        item.loading=100;
                                        item.filePath=res.data.path;
                                        setTimeout(()=>{
                                            item.loading=null;
                                            delete item.loading;
                                        },20)
                                        // console.log(this.fileList)
                                    }else{
                                        item.loading=res.message?res.message:'error';
                                    }
                                },progress=>{
                                    if(this.dels.indexOf(time)>-1){
                                        return;
                                    }
                                    index=this.getIndex(time);
                                    let item=this.fileList[index];
                                    item.loading=(progress.loaded / progress.total * 100 | 0);
                                })
                            }
                        }
                    } else {
                        this.showErr('文件大小不可超过'+(this.limit?this.limit:20)+'MB，请重新上传');
                    }
                }
            }
            this.$refs.fileBox.value = '';
        },
        removeFile(item) {
            typeof item.loading!=='string'?this.$confirm('确定删除该'+(this.imgshow!==undefined&&this.imgshow!==false?'图片':'文件')+'吗？','提示',{
                customClass:'troilaConfirm',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                callback:(action, instance)=>{
                    switch(action){
                        case 'confirm':
                            if(typeof item.loading==='number'){
                                this.deleteFile(item)
                                this.dels.push(item.id)
                            }else{
                                this.$emit('delete',item,this.deleteFile);
                            }
                            break;
                    }
                }
            }):(this.deleteFile(item));
        },
        deleteFile(item){
            for(let i in this.fileList){
                if(item.filePath?this.fileList[i].filePath===item.filePath:(item.id===this.fileList[i].id)){
                    this.fileList.splice(i,1);
                    this.$emit('change',this.id?this.id:'upload');
                    return;
                }
            }
        },
        showErr(message){
            this.$message({
                customClass:'troilaAlart',
                showClose:true,
                message: message,
                type: 'error',
                duration:10000
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
        },
        makeRandom(len, type) {
            var text = "";
            var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var possible;
            if (type == "num") {
                possible = "0123456789";
            } else if (type == "str" || !type) {
                possible = str;
            } else if (type == "all") {
                possible = str + "0123456789";
            }
            for (var i = 0; i < len; i++){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    },
    created(){
    },
    mounted(){
    },
}
</script>


<style scoped>
.fileBox{
    display: none;
    opacity: 0;
    z-index: -1;
}
.uploadBox{
    position: relative;
    font-size: 0;
    display: inline-block;
    vertical-align: top;
    width: 400px;
}
/* .button{
    border: 0;
    padding: 0;
    border-radius: 3px;
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    position: relative;
    width: 80px;
    height: 32px;
    background-color: transparent;
    transition: all 0.15s linear,width 0s linear,height 0s linear,padding 0s linear;
    vertical-align: middle;
    z-index: 1;
    line-height: 30px;
    color: #fff;
    background-color: #4c5bff;
    border: 1px solid #4c5bff;
}
.button.large{
    width: 96px;
}
.button.auto{
    width: auto!important;
    padding: 0 15px;
    min-width: 50px;
}
.button:hover,.button.unable{
    background-color: #606df5;
    border-color: #606df5;
}
.button.unable{
    cursor: default;
}
.button.unableBtn{
    cursor: no-drop;
    color: #a6a9b0;
    background:#e6e9ef;
    border-color:#e6e9ef;
}
.button>i.btnLoading{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: top;
}
.uploadBox .textBtn{
    display: inline-block;
    vertical-align: top;
    padding: 2px;
    height: unset;
    line-height: 1;
    background-color: transparent;
    border: 0;
    color: #4c5bff;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.15s linear;
    margin-left: 14px;
}
.uploadBox .textBtn:nth-child(1){
    margin-left: -2px;
}
.uploadBox .textBtn:hover{
    color: #747ff8;
}
.uploadBox .textBtn.redBtn:not(.unable){
    color: #ff4247;
}
.uploadBox .textBtn.redBtn:not(.unable):hover{
    color: #fb7e82;
}
.uploadBox .textBtn.unable{
    color: #b3b6bd;
    cursor: no-drop;
    background-color: transparent;
} */
.uploadBox .textBtn{
    margin-left: 14px;
}
.uploadBox .textBtn:nth-child(1){
    margin-left: -2px;
}
.uploadBox_tip{
    font-size: 12px;
    line-height: 20px;
    color: #484b5c;
}
.uploadIcon+.uploadBox_tip{
    padding-top: 10px;
}
.uploadBox_tip>span{
    display: block;
}
.uploadTitle{
    font-size: 14px;
    color: #3c4353;
    padding: 8px 0 0;
}
.uploadTitle>.textBtn{
    margin-top: 2px;
    float: right;
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
.uploadBox>ul{
    width: 100%;
    padding-top: 5px;
}
.uploadBox>ul>li{
    width: 90%;
    margin-top: 5px;
    position: relative;
    font-size: 0;
}
.uploadBoxItem>*{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
}
.uploadBoxItem>i.documentIcon{
    width: 46px;
    position: relative;
    height: 46px;
}
.uploadBoxItem>i.documentIcon>i{
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 2px;
    width: 30px;
    display: block;
    background-color: #f6f7ff;
    border: 1px solid #95a6ff;
    text-align: center;
    line-height: 42px;
    color: rgba(98, 124, 255, 1);
    border-radius: 2px;
}
.uploadBoxItem>i.documentIcon>i>span{
    display: inline-block;
    transform: scale(0.9);
    line-height: 1;
}
.uploadBoxItem>i.documentIcon>i::before,
.uploadBoxItem>i.documentIcon>i::after{
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    content: '';
    border: 0px solid transparent;
}
.uploadBoxItem>i.documentIcon>i::before{
    border-left: 15px solid #95a6ff;
    border-top: 13px solid transparent;
    right: -2px;
    top: -2px;
}
.uploadBoxItem>i.documentIcon>i::after{
    border-right: 16px solid #fff;
    border-bottom: 14px solid transparent;
    right: -2px;
    top: -2px;
}
.uploadBoxItem>div{
    width: calc(100% - 46px);
    height: auto;
    min-height: 46px;
}
.uploadBoxItemName{
    margin-right: 0;
    line-height: 25px;
    max-height: 25px;
    color: #3c4353;
    width: 100%;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
}
.uploadBoxItemName>span{
    max-width: 80%;
    display: inline-block;
    vertical-align: top;
}
.uploadBoxItemName>i{
    color: #a6aabb;
}
.uploadBoxItemBottom{
    white-space: nowrap;
    font-size: 0;
}
.uploadBoxItemBottom>*{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
}
.uploadBoxItemBottom>span:not(.errorTxt){
    height: 8px;
    width: 70%;
    margin-top: 5px;
    margin-right: 56px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #f2f2f2;
    position: relative;
}
.uploadBoxItemBottom>span>i{
    position: relative;
    display: block;
    height: 100%;
    border-radius: 4px;
    background-color: #95a6ff;
    width: 0;
    transition: width 0.1s linear;
}
.uploadBoxItemBottom>span>i.error{
    background-color: #fa5135;
}
.uploadBoxItemBottom>span>span{
    display: block;
    position: absolute;
    left: 100%;
    top: -4px;
    margin-left: 8px;
    white-space: nowrap;
    line-height: 1;
    color: #a6aabb;
}
.uploadBoxItemBottom>span.errorTxt{
    width: calc(70% - 42px);
    margin-right: 24px;
    line-height: 18px;
    color: #ff4247;
    white-space: pre-wrap;
}
.uploadBoxItemBottom>div{
    font-size: 0;
}
.imgBox{
    display: inline-block;
    vertical-align: top;
}
.imgBox.hasBig{
    width: 100%;
}
.imgBox>i{
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    width: 90px;
    height: 90px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 10px;
}
.imgBox>i.errorImg{
    border-color: #ff4247;
    z-index: 1;
}
.imgBox>i.bigImg{
    width: 100%;
    height: 0;
    padding-bottom: 100%;
}
.imgBox>i img{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.imgBox>i div.deleteImg{
    z-index: 11;
    display: block;
    width: 100%;
    height: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    background-color: rgba(64,64,64,0.64);
    transition: opacity 0.15s ease,color 0.15s ease,;
    opacity: 0;
    cursor: pointer;
}
.imgBox>i.errorImg>div,.imgBox>i:hover>div{
    opacity: 1;
}
.imgBox>i:hover>div:hover{
    color: rgba(255, 255, 255, 1);
}
.imgBox>i.errorImg>.errorTxt{
    font-size: 14px;
    line-height: 18px;
    height: 18px;
    color: #ff4247;
    overflow: hidden;
    position: absolute;
    top: 100%;
    margin-top: 2px;
}
.imgBox>i.uploadIcon{
    display: inline-block;
    vertical-align: top;
    width: 90px;
    height: 90px;
    border-style: solid;
    position: relative;
}
.imgBox>i.uploadIcon::before,.imgBox>i.uploadIcon::after{
    width: 20px;
    height: 20px;
}
.imgBox>i.uploadIcon::before{
    margin: 24px 0 0 24px;
}
.imgBox>i.uploadIcon::after{
    margin: -1px 0 0 43px;
}
.imgLoading::before{
    content: '';
    position: absolute;
    display: block;
    border: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(64,64,64,0.64);
    top: 0;
    left: 0;
    z-index: 2;
}
.imgLoading>i.uploading{
    display: block;
    position: absolute;
    z-index: 100;
    width: 30px;
    height: 30px;
    left: 50%;
    top: 50%;
    margin: -16px 0 0 -16px;
    border:1px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    background-color: transparent;
    z-index: 3;
}
.imgLoading>i.uploading>b{
    display: block;
    width: 14px;
    height: 28px;
    position: absolute;
    top:1px;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
.imgLoading>i.uploading>b:nth-child(1){
    right: 1px;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
}
.imgLoading>i.uploading>b:nth-child(2){
    left: 1px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}
.imgLoading>i.uploading>b>i{
    display: block;
    width: 30px;
    height: 30px;
    border: 15px solid transparent;
    box-sizing: border-box;
    border-radius: 50%;
    position: absolute;
    top: -1px;
    transform: rotate(45deg);
}
.imgLoading>i.uploading>b:nth-child(1)>i{
    border-top: 15px solid rgba(255, 255, 255, 0.9);
    border-right: 15px solid rgba(255, 255, 255, 0.9);
    right: -1px;
    transition: transform 0.02s linear;
}
.imgLoading>i.uploading>b:nth-child(2)>i{
    border-bottom: 15px solid rgba(255, 255, 255, 0.9);
    border-left: 15px solid rgba(255, 255, 255, 0.9);
    left: -1px;
    transition: transform 0.02s linear 0.02s;
}
</style>
<style>
.uploadBox .btnLoading .el-loading-spinner i{
    color: #fff;
}
.uploadBox .btnLoading .el-loading-spinner{
    margin-top: 0;
    top: 0;
}
.uploadView{
    width: 100%;
    height: 100%;
    padding: 60px 50px 30px;
    background-color: transparent;
}
.uploadView>.el-dialog__body{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    max-width: 1200px;
    box-sizing: border-box;
    background-color: transparent;
    padding: 0;
    position: relative;
}
.uploadView>.el-dialog__header{
    padding: 0;
}
.uploadView>.el-dialog__header>.el-dialog__headerbtn{
    font-size: 40px;
    top: 10px;
    right: 30px;
}
.uploadView>.el-dialog__header>.el-dialog__headerbtn>.el-dialog__close{
    color: #ffffff;
    opacity: 0.8;
    transition: opacity 0.15s ease;
}
.uploadView>.el-dialog__header>.el-dialog__headerbtn:hover>.el-dialog__close{
    opacity: 1;
}
.uploadView>.el-dialog__body .uploadViewComtent{
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    opacity: 1;
    transition: opacity 0.15s ease;
}
.uploadViewErr{
    width: 500px;
    height: 500px;
}
.uploadViewErr>i{
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 20px;
    font-size: 80px;
    line-height: 200px;
    text-align: center;
    margin: 60px auto 100px;
    background-color: #dcdcdc;
    box-shadow: 0 0 10px #83868b;
}
.uploadViewErr>i.uploadViewd{
    background-color: #4b84e6;
    color: #fff;
}
.uploadViewErr>i.uploadViewx{
    background-color: #0ccda9;
    color: #fff;
}
.uploadViewErr>i.uploadViewp{
    background-color: #f14f19;
    color: #fff;
}
.uploadViewErr>span{
    display: block;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background-color: rgba(0,0,0,0.5);
    padding: 20px 0px;
    border-radius: 6px;
}
.uploadView>.el-dialog__body .uploadViewComtent.hidden{
    opacity: 0;
}
.uploadView>.el-dialog__body .el-icon-loading{
    position: absolute;
    left: 50%;
    top: 45%;
    font-size: 50px;
    color: #fff;
    opacity: 0;
    transition: opacity 0.15s ease;
    margin-left: -25px;
}
.uploadView>.el-dialog__body .uploadViewComtent.hidden+.el-icon-loading,
.uploadView>.el-dialog__body .el-icon-loading:only-child{
    opacity: 1;
}
</style>