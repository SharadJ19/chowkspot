import { useSearchParams } from 'react-router';

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    availableOnly: searchParams.get('availableOnly') === 'true',
    name: searchParams.get('name') || '',
    minExperience: searchParams.get('minExp')
      ? parseInt(searchParams.get('minExp')!, 10)
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice')!)
      : undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const setFilter = (
    key: string,
    value: string | number | boolean | undefined,
    resetPage = true,
  ) => {
    const updated = new URLSearchParams(searchParams);

    if (value !== undefined && value !== '' && value !== false && value !== 0) {
      updated.set(key, String(value));
    } else {
      updated.delete(key);
    }

    if (resetPage) {
      updated.set('page', '1');
    }

    setSearchParams(updated);
  };

  const setPage = (newPage: number) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', String(newPage));
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return {
    filters,
    setFilter,
    setPage,
    resetFilters,
  };
}
