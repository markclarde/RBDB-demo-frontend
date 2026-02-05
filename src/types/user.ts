export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING"
  | "LOCKED";

export interface Role {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: UserStatus;
  created_at: string;

  role: Role;
  branch: Branch | null;
  profile: Profile | null;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  role_id: number;
  branch_id?: number;
}

export interface UpdateUserBranchPayload {
  branch_id: number;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}
