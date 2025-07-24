<!-- 组件对外暴露一个方法open，
 基于open传阿里的参数，区份添加还是编辑
 open调用后可以打开弹窗 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? 'Edit' : 'Add'"
    width="500"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item
        label="Name"
        prop="cate_name"
        :label-width="formLabelWidth"
        style="padding-right: 24px"
      >
        <el-input
          v-model="formModel.cate_name"
          placeholder="Please input Channel name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Description"
        prop="cate_alias"
        :label-width="formLabelWidth"
        style="padding-right: 24px"
      >
        <!-- autocomplete off 禁用浏览器自动填充 -->
        <el-input
          v-model="formModel.cate_alias"
          placeholder="Please input channel description"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" plain>Cancel</el-button>
        <el-button @click="onSubmit" plain> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { artEditChannelService } from '@/api/article'
import { artAddChannelService } from '@/api/article'
import ThemeColor from '@/assets/styles/themeColor'
onMounted(() => {
  ThemeColor()
})
const formRef = ref()
const formLabelWidth = '100px'
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const emit = defineEmits(['success'])
const open = ({ row }) => {
  // params可以是添加还是编辑
  dialogVisible.value = true
  formModel.value = { ...row }
  console.log(row)
  console.log(formModel.value)
  // 添加 -> 重置表单内容 传递空内容
  // 编辑 -> 存储了需要回显的数据
}
const rules = reactive({
  cate_name: [
    { required: true, message: 'Please input Channel name', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: 'Channel name must be 1-10 characters',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: 'Please input Channel description',
      trigger: 'blur'
    },
    { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' }
  ]
})

const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    // 编辑
    await artEditChannelService(formModel.value)
    ElMessage.success('Edit Channel Success')
  } else {
    // 添加
    await artAddChannelService(formModel.value)
    ElMessage.success('Add Channel Success')
  }
  dialogVisible.value = false
  // 子传父
  emit('success')
}

defineExpose({ open })
</script>
