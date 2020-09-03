import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/hall',
    name: 'Hall',
    component: () => import('@/views/hall/Hall'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import('@/views/room/Room'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/* 重写路由的push方法 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject)
  return routerPush.call(this, location).catch(error => error)
}

export default router
