import { EntryStatus } from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function getStatusLabel(status: EntryStatus): string {
  const labels: Record<EntryStatus, string> = {
    new: 'New',
    proposal_sent: 'Proposal Sent',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  };
  return labels[status];
}

export function getStatusColor(status: EntryStatus): string {
  const colors: Record<EntryStatus, string> = {
    new: 'bg-slate-500',
    proposal_sent: 'bg-cyan-600',
    negotiation: 'bg-amber-500',
    closed_won: 'bg-green-600',
    closed_lost: 'bg-red-600',
  };
  return colors[status];
}

export function isOverdue(lastContactDate: string, status: EntryStatus): boolean {
  if (status === 'closed_won' || status === 'closed_lost') return false;
  
  const daysSince = Math.floor(
    (Date.now() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSince > 7;
}
