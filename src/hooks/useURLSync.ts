import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../types';

export function useURLSync(filters: Filters, setFilters: (filters: Filters) => void) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const naics = searchParams.get('naics');
    const setAside = searchParams.get('setAside')?.split(',').filter(Boolean);
    const vehicle = searchParams.get('vehicle');
    const agency = searchParams.get('agency')?.split(',').filter(Boolean);
    const periodType = searchParams.get('periodType') as 'quick' | 'custom';
    const quickPeriod = searchParams.get('quickPeriod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minCeiling = searchParams.get('minCeiling');
    const maxCeiling = searchParams.get('maxCeiling');
    const keywords = searchParams.get('keywords')?.split(',').filter(Boolean);

    if (naics || setAside || vehicle || agency || periodType || quickPeriod || startDate || endDate || minCeiling || maxCeiling || keywords) {
      setFilters({
        naics: naics || '',
        setAside: setAside || [],
        vehicle: vehicle || '',
        agency: agency || [],
        periodType: periodType || 'quick',
        quickPeriod: quickPeriod ? parseInt(quickPeriod) : null,
        startDate: startDate || '',
        endDate: endDate || '',
        minCeiling: minCeiling || '',
        maxCeiling: maxCeiling || '',
        keywords: keywords || [],
      });
    }
  }, []);

  const updateURL = (newFilters: Filters) => {
    const params = new URLSearchParams();

    if (newFilters.naics) params.set('naics', newFilters.naics);
    if (newFilters.setAside.length > 0) params.set('setAside', newFilters.setAside.join(','));
    if (newFilters.vehicle) params.set('vehicle', newFilters.vehicle);
    if (newFilters.agency.length > 0) params.set('agency', newFilters.agency.join(','));
    if (newFilters.periodType) params.set('periodType', newFilters.periodType);
    if (newFilters.quickPeriod) params.set('quickPeriod', newFilters.quickPeriod.toString());
    if (newFilters.startDate) params.set('startDate', newFilters.startDate);
    if (newFilters.endDate) params.set('endDate', newFilters.endDate);
    if (newFilters.minCeiling) params.set('minCeiling', newFilters.minCeiling);
    if (newFilters.maxCeiling) params.set('maxCeiling', newFilters.maxCeiling);
    if (newFilters.keywords.length > 0) params.set('keywords', newFilters.keywords.join(','));

    setSearchParams(params);
  };

  return { updateURL };
}
