<template>
    <div class="example">
        <div class="thisTitle">flv.js 使用H5播放器播放flv(flash视频流)</div>
        <div class="thisText">
            <span><i class="must"></i>index.html中引用 flv.min.js 或 flv.js</span>
            <span>官方文档：<unit-btn text @click='clickBtn'>https://github.com/Bilibili/flv.js?5.1.4</unit-btn></span>
            <span class="thisIndex">ps:直播流目前我只试通了flv格式</span>
        </div>
        <textarea v-showcode>
<script src="/static/video/flv.min.js"></script>
<!-- 或 -->
<script src="/static/video/flv.js"></script></textarea>
		<div class="box">
			<div class="thisEx">
                <div class="monitorView">
                    <video id="id_monitor_video" ref="video" controls autoplay muted>Your browser is too old which doesn't support HTML5 video.</video>
                </div>
			</div>
            <div class="thisText">
            </div>
			<textarea v-showcode>
//  html
<template>
    <div class="monitorView">
        <video id="id_monitor_video" ref="video" controls autoplay muted>
            Your browser is too old which doesn't support HTML5 video.
        </video>
    </div>
</template>

//  js
<script>
export default {
    name: 'flvJS',
    props:['dom'],
    components:{
    },
    data () {
        return{
            player:null,
        }
    },
    methods:{
        setVideo(url){
            if (this.player) {
                this.player.pause();
                this.player.unload();
                this.player.detachMediaElement();
                this.player.destroy();
                this.player = null;
            }
            let element = this.$refs.video;
            if (flvjs.isSupported()) {
                this.player = flvjs.createPlayer({
                    type: 'flv',
                    url: url ,
                    duration:0
                });
                // console.log(element)
                this.player.attachMediaElement(element);
                this.player.load(); //加载
                //h5的video原生事件，可以播放，全部加载完毕
                element.addEventListener("canplaythrough",(e)=>{
                    // console.log(e)
                    this.player.play();
                });
                //加载失败
                this.player.on(flvjs.Events.ERROR,function(e){
                    console.log(e)
                    this.player.pause();
                    this.player.unload();
                    this.player.detachMediaElement();
                    this.player.destroy();
                    this.player = null;
                });
                // console.log(this.this.player,url)
            }
        },
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('https://aldirect.flv.huya.com/backsrc/87342475-87342475-375133073676697600-2847699218-10057-A-0-1.flv?wsSecret=db9dee1e50e56f856ad93787ca992387&wsTime=5e140013&fs=bgct&&sphdcdn=al_7-tx_3-js_3-ws_7-bd_2-hw_2&sphdDC=huya&sphd=264_*&ratio=2000&u=362406495081&t=100&sv=1911131147');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.pause();
            this.player.unload();
            this.player.detachMediaElement();
            this.player.destroy();
            this.player=null;
        }
    },
}
</script>

//  css
<style scoped>
.monitorView{
    width: 640px;
    height: 400px;
}
#id_monitor_video{
    width: 100%;
    height: 100%;
}
</style>
            </textarea>
		</div>
    </div>
</template>

<script>
export default {
    name: 'flvJS',
    props:['dom'],
    components:{
    },
    data () {
        return{
            player:null,
        }
    },
    methods:{
        clickBtn(){
            window.open("https://github.com/Bilibili/flv.js?5.1.4")
        },
        setVideo(url){
            if (this.player) {
                this.player.pause();
                this.player.unload();
                this.player.detachMediaElement();
                this.player.destroy();
                this.player = null;
            }
            let element = this.$refs.video;
            if (flvjs.isSupported()) {
                this.player = flvjs.createPlayer({
                    type: 'flv',
                    url: url ,
                    duration:0
                });
                // console.log(element)
                this.player.attachMediaElement(element);
                this.player.load(); //加载
                //h5的video原生事件，可以播放，全部加载完毕
                element.addEventListener("canplaythrough",(e)=>{
                    // console.log(e)
                    this.player.play();
                });
                //加载失败
                this.player.on(flvjs.Events.ERROR,function(e){
                    console.log(e)
                    this.player.pause();
                    this.player.unload();
                    this.player.detachMediaElement();
                    this.player.destroy();
                    this.player = null;
                });
                // console.log(this.this.player,url)
            }
        },
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('https://aldirect.flv.huya.com/backsrc/87342475-87342475-375133073676697600-2847699218-10057-A-0-1.flv?wsSecret=db9dee1e50e56f856ad93787ca992387&wsTime=5e140013&fs=bgct&&sphdcdn=al_7-tx_3-js_3-ws_7-bd_2-hw_2&sphdDC=huya&sphd=264_*&ratio=2000&u=362406495081&t=100&sv=1911131147');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.pause();
            this.player.unload();
            this.player.detachMediaElement();
            this.player.destroy();
            this.player=null;
        }
    },
}
</script>

<style scoped>
.thisEx{
    margin-bottom: 8px;
}
.monitorView{
    width: 640px;
    height: 400px;
}
#id_monitor_video{
    width: 100%;
    height: 100%;
}
</style>
<style>
</style>