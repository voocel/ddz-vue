<template>
  <div class="container">
    <el-container>
      <el-header height="120px">
        <Header :landlord-cards="landlordCards" />
      </el-header>
      <el-container>
        <el-aside width="24%">
          <div class="handcard-right">
            <HandCard :hand-cards="handCards['left']" direction="left" />
            <div :class="['left-tip', tip.left ? 'say' : 'none']">
              <span> {{ tip.left }} </span>
            </div>
          </div>
          <div class="user-left">
            <user ref="user" :coin="coin.left" :alarm-num="alarm['left']" direction="left" />
          </div>
        </el-aside>
        <el-main>
          <div class="left-outcard">
            <OutCard :out-card="outCards['left']" />
          </div>
          <div class="right-outcard">
            <OutCard :out-card="outCards['right']" />
          </div>
          <div class="mine-outcard">
            <OutCard :out-card="outCards['mine']" />
          </div>
        </el-main>
        <el-aside width="24%">
          <div class="handcard-left">
            <HandCard :hand-cards="handCards['right']" direction="right" />
            <div :class="['right-tip', tip.right ? 'say' : 'none']">
              <span> {{ tip.right }} </span>
            </div>
          </div>
          <div class="user-right">
            <user ref="user" :coin="coin.right" :alarm-num="alarm['right']" direction="right" />
          </div>
        </el-aside>
      </el-container>
      <el-footer height="290px">
        <div>
          <div class="mine">
            <div :class="['mine-tip', tip.mine ? 'say' : 'none']">
              <span> {{ tip.mine }} </span>
            </div>
            <div class="hand-card-mine">
              <Action direction="mine" :is-end="isEnd" @setAlarm="setAlarm" @play="callPlay" />
              <HandCard ref="handCard" :hand-cards="handCards['mine']" direction="mine" :open="true" size="big" />
            </div>
            <div class="user-mine">
              <user ref="user" :alarm-num="alarm['mine']" direction="mine" />
            </div>
          </div>
          <div class="bottom-bar">
            <div class="coin">
              <div class="coin-icon"><img width="26px" src="@/assets/images/coin.png"></div>
              <div class="coin-num">{{ coin.mine }}</div>
            </div>
            <div class="room-no">
              房间号: {{ roomNo }}
            </div>
          </div>
        </div>
      </el-footer>
    </el-container>
    <fade :special-type="specialType" :special="special" />
    <setting direction="room" />
    <div class="matching">
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="isMatching"
        :show-close="false"
        width="580px"
      >
        <img src="@/assets/images/match.png" alt="">
      </el-dialog>
    </div>
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
import tips from '@/utils/tips'
import { getDirection, getToken, getUserInfo, setRoomNo, getRoomNo } from '@/utils/auth'
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
      handCards: {
        mine: [
          // { label: '2', type: 'diamond', checked: false },
          // { label: '2', type: 'diamond', checked: false }
        ],
        left: [],
        right: []
      },
      outCards: {
        mine: [],
        left: [],
        right: []
      },
      isMatching: false,
      landlordCards: [],
      special: false,
      isEnd: false,
      specialType: 0,
      roomNo: 0,
      coin: {
        mine: 0,
        right: 0,
        left: 0
      },
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
        this.outCards['right'] = []
      }
      if (curUser === 'left') {
        this.outCards['left'] = []
      }
      if (curUser === 'mine') {
        this.outCards['mine'] = []
      }
    }
  },
  created() {
    const actions = {
      cmd: 'ddz/reConnect',
      param: { room_no: getRoomNo(), grade: 'simple' },
      access_token: getToken()
    }
    if (!this.$socket) {
      this.$connect()
      this.$options.sockets.onopen = () => {
        this.$socket.sendObj(actions)
        this.message()
      }
    } else {
      this.message()
    }
  },
  methods: {
    callPlay() {
      this.$refs.handCard.play()
    },
    message() {
      this.$options.sockets.onmessage = (response) => {
        const res = JSON.parse(response.data)
        console.log(res)
        if (res.code === 401 || res.code === 402) {
          tips.reLoginTip()
          return
        } else if (res.code === 400) {
          this.common.tip(res.message, 'warning')
          return
        }
        const data = res.data.result
        switch (res.data.type) {
          case 'match': {
            this.isMatching = true
            this.isEnd = false
            break
          }
          case 'room_info':
            this.isMatching = false
            setRoomNo(data.room_info.room_no)
            this.roomInfo(data)
            break
          case 'deal':
            console.log('发牌了')
            this.curCard = data.player_hand_cards.reverse()
            this.handCards['mine'] = []
            this.handCards['left'] = []
            this.handCards['right'] = []
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
            this.isEnd = true
            this.$store.commit('user/setStartState', false)
            this.$store.commit('user/resetReady')
            this.$store.commit('user/setCanPlay', false)
            break
          default:
            break
        }
      }
    },
    roomInfo(data) {
      // console.log(data)
      this.roomNo = data.room_info.room_no
      const playerInfo = data.player_info
      if (playerInfo) {
        playerInfo.forEach((item) => {
          this.setPlayer(item)
          this.$store.commit('user/setReady', [item['uid'], item['is_ready']])
        })
      }
      if (data.player_hand_cards) {
        this.handCards['mine'] = this.common.batchFormatCards(data.player_hand_cards)
        this.$store.commit('user/setStartState', true)
        this.$store.commit('user/setCanPlay', true)
        const curUser = getDirection(data.cur_out_card_player_seat_uid)
        this.$store.commit('user/setCurUser', curUser)
      }
      if (data.remain_card) {
        this.landlordCards = this.common.batchFormatCards(data.remain_card)
      }
    },
    setPlayer(data) {
      const seatMap = this.$store.state.user.seatMap
      const players = this.$store.state.user.players

      if (data.uid !== getUserInfo().uid) {
        if (Object.prototype.hasOwnProperty.call(seatMap, 'mine')) {
          if (Object.prototype.hasOwnProperty.call(seatMap, 'right')) {
            seatMap.left = data.uid
            players.left = data
            this.coin.left = data.coin
          } else {
            seatMap.right = data.uid
            players.right = data
            this.coin.right = data.coin
          }
        } else {
          if (Object.prototype.hasOwnProperty.call(seatMap, 'right')) {
            seatMap.left = data.uid
            players.left = data
            this.coin.left = data.coin
          } else {
            seatMap.right = data.uid
            players.right = data
            this.coin.right = data.coin
          }
        }
      } else {
        seatMap.mine = data.uid
        players.mine = data
        this.meSeatno = data.seat_no
        this.coin.mine = data.coin
      }
      this.$store.commit('user/setPlayers', players)
      this.$store.commit('user/setSeatMap', seatMap)
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
      const curUser = getDirection(data.cbCard_uid)
      this._addHistoryCard(data.cbCard, curUser)
      if (curUser === 'mine') {
        next = 'right'
      } else if (curUser === 'left') {
        next = 'mine'
      } else {
        next = 'left'
      }
      this.$store.commit('user/setCurUser', next)
    },
    showPass(data) {
      let next = ''
      const curUser = getDirection(data.cbCard_uid)
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
    setAlarm(curPoint, curUid, nextUid, type) {
      let next = ''
      const seatMap = this.$store.state.user.seatMap
      if (curPoint === 0) {
        this.tip[getDirection(curUid)] = type === 'call' ? '不叫' : '不抢'
      }
      if (nextUid !== '') {
        const curUser = getDirection(nextUid)
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
          this.tip[getDirection(curUid)] = ''
        }, 1000)
      }
      setTimeout(() => {
        this.tip[getDirection(curUid)] = ''
      }, 1000)
    },
    _add(ccard) {
      this.handCards['mine'].push(this.common.formatCard(ccard))
      // TODO 其他两家的牌处理
      this.handCards['left'].push(this.common.formatCard(ccard))
      this.handCards['right'].push(this.common.formatCard(ccard))
    },
    _addLandlordCards(uid, remainCards) {
      const curUser = getDirection(uid)
      // 顶部显示地主牌
      this.landlordCards = this.common.batchFormatCards(remainCards)
      // 给手牌加上地主牌  TODO 其他两家的牌处理
      this.handCards[curUser] = [...this.handCards[curUser], ...this.common.batchFormatCards(remainCards)]
      this.handCards['mine'] = poker.sortCrad(this.handCards['mine'])
    },
    _addHistoryCard(cbCard, type) {
      this.outCards[type] = this.common.batchFormatCards(cbCard)
      // 同时从手牌删除
      if (type === 'mine') {
        this.outCards['mine'].forEach(h => {
          this.handCards['mine'].splice(
            this.handCards['mine'].findIndex(
              n => n.label === h.label && n.type === h.type
            ),
            1
          )
        })
      } else {
        this.outCards[type].forEach(() => {
          this.handCards[type].splice(0, 1)
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

<style scoped lang="scss">
::v-deep .matching .el-dialog{
  opacity:0.9;
  border-radius: 50%;
}
.container {
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  background-image: url('../../assets/images/desk.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  width: 100%;
}
.el-header {
  // background-color: #B3C0D1;
  color: #333;
  text-align: center;
}
.el-footer {
  // background-color: #B3C0D1;
  color: #333;
  text-align: center;
  padding: 0;
}
.el-aside {
  // background-color: #D3DCE6;
  color: #333;
  text-align: center;
}
.el-main {
  // background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: calc(100vh - 410px);
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
  bottom: 290px;
  left: 46%;
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
.user-mine {
  position: absolute;
  left: 3%;
  // bottom: 8%;
}
.mine {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;
}
.bottom-bar {
  height: 50px;
  background-color:rgba(0,0,0,0.2);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .coin {
    color: rgb(252, 195, 38);
    font-size: 14px;
    background: rgba(131, 131, 131, 0.6);
    height: 24px;
    line-height: 24px;
    width: 86px;
    border-radius: 10px;
    .coin-icon {
      float: left;
      padding-top: 5px;
      padding-left: 3px;
    }
    .coin-num {
      float: left;
      padding-left: 3px;
    }
  }
  .room-no {
    color: #fa6673;
    margin-left: 20px;
  }
}
</style>
