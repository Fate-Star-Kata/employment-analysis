<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

const footerText = import.meta.env.VITE_APP_FOOTER || '版权所有 © 2025 HZSYSTEM'

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
const selectedIndustry = ref('all')
const industries = [
  { key: 'all', name: '全行业' },
  { key: 'it', name: '信息技术' },
  { key: 'finance', name: '金融' },
  { key: 'education', name: '教育' },
  { key: 'healthcare', name: '医疗健康' },
  { key: 'manufacturing', name: '制造业' },
]

const employmentTrends = [
  { industry: '信息技术', rate: 92 },
  { industry: '金融', rate: 85 },
  { industry: '教育', rate: 78 },
  { industry: '医疗健康', rate: 88 },
  { industry: '制造业', rate: 75 },
]

const salaryTrends = [
  {
    industry: '信息技术',
    icon: '💻',
    salary: '¥8,500',
    trend: '↗ +12% 同比增长',
    trendType: 'up',
  },
  {
    industry: '金融',
    icon: '🏦',
    salary: '¥7,800',
    trend: '↗ +8% 同比增长',
    trendType: 'up',
  },
  {
    industry: '教育',
    icon: '🎓',
    salary: '¥5,200',
    trend: '→ 持平',
    trendType: 'stable',
  },
  {
    industry: '医疗健康',
    icon: '🏥',
    salary: '¥6,800',
    trend: '↗ +15% 同比增长',
    trendType: 'up',
  },
]

const hotJobs = [
  {
    rank: 1,
    position: '软件开发工程师',
    industry: '信息技术',
    demand: '15,420',
    salary: '¥9,200',
    trend: '↗ 高',
    trendClass: 'trend-up',
  },
  {
    rank: 2,
    position: '数据分析师',
    industry: '信息技术',
    demand: '8,760',
    salary: '¥8,800',
    trend: '↗ 高',
    trendClass: 'trend-up',
  },
  {
    rank: 3,
    position: '产品经理',
    industry: '信息技术',
    demand: '6,540',
    salary: '¥10,500',
    trend: '↗ 中',
    trendClass: 'trend-up',
  },
  {
    rank: 4,
    position: '金融分析师',
    industry: '金融',
    demand: '4,320',
    salary: '¥8,200',
    trend: '→ 稳定',
    trendClass: 'trend-stable',
  },
  {
    rank: 5,
    position: '市场营销专员',
    industry: '全行业',
    demand: '12,180',
    salary: '¥6,500',
    trend: '↗ 中',
    trendClass: 'trend-up',
  },
]

const techSkills = [
  { name: 'Python', level: 'high' },
  { name: 'Java', level: 'high' },
  { name: 'JavaScript', level: 'medium' },
  { name: '数据分析', level: 'high' },
  { name: '机器学习', level: 'medium' },
  { name: 'SQL', level: 'high' },
  { name: '云计算', level: 'medium' },
  { name: '区块链', level: 'low' },
]

const softSkills = [
  { name: '沟通能力', level: 'high' },
  { name: '团队协作', level: 'high' },
  { name: '项目管理', level: 'medium' },
  { name: '问题解决', level: 'high' },
  { name: '领导力', level: 'medium' },
  { name: '学习能力', level: 'high' },
]

const regions = [
  {
    city: '北京',
    jobs: '45,230',
    salary: '¥9,800',
    competition: '⭐⭐⭐⭐⭐',
  },
  {
    city: '上海',
    jobs: '38,760',
    salary: '¥9,200',
    competition: '⭐⭐⭐⭐⭐',
  },
  {
    city: '深圳',
    jobs: '32,450',
    salary: '¥8,900',
    competition: '⭐⭐⭐⭐',
  },
  {
    city: '杭州',
    jobs: '18,320',
    salary: '¥8,200',
    competition: '⭐⭐⭐',
  },
]

function selectIndustry(industry: string) {
  selectedIndustry.value = industry
  console.log('选择行业:', industry)
}

// 获取进度条颜色
function getProgressBarColor(rate: number) {
  if (rate < 50)
    return 'bg-red-500'
  if (rate < 80)
    return 'bg-yellow-500'
  return 'bg-green-500'
}

// 获取进度条文字颜色
function getProgressTextColor(rate: number) {
  if (rate < 50)
    return 'text-red-500'
  if (rate < 80)
    return 'text-yellow-500'
  return 'text-green-500'
}
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-base-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            📈 就业趋势分析
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg opacity-70 max-w-2xl mx-auto text-gray-600">
            基于大数据分析当前就业市场趋势，为您提供行业发展预测
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 行业选择器 -->
      <RevealMotion :delay="0.2">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-4">
              选择分析行业
            </h2>
            <div class="flex flex-wrap gap-3">
              <button 
                :class="[
                  'btn btn-sm rounded-full transition-all',
                  selectedIndustry === null 
                    ? 'btn-primary' 
                    : 'btn-outline btn-primary'
                ]"
                @click="selectIndustry(null)"
              >
                全行业
              </button>
              <button 
                v-for="industry in industries" 
                :key="industry.id"
                :class="[
                  'btn btn-sm rounded-full transition-all',
                  selectedIndustry === industry.id 
                    ? 'btn-primary' 
                    : 'btn-outline btn-primary'
                ]"
                @click="selectIndustry(industry.id)"
                :disabled="loading"
              >
                {{ industry.name }}
              </button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 就业率趋势 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">📊 就业率趋势分析</h2>
            <div v-if="loading" class="flex justify-center py-8">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
            <div v-else-if="employmentTrends.length === 0" class="text-center py-8 text-gray-500">
              暂无数据
            </div>
            <div v-else class="space-y-4">
              <div 
                v-for="item in employmentTrends" 
                :key="item.date"
                class="flex items-center gap-4"
              >
                <div class="w-20 text-sm font-medium text-right">{{ item.date }}</div>
                <div class="flex-1 bg-base-300 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-full transition-all duration-1000 ease-out"
                    :class="getProgressBarColor(item.employment_rate)"
                    :style="{ width: item.employment_rate + '%' }"
                  ></div>
                </div>
                <div class="w-12 text-sm font-bold" :class="getProgressTextColor(item.employment_rate)">{{ item.employment_rate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 薪资水平趋势 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">💰 薪资水平趋势</h2>
            <div v-if="loading" class="flex justify-center py-8">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
            <div v-else-if="salaryTrends.length === 0" class="text-center py-8 text-gray-500">
              暂无数据
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div 
                v-for="item in salaryTrends" 
                :key="item.date"
                class="card bg-base-100 shadow-sm hover:shadow-md transition"
              >
                <div class="card-body p-4">
                  <div class="flex items-center gap-3">
                    <div class="text-2xl">💰</div>
                    <div class="flex-1">
                      <h4 class="font-semibold">{{ item.date }}</h4>
                      <p class="text-lg font-bold text-success">{{ formatSalary(item.avg_salary) }}/月</p>
                      <p class="text-sm text-gray-600">
                        {{ formatSalary(item.salary_min) }} - {{ formatSalary(item.salary_max) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 热门职位排行 -->
      <RevealMotion :delay="0.5">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🔥 热门职位排行
            </h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>职位名称</th>
                    <th>所属行业</th>
                    <th>需求量</th>
                    <th>平均薪资</th>
                    <th>增长趋势</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="6" class="text-center py-8">
                      <div class="loading loading-spinner loading-lg"></div>
                    </td>
                  </tr>
                  <tr v-else-if="hotJobs.length === 0">
                    <td colspan="6" class="text-center py-8 text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                  <tr v-else v-for="job in hotJobs" :key="job.rank" class="hover">
                    <td>
                      <div class="badge badge-primary badge-sm">
                        {{ job.rank }}
                      </div>
                    </td>
                    <td class="font-semibold">
                      {{ job.position }}
                    </td>
                    <td class="font-semibold">{{ job.position_title }}</td>
                    <td>
                      <div class="badge badge-outline badge-sm">
                        {{ job.industry }}
                      </div>
                    </td>
                    <td>{{ formatCount(job.total_views) }}</td>
                    <td class="font-bold text-success">{{ formatSalary(job.avg_salary) }}</td>
                    <td>
                      <div :class="[
                        'badge badge-sm',
                        getTrendText(job.heat_index).class === 'trend-up' ? 'badge-success' : 
                        getTrendText(job.heat_index).class === 'trend-stable' ? 'badge-warning' : 'badge-error'
                      ]">
                        {{ getTrendText(job.heat_index).text }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 技能需求分析 -->
      <RevealMotion :delay="0.6">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🛠️ 技能需求分析
            </h2>

            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-3">
                  技术技能
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="skill in techSkills"
                    :key="skill.name"
                    class="badge badge-lg" :class="[
                      skill.level === 'high' ? 'badge-success'
                      : skill.level === 'medium' ? 'badge-warning' : 'badge-error',
                    ]"
                  >
                    {{ skill.name }}
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-3">
                  软技能
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="skill in softSkills"
                    :key="skill.name"
                    class="badge badge-lg" :class="[
                      skill.level === 'high' ? 'badge-success'
                      : skill.level === 'medium' ? 'badge-warning' : 'badge-error',
                    ]"
                  >
                    {{ skill.name }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-4 mt-6 text-sm">
              <div class="flex items-center gap-2">
                <div class="badge badge-success badge-sm" />
                <span>高需求</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="badge badge-warning badge-sm" />
                <span>中需求</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="badge badge-error badge-sm" />
                <span>低需求</span>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 地区就业分析 -->
      <RevealMotion :delay="0.7">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🌍 地区就业分析
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="region in regions"
                :key="region.city"
                class="card bg-base-100 shadow-sm hover:shadow-md transition"
              >
                <div class="card-body p-4">
                  <h4 class="card-title text-lg">
                    {{ region.city }}
                  </h4>
                  <div class="space-y-2 text-sm">
                    <p class="flex justify-between">
                      <span class="opacity-70">职位数量:</span>
                      <span class="font-semibold text-primary">{{ region.jobs }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="opacity-70">平均薪资:</span>
                      <span class="font-semibold text-success">{{ region.salary }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="opacity-70">竞争指数:</span>
                      <span class="font-semibold text-warning">{{ region.competition }}</span>
                    </p>
                  </div>
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
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { Motion } from "motion-v";
import { ElMessage } from 'element-plus';
import {
  getEmploymentRateTrend,
  getSalaryTrend,
  getPopularRanking,
  getIndustries,
  getStatisticsOverview
} from '@/api/user/trend';
import type {
  EmploymentTrendData,
  SalaryTrendData,
  PopularPosition,
  Industry,
  EmploymentOverview
} from '@/types/apis/APIS_T';

const footerText = import.meta.env.VITE_APP_FOOTER || "版权所有 © 2025 HZSYSTEM";

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

// 响应式数据定义
const selectedIndustry = ref<number | null>(null);
const loading = ref(false);
const industries = ref<Industry[]>([]);
const employmentTrends = ref<EmploymentTrendData[]>([]);
const salaryTrends = ref<SalaryTrendData[]>([]);
const hotJobs = ref<PopularPosition[]>([]);
const statisticsOverview = ref<EmploymentOverview | null>(null);

// 行业图标映射
const industryIcons: Record<string, string> = {
  '信息技术': '💻',
  '金融': '🏦',
  '教育': '🎓',
  '医疗健康': '🏥',
  '制造业': '🏭',
  '服务业': '🛎️',
  '建筑业': '🏗️',
  '零售业': '🛒'
};

// 获取行业图标
const getIndustryIcon = (industryName: string): string => {
  return industryIcons[industryName] || '🏢';
};

// 格式化薪资显示
const formatSalary = (salary: number): string => {
  return `¥${(salary / 1000).toFixed(1)}k`;
};

// 格式化数量显示
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};

// 获取趋势显示文本
const getTrendText = (heatIndex: number): { text: string; class: string } => {
  if (heatIndex >= 80) {
    return { text: '↗ 高', class: 'trend-up' };
  } else if (heatIndex >= 60) {
    return { text: '↗ 中', class: 'trend-up' };
  } else if (heatIndex >= 40) {
    return { text: '→ 稳定', class: 'trend-stable' };
  } else {
    return { text: '↘ 低', class: 'trend-down' };
  }
};

const techSkills = [
  { name: 'Python', level: 'high' },
  { name: 'Java', level: 'high' },
  { name: 'JavaScript', level: 'medium' },
  { name: '数据分析', level: 'high' },
  { name: '机器学习', level: 'medium' },
  { name: 'SQL', level: 'high' },
  { name: '云计算', level: 'medium' },
  { name: '区块链', level: 'low' }
];

const softSkills = [
  { name: '沟通能力', level: 'high' },
  { name: '团队协作', level: 'high' },
  { name: '项目管理', level: 'medium' },
  { name: '问题解决', level: 'high' },
  { name: '领导力', level: 'medium' },
  { name: '学习能力', level: 'high' }
];

const regions = [
  {
    city: '北京',
    jobs: '45,230',
    salary: '¥9,800',
    competition: '⭐⭐⭐⭐⭐'
  },
  {
    city: '上海',
    jobs: '38,760',
    salary: '¥9,200',
    competition: '⭐⭐⭐⭐⭐'
  },
  {
    city: '深圳',
    jobs: '32,450',
    salary: '¥8,900',
    competition: '⭐⭐⭐⭐'
  },
  {
    city: '杭州',
    jobs: '18,320',
    salary: '¥8,200',
    competition: '⭐⭐⭐'
  }
];

// API调用函数
const fetchIndustries = async () => {
  try {
    const response = await getIndustries();
    if (response.code === 200) {
      industries.value = response.data.categories;
    }
  } catch (error) {
    console.error('获取行业列表失败:', error);
    ElMessage.error('获取行业列表失败');
  }
};

const fetchEmploymentTrend = async () => {
  try {
    loading.value = true;
    const params = selectedIndustry.value ? { industry_id: selectedIndustry.value } : {};
    const response = await getEmploymentRateTrend(params);
    if (response.code === 200) {
      employmentTrends.value = response.data.trend_data;
    }
  } catch (error) {
    console.error('获取就业率趋势失败:', error);
    ElMessage.error('获取就业率趋势失败');
  } finally {
    loading.value = false;
  }
};

const fetchSalaryTrend = async () => {
  try {
    const params = selectedIndustry.value ? { industry_id: selectedIndustry.value } : {};
    const response = await getSalaryTrend(params);
    if (response.code === 200) {
      salaryTrends.value = response.data.salary_trend;
    }
  } catch (error) {
    console.error('获取薪资趋势失败:', error);
    ElMessage.error('获取薪资趋势失败');
  }
};

const fetchPopularRanking = async () => {
  try {
    const params = selectedIndustry.value ? { industry_id: selectedIndustry.value, limit: 10 } : { limit: 10 };
    const response = await getPopularRanking(params);
    if (response.code === 200) {
      hotJobs.value = response.data.ranking;
    }
  } catch (error) {
    console.error('获取热门职位排行失败:', error);
    ElMessage.error('获取热门职位排行失败');
  }
};

const fetchStatisticsOverview = async () => {
  try {
    const response = await getStatisticsOverview();
    if (response.code === 200) {
      statisticsOverview.value = response.data.employment_overview;
    }
  } catch (error) {
    console.error('获取统计概览失败:', error);
    ElMessage.error('获取统计概览失败');
  }
};

// 加载所有数据
const loadAllData = async () => {
  await Promise.all([
    fetchEmploymentTrend(),
    fetchSalaryTrend(),
    fetchPopularRanking()
  ]);
};

// 选择行业
const selectIndustry = async (industryId: number | null) => {
  selectedIndustry.value = industryId;
  await loadAllData();
};

// 页面初始化
onMounted(async () => {
  await fetchIndustries();
  await fetchStatisticsOverview();
  await loadAllData();
});

// 获取进度条颜色
const getProgressBarColor = (rate: number) => {
  if (rate < 50) return 'bg-red-500';
  if (rate < 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

// 获取进度条文字颜色
const getProgressTextColor = (rate: number) => {
  if (rate < 50) return 'text-red-500';
  if (rate < 80) return 'text-yellow-500';
  return 'text-green-500';
};
</script>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>
