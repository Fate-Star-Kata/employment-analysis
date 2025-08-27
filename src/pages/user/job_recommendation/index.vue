<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-base-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            💼 个人就业推荐
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg opacity-70 max-w-2xl mx-auto text-gray-600">
            基于您的能力画像和偏好，为您智能匹配最适合的职位和公司
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 推荐设置 -->
      <RevealMotion :delay="0.2">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">🎯 推荐设置</h2>
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
              <button class="btn btn-primary" @click="updateRecommendations">🔄 更新推荐</button>
              <button class="btn btn-secondary" @click="saveSettings">💾 保存设置</button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 匹配度分析 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">📊 个人匹配度分析</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                v-for="analysis in matchAnalysis" 
                :key="analysis.type"
                class="text-center"
              >
                <div class="text-4xl mb-3">{{ analysis.icon }}</div>
                <h4 class="font-semibold mb-2">{{ analysis.title }}</h4>
                <div class="radial-progress text-primary mb-2" :style="`--value:${analysis.score}`" role="progressbar">
                  {{ analysis.score }}%
                </div>
                <p class="text-sm opacity-70">{{ analysis.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 推荐职位列表 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">🌟 为您推荐的职位</h2>
            <div class="space-y-6">
              <div 
                v-for="job in recommendedJobs" 
                :key="job.id"
                class="card bg-base-100 shadow-sm hover:shadow-md transition"
              >
                <div class="card-body p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold">{{ job.title }}</h3>
                        <div :class="[
                          'badge',
                          job.matchScore >= 90 ? 'badge-success' :
                          job.matchScore >= 80 ? 'badge-warning' : 'badge-error'
                        ]">
                          匹配度: {{ job.matchScore }}%
                        </div>
                      </div>
                      <div class="flex items-center gap-4 text-sm opacity-70">
                        <span>🏢 {{ job.company }}</span>
                        <span>📍 {{ job.location }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-success">{{ job.salary }}</div>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mb-4">
                    <div 
                      v-for="tag in job.tags" 
                      :key="tag"
                      class="badge badge-outline badge-sm"
                    >
                      {{ tag }}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class="font-semibold mb-2">职位要求：</h4>
                    <ul class="list-disc list-inside text-sm space-y-1 opacity-80">
                      <li v-for="req in job.requirements" :key="req">{{ req }}</li>
                    </ul>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class="font-semibold mb-2">匹配亮点：</h4>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="highlight in job.highlights" 
                        :key="highlight.text"
                        :class="[
                          'badge badge-sm',
                          highlight.type === 'good' ? 'badge-success' :
                          highlight.type === 'warning' ? 'badge-warning' : 'badge-info'
                        ]"
                      >
                        {{ highlight.icon }} {{ highlight.text }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                    <button class="btn btn-primary btn-sm" @click="applyJob(job.id)">📝 立即申请</button>
                    <button class="btn btn-secondary btn-sm" @click="saveJob(job.id)">💾 收藏职位</button>
                    <button class="btn btn-info btn-sm" @click="viewDetails(job.id)">👁️ 查看详情</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-6">
              <button class="btn btn-secondary" @click="loadMoreJobs">📄 加载更多职位</button>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 推荐算法说明 -->
      <RevealMotion :delay="0.5">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">🤖 推荐算法说明</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-3xl mb-3">🎯</div>
                <h4 class="font-semibold mb-2">技能匹配</h4>
                <p class="text-sm opacity-70">基于您的技能标签与职位要求进行智能匹配</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">📊</div>
                <h4 class="font-semibold mb-2">数据分析</h4>
                <p class="text-sm opacity-70">结合市场数据和历史成功案例进行推荐</p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">🔄</div>
                <h4 class="font-semibold mb-2">持续优化</h4>
                <p class="text-sm opacity-70">根据您的反馈不断优化推荐算法</p>
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

const matchAnalysis = [
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
];

const recommendedJobs = [
  {
    id: 1,
    title: '前端开发工程师',
    company: '阿里巴巴集团',
    location: '杭州·西湖区',
    salary: '¥8,000-12,000/月',
    matchScore: 95,
    tags: ['大型企业', '五险一金', '弹性工作'],
    requirements: [
      '熟练掌握HTML、CSS、JavaScript',
      '熟悉React或Vue框架',
      '有移动端开发经验优先',
      '良好的团队协作能力'
    ],
    highlights: [
      { icon: '✅', text: '技能完全匹配', type: 'good' },
      { icon: '✅', text: '薪资符合期望', type: 'good' },
      { icon: '✅', text: '地点理想', type: 'good' }
    ]
  },
  {
    id: 2,
    title: '全栈开发工程师',
    company: '字节跳动',
    location: '北京·朝阳区',
    salary: '¥10,000-15,000/月',
    matchScore: 88,
    tags: ['互联网', '股票期权', '免费三餐'],
    requirements: [
      '精通前端技术栈(React/Vue)',
      '熟悉后端开发(Node.js/Python)',
      '有数据库设计经验',
      '1-3年相关工作经验'
    ],
    highlights: [
      { icon: '✅', text: '技能基本匹配', type: 'good' },
      { icon: '⚠️', text: '需提升后端技能', type: 'warning' },
      { icon: '✅', text: '发展前景好', type: 'good' }
    ]
  },
  {
    id: 3,
    title: 'UI/UX设计师',
    company: '腾讯科技',
    location: '深圳·南山区',
    salary: '¥7,000-10,000/月',
    matchScore: 72,
    tags: ['大厂', '设计团队', '培训机会'],
    requirements: [
      '熟练使用Figma、Sketch等设计工具',
      '有移动端UI设计经验',
      '理解用户体验设计原则',
      '有前端开发基础优先'
    ],
    highlights: [
      { icon: '⚠️', text: '需学习设计技能', type: 'warning' },
      { icon: '✅', text: '前端基础有优势', type: 'good' },
      { icon: '✅', text: '转型机会', type: 'info' }
    ]
  }
];

const updateRecommendations = () => {
  console.log('更新推荐设置:', settings.value);
  // 这里可以调用API更新推荐结果
};

const saveSettings = () => {
  console.log('保存设置:', settings.value);
  // 这里可以调用API保存用户设置
};

const applyJob = (jobId: number) => {
  console.log('申请职位:', jobId);
  // 这里可以跳转到申请页面或调用申请API
};

const saveJob = (jobId: number) => {
  console.log('收藏职位:', jobId);
  // 这里可以调用API收藏职位
};

const viewDetails = (jobId: number) => {
  console.log('查看详情:', jobId);
  // 这里可以跳转到职位详情页面
};

const loadMoreJobs = () => {
  console.log('加载更多职位');
  // 这里可以调用API加载更多职位
};
</script>

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>