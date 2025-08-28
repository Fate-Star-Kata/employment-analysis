// 学生档案相关类型定义

// 创建学生档案请求类型
export interface CreateProfileRequest {
  gender: "male" | "female"; // 性别（必填）
  hobby?: string; // 爱好
  major: string; // 专业（必填）
  graduation_year?: string; // 毕业年份
  political_score?: number; // 政治成绩
  major_score?: number; // 专业成绩
  english_score?: number; // 英语成绩
  physical_score?: number; // 体育成绩
  technical_skills?: number; // 技术技能评分
  communication_skills?: number; // 沟通技能评分
  leadership_skills?: number; // 领导技能评分
  problem_solving?: number; // 问题解决能力评分
}

// 更新学生档案请求类型（所有字段可选）
export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {}

// 学生档案详情类型
export interface ProfileDetail {
  id: number;
  gender: "male" | "female";
  hobby?: string;
  major: string;
  graduation_year?: string;
  political_score?: number;
  major_score?: number;
  english_score?: number;
  physical_score?: number;
  technical_skills?: number;
  communication_skills?: number;
  leadership_skills?: number;
  problem_solving?: number;
  created_at: string;
  updated_at: string;
}

// 创建档案响应类型
export interface CreateProfileResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    student_id: string;
    major: string;
    grade: string;
    gpa: number;
    created_at: string;
  };
}

// 更新档案响应类型
export interface UpdateProfileResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    student_id: string;
    updated_at: string;
  };
}

// 获取档案详情响应类型
export interface GetProfileResponse {
  code: number;
  message: string;
  data: ProfileDetail;
}

// 获取当前用户档案ID响应类型
export interface GetMyProfileIdResponse {
  code: number;
  msg: string;
  data: {
    profile_id: number;
  };
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// ==================== 趋势分析相关类型定义 ====================

// 就业率趋势相关类型
export interface EmploymentRateParams {
  start_date?: string; // 开始日期，格式YYYY-MM-DD
  end_date?: string; // 结束日期，格式YYYY-MM-DD
  industry_id?: number; // 行业ID
}

export interface IndustryDetail {
  industry: string;
  employment_rate: number;
  total_graduates: number;
  employed_count: number;
}

export interface EmploymentTrendData {
  date: string;
  employment_rate: number;
  total_graduates: number;
  employed_count: number;
  industry_details: IndustryDetail[];
}

export interface EmploymentRateResponse {
  code: number;
  message: string;
  data: {
    trend_data: EmploymentTrendData[];
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
}

// 薪资趋势相关类型
export interface SalaryTrendParams {
  start_date?: string; // 开始日期
  end_date?: string; // 结束日期
  industry_id?: number; // 行业ID
  position_type?: string; // 职位类型
}

export interface SalaryIndustryDetail {
  industry: string;
  avg_salary: number;
  salary_min: number;
  salary_max: number;
}

export interface SalaryTrendData {
  date: string;
  avg_salary: number;
  salary_min: number;
  salary_max: number;
  industry_details: SalaryIndustryDetail[];
}

export interface SalaryTrendResponse {
  code: number;
  message: string;
  data: {
    salary_trend: SalaryTrendData[];
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
}

// 热门职位排行相关类型
export interface PopularRankingParams {
  period?: "weekly" | "monthly" | "yearly"; // 统计周期，默认weekly
  industry_id?: number; // 行业ID
  limit?: number; // 返回数量，默认20
}

export interface PopularPosition {
  rank: number;
  position_title: string;
  industry: string;
  total_views: number;
  total_applications: number;
  avg_salary: number;
  heat_index: number;
}

export interface PopularRankingResponse {
  code: number;
  message: string;
  data: {
    ranking: PopularPosition[];
    period: string;
    date_range: {
      start_date: string;
      end_date: string;
    };
    total_positions: number;
  };
}

// 行业分析报告相关类型
export interface IndustryAnalysisParams {
  industry_id: number; // 行业ID，必填
  period?: "weekly" | "monthly" | "yearly"; // 分析周期，默认monthly
}

export interface IndustryInfo {
  id: number;
  name: string;
  description: string;
}

export interface IndustryStatistics {
  total_graduates: number;
  total_employed: number;
  average_employment_rate: number;
  avg_salary: number;
}

export interface IndustryTrendData {
  date: string;
  employment_rate: number;
  avg_salary: number;
  total_graduates: number;
  employed_count: number;
}

export interface IndustryPopularPosition {
  position_title: string;
  total_views: number;
  total_applications: number;
  avg_salary: number;
}

export interface IndustryAnalysisResponse {
  code: number;
  message: string;
  data: {
    industry_info: IndustryInfo;
    statistics: IndustryStatistics;
    trend_data: IndustryTrendData[];
    popular_positions: IndustryPopularPosition[];
    analysis_period: {
      period: string;
      start_date: string;
      end_date: string;
    };
  };
}

// 统计概览相关类型
export interface EmploymentOverview {
  total_graduates: number;
  total_employed: number;
  average_employment_rate: number;
  avg_salary: number;
}

export interface IndustryOverview {
  total_industries: number;
  active_industries: number;
}

export interface PositionOverview {
  total_views: number;
  total_applications: number;
  unique_positions: number;
}

export interface CompanyOverview {
  total_companies: number;
  active_companies: number;
}

export interface StatisticsOverviewResponse {
  code: number;
  message: string;
  data: {
    employment_overview: EmploymentOverview;
    industry_overview: IndustryOverview;
    position_overview: PositionOverview;
    company_overview: CompanyOverview;
    statistics_period: {
      start_date: string;
      end_date: string;
    };
  };
}

// 就业图表数据相关类型
export interface ChartDataParams {
  type?: "employment_trend" | "salary_trend" | "industry_comparison"; // 图表类型，默认employment_trend
  period?: "weekly" | "monthly" | "yearly"; // 统计周期，默认monthly
}

export interface ChartDataset {
  label: string;
  data: number[];
  type: "line" | "bar";
}

export interface ChartDataResponse {
  code: number;
  message: string;
  data: {
    chart_type: string;
    period: string;
    chart_data: {
      labels: string[];
      datasets: ChartDataset[];
    };
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
}

// 行业列表相关类型
export interface IndustriesParams {
  page?: number; // 页码，默认1
  page_size?: number; // 每页数量，默认20
  query?: string; // 搜索关键词
}

export interface Industry {
  id: number;
  name: string;
  description: string;
  position_count: number;
  sort_order: number;
}

export interface IndustriesResponse {
  code: number
  msg: string | null
  data: {
    total: number
    categories: Industry[]
  }
}

// 个人预测相关类型定义

// 就业成功率预测
export interface EmploymentPredictionRequest {
  student_profile_id: number
  target_industry?: string
  target_position?: string
  target_city?: string
  expected_salary_min?: number
  expected_salary_max?: number
}

export interface EmploymentPredictionResponse {
  code: number
  msg: string
  data: {
    record_id: number
    employment_success_rate: number
    confidence_score: number
    prediction_time: string
  }
}

// 薪资预测
export interface SalaryPredictionRequest {
  student_profile_id: number
  target_industry?: string
  target_position?: string
  target_city?: string
  experience_years?: number
}

export interface SalaryPredictionResponse {
  code: number
  msg: string
  data: {
    record_id: number
    predicted_salary_min: number
    predicted_salary_max: number
    predicted_salary_avg: number
    salary_range: {
      min: number
      max: number
    }
    confidence_score: number
    target_position: string
    target_city: string
    prediction_time: string
  }
}

// 求职时长预测
export interface JobDurationPredictionRequest {
  student_profile_id: number
  job_search_intensity?: 'low' | 'medium' | 'high'
  target_industry?: string
  target_position?: string
  location_flexibility?: boolean
  salary_flexibility?: boolean
}

export interface DurationFactor {
  factor: string
  impact: number
  description: string
}

export interface JobDurationPredictionResponse {
  code: number
  msg: string
  data: {
    record_id: number
    predicted_days: number
    confidence_score: number
    job_search_intensity: string
    target_industry: string
    prediction_time: string
  }
}

// 综合预测分析
export interface ComprehensivePredictionRequest {
  student_profile_id: number
  target_industry?: string
  target_position?: string
  target_city?: string
  expected_salary_min?: number
  expected_salary_max?: number
  job_search_intensity?: 'low' | 'medium' | 'high'
  location_flexibility?: boolean
  salary_flexibility?: boolean
}

export interface ActionPlanPhase {
  phase: string
  duration: string
  tasks: string[]
}

export interface ComprehensivePredictionResponse {
  code: number
  msg: string
  data: {
    record_id: number
    employment_success_rate: number
    predicted_salary_min: number
    predicted_salary_max: number
    predicted_salary_avg: number
    predicted_job_duration: number
    overall_score: number
    financial_analysis: {
      salary_prediction: {
        monthly_min: number
        monthly_max: number
        monthly_avg: number
        annual_expected: number
        confidence: number
      }
      job_search_analysis: {
        expected_duration_days: number
        opportunity_cost: number
        search_cost_estimate: number
        confidence: number
      }
      financial_impact: {
        first_year_net_income: number
        education_roi_years: number
        break_even_months: number
      }
      recommendations: string[]
    }
    suggestions: string[]
    confidence_scores: {
      employment: number
      salary: number
      duration: number
      overall: number
    }
    target_info: {
      position: string
      city: string
      industry: string
      job_search_intensity: string
    }
    prediction_time: string
  }
}

// ==================== 职位相关类型定义 ====================

// 职位列表查询参数
export interface JobListParams {
  page?: number; // 页码，默认1
  page_size?: number; // 每页数量，默认10
  industry?: string; // 行业筛选
  city?: string; // 城市筛选
  salary_min?: number; // 最低薪资
  salary_max?: number; // 最高薪资
  experience?: string; // 经验要求
  education?: string; // 学历要求
  keyword?: string; // 关键词搜索
  sort_by?: 'created_at' | 'salary' | 'experience'; // 排序方式
}

// 职位基本信息
export interface JobPosition {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    logo?: string;
    size?: string;
    industry?: string;
  };
  company_name?: string;
  industry: string;
  location: string;
  work_location?: string;
  salary_range: {
    min: number;
    max: number;
  };
  salary_min?: number;
  salary_max?: number;
  experience: string;
  education: string;
  job_type: string;
  description: string;
  created_at: string;
}

// 职位列表响应
export interface JobListResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    page: number;
    page_size: number;
    positions: JobPosition[];
  };
}

// 职位详情响应
export interface JobDetailResponse {
  code: number;
  msg: string;
  data: JobPosition & {
    requirements: string[];
    benefits: string[];
    company_description: string;
    contact_info?: {
      email?: string;
      phone?: string;
    };
  };
}

// 申请职位请求
export interface ApplyJobRequest {
  cover_letter?: string;
  resume_url?: string;
}

// 申请职位响应
export interface ApplyJobResponse {
  code: number;
  msg: string;
  data: {
    application_id: number;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
    applied_at: string;
  };
}

// 申请记录查询参数
export interface ApplicationListParams {
  page?: number;
  page_size?: number;
  status?: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected' | 'cancelled' | '';
}

// 申请记录项
export interface ApplicationRecord {
  id: number;
  position: {
    id: number;
    title: string;
    company_name: string;
    location: string;
    salary_min: number;
    salary_max: number;
  };
  status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected' | 'cancelled';
  applied_at: string;
  updated_at: string;
  cover_letter?: string;
}

// 申请记录列表响应
export interface ApplicationListResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    page: number;
    page_size: number;
    applications: ApplicationRecord[];
  };
}

// 申请详情响应
export interface ApplicationDetailResponse {
  code: number;
  msg: string;
  data: ApplicationRecord & {
    position_details: JobPosition;
    timeline: {
      status: string;
      timestamp: string;
      note?: string;
    }[];
  };
}

// 取消申请响应
export interface CancelApplicationResponse {
  code: number;
  msg: string;
  data: {
    application_id: number;
    status: string;
    cancelled_at: string;
  };
}

// 职位推荐请求
export interface JobRecommendationRequest {
  student_profile_id: number;
  preferences?: {
    industry?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    experience?: string;
    job_type?: string;
  };
  limit?: number;
}

// 推荐职位项
export interface RecommendedJob {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    logo: string;
  };
  company_name?: string;
  industry: string;
  work_location: string;
  location?: string;
  salary_min: number;
  salary_max: number;
  description: string;
  education?: string;
  experience?: string;
  salary_range?: {
    min: number;
    max: number;
  };
  match_score: number;
  match_reasons: string[];
  created_at: string;
}

// 职位推荐响应
export interface JobRecommendationResponse {
  code: number;
  msg: string | null;
  data: {
    total: number;
    recommendations: RecommendedJob[];
  };
}



// 职位分析响应
export interface JobAnalysisResponse {
  code: number;
  msg: string;
  data: {
    total_positions: number;
    salary_analysis: {
      avg_salary: number;
      salary_distribution: {
        range: string;
        count: number;
        percentage: number;
      }[];
    };
    education_analysis: {
      education_level: string;
      count: number;
      percentage: number;
    }[];
    experience_analysis: {
      experience_level: string;
      count: number;
      percentage: number;
    }[];
    popular_skills: {
      skill: string;
      count: number;
      percentage: number;
    }[];
    location_distribution: {
      city: string;
      count: number;
      percentage: number;
    }[];
  };
}

// 公司列表查询参数
export interface CompanyListParams {
  page?: number;
  page_size?: number;
  industry?: string;
  size?: string;
  keyword?: string;
}

// 公司基本信息
export interface Company {
  id: number;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  founded_year?: number;
  position_count: number;
}

// 公司列表响应
export interface CompanyListResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    page: number;
    page_size: number;
    companies: Company[];
  };
}

// 公司详情响应
export interface CompanyDetailResponse {
  code: number;
  msg: string;
  data: Company & {
    positions: JobPosition[];
    benefits: string[];
    culture: string;
    contact_info?: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };
}

// 职位分类
export interface JobCategory {
  id: number;
  name: string;
  description: string;
  position_count: number;
  parent_id?: number;
  children?: JobCategory[];
}

// 职位分类列表响应
export interface JobCategoryResponse {
  code: number;
  msg: string;
  data: {
    categories: JobCategory[];
  };
}

// ==================== 预测历史相关类型定义 ====================

// 预测历史列表查询参数
export interface PredictionHistoryParams {
  page?: number; // 页码，默认1
  page_size?: number; // 每页数量，默认10
  prediction_type?: 'employment_rate' | 'salary_prediction' | 'job_duration' | 'comprehensive'; // 预测类型
  start_date?: string; // 开始日期，格式YYYY-MM-DD
  end_date?: string; // 结束日期，格式YYYY-MM-DD
}

// 预测历史记录
export interface PredictionHistoryRecord {
  id: number;
  prediction_type: 'employment_rate' | 'salary_prediction' | 'job_duration' | 'comprehensive';
  employment_success_rate?: number | null;
  predicted_salary_min?: number | null;
  predicted_salary_max?: number | null;
  predicted_salary_avg?: number | null;
  predicted_job_duration?: string | null;
  model_used: string;
  confidence_score: number;
  created_at: string;
}

// 预测历史列表响应
export interface PredictionHistoryResponse {
  code: number;
  msg: string | null;
  data: {
    total: number;
    page: number;
    page_size: number;
    records: PredictionHistoryRecord[];
  };
}

// 预测历史详情记录
export interface PredictionHistoryDetailRecord extends PredictionHistoryRecord {
  model_version: string;
  input_data_snapshot: {
    profile_data: {
      gender: string;
      major: string;
      graduation_year: string;
      scores: {
        political: number;
        major: number;
        english: number;
        physical: number;
      };
      abilities: {
        technical: number;
        communication: number;
        leadership: number;
        learning: number;
        problem_solving: number;
      };
    };
    target_params: {
      position: string;
      city: string;
      industry: string;
      job_search_intensity: string;
    };
  };
}

// 预测历史详情响应
export interface PredictionHistoryDetailResponse {
  code: number;
  msg: string | null;
  data: PredictionHistoryDetailRecord & {
    detailed_analysis?: {
      financial_analysis?: any;
      suggestions?: string[];
      confidence_scores?: any;
    };
  };
}
