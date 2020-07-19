<template>
  <div class="user">
    <div class="uinfo">
      <div :style="styleObject">
        <div class="alarm">{{ alarmNum }}</div>
        <img width="56px" src="@/assets/images/alarm-clock.png">
      </div>
      <div v-if="!startState" class="ready">
        <img v-if="isready" width="80px" src="@/assets/images/button/readied.png">
      </div>
      <div class="header-img">
        <img :src="require('@/assets/images/avatar/'+avatar+'.png')">
      </div>
      <div class="nickname">{{ nickname }}</div>
      <div v-if="direction !== 'mine'" class="coin">
        <div class="coin-icon"><img width="24px" src="@/assets/images/coin.png"></div>
        <div class="coin-num">{{ coin }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getPlayers } from '@/utils/auth'

export default {
  name: 'Uinfo',
  props: {
    direction: {
      type: String,
      default: 'left'
    },
    alarmNum: {
      type: Number,
      default: 0
    },
    coin: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      nickname: '',
      message: {
        mine: '',
        right: '',
        left: ''
      }
    }
  },
  computed: {
    styleObject() {
      if (this.alarmNum > 0) {
        return
      }
      return 'visibility: hidden'
    },
    isready() {
      return this.$store.state.user.isready[this.direction]
    },
    startState() {
      return this.$store.state.user.startState
    },
    userInfo() {
      return this.$store.state.user.players[this.direction]
    },
    avatar() {
      if (this.userInfo) {
        const avatar = parseInt(this.userInfo.avatar)
        if (Number.isInteger(avatar) && avatar > 0 && avatar < 19) {
          return avatar
        }
      }
      return 1
    }
  },
  watch: {
    userInfo: {
      handler(newVal, oldVal) {
        this.nickname = newVal.nickname
      }
      // immediate: true,
      // deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.user {
  display:flex;
  justify-content:center;
  align-items: center;
  .uinfo {
    .nickname {
      padding-bottom: 5px;
      width: 80px;
      overflow:hidden;
      white-space:nowrap;
      color: rgb(218, 214, 214);
    }
    .header-img {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .coin {
      color: rgb(252, 195, 38);
      font-size: 12px;
      background: rgba(131, 131, 131, 0.6);
      height: 20px;
      line-height: 20px;
      width: 80px;
      border-radius: 10px;
      .coin-icon {
        float: left;
        padding-top: 2px;
        padding-left: 3px;
      }
      .coin-num {
        float: left;
        padding-left: 3px;
      }
    }
  }
}
.ready {
  padding-left: 0px;
  height: 50px;
}
.alarm {
  position: relative;
  top: 40px;
}
</style>
