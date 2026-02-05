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

  createUser: (data: {
    username: string;
    email: string;
    password: string;
    role_id: number;
    branch_id?: number;
  }) =>
    http.post("/users", data),

  updateBranch: (userId: number, payload: UpdateUserBranchPayload) =>
    http.patch<User>(`/users/${userId}/branch`, payload),

  updateStatus: (userId: number, payload: UpdateUserStatusPayload) =>
    http.patch<User>(`/users/${userId}/status`, payload),
};
