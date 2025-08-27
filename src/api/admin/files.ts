import type {
  DeleteFilesRequest,
  DeleteFilesResponse,
  FileDetailResponse,
  FileListRequest,
  FileListResponse,
} from '@/types/factory'
import serviceAxios from '@/http'

// 获取用户文件列表
export function getUserFiles(params: FileListRequest): Promise<FileListResponse> {
  return serviceAxios.get('/hzadmin/client/public/user_files/', { params })
}

// 获取用户文件详情
export function getUserFileDetail(fileId: number): Promise<FileDetailResponse> {
  return serviceAxios.get(`/hzadmin/client/public/user_files/${fileId}/`)
}

// 删除用户文件
export function deleteUserFiles(data: DeleteFilesRequest): Promise<DeleteFilesResponse> {
  return serviceAxios.post('/hzadmin/client/public/user_files/delete/', data)
}

// 文件上传接口地址（用于 el-upload 组件）
export function getUploadUrl(): string {
  return `${import.meta.env.VITE_API_BASE_URL}/hzadmin/client/public/upload/`
}

// 获取文件访问URL
export function getFileUrl(filePath: string): string {
  return `${import.meta.env.VITE_API_BASE_URL}/${filePath}`
}
