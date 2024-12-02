import { http } from "@/utils/http";
import { type ApiResponse, type Pagination, baseUrlApi } from "@/api/utils";

// 定义单个用户信息的类型
export type UserInfo = {
  created: string;
  createdBy: string;
  modified: string | null;
  modifiedBy: string | null;
  id: string;
  username: string;
  password: string | null;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  gender: number;
  lastLoginTime: string;
  pwdResetTime: string | null;
  system: boolean;
  enabled: boolean;
  genderName: string;
};

export const getUserList = (data?: object) => {
  return http.request<ApiResponse<Pagination<UserInfo>>>(
    "get",
    baseUrlApi("sys/user"),
    {
      params: data
    }
  );
};
