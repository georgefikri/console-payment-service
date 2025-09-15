import { useRouter } from 'next/navigation';

export const updateURL = (
  newSearch: string, 
  newStatus: string, 
  router: ReturnType<typeof useRouter>
) => {
  const params = new URLSearchParams();
  if (newSearch.trim()) {
    params.set('search', newSearch.trim());
  }
  if (newStatus !== 'all') {
    params.set('status', newStatus);
  }

  const newURL = params.toString() ? `?${params.toString()}` : '/';
  router.replace(newURL, { scroll: false });
};
