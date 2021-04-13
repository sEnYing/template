<template>
    <div class="example">
        <div class="thisTitle">按钮组件 unit-btn</div>
        <div class="box">
            <div class="thisText">关于不同种类按钮
                <span>配置 type 默认为空,可选值success warn error link</span>
            </div>
            <div class="thisEx">
                <span>正常</span>
                <unit-btn>默认</unit-btn>
                <unit-btn type='success'>成功</unit-btn>
                <unit-btn type='warn'>警告</unit-btn>
                <unit-btn type='error'>错误</unit-btn>
                <unit-btn type='link'>链接</unit-btn>
            </div>
            <div class="thisEx">
                <span>设置plain</span>
                <unit-btn plain>默认</unit-btn>
                <unit-btn plain type='success'>成功</unit-btn>
                <unit-btn plain type='warn'>警告</unit-btn>
                <unit-btn plain type='error'>错误</unit-btn>
                <unit-btn plain type='link'>链接</unit-btn>
                <span class='tips'>plain 可不赋值或者赋值true 设置为false则空心效果失效</span>
            </div>
            <div class="thisEx">
                <span>设置text</span>
                <unit-btn text>默认</unit-btn>
                <unit-btn text type='success'>成功</unit-btn>
                <unit-btn text type='warn'>警告</unit-btn>
                <unit-btn text type='error'>错误</unit-btn>
                <unit-btn text type='link'>链接</unit-btn>
                <span class='tips'>text 可不赋值或者赋值true 设置为false则效果失效</span>
            </div>
            <div class="thisEx">
                <span>设置disable</span>
                <unit-btn :disable='true'>默认</unit-btn>
                <unit-btn :disable='true' type='success'>成功</unit-btn>
                <unit-btn disable type='warn'>警告</unit-btn>
                <unit-btn disable type='error'>错误</unit-btn>
                <unit-btn disable type='link'>链接</unit-btn>
                <span class='tips'>disable 可不赋值或者赋值true 设置为false则禁用效果失效</span>
            </div>
            <div class="thisEx">
                <span></span>
                <unit-btn plain :disable='true'>默认</unit-btn>
                <unit-btn plain :disable='true' type='success'>成功</unit-btn>
                <unit-btn plain disable type='warn'>警告</unit-btn>
                <unit-btn plain disable type='error'>错误</unit-btn>
                <unit-btn plain disable type='link'>链接</unit-btn>
            </div>
            <div class="thisEx">
                <span></span>
                <unit-btn text :disable='true'>默认</unit-btn>
                <unit-btn text :disable='true' type='success'>成功</unit-btn>
                <unit-btn text disable type='warn'>警告</unit-btn>
                <unit-btn text disable type='error'>错误</unit-btn>
                <unit-btn text disable type='link'>链接</unit-btn>
            </div>
            <div class="thisEx">
                <span>设置round</span>
                <unit-btn round>默认</unit-btn>
                <unit-btn round type='success'>成功</unit-btn>
                <unit-btn round type='warn'>警告</unit-btn>
                <unit-btn plain round type='error'>错误</unit-btn>
                <unit-btn plain round type='link'>链接</unit-btn>
                <span class='tips'>round 可不赋值或者赋值boolean/number</span>
            </div>
            <div class="thisEx">
                <span>设置circle</span>
                <unit-btn circle>默</unit-btn>
                <unit-btn circle type='success'>成功</unit-btn>
                <unit-btn circle type='warn' icon='el-icon-star-off'></unit-btn>
                <unit-btn circle type='error' icon='el-icon-delete'></unit-btn>
                <unit-btn plain circle type='link' icon='el-icon-edit'></unit-btn>
                <unit-btn plain circle>Plain</unit-btn>
                <span class='tips'>circle 可不赋值或者赋值true 设置为false则禁用效果失效</span>
            </div>
            <textarea v-showcode>
<template>
    <div>
        <span>正常</span>
        <unit-btn>默认</unit-btn>
        <unit-btn type='success'>成功</unit-btn>
        <unit-btn type='warn'>警告</unit-btn>
        <unit-btn type='error'>错误</unit-btn>
        <unit-btn type='link'>链接</unit-btn>
    </div>

    <div>
        <span>设置plain</span>
        <unit-btn plain>默认</unit-btn>
        <unit-btn plain type='success'>成功</unit-btn>
        <unit-btn plain type='warn'>警告</unit-btn>
        <unit-btn plain type='error'>错误</unit-btn>
        <unit-btn plain type='link'>链接</unit-btn>
    </div>

    <div>
        <span>设置text</span>
        <unit-btn text>默认</unit-btn>
        <unit-btn text type='success'>成功</unit-btn>
        <unit-btn text type='warn'>警告</unit-btn>
        <unit-btn text type='error'>错误</unit-btn>
        <unit-btn text type='link'>链接</unit-btn>
    </div>

    <div>
        <span>设置disable</span>
        <unit-btn :disable='true'>默认</unit-btn>
        <unit-btn :disable='true' type='success'>成功</unit-btn>
        <unit-btn disable type='warn'>警告</unit-btn>
        <unit-btn disable type='error'>错误</unit-btn>
        <unit-btn disable type='link'>链接</unit-btn>
    </div>

    <div>
        <span></span>
        <unit-btn plain :disable='true'>默认</unit-btn>
        <unit-btn plain :disable='true' type='success'>成功</unit-btn>
        <unit-btn plain disable type='warn'>警告</unit-btn>
        <unit-btn plain disable type='error'>错误</unit-btn>
        <unit-btn plain disable type='link'>链接</unit-btn>
    </div>

    <div>
        <span></span>
        <unit-btn text :disable='true'>默认</unit-btn>
        <unit-btn text :disable='true' type='success'>成功</unit-btn>
        <unit-btn text disable type='warn'>警告</unit-btn>
        <unit-btn text disable type='error'>错误</unit-btn>
        <unit-btn text disable type='link'>链接</unit-btn>
    </div>

    <div>
        <span>设置round</span>
        <unit-btn round>默认</unit-btn>
        <unit-btn round type='success'>成功</unit-btn>
        <unit-btn round type='warn'>警告</unit-btn>
        <unit-btn plain round type='error'>错误</unit-btn>
        <unit-btn plain round type='link'>链接</unit-btn>
    </div>
    
    <div>
        <span>设置circle</span>
        <unit-btn circle>默</unit-btn>
        <unit-btn circle type='success'>成功</unit-btn>
        <unit-btn circle type='warn' icon='el-icon-star-off'></unit-btn>
        <unit-btn circle type='error' icon='el-icon-delete'></unit-btn>
        <unit-btn plain circle type='link' icon='el-icon-edit'></unit-btn>
        <unit-btn plain circle>Plain</unit-btn>
    </div>
</template></textarea>
        </div>
        <div class="thisText"></div>
        <div class="box">
            <div class="thisText">常用实心按钮</div>
            <div class="thisEx">
                <unit-btn>确定</unit-btn>
                <unit-btn>查询</unit-btn>
                <unit-btn>筛选</unit-btn>
                <unit-btn>保存</unit-btn>
                <unit-btn>编辑</unit-btn>
                <unit-btn>新建</unit-btn>
                <unit-btn>创建</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn>确定</unit-btn>
    <unit-btn>查询</unit-btn>
    <unit-btn>筛选</unit-btn>
    <unit-btn>保存</unit-btn>
    <unit-btn>编辑</unit-btn>
    <unit-btn>新建</unit-btn>
    <unit-btn>创建</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">常用空心(plain)按钮</div>
            <div class="thisEx">
                <unit-btn plain>取消</unit-btn>
                <unit-btn plain>重置</unit-btn>
                <unit-btn plain>清空</unit-btn>
                <unit-btn plain>返回</unit-btn>
                <unit-btn plain>关闭</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn plain>取消</unit-btn>
    <unit-btn plain>重置</unit-btn>
    <unit-btn plain>清空</unit-btn>
    <unit-btn plain>返回</unit-btn>
    <unit-btn plain>关闭</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">常用大号按钮
                <span>配置 large</span>
            </div>
            <div class="thisEx">
                <unit-btn large>筛选</unit-btn>
                <unit-btn large>新建客户</unit-btn>
                <unit-btn large>新建供应商</unit-btn>
                <unit-btn large>批量导出</unit-btn>
                <unit-btn large plain>返回首页</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn large>筛选</unit-btn>
    <unit-btn large>新建客户</unit-btn>
    <unit-btn large>新建供应商</unit-btn>
    <unit-btn large>批量导出</unit-btn>
    <unit-btn large plain>返回首页</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">超出字数(5个字)按钮示例
                <span>无论是否配置 large 都会无视默认宽度</span>
            </div>
            <div class="thisEx">
                <unit-btn>全部人员导出</unit-btn>
                <unit-btn large>全部人员导出</unit-btn>
                <unit-btn plain>全部人员导出</unit-btn>
                <unit-btn large plain>全部人员导出</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn>全部人员导出</unit-btn>
    <unit-btn large>全部人员导出</unit-btn>
    <unit-btn plain>全部人员导出</unit-btn>
    <unit-btn large plain>全部人员导出</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">圆角按钮
                <span>round 可不赋值或者赋值boolean/number</span>
            </div>
            <div class="thisEx">
                <unit-btn round>round不赋值</unit-btn>
                <unit-btn :round='true'>round赋值true</unit-btn>
                <unit-btn :round='10'>round赋值10</unit-btn>
                <unit-btn :round='0'>round赋值0</unit-btn>
                <unit-btn :round='false'>round赋值false</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn round>round不赋值</unit-btn>
    <unit-btn :round='true'>round赋值true</unit-btn>
    <unit-btn :round='10'>round赋值10</unit-btn>
    <unit-btn :round='0'>round赋值0</unit-btn>
    <unit-btn :round='false'>round赋值false</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">带图标按钮
                <span>icon 默认为空 赋值为element的图标class 若在右侧则赋值中加“right”</span>
                <span>也可在插槽内直接使用html图标</span>
            </div>
            <div class="thisEx">
                <unit-btn icon='el-icon-share'></unit-btn>
                <unit-btn icon='el-icon-circle-plus-outline'>添加</unit-btn>
                <unit-btn icon='el-icon-upload right'>上传</unit-btn>
                <unit-btn><i class="el-icon-top-left"></i> ^ . ^ <i class="el-icon-top-right right"></i></unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn icon='el-icon-share'></unit-btn>
    <unit-btn icon='el-icon-circle-plus-outline'>添加</unit-btn>
    <unit-btn icon='el-icon-upload right'>上传</unit-btn>
    <unit-btn><i class="el-icon-top-left"></i>^ . ^<i class="el-icon-top-right right"></i></unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">可选择按钮
                <span>list 格式为 [{label:'按钮名称',value:'按钮值'}] 的数组</span>
            </div>
            <div class="thisEx">
                <unit-btn :list="[{label:'项目信息变更',value:'info'},{label:'项目暂停',value:'stop'},{label:'项目废止',value:'end'}]">项目变更</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn :list="[{label:'项目信息变更',value:'info'},{label:'项目暂停',value:'stop'},{label:'项目废止',value:'end'}]">项目变更</unit-btn>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">按钮组
                <span>用 <code>&lt;unit-btn-group&gt;&lt;/unit-btn-group&gt;</code> 包起来</span>
            </div>
            <div class="thisEx">
                <unit-btn-group>
                    <unit-btn icon='el-icon-arrow-left'>上一页</unit-btn>
                    <unit-btn icon='el-icon-arrow-right right'>下一页</unit-btn>
                </unit-btn-group>
                <unit-btn-group>
                    <unit-btn round>新建</unit-btn>
                    <unit-btn round>编辑</unit-btn>
                    <unit-btn round>删除</unit-btn>
                    <unit-btn round :list="[{label:'禁用',value:'0'},{label:'启用',value:'1'}]">更多</unit-btn>
                </unit-btn-group>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn-group>
        <unit-btn icon='el-icon-arrow-left'>上一页</unit-btn>
        <unit-btn icon='el-icon-arrow-right right'>下一页</unit-btn>
    </unit-btn-group>
    <unit-btn-group>
        <unit-btn round>新建</unit-btn>
        <unit-btn round>编辑</unit-btn>
        <unit-btn round>删除</unit-btn>
        <unit-btn round :list="[{label:'禁用',value:'0'},{label:'启用',value:'1'}]">更多</unit-btn>
    </unit-btn-group>
</template></textarea>
        </div>
        <div class="box">
            <div class="thisText">点击事件和loading
                <span>@click传出点击事件 非可选按钮则不会传出数据，可选按钮传出选中对象</span>
                <span>loading 配置是否正在加载中</span>
            </div>
            <div class="thisEx">
                <unit-btn :loading='loading1' @click='click(1)'>搜索</unit-btn>
                <unit-btn :loading='loading2' @click='click(2)' icon='el-icon-share'></unit-btn>
                <unit-btn :loading='loading3' @click='click(3)' icon='el-icon-circle-plus-outline'>添加</unit-btn>
                <unit-btn :loading='loading4' @click='clickList' :list="[{label:'项目信息变更',value:'info'},{label:'项目暂停',value:'stop'},{label:'项目废止',value:'end'}]">项目变更</unit-btn>
            </div>
            <textarea v-showcode>
<template>
    <unit-btn :loading='loading1' @click='click(1)'>搜索</unit-btn>
    <unit-btn :loading='loading2' @click='click(2)' icon='el-icon-share'></unit-btn>
    <unit-btn :loading='loading3' @click='click(3)' icon='el-icon-circle-plus-outline'>添加</unit-btn>
    <unit-btn :loading='loading4' @click='clickList' :list="btnList">项目变更</unit-btn>
</template>
<script>
export default {
    data () {
        return{
            loading1:false,
            loading2:false,
            loading3:false,
            loading4:false,
            btnList:[{label:'项目信息变更',value:'info'},{label:'项目暂停',value:'stop'},{label:'项目废止',value:'end'}]
        }
    },
    methods:{
        click(i){
            this['loading'+i]=true;
            setTimeout(()=>{
                this['loading'+i]=false;
            },3000)
        },
        clickList(item){
            this.loading4=true;
            alert('您点击的是：'+item.label+'\ncode：'+item.value)
            setTimeout(()=>{
                this.loading4=false;
            },3000)
        },
    },
}
</script>
</textarea>
        </div>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'methodOfButton',
    props:['dom'],
    data () {
        return{
            loading1:false,
            loading2:false,
            loading3:false,
            loading4:false,
        }
    },
    methods:{
        click(i){
            this['loading'+i]=true;
            setTimeout(()=>{
                this['loading'+i]=false;
            },3000)
        },
        clickList(item){
            this.loading4=true;
            this.$alert('您点击的是：'+item.label+'\ncode：'+item.value, '提示', {
                confirmButtonText: '确定',
            });
            setTimeout(()=>{
                this.loading4=false;
            },3000)
        },
    },
}
</script>

<style scoped>
.showCode{
    max-height: 500px;
}
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
</style>
