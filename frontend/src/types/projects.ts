// src/types/projects.ts

export interface ProjectDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}
