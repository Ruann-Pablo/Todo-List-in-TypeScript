import axios from "axios";

const API_URL = "http://localhost:4000/projects";

export interface ProjectDTO {
  id?: string;
  name: string;
}

export async function createProject(data: ProjectDTO) {
  const token = localStorage.getItem("@token");

  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getProjects() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getProjectById(id: string) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function updateProject(id: string, data: ProjectDTO) {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function deleteProject(id: string) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
