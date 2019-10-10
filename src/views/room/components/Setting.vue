<template>
    <div class="setting">
      <el-dropdown size="mini" split-button type="info">
      设置
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="test(111)">测试1</el-dropdown-item>
        <el-dropdown-item disabled>测试2</el-dropdown-item>
        <el-dropdown-item divided>测试3</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
    test(a,b){
      this.$message({
          showClose: true,
          message: '请选择需要出的牌！',
          type: 'warning',
          duration:3000
        })
      // let cardsNum = [1,1,1,1,2,2,2,2]
      // let res = this._checkThreeLine(cardsNum,cardsNum.length)
      let num = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
      let x = num.findIndex(n => n == 3)
      console.log(x)
    },
  },
  computed: {

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