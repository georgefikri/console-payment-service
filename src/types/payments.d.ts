import { Currency } from './enums';

export { Currency };

export type PaymentStatus = 'pending' | 'paid' | 'canceled';

export type Payment = {
  id: string; // pay_xxx (system id)
  publicId: string; // token used in /pay/[publicId]
  amount: number; // cents, e.g. 1000 = 10.00
  currency: Currency;
  status: PaymentStatus;
  merchantOrderId: string; // Your order ID from your system
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
