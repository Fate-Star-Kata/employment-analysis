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
const predictedSalary = {
  range: '¥8,000-12,000',
  confidence: 85,
}

const jobSearchDuration = {
  estimate: '2-3个月',
}

const careerIndex = {
  score: 78,
  level: '良好',
}

const matchingJobs = {
  count: 156,
}

const skillAssessment = [
  { name: '前端开发', score: 85 },
  { name: '后端开发', score: 65 },
  { name: '数据库', score: 70 },
  { name: '项目管理', score: 60 },
  { name: '团队协作', score: 80 },
  { name: '算法设计', score: 55 },
]

// 计算雷达图坐标
const radarPoints = computed(() => {
  const center = 100
  const maxRadius = 80
  const angleStep = (2 * Math.PI) / skillAssessment.length

  return skillAssessment.map((skill, index) => {
    const angle = index * angleStep - Math.PI / 2 // 从顶部开始
    const radius = (skill.score / 100) * maxRadius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')
})

const radarPointsArray = computed(() => {
  const center = 100
  const maxRadius = 80
  const angleStep = (2 * Math.PI) / skillAssessment.length

  return skillAssessment.map((skill, index) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (skill.score / 100) * maxRadius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { x, y }
  })
})

const improvementSuggestions = [
  {
    category: 'technical',
    icon: '💻',
    title: '技术能力提升',
    items: [
      {
        name: 'React高级特性',
        description: '学习Hooks、Context、性能优化等高级特性',
        priority: 'high',
        improvement: 15,
      },
      {
        name: 'TypeScript',
        description: '掌握类型系统，提升代码质量',
        priority: 'high',
        improvement: 12,
      },
      {
        name: 'Node.js后端开发',
        description: '扩展全栈开发能力',
        priority: 'medium',
        improvement: 20,
      },
    ],
  },
  {
    category: 'communication',
    icon: '🗣️',
    title: '沟通协作能力',
    items: [
      {
        name: '技术文档写作',
        description: '提升技术表达和文档编写能力',
        priority: 'medium',
        improvement: 10,
      },
      {
        name: '跨部门协作',
        description: '加强与产品、设计团队的协作',
        priority: 'medium',
        improvement: 8,
      },
      {
        name: '英语口语',
        description: '提升国际化团队协作能力',
        priority: 'low',
        improvement: 5,
      },
    ],
  },
  {
    category: 'learning',
    icon: '📚',
    title: '持续学习能力',
    items: [
      {
        name: '新技术跟进',
        description: '保持对前沿技术的敏感度',
        priority: 'high',
        improvement: 18,
      },
      {
        name: '开源项目参与',
        description: '通过开源项目提升技术影响力',
        priority: 'medium',
        improvement: 15,
      },
      {
        name: '技术分享',
        description: '通过分享巩固和传播知识',
        priority: 'low',
        improvement: 8,
      },
    ],
  },
]

const swotAnalysis = [
  {
    type: 'strengths',
    icon: '💪',
    title: '优势 (Strengths)',
    items: [
      '前端技术基础扎实，熟练掌握主流框架',
      '学习能力强，能快速适应新技术',
      '工作态度认真，注重代码质量',
      '有良好的审美和用户体验意识',
    ],
  },
  {
    type: 'weaknesses',
    icon: '⚠️',
    title: '劣势 (Weaknesses)',
    items: [
      '后端开发经验相对不足',
      '大型项目架构设计经验有限',
      '团队管理和领导经验缺乏',
      '英语口语表达能力有待提升',
    ],
  },
  {
    type: 'opportunities',
    icon: '🌟',
    title: '机会 (Opportunities)',
    items: [
      '前端技术栈持续发展，市场需求旺盛',
      '全栈开发趋势为技能扩展提供机会',
      '远程工作模式增加就业选择',
      '新兴技术领域(如Web3)带来新机遇',
    ],
  },
  {
    type: 'threats',
    icon: '⚡',
    title: '威胁 (Threats)',
    items: [
      '技术更新换代快，需持续学习',
      '市场竞争激烈，同质化严重',
      '经济环境变化影响就业市场',
      'AI工具可能替代部分重复性工作',
    ],
  },
]

function updateSkillAssessment() {
  console.log('重新评估技能')
  // 这里可以调用API重新评估技能
}
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <!-- 页面头部 -->
    <div class="bg-white text-gray-800 py-12 border-b border-base-200">
      <div class="container mx-auto px-4 text-center">
        <RevealMotion :delay="0">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            🔮 个人就业预测
          </h1>
        </RevealMotion>
        <RevealMotion :delay="0.1">
          <p class="text-lg opacity-70 max-w-2xl mx-auto text-gray-600">
            基于大数据分析，为您预测职业发展前景和薪资水平
          </p>
        </RevealMotion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <!-- 预测概览 -->
      <RevealMotion :delay="0.2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                💰
              </div>
              <h3 class="text-lg font-semibold mb-2">
                预测薪资范围
              </h3>
              <div class="text-2xl font-bold">
                {{ predictedSalary.range }}
              </div>
              <div class="text-sm opacity-80">
                置信度: {{ predictedSalary.confidence }}%
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                ⏰
              </div>
              <h3 class="text-lg font-semibold mb-2">
                预计求职时长
              </h3>
              <div class="text-2xl font-bold">
                {{ jobSearchDuration.estimate }}
              </div>
              <div class="text-sm opacity-80">
                基于当前市场状况
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-accent to-accent-focus text-accent-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                📈
              </div>
              <h3 class="text-lg font-semibold mb-2">
                职业发展指数
              </h3>
              <div class="text-2xl font-bold">
                {{ careerIndex.score }}/100
              </div>
              <div class="text-sm opacity-80">
                {{ careerIndex.level }}
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-info to-info-focus text-info-content shadow-lg">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">
                🎯
              </div>
              <h3 class="text-lg font-semibold mb-2">
                匹配职位数
              </h3>
              <div class="text-2xl font-bold">
                {{ matchingJobs.count }}
              </div>
              <div class="text-sm opacity-80">
                当前市场可选职位
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 技能评估雷达图 -->
      <RevealMotion :delay="0.3">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🎯 技能评估雷达图
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="flex justify-center">
                <div class="relative w-80 h-80">
                  <!-- 雷达图背景 -->
                  <svg class="w-full h-full" viewBox="0 0 200 200">
                    <!-- 背景网格 -->
                    <g stroke="#e5e7eb" stroke-width="1" fill="none">
                      <polygon points="100,20 173.2,65 173.2,135 100,180 26.8,135 26.8,65" opacity="0.3" />
                      <polygon points="100,40 146.4,78 146.4,122 100,160 53.6,122 53.6,78" opacity="0.3" />
                      <polygon points="100,60 119.6,91 119.6,109 100,140 80.4,109 80.4,91" opacity="0.3" />
                      <line x1="100" y1="100" x2="100" y2="20" />
                      <line x1="100" y1="100" x2="173.2" y2="65" />
                      <line x1="100" y1="100" x2="173.2" y2="135" />
                      <line x1="100" y1="100" x2="100" y2="180" />
                      <line x1="100" y1="100" x2="26.8" y2="135" />
                      <line x1="100" y1="100" x2="26.8" y2="65" />
                    </g>

                    <!-- 技能数据 -->
                    <polygon
                      :points="radarPoints"
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="#3b82f6"
                      stroke-width="2"
                    />

                    <!-- 技能点 -->
                    <circle
                      v-for="(point, index) in radarPointsArray"
                      :key="index"
                      :cx="point.x"
                      :cy="point.y"
                      r="4"
                      fill="#3b82f6"
                    />
                  </svg>

                  <!-- 技能标签 -->
                  <div class="absolute inset-0">
                    <div class="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      前端开发
                    </div>
                    <div class="absolute top-12 right-2 text-xs font-medium">
                      后端开发
                    </div>
                    <div class="absolute bottom-12 right-2 text-xs font-medium">
                      数据库
                    </div>
                    <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      项目管理
                    </div>
                    <div class="absolute bottom-12 left-2 text-xs font-medium">
                      团队协作
                    </div>
                    <div class="absolute top-12 left-2 text-xs font-medium">
                      算法设计
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold mb-4">
                  技能详细评分
                </h3>
                <div
                  v-for="skill in skillAssessment"
                  :key="skill.name"
                  class="flex items-center justify-between"
                >
                  <span class="font-medium">{{ skill.name }}</span>
                  <div class="flex items-center gap-3">
                    <div class="w-32">
                      <progress
                        class="progress progress-primary"
                        :value="skill.score"
                        max="100"
                      />
                    </div>
                    <span class="text-sm font-bold w-12">{{ skill.score }}%</span>
                  </div>
                </div>

                <div class="mt-6">
                  <button class="btn btn-primary btn-sm" @click="updateSkillAssessment">
                    🔄 重新评估
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 能力提升建议 -->
      <RevealMotion :delay="0.4">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              🚀 能力提升建议
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="suggestion in improvementSuggestions"
                :key="suggestion.category"
                class="card bg-base-100 shadow-sm"
              >
                <div class="card-body p-4">
                  <div class="text-center mb-4">
                    <div class="text-3xl mb-2">
                      {{ suggestion.icon }}
                    </div>
                    <h3 class="text-lg font-semibold">
                      {{ suggestion.title }}
                    </h3>
                  </div>

                  <div class="space-y-3">
                    <div
                      v-for="item in suggestion.items"
                      :key="item.name"
                      class="border border-base-300 rounded-lg p-3"
                    >
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-sm">{{ item.name }}</span>
                        <div
                          class="badge badge-sm" :class="[
                            item.priority === 'high' ? 'badge-error'
                            : item.priority === 'medium' ? 'badge-warning' : 'badge-info',
                          ]"
                        >
                          {{ item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低' }}
                        </div>
                      </div>
                      <p class="text-xs opacity-70">
                        {{ item.description }}
                      </p>
                      <div class="mt-2">
                        <div class="text-xs opacity-60">
                          预计提升: +{{ item.improvement }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- SWOT分析 -->
      <RevealMotion :delay="0.5">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              📊 个人竞争力SWOT分析
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="swot in swotAnalysis"
                :key="swot.type"
                class="card shadow-sm" :class="[
                  swot.type === 'strengths' ? 'bg-success text-success-content'
                  : swot.type === 'weaknesses' ? 'bg-error text-error-content'
                    : swot.type === 'opportunities' ? 'bg-info text-info-content' : 'bg-warning text-warning-content',
                ]"
              >
                <div class="card-body p-4">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="text-2xl">
                      {{ swot.icon }}
                    </div>
                    <h3 class="text-lg font-semibold">
                      {{ swot.title }}
                    </h3>
                  </div>

                  <ul class="space-y-2">
                    <li
                      v-for="item in swot.items"
                      :key="item"
                      class="flex items-start gap-2 text-sm"
                    >
                      <span class="text-xs mt-1">•</span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealMotion>

      <!-- 预测准确性说明 -->
      <RevealMotion :delay="0.6">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-6">
            <h2 class="card-title text-xl mb-6">
              📈 预测模型说明
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-3xl mb-3">
                  🤖
                </div>
                <h4 class="font-semibold mb-2">
                  机器学习算法
                </h4>
                <p class="text-sm opacity-70">
                  基于历史数据训练的深度学习模型
                </p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">
                  📊
                </div>
                <h4 class="font-semibold mb-2">
                  大数据分析
                </h4>
                <p class="text-sm opacity-70">
                  整合多维度就业市场数据
                </p>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-3">
                  🎯
                </div>
                <h4 class="font-semibold mb-2">
                  个性化预测
                </h4>
                <p class="text-sm opacity-70">
                  结合个人背景和市场趋势
                </p>
              </div>
            </div>

            <div class="mt-6 p-4 bg-base-100 rounded-lg">
              <h4 class="font-semibold mb-2">
                📝 预测准确性声明
              </h4>
              <p class="text-sm opacity-70">
                本预测结果基于当前市场数据和历史趋势分析得出，仅供参考。实际就业情况可能受多种因素影响，
                包括但不限于市场变化、个人努力程度、机遇等。建议将预测结果作为职业规划的参考依据之一。
              </p>
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

<style scoped>
/* 使用 Tailwind CSS 和 DaisyUI，无需额外样式 */
</style>
