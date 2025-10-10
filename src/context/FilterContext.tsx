import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Filters, FilterContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const initialFilters: Filters = {
  naics: '',
  setAside: [],
  vehicle: '',
  agency: [],
  periodQuick: '',
  periodStart: '',
  periodEnd: '',
  ceilingMin: '',
  ceilingMax: '',
  keywords: [],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useLocalStorage<Filters>('gsa_filters', initialFilters);
  const [preset, setPreset] = useLocalStorage<Filters | null>('gsa_preset', null);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);

  const setFilters = useCallback((newFilters: Filters) => {
    setFiltersState(newFilters);
  }, [setFiltersState]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [setFilters]);

  const savePreset = useCallback(() => {
    setPreset(filters);
  }, [filters, setPreset]);

  const loadPreset = useCallback(() => {
    if (preset) {
      setFilters(preset);
      setAppliedFilters(preset);
    }
  }, [preset, setFilters]);

  return (
    <FilterContext.Provider
      value={{
        filters: appliedFilters,
        setFilters,
        applyFilters,
        resetFilters,
        savePreset,
        loadPreset,
        hasPreset: preset !== null,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
