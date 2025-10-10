import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Application, SortOption } from '../types';
import { ResultCard } from './ResultCard';
import { getDaysUntil } from '../utils/dateHelpers';

interface ResultsListProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  highlightKeywords: string[];
}

export function ResultsList({ applications, onSelectApplication, highlightKeywords }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('dueDateAsc');

  const sortedApplications = useMemo(() => {
    const sorted = [...applications];

    switch (sortBy) {
      case 'dueDateAsc':
        return sorted.sort((a, b) => getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate));
      case 'dueDateDesc':
        return sorted.sort((a, b) => getDaysUntil(b.dueDate) - getDaysUntil(a.dueDate));
      case 'percentComplete':
        return sorted.sort((a, b) => b.percentComplete - a.percentComplete);
      case 'fitScore':
        return sorted.sort((a, b) => b.fitScore - a.fitScore);
      default:
        return sorted;
    }
  }, [applications, sortBy]);

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-slate-100 rounded-full p-6 mb-4">
          <Search className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No opportunities match your criteria</h3>
        <p className="text-slate-600 text-center max-w-md">
          Try adjusting your filters or resetting to see all opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {applications.length} {applications.length === 1 ? 'Opportunity' : 'Opportunities'}
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort opportunities"
          >
            <option value="dueDateAsc">Due Date (Soonest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
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
