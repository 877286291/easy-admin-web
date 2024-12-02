import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { isIncludeAllChildren, isString, storageLocal } from "@pureadmin/utils";

export interface DataInfo {
  /** token */
  token: string;
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;

  isRemembered?: boolean;

  loginDay?: number;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: DataInfo) {
  const token = data.token;
  const { isRemembered, loginDay } = useUserStoreHook();
  const cookieString = JSON.stringify({ token });
  Cookies.set(TokenKey, cookieString);

  Cookies.set(
    multipleTabsKey,
    "true",
    isRemembered
      ? {
          expires: loginDay
        }
      : {}
  );

  function setUserKey({
    avatar,
    username,
    nickname,
    roles,
    permissions,
    isRemembered,
    loginDay
  }) {
    useUserStoreHook().SET_AVATAR(avatar);
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_NICKNAME(nickname);
    useUserStoreHook().SET_ROLES(roles);
    useUserStoreHook().SET_PERMS(permissions);
    useUserStoreHook().SET_IS_REMEMBERED(isRemembered);
    useUserStoreHook().SET_LOGIN_DAY(loginDay);
    storageLocal().setItem(userKey, {
      avatar,
      username,
      nickname,
      roles,
      permissions,
      isRemembered,
      loginDay
    });
  }

  if (data.username && data.roles) {
    const { username, roles } = data;
    setUserKey({
      avatar: data?.avatar ?? "",
      username,
      nickname: data?.nickname ?? "",
      roles,
      permissions: data?.permissions ?? [],
      isRemembered: data?.isRemembered ?? false,
      loginDay: data?.loginDay ?? 7
    });
  } else {
    const avatar = storageLocal().getItem<DataInfo>(userKey)?.avatar ?? "";
    const username = storageLocal().getItem<DataInfo>(userKey)?.username ?? "";
    const nickname = storageLocal().getItem<DataInfo>(userKey)?.nickname ?? "";
    const roles = storageLocal().getItem<DataInfo>(userKey)?.roles ?? [];
    const permissions =
      storageLocal().getItem<DataInfo>(userKey)?.permissions ?? [];
    const isRemembered =
      storageLocal().getItem<DataInfo>(userKey)?.isRemembered ?? false;
    const loginDay = storageLocal().getItem<DataInfo>(userKey)?.loginDay ?? 7;
    setUserKey({
      avatar,
      username,
      nickname,
      roles,
      permissions,
      isRemembered,
      loginDay
    });
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  // return "Bearer " + token;
  return token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  return isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
};
