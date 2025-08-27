<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

const footerText = import.meta.env.VITE_APP_FOOTER || '版权所有 © 2025 HZSYSTEM'

// 类型定义
interface PredictionRecord {
  id: number
  date: string
  time: string
  type: 'salary' | 'job-search' | 'career' | 'skill'
  title: string
  description: string
  predictedResult: string
  actualResult: string | null
  accuracy: number | null
  status: 'verified' | 'pending' | 'expired'
}

interface Filters {
  type: string
  status: string
  timeRange: string
  accuracy: string
}

interface TypeStats {
  type: string
  label: string
  count: number
  percentage: number
}

// RevealMotion 组件定义
interface RevealProps { delay?: number }
const RevealMotion = defineComponent<RevealProps>({
  name: 'RevealMotion',
  props: { delay: { type: Number, default: 0 } },
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null)
    const inView = ref(false)
    let io: IntersectionObserver | null = null

    const animateProps = computed(() => {
      return inView.value
        ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: props.delay } }
        : { opacity: 0, y: 16 }
    })

    onMounted(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              inView.value = true
              io?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.05 },
      )
      if (el.value)
        io.observe(el.value)
    })

    onBeforeUnmount(() => io?.disconnect())

    return () =>
      h(
        'div',
        { ref: el },
        [
          h(
            Motion as any,
            {
              initial: { opacity: 0, y: 16 },
              animate: animateProps.value,
            },
            slots,
          ),
        ],
      )
  },
})

// 数据定义
const statistics = {
  totalPredictions: 24,
  averageAccuracy: 78,
  successfulPredictions: 18,
  lastPredictionDays: 3,
}

const filters = ref<Filters>({
  type: 'all',
  status: 'all',
  timeRange: 'all',
  accuracy: 'all',
})

const currentPage = ref(1)
const totalPages = ref(3)

const predictionRecords: PredictionRecord[] = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    type: 'salary',
    title: '前端开发薪资预测',
    description: '基于当前技能水平预测在杭州地区的薪资范围',
    predictedResult: '¥8,000-12,000',
    actualResult: '¥9,500',
    accuracy: 85,
    status: 'verified',
  },
  {
    id: 2,
    date: '2024-01-10',
    time: '09:15',
    type: 'job-search',
    title: '求职时长预测',
    description: '预测找到合适工作所需的时间',
    predictedResult: '2-3个月',
    actualResult: '2.5个月',
    accuracy: 92,
    status: 'verified',
  },
  {
    id: 3,
    date: '2024-01-08',
    time: '16:45',
    type: 'career',
    title: '职业发展路径预测',
    description: '预测未来3年的职业发展方向',
    predictedResult: '高级前端工程师',
    actualResult: null,
    accuracy: null,
    status: 'pending',
  },
  {
    id: 4,
    date: '2024-01-05',
    time: '11:20',
    type: 'skill',
    title: '技能提升建议',
    description: '基于市场需求预测需要提升的技能',
    predictedResult: 'React高级特性',
    actualResult: '已学习完成',
    accuracy: 88,
    status: 'verified',
  },
  {
    id: 5,
    date: '2024-01-03',
    time: '13:10',
    type: 'salary',
    title: '薪资增长预测',
    description: '预测技能提升后的薪资增长幅度',
    predictedResult: '+15%',
    actualResult: null,
    accuracy: null,
    status: 'pending',
  },
]

const predictionTypeStats: TypeStats[] = [
  { type: 'salary', label: '薪资预测', count: 8, percentage: 33 },
  { type: 'job-search', label: '求职时长', count: 6, percentage: 25 },
  { type: 'career', label: '职业发展', count: 5, percentage: 21 },
  { type: 'skill', label: '技能评估', count: 5, percentage: 21 },
]

const filteredRecords = computed(() => {
  // 这里可以根据filters进行筛选
  return predictionRecords
})

const selectedRecord = ref<PredictionRecord | null>(null)
const detailModal = ref<HTMLDialogElement | null>(null)

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'salary': '薪资预测',
    'job-search': '求职时长',
    'career': '职业发展',
    'skill': '技能评估',
  }
  return labels[type] || type
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    verified: '已验证',
    pending: '待验证',
    expired: '已过期',
  }
  return labels[status] || status
}

function applyFilters() {
  console.log('应用筛选条件:', filters.value)
  // 这里可以调用API应用筛选条件
}

function resetFilters() {
  filters.value = {
    type: 'all',
    status: 'all',
    timeRange: 'all',
    accuracy: 'all',
  }
}

function exportData() {
  console.log('导出数据')
  // 这里可以实现数据导出功能
}

function viewDetails(recordId: number) {
  selectedRecord.value = predictionRecords.find(r => r.id === recordId) || null
  detailModal.value?.showModal()
}

function closeDetailModal() {
  detailModal.value?.close()
  selectedRecord.value = null
}

function verifyResult(recordId: number) {
  console.log('验证结果:', recordId)
  // 这里可以打开验证结果的表单
}

function compareResult(recordId: number) {
  console.log('对比结果:', recordId)
  // 这里可以打开结果对比页面
}
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-base-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            📊 预测历史记录
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg opacity-70 max-w-2xl mx-auto text-gray-600">
            查看您的历史预测记录，分析预测准确性和趋势变化
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 统计概览 -->
      <RevealMotion :delay="0.2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                📈
              </div>
              <h3 class="text-lg font-semibold mb-2">
                总预测次数
              </h3>
              <div class="text-2xl font-bold">
                {{ statistics.totalPredictions }}
              </div>
              <div class="text-sm opacity-80">
                累计预测记录
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                🎯
              </div>
              <h3 class="text-lg font-semibold mb-2">
                平均准确率
              </h3>
              <div class="text-2xl font-bold">
                {{ statistics.averageAccuracy }}%
              </div>
              <div class="text-sm opacity-80">
                预测准确度
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-accent to-accent-focus text-accent-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                ✅
              </div>
              <h3 class="text-lg font-semibold mb-2">
                成功预测
              </h3>
              <div class="text-2xl font-bold">
                {{ statistics.successfulPredictions }}
              </div>
              <div class="text-sm opacity-80">
                准确预测数量
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-info to-info-focus text-info-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                📅
              </div>
              <h3 class="text-lg font-semibold mb-2">
                最近预测
              </h3>
              <div class="text-2xl font-bold">
                {{ statistics.lastPredictionDays }}
              </div>
              <div class="text-sm opacity-80">
                天前
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 筛选和搜索 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🔍 筛选条件
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">预测类型</span>
                </label>
                <select v-model="filters.type" class="select select-bordered">
                  <option value="all">
                    全部类型
                  </option>
                  <option value="salary">
                    薪资预测
                  </option>
                  <option value="job-search">
                    求职时长
                  </option>
                  <option value="career">
                    职业发展
                  </option>
                  <option value="skill">
                    技能评估
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">预测状态</span>
                </label>
                <select v-model="filters.status" class="select select-bordered">
                  <option value="all">
                    全部状态
                  </option>
                  <option value="pending">
                    待验证
                  </option>
                  <option value="verified">
                    已验证
                  </option>
                  <option value="expired">
                    已过期
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">时间范围</span>
                </label>
                <select v-model="filters.timeRange" class="select select-bordered">
                  <option value="all">
                    全部时间
                  </option>
                  <option value="week">
                    最近一周
                  </option>
                  <option value="month">
                    最近一月
                  </option>
                  <option value="quarter">
                    最近三月
                  </option>
                  <option value="year">
                    最近一年
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">准确率范围</span>
                </label>
                <select v-model="filters.accuracy" class="select select-bordered">
                  <option value="all">
                    全部范围
                  </option>
                  <option value="high">
                    高准确率(>80%)
                  </option>
                  <option value="medium">
                    中等准确率(60-80%)
                  </option>
                  <option value="low">
                    低准确率(<60%)
                  </option>
                </select>
              </div>
            </div>

            <div class="flex gap-3">
              <button class="btn btn-primary" @click="applyFilters">
                🔍 应用筛选
              </button>
              <button class="btn btn-secondary" @click="resetFilters">
                🔄 重置筛选
              </button>
              <button class="btn btn-info" @click="exportData">
                📊 导出数据
              </button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 预测记录列表 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              📋 预测记录
            </h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>预测时间</th>
                    <th>预测类型</th>
                    <th>预测内容</th>
                    <th>预测结果</th>
                    <th>实际结果</th>
                    <th>准确率</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in filteredRecords" :key="record.id">
                    <td>
                      <div class="text-sm">
                        <div class="font-medium">
                          {{ record.date }}
                        </div>
                        <div class="opacity-60">
                          {{ record.time }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        class="badge" :class="[
                          record.type === 'salary' ? 'badge-success'
                          : record.type === 'job-search' ? 'badge-info'
                            : record.type === 'career' ? 'badge-warning' : 'badge-secondary',
                        ]"
                      >
                        {{ getTypeLabel(record.type) }}
                      </div>
                    </td>
                    <td>
                      <div class="text-sm max-w-xs">
                        <div class="font-medium">
                          {{ record.title }}
                        </div>
                        <div class="opacity-60 truncate">
                          {{ record.description }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="text-sm font-medium">
                        {{ record.predictedResult }}
                      </div>
                    </td>
                    <td>
                      <div class="text-sm">
                        <span v-if="record.actualResult" class="font-medium">{{ record.actualResult }}</span>
                        <span v-else class="opacity-60">待验证</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="record.accuracy !== null" class="flex items-center gap-2">
                        <div
                          class="radial-progress text-xs" :class="[
                            record.accuracy >= 80 ? 'text-success'
                            : record.accuracy >= 60 ? 'text-warning' : 'text-error',
                          ]" :style="`--value:${record.accuracy}`"
                        >
                          {{ record.accuracy }}%
                        </div>
                      </div>
                      <div v-else class="text-sm opacity-60">
                        -
                      </div>
                    </td>
                    <td>
                      <div
                        class="badge badge-sm" :class="[
                          record.status === 'verified' ? 'badge-success'
                          : record.status === 'pending' ? 'badge-warning' : 'badge-error',
                        ]"
                      >
                        {{ getStatusLabel(record.status) }}
                      </div>
                    </td>
                    <td>
                      <div class="flex gap-1">
                        <button
                          class="btn btn-xs btn-info"
                          @click="viewDetails(record.id)"
                        >
                          详情
                        </button>
                        <button
                          v-if="record.status === 'pending'"
                          class="btn btn-xs btn-success"
                          @click="verifyResult(record.id)"
                        >
                          验证
                        </button>
                        <button
                          class="btn btn-xs btn-secondary"
                          @click="compareResult(record.id)"
                        >
                          对比
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分页 -->
            <div class="flex justify-center mt-6">
              <div class="join">
                <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  «
                </button>
                <button class="join-item btn btn-sm btn-active">
                  {{ currentPage }}
                </button>
                <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 准确率趋势图 -->
      <RevealMotion :delay="0.5">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              📈 准确率趋势分析
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">
                  月度准确率趋势
                </h3>
                <div class="h-64 bg-base-100 rounded-lg p-4 flex items-center justify-center">
                  <!-- 这里可以集成图表库如Chart.js或ECharts -->
                  <div class="text-center opacity-60">
                    <div class="text-4xl mb-2">
                      📊
                    </div>
                    <p>准确率趋势图</p>
                    <p class="text-sm">
                      (可集成图表库显示)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">
                  预测类型分布
                </h3>
                <div class="space-y-3">
                  <div v-for="typeStats in predictionTypeStats" :key="typeStats.type">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-medium">{{ typeStats.label }}</span>
                      <span class="text-sm">{{ typeStats.count }}次 ({{ typeStats.percentage }}%)</span>
                    </div>
                    <progress
                      class="progress progress-primary"
                      :value="typeStats.percentage"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 预测建议 -->
      <RevealMotion :delay="0.6">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              💡 基于历史数据的建议
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">
                    🎯
                  </div>
                  <h3 class="text-lg font-semibold mb-2">
                    提升预测准确性
                  </h3>
                  <p class="text-sm opacity-70 mb-4">
                    建议更频繁地更新个人信息和技能评估，以提高预测的准确性
                  </p>
                  <button class="btn btn-primary btn-sm">
                    更新信息
                  </button>
                </div>
              </div>

              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">
                    📊
                  </div>
                  <h3 class="text-lg font-semibold mb-2">
                    关注市场变化
                  </h3>
                  <p class="text-sm opacity-70 mb-4">
                    根据历史数据，建议关注行业趋势变化对预测结果的影响
                  </p>
                  <button class="btn btn-secondary btn-sm">
                    查看趋势
                  </button>
                </div>
              </div>

              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">
                    🔄
                  </div>
                  <h3 class="text-lg font-semibold mb-2">
                    定期验证结果
                  </h3>
                  <p class="text-sm opacity-70 mb-4">
                    及时验证预测结果有助于改进算法，提升未来预测的准确性
                  </p>
                  <button class="btn btn-info btn-sm">
                    验证结果
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>
    </div>

    <!-- 页脚 -->
    <footer class="border-t border-base-200 py-6 text-center text-sm opacity-70">
      {{ footerText }}
    </footer>

    <!-- 详情模态框 -->
    <dialog ref="detailModal" class="modal">
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="font-bold text-lg mb-4">
          预测详情
        </h3>
        <div v-if="selectedRecord" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium opacity-70">预测时间</label>
              <p>{{ selectedRecord.date }} {{ selectedRecord.time }}</p>
            </div>
            <div>
              <label class="text-sm font-medium opacity-70">预测类型</label>
              <p>{{ getTypeLabel(selectedRecord.type) }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium opacity-70">预测内容</label>
            <p>{{ selectedRecord.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium opacity-70">预测结果</label>
              <p>{{ selectedRecord.predictedResult }}</p>
            </div>
            <div>
              <label class="text-sm font-medium opacity-70">实际结果</label>
              <p>{{ selectedRecord.actualResult || '待验证' }}</p>
            </div>
          </div>

          <div v-if="selectedRecord.accuracy !== null">
            <label class="text-sm font-medium opacity-70">准确率</label>
            <p>{{ selectedRecord.accuracy }}%</p>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" @click="closeDetailModal">
            关闭
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>
