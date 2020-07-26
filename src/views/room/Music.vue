<template>
  <div class="music">
    <audio id="music-audio" ref="audio" autoplay @canplay="ready" @play="onPlay" />
  </div>
</template>

<script>
const musicList = {
  alarm: 'alarm.mp3',
  bg_room: 'bg_room.mp3',
  bomb: 'bomb.mp3',
  pass: 'pass.mp3',
  pass1: 'pass1.mp3',
  big_king: 'big_king.mp3',
  deal: 'deal.mp3',
  end_lose: 'end_lose.mp3',
  end_win: 'end_win.mp3',
  fscore0: 'fscore0.mp3',
  fscore1: 'fscore1.mp3',
  plane: 'plane.mp3',
  double_line: 'double_line.mp3',
  three_take_one: 'three_take_one.mp3',
  three_take_two: 'three_take_two.mp3',
  four_take_two: 'four_take_two.mp3',
  start: 'start.mp3',
  king_bomb: 'king_bomb.mp3',
  small_king: 'small_king.mp3',
  zhadan: 'zhadan.mp3'
}
export default {
  name: 'Music',
  data() {
    return {
      isReady: false,
      isPlayErrorPromptShow: false,
      playing: false
    }
  },
  computed: {
    audio() {
      return this.$refs.audio
    }
  },
  methods: {
    ready() {
      this.isReady = true
    //   this.play()
    },
    onPlay() {
      console.log(123)
    },
    play(name) {
      console.log(name)
      this.audio.src = require('../../assets/audio/' + musicList[name])
      this.audio.play()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
