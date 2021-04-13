<template>
    <div class="content">
		<div class="example">
            <div class="thisTitle">通用方法 $socket</div>
            <div class="box">
                <div class="thisText">
                    <span>main.js中注册（也可组件内引用）（socket.js）</span>
                    <span><i class="must"></i>需要 vuex，若不使用vuex 请自行更改消息内容传出事件（在onmessage监听的回调函数里）</span>
                </div>
                <textarea v-showcode>
import pubfunc from './assets/js/socket'
Vue.prototype.$socket=socket</textarea>
            </div>
            <div class="box">
                <div class="thisText">使用
                    <span>new this.$socket(url)构造函数，url需要完整路径，路径中的“http://”会自动替换为“ws://”</span>
                    <span><i class="must"></i>注意页面或组件摧毁时（除非特殊情况），是需要摧毁该实例的，不然可能会同时创建多个相同socket</span>
                </div>
                <textarea v-showcode>
export default {
    name: 'socket',
    data () {
        return{
            socket:null
        }
    },
    computed: {
        socketMsg(){
            return this.$store.state.socketMsg
        },
    },
    watch:{
        socketMsg:{    // 监听msg
            deep:true,
            handler(v){
                this.$emit('msg',v);
            }
        }
    },
    methods:{
        init(){
            if(!this.socket){
                let socketFn=this.$socket;
                this.socket=new socketFn('http://'+window.location.host+'/webSocket/200');    // 创建实例
                if(process.env.NODE_ENV === "development"){
                    console.log(this.socket)
                }
            }
            this.socket.createWebSocket();    // 创建webSocket
        },
        destroyed(){
            this.socket.destroyed();    // 关闭webSocket并摧毁实例
        },
    },
    created(){
        this.init()
    },
    destroyed(){
        this.destroyed();
    },
    mounted(){
    },
}
                </textarea>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'socket',
    props:['dom'],
    data () {
        return{
        }
    },
    methods:{
    },
    created(){
    },
    mounted(){
    },
}
</script>

<style scoped>
.content{
    padding: 12px 16px;
    text-align: center;
}
</style>