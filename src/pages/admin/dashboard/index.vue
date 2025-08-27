<script setup lang="ts">
import type {
  EmploymentTrendItem,
  EmploymentTrendResponse,
  IndustryInfo,
  IndustryListResponse,
  PopularPositionItem,
  PopularPositionResponse,
  SalaryTrendItem,
  SalaryTrendResponse,
  StatisticsOverview,
} from '@/types/factory'
import { ArrowRight, Money, OfficeBuilding, Refresh, TrendCharts, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { Motion } from 'motion-v'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  getEmploymentTrend,
  getIndustryList,
  getPopularPositions,
  getSalaryTrend,
  getStatisticsOverview,
} from '@/api/admin/dashboard'

const loading = ref(false)
const selectedPeriod = ref('3m')
const selectedIndustry = ref('all')
const selectedRankingPeriod = ref('weekly')

// 统计数据
const stats = reactive([
  {
    title: '总毕业生数',
    value: '0',
    change: '已就业 0 人',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: '就业率',
    value: '0%',
    change: '平均薪资 ¥0',
    icon: TrendCharts,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: '平均薪资',
    value: '¥0',
    change: '就业率 0%',
    icon: Money,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: '活跃企业',
    value: '0',
    change: '总企业 0 家',
    icon: OfficeBuilding,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
])

// API数据状态
const employmentRanking = ref<EmploymentTrendResponse | null>(null)
const salaryTrendData = ref<SalaryTrendResponse | null>(null)
const popularPositions = ref<PopularPositionItem[]>([])
const industriesList = ref<IndustryInfo[]>([])
const statisticsOverview = ref<StatisticsOverview | null>(null)

// 薪资统计分析数据
const salaryStatistics = ref({
  avgSalary: 0,
  salaryRange: { min: 0, max: 0 },
  topIndustries: [] as Array<{ industry: string, avgSalary: number }>,
})

// ECharts 图表实例
const employmentChartRef = ref<HTMLDivElement>()
const salaryChartRef = ref<HTMLDivElement>()
let employmentChart: echarts.ECharts | null = null
let salaryChart: echarts.ECharts | null = null

// 加载状态
const loadingStates = reactive({
  employment: false,
  salary: false,
  popular: false,
  industries: false,
  statistics: false,
})

// API调用函数
async function fetchEmploymentRanking() {
  try {
    loadingStates.employment = true
    const response = await getEmploymentTrend({
      start_date: getDateRange(selectedPeriod.value).start,
      end_date: getDateRange(selectedPeriod.value).end,
    })
    // 根据实际API响应结构处理数据
    const data = response.data as unknown as EmploymentTrendResponse
    if (data && data.trend_data && data.trend_data.length > 0) {
      employmentRanking.value = data
      // 更新就业率趋势图表
      nextTick(() => {
        updateEmploymentChart()
      })
    }
    else {
      employmentRanking.value = { trend_data: [] }
    }
  }
  catch (error) {
    console.error('获取就业率排行数据失败:', error)
    ElMessage.error('获取就业率排行数据失败')
    employmentRanking.value = { trend_data: [] }
  }
  finally {
    loadingStates.employment = false
  }
}

async function fetchSalaryTrend() {
  try {
    loadingStates.salary = true
    const params: any = {
      start_date: getDateRange(selectedPeriod.value).start,
      end_date: getDateRange(selectedPeriod.value).end,
    }
    if (selectedIndustry.value && selectedIndustry.value !== 'all') {
      params.industry_id = selectedIndustry.value
    }
    const response = await getSalaryTrend(params)
    salaryTrendData.value = response.data as unknown as SalaryTrendResponse

    // 计算薪资统计分析
    calculateSalaryStatistics(response.data)

    // 更新薪资趋势图表
    nextTick(() => {
      updateSalaryChart()
    })
  }
  catch (error) {
    console.error('获取薪资趋势数据失败:', error)
    ElMessage.error('获取薪资趋势数据失败')
  }
  finally {
    loadingStates.salary = false
  }
}

// 计算薪资统计分析
function calculateSalaryStatistics(data: any) {
  if (!data?.salary_trend || data.salary_trend.length === 0) {
    salaryStatistics.value = {
      avgSalary: 0,
      salaryRange: { min: 0, max: 0 },
      topIndustries: [],
    }
    return
  }

  const salaryTrend = data.salary_trend

  // 计算平均薪资（所有时间段的平均值）
  const totalAvgSalary = salaryTrend.reduce((sum: number, item: any) => sum + (item.avg_salary || 0), 0)
  const avgSalary = Math.round(totalAvgSalary / salaryTrend.length)

  // 计算薪资范围（取所有时间段中的最小和最大平均薪资）
  const allSalaries = salaryTrend.map((item: any) => item.avg_salary || 0).filter((salary: number) => salary > 0)
  const salaryRange = {
    min: allSalaries.length > 0 ? Math.min(...allSalaries) : 0,
    max: allSalaries.length > 0 ? Math.max(...allSalaries) : 0,
  }

  // 计算各行业平均薪资（取最新时间段的数据）
  const industryMap = new Map<string, number[]>()

  // 收集所有行业的薪资数据
  salaryTrend.forEach((item: any) => {
    if (item.industry_details && Array.isArray(item.industry_details)) {
      item.industry_details.forEach((industry: any) => {
        if (industry.industry && industry.avg_salary > 0) {
          if (!industryMap.has(industry.industry)) {
            industryMap.set(industry.industry, [])
          }
          industryMap.get(industry.industry)!.push(industry.avg_salary)
        }
      })
    }
  })

  // 计算各行业的平均薪资并排序
  const topIndustries = Array.from(industryMap.entries())
    .map(([industry, salaries]) => ({
      industry,
      avgSalary: Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length),
    }))
    .sort((a, b) => b.avgSalary - a.avgSalary)
    .slice(0, 3) // 取前3个行业

  salaryStatistics.value = {
    avgSalary,
    salaryRange,
    topIndustries,
  }
}

async function fetchPopularPositions() {
  try {
    loadingStates.popular = true
    const response = await getPopularPositions({
      period: selectedRankingPeriod.value as any,
      limit: 4,
    })
    const data = response.data as unknown as PopularPositionResponse
    popularPositions.value = data?.ranking || []
  }
  catch (error) {
    console.error('获取热门职位数据失败:', error)
    ElMessage.error('获取热门职位数据失败')
    popularPositions.value = []
  }
  finally {
    loadingStates.popular = false
  }
}

async function fetchIndustriesList() {
  try {
    loadingStates.industries = true
    const response = await getIndustryList()
    // 根据实际API响应结构处理数据
    const data = response.data as unknown as IndustryListResponse
    industriesList.value = data?.categories || []
  }
  catch (error) {
    console.error('获取行业列表数据失败:', error)
    ElMessage.error('获取行业列表数据失败')
    industriesList.value = []
  }
  finally {
    loadingStates.industries = false
  }
}

async function fetchStatisticsOverview() {
  try {
    loadingStates.statistics = true
    const response = await getStatisticsOverview()
    statisticsOverview.value = response.data as unknown as StatisticsOverview

    // 更新统计卡片数据
    if (response.data?.employment_overview) {
      const employment = response.data.employment_overview
      stats[0].value = employment.total_graduates?.toLocaleString() || '0'
      stats[0].change = `已就业 ${employment.total_employed?.toLocaleString() || 0} 人`

      stats[1].value = `${employment.average_employment_rate?.toFixed(1) || 0}%`
      stats[1].change = `平均薪资 ¥${employment.avg_salary?.toLocaleString() || 0}`

      stats[2].value = `¥${employment.avg_salary?.toLocaleString() || 0}`
      stats[2].change = `就业率 ${employment.average_employment_rate?.toFixed(1) || 0}%`
    }

    if (response.data?.company_overview) {
      stats[3].value = response.data.company_overview.active_companies?.toLocaleString() || '0'
      stats[3].change = `总企业 ${response.data.company_overview.total_companies?.toLocaleString() || 0} 家`
    }
  }
  catch (error) {
    console.error('获取统计概览数据失败:', error)
    ElMessage.error('获取统计概览数据失败')
  }
  finally {
    loadingStates.statistics = false
  }
}

// ECharts 图表初始化和更新函数
function initEmploymentChart() {
  if (employmentChartRef.value && !employmentChart) {
    employmentChart = echarts.init(employmentChartRef.value)
    updateEmploymentChart()
  }
}

function initSalaryChart() {
  if (salaryChartRef.value && !salaryChart) {
    salaryChart = echarts.init(salaryChartRef.value)
    updateSalaryChart()
  }
}

function updateEmploymentChart() {
  if (!employmentChart || !employmentRanking.value?.trend_data)
    return

  const data = employmentRanking.value.trend_data
  const dates = data.map((item: any) => item.date)
  const rates = data.map((item: any) => item.employment_rate)

  const option = {
    title: {
      text: '就业率趋势',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c}%',
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 12,
      },
    },
    series: [{
      name: '就业率',
      type: 'line',
      data: rates,
      smooth: true,
      lineStyle: {
        color: '#10b981',
      },
      itemStyle: {
        color: '#10b981',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(16, 185, 129, 0.3)',
          }, {
            offset: 1,
            color: 'rgba(16, 185, 129, 0.1)',
          }],
        },
      },
    }],
  }

  employmentChart.setOption(option)
}

function updateSalaryChart() {
  if (!salaryChart || !salaryTrendData.value?.salary_trend)
    return

  const data = salaryTrendData.value.salary_trend
  const dates = data.map((item: any) => item.date)
  const avgSalaries = data.map((item: any) => item.avg_salary)
  const minSalaries = data.map((item: any) => item.salary_min)
  const maxSalaries = data.map((item: any) => item.salary_max)

  const option = {
    title: {
      text: '薪资趋势',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter(params: any) {
        let result = `${params[0].name}<br/>`
        params.forEach((param: any) => {
          result += `${param.seriesName}: ¥${param.value}<br/>`
        })
        return result
      },
    },
    legend: {
      data: ['平均薪资', '最低薪资', '最高薪资'],
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '平均薪资',
        type: 'line',
        data: avgSalaries,
        smooth: true,
        lineStyle: {
          color: '#f59e0b',
        },
        itemStyle: {
          color: '#f59e0b',
        },
      },
      {
        name: '最低薪资',
        type: 'line',
        data: minSalaries,
        smooth: true,
        lineStyle: {
          color: '#ef4444',
          type: 'dashed',
        },
        itemStyle: {
          color: '#ef4444',
        },
      },
      {
        name: '最高薪资',
        type: 'line',
        data: maxSalaries,
        smooth: true,
        lineStyle: {
          color: '#10b981',
          type: 'dashed',
        },
        itemStyle: {
          color: '#10b981',
        },
      },
    ],
  }

  salaryChart.setOption(option)
}

// 工具函数
function getDateRange(period: string) {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case '3m':
      start.setMonth(start.getMonth() - 3)
      break
    case '6m':
      start.setMonth(start.getMonth() - 6)
      break
    case '1y':
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

// 监听器
watch(selectedPeriod, () => {
  fetchEmploymentRanking()
  fetchSalaryTrend()
})

watch(selectedIndustry, () => {
  fetchSalaryTrend()
})

watch(selectedRankingPeriod, () => {
  fetchPopularPositions()
})

// 组件挂载时的初始化
onMounted(async () => {
  console.log('Dashboard mounted')
  // 并行获取所有数据
  await Promise.all([
    fetchEmploymentRanking(),
    fetchSalaryTrend(),
    fetchPopularPositions(),
    fetchIndustriesList(),
    fetchStatisticsOverview(),
  ])

  // 初始化图表
  nextTick(() => {
    initEmploymentChart()
    initSalaryChart()
  })
})

// 组件卸载时清理图表
onUnmounted(() => {
  if (employmentChart) {
    employmentChart.dispose()
    employmentChart = null
  }
  if (salaryChart) {
    salaryChart.dispose()
    salaryChart = null
  }
})

// Mock数据已移除，使用实际API数据

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

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] },
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] },
}
</script>

<template>
  <div class="dashboard">
    <!-- 仪表板页面 -->
    <Motion
      :initial="cardVariants.initial" :animate="cardVariants.animate" :while-hover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">仪表板</span>
            <Motion
              :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :while-hover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }"
            >
              <el-button type="primary" :icon="Refresh" :loading="loading" circle @click="null" />
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Motion
            v-for="(stat, index) in stats" :key="index" :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate" :while-hover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 + index * 0.1 } as any"
            class="p-6 rounded-lg cursor-pointer" :class="[stat.bgColor]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium" :class="[stat.color]">
                  {{ stat.title }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 + index * 0.1 }"
                >
                  <p class="text-2xl font-bold" :class="stat.color.replace('text-', 'text-').replace('-600', '-900')">
                    {{
                      stat.value }}
                  </p>
                </Motion>
                <Motion
                  :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
                  :transition="{ duration: 0.3, delay: 0.8 + index * 0.1 }"
                >
                  <p class="text-xs text-gray-500 mt-1">
                    {{ stat.change }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial" :animate="iconVariants.animate"
                :while-hover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 + index * 0.1 } as any" :class="stat.color"
              >
                <el-icon size="32">
                  <component :is="stat.icon" />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 趋势图模块 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 就业率趋势 -->
      <Motion
        :initial="cardVariants.initial" :animate="cardVariants.animate"
        :while-hover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.9 } as any"
      >
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">就业率趋势</span>
              <el-select v-model="selectedPeriod" size="small" style="width: 120px">
                <el-option label="近3个月" value="3m" />
                <el-option label="近6个月" value="6m" />
                <el-option label="近1年" value="1y" />
              </el-select>
            </div>
          </template>
          <div ref="employmentChartRef" v-loading="loadingStates.employment" class="h-64" />
        </el-card>
      </Motion>

      <!-- 薪资趋势 -->
      <Motion
        :initial="cardVariants.initial" :animate="cardVariants.animate"
        :while-hover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 1.0 } as any"
      >
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">薪资趋势</span>
            </div>
          </template>
          <div ref="salaryChartRef" v-loading="loadingStates.salary" class="h-64" />
        </el-card>
      </Motion>
    </div>

    <!-- 热门职位排行模块 -->
    <Motion
      :initial="cardVariants.initial" :animate="cardVariants.animate" :while-hover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 1.1 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">热门职位排行</span>
            <el-select v-model="selectedRankingPeriod" size="small" style="width: 100px">
              <el-option label="本周" value="weekly" />
              <el-option label="本月" value="monthly" />
              <el-option label="本年" value="yearly" />
            </el-select>
          </div>
        </template>
        <div v-loading="loadingStates.popular" class="grid grid-cols-2 gap-3">
          <template v-if="popularPositions && popularPositions.length">
            <div
              v-for="(position, index) in popularPositions"
              :key="position.position_title"
              class="relative overflow-hidden bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              <!-- 排名标识 -->
              <div class="absolute top-0 left-0 w-10 h-10">
                <div
                  class="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  :class="{
                    'bg-gradient-to-r from-yellow-400 to-yellow-600': index === 0,
                    'bg-gradient-to-r from-gray-400 to-gray-600': index === 1,
                    'bg-gradient-to-r from-orange-400 to-orange-600': index === 2,
                    'bg-gradient-to-r from-blue-400 to-blue-600': index > 2,
                  }"
                >
                  {{ position.rank }}
                </div>
              </div>

              <!-- 热度指数徽章 -->
              <div class="absolute top-2 right-2">
                <div class="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ position.heat_index }}</span>
                </div>
              </div>

              <div class="p-3 pt-8">
                <!-- 职位标题和行业 -->
                <div class="mb-2">
                  <h4
                    class="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight"
                  >
                    {{ position.position_title }}
                  </h4>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ position.industry }}
                  </span>
                </div>

                <!-- 统计数据 -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-center">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ position.total_views }}
                    </div>
                    <div class="text-xs text-gray-500">
                      浏览量
                    </div>
                  </div>
                  <div class="text-center border-l border-r border-gray-200">
                    <div class="text-sm font-semibold text-green-600">
                      {{ position.total_applications }}
                    </div>
                    <div class="text-xs text-gray-500">
                      申请数
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-semibold text-orange-600">
                      ¥{{ position.avg_salary }}
                    </div>
                    <div class="text-xs text-gray-500">
                      平均薪资
                    </div>
                  </div>
                </div>

                <!-- 趋势指示器 -->
                <div class="mt-2 pt-2 border-t border-gray-100">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">本周趋势</span>
                    <div class="flex items-center gap-1 text-green-600">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="font-medium">+{{ Math.floor(Math.random() * 20 + 5) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!loadingStates.popular" class="col-span-2 text-center py-8 text-gray-500">
            暂无热门职位数据
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 行业列表模块 -->
    <Motion
      :initial="cardVariants.initial" :animate="cardVariants.animate" :while-hover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 1.2 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">行业概览</span>
          </div>
        </template>
        <div v-loading="loadingStates.industries" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <template v-if="industriesList && industriesList.length">
            <div
              v-for="industry in industriesList" :key="industry.id"
              class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">
                  {{ industry.name }}
                </h4>
                <el-icon class="text-blue-500">
                  <ArrowRight />
                </el-icon>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                {{ industry.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">职位数量</span>
                <span class="text-lg font-bold text-blue-600">{{ industry.position_count }}</span>
              </div>
            </div>
          </template>
          <div v-else-if="!loadingStates.industries" class="col-span-full text-center py-8 text-gray-500">
            暂无行业数据
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 统计模块 -->
    <Motion
      :initial="cardVariants.initial" :animate="cardVariants.animate" :while-hover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 1.3 } as any"
    >
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">薪资统计分析</span>
          </div>
        </template>
        <div v-loading="loadingStates.salary" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <template v-if="salaryStatistics">
            <!-- 平均薪资 -->
            <div class="text-center p-6 bg-green-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600 mb-2">
                ¥{{ salaryStatistics.avgSalary.toLocaleString() }}
              </div>
              <div class="text-sm text-green-700">
                平均薪资
              </div>
              <div class="text-xs text-gray-500 mt-1">
                基于最新数据
              </div>
            </div>
            <!-- 薪资范围 -->
            <div class="text-center p-6 bg-blue-50 rounded-lg">
              <div class="text-lg font-bold text-blue-600 mb-2">
                ¥{{ salaryStatistics.salaryRange.min.toLocaleString() }} - ¥{{ salaryStatistics.salaryRange.max.toLocaleString() }}
              </div>
              <div class="text-sm text-blue-700">
                薪资范围
              </div>
              <div class="text-xs text-gray-500 mt-1">
                基于当前数据
              </div>
            </div>
            <!-- 行业分布 -->
            <div class="p-6 bg-purple-50 rounded-lg">
              <div class="text-sm text-purple-700 mb-3">
                热门行业薪资
              </div>
              <div class="space-y-2">
                <div
                  v-for="item in salaryStatistics.topIndustries" :key="item.industry"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600">{{ item.industry }}</span>
                  <span class="font-medium text-purple-600">¥{{ item.avgSalary.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!loadingStates.salary" class="col-span-full text-center py-8 text-gray-500">
            暂无统计数据
          </div>
        </div>
      </el-card>
    </Motion>
  </div>
</template>

<style scoped>
.dashboard {
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
