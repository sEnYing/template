<template>
    <div class="btnGroup"><slot></slot></div>
</template>

<script>
// import css和第三方js
export default {
    name: 'unitBtnGroup',
    data () {
        return{
        }
    },
    methods:{
    },
    mounted(){
    },
    destroyed(){
    },
}
</script>


<style scoped>
.btnGroup{
    display: inline-block;
    vertical-align: top;
    font-size: 0;
}
</style>
