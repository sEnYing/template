<template>
  <div id="app">
    <unit-header v-if="login"
                 @showdialog='showDialog'></unit-header>
    <div class="main"
         v-if="login">
      <div class="mainContent"
           ref='scroll'>
        <div class="mainLeft">
          <unit-left></unit-left>
        </div>
        <div class="mainRight">
          <div>
            <router-view class="ClearFloat"
                         v-if="reloadView"
                         @onreback="onreback"
                         :dom='{width:innerWidth,height:innerHeight,left:scrollLeft,top:scrollTop}'
                         @login='judgeLogin'
                         @dialog='showDialog' />
          </div>
        </div>
      </div>
    </div>
    <footer :class="{loginFoot:!login}"
            v-html="footer"></footer>
    <unit-login v-if="!login"></unit-login>
    <unit-alert></unit-alert>
    <unit-confirm></unit-confirm>
    <unit-suggest v-if="login"
                  :dom='{width:innerWidth,height:innerHeight,left:scrollLeft,top:scrollTop}'></unit-suggest>
    <transition name='fade'>
      <unit-dialog v-if='dialog.show'
                   :link="dialog.link"
                   :title='dialog.title'
                   @close="showDialog"
                   :data='dialog.data?dialog.data:null'
                   :small='dialog.small'
                   :height='dialog.height'
                   :scroll='dialog.scroll'
                   :dom='{width:innerWidth,height:innerHeight,left:scrollLeft,top:scrollTop}'></unit-dialog>
    </transition>
  </div>
</template>

<script>
import unitHeader from './components/common/header'
import unitLogin from './components/common/login'
import unitLeft from './components/common/left'
import unitDialog from './unit/components/dialog'
import unitConfirm from './unit/components/confirm'
import unitAlert from './unit/components/element/alert'
import unitSuggest from './unit/components/suggest'

export default {
  name: 'App',
  components: {
    unitHeader, unitLogin, unitLeft, unitDialog, unitAlert, unitConfirm, unitSuggest
  },
  provide () {
    return {
      reload: this.reload,
      judgelogin: this.judgeLogin
    }
  },
  data: function () {
    return {
      footer: '版权所有 卓朗科技有限公司 津ICP备10200312号-3',
      innerWidth: null,
      innerHeight: null,
      scrollTop: 0,
      scrollLeft: 0,
      callback: null,
      listenScroll: null,
      reloadView: true,
      right: false,
      login: this.$store.state.token ? true : false,
      dialog: {
        show: false,
        link: null
      },
    }
  },
  computed: {
    userInfo () {
      // console.log(this.$store.state.userInfo)
      // console.log(this.$store.state.userInfo.modules)
      return this.$store.state.userInfo;
    },
    token () {
      return this.$store.state.token;
    },
  },
  watch: {
    $route: {
      handler (val, oldVal) {
        this.judgeLogin();
        this.dialog.show = false;
        this.dialog.link = null;
      },
      deep: true
    },
    token () {
      this.judgeLogin();
      this.token && !this.userInfo ? (this.$store.dispatch('getCount'), this.$store.dispatch('userInfo')) : null;
    },
    innerWidth: {
      deep: true,
      handler () {
        let el = document.getElementsByClassName('formBox')[0];
        if (!el) { return }
        el = el.children
        for (let i = 0; i < el.length; i++) {
          el[i].lastChild && el[i].lastChild.children && el[i].lastChild.children.length > 0 ? (el[i].lastChild.children[0].style.width = el[i].lastChild.offsetWidth + 'px') : null;
        }
      },
    }
  },
  methods: {
    // 刷新页面
    reload () {
      this.reloadView = false;
      this.$nextTick(() => {
        this.reloadView = true;
      })
    },
    // 验证登陆
    judgeLogin () {
      this.$store.dispatch('login');
      this.login = this.$store.state.token ? true : false;
    },
    // 页面宽高变化执行的操作
    onreback (callback) {
      this.callback = callback;
    },
    // 显示弹窗
    showDialog (dialog) {
      this.dialog = dialog
    }
  },
  created () {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    window.onresize = function () {
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      if (this.callback) { this.callback(); }
    }.bind(this);
    this.token && !this.userInfo ? this.$store.dispatch('userInfo') : null;
  },
  mounted () {
    this.$store.dispatch('getCount');
    this.$nextTick(() => {
      let div = this.$refs.scroll;
      if (div) { div = div.parentNode; } else { return; }
      if (div) { div = div.parentNode; } else { return; }
      this.scroll = div;
      this.listenScroll = () => {
        this.scrollTop = div.scrollTop
        this.scrollLeft = div.scrollLeft
      }
      this.scroll.addEventListener('scroll', this.listenScroll)
    })
  },
  destroyed () {
    this.scroll && this.listenScroll ? this.scroll.removeEventListener("scroll", this.listenScroll) : null;
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif; /*'Microsoft YaHei','STHeiti',*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  min-width: 1000px;
}
#app.unlogin {
  min-width: unset;
}
div.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 80px;
  bottom: 0;
  z-index: 99;
}
div.main .mainContent {
  width: 100%;
  position: relative;
  height: 100%;
  z-index: 1;
  padding: 16px 14px 50px 0;
  box-sizing: border-box;
}
div.mainLeft {
  position: fixed;
  top: 96px;
  width: 248px;
  bottom: 50px;
  z-index: 2;
}
div.mainRight {
  position: relative;
  box-sizing: border-box;
  padding-left: 264px;
  height: 100%;
  width: 100%;
  z-index: 1;
}
div.mainRight > div {
  width: 101%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 30px;
  position: relative;
  overflow: hidden;
}
footer {
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  z-index: 99;
  width: 100%;
}
footer.loginFoot {
  z-index: 1113;
}
/* 渐变 */
.fade-leave-active {
  opacity: 0;
  transition: all 0.2s linear;
}
.fade-enter-active {
  transition: all 0.2s linear;
}
.fade-leave,
.fade-enter {
  opacity: 0;
}
.fade-leave-active > div {
  animation: layer-bounceOut 0.2s linear 0s;
}
.fade-enter-active > div {
  animation: layer-bounceIn 0.15s linear 0s;
}
@-webkit-keyframes layer-bounceIn {
  0% {
    opacity: 0;
    margin-top: -20px;
  }

  100% {
    opacity: 1;
    margin-top: 0px;
  }
}

@keyframes layer-bounceIn {
  0% {
    opacity: 0;
    margin-top: -20px;
  }

  100% {
    opacity: 1;
    margin-top: 0px;
  }
}
@-webkit-keyframes layer-bounceOut {
  100% {
    opacity: 0;
    margin-top: -20px;
  }

  30% {
    margin-top: 10px;
  }

  0% {
    opacity: 1;
    margin-top: 0px;
  }
}
@keyframes layer-bounceOut {
  100% {
    opacity: 0;
    margin-top: -20px;
  }

  30% {
    margin-top: 10px;
  }

  0% {
    opacity: 1;
    margin-top: 0px;
  }
}
</style>
<style>
.el-scrollbar.unitScrollbar {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.unitScrollbar > .el-scrollbar__wrap {
  height: 100%;
  padding-bottom: 17px;
}
.unitScrollbar > .el-scrollbar__bar {
  z-index: 999;
}
.el-select-dropdown .el-scrollbar.is-empty {
  display: none;
}
.fillBox .el-scrollbar__view {
  min-height: 100%;
  height: 100%;
}
.contentFix
  > .boxRel
  > .unitScrollbar
  > .el-scrollbar__wrap
  > .el-scrollbar__view {
  min-width: 960px;
}
</style>