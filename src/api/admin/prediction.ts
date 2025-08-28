import type {
  ComprehensivePredictionRequest,
  ComprehensivePredictionResponse,
  PredictionApiResponse,
  PredictionHistoryDetailResponse,
  PredictionHistoryListRequest,
  PredictionHistoryListResponse,
} from '@/types/apis/prediction'
import serviceAxios from '@/http'

// 获取预测历史列表
export function getPredictionHistoryListAPI(params?: PredictionHistoryListRequest): Promise<PredictionHistoryListResponse> {
  return serviceAxios({
    url: '/api/predict/history/',
    method: 'get',
    params,
  })
}

// 获取预测历史详情
export function getPredictionHistoryDetailAPI(recordId: number): Promise<PredictionHistoryDetailResponse> {
  return serviceAxios({
    url: `/api/predict/history/${recordId}/`,
    method: 'get',
  })
}

// 创建综合预测
export function createComprehensivePredictionAPI(data: ComprehensivePredictionRequest): Promise<ComprehensivePredictionResponse> {
  return serviceAxios({
    url: '/api/predict/comprehensive/',
    method: 'post',
    data,
  })
}

// 删除预测记录
export function deletePredictionRecordAPI(recordId: number): Promise<PredictionApiResponse> {
  return serviceAxios({
    url: `/api/predict/history/${recordId}/`,
    method: 'delete',
  })
}

// 批量删除预测记录
export function batchDeletePredictionRecordsAPI(recordIds: number[]): Promise<PredictionApiResponse> {
  return serviceAxios({
    url: '/api/predict/history/batch-delete/',
    method: 'post',
    data: { record_ids: recordIds },
  })
}

// 导出预测记录
export function exportPredictionRecordsAPI(params?: PredictionHistoryListRequest): Promise<Blob> {
  return serviceAxios({
    url: '/api/predict/history/export/',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
