import type {
  CreateProfileRequest,
  CreateProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetProfileResponse,
  GetMyProfileIdResponse,
} from "@/types/apis/APIS_T";
import serviceAxios from "@/http";

// 创建学生档案
export function createProfile(
  data: CreateProfileRequest
): Promise<CreateProfileResponse> {
  return serviceAxios({
    url: "/api/predict/profile/create/",
    method: "post",
    data,
  });
}

// 更新学生档案
export function updateProfile(
  profileId: number,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return serviceAxios({
    url: `/api/predict/profile/update/${profileId}/`,
    method: "post",
    data,
  });
}

// 获取学生档案详情
export function getProfile(profileId: number): Promise<GetProfileResponse> {
  return serviceAxios({
    url: `/api/predict/profile/${profileId}/`,
    method: "get",
  });
}

// 获取当前用户档案ID
export function getMyProfileId(): Promise<GetMyProfileIdResponse> {
  return serviceAxios({
    url: "/api/predict/profile/my-id/",
    method: "get",
  });
}
