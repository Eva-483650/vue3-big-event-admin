<script setup>
// 1.获取路由对象 router useRouter
// 2.获取路由参数 route useRoute
// import { useRouter, useRoute } from 'vue-router'
// import { useUserStore } from '@/stores' // 导入用户状态管理
// const router = useRouter()
// const route = useRoute()

// const userStore = useUserStore()
// const goList = () => {
//   // 路由跳转
//   router.push('/list')
//   console.log('goList', route)
// }
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
