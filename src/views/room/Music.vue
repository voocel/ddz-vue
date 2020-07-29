<template>
  <div class="music">
    <audio id="music-audio" ref="audio" autoplay />
    <audio id="music-audio" ref="audio2" autoplay />
  </div>
</template>

<script>
export default {
  name: 'Music',
  data() {
    return {}
  },
  computed: {
    audio() {
      return this.$refs.audio
    }
  },
  methods: {
    play(name) {
      this.audio.src = require('../../assets/audio/' + name + '.mp3')
      this.audio.play()
    },
    playbg(name, loop = '') {
      this.$refs.audio2.loop = loop
      this.$refs.audio2.src = require('../../assets/audio/' + name + '.mp3')
      this.$refs.audio2.play()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
