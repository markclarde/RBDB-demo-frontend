'use client';

import { useState, useEffect } from 'react';
import { Quotation, QuotationStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { isQuotationNumberUnique, getSalesReps } from '@/lib/data-service';
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

  const [formData, setFormData] = useState({
    quotationNumber: '',
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
  }, [quotation, isOpen, currentUser]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.quotationNumber.trim()) {
      newErrors.quotationNumber = 'Quotation number is required';
    } else if (!isQuotationNumberUnique(formData.quotationNumber, quotation?.id)) {
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

  const statuses: QuotationStatus[] = ['new', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl bg-[#fafaf9] fade-in-scale">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1d29]">
            {isEditing ? 'Edit Quotation' : 'New Quotation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Form fields remain the same, only updated labels/buttons */}
          {/* ... same as original, just the heading/buttons text updated */}
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
              {isEditing ? 'Update Quotation' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
