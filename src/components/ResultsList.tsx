import { useState, useMemo } from 'react';
import { Application, SortOption } from '../types';
import { ResultCard } from './ResultCard';
import { SearchX } from 'lucide-react';
import { getDaysUntil } from '../utils/dateHelpers';

interface ResultsListProps {
  applications: Application[];
  onSelectApplication: (application: Application) => void;
  highlightKeywords: string[];
}

export function ResultsList({ applications, onSelectApplication, highlightKeywords }: ResultsListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('dueDate-asc');

  const sortedApplications = useMemo(() => {
    const sorted = [...applications];

    switch (sortOption) {
      case 'dueDate-asc':
        sorted.sort((a, b) => getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate));
        break;
      case 'dueDate-desc':
        sorted.sort((a, b) => getDaysUntil(b.dueDate) - getDaysUntil(a.dueDate));
        break;
      case 'percentComplete':
        sorted.sort((a, b) => b.percentComplete - a.percentComplete);
        break;
      case 'fitScore':
        sorted.sort((a, b) => b.fitScore - a.fitScore);
        break;
    }

    return sorted;
  }, [applications, sortOption]);

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <SearchX className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No opportunities match your criteria</h3>
        <p className="text-slate-600 text-center max-w-md">
          Try adjusting your filters or resetting to see all opportunities
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {applications.length} {applications.length === 1 ? 'Opportunity' : 'Opportunities'} Found
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort opportunities"
          >
            <option value="dueDate-asc">Due Date (Earliest First)</option>
            <option value="dueDate-desc">Due Date (Latest First)</option>
            <option value="percentComplete">% Complete</option>
            <option value="fitScore">Fit Score</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedApplications.map((app) => (
          <ResultCard
            key={app.id}
            application={app}
            onClick={() => onSelectApplication(app)}
            highlightKeywords={highlightKeywords}
          />
        ))}
      </div>
    </div>
  );
}
