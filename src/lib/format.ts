import { QuotationStatus } from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
  return new Date(dateString).toISOString().split('T')[0];
}

export function getDaysSinceContact(dateString: string): number {
  const diff =
    Date.now() - new Date(dateString).getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getStatusLabel(status: QuotationStatus): string {
  const labels: Record<QuotationStatus, string> = {
    new: 'New',
    proposal_sent: 'Proposal Sent',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  };

  return labels[status];
}

export function getStatusColor(status: QuotationStatus): string {
  const colors: Record<QuotationStatus, string> = {
    new: 'bg-slate-500',
    proposal_sent: 'bg-cyan-600',
    negotiation: 'bg-amber-500',
    closed_won: 'bg-green-600',
    closed_lost: 'bg-red-600',
  };

  return colors[status];
}

export function isOverdue(
  lastContactDate: string,
  status: QuotationStatus,
  thresholdDays = 7,
): boolean {
  if (status === 'closed_won' || status === 'closed_lost') {
    return false;
  }

  return getDaysSinceContact(lastContactDate) > thresholdDays;
}
