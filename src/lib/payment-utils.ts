import type { Payment } from '@/types/payments';

export function filterAndSortPayments(
  payments: Payment[],
  search?: string,
  status?: string
): Payment[] {
  let filtered = [...payments];

  // Search filter
  if (search && search.trim().length > 0) {
    filtered = filtered.filter((p) =>
      p.merchantOrderId.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // Status filter
  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }

  // Sort by creation date (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
}
