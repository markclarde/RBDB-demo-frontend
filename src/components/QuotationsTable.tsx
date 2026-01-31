  'use client';

  import { useState, useEffect, useRef } from 'react';
  import { Quotation } from '@/types';
  import {
    formatCurrency,
    formatDate,
    getStatusLabel,
    getStatusColor,
    isOverdue,
  } from '@/lib/format';
  import { getDaysSinceContact, getUserById, deleteQuotation } from '@/lib/data-service';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Edit, Plus, ArrowUpDown, AlertCircle, Eye, Trash } from 'lucide-react';
  import { useToast } from '@/components/ui/use-toast';
  import QuotationModal from './QuotationModal';
  import StatusFilterDropdown from '@/components/quotations/StatusFilterDropdown';
  import { filterAndSortQuotations } from '@/lib/quotation-utils';

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
    | 'lastContactDate';
  type SortDirection = 'asc' | 'desc';

  export default function QuotationsTable({
    quotations,
    onUpdate,
    statusFilter,
  }: QuotationsTableProps) {
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
    const [viewOnly, setViewOnly] = useState(false);
    const { toast } = useToast();
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [appliedStatuses, setAppliedStatuses] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (field: SortField) => {
      setCurrentPage(1);
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    useEffect(() => {
      setCurrentPage(1);
    }, [statusFilter]);

    const processedQuotations = filterAndSortQuotations(
      quotations,
      appliedStatuses,
      sortField,
      sortDirection
    );

    const searchedQuotations = processedQuotations.filter((q) => {
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();

      return (
        q.quotationNumber.toLowerCase().includes(term) ||
        q.clientName.toLowerCase().includes(term)
      );
    });

    const totalPages = Math.ceil(searchedQuotations.length / itemsPerPage);
    const paginatedQuotations = searchedQuotations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    useEffect(() => {
      const calculateItemsPerPage = () => {
        if (!tableWrapperRef.current) return;

        const wrapperRect =
          tableWrapperRef.current.getBoundingClientRect();

        const availableHeight =
          window.innerHeight - wrapperRect.top;

        const paginationHeight = totalPages > 1 ? 80 : 0;

        const firstRow =
          tableWrapperRef.current.querySelector('tbody tr');

        const rowHeight =
          firstRow?.getBoundingClientRect().height || 44;

        const rows = Math.floor(
          (availableHeight - paginationHeight) / rowHeight
        );

        setItemsPerPage(rows > 0 ? rows : 1);
      };

      calculateItemsPerPage();

      window.addEventListener('resize', calculateItemsPerPage);

      return () =>
        window.removeEventListener('resize', calculateItemsPerPage);
    }, [searchedQuotations.length, totalPages]);

    const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
      >
        {children}
        <ArrowUpDown className="w-4 h-4" />
      </button>
    );

    const handleDelete = async (quotation: Quotation) => {
      if (confirm(`Are you sure you want to delete quotation #${quotation.quotationNumber}?`)) {
        await deleteQuotation(quotation.id);
        toast({ title: 'Quotation deleted' });
        onUpdate();
      }
    };

    return (
      <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Quotations
            </h1>
            <p className="text-slate-500">
              Manage and track all quotations
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="Search by quotation # or client name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 border border-slate-300 text-slate-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Button */}
            <Button
              onClick={() => {
                setEditingQuotation(null);
                setViewOnly(false);
                setModalOpen(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2 ml-4"
            >
              <Plus className="w-5 h-5" />
              New Quotation
            </Button>
          </div>
        </div>

        {/* Table */}
        <div
          ref={tableWrapperRef}
          className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-visible"
        >
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <SortButton field="quotationNumber">Quotation #</SortButton>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <SortButton field="createdAt">Date</SortButton>
                </th>

                <th className="px-1/2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <SortButton field="clientName">Client</SortButton>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Representative
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <SortButton field="salesAmount">Amount</SortButton>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <StatusFilterDropdown
                    selectedStatuses={selectedStatuses}
                    appliedStatuses={appliedStatuses}
                    setSelectedStatuses={setSelectedStatuses}
                    setAppliedStatuses={setAppliedStatuses}
                    setCurrentPage={setCurrentPage}
                  />
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  <SortButton field="lastContactDate">Last Contact</SortButton>
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {searchedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No quotations found
                  </td>
                </tr>
              ) : (
                paginatedQuotations.map((q) => {
                  const daysSince = getDaysSinceContact(q.lastContactDate);
                  const overdue = isOverdue(q.lastContactDate, q.status);
                  const assignedUser = getUserById(q.assignedTo);

                  return (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-1 text-xs font-medium truncate text-slate-900">{q.quotationNumber}</td>
                      <td className="px-4 py-1 text-sm text-slate-900">{formatDate(q.createdAt)}</td>
                      <td className="px-1/2 py-1 text-sm truncate text-slate-900">{q.clientName}</td>
                      <td className="px-4 py-1 text-sm truncate text-slate-900">{assignedUser?.name || 'Unknown'}</td>
                      <td className="px-4 py-1 text-sm truncate text-slate-900">{formatCurrency(q.salesAmount)}</td>
                      <td className="px-4 py-1">
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
                          {overdue && <AlertCircle className="w-3 h-3 text-red-600" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-left flex justify-center   gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-slate-100 p-1"
                          onClick={() => {
                            setEditingQuotation(q);
                            setViewOnly(true);
                            setModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-slate-100 p-1"
                          onClick={() => {
                            setEditingQuotation(q);
                            setViewOnly(false);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-100 p-1"
                          onClick={() => handleDelete(q)}
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 rounded-b-lg bg-slate-50">
              <p className="text-sm text-slate-500 mr-4">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <QuotationModal
          isOpen={modalOpen}
          viewOnly={viewOnly}
          onClose={() => {
            setModalOpen(false);
            setEditingQuotation(null);
            setViewOnly(false);
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
            setViewOnly(false);
          }}
          quotation={editingQuotation}
        />
      </div>
    );
  }
