// 就业分析相关API类型定义

// 通用响应类型
export interface ApiResponse<T = any> {
  company_overview: any
  employment_overview: any
  code: number
  msg: string | null
  data: T
}

// 行业详情类型
export interface IndustryDetail {
  industry: string
  employment_rate?: number
  total_graduates?: number
  employed_count?: number
  avg_salary?: number
  salary_min?: number
  salary_max?: number
}

// 就业率趋势数据项
export interface EmploymentTrendItem {
  date: string
  employment_rate: number
  total_graduates: number
  employed_count: number
  industry_details: IndustryDetail[]
}

// 就业率趋势API响应
export interface EmploymentTrendResponse {
  trend_data: EmploymentTrendItem[]
}

// 薪资趋势数据项
export interface SalaryTrendItem {
  date: string
  avg_salary: number
  salary_min: number
  salary_max: number
  industry_details: IndustryDetail[]
}

// 薪资趋势API响应
export interface SalaryTrendResponse {
  salary_trend: SalaryTrendItem[]
}

// 热门职位排行项
export interface PopularPositionItem {
  rank: number
  position_title: string
  industry: string
  total_views: number
  total_applications: number
  avg_salary: number
  heat_index: number
}

// 热门职位排行API响应
export interface PopularPositionResponse {
  ranking: PopularPositionItem[]
  period: string
  date_range: {
    start_date: string
    end_date: string
  }
  total_positions: number
}

// 行业信息
export interface IndustryInfo {
  id: number
  name: string
  description: string
  position_count: number
  sort_order: number
}

// 行业列表API响应
export interface IndustryListResponse {
  total: number
  categories: IndustryInfo[]
}

// 统计概览数据
export interface StatisticsOverview {
  employment_overview: {
    total_graduates: number
    total_employed: number
    average_employment_rate: number
    avg_salary: number
  }
  industry_overview: {
    total_industries: number
    active_industries: number
  }
  position_overview: {
    total_views: number
    total_applications: number
    unique_positions: number
  }
  company_overview: {
    total_companies: number
    active_companies: number
  }
  statistics_period: {
    start_date: string
    end_date: string
  }
}

// API请求参数类型
export interface EmploymentTrendParams {
  start_date?: string
  end_date?: string
  industry_id?: number
}

export interface SalaryTrendParams {
  start_date?: string
  end_date?: string
  industry_id?: number
  position_type?: string
}

export interface PopularPositionParams {
  period?: 'weekly' | 'monthly' | 'yearly'
  industry_id?: number
  limit?: number
}

export interface IndustryListParams {
  page?: number
  page_size?: number
  query?: string
}
