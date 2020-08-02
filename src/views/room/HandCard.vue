<template>
  <div v-clickoutside="putdownAllCards" :class="['rotate-'+direction]" @mouseleave="mouseleave()">
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
import { getToken, getRoomNo } from '@/utils/auth'

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
    handCards: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      check: false,
      moveChange: false,
      specialType: 0,
      special: false,
      down: false,
      hasMove: false
    }
  },
  methods: {
    putdownAllCards() {
      if (!this.down) {
        this.handCards.forEach(h => {
          h.checked = false
        })
      }
      this.down = false
      this.hasMove = false
    },
    mousedown(event) {
      this.moveChange = true
      this.down = true
      this.check = !event.checked
    },
    mousemove(event) {
      if (this.moveChange) {
        this.hasMove = true
        this.handCards.find(
          c => c.label === event.label && c.type === event.type
        ).checked = this.check
      }
    },
    mouseup() {
      this.down = false
      this.moveChange = false
    },
    mouseleave() {
      this.moveChange = false
    },
    changed(item) {
      if (!this.hasMove) {
        item.checked = !item.checked
      }
      this.hasMove = false
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
    },
    _playCard(obj) {
      const tmp = []
      tmp.push(...obj.filter(c => c.checked))
      let cbCard = []
      tmp.forEach(h => {
        cbCard.push(h.label + 'x' + poker.str2num(h.type, this.$common.cardMap))
      })
      let cardsNum = poker.card2num(tmp)
      cardsNum = cardsNum.sort((a, b) => a - b)
      const cardType = poker.checkType(cardsNum)
      cbCard = cbCard.reverse()
      if (cardType === 'three_take_one' && cardsNum[0] !== cardsNum[1]) {
        cbCard = cbCard.reverse()
      } else if (cardType === 'three_take_two' && cardsNum[1] !== cardsNum[2]) {
        cbCard = cbCard.reverse()
      }
      if (!cardType) {
        this.$message({
          showClose: true,
          message: '错误的牌型!',
          duration: 2000,
          type: 'warning'
        })
        return
      }
      const actions = {
        cmd: 'ddz/play',
        param: {
          room_no: getRoomNo(),
          grade: 'simple',
          cbCard: cbCard,
          cbCard_type: cardType
        },
        access_token: getToken()
      }
      this.$socket.sendObj(actions)
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

