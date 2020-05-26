import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueNativeSock from 'vue-native-websocket'
import 'element-ui/lib/theme-chalk/index.css'
import '@/permission' // permission control
import Common from '@/utils/common.js'

Vue.prototype.common = Common
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueNativeSock, 'ws://' + process.env.VUE_APP_SOCKET_URL + ':' + process.env.VUE_APP_SOCKET_PORT, {
  format: 'json'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
