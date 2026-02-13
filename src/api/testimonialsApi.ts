import { apiClient } from "./index";
import { type Testimonial } from "../types/testimonial";
import { type ApiSuccess } from "../types/common";

export interface TestimonialListResponse {
  data: Testimonial[];
  pagination: { page: number; limit: number; total: number; totalPages?: number };
}

export const getTestimonials = async (
  page: number,
  limit: number
): Promise<TestimonialListResponse> => {
  const response = await apiClient.get<TestimonialListResponse>(
    `/testimonials?page=${page}&limit=${limit}`
  );
  const body = response.data;
  return {
    data: body.data ?? [],
    pagination: body.pagination ?? { page: 1, limit, total: 0 },
  };
};

export const getTestimonial = async (id: string): Promise<ApiSuccess<Testimonial>> => {
  const response = await apiClient.get<ApiSuccess<Testimonial>>(
    `/testimonials/${id}`
  );
  return response.data;
};

export const createTestimonial = async (formData: FormData): Promise<ApiSuccess<Testimonial>> => {
  const response = await apiClient.post<ApiSuccess<Testimonial>>("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateTestimonial = async (id: string, formData: FormData): Promise<ApiSuccess<Testimonial>> => {
  const response = await apiClient.patch<ApiSuccess<Testimonial>>(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<ApiSuccess<{ deletedCount?: number }>> => {
  const response = await apiClient.delete<ApiSuccess<{ deletedCount?: number }>>(
    `/testimonials/${id}`
  );
  return response.data;
};