<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type {
  PredictionHistoryListRequest,
  PredictionRecord,
  PredictionStats,
  PredictionType,
} from '@/types/apis/prediction'
import { Delete, Download, Filter, Refresh, Search, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Motion } from 'motion-v'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  batchDeletePredictionRecordsAPI,
  deletePredictionRecordAPI,
  exportPredictionRecordsAPI,
  getPredictionHistoryDetailAPI,
  getPredictionHistoryListAPI,
} from '@/api/admin/prediction'

const loading = ref(false)
const searchKeyword = ref('')
const filterVisible = ref(false)
const selectedRecords = ref<number[]>([])

// 详情弹窗相关状态
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<any>(null)
const filterFormRef = ref<FormInstance>()

// 预测统计数据
const statsData = ref<PredictionStats>({
  total_predictions: 0,
  today_predictions: 0,
  success_rate: 0,
  average_accuracy: 0,
  active_models: 0,
})

// 筛选表单
const filterForm = reactive({
  predictionType: '',
  dateRange: [],
})

// 预测记录列表
const predictionRecords = ref<PredictionRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] },
  },
  transition: { duration: 0.4, ease: ['easeOut'] },
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] },
  },
  transition: { duration: 0.5, ease: ['easeOut'] },
}

// 计算属性
const filteredRecords = computed(() => {
  let records = predictionRecords.value

  if (searchKeyword.value) {
    records = records.filter(record =>
      record.user_name.includes(searchKeyword.value)
      || record.prediction_type.includes(searchKeyword.value)
      || record.model_used.includes(searchKeyword.value),
    )
  }

  return records
})

// 获取预测历史列表
async function fetchPredictionHistory() {
  try {
    loading.value = true
    const params: PredictionHistoryListRequest = {
      page: currentPage.value,
      page_size: pageSize.value,
      type: filterForm.predictionType as PredictionType || undefined,
      start_date: filterForm.dateRange?.[0] || undefined,
      end_date: filterForm.dateRange?.[1] || undefined,
    }

    const response = await getPredictionHistoryListAPI(params)
    predictionRecords.value = response.data.records || []
    total.value = response.data.total || 0

    // 计算统计数据
    const records = response.data.records || []
    statsData.value = {
      total_predictions: response.data.total || 0,
      today_predictions: records.filter((r) => {
        const today = new Date().toISOString().split('T')[0]
        return r.created_at.startsWith(today)
      }).length,
      success_rate: records.length > 0 ? 100 : 0, // 假设所有记录都是成功的
      average_accuracy: records.length > 0
        ? Math.round(records.reduce((sum, r) => sum + (r.confidence_score * 100), 0) / records.length)
        : 0,
      active_models: new Set(records.map(r => r.model_used)).size,
    }
  }
  catch (error) {
    ElMessage.error('获取预测历史失败')
  }
  finally {
    loading.value = false
  }
}

// 方法
function refreshData() {
  fetchPredictionHistory()
}

function searchData() {
  currentPage.value = 1
  fetchPredictionHistory()
}

function showFilter() {
  filterVisible.value = true
}

function applyFilter() {
  currentPage.value = 1
  fetchPredictionHistory()
  filterVisible.value = false
}

function resetFilter() {
  filterForm.predictionType = ''
  filterForm.dateRange = []
  applyFilter()
}

async function viewDetail(record: PredictionRecord) {
  try {
    detailLoading.value = true
    detailVisible.value = true
    const response = await getPredictionHistoryDetailAPI(record.id)
    detailData.value = response.data
  }
  catch (error) {
    ElMessage.error('获取预测详情失败')
    detailVisible.value = false
  }
  finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailVisible.value = false
  detailData.value = null
}

function deleteRecord(record: PredictionRecord) {
  ElMessageBox.confirm(
    `确定要删除用户 ${record.user_name} 的预测记录吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async () => {
    try {
      await deletePredictionRecordAPI(record.id)
      ElMessage.success('删除成功')
      fetchPredictionHistory()
    }
    catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

function batchDelete() {
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
    },
  ).then(async () => {
    try {
      await batchDeletePredictionRecordsAPI(selectedRecords.value)
      selectedRecords.value = []
      ElMessage.success('批量删除成功')
      fetchPredictionHistory()
    }
    catch (error) {
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

async function exportData() {
  try {
    const params = {
      keyword: searchKeyword.value || undefined,
      start_date: filterForm.dateRange?.[0] || undefined,
      end_date: filterForm.dateRange?.[1] || undefined,
    }

    const response = await exportPredictionRecordsAPI(params)

    // 创建下载链接
    const blob = response
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `prediction_records_${new Date().getTime()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  }
  catch (error) {
    ElMessage.error('导出失败')
  }
}

function getStatusType(status: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'processing': return 'warning'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed': return '已完成'
    case 'processing': return '处理中'
    case 'failed': return '失败'
    default: return '未知'
  }
}

function getAccuracyColor(accuracy: number) {
  if (accuracy >= 90)
    return 'text-green-600'
  if (accuracy >= 80)
    return 'text-blue-600'
  if (accuracy >= 70)
    return 'text-yellow-600'
  return 'text-red-600'
}

// 页面加载时获取数据
onMounted(() => {
  fetchPredictionHistory()
})
</script>

<template>
  <div class="prediction-history">
    <!-- 页面标题 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
      :while-hover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">预测历史管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :while-hover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" @click="refreshData">
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 预测统计概览 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-blue-600 text-sm font-medium">
                总预测次数
              </p>
              <p class="text-2xl font-bold text-blue-900 mt-2">
                {{ statsData.total_predictions.toLocaleString() }}
              </p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-green-600 text-sm font-medium">
                今日预测
              </p>
              <p class="text-2xl font-bold text-green-900 mt-2">
                {{ statsData.today_predictions }}
              </p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-purple-600 text-sm font-medium">
                成功率
              </p>
              <p class="text-2xl font-bold text-purple-900 mt-2">
                {{ statsData.success_rate }}%
              </p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-yellow-600 text-sm font-medium">
                平均准确率
              </p>
              <p class="text-2xl font-bold text-yellow-900 mt-2">
                {{ statsData.average_accuracy }}%
              </p>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-indigo-50 p-6 rounded-lg cursor-pointer">
            <div class="text-center">
              <p class="text-indigo-600 text-sm font-medium">
                活跃模型
              </p>
              <p class="text-2xl font-bold text-indigo-900 mt-2">
                {{ statsData.active_models }}
              </p>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 预测记录管理 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
      :while-hover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.7 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">预测记录</span>
            <div class="flex gap-2">
              <el-input v-model="searchKeyword" placeholder="搜索用户名、预测类型或模型" :prefix-icon="Search" class="w-80" clearable
                @keyup.enter="searchData" />
              <el-button type="primary" :icon="Search" @click="searchData">
                查询
              </el-button>
              <el-button :icon="Filter" @click="showFilter">
                筛选
              </el-button>
              <el-button type="success" :icon="Download" @click="exportData">
                导出
              </el-button>
              <el-button type="danger" :icon="Delete" :disabled="selectedRecords.length === 0" @click="batchDelete">
                批量删除
              </el-button>
            </div>
          </div>
        </template>

        <el-table v-loading="loading" :data="filteredRecords" stripe
          @selection-change="(val: any[]) => selectedRecords = val.map(v => v.id)">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="prediction_type" label="预测类型" width="120" />
          <el-table-column prop="model_used" label="模型" width="150" />
          <el-table-column label="预测结果" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <div>
                <div>就业成功率: {{ (row.employment_success_rate * 100).toFixed(1) }}%</div>
                <div>预测薪资: {{ row.predicted_salary_min }}-{{ row.predicted_salary_max }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="准确率" width="100">
            <template #default="{ row }">
              <span :class="getAccuracyColor(row.confidence_score * 100)" class="font-medium">
                {{ (row.confidence_score * 100).toFixed(1) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="confidence_score" label="置信度" width="100">
            <template #default="{ row }">
              {{ (row.confidence_score * 100).toFixed(1) }}%
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="160" />
          <el-table-column prop="predicted_job_duration" label="预测工作时长" width="120">
            <template #default="{ row }">
              {{ row.predicted_job_duration ? `${row.predicted_job_duration}个月` : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right">
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

        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchPredictionHistory"
            @current-change="fetchPredictionHistory" />
        </div>
      </el-card>
    </Motion>

    <!-- 筛选对话框 -->
    <el-dialog v-model="filterVisible" title="筛选条件" width="500px">
      <el-form ref="filterFormRef" :model="filterForm" label-width="100px">
        <el-form-item label="预测类型" prop="predictionType">
          <el-select v-model="filterForm.predictionType" placeholder="选择预测类型" class="w-full" clearable>
            <el-option label="就业成功率" value="employment_rate" />
            <el-option label="薪资预测" value="salary_prediction" />
            <el-option label="求职时长" value="job_duration" />
            <el-option label="综合预测" value="comprehensive" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围" prop="dateRange">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" class="w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="resetFilter">
            重置
          </el-button>
          <el-button @click="filterVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="applyFilter">
            应用筛选
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="预测详情" width="800px" :close-on-click-modal="true" @close="closeDetail">
      <div v-loading="detailLoading" class="detail-content">
        <div v-if="detailData" class="space-y-6">
          <!-- 基础信息 -->
          <div class="info-section">
            <h3 class="section-title">
              基础信息
            </h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">预测ID:</span>
                <span class="value">{{ detailData.id }}</span>
              </div>
              <div class="info-item">
                <span class="label">预测类型:</span>
                <span class="value">{{ detailData.prediction_type }}</span>
              </div>
              <div class="info-item">
                <span class="label">模型信息:</span>
                <span class="value">使用{{ detailData.model_used }}模型(v{{ detailData.model_version }})</span>
              </div>
              <div class="info-item">
                <span class="label">置信度:</span>
                <span class="value">{{ (detailData.confidence_score * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <!-- 预测结果详情 -->
          <div class="info-section">
            <h3 class="section-title">
              预测结果详情
            </h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">预计工作时长:</span>
                <span class="value">{{ detailData.predicted_job_duration }}个月</span>
              </div>
              <div class="info-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ detailData.created_at }}</span>
              </div>
              <div v-if="detailData.employment_success_rate" class="info-item">
                <span class="label">就业成功率:</span>
                <span class="value">{{ (detailData.employment_success_rate * 100).toFixed(1) }}%</span>
              </div>
              <div v-if="detailData.predicted_salary_min && detailData.predicted_salary_max" class="info-item">
                <span class="label">预测薪资范围:</span>
                <span class="value">{{ detailData.predicted_salary_min }}-{{ detailData.predicted_salary_max }}</span>
              </div>
            </div>
          </div>

          <!-- 输入数据快照 -->
          <div v-if="detailData.input_data_snapshot" class="info-section">
            <h3 class="section-title">
              输入数据快照
            </h3>
            <div class="snapshot-content">
              <!-- 个人资料 -->
              <div v-if="detailData.input_data_snapshot.profile_data" class="subsection">
                <h4 class="subsection-title">
                  个人资料
                </h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">专业:</span>
                    <span class="value">{{ detailData.input_data_snapshot.profile_data.major }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">毕业年份:</span>
                    <span class="value">{{ detailData.input_data_snapshot.profile_data.graduation_year }}</span>
                  </div>
                </div>
              </div>

              <!-- 能力评估 -->
              <div v-if="detailData.input_data_snapshot.profile_data?.abilities" class="subsection">
                <h4 class="subsection-title">
                  能力评估
                </h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">技术能力:</span>
                    <span class="value">{{ detailData.input_data_snapshot.profile_data.abilities.technical }}/10</span>
                  </div>
                  <div class="info-item">
                    <span class="label">沟通能力:</span>
                    <span class="value">{{ detailData.input_data_snapshot.profile_data.abilities.communication
                      }}/10</span>
                  </div>
                </div>
              </div>

              <!-- 搜索参数 -->
              <div v-if="detailData.input_data_snapshot.search_params" class="subsection">
                <h4 class="subsection-title">
                  搜索参数
                </h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">强度:</span>
                    <span class="value">{{ detailData.input_data_snapshot.search_params.intensity }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">目标行业:</span>
                    <span class="value">{{ detailData.input_data_snapshot.search_params.target_industry }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <el-button @click="closeDetail">
            关闭
          </el-button>
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

/* 详情弹窗样式 */
.detail-content {
  min-height: 200px;
}

.info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.subsection {
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-item .label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
  margin-right: 12px;
}

.info-item .value {
  color: #303133;
  font-weight: 400;
  word-break: break-all;
}

.snapshot-content {
  background: white;
  border-radius: 6px;
  padding: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-item .label {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 4px;
  }
}
</style>
