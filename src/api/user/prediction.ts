import request from "@/http";

import type {
  EmploymentPredictionRequest,
  EmploymentPredictionResponse,
  SalaryPredictionRequest,
  SalaryPredictionResponse,
  JobDurationPredictionRequest,
  JobDurationPredictionResponse,
  ComprehensivePredictionRequest,
  ComprehensivePredictionResponse,
  PredictionHistoryParams,
  PredictionHistoryResponse,
  PredictionHistoryDetailResponse,
} from "@/types/apis/APIS_T";

/**
 * 就业成功率预测
 */
export function predictEmploymentSuccess(
  params: EmploymentPredictionRequest
): Promise<EmploymentPredictionResponse> {
  return request({
    url: "/api/predict/employment/",
    method: "post",
    data: params,
  });
}
/**
 * 响应示例{
  "code": 200,
  "msg": "预测完成",
  "data": {
    "record_id": 84,
    "employment_success_rate": 95,
    "confidence_score": 80,
    "prediction_time": "2025-08-27 17:37:33"
  }
}
 * 
 */

/**
 * 薪资预测
 */
export function predictSalary(
  params: SalaryPredictionRequest
): Promise<SalaryPredictionResponse> {
  return request({
    url: "/api/predict/salary/",
    method: "post",
    data: params,
  });
}

/**
 * 薪资预测响应示例
{
  "code": 200,
  "msg": "薪资预测完成",
  "data": {
    "record_id": 82,
    "predicted_salary_min": 15712,
    "predicted_salary_max": 23568,
    "predicted_salary_avg": 19640,
    "salary_range": {
      "min": 15712,
      "max": 23568
    },
    "confidence_score": 0.78,
    "target_position": "前端开发工程师",
    "target_city": "北京",
    "prediction_time": "2025-08-27 17:37:33"
  }
}
 */

/**
 * 获取预测历史列表
 */
export function getPredictionHistory(
  params?: PredictionHistoryParams
): Promise<PredictionHistoryResponse> {
  return request({
    url: "/api/predict/history/",
    method: "get",
    params,
  });
}

/**
 * 获取预测历史详情
 */
export function getPredictionHistoryDetail(
  id: number
): Promise<PredictionHistoryDetailResponse> {
  return request({
    url: `/api/user/prediction_history/${id}/`,
    method: "get",
  });
}

/**
 * 获取全部预测历史记录（用于统计计算）
 */
export function getAllPredictionHistory(): Promise<PredictionHistoryResponse> {
  return request({
    url: "/api/predict/history/",
    method: "get",
    params: {
      page_size: 9999, // 获取所有记录
    },
  });
}


/**
 * 求职时长预测
 */
export function predictJobDuration(
  params: JobDurationPredictionRequest
): Promise<JobDurationPredictionResponse> {
  return request({
    url: "/api/predict/job-duration/",
    method: "post",
    data: params,
  });
}
/**
 * 求职时长预测响应示例
{
  "code": 200,
  "msg": "求职时长预测完成",
  "data": {
    "record_id": 85,
    "predicted_days": 36,
    "confidence_score": 0.85,
    "job_search_intensity": "medium",
    "target_industry": "互联网",
    "prediction_time": "2025-08-27 17:37:33"
  }
}
 */

/**
 * 综合预测分析
 */
export function getComprehensivePrediction(
  params: ComprehensivePredictionRequest
): Promise<ComprehensivePredictionResponse> {
  return request({
    url: "/api/predict/comprehensive/",
    method: "post",
    data: params,
  });
}
/**
 * 综合预测分析响应示例
{
  "code": 200,
  "msg": "综合预测分析完成",
  "data": {
    "record_id": 83,
    "employment_success_rate": 95,
    "predicted_salary_min": 15712,
    "predicted_salary_max": 23568,
    "predicted_salary_avg": 19640,
    "predicted_job_duration": 36,
    "overall_score": 118.46666666666665,
    "financial_analysis": {
      "salary_prediction": {
        "monthly_min": 15712,
        "monthly_max": 23568,
        "monthly_avg": 19640,
        "annual_expected": 235680,
        "confidence": 0.78
      },
      "job_search_analysis": {
        "expected_duration_days": 36,
        "opportunity_cost": 23568,
        "search_cost_estimate": 1800,
        "confidence": 0.85
      },
      "financial_impact": {
        "first_year_net_income": 210312,
        "education_roi_years": 0.42,
        "break_even_months": 1.3
      },
      "recommendations": [
        "建议在校期间积累更多实习经验，减少求职时间",
        "建议预留3-6个月的生活费作为求职期间的资金缓冲",
        "薪资水平较好，建议制定合理的储蓄和投资计划"
      ]
    },
    "suggestions": [],
    "confidence_scores": {
      "employment": 80,
      "salary": 0.78,
      "duration": 0.85,
      "overall": 0.2721
    },
    "target_info": {
      "position": "前端开发工程师",
      "city": "北京",
      "industry": "互联网",
      "job_search_intensity": "medium"
    },
    "prediction_time": "2025-08-27 17:37:33"
  }
}
 */

