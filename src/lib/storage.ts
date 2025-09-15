import { Payment } from '@/types/payments';

const STORAGE_KEY = 'payments_mock_data';

function loadPayments(): Payment[] {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading payments from localStorage:', error);
    return [];
  }
}

function savePayments(payments: Payment[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments, null, 2));
  } catch (error) {
    console.error('Error saving payments to localStorage:', error);
  }
}

export function getAllPayments(): Payment[] {
  return loadPayments();
}

export function getPaymentById(id: string): Payment | null {
  return getAllPayments().find((p) => p.id === id) || null;
}

export function getPaymentByPublicId(publicId: string): Payment | null {
  return getAllPayments().find((p) => p.publicId === publicId) || null;
}

export function createPayment(payment: Payment): Payment {
  const payments = getAllPayments();
  payments.push(payment);
  savePayments(payments);
  return payment;
}

export function updatePayment(id: string, updates: Partial<Payment>): Payment | null {
  const payments = getAllPayments();
  const index = payments.findIndex((p) => p.id === id);
  if (index === -1) return null;

  payments[index] = {
    ...payments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  savePayments(payments);
  return payments[index];
}
