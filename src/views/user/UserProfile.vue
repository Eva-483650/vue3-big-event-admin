<template>
  <page-containner title="Basic Information">
    <div class="profile-settings-form">
      <!-- el-card 是一个不错的选择，可以给表单提供一个边框和标题 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Profile Settings</span>
          </div>
        </template>
        <!-- Element Plus 表单组件，绑定表单数据模型和校验规则 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="profile-form"
          style="padding-right: 30px"
        >
          <!-- 第一行：登录名称 - 禁用状态 -->
          <el-form-item label="Login Name">
            <el-input v-model="formData.username" disabled></el-input>
          </el-form-item>

          <!-- 第二行：用户昵称 - 可输入，带校验 -->
          <el-form-item label="Nickname" prop="nickname">
            <el-input v-model="formData.nickname"></el-input>
          </el-form-item>

          <!-- 第三行：用户邮箱 - 可输入，带校验 -->
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>

          <!-- 第四行：提交按钮 -->
          <el-form-item>
            <el-button class="myButton" @click="submitForm()">
              Submit Changes
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </page-containner>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()
// 获取表单实例的引用，用于调用表单方法，如 validate
const formRef = ref()
// 定义表单数据模型
const formData = ref({
  id,
  username, // 登录名称，假设这是从后端获取的，且不可修改
  nickname, // 用户昵称
  email // 用户邮箱
})

// 定义表单校验规则
const formRules = ref({
  nickname: [
    { required: true, message: 'Please input nickname', trigger: 'blur' }, // 必填校验
    {
      min: 2,
      max: 20,
      message: 'Length should be 2 to 20 characters',
      trigger: 'blur'
    } // 长度校验
  ],
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' }, // 必填校验
    {
      type: 'email',
      message: 'Please input a valid email address',
      trigger: ['blur', 'change']
    } // 邮箱格式校验
  ]
})

const submitForm = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(formData.value)
  getUser()
  ElMessage.success('Edit Profile Success')
}
</script>

<style lang="scss" scoped>
/* 组件的局部样式，使用 scoped 避免样式污染 */
.profile-settings-form {
  /* 可以根据 page-container 的布局调整这里的宽度和边距 */
  width: 100%; /* 例如，让卡片占满父容器 */
  max-width: 600px; /* 或者设置最大宽度 */
  margin: 20px auto; /* 居中显示 */
}

.box-card {
  border-radius: 8px; /* 轻微圆角 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.profile-form {
  margin-top: 20px; /* 表单与卡片标题之间留点空隙 */
}

.myButton {
  /* 基础颜色 */
  --el-button-bg-color: var(--fresh-serene-primary); /* 按钮背景色 */
  --el-button-text-color: var(--fresh-serene-light-text); /* 按钮文字颜色 */
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
      border-color;

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
