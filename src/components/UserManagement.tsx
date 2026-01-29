'use client';

import { useState } from 'react';
import { User, UserRole } from '@/types';
import { getUsers, createUser, updateUser, isUsernameUnique } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, UserX, UserCheck } from 'lucide-react';
import { formatDate } from '@/lib/format';

interface UserManagementProps {
  onUpdate: () => void;
}

export default function UserManagement({ onUpdate }: UserManagementProps) {
  const [users, setUsers] = useState(getUsers());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'sales_rep' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNew = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', name: '', role: 'sales_rep' });
    setErrors({});
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!isUsernameUnique(formData.username, editingUser?.id)) {
      newErrors.username = 'Username already exists';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      createUser({
        ...formData,
        isActive: true,
      });
    }

    setUsers(getUsers());
    setModalOpen(false);
    onUpdate();
  };

  const handleToggleActive = (user: User) => {
    updateUser(user.id, { isActive: !user.isActive });
    setUsers(getUsers());
    onUpdate();
  };

  const salesReps = users.filter((user) => user.role === 'sales_rep');

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1a1d29] mb-1">
            User Management
          </h1>
          <p className="text-slate-500">
            Manage sales representative accounts
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-[#0891b2] hover:bg-[#0e7490] text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          New User
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#1a1d29] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {salesReps.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-100/60 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-[#1a1d29]">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1a1d29]">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-200">
                      Sales Rep
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        user.isActive
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="hover:bg-slate-100 text-slate-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                      className="hover:bg-slate-100"
                    >
                      {user.isActive ? (
                        <UserX className="w-4 h-4 text-red-600" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-green-600" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
        <DialogContent className="max-w-md bg-[#fafaf9] border border-slate-200 fade-in-scale">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1a1d29]">
              {editingUser ? 'Edit User' : 'New User'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-red-600 text-xs">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-600 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-600 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#0891b2] hover:bg-[#0e7490] text-white"
                onClick={handleSave}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
