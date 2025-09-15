'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PaymentSearch from './PaymentSearch';
import { filterAndSortPayments } from '@/lib/payment-utils';
import type { Payment } from '@/types/payments';

interface PaymentListProps {
  initialPayments: Payment[];
  onUpdate?: () => void;
}

export default function PaymentList({ initialPayments, onUpdate }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter payments based on current filters
  const filteredPayments = useMemo(() => {
    return filterAndSortPayments(initialPayments, searchTerm, statusFilter);
  }, [initialPayments, searchTerm, statusFilter]);

  const handleFiltersChange = (search: string, status: string) => {
    setSearchTerm(search);
    setStatusFilter(status);
  };

  return (
    <>
      <PaymentSearch onFiltersChange={handleFiltersChange} />
      
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No payments found.</p>
          {searchTerm && <p>Try adjusting your search criteria.</p>}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">System ID</th>
                <th className="px-4 py-3">Your Order ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, i) => (
                <tr
                  key={payment.id}
                  className={`${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 text-gray-800">
                    <Link
                      href={`/payments/${payment.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {payment.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{payment.merchantOrderId}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {(payment.amount / 100).toFixed(2)} {payment.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'canceled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString()}{' '}
                    {new Date(payment.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/payments/${payment.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}