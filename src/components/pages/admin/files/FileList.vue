<script setup lang="ts">
import type { FileItem as FileItemType } from '@/types/factory'
import { reactive } from 'vue'
import FileItem from './FileItem.vue'

// Props
interface Props {
  fileList: FileItemType[]
  loading: boolean
  fileStats: {
    total: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// Emits
interface Emits {
  fileClick: [file: FileItemType]
  fileContextMenu: [event: MouseEvent, file: FileItemType]
  areaContextMenu: [event: MouseEvent]
  viewDetail: [file: FileItemType]
  delete: [file: FileItemType]
  sizeChange: [size: number]
  currentChange: [page: number]
}

// 响应式数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
})

// 方法
function handleFileClick(file: FileItemType) {
  emit('fileClick', file)
}

function handleFileContextMenu(event: MouseEvent, file: FileItemType) {
  emit('fileContextMenu', event, file)
}

function handleAreaContextMenu(event: MouseEvent) {
  // 检查是否点击在文件项上
  const target = event.target as HTMLElement
  if (target.closest('.file-item')) {
    return
  }
  emit('areaContextMenu', event)
}

function handleViewDetail(file: FileItemType) {
  emit('viewDetail', file)
}

function handleDelete(file: FileItemType) {
  emit('delete', file)
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  emit('sizeChange', size)
}

function handleCurrentChange(page: number) {
  pagination.page = page
  emit('currentChange', page)
}

// 暴露分页数据给父组件
defineExpose({
  pagination,
})
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg" @contextmenu.prevent="handleAreaContextMenu">
    <div v-loading="loading" class="w-full">
      <transition-group
        name="file-item"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1"
      >
        <FileItem
          v-for="file in fileList"
          :key="file.id"
          :file="file"
          @click="handleFileClick"
          @contextmenu="handleFileContextMenu"
          @view-detail="handleViewDetail"
          @delete="handleDelete"
        />
      </transition-group>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!loading && fileList.length === 0" description="暂无文件" />

    <!-- 分页 -->
    <div v-if="fileStats.total > 0" class="flex justify-center mt-6">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="fileStats.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* 文件项过渡动画 */
.file-item-enter-active,
.file-item-leave-active {
  transition: all 0.3s ease;
}

.file-item-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.file-item-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
