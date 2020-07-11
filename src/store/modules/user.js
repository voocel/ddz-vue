import { login, register, logout } from '@/api/user'
import { getToken, setToken, setUserInfo, removeToken, removeUserInfo, getDirection } from '@/utils/auth'
const state = {
  startState: false,
  curUser: 'mine',
  nextUser: 'mine',
  showCall: false,
  showRob: false,
  isCanPlay: false,
  alarm: {
    left: 0,
    right: 0,
    mine: 1
  },
  isready: {
    left: 0,
    right: 0,
    mine: 0
  }
}

const mutations = {
  setReady(state, readyInfo) {
    state.isready[getDirection(readyInfo[0])] = readyInfo[1]
  },
  resetReady(state) {
    state.isready = {
      left: 0,
      right: 0,
      mine: 0
    }
  },
  setCall(state, call) {
    state.showCall = call
  },
  setRob(state, rob) {
    state.showRob = rob
  },
  setCanPlay(state, isCanPlay) {
    state.isCanPlay = isCanPlay
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
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: getToken() }).then(() => {
        removeToken()
        removeUserInfo()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  backHall({ commit, state }) {
    console.log('返回大厅')
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
