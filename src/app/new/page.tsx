'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePaymentActions } from "@/hooks/usePaymentActions";

export default function NewPayment() {
  const { createNewPayment, loading, error, clearError } = usePaymentActions();
  const [amount, setAmount] = useState('');
  const [merchantOrderId, setMerchantOrderId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const amountNum = parseInt(amount);
      await createNewPayment(amountNum, merchantOrderId);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create payment:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Payment Console
        </Link>
        <h1 className="text-3xl font-bold mb-4">Create New Payment</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (in piasters)*
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="1"
            placeholder="1000 (for 10.00 EGP)"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter amount in piasters (e.g., 1000 = 10.00 EGP)
          </p>
        </div>

        <div>
          <label htmlFor="merchantOrderId" className="block text-sm font-medium text-gray-700 mb-2">
            Your Order ID*
          </label>
          <input
            type="text"
            id="merchantOrderId"
            value={merchantOrderId}
            onChange={(e) => setMerchantOrderId(e.target.value)}
            required
            placeholder="e.g., ORDER-2024-001"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            This is your internal order identifier
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Payment'}
          </button>
          <Link
            href="/"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}