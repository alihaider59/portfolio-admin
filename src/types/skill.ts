export interface Skill {
  id: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillPayload {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SkillListResponse {
  status: "success";
  results: number;
  data: Skill[];
}
