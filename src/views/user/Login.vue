<template>
  <div class="home">
    <div class="logo">
      <img width="340px" src="@/assets/images/hall_logo_pic.png" alt="">
    </div>
    <div class="bottom-box">
      <div @click="openLogin=true">
        <img width="150px" src="@/assets/images/btn_ traveler.png" alt="">
      </div>
    </div>
    <el-dialog :visible.sync="openLogin" :close-on-click-modal="false" width="400px">
      <div class="login-container">
        <div class="login-border  animated fadeInRight">
          <div class="login-main">
            <h4 class="login-title">{{ activeName }}</h4>
            <el-tabs v-model="activeName">
              <el-tab-pane label="玩家登录" name="登录">
                <userLogin @setActiveName="setActiveName" />
              </el-tab-pane>
              <el-tab-pane label="玩家注册" name="注册">
                <userRegister @setActiveName="setActiveName" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userLogin from './userlogin'
import userRegister from './userRegister'
export default {
  name: 'Login',
  components: { userLogin, userRegister },
  data() {
    return {
      openLogin: false,
      activeName: '登录'
    }
  },
  methods: {
    setActiveName(val) {
      console.log(val)
      this.activeName = val
    }
  }
}
</script>

<style lang="scss" scoped>
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
  height: 100vh;
  img {
    cursor: pointer;
  }
}
.bottom-box:active img {
  width: 143px;
}
.logo {
  position: absolute;
  left: 40%;
  top: 14%;
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
}
.login-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 50px 25px 50px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
}
.login-main {
  width: 280px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #409eff;
  letter-spacing: 3px;
  font-size: 22px;
}
</style>
