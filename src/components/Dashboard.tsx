'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DashboardMetrics } from '@/types';
import { formatCurrency } from '@/lib/format';
import {
  TrendingUp,
  PhilippinePeso,
  FileText,
  Target,
  TrendingDown,
  Clock,
} from 'lucide-react';

interface DashboardProps {
  metrics: DashboardMetrics;
  onMetricClick?: (filter: string) => void;
}

export default function Dashboard({ metrics, onMetricClick }: DashboardProps) {
  const { currentUser } = useAuth();

  const metricCards = [
    {
      title: 'Total Requests',
      value: metrics.totalRequests.toString(),
      icon: FileText,
      bgClass: 'bg-white border border-slate-200',
      filter: 'all',
    },
    {
      title: 'Total Sales',
      value: formatCurrency(metrics.totalSales),
      icon: PhilippinePeso,
      bgClass: 'bg-white border border-slate-200',
      filter: 'closed_won',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Target,
      bgClass: 'bg-white border border-slate-200',
      filter: 'closed',
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(metrics.averageDealSize),
      icon: TrendingUp,
      bgClass: 'bg-white border border-slate-200',
      filter: 'closed_won',
    },
  ];

  const statusCards = [
    { title: 'New', value: metrics.statusBreakdown.new, filter: 'new' },
    {
      title: 'Proposal Sent',
      value: metrics.statusBreakdown.proposal_sent,
      filter: 'proposal_sent',
    },
    {
      title: 'Negotiation',
      value: metrics.statusBreakdown.negotiation,
      filter: 'negotiation',
    },
    {
      title: 'Closed Won',
      value: metrics.statusBreakdown.closed_won,
      filter: 'closed_won',
    },
    {
      title: 'Closed Lost',
      value: metrics.statusBreakdown.closed_lost,
      filter: 'closed_lost',
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-1">
          {currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
        </h1>
        <p className="text-slate-500">
          Overview of all sales activities
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => onMetricClick?.(card.filter)}
              className={`${card.bgClass} rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-left`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Icon className="w-6 h-6 text-slate-700" />
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">
                {card.value}
              </div>
              <div className="text-slate-600 text-sm font-medium">
                {card.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Status Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statusCards.map((card) => (
            <button
              key={card.title}
              onClick={() => onMetricClick?.(card.filter)}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-left"
            >
              <div className="text-xs font-medium text-slate-500 mb-2">
                {card.title}
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {card.value}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.statusBreakdown.new +
                  metrics.statusBreakdown.proposal_sent +
                  metrics.statusBreakdown.negotiation}
              </div>
              <div className="text-sm text-slate-600">Active Pipeline</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.statusBreakdown.closed_won}
              </div>
              <div className="text-sm text-slate-600">Successful Deals</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.statusBreakdown.closed_lost}
              </div>
              <div className="text-sm text-slate-600">
                Lost Opportunities
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
