<template>
  <div class="setting">
    <el-dropdown size="mini" split-button type="info" trigger="click">
      设置
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="test(111)">测试1</el-dropdown-item>
        <el-dropdown-item disabled>测试2</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">{{ direction === 'hall' ? '退出登录' : '返回大厅' }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  components: { },
  props: {
    direction: {
      type: String,
      default: 'hall'
    }
  },
  data() {
    return {}
  },
  methods: {
    test() {
      // this.$refs.audio.play()
      // let cardsNum = [1,1,1,1,2,2,2,2]
      // let res = this._checkThreeLine(cardsNum,cardsNum.length)
      // const num = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
      // const x = num.findIndex(n => n === '8')
      // console.log(x)
    },
    seatMap(serverSeat) {
      return (((3 - (1 + 1) + (serverSeat + 1)) % 3 + 1))
    },
    onPlay() {
      console.log(123)
    },
    async logout() {
      if (this.direction === 'hall') {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      } else {
        await this.$store.dispatch('user/backHall')
        this.$router.push('/hall')
      }
    }
  }
}
</script>

<style scoped>
.setting {
  position: absolute;
  top: 5px;
  right: 10px;
  /* width: 100px; */
}
</style>
