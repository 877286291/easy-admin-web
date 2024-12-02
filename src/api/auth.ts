import { type ApiResponse, baseUrlApi } from "@/api/utils";
import { http } from "@/utils/http";
export type UserAuthInfo = {
  /** id */
  id: string;
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 当前登录用户的角色 */
  roles: Array<string>;
  /** 按钮级别权限 */
  permissions: Array<string>;
  /** `token` */
  token: string;
  /** 系统编码 */
  sysCode: string;
};
/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<ApiResponse<UserAuthInfo>>(
    "post",
    baseUrlApi("auth/login"),
    {
      data
    }
  );
};
/** 登录 */
export const logout = (data?: object) => {
  return http.request<string>("post", baseUrlApi("auth/logout"), { data });
};
