<template>
  <div :class="['card', size + '-card']" :style="{ 'z-index': 699+num }">
    <div class="nocheck" />
    <div v-if="!open" class="back">
      <img src="@/assets/images/back.png">
    </div>
    <div
      v-show="open"
      :class="['card-num-left', size + '-num']"
      :style="{ color: cardColor }"
    >
      {{ cards }}
    </div>
    <div v-show="open"><img :src="cardType" class="card-type"></div>
    <div
      v-show="open"
      :class="['card-num-right', size + '-num']"
      :style="{ color: cardColor }"
    >
      {{ cards }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    value: {
      type: String,
      default: '0'
    },
    type: {
      type: String,
      default: 'heart'
    },
    size: {
      type: String,
      default: 'big'
    },
    num: {
      type: Number,
      default: 100
    },
    open: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    cardType() {
      return require(`@/assets/images/${this.type}.png`)
    },
    cardColor() {
      const color = {
        heart: '#f00',
        diamond: '#f00',
        spade: '#000',
        club: '#000'
      }
      return color[this.type]
    },
    cards() {
      let tmp = ''
      switch (this.value) {
        case '1':
          tmp = 'A'
          break
        case '11':
          tmp = 'J'
          break
        case '12':
          tmp = 'Q'
          break
        case '13':
          tmp = 'K'
          break
        case '0':
          tmp = '🃏'
          break
        default:
          tmp = this.value
      }
      return tmp
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: #ccc;
  background: #f1f1f1;
  border-radius: 4px;
  font-family: monospace;
  text-align: center;
}
.big-card {
  width: 100px;
  height: 150px;
  font-weight: 600;
  font-size: 40px;
}
.small-card {
  width: 55px;
  height: 80px;
  font-weight: 200;
  font-size: 20px;
}
.card-num-left {
  text-align: left;
  padding-left: 2px;
}
.big-num {
  height: 50px;
  line-height: 50px;
}
.small-num {
  height: 24px;
  line-height: 24px;
}
.card-num-right {
  position: absolute;
  bottom: 0px;
  right: 2px;
  /* transform:rotate(180deg); */
}
.card-type {
  height: 50%;
  width: 50%;
}
.back {
  height: 90%;
  width: 85%;
  margin: 5%;
  border: 1px dashed rgb(218, 107, 107);
  background-color: #9999a3;
}
.back img {
  width: 100%;
  height: 100%;
}
.nocheck {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
