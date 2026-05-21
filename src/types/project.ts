export interface ProjectButton {
  label: string;
  link: string;
  disabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string | null;
  isPrivate: boolean;
  buttons: ProjectButton[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectButtonInput {
  label: string;
  link?: string;
  disabled: boolean;
}

export interface ProjectCreatePayload {
  name: string;
  description: string;
  isPrivate: boolean;
  sortOrder: number;
  isActive: boolean;
  buttons: ProjectButtonInput[];
}

export interface ProjectUpdatePayload extends ProjectCreatePayload {}
