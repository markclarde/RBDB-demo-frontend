import { Quotation, User, DashboardMetrics } from '@/types';

// Quotation Operations
export function getQuotations(): Quotation[] {
  const quotations = localStorage.getItem('quotations');
  return quotations ? JSON.parse(quotations) : [];
}

export function getQuotationsByUser(userId: string): Quotation[] {
  return getQuotations().filter((quotation) => quotation.assignedTo === userId);
}

export function getQuotationById(id: string): Quotation | undefined {
  return getQuotations().find((quotation) => quotation.id === id);
}

export function createQuotation(quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Quotation {
  const quotations = getQuotations();
  const newQuotation: Quotation = {
    ...quotation,
    id: `quotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  quotations.push(newQuotation);
  localStorage.setItem('quotations', JSON.stringify(quotations));
  return newQuotation;
}

export function updateQuotation(id: string, updates: Partial<Quotation>): Quotation | null {
  const quotations = getQuotations();
  const index = quotations.findIndex((quotation) => quotation.id === id);
  
  if (index === -1) return null;
  
  quotations[index] = {
    ...quotations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('quotations', JSON.stringify(quotations));
  return quotations[index];
}

export function deleteQuotation(id: string): boolean {
  const quotations = getQuotations();
  const filteredQuotations = quotations.filter((quotation) => quotation.id !== id);
  
  if (filteredQuotations.length === quotations.length) return false;
  
  localStorage.setItem('quotations', JSON.stringify(filteredQuotations));
  return true;
}

export function isQuotationNumberUnique(quotationNumber: string, excludeId?: string): boolean {
  const quotations = getQuotations();
  return !quotations.some(
    (quotation) => quotation.quotationNumber === quotationNumber && quotation.id !== excludeId
  );
}

// User Operations
export function getUsers(): User[] {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((user) => user.id === id);
}

export function getSalesReps(): User[] {
  return getUsers().filter((user) => user.role === 'sales_rep' && user.isActive);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...updates,
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  return users[index];
}

export function isUsernameUnique(username: string, excludeId?: string): boolean {
  const users = getUsers();
  return !users.some(
    (user) => user.username === username && user.id !== excludeId
  );
}

// Dashboard Metrics
export function calculateMetrics(quotations: Quotation[]): DashboardMetrics {
  const totalRequests = quotations.length;
  const totalSales = quotations
    .filter((q) => q.status === 'closed_won')
    .reduce((sum, q) => sum + q.salesAmount, 0);
  
  const statusBreakdown = {
    new: quotations.filter((q) => q.status === 'new').length,
    proposal_sent: quotations.filter((q) => q.status === 'proposal_sent').length,
    negotiation: quotations.filter((q) => q.status === 'negotiation').length,
    closed_won: quotations.filter((q) => q.status === 'closed_won').length,
    closed_lost: quotations.filter((q) => q.status === 'closed_lost').length,
  };
  
  const closedDeals = statusBreakdown.closed_won + statusBreakdown.closed_lost;
  const conversionRate = closedDeals > 0 ? (statusBreakdown.closed_won / closedDeals) * 100 : 0;
  
  const averageDealSize = statusBreakdown.closed_won > 0 
    ? totalSales / statusBreakdown.closed_won 
    : 0;
  
  return {
    totalRequests,
    totalSales,
    statusBreakdown,
    averageDealSize,
    conversionRate,
  };
}

export function getDaysSinceContact(lastContactDate: string): number {
  const lastContact = new Date(lastContactDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastContact.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
