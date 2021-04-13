<template>
  <div :class="['elDropdown']">
    <el-select :popper-class='align?"selectAlign":""'
               v-model="value"
               :placeholder="placeholder?placeholder:''"
               :filterable='input?true:false'
               :multiple='multiple?true:false'
               :clearable='multiple?false:(clear?true:false)'
               :filter-method='thisFilter'
               :disabled='disabled?true:false'
               @visible-change='clickThis'
               @change='selectChange'
               @blur="getContact"
               @clear='selectChange(null)'
               ref='dropdown'>
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: 'ele_Dropdown_cont',
  props: [
    'result',
    'placeholder',
    'input',
    'create',
    'multiple',
    'disabled',
    'clear',
    'id',
    'reset',
    'align',
    'orgid',
    'type',
    'showfirst',
  ],
  data() {
    return {
      list: [],
      options: [],
      value: '',
      show: false,
      num: 0,
    }
  },
  watch: {
    reset() {
      this.value = ''
    },
    result() {
      this.value =
        this.options.length > 0
          ? this.result
            ? JSON.parse(JSON.stringify(this.judgeRes(this.result)))
            : ''
          : ''
    },
    orgid() {
      this.value = ''
      this.getList()
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo ? this.$store.state.userInfo : {}
    },
  },
  methods: {
    judgeRes(id) {
      let option = this.options
      for (let i in option) {
        if (option[i].value === id) {
          return id
        }
      }
      this.$emit('change', '', this.id ? this.id : null)
      return ''
    },
    getList() {
      this.options = []
      this.list = []
      if (this.orgid === null) {
        return
      }
      let url = this.type ? this.type : 'customer'
      this.$api.public[url + 'Cont'](
        { orgId: this.orgid ? this.orgid : '' },
        res => {
          switch (res.code) {
            case '0':
              this.list = res.data ? res.data.concat() : []
              this.options = res.data ? res.data.concat() : []
              this.value = this.result
                ? JSON.parse(JSON.stringify(this.judgeRes(this.result)))
                : ''
              if (this.value && this.showfirst) {
                this.selectChange(this.value, 'showfirstCon')
              }
              break
          }
        },
      )
      if (this.$route.params.data) {
        this.value = this.$route.params.data.result.concatId
      }
    },
    getContact() {
      this.num = 0
      this.options.map(item => {
        if (item.label != this.value) {
          this.num++
        }
      })
      if (this.num == this.options.length) {
        this.$emit('getVal', this.value ? this.value : null)
      }
    },
    thisFilter(v) {
      if (this.create) {
        this.value = v
        this.selectChange(v)
      } else {
        this.value = v
      }
      let list = []
      for (let i in this.list) {
        if (this.list[i].label.indexOf(v) > -1) {
          list.push(this.list[i])
        }
      }
      this.options = list
    },
    selectChange(v, abc) {
      // console.log(v,this.options)
      if (v) {
        let list = []
        if (!this.multiple) {
          for (let i in this.options) {
            if (this.options[i].value === v) {
              // console.log(this.options[i].value,v)
              this.$emit(
                'change',
                this.options[i],
                abc ? abc : this.id ? this.id : null,
              )
              return
            }
          }
          list = { label: v, value: v }
        } else {
          for (let i in this.options) {
            if (v.indexOf(this.options[i].value) !== -1) {
              list.push(this.options[i])
            }
          }
          list.length === 0 ? list.push({ label: v, value: v }) : null
        }
        this.$emit('change', list, abc ? abc : this.id ? this.id : null)
      } else {
        this.$emit('change', { label: '', value: '' }, this.id ? this.id : null)
      }
    },
    clickThis(j) {
      this.$emit('click', this.id ? this.id : null)
      if (j) {
        this.options = this.list.concat()
      }
    },
  },
  created() {
    this.getList()
  },
}
</script>


<style scoped>
.elDropdown {
  display: inline-block;
  vertical-align: top;
}
</style>
<style>
.selectAlign .el-select-dropdown__item {
  text-align: center;
}
</style>
