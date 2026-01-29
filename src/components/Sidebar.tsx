'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: 'dashboard' | 'entries' | 'users';
  onNavigate: (page: 'dashboard' | 'entries' | 'users') => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entries' as const, label: 'Entries', icon: FileText },
    ...(currentUser?.role === 'admin'
      ? [{ id: 'users' as const, label: 'User Management', icon: Users }]
      : []),
  ];

  return (
    <aside className="w-64 bg-white text-slate-900 flex flex-col border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Sales System</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              currentUser?.role === 'admin'
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            )}
          >
            {currentUser?.role === 'admin' ? 'Admin' : 'Sales Rep'}
          </div>
        </div>

        <p className="text-sm text-slate-500 mt-2">{currentUser?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm',
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
