// 预测历史相关类型定义

// 预测类型枚举
export type PredictionType = 'employment_rate' | 'salary_prediction' | 'job_duration' | 'comprehensive'

// 预测记录基础接口
export interface PredictionRecord {
  id: number
  user_name: string
  prediction_type: PredictionType
  employment_success_rate: number | null
  predicted_salary_min: number | null
  predicted_salary_max: number | null
  predicted_salary_avg: number | null
  predicted_job_duration: string | null
  model_used: string
  confidence_score: number
  created_at: string
}

// 预测记录详细信息
export interface PredictionRecordDetail extends PredictionRecord {
  input_data_snapshot: {
    gender?: string
    hobby?: string
    major?: string
    graduation_year?: string
    scores?: {
      political: number
      major: number
      english: number
      physical: number
    }
    abilities?: {
      technical: number
      communication: number
      leadership: number
      learning: number
      problem_solving: number
    }
    [key: string]: any
  }
}

// 预测历史列表请求参数
export interface PredictionHistoryListRequest {
  page?: number
  page_size?: number
  type?: PredictionType
  start_date?: string
  end_date?: string
}

// 预测历史列表响应
export interface PredictionHistoryListResponse {
  code: number
  msg: string | null
  data: {
    total: number
    page: number
    page_size: number
    records: PredictionRecord[]
    stats?: PredictionStats
  }
}

// 预测历史详情响应
export interface PredictionHistoryDetailResponse {
  code: number
  msg: string | null
  data: PredictionRecordDetail
}

// 综合预测请求参数
export interface ComprehensivePredictionRequest {
  student_profile_id: number
  target_industry: string
  target_position: string
  target_city: string
  expected_salary_min: number
  expected_salary_max: number
  job_search_intensity: 'low' | 'medium' | 'high'
  location_flexibility: boolean
  salary_flexibility: boolean
}

// 综合预测响应
export interface ComprehensivePredictionResponse {
  code: number
  message: string
  data: {
    prediction_id: number
    employment_prediction: {
      probability: number
      confidence: number
    }
    salary_prediction: {
      min_salary: number
      max_salary: number
      avg_salary: number
      confidence: number
    }
    duration_prediction: {
      expected_days: number
      min_days: number
      max_days: number
      confidence: number
    }
    overall_assessment: {
      success_level: 'low' | 'medium' | 'high'
      risk_factors: string[]
      advantages: string[]
    }
    action_plan: Array<{
      phase: string
      duration: string
      tasks: string[]
    }>
    predicted_at: string
  }
}

// 预测统计数据
export interface PredictionStats {
  total_predictions: number
  today_predictions: number
  success_rate: number
  average_accuracy: number
  active_models: number
}

// 通用API响应类型
export interface PredictionApiResponse {
  code: number
  msg: string
  data?: any
}
