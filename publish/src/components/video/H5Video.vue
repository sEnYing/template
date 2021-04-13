<template>
    <div class="example">
        <div class="thisTitle">H5原生video标签</div>
        <div class="thisText">
            <span><i class="must"></i>支持视频video/ogg、video/mp4、video/webm，音频audio/ogg、audio/mpeg</span>
            <span><i class="must"></i>chrome下 非静音情况下无法自动播放视频，自动播放需要加muted</span>
        </div>
		<div class="box">
			<div class="thisEx">
                <div class="monitorView">
                    <video class="uploadViewComtent" controls src='/static/data/Video.mp4' type="video/mp4" ref='video' autoplay loop></video>
                </div>
			</div>
            <div class="thisText">
            </div>
			<textarea v-showcode>
<video class="uploadViewComtent" controls src='/static/data/Video.mp4' type="video/mp4" ref='video' autoplay loop></video></textarea>
		</div>
    </div>
</template>

<script>
export default {
    name: 'H5Video',
    props:['dom'],
    components:{
    },
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
    beforeDestroy(){
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
.monitorView>video{
    width: 100%;
    height: 100%;
}
</style>
<style>
</style>