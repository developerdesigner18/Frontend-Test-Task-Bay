import { useState, KeyboardEvent } from 'react';
import { Filter, RotateCcw, Save, FolderOpen, X } from 'lucide-react';
import { Filters } from '../types';
import { MultiSelect } from './MultiSelect';
import { Combobox } from './Combobox';

interface ParameterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  hasPreset: boolean;
  isLoading: boolean;
}

const NAICS_OPTIONS = ['541511', '541512', '541513', '541519', '517311'];
const SET_ASIDE_OPTIONS = ['8(a)', 'WOSB', 'SB', 'SDVOSB', 'VOSB', 'HUBZone'];
const VEHICLE_OPTIONS = ['GSA MAS', 'Alliant 2', 'CIO-SP3'];
const AGENCY_OPTIONS = ['GSA', 'USDA', 'DOE', 'HHS', 'VA', 'DHS', 'DOC', 'DOD', 'NOAA', 'SSA'];

export function ParameterPanel({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  onSavePreset,
  onLoadPreset,
  hasPreset,
  isLoading,
}: ParameterPanelProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [ceilingError, setCeilingError] = useState('');

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!filters.keywords.includes(keywordInput.trim())) {
        onFiltersChange({
          ...filters,
          keywords: [...filters.keywords, keywordInput.trim()],
        });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onFiltersChange({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== keyword),
    });
  };

  const handleCeilingChange = (field: 'ceilingMin' | 'ceilingMax', value: string) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);

    const min = parseFloat(newFilters.ceilingMin || '0');
    const max = parseFloat(newFilters.ceilingMax || '0');

    if (newFilters.ceilingMin && newFilters.ceilingMax && min > max) {
      setCeilingError('Min cannot be greater than max');
    } else {
      setCeilingError('');
    }
  };

  const setPeriodQuick = (days: string) => {
    onFiltersChange({
      ...filters,
      periodQuick: days,
      periodStart: '',
      periodEnd: '',
    });
  };

  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
          <Filter className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">Search Filters</h2>
        </div>

        <div className="space-y-2">
          <label htmlFor="naics" className="block text-sm font-medium text-slate-700">
            NAICS Code
          </label>
          <select
            id="naics"
            value={filters.naics}
            onChange={(e) => onFiltersChange({ ...filters, naics: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="NAICS Code"
          >
            <option value="">All NAICS</option>
            {NAICS_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          label="Set-Aside"
          options={SET_ASIDE_OPTIONS}
          value={filters.setAside}
          onChange={(value) => onFiltersChange({ ...filters, setAside: value })}
          placeholder="Select set-asides"
        />

        <div className="space-y-2">
          <label htmlFor="vehicle" className="block text-sm font-medium text-slate-700">
            Vehicle
          </label>
          <select
            id="vehicle"
            value={filters.vehicle}
            onChange={(e) => onFiltersChange({ ...filters, vehicle: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Vehicle"
          >
            <option value="">All Vehicles</option>
            {VEHICLE_OPTIONS.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </div>

        <Combobox
          label="Agency"
          options={AGENCY_OPTIONS}
          value={filters.agency}
          onChange={(value) => onFiltersChange({ ...filters, agency: value })}
          placeholder="Search agencies..."
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Period</label>
          <div className="flex gap-2">
            {['30', '60', '90'].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setPeriodQuick(days)}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.periodQuick === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-pressed={filters.periodQuick === days}
              >
                {days} days
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 text-center py-1">or</div>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.periodStart}
              onChange={(e) =>
                onFiltersChange({ ...filters, periodStart: e.target.value, periodQuick: '' })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Start date"
            />
            <input
              type="date"
              value={filters.periodEnd}
              onChange={(e) =>
                onFiltersChange({ ...filters, periodEnd: e.target.value, periodQuick: '' })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="End date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Ceiling</label>
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                value={filters.ceilingMin}
                onChange={(e) => handleCeilingChange('ceilingMin', e.target.value)}
                placeholder="Min amount"
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label="Minimum ceiling amount"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                value={filters.ceilingMax}
                onChange={(e) => handleCeilingChange('ceilingMax', e.target.value)}
                placeholder="Max amount"
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label="Maximum ceiling amount"
              />
            </div>
            {ceilingError && <p className="text-xs text-red-600">{ceilingError}</p>}
            <p className="text-xs text-slate-500">Enter amount in USD</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="keywords" className="block text-sm font-medium text-slate-700">
            Keywords
          </label>
          <input
            id="keywords"
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="Type and press Enter"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Keywords"
          />
          {filters.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove keyword ${keyword}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200">
          <button
            onClick={onApply}
            disabled={isLoading || !!ceilingError}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            aria-label="Apply filters"
          >
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </button>

          <button
            onClick={onReset}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>

          <button
            onClick={onSavePreset}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            aria-label="Save preset"
          >
            <Save className="w-4 h-4" />
            Save Preset
          </button>

          {hasPreset && (
            <button
              onClick={onLoadPreset}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              aria-label="Load preset"
            >
              <FolderOpen className="w-4 h-4" />
              Load Preset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
