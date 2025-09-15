'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPayment, updatePayment, getPaymentByPublicId } from '@/lib/storage';
import { generatePaymentId, generatePublicId } from '@/lib/id';
import type { Payment } from '@/types/payments';

export function usePaymentActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewPayment = async (amount: number, merchantOrderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!merchantOrderId || merchantOrderId.trim().length === 0) {
        throw new Error('Merchant Order ID is required');
      }

      const now = new Date().toISOString();
      const payment: Payment = {
        id: generatePaymentId(),
        publicId: generatePublicId(),
        amount,
        currency: 'EGP',
        status: 'pending',
        merchantOrderId: merchantOrderId.trim(),
        createdAt: now,
        updatedAt: now,
      };

      createPayment(payment);
      router.push(`/payments/${payment.id}`);
      
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markPaymentPaid = async (publicId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const payment = getPaymentByPublicId(publicId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Payment is not in pending status');
      }

      updatePayment(payment.id, { status: 'paid' });
      router.push(`/payments/${payment.id}`);
      
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markPaymentCanceled = async (publicId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const payment = getPaymentByPublicId(publicId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Payment is not in pending status');
      }

      updatePayment(payment.id, { status: 'canceled' });
      router.push(`/payments/${payment.id}`);
      
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { 
    createNewPayment, 
    markPaymentPaid, 
    markPaymentCanceled,
    loading, 
    error, 
    clearError 
  };
}