import axios from "axios";
import type { TodoDTO, CreateTodoDTO, UpdateTodoDTO } from "../types/todo";

const API_URL = "https://todo-list-in-type-script.vercel.app/todos";

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

  async create(data: CreateTodoDTO): Promise<TodoDTO> {
    const token = localStorage.getItem("@token");
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async update(id: number, data: UpdateTodoDTO): Promise<TodoDTO> {
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
