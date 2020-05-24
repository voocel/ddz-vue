<template>
  <div class="uinfo" :style="getStyle()">
    <div v-show="alarm > 0" class="alarm">
      <span class="alarm-item">{{ alarm }}</span>
    </div>
    <div v-show="!startState" class="buttons ready">
      <el-button v-show="isready" type="success" round>{{
        "已准备"
      }}</el-button>
    </div>
    <div class="nickname">昵称:{{ nickname }}</div>
    <div class="header-img">
      <img src="@/assets/images/default.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Uinfo',
  props: {
    alarm: [Object, String, Number],
    type: String
  },
  data() {
    return {}
  },
  computed: {
    isready() {
      return this.$store.state.user.isready[this.type]
    },
    nickname() {
      return this.$store.state.user.nickname[this.type]
    },
    startState() {
      return this.$store.state.startState
    }
  },
  methods: {
    getStyle() {
      if (this.type === 'me') {
        return 'position: absolute; left: -150px'
      }
      return 'position: absolute; left: 100px'
    }
  }
}
</script>

<style scoped>
/* .uinfo{
  position: absolute;
  left: 100px;
} */
.ready {
  padding-left: 0px;
  height: 50px;
}
img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.nickname {
  padding-left: 10px;
  color: #eee;
}
.alarm {
  height: 20px;
  width: 20px;
  margin-left: 25px;
  padding-bottom: 10px;
}
.alarm-item {
  border: 1px solid rgb(243, 128, 20);
  border-radius: 50%;
  padding: 5px;
}
</style>
