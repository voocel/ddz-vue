import Vue from 'vue'
import Router from 'vue-router'
import Hall from '@/views/hall/Hall'
import Room from '@/views/room/Room'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hall',
      component: Hall,
      meta: {requiresAuth: false},
    },
    {
      path: '/room',
      name: 'Room',
      component: Room,
      meta: {requiresAuth: true},
    }
  ]
})
