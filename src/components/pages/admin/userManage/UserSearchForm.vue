<script setup lang="ts">
import { Plus, Refresh } from '@element-plus/icons-vue'
import { Motion } from 'motion-v'
import { ref, watch } from 'vue'
import Search from '@/components/icon/search.vue'

// Props
const props = defineProps({
  query: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['search', 'reset', 'add'])

// 响应式数据
const searchQuery = ref(props.query)

// 监听props变化
watch(() => props.query, (newVal) => {
  searchQuery.value = newVal
})

// 事件处理
function handleSearch() {
  emit('search', searchQuery.value)
}

function handleReset() {
  searchQuery.value = ''
  emit('reset')
}

function handleAdd() {
  emit('add')
}
</script>

<template>
  <div class="user-search-form relative">
    <!-- 加载蒙层 -->
    <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2" />
        <span class="text-xs text-gray-600">数据更新中...</span>
      </div>
    </div>

    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-input
          v-model="searchQuery"
          placeholder="请输入邮箱或用户名"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleReset"
        >
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-space>
          <Motion :while-hover="{ scale: 1.05 }" :while-tap="{ scale: 0.95 }">
            <el-button :disabled="loading" @click="handleReset">
              <el-icon>
                <Refresh />
              </el-icon>
              重置
            </el-button>
          </Motion>
          <Motion :while-hover="{ scale: 1.05 }" :while-tap="{ scale: 0.95 }">
            <el-button type="primary" :disabled="loading" @click="handleSearch">
              <Search size="12" />
              查询
            </el-button>
          </Motion>
          <Motion :while-hover="{ scale: 1.05 }" :while-tap="{ scale: 0.95 }">
            <el-button type="success" :disabled="loading" @click="handleAdd">
              <el-icon>
                <Plus />
              </el-icon>
              添加
            </el-button>
          </Motion>
        </el-space>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.user-search-form {
  .el-button {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
