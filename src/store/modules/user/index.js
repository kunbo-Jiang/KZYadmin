import { clearJson } from '@/utils/index'
import { getToken, setToken, storageUtil } from '@/utils/storage'
import { loginApi, editUserInfoApi, logoutApi } from '@/api/login'
import { getUserInfo } from '@/api/user'

export default {
  state: {
    user: {
      id: '',
      username: '',
      nickname: '',
      mobile: '',
      email: '',
      avatar: '',
      status: '',
      roles: []
    },
    token: getToken()
  },
  getters: {
    tokenVal: state => {
      return state.token
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_USER: state => {
      clearJson(state.user)
    },
    CLEAR_TOKEN: state => {
      clearJson(state.token)
    }
  },
  actions: {

    /**
     * 登录
     * @param {*} params
     * @returns
     */
    async login({ commit }, params) {
      const r = await loginApi(params)
      if (r) {
        setToken(r.accessToken)
        commit('SET_TOKEN', r.accessToken)
      }
      return r
    },

    /**
     * 获取当前用户信息
     * @returns
     */
    async getUser({ commit }) {
      const r = await getUserInfo()
      if (r) {
        commit('SET_USER', r.data)
      }
      return r
    },

    /**
     * 编辑当前用户信息
     * @param {*} params
     */
    async editUser({ dispatch }, params) {
      const r = await editUserInfoApi(params)
      if (r.data !== 1) {
        dispatch('getUser')
      }
      return r
    },

    /**
     * 退出当前账户
     * @returns
     */
    async logout() {
      const r = await logoutApi()
      return r
    },

    /**
     * 清除登录信息 用户信息
     * @param {*} param0
     * @param {*} flag
     */
    clear({ commit }, flag = false) {
      if (flag) {
        commit('CLEAR_TOKEN')
        setToken('')
      }
      commit('CLEAR_USER')
      storageUtil.set('USER', {})
    }
  }
}
