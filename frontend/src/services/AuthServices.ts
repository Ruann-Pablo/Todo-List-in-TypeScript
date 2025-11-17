import axios from "axios";
import type { LoginUser, RegisterUser, LoginResponse } from '../types/users';

const apiUrl = 'http://localhost:4000';

export const authService = {
  login: async (users: LoginUser): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(`${apiUrl}/users/login`, users);
  return data;
},

  register: async (users: RegisterUser): Promise<LoginResponse> => {
    const { data } = await axios.post<LoginResponse>(`${apiUrl}/users/register`, users);
    return data;
  }
};