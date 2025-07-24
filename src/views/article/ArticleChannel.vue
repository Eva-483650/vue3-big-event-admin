<template>
  <page-container title="Ariticle Channels">
    <template #extra>
      <el-button @click="onAddChannel" class="myButton">Add Channel</el-button>
    </template>
    <template #contentText>
      <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="channelList"
        height="480"
        stripe
        style="width: 100%"
        table-layout="fixed"
      >
        <el-table-column
          type="index"
          width="1"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="cate_name"
          label="Name"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="cate_alias"
          label="Description"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="Operation"
          min-width="120"
          header-align="center"
        >
          <template #default="{ row, $index }">
            <div style="display: flex; justify-content: center">
              <el-button
                @click="onEditChannel(row, $index)"
                :icon="Edit"
                circle
              />
              <el-button @click="onDelChannel(row)" :icon="Delete" circle />
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="Oops! I can't find your data..." />
        </template>
      </el-table>

      <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
    </template>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { artDelChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
const channelList = ref([])
const loading = ref(false)
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  console.log('接口返回', res)
  console.log('channelList', channelList.value[0])
}

getChannelList()

const onEditChannel = (row, index) => {
  console.log('Edit channel:', row, index)
  // Implement edit functionality here
  dialog.value.open({ row })
}

const onDelChannel = async (row) => {
  await ElMessageBox.confirm(
    'Are you sure you want to delete this?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
  await artDelChannelService(row.id)
  ElMessage.success('delete success')
  getChannelList()
}

const onAddChannel = () => {
  console.log('Add new channel')
  // Implement add functionality here
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<style lang="scss" scoped>
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

  /* 激活/按下状态 */
  &:active {
    background-color: var(--el-button-active-bg-color);
    border-color: var(--el-button-active-border-color);
    color: var(--el-button-active-text-color);
    transform: translateY(0); /* 恢复位置 */
    box-shadow: none; /* 移除阴影 */
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
