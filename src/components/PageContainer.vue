<!-- 定义一个组件 -->
<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <!-- #和name是具名插槽 -->
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- class不是具名插槽 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot name="contentText"></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  // border-box 让盒子不会再受到边框和内边距的增加而改变，
  // 即使添加了边框和内边距，元素在页面上的占据空间大小也会保持不变
  box-sizing: border-box;
  padding: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
