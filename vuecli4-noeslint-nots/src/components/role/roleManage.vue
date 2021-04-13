<template>
<div class="fillBox">
    <div class="boxTitle titleFix">
        <i class="role_icon"></i><span>角色管理</span>
        <unit-btn type='large right' @click="addBtn('add')" text='新建角色'></unit-btn>
    </div>
    <div class="contentFix">
        <div class="boxRel">
            <div class="boxTable">
                <unit-loading :loading='loading' v-if="loading"></unit-loading>
                <unit-table :total='total' :opern='3' :page='page' v-if="!loading||list.length>0" :list='list' :title='title' @click='tableOper' :operation="[{key:'revise', show:showJudge},{key:'delete',class:()=>{return 'redbtn'}, show:showJudge}, {key:'bindRole', show:showJudge}]"></unit-table>
                <unit-page :total='total' :page='page' @pagechange="getList"></unit-page>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import unitTable from '@/unit/components/element/tableScroll'
export default {
    name: 'roleManage',
    props:['dom'],
    components:{unitTable},
    data () {
        return {
            loading:false,
            page:1,
            total:0,
            title:[{key:'roleName',name:'角色名称',width:35},{key:'updateTime_',name:'更新时间',width:40}],
            list:[],
        }
    },
    computed: {
        reload(){
            return this.$store.state.reload;
        },
    },
    watch:{
        reload(){
            // console.log(this.reload)
            if(this.reload){
                this.getList(1);
                this.$store.commit('reloadFn',false);
            }
        },
    },
    methods:{
        showJudge(item,i) {
            return item.roleId!=='admin';
        },
        tableOper(type,item) {
            switch(type){
                case 'revise':
                    this.addBtn('revise', item);
                    return;
                case 'delete':
                    this.$store.commit('confirmFn',{
                        func:()=>{
                            this.$api.bgmgnt.role.delete({roleId:item.roleId},res=>{
                                switch(res.code){
                                    case '0':
                                        this.$store.commit('alertFn',{
                                            type:'success',
                                            text:'删除成功',
                                            func:()=>{
                                                this.getList(1);
                                            }
                                        })
                                        break;
                                    default:
                                        res.message?this.$store.commit('alertFn',{
                                            type:'error',
                                            text:res.message
                                        }):null;
                                }
                            })
                        },
                        text:'确认删除此角色吗？'
                    })
                    break;
                case 'bindRole':
                    this.bindBtn(item);
                    return;
            }
        },
        pagechange() {

        },
        addBtn(action, item) {
            this.$emit('dialog',{show:true,link:'roleAdd',title:(action === 'revise'?'编辑':'新建')+'角色',data:item,small:true})
        },
        bindBtn(item) {
            this.$emit('dialog',{show:true,link:'roleBind',title:'用户绑定',data:item,small:800})
        },
        getList(page) {
            this.page=page;
            this.loading=true;
            this.$api.bgmgnt.role.getList({page: page, limit: 10},res=>{
                // console.log(res)
                this.loading=false;
                switch(res.code){
                    case '0':
                        this.total=res.data.total;
                        let list=res.data.list?res.data.list:[];
                        list.map(v=>{
                            v.updateTime_=this.$pubfunc.TimeTransform('YYYY年MM月DD日 hh:mm',v.updateTime)
                        })
                        this.list=list;
                        break;
                }
            })
        }
    },
    created() {
        this.getList(1);
    },
    mounted(){
        
    },
}
</script>

<style scoped>
.boxTable{
    height: 100%;
}
</style>