'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getAllPayments,
  createPayment,
  updatePayment,
  getPaymentByPublicId,
} from '@/lib/storage';
import { generatePaymentId, generatePublicId } from '@/lib/id';
import type { Payment } from '@/types/payments';

export async function createNewPayment(formData: FormData) {
  const amount = parseInt(formData.get('amount') as string);
  const merchantOrderId = formData.get('merchantOrderId') as string;

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

  const createdPayment = createPayment(payment);

  revalidatePath('/');
  redirect(`/payments/${createdPayment.id}`);
}

export async function markPaymentPaid(publicId: string) {
  const payment = getPaymentByPublicId(publicId);
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'pending') {
    throw new Error('Payment is not in pending status');
  }

  updatePayment(payment.id, { status: 'paid' });

  revalidatePath('/');
  revalidatePath(`/payments/${payment.id}`);
  redirect(`/payments/${payment.id}`);
}

export async function markPaymentCanceled(publicId: string) {
  const payment = getPaymentByPublicId(publicId);
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'pending') {
    throw new Error('Payment is not in pending status');
  }

  updatePayment(payment.id, { status: 'canceled' });

  revalidatePath('/');
  revalidatePath(`/payments/${payment.id}`);
  redirect(`/payments/${payment.id}`);
}

export async function fetchAllPayments(): Promise<Payment[]> {
  return getAllPayments();
}
