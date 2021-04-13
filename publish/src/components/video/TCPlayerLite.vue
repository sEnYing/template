<template>
    <div class="example">
        <div class="thisTitle">TCPlayerLite播放视频</div>
        <div class="thisText">
            <span><i class="must"></i>index.html中引用 TcPlayer-2.3.2.js</span>
            <span>TCPlayerLite支持m3u8/flv/rtmp/mp4格式</span>
            <span>官方文档：<unit-btn text @click='clickBtn'>https://cloud.tencent.com/document/product/881/20207</unit-btn></span>
            <span class="thisIndex">ps:强大是强大 不知道上线是不是要收费</span>
        </div>
        <textarea v-showcode>
<script src="//imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.2.js" charset="utf-8"></script></textarea>
		<div class="box">
			<div class="thisEx">
                <div class="monitorView">
                    <div id="id_monitor_video"></div>
                </div>
			</div>
            <div class="thisText">
            </div>
			<textarea v-showcode>
//  html
<template>
    <div class="monitorView">
        <div id="id_monitor_video"></div>
    </div>
</template>

//  js
<script>
export default {
    name: 'TCPlayerLite',
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
            window.open("https://cloud.tencent.com/document/product/881/20207")
        },
        setVideo(url,type){
            var liveObj={
                //"flv": url, 
                //"flv_hd": url, 
                //"flv_sd": url, 
                //"m3u8": url, 
                //"m3u8_hd": url, 
                //"m3u8_sd": url, 
                //"rtmp": url, 
                //"rtmp_hd": url, 
                //"rtmp_sd": url, 
                //"mp4": url, 
                //"mp4_hd": url, 
                //"mp4_sd": url, 
                "autoplay" : true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                "coverpic" : "",    //封面图
                "width" :  '640',//视频的显示宽度，请尽量使用视频分辨率宽度
                "height" : '400',//视频的显示高度，请尽量使用视频分辨率高度
                "live" : true,    //是否是直播
                "wording":{
                    1:'视频播放失败',
                    2:'视频播放失败',
                    3:'视频播放失败',
                    4:'视频播放失败',
                    5:"您的浏览器没有打开flash播放器功能，请打开此功能后再次刷新本页面观看",
                    10:'视频播放失败',
                    11:'视频播放失败',
                    12:'视频播放失败',
                    13:'视频播放失败',
                    1001:'视频播放失败',
                    1002:'视频播放失败',
                    2032:'视频播放失败',
                    2048:'视频播放失败'
                },
                "listener":(msg)=>{
                    console.log(msg)
                    if(!this.player){return;}
                    switch(msg.type){
                        case 'load':
                            this.player.mute(true);
                            break;
                    }
                }
            };
            liveObj[type]=url;
            //初始化视频
            this.player = new TcPlayer('id_monitor_video', liveObj);
        },
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8','m3u8_hd');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.pause();
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
</style>
            </textarea>
		</div>
    </div>
</template>

<script>
export default {
    name: 'TCPlayerLite',
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
            window.open("https://cloud.tencent.com/document/product/881/20207")
        },
        setVideo(url,type){
            var liveObj={
                //"flv": url, 
                //"flv_hd": url, 
                //"flv_sd": url, 
                //"m3u8": url, 
                //"m3u8_hd": url, 
                //"m3u8_sd": url, 
                //"rtmp": url, 
                //"rtmp_hd": url, 
                //"rtmp_sd": url, 
                //"mp4": url, 
                //"mp4_hd": url, 
                //"mp4_sd": url, 
                "autoplay" : true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                "coverpic" : "",    //封面图
                "width" :  '640',//视频的显示宽度，请尽量使用视频分辨率宽度
                "height" : '400',//视频的显示高度，请尽量使用视频分辨率高度
                "live" : true,    //是否是直播
                "wording":{
                    1:'视频播放失败',
                    2:'视频播放失败',
                    3:'视频播放失败',
                    4:'视频播放失败',
                    5:"您的浏览器没有打开flash播放器功能，请打开此功能后再次刷新本页面观看",
                    10:'视频播放失败',
                    11:'视频播放失败',
                    12:'视频播放失败',
                    13:'视频播放失败',
                    1001:'视频播放失败',
                    1002:'视频播放失败',
                    2032:'视频播放失败',
                    2048:'视频播放失败'
                },
                "listener":(msg)=>{
                    console.log(msg)
                    if(!this.player){return;}
                    switch(msg.type){
                        case 'load':
                            this.player.mute(true);
                            break;
                    }
                }
            };
            liveObj[type]=url;
            //初始化视频
            this.player = new TcPlayer('id_monitor_video', liveObj);
        },
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
            this.setVideo('http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8','m3u8_hd');
        })
    },
    beforeDestroy(){
        if(this.player){
            this.player.pause();
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
</style>
<style>
</style>