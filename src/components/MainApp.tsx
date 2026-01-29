'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEntries, getEntriesByUser, calculateMetrics } from '@/lib/data-service';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import EntriesTable from './EntriesTable';
import UserManagement from './UserManagement';

export default function MainApp() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'entries' | 'users'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const entries = currentUser?.role === 'admin'
    ? getEntries()
    : getEntriesByUser(currentUser?.id || '');

  const metrics = calculateMetrics(entries);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleMetricClick = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage('entries');
  };

  const handleNavigate = (page: 'dashboard' | 'entries' | 'users') => {
    setCurrentPage(page);
    if (page !== 'entries') {
      setStatusFilter(undefined);
    }
  };

  return (
    <div className="flex h-screen bg-[#1a1d29] overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'dashboard' && (
          <Dashboard metrics={metrics} onMetricClick={handleMetricClick} />
        )}
        
        {currentPage === 'entries' && (
          <EntriesTable
            key={refreshKey}
            entries={entries}
            onUpdate={handleRefresh}
            statusFilter={statusFilter}
          />
        )}
        
        {currentPage === 'users' && currentUser?.role === 'admin' && (
          <UserManagement onUpdate={handleRefresh} />
        )}
      </main>
    </div>
  );
}
