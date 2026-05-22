import { apiClient } from "./index";
import {
  type Experience,
  type ExperienceListResponse,
  type ExperiencePayload,
} from "../types/experience";
import { type ApiSuccess } from "../types/common";

export const getExperiences = async (): Promise<ExperienceListResponse> => {
  const response = await apiClient.get<ExperienceListResponse>("/experiences/all");
  const body = response.data;
  return {
    ...body,
    data: Array.isArray(body.data) ? body.data : [],
    results: body.results ?? body.data?.length ?? 0,
  };
};

export const getExperienceById = async (id: string): Promise<ApiSuccess<Experience>> => {
  const response = await apiClient.get<ApiSuccess<Experience>>(`/experiences/${id}`);
  return response.data;
};

export const createExperience = async (
  payload: ExperiencePayload
): Promise<ApiSuccess<Experience>> => {
  const response = await apiClient.post<ApiSuccess<Experience>>("/experiences", payload);
  return response.data;
};

export const updateExperience = async (
  id: string,
  payload: ExperiencePayload
): Promise<ApiSuccess<Experience>> => {
  const response = await apiClient.patch<ApiSuccess<Experience>>(`/experiences/${id}`, payload);
  return response.data;
};

export const updateExperienceIcon = async (
  id: string,
  icon: File
): Promise<ApiSuccess<Experience>> => {
  const formData = new FormData();
  formData.append("icon", icon);
  const response = await apiClient.patch<ApiSuccess<Experience>>(
    `/experiences/${id}/icon`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteExperience = async (id: string): Promise<ApiSuccess<unknown>> => {
  const response = await apiClient.delete<ApiSuccess<unknown>>(`/experiences/${id}`);
  return response.data;
};
