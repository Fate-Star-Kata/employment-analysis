<script setup lang="ts">
import type { FileItem } from '@/types/factory'
import {
  Delete,
  Document,
  Files,
  Headset,
  Picture,
  VideoPlay,
  View,
} from '@element-plus/icons-vue'

// Props
interface Props {
  file: FileItem
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// Emits
interface Emits {
  click: [file: FileItem]
  contextmenu: [event: MouseEvent, file: FileItem]
  viewDetail: [file: FileItem]
  delete: [file: FileItem]
}

// 方法
function handleClick() {
  emit('click', props.file)
}

function handleContextMenu(event: MouseEvent) {
  emit('contextmenu', event, props.file)
}

function handleViewDetail() {
  emit('viewDetail', props.file)
}

function handleDelete() {
  emit('delete', props.file)
}

function getFileIcon(fileType: string) {
  const iconMap: Record<string, any> = {
    image: Picture,
    document: Document,
    media: VideoPlay,
    audio: Headset,
    default: Files,
  }
  return iconMap[fileType] || iconMap.default
}

function getFileTypeLabel(fileType: string) {
  const labelMap: Record<string, string> = {
    image: '图片',
    document: '文档',
    media: '视频',
    audio: '音频',
    default: '文件',
  }
  return labelMap[fileType] || labelMap.default
}

function getFileTypeColor(fileType: string) {
  const colorMap: Record<string, string> = {
    image: 'success',
    document: 'info',
    media: 'warning',
    audio: 'danger',
    default: '',
  }
  return colorMap[fileType] || colorMap.default
}

function formatFileSize(size: number): string {
  if (size < 1024)
    return `${size} B`
  if (size < 1024 * 1024)
    return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatTime(time: string): string {
  return new Date(time).toLocaleString('zh-CN')
}

function getFileUrl(filePath: string): string {
  return `${import.meta.env.VITE_SERVER_PATH}/${filePath}`
}
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 ease-out overflow-hidden flex items-center p-4 gap-4 relative hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-400"
    @click="handleClick"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- 文件图标/预览 -->
    <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative bg-slate-50 flex items-center justify-center">
      <!-- 图片预览 -->
      <div v-if="file.file_type === 'image'" class="w-full h-full">
        <el-image
          :src="getFileUrl(file.file_path)"
          fit="cover"
          class="w-full h-full rounded-lg"
          :preview-src-list="[getFileUrl(file.file_path)]"
          :preview-teleported="true"
          :hide-on-click-modal="true"
          :z-index="9999"
          @click.stop
        />
      </div>
      <!-- 视频预览 -->
      <div v-else-if="file.file_type === 'media'" class="w-full h-full relative bg-black rounded-lg overflow-hidden">
        <video :src="getFileUrl(file.file_path)" class="w-full h-full object-cover" preload="metadata" muted>
          您的浏览器不支持视频播放
        </video>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center text-white backdrop-blur-sm">
          <el-icon :size="20">
            <VideoPlay />
          </el-icon>
        </div>
      </div>
      <!-- 其他文件类型图标 -->
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
        <el-icon :size="32" class="text-white drop-shadow-md">
          <component :is="getFileIcon(file.file_type)" />
        </el-icon>
      </div>
    </div>

    <!-- 文件信息 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-gray-900 truncate" :title="file.file_name">
          {{ file.file_name }}
        </h4>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <el-button size="small" text type="primary" @click.stop="handleViewDetail">
            <el-icon>
              <View />
            </el-icon>
          </el-button>
          <el-button size="small" text type="danger" @click.stop="handleDelete">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span class="px-2 py-1 bg-gray-100 rounded-full">{{ formatFileSize(file.file_size) }}</span>
        <span class="text-gray-400">•</span>
        <span>{{ formatTime(file.upload_time) }}</span>
      </div>
      <div class="flex items-center">
        <el-tag size="small" :type="getFileTypeColor(file.file_type)">
          {{ getFileTypeLabel(file.file_type) }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定样式 */
</style>
