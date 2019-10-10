<template>
    <div class="fade">
      <div :class="['fade-main', special ? 'fade-main-big' : 'fade-main-small']">
        <img v-if="specialType === 0" src="@/assets/bomb.png" style="height: 100%; width: 100%;">
        <img v-if="specialType === 1" src="@/assets/victory.png" style="height: 100%; width: 100%;">
        <div v-if="specialType === 1" class="text">
          恭喜你，赢了！
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Fade',
  props: {
      special: Boolean,
      specialType: Number
  }
}
</script>

<style scoped>
.fade {
  position: fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  z-index:1000;
  justify-content: center;
}
.fade-main {
  position: fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  z-index:1000;
  margin-top: -100px;
  -webkit-transition: all 1s ease-in-out .3s;
  transition: all 1s ease-in-out .3s;
  color: #f1f1f1;
}
.fade-main-small {
  width: 100px;
  height: 100px;
  font-size: 12px;
  visibility: hidden;
  opacity: 0
}
.fade-main-big {
  width: 600px;
  height: 600px;
  font-size: 30px;
  visibility: visible;
  opacity: 1
}
.fade-main .text {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  margin-top: -10%;
}
</style>