import type { Payment } from '@/types/payments';

export function filterAndSortPayments(
  payments: Payment[],
  search?: string,
  status?: string
): Payment[] {
  let filtered = [...payments];

  if (search && search.trim().length > 0) {
    filtered = filtered.filter((p) =>
      p.merchantOrderId.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }

  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
}
