<template>
  <page-container title="Article Management">
    <template #extra>
      <el-button plain>Add Article</el-button>
    </template>
    <template #contentText>
      <!-- 表单区域 -->
      <el-form>
        <el-form-item label="Channel:">
          <el-select>
            <!-- label是给用户看的，value是提交给后台的 -->
            <el-option label="news" value="111"></el-option>
            <el-option label="sport" value="222"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="State:">
          <el-select v-model="state">
            <el-option label="Published" value="已发布"></el-option>
            <el-option label="Draft" value="草稿"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
    </template>
  </page-container>
</template>

<script setup></script>
