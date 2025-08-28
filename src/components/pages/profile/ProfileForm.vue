<template>
  <div class="profile-form">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" v-if="formData">
      <!-- 基本信息 -->
      <div class="form-section">
        <h4 class="section-title">基本信息</h4>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="formData.major" placeholder="请输入专业" :disabled="!isEditing"
                @input="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别" :disabled="!isEditing"
                @change="updateProfileData">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="毕业年份" prop="graduation_year">
              <el-input v-model="formData.graduation_year" placeholder="请输入毕业年份" :disabled="!isEditing"
                @input="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="爱好" prop="hobby">
              <el-input v-model="formData.hobby" placeholder="请输入爱好" :disabled="!isEditing"
                @input="updateProfileData" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 学术信息 -->
      <div class="form-section">
        <h4 class="section-title">学术信息</h4>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="政治成绩" prop="political_score">
              <el-input-number v-model="formData.political_score" :min="0" :max="100" placeholder="政治成绩"
                :disabled="!isEditing" @change="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业成绩" prop="major_score">
              <el-input-number v-model="formData.major_score" :min="0" :max="100" placeholder="专业成绩"
                :disabled="!isEditing" @change="updateProfileData" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="英语成绩" prop="english_score">
              <el-input-number v-model="formData.english_score" :min="0" :max="100" placeholder="英语成绩"
                :disabled="!isEditing" @change="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体育成绩" prop="physical_score">
              <el-input-number v-model="formData.physical_score" :min="0" :max="100" placeholder="体育成绩"
                :disabled="!isEditing" @change="updateProfileData" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 技能评估 -->
      <div class="form-section">
        <h4 class="section-title">技能评估</h4>
        <p class="section-desc">请根据自己的实际情况进行评分（1-10分）</p>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="技术技能" prop="technical_skills">
              <el-slider v-model="formData.technical_skills" :min="1" :max="10" show-input :disabled="!isEditing"
                @change="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沟通技能" prop="communication_skills">
              <el-slider v-model="formData.communication_skills" :min="1" :max="10" show-input :disabled="!isEditing"
                @change="updateProfileData" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="领导技能" prop="leadership_skills">
              <el-slider v-model="formData.leadership_skills" :min="1" :max="10" show-input :disabled="!isEditing"
                @change="updateProfileData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题解决能力" prop="problem_solving">
              <el-slider v-model="formData.problem_solving" :min="1" :max="10" show-input :disabled="!isEditing"
                @change="updateProfileData" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div v-else class="loading-placeholder">
      <el-skeleton :rows="8" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ProfileDetail } from '@/types/apis/APIS_T'

// 定义组件名称
defineOptions({
  name: 'ProfileForm'
})

// Props
interface Props {
  profileData: ProfileDetail | null
  isEditing: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'update:profileData', profileData: ProfileDetail): void
}

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<ProfileDetail | null>(null)

// 监听 props 变化，更新表单数据
watch(
  () => props.profileData,
  (newProfileData) => {
    if (newProfileData) {
      formData.value = { ...newProfileData }
    } else if (props.isEditing) {
      // 创建模式，初始化空表单
      formData.value = {
        gender: 'male',
        hobby: '',
        major: '',
        graduation_year: '',
        political_score: 0,
        major_score: 0,
        english_score: 0,
        physical_score: 0,
        technical_skills: 5,
        communication_skills: 5,
        leadership_skills: 5,
        problem_solving: 5
      } as ProfileDetail
    }
  },
  { immediate: true, deep: true }
)

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  student_id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 6, max: 20, message: '学号长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' },
    { min: 2, max: 50, message: '专业名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
  ],
  gpa: [
    { required: true, message: '请输入绩点', trigger: 'blur' },
    { type: 'number', min: 0, max: 4, message: '绩点范围为 0-4', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 16, max: 50, message: '年龄范围为 16-50', trigger: 'blur' }
  ]
}

// 更新档案数据
const updateProfileData = () => {
  if (formData.value) {
    emit('update:profileData', formData.value)
  }
}

// 验证表单
const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 暴露验证方法给父组件
defineExpose({
  validateForm
})
</script>

<style scoped lang="scss">
.profile-form {
  background: white;
  padding: 24px;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .loading-placeholder {
    padding: 20px;
  }

  .form-section {
    margin-bottom: 32px;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
  }

  .section-title {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-bottom: 2px solid #409eff;
    padding-bottom: 8px;
  }

  // Element Plus 表单样式优化
  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .el-input__wrapper {
      border-radius: 8px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &:hover {
        border-color: #d1d5db;
      }

      &.is-focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }

    .el-select {
      width: 100%;
    }

    .el-input-number {
      width: 100%;
    }
  }

  :deep(.el-slider) {
    margin-right: 20px;
  }

  :deep(.el-col) {
    margin-bottom: 0;
  }

  :deep(.el-row .el-form-item) {
    margin-bottom: 18px;
  }
}
</style>
