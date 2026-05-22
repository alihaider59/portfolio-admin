import { apiClient } from "./index";
import { type Skill, type SkillListResponse, type SkillPayload } from "../types/skill";
import { type ApiSuccess } from "../types/common";

export const getSkills = async (): Promise<SkillListResponse> => {
  const response = await apiClient.get<SkillListResponse>("/skills/all");
  const body = response.data;
  return {
    ...body,
    data: Array.isArray(body.data) ? body.data : [],
    results: body.results ?? body.data?.length ?? 0,
  };
};

export const getSkillById = async (id: string): Promise<ApiSuccess<Skill>> => {
  const response = await apiClient.get<ApiSuccess<Skill>>(`/skills/${id}`);
  return response.data;
};

export const createSkill = async (payload: SkillPayload): Promise<ApiSuccess<Skill>> => {
  const response = await apiClient.post<ApiSuccess<Skill>>("/skills", payload);
  return response.data;
};

export const updateSkill = async (
  id: string,
  payload: SkillPayload
): Promise<ApiSuccess<Skill>> => {
  const response = await apiClient.patch<ApiSuccess<Skill>>(`/skills/${id}`, payload);
  return response.data;
};

export const updateSkillIcon = async (id: string, icon: File): Promise<ApiSuccess<Skill>> => {
  const formData = new FormData();
  formData.append("icon", icon);
  const response = await apiClient.patch<ApiSuccess<Skill>>(`/skills/${id}/icon`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteSkill = async (id: string): Promise<ApiSuccess<unknown>> => {
  const response = await apiClient.delete<ApiSuccess<unknown>>(`/skills/${id}`);
  return response.data;
};
