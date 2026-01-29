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
}

export default function QuotationModal({ isOpen, onClose, onSave, quotation }: QuotationModalProps) {
  const { currentUser } = useAuth();
  const salesReps = getSalesReps();
  const isEditing = !!quotation;

  const generateQuotationNumber = () => {
    const random = Math.floor(1000 + Math.random() * 9000); // 1000-9999
    return `DVO.SAM.EQTN.${random}`;
  };

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
  }, [quotation, isOpen, currentUser]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    if (!formData.salesAmount || parseFloat(formData.salesAmount) <= 0) {
      newErrors.salesAmount = 'Valid sales amount is required';
    }

    if (!formData.assignedTo) newErrors.assignedTo = 'Sales representative must be assigned';

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
      salesAmount: parseFloat(formData.salesAmount),
    });
    onClose();
  };

  const handleCancel = () => {
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
    setErrors({});
    onClose();
  };

  const statuses: QuotationStatus[] = ['new', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-2xl bg-white fade-in-scale shadow-lg border border-slate-200">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Quotation' : 'New Quotation'}
          </DialogTitle>

          <div className="text-slate-800 font-mono font-bold text-lg">
            {formData.quotationNumber}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-slate-900">
          {/* Client & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="font-medium text-slate-900">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Acme Corporation"
                className={`${errors.clientName ? 'border-red-500' : ''} bg-white text-slate-900`}
              />
              {errors.clientName && <p className="text-red-600 text-xs">{errors.clientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="font-medium text-slate-900">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="John Doe"
                className={`${errors.contactPerson ? 'border-red-500' : ''} bg-white text-slate-900`}
              />
              {errors.contactPerson && <p className="text-red-600 text-xs">{errors.contactPerson}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-slate-900">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={`${errors.email ? 'border-red-500' : ''} bg-white text-slate-900`}
              />
              {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium text-slate-900">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0100"
                className={`${errors.phone ? 'border-red-500' : ''} bg-white text-slate-900`}
              />
              {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
            </div>
          </div>

          {/* Sales Amount & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salesAmount" className="font-medium text-slate-900">Sales Amount (₱) *</Label>
              <Input
                id="salesAmount"
                type="number"
                step="0.01"
                value={formData.salesAmount}
                onChange={(e) => setFormData({ ...formData, salesAmount: e.target.value })}
                placeholder="50000"
                className={`${errors.salesAmount ? 'border-red-500' : ''} bg-white text-slate-900`}
              />
              {errors.salesAmount && <p className="text-red-600 text-xs">{errors.salesAmount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium text-slate-900">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as QuotationStatus })}
              >
                <SelectTrigger className="bg-white text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status} className="text-slate-900">
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assigned To & Last Contact Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="font-medium text-slate-900">Assigned To *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                disabled={currentUser?.role === 'sales_rep'}
              >
                <SelectTrigger className="bg-white text-slate-900">
                  <SelectValue placeholder="Select sales representative" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id} className="text-slate-900">
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && <p className="text-red-600 text-xs">{errors.assignedTo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastContactDate" className="font-medium text-slate-900">Last Contact Date *</Label>
              <Input
                id="lastContactDate"
                type="date"
                value={formData.lastContactDate}
                onChange={(e) => setFormData({ ...formData, lastContactDate: e.target.value })}
                className="bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium text-slate-900">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
              className="bg-white text-slate-900 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#0891b2] hover:bg-[#0e7490] text-white">
              {isEditing ? 'Update Quotation' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
