<template>
  <div class="settle">
    <Modal :open="open" @cancel="cancel">
      <div slot="header" class="header">
        结算页
        <img src="@/assets/images/burst.png" alt="">
      </div>
      <div>
        <el-table
          :data="data"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :header-cell-style="{background:'#5d5d5e'}"
        >
          <el-table-column
            prop="nickname"
            label="昵称"
            width="180"
            align="center"
          />
          <el-table-column
            prop="gold_coin_num"
            label="金币"
            width="180"
            align="center"
          />
          <el-table-column
            prop="ranking"
            label="排名"
            align="center"
          />
        </el-table>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'
export default {
  name: 'Settle',
  components: { Modal },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 2) {
        return 'success-row'
      }
      return ''
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-table {
    background: #5d5d5e;
  }
  ::v-deep .el-table .warning-row {
    background: oldlace;
  }
  ::v-deep .el-table .success-row {
    background: #f0f9eb;
  }
  .settle {
    opacity: 0.85;
    position: fixed;
    z-index: 999;
    .header {
      height: 56px;
      color: #fff;
      font-size: 20px;
      width:100%;height:100%;background: linear-gradient(rgb(255,237,188,.5), rgba(252, 115, 24, 0.5));
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
      img {
        position: absolute;
        opacity: 0.4;
        left: 250px;
        top: -50px;
      }
    }
  }
</style>
