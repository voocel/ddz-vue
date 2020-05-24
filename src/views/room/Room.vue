<template>
  <div class="desk" :style="{ height: fullHeight + 'px' }">
    <div class="main">
      <div class="main-top">
        <div class="main-top-left">
          <div v-show="this.$store.state.startState" class="card-recorder">
            <span>{{ cardsLeft.length }}</span>
          </div>
          <!-- 已出牌区域 左边-->
          <div class="cards history">
            <card
              v-for="(item, i) in historyLeft"
              :key="i"
              class="card small"
              size="small"
              :value="item.label"
              :type="item.type"
            />
          </div>
          <div :class="['msg', message.left ? 'say' : 'none']">
            <span>{{ message.left }}</span>
          </div>
          <div class="cards other cards-margin-left">
            <card
              v-for="(item, i) in cardsLeft"
              :key="i"
              class="card small"
              :open="open"
              size="small"
              :style="{ 'margin-top': item.checked ? '-20px' : '0px' }"
              :value="item.label"
              :type="item.type"
              @click.native="changed(item)"
            />
            <div class="clear" />
          </div>

          <uinfo :alarm="alarm.left" type="left" />
        </div>
        <div class="main-top-right">
          <div v-show="this.$store.state.startState" class="card-recorder">
            <span>{{ cardsRight.length }}</span>
          </div>
          <!-- 已出牌区域 右边-->
          <div class="cards history">
            <card
              v-for="(item, i) in historyRight"
              :key="i"
              class="card small"
              size="small"
              :value="item.label"
              :type="item.type"
            />
          </div>
          <div :class="['msg', message.right ? 'say' : 'none']">
            <span>{{ message.right }}</span>
          </div>
          <div class="cards other cards-margin-right">
            <card
              v-for="(item, i) in cardsRight"
              :key="i"
              class="card small"
              :open="open"
              size="small"
              :style="{ 'margin-top': item.checked ? '-20px' : '0px' }"
              :value="item.label"
              :type="item.type"
              @click.native="changed(item)"
            />
            <div class="clear" />
          </div>

          <uinfo :alarm="alarm.right" type="right" />
        </div>
      </div>
      <div class="main-bottom">
        <uinfo :alarm="alarm.me" type="me" />

        <!-- 已出牌区域 自己-->
        <div class="cards history">
          <card
            v-for="(item, i) in historyMe"
            :key="i"
            class="card small"
            size="small"
            :value="item.label"
            :type="item.type"
          />
        </div>
        <div :class="['msg', message.me ? 'say' : 'none']">
          <span>{{ message.me }}</span>
        </div>
        <play-button
          :special="special"
          :is-can-play="isCanPlay"
          :token="token"
          :show-call="showCall"
          :show-rob="showRob"
          @childSend="childSend"
          @play="play"
        />
        <div v-clickoutside="putdownAllCards" class="cards cards-height">
          <card
            v-for="(item, i) in cardsMe"
            :key="i"
            class="card big"
            :style="{
              transform: item.checked ? 'translate3d(0, -40px, 0)' : '',
              transition: item.checked
                ? 'transform 0.08s linear 0s'
                : 'transform 0.18s linear 0s'
            }"
            :value="item.label"
            :type="item.type"
            @mousemove.native.stop="mousemove(item)"
            @mouseup.native.stop="mouseup(item)"
            @mousedown.native.stop="mousedown(item)"
            @click.native.stop="changed(item)"
          />
          <div class="clear" />
        </div>
      </div>
    </div>

    <fade :special-type="specialType" :special="special" />
    <setting />
  </div>
</template>

<script>
import card from './components/Card'
import uinfo from './components/Uinfo'
import setting from './components/Setting'
import playButton from './components/PlayButton'
import fade from './components/Fade'
import poker from '@/utils/poker'
import auth from '@/utils/auth'
import clickoutside from '@/directive/clickoutside'

export default {
  name: 'Room',
  components: {
    card,
    uinfo,
    setting,
    fade,
    playButton
  },
  directives: { clickoutside },
  data() {
    return {
      websocket: null,
      first: false,
      moveChange: false,
      clickLock: false,
      open: false,
      special: false,
      showCall: false,
      showRob: false,
      isCanPlay: false,
      specialType: 0,
      fullHeight: document.documentElement.clientHeight,
      token: 'me', // me, right, left
      cardsMe: [],
      cardsLeft: [],
      cardsRight: [],
      historyMe: [],
      historyLeft: [],
      historyRight: [],
      message: {
        me: '',
        right: '',
        left: ''
      },
      alarm: {
        me: '',
        right: '',
        left: ''
      },
      types: {
        '1': 'heart',
        '2': 'spade',
        '3': 'diamond',
        '4': 'club'
      },
      curCard: [],
      meSeatno: '',
      clock: 0,
      landlordUid: ''
    }
  },
  computed: {},
  watch: {
    token(token) {
      if (token === 'right') {
        this.historyRight = []
        setTimeout(() => {
          this.message.left = ''
        }, 2000)
      }
      if (token === 'left') {
        this.historyLeft = []
        setTimeout(() => {
          this.message.me = ''
        }, 2000)
      }
      if (token === 'me') {
        this.historyMe = []
        setTimeout(() => {
          this.message.right = ''
        }, 2000)
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.initWebSocket()
  },
  destroyed() {
    this.websocket.close() // 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      // 初始化weosocket
      const wsurl =
        'ws://' +
        process.env.VUE_APP_SOCKET_URL +
        ':' +
        process.env.VUE_APP_SOCKET_PORT
      this.websocket = new WebSocket(wsurl)
      this.websocket.onmessage = this.onMessage
      this.websocket.onopen = this.onOpen
      this.websocket.onerror = this.onError
      this.websocket.onclose = this.onClose
    },
    onOpen() {
      const actions = {
        cmd: 'ddz/enterRoom',
        param: { room_no: 1000, grade: 'simple' },
        access_token: '123'
      }
      this.wsSend(JSON.stringify(actions))
    },
    onError() {
      this.initWebSocket()
    },
    onMessage(e) {
      const res = JSON.parse(e.data)

      if (res.code === 200) {
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
              seatMap.me = data.uid
              this.meSeatno = data.seat_no
              this.$store.commit('user/setNickname', ['me', data.nickname])
            }
            sessionStorage.seat_map = JSON.stringify(seatMap)
            break
          }
          case 'ready': {
            console.log(data)
            console.log(Date.parse(new Date()))
            const seatMap = JSON.parse(sessionStorage.seat_map)
            for (const key in seatMap) {
              if (key === 'me' && seatMap[key] === data.uid) {
                this.$store.commit('user/setReady', ['me', true])
              } else if (key === 'left' && seatMap[key] === data.uid) {
                this.$store.commit('user/setReady', ['left', true])
              } else if (key === 'right' && seatMap[key] === data.uid) {
                this.$store.commit('user/setReady', ['right', true])
              }
            }
            break
          }
          case 'deal':
            console.log('发牌了')
            this.curCard = data.player_hand_cards.reverse()
            this.cardsMe = []
            this.cardsLeft = []
            this.cardsRight = []
            this.deal()
            break
          case 'call': {
            const curCallUid = data.cur_call_uid // 当前发送叫或不叫地主消息的玩家
            const nextCallUid = data.next_call_uid // 下一个该叫地主的玩家 如果该值为空这表明叫地主一轮结束了,没有下一个了
            this._setAlarm(
              data.cur_call_point,
              curCallUid,
              nextCallUid,
              'call'
            )
            break
          }
          case 'rob': {
            const curRobUid = data.cur_rob_uid
            const nextRobUid = data.next_rob_uid
            this.showCall = false
            this.showRob = true
            this._setAlarm(data.cur_rob_point, curRobUid, nextRobUid, 'rob')
            break
          }
          case 'is_can_play':
            console.log('is_can_play')
            console.log(data)
            this.token = auth.getTokenByUid(data.cur_uid)
            this.showCall = false
            this.showRob = false
            this.isCanPlay = true
            this.alarm['me'] = 0
            this.alarm['right'] = 0
            this.alarm['left'] = 0
            this.landlordUid = data.cur_uid
            this._addLandlordCards(data.cur_uid, data.remain_card)
            break
          case 'play':
            console.log(data)
            this.showCard(data.cbCard)
            break
          case 'pass':
            console.log(data)
            this.showPass(data)
            break
          case 'end':
            console.log('本局结束')
            console.log(data)
            this.showSpecial(1)
            break
          default:
            break
        }
      } else {
        this.message[this.token] = res.message
        setTimeout(() => {
          this.message[this.token] = ''
        }, 2000)
      }
    },
    onClose(e) {
      console.log('断开连接', e)
    },
    wsSend(msg) {
      this.websocket.send(msg)
    },
    childSend(res) {
      this.wsSend(res)
    },
    mousedown(event) {
      this.moveChange = true
      this.first = !event.checked
    },
    mousemove(event) {
      this.clickLock = false
      if (this.moveChange) {
        this.clickLock = true
        this.cardsMe.find(
          c => c.label === event.label && c.type === event.type
        ).checked = this.first
      }
    },
    mouseup() {
      this.moveChange = false
    },
    showSpecial(specialType) {
      this.specialType = specialType
      this.special = true
      setTimeout(() => {
        this.special = false
      }, 2000)
    },
    deal() {
      const ccard = this.curCard.pop()
      this._add(ccard)
      if (this.curCard.length > 0) {
        setTimeout(() => {
          this.deal()
        }, 100)
      } else {
        this.$store.commit('user/setStartState', true)
      }
    },
    play() {
      if (this.cardsMe.filter(c => c.checked).length < 1) {
        this.$message({
          showClose: true,
          message: '请选择需要出的牌！',
          duration: 2000,
          type: 'warning'
        })
        return
      }
      this._playCard(this.cardsMe)
      if (this.cardsMe.length === 0) {
        this.showSpecial(1)
      }
      this.token = 'me'
      this.message.right = ''
      this.message.left = ''
    },
    showCard(data) {
      let next = ''
      if (this.token === 'me') {
        next = 'right'
        this._addHistoryCard(data, this.historyMe, this.cardsMe, 'me')
      } else if (this.token === 'left') {
        next = 'me'
        this._addHistoryCard(data, this.historyLeft, this.cardsLeft, 'left')
      } else {
        next = 'left'
        this._addHistoryCard(data, this.historyRight, this.cardsRight, 'right')
      }
      this.token = next
    },
    showPass(data) {
      let next = ''
      const seatMap = JSON.parse(sessionStorage.seat_map)
      for (const index in seatMap) {
        if (seatMap[index] === data.cbCard_uid) {
          this.token = index
        }
      }
      this.message[this.token] = '要不起'
      if (this.token === 'me') {
        next = 'right'
        setTimeout(() => {
          this.message['me'] = ''
        }, 1000)
      } else if (this.token === 'left') {
        next = 'me'
        setTimeout(() => {
          this.message['left'] = ''
        }, 1000)
      } else {
        next = 'left'
        setTimeout(() => {
          this.message['right'] = ''
        }, 1000)
      }
      this.token = next
    },
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight
    },
    changed(item) {
      if (!this.clickLock) item.checked = !item.checked
    },
    putdownAllCards() {
      this.cardsMe.forEach(h => {
        h.checked = false
      })
    },
    _addLandlordCards(uid, remainCards) {
      const token = auth.getTokenByUid(uid)
      remainCards.forEach(h => {
        if (token === 'me') {
          const tmp = h.split('x')
          this.cardsMe.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        } else if (token === 'right') {
          const tmp = h.split('x')
          this.cardsRight.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        } else {
          const tmp = h.split('x')
          this.cardsLeft.push({
            label: tmp[0],
            type: this.types[tmp[1]],
            checked: false
          })
        }
      })
      this.cardsMe = poker.sortCrad(this.cardsMe)
    },
    _setAlarm(curPoint, curUid, nextUid, type) {
      let next = ''
      const seatMap = JSON.parse(sessionStorage.seat_map)
      this.token = auth.getTokenByUid(nextUid)
      if (curPoint === 0) {
        this.message[auth.getTokenByUid(curUid)] =
          type === 'call' ? '不叫' : '不抢'
      }
      if (nextUid !== '') {
        if (nextUid === seatMap.me) {
          this.showCall = true
          next = 'right'
          this.alarm['left'] = 0
        } else if (nextUid === seatMap.right) {
          this.showCall = false
          this.showRob = false
          next = 'left'
          this.alarm['me'] = 0
        } else {
          this.showCall = false
          this.showRob = false
          next = 'me'
          this.alarm['right'] = 0
        }
        this.alarm[this.token] = 10
        clearInterval(this.clock)
        const curToken = this.token
        this.clock = setInterval(() => {
          this.alarm[curToken]--
        }, 1000)
        this.token = next
      } else {
        // 要重新发牌了,清空上局残留的闹钟
        this.alarm['me'] = 0
        this.alarm['left'] = 0
        this.alarm['right'] = 0
        setTimeout(() => {
          this.message[auth.getTokenByUid(curUid)] = ''
        }, 1000)
      }
    },
    _add(ccard) {
      const tmp = ccard.split('x')
      this.cardsMe.push({
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
    _playCard(obj) {
      console.log('出牌了...')
      const tmp = []
      tmp.push(...obj.filter(c => c.checked))
      let cbCard = []
      tmp.forEach(h => {
        cbCard.push(h.label + 'x' + poker.str2num(h.type, this.types))
      })
      let cardsNum = poker.card2num(tmp)
      cardsNum = cardsNum.sort((a, b) => a - b)
      console.log(cardsNum)
      const cardType = poker.checkType(cardsNum)
      if (cardType === 'bomb_card') this.showSpecial(0)
      if (!cardType) {
        this.message.me = '错误的牌型~'
        setTimeout(() => {
          this.message['me'] = ''
        }, 1000)
        return
      }
      cbCard = cbCard.reverse()
      const actions = {
        cmd: 'ddz/play',
        param: {
          room_no: 1000,
          grade: 'simple',
          cbCard: cbCard,
          cbCard_type: cardType
        },
        access_token: '123'
      }
      this.wsSend(JSON.stringify(actions))
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
      if (type === 'me') {
        this.historyMe.forEach(h => {
          this.cardsMe.splice(
            this.cardsMe.findIndex(
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
    }
  }
}
</script>

<style scoped>
.desk {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  background-image: url("../../assets/images/desk.png");
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.alarm {
  height: 20px;
}
.cards-height {
  height: 150px;
}
.cards {
  width: 100%;
  display: flex;
}
/* .cards .card { */
/* float:left; */
/*-moz-user-select:none;*/
/* } */
.cards .big:not(:first-child) {
  margin-left: -45px;
}
.cards .small:not(:first-child) {
  margin-left: -35px;
}
.cards .clear {
  clear: both;
}
.main {
  display: flex;
  flex-direction: column;
  vertical-align: middle;
  align-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}
.main .main-top {
  height: 60%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.main .main-bottom {
  position: relative;
  flex: auto;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 20px;
  width: 80%;
  margin-left: 200px;
}
.main-top-left {
  position: absolute;
  left: 0px;
  top: 30px;
  width: 300px;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.main-top-right {
  position: absolute;
  right: 0px;
  top: 30px;
  width: 300px;
  /* display: flex;
  margin-right: 100px;
  flex-direction: column;
  justify-content: center; */
}
.main .other {
  transform: rotate(90deg);
}
.main-bottom .history {
  position: fixed;
  height: 80px;
  line-height: 50px;
  width: 80%;
  bottom: 200px;
}
.main-top-left .history {
  position: relative;
  left: 370px;
  top: 30px;
  height: 80px;
  line-height: 50px;
}
.main-top-right .history {
  position: relative;
  width: 100%;
  top: 30px;
  height: 80px;
  line-height: 50px;
  right: 380px;
  justify-content: flex-end;
}

.main-top-left .msg {
  position: relative;
  left: 270px;
  top: 150px;
  height: 50px;
  line-height: 50px;
}
.main-top-right .msg {
  position: relative;
  justify-content: flex-end;
  top: 150px;
  right: 280px;
  height: 50px;
  line-height: 50px;
}
.main-bottom .msg {
  position: absolute;
  justify-content: flex-end;
  top: 60px;
  left: 30%;
  line-height: 50px;
}
.say {
  width: 150px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  position: relative;
  margin: 0 auto;
  color: #fff;
}
.main-top-left .say::before {
  content: ""; /* #三角内容为空 */
  width: 0px;
  height: 0px;
  border-top: 12px transparent solid;
  border-left: 13px transparent solid;
  border-right: 15px rgba(0, 0, 0, 0.5) solid;
  border-bottom: 12px transparent solid;
  position: absolute;
  margin: 13px -28px;
}

.main-top-right .say::after {
  content: ""; /* #三角内容为空 */
  width: 0px;
  height: 0px;
  border-top: 12px transparent solid;
  border-left: 13px rgba(0, 0, 0, 0.5) solid;
  border-right: 15px transparent solid;
  border-bottom: 12px transparent solid;
  position: absolute;
  margin: 13px 82px;
}

.say span {
  padding-left: 20px;
}

.main-top-left .card-recorder {
  position: relative;
  left: 245px;
  top: 10px;
  height: 50px;
  line-height: 50px;
}
.main-top-right .card-recorder {
  position: relative;
  right: 5px;
  top: 10px;
  height: 50px;
  line-height: 50px;
}
.card-recorder span {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  color: #fea;
  /* border: 1px solid #fff; */
  font-size: 22px;
  font-weight: 500;
  text-align: center;
}

.card-member-img {
  position: absolute;
  left: 50px;
  height: 100px;
  width: 100px;
}
.card-member-img img {
  width: 100%;
  height: 100%;
}
.cards-margin-right {
  position: absolute;
  right: 130px;
}
.cards-margin-left {
  position: absolute;
  left: 120px;
}
</style>
