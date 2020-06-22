<template>
  <div class="home">
    <div class="bottom-box">
      <div>
        <img style="transform:rotate(270deg)" width="450px" src="@/assets/images/tip.png">
      </div>
      <div>
        <img width="400px" src="@/assets/images/hall_user.png">
      </div>
      <div class="btn-room">
        <ul>
          <li>
            <img class="match" width="180px" src="@/assets/images/btn_match_room.png" @click="match">
          </li>
          <li>
            <img width="180px" src="@/assets/images/btn_create_room.png" @click="createVisible=true">
          </li>
          <li>
            <img width="180px" src="@/assets/images/btn_enter_room.png" @click="enterVisible=true">
          </li>
        </ul>
      </div>
      <div>
        <img width="450px" src="@/assets/images/hall_user2.png">
      </div>
    </div>
    <setting />
    <el-dialog :visible.sync="enterVisible" :close-on-click-modal="false" width="24%" top="20%">
      <div class="create-container">
        <el-input v-model="roomNo" placeholder="请输入房间号">
          <template slot="prepend">房间号: </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="enterVisible = false">取 消</el-button>
        <el-button type="primary" @click="enter()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="createVisible" title="游戏局数" :close-on-click-modal="false" width="24%" top="20%">
      <div class="create-container">
        <el-radio-group v-model="gameNumber">
          <el-radio :label="1">1局</el-radio>
          <el-radio :label="2">2局</el-radio>
          <el-radio :label="4">4局</el-radio>
          <el-radio :label="8">8局</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="create()">创 建</el-button>
      </span>
    </el-dialog>

    <div class="matching">
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="isMatching"
        :show-close="false"
        width="580px"
      >
        <img src="@/assets/images/match.png" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Setting from '../room/Setting'

export default {
  name: 'Home',
  components: { Setting },
  data() {
    return {
      enterVisible: false,
      createVisible: false,
      gameNumber: 1,
      roomNo: 100000,
      isMatching: false
    }
  },
  created() {
    this.$options.sockets.onmessage = (response) => {
      const res = JSON.parse(response.data)
      if (res.code === 400) {
        this.common.tip(res.message, 'warning', 2000)
        return
      }
      const data = res.data.result
      console.log(res.data)
      switch (res.data.type) {
        case 'create_room': {
          this.createVisible = false
          this.$router.push({
            path: '/room',
            query: { 'room_no': data.room_no }
          })
          break
        }
        case 'match': {
          this.isMatching = false
          this.$router.push({
            path: '/room',
            query: { 'room_no': data.room_no }
          })
          break
        }
        default:
          break
      }
    }
  },
  methods: {
    match() {
      console.log('match')
      this.isMatching = true
      const actions = {
        cmd: 'ddz/match',
        param: {
          room_no: this.roomNo,
          grade: 'simple'
        },
        access_token: getToken()
      }
      this.$socket.sendObj(actions)
    },
    create() {
      const actions = {
        cmd: 'ddz/createRoom',
        param: {
          game_number: this.gameNumber
        },
        access_token: getToken()
      }
      this.$socket.sendObj(actions)
    },
    enter() {
      console.log('enter')
      const actions = {
        cmd: 'ddz/enterRoom',
        param: {
          room_no: this.roomNo
        },
        access_token: getToken()
      }
      this.$socket.sendObj(actions)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  width: 80%;
}
::v-deep .el-dialog__body {
  padding-left: 16%;
}
::v-deep .matching .el-dialog{
  opacity:0.9;
  border-radius: 50%;
}
// .match:active {
//   width: 175px;
// }
.home{
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  background-image: url('../../assets/images/bg_hall.png');
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.bottom-box{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  .btn-room {
    ul {
      list-style: none;
      li {
        padding: 15px 0;
        height: 80px;
        img {
          cursor: pointer;
        }
      }
      li:active img {
        width: 175px;
      }
    }
  }
}
</style>
