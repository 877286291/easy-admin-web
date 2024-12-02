import { defineStore } from "pinia";
import {
  resetRouter,
  router,
  routerArrays,
  storageLocal,
  store,
  type userType
} from "../utils";
import { getLogin, logout, type UserAuthInfo } from "@/api/auth";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, removeToken, setToken, userKey } from "@/utils/auth";
import type { ApiResponse } from "@/api/utils";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions: storageLocal().getItem<DataInfo>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_IS_REMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGIN_DAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<ApiResponse<UserAuthInfo>>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data?.success) setToken(data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      logout().then(_ => {
        this.username = "";
        this.roles = [];
        this.permissions = [];
        removeToken();
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        router.push("/login").then(_ => {});
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
