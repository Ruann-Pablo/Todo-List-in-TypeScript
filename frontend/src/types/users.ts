export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginUser = {
  email: string;
  password: string;
};
