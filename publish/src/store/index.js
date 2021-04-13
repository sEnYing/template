import Vue from 'vue'
import Vuex from 'vuex'
import pubfunc from '@/assets/js/public'
import api from '@/api'
import router from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token:pubfunc.getInfo('userToken'),   //用户登录标识
        userInfo:pubfunc.getInfo('userInfo'),   //用户信息
        treebox:null,    //树形下拉name
        socketMsg:null,    //socket传出消息
    },
    mutations: {
        tokenFn: (state,v)=>{
            v?pubfunc.setLStorage('userToken',v,true):(pubfunc.delLStorage('userToken'));
            state.token=v
        },
        userInfoFn: (state,v)=>{
            v?pubfunc.setLStorage('userInfo',v,true):pubfunc.delLStorage('userInfo');
            state.userInfo=v;
        },
        treeboxFn: (state,v)=>{
            state.treebox=v;
        },
        socketFn: (state,v)=>{
            state.socketMsg=v;
        },
    },
    actions:{
        clearlogin({commit}){     // 清除用户token和userInfo
            commit('tokenFn',false);
            commit('userInfoFn',false);
            router.push('/');
        },
        login(cxt){     // 验证登录
            let token=pubfunc.getInfo('userToken'),userInfo=pubfunc.getInfo('userInfo');
            if(!token){
                cxt.dispatch('clearlogin');
            }else{
                if(!userInfo){
                    // 退出登录接口
                    api.account.logout(res=>{
                        if(res.status){
                            cxt.dispatch('clearlogin')
                        }
                    })
                }else{
                    cxt.commit('tokenFn',token);
                }
            }
        },
    }
})
  
export default store;