'use client';

import { useState, useEffect } from 'react';
import { Quotation, QuotationStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getSalesReps } from '@/lib/data-service';
import { formatDateInput, getStatusLabel } from '@/lib/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  quotation?: Quotation | null;
  viewOnly?: boolean;
}

export default function QuotationModal({ isOpen, onClose, onSave, quotation, viewOnly = false }: QuotationModalProps) {
  const { currentUser } = useAuth();
  const salesReps = getSalesReps();
  const isEditing = !!quotation;
  const [editingMode, setEditingMode] = useState(!viewOnly);

  const generateQuotationNumber = () => `DVO.SAM.EQTN.${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    quotationNumber: generateQuotationNumber(),
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    salesAmount: '',
    status: 'new' as QuotationStatus,
    lastContactDate: formatDateInput(new Date().toISOString()),
    assignedTo: currentUser?.role === 'sales_rep' ? currentUser.id : '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (quotation) {
      setFormData({
        quotationNumber: quotation.quotationNumber,
        clientName: quotation.clientName,
        contactPerson: quotation.contactPerson,
        email: quotation.email,
        phone: quotation.phone,
        salesAmount: quotation.salesAmount.toString(),
        status: quotation.status,
        lastContactDate: formatDateInput(quotation.lastContactDate),
        assignedTo: quotation.assignedTo,
        notes: quotation.notes || '',
      });
    } else {
      setFormData({
        quotationNumber: generateQuotationNumber(),
        clientName: '',
        contactPerson: '',
        email: '',
        phone: '',
        salesAmount: '',
        status: 'new',
        lastContactDate: formatDateInput(new Date().toISOString()),
        assignedTo: currentUser?.role === 'sales_rep' ? currentUser.id : '',
        notes: '',
      });
    }
    setErrors({});
    setEditingMode(!viewOnly);
  }, [quotation, isOpen, currentUser, viewOnly]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(formData.salesAmount.replace(/,/g, ''));

    if (!formData.clientName.trim())
      newErrors.clientName = 'Client name is required';

    if (!formData.contactPerson.trim())
      newErrors.contactPerson = 'Contact person is required';

    if (!formData.email.trim())
      newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';

    if (!formData.phone)
      newErrors.phone = 'Phone is required';
    else if (!/^9\d{9}$/.test(formData.phone))
      newErrors.phone = 'Enter valid PH mobile number (9XXXXXXXXX)';

    if (!formData.salesAmount)
      newErrors.salesAmount = 'Sales amount is required';
    else if (isNaN(amount) || amount <= 0)
      newErrors.salesAmount = 'Enter valid amount';

    if (!formData.assignedTo)
      newErrors.assignedTo = 'Sales representative must be assigned';

    if (!formData.status)
      newErrors.status = 'Status is required';

    if (!formData.lastContactDate)
      newErrors.lastContactDate = 'Last contact date is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      phone: `+63${formData.phone}`,
      salesAmount: parseFloat(formData.salesAmount.replace(/,/g, '')),
    });
    onClose();
  };

  const handleCancel = () => {
    setEditingMode(!viewOnly);
    onClose();
  };

  const statuses: QuotationStatus[] = ['new', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-2xl bg-white fade-in-scale shadow-lg border border-slate-200">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {editingMode ? (isEditing ? 'Edit Quotation' : 'New Quotation') : 'View Quotation'}
          </DialogTitle>
          <div className="text-slate-800 font-mono font-bold text-lg">{formData.quotationNumber}</div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-slate-900">
          {/* Grid Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input id="clientName" value={formData.clientName} disabled={!editingMode} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="bg-white text-slate-900" />
              {errors.clientName && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.clientName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" value={formData.contactPerson} disabled={!editingMode} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="bg-white text-slate-900" />
              {errors.contactPerson && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.contactPerson}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} disabled={!editingMode} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-white text-slate-900" />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <div className="flex">
                <div className="px-3 flex items-center bg-slate-100 border border-r-0 border-slate-300 rounded-l-md text-slate-600">
                  +63
                </div>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  disabled={!editingMode}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phone: digitsOnly });
                  }}
                  className="rounded-l-none bg-white text-slate-900"
                  placeholder="9XXXXXXXXX"
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salesAmount">Sales Amount (₱) *</Label>
              <Input
                id="salesAmount"
                type="text"
                value={formData.salesAmount}
                disabled={!editingMode}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '');
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  setFormData({ ...formData, salesAmount: formatted });
                }}
                className="bg-white text-slate-900" 
              />
              {errors.salesAmount && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.salesAmount}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => editingMode && setFormData({ ...formData, status: value as QuotationStatus })} disabled={!editingMode}>
                <SelectTrigger className="bg-white text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => <SelectItem key={status} value={status}>{getStatusLabel(status)}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => editingMode && setFormData({ ...formData, assignedTo: value })} disabled={!editingMode || currentUser?.role === 'sales_rep'}>
                <SelectTrigger className="bg-white text-slate-900"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.assignedTo}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastContactDate">Last Contact Date *</Label>
              <Input id="lastContactDate" type="date" value={formData.lastContactDate} disabled={!editingMode} onChange={(e) => setFormData({ ...formData, lastContactDate: e.target.value })} className="bg-white text-slate-900" />
              {errors.lastContactDate && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.lastContactDate}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} disabled={!editingMode} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="bg-white text-slate-900 resize-none" />
          </div>

          {/* Buttons */}
          {editingMode ? (
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button type="button" onClick={handleCancel} className="flex-1 bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-100">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#0891b2] hover:bg-[#0e7490] text-white">{isEditing ? 'Update Quotation' : 'Create Quotation'}</Button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 flex justify-center">
              <Button onClick={() => setEditingMode(true)} className="bg-[#0891b2] hover:bg-[#0e7490] text-white">
                Edit Quotation
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
