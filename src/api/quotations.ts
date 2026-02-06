import { http } from "@/api/http";
import type { Quotation } from "@/types/quotation";

export function getQuotations() {
  return http.get<Quotation[]>("/quotations");
}

export function createQuotation(data: {
  client_name: string;
  amount: number;
  status?: string;
  last_contact_at?: string;
}) {
  return http.post<Quotation>("/quotations", data);
}

export function deleteQuotation(id: number) {
  return http.delete(`/quotations/${id}`);
}
