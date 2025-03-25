import { IUser } from "./index.ts";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: IUser;
  accessToken: string;
  message: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: IUser;
  accessToken: string;
  message: string;
}