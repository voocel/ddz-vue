const HANDLER = '_vue_touchendouside_handler'
const EVENT_MOBILE = 'touchend'
const EVENT_PC = 'mouseup'
export default {
  /*
   @param el 指令所绑定的元素
   @param binding {Object}
   @param vnode vue编译生成的虚拟节点
   */
  bind (el, binding, vnode) {
    const documentHandler = function (e) {
    //   if(!vnode.context ||  e.target.className != 'main-bottom') {
      if (!vnode.context) {
        return false
      }
      let bMobile = navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)
      if (bMobile && e.type === EVENT_PC) {
        return false
      } else if (!bMobile && e.type === EVENT_MOBILE) {
        return false
      }
      if (binding.expression) {
        vnode.context[el[HANDLER].methodName](e)
      } else {
        el[HANDLER].bindingFn(e)
      }
    }
    el[HANDLER] = {
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    }
    setTimeout(() => {
      document.addEventListener(EVENT_MOBILE, documentHandler, false)
      document.addEventListener(EVENT_PC, documentHandler, false)
    }, 0)
  },
  update (el, binding) {
    el[HANDLER].methodName = binding.expression
    el[HANDLER].bindingFn = binding.value
  },
  unbind (el) {
    document.removeEventListener(EVENT_MOBILE, el[HANDLER].documentHandler, false)
    document.removeEventListener(EVENT_PC, el[HANDLER].documentHandler, false)
  }
}
