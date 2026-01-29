'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getQuotations, calculateMetrics } from '@/lib/data-service';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import QuotationsTable from './QuotationsTable';
import UserManagement from './UserManagement';
import { Toaster } from './ui/toaster';

export default function MainApp() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'quotations' | 'users'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const quotations = getQuotations();
  const metrics = calculateMetrics(quotations);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleMetricClick = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage('quotations');
  };

  const handleNavigate = (page: 'dashboard' | 'quotations' | 'users') => {
    setCurrentPage(page);
    if (page !== 'quotations') {
      setStatusFilter(undefined);
    }
  };

  return (
    <div className="flex h-screen bg-[#1a1d29] overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1 overflow-y-auto relative">
        {currentPage === 'dashboard' && (
          <Dashboard metrics={metrics} onMetricClick={handleMetricClick} />
        )}

        {currentPage === 'quotations' && (
          <QuotationsTable
            key={refreshKey}
            quotations={quotations}
            onUpdate={handleRefresh}
            statusFilter={statusFilter}
          />
        )}

        {currentPage === 'users' && currentUser?.role === 'admin' && (
          <UserManagement onUpdate={handleRefresh} />
        )}

        <Toaster />
      </main>
    </div>
  );
}
