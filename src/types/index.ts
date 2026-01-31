// User Roles
export type UserRole = 'admin' | 'sales_rep';

// Quotation Statuses
export type QuotationStatus = 'new' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';

// User Type
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  isActive: boolean;
  createdAt: string;
}

// Quotation Type
export interface Quotation {
  id: string;
  quotationNumber: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  salesAmount: number;
  status: QuotationStatus;
  lastContactDate: string;
  assignedTo: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastEditedBy?: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalRequests: number;
  totalSales: number;
  statusBreakdown: {
    new: number;
    proposal_sent: number;
    negotiation: number;
    closed_won: number;
    closed_lost: number;
  };
  averageDealSize: number;
  conversionRate: number;
}
