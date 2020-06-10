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
            <img width="180px" src="@/assets/images/btn_create_room.png" @click="handleCreate">
          </li>
          <li>
            <img width="180px" src="@/assets/images/btn_enter_room.png" @click="handleEnter">
          </li>
        </ul>
      </div>
      <div>
        <img width="450px" src="@/assets/images/hall_user2.png">
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="24%" top="20%">
      <div class="create-container">
        <el-input v-model="roomno" placeholder="请输入房间号">
          <template slot="prepend">房间号: </template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create' ? create() : enter()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      dialogVisible: false,
      dialogStatus: 'create',
      roomno: 100000
    }
  },
  methods: {
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    handleEnter() {
      this.dialogStatus = 'enter'
      this.dialogVisible = true
    },
    create() {
      console.log('create')
    },
    enter() {
      console.log('enter')
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
        img {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
