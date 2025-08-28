<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-light tracking-tight mb-4 text-gray-900">
            💼 个人就业推荐
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg max-w-2xl mx-auto text-gray-600">
            基于您的能力画像和偏好，为您智能匹配最适合的职位和公司
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 推荐设置 -->
      <RevealMotion :delay="0.2">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">🎯 推荐设置</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">职位类型偏好</span>
                </label>
                <select v-model="settings.jobType" class="select select-bordered">
                  <option value="all">全部类型</option>
                  <option value="fulltime">全职</option>
                  <option value="parttime">兼职</option>
                  <option value="internship">实习</option>
                  <option value="remote">远程工作</option>
                </select>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">经验要求</span>
                </label>
                <select v-model="settings.experienceLevel" class="select select-bordered">
                  <option value="entry">应届毕业生</option>
                  <option value="junior">1-3年经验</option>
                  <option value="mid">3-5年经验</option>
                  <option value="senior">5年以上经验</option>
                </select>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">期望薪资范围</span>
                </label>
                <select v-model="settings.salaryRange" class="select select-bordered">
                  <option value="3000-5000">3000-5000元</option>
                  <option value="5000-8000">5000-8000元</option>
                  <option value="8000-12000">8000-12000元</option>
                  <option value="12000-20000">12000-20000元</option>
                  <option value="20000+">20000元以上</option>
                </select>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">公司规模偏好</span>
                </label>
                <select v-model="settings.companySize" class="select select-bordered">
                  <option value="all">不限</option>
                  <option value="startup">创业公司(50人以下)</option>
                  <option value="small">小型公司(50-200人)</option>
                  <option value="medium">中型公司(200-1000人)</option>
                  <option value="large">大型公司(1000人以上)</option>
                </select>
              </div>
            </div>
            
            <div class="flex gap-3">
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="updateRecommendations">🔄 更新推荐</button>
              <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="saveSettings">💾 保存设置</button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 匹配度分析 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">📊 个人匹配度分析</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                v-for="analysis in matchAnalysis" 
                :key="analysis.type"
                class="card bg-white border border-gray-200 text-center"
              >
                <div class="card-body p-4">
                  <div class="text-2xl mb-2">{{ analysis.icon }}</div>
                  <h3 class="font-medium text-gray-900 mb-1">{{ analysis.title }}</h3>
                  <div class="text-xl font-medium text-gray-800 mb-2">{{ analysis.score }}%</div>
                  <p class="text-sm text-gray-600">{{ analysis.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 推荐职位列表 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">🌟 为您推荐的职位</h2>
            <div class="space-y-6">
              <div 
                v-for="job in recommendedJobs" 
                :key="job.id"
                class="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div class="card-body p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-medium text-gray-900">{{ job.title }}</h3>
                        <div :class="[
                          'badge',
                          job.match_score >= 90 ? 'badge-success' :
                          job.match_score >= 80 ? 'badge-warning' : 'badge-error'
                        ]">
                          匹配度: {{ job.match_score }}%
                        </div>
                      </div>
                      <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span>🏢 {{ job.company.name }}</span>
                        <span>📍 {{ job.work_location }}</span>
                        <span>🏭 {{ job.industry }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-medium text-gray-900">¥{{ formatSalaryRange(job.salary_min, job.salary_max) }}/月</div>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mb-4">
                    <div 
                      v-for="tag in ['Vue.js', 'JavaScript', 'HTML/CSS'].slice(0, 5)" 
                      :key="tag"
                      class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm border border-gray-200"
                    >
                      {{ tag }}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-800">职位要求：</h4>
                    <ul class="list-disc list-inside text-sm space-y-1 text-gray-600">
                      <li>1-3年工作经验</li>
                      <li>本科及以上学历</li>
                      <li>熟练掌握相关技术栈</li>
                    </ul>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-800">匹配亮点：</h4>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="reason in job.match_reasons.slice(0, 3)" 
                        :key="reason"
                        class="badge badge-sm badge-success"
                      >
                        ✅ {{ reason }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                    <button class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm" @click="applyJob(job.id)">📝 立即申请</button>
                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors text-sm" @click="saveJob(job.id)">💾 收藏职位</button>
                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors text-sm" @click="viewDetails(job.id)">👁️ 查看详情</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-6">
              <button class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="loadMoreJobs">📄 加载更多职位</button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 推荐算法说明 -->
      <RevealMotion :delay="0.5">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">🤖 推荐算法说明</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-3xl mb-3">🎯</div>
                <h4 class="font-medium mb-2 text-gray-800">技能匹配</h4>
                <p class="text-sm text-gray-600">基于您的技能标签与职位要求进行智能匹配</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">📊</div>
                <h4 class="font-medium mb-2 text-gray-800">数据分析</h4>
                <p class="text-sm text-gray-600">结合市场数据和历史成功案例进行推荐</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">🔄</div>
                <h4 class="font-medium mb-2 text-gray-800">持续优化</h4>
                <p class="text-sm text-gray-600">根据您的反馈不断优化推荐算法</p>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>
    </div>

    <!-- 职位详情模态框 -->
    <div v-if="showJobDetail" class="fixed inset-0 flex items-center justify-center z-50" style="background-color: #00000020;" @click="closeJobDetail">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-6 p-6 border-b border-gray-200">
          <h3 class="font-medium text-lg text-gray-900">职位详情</h3>
          <button class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600" @click="closeJobDetail">✕</button>
        </div>
        
        <div v-if="selectedJob" class="space-y-6 p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium mb-3 text-gray-800">基本信息</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium text-gray-700">职位:</span> <span class="text-gray-600">{{ selectedJob.title }}</span></p>
                <p><span class="font-medium text-gray-700">公司:</span> <span class="text-gray-600">{{ selectedJob.company?.name || selectedJob.company_name || '未知公司' }}</span></p>
                <p><span class="font-medium text-gray-700">地点:</span> <span class="text-gray-600">{{ selectedJob.work_location || selectedJob.location }}</span></p>
                <p><span class="font-medium text-gray-700">薪资:</span> <span class="text-gray-600">¥{{ selectedJob.salary_min && selectedJob.salary_max ? formatSalaryRange(selectedJob.salary_min, selectedJob.salary_max) : (selectedJob.salary_range ? formatSalary(selectedJob.salary_range) : '面议') }}/月</span></p>
                <p><span class="font-medium text-gray-700">学历要求:</span> <span class="text-gray-600">{{ selectedJob.education || '本科及以上' }}</span></p>
                <p><span class="font-medium text-gray-700">工作经验:</span> <span class="text-gray-600">{{ selectedJob.experience || '1-3年' }}</span></p>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-3 text-gray-800">技能要求</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in ['JavaScript', 'Vue.js', 'HTML/CSS', 'Git']" :key="skill" class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm border border-gray-200">{{ skill }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium mb-3 text-gray-800">职位描述</h4>
            <p class="text-sm leading-relaxed text-gray-600">{{ selectedJob.description }}</p>
          </div>
          
          <div class="flex gap-3 border-t border-gray-200 pt-6">
            <button class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors" @click="applyJob(selectedJob.id)">立即申请</button>
            <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="saveJob(selectedJob.id)">收藏职位</button>
            <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors" @click="closeJobDetail">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
      {{ footerText }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, onMounted, onBeforeUnmount, ref, computed, reactive } from "vue";
import { Motion } from "motion-v";
import { ElMessage } from 'element-plus';
import { getJobRecommendations, applyJob as applyJobApi, getJobDetail } from '../../../api/user/job';
import type { 
  RecommendedJob, 
  JobPosition,
  ApplyJobRequest
} from '../../../types/apis/APIS_T';

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

// 数据定义
const settings = ref({
  jobType: 'all',
  experienceLevel: 'entry',
  salaryRange: '8000-12000',
  companySize: 'all'
});

const matchAnalysis = reactive([
  {
    type: 'skill',
    icon: '🎯',
    title: '技能匹配度',
    score: 85,
    description: '您的技能与目标职位高度匹配'
  },
  {
    type: 'industry',
    icon: '🏢',
    title: '行业适配度',
    score: 78,
    description: '在IT行业有较强的竞争优势'
  },
  {
    type: 'location',
    icon: '📍',
    title: '地域匹配度',
    score: 92,
    description: '目标城市职位资源丰富'
  },
  {
    type: 'salary',
    icon: '💰',
    title: '薪资期望匹配',
    score: 88,
    description: '薪资期望与市场水平相符'
  }
]);

const recommendedJobs = ref<RecommendedJob[]>([]);
const loading = ref(false);
const selectedJob = ref<RecommendedJob | JobPosition | null>(null);
const showJobDetail = ref(false);

// 更新推荐
const updateRecommendations = async () => {
  loading.value = true;
  try {
    const response = await getJobRecommendations();
    if (response.code === 200) {
      recommendedJobs.value = response.data.recommendations;
      // 更新匹配度分析
      if (recommendedJobs.value.length > 0) {
        const avgMatch = recommendedJobs.value.reduce((sum, job) => sum + job.match_score, 0) / recommendedJobs.value.length;
        matchAnalysis[0].score = Math.round(avgMatch);
      }
      ElMessage.success('推荐已更新');
    } else {
      ElMessage.error(response.msg || '获取推荐失败');
    }
  } catch (error) {
    console.error('获取推荐失败:', error);
    ElMessage.error('更新失败，请重试');
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  try {
    // 这里可以调用保存用户偏好设置的API
    await new Promise(resolve => setTimeout(resolve, 500));
    ElMessage.success('设置已保存');
    // 保存后重新获取推荐
    await updateRecommendations();
  } catch (error) {
    ElMessage.error('保存失败，请重试');
  }
};

// 申请职位
const applyJob = async (jobId: number) => {
  try {
    const job = recommendedJobs.value.find(j => j.id === jobId);
    if (!job) return;

    const requestData = {
      cover_letter: `我对${job.title}职位很感兴趣，希望能够加入贵公司。`
    };

    const response = await applyJobApi(job.id, requestData);
    if (response.code === 200) {
      ElMessage.success(`已申请 ${job.title}`);
    } else {
      ElMessage.error(response.msg || '申请失败');
    }
  } catch (error) {
    console.error('申请职位失败:', error);
    ElMessage.error('申请失败，请重试');
  }
};

// 收藏职位
const saveJob = async (jobId: number) => {
  try {
    const job = recommendedJobs.value.find(j => j.id === jobId);
    if (!job) return;
    
    // 这里可以添加收藏职位的逻辑
    ElMessage.success(`已收藏 ${job.title}`);
  } catch (error) {
    console.error('收藏职位失败:', error);
    ElMessage.error('收藏失败，请重试');
  }
};

// 查看详情
const viewDetails = async (jobId: number) => {
  try {
    const job = recommendedJobs.value.find(j => j.id === jobId);
    if (job) {
      selectedJob.value = job;
      showJobDetail.value = true;
    } else {
      // 如果在推荐列表中找不到，则尝试从API获取
      const response = await getJobDetail(jobId);
      if (response.code === 200) {
        selectedJob.value = response.data;
        showJobDetail.value = true;
      } else {
        ElMessage.error(response.msg || '获取职位详情失败');
      }
    }
  } catch (error) {
    console.error('获取职位详情失败:', error);
    ElMessage.error('获取详情失败，请重试');
  }
};

const closeJobDetail = () => {
  showJobDetail.value = false;
  selectedJob.value = null;
};

// 加载更多
const loadMoreJobs = async () => {
  loading.value = true;
  try {
    const response = await getJobRecommendations();
    if (response.code === 200) {
      // 过滤掉已存在的职位，避免重复
      const existingIds = new Set(recommendedJobs.value.map(job => job.id));
      const newJobs = response.data.recommendations.filter(job => !existingIds.has(job.id));
      
      if (newJobs.length > 0) {
        recommendedJobs.value.push(...newJobs);
        ElMessage.success(`已加载 ${newJobs.length} 个新职位`);
      } else {
        ElMessage.info('暂无更多职位');
      }
    }
  } catch (error) {
    console.error('加载更多职位失败:', error);
    ElMessage.error('加载失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 格式化薪资范围显示
const formatSalaryRange = (salaryMin: number, salaryMax: number) => {
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'W';
    }
    return (num / 1000).toFixed(1) + 'K';
  };
  return `${formatNumber(salaryMin)}-${formatNumber(salaryMax)}`;
};

// 格式化薪资显示（兼容旧版本）
const formatSalary = (salaryRange: { min: number; max: number }) => {
  return formatSalaryRange(salaryRange.min, salaryRange.max);
};

// 页面初始化
onMounted(async () => {
  // 页面加载时直接获取推荐
  await updateRecommendations();
});
</script>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>
