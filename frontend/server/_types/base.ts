export interface ApiResponse<T> {
  success?: boolean;
  status_code?: number;
  message: string;
  data: T;
}

export type IBaseResponse<T> = ApiResponse<T>;

export interface IPageResponse<T> {
  content: T[];
  page: number; // Trong backend gọi là 'page' hoặc 'number' tùy chỗ, nhưng schema chính dùng 'page'
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
