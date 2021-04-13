<template>
    <div class="example">
        <div class="thisTitle">文件上传组件 unit-upload</div>
        <div class="box">
            <div class="thisText">
                <span><i class="must"></i>需要 unit-btn 和 unit-over</span>
                <span><i class="must"></i>组件中引用了js：exif.js ----解决手机上传图片旋转问题，对应自定义指令showimg</span>
            </div>
            <textarea v-showcode>import EXIF from '@/assets/js/exif'
// 也可直接index引用 /static/js/exif.js 文件</textarea>
            <div class="thisText">普通文件批量上传
                <span>参数 list 可选参数，Array，文件数组（只有只有配置hid时才可不传）</span>
                <span>参数 api 必选参数，String，文件上传路径api，对应 this.$api 方法名</span>
                <span><i class="must"></i>默认接口返回格式为 {status:1,data:{id:'id',path:'path'}}，可在option中配置返回格式（详见后文option配置）</span>
                <span><i class="must"></i>PS：文件预览只支持 png / jpg / jpeg / gif / pdf / mp4 / ogg / webm ，其他暂时无法预览</span>
            </div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-upload :list='fileList1' api="public.uploadFile" @delete='deleteFile'></unit-upload>
                </div>
            </div>
            <textarea v-showcode>
<template>
    <unit-upload 
        :list='fileList1' 
        api="public.uploadFile" 
        @delete='deleteFile'
    ></unit-upload>
</template>
<script>
export default {
    data () {
        return{
            fileList1:[
                {id:'1',realName:'example.jpg',fileSize:'107671',filePath:'/static/data/example.jpg'},
                {id:'2',realName:'用户手册.pdf',fileSize:'2829010',filePath:'/static/data/用户手册.pdf'},
                {id:'3',loading:72,realName:'文本.docx',fileSize:'321',filePath:'/文本.docx'},
                {id:'4',loading:'服务器异常',realName:'全部人员信息.xlsx',fileSize:'241123',filePath:'/全部人员信息.xlsx'},
                {id:'5',realName:'学习成长考核反馈表-前端类.xlsx',fileSize:'19016',filePath:'/static/data/学习成长考核反馈表-前端类.xlsx'},
            ],
        }
    },
    methods:{
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
    },
}
</script></textarea>
        </div>
        <div class="box">
            <div class="thisText">
                <span>参数 title 可选参数，String，文件组标题</span>
                <span>参数 limit 可选参数，Number/String，文件大小限制</span>
                <span>参数 count 可选参数，Number/String，文件个数限制</span>
                <span>参数 type 可选参数，String，文件类型，</span>
                <span class="thisIndex">不传则只限制默认类型（jpeg,jpg,png,doc,docx,xls,xlsx,ppt,pptx,txt,pdf,zip,rar）</span>
                <span class="thisIndex">值为 “ all ” 则不限制文件格式</span>
            </div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-upload :list='fileList2' api="public.uploadFile" title='附件' limit='10' count='5' type='excel,word' @delete='deleteFile'></unit-upload>
                </div>
                <div class="divEx">
                    <unit-upload :list='fileList3' api="public.uploadFile" title='附件' limit='10' count='5' type='all' @change='changeHeight' @delete='deleteFile'></unit-upload>
                </div>
            </div>
            <textarea v-showcode>
<template>
    <unit-upload 
        :list='fileList2' 
        api="public.uploadFile" 
        title='附件' 
        limit='10' 
        count='5' 
        type='excel,word' 
        @delete='deleteFile'
    ></unit-upload>

    <unit-upload 
        :list='fileList3' 
        api="public.uploadFile" 
        title='附件' 
        limit='10' 
        count='5' 
        type='all' 
        @change='changeHeight' 
        @delete='deleteFile'
    ></unit-upload>
</template>
<script>
export default {
    data () {
        return{
            fileList2:[
                {id:'1',realName:'example.jpg',fileSize:'107671',filePath:'/static/data/example.jpg'},
                {id:'2',realName:'卓朗科技-前端.docx',fileSize:'24384432',filePath:'/static/data/卓朗科技-前端.docx'},
                {id:'3',loading:72,realName:'文本.docx',fileSize:'321',filePath:'/文本.docx'},
                {id:'4',loading:'服务器异常',realName:'全部人员信息.xlsx',fileSize:'241123',filePath:'/全部人员信息.xlsx'},
            ],
            fileList3:[
                {id:'1',realName:'Video.mp4',fileSize:'21377024',filePath:'/static/data/Video.mp4'},
            ],
        }
    },
    methods:{
        changeHeight(key){
            console.log(key+'的高度变化了');
        },
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
    },
}
</script></textarea>
        </div>
        <div class="box">
            <div class="thisText">
                <span>参数 hid 可选参数，Boolean，是否隐藏文件列表（不传值默认为true）</span>
                <span>参数 multiple 可选参数，Boolean，是否多选上传（不传值默认为true）</span>
                <span>参数 total 可选参数，Number/String，文件现有总个数（主要为有表格分页时设置）</span>
                <span>参数 id 可选参数，Number/String，文件组id，默认为 “ upload ” 在上传成功和文件组高度变化时返回的传出参数中带出</span>
                <span>参数 disable 可选参数，Boolean，只有配置hid才有效（不传值默认为true）</span>
                <span>参数 large 可选参数，Boolean，只有配置hid才有效（不传值默认为true）</span>
                <span>参数 loading 可选参数，Boolean，是否需要上传按钮点击之后的loading样式，只有配置hid才有效（不传值默认为false）</span>
            </div>
            <div class="thisEx">
                <div class="divEx" v-loading='ajaxing1'>
                    <div>已经有{{total1}}个文件 最多20个文件</div>
                    <div class="thisText"></div>
                    <unit-upload api="public.uploadFile" multiple title='阅读资料' limit='10' count='20' hid :total='total1' id='thisUpload1' @success='successUpload1' @ajaxing='ajaxChange1' @delete='deleteFile'></unit-upload>
                </div>
                <div class="divEx">
                    <div>已经有{{total2}}个文件 最多20个文件</div>
                    <div class="thisText"></div>
                    <unit-upload api="public.uploadFile" title='附件' limit='10' count='20' hid :total='total2' id='thisUpload2' :disable='total2<20?false:true' large @success='successUpload2' @ajaxing='ajaxChange2' :loading='ajaxing2' @delete='deleteFile'></unit-upload>
                </div>
            </div>
            <textarea v-showcode>
<template>
    <div class="divEx" v-loading='ajaxing1'>
        <div>已经有{{text1}}个文件 最多20个文件</div>
        <unit-upload 
            api="public.uploadFile" 
            title='阅读资料' 
            limit='10'
            count='20' 
            hid 
            multiple 
            :total='total1' 
            id='thisUpload1' 
            @success='successUpload1'
            @ajaxing='ajaxChange1'
            @delete='deleteFile'
    ></unit-upload>
    </div>
    <div class="divEx">
        <div>已经有{{text2}}个文件 最多20个文件</div>
        <unit-upload 
            api="public.uploadFile"
            title='附件' 
            limit='10' 
            count='20' 
            hid 
            :total='total2' 
            id='thisUpload2' 
            :disable='total2<20?false:true'
            large
            @success='successUpload2' 
            @ajaxing='ajaxChange2' 
            :loading='ajaxing2' 
            @delete='deleteFile'
    ></unit-upload>
    </div>
</template>
<script>
export default {
    data () {
        return{
            total1:19,
            total2:19,
            ajaxing1:false,
            ajaxing2:false,
            fileList3:[
                {id:'1',realName:'Video.mp4',fileSize:'21377024',filePath:'/static/data/Video.mp4'},
            ],
        }
    },
    methods:{
        successUpload1(item,key){
            // 操作接口 如刷新列表table
            this.total1++;
            this.$message({
                customClass:'troilaAlart',
                message: key+'上传成功',
                type: 'success',
                duration:1500
            });
        },
        ajaxChange1(j){
            this.ajaxing1=j;
        },
        successUpload2(item,key){
            // 操作接口 如刷新列表table
            this.total2++;
            this.$message({
                customClass:'troilaAlart',
                message: key+'上传成功',
                type: 'success',
                duration:1500
            });
        },
        ajaxChange2(j){
            this.ajaxing2=j;
            console.log(key+'的高度变化了');
        },
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
    },
}
</script></textarea>
        </div>
        <div class="box">
            <div class="thisText">图片上传
                <span>参数 imgshow 可选参数，Boolean/String，是否为图片查看模式（不传值默认为true）</span>
                <span class="thisIndex">不配置值默认为 true ，若配置为 “ check ” 则为纯图片查看模式</span>
                <span class="thisIndex">配置imgshow之后，type会默认为img</span>
            </div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-upload :list='fileList4' multiple api="public.uploadFile" @delete='deleteFile' imgshow></unit-upload>
                </div>
            </div>
            <textarea v-showcode>
<template>
    <unit-upload 
        :list='fileList4' 
        api="public.uploadFile"
        multiple 
        @delete='deleteFile' 
        imgshow
    ></unit-upload>
</template>
<script>
export default {
    data () {
        return{
            fileList4:[{id:'1',realName:'example.jpg',fileSize:'1235566',filePath:'/static/data/example.jpg',src:'/static/data/example.jpg'},{id:'2',realName:'手机拍照角度问题.jpg',fileSize:'4656363',filePath:'/static/data/手机拍照角度问题.jpg',src:'/static/data/手机拍照角度问题.jpg'},],
        }
    },
    methods:{
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
    },
}
</script></textarea>
        </div>
        <div class="box">
            <div class="thisText">配置项
                <span>参数 param 可选参数，Object，上传接口中需要的其他参数</span>
                <span class="thisIndex">如需要用户id，时间 等（效果只能自行去network看了）</span>
                <span>参数 option 可选参数，Object，组件配置项</span>
                <span class="thisIndex">fileType&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;支持上传的文件格式类型，代替默认配置</span>
                <span class="thisIndex">statusKey&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;上传返回值判断status的属性名，为空（''）则不判断</span>
                <span class="thisIndex">statusValue&nbsp;&nbsp;&nbsp;&nbsp;String/Number/Boolean&nbsp;&nbsp;&nbsp;&nbsp;上传返回值判断status的属性值</span>
                <span class="thisIndex">id&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;上传返回值中文件id对应路径</span>
                <span class="thisIndex">path&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;上传返回值中文件path对应路径</span>
                <span class="thisIndex">message&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;上传返回值中错误提示对应路径</span>
            </div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-upload :list='fileList5' title='资料' api="public.uploadFile1" :option='option' :param='param' @delete='deleteFile'></unit-upload>
                </div>
            </div>
            <textarea v-showcode>
<template>
    <unit-upload 
        :list='fileList5' 
        title='资料' 
        api="public.uploadFile1" 
        :option='option' 
        :param='param' 
        @delete='deleteFile'
    ></unit-upload>
</template>
<script>
export default {
    data () {
        return{
            option:{
                fileType:{
                    img:['gif','png'],
                    psd:['psd'],
                    video:['mp4']
                },
                statusKey:'state',
                statusValue:'200',
                id:'data.fileId',
                path:'data.filePath',
                message:'msg'
            },
            param:{
                userId:'userId',
            },
        }
    },
    methods:{
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
    },
}
</script></textarea>
        </div>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'methodOfUpload',
    props:['dom'],
    data () {
        return{
            fileList1:[
                {id:'1',realName:'example.jpg',fileSize:'107671',filePath:'/static/data/example.jpg'},
                {id:'2',realName:'用户手册.pdf',fileSize:'2829010',filePath:'/static/data/用户手册.pdf'},
                {id:'3',loading:72,realName:'文本.docx',fileSize:'321',filePath:'/文本.docx'},
                {id:'4',loading:'服务器异常',realName:'全部人员信息.xlsx',fileSize:'241123',filePath:'/全部人员信息.xlsx'},
                {id:'5',realName:'学习成长考核反馈表-前端类.xlsx',fileSize:'19016',filePath:'/static/data/学习成长考核反馈表-前端类.xlsx'},
            ],
            fileList2:[
                {id:'1',realName:'example.jpg',fileSize:'107671',filePath:'/static/data/example.jpg'},
                {id:'2',realName:'卓朗科技-前端.docx',fileSize:'24384432',filePath:'/static/data/卓朗科技-前端.docx'},
                {id:'3',loading:72,realName:'文本.docx',fileSize:'321',filePath:'/文本.docx'},
                {id:'4',loading:'服务器异常',realName:'全部人员信息.xlsx',fileSize:'241123',filePath:'/全部人员信息.xlsx'},
            ],
            fileList3:[
                {id:'1',realName:'Video.mp4',fileSize:'21377024',filePath:'/static/data/Video.mp4'},
            ],
            fileList4:[{id:'1',realName:'example.jpg',fileSize:'1235566',filePath:'/static/data/example.jpg',src:'/static/data/example.jpg'},{id:'2',realName:'手机拍照角度问题.jpg',fileSize:'4656363',filePath:'/static/data/手机拍照角度问题.jpg',src:'/static/data/手机拍照角度问题.jpg'},],
            fileList5:[{id:'1',realName:'动图.gif',fileSize:'331776',filePath:'/static/data/动图.gif'},],
            total1:19,
            total2:19,
            ajaxing1:false,
            ajaxing2:false,
            option:{
                fileType:{
                    img:['gif','png'],
                    psd:['psd'],
                    video:['mp4']
                },
                statusKey:'state',
                statusValue:'200',
                id:'data.fileId',
                path:'data.filePath',
                message:'msg'
            },
            param:{
                userId:'userId',
            },
            text1:"{{total1}}",
            text2:"{{total2}}",
        }
    },
    methods:{
        deleteFile(item,cb){
            // 操作接口删除文件或数据关联等
            console.log('delete：',item);
            // 删除该行
            cb(item)
        },
        changeHeight(key){
            console.log(key+'的高度变化了');
        },
        successUpload1(item,key){
            // 操作接口 如刷新列表table
            this.total1++;
            this.$message({
                customClass:'troilaAlart',
                message: key+'上传成功',
                type: 'success',
                duration:1500
            });
        },
        ajaxChange1(j){
            this.ajaxing1=j;
        },
        successUpload2(item,key){
            // 操作接口 如刷新列表table
            this.total2++;
            this.$message({
                customClass:'troilaAlart',
                message: key+'上传成功',
                type: 'success',
                duration:1500
            });
        },
        ajaxChange2(j){
            this.ajaxing2=j;
            console.log(key+'的高度变化了');
        },
    },
}
</script>

<style scoped>
.thisEx>button,.thisEx>.btnGroup{
    margin-right: 24px;
}
.thisEx>button.textBtn{
    margin: 7px 48px 19px 24px;
}
.thisEx>*{
    margin-bottom: 12px;
}
.thisEx>button:nth-last-child(1),
.thisEx>.btnGroup:nth-last-child(1){
    margin-right: 0;
}
.thisIndex{
    text-indent: 34px;
}
</style>
