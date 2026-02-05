import { http } from "./http";
import {
  User,
  CreateUserPayload,
  UpdateUserBranchPayload,
  UpdateUserStatusPayload,
} from "@/types/user";

export const usersApi = {
  getUsers: () => http.get<User[]>("/users"),

  getMe: () => http.get<User>("/users/me"),

  create: (payload: CreateUserPayload) =>
    http.post<User>("/users", payload),

  updateBranch: (userId: number, payload: UpdateUserBranchPayload) =>
    http.patch<User>(`/users/${userId}/branch`, payload),

  updateStatus: (userId: number, payload: UpdateUserStatusPayload) =>
    http.patch<User>(`/users/${userId}/status`, payload),
};
