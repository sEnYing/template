<template>
    <div>
        <!-- html -->
    </div>
</template>

<script>
// import css和第三方js
export default {
    name: 'index',
    props:['dom'],
    data () {
        return{
        }
    },
    computed: {
        userInfo(){
            return this.$store.state.userInfo?this.$store.state.userInfo:{};
        },
    },
    methods:{
    },
    created(){
        this.userInfo&&this.userInfo.indexUrl?this.$router.push(this.userInfo.indexUrl):null
    },
    mounted(){},
}
</script>

<style scoped>
</style>
