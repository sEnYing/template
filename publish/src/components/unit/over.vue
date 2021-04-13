<template>
    <div class="example">
        <div class="thisTitle">过长省略组件 unit-over</div>
        <div class="box">
            <div class="thisText">
                <span>参数 lines，可选，默认显示1行，值可为number或string类型的数字，为空为零为null为false都默认为1行</span>
                <span>参数 content，可选，不传也可用插槽slot带入内容</span>
                <span>提示框过长有滚动条</span>
            </div>
            <div class="thisText">纯文本</div>
            <div class="thisEx">
                <div class="divEx divEx1">
                    <unit-over>自定义指令的生命周期：自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind。bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作。inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)。update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新。componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用。unbind: 只调用一次，指令月元素解绑的时候调用</unit-over>
                    <unit-over :lines='1'>{{text}}</unit-over>
                    <unit-over lines='2'>{{text}}</unit-over>
                    <unit-over lines='3'><span v-html='text'></span></unit-over>
                    <unit-over lines='4' :content='text'></unit-over>
                </div>
            </div>
            <div class="thisText"></div>
            <div class="thisText"><span>代码如下</span></div>
            <textarea v-showcode>
<template>

    // 插槽中直接插入内容
    <unit-over>自定义指令的生命周期：自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind。bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作。inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)。update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新。componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用。unbind: 只调用一次，指令月元素解绑的时候调用</unit-over>
    
    // 插槽中使用花括号
    <unit-over :lines='1'>{{code}}</unit-over>
    <unit-over lines='2'>{{code}}</unit-over>
    
    // 插槽中使用v-html
    <unit-over lines='3'><span v-html='text'></span></unit-over>
    
    // 使用 参数 content
    <unit-over lines='4' :content='text'></unit-over>
    
</template>
<script>
export default {
    data () {
        return{
            text:'自定义指令的生命周期：\n自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind\nbind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作\ninserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)\nupdate: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新\ncomponentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用\nunbind: 只调用一次，指令月元素解绑的时候调用'
        }
    },
}
</script></textarea>
            <div class="thisText">html文本</div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-over lines='5' :content='text_'></unit-over>
                    <unit-over lines='5'><span v-html='text_'></span></unit-over>
                    <unit-over lines='5'><p>自定义指令的生命周期：</p><p>自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind</p><p>bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作</p><p>inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)</p><p>update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新</p><p>componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用</p><p>unbind: 只调用一次，指令月元素解绑的时候调用</p></unit-over>
                </div>
            </div>
            <div class="thisText"></div>
            <div class="thisText"><span>代码如下</span></div>
            <textarea v-showcode>
<template>

    // 直接插入内容
    <unit-over lines='5'><p>自定义指令的生命周期：</p><p>自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind</p><p>bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作</p><p>inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)</p><p>update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新</p><p>componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用</p><p>unbind: 只调用一次，指令月元素解绑的时候调用</p></unit-over>
    
    // 插槽中使用v-html
    <unit-over lines='5'><span v-html='text_'></span></unit-over>
    
    // 使用 参数 content
    <unit-over lines='5' :content='text_'></unit-over>

</template>
<script>
export default {
    data () {
        return{
            text_:'<p>自定义指令的生命周期：</p><p>自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind</p><p>bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作</p><p>inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)</p><p>update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新</p><p>componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用</p><p>unbind: 只调用一次，指令月元素解绑的时候调用</p>'
        }
    },
}
</script></textarea>
            <div class="thisText">动态文本（加载数据后得到的文本）
                <span>推荐使用参数content，因为组件做了content变化的监听，使用插槽无法只监听数据内容更改</span>
            </div>
            <div class="thisEx">
                <div class="divEx">
                    <unit-over lines='5' :content='text1'></unit-over>
                </div>
            </div>
        </div>
            <div class="thisText"></div>
            <div class="thisText"><span>代码如下</span></div>
            <textarea v-showcode>
<template>
    <unit-over lines='5' :content='text1'></unit-over>    
</template>
<script>
export default {
    data () {
        return{
            text1:''
            ,text2:'故事的小黄花<br/>从出生那年就飘着<br/>童年的荡秋千<br/>随记忆一直晃到现在<br/>Re So So Si Do Si La<br/>So La Si Si Si Si La Si La So<br/>吹着前奏 望着天空<br/>我想起花瓣试着掉落<br/>为你翘课的那一天<br/>花落的那一天<br/>教室的那一间<br/>我怎么看不见<br/>消失的下雨天<br/>我好想再淋一遍<br/>没想到 失去的勇气我还留着<br/>好想再问一遍<br/>你会等待还是离开<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能在你身边<br/>等到放晴的那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>但偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了 拜拜<br/>为你翘课的那一天<br/>花落的那一天<br/>教室的那一间<br/>我怎么看不见<br/>消失的下雨天<br/>我好想再淋一遍<br/>没想到 失去的勇气我还留着<br/>好想再问一遍<br/>你会等待还是离开<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能在你身边<br/>等到放晴的那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了 拜拜<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能够在你身边<br/>等到放晴那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>但偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了拜'
        }
    },
    methods:{
        setText(){
            setTimeout(()=>{
                this.text1=this.text2
            },50);
        }
    },
    mounted(){
        this.setText();
    },
}
</script></textarea>
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'methodOfOver',
    props:['dom'],
    data () {
        return{
            text:'自定义指令的生命周期：\n自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind\nbind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作\ninserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)\nupdate: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新\ncomponentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用\nunbind: 只调用一次，指令月元素解绑的时候调用'
            ,text_:'<p>自定义指令的生命周期：</p><p>自定义指令有5个生命周期(也叫作钩子函数)分别是bind ,inserted,update,componentUpdate,unbind</p><p>bind 只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作</p><p>inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)</p><p>update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新</p><p>componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用</p><p>unbind: 只调用一次，指令月元素解绑的时候调用</p>'
            ,text1:''
            ,text2:'故事的小黄花<br/>从出生那年就飘着<br/>童年的荡秋千<br/>随记忆一直晃到现在<br/>Re So So Si Do Si La<br/>So La Si Si Si Si La Si La So<br/>吹着前奏 望着天空<br/>我想起花瓣试着掉落<br/>为你翘课的那一天<br/>花落的那一天<br/>教室的那一间<br/>我怎么看不见<br/>消失的下雨天<br/>我好想再淋一遍<br/>没想到 失去的勇气我还留着<br/>好想再问一遍<br/>你会等待还是离开<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能在你身边<br/>等到放晴的那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>但偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了 拜拜<br/>为你翘课的那一天<br/>花落的那一天<br/>教室的那一间<br/>我怎么看不见<br/>消失的下雨天<br/>我好想再淋一遍<br/>没想到 失去的勇气我还留着<br/>好想再问一遍<br/>你会等待还是离开<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能在你身边<br/>等到放晴的那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了 拜拜<br/>刮风这天 我试过握着你手<br/>但偏偏 雨渐渐<br/>大到我看你不见<br/>还要多久 我才能够在你身边<br/>等到放晴那天<br/>也许我会比较好一点<br/>从前从前 有个人爱你很久<br/>但偏偏 风渐渐<br/>把距离吹得好远<br/>好不容易 又能再多爱一天<br/>但故事的最后<br/>你好像还是说了拜'
            ,code:'{{text}}'
        }
    },
    methods:{
        setText(){
            setTimeout(()=>{
                this.text1=this.text2
            },50);
        }
    },
    mounted(){
        this.setText();
    },
}
</script>
<style scoped>
.divEx>div{
    padding-bottom: 16px;
}
.divEx>div:nth-last-child(1){
    padding-bottom: 0;
}
.divEx1>div:nth-last-child(2){
    width: 50%;
}
.divEx1>div:nth-last-child(3){
    width: 200px;
}
.divEx1>div:nth-last-child(4){
    width: 50px;
}
.divEx1>div:nth-last-child(5){
    width: 50px;
    float: right;
}
</style>
