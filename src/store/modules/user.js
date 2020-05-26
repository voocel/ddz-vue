const state = {
  startState: false,
  curUser: 'mine',
  nextUser: 'mine',
  showCall: false,
  showRob: false,
  alarm: {
    left: 0,
    right: 0,
    mine: 1
  },
  isready: {
    left: false,
    right: false,
    mine: false
  },
  nickname: {
    left: '',
    right: '',
    mine: ''
  }
}

const mutations = {
  setReady(state, readyInfo) {
    state.isready[readyInfo[0]] = readyInfo[1]
  },
  setCall(state, call) {
    state.showCall = call
  },
  setRob(state, rob) {
    state.showRob = rob
  },
  setNickname(state, nick) {
    state.nickname[nick[0]] = nick[1]
  },
  setStartState(state, status) {
    state.startState = status
  },
  setCurUser(state, user) {
    state.curUser = user
  },
  setAlarm(state, alarm) {
    state.alarm = alarm
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
