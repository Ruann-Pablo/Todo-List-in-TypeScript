export interface TodoDTO {
  id: number; 
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt?: string;
  projectId?: number | null;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  projectId?: number;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  done?: boolean;
}
