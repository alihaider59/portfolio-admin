import { apiClient } from "./index";
import {
  type Project,
  type ProjectCreatePayload,
  type ProjectUpdatePayload,
} from "../types/project";
import { type ApiSuccess, type PaginatedResponse } from "../types/common";

export const getProjects = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<Project>> => {
  const response = await apiClient.get<PaginatedResponse<Project>>("/projects", {
    params: { page, limit },
  });
  const body = response.data;
  return {
    ...body,
    data: Array.isArray(body.data) ? body.data : [],
    pagination: body.pagination ?? {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
  };
};

export const getProjectById = async (id: string): Promise<ApiSuccess<Project>> => {
  const response = await apiClient.get<ApiSuccess<Project>>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (
  payload: ProjectCreatePayload
): Promise<ApiSuccess<Project>> => {
  const response = await apiClient.post<ApiSuccess<Project>>("/projects", payload);
  return response.data;
};

export const updateProject = async (
  id: string,
  payload: ProjectUpdatePayload
): Promise<ApiSuccess<Project>> => {
  const response = await apiClient.patch<ApiSuccess<Project>>(`/projects/${id}`, payload);
  return response.data;
};

export const updateProjectImage = async (
  id: string,
  image: File
): Promise<ApiSuccess<Project>> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await apiClient.patch<ApiSuccess<Project>>(
    `/projects/${id}/image`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteProject = async (id: string): Promise<ApiSuccess<unknown>> => {
  const response = await apiClient.delete<ApiSuccess<unknown>>(`/projects/${id}`);
  return response.data;
};
