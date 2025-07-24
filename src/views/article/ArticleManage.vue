<template>
  <page-container title="Article Management">
    <template #extra>
      <el-button plain @click="onAddArticle" class="myButton"
        >Add Article</el-button
      >
    </template>
    <template #contentText>
      <!-- 表单区域 -->
      <el-form inline>
        <el-form-item
          label="Channel:"
          :label-width="labelWidth"
          style="width: 300px"
        >
          <channel-select v-model="params.cate_id"></channel-select>
        </el-form-item>
        <el-form-item
          label="State:"
          :label-width="labelWidth"
          style="width: 300px"
        >
          <el-select v-model="params.state">
            <el-option label="Published" value="已发布"></el-option>
            <el-option label="Draft" value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="onSearch">Search</el-button>
          <el-button plain @click="onReset">Reset</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="articleList"
        height="380"
        tripe
        style="width: 100%"
        table-layout="fixed"
      >
        <el-table-column
          prop="title"
          label="Article Title"
          header-align="center"
          align="center"
        >
          <!-- 链接 -->
          <template #default="{ row }">
            <el-link>{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="Channel"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="pub_date"
          label="Published Date"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            {{ formatTime(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="State"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="Operation"
          min-width="120px"
          header-align="center"
        >
          <template #default="{ row }">
            <div style="gap: 1px; display: flex; justify-content: center">
              <el-button @click="onEditArticle(row)" :icon="Edit" circle />
              <el-button @click="onDelArticle(row)" :icon="Delete" circle />
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="Oops! I can't find your data..." />
        </template>
      </el-table>

      <!-- 分页区域 -->
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="params.pagenum"
          v-model:page-size="params.pagesize"
          :page-sizes="[2, 3, 6, 8, 10]"
          size="small"
          background
          layout="jumper,total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; justify-content: end"
        />
      </div>

      <!-- 添加文章的抽屉 -->
      <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
    </template>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService } from '../../api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { artDeleteService } from '../../api/article'
const articleEditRef = ref()
const labelWidth = '60px'
const params = ref({
  cate_id: '',
  state: '',
  // 当前页
  pagenum: 1,
  // 每页显示多少条
  pagesize: 6
})
const articleList = ref([])
const total = ref(0)
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
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data.map((row) => ({
    ...row,
    // 修复：状态转换逻辑改为正确写法
    state: row.state === '已发布' ? 'Published' : 'draft'
  }))
  total.value = res.data.total
  loading.value = false
}
// 添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  // 渲染当前页
  getArticleList()
}
// 按照最新的条件重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 重置 清空 重新渲染
const onReset = () => {
  params.value = {
    cate_id: '',
    state: '',
    pagenum: 1,
    pagesize: 6
  }
  getArticleList()
}
const onAddArticle = () => {
  console.log('AddArticle')
  articleEditRef.value.open({})
}
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

const onDelArticle = async (row) => {
  await ElMessageBox.confirm(
    'Are you sure you want to delete this?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
  await artDeleteService(row.id)
  ElMessage.success('delete success')
  getArticleList()
}

getArticleList()

const handleSizeChange = (size) => {
  console.log(`${size} items per page`)
  // 条数变化要重新从第一页渲染
  params.value.pagenum = 1
  console.log(params.value.pagenum)
  params.value.pagesize = size
  // 基于最新的params参数重新获取文章列表数据
  getArticleList()
}
const handleCurrentChange = (page) => {
  console.log(`current page: ${page}`)
  params.value.pagenum = page // Update the current page number
  getArticleList() // Re-fetch the data
}
</script>

<style lang="scss" scoped>
.myButton {
  /* 基础颜色 */
  --el-button-bg-color: var(--fresh-serene-primary); /* 按钮背景色 */
  --el-button-text-color: #ffff; /* 按钮文字颜色 */
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
