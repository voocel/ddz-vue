// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import auth from '@/utils/auth'

Vue.use(ElementUI);
Vue.config.productionTip = false

//导航守卫
router.beforeEach(async (to,from,next)=>{
  if(to.meta.requiresAuth === false){
    next()
  }else{
    if(!auth.getToken()){
      this.$message.error('请先登陆~')
      next({path: '/'})
    }else {
      next()
    }
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
