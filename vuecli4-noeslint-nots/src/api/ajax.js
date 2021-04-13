import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '@/store'
// import qs from 'qs'
// import pubfunc from '@/assets/js/public'
// axios.defaults.withCredentials=false
Vue.use(VueAxios, axios)

// 请求拦截器
axios.interceptors.request.use(config => {
  let token = store.state.token;
  token ? config.headers['Authorization'] = token : null;
  // if(process.env.NODE_ENV === "development"){
  //     console.log(config)
  // }
  // return Promise.reject(new Error('no token'));
  return config
}, err => {
  return Promise.reject(err);
});
// 响应拦截器
axios.interceptors.response.use(res => {
  // if(process.env.NODE_ENV === "development"){
  // console.log(res)
  // }
  if (res.data.code === '600') {
    store.commit('alertFn', {
      type: 'error',
      text: '登录已超时，请重新登录'
    });
    store.dispatch('clearlogin');
  }
  if (res.data.code === '2' && res.data.message === 'validate_error') {
    res.data.message = res.data.data[0].message
  }
  return res
},
  (error, config, code, request, response) => {
    const err = { status: 1, msg: '服务器异常' }
    if (error.response) {
      if (error.response.status === 600) {
        err.status = 600;
        err.msg = '登录已超时，请重新登录'
      } else if (error.response.status === 403 || (error.message && (error.message.indexOf('403') > -1 || error.message.indexOf('401') > -1))) {
        err.status = 500;
        err.msg = '权限校验失败'
      }
    }
    if (process.env.NODE_ENV === "development") {
      console.log(error, config, code, request, response) // for debug
    }
    err.status === 600 ? store.dispatch('clearlogin') : null;
    store.commit('alertFn', {
      type: 'error',
      text: err.msg
    });
    return Promise.reject(err)
  });

const ajax = function (m, u, c, cb, a, pro, download, contentType) {    //m是请求方式,u是url,c是配置对象,cb是回调函数
  // console.log(m,u,c,cb,a)
  let param = {
    method: m,
    url: '/api/' + u,
    cache: false,
    // data:c,
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'must-revalidate',
      'Cache-Control': 'no-cache',
      'Cache-Control': 'no-store',
      'Content-Type': contentType ? contentType : 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    withCredentials: false,
    onUploadProgress: progressEvent => {
      // console.log(progressEvent)
      pro ? pro(progressEvent) : null
    }
  }
  download ? param.responseType = 'blob' : null;
  // if(m==='get')
  //     c['timestamp']= new Date().getTime()
  m === 'get' ? param.params = c : param.data = c;
  var ajax = Vue.axios(param).then(function (res) {
    if (cb) {
      cb(res.data)
    }
    if (a) {
      return res.data;
    }
  }).catch(err => {
    if (process.env.NODE_ENV === "development") {
      console.log(err)
    }
    if (cb) {
      cb(err)
    }
  })
  if (a) {
    return ajax;
  }
}

export default ajax
