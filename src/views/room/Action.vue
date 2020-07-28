<template>
  <div class="action">
    <div v-show="!startState">
      <!-- <img v-if="!isreadyMe" width="100px" src="@/assets/images/button/start.png" @click="action('ready')">
      <img v-if="!isreadyMe" width="100px" src="@/assets/images/button/start.png" @click="action('ready')"> -->
      <el-button v-if="isEnd" type="warning" round @click="action('changeTable', 0)">换桌</el-button>
      <el-button v-if="!isreadyMe" type="success" round @click="action('ready', 1)">准备</el-button>
    </div>
    <div v-show="startState && isCanPlay && curUser === 'mine'">
      <img width="100px" src="@/assets/images/button/pass.png" @click="action('pass')">
      <img width="100px" src="@/assets/images/button/tip.png">
      <img width="100px" src="@/assets/images/button/play.png" @click="play">
    </div>
    <div v-show="showCall">
      <el-button type="success" round @click="action('call', 0)">不叫</el-button>
      <el-button type="success" round @click="action('call', 1)">叫地主</el-button>
    </div>
    <div v-show="showRob">
      <el-button type="success" round @click="action('rob', 1)">抢地主</el-button>
      <el-button type="success" round @click="action('rob', 0)">不抢</el-button>
    </div>
    <music ref="music" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDirection, getToken, getRoomNo, setRoomNo } from '@/utils/auth'
import Music from './Music'
export default {
  name: 'Action',
  components: { Music },
  props: {
    direction: {
      type: String,
      default: 'left'
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    special: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      curUser: state => state.user.curUser,
      isreadyMe: state => state.user.isreadyMe['mine'],
      isCanPlay: state => state.user.isCanPlay,
      showCall: state => state.user.showCall,
      showRob: state => state.user.showRob,
      startState: state => state.user.startState,
      handCard: state => state.user.handCard
    }),
    isreadyMe() {
      return this.$store.state.user.isready['mine']
    }
  },
  created() {
    this.$options.sockets.onmessage = (response) => {
      const res = JSON.parse(response.data)
      if (res.code === 400) return
      const data = res.data.result
      switch (res.data.type) {
        case 'ready': {
          // this.$refs.music.play('bg_room1')
          this.$store.commit('user/setReady', [data.uid, 1])
          break
        }
        case 'call': {
          const curCallUid = data.cur_call_uid // 当前发送叫或不叫地主消息的玩家
          const nextCallUid = data.next_call_uid // 下一个该叫地主的玩家 如果该值为空这表明叫地主一轮结束了,没有下一个了
          const curUser = getDirection(nextCallUid)
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
          const curUser = getDirection(data.cur_uid)
          this.$store.commit('user/setCurUser', curUser)
          this.$store.commit('user/setCall', false)
          this.$store.commit('user/setRob', false)
          this.$store.commit('user/setCanPlay', true)
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
            param: { room_no: getRoomNo(), grade: 'simple' },
            access_token: getToken()
          }
          break
        case 'call':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: getRoomNo(), grade: 'simple', point: point },
            access_token: getToken()
          }
          break
        case 'rob':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: getRoomNo(), grade: 'simple', point: point },
            access_token: getToken()
          }
          this.$store.commit('user/setRob', true)
          break
        case 'changeTable':
          actions = {
            cmd: 'ddz/' + type,
            param: { room_no: getRoomNo(), grade: 'simple' },
            access_token: getToken()
          }
          setRoomNo(0)
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
.action {
  height: 65px;
  img:hover {
    cursor: pointer;
  }
}
</style>
