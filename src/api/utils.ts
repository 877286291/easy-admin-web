export const baseUrlApi = (url: string) => `/api/${url}`;
// 定义整个 API 响应的类型
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
  timestamp: number;
};
export type Pagination<T> = {
  records: T[];
  total: number;
  size: number;
  current: number;
};
