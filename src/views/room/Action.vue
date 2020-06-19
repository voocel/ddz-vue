<template>
  <div class="container">
    <div v-show="!startState">
      <el-button type="success" round @click.native="action('ready')">{{
        isreadyMe ? "已准备" : "准备"
      }}</el-button>
    </div>
    <div v-show="startState && isCanPlay && curUser === 'mine'">
      <el-button type="success" round @click="action('pass')">不出</el-button>
      <el-button v-if="curUser === 'mine'" type="success" round @click="play">出牌</el-button>
      <el-button v-else type="success" round style="background-color: #999;">出牌</el-button>
    </div>
    <div v-show="showCall">
      <el-button type="success" round @click="action('call', 0)">不叫</el-button>
      <el-button type="success" round @click="action('call', 1)">叫地主</el-button>
    </div>
    <div v-show="showRob">
      <el-button type="success" round @click="action('rob', 1)">抢地主</el-button>
      <el-button type="success" round @click="action('rob', 0)">不抢</el-button>
    </div>
  </div>
</template>

<script>
import { getTokenByUid, getToken } from '@/utils/auth'
export default {
  name: 'Action',
  props: {
    direction: {
      type: String,
      default: 'left'
    },
    roomNo: {
      type: Number,
      default: 0
    },
    special: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCanPlay: false
    }
  },
  computed: {
    curUser() {
      return this.$store.state.user.curUser
    },
    isreadyMe() {
      return this.$store.state.user.isready['mine']
    },
    showCall() {
      return this.$store.state.user.showCall
    },
    showRob() {
      return this.$store.state.user.showRob
    },
    startState() {
      return this.$store.state.user.startState
    },
    handCard() {
      return this.$store.state.user.handCard
    }
  },
  created() {
    this.$options.sockets.onmessage = (response) => {
      const res = JSON.parse(response.data)
      if (res.code === 400) return
      const data = res.data.result
      switch (res.data.type) {
        case 'ready': {
          const seatMap = JSON.parse(sessionStorage.seat_map)
          for (const key in seatMap) {
            if (key === 'mine' && seatMap[key] === data.uid) {
              console.log('ready..')
              this.$store.commit('user/setReady', ['mine', true])
            } else if (key === 'left' && seatMap[key] === data.uid) {
              this.$store.commit('user/setReady', ['left', true])
            } else if (key === 'right' && seatMap[key] === data.uid) {
              this.$store.commit('user/setReady', ['right', true])
            }
          }
          break
        }
        case 'call': {
          const curCallUid = data.cur_call_uid // 当前发送叫或不叫地主消息的玩家
          const nextCallUid = data.next_call_uid // 下一个该叫地主的玩家 如果该值为空这表明叫地主一轮结束了,没有下一个了
          const curUser = getTokenByUid(nextCallUid)
          this.$store.commit('user/setCurUser', curUser)
          this.$emit('setAlarm', data.cur_call_point, curCallUid, nextCallUid, 'call')
          break
        }
        case 'rob': {
          const curRobUid = data.cur_rob_uid
          const nextRobUid = data.next_rob_uid
          this.$store.commit('user/setRob', true)
          this.$emit('setAlarm', data.cur_rob_point, curRobUid, nextRobUid, 'rob')
          break
        }
        case 'is_can_play': {
          const curUser = getTokenByUid(data.cur_uid)
          this.$store.commit('user/setCurUser', curUser)
          this.$store.commit('user/setCall', false)
          this.$store.commit('user/setRob', false)
          this.isCanPlay = true
          break
        }
        default:
          break
      }
    }
  },
  methods: {
    action(type, point) {
      let actions = ''
      switch (type) {
        case 'ready':
        case 'pass':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: this.roomNo, grade: 'simple' },
            access_token: getToken()
          }
          break
        case 'call':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: this.roomNo, grade: 'simple', point: point },
            access_token: getToken()
          }
          break
        case 'rob':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: this.roomNo, grade: 'simple', point: point },
            access_token: getToken()
          }
          this.$store.commit('user/setRob', true)
          break
      }
      this.$socket.sendObj(actions)
    },
    play() {
      this.$emit('play')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  float: left;
  padding-left: 50px;
}
</style>
