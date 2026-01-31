import { Quotation } from '@/types';

export type SortField =
  | 'quotationNumber'
  | 'createdAt'
  | 'clientName'
  | 'salesAmount'
  | 'lastContactDate';

export type SortDirection = 'asc' | 'desc';

export function filterAndSortQuotations(
  quotations: Quotation[],
  appliedStatuses: string[],
  sortField: SortField,
  sortDirection: SortDirection
) {
  let filtered = [...quotations];

  if (appliedStatuses.length > 0) {
    filtered = filtered.filter((q) =>
      appliedStatuses.includes(q.status)
    );
  }

  return filtered.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'salesAmount') {
      aVal = a.salesAmount;
      bVal = b.salesAmount;
    } else if (
      sortField === 'createdAt' ||
      sortField === 'lastContactDate'
    ) {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}
