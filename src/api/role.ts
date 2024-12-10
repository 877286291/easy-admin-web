import { http } from "@/utils/http";
import { baseUrlApi, type ApiResponse } from "./utils";

export type RoleInfo = {
  /** 角色创建时间 */
  created: string;
  /** 创建角色的用户 */
  createdBy: string;
  /** 角色修改时间 */
  modified: string;
  /** 修改角色的用户 */
  modifiedBy: string;
  /** 角色ID */
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色代码 */
  code: string;
  /** 角色描述 */
  description: string;
  /** 角色是否启用 */
  enabled: boolean;
  /** 角色权限ID列表 */
  permissionIds: Array<string> | null;
};
export const getRoleList = (data?: object) => {
  return http.request<ApiResponse<RoleInfo[]>>(
    "get",
    baseUrlApi("sys/role/list"),
    {
      params: data
    }
  );
};
