import { useEffect, useCallback } from 'react';
import { Filters } from '../types';

export function useURLSync(filters: Filters, setFilters: (filters: Filters) => void) {
  const parseFiltersFromURL = useCallback((): Filters => {
    const params = new URLSearchParams(window.location.search);

    return {
      naics: params.get('naics') || '',
      setAside: params.get('setAside')?.split(',').filter(Boolean) || [],
      vehicle: params.get('vehicle') || '',
      agency: params.get('agency')?.split(',').filter(Boolean) || [],
      periodQuick: params.get('periodQuick') || '',
      periodStart: params.get('periodStart') || '',
      periodEnd: params.get('periodEnd') || '',
      ceilingMin: params.get('ceilingMin') || '',
      ceilingMax: params.get('ceilingMax') || '',
      keywords: params.get('keywords')?.split(',').filter(Boolean) || [],
    };
  }, []);

  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    const hasFilters = Object.values(urlFilters).some(val =>
      Array.isArray(val) ? val.length > 0 : val !== ''
    );

    if (hasFilters) {
      setFilters(urlFilters);
    }
  }, []);

  const updateURL = useCallback((newFilters: Filters) => {
    const params = new URLSearchParams();

    if (newFilters.naics) params.set('naics', newFilters.naics);
    if (newFilters.setAside.length) params.set('setAside', newFilters.setAside.join(','));
    if (newFilters.vehicle) params.set('vehicle', newFilters.vehicle);
    if (newFilters.agency.length) params.set('agency', newFilters.agency.join(','));
    if (newFilters.periodQuick) params.set('periodQuick', newFilters.periodQuick);
    if (newFilters.periodStart) params.set('periodStart', newFilters.periodStart);
    if (newFilters.periodEnd) params.set('periodEnd', newFilters.periodEnd);
    if (newFilters.ceilingMin) params.set('ceilingMin', newFilters.ceilingMin);
    if (newFilters.ceilingMax) params.set('ceilingMax', newFilters.ceilingMax);
    if (newFilters.keywords.length) params.set('keywords', newFilters.keywords.join(','));

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }, []);

  return { updateURL };
}
