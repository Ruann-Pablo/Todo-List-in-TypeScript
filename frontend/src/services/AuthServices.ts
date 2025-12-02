import axios from "axios";
import type { LoginUser, RegisterUser, LoginResponse } from "../types/users";

const apiUrl = "https://todo-list-in-typescript-3k8l.onrender.com";

export const authService = {
  async login(users: LoginUser): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>(`${apiUrl}/users/login`, users);
    return data;
  },

  async register(users: RegisterUser): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>(`${apiUrl}/users/register`, users);
    return data;
  },
};
