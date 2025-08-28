<template>
  <div v-if="visible" class="fixed inset-0 bg-[#00000020] flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800">预测参数设置</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 目标行业 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标行业</label>
          <select v-model="formData.target_industry" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">请选择行业</option>
            <option value="互联网">互联网</option>
            <option value="金融">金融</option>
            <option value="教育">教育</option>
            <option value="医疗">医疗</option>
            <option value="制造业">制造业</option>
            <option value="房地产">房地产</option>
            <option value="零售">零售</option>
            <option value="咨询">咨询</option>
          </select>
        </div>

        <!-- 目标职位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标职位</label>
          <input 
            v-model="formData.target_position" 
            type="text" 
            placeholder="如：前端开发工程师"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- 目标城市 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标城市</label>
          <select v-model="formData.target_city" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">请选择城市</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="广州">广州</option>
            <option value="深圳">深圳</option>
            <option value="杭州">杭州</option>
            <option value="南京">南京</option>
            <option value="成都">成都</option>
            <option value="武汉">武汉</option>
          </select>
        </div>



        <!-- 求职强度 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">求职强度</label>
          <select v-model="formData.job_search_intensity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="low">低强度（偶尔投递）</option>
            <option value="medium">中等强度（定期投递）</option>
            <option value="high">高强度（积极投递）</option>
          </select>
        </div>



        <!-- 按钮 -->
        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            :disabled="!isFormValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            开始预测
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PredictionParams {
  target_industry: string
  target_position: string
  target_city: string
  job_search_intensity: 'low' | 'medium' | 'high'
}

interface Props {
  visible: boolean
}

interface Emits {
  close: []
  submit: [params: PredictionParams]
}

defineProps<Props>()

const formData = ref<PredictionParams>({
  target_industry: '',
  target_position: '',
  target_city: '',
  job_search_intensity: 'medium'
})

const isFormValid = computed(() => {
  return formData.value.target_industry && 
         formData.value.target_position && 
         formData.value.target_city
})

const emit = defineEmits<Emits>()

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData.value })
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>
