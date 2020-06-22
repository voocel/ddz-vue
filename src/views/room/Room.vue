<template>
  <div class="container">
    <el-container>
      <el-header height="10vh">
        <Header :landlord-cards="landlordCards" />
      </el-header>
      <el-container>
        <el-aside width="20%">
          <div class="handcard-right">
            <HandCard :hand-cards="cardsLeft" direction="left" />
            <div :class="['left-tip', tip.left ? 'say' : 'none']">
              <span> {{ tip.left }} </span>
            </div>
          </div>
          <div class="user-left">
            <user ref="user" :alarm-num="alarm['left']" direction="left" />
          </div>
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
          <div class="handcard-left">
            <HandCard :hand-cards="cardsRight" direction="right" />
            <div :class="['right-tip', tip.right ? 'say' : 'none']">
              <span> {{ tip.right }} </span>
            </div>
          </div>
          <div class="user-right">
            <user ref="user" :alarm-num="alarm['right']" direction="right" />
          </div>
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
                <div :class="['mine-tip', tip.mine ? 'say' : 'none']">
                  <span> {{ tip.mine }} </span>
                </div>
              </el-col>
              <el-col :span="16">
                <Action direction="mine" :room-no="roomNo" @setAlarm="setAlarm" @play="play" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <HandCard ref="handCard" :room-no="roomNo" :hand-cards="cardsMine" direction="mine" :open="true" size="big" />
              </el-col>
            </el-row>
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
import Header from './Header'
import OutCard from './OutCard'
import Action from './Action'
import Fade from './Fade'
import Setting from './Setting'
import poker from '@/utils/poker'
import { getTokenByUid, getToken } from '@/utils/auth'
export default {
  name: 'Room',
  components: {
    User,
    Header,
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
      outcardMine: [],
      outcardLeft: [],
      outcardRight: [],
      landlordCards: [],
      special: false,
      specialType: 0,
      roomNo: 0,
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
        mine: '',
        right: '',
        left: ''
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
    this.roomNo = Number(this.$route.query.room_no)
    if (String(this.roomNo).length !== 6 || !Number.isInteger(this.roomNo) || this.roomNo === 0) {
      this.$confirm('房间号异常,请返回大厅重新进入', '系统提示', {
        confirmButtonText: '返回大厅',
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.push('/hall')
      })
      return
    }
    const actions = {
      cmd: 'ddz/enterRoom',
      param: { room_no: this.roomNo, grade: 'simple' },
      access_token: getToken()
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
        this.tip[getTokenByUid(curUid)] = type === 'call' ? '不叫' : '不抢'
      }
      if (nextUid !== '') {
        const curUser = getTokenByUid(nextUid)
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
          this.tip[getTokenByUid(curUid)] = ''
        }, 1000)
      }
      setTimeout(() => {
        this.tip[getTokenByUid(curUid)] = ''
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
          case 'player_info':
            this.playerInfo(data)
            break
          case 'deal':
            console.log('发牌了')
            this.curCard = data.player_hand_cards.reverse()
            this.cardsMine = []
            this.cardsLeft = []
            this.cardsRight = []
            this.$store.commit('user/setStartState', true)
            this.deal()
            break
          case 'is_can_play':
            this._addLandlordCards(data.cur_uid, data.remain_card)
            break
          case 'play':
            this.showCard(data)
            break
          case 'pass':
            this.showPass(data)
            break
          case 'end':
            console.log('本局结束')
            console.log(data)
            this.showSpecial(1)
            this.$store.commit('user/setStartState', false)
            this.$store.commit('user/resetReady')
            this.$store.commit('user/setCanPlay', false)
            break
          default:
            break
        }
      }
    },
    playerInfo(data) {
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
      const curUser = getTokenByUid(data.cbCard_uid)
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
      const curUser = getTokenByUid(data.cbCard_uid)
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
    _addLandlordCards(uid, remainCards) {
      const curUser = getTokenByUid(uid)
      remainCards.forEach(h => {
        const tmp = h.split('x')
        this.landlordCards.push({
          label: tmp[0],
          type: this.types[tmp[1]],
          checked: false
        })
        if (curUser === 'mine') {
          this.cardsMine.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        } else if (curUser === 'right') {
          this.cardsRight.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        } else {
          this.cardsLeft.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        }
      })
      this.cardsMine = poker.sortCrad(this.cardsMine)
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
      } else {
        history.forEach(() => {
          handCards.splice(0, 1)
        })
      }
    },
    showSpecial(specialType) {
      this.specialType = specialType
      this.special = true
      setTimeout(() => {
        this.special = false
      }, 2000)
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
.left-tip {
  top: 30%;
  left: 20%;
}
.right-tip {
  top: 30%;
  right: 20%;
}
.mine-tip {
  top: 65%;
  left: 45%;
}
.say {
  position: fixed;
  justify-content: flex-end;
  width: 150px;
  line-height: 50px;
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
.handcard-left {
  float: left;
  width: 60%;
}
.user-left {
  float: right;
}
.handcard-right {
  float: right;
  width: 60%;
}
.user-right {
  float: left;
}
</style>
