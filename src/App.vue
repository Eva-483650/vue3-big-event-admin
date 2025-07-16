<script setup>
// 1.获取路由对象 router useRouter
// 2.获取路由参数 route useRoute
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores' // 导入用户状态管理
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const goList = () => {
  // 路由跳转
  router.push('/list')
  console.log('goList', route)
}
</script>

<template>
  <div>
    <hr />
    <router-view></router-view>
    <hr />
    <hr />
    <hr />
    我是app
    <el-button @click="goList">jump to list</el-button>
    <el-button type="success" plain>Success</el-button>
    <p>{{ userStore.token }}</p>
    <el-button type="primary" @click="userStore.setToken('sdhdiwh12')"
      >登录</el-button
    >
    <el-button type="primary" @click="userStore.removeToken()">退出</el-button>
  </div>
</template>

<style scoped></style>
