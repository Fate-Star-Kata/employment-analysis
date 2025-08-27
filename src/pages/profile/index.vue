<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">学生档案</h1>
      <p class="page-description">管理您的学生档案信息</p>
    </div>

    <div class="content-wrapper">
      <!-- 学生档案信息 -->>
      <ProfileForm 
        ref="profileFormRef" 
        :profile-data="profileData" 
        :is-editing="isEditing"
        @update:profileData="profileData = $event" 
      />

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button v-if="!isEditing && profileData" type="primary" @click="startEdit">
          编辑档案
        </el-button>
        <template v-else>
          <el-button type="primary" @click="saveProfile" :loading="saving">
            {{ profileData?.id ? '保存更改' : '创建档案' }}
          </el-button>
          <el-button @click="cancelEdit" v-if="profileData?.id">
            取消
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { createProfile, updateProfile, getProfile } from '@/api/user/profile'
import type { CreateProfileRequest, ProfileDetail } from '@/types/apis/APIS_T'
import ProfileForm from '@/components/pages/profile/ProfileForm.vue'

// 定义页面元数据
defineOptions({
  name: 'Profile'
})

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const isEditing = ref(false)

// 子组件引用
const profileFormRef = ref()

// 档案数据
const profileData = ref<ProfileDetail | null>(null)
const originalProfileData = ref<ProfileDetail | null>(null)

// 获取档案信息
const fetchProfile = async (profileId?: number) => {
  if (!profileId) {
    // 如果没有档案ID，进入创建模式
    isEditing.value = true
    profileData.value = null
    return
  }

  loading.value = true
  try {
    const response = await getProfile(profileId)
    if (response.code === 200) {
      profileData.value = response.data
      originalProfileData.value = { ...response.data }
    } else {
      ElMessage.error(response.message || '获取档案信息失败')
    }
  } catch (error) {
    console.error('获取档案信息失败:', error)
    ElMessage.error('获取档案信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
  if (profileData.value) {
    originalProfileData.value = { ...profileData.value }
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  if (originalProfileData.value) {
    profileData.value = { ...originalProfileData.value }
  }
}

// 保存档案
const saveProfile = async () => {
  if (!profileData.value) {
    ElMessage.warning('没有可保存的档案信息')
    return
  }

  try {
    // 验证表单
    if (profileFormRef.value && profileFormRef.value.validateForm) {
      const isValid = await profileFormRef.value.validateForm()
      if (!isValid) {
        ElMessage.warning('请检查表单输入')
        return
      }
    }

    saving.value = true

    if (profileData.value.id) {
      // 更新档案
      const updateData: Partial<CreateProfileRequest> = {
        name: profileData.value.name,
        student_id: profileData.value.student_id,
        major: profileData.value.major,
        grade: profileData.value.grade,
        gpa: profileData.value.gpa,
        gender: profileData.value.gender,
        age: profileData.value.age,
        hometown: profileData.value.hometown,
        family_income: profileData.value.family_income,
        internship_experience: profileData.value.internship_experience,
        project_experience: profileData.value.project_experience,
        skill_certifications: profileData.value.skill_certifications,
        english_level: profileData.value.english_level,
        social_activities: profileData.value.social_activities,
        academic_awards: profileData.value.academic_awards,
        hobby: profileData.value.hobby,
        graduation_year: profileData.value.graduation_year,
        political_score: profileData.value.political_score,
        major_score: profileData.value.major_score,
        english_score: profileData.value.english_score,
        physical_score: profileData.value.physical_score,
        technical_skills: profileData.value.technical_skills,
        communication_skills: profileData.value.communication_skills,
        leadership_skills: profileData.value.leadership_skills,
        learning_ability: profileData.value.learning_ability,
        problem_solving: profileData.value.problem_solving
      }

      await updateProfile(profileData.value.id, updateData)
      ElMessage.success('档案更新成功')
    } else {
      // 创建档案
      const createData: CreateProfileRequest = {
        name: profileData.value.name,
        student_id: profileData.value.student_id,
        major: profileData.value.major,
        grade: profileData.value.grade,
        gpa: profileData.value.gpa,
        gender: profileData.value.gender,
        age: profileData.value.age,
        hometown: profileData.value.hometown,
        family_income: profileData.value.family_income,
        internship_experience: profileData.value.internship_experience,
        project_experience: profileData.value.project_experience,
        skill_certifications: profileData.value.skill_certifications,
        english_level: profileData.value.english_level,
        social_activities: profileData.value.social_activities,
        academic_awards: profileData.value.academic_awards,
        hobby: profileData.value.hobby,
        graduation_year: profileData.value.graduation_year,
        political_score: profileData.value.political_score,
        major_score: profileData.value.major_score,
        english_score: profileData.value.english_score,
        physical_score: profileData.value.physical_score,
        technical_skills: profileData.value.technical_skills,
        communication_skills: profileData.value.communication_skills,
        leadership_skills: profileData.value.leadership_skills,
        learning_ability: profileData.value.learning_ability,
        problem_solving: profileData.value.problem_solving
      }

      const response = await createProfile(createData)
      if (response.code === 200) {
        ElMessage.success('档案创建成功')
        // 重新获取档案信息
        await fetchProfile(response.data.id)
      }
    }

    isEditing.value = false
  } catch (error: any) {
    console.error('保存档案失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 组件挂载时获取档案信息
onMounted(() => {
  // 这里可以根据路由参数或用户信息获取档案ID
  // 暂时设置为创建模式
  fetchProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.action-buttons {
  padding: 24px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-buttons .el-button {
  min-width: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }

  .content-wrapper {
    margin: 0;
    border-radius: 8px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-description {
    font-size: 14px;
  }

  .action-buttons {
    padding: 16px 20px;
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>