'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Entry } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users (in real app, this would be from backend)
const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rep-1',
    username: 'john',
    password: 'john123',
    role: 'sales_rep',
    name: 'John Smith',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rep-2',
    username: 'sarah',
    password: 'sarah123',
    role: 'sales_rep',
    name: 'Sarah Johnson',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Initialize mock users and entries if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    }
    
    if (!localStorage.getItem('entries')) {
      // Initialize with sample entries
      const sampleEntries: Entry[] = [
        {
          id: '1',
          quotationNumber: 'Q-2024-001',
          clientName: 'Acme Corporation',
          contactPerson: 'Michael Brown',
          email: 'michael@acme.com',
          phone: '+1 555-0101',
          salesAmount: 125000,
          status: 'negotiation',
          lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Interested in enterprise package',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          quotationNumber: 'Q-2024-002',
          clientName: 'TechStart Inc',
          contactPerson: 'Lisa Anderson',
          email: 'lisa@techstart.com',
          phone: '+1 555-0102',
          salesAmount: 85000,
          status: 'proposal_sent',
          lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-2',
          notes: 'Following up next week',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          quotationNumber: 'Q-2024-003',
          clientName: 'Global Logistics',
          contactPerson: 'Robert Chen',
          email: 'robert@globallog.com',
          phone: '+1 555-0103',
          salesAmount: 250000,
          status: 'closed_won',
          lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Deal closed successfully',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          quotationNumber: 'Q-2024-004',
          clientName: 'Retail Solutions',
          contactPerson: 'Emily Davis',
          email: 'emily@retail.com',
          phone: '+1 555-0104',
          salesAmount: 45000,
          status: 'new',
          lastContactDate: new Date().toISOString(),
          assignedTo: 'rep-2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          quotationNumber: 'Q-2024-005',
          clientName: 'Manufacturing Co',
          contactPerson: 'David Wilson',
          email: 'david@mfg.com',
          phone: '+1 555-0105',
          salesAmount: 180000,
          status: 'closed_lost',
          lastContactDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Went with competitor',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      localStorage.setItem('entries', JSON.stringify(sampleEntries));
    }
    
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(
      (u) => u.username === username && u.password === password && u.isActive
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
