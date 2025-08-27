// 学生档案相关类型定义

// 创建学生档案请求类型
export interface CreateProfileRequest {
  name: string // 学生姓名（必填）
  student_id: string // 学号（必填）
  major: string // 专业（必填）
  grade: string // 年级（必填）
  gpa: number // 绩点（必填，0-4.0）
  gender: 'male' | 'female' // 性别（必填）
  age: number // 年龄（必填）
  hometown?: string // 家乡（可选）
  family_income?: 'low' | 'middle' | 'high' // 家庭收入水平（可选）
  internship_experience?: number // 实习经历数量（可选）
  project_experience?: number // 项目经历数量（可选）
  skill_certifications?: string // 技能证书（可选，逗号分隔）
  english_level?: string // 英语水平（可选）
  social_activities?: number // 社会活动参与次数（可选）
  academic_awards?: number // 学术奖项数量（可选）
  hobby?: string // 爱好
  graduation_year?: string // 毕业年份
  political_score?: number // 政治成绩
  major_score?: number // 专业成绩
  english_score?: number // 英语成绩
  physical_score?: number // 体育成绩
  technical_skills?: number // 技术技能评分
  communication_skills?: number // 沟通技能评分
  leadership_skills?: number // 领导技能评分
  learning_ability?: number // 学习能力评分
  problem_solving?: number // 问题解决能力评分
}

// 更新学生档案请求类型（所有字段可选）
export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {}

// 学生档案详情类型
export interface ProfileDetail {
  id: number
  name: string
  student_id: string
  major: string
  grade: string
  gpa: number
  gender: 'male' | 'female'
  age: number
  hometown?: string
  family_income?: 'low' | 'middle' | 'high'
  internship_experience?: number
  project_experience?: number
  skill_certifications?: string
  english_level?: string
  social_activities?: number
  academic_awards?: number
  hobby?: string
  graduation_year?: string
  political_score?: number
  major_score?: number
  english_score?: number
  physical_score?: number
  technical_skills?: number
  communication_skills?: number
  leadership_skills?: number
  learning_ability?: number
  problem_solving?: number
  created_at: string
  updated_at: string
}

// 创建档案响应类型
export interface CreateProfileResponse {
  code: number
  message: string
  data: {
    id: number
    name: string
    student_id: string
    major: string
    grade: string
    gpa: number
    created_at: string
  }
}

// 更新档案响应类型
export interface UpdateProfileResponse {
  code: number
  message: string
  data: {
    id: number
    name: string
    student_id: string
    updated_at: string
  }
}

// 获取档案详情响应类型
export interface GetProfileResponse {
  code: number
  message: string
  data: ProfileDetail
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}