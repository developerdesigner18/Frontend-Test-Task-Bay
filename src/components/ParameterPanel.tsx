import { useState, KeyboardEvent } from 'react';
import { Filter, RotateCcw, Save, Upload, X } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { MultiSelect } from './MultiSelect';
import { Combobox } from './Combobox';

interface ParameterPanelProps {
  onApply: () => void;
  onShowToast: (message: string, type: 'success' | 'info') => void;
}

export function ParameterPanel({ onApply, onShowToast }: ParameterPanelProps) {
  const { filters, setFilters, applyFilters, resetFilters, savePreset, loadPreset, hasPreset } = useFilters();
  const [keywordInput, setKeywordInput] = useState('');

  const naicsOptions = ['541511', '541512', '541513', '541519', '517311'];
  const setAsideOptions = ['8(a)', 'WOSB', 'SB', 'SDVOSB', 'VOSB', 'HUBZone'];
  const vehicleOptions = ['GSA MAS', 'Alliant 2', 'CIO-SP3'];
  const agencyOptions = ['GSA', 'USDA', 'DOE', 'HHS', 'VA', 'DHS', 'DOC', 'DOD', 'NOAA', 'SSA'];

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!filters.keywords.includes(keywordInput.trim())) {
        setFilters({
          ...filters,
          keywords: [...filters.keywords, keywordInput.trim()],
        });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFilters({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== keyword),
    });
  };

  const handleApply = async () => {
    await applyFilters();
    onApply();
  };

  const handleReset = () => {
    resetFilters();
    onShowToast('Filters reset', 'info');
  };

  const handleSavePreset = () => {
    savePreset();
    onShowToast('Preset saved successfully!', 'success');
  };

  const handleLoadPreset = () => {
    loadPreset();
    onShowToast('Preset loaded', 'info');
  };

  const minCeilingNum = filters.minCeiling ? parseFloat(filters.minCeiling) : null;
  const maxCeilingNum = filters.maxCeiling ? parseFloat(filters.maxCeiling) : null;
  const hasError = minCeilingNum !== null && maxCeilingNum !== null && minCeilingNum > maxCeilingNum;

  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">Search Filters</h2>
        </div>
        <p className="text-sm text-slate-600">Refine your opportunity search</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="naics" className="block text-sm font-medium text-slate-700 mb-2">
            NAICS Code
          </label>
          <select
            id="naics"
            value={filters.naics}
            onChange={(e) => setFilters({ ...filters, naics: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="NAICS Code"
          >
            <option value="">All NAICS Codes</option>
            {naicsOptions.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          label="Set-Aside"
          options={setAsideOptions}
          selected={filters.setAside}
          onChange={(selected) => setFilters({ ...filters, setAside: selected })}
          placeholder="Select set-aside types"
        />

        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-slate-700 mb-2">
            Vehicle
          </label>
          <select
            id="vehicle"
            value={filters.vehicle}
            onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Vehicle"
          >
            <option value="">All Vehicles</option>
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </div>

        <Combobox
          label="Agency"
          options={agencyOptions}
          selected={filters.agency}
          onChange={(selected) => setFilters({ ...filters, agency: selected })}
          placeholder="Search agencies..."
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Period
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters({ ...filters, periodType: 'quick', quickPeriod: 30, startDate: '', endDate: '' })
                }
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  filters.periodType === 'quick' && filters.quickPeriod === 30
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                aria-pressed={filters.periodType === 'quick' && filters.quickPeriod === 30}
              >
                Next 30 days
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilters({ ...filters, periodType: 'quick', quickPeriod: 60, startDate: '', endDate: '' })
                }
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  filters.periodType === 'quick' && filters.quickPeriod === 60
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                aria-pressed={filters.periodType === 'quick' && filters.quickPeriod === 60}
              >
                Next 60 days
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilters({ ...filters, periodType: 'quick', quickPeriod: 90, startDate: '', endDate: '' })
                }
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  filters.periodType === 'quick' && filters.quickPeriod === 90
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                aria-pressed={filters.periodType === 'quick' && filters.quickPeriod === 90}
              >
                Next 90 days
              </button>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-600 mb-2">Custom Date Range</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="startDate" className="block text-xs text-slate-600 mb-1">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, periodType: 'custom', quickPeriod: null, startDate: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs text-slate-600 mb-1">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, periodType: 'custom', quickPeriod: null, endDate: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Ceiling
          </label>
          <p className="text-xs text-slate-600 mb-2">Enter amount in USD</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minCeiling" className="block text-xs text-slate-600 mb-1">
                Min
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  id="minCeiling"
                  type="number"
                  value={filters.minCeiling}
                  onChange={(e) => setFilters({ ...filters, minCeiling: e.target.value })}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Minimum ceiling"
                />
              </div>
            </div>
            <div>
              <label htmlFor="maxCeiling" className="block text-xs text-slate-600 mb-1">
                Max
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  id="maxCeiling"
                  type="number"
                  value={filters.maxCeiling}
                  onChange={(e) => setFilters({ ...filters, maxCeiling: e.target.value })}
                  placeholder="10000000"
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Maximum ceiling"
                />
              </div>
            </div>
          </div>
          {hasError && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              Minimum cannot be greater than maximum
            </p>
          )}
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 mb-2">
            Keywords
          </label>
          <input
            id="keywords"
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="Type and press Enter"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Keywords"
          />
          {filters.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                    aria-label={`Remove keyword ${keyword}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 space-y-2">
          <button
            onClick={handleApply}
            disabled={hasError}
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply Filters
          </button>

          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-white text-slate-700 font-medium rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset All
            </div>
          </button>

          <button
            onClick={handleSavePreset}
            className="w-full px-4 py-2 bg-white text-slate-700 font-medium rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Preset
            </div>
          </button>

          {hasPreset && (
            <button
              onClick={handleLoadPreset}
              className="w-full px-4 py-2 bg-white text-slate-700 font-medium rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Load Preset
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
