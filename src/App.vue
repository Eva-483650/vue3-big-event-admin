<script setup>
import { onMounted } from 'vue'
import ThemeColor from '@/assets/styles/themeColor'
onMounted(() => {
  ThemeColor()
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
