<template>
  <page-container title="Ariticle Channels">
    <template #extra>
      <el-button @click="onAddChannel" plain>Add Channel</el-button>
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
        <el-table-column type="index" min-width="40" />
        <el-table-column prop="cate_name" label="Name" min-width="200" />
        <el-table-column
          prop="cate_alias"
          label="Description"
          min-width="400"
        />
        <el-table-column label="Operation" min-width="120">
          <template #default="{ row, $index }">
            <div style="display: flex; gap: 2px; justify-content: center">
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
  ElMessage.success('删除成功')
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
