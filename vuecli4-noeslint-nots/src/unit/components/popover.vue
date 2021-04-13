<template>
  <!-- <div class="popover" @mouseenter="changeShow(true)" @mouseleave="changeShow(false)"> -->
  <div class="popover">
    <div :class="['textEllipse'+(!lines||lines<2?'':lines)]"
         ref="parent">
      <span ref="child"
            v-showtit>{{content?content:''}}</span>
    </div>
    <!-- <i @click.stop='' v-if="judge&&!open&&show"></i>
        <transition name='publicTransition'>
            <div class="popoverCon" v-if="judge&&!open" v-show="show" :style="{width:width?(width+'px'):null,left:left?(-left+'px'):null}" @click.stop=''>
                <div>
                    <div v-if="title">{{title}}</div>
                    <span v-if="text||content" v-html='text?text:content'></span>
                </div>
            </div>
        </transition> -->
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: 'popover',
  props: ['title', 'content', 'lines', 'text'], //'text','width','left','open'
  data() {
    return {
      show: false,
      judge: false,
      st: null,
    }
  },
  directives: {
    showtit: {
      inserted: function(el, binding, vnode) {
        setTimeout(() => {
          // console.log(el)
          let w = el.offsetWidth,
            h = el.offsetHeight,
            pw = el.parentNode.offsetWidth,
            ph = el.parentNode.offsetHeight
          // console.log(w,pw,h,ph);
          w > pw || h > ph
            ? 'text'
              ? el.setAttribute('title', el.innerText)
              : el.setAttribute('title', el.innerHTML)
            : el.removeAttribute('title')
        }, 0)
      },
      componentUpdated: function(el, binding, vnode) {
        setTimeout(() => {
          // console.log(el)
          let w = el.offsetWidth,
            h = el.offsetHeight,
            pw = el.parentNode.offsetWidth,
            ph = el.parentNode.offsetHeight
          // console.log(w,pw,h,ph);
          w > pw || h > ph
            ? el.setAttribute('title', el.innerHTML)
            : el.removeAttribute('title')
        }, 0)
      },
    },
  },
  // watch:{
  //     content(){
  //         this.judgeShow();
  //     },
  // },
  // mounted(){this.judgeShow();},
  // methods:{
  //     judgeShow(){
  //         this.$nextTick(()=>{
  //             let parent=this.$refs.parent,child=this.$refs.child;
  //             // console.log(parent.offsetWidth,child.offsetWidth)
  //             this.judge=parent.offsetWidth<child.offsetWidth?true:false
  //         })
  //     },
  //     changeShow(j){
  //         j?this.st=setTimeout(()=>{this.show=j;},500):(clearTimeout(this.st),this.show=j);
  //     },
  // },
}
</script>


<style scoped>
.popover {
  position: relative;
}
.popover > i {
  display: block;
  width: 100%;
  height: 20px;
  z-index: 1;
  top: 100%;
  left: 0;
  position: absolute;
  cursor: default;
}
.popoverCon {
  position: absolute;
  width: 300px;
  top: 100%;
  margin-top: 10px;
  z-index: 2;
  box-sizing: border-box;
  cursor: auto;
}
.popoverCon::before,
.popoverCon::after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-width: 6px;
  border-color: transparent;
  border-style: solid;
  top: -6px;
  margin-left: 20px;
  border-top-width: 0;
  border-bottom-color: #fff;
  z-index: 2;
}
.popoverCon::before {
  border: 0;
  width: 6px;
  height: 3px;
  top: -3px;
  margin-left: 23px;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.popoverCon > div {
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 6px;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #7f879d;
  word-break: break-all;
}
.popoverCon > div > div {
  color: #484b5c;
  font-size: 16px;
  margin-bottom: 4px;
}
.textEllipse2 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*! autoprefixer: on */
}
.textEllipse3 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*! autoprefixer: on */
}
.textEllipse4 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*! autoprefixer: on */
}
.textEllipse5 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*! autoprefixer: on */
}
</style>
