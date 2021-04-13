import Vue from 'vue'
import Vuex from 'vuex'
import pubfunc from '@/assets/js/public'
import api from '@/api'
import router from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: pubfunc.getInfo('userToken'), //用户登录标识
    userInfo: pubfunc.getInfo('userInfo'), //用户信息
    alert: {
      //右侧提示
      type: 'success',
      text: '',
      func: null,
      time: null,
    },
    confirm: {
      //判断框
      type: null,
      func: null,
      text: '',
    },
    reload: false, //刷新重载
    msgCount: null, //待审核数
    notecDepartment: [
      '25B481C5AE694495BCBF68A54EA2AD4E',
      '42583CDA78464C3890EC092C1D8E45EE',
    ], //不需要技术支持的部门
    special: {
      resourceType: '02',
      depLevel: '03',
      resourceType1: '01,02,11',
    },
    /**
     * @name: 账号资源类型（岗位）
     * @param {string}resourceType 01总经理 02销售团队总经理 03技术副总 04采购部长 05销售总监 06技术总监/负责人 07销售经理 08售前技术工程师 09采购经理 10采购主管 11副总经理 99其他
     */
    searchCondition: pubfunc.getInfo('searchCondition'), //页面搜索条件
    page: pubfunc.getInfo('page'), //页码
  },
  mutations: {
    tokenFn: (state, v) => {
      v
        ? (pubfunc.setLStorage('userToken', pubfunc.encode(v)),
          pubfunc.setCookie('judge', 1))
        : (pubfunc.delLStorage('userToken'), pubfunc.delCookie('judge'))
      state.token = v
    },
    userInfoFn: (state, v) => {
      v
        ? (pubfunc.setLStorage('userInfo', pubfunc.encode(v)),
          pubfunc.setCookie('judge', 1))
        : (pubfunc.delLStorage('userInfo'), pubfunc.delCookie('judge'))
      state.userInfo = v
    },
    alertFn: (state, v) => {
      v.show !== false ? (v.show = true) : null
      state.alert = v
    },
    confirmFn: (state, v) => {
      v.show !== false ? (v.show = true) : null
      state.confirm = v
    },
    reloadFn: (state, v) => {
      state.reload = v
    },
    msgCountFn: (state, v) => {
      state.msgCount = v
    },
    searchConditionFn: (state, v) => {
      v
        ? (pubfunc.setLStorage('searchCondition', pubfunc.encode(v)),
          pubfunc.setCookie('judge', 1))
        : (pubfunc.delLStorage('searchCondition'), pubfunc.delCookie('judge'))
      state.searchCondition = v
    },
    pageFn: (state, v) => {
      v
        ? (pubfunc.setLStorage('page', pubfunc.encode(v)),
          pubfunc.setCookie('judge', 1))
        : (pubfunc.delLStorage('spage'), pubfunc.delCookie('judge'))
      state.page = v
    },
  },
  actions: {
    clearlogin({ commit }) {
      commit('tokenFn', false)
      commit('userInfoFn', false)
      router.push('/')
    },
    login({ commit }) {
      let token = pubfunc.getInfo('userToken')
      commit('tokenFn', token ? token : false)
      !token
        ? (commit('userInfoFn', false),
          commit('msgCountFn', null),
          router.push('/'))
        : null
    },
    async userInfo({ commit }) {
      let getIndex = function (arr) {
        for (let i in arr) {
          return arr[i].children && arr[i].children.length > 0
            ? getIndex(arr[i].children)
            : arr[i].menuUrl
        }
      }
      let data
      let res = await api.account.getInfo()
      switch (res.code) {
        case '0':
          data = res.data
          data.indexUrl = getIndex(data.menus)
          break
        default:
          data = null
      }
      commit('userInfoFn', data)
      router.push(data && data.indexUrl ? data.indexUrl : '/')
      return data
    },
    getCount({ commit }) {
      if (!this.state.token) {
        return
      }
      let count
      api.service.message.unreadcount((res) => {
        // console.log(res)
        switch (res.code) {
          case '0':
            count = res.data ? res.data.toString() : null
            break
          default:
            count = null
        }
        commit('msgCountFn', count)
      })
    },
  },
})

export default store
