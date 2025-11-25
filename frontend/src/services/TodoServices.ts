import axios from "axios";

const API_URL = "http://localhost:4000/todos";

export interface TodoDTO {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  projectId?: number | null; // ✅ obrigatório para poder filtrar e vincular
}

export const TodoService = {
  async getAll(): Promise<TodoDTO[]> {
    const token = localStorage.getItem("@token");
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async getById(id: number): Promise<TodoDTO> {
    const token = localStorage.getItem("@token");
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async create(data: { title: string; description?: string; projectId?: number | null }) {
    const token = localStorage.getItem("@token");
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async update(id: number, data: { title?: string; description?: string; done?: boolean; projectId?: number | null }) {
    const token = localStorage.getItem("@token");
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async delete(id: number) {
    const token = localStorage.getItem("@token");
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
