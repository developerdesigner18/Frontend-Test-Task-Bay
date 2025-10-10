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
  periodType: 'quick' | 'custom';
  quickPeriod: number | null;
  startDate: string;
  endDate: string;
  minCeiling: string;
  maxCeiling: string;
  keywords: string[];
}

export interface FilterPreset {
  name: string;
  filters: Filters;
  savedAt: string;
}

export type SortOption = 'dueDate-asc' | 'dueDate-desc' | 'percentComplete' | 'fitScore';

export interface StatusCount {
  Draft: number;
  Ready: number;
  Submitted: number;
  Awarded: number;
  Lost: number;
}
