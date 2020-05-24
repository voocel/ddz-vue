import Vue from 'vue'
import VueRouter from 'vue-router'
import Hall from '@/views/hall/Hall'
import Room from '@/views/room/Room'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Hall',
    component: Hall,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: Room,
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
