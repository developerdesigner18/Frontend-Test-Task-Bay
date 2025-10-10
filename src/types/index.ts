export interface Application {
  id: string;
  title: string;
  agency: string;
  naics: string;
  setAside: string[];
  vehicle: string;
  dueDate: string;
  status: 'Draft' | 'Ready' | 'Submitted' | 'Awarded' | 'Lost';
  percentComplete: number;
  fitScore: number;
  ceiling: number;
  keywords: string[];
}

export interface Filters {
  naics: string;
  setAside: string[];
  vehicle: string;
  agency: string[];
  periodQuick: string;
  periodStart: string;
  periodEnd: string;
  ceilingMin: string;
  ceilingMax: string;
  keywords: string[];
}

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'percentComplete' | 'fitScore';

export interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  savePreset: () => void;
  loadPreset: () => void;
  hasPreset: boolean;
}
