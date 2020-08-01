<template>
  <div v-show="show" class="modal-bg" @mousemove="modalMove" @mouseup="cancelMove">
    <div class="modal-container">
      <div class="modal-header" @mousedown="start">
        结算
      </div>
      <div class="modal-main">
        {{ message }}
        <slot />
      </div>
      <div class="modal-footer">
        <el-button round @click="hide">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isShow: false,
      x: 0,
      y: 0,
      node: null,
      isCanMove: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.node = document.querySelector('.modal-container')
    })
  },
  methods: {
    show() {
      this.isShow = true
      if (this.duration !== -1) {
        setTimeout(this.hide, this.duration)
      }
    },
    hide() {
      this.isShow = false
      // 调用组件实例提供的方法销毁组件实例
      this.remove()
    },
    start(e) {
      this.x = e.clientX - this.node.offsetLeft
      this.y = e.clientY - this.node.offsetTop
      this.isCanMove = true
    },
    modalMove(e) {
      if (this.isCanMove) {
        this.node.style.left = e.clientX - this.x + 'px'
        this.node.style.top = e.clientY - this.y + 'px'
      }
    },
    cancelMove() {
      this.isCanMove = false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 10;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  .modal-container {
    width: 600px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .modal-header {
      height: 56px;
      background: #5d5d5e;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
    }
    .modal-main {
      padding: 15px 40px;
    }
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 57px;
      border-top: 1px solid #ddd;
    }
  }
}

</style>
