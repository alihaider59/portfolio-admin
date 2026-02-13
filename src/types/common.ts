export interface ApiSuccess<T> {
    status: "success";
    message?: string;
    data: T;
  }
  
  export interface ApiFail {
    status: "fail" | "error";
    message: string;
  }
  
  export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}
  
  export interface PaginatedResponse<T> {
    status: "success";
    results: number;
    pagination: PaginationMeta;
    data: T[];
  }