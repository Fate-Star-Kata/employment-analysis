import request from "@/http";

import type {
  JobListParams,
  JobListResponse,
  JobDetailResponse,
  ApplyJobRequest,
  ApplyJobResponse,
  ApplicationListParams,
  ApplicationListResponse,
  ApplicationDetailResponse,
  CancelApplicationResponse,
  JobRecommendationRequest,
  JobRecommendationResponse,
  JobAnalysisResponse,
  CompanyListParams,
  CompanyListResponse,
  CompanyDetailResponse,
  JobCategoryResponse,
} from "../../types/apis/APIS_T";

// 获取职位列表
export const getJobList = (params: JobListParams): Promise<JobListResponse> => {
  return request.get("/api/position/list/", { params });
};

// 获取职位详情
export const getJobDetail = (id: number): Promise<JobDetailResponse> => {
  return request.get(`/api/position/detail/${id}/`);
};

// 申请职位
export const applyJob = (positionId: number, data: { cover_letter?: string }): Promise<ApplyJobResponse> => {
  return request.post(`/api/position/apply/${positionId}/`, data);
};

// 获取申请记录列表
export const getApplicationList = (
  params: ApplicationListParams
): Promise<ApplicationListResponse> => {
  return request.get("/api/position/applications/", { params });
};

// 获取申请详情
export const getApplicationDetail = (
  id: number
): Promise<ApplicationDetailResponse> => {
  return request.get(`/api/position/applications/${id}/`);
};

// 取消申请
export const cancelApplication = (
  id: number
): Promise<CancelApplicationResponse> => {
  return request.delete(`/api/position/applications/${id}/cancel/`);
};

// 获取职位推荐
export const getJobRecommendations = (
): Promise<JobRecommendationResponse> => {
  return request.get("/api/position/recommend/");
};



// 获取职位分析
export const getJobAnalysis = (id?: number): Promise<JobAnalysisResponse> => {
  const url = id ? `/api/position/analysis/${id}/` : "/api/position/analysis/";
  return request.get(url);
};

// 获取公司列表
export const getCompanyList = (
  params: CompanyListParams
): Promise<CompanyListResponse> => {
  return request.get("/api/position/companies/", { params });
};

// 获取公司详情
export const getCompanyDetail = (
  id: number
): Promise<CompanyDetailResponse> => {
  return request.get(`/api/position/companies/${id}/`);
};

// 获取职位分类列表
export const getJobCategories = (): Promise<JobCategoryResponse> => {
  return request.get("/api/positions/categories/");
};