export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
  }
}

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
};


export type LoginUser = {
  email: string;
  password: string;
};