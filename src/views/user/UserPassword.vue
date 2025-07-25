l
<template>
  <page-containner title="Reset Password">
    <div class="change-password-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Reset Password</span>
          </div>
        </template>

        <!-- el-form 表单组件 -->
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="150px"
          class="password-form"
          style="padding-right: 50px"
        >
          <!-- 第一行：原密码 -->
          <el-form-item label="Old Password" prop="old_pwd">
            <el-input
              v-model="pwdForm.old_pwd"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 第二行：新密码 -->
          <el-form-item label="New Password" prop="new_pwd">
            <el-input
              v-model="pwdForm.new_pwd"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 第三行：确认密码 -->
          <el-form-item label="Confirm Password" prop="re_pwd">
            <el-input
              v-model="pwdForm.re_pwd"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 第四行：操作按钮 -->
          <el-form-item class="button-row">
            <el-button type="primary" @click="submitForm" class="myButton">
              Submit
            </el-button>
            <el-button @click="resetForm" class="myResetButton">
              Reset
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </page-containner>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
// 导入路由
import { useRouter } from 'vue-router'
const router = useRouter()
// 用于获取表单实例，以便调用其方法如 validate, resetFields
const formRef = ref(null)
const userStore = useUserStore()
// 表单绑定字段
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 自定义校验规则：新密码与原密码不能相同
const validateOldNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('New password cannot be the same as old password!'))
  } else {
    // 如果新密码改变，且确认密码不为空，则重新校验确认密码，以保持一致性
    if (pwdForm.value.re_pwd !== '') {
      formRef.value.validateField('re_pwd')
    }
    callback()
  }
}

// 自定义校验规则：新密码与确认密码必须相同
const validateNewRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(
      new Error('Confirm password must be consistent with new password!')
    )
  } else {
    callback()
  }
}

// 表单校验规则定义
const rules = reactive({
  old_pwd: [
    { required: true, message: 'Please enter old password', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: 'Password must be 6-20 characters long',
      trigger: 'blur'
    },
    {
      pattern: /^\S*$/,
      message: 'Password cannot contain spaces',
      trigger: 'blur'
    } // 确保没有空格
  ],
  new_pwd: [
    { required: true, message: 'Please enter new password', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: 'Password must be 6-20 characters long',
      trigger: 'blur'
    },
    {
      pattern: /^\S*$/,
      message: 'Password cannot contain spaces',
      trigger: 'blur'
    },
    { validator: validateOldNewPwd, trigger: 'blur' } // 自定义校验：原密码与新密码不能相同
  ],
  re_pwd: [
    { required: true, message: 'Please confirm new password', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: 'Password must be 6-20 characters long',
      trigger: 'blur'
    },
    {
      pattern: /^\S*$/,
      message: 'Password cannot contain spaces',
      trigger: 'blur'
    },
    { validator: validateNewRePwd, trigger: 'blur' } // 自定义校验：新密码与确认密码必须相同
  ]
})

// 提交表单方法
const submitForm = async () => {
  if (!formRef.value) return // 确保表单实例存在

  // 校验整个表单
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('Reset password successful')
  // 密码修改成功需要重新登录
  userStore.setToken('')
  userStore.setUser({})
  router.push('/login')
}

// 重置表单方法
const resetForm = () => {
  // 重置表单字段为初始值，并移除校验结果
  formRef.value.resetFields()
}
</script>

<style lang="scss" scoped>
/* 继承自之前组件的卡片和标题样式 */
.change-password-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
}

.box-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.password-form {
  padding: 20px;
}

/* 按钮行样式，用于调整按钮布局 */
.button-row {
  margin-top: 30px; /* 按钮行与上方输入框的间距 */
  text-align: right; /* 按钮右对齐 */
  .el-form-item__content {
    justify-content: flex-end; /* 确保按钮在内容区域中右对齐 */
  }
  .el-button {
    margin-left: 15px; /* 按钮之间的间距 */
  }
}
.myButton {
  /* 基础颜色 - 使用主题 Primary 色 */
  --el-button-bg-color: var(--fresh-serene-primary, #624b80);
  --el-button-text-color: #ffffff;
  --el-button-border-color: var(--fresh-serene-primary, #624b80);

  /* 悬停时的颜色 (hover) - 使用主题 Secondary 色 */
  --el-button-hover-bg-color: var(--fresh-serene-secondary, #8e7bc1);
  --el-button-hover-text-color: var(--fresh-serene-light-text, #ffffff);
  --el-button-hover-border-color: var(--fresh-serene-secondary, #8e7bc1);

  /* 禁用时的颜色 */
  --el-button-disabled-bg-color: var(--fresh-serene-secondary-light, #e7deee);
  --el-button-disabled-text-color: rgba(255, 255, 255, 0.7);
  --el-button-disabled-border-color: var(
    --fresh-serene-secondary-light,
    #e7deee
  );

  /* 动画效果 */
  transition:
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      background-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      border-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      transform,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      box-shadow;

  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
  border-color: var(--el-button-border-color);

  &:hover {
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &.is-disabled {
    background-color: var(--el-button-disabled-bg-color);
    border-color: var(--el-button-disabled-border-color);
    color: var(--el-button-disabled-text-color);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.myResetButton {
  /* 基础颜色 - 使用主题 Accent 色，更强调 */
  --el-button-bg-color: var(--fresh-serene-accent, #553e70);
  --el-button-text-color: #ffffff;
  --el-button-border-color: var(--fresh-serene-accent, #553e70);

  /* 激活时的颜色 (active/pressed) - 比基础色稍微深一点 */
  --el-button-hover-bg-color: color-mix(
    in srgb,
    var(--fresh-serene-accent, #553e70) 90%,
    black 10%
  ); /* 激活时略微加深 */
  --el-button-hover-text-color: var(--fresh-serene-light-text, #ffffff);
  --el-button-hover-border-color: color-mix(
    in srgb,
    var(--fresh-serene-accent, #553e70) 90%,
    black 10%
  );

  /* 禁用时的颜色 - 与 myButton 保持一致 */
  --el-button-disabled-bg-color: var(--fresh-serene-secondary-light, #e7deee);
  --el-button-disabled-text-color: rgba(255, 255, 255, 0.7);
  --el-button-disabled-border-color: var(
    --fresh-serene-secondary-light,
    #e7deee
  );

  /* 动画效果保持一致 */
  transition:
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      background-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      border-color,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      transform,
    var(--el-transition-duration) var(--el-transition-function-ease-in-out)
      box-shadow;

  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
  border-color: var(--el-button-border-color);

  &:hover {
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &.is-disabled {
    background-color: var(--el-button-disabled-bg-color);
    border-color: var(--el-button-disabled-border-color);
    color: var(--el-button-disabled-text-color);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}
</style>
