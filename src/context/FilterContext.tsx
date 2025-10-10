import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Filters, FilterPreset } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  applyFilters: () => Promise<void>;
  resetFilters: () => void;
  savePreset: () => void;
  loadPreset: () => void;
  hasPreset: boolean;
  isLoading: boolean;
}

const defaultFilters: Filters = {
  naics: '',
  setAside: [],
  vehicle: '',
  agency: [],
  periodType: 'quick',
  quickPeriod: null,
  startDate: '',
  endDate: '',
  minCeiling: '',
  maxCeiling: '',
  keywords: [],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [storedFilters, setStoredFilters] = useLocalStorage<Filters>('gsa_filters', defaultFilters);
  const [preset, setPreset] = useLocalStorage<FilterPreset | null>('gsa_preset', null);
  const [filters, setFilters] = useState<Filters>(storedFilters);
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    setStoredFilters(filters);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
  }, [filters, setStoredFilters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setStoredFilters(defaultFilters);
  }, [setStoredFilters]);

  const savePreset = useCallback(() => {
    const newPreset: FilterPreset = {
      name: 'Saved Preset',
      filters: filters,
      savedAt: new Date().toISOString(),
    };
    setPreset(newPreset);
  }, [filters, setPreset]);

  const loadPreset = useCallback(() => {
    if (preset) {
      setFilters(preset.filters);
      setStoredFilters(preset.filters);
    }
  }, [preset, setStoredFilters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        applyFilters,
        resetFilters,
        savePreset,
        loadPreset,
        hasPreset: preset !== null,
        isLoading,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
