import { api } from "./axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export async function loginRequest(payload: LoginPayload) {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}
