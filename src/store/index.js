import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    startState: false,
    isready: {
      'left': false,
      'right': false,
      'me': false
    },
    nickname: {
      'left': '',
      'right': '',
      'me': ''
    }
  },
  mutations: {
    setReady (state, readyInfo) {
      state.isready[readyInfo[0]] = readyInfo[1]
    },
    setNickname (state, nick) {
      state.nickname[nick[0]] = nick[1]
    },
    setStartState (state, status) {
      state.startState = status
    }
  }
})
