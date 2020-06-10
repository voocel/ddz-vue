<template>
  <el-form ref="loginForm" class="form" status-icon :rules="loginRules" :model="loginForm" label-width="0">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" size="small" auto-complete="off" placeholder="请输入用户名" @keyup.enter.native="handleLogin">
        <i slot="prefix" class="icon-yonghu" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" size="small" :type="passwordType" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="handleLogin">
        <i slot="suffix" class="el-icon-view el-input__icon" style="cursor: pointer" @click="showPassword" />
        <i slot="prefix" class="icon-mima" />
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked">记住账号</el-checkbox>
    <el-form-item>
      <el-button :loading="loading" type="primary" size="small" class="submit" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
    <div>
      <div class="user-login-other" @click="setActiveName">注册账户</div>
    </div>
  </el-form>
</template>

<script>
import { validUsername } from '@/utils/validate'
export default {
  name: 'Userlogin',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      checked: false,
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query.username) this.loginForm.username = this.$route.query.username
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/hall' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setActiveName() {
      this.$emit('setActiveName', '注册')
    }
  }
}
</script>
<style lang="scss" scoped>
.user-login-other{
  float: right;
  font-size: 12px;
  color: #1890ff;
  text-decoration: underline;
}
.submit {
  margin-top: 20px;
  width: 100%;
  border-radius: 28px;
  letter-spacing: 2px;
}
.form {
  margin: 10px 0;
  .el-form-item__content {
    width: 270px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
</style>
