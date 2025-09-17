'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPayments } from '@/lib/storage';
import PaymentList from '@/components/PaymentList';
import type { Payment } from '@/types/payments';

export default function Home() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedPayments = getAllPayments();
      setPayments(loadedPayments);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPayments = () => {
    try {
      const loadedPayments = getAllPayments();
      setPayments(loadedPayments);
    } catch (error) {
      console.error('Failed to refresh payments:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-neutral-100 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-neutral-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment Console</h1>
          <Link
            href="/new"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Create New Payment
          </Link>
        </div>

        <PaymentList initialPayments={payments} onUpdate={refreshPayments} />
      </div>
    </div>
  );
}
