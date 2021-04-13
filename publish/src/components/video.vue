<template>
    <div class="contentBox">
        <H5Video v-if='judgeShow("H5Video")'></H5Video>
        <videoJS v-if='judgeShow("videoJS")'></videoJS>
        <flvJS v-if='judgeShow("flvJS")'></flvJS>
        <TCPlayerLite v-if='judgeShow("TCPlayerLite")'></TCPlayerLite>
    </div>
</template>

<script>
import H5Video from './video/H5Video'
import videoJS from './video/videoJS'
import flvJS from './video/flvJS'
import TCPlayerLite from './video/TCPlayerLite'

export default {
    name: 'video_',
    props:['dom'],
    components:{
        H5Video,
        videoJS,
        flvJS,
        TCPlayerLite,
    },
    data () {
        return{
        }
    },
    methods:{
        judgeShow(key){
            let code = this.$route.hash?this.$route.hash.replace('#',''):'';
            return code===key?true:false
        }
    },
    created(){
    },
    mounted(){
    },
}
</script>

<style scoped>
.contentBox{
    padding: 12px 16px;
    text-align: center;
}
</style>
<style>
</style>