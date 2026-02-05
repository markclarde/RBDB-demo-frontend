import { http } from "@/api/http";
import type { Branch } from "@/types/branch";

export function getBranches() {
  return http.get<Branch[]>("/branches");
}
