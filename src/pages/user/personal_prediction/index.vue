<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-light tracking-tight mb-4 text-gray-900">
            🔮 个人就业预测
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg max-w-2xl mx-auto text-gray-600">
            基于大数据分析，为您预测职业发展前景和薪资水平
          </p>
        </RevealMotion>
        <RevealMotion :delay="0.2">
          <div class="mt-8">
            <button 
              @click="showParamsModal = true"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              开始预测分析
            </button>
          </div>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="loading loading-spinner loading-lg"></div>
        <span class="ml-3 text-lg">正在分析您的就业前景...</span>
      </div>

      <!-- 未开始预测提示 -->
      <div v-else-if="!userParams" class="flex flex-col items-center justify-center py-16">
        <div class="text-6xl mb-6">🔮</div>
        <h2 class="text-2xl font-medium text-gray-700 mb-4">开始您的就业预测分析</h2>
        <p class="text-gray-500 mb-8 text-center max-w-md">
          点击上方"开始预测分析"按钮，输入您的求职意向，我们将为您提供专业的就业前景分析
        </p>
        <button 
          @click="showParamsModal = true"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          立即开始预测
        </button>
      </div>

      <!-- 预测概览 -->
      <RevealMotion :delay="0.2" v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body text-center">
              <div class="text-3xl mb-2 text-gray-600">💰</div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">预测薪资范围</h3>
              <div class="text-2xl font-semibold text-gray-900">{{ predictedSalary.range }}</div>
              <div class="text-sm text-gray-500">置信度: {{ predictedSalary.confidence }}%</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body text-center">
              <div class="text-3xl mb-2 text-gray-600">⏰</div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">预计求职时长</h3>
              <div class="text-2xl font-semibold text-gray-900">{{ jobSearchDuration.estimate }}</div>
              <div class="text-sm text-gray-500">基于当前市场状况</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body text-center">
              <div class="text-3xl mb-2 text-gray-600">📈</div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">就业成功率</h3>
              <div class="text-2xl font-semibold text-gray-900">{{ employmentSuccessRate.rate }}%</div>
              <div class="text-sm text-gray-500">{{ employmentSuccessRate.level }}</div>
            </div>
          </div>
          
          <div class="card bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body text-center">
              <div class="text-3xl mb-2 text-gray-600">🎯</div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">综合评分</h3>
              <div class="text-2xl font-semibold text-gray-900">{{ overallScore.score }}/100</div>
              <div class="text-sm text-gray-500">{{ overallScore.description }}</div>
            </div>
          </div>
        </div>
      </RevealMotion>



      <!-- 能力提升建议 -->
      <RevealMotion :delay="0.4" v-if="userParams">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="text-2xl">🚀</div>
              <h2 class="text-xl font-medium text-gray-800">能力提升建议</h2>
              <div class="badge badge-info badge-sm ml-auto">基于AI分析</div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div 
                v-for="suggestion in improvementSuggestions" 
                :key="suggestion.category"
                class="card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div class="card-body p-5">
                  <div class="text-center mb-5">
                    <div class="text-4xl mb-3 filter drop-shadow-sm">{{ suggestion.icon }}</div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ suggestion.title }}</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <div 
                      v-for="(item, index) in suggestion.items" 
                      :key="item.name"
                      class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
                    >
                      <div class="flex justify-between items-start mb-3">
                        <span class="font-medium text-sm text-gray-800 leading-tight">{{ item.name }}</span>
                        <div :class="[
                          'badge badge-sm font-medium',
                          item.priority === 'high' ? 'badge-error text-white' :
                          item.priority === 'medium' ? 'badge-warning text-white' : 'badge-info text-white'
                        ]">
                          {{ item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级' }}
                        </div>
                      </div>
                      
                      <p class="text-xs text-gray-600 leading-relaxed mb-3">{{ item.description }}</p>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span class="text-xs font-medium text-green-600">预计提升 +{{ item.improvement }}%</span>
                        </div>
                        <div class="text-xs text-gray-400">#{{ index + 1 }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 分类总结 -->
                  <div class="mt-5 pt-4 border-t border-gray-200">
                    <div class="text-center">
                      <span class="text-xs text-gray-500">{{ suggestion.items.length }} 项建议</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 底部说明 -->
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="text-blue-500 text-lg mt-0.5">💡</div>
                <div>
                  <h4 class="font-medium text-blue-800 mb-1">个性化建议说明</h4>
                  <p class="text-sm text-blue-700">
                    以上建议基于您的个人背景、目标职位和当前市场需求生成。建议按优先级逐步实施，
                    重点关注高优先级项目以获得最大提升效果。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>



      <!-- 预测准确性说明 -->
      <RevealMotion :delay="0.6" v-if="userParams">
        <div class="card bg-white border border-gray-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="text-xl font-medium mb-6 text-gray-800">📈 预测模型说明</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-3xl mb-3 text-gray-600">🤖</div>
                <h4 class="font-medium mb-2 text-gray-800">机器学习算法</h4>
                <p class="text-sm text-gray-600">基于历史数据训练的深度学习模型</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3 text-gray-600">📊</div>
                <h4 class="font-medium mb-2 text-gray-800">大数据分析</h4>
                <p class="text-sm text-gray-600">整合多维度就业市场数据</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3 text-gray-600">🎯</div>
                <h4 class="font-medium mb-2 text-gray-800">个性化预测</h4>
                <p class="text-sm text-gray-600">结合个人背景和市场趋势</p>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 class="font-medium mb-2 text-gray-800">📝 预测准确性声明</h4>
              <p class="text-sm text-gray-600">
                本预测结果基于当前市场数据和历史趋势分析得出，仅供参考。实际就业情况可能受多种因素影响，
                包括但不限于市场变化、个人努力程度、机遇等。建议将预测结果作为职业规划的参考依据之一。
              </p>
            </div>
          </div>
        </div>
      </RevealMotion>
    </div>

    <!-- 页脚 -->
    <footer class="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      {{ footerText }}
    </footer>
  </div>

  <!-- 参数输入弹窗 -->
  <PredictionParamsModal 
    :visible="showParamsModal"
    @close="showParamsModal = false"
    @submit="handleParamsSubmit"
  />
</template>

<script setup lang="ts">
import { h, defineComponent, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { Motion } from "motion-v";
import PredictionParamsModal from '@/components/PredictionParamsModal.vue';
import { 
  predictEmploymentSuccess,
  predictSalary,
  predictJobDuration,
  getComprehensivePrediction
} from '@/api/user/prediction';
import type {
  EmploymentPredictionResponse,
  SalaryPredictionResponse,
  JobDurationPredictionResponse,
  ComprehensivePredictionResponse
} from '@/types/apis/APIS_T';

interface PredictionParams {
  target_industry: string
  target_position: string
  target_city: string
  job_search_intensity: 'low' | 'medium' | 'high'
}

const footerText = import.meta.env.VITE_APP_FOOTER || "版权所有 © 2025 HZSYSTEM";

// 响应式数据
const loading = ref(false);
const showParamsModal = ref(false);
const userParams = ref<PredictionParams | null>(null);
const employmentPrediction = ref<EmploymentPredictionResponse['data'] | null>(null);
const salaryPrediction = ref<SalaryPredictionResponse['data'] | null>(null);
const durationPrediction = ref<JobDurationPredictionResponse['data'] | null>(null);
const comprehensivePrediction = ref<ComprehensivePredictionResponse['data'] | null>(null);

// 学生档案ID (实际应用中应该从用户状态或路由参数获取)
const studentProfileId = ref(1);

// 处理参数提交
const handleParamsSubmit = async (params: PredictionParams) => {
  userParams.value = params;
  showParamsModal.value = false;
  loading.value = true;
  
  try {
    // 并行调用所有预测API
    await Promise.all([
      fetchEmploymentPrediction(),
      fetchSalaryPrediction(),
      fetchDurationPrediction(),
      fetchComprehensivePrediction()
    ]);
  } catch (error) {
    console.error('预测分析失败:', error);
  } finally {
    loading.value = false;
  }
};

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

// API调用函数
const fetchEmploymentPrediction = async () => {
  if (!userParams.value) return;
  
  try {
    const response = await predictEmploymentSuccess({
      student_profile_id: studentProfileId.value,
      target_industry: userParams.value.target_industry,
      target_position: userParams.value.target_position,
      target_city: userParams.value.target_city
    });
    employmentPrediction.value = response.data;
  } catch (error) {
    console.error('获取就业预测失败:', error);
  }
};

const fetchSalaryPrediction = async () => {
  if (!userParams.value) return;
  
  try {
    const response = await predictSalary({
      student_profile_id: studentProfileId.value,
      target_industry: userParams.value.target_industry,
      target_position: userParams.value.target_position,
      target_city: userParams.value.target_city,
      experience_years: 2 // 这个可以后续从用户档案获取
    });
    salaryPrediction.value = response.data;
  } catch (error) {
    console.error('获取薪资预测失败:', error);
  }
};

const fetchDurationPrediction = async () => {
  if (!userParams.value) return;
  
  try {
    const response = await predictJobDuration({
      student_profile_id: studentProfileId.value,
      job_search_intensity: userParams.value.job_search_intensity,
      target_industry: userParams.value.target_industry,
      target_position: userParams.value.target_position
    });
    durationPrediction.value = response.data;
  } catch (error) {
    console.error('获取求职时长预测失败:', error);
  }
};

const fetchComprehensivePrediction = async () => {
  if (!userParams.value) return;
  
  try {
    const response = await getComprehensivePrediction({
      student_profile_id: studentProfileId.value,
      target_industry: userParams.value.target_industry,
      target_position: userParams.value.target_position,
      target_city: userParams.value.target_city,
      job_search_intensity: userParams.value.job_search_intensity
    });
    comprehensivePrediction.value = response.data;
  } catch (error) {
    console.error('获取综合预测失败:', error);
  }
};

// 加载所有预测数据
const loadAllPredictions = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchEmploymentPrediction(),
      fetchSalaryPrediction(),
      fetchDurationPrediction(),
      fetchComprehensivePrediction()
    ]);
  } finally {
    loading.value = false;
  }
};

// 计算属性 - 基于API数据
const predictedSalary = computed(() => {
  if (salaryPrediction.value) {
    const { predicted_salary_min, predicted_salary_max, confidence_score } = salaryPrediction.value;
    return {
      range: `¥${predicted_salary_min.toLocaleString()}-${predicted_salary_max.toLocaleString()}`,
      confidence: Math.round(confidence_score * 100)
    };
  }
  return {
    range: '--',
    confidence: 0
  };
});

const jobSearchDuration = computed(() => {
  if (durationPrediction.value) {
    const days = durationPrediction.value.predicted_days;
    const months = Math.round(days / 30);
    return {
      estimate: `${months}个月`
    };
  }
  return {
    estimate: '--'
  };
});

const employmentSuccessRate = computed(() => {
  if (comprehensivePrediction.value) {
    const rate = comprehensivePrediction.value.employment_success_rate;
    let level = '一般';
    if (rate >= 80) level = '优秀';
    else if (rate >= 60) level = '良好';
    return { rate, level };
  }
  return {
    rate: 0,
    level: '--'
  };
});

const overallScore = computed(() => {
  if (comprehensivePrediction.value) {
    const score = Math.min(comprehensivePrediction.value.overall_score || 0, 100);
    let description = '表现良好';
    if (score >= 90) description = '表现优异';
    else if (score >= 80) description = '表现良好';
    else if (score >= 70) description = '表现一般';
    else description = '需要提升';
    return { score, description };
  }
  return {
    score: 0,
    description: '--'
  };
});





// 能力提升建议 - 基于API数据
const improvementSuggestions = computed(() => {
  // 如果没有预测数据，返回空数组
  if (!userParams.value) {
    return [];
  }
  
  const suggestions = [];
  
  // 从API获取所有建议
  const apiRecommendations = comprehensivePrediction.value?.financial_analysis?.recommendations || [];
  
  // 技术能力提升建议
  const technicalItems = [];
  
  // 使用API建议的前半部分作为技术建议，或使用默认建议
  if (apiRecommendations.length > 0) {
    // 将API建议分类处理
    apiRecommendations.forEach((recommendation, index) => {
      technicalItems.push({
        name: `能力提升建议 ${index + 1}`,
        description: recommendation,
        priority: index === 0 ? 'high' : 'medium',
        improvement: 15 - index * 2
      });
    });
  } else {
    // 默认技术建议
    technicalItems.push(
      {
        name: 'React高级特性',
        description: '学习Hooks、Context、性能优化等高级特性',
        priority: 'high',
        improvement: 15
      },
      {
        name: 'TypeScript',
        description: '掌握类型系统，提升代码质量',
        priority: 'high',
        improvement: 12
      }
    );
  }
  
  suggestions.push({
    category: 'technical',
    icon: '💻',
    title: '能力提升建议',
    items: technicalItems
  });
  
  // 职业发展建议（使用固定建议）
  const careerItems = [
    {
      name: '薪资谈判',
      description: '学习薪资谈判技巧，争取更好待遇',
      priority: 'medium',
      improvement: 10
    },
    {
      name: '项目管理',
      description: '学习敏捷开发和项目管理方法',
      priority: 'medium',
      improvement: 8
    }
  ];
  
  suggestions.push({
    category: 'career',
    icon: '🎯',
    title: '职业发展建议',
    items: careerItems
  });
  
  // 技能拓展建议
  suggestions.push({
    category: 'skills',
    icon: '📚',
    title: '技能拓展',
    items: [
      {
        name: '技术分享',
        description: '通过技术博客和开源贡献提升影响力',
        priority: 'low',
        improvement: 8
      },
      {
        name: '行业认证',
        description: '获取相关技术认证，提升专业度',
        priority: 'low',
        improvement: 6
      }
    ]
  });
  
  return suggestions;
});



// 页面初始化
// onMounted(() => {
//   loadAllPredictions();
// });
</script>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>