import type {
  ApiResponse,
  EmploymentTrendParams,
  EmploymentTrendResponse,
  IndustryListParams,
  IndustryListResponse,
  PopularPositionParams,
  PopularPositionResponse,
  SalaryTrendParams,
  SalaryTrendResponse,
  StatisticsOverview,
} from '@/types/factory'
import serviceAxios from '@/http'

// 获取就业率趋势数据
export function getEmploymentTrend(params?: EmploymentTrendParams) {
  return serviceAxios.get<ApiResponse<EmploymentTrendResponse>>('/api/position/employment-rate/', {
    params,
  })
}

// 获取薪资趋势数据
export function getSalaryTrend(params?: SalaryTrendParams) {
  return serviceAxios.get<ApiResponse<SalaryTrendResponse>>('/api/position/salary/', {
    params,
  })
}

// 获取热门职位排行
export function getPopularPositions(params?: PopularPositionParams) {
  return serviceAxios.get<ApiResponse<PopularPositionResponse>>('/api/position/popular-ranking/', {
    params,
  })
}

// 获取行业列表
export function getIndustryList(params?: IndustryListParams) {
  return serviceAxios.get<ApiResponse<IndustryListResponse>>('/api/position/industries/', {
    params,
  })
}

// 获取统计概览
export function getStatisticsOverview() {
  return serviceAxios.get<ApiResponse<StatisticsOverview>>('/api/position/statistics/overview/')
}

// 导出所有API
export default {
  getEmploymentTrend,
  getSalaryTrend,
  getPopularPositions,
  getIndustryList,
  getStatisticsOverview,
}
