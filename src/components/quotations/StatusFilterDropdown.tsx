'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface StatusFilterDropdownProps {
  selectedStatuses: string[];
  appliedStatuses: string[];

  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  setAppliedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Proposal Sent', value: 'proposal_sent' },
  { label: 'Negotiation', value: 'negotiation' },
  { label: 'Closed Won', value: 'closed_won' },
  { label: 'Closed Lost', value: 'closed_lost' },
];

export default function StatusFilterDropdown({
  selectedStatuses,
  appliedStatuses,
  setSelectedStatuses,
  setAppliedStatuses,
  setCurrentPage,
}: StatusFilterDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
      >
        <span>
          {appliedStatuses.length > 0
            ? `Status (${appliedStatuses.length})`
            : 'Status'}
        </span>

        <svg
          className={`w-3 h-3 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-50 mt-2 w-52 bg-white border border-slate-200 rounded-md shadow-lg p-3 space-y-2">
          {STATUS_OPTIONS.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-2 text-xs"
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.value)}
                onChange={() => {
                  setSelectedStatuses((prev) =>
                    prev.includes(status.value)
                      ? prev.filter((s) => s !== status.value)
                      : [...prev, status.value]
                  );
                }}
              />
              {status.label}
            </label>
          ))}

          <div className="flex justify-between pt-2 border-t border-slate-200">
            <Button
              size="sm"
              className="bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => {
                setSelectedStatuses([]);
                setAppliedStatuses([]);
                setCurrentPage(1);
                setOpen(false);
              }}
            >
              Clear
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setAppliedStatuses(selectedStatuses);
                setCurrentPage(1);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
