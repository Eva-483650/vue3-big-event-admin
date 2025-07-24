<template>
  <el-select v-model="modelValue">
    <!-- label是给用户看的，value是提交给后台的 -->
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :key="channel.id"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()

const modelValue = defineModel()
</script>
