<template>
    <div class="example">
        <div class="thisTitle">video.js 通过flash播放器播放视频流</div>
        <div class="thisText">
            <span><i class="must"></i>index.html中引用 video.min.js 和 video-js.min.css</span>
            <span>官方文档：<unit-btn text @click='clickBtn'>https://docs.videojs.com/index.html</unit-btn></span>
            <span class="thisIndex">ps:直播流目前我只试通了rtmp格式</span>
        </div>
        <textarea v-showcode>
<link href="/static/video/video-js.min.css" rel="stylesheet">
<script src="/static/video/video.min.js"></script></textarea>
		<div class="box">
			<div class="thisEx">
                <div class="monitorView">
                    <video id='id_monitor_video' class="video-js vjs-default-skin" ref="video">
                        <source src="" type="rtmp/flv">
                    </video>
                </div>
			</div>
            <div class="thisText">
                <span><i class="must"></i>播放rtmp使用的是flash播放器，需要打开浏览器flash播放器功能</span>
                <span><i class="must"></i>在beforeDestroy一定要使用dispose()摧毁播放器</span>
            </div>
			<textarea v-showcode>
//  html
<template>
    <div class="monitorView">
        <video id='id_monitor_video' class="video-js vjs-default-skin" ref="video">
            <source src="" type="rtmp/flv">
        </video>
    </div>
</template>

//  js
<script>
export default {
    data () {
        return{
            player:null
        }
    },
    methods:{
        setVideo(url){
            url?null:url=this.monitor[this.areaId];
            if(this.player){
                this.player.src(url);
                this.player.play();
                return;
            }
            this.player = videojs('id_monitor_video', {
                muted: true,
                controls : true,
                // loop : true,
                auto : true,
            },function(){
                this.src(url);
                this.play();
                this.on('play', function(err){
                    console.log('play')
                })
                this.on('waiting', function(err){
                    console.log('waiting')
                })
            });
            let that=this;
            this.player.on('error', function(){
                // console.log(this)
                if(!this.error_&&!this.error_.code&&this.error_.code!==0){return}
                switch(this.error_.code){
                    case 4:
                        that.$confirm('您的浏览器没有打开flash播放器功能，请打开此功能后再次刷新本页面观看','提示',{
                            customClass:'troilaConfirm',
                            confirmButtonText: '好的',
                            cancelButtonText: '取消',
                        })
                        this.errorDisplay.contentEl_.innerHTML='播放视频失败，请打开flash播放器功能';
                        break;
                    default:
                        this.errorDisplay.contentEl_.innerHTML='视频播放失败';
                }
            })
        },
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('rtmp://172.26.136.90:1935/live/room1936');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.dispose();
        }
    },
}
</script>

//  css
<style scoped>
.monitorList{
    font-size: 0;
}
.monitorList>li{
    width: 30%;
    display: inline-block;
    vertical-align: top;
    margin-right: 5%;
    position: relative;
    height: 160px;
}
.monitorList>li:nth-child(3n){
    margin-right: 0;
}
.monitorList>li>.videoCon{
    display: block;
    position: absolute;
    width: 500%;
    height: 500%;
    top: 300%;
    left: 300%;
    transform: translate(-100%,-100%) scale(0.2);
}
</style>
<style>
.monitorList .vjs-error .vjs-error-display:before{
    content: '';
    height: 80px;
    background: url('../../assets/images/errorVideo.png') center center/auto 100% no-repeat;
    margin-top: -40px;
    transform: scale(2);
}
</style>
			</textarea>
		</div>
    </div>
</template>

<script>
export default {
    name: 'videoJS',
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
            window.open("https://docs.videojs.com/index.html")
        },
        setVideo(url){
            url?null:url=this.monitor[this.areaId];
            if(this.player){
                this.player.src(url);
                this.player.play();
                return;
            }
            this.player = videojs('id_monitor_video', {
                muted: true,
                controls : true,
                // loop : true,
                auto : true,
            },function(){
                this.src(url);
                this.play();
                this.on('play', function(err){
                    console.log('play')
                })
                this.on('waiting', function(err){
                    console.log('waiting')
                })
            });
            let that=this;
            this.player.on('error', function(){
                // console.log(this)
                if(!this.error_&&!this.error_.code&&this.error_.code!==0){return}
                switch(this.error_.code){
                    case 4:
                        that.$confirm('您的浏览器没有打开flash播放器功能，请打开此功能后再次刷新本页面观看','提示',{
                            customClass:'troilaConfirm',
                            confirmButtonText: '好的',
                            cancelButtonText: '取消',
                        })
                        this.errorDisplay.contentEl_.innerHTML='播放视频失败，请打开flash播放器功能';
                        break;
                    default:
                        this.errorDisplay.contentEl_.innerHTML='视频播放失败';
                }
            })
        },
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('rtmp://172.26.136.90:1935/live/room1936');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.dispose();
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
.monitorView .vjs-volume-menu-button{
    display: none;
}
.monitorView .vjs-error .vjs-error-display:before{
    content: '';
    height: 80px;
    background: url('../../assets/images/errorVideo.png') center center/auto 100% no-repeat;
    margin-top: -40px;
}
</style>