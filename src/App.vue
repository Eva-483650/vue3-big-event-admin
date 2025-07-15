<script setup>
// 1.获取路由对象 router useRouter
// 2.获取路由参数 route useRoute
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const goList = () => {
  // 路由跳转
  router.push('/list')
  console.log('goList', route)
}
</script>

<template>
  <div>
    我是app
    <button @click="goList">jump to list</button>
  </div>
</template>

<style scoped></style>
