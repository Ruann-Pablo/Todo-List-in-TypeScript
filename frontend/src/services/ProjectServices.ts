import axios from "axios";
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from "../types/projects";

const API_URL = "http://localhost:4000/projects";

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

  async create(data: CreateProjectDTO): Promise<ProjectDTO> {
    const token = localStorage.getItem("@token");
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async update(id: number, data: UpdateProjectDTO): Promise<ProjectDTO> {
    const token = localStorage.getItem("@token");
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem("@token");
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
