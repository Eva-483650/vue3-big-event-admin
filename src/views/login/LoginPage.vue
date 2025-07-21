<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            @keyup.enter="register"
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            @keyup.enter="register"
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            @keyup.enter="register"
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            @keyup.enter="login"
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            @keyup.enter="login"
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" underline="never">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { userRegisterService } from '@/api/user.js'
import { userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref()
const form = ref(null)
// 注册 看接口文档
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    // 1. 非空校验 required：true message：提示信息 trigger：触发方式
    { required: true, message: '请输入用户名', trigger: 'blur' },
    // 2. 长度校验 min max
    { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符之间', trigger: 'blur' },
    // 3. 正则校验 pattern
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符之间', trigger: 'blur' },
    // 4. 自定义校验 validator校验函数
    {
      // rule当前校验规则，value当前值，callback回调函数
      // --如果校验通过，调用callback()
      // --如果校验不通过，调用callback(new Error('提示信息'))
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  // 预校验
  // 注册成功之前，先进行校验，校验成功 -> 发送注册请求
  try {
    await form.value.validate()
    console.log('开始注册请求', formModel.value)
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false // 切换到登录界面
  } catch (err) {
    // 打印错误信息，便于排查
    console.log('注册失败', err)
    // 兼容后端返回格式
    ElMessage.error(err?.message || err?.response?.data?.message || '注册失败')
  }
}

// 切换时重置表单内容
watch(isRegister, () => {
  if (form.value) form.value.resetFields()
})

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  // 登录逻辑
  try {
    // 预校验
    await form.value.validate()
    console.log('开始登录请求', formModel.value)
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    console.log('登录成功', res)
    ElMessage.success('登录成功')
    router.push('/') // 跳转到首页
  } catch (err) {
    console.log('登录失败', err)
    //ElMessage.error(err?.message || err?.response?.data?.message || '登录失败')
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
