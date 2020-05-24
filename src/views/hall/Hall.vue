<template>
  <div class="home">
    <div class="bottom-box">
      <div>
        <el-input v-model="input" class="room-no" placeholder="请输入房间号" />
      </div>
      <router-link tag="div" to="/room">
        <el-button type="primary" round>加入房间</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      input: ''
    }
  }
}
</script>

<style scoped>
  .home{
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    background-image: url('../../assets/images/ddz_bg.jpg');
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .bottom-box{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    width: 100%;
    height: 1000px;
  }
  .room-no{
    width: 300px;
    height: 40px;
  }

</style>
