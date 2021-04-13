import { NewState } from '@/types/views/new.interface'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as NewApi from '@/api/new'

const state: NewState = {
  author: '三毛'
}

// 强制使用getter获取state
const getters: GetterTree<NewState, any> = {
  author: (state: NewState) => state.author
}

// 更改state
const mutations: MutationTree<NewState> = {
  // 更新state都用该方法
  UPDATE_STATE(state: NewState, data: NewState) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { return }
      state[key] = data[key]
    }
  }
}

const actions: ActionTree<NewState, any> = {
  UPDATE_STATE_ASYN({ commit, state: NewState }, data: NewState) {
    commit('UPDATE_STATE', data)
  },
  // GET_DATA_ASYN({ commit, state: LoginState }) {
  //   New.getData()
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}

