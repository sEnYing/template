<template>
    <i class="loadingBox" v-if='loading' v-loading='loading' :element-loading-spinner='white?"el-icon-loading":null' :element-loading-background="white?'rgba(255, 255, 255, 0)':'rgba(255, 255, 255, 0.9)'"></i>
</template>

<script>
// import css和第三方js
export default {
    name: 'ele_Loading',
    props:['loading','white'],
    data () {
        return{
        }
    },
    created(){
    },
    mounted(){
        // js
    },
    methods:{
    }
}
</script>


<style scoped>
i.loadingBox{
    position: absolute!important;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 100;
}
</style>