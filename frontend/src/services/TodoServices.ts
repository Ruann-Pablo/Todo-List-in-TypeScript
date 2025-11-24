import axios from "axios";

const API_URL = "http://localhost:4000/todos";

function authHeaders() {
  const token = localStorage.getItem("@token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type TodoDTO = {
  id: string;
  title: string;
  description?: string;
  status?: "done" | "pending";
  createdAt?: string;
  projectId?: string | null;
};

export async function getTodos() {
  const res = await axios.get<TodoDTO[]>(API_URL, { headers: authHeaders() });
  return res.data;
}

export async function getTodoById(id: string) {
  const res = await axios.get<TodoDTO>(`${API_URL}/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function createTodo(data: Partial<TodoDTO>) {
  const res = await axios.post<TodoDTO>(API_URL, data, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.data;
}

export async function updateTodo(id: string, data: Partial<TodoDTO>) {
  const res = await axios.put<TodoDTO>(`${API_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.data;
}

export async function deleteTodo(id: string) {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function createTodoInProject(projectId: string, data: Partial<TodoDTO>) {
  const res = await axios.post<TodoDTO>(`http://localhost:4000/todos/projects/${projectId}`, data, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.data;
}
