import { apiClient } from "./index";
import { type Contact } from "../types/contact";
import { type PaginatedResponse, type ApiSuccess } from "../types/common";

export const getContacts = async (page: number, limit: number): Promise<PaginatedResponse<Contact>> => {
  const response = await apiClient.get<PaginatedResponse<Contact>>(
    `/contact/all?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getContactById = async (id: string): Promise<ApiSuccess<Contact>> => {
  const response = await apiClient.get<ApiSuccess<Contact>>(`/contact/${id}`);
  return response.data;
};

export const deleteContacts = async (ids: string[]): Promise<ApiSuccess<{ deletedCount: number }>> => {
  const response = await apiClient.delete<ApiSuccess<{ deletedCount: number }>>(
    "/contact",
    {
      data: { ids },
    }
  );
  return response.data;
};