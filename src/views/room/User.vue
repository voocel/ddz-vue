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
      <div class="nickname">昵称: {{ userInfo.nickname }}</div>
    </div>
  </div>
</template>

<script>
import { getPlayers } from '@/utils/auth'

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
    }
  },
  data() {
    return {
      userInfo: {},
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
    avatar() {
      const avatar = this.userInfo.avatar
      if (Number.isInteger(avatar) && avatar > 0 && avatar < 19) {
        return avatar
      }
      return 1
    }
  },
  watch: {
    userInfo() {
      return getPlayers()[this.direction]
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
      padding-bottom: 20px;
      color: rgb(218, 214, 214);
    }
    .header-img {
      img {
        width: 80px;
        height: 80px;
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
