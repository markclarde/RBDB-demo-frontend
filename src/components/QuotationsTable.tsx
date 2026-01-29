'use client';

import { useState } from 'react';
import { Quotation } from '@/types';
import {
  formatCurrency,
  formatDate,
  getStatusLabel,
  getStatusColor,
  isOverdue,
} from '@/lib/format';
import { getDaysSinceContact, getUserById } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, ArrowUpDown, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QuotationModal from './QuotationModal';

interface QuotationsTableProps {
  quotations: Quotation[];
  onUpdate: () => void;
  statusFilter?: string;
}

type SortField =
  | 'quotationNumber'
  | 'createdAt'
  | 'clientName'
  | 'salesAmount'
  | 'status'
  | 'lastContactDate';
type SortDirection = 'asc' | 'desc';

export default function QuotationsTable({
  quotations,
  onUpdate,
  statusFilter,
}: QuotationsTableProps) {
  const [sortField, setSortField] = useState<SortField>('lastContactDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const { toast } = useToast();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedQuotations = () => {
    let filtered = [...quotations];

    if (statusFilter && statusFilter !== 'all' && statusFilter !== 'closed') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    } else if (statusFilter === 'closed') {
      filtered = filtered.filter(
        (q) => q.status === 'closed_won' || q.status === 'closed_lost'
      );
    }

    return filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'salesAmount') {
        aVal = a.salesAmount;
        bVal = b.salesAmount;
      } else if (sortField === 'createdAt' || sortField === 'lastContactDate') {
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
  };

  const sortedQuotations = getSortedQuotations();

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">
            Quotations
          </h1>
          <p className="text-slate-500">
            {sortedQuotations.length} {sortedQuotations.length === 1 ? 'quotation' : 'quotations'}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingQuotation(null);
            setModalOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          New Quotation
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  ['quotationNumber', 'Quotation #'],
                  ['createdAt', 'Date'],
                  ['clientName', 'Client'],
                  [null, 'Representative'],
                  ['salesAmount', 'Amount'],
                  ['status', 'Status'],
                  ['lastContactDate', 'Last Contact'],
                ].map(([field, label]) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    {field ? <SortButton field={field as SortField}>{label}</SortButton> : label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {sortedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No quotations found
                  </td>
                </tr>
              ) : (
                sortedQuotations.map((q) => {
                  const daysSince = getDaysSinceContact(q.lastContactDate);
                  const overdue = isOverdue(q.lastContactDate, q.status);
                  const assignedUser = getUserById(q.assignedTo);

                  return (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">{q.quotationNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{formatDate(q.createdAt)}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{q.clientName}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{assignedUser?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-900">{formatCurrency(q.salesAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge className={`${getStatusColor(q.status)} text-white border-0`}>
                          {getStatusLabel(q.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm text-slate-900">{formatDate(q.lastContactDate)}</div>
                            <div className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                              {daysSince === 0 ? 'Today' : `${daysSince} days ago`}
                            </div>
                          </div>
                          {overdue && <AlertCircle className="w-4 h-4 text-red-600" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQuotation(q);
                            setModalOpen(true);
                          }}
                          className="hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuotationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuotation(null);
        }}
        onSave={async (quotationData) => {
          if (editingQuotation) {
            const { updateQuotation } = await import('@/lib/data-service');
            updateQuotation(editingQuotation.id, quotationData);
          } else {
            const { createQuotation } = await import('@/lib/data-service');
            createQuotation(quotationData);
          }

          toast({ title: 'Success!' });

          onUpdate();
          setModalOpen(false);
        }}
        quotation={editingQuotation}
      />
    </div>
  );
}
