import { Currency } from './enums';

export { Currency };

export type PaymentStatus = 'pending' | 'paid' | 'canceled';

export type Payment = {
  id: string;
  publicId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  merchantOrderId: string;
  createdAt: string;
  updatedAt: string;
};
