'use client';

import { useState, useEffect } from 'react';
import { Entry, EntryStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { isQuotationNumberUnique, getSalesReps } from '@/lib/data-service';
import { formatDateInput, getStatusLabel } from '@/lib/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  entry?: Entry | null;
}

export default function EntryModal({ isOpen, onClose, onSave, entry }: EntryModalProps) {
  const { currentUser } = useAuth();
  const salesReps = getSalesReps();
  const isEditing = !!entry;

  const [formData, setFormData] = useState({
    quotationNumber: '',
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    salesAmount: '',
    status: 'new' as EntryStatus,
    lastContactDate: formatDateInput(new Date().toISOString()),
    assignedTo: currentUser?.role === 'sales_rep' ? currentUser.id : '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        quotationNumber: entry.quotationNumber,
        clientName: entry.clientName,
        contactPerson: entry.contactPerson,
        email: entry.email,
        phone: entry.phone,
        salesAmount: entry.salesAmount.toString(),
        status: entry.status,
        lastContactDate: formatDateInput(entry.lastContactDate),
        assignedTo: entry.assignedTo,
        notes: entry.notes || '',
      });
    } else {
      setFormData({
        quotationNumber: '',
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
  }, [entry, isOpen, currentUser]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.quotationNumber.trim()) {
      newErrors.quotationNumber = 'Quotation number is required';
    } else if (!isQuotationNumberUnique(formData.quotationNumber, entry?.id)) {
      newErrors.quotationNumber = 'Quotation number already exists';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.salesAmount || parseFloat(formData.salesAmount) <= 0) {
      newErrors.salesAmount = 'Valid sales amount is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Sales representative must be assigned';
    }

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
      quotationNumber: '',
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

  const statuses: EntryStatus[] = ['new', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl bg-[#fafaf9] fade-in-scale">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1d29]">
            {isEditing ? 'Edit Entry' : 'New Entry'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotationNumber" className="text-[#1a1d29] font-medium">
                Quotation Number *
              </Label>
              <Input
                id="quotationNumber"
                value={formData.quotationNumber}
                onChange={(e) => setFormData({ ...formData, quotationNumber: e.target.value })}
                placeholder="Q-2024-001"
                className={`bg-white ${errors.quotationNumber ? 'border-red-500 shake' : ''}`}
              />
              {errors.quotationNumber && (
                <p className="text-red-600 text-xs">{errors.quotationNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-[#1a1d29] font-medium">
                Client Name *
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Acme Corporation"
                className={`bg-white ${errors.clientName ? 'border-red-500' : ''}`}
              />
              {errors.clientName && (
                <p className="text-red-600 text-xs">{errors.clientName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-[#1a1d29] font-medium">
                Contact Person *
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="John Doe"
                className={`bg-white ${errors.contactPerson ? 'border-red-500' : ''}`}
              />
              {errors.contactPerson && (
                <p className="text-red-600 text-xs">{errors.contactPerson}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1a1d29] font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={`bg-white ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#1a1d29] font-medium">
                Phone *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0100"
                className={`bg-white ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-600 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesAmount" className="text-[#1a1d29] font-medium">
                Sales Amount ($) *
              </Label>
              <Input
                id="salesAmount"
                type="number"
                step="0.01"
                value={formData.salesAmount}
                onChange={(e) => setFormData({ ...formData, salesAmount: e.target.value })}
                placeholder="50000"
                className={`bg-white ${errors.salesAmount ? 'border-red-500' : ''}`}
              />
              {errors.salesAmount && (
                <p className="text-red-600 text-xs">{errors.salesAmount}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#1a1d29] font-medium">
                Status *
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as EntryStatus })}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastContactDate" className="text-[#1a1d29] font-medium">
                Last Contact Date *
              </Label>
              <Input
                id="lastContactDate"
                type="date"
                value={formData.lastContactDate}
                onChange={(e) => setFormData({ ...formData, lastContactDate: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="text-[#1a1d29] font-medium">
              Assigned To *
            </Label>
            <Select 
              value={formData.assignedTo} 
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              disabled={currentUser?.role === 'sales_rep'}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select sales representative" />
              </SelectTrigger>
              <SelectContent>
                {salesReps.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedTo && (
              <p className="text-red-600 text-xs">{errors.assignedTo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#1a1d29] font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
              className="bg-white resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0891b2] hover:bg-[#0e7490] text-white"
            >
              {isEditing ? 'Update Entry' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
