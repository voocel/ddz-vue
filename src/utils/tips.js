import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'

const tips = {
  reLoginTip() {
    MessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录111',
      '系统提示', {
        confirmButtonText: '重新登陆',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }).catch(() => {})
  },

  msgTip(msg = 'ok', type = 'success', duration = 3000) {
    Message({
      showClose: true,
      message: msg,
      duration: duration,
      type: type
    })
  }

}
export default tips
