'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPaymentByPublicId } from '@/lib/storage';
import { usePaymentActions } from '@/hooks/usePaymentActions';
import type { Payment } from '@/types/payments';

export default function PaymentLink() {
  const params = useParams();
  const publicId = params.publicId as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    markPaymentPaid,
    markPaymentCanceled,
    loading: actionLoading,
    error,
    clearError,
  } = usePaymentActions();

  useEffect(() => {
    try {
      const foundPayment = getPaymentByPublicId(publicId);
      setPayment(foundPayment);
    } catch (error) {
      console.error('Failed to load payment:', error);
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  const handleMarkPaid = async () => {
    clearError();
    try {
      await markPaymentPaid(publicId);
    } catch (err) {
      console.error('Failed to mark payment as paid:', err);
    }
  };

  const handleMarkCanceled = async () => {
    clearError();
    try {
      await markPaymentCanceled(publicId);
    } catch (err) {
      console.error('Failed to mark payment as canceled:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">
            The payment link you are looking for does not exist or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (payment.status !== 'pending') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                payment.status === 'paid' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {payment.status === 'paid' ? (
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              Payment {payment.status === 'paid' ? 'Completed' : 'Canceled'}
            </h1>

            <p className="text-gray-600 mb-6">
              This payment has already been{' '}
              {payment.status === 'paid' ? 'completed' : 'canceled'}.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="text-left space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Order ID:</span>
                <p className="font-semibold">{payment.merchantOrderId}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Amount:</span>
                <p className="font-semibold">
                  {(payment.amount / 100).toFixed(2)} {payment.currency}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Complete Your Payment</h1>
        <p className="text-gray-600">
          Please review the payment details and choose your action below.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-600">Order ID:</span>
            <p className="text-lg font-semibold">{payment.merchantOrderId}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Amount:</span>
            <p className="text-2xl font-bold text-blue-600">
              {(payment.amount / 100).toFixed(2)} {payment.currency}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <p>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                PENDING
              </span>
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Created:</span>
            <p>{new Date(payment.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleMarkPaid}
          disabled={actionLoading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {actionLoading ? 'Processing...' : '✓ Mark as Paid'}
        </button>

        <button
          onClick={handleMarkCanceled}
          disabled={actionLoading}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading ? 'Processing...' : '✕ Cancel Payment'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          This is a demo payment interface. In a real system, you would integrate with a
          payment processor.
        </p>
      </div>
    </div>
  );
}
