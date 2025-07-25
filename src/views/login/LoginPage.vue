<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            @keyup.enter="register"
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            @keyup.enter="register"
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            @keyup.enter="register"
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please re-enter password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="myButton"
            type="primary"
            auto-insert-space
          >
            Register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            @keyup.enter="login"
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            @keyup.enter="login"
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember Me</el-checkbox>
            <el-link type="primary" underline="never">Forgot Password?</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="myButton"
            type="primary"
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = true">
            Register →
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
import { ref, watch, reactive } from 'vue' // 确保 reactive 导入
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref(false) // 默认显示登录页面
const form = ref(null)

// 注册 看接口文档
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

// 表单校验规则
const rules = reactive({
  username: [
    // 1. 非空校验 required：true message：提示信息 trigger：触发方式
    { required: true, message: 'Please enter username', trigger: 'blur' },
    // 2. 长度校验 min max
    {
      min: 3,
      max: 10,
      message: 'Length must be between 3 and 10 characters',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: 'Length must be between 6 and 20 characters',
      trigger: 'blur'
    },
    // 3. 正则校验 pattern
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Can only contain letters, numbers, and underscores',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: 'Length must be between 6 and 20 characters',
      trigger: 'blur'
    },
    // 4. 自定义校验 validator校验函数
    {
      // rule当前校验规则，value当前值，callback回调函数
      // --如果校验通过，调用callback()
      // --如果校验不通过，调用callback(new Error('提示信息'))
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 注册方法
const register = async () => {
  // 预校验
  // 注册成功之前，先进行校验，校验成功 -> 发送注册请求
  try {
    await form.value.validate()
    console.log('开始注册请求', formModel.value) // 注释保留中文，日志内容可根据需求决定
    await userRegisterService(formModel.value)
    ElMessage.success('Registration successful') // 提示信息改为英文
    isRegister.value = false // 切换到登录界面
  } catch (err) {
    // 打印错误信息，便于排查
    console.log('注册失败', err) // 日志内容
    // 兼容后端返回格式
    ElMessage.error(
      err?.message || err?.response?.data?.message || 'Registration failed'
    ) // 提示信息改为英文
  }
}

// 切换时重置表单内容
watch(isRegister, () => {
  if (form.value) form.value.resetFields()
})

const userStore = useUserStore()
const router = useRouter()

// 登录方法
const login = async () => {
  // 登录逻辑
  try {
    // 预校验
    await form.value.validate()
    console.log('开始登录请求', formModel.value) // 日志内容
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    console.log('登录成功', res) // 日志内容
    ElMessage.success('Login successful') // 提示信息改为英文
    router.push('/') // 跳转到首页
  } catch (err) {
    console.log('登录失败', err) // 日志内容
    ElMessage.error(
      err?.message || err?.response?.data?.message || 'Login failed'
    ) // 提示信息改为英文
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    // 背景图片改为渐变色，同时保留logo
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      // 保持logo不变
      linear-gradient(
          to bottom right,
          var(--fresh-serene-secondary, #8e7bc1),
          // 使用辅助色作为渐变起始色（如果未定义则为默认值）
          var(--fresh-serene-primary, #624b80)
        ); // 使用主色作为渐变结束色（如果未定义则为默认值）
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
.myButton {
  /* 基础颜色 */
  --el-button-bg-color: var(--fresh-serene-primary); /* 按钮背景色 */
  --el-button-text-color: #ffffff; /* 按钮文字颜色 */
  --el-button-border-color: var(--fresh-serene-primary); /* 按钮边框色 */

  /* 悬停时的颜色 (hover) */
  --el-button-hover-bg-color: var(
    --fresh-serene-secondary
  ); /* 悬停背景色改为辅助色 */
  --el-button-hover-text-color: var(--fresh-serene-light-text);
  --el-button-hover-border-color: var(--fresh-serene-secondary);

  /* 禁用时的颜色 */
  --el-button-disabled-bg-color: var(
    --fresh-serene-secondary-light,
    #e7deee
  ); /* 禁用背景色用辅助色的浅色变体 */
  --el-button-disabled-text-color: rgba(
    255,
    255,
    255,
    0.7
  ); /* 禁用文字颜色稍暗 */
  --el-button-disabled-border-color: var(
    --fresh-serene-secondary-light,
    #e7deee
  );

  /* === Hover 动画效果 === */
  /* 过渡效果：平滑地过渡背景色和边框色 */
  transition:
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      background-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      border-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      transform,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      box-shadow;

  /* 确保按钮的默认状态 */
  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
  border-color: var(--el-button-border-color);

  /* 悬停状态 */
  &:hover {
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color); /* 确保文字颜色也保持 */
    /* 可以添加一个轻微的缩放效果，增加交互感 */
    transform: translateY(-2px); /* 向上轻微移动 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 添加阴影 */
  }

  /* 禁用状态 */
  &.is-disabled {
    background-color: var(--el-button-disabled-bg-color);
    border-color: var(--el-button-disabled-border-color);
    color: var(--el-button-disabled-text-color);
    cursor: not-allowed; /* 禁用时鼠标样式 */
    transform: none; /* 移除任何动画效果 */
    box-shadow: none;
  }
}
</style>
