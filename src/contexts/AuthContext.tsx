'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Quotation } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users (in real app, this would come from backend)
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
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    }

    if (!localStorage.getItem('quotations')) {
      const sampleQuotations: Quotation[] = [
        {
          id: '1',
          quotationNumber: 'DVO.SAM.EQTN.4821',
          clientName: 'Acme Corporation',
          contactPerson: 'Michael Brown',
          email: 'michael@acme.com',
          phone: '9171234567',
          salesAmount: 125000,
          status: 'negotiation',
          lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Interested in enterprise package',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '2',
          quotationNumber: 'DVO.SAM.EQTN.7394',
          clientName: 'TechStart Inc',
          contactPerson: 'Lisa Anderson',
          email: 'lisa@techstart.com',
          phone: '9182345678',
          salesAmount: 85000,
          status: 'proposal_sent',
          lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-2',
          notes: 'Following up next week',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '3',
          quotationNumber: 'DVO.SAM.EQTN.1568',
          clientName: 'Global Logistics',
          contactPerson: 'Robert Chen',
          email: 'robert@globallog.com',
          phone: '9193456789',
          salesAmount: 250000,
          status: 'closed_won',
          lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Deal closed successfully',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '4',
          quotationNumber: 'DVO.SAM.EQTN.9043',
          clientName: 'Retail Solutions',
          contactPerson: 'Emily Davis',
          email: 'emily@retail.com',
          phone: '9204567890',
          salesAmount: 45000,
          status: 'new',
          lastContactDate: new Date().toISOString(),
          assignedTo: 'rep-2',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '5',
          quotationNumber: 'DVO.SAM.EQTN.6217',
          clientName: 'Manufacturing Co',
          contactPerson: 'David Wilson',
          email: 'david@mfg.com',
          phone: '9215678901',
          salesAmount: 180000,
          status: 'closed_lost',
          lastContactDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Went with competitor',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '6',
          quotationNumber: 'DVO.SAM.EQTN.3389',
          clientName: 'NextGen Systems',
          contactPerson: 'Sophia Martinez',
          email: 'sophia@nextgen.com',
          phone: '9226789012',
          salesAmount: 99000,
          status: 'proposal_sent',
          lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Awaiting client feedback',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '7',
          quotationNumber: 'DVO.SAM.EQTN.7742',
          clientName: 'Bright Marketing',
          contactPerson: 'James Taylor',
          email: 'james@brightmarketing.com',
          phone: '9237890123',
          salesAmount: 67000,
          status: 'negotiation',
          lastContactDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-2',
          notes: 'Requested pricing adjustment',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '8',
          quotationNumber: 'DVO.SAM.EQTN.2915',
          clientName: 'Urban Developers',
          contactPerson: 'Olivia Harris',
          email: 'olivia@urbandev.com',
          phone: '9248901234',
          salesAmount: 210000,
          status: 'new',
          lastContactDate: new Date().toISOString(),
          assignedTo: 'rep-1',
          notes: 'Initial inquiry received',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '9',
          quotationNumber: 'DVO.SAM.EQTN.8456',
          clientName: 'Green Energy Ltd',
          contactPerson: 'Daniel Kim',
          email: 'daniel@greenenergy.com',
          phone: '9259012345',
          salesAmount: 300000,
          status: 'closed_won',
          lastContactDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-1',
          notes: 'Signed multi-year contract',
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        },
        {
          id: '10',
          quotationNumber: 'DVO.SAM.EQTN.5632',
          clientName: 'Apex Financial',
          contactPerson: 'Grace Lee',
          email: 'grace@apexfinancial.com',
          phone: '9260123456',
          salesAmount: 142000,
          status: 'negotiation',
          lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'rep-2',
          notes: 'Finalizing contract terms',
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastEditedBy: 'admin-1',
        }
      ];

      localStorage.setItem('quotations', JSON.stringify(sampleQuotations));
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
