import axios from "axios";

const API_URL = "http://localhost:4000/projects";

export interface ProjectDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const ProjectService = {
  async getAll(): Promise<ProjectDTO[]> {
    const token = localStorage.getItem("@token");
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async getById(id: number): Promise<ProjectDTO> {
    const token = localStorage.getItem("@token");
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async create(data: { name: string; description?: string }) {
    const token = localStorage.getItem("@token");
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async update(id: number, data: { name?: string; description?: string }) {
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
