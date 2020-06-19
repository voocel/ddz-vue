<template>
  <div v-clickoutside="putdownAllCards" :class="['rotate-'+direction]">
    <card
      v-for="(item, i) in handCards"
      :key="i"
      :open="open"
      :size="size"
      class="small"
      :num="i"
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
      @click.native="changed(item)"
    />
  </div>
</template>

<script>
import Card from './Card'
import clickoutside from '@/directive/clickoutside'
import poker from '@/utils/poker'
import { getToken } from '@/utils/auth'

export default {
  name: 'Home',
  components: { Card },
  directives: { clickoutside },
  props: {
    direction: {
      type: String,
      default: 'left'
    },
    size: {
      type: String,
      default: 'small'
    },
    open: {
      type: Boolean,
      default: false
    },
    roomNo: {
      type: Number,
      default: 0
    },
    handCards: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      // handCards: [
      //   { label: '2', type: 'diamond', checked: false },
      //   { label: '3', type: 'diamond', checked: false },
      //   { label: '4', type: 'diamond', checked: false },
      //   { label: '5', type: 'diamond', checked: false },
      //   { label: '6', type: 'diamond', checked: false },
      //   { label: '7', type: 'diamond', checked: false },
      //   { label: '8', type: 'diamond', checked: false }
      // ],
      first: false,
      moveChange: false,
      clickLock: false,
      specialType: 0,
      special: false,
      types: {
        '1': 'heart',
        '2': 'spade',
        '3': 'diamond',
        '4': 'club'
      }
    }
  },
  methods: {
    putdownAllCards() {
      this.handCards.forEach(h => {
        h.checked = false
      })
    },
    mousedown(event) {
      this.moveChange = true
      this.first = !event.checked
    },
    mousemove(event) {
      this.clickLock = false
      if (this.moveChange) {
        this.clickLock = true
        this.handCards.find(
          c => c.label === event.label && c.type === event.type
        ).checked = this.first
      }
    },
    mouseup() {
      this.moveChange = false
    },
    changed(item) {
      if (!this.clickLock) item.checked = !item.checked
    },
    play() {
      if (this.handCards.filter(c => c.checked).length < 1) {
        this.$message({
          showClose: true,
          message: '请选择需要出的牌！',
          duration: 2000,
          type: 'warning'
        })
        return
      }
      this._playCard(this.handCards)
      // if (this.handCards.length === 0) {
      //   this.showSpecial(1)
      // }
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
        this.$message({
          showClose: true,
          message: '错误的牌型!',
          duration: 2000,
          type: 'warning'
        })
        return
      }
      cbCard = cbCard.reverse()
      const actions = {
        cmd: 'ddz/play',
        param: {
          room_no: this.roomNo,
          grade: 'simple',
          cbCard: cbCard,
          cbCard_type: cardType
        },
        access_token: getToken()
      }
      this.$socket.sendObj(actions)
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

<style lang="scss" scoped>
.rotate-left {
  width: 100%;
  display: flex;
  margin-top: 150px;
  transform: rotate(90deg);
}
.rotate-right {
  width: 100%;
  display: flex;
  margin-top: 150px;
  transform: rotate(90deg);
}
.rotate-mine {
  width: 100%;
  display: flex;
  margin-top: 20px;
}
.small:not(:first-child) {
  margin-left: -35px;
}
.big:not(:first-child) {
  margin-left: -45px;
}
</style>

