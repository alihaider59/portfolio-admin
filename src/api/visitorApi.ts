import { apiClient } from "./index";
import { type Visitor } from "../types/visitor";
import { type PaginatedResponse, type ApiSuccess } from "../types/common";

export const getVisitors = async (page: number, limit: number): Promise<PaginatedResponse<Visitor>> => {
  const response = await apiClient.get<PaginatedResponse<Visitor>>(
    `/visitor/all?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getVisitorById = async (id: string): Promise<ApiSuccess<Visitor>> => {
  const response = await apiClient.get<ApiSuccess<Visitor>>(
    `/visitor/${id}`
  );
  return response.data;
};