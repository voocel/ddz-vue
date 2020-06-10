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

export default router
