<script setup lang="ts">
import { Motion } from 'motion-v'
import { Refresh, Search, Download, Delete, View, Filter } from '@element-plus/icons-vue'
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterVisible = ref(false)
const selectedRecords = ref<number[]>([])
const filterFormRef = ref<FormInstance>()

// 预测统计数据
const statsData = reactive({
  totalPredictions: 1248,
  todayPredictions: 23,
  successRate: 87.5,
  avgAccuracy: 92.3,
  activeModels: 5
})

// 筛选表单
const filterForm = reactive({
  dateRange: [],
  status: '',
  accuracy: '',
  model: '',
  userId: ''
})

// 预测记录列表
const predictionRecords = ref([
  {
    id: 1,
    userId: 'U001',
    userName: '张三',
    predictionType: '就业预测',
    model: 'RandomForest_v2.1',
    inputData: '计算机科学与技术专业，GPA: 3.8，实习经验: 2次',
    result: '高就业概率',
    accuracy: 94.2,
    confidence: 0.89,
    status: 'completed',
    createdAt: '2024-01-15 14:30:00',
    duration: 1.2
  },
  {
    id: 2,
    userId: 'U002',
    userName: '李四',
    predictionType: '薪资预测',
    model: 'XGBoost_v1.8',
    inputData: '软件工程专业，GPA: 3.6，项目经验: 3个',
    result: '预期薪资: 8000-12000元',
    accuracy: 91.7,
    confidence: 0.85,
    status: 'completed',
    createdAt: '2024-01-15 13:45:00',
    duration: 0.8
  },
  {
    id: 3,
    userId: 'U003',
    userName: '王五',
    predictionType: '行业匹配',
    model: 'NeuralNetwork_v3.0',
    inputData: '数据科学专业，GPA: 3.9，技能: Python, R, SQL',
    result: '互联网行业匹配度: 95%',
    accuracy: 88.9,
    confidence: 0.92,
    status: 'processing',
    createdAt: '2024-01-15 15:20:00',
    duration: null
  },
  {
    id: 4,
    userId: 'U004',
    userName: '赵六',
    predictionType: '就业预测',
    model: 'RandomForest_v2.1',
    inputData: '机械工程专业，GPA: 3.4，证书: 2个',
    result: '中等就业概率',
    accuracy: 86.3,
    confidence: 0.78,
    status: 'failed',
    createdAt: '2024-01-15 12:10:00',
    duration: 2.1
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

// 计算属性
const filteredRecords = computed(() => {
  let records = predictionRecords.value

  if (searchKeyword.value) {
    records = records.filter(record =>
      record.userName.includes(searchKeyword.value) ||
      record.predictionType.includes(searchKeyword.value) ||
      record.model.includes(searchKeyword.value)
    )
  }

  return records
})

// 方法
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const showFilter = () => {
  filterVisible.value = true
}

const applyFilter = () => {
  ElMessage.info('筛选功能开发中')
  filterVisible.value = false
}

const resetFilter = () => {
  filterFormRef.value?.resetFields()
}

const viewDetail = (record: any) => {
  ElMessage.info(`查看预测详情: ${record.id}`)
}

const deleteRecord = (record: any) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${record.userName} 的预测记录吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const batchDelete = () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRecords.value.length} 条记录吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    selectedRecords.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const exportData = () => {
  ElMessage.info('数据导出功能开发中')
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'processing': return 'warning'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'processing': return '处理中'
    case 'failed': return '失败'
    default: return '未知'
  }
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 90) return 'text-green-600'
  if (accuracy >= 80) return 'text-blue-600'
  if (accuracy >= 70) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

<template>
  <div class="prediction-history">
    <!-- 页面标题 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">预测历史管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" @click="refreshData">
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 预测统计概览 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-blue-600 text-sm font-medium">总预测次数</p>
              <p class="text-2xl font-bold text-blue-900 mt-2">{{ statsData.totalPredictions.toLocaleString() }}</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-green-600 text-sm font-medium">今日预测</p>
              <p class="text-2xl font-bold text-green-900 mt-2">{{ statsData.todayPredictions }}</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-purple-600 text-sm font-medium">成功率</p>
              <p class="text-2xl font-bold text-purple-900 mt-2">{{ statsData.successRate }}%</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-yellow-600 text-sm font-medium">平均准确率</p>
              <p class="text-2xl font-bold text-yellow-900 mt-2">{{ statsData.avgAccuracy }}%</p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-indigo-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-indigo-600 text-sm font-medium">活跃模型</p>
              <p class="text-2xl font-bold text-indigo-900 mt-2">{{ statsData.activeModels }}</p>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 预测记录管理 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.7 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">预测记录</span>
            <div class="flex gap-2">
              <el-input v-model="searchKeyword" placeholder="搜索用户名、预测类型或模型" :prefix-icon="Search" class="w-80"
                clearable />
              <el-button :icon="Filter" @click="showFilter">筛选</el-button>
              <el-button type="success" :icon="Download" @click="exportData">导出</el-button>
              <el-button type="danger" :icon="Delete" @click="batchDelete" :disabled="selectedRecords.length === 0">
                批量删除
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredRecords" stripe
          @selection-change="(val: any[]) => selectedRecords = val.map(v => v.id)">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="userName" label="用户" width="100" />
          <el-table-column prop="predictionType" label="预测类型" width="120" />
          <el-table-column prop="model" label="模型" width="150" />
          <el-table-column prop="inputData" label="输入数据" min-width="200" show-overflow-tooltip />
          <el-table-column prop="result" label="预测结果" min-width="180" show-overflow-tooltip />
          <el-table-column prop="accuracy" label="准确率" width="100">
            <template #default="{ row }">
              <span :class="getAccuracyColor(row.accuracy)" class="font-medium">
                {{ row.accuracy }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="confidence" label="置信度" width="100">
            <template #default="{ row }">
              {{ (row.confidence * 100).toFixed(1) }}%
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="160" />
          <el-table-column prop="duration" label="耗时(s)" width="100">
            <template #default="{ row }">
              {{ row.duration || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" :icon="View" @click="viewDetail(row)">
                详情
              </el-button>
              <el-button size="small" type="danger" :icon="Delete" @click="deleteRecord(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </Motion>

    <!-- 筛选对话框 -->
    <el-dialog v-model="filterVisible" title="筛选条件" width="500px">
      <el-form ref="filterFormRef" :model="filterForm" label-width="100px">
        <el-form-item label="时间范围" prop="dateRange">
          <el-date-picker v-model="filterForm.dateRange" type="datetimerange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" class="w-full" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="选择状态" class="w-full" clearable>
            <el-option label="已完成" value="completed" />
            <el-option label="处理中" value="processing" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>

        <el-form-item label="准确率" prop="accuracy">
          <el-select v-model="filterForm.accuracy" placeholder="选择准确率范围" class="w-full" clearable>
            <el-option label="90% 以上" value="90+" />
            <el-option label="80% - 90%" value="80-90" />
            <el-option label="70% - 80%" value="70-80" />
            <el-option label="70% 以下" value="70-" />
          </el-select>
        </el-form-item>

        <el-form-item label="模型" prop="model">
          <el-select v-model="filterForm.model" placeholder="选择模型" class="w-full" clearable>
            <el-option label="RandomForest v2.1" value="RandomForest_v2.1" />
            <el-option label="XGBoost v1.8" value="XGBoost_v1.8" />
            <el-option label="NeuralNetwork v3.0" value="NeuralNetwork_v3.0" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="filterForm.userId" placeholder="输入用户ID" clearable />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="resetFilter">重置</el-button>
          <el-button @click="filterVisible = false">取消</el-button>
          <el-button type="primary" @click="applyFilter">应用筛选</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.prediction-history {
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

/* 表格优化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

/* 对话框优化 */
.el-dialog {
  border-radius: 12px;
}
</style>