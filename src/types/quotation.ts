export type QuotationStatus =
  | "PENDING"
  | "NEGOTIATION"
  | "APPROVED"
  | "REJECTED";

export type Quotation = {
  id: number;
  quotation_number: string;
  client_name: string;
  amount: string;
  status: QuotationStatus;
  created_at: string;
  last_contact_at?: string | null;

  sales_rep: {
    id: number;
    username: string;
    profile?: {
      first_name: string;
      last_name: string;
    };
  };
};
