'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateURL } from '@/lib/updateURL';

type PaymentSearchProps = {
  onFiltersChange: (search: string, status: string) => void;
};

export default function PaymentSearch({ onFiltersChange }: PaymentSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange(value, status);
    updateURL(value, status, router);
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFiltersChange(search, value);
    updateURL(search, value, router);
  };

  // Initialize filters on mount
  useEffect(() => {
    onFiltersChange(search, status);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
        </select>
        {(search || status !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setStatus('all');
              onFiltersChange('', 'all');
              router.replace('/', { scroll: false });
            }}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
