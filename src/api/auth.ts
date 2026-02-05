import { http } from "@/api/http";
import { LoginRequest } from "@/types/auth";

export function login(data: LoginRequest) {
  return http.post<LoginRequest[]>(`/auth/login`, data);
}