<template>
  <div class="uinfo" :style="getStyle()">
    <div class="alarm" v-show="alarm>0">
      <span class="alarm-item">{{alarm}}</span>
    </div>
    <div class="buttons ready" v-show="!startState">
      <el-button type="success" round v-show="isready">{{'已准备'}}</el-button>
    </div>
    <div class="nickname">昵称:{{nickname}}</div>
    <div class="header-img">
      <img src="@/assets/default.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Uinfo',
  props: {
    alarm: [Object,String,Number],
    startState: Boolean,
    isready: Boolean,
    type: String,
    nickname: [String,Number]
  },
  data () {
    return {
    }
  },
  methods: {
    getStyle (){
      if(this.type === 'me'){
        return 'position: absolute; left: -150px'
      }
      return 'position: absolute; left: 100px'
    }
  },
  computed: {

  }
}
</script>

<style scoped>
/* .uinfo{
  position: absolute;
  left: 100px;
} */
.ready{
  padding-left: 0px;
  height: 50px;
}
img {
  width: 80px;
  height: 80px;
  border-radius:50%
}
.nickname{
  padding-left: 10px;
  color: #eee;
}
.alarm{
  height: 20px;
  width: 20px;
  margin-left: 25px;
  padding-bottom: 10px;
}
.alarm-item{
  border: 1px solid rgb(243, 128, 20);
  border-radius: 50%;
  padding: 5px;
}
</style>