<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

// Props
interface Props {
  query?: string
  is_public?: 0 | 1 | undefined
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  query: '',
  is_public: undefined,
  loading: false,
})

const emit = defineEmits<Emits>()

// Emits
interface Emits {
  search: [params: { query: string, is_public: 0 | 1 | undefined }]
  reset: []
}

// 响应式数据
const searchQuery = ref(props.query)
const isPublic = ref(props.is_public)

// 监听props变化
watch(() => props.query, (newVal) => {
  searchQuery.value = newVal
})

watch(() => props.is_public, (newVal) => {
  isPublic.value = newVal
})

// 防抖搜索
let searchTimer: number | null = null

function handleSearch() {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    emit('search', {
      query: searchQuery.value,
      is_public: isPublic.value,
    })
  }, 500)
}

function handleFilterChange() {
  emit('search', {
    query: searchQuery.value,
    is_public: isPublic.value,
  })
}

function handleSearchClick() {
  emit('search', {
    query: searchQuery.value,
    is_public: isPublic.value,
  })
}

function handleReset() {
  searchQuery.value = ''
  isPublic.value = undefined
  emit('reset')
}
</script>

<template>
  <el-card shadow="never" class="search-card">
    <el-form :inline="true" class="search-form">
      <el-form-item label="搜索">
        <el-input
          v-model="searchQuery"
          placeholder="搜索通知标题或内容..."
          :prefix-icon="Search"
          clearable
          style="width: 300px"
          @input="handleSearch"
        />
      </el-form-item>

      <el-form-item label="可见性">
        <el-select
          v-model="isPublic"
          placeholder="全部"
          clearable
          style="width: 120px"
          @change="handleFilterChange"
        >
          <el-option label="公开" :value="1" />
          <el-option label="私有" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearchClick">
          搜索
        </el-button>
        <el-button @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin: 0;
}

.search-form .el-form-item {
  margin-bottom: 0;
}
</style>
