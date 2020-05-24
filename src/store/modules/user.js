const state = {
  startState: false,
  isready: {
    left: false,
    right: false,
    me: false
  },
  nickname: {
    left: '',
    right: '',
    me: ''
  }
}

const mutations = {
  setReady(state, readyInfo) {
    state.isready[readyInfo[0]] = readyInfo[1]
  },
  setNickname(state, nick) {
    state.nickname[nick[0]] = nick[1]
  },
  setStartState(state, status) {
    state.startState = status
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
