<template>
  <div class="example">
    <div class="thisTitle">数形下拉框上传组件 unit-treebox</div>
    <div class="box">
      <div class="thisText">
        <span><i class="must"></i>需要 vuex 和 unit-over</span>
      </div>
      <div class="thisText">
        <span>参数 list 必选参数，Array，树形数组</span>
        <span>参数 placeholder 可选参数，String，提示语</span>
        <span>参数 choose 可选参数，Array，选中值的value</span>
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox :list="[]" @return="clickRetrun"></unit-treebox>
          <br />
          <unit-treebox
            :list="list1"
            placeholder="请选择"
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            :list="list1"
            :choose="[111, 13]"
            placeholder="请选择"
            @return="clickRetrun"
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-treebox :list='[]' @return='clickRetrun'></unit-treebox>
    <unit-treebox id='treebox1' :list='list1' placeholder='请选择' @return='clickRetrun'></unit-treebox>
    <unit-treebox :list='list1' :choose='[111,13]' placeholder='请选择' @return='clickRetrun'></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list1:[{value:1,label:'节点1',children:[{value:11,label:'节点1-1',children:[{value:111,label:'节点1-1-1',children:[]}]},{value:12,label:'节点1-2'},{value:13,label:'节点1-3'},{value:14,label:'节点1-4'}]},{value:2,label:'节点2'},{value:3,label:'节点3'},{value:4,label:'节点4'}]
        }
    },
    methods:{
        clickRetrun(res,id){
            let value=[],label=[];
            res.map(v=>{
                label.push(v.label)
                value.push(v.value)
            })
            this.$message({
                customClass:'troilaAlart',
                message: id+' 选择了 '+label.join(',')+'('+value.join(',')+')',
                type: 'success',
                duration:1500
            });
        }
    },
}
</script></textarea
      >
    </div>
    <div class="box">
      <div class="thisText">
        <span
          >参数 input 可选参数，Boolean，是否可筛选（不传值默认为true）</span
        >
        <span
          >参数 clear 可选参数，Boolean，是否可清空（不传值默认为true）</span
        >
        <span
          >参数 onlyleave
          可选参数，Boolean，是否可只有子节点可选（不传值默认为true）</span
        >
        <span
          >参数 onlyone 可选参数，Boolean，是否单选（不传值默认为true）</span
        >
        <span
          >参数 relation
          可选参数，Boolean，是否父子关联（不传值默认为false）</span
        >
        <span
          >参数 id 可选参数，String，默认为 null
          在选中内容变化时返回的传出参数中带出</span
        >
        <span> @return 传出结果，function(list,id){}</span>
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox
            id="treebox0"
            :list="list1"
            placeholder="只可选叶子节点"
            input
            clear
            onlyleave
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="treebox1"
            :list="list1"
            placeholder="单选"
            input
            clear
            onlyone
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="treebox2"
            :list="list1"
            placeholder="父子仍有关联"
            input
            clear
            relation
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="treebox3"
            :list="list1"
            placeholder="父子有关联且只可选叶子节点"
            input
            clear
            onlyleave
            relation
            @return="clickRetrun"
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-treebox id='treebox0' :list='list1' placeholder='只可选叶子节点' input clear onlyleave @return='clickRetrun'></unit-treebox>
    <unit-treebox id='treebox1' :list='list1' placeholder='单选' input clear onlyone @return='clickRetrun'></unit-treebox>
    <unit-treebox id='treebox2' :list='list1' placeholder='父子仍有关联' input clear relation @return='clickRetrun'></unit-treebox>
    <unit-treebox id='treebox3' :list='list1' placeholder='父子有关联且只可选叶子节点' input clear onlyleave relation @return='clickRetrun'></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list1:[{value:1,label:'节点1',children:[{value:11,label:'节点1-1',children:[{value:111,label:'节点1-1-1',children:[]}]},{value:12,label:'节点1-2'},{value:13,label:'节点1-3'},{value:14,label:'节点1-4'}]},{value:2,label:'节点2'},{value:3,label:'节点3'},{value:4,label:'节点4'}]
        }
    },
    methods:{
        clickRetrun(res,id){
            let value=[],label=[];
            res.map(v=>{
                label.push(v.label)
                value.push(v.value)
            })
            this.$message({
                customClass:'troilaAlart',
                message: id+' 选择了 '+label.join(',')+'('+value.join(',')+')',
                type: 'success',
                duration:1500
            });
        }
    },
}
</script></textarea
      >
    </div>
    <div class="box">
      <div class="thisText">
        <span
          >参数 defaultexpand
          可选参数，[Number,String,Boolean]，默认展开的层数</span
        >
        <span class="thisIndex"
          >不设置、不传内容、或者传true，默认全部打开</span
        >
        <span class="thisIndex">0或false，默认全闭合</span>
        <span class="thisIndex">数字或字符，展开的层数</span>
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox
            id="defaultexpand0"
            :list="list1"
            placeholder="全展开"
            clear
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="defaultexpand1"
            :list="list1"
            placeholder="全闭合"
            defaultexpand="0"
            clear
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="defaultexpand2"
            :list="list1"
            placeholder="展开1级"
            clear
            defaultexpand="1"
            @return="clickRetrun"
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-treebox id='defaultexpand0' :list='list1' placeholder='全展开' clear @return='clickRetrun'></unit-treebox>
    <unit-treebox id='defaultexpand1' :list='list1' placeholder='全闭合' defaultexpand='0' clear @return='clickRetrun'></unit-treebox>
    <unit-treebox id='defaultexpand2' :list='list1' placeholder='展开2级' clear defaultexpand='2' @return='clickRetrun'></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list1:[{value:1,label:'节点1',children:[{value:11,label:'节点1-1',children:[{value:111,label:'节点1-1-1',children:[]}]},{value:12,label:'节点1-2'},{value:13,label:'节点1-3'},{value:14,label:'节点1-4'}]},{value:2,label:'节点2'},{value:3,label:'节点3'},{value:4,label:'节点4'}]
        }
    },
    methods:{
        clickRetrun(res,id){
            let value=[],label=[];
            res.map(v=>{
                label.push(v.label)
                value.push(v.value)
            })
            this.$message({
                customClass:'troilaAlart',
                message: id+' 选择了 '+label.join(',')+'('+value.join(',')+')',
                type: 'success',
                duration:1500
            });
        }
    },
}
</script></textarea
      >
    </div>
    <div class="box">
      <div class="thisText">
        <span
          >参数 must
          可选参数，Boolean，是否不可为空（不传值默认为true），true则无法取消最后一个选中结果，</span
        >
        <span class="thisIndex">也可不设置，直接配合 choose 限制</span>
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox
            id="treebox4"
            :list="list1"
            placeholder="设置must"
            input
            clear
            onlyleave
            must
            @return="clickRetrun"
          ></unit-treebox>
          <br />
          <unit-treebox
            id="treebox5"
            :list="list1"
            :choose="choose"
            placeholder="操作choose"
            input
            clear
            onlyleave
            @return="clickRetrun1"
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-treebox id='treebox4' :list='list1' placeholder='设置must' input onlyleave must></unit-treebox>
    <unit-treebox id='treebox5' :list='list1' :choose='choose' placeholder='操作choose' input onlyleave @return='clickRetrun1'></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list1:[{value:1,label:'节点1',children:[{value:11,label:'节点1-1',children:[{value:111,label:'节点1-1-1',children:[]}]},{value:12,label:'节点1-2'},{value:13,label:'节点1-3'},{value:14,label:'节点1-4'}]},{value:2,label:'节点2'},{value:3,label:'节点3'},{value:4,label:'节点4'}]
            ,choose:[]
        }
    },
    methods:{
        clickRetrun1(res,id){
            let value=[];
            res.map(v=>{
                value.push(v.value)
            })
            value.length===0?null:this.choose=value;
        }
    },
}
</script></textarea
      >
    </div>
    <div class="box">
      <div class="thisText">
        <span
          >若 list 中配置 disabled ，为 true 则不可选，可在 option 中配置</span
        >
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox
            :list="list2"
            placeholder="请选择"
            input
            clear
            onlyleave
            relation
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-treebox :list='list2' placeholder='请选择' input clear onlyleave relation></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list2:[{value:1,label:'节点1',children:[{value:11,label:'节点1-1',children:[{value:111,label:'节点1-1-1',children:[]}]},{value:12,label:'节点1-2',disabled:true},{value:13,label:'节点1-3'},{value:14,label:'节点1-4'}]},{value:2,label:'节点2'},{value:3,label:'节点3'},{value:4,label:'节点4'}]
        }
    },
}
</script></textarea
      >
    </div>
    <div class="box">
      <div class="thisText">
        <span>参数 option 可选参数，Object，组件配置项</span>
        <span class="thisIndex"
          >key&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;主key，每个树节点用来作为唯一标识的属性，整棵树应该是唯一的，默认
          value</span
        >
        <span class="thisIndex"
          >label&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;指定节点标签为节点对象的某个属性值，默认
          label</span
        >
        <span class="thisIndex"
          >children&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;指定子树为节点对象的某个属性值，默认
          children</span
        >
        <span class="thisIndex"
          >disabled&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp;&nbsp;指定节点选择框是否禁用为节点对象的某个属性值，默认
          disabled</span
        >
      </div>
      <div class="thisEx">
        <div class="divEx">
          <unit-treebox
            :list="list3"
            placeholder="请选择"
            input
            clear
            onlyleave
            relation
            :option="{
              key: 'id',
              label: 'name',
              children: 'child',
              disabled: 'unable'
            }"
          ></unit-treebox>
        </div>
      </div>
      <textarea v-showcode>
<template>
     <unit-treebox :list='list3' placeholder='请选择' input clear onlyleave relation :option='{key:"id",label:"name",children:"child",disabled:"unable"}'></unit-treebox>
</template>
<script>
export default {
    data () {
        return{
            list3:[{id:1,name:'节点1',child:[{id:11,name:'节点1-1',unable:true,child:[{id:111,name:'节点1-1-1',child:[]},{id:112,name:'节点1-1-2',child:[]}]},{id:12,name:'节点1-2'},{id:13,name:'节点1-3',unable:true},{id:14,name:'节点1-4'}]},{id:2,name:'节点2'},{id:3,name:'节点3'},{id:4,name:'节点4'}]
        }
    },
}
</script></textarea
      >
    </div>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "methodOfTreebox",
  props: ["dom"],
  data() {
    return {
      list1: [
        {
          value: 1,
          label: "节点1",
          children: [
            {
              value: 11,
              label: "节点1-1",
              children: [{ value: 111, label: "节点1-1-1", children: [] }]
            },
            { value: 12, label: "节点1-2" },
            { value: 13, label: "节点1-3" },
            { value: 14, label: "节点1-4" }
          ]
        },
        { value: 2, label: "节点2" },
        { value: 3, label: "节点3" },
        { value: 4, label: "节点4" }
      ],
      list2: [
        {
          value: 1,
          label: "节点1",
          children: [
            {
              value: 11,
              label: "节点1-1",
              children: [{ value: 111, label: "节点1-1-1", children: [] }]
            },
            { value: 12, label: "节点1-2", disabled: true },
            { value: 13, label: "节点1-3" },
            { value: 14, label: "节点1-4" }
          ]
        },
        { value: 2, label: "节点2" },
        { value: 3, label: "节点3" },
        { value: 4, label: "节点4" }
      ],
      list3: [
        {
          id: 1,
          name: "节点1",
          child: [
            {
              id: 11,
              name: "节点1-1",
              unable: true,
              child: [
                { id: 111, name: "节点1-1-1", child: [] },
                { id: 112, name: "节点1-1-2", child: [] }
              ]
            },
            { id: 12, name: "节点1-2" },
            { id: 13, name: "节点1-3", unable: true },
            { id: 14, name: "节点1-4" }
          ]
        },
        { id: 2, name: "节点2" },
        { id: 3, name: "节点3" },
        { id: 4, name: "节点4" }
      ],
      choose: []
    };
  },
  methods: {
    clickRetrun(res, id) {
      let value = [],
        label = [];
      res.map(v => {
        label.push(v.label);
        value.push(v.value);
      });
      this.$message({
        customClass: "troilaAlart",
        message:
          id + " 选择了 " + label.join(",") + "(" + value.join(",") + ")",
        type: "success",
        duration: 1500
      });
    },
    clickRetrun1(res, id) {
      let old = JSON.parse(JSON.stringify(this.choose));
      this.choose = [];
      let value = [];
      res.map(v => {
        value.push(v.value);
      });
      value.length === 0 ? (this.choose = old) : (this.choose = value);
    }
  }
};
</script>

<style scoped>
.thisEx > * {
  margin-bottom: 12px;
}
</style>
