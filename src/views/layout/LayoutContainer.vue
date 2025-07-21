<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div
        class="aside-header"
        style="
          margin-top: 20px;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 10px;
        "
      >
        <h1 v-if="!isCollapse" class="logo-text">Big Event</h1>
        <div v-else class="logo-icon">B</div>
      </div>
      <!-- el-menu 通过 :collapse 属性控制关闭开启 -->
      <el-menu
        class="el-menu"
        :close-on-click-outside="true"
        :collapse="isCollapse"
        active-text-color="#A7DBD8"
        background-color="#B19CD9"
        :default-active="$route.path"
        text-color="#555555"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>Article Channels</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>Article Management</span>
        </el-menu-item>
        <!-- 多级菜单的标题-具名插槽title -->
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>My Account</span>
          </template>
          <!-- 展开的内容-默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>Basic Information</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>Change Avatar</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>Reset Password</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <!-- 折叠/展开按钮区域 -->
      <div class="collapse-toggle-wrapper">
        <el-button
          :icon="isCollapse ? Fold : Expand"
          @click="isCollapse = !isCollapse"
          circle
          class="collapse-button"
        />
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          Welcome to Big Event Admin ,
          <strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <!-- 下拉菜单区域 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- command ：作为该下拉菜单项的唯一标识符或值。 -->
              <el-dropdown-item command="profile" :icon="User"
                >Basic Information</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >Change Avatar</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >Reset Password</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2025 Created by Eva</el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// 引入 Element Plus 的消息确认框
// import { ElMessageBox } from 'element-plus';

const userStore = useUserStore()
const router = useRouter()

// 如果你已经在main.js中全局注册了图标，这里不需要再引入每个图标。
// 否则，请取消下面这行的注释
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Fold,
  Expand
} from '@element-plus/icons-vue'

onMounted(() => {
  // 获取用户信息
  userStore.getUser()
})

const handleCommand = async (command) => {
  if (command === 'logout') {
    console.log('退出登录')
    // 弹出确认框
    await ElMessageBox.confirm(
      'Are you sure you want to log out?',
      'Confirm Logout',
      {
        type: 'warning',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    )
    // 清除本地信息，token，user
    userStore.removeToken()
    userStore.setUser({})
    // 路由跳转到登录页
    router.push('/login')
  } else {
    router.push(`/user/${command}`)
  }
}

// 控制侧边栏
const isCollapse = ref(true)
</script>

<style lang="scss" scoped>
/* 这个文件使用 scoped，只存放与当前组件布局相关的样式 */
/* 通用 Element Plus 组件的样式已移至 src/assets/styles/element-plus-custom.css */
.layout-container {
  height: 100vh;
  background-color: var(--fresh-serene-background); /* 使用全局背景色变量 */

  .el-aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s ease;
    background-color: var(--fresh-serene-primary); /* 使用主色作为侧边栏背景 */
    color: var(--fresh-serene-text); /* 侧边栏文字颜色，与背景对比 */

    // el-menu 通过 :collapse 属性控制关闭开启
    .el-menu {
      border-right: none; /* 移除菜单右侧的默认边框 */
      // 注意：el-menu 的背景色、文字色和激活色已经通过组件的属性绑定了，
      // 所以这里不需要再通过 CSS 覆盖。
      // background-color="#B19CD9" text-color="#555555" active-text-color="#A7DBD8"
    }

    .collapse-toggle-wrapper {
      margin-top: auto; /* 将按钮推到底部 */
      padding-bottom: 20px; /* 按钮到底部的间距 */
    }
  }

  .el-header {
    background-color: var(--fresh-serene-header-bg); /* 使用头部背景色变量 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px; /* 头部左右内边距 */
    border-bottom: 1px solid #eee; /* 保持边框 */

    /* el-dropdown__box 样式已移至全局样式文件 element-plus-custom.css */
    /* el-button.collapse-button 样式已移至全局样式文件 element-plus-custom.css */
  }

  .el-main {
    padding: 20px; /* 主内容区域的内边距 */
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--fresh-serene-text);
    background-color: var(--fresh-serene-header-bg); /* 使用头部背景色变量 */
    height: 40px; /* 固定 footer 高度 */
  }
}
</style>
