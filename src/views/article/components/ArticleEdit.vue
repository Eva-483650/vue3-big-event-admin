<template>
  <!-- 抽屉 -->
  <el-drawer v-model="visibleDrawer" title="Add Article" size="50%">
    <!-- Article Form -->
    <el-form
      :model="formModel"
      ref="formRef"
      label-width="120px"
      style="margin-right: 16px"
    >
      <el-form-item label="Article Title" prop="title">
        <el-input
          v-model="formModel.title"
          placeholder="Enter Title"
        ></el-input>
      </el-form-item>
      <el-form-item label="Article Channel" prop="cate_id">
        <channel-select v-model="formModel.cate_id"></channel-select>
      </el-form-item>
      <!-- 封面和文本需要手动重置 -->
      <el-form-item label="Article Cover" prop="cover_img">
        <!--此处需要关闭element-plus 的自动上传，不需要配置action等参数
             语法：URL.createObjectURL(file) 创建一个指向指定 File 对象的URL-->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img class="avatar" v-if="imgUrl" :src="imgUrl" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="Article Content" prop="content">
        <div class="editor">
          <quill-editor
            ref="editRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="onPublish('已发布')">Publish</el-button>
        <el-button plain @click="onPublish('草稿')">Draft</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService } from '@/api/article'
import { artGetDetailService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import { artEditService } from '@/api/article'
import { ElMessage } from 'element-plus'

const formRef = ref()
const visibleDrawer = ref(false)
const emit = defineEmits(['success'])
const editRef = ref()
// 提交
const onPublish = async (state) => {
  formModel.value.state = state
  // 当前接口需要的是formdata对象
  const formData = new FormData()
  for (let key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // 编辑
    await artEditService(formData)
    ElMessage.success('Edit Success')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加
    await artPublishService(formData)
    ElMessage.success('Publish Success')
    visibleDrawer.value = false
    // 通知到父组件，重新渲染数据
    emit('success', 'add')
  }
}
// 图片上传
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  console.log(uploadFile)
  // 实现图片预览
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 立刻入formModel中
  formModel.value.cover_img = uploadFile.raw
  console.log(formModel.value)
}
// 提供数据
const defaultForm = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})
const formModel = ref({ ...defaultForm.value })
// row可以是添加还是编辑
const open = async (row) => {
  visibleDrawer.value = true //显示抽屉
  if (row.id) {
    // 编辑
    // 需要基于row.id发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片单独回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 后台需要file对象
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    // 添加 基于默认的重置表单数据
    formModel.value = { ...defaultForm.value }
    // 富文本编辑器和图片要手动重置
    imgUrl.value = ''
    editRef.value.setHTML('')
  }
}
defineExpose({ open })

// 将网络图片地址转换为File对象
//  @param {string} imageUrl - 网络图片的 URL 地址。
//  @param {string} [fileName] - 可选参数，指定生成的文件名。如果未提供，将尝试从 URL 中解析。
//  @returns {Promise<File>} 一个 Promise 对象，成功时解析为 File 对象，失败时抛出错误。
async function imageUrlToFile(imageUrl, fileName) {
  try {
    // 1. 使用 axios 发送 GET 请求获取图片数据
    // responseType: 'arraybuffer' 或 'blob' 用于获取二进制数据
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer' // 获取图片原始二进制数据
      // 也可以使用 responseType: 'blob'，直接获取 Blob 对象
      // 如果直接是 'blob'，则下面的 new Blob(...) 步骤可以省略，直接用 response.data
    })

    // 检查响应状态码是否表示成功 (2xx 范围)
    if (response.status !== 200) {
      throw new Error(
        `请求图片失败，状态码: ${response.status} - ${response.statusText}`
      )
    }

    // 从响应头中获取图片类型（MIME Type），例如 'image/jpeg', 'image/png'
    // 如果响应头没有提供，可以根据URL后缀或默认值来猜测
    const contentType =
      response.headers['content-type'] || 'application/octet-stream'

    // 2. 将获取到的二进制数据 (response.data) 转换为 Blob 对象
    // response.data 对于 arraybuffer 来说就是 ArrayBuffer
    const blob = new Blob([response.data], { type: contentType })

    // 3. 确定最终的文件名
    let finalFileName = fileName
    if (!finalFileName) {
      // 尝试从 URL 中提取文件名，去除查询参数（如果有）
      const urlParts = imageUrl.split('/')
      finalFileName = urlParts[urlParts.length - 1].split('?')[0]

      // 如果解析出来的文件名不合理（例如没有扩展名），则根据 MIME 类型推断一个默认文件名
      if (!finalFileName || finalFileName.indexOf('.') === -1) {
        const extension = contentType.split('/')[1] || 'png' // 默认使用png
        finalFileName = `downloaded_image.${extension}`
      }
    }

    // 4. 创建 File 对象
    // File 构造函数: new File(fileBits, fileName, options)
    // fileBits: Blob、BufferSource 或 String 类型的数组
    // fileName: 文件的名称
    // options: 包含 type (MIME 类型) 和 lastModified (最后修改时间) 的对象
    const file = new File([blob], finalFileName, {
      type: contentType,
      lastModified: Date.now() // 使用当前时间作为文件的最后修改时间
    })

    return file
  } catch (error) {
    console.error('将网络图片URL转换为File对象时发生错误:', error)
    // 重新抛出错误，以便调用者可以捕获和处理
    throw error
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
