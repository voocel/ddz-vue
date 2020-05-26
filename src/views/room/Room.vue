<template>
  <div class="container">
    <el-container>
      <el-header height="10vh">Header</el-header>
      <el-container>
        <el-aside width="20%">
          <el-row>
            <el-col :span="12">
              <user ref="user" :alarm-num="alarm['left']" direction="left" />
            </el-col>
            <el-col :span="8">
              <HandCard :hand-cards="cardsLeft" direction="left" />
              <!-- <OutCard :out-card="outcardLeft" /> -->
              <div :class="['left-msg', tip.left ? 'say' : 'none']">
                <span> {{ tip.left }} </span>
              </div>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <div class="left-outcard">
            <OutCard :out-card="outcardLeft" />
          </div>
          <div class="right-outcard">
            <OutCard :out-card="outcardRight" />
          </div>
          <div class="mine-outcard">
            <OutCard :out-card="outcardMine" />
          </div>
        </el-main>
        <el-aside width="20%">
          <el-row>
            <el-col :span="8">
              <HandCard :hand-cards="cardsRight" direction="right" />
              <!-- <OutCard :out-card="outcardRight" /> -->
              <div :class="['right-msg', tip.right ? 'say' : 'none']">
                <span> {{ tip.right }} </span>
              </div>
            </el-col>
            <el-col :span="12">
              <user ref="user" :alarm-num="alarm['right']" direction="right" />
            </el-col>
          </el-row>
        </el-aside>
      </el-container>
      <el-footer height="30vh">
        <el-row>
          <el-col :span="4">
            <user ref="user" :alarm-num="alarm['mine']" direction="mine" />
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col :span="8">
                <div style="width:200px;height:60px">
                  .
                </div>
                <div :class="['mine-msg', tip.mine ? 'say' : 'none']">
                  <span> {{ tip.mine }} </span>
                </div>
              </el-col>
              <el-col :span="16">
                <Action direction="mine" @setAlarm="setAlarm" @play="play" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <!-- <el-button type="success" round @click="action">不抢</el-button> -->
                <HandCard ref="handCard" :hand-cards="cardsMine" direction="mine" :open="true" size="big" />
              </el-col>
            </el-row>
            <!-- <el-row style="background:skyblue;">
              <div style="line-height:46px">1</div>
            </el-row> -->
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <fade :special-type="specialType" :special="special" />
    <setting />
  </div>
</template>

<script>
import User from './User'
import HandCard from './HandCard'
import OutCard from './OutCard'
import Action from './Action'
import Fade from './Fade'
import Setting from './Setting'
import auth from '@/utils/auth'
export default {
  name: 'Room',
  components: {
    User,
    HandCard,
    OutCard,
    Action,
    Setting,
    Fade
  },
  data() {
    return {
      curCard: [],
      cardsMine: [],
      cardsLeft: [],
      cardsRight: [],
      outcardMine: [
        // { type: 'heart', checked: true, label: 3 },
        // { type: 'heart', checked: true, label: 4 },
        // { type: 'heart', checked: true, label: 5 }
      ],
      outcardLeft: [
        // { type: 'heart', checked: true, label: 3 },
        // { type: 'heart', checked: true, label: 4 },
        // { type: 'heart', checked: true, label: 5 }
      ],
      outcardRight: [
        // { type: 'heart', checked: true, label: 3 },
        // { type: 'heart', checked: true, label: 4 },
        // { type: 'heart', checked: true, label: 5 }
      ],
      special: false,
      specialType: 0,
      types: {
        '1': 'heart',
        '2': 'spade',
        '3': 'diamond',
        '4': 'club'
      },
      clock: 0,
      alarm: {
        mine: 0,
        right: 0,
        left: 0
      },
      tip: {
        mine: '1',
        right: '2',
        left: '3'
      }
    }
  },
  computed: {
    curUser() {
      return this.$store.state.user.curUser
    }
  },
  watch: {
    curUser(curUser) {
      console.log(curUser)
      if (curUser === 'right') {
        this.outcardRight = []
      }
      if (curUser === 'left') {
        this.outcardLeft = []
      }
      if (curUser === 'mine') {
        this.outcardMine = []
      }
    }
  },
  created() {
    const actions = {
      cmd: 'ddz/enterRoom',
      param: { room_no: 1000, grade: 'simple' },
      access_token: '123'
    }
    setTimeout(() => {
      this.$socket.sendObj(actions)
    }, 1000)
    this.message()
  },
  methods: {
    play() {
      this.$refs.handCard.play()
    },
    setAlarm(curPoint, curUid, nextUid, type) {
      let next = ''
      const seatMap = JSON.parse(sessionStorage.seat_map)
      if (curPoint === 0) {
        this.tip[auth.getTokenByUid(curUid)] = type === 'call' ? '不叫' : '不抢'
      }
      if (nextUid !== '') {
        const curUser = auth.getTokenByUid(nextUid)
        this.$store.commit('user/setCurUser', curUser)
        if (nextUid === seatMap.mine) {
          this.$store.commit('user/setCall', true)
          next = 'right'
          this.alarm['left'] = 0
        } else if (nextUid === seatMap.right) {
          this.$store.commit('user/setCall', false)
          this.$store.commit('user/setRob', false)
          next = 'left'
          this.alarm['mine'] = 0
        } else {
          this.$store.commit('user/setCall', false)
          this.$store.commit('user/setRob', false)
          next = 'mine'
          this.alarm['right'] = 0
        }
        this.alarm[curUser] = 10
        clearInterval(this.clock)
        this.clock = setInterval(() => {
          this.alarm[curUser]--
        }, 1000)
        this.$store.commit('user/setCurUser', next)
      } else {
        // 要重新发牌了,清空上局残留的闹钟
        this.alarm['mine'] = 0
        this.alarm['left'] = 0
        this.alarm['right'] = 0
        setTimeout(() => {
          this.tip[auth.getTokenByUid(curUid)] = ''
        }, 1000)
      }
      setTimeout(() => {
        this.tip[auth.getTokenByUid(curUid)] = ''
      }, 1000)
    },
    message() {
      this.$options.sockets.onmessage = (response) => {
        const res = JSON.parse(response.data)
        if (res.code === 400) {
          this.common.tip(res.message, 'warning')
          return
        }
        const data = res.data.result
        switch (res.data.type) {
          case 'room_info':

            break
          case 'player_info': {
            let playerInfo = []
            if (sessionStorage.player_info !== undefined) {
              playerInfo = JSON.parse(sessionStorage.player_info)
            }
            var isInRoom = false
            for (let i = 0; i < playerInfo.length; i++) {
              if (playerInfo[i].uid === data.uid) {
                isInRoom = true
                playerInfo.splice(i, 1, data)
              }
            }
            if (!isInRoom) playerInfo.push(data)

            sessionStorage.player_info = JSON.stringify(playerInfo)
            let seatMap = {}
            if (sessionStorage.seat_map !== undefined) {
              seatMap = JSON.parse(sessionStorage.seat_map)
            }
            if (data.uid !== 1) {
              if (
                data.seat_no === this.meSeatno + 1 ||
                data.seat_no === this.meSeatno - 2
              ) {
                seatMap.right = data.uid
                this.$store.commit('user/setNickname', ['right', data.nickname])
              } else {
                seatMap.left = data.uid
                this.$store.commit('user/setNickname', ['left', data.nickname])
              }
            } else {
              seatMap.mine = data.uid
              this.meSeatno = data.seat_no
              this.$store.commit('user/setNickname', ['mine', data.nickname])
            }
            sessionStorage.seat_map = JSON.stringify(seatMap)
            break
          }
          case 'deal':
            console.log('发牌了')
            this.curCard = data.player_hand_cards.reverse()
            this.cardsMine = []
            this.cardsLeft = []
            this.cardsRight = []
            this.$store.commit('user/setStartState', true)
            this.deal()
            break
          case 'play':
            this.showCard(data)
            break
          case 'pass':
            this.showPass(data)
            break
          default:
            break
        }
      }
    },
    deal() {
      const ccard = this.curCard.pop()
      this._add(ccard)
      if (this.curCard.length > 0) {
        setTimeout(() => {
          this.deal()
        }, 100)
      }
    },
    showCard(data) {
      let next = ''
      const curUser = auth.getTokenByUid(data.cbCard_uid)
      const cbCard = data.cbCard
      if (curUser === 'mine') {
        next = 'right'
        this._addHistoryCard(cbCard, this.outcardMine, this.cardsMine, 'mine')
      } else if (curUser === 'left') {
        next = 'mine'
        this._addHistoryCard(cbCard, this.outcardLeft, this.cardsLeft, 'left')
      } else {
        next = 'left'
        this._addHistoryCard(cbCard, this.outcardRight, this.cardsRight, 'right')
      }
      this.$store.commit('user/setCurUser', next)
    },
    showPass(data) {
      let next = ''
      // const seatMap = JSON.parse(sessionStorage.seat_map)
      // for (const index in seatMap) {
      //   if (seatMap[index] === data.cbCard_uid) {
      //     this.$store.commit('user/setCurUser', index)
      //   }
      // }
      //
      const curUser = auth.getTokenByUid(data.cbCard_uid)
      this.tip[curUser] = '要不起'
      if (curUser === 'mine') {
        next = 'right'
        setTimeout(() => {
          this.tip['mine'] = ''
        }, 1000)
      } else if (curUser === 'left') {
        next = 'mine'
        setTimeout(() => {
          this.tip['left'] = ''
        }, 1000)
      } else {
        next = 'left'
        setTimeout(() => {
          this.tip['right'] = ''
        }, 1000)
      }
      this.$store.commit('user/setCurUser', next)
    },
    _add(ccard) {
      const tmp = ccard.split('x')
      this.cardsMine.push({
        label: tmp[0],
        type: this.types[tmp[1]],
        checked: false
      })
      this.cardsLeft.push({
        label: tmp[0],
        type: this.types[tmp[1]],
        checked: false
      })
      this.cardsRight.push({
        label: tmp[0],
        type: this.types[tmp[1]],
        checked: false
      })
    },
    _addHistoryCard(data, history, handCards, type) {
      data.forEach(h => {
        const tmp = h.split('x')
        history.push({
          label: tmp[0],
          type: this.types[tmp[1]],
          checked: true
        })
      })
      console.log(history)
      // 同时从手牌删除
      if (type === 'mine') {
        this.outcardMine.forEach(h => {
          this.cardsMine.splice(
            this.cardsMine.findIndex(
              n => n.label === h.label && n.type === h.type
            ),
            1
          )
        })
        console.log(this.outcardMine)
      } else {
        history.forEach(() => {
          handCards.splice(0, 1)
        })
      }
    }
  }
}
</script>

<style  scoped>
.container {
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
}
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: 60vh;
}
.left-msg {
  left: 20%;
  top: 30%;
  height: 50px;
  line-height: 50px;
}
.right-msg {
  justify-content: flex-end;
  top: 30%;
  right: 20%;
  height: 50px;
  line-height: 50px;
}
.mine-msg {
  justify-content: flex-end;
  top: 65%;
  left: 45%;
  line-height: 50px;
}
.say {
  position: fixed;
  width: 150px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  margin: 0 auto;
  color: #fff;
}
.mine-outcard {
  position: absolute;
  left: 46%;
  top: 60%;
}
.left-outcard {
  position: absolute;
  left: 20%;
  top: 26%;
}
.right-outcard {
  position: absolute;
  right: 20%;
  top: 26%;
}
</style>
