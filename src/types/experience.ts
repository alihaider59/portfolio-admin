export interface Experience {
  id: string;
  title: string;
  companyName: string;
  icon: string | null;
  iconBg: string;
  date: string;
  points: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperiencePayload {
  title: string;
  companyName: string;
  iconBg: string;
  date: string;
  points: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface ExperienceListResponse {
  status: "success";
  results: number;
  data: Experience[];
}
