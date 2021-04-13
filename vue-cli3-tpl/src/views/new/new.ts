import { Component, Vue, Watch, Emit, Provide } from "vue-property-decorator"
import { Getter, Action } from "vuex-class"
import { NewData } from '@/types/views/new.interface'
import unitTable from "@/components/table/table.vue" // 组件

// https://github.com/kaorun343/vue-property-decorator#PropSync

@Component({
  name: 'requirement',
  components: {
    unitTable,
  },
  mixins: []
})
export default class About extends Vue {
  // Getter
  // @Getter author

  // Action
  // @Action GET_DATA_ASYN

  /**
   * @description data写法:  对应 data() {return {}}
   */
  data: NewData = {
    pageName: 'new'
  }
  moduleId: string = ''
  sel: any = {
    reqName: '',
    moduleId: '',
  }
  title: Array<object> = [
    { key: 'reqNo', name: '需求编号', width: 30 },
    { key: 'reqPriorityName', name: '优先级', width: 25 },
    { key: 'reqName', name: '需求名称', width: 35 },
    { key: 'creatorName', name: '创建人', width: 20 },
    { key: 'statusName', name: '状态', width: 25 }, //01草稿02激活
    // { key: "statusName", name: "阶段", width: 20 }
  ]
  treeData: object[] = []
  /**
     * @description watch写法:  对应 watch:{treeData(newV,oldV) {
      
    }}
     */
  // @Watch('treeData',{deep:true})
  @Watch('treeData')
  valueChange(newV: Array<object>, oldV: Array<object>) { }

  /**
     * @description Provide写法:  对应 Provide:{return {
      close: this.close,
    };}
     */
  @Provide()
  closeC = this.close
  /**
   * @description computed写法:  对应 computed:{judgeBtn() {
    return 123
  }}
   */
  get judgeBtn() {
    return 123
  }
  // get projId() {

  // }

  /**
  * @description methods写法:  对应 methods:{close() {}}
  */
  submit() {
  }
  close() { }

  /**
   * @description created:不变
   */
  created() {
    //
  }

  activated() {
    //
  }

  /**
    * @description emit写法:  对应 triggerEmit(val){this.$emit('trigger-emit',val)}
    */
  @Emit()
  triggerEmit(n: any) {
    console.log('hhh')
  }

  mounted() {
    //
    this.$on('trigger-emit', (data: any): void => {
      alert(data)
    })
  }

  // 初始化函数
  init() {
    //
  }

}
