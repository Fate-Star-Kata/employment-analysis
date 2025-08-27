<script setup lang="ts">
import { Motion } from 'motion-v'
import { Refresh, Plus, Search, Download, Upload } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')

// 数据概览统计
const statsData = reactive({
  onlineDataSources: 12,
  offlineDataSources: 3,
  dataQuality: 95.8,
  storageUsage: 78.5,
  todayGrowth: 2.3
})

// 数据源列表
const dataSources = ref([
  {
    id: 1,
    name: '学生信息数据库',
    type: 'MySQL',
    status: 'online',
    lastSync: '2024-01-15 10:30:00',
    records: 15420,
    description: '包含学生基本信息、成绩等数据'
  },
  {
    id: 2,
    name: '就业数据API',
    type: 'REST API',
    status: 'online',
    lastSync: '2024-01-15 09:45:00',
    records: 8930,
    description: '实时就业市场数据接口'
  },
  {
    id: 3,
    name: '企业招聘数据',
    type: '文件系统',
    status: 'offline',
    lastSync: '2024-01-14 18:20:00',
    records: 5670,
    description: '企业招聘需求和岗位信息'
  }
])

// 备份计划列表
const backupPlans = ref([
  {
    id: 1,
    name: '每日自动备份',
    type: '增量备份',
    schedule: '每日 02:00',
    status: 'active',
    lastBackup: '2024-01-15 02:00:00',
    nextBackup: '2024-01-16 02:00:00'
  },
  {
    id: 2,
    name: '周末完整备份',
    type: '完整备份',
    schedule: '每周日 01:00',
    status: 'active',
    lastBackup: '2024-01-14 01:00:00',
    nextBackup: '2024-01-21 01:00:00'
  }
])

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

// 方法
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const addDataSource = () => {
  ElMessage.info('添加数据源功能开发中')
}

const runQualityCheck = () => {
  ElMessage.info('数据质量检查功能开发中')
}

const createBackup = () => {
  ElMessage.info('创建备份功能开发中')
}

const getStatusType = (status: string) => {
  return status === 'online' ? 'success' : status === 'offline' ? 'danger' : 'warning'
}

const getStatusText = (status: string) => {
  return status === 'online' ? '在线' : status === 'offline' ? '离线' : '未知'
}
</script>

<template>
  <div class="data-management">
    <!-- 页面标题 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">数据管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" @click="refreshData">
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 数据概览统计 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-blue-600 text-sm font-medium">在线数据源</p>
              <p class="text-2xl font-bold text-blue-900 mt-2">{{ statsData.onlineDataSources }}</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-red-600 text-sm font-medium">离线数据源</p>
              <p class="text-2xl font-bold text-red-900 mt-2">{{ statsData.offlineDataSources }}</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-green-600 text-sm font-medium">数据质量</p>
              <p class="text-2xl font-bold text-green-900 mt-2">{{ statsData.dataQuality }}%</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-yellow-600 text-sm font-medium">存储使用率</p>
              <p class="text-2xl font-bold text-yellow-900 mt-2">{{ statsData.storageUsage }}%</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-purple-600 text-sm font-medium">今日增长</p>
              <p class="text-2xl font-bold text-purple-900 mt-2">+{{ statsData.todayGrowth }}%</p>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 数据源管理 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.7 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">数据源管理</span>
            <div class="flex gap-2">
              <el-input v-model="searchKeyword" placeholder="搜索数据源" :prefix-icon="Search"
                class="w-64" clearable />
              <el-button type="primary" :icon="Plus" @click="addDataSource">
                添加数据源
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="dataSources" stripe>
          <el-table-column prop="name" label="数据源名称" min-width="150" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="records" label="记录数" width="120">
            <template #default="{ row }">
              {{ row.records.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="lastSync" label="最后同步" width="180" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="success" v-if="row.status === 'offline'">启用</el-button>
              <el-button size="small" type="warning" v-else>测试连接</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </Motion>

    <!-- 数据质量管理和备份管理 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 数据质量管理 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">数据质量管理</span>
              <el-button type="primary" size="small" @click="runQualityCheck">
                运行质量检查
              </el-button>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">数据完整性</p>
                <p class="text-sm text-gray-600">检查数据字段完整性</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">98.5%</p>
                <p class="text-xs text-gray-500">优秀</p>
              </div>
            </div>

            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">数据准确性</p>
                <p class="text-sm text-gray-600">验证数据准确性</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">94.2%</p>
                <p class="text-xs text-gray-500">良好</p>
              </div>
            </div>

            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">数据一致性</p>
                <p class="text-sm text-gray-600">检查数据一致性</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-yellow-600">89.7%</p>
                <p class="text-xs text-gray-500">一般</p>
              </div>
            </div>
          </div>
        </el-card>
      </Motion>

      <!-- 备份管理 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.9 } as any">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">备份管理</span>
              <div class="flex gap-2">
                <el-button type="success" size="small" :icon="Download" @click="createBackup">
                  立即备份
                </el-button>
                <el-button type="warning" size="small" :icon="Upload">
                  恢复数据
                </el-button>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="plan in backupPlans" :key="plan.id"
              class="p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium">{{ plan.name }}</p>
                  <p class="text-sm text-gray-600">{{ plan.type }} - {{ plan.schedule }}</p>
                </div>
                <el-tag :type="plan.status === 'active' ? 'success' : 'info'">
                  {{ plan.status === 'active' ? '启用' : '禁用' }}
                </el-tag>
              </div>
              <div class="text-xs text-gray-500 space-y-1">
                <p>最后备份: {{ plan.lastBackup }}</p>
                <p>下次备份: {{ plan.nextBackup }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.data-management {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>