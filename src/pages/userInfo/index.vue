<template>
  <div class="user-info-page">
    <div class="page-header">
      <h1 class="page-title">个人信息</h1>
      <p class="page-description">管理您的个人资料和账户设置</p>
    </div>

    <div class="content-wrapper">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="info-tabs">
        <!-- 基本信息标签 -->
        <el-tab-pane label="基本信息" name="basic">
          <BaseInfo ref="baseInfoRef" :user-info="localUserInfo" @update:userInfo="localUserInfo = $event" />
          
          <!-- 基本信息操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" @click="saveUserInfo" :loading="saving">
              保存更改
            </el-button>
            <el-button @click="resetForm">
              重置
            </el-button>
          </div>
        </el-tab-pane>

        <!-- 学生档案标签 -->
        <el-tab-pane label="学生档案" name="profile">
          <div class="profile-section">
            <div v-if="profileLoading" class="loading-container">
              <el-skeleton :rows="8" animated />
            </div>
            
            <div v-else-if="!profileData && !isEditingProfile" class="empty-profile">
              <el-empty description="暂无学生档案信息">
                <el-button type="primary" @click="createNewProfile">
                  创建档案
                </el-button>
              </el-empty>
            </div>
            
            <div v-else>
              <ProfileForm 
                ref="profileFormRef" 
                :profile-data="profileData" 
                :is-editing="isEditingProfile"
                @update:profileData="profileData = $event"
              />
              
              <!-- 学生档案操作按钮 -->
              <div class="action-buttons">
                <template v-if="!isEditingProfile">
                  <el-button type="primary" @click="editProfile">
                    编辑档案
                  </el-button>
                </template>
                <template v-else>
                  <el-button type="primary" @click="saveProfile" :loading="profileSaving">
                    保存档案
                  </el-button>
                  <el-button @click="cancelEditProfile">
                    取消
                  </el-button>
                </template>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { getCurrentUserInfo } from '@/api/user/index'
import { updateUserInfo } from '@/api/user/userinfo'
import { createProfile, updateProfile, getProfile } from '@/api/user/profile'
import type { UpdateUserInfoRequest } from '@/types/apis/userinfo'
import type { CreateProfileRequest, UpdateProfileRequest, ProfileDetail } from '@/types/apis/APIS_T'
import BaseInfo from '@/components/pages/userInfo/BaseInfo.vue'
import ProfileForm from '@/components/pages/profile/ProfileForm.vue'

// 定义页面元数据
defineOptions({
  name: 'UserInfo'
})

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('basic')

// 学生档案相关状态
const profileLoading = ref(false)
const profileSaving = ref(false)
const profileData = ref<ProfileDetail | null>(null)
const isEditingProfile = ref(false)
const originalProfileData = ref<ProfileDetail | null>(null)

// 子组件引用
const baseInfoRef = ref()
const profileFormRef = ref()

// 本地用户数据
const localUserInfo = ref<any>(null)

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const response = await getCurrentUserInfo()
    if (response.code === 200) {
      localUserInfo.value = response.data
      // 确保user_info存在并包含所有必要字段
      if (!localUserInfo.value.user_info) {
        localUserInfo.value.user_info = {}
      }

      // 确保所有字段都有默认值
      localUserInfo.value.user_info = {
        // 个人详细信息字段
        phone: localUserInfo.value.user_info.phone || '',
        gender: localUserInfo.value.user_info.gender || 'other',
        birthday: localUserInfo.value.user_info.birthday || '',
        address: localUserInfo.value.user_info.address || '',
        bio: localUserInfo.value.user_info.bio || '',

        // 社交信息字段
        wechat: localUserInfo.value.user_info.wechat || '',
        qq: localUserInfo.value.user_info.qq || '',
        weibo: localUserInfo.value.user_info.weibo || '',
        personal_site: localUserInfo.value.user_info.personal_site || '',

        // 其他字段
        avatar: localUserInfo.value.user_info.avatar || '',
        ...localUserInfo.value.user_info
      }
    } else if (response.code === 401) {
      ElMessage.error('身份认证失败，请先登录')
      router.push('/auth/login')
    } else {
      ElMessage.error(response.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}



// 保存用户信息
const saveUserInfo = async () => {
  if (!localUserInfo.value) {
    ElMessage.warning('没有可保存的用户信息')
    return
  }

  try {
    // 验证基本信息表单
    if (baseInfoRef.value && baseInfoRef.value.validateForm) {
      const isValid = await baseInfoRef.value.validateForm()
      if (!isValid) {
        ElMessage.warning('请检查表单输入')
        return
      }
    }

    saving.value = true

    // 构造更新数据
    const updateData: UpdateUserInfoRequest = {
      id: localUserInfo.value.id,
      username: localUserInfo.value.username,
      is_active: localUserInfo.value.is_active,
      email: localUserInfo.value.email,
      first_name: localUserInfo.value.first_name || '',
      last_name: localUserInfo.value.last_name || '',
      user_info: {
        avatar: localUserInfo.value.user_info?.avatar || '',
        phone: localUserInfo.value.user_info?.phone || '',
        gender: localUserInfo.value.user_info?.gender || '',
        birthday: localUserInfo.value.user_info?.birthday || '',
        address: localUserInfo.value.user_info?.address || '',
        bio: localUserInfo.value.user_info?.bio || '',
        wechat: localUserInfo.value.user_info?.wechat || '',
        qq: localUserInfo.value.user_info?.qq || '',
        weibo: localUserInfo.value.user_info?.weibo || '',
        personal_site: localUserInfo.value.user_info?.personal_site || ''
      }
    }

    console.log('准备保存的用户信息:', updateData)

    // 调用更新接口
    await updateUserInfo(updateData)

    ElMessage.success('用户信息更新成功')

    // 重新获取最新的用户信息
    await fetchUserInfo()
  } catch (error: any) {
    console.error('保存用户信息失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = async () => {
  try {
    // 重新获取用户信息
    await fetchUserInfo()

    ElMessage.success('表单已重置')
  } catch (error: any) {
    console.error('重置表单失败:', error)
    ElMessage.error('重置失败，请重试')
  }
}

// 获取学生档案信息
const fetchProfile = async () => {
  profileLoading.value = true
  try {
    const response = await getProfile()
    if (response.code === 200 && response.data) {
      profileData.value = response.data
      originalProfileData.value = JSON.parse(JSON.stringify(response.data))
    } else if (response.code === 404) {
      // 档案不存在
      profileData.value = null
    } else {
      ElMessage.error(response.msg || '获取学生档案失败')
    }
  } catch (error) {
    console.error('获取学生档案失败:', error)
    // 如果是404错误，说明档案不存在
    if (error.response?.status === 404) {
      profileData.value = null
    } else {
      ElMessage.error('获取学生档案失败，请稍后重试')
    }
  } finally {
    profileLoading.value = false
  }
}

// 创建新档案
const createNewProfile = () => {
  profileData.value = {
    student_id: '',
    name: localUserInfo.value?.first_name || '',
    gender: 'male',
    birth_date: '',
    phone: localUserInfo.value?.user_info?.phone || '',
    email: localUserInfo.value?.email || '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    school: '',
    major: '',
    grade: '',
    class_name: '',
    enrollment_date: '',
    expected_graduation: '',
    gpa: 0,
    ranking: 0,
    awards: '',
    internships: '',
    projects: '',
    extracurricular: '',
    skills: '',
    certifications: '',
    languages: '',
    self_assessment: '',
    career_goals: '',
    job_preferences: ''
  }
  isEditingProfile.value = true
}

// 编辑档案
const editProfile = () => {
  if (profileData.value) {
    originalProfileData.value = JSON.parse(JSON.stringify(profileData.value))
    isEditingProfile.value = true
  }
}

// 取消编辑
const cancelEditProfile = () => {
  if (originalProfileData.value) {
    profileData.value = JSON.parse(JSON.stringify(originalProfileData.value))
  } else {
    profileData.value = null
  }
  isEditingProfile.value = false
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

    profileSaving.value = true

    if (originalProfileData.value) {
      // 更新现有档案
      const updateData: UpdateProfileRequest = {
        ...profileData.value
      }
      await updateProfile(updateData)
      ElMessage.success('档案更新成功')
    } else {
      // 创建新档案
      const createData: CreateProfileRequest = {
        ...profileData.value
      }
      await createProfile(createData)
      ElMessage.success('档案创建成功')
    }

    isEditingProfile.value = false
    // 重新获取档案信息
    await fetchProfile()
  } catch (error: any) {
    console.error('保存档案失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    profileSaving.value = false
  }
}

// 组件挂载时获取用户信息和档案信息
onMounted(() => {
  fetchUserInfo()
  fetchProfile()
})
</script>

<style scoped>
.user-info-page {
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
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.info-tabs {
  padding: 0;
}

.info-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 32px;
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
}

.info-tabs :deep(.el-tabs__content) {
  padding: 0;
}

.profile-section {
  min-height: 400px;
}

.loading-container {
  padding: 32px;
}

.empty-profile {
  padding: 60px 32px;
  text-align: center;
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
  .user-info-page {
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
