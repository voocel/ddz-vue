import { login, register } from '@/api/user'
import { getToken, setToken, setUserInfo } from '@/utils/auth'
const state = {
  token: getToken(),
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

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { result } = response
        setUserInfo(JSON.stringify({
          nickname: result.nickname,
          uid: result.uid
        }))
        setToken(result.token)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  register({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: username.trim(), password: password }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
