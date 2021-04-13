<template>
    <div class="echartBox">
        <unit-line :dom='dom' :dataRange="chooseRange"></unit-line>
    </div>
</template>

<script>
import unitLine from '@/unit/components/echarts/wholeCountry'
export default {
    name: 'sales_country',
    props:['dom','range','date'],
    components:{unitLine},
    data () {
        return{
            chooseRange: {
                range: '',
                dateFrom: '',
                dateTo: '',
                query: ''
            },
        }
    },
    computed: {
        reload(){
            return this.$store.state.reload;
        },
    },
    watch:{
        date() {
            this.chooseRange.query = this.date.queryBtn;
            this.chooseRange.dateFrom = this.date.planDateFrom;
            this.chooseRange.dateTo = this.date.planDateTo;
            this.dataTo();
        }
    },
    methods:{
        dataTo() {
            this.chooseRange = JSON.parse(JSON.stringify(this.chooseRange))
        }
    },
    created(){
        this.chooseRange.range = this.range;
        this.chooseRange.dateFrom = this.date.planDateFrom;
        this.chooseRange.dateTo = this.date.planDateTo;
    },
    mounted(){
        
    },
}
</script>

<style scoped>
.echartBox {
    height: calc(100% - 132px);
}
</style>
