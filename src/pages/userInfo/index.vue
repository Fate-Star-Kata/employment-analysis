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
              <ProfileForm ref="profileFormRef" :profile-data="profileData" :is-editing="isEditingProfile"
                @update:profileData="profileData = $event" />

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

        <!-- 申请记录标签 -->
        <el-tab-pane label="申请记录" name="applications">
          <div class="applications-section">
            <!-- 筛选条件 -->
            <div class="filter-section">
              <el-form :model="applicationFilters" inline>
                <el-form-item label="申请状态">
                  <el-select v-model="applicationFilters.status" placeholder="全部状态" clearable>
                    <el-option label="全部" value="" />
                    <el-option label="待处理" value="pending" />
                    <el-option label="审核中" value="reviewing" />
                    <el-option label="面试中" value="interviewed" />
                    <el-option label="已通过" value="accepted" />
                    <el-option label="已拒绝" value="rejected" />
                    <el-option label="已取消" value="cancelled" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="loadApplications">
                    查询
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 申请记录列表 -->
            <div v-if="applicationLoading" class="loading-container">
              <el-skeleton :rows="5" animated />
            </div>

            <div v-else-if="applications.length === 0" class="empty-applications">
              <el-empty description="暂无申请记录" />
            </div>

            <div v-else class="applications-list">
              <el-card v-for="application in applications" :key="application.id" class="application-card">
                <div class="application-header">
                  <div class="job-info">
                    <h3 class="job-title">{{ application.position.title }}</h3>
                    <p class="company-name">{{ application.position.company_name }}</p>
                  </div>
                  <div class="application-status">
                    <el-tag :type="getStatusType(application.status)" size="large">
                      {{ getStatusText(application.status) }}
                    </el-tag>
                  </div>
                </div>

                <div class="application-details">
                  <div class="detail-row">
                    <span class="label">申请时间：</span>
                    <span class="value">{{ formatDate(application.applied_at) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">工作地点：</span>
                    <span class="value">{{ application.position.location }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">薪资范围：</span>
                    <span class="value">{{ formatSalaryRange(application.position.salary_min,
                      application.position.salary_max) }}</span>
                  </div>
                  <div v-if="application.cover_letter" class="detail-row">
                    <span class="label">求职信：</span>
                    <span class="value">{{ application.cover_letter }}</span>
                  </div>
                </div>

                <div class="application-actions">
                  <el-button type="primary" size="small" @click="viewApplicationDetail(application.id)">
                    查看详情
                  </el-button>
                  <el-button v-if="application.status === 'pending'" type="danger" size="small"
                    @click="cancelApplicationAction(application.id)">
                    取消申请
                  </el-button>
                </div>
              </el-card>
            </div>

            <!-- 分页 -->
            <div v-if="applications.length > 0" class="pagination-container">
              <el-pagination v-model:current-page="applicationFilters.page"
                v-model:page-size="applicationFilters.page_size" :total="applicationTotal" :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper" @size-change="loadApplications"
                @current-change="loadApplications" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentUserInfo } from '@/api/user/index'
import { updateUserInfo } from '@/api/user/userinfo'
import { createProfile, updateProfile, getProfile, getMyProfileId } from '@/api/user/profile'
import { getApplicationList, getApplicationDetail, cancelApplication } from '@/api/user/job'
import type { UpdateUserInfoRequest } from '@/types/apis/userinfo'
import type { CreateProfileRequest, UpdateProfileRequest, ProfileDetail, ApplicationListParams, ApplicationRecord } from '@/types/apis/APIS_T'
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

// 申请记录相关状态
const applicationLoading = ref(false)
const applications = ref<ApplicationRecord[]>([])
const applicationTotal = ref(0)
const applicationFilters = ref<ApplicationListParams>({
  page: 1,
  page_size: 10,
  status: ''
})

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
    // 先获取当前用户的档案ID
    const idResponse = await getMyProfileId()
    if (idResponse.code === 200 && idResponse.data?.profile_id) {
      // 使用档案ID获取档案详情
      const response = await getProfile(idResponse.data.profile_id)
      if (response.code === 200 && response.data) {
        profileData.value = response.data
        originalProfileData.value = JSON.parse(JSON.stringify(response.data))
      } else {
        ElMessage.error('获取学生档案失败')
      }
    } else if (idResponse.code === 404) {
      // 档案不存在
      profileData.value = null
    } else {
      ElMessage.error(idResponse.msg || '获取档案ID失败')
    }
  } catch (error) {
    console.error('获取学生档案失败:', error)
    // 如果是404错误，说明档案不存在

    ElMessage.error('获取学生档案失败，请稍后重试')

  } finally {
    profileLoading.value = false
  }
}

// 创建新档案
const createNewProfile = () => {
  profileData.value = {
    id: 0, // 新建档案时临时ID
    gender: 'male' as 'male' | 'female',
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
    problem_solving: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
      // 更新现有档案 - 先获取档案ID
      const idResponse = await getMyProfileId()
      if (idResponse.code === 200 && idResponse.data?.profile_id) {
        const updateData: UpdateProfileRequest = {
          ...profileData.value
        }
        await updateProfile(idResponse.data.profile_id, updateData)
        ElMessage.success('档案更新成功')
      } else {
        ElMessage.error(idResponse.msg || '获取档案ID失败')
        return
      }
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

// 申请记录相关方法
const loadApplications = async () => {
  try {
    applicationLoading.value = true
    const response = await getApplicationList(applicationFilters.value)
    if (response.code === 200 && response.data) {
      applications.value = response.data.applications
      applicationTotal.value = response.data.total
    } else {
      ElMessage.error(response.msg || '获取申请记录失败')
    }
  } catch (error) {
    console.error('获取申请记录失败:', error)
    ElMessage.error('获取申请记录失败，请稍后重试')
  } finally {
    applicationLoading.value = false
  }
}

// 查看申请详情
const viewApplicationDetail = async (applicationId: number) => {
  try {
    const response = await getApplicationDetail(applicationId)
    if (response.code === 200 && response.data) {
      // 这里可以打开详情弹窗或跳转到详情页面
      ElMessage.info('查看申请详情功能待实现')
    } else {
      ElMessage.error(response.msg || '获取申请详情失败')
    }
  } catch (error) {
    console.error('获取申请详情失败:', error)
    ElMessage.error('获取申请详情失败，请稍后重试')
  }
}

// 取消申请
const cancelApplicationAction = async (applicationId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个申请吗？取消后将无法恢复。',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const response = await cancelApplication(applicationId)
    if (response.code === 200) {
      ElMessage.success('申请已取消')
      // 重新加载申请记录
      await loadApplications()
    } else {
      ElMessage.error(response.msg || '取消申请失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消申请失败:', error)
      ElMessage.error('取消申请失败，请稍后重试')
    }
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化薪资范围
const formatSalaryRange = (salaryMin: number, salaryMax: number) => {
  if (!salaryMin && !salaryMax) {
    return '面议'
  }
  if (salaryMin && salaryMax) {
    return `${salaryMin}-${salaryMax}元`
  }
  if (salaryMin) {
    return `${salaryMin}元起`
  }
  if (salaryMax) {
    return `最高${salaryMax}元`
  }
  return '面议'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '',
    reviewing: 'warning',
    interviewed: 'primary',
    accepted: 'success',
    rejected: 'danger',
    cancelled: 'info'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    reviewing: '审核中',
    interviewed: '面试中',
    accepted: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  if (newTab === 'applications') {
    loadApplications()
  }
})

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

/* 申请记录样式 */
.applications-section {
  padding: 32px;
}

.filter-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.filter-section .el-select {
  min-width: 150px;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.application-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.job-info {
  flex: 1;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.company-name {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.application-status {
  flex-shrink: 0;
}

.application-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-row .label {
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

.detail-row .value {
  color: #6b7280;
  flex: 1;
}

.application-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.pagination-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.empty-applications {
  padding: 60px 0;
  text-align: center;
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

  .applications-section {
    padding: 20px;
  }

  .filter-section {
    padding: 16px;
  }

  .application-header {
    flex-direction: column;
    gap: 12px;
  }

  .application-actions {
    flex-direction: column;
  }

  .application-actions .el-button {
    width: 100%;
  }
}
</style>
