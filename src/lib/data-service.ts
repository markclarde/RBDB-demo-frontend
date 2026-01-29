import { Entry, User, DashboardMetrics } from '@/types';

// Entry Operations
export function getEntries(): Entry[] {
  const entries = localStorage.getItem('entries');
  return entries ? JSON.parse(entries) : [];
}

export function getEntriesByUser(userId: string): Entry[] {
  return getEntries().filter((entry) => entry.assignedTo === userId);
}

export function getEntryById(id: string): Entry | undefined {
  return getEntries().find((entry) => entry.id === id);
}

export function createEntry(entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Entry {
  const entries = getEntries();
  const newEntry: Entry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  localStorage.setItem('entries', JSON.stringify(entries));
  return newEntry;
}

export function updateEntry(id: string, updates: Partial<Entry>): Entry | null {
  const entries = getEntries();
  const index = entries.findIndex((entry) => entry.id === id);
  
  if (index === -1) return null;
  
  entries[index] = {
    ...entries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('entries', JSON.stringify(entries));
  return entries[index];
}

export function deleteEntry(id: string): boolean {
  const entries = getEntries();
  const filteredEntries = entries.filter((entry) => entry.id !== id);
  
  if (filteredEntries.length === entries.length) return false;
  
  localStorage.setItem('entries', JSON.stringify(filteredEntries));
  return true;
}

export function isQuotationNumberUnique(quotationNumber: string, excludeId?: string): boolean {
  const entries = getEntries();
  return !entries.some(
    (entry) => entry.quotationNumber === quotationNumber && entry.id !== excludeId
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
export function calculateMetrics(entries: Entry[]): DashboardMetrics {
  const totalRequests = entries.length;
  const totalSales = entries
    .filter((e) => e.status === 'closed_won')
    .reduce((sum, e) => sum + e.salesAmount, 0);
  
  const statusBreakdown = {
    new: entries.filter((e) => e.status === 'new').length,
    proposal_sent: entries.filter((e) => e.status === 'proposal_sent').length,
    negotiation: entries.filter((e) => e.status === 'negotiation').length,
    closed_won: entries.filter((e) => e.status === 'closed_won').length,
    closed_lost: entries.filter((e) => e.status === 'closed_lost').length,
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
