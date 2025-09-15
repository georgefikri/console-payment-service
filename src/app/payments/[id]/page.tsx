'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPaymentById } from '@/lib/storage';
import CopyButton from '@/components/CopyButton';
import type { Payment } from '@/types/payments';

export default function PaymentDetails() {
  const params = useParams();
  const id = params.id as string;
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foundPayment = getPaymentById(id);
      setPayment(foundPayment);
    } catch (error) {
      console.error('Failed to load payment:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">The payment you're looking for doesn't exist.</p>
          <Link 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Payment Console
          </Link>
        </div>
      </div>
    );
  }

  const paymentLink = `${
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }/pay/${payment.publicId}`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Payment Console
        </Link>
        <h1 className="text-3xl font-bold mb-4">Payment Details</h1>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 ">Payment Information</h3>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium ">System ID:</span>
                <p className="font-mono text-sm ">{payment.id}</p>
              </div>

              <div>
                <span className="text-sm font-medium ">Your Order ID:</span>
                <p>{payment.merchantOrderId}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Amount:</span>
                <p className="text-lg font-semibold">
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
                        : payment.status === 'canceled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Timestamps</h3>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Created At:</span>
                <p>{new Date(payment.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                <p>{new Date(payment.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {payment.status === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Payment Link</h3>
          <p className="text-sm text-gray-600 mb-4">
            Share this link with your customer to complete the payment:
          </p>

          <div className="flex items-center gap-4 p-3 bg-white border border-gray-300 rounded">
            <code className="flex-1 font-mono text-sm break-all text-black">
              {paymentLink}
            </code>
            <CopyButton text={paymentLink} />
          </div>

          <div className="mt-4">
            <Link
              href={`/pay/${payment.publicId}`}
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              Open payment link in new tab →
            </Link>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Log</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium">Payment Created</p>
              <p className="text-xs text-gray-600">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {payment.status !== 'pending' && (
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  payment.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <div>
                <p className="text-sm font-medium">
                  Payment {payment.status === 'paid' ? 'Completed' : 'Canceled'}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(payment.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
