export type UserRole = 'admin' | 'sales_rep';

export type EntryStatus = 'new' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Entry {
  id: string;
  quotationNumber: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  salesAmount: number;
  status: EntryStatus;
  lastContactDate: string;
  assignedTo: string; // User ID
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
