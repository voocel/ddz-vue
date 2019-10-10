import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerInfo: null
  },
  mutations: {
    setPlayerInfo (state, playerInfo) {
        state.playerInfo = playerInfo
    }
  }
})