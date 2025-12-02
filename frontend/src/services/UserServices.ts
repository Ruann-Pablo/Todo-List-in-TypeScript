import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || " https://todo-list-in-typescript-3k8l.onrender.com/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  async getMe() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateUser(id: number, data: any) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
