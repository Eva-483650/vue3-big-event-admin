<template>
  <!-- 最外层我假设你有一个 <page-container> 包裹，这里只写组件内部内容 -->
  <div class="change-avatar-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Change Avatar</span>
        </div>
      </template>

      <div class="avatar-section">
        <el-upload
          :on-change="onSelectFile"
          ref="uploadRef"
          :auto-upload="false"
          class="avatar-uploader"
          :show-file-list="false"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="avatar-button">
          <el-button
            @click="uploadRef.$el.querySelector('input').click()"
            class="myButton"
            :icon="Plus"
            >Select Image</el-button
          >
          <el-button
            @click="onUpdateAvatar"
            class="myUploadButton"
            :icon="Upload"
            >Upload Avatar</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue' // 引入图标
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  // 基于filereader读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const onUpdateAvatar = async () => {
  await userUpdateAvatarService(imgUrl.value)
  // userStore重新渲染
  await userStore.getUser()
  ElMessage.success('Update Success')
}
</script>

<style lang="scss" scoped>
/* 继承自之前组件的卡片和标题样式 */

.change-avatar-container {
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

/* 头像区域布局 */
.avatar-section {
  display: flex;
  flex-direction: column; /* 垂直排列：预览在上，按钮在下 */
  align-items: center; /* 水平居中 */
  gap: 20px; /* 元素之间的间距 */
  padding: 20px 0;
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
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

  /* 激活时的颜色 (active/pressed) */
  --el-button-active-bg-color: var(
    --fresh-serene-accent
  ); /* 激活背景色改为强调色 */
  --el-button-active-text-color: var(--fresh-serene-light-text);
  --el-button-active-border-color: var(--fresh-serene-accent);

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
/* myUploadButton 样式：用于 Upload Avatar 按钮 */
.myUploadButton {
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
