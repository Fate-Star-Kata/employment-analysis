import serviceAxios from "@/http";

import type {
  EmploymentRateParams,
  EmploymentRateResponse,
  SalaryTrendParams,
  SalaryTrendResponse,
  PopularRankingParams,
  PopularRankingResponse,
  IndustryAnalysisParams,
  IndustryAnalysisResponse,
  StatisticsOverviewResponse,
  ChartDataParams,
  ChartDataResponse,
  IndustriesParams,
  IndustriesResponse,
} from "@/types/apis/APIS_T";

/**
 * 获取就业率趋势数据
 * @param params 查询参数
 * @returns 就业率趋势数据
 */
export const getEmploymentRateTrend = (
  params?: EmploymentRateParams
): Promise<EmploymentRateResponse> => {
  return serviceAxios({
    url: "/api/position/employment-rate/",
    method: "GET",
    params,
  });
};

/**
 * 获取薪资趋势数据
 * @param params 查询参数
 * @returns 薪资趋势数据
 */
export const getSalaryTrend = (
  params?: SalaryTrendParams
): Promise<SalaryTrendResponse> => {
  return serviceAxios({
    url: "/api/position/salary/",
    method: "GET",
    params,
  });
};

/**
 * 获取热门职位排行
 * @param params 查询参数
 * @returns 热门职位排行数据
 */
export const getPopularRanking = (
  params?: PopularRankingParams
): Promise<PopularRankingResponse> => {
  return serviceAxios({
    url: "/api/position/popular-ranking/",
    method: "GET",
    params,
  });
};

/**
 * 获取行业分析报告
 * @param params 查询参数
 * @returns 行业分析报告数据
 */
export const getIndustryAnalysis = (
  params: IndustryAnalysisParams
): Promise<IndustryAnalysisResponse> => {
  return serviceAxios({
    url: "/api/position/industry/analysis/",
    method: "GET",
    params,
  });
};

/**
 * 获取统计概览数据
 * @returns 统计概览数据
 */
export const getStatisticsOverview = (): Promise<StatisticsOverviewResponse> => {
  return serviceAxios({
    url: "/api/position/statistics/overview/",
    method: "GET",
  });
};

/**
 * 获取图表数据
 * @param params 查询参数
 * @returns 图表数据
 */
export const getChartData = (
  params?: ChartDataParams
): Promise<ChartDataResponse> => {
  return serviceAxios({
    url: "/api/position/data/",
    method: "GET",
    params,
  });
};

/**
 * 获取行业列表
 * @param params 查询参数
 * @returns 行业列表数据
 */
export const getIndustries = (
  params?: IndustriesParams
): Promise<IndustriesResponse> => {
  return serviceAxios({
    url: "/api/position/industries/",
    method: "GET",
    params,
  });
};
