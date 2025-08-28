<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-light tracking-tight mb-4 text-gray-900">
            📊 预测历史记录
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg max-w-2xl mx-auto text-gray-600">
            查看您的历史预测记录，分析预测准确性和趋势变化
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 统计概览 -->
      <RevealMotion :delay="0.2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-white border border-gray-200 shadow-sm">
            <div class="card-body text-center p-6">
              <div class="text-3xl mb-2">📈</div>
              <h3 class="text-lg font-medium mb-2 text-gray-800">总预测次数</h3>
              <div class="text-2xl font-medium text-gray-900">{{ statistics.totalPredictions }}</div>
              <div class="text-sm text-gray-600">累计预测记录</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 shadow-sm">
            <div class="card-body text-center p-6">
              <div class="text-3xl mb-2">🎯</div>
              <h3 class="text-lg font-medium mb-2 text-gray-800">平均准确率</h3>
              <div class="text-2xl font-medium text-gray-900">{{ statistics.averageAccuracy }}%</div>
              <div class="text-sm text-gray-600">预测准确度</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 shadow-sm">
            <div class="card-body text-center p-6">
              <div class="text-3xl mb-2">✅</div>
              <h3 class="text-lg font-medium mb-2 text-gray-800">成功预测</h3>
              <div class="text-2xl font-medium text-gray-900">{{ statistics.successfulPredictions }}</div>
              <div class="text-sm text-gray-600">准确预测数量</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 shadow-sm">
            <div class="card-body text-center p-6">
              <div class="text-3xl mb-2">📅</div>
              <h3 class="text-lg font-medium mb-2 text-gray-800">最近预测</h3>
              <div class="text-2xl font-medium text-gray-900">{{ statistics.lastPredictionDays }}</div>
              <div class="text-sm text-gray-600">天前</div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 筛选和搜索 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">🔍 筛选条件</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">预测类型</span>
                </label>
                <select v-model="filters.prediction_type" class="select select-bordered">
                  <option value="">全部类型</option>
                  <option value="employment_rate">就业率预测</option>
                  <option value="salary_prediction">薪资预测</option>
                  <option value="job_duration">求职时长预测</option>
                  <option value="comprehensive">综合预测</option>
                </select>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">开始日期</span>
                </label>
                <input v-model="filters.start_date" type="date" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">结束日期</span>
                </label>
                <input v-model="filters.end_date" type="date" class="input input-bordered" />
              </div>
            </div>
            
            <div class="flex gap-3">
              <button class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors" @click="applyFilters">🔍 应用筛选</button>
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="resetFilters">🔄 重置筛选</button>
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="exportData">📊 导出数据</button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 预测记录列表 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">📋 预测记录</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>预测时间</th>
                    <th>预测类型</th>
                    <th>预测结果</th>
                    <th>置信度</th>
                    <th>使用模型</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in predictionRecords" :key="record.id" v-show="!loading">
                    <td>
                      <div class="text-sm">
                        <div class="font-medium">{{ formatPredictionTime(record.created_at).date }}</div>
                        <div class="opacity-60">{{ formatPredictionTime(record.created_at).time }}</div>
                      </div>
                    </td>
                    <td>
                      <div :class="[
                        'badge',
                        record.prediction_type === 'salary_prediction' ? 'badge-success' :
                        record.prediction_type === 'employment_rate' ? 'badge-info' :
                        record.prediction_type === 'job_duration' ? 'badge-warning' : 'badge-secondary'
                      ]">
                        {{ getTypeLabel(record.prediction_type) }}
                      </div>
                    </td>
                    <td>
                      <div class="text-sm font-medium">{{ getPredictionResultText(record) }}</div>
                    </td>
                    <td>
                      <div class="text-sm">
                        <span v-if="record.confidence_score" class="font-medium">{{ Math.round(record.confidence_score * 100) }}%</span>
                        <span v-else class="opacity-60">-</span>
                      </div>
                    </td>
                    <td>
                      <div class="text-sm">
                        <span class="opacity-60">{{ record.model_used || '-' }}</span>
                      </div>
                    </td>

                    <td>
                      <div class="flex gap-1">
                        <button 
                          class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs border border-gray-300 transition-colors" 
                          @click="viewDetail(record)"
                        >
                          详情
                        </button>


                      </div>
                    </td>
                  </tr>
                  <tr v-if="loading">
                    <td colspan="6" class="text-center py-8">
                      <div class="loading loading-spinner loading-md"></div>
                      <div class="mt-2 text-sm opacity-60">加载中...</div>
                    </td>
                  </tr>
                  <tr v-else-if="predictionRecords.length === 0">
                    <td colspan="6" class="text-center py-8">
                      <div class="text-4xl mb-2">📊</div>
                      <div class="text-sm opacity-60">暂无预测记录</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- 分页 -->
            <div class="flex justify-center mt-6" v-if="totalPages > 1">
              <div class="flex gap-1">
                <button 
                  class="px-3 py-2 rounded-lg border border-gray-300 transition-colors" 
                  :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'"
                  @click="handlePageChange(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  上一页
                </button>
                <span 
                  v-for="page in visiblePages" 
                  :key="page" 
                  class="px-3 py-2 rounded-lg border border-gray-300 transition-colors cursor-pointer" 
                  :class="currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:bg-gray-50 text-gray-700'"
                  @click="handlePageChange(page)"
                >
                  {{ page }}
                </span>
                <button 
                  class="px-3 py-2 rounded-lg border border-gray-300 transition-colors" 
                  :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'"
                  @click="handlePageChange(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  下一页
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
            <h2 class="card-title text-xl mb-6">📈 准确率趋势分析</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">月度准确率趋势</h3>
                <div class="h-64 bg-base-100 rounded-lg p-4">
                  <div v-if="monthlyAccuracyTrend.length > 0" class="space-y-2">
                    <div v-for="monthData in monthlyAccuracyTrend" :key="monthData.month" class="flex items-center justify-between">
                      <span class="text-sm font-medium">{{ monthData.month }}</span>
                      <div class="flex items-center gap-2 flex-1 mx-4">
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            :style="{ width: monthData.accuracy + '%' }"
                          ></div>
                        </div>
                        <span class="text-sm font-medium min-w-[40px]">{{ monthData.accuracy }}%</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex items-center justify-center h-full text-center opacity-60">
                    <div>
                      <div class="text-4xl mb-2">📊</div>
                      <p>暂无足够数据</p>
                      <p class="text-sm">需要更多历史记录来显示趋势</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold mb-4">预测类型分布</h3>
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
                    ></progress>
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
            <h2 class="card-title text-xl mb-6">💡 基于历史数据的建议</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">🎯</div>
                  <h3 class="text-lg font-semibold mb-2">提升预测准确性</h3>
                  <p class="text-sm opacity-70 mb-4">
                    建议更频繁地更新个人信息和技能评估，以提高预测的准确性
                  </p>
                  <button class="btn btn-primary btn-sm">更新信息</button>
                </div>
              </div>
              
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">📊</div>
                  <h3 class="text-lg font-semibold mb-2">关注市场变化</h3>
                  <p class="text-sm opacity-70 mb-4">
                    根据历史数据，建议关注行业趋势变化对预测结果的影响
                  </p>
                  <button class="btn btn-secondary btn-sm">查看趋势</button>
                </div>
              </div>
              
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="text-3xl mb-3">🔄</div>
                  <h3 class="text-lg font-semibold mb-2">定期验证结果</h3>
                  <p class="text-sm opacity-70 mb-4">
                    及时验证预测结果有助于改进算法，提升未来预测的准确性
                  </p>
                  <button class="btn btn-info btn-sm">验证结果</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>
    </div>

    <!-- 页脚 -->
    <footer class="text-center p-10 bg-white border-t border-gray-200 mt-12">
      <div class="text-center">
        <p class="text-sm text-gray-600">
          © 2024 就业分析与预测系统. 数据仅供参考，实际结果可能有所差异。
        </p>
      </div>
    </footer>

    <!-- 详情模态框 -->
    <dialog ref="detailModal" class="modal">
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl mx-auto p-6">
        <h3 class="font-medium text-lg mb-4 text-gray-800">📊 预测详情</h3>
        <div v-if="selectedRecord" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium opacity-70">预测时间</label>
              <p>{{ formatPredictionTime(selectedRecord.created_at).date }} {{ formatPredictionTime(selectedRecord.created_at).time }}</p>
            </div>
            <div>
              <label class="text-sm font-medium opacity-70">预测类型</label>
              <p>{{ getTypeLabel(selectedRecord.prediction_type) }}</p>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium opacity-70">预测结果</label>
            <p>{{ getPredictionResultText(selectedRecord) }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium opacity-70">置信度</label>
              <p v-if="selectedRecord.confidence_score !== undefined">{{ Math.round(selectedRecord.confidence_score * 100) }}%</p>
              <p v-else class="opacity-60">-</p>
            </div>
            <div>
              <label class="text-sm font-medium opacity-70">使用模型</label>
              <p>{{ selectedRecord.model_used || '-' }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { Motion } from "motion-v";
import { ElMessage } from "element-plus";
import { getPredictionHistory, getPredictionHistoryDetail, getAllPredictionHistory } from '@/api/user/prediction';
import type { PredictionHistoryRecord, PredictionHistoryParams } from "@/types/apis/APIS_T";

const footerText = import.meta.env.VITE_APP_FOOTER || "版权所有 © 2025 HZSYSTEM";

// 类型定义
interface Filters {
  prediction_type?: 'employment_rate' | 'salary_prediction' | 'job_duration' | 'comprehensive';
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

interface TypeStats {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

// RevealMotion 组件定义
type RevealProps = { delay?: number };
const RevealMotion = defineComponent<RevealProps>({
  name: "RevealMotion",
  props: { delay: { type: Number, default: 0 } },
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null);
    const inView = ref(false);
    let io: IntersectionObserver | null = null;

    const animateProps = computed(() => {
      return inView.value
        ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: props.delay } }
        : { opacity: 0, y: 16 };
    });

    onMounted(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              inView.value = true;
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05 }
      );
      if (el.value) io.observe(el.value);
    });

    onBeforeUnmount(() => io?.disconnect());

    return () =>
      h(
        "div",
        { ref: el },
        [
          h(
            Motion as any,
            {
              initial: { opacity: 0, y: 16 },
              animate: animateProps.value,
            },
            slots
          )
        ]
      );
  },
});

// 响应式数据
const loading = ref(false);
const predictionRecords = ref<PredictionHistoryRecord[]>([]);
const allPredictionRecords = ref<PredictionHistoryRecord[]>([]); // 用于统计的全部记录
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const filters = ref<Filters>({
  prediction_type: undefined,
  start_date: undefined,
  end_date: undefined,
  page: 1,
  page_size: 10
});

// 统计数据
const statistics = computed(() => {
  const totalPredictions = allPredictionRecords.value.length;
  const recordsWithConfidence = allPredictionRecords.value.filter(record => record.confidence_score !== undefined && record.confidence_score !== null);
  
  // 计算平均置信度作为准确率
  const averageAccuracy = recordsWithConfidence.length > 0 
    ? Math.round(recordsWithConfidence.reduce((sum, record) => sum + (record.confidence_score || 0), 0) / recordsWithConfidence.length * 100)
    : 0;
  
  // 计算成功预测数量（置信度大于70%的记录）
  const successfulPredictions = recordsWithConfidence.filter(record => (record.confidence_score || 0) > 0.7).length;
  
  // 计算最近预测天数
  const lastPredictionDays = totalPredictions > 0 && allPredictionRecords.value[0]?.created_at
    ? Math.ceil((Date.now() - new Date(allPredictionRecords.value[0].created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  return {
    totalPredictions,
    averageAccuracy,
    successfulPredictions,
    lastPredictionDays
  };
});

const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 可见页码数组
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  
  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  // 如果结束页码不足，调整开始页码
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// API调用函数
const fetchPredictionHistory = async () => {
  try {
    loading.value = true;
    const params: PredictionHistoryParams = {
      ...filters.value,
      page: currentPage.value,
      page_size: pageSize.value
    };
    
    const response = await getPredictionHistory(params);
    if (response.code === 200) {
      predictionRecords.value = response.data.records || [];
      total.value = response.data.total || 0;
    } else {
      ElMessage.error(response.msg || '获取预测历史失败');
    }
  } catch (error) {
    console.error('获取预测历史失败:', error);
    ElMessage.error('获取预测历史失败');
  } finally {
    loading.value = false;
  }
};

// 获取全部预测历史记录（用于统计）
const fetchAllPredictionHistory = async () => {
  try {
    const response = await getAllPredictionHistory();
    if (response.code === 200) {
      allPredictionRecords.value = response.data.records || [];
    } else {
      console.error('获取全部预测历史失败:', response.msg);
    }
  } catch (error) {
    console.error('获取全部预测历史失败:', error);
  }
};

// 预测类型统计
const predictionTypeStats = computed(() => {
  const typeMap = new Map<string, { label: string; count: number }>();
  
  allPredictionRecords.value.forEach(record => {
    const type = record.prediction_type;
    const label = getTypeLabel(type);
    if (typeMap.has(type)) {
      typeMap.get(type)!.count++;
    } else {
      typeMap.set(type, { label, count: 1 });
    }
  });
  
  const total = allPredictionRecords.value.length;
  return Array.from(typeMap.entries()).map(([type, { label, count }]) => ({
    type,
    label,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));
});

// 月度准确率趋势
const monthlyAccuracyTrend = computed(() => {
  const monthlyData = new Map<string, { total: number; confidenceSum: number }>();
  
  allPredictionRecords.value.forEach(record => {
    if (record.confidence_score !== undefined && record.confidence_score !== null) {
      const date = new Date(record.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!;
        data.total++;
        data.confidenceSum += record.confidence_score;
      } else {
        monthlyData.set(monthKey, {
          total: 1,
          confidenceSum: record.confidence_score
        });
      }
    }
  });
  
  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month: month,
      accuracy: Math.round((data.confidenceSum / data.total) * 100)
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // 只显示最近6个月
});

const selectedRecord = ref<PredictionHistoryRecord | null>(null);
const detailModal = ref<HTMLDialogElement | null>(null);

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    employment_rate: '就业率预测',
    salary_prediction: '薪资预测',
    job_duration: '求职时长预测',
    comprehensive: '综合预测'
  };
  return labels[type] || type;
};

// 格式化预测时间
const formatPredictionTime = (timeStr: string) => {
  const date = new Date(timeStr);
  return {
    date: date.toLocaleDateString('zh-CN'),
    time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
};

// 获取预测结果文本
const getPredictionResultText = (record: PredictionHistoryRecord): string => {
  switch (record.prediction_type) {
    case 'employment_rate':
      return `就业成功率: ${record.employment_success_rate || 0}%`;
    case 'salary_prediction':
      if (record.predicted_salary_min && record.predicted_salary_max) {
        return `薪资范围: ${record.predicted_salary_min}-${record.predicted_salary_max}元 (平均: ${record.predicted_salary_avg || 0}元)`;
      }
      return `平均薪资: ${record.predicted_salary_avg || 0}元`;
    case 'job_duration':
      return `预计求职时长: ${record.predicted_job_duration || 0}个月`;
    case 'comprehensive':
      const parts = [];
      if (record.employment_success_rate) parts.push(`就业率: ${record.employment_success_rate}%`);
      if (record.predicted_salary_avg) parts.push(`平均薪资: ${record.predicted_salary_avg}元`);
      if (record.predicted_job_duration) parts.push(`求职时长: ${record.predicted_job_duration}个月`);
      return parts.length > 0 ? parts.join(', ') : '综合预测结果';
    default:
      return '预测结果';
  }
};

// 应用筛选条件
const applyFilters = () => {
  currentPage.value = 1;
  filters.value.page = 1;
  fetchPredictionHistory();
};

// 查看详情
const viewDetail = async (record: PredictionHistoryRecord) => {
  try {
    const response = await getPredictionHistoryDetail(record.id);
    if (response.code === 200) {
      selectedRecord.value = response.data;
      (detailModal.value as HTMLDialogElement)?.showModal();
    } else {
      ElMessage.error(response.msg || '获取详情失败');
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
  }
};

// 关闭详情模态框
const closeDetailModal = () => {
  detailModal.value?.close();
  selectedRecord.value = null;
};

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  filters.value.page = page;
  fetchPredictionHistory();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPredictionHistory();
  fetchAllPredictionHistory(); // 获取全部记录用于统计
});

const resetFilters = () => {
  filters.value = {
    prediction_type: undefined,
    start_date: undefined,
    end_date: undefined,
    page: 1,
    page_size: 10
  };
  currentPage.value = 1;
  fetchPredictionHistory();
};

const exportData = () => {
  try {
    const csvContent = generateCSV(predictionRecords.value);
    downloadCSV(csvContent, 'prediction_history.csv');
    ElMessage.success('数据导出成功');
  } catch (error) {
    console.error('导出数据失败:', error);
    ElMessage.error('导出数据失败');
  }
};

// 生成CSV内容
 const generateCSV = (records: PredictionHistoryRecord[]) => {
   const headers = ['预测时间', '预测类型', '预测结果', '置信度', '使用模型'];
   const rows = records.map(record => [
     formatPredictionTime(record.created_at),
     getTypeLabel(record.prediction_type),
     getPredictionResultText(record),
     record.confidence_score ? Math.round(record.confidence_score * 100) + '%' : '-',
     record.model_used || '-'
   ]);
   
   return [headers, ...rows].map(row => row.join(',')).join('\n');
 };

// 下载CSV文件
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const verifyResult = (recordId: number) => {
  console.log('验证结果:', recordId);
  // 这里可以打开验证结果的表单
};


</script>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>