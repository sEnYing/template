import { login } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken(),
}

const mutations = {
  SET_TOKEN: (state: any, token: string) => {
    state.token = token
  },
}

const actions = {
  login({ commit }: any, userInfo: any) {
    const { username, password } = userInfo
    return new Promise<void>((resolve, reject) => {
      login({ username: username.trim(), password: password }).then((response: any) => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch((error: any) => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}