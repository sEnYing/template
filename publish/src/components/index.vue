<template>
    <div class="contentBox">
        <show-theme v-if='judgeShow("theme")'></show-theme>
        <font v-if='judgeShow("font")'></font>
        <showColor v-if='judgeShow("color")'></showColor>
        <showForm v-if='judgeShow("form")'></showForm>
        <showDialog  v-if='judgeShow("dialog")'></showDialog>
        <pagination v-if='judgeShow("page")'></pagination>
        <showTable v-if='judgeShow("table")'></showTable>
        <!-- <show-theme ref="theme"></show-theme>
        <font ref="font"></font>
        <showColor ref="color"></showColor>
        <showForm ref="form"></showForm>
        <showDialog  ref="dialog"></showDialog>
        <pagination ref="page"></pagination>
        <showTable ref="table"></showTable> -->
    </div>
</template>

<script>
import showTheme from './element/theme'
import font from './element/font'
import showColor from './element/color'
import showDialog from './element/dialog'
import showForm from './element/form'
import pagination from './element/pagination'
import showTable from './element/table'

export default {
    name: 'index',
    props:['dom'],
    components:{
        showTheme,
        font,
        showColor,
        showForm,
        showDialog,
        pagination,
        showTable
    },
    data () {
        return{
        }
    },
    methods:{
        judgeShow(key){
            let code = this.$route.hash?this.$route.hash.replace('#',''):'';
            return code===key||(key==='theme'&&!code)?true:false
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
.contentBox>*{
    text-align: left;
    display: inline-block;
    vertical-align: top;
}
a.position{
    display: block;
}
</style>
<style>
</style>