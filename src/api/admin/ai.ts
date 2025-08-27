import type {
  AiChatCreateRequest,
  AiChatCreateResponse,
  AiChatDeleteRequest,
  AiChatDeleteResponse,
  AiChatDetailResponse,
  AiChatListRequest,
  AiChatListResponse,
  AiChatUpdateRequest,
  AiChatUpdateResponse,
  AiMessageSendRequest,
  AiMessageSendResponse,
} from '@/types/factory'
import serviceAxios from '@/http'

// 获取AI聊天列表
export function getAiChats(params: AiChatListRequest): Promise<AiChatListResponse> {
  return serviceAxios.get('/hzadmin/ai/chats/', { params })
}

// 创建AI聊天
export function createAiChat(data: AiChatCreateRequest): Promise<AiChatCreateResponse> {
  return serviceAxios.post('/hzadmin/ai/chats/create/', data)
}

// 获取AI聊天详情
export function getAiChatDetail(chatId: number): Promise<AiChatDetailResponse> {
  return serviceAxios.get(`/hzadmin/ai/chats/${chatId}/`)
}

// 更新AI聊天
export function updateAiChat(chatId: number, data: AiChatUpdateRequest): Promise<AiChatUpdateResponse> {
  return serviceAxios.put(`/hzadmin/ai/chats/${chatId}/update/`, data)
}

// 发送AI消息
export function sendAiMessage(data: AiMessageSendRequest): Promise<AiMessageSendResponse> {
  return serviceAxios.post(`/hzadmin/ai/chats/${data.chat_id}/message/`, {
    chat_id: data.chat_id,
    content: data.content,
  })
}

// 删除AI聊天
export function deleteAiChats(data: AiChatDeleteRequest): Promise<AiChatDeleteResponse> {
  return serviceAxios.post('/hzadmin/ai/chats/delete/', data)
}
