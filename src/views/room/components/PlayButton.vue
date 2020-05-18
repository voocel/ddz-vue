<template>
    <div class="PlayButton">
        <div class="buttons" v-show="!startState">
          <el-button type="success" round @click.native="action('ready')">{{isreadyMe ? '已准备' : '准备'}}</el-button>
        </div>
        <div class="buttons" v-show="startState && !special && isCanPlay && token === 'me'">
          <el-button type="success" round @click="action('pass')">不出</el-button>
          <el-button type="success" round v-if="token === 'me'" @click="play">出牌</el-button>
          <el-button type="success" round v-else style="background-color: #999;">出牌</el-button>
        </div>
        <div class="buttons" v-show="showCall">
          <el-button type="success" round @click="action('call',1)">叫地主</el-button>
          <el-button type="success" round @click="action('call',0)">不叫</el-button>
        </div>
        <div class="buttons" v-show="showRob">
          <el-button type="success" round @click="action('rob',1)">抢地主</el-button>
          <el-button type="success" round @click="action('rob',0)">不抢</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlayButton',
  props: ['special', 'isCanPlay', 'token', 'showCall', 'showRob'],
  methods: {
    action (type, point) {
      let actions = ''
      switch (type) {
        case 'ready':
        case 'pass':
          actions = {'cmd': 'ddz/' + type, 'param': {'room_no': 1000, 'grade': 'simple'}, 'access_token': '123'}
          break
        case 'call':
        case 'rob':
          actions = {'cmd': 'ddz/' + type, 'param': {'room_no': 1000, 'grade': 'simple', 'point': point}, 'access_token': '123'}
          break
      }
      this.$emit('childSend', JSON.stringify(actions))
    },
    play () {
      this.$emit('play')
    }
  },
  computed: {
    isreadyMe () {
      return this.$store.state.isready['me']
    },
    startState () {
      return this.$store.state.startState
    }
  }
}
</script>

<style scoped>
.buttons {
  position: fixed;
  width: 100%;
  bottom: 220px;
  left: 50%;
  margin-left: -110px;
  z-index: 99;
}
</style>
