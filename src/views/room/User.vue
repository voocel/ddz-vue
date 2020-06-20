<template>
  <div class="container">
    <div class="uinfo">
      <div :style="styleObject">
        <div class="alarm">{{ alarmNum }}</div>
        <img width="56px" src="@/assets/images/alarm-clock.png">
      </div>
      <div v-if="!startState" class="ready">
        <img v-if="isready" width="80px" src="@/assets/images/btn_readied.png">
      </div>
      <div class="nickname">昵称:{{ nickname }}</div>
      <div class="header-img">
        <img src="@/assets/images/default.jpg">
      </div>
    </div>
  </div>
</template>

<script>
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
    nickname() {
      return this.$store.state.user.nickname[this.direction]
    },
    startState() {
      return this.$store.state.user.startState
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display:flex;
  justify-content:center;
  align-items: center;
  .uinfo {
    padding-top: 20px;
    .nickname {
      padding-bottom: 10px;
      color: rgb(39, 38, 38);
    }
    .header-img {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
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
