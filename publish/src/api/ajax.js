import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '@/store'

Vue.use(VueAxios, axios)

// 请求拦截器
axios.interceptors.request.use(config => {
    let token=store.state.token; //引入store之后的store.state.token 或者storage里存的token 等
    token?config.headers['Authorization'] = token:null;
    return config
}, err => {
    return Promise.reject(err);
});
// 响应拦截器
axios.interceptors.response.use(res => {
    if(res.data.code==='600'){
        // 提示 登录已超时，请重新登录 并清空storage保存的token和用户信息
        store.dispatch('clearlogin');
    }
    return res
},
(error, config, code, request, response) => {
    const err = { status: 0, message: '服务器异常' }
    if(error.response){
        // 根据error.response.status 判断何种错误 不同错误不同对待
    }
    if(process.env.NODE_ENV === "development"){
        console.log(error, config, code, request, response) // for debug
    }
    return Promise.reject(err)
});

const objectToFormData = function(obj, form, namespace) {
    let fd = form || new FormData();
    let formKey;
    if(obj instanceof Array){
        for(let item of obj ){
            if(typeof item === 'object' && !(item instanceof File)){
                objectToFormData(item, fd, namespace+'[]');
            }else{
                // 若是数组则在关键字后面加上[]
                fd.append(namespace+'[]',item)
            }
        }
    }else{
        for(let property in obj) {
            if(obj.hasOwnProperty(property) && obj[property]) {
                if(namespace) {
                    // 若是对象，则这样
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }
                // if the property is an object, but not a File,
                // use recursivity.
                if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                    // 此处将formKey递归下去很重要，因为数据结构会出现嵌套的情况
                    objectToFormData(obj[property], fd, formKey);
                } else {
                    // if it's a string or a File object
                    fd.append(formKey, obj[property]);
                }
            }
        }
    }
    return fd;
};

const ajax=function(m,u,c,cb,options){    //  m 请求方式,  u 请求url,  c 请求参数,  cb 回调函数,  options(可选) 其他配置项,  other u是否为完整url
    options&&typeof options==='object'?null:options={};
    //  ansyc  同步异步 同步则await返回整个promise,
    //  download  接口是否返回的是文件流 true则会设置responseType为blob,
    //  pro  获取请求传输进度的回调函数,
    //  withCredentials  是否发给后端cookies
    //  other  u是否为完整url
    // console.log(m,u,c,cb,options)
    let param={
        method: m,
        url: options.other?u:('/api/'+u),// ^/api 配置代理转发
        cache:false,
        headers:{
            'Pragma': 'no-cache',
            'Cache-Control': 'must-revalidate',
            'Cache-Control': 'no-cache',
            'Cache-Control': 'no-store',    //以上均为清除ie请求缓存
            'Content-Type': 'application/json;charset=UTF-8',
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        withCredentials:options.withCredentials?options.withCredentials:false,
        onUploadProgress: progressEvent => {
            // console.log(progressEvent)
            options.pro?options.pro(progressEvent):null
        }
    }
    options.download?param.responseType= 'blob':null;
    if(m==='get'){
        param.params=c;
    }else{
        param.data=c;
    }
    var ajax=Vue.axios(param).then(function(res){
        if(cb){
            cb(res.data)
        }
        if(options.ansyc){
            return res.data;
        }
    }).catch(err => {
        if(process.env.NODE_ENV === "development"){
            console.log(err)
        }
        if(cb){
            cb(err)
        }
    })
    if(options.ansyc){
        return ajax;
    }
}

export default ajax